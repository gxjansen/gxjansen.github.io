/**
 * The /uses "Defaults" list is built from `defaultFor` on items and bundle
 * parts. Every slot in `defaultSlots` gets at least one app, every slot an
 * item names is listed, and only current items fill slots.
 */
import { describe, it, expect } from "vitest";
import { defaultSlots, defaults, items, plainDefaults } from "../uses";

const norm = (s: string) => s.trim().toLowerCase();
const slotKeys = new Set(defaultSlots.map(norm));

const claimed = items.flatMap((item) => [
  ...(item.defaultFor ?? []).map((slot) => ({ slot, item, name: item.name })),
  ...(item.includes ?? []).flatMap((part) =>
    (part.defaultFor ?? []).map((slot) => ({ slot, item, name: part.name })),
  ),
]);

describe("uses defaults", () => {
  it("every slot has at least one app", () => {
    for (const d of defaults) {
      expect(d.use.length, d.slot).toBeGreaterThan(0);
    }
  });

  it("every slot an item or part names is in defaultSlots", () => {
    for (const c of claimed) {
      expect(slotKeys.has(norm(c.slot)), `${c.name}: ${c.slot}`).toBe(true);
    }
    for (const p of plainDefaults) {
      expect(slotKeys.has(norm(p.slot)), `${p.name}: ${p.slot}`).toBe(true);
    }
  });

  it("only current items fill slots", () => {
    for (const c of claimed) {
      expect(["using", "trying"], `${c.name}: ${c.slot}`).toContain(
        c.item.status,
      );
    }
  });

  it("plain defaults are not items on /uses", () => {
    for (const p of plainDefaults) {
      const asItem = items.some((i) => norm(i.name) === norm(p.name));
      expect(asItem, p.name).toBe(false);
    }
  });

  it("has no duplicate slots", () => {
    expect(slotKeys.size).toBe(defaultSlots.length);
  });
});
