/// <reference types="vitest" />
import { describe, it, expect } from "vitest";
import { socialLinks } from "../../../data/socialLinks";

describe("SocialCards", () => {
  it("renders cards with about visibility", () => {
    const aboutPageLinks = socialLinks.filter((link) => link.visibility.about);

    expect(aboutPageLinks.length).toBeGreaterThan(0);

    aboutPageLinks.forEach((link) => {
      expect(link.visibility.about).toBe(true);
      expect(link.name).toBeTruthy();
      expect(link.href).toMatch(/^https?:\/\//);
      expect(link.icon).toMatch(
        /^(tabler\/|signal|linkedin|instagram|bluesky)/,
      );
    });
  });
});
