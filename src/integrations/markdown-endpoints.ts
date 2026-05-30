/**
 * markdown-endpoints integration
 *
 * After the Astro static build completes, this integration walks every built
 * HTML page that matches the content-page allowlist, extracts the
 * <main id="main-content"> region, converts it to Markdown via
 * node-html-markdown, and writes two sibling files:
 *
 *   dist/<route>/index.md  — served at /<route>/index.md
 *   dist/<route>.md        — served at /<route>.md  (flat alias)
 *
 * The homepage is included; its markdown lives at /index.md (no flat alias,
 * since "/.md" is meaningless). All generated markdown is additionally
 * concatenated into dist/llms-full.txt (llmstxt.org full companion).
 *
 * Excluded: /ama, /api/*, *.xml, *.json, nav-data, rss,
 * 404, /styleguide, /categories/*, /authors/*, /examples/*,
 * /internal/*, /overview, /newsletter, /privacy, /conference-terms.
 *
 * It ALSO generates dist/_headers with one exact-path rule per built page,
 * advertising machine-readable resources through an HTTP `Link:` header
 * (issue #190). Every static page gets the site-wide resources (sitemap,
 * llms.txt, the canonical Person `@id`); content pages additionally get a
 * `rel="alternate"; type="text/markdown"` link to their own .md endpoint.
 *
 * Why generate `_headers` here instead of declaring the Link in netlify.toml?
 *   1. Per-page `.md` alternates need the concrete route URL, which a
 *      netlify.toml `[[headers]]` glob cannot interpolate into a value.
 *   2. Netlify's precedence when the SAME header is set in both netlify.toml
 *      and _headers (or across overlapping rules) is undocumented. Emitting
 *      one exact-path rule per page — and keeping the Link OUT of
 *      netlify.toml — means each request matches exactly one rule, so the
 *      result is deterministic regardless of Netlify's merge semantics.
 */

import type { AstroIntegration } from "astro";
import * as fs from "node:fs";
import * as path from "node:path";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { parse as parseHtml } from "node-html-parser";

// ---------------------------------------------------------------------------
// HTTP Link header (agent resource discovery — issue #190)
// ---------------------------------------------------------------------------

/**
 * Site-wide resources advertised on every static page. Kept in sync with the
 * historical netlify.toml `/*` Link header (the Link line was moved out of
 * netlify.toml so this integration is the single source of truth — see the
 * file header for why). Each entry is one RFC 8288 link-value.
 */
const SITE_LINK_RESOURCES = [
  '</sitemap-index.xml>; rel="sitemap"',
  '</llms.txt>; rel="alternate"; type="text/plain"',
  '<https://gui.do/about/#guido>; rel="describedby"; type="application/ld+json"',
];

/**
 * Builds the comma-joined `Link` header value for a page. When the page has a
 * markdown source endpoint, its `.md` alternate is appended. Comma-joining
 * multiple link-values in one header line is valid per RFC 7230/8288 and
 * matches what netlify.toml previously emitted.
 */
function buildLinkValue(mdAlternate: string | null): string {
  const values = [...SITE_LINK_RESOURCES];
  if (mdAlternate) {
    values.push(`<${mdAlternate}>; rel="alternate"; type="text/markdown"`);
  }
  return values.join(", ");
}

/**
 * Renders a Netlify `_headers` rule block for a single exact path.
 */
function renderHeaderRule(urlPath: string, linkValue: string): string {
  return `${urlPath}\n  Link: ${linkValue}\n`;
}

// ---------------------------------------------------------------------------
// Route filtering
// ---------------------------------------------------------------------------

/**
 * Returns true when a dist-relative pathname should receive a .md output.
 * pathname is like "about/index.html" or "post/my-slug/index.html".
 */
