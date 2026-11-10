/**
 * Client half of the paths system (src/data/paths.ts). Loaded on every page
 * by BaseLayout:
 *
 * - remembers which pages this tab has seen (sessionStorage, gone when the
 *   tab closes; no cookies, nothing leaves the browser except the Umami
 *   events below);
 * - on pages with a NextStep, shows the first candidate the visitor hasn't
 *   seen yet (the server renders all of them, the first one visible);
 * - logs Umami events: next-step-view (once, when the card scrolls into
 *   view), next-step-click (data-umami-event on the link), path-act (an Act
 *   page reached after a NextStep click) and newsletter-subscribed.
 *
 * Tracking never blocks: if Umami hasn't loaded or is blocked, events drop.
 */

const SEEN_KEY = "gd-paths-seen";
const ORIGIN_KEY = "gd-paths-origin";
const SUBSCRIBED_KEY = "gd-paths-subscribed";
const ACT_PAGES = new Set(["/newsletter/", "/follow/", "/contact/"]);

type UmamiData = Record<string, string>;

function normalize(path: string): string {
  const p = path.split(/[?#]/)[0] || "/";
  return p.endsWith("/") ? p : `${p}/`;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or disabled: the first candidate simply stays visible.
  }
}

function track(event: string, data: UmamiData): void {
  if (window.umami) {
    window.umami.track(event, data);
  } else if (document.readyState !== "complete") {
    window.addEventListener("load", () => window.umami?.track(event, data), {
      once: true,
    });
  }
}

const here = normalize(location.pathname);

function recordVisit(): Set<string> {
  const seen = new Set(read<string[]>(SEEN_KEY, []));
  seen.add(here);
  write(SEEN_KEY, [...seen].slice(-200));

  const origin = read<{ from: string; to: string } | null>(ORIGIN_KEY, null);
  // Once per Act page per session, so reloads don't inflate the count.
  const actKey = `gd-paths-act:${here}`;
  if (origin && ACT_PAGES.has(here) && !read<boolean>(actKey, false)) {
    write(actKey, true);
    track("path-act", { act: here, from: origin.from, to: origin.to });
  }
  return seen;
}

function initNextSteps(seen: Set<string>): void {
  const subscribed = read<boolean>(SUBSCRIBED_KEY, false);

  document.querySelectorAll<HTMLElement>("[data-next-step]").forEach((box) => {
    const items = [...box.querySelectorAll<HTMLElement>("[data-next-item]")];
    if (!items.length) return;

    const isDone = (item: HTMLElement) =>
      item.dataset.key === "newsletter"
        ? subscribed
        : seen.has(normalize(item.dataset.href ?? ""));
    // All seen: fall back to the last candidate, always an Act step.
    const pick = items.find((item) => !isDone(item)) ?? items.at(-1)!;
    const position = items.indexOf(pick) + 1;

    items.forEach((item) => (item.hidden = item !== pick));

    const link = pick.querySelector<HTMLAnchorElement>("a[data-next-link]");
    link?.setAttribute("data-umami-event-position", String(position));
    link?.addEventListener("click", () =>
      write(ORIGIN_KEY, { from: here, to: pick.dataset.key }),
    );

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          track("next-step-view", {
            from: here,
            to: pick.dataset.key ?? "",
            position: String(position),
          });
        }
      });
      io.observe(pick);
    }
  });
}

document.addEventListener("newsletter:subscribed", () => {
  write(SUBSCRIBED_KEY, true);
  const origin = read<{ from: string; to: string } | null>(ORIGIN_KEY, null);
  track("newsletter-subscribed", {
    page: here,
    from: origin?.from ?? "",
    to: origin?.to ?? "",
  });
});

initNextSteps(recordVisit());
