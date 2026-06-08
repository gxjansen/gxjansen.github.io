import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";

/**
 * WCAG 2 A/AA accessibility gate.
 *
 * Audits a representative set of routes (covering every shared component)
 * in BOTH light and dark themes with axe-core, and fails on any violation.
 * Dark mode is the gap that previously let contrast bugs through, so every
 * route is checked in both themes.
 */

const ROUTES = [
  "/",
  "/about/",
  "/press/",
  "/podcasts/",
  "/retainer/",
  "/speaker/",
  "/communities/",
  "/contact/",
  "/overview/",
  "/newsletter/",
  "/projects/",
  "/privacy/",
  "/presentations/",
  "/ama/",
  "/post/better-not-waste-it/",
];

const THEMES = ["light", "dark"] as const;

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function gotoThemed(page: Page, route: string, theme: string) {
  // Set the theme before any app script runs so the inline theme bootstrap
  // applies it on first paint (no flash, no double render).
  await page.addInitScript((t) => {
    try {
      localStorage.setItem("colorTheme", t);
    } catch {}
  }, theme);
  await page.goto(route, { waitUntil: "networkidle" });
  // Sanity: the <html> element should carry the dark class in dark mode.
  if (theme === "dark") {
    await expect(page.locator("html")).toHaveClass(/dark/);
  }
  // Let fonts and any JS-driven content (timers, reveal animations) settle
  // so axe samples the final rendered state, not a transient one.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
}

// Inventory mode: set A11Y_INVENTORY=1 to collect all violations into a JSON
// summary instead of failing per-test. Used to scope remediation.
const INVENTORY = process.env.A11Y_INVENTORY === "1";
const inventory: Array<Record<string, unknown>> = [];

for (const theme of THEMES) {
  for (const route of ROUTES) {
    test(`${theme} :: ${route}`, async ({ page }) => {
      await gotoThemed(page, route, theme);
      const results = await new AxeBuilder({ page })
        .withTags(WCAG_TAGS)
        // The Astro dev toolbar is injected only by `astro dev`; it never ships
        // to production, so it must not gate the build.
        .exclude("astro-dev-toolbar")
        .analyze();

      if (INVENTORY) {
        for (const v of results.violations) {
          for (const n of v.nodes) {
            const checks = [...n.any, ...n.all, ...n.none];
            inventory.push({
              theme,
              route,
              id: v.id,
              impact: v.impact,
              target: n.target.join(" "),
              html: n.html.slice(0, 120),
              data: checks.map((c) => c.data).filter(Boolean),
            });
          }
        }
        return;
      }

      const summary = results.violations
        .map((v) => {
          const nodes = v.nodes
            .map((n) => {
              const data = [...n.any, ...n.all, ...n.none]
                .map((c) => c.data)
                .filter(Boolean);
              const cc = data.find(
                (
                  d,
                ): d is {
                  contrastRatio: number;
                  expectedContrastRatio: string;
                } => !!d && "contrastRatio" in (d as object),
              );
              const detail = cc
                ? ` (ratio ${cc.contrastRatio}, need ${cc.expectedContrastRatio})`
                : "";
              return `      - ${n.target.join(" ")}${detail}`;
            })
            .join("\n");
          return `  ${v.id} [${v.impact}] — ${v.help}\n${nodes}`;
        })
        .join("\n");
      expect(
        results.violations,
        `axe WCAG violations on ${route} [${theme}]:\n${summary}`,
      ).toEqual([]);
    });
  }
}

test.afterAll(() => {
  if (INVENTORY) {
    fs.writeFileSync(
      "/tmp/a11y-inventory.json",
      JSON.stringify(inventory, null, 2),
    );
  }
});
