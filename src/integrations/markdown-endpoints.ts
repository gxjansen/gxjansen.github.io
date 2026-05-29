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
 * Excluded: homepage, /ama, /api/*, *.xml, *.json, nav-data, rss,
 * 404, /styleguide, /categories/*, /authors/*, /examples/*,
 * /internal/*, /overview, /newsletter, /privacy, /conference-terms.
 */

import type { AstroIntegration } from "astro";
import * as fs from "node:fs";
import * as path from "node:path";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { parse as parseHtml } from "node-html-parser";

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

  // Exact exclusions (resolved to their index.html form)
  const excluded = new Set([
    "index.html", // homepage – skip
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

        // Walk the dist directory recursively looking for index.html files
        const htmlFiles = findHtmlFiles(distDir);

        for (const absPath of htmlFiles) {
          const rel = path.relative(distDir, absPath);
          if (!isContentPage(rel)) {
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

          // Write dist/<route>/index.md  (sibling to index.html)
          const indexMdPath = path.join(path.dirname(absPath), "index.md");
          fs.writeFileSync(indexMdPath, md, "utf-8");

          // Write dist/<route>.md  (flat alias)
          // rel looks like "about/index.html" → flatName is "about"
          const routeSegment = path.dirname(rel); // e.g. "about" or "post/my-slug"
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
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
