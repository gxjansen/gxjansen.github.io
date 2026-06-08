import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the accessibility (axe-core) test suite.
 * Runs the Astro dev server and audits key routes in both themes.
 * Kept lean for CI/local RAM: chromium only, capped workers.
 */
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
    command: "npm run dev",
    url: "http://localhost:4321",
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
  },
});
