// SPDX-License-Identifier: GPL-3.0-or-later
import { describe, expect, it } from "vitest";
import { THEMES } from "./themes";
import { contrastRatio } from "./contrast";

const PURE = ["#FFFFFF", "#000000"];
const surfaces = ["app", "panel", "page"] as const;

describe.each(Object.values(THEMES))("theme $id (PROJECT_BIBLE.md §5.5)", (theme) => {
  const t = theme.tokens;

  it("uses no pure white or pure black for surfaces and text", () => {
    for (const key of [...surfaces, "ink"] as const) {
      expect(PURE).not.toContain(t[key].toUpperCase());
    }
  });

  it.each(surfaces)("main text on %s has contrast >= 7:1", (surface) => {
    expect(contrastRatio(t.ink, t[surface])).toBeGreaterThanOrEqual(7);
  });

  it.each(surfaces)("secondary text on %s has contrast >= 4.5:1", (surface) => {
    expect(contrastRatio(t.inkMuted, t[surface])).toBeGreaterThanOrEqual(4.5);
  });

  it("accent stays readable on panels (>= 4.5:1)", () => {
    expect(contrastRatio(t.accent, t.panel)).toBeGreaterThanOrEqual(4.5);
  });

  it("main text stays readable on hover and selected fills (>= 7:1)", () => {
    expect(contrastRatio(t.ink, t.hover)).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(t.ink, t.selected)).toBeGreaterThanOrEqual(7);
  });
});