function isContentPage(pathname: string): boolean {
  // Normalise to forward-slashes, strip leading/trailing slashes
  const p = pathname.replace(/\\/g, "/").replace(/^\//, "");

  // Must be an HTML file
  if (!p.endsWith(".html")) return false;

  // Homepage is included; its .md is served at /index.md (no flat alias).
  if (p === "index.html") return true;

  // Exact exclusions (resolved to their index.html form)
  const excluded = new Set([
    "404.html",
    "404/index.html",
    "styleguide/index.html",
    "ama/index.html",
    "overview/index.html",
    "newsletter/index.html",
    "privacy/index.html",
    "conference-terms/index.html",
  ]);
  if (excluded.has(p)) return false;

  // Prefix exclusions
  const excludedPrefixes = [
    "api/",
    "categories/",
    "authors/",
    "examples/",
    "internal/",
    "ama/q/",
    "_", // Astro build artefacts like _astro/
  ];
  for (const prefix of excludedPrefixes) {
    if (p.startsWith(prefix)) return false;
  }

  // Explicit allowlist of prefixes that SHOULD get .md
  const allowedPrefixes = [
    "about/",
    "services/",
    "communities/",
    "projects/",
    "speaker/",
    "press/",
    "contact/",
    "retainer/",
    "post/",
    "events/",
    "presentations/",
    "podcasts/",
  ];

  // Top-level static pages written as plain "name/index.html"
  for (const prefix of allowedPrefixes) {
    if (p.startsWith(prefix)) return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// HTML → Markdown conversion
// ---------------------------------------------------------------------------

const nhm = new NodeHtmlMarkdown(
  {
    keepDataImages: false,
    // Preserve code blocks; strip scripts/styles (nhm ignores them by default)
  },
  /* customTranslators */ undefined,
  /* customCodeBlockTranslators */ undefined,
);

function extractMarkdown(htmlContent: string, filePath: string): string {
  const root = parseHtml(htmlContent, { comment: false });

  // Extract <title>
  const titleEl = root.querySelector("title");
  const rawTitle = titleEl?.text?.trim() ?? "";
  // Strip site-name suffixes like " | Community Builder" or " | Guido X Jansen"
  // The site appends " | <descriptor>" to page-specific titles on some pages.
  // We keep the first segment only when the full title contains a pipe.
  const title = rawTitle.includes(" | ")
    ? rawTitle.split(" | ")[0].trim()
    : rawTitle.trim();

  // Extract <main id="main-content">
  const main = root.querySelector("#main-content");
  if (!main) {
    // Fallback: use <main> or <body>
    const fallback = root.querySelector("main") ?? root.querySelector("body");
    if (!fallback) {
      return `# ${title}\n\n<!-- Could not extract content from ${filePath} -->\n`;
    }
    const md = nhm.translate(fallback.outerHTML);
    return buildOutput(title, md);
  }

  // Remove elements that pollute the markdown output
  for (const sel of [
    "script",
    "style",
    "noscript",
    "nav",
    "footer",
    // Noise / decorative
    ".noise-background",
    "[aria-hidden]",
  ]) {
    main.querySelectorAll(sel).forEach((el) => el.remove());
  }

  const md = nhm.translate(main.outerHTML);
  return buildOutput(title, md);
}

function buildOutput(title: string, body: string): string {
  const trimmed = body.trim();

  // If the converted markdown already starts with an H1 that matches the
  // title, skip prepending to avoid duplication.
  const startsWithTitle =
    title &&
    trimmed.startsWith("#") &&
    trimmed
      .slice(2, title.length + 4)
      .toLowerCase()
      .includes(title.toLowerCase().slice(0, 20));

  const header = title && !startsWithTitle ? `# ${title}\n\n` : "";

  return header + trimmed + "\n";
}

// ---------------------------------------------------------------------------
// Integration
// ---------------------------------------------------------------------------

export function markdownEndpoints(): AstroIntegration {
  return {
    name: "markdown-endpoints",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const distDir = new URL(dir).pathname;
        logger.info("Generating markdown source endpoints…");

        let written = 0;
        let skipped = 0;

        // Collected for the _headers file: { urlPath, mdAlternate } per page.
        // urlPath is the canonical trailing-slash route ("/about/", "/"); every
        // static page gets one entry so it carries the site-wide Link header.
        const headerRoutes: { urlPath: string; mdAlternate: string | null }[] =
          [];

        // Collected for dist/llms-full.txt: the full markdown of every content
        // page, keyed by canonical URL so the companion file is deterministic.
        const fullParts: { url: string; md: string }[] = [];

        // Walk the dist directory recursively looking for index.html files
        const htmlFiles = findHtmlFiles(distDir);

        for (const absPath of htmlFiles) {
          const rel = path.relative(distDir, absPath);

          // Canonical route URL for this page. path.dirname() of "about/index.html"
          // is "about"; the root "index.html" becomes ".". Normalise separators
          // for URL use (Netlify builds on Linux, but be defensive).
          const routeSegment = path.dirname(rel).replace(/\\/g, "/");
          const urlPath = routeSegment === "." ? "/" : `/${routeSegment}/`;

          const isContent = isContentPage(rel);
          const mdAlternate = isContent
            ? routeSegment === "."
              ? "/index.md"
              : `/${routeSegment}.md`
            : null;

          // Record every static page for the _headers file (content or not).
          headerRoutes.push({ urlPath, mdAlternate });

          if (!isContent) {
            skipped++;
            continue;
          }

          let html: string;
          try {
            html = fs.readFileSync(absPath, "utf-8");
          } catch {
            logger.warn(`markdown-endpoints: could not read ${absPath}`);
            continue;
          }

          const md = extractMarkdown(html, rel);

          // Collect for the llms-full.txt companion (full content concat).
          fullParts.push({ url: `https://gui.do${urlPath}`, md });

          // Write dist/<route>/index.md  (sibling to index.html)
          const indexMdPath = path.join(path.dirname(absPath), "index.md");
          fs.writeFileSync(indexMdPath, md, "utf-8");

          // Write dist/<route>.md  (flat alias)
          // rel looks like "about/index.html" → flatName is "about"
          if (routeSegment && routeSegment !== ".") {
            const flatMdPath = path.join(distDir, `${routeSegment}.md`);
            // Ensure parent dir exists (for nested routes like post/slug)
            fs.mkdirSync(path.dirname(flatMdPath), { recursive: true });
            fs.writeFileSync(flatMdPath, md, "utf-8");
          }

          written++;
        }

        logger.info(
          `markdown-endpoints: wrote ${written} .md files (${skipped} pages skipped).`,
        );

        writeLlmsFullFile(distDir, fullParts, logger);
        writeHeadersFile(distDir, headerRoutes, logger);
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Writes dist/_headers with one exact-path `Link` rule per built page.
 * Any content already present in dist/_headers (e.g. copied from public/) is
 * preserved as a prefix so we never clobber hand-authored rules.
 */
function writeHeadersFile(
  distDir: string,
  routes: { urlPath: string; mdAlternate: string | null }[],
  logger: { info(msg: string): void },
): void {
  // Deterministic ordering keeps deploy diffs and header output stable.
  const sorted = [...routes].sort((a, b) => a.urlPath.localeCompare(b.urlPath));

  const blocks = sorted.map((r) =>
    renderHeaderRule(r.urlPath, buildLinkValue(r.mdAlternate)),
  );

  const generated =
    "# Generated by the markdown-endpoints integration (issue #190).\n" +
    "# Advertises sitemap, llms.txt, the Person @id, and per-page .md\n" +
    "# alternates via HTTP Link headers. Do not edit by hand — see\n" +
    "# src/integrations/markdown-endpoints.ts.\n\n" +
    blocks.join("\n");

  const headersPath = path.join(distDir, "_headers");
  let existing = "";
  if (fs.existsSync(headersPath)) {
    existing = fs.readFileSync(headersPath, "utf-8").trimEnd() + "\n\n";
  }

  fs.writeFileSync(headersPath, existing + generated, "utf-8");
  logger.info(
    `markdown-endpoints: wrote _headers with ${sorted.length} Link rules.`,
  );
}

/**
 * Writes dist/llms-full.txt — the llmstxt.org "full" companion that
 * concatenates the complete markdown of every content page into one file,
 * each section prefixed with its source URL. Deterministic ordering (by URL)
 * keeps deploy diffs stable.
 */
function writeLlmsFullFile(
  distDir: string,
  parts: { url: string; md: string }[],
  logger: { info(msg: string): void },
): void {
  const sorted = [...parts].sort((a, b) => a.url.localeCompare(b.url));

  const header =
    "# Guido X Jansen — gui.do (full content)\n\n" +
    "> Concatenated markdown of every content page on gui.do, following the\n" +
    "> llms.txt convention (https://llmstxt.org/). For the curated index see\n" +
    "> /llms.txt. Per-page markdown is also available at <page>.md.\n\n" +
    "---\n";

  const sections = sorted.map((p) => `\n# Source: ${p.url}\n\n${p.md.trim()}\n`);

  const out = header + sections.join("\n---\n");

  fs.writeFileSync(path.join(distDir, "llms-full.txt"), out, "utf-8");
  logger.info(
    `markdown-endpoints: wrote llms-full.txt (${sorted.length} pages).`,
  );
}

function findHtmlFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip Astro build-artefact dirs and Netlify dirs
      if (
        entry.name.startsWith("_") ||
        entry.name === ".netlify" ||
        entry.name === "node_modules"
      ) {
        continue;
      }
      results.push(...findHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name === "index.html") {
      results.push(fullPath);
    }
  }
  return results;
}
