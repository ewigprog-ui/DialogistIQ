// SPDX-License-Identifier: GPL-3.0-or-later
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluate, findViolations, parse } from "./license-policy.mjs";

const policy = JSON.parse(readFileSync(new URL("../../licenses.policy.json", import.meta.url), "utf8"));
const ok = (expr) => evaluate(expr, policy).ok;

describe("license policy (PROJECT_BIBLE.md §13)", () => {
  it.each([
    "MIT",
    "Apache-2.0 OR MIT",
    "MIT/Apache-2.0",
    "Apache-2.0 / MIT",
    "(MIT OR Apache-2.0) AND Unicode-3.0",
    "Apache-2.0 WITH LLVM-exception",
    "Apache-2.0 WITH LLVM-exception OR Apache-2.0 OR MIT",
    "MIT OR Apache-2.0 OR LGPL-2.1-or-later",
    "OFL-1.1",
    "GPL-3.0-or-later",
    "GPL-3.0",
    "LGPL-3.0-only",
  ])("allows %s", (expr) => {
    expect(ok(expr)).toBe(true);
  });

  it.each([
    "BUSL-1.1",
    "SSPL-1.0",
    "CC-BY-NC-4.0",
    "CC-BY-ND-4.0",
    "GPL-2.0-only",
    "GPL-2.0",
    "CDDL-1.0",
    "UNLICENSED",
    "SomeProprietaryLicense",
    "MIT AND BUSL-1.1",
    "Apache-2.0 WITH Commons-Clause",
    "Unknown",
    "",
  ])("forbids %s", (expr) => {
    expect(ok(expr)).toBe(false);
  });

  it("requires an ADR for AGPL", () => {
    expect(evaluate("AGPL-3.0-only", policy)).toEqual({ ok: false, reason: expect.stringMatching(/ADR/) });
  });

  it("accepts OR when at least one branch is allowed", () => {
    expect(ok("GPL-2.0-only OR MIT")).toBe(true);
  });

  it("rejects malformed expressions instead of passing them", () => {
    expect(ok("MIT OR")).toBe(false);
    expect(ok("(MIT")).toBe(false);
  });

  it("parses precedence: AND binds tighter than OR", () => {
    expect(parse("A OR B AND C")).toEqual({
      op: "OR",
      nodes: [{ id: "A" }, { op: "AND", nodes: [{ id: "B" }, { id: "C" }] }],
    });
  });

  it("reports violations for a forbidden dependency (this is what breaks CI)", () => {
    const packages = [
      { ecosystem: "npm", name: "fine", version: "1.0.0", license: "MIT" },
      { ecosystem: "npm", name: "tiptap-pro-like", version: "1.0.0", license: "UNLICENSED" },
      { ecosystem: "cargo", name: "nc-crate", version: "0.1.0", license: "CC-BY-NC-4.0" },
    ];
    expect(findViolations(packages, policy).map((v) => v.name)).toEqual(["tiptap-pro-like", "nc-crate"]);
  });

  it("skips packages with a documented exception", () => {
    const withException = {
      ...policy,
      exceptions: [{ ecosystem: "npm", package: "special", reason: "test", adr: "docs/adr/x.md" }],
    };
    const packages = [{ ecosystem: "npm", name: "special", version: "1.0.0", license: "Unknown" }];
    expect(findViolations(packages, withException)).toEqual([]);
  });
});
