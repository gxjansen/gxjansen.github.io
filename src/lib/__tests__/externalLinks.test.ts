import { describe, it, expect } from "vitest";
import {
  isExternalHref,
  markExternalLinks,
  NEW_TAB_NOTE_ID,
} from "../externalLinks";

const HOSTS = ["gui.do", "www.gui.do"];
const mark = (html: string) => markExternalLinks(html, HOSTS);
const page = (body: string) => `<html><body>${body}</body></html>`;

describe("isExternalHref", () => {
  it("treats other hosts as external", () => {
    expect(isExternalHref("https://example.com/x", HOSTS)).toBe(true);
    expect(isExternalHref("http://www.catb.org/~esr/", HOSTS)).toBe(true);
    expect(isExternalHref("//cdn.example.com/a", HOSTS)).toBe(true);
  });

  it("treats the site, relative, hash and non-http links as internal", () => {
    for (const href of [
      "https://gui.do/canon/",
      "https://WWW.gui.do/",
      "/canon/",
      "#top",
      "?f=x#uses-filter",
      "mailto:x@example.com",
      "tel:+31",
    ]) {
      expect(isExternalHref(href, HOSTS)).toBe(false);
    }
  });
});

describe("markExternalLinks", () => {
  it("adds target, rel and the new-tab description to external links", () => {
    const out = mark(page(`<a href="https://example.com" class="x">Ex</a>`));
    expect(out).toContain(
      `<a href="https://example.com" class="x" target="_blank" rel="noopener noreferrer" aria-describedby="${NEW_TAB_NOTE_ID}">Ex</a>`,
    );
    expect(out).toContain(
      `<span id="${NEW_TAB_NOTE_ID}" hidden>(opens in new tab)</span></body>`,
    );
  });

  it("adds the note once per page", () => {
    const out = mark(
      page(`<a href="https://a.com">a</a><a href="https://b.com">b</a>`),
    );
    expect(out.match(new RegExp(`id="${NEW_TAB_NOTE_ID}"`, "g"))).toHaveLength(
      1,
    );
  });

  it("merges rel and aria-describedby tokens", () => {
    const out = mark(
      page(
        `<a href="https://a.com" rel="me noopener" aria-describedby="hint">a</a>`,
      ),
    );
    expect(out).toContain(`rel="me noopener noreferrer"`);
    expect(out).toContain(`aria-describedby="hint ${NEW_TAB_NOTE_ID}"`);
  });

  it("leaves links with an explicit target alone", () => {
    const html = page(
      `<a href="https://a.com" target="_blank" rel="noopener">a</a><a href="https://b.com" target="_self">b</a>`,
    );
    expect(mark(html)).toBe(html);
  });

  it("leaves internal links and pages without external links unchanged", () => {
    const html = page(
      `<a href="/canon/">c</a><a href="https://gui.do/">home</a><a name="x">n</a>`,
    );
    expect(mark(html)).toBe(html);
  });

  it("does not touch script, style or template contents", () => {
    const script = `<script>const s = '<a href="https://a.com">a</a>';</script>`;
    const tpl = `<template><a href="https://b.com">b</a></template>`;
    const out = mark(page(`${script}${tpl}<a href="https://c.com">c</a>`));
    expect(out).toContain(script);
    expect(out).toContain(tpl);
    expect(out).toContain(`<a href="https://c.com" target="_blank"`);
  });

  it("keeps quoted values with > and entities intact", () => {
    const out = mark(
      page(`<a href="https://a.com/?x=1&amp;y=2" title="a > b" data-on>a</a>`),
    );
    expect(out).toContain(
      `<a href="https://a.com/?x=1&amp;y=2" title="a > b" data-on target="_blank"`,
    );
  });

  it("does not match tags that only start with a", () => {
    const html = page(
      `<abbr title="https://a.com">A</abbr><article>x</article>`,
    );
    expect(mark(html)).toBe(html);
  });
});
