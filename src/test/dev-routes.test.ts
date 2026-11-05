import { describe, it, expect, vi } from "vitest";
import { existsSync } from "node:fs";
import { devRoutes, DEV_ROUTES } from "../integrations/dev-routes";

function setup(context: string | undefined) {
  const injectRoute = vi.fn();
  const hook = devRoutes(context).hooks["astro:config:setup"];
  // Only the two fields the hook uses; the rest of the setup API is unused.
  hook?.({ injectRoute, logger: { info: vi.fn() } } as never);
  return injectRoute;
}

describe("dev-only /internal routes", () => {
  it("are left out of Netlify production builds", () => {
    expect(setup("production")).not.toHaveBeenCalled();
  });

  it.each([undefined, "deploy-preview", "branch-deploy", "dev"])(
    "are injected when CONTEXT is %s",
    (context) => {
      expect(setup(context)).toHaveBeenCalledTimes(DEV_ROUTES.length);
    },
  );

  it.each(DEV_ROUTES)("$pattern points at an existing file", (route) => {
    expect(existsSync(route.entrypoint)).toBe(true);
  });
});
