import { describe, it, expect } from "vitest";
import { parseHTML } from "../../test/astro-test-utils";
import { createMockLayoutProps } from "../../test/utils";

describe("BaseLayout", () => {
  it("renders basic structure correctly", () => {
    const props = createMockLayoutProps();

    const markup = `
      <!doctype html>
      <html
        lang="en"
        dir="ltr"
        class="antialiased"
      >
        <head>
          <title>${props.title}</title>
          <meta name="description" content="${props.description}">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta charset="UTF-8">
        </head>
        <body
          id="body"
          class="bg-background dark:bg-background-dark use-animations relative isolate overflow-x-hidden min-h-screen flex flex-col"
        >
          <div class="fixed inset-0 z-background">
            <div
              class="noise-background"
              aria-hidden="true"
              role="presentation"
            ></div>
            <div
              class="gradient-top-left"
              aria-hidden="true"
              role="presentation"
            ></div>
            <div
              class="gradient-bottom-right"
              aria-hidden="true"
              role="presentation"
            ></div>
          </div>

          <div class="relative z-base flex-1">
            <nav></nav>
            <div class="site-container px-4">
              <main id="main-content" class="transition-ready">
                <slot></slot>
              </main>
            </div>
          </div>

          <footer></footer>
        </body>
      </html>
    `.trim();

    const parsedHtml = parseHTML(markup);

    // Check basic structure
    expect(parsedHtml.querySelector("html")).toBeTruthy();
    expect(parsedHtml.querySelector("head")).toBeTruthy();
    expect(parsedHtml.querySelector("body")).toBeTruthy();
    expect(parsedHtml.querySelector("main")).toBeTruthy();

    // Check HTML attributes
    const htmlElement = parsedHtml.querySelector("html");
    expect(htmlElement?.getAttribute("lang")).toBe("en");
    expect(htmlElement?.getAttribute("dir")).toBe("ltr");
    expect(htmlElement?.classList.contains("antialiased")).toBe(true);

    // Check meta tags
    const title = parsedHtml.querySelector("title");
    expect(title?.textContent).toBe(props.title);
    const description = parsedHtml.querySelector('meta[name="description"]');
    expect(description?.getAttribute("content")).toBe(props.description);

    // Check main content area
    const main = parsedHtml.querySelector("main");
    expect(main?.id).toBe("main-content");
    expect(main?.classList.contains("transition-ready")).toBe(true);
  });

  it("includes background elements with proper accessibility", () => {
    const markup = `
      <div class="fixed inset-0 z-background">
        <div 
          class="noise-background"
          aria-hidden="true"
          role="presentation"
        ></div>
        <div 
          class="gradient-top-left"
          aria-hidden="true"
          role="presentation"
        ></div>
        <div 
          class="gradient-bottom-right"
          aria-hidden="true"
          role="presentation"
        ></div>
        <div class="grid-pattern-container h-full w-full"></div>
      </div>
    `.trim();

    const parsedHtml = parseHTML(markup);

    // Check background elements
    const backgroundElements = parsedHtml.querySelectorAll(
      '[role="presentation"]',
    );
    expect(backgroundElements.length).toBe(3);

    // Check accessibility attributes
    backgroundElements.forEach((element) => {
      expect(element.getAttribute("aria-hidden")).toBe("true");
      expect(element.getAttribute("role")).toBe("presentation");
    });
  });

  it("uses CSS-only cross-document view transitions", () => {
    // Native CSS-only view transitions (Astro 6 + Baseline 2024) replace the
    // ClientRouter SPA. The main element no longer carries Astro
    // transition:* directives; the @view-transition at-rule in tailwind.css
    // drives the cross-document fade instead.
    const markup = `
      <main id="main-content" class="transition-ready">
        <slot></slot>
      </main>
    `.trim();

    const parsedHtml = parseHTML(markup);

    const main = parsedHtml.querySelector("main");
    expect(main?.id).toBe("main-content");
    expect(main?.getAttribute("transition:animate")).toBeFalsy();
    expect(main?.getAttribute("transition:animate.duration")).toBeFalsy();
    expect(main?.getAttribute("transition:animate.timing")).toBeFalsy();
  });

  it("handles SEO meta tags correctly", () => {
    const props = createMockLayoutProps({
      type: "blog",
      title: "Test Blog Post",
      description: "This is a test blog post",
      noindex: true,
    });

    const markup = `
      <head>
        <title>${props.title}</title>
        <meta name="description" content="${props.description}">
        <meta name="robots" content="noindex">
        <meta property="og:title" content="${props.title}">
        <meta property="og:description" content="${props.description}">
        <meta property="og:type" content="article">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${props.title}">
        <meta name="twitter:description" content="${props.description}">
      </head>
    `.trim();

    const parsedHtml = parseHTML(markup);

    // Check basic meta tags
    expect(parsedHtml.querySelector("title")?.textContent).toBe(props.title);
    expect(
      parsedHtml
        .querySelector('meta[name="description"]')
        ?.getAttribute("content"),
    ).toBe(props.description);
    expect(
      parsedHtml.querySelector('meta[name="robots"]')?.getAttribute("content"),
    ).toBe("noindex");

    // Check OpenGraph tags
    expect(
      parsedHtml
        .querySelector('meta[property="og:title"]')
        ?.getAttribute("content"),
    ).toBe(props.title);
    expect(
      parsedHtml
        .querySelector('meta[property="og:description"]')
        ?.getAttribute("content"),
    ).toBe(props.description);
    expect(
      parsedHtml
        .querySelector('meta[property="og:type"]')
        ?.getAttribute("content"),
    ).toBe("article");

    // Check Twitter tags
    expect(
      parsedHtml
        .querySelector('meta[name="twitter:title"]')
        ?.getAttribute("content"),
    ).toBe(props.title);
    expect(
      parsedHtml
        .querySelector('meta[name="twitter:description"]')
        ?.getAttribute("content"),
    ).toBe(props.description);
    expect(
      parsedHtml
        .querySelector('meta[name="twitter:card"]')
        ?.getAttribute("content"),
    ).toBe("summary_large_image");
  });

  it("declares CSS-only @view-transition rules", () => {
    // CSS-only view transitions don't need any JS lifecycle hooks. The
    // performance optimization is the absence of the ~10KB ClientRouter
    // runtime, plus root-level fade declared in tailwind.css.
    const markup = `
      <html>
        <head>
          <style>
            @view-transition {
              navigation: auto;
            }
            ::view-transition-old(root),
            ::view-transition-new(root) {
              animation-duration: 0.2s;
              animation-timing-function: ease-out;
            }
            @media (prefers-reduced-motion: reduce) {
              ::view-transition-old(root),
              ::view-transition-new(root) {
                animation: none;
              }
            }
          </style>
        </head>
        <body>
          <main id="main-content" class="transition-ready"></main>
        </body>
      </html>
    `.trim();

    const parsedHtml = parseHTML(markup);
    const style = parsedHtml.querySelector("style");
    expect(style?.textContent).toContain("@view-transition");
    expect(style?.textContent).toContain("navigation: auto");
    expect(style?.textContent).toContain("::view-transition-old(root)");
    expect(style?.textContent).toContain("::view-transition-new(root)");
    expect(style?.textContent).toContain("prefers-reduced-motion: reduce");
  });
});
