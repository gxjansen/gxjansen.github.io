/**
 * The /uses "Defaults" list: every name resolves to a current item or is an
 * allowed plain name, and `isDefault` is set on exactly the items it uses.
 */
import { describe, it, expect } from "vitest";
import {
  currentItems,
  defaultItem,
  defaults,
  items,
  plainDefaults,
} from "../uses";

describe("uses defaults", () => {
  const used = new Set(
    defaults.flatMap((d) => d.use.map(defaultItem)).filter((i) => i),
  );

  it("every name is a current item, a part of one, or a plain default", () => {
    for (const d of defaults) {
      for (const name of d.use) {
        const ok = defaultItem(name) || plainDefaults.includes(name);
        expect(ok, `${d.slot}: ${name}`).toBeTruthy();
      }
    }
  });

  it("plain defaults are not items on /uses", () => {
    for (const name of plainDefaults) {
      expect(defaultItem(name), name).toBeUndefined();
    }
  });

  it("isDefault is set on exactly the items used as defaults", () => {
    for (const item of currentItems) {
      expect(!!item.isDefault, item.name).toBe(used.has(item));
    }
    for (const item of items.filter((i) => i.status === "dropped")) {
      expect(!!item.isDefault, item.name).toBe(false);
    }
  });

  it("has no duplicate slots", () => {
    const slots = defaults.map((d) => d.slot);
    expect(new Set(slots).size).toBe(slots.length);
  });
});
