import { describe, it, expect } from "vitest";
import { inlineLinks, richText } from "../sifaProfile";

describe("richText", () => {
  it("splits paragraphs and groups bullets", () => {
    expect(richText("One\ntwo\n\n→ a\n→ b")).toEqual([
      { type: "p", text: "One two" },
      { type: "ul", items: ["a", "b"] },
    ]);
  });

  it("keeps Markdown link syntax in the text for inlineLinks", () => {
    expect(richText("Built [Joomla!](https://www.joomla.org)")).toEqual([
      { type: "p", text: "Built [Joomla!](https://www.joomla.org)" },
    ]);
  });
});

describe("inlineLinks", () => {
  it("returns plain text as one segment", () => {
    expect(inlineLinks("no links, https://bare.example")).toEqual([
      { text: "no links, https://bare.example" },
    ]);
  });

  it("turns a Markdown link into a link segment", () => {
    expect(inlineLinks("Founded [Joomla!](https://www.joomla.org) NL")).toEqual(
      [
        { text: "Founded " },
        { text: "Joomla!", href: "https://www.joomla.org/" },
        { text: " NL" },
      ],
    );
  });

  it("handles several links and parentheses in URLs", () => {
    const out = inlineLinks(
      "[A](http://a.example/x) and [W](https://en.wikipedia.org/wiki/Foo_(bar))",
    );
    expect(out.filter((s) => s.href).map((s) => s.href)).toEqual([
      "http://a.example/x",
      "https://en.wikipedia.org/wiki/Foo_(bar)",
    ]);
  });

  it("rejects non-http(s) schemes and leaves them literal", () => {
    for (const bad of [
      "[x](javascript:alert(1))",
      "[x](data:text/html,hi)",
      "[x](mailto:a@b.c)",
      "[x](/relative)",
    ]) {
      expect(inlineLinks(bad)).toEqual([{ text: bad }]);
    }
  });

  it("keeps HTML in text as a plain string for the template to escape", () => {
    expect(inlineLinks('[<b>"x"</b>](https://e.example/?a=1&b="2")')).toEqual([
      { text: '<b>"x"</b>', href: "https://e.example/?a=1&b=%222%22" },
    ]);
  });

  it("ignores empty link text", () => {
    expect(inlineLinks("[ ](https://e.example)")).toEqual([
      { text: "[ ](https://e.example)" },
    ]);
  });
});
