import { describe, it, expect } from "vitest";
import {
  checkSignupSignals,
  gmailDuplicateQuery,
  parseGmail,
  type SignupSignals,
} from "../../netlify/functions/_shared/signup-guards";

describe("parseGmail", () => {
  it("canonicalizes dots, +tags, case and googlemail.com", () => {
    expect(parseGmail("J.Doe+news@GoogleMail.com")).toEqual({
      canonicalLocal: "jdoe",
      dots: 1,
    });
    expect(parseGmail("a.r.u.ja.t.o.p.o.su32@gmail.com")?.dots).toBe(8);
  });

  it("ignores other domains and characters Gmail doesn't allow", () => {
    expect(parseGmail("j.d.o.e@example.com")).toBeNull();
    expect(parseGmail("o'brien@gmail.com")).toBeNull();
    expect(parseGmail("...@gmail.com")).toBeNull();
    expect(parseGmail("no-at-sign")).toBeNull();
  });
});

describe("gmailDuplicateQuery", () => {
  it("embeds only a safe canonical local part", () => {
    expect(gmailDuplicateQuery("jdoe")).toContain("= 'jdoe'");
    expect(() => gmailDuplicateQuery("x' OR '1'='1")).toThrow();
  });
});

describe("checkSignupSignals", () => {
  const human: SignupSignals = {
    email: "jane.doe@gmail.com",
    honeypot: undefined,
    elapsedMs: 9000,
    userAgent: "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101",
    origin: "https://gui.do",
    secFetchSite: "same-origin",
    expectedOrigin: "https://gui.do",
  };

  it("lets a normal browser signup through", () => {
    expect(checkSignupSignals(human)).toEqual({ ok: true });
    // Older browsers without Sec-Fetch-* headers.
    expect(checkSignupSignals({ ...human, secFetchSite: null })).toEqual({
      ok: true,
    });
    // Two dots is still a person.
    expect(
      checkSignupSignals({ ...human, email: "jane.m.doe@gmail.com" }),
    ).toEqual({ ok: true });
  });

  it.each([
    [{ honeypot: "x" }, "honeypot", true],
    [{ userAgent: '"Mozilla/5.0"' }, "user-agent", true],
    [{ userAgent: null }, "user-agent", true],
    [{ origin: null }, "origin", false],
    [{ origin: "https://gui.do.evil.example" }, "origin", false],
    [{ secFetchSite: "cross-site" }, "sec-fetch-site", false],
    [{ email: "j.a.n.e.doe@gmail.com" }, "gmail-dots", true],
    [{ elapsedMs: 1200 }, "too-fast", false],
    [{ elapsedMs: "9000" }, "too-fast", false],
  ] as const)("blocks %o as %s", (override, reason, silent) => {
    expect(checkSignupSignals({ ...human, ...override })).toEqual({
      ok: false,
      reason,
      silent,
    });
  });
});
