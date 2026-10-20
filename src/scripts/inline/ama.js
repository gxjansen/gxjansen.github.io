// Rendered inline by src/pages/ama.astro (hash registered in the page's CSP):
// inline avoids the dev-server module/MIME quirk that blocks Astro-hoisted
// scripts under the Netlify middleware. No TS types here, just JS.

// ── ALTCHA widget (shared loader) ─────────────────────────────────────
(function loadAltchaScript() {
  if (document.querySelector("script[data-altcha]")) return;
  const s = document.createElement("script");
  // Pinned: the server uses the altcha-lib/v1 challenge format, which widget
  // v2 solves. Widget v3 needs the v2 format, so upgrade both together.
  s.src = "https://cdn.jsdelivr.net/npm/altcha@2.3.0/dist/altcha.min.js";
  s.type = "module";
  s.async = true;
  s.dataset.altcha = "true";
  document.head.appendChild(s);
})();

// ── Char counter ──────────────────────────────────────────────────────
const textarea = document.getElementById("ama-question");
const counter = document.querySelector('[data-counter="current"]');
if (textarea) {
  textarea.addEventListener("input", () => {
    if (counter) counter.textContent = String(textarea.value.length);
  });
}

// ── Form submit ───────────────────────────────────────────────────────
const form = document.getElementById("ama-form");
const status = document.getElementById("ama-status");
const formSection = document.getElementById("ama-form-section");
const successSection = document.getElementById("ama-success");
const submitBtn = form && form.querySelector('button[type="submit"]');

function setError(msg) {
  if (!status) return;
  status.textContent = msg;
  status.className = "ama-status text-sm text-red-600 dark:text-red-400";
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!status || !textarea) return;
    status.textContent = "";

    const q = textarea.value.trim();
    if (q.length < 10) {
      setError("A bit too short. Give me a few more words.");
      return;
    }

    const altchaInput = form.querySelector('input[name="altcha"]');
    const altchaSolution = altchaInput && altchaInput.value;
    if (!altchaSolution) {
      setError("Please wait for verification to complete, then try again.");
      return;
    }

    if (submitBtn) submitBtn.setAttribute("disabled", "true");
    status.textContent = "Sending…";
    status.className = "ama-status text-sm text-base-600 dark:text-base-400";

    try {
      // Trailing slash matters: netlify.toml redirects extension-less
      // paths to /...path/, which a browser follows as GET and 404s our
      // POST handler. recent.json is exempted because it has an extension.
      const res = await fetch("/api/ama/submit/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q, altcha: altchaSolution }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Try again.");
        if (submitBtn) submitBtn.removeAttribute("disabled");
        return;
      }
      if (formSection) formSection.classList.add("hidden");
      if (successSection) {
        successSection.classList.remove("hidden");
        successSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) {
      console.error("AMA submit failed:", err);
      setError("Network error. Please try again.");
      if (submitBtn) submitBtn.removeAttribute("disabled");
    }
  });
}

// ── Recent answered Q&As (proxied through /api/ama/recent.json) ───────
async function loadFeed() {
  const feed = document.getElementById("ama-feed");
  const section = document.getElementById("ama-feed-section");
  if (!feed || !section) return;

  // The section is hidden by default. Only reveal it once we
  // know there are at least 6 answered posts to populate the grid.
  // Below that threshold, the whole "Recently answered" section
  // stays out of the layout entirely (no header, no empty state).
  const MIN_POSTS = 6;

  try {
    const res = await fetch("/api/ama/recent.json", {
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error("API " + res.status);
    const data = await res.json();
    const posts = data.posts || [];

    if (posts.length < MIN_POSTS) return;

    const fmt = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const now = Date.now();
    function relativeTime(iso) {
      const diff = (new Date(iso).getTime() - now) / 1000;
      const units = [
        ["year", 60 * 60 * 24 * 365],
        ["month", 60 * 60 * 24 * 30],
        ["week", 60 * 60 * 24 * 7],
        ["day", 60 * 60 * 24],
        ["hour", 60 * 60],
        ["minute", 60],
      ];
      for (const [unit, secs] of units) {
        if (Math.abs(diff) >= secs)
          return fmt.format(Math.round(diff / secs), unit);
      }
      return fmt.format(Math.round(diff), "second");
    }

    function escapeHtml(s) {
      return s.replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[c],
      );
    }

    feed.innerHTML = posts
      .map(
        (p) => `
      <a href="${escapeHtml(p.bskyUrl)}" target="_blank" rel="noopener"
         class="ama-feed-card border-base-200 dark:border-base-800 bg-base-50/60 dark:bg-base-900/40 hover:border-primary-400 dark:hover:border-primary-600 group block overflow-hidden rounded-xl border transition">
        <img src="${escapeHtml(p.image.thumb)}"
             alt="${escapeHtml(p.image.alt || "AMA question card")}"
             loading="lazy" decoding="async"
             width="1200" height="630"
             class="aspect-[1.91/1] w-full object-cover" />
        <div class="flex flex-col gap-2 p-4">
          <p class="text-base-700 dark:text-base-300 line-clamp-3 text-sm">${escapeHtml(p.text)}</p>
          <p class="text-base-600 dark:text-base-400 text-xs">${relativeTime(p.createdAt)} · on Bluesky →</p>
        </div>
      </a>`,
      )
      .join("");

    section.classList.remove("hidden");
  } catch (err) {
    console.error("AMA feed failed:", err);
    // Leave the section hidden on error — better than showing an
    // empty grid or an error state on an otherwise-clean page.
  }
}

loadFeed();
