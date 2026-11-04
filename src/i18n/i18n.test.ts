// SPDX-License-Identifier: GPL-3.0-or-later
import { describe, expect, it } from "vitest";
import de from "./de.json";
import en from "./en.json";
import ru from "./ru.json";
import { detectLanguage } from "./index";

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ""): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") out.set(path, value);
    else for (const [k, v] of flatten(value, path)) out.set(k, v);
  }
  return out;
}

const placeholders = (s: string) => [...s.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort();

const reference = flatten(de);
const translations = { en: flatten(en), ru: flatten(ru) };

describe("translations are complete (PROJECT_BIBLE.md §14)", () => {
  it.each(Object.entries(translations))("%s has exactly the keys of de", (_lang, table) => {
    expect([...table.keys()].sort()).toEqual([...reference.keys()].sort());
  });

  it.each(Object.entries(translations))("%s uses the same placeholders as de", (_lang, table) => {
    for (const [key, text] of reference) {
      expect(placeholders(table.get(key) ?? ""), key).toEqual(placeholders(text));
    }
  });

  it("has no empty strings", () => {
    for (const table of [reference, ...Object.values(translations)]) {
      for (const [key, text] of table) expect(text.trim(), key).not.toBe("");
    }
  });
});

describe("detectLanguage", () => {
  it("picks a supported OS language", () => {
    expect(detectLanguage(["ru-RU", "en-US"])).toBe("ru");
    expect(detectLanguage(["en-GB"])).toBe("en");
  });

  it("falls back to German for unsupported languages", () => {
    expect(detectLanguage(["fr-FR", "es"])).toBe("de");
    expect(detectLanguage([])).toBe("de");
  });
});
