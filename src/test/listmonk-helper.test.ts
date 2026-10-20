import { describe, it, expect, vi, afterEach } from "vitest";
import {
  listmonkAuthHeaders,
  listmonkBaseUrl,
} from "../../netlify/functions/_shared/listmonk";

describe("_shared/listmonk", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("defaults to the self-hosted Listmonk API", () => {
    vi.stubEnv("LISTMONK_BASE_URL", "");
    expect(listmonkBaseUrl()).toBe("https://n.a11y.nl/api");
  });

  it("uses LISTMONK_BASE_URL without a trailing slash", () => {
    vi.stubEnv("LISTMONK_BASE_URL", " https://lists.example.test/api// ");
    expect(listmonkBaseUrl()).toBe("https://lists.example.test/api");
  });

  it("builds Basic auth and bypass headers", () => {
    vi.stubEnv("LISTMONK_API_USER", "user");
    vi.stubEnv("LISTMONK_API_KEY", "p:ss");
    vi.stubEnv("CF_BYPASS_TOKEN", "");
    expect(listmonkAuthHeaders()).toEqual({
      Authorization: `Basic ${Buffer.from("user:p:ss").toString("base64")}`,
      "X-Bypass-Token": "",
    });
  });

  it("returns null when credentials are missing", () => {
    vi.stubEnv("LISTMONK_API_USER", "user");
    vi.stubEnv("LISTMONK_API_KEY", "");
    expect(listmonkAuthHeaders()).toBeNull();
    vi.stubEnv("LISTMONK_API_USER", "");
    vi.stubEnv("LISTMONK_API_KEY", "key");
    expect(listmonkAuthHeaders()).toBeNull();
  });
});
