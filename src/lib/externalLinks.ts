/**
 * Site-wide rule: links to other sites open in a new tab.
 *
 * `markExternalLinks` rewrites every `<a>` whose href points off-site and
 * that has no `target` yet: it adds `target="_blank"`, merges
 * `noopener noreferrer` into `rel` (keeping tokens like `me`), and points
 * `aria-describedby` at one hidden "(opens in new tab)" note per page, so
 * screen readers announce it. An explicit `target` (even `_self`) is left
 * alone, which is also the way to opt a link out.
 *
 * Contents of script, style, template and textarea elements are skipped:
 * inline scripts are pinned by CSP hashes, so their bytes must not change.
 */

export const NEW_TAB_NOTE_ID = "new-tab-note";

const NEW_TAB_NOTE = `<span id="${NEW_TAB_NOTE_ID}" hidden>(opens in new tab)</span>`;

/** Raw-text elements whose contents are never rewritten. */
const SKIP_BLOCK =
  /<(script|style|template|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;

/** An `<a ...>` start tag; quoted attribute values may contain `>`. */
const ANCHOR_TAG = /<a(\s(?:[^>"']|"[^"]*"|'[^']*')*)>/gi;

const ATTR = /\s+([^\s=>"'/]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>"']+))?/g;

interface Attr {
  name: string;
  value: string | undefined;
}

function parseAttrs(raw: string): Attr[] {
  const attrs: Attr[] = [];
  for (const m of raw.matchAll(ATTR)) {
    let value = m[2];
    if (value && /^["']/.test(value)) value = value.slice(1, -1);
    attrs.push({ name: m[1].toLowerCase(), value });
  }
  return attrs;
}

function serialize(attrs: Attr[]): string {
  return attrs
    .map(({ name, value }) =>
      value === undefined
        ? ` ${name}`
        : ` ${name}="${value.replace(/"/g, "&quot;")}"`,
    )
    .join("");
}

const decode = (s: string) => s.replace(/&amp;/g, "&").trim();

/** True when `href` is an absolute http(s) URL on another host. */
export function isExternalHref(
  href: string,
  siteHosts: readonly string[],
): boolean {
  const h = decode(href);
  if (!/^(https?:)?\/\//i.test(h)) return false;
  try {
    const url = new URL(h, "https://placeholder.invalid");
    if (!/^https?:$/.test(url.protocol)) return false;
    return !siteHosts.includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function rewriteAnchor(
  tag: string,
  raw: string,
  siteHosts: readonly string[],
): string {
  const attrs = parseAttrs(raw);
  const get = (n: string) => attrs.find((a) => a.name === n);
  const href = get("href")?.value;
  if (!href || get("target") || !isExternalHref(href, siteHosts)) return tag;

  attrs.push({ name: "target", value: "_blank" });

  const rel = get("rel");
  const tokens = new Set((rel?.value ?? "").split(/\s+/).filter(Boolean));
  tokens.add("noopener");
  tokens.add("noreferrer");
  if (rel) rel.value = [...tokens].join(" ");
  else attrs.push({ name: "rel", value: [...tokens].join(" ") });

  const described = get("aria-describedby");
  const ids = new Set((described?.value ?? "").split(/\s+/).filter(Boolean));
  ids.add(NEW_TAB_NOTE_ID);
  if (described) described.value = [...ids].join(" ");
  else attrs.push({ name: "aria-describedby", value: [...ids].join(" ") });

  return `<a${serialize(attrs)}>`;
}

/**
 * Applies the new-tab rule to a full HTML document. Returns the input
 * unchanged when no link needed it.
 */
export function markExternalLinks(
  html: string,
  siteHosts: readonly string[],
): string {
  let changed = false;
  const rewriteChunk = (chunk: string) =>
    chunk.replace(ANCHOR_TAG, (tag, raw: string) => {
      const out = rewriteAnchor(tag, raw, siteHosts);
      if (out !== tag) changed = true;
      return out;
    });

  let result = "";
  let last = 0;
  for (const m of html.matchAll(SKIP_BLOCK)) {
    result += rewriteChunk(html.slice(last, m.index)) + m[0];
    last = m.index + m[0].length;
  }
  result += rewriteChunk(html.slice(last));

  if (!changed || result.includes(`id="${NEW_TAB_NOTE_ID}"`)) return result;
  const bodyEnd = result.lastIndexOf("</body>");
  return bodyEnd === -1
    ? result + NEW_TAB_NOTE
    : result.slice(0, bodyEnd) + NEW_TAB_NOTE + result.slice(bodyEnd);
}
