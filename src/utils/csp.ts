import { createHash } from "node:crypto";

/**
 * CSP source expression for an inline script, e.g. `sha256-AbC...=`.
 *
 * Astro hashes the scripts it processes into the page's CSP <meta> tag, but
 * not `is:inline` ones. Components that need an inline script (it must run
 * before paint, or before any module loads) render it with
 * `<script is:inline set:html={code} />` and register the hash of that same
 * string with `Astro.csp?.insertScriptHash(scriptHash(code))`, so the two can
 * never drift apart.
 */
export function scriptHash(code: string): `sha256-${string}` {
  return `sha256-${createHash("sha256").update(code, "utf8").digest("base64")}`;
}
