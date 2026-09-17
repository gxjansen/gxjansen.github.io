import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the accessibility (axe-core) test suite.
 * Audits key static routes in both themes.
 * Kept lean for CI/local RAM: chromium only, capped workers.
 */
const isCI = !!process.env.CI;
export default defineConfig({
  testDir: "./tests/a11y",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  reporter: process.env.CI
    ? [["github"], ["list"], ["html", { open: "never" }]]
    : "list",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:4321",
    trace: "off",
    // Disable CSS transitions/animations so axe never samples a mid-fade
    // (low-contrast) state on pages with reveal animations or live timers.
    reducedMotion: "reduce",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // Locally: the dev server (fast, hot-reload). In CI: build the static
    // site and serve dist/ with Python's stdlib server. All audited routes are
    // prerendered, so we don't need the Astro/Netlify dev server — whose Netlify
    // edge-functions child process the CI runner kills with an "unexpected
    // argument '--allow-scripts'" error, timing the suite out. `npx astro build`
    // mirrors the working CI Build job; the static server has no npm-spawned
    // child for the runner's allow-scripts shim to break.
    command: isCI
      ? "npx astro build && python3 -m http.server 4321 --directory dist"
      : "npm run dev",
    url: "http://localhost:4321",
    timeout: isCI ? 300_000 : 180_000,
    reuseExistingServer: !isCI,
  },
});
