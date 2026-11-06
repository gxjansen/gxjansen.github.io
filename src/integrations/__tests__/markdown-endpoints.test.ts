import { describe, expect, it } from "vitest";
import { extractMarkdown } from "../markdown-endpoints";

const page = (main: string, title = "Now | Guido X Jansen") =>
  `<!doctype html><html><head><title>${title}</title></head><body>` +
  `<nav>site nav</nav><main id="main-content">${main}</main>` +
  `<footer>footer</footer></body></html>`;

const convert = (main: string, url = "https://gui.do/now/") =>
  extractMarkdown(page(main), "now/index.html", url);

describe("extractMarkdown", () => {
  it("uses the page H1 once and drops the kicker line before it", () => {
    const md = convert(
      `<header><p class="font-hand">where my head's at</p><h1>Now</h1>` +
        `<p>Updated today</p></header>`,
    );
    expect(md.match(/^# /gm)).toHaveLength(1);
    expect(md.startsWith("# Now")).toBe(true);
    expect(md).not.toContain("where my head");
    expect(md).toContain("Updated today");
  });

  it("falls back to the <title> when the page has no H1", () => {
    const md = convert(`<p>Body only</p>`);
    expect(md.startsWith("# Now\n\nBody only")).toBe(true);
  });

  it("keeps the space after inline elements followed by a line break", () => {
    const md = convert(
      `<h1>Now</h1><ul><li><strong>Family.</strong>\n    The good kind</li></ul>` +
        `<p>I use <a href="https://umami.is/">Umami</a>\n  for analytics.</p>`,
    );
    expect(md).toContain("**Family.** The good kind");
    expect(md).toContain("[Umami](https://umami.is/) for analytics");
  });

  it("keeps newlines inside code blocks", () => {
    const md = convert(`<h1>Now</h1><pre><code>a\nb</code></pre>`);
    expect(md).toContain("a\nb");
  });

  it("strips buttons, forms, decorative images and data-md-skip elements", () => {
    const md = convert(
      `<h1>Now</h1><p>Keep</p><button>Save as PDF</button>` +
        `<form><label>Email</label><input></form>` +
        `<img src="/a.webp" alt=""><img src="/b.webp" alt="A photo">` +
        `<div data-md-skip><p>Show only</p></div>`,
    );
    expect(md).toContain("Keep");
    expect(md).not.toContain("Save as PDF");
    expect(md).not.toContain("Email");
    expect(md).not.toContain("a.webp");
    expect(md).toContain("![A photo](https://gui.do/b.webp)");
    expect(md).not.toContain("Show only");
  });

  it("resolves relative links against the page URL", () => {
    const md = convert(
      `<h1>Uses</h1><a href="#use-zed">Zed</a> <a href="?f=eu">EU</a> ` +
        `<a href="/cv/">CV</a> <a href="mailto:x@example.com">Mail</a> ` +
        `<a href="https://zed.dev">zed.dev</a>`,
      "https://gui.do/uses/",
    );
    expect(md).toContain("[Zed](https://gui.do/uses/#use-zed)");
    expect(md).toContain("[EU](https://gui.do/uses/?f=eu)");
    expect(md).toContain("[CV](https://gui.do/cv/)");
    expect(md).toContain("[Mail](mailto:x@example.com)");
    expect(md).toContain("[zed.dev](https://zed.dev)");
  });
});

describe("extractMarkdown line tidying", () => {
  it("leaves no stray single spaces at line edges", () => {
    const md = convert(`<h1>Now</h1>\n<p>\n  Indented source text.\n</p>`);
    expect(md).toContain("\nIndented source text.\n");
  });

  it("trims padding in headings and link text", () => {
    const md = convert(
      `<h1>\n  Hi\n</h1><p><a href="/a/"> Work with me </a> <a href="/b/">View details </a></p>`,
    );
    expect(md.startsWith("# Hi\n")).toBe(true);
    expect(md).toContain("[Work with me](https://gui.do/a/)");
    expect(md).toContain("[View details](https://gui.do/b/)");
  });
});
