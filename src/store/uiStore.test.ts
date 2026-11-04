// SPDX-License-Identifier: GPL-3.0-or-later
import { describe, expect, it } from "vitest";
import { restoreUiState } from "./uiStore";

describe("restoreUiState", () => {
  it("never starts in focus mode and restores panels from before focus", () => {
    const restored = restoreUiState({
      theme: "dark",
      binderOpen: false,
      aiOpen: false,
      focusMode: true,
      beforeFocus: { binderOpen: true, aiOpen: false },
    });
    expect(restored).toMatchObject({
      theme: "dark",
      focusMode: false,
      beforeFocus: null,
      binderOpen: true,
      aiOpen: false,
    });
  });

  it("keeps panel choices made outside focus mode", () => {
    expect(restoreUiState({ binderOpen: false, aiOpen: true, focusMode: false })).toMatchObject({
      binderOpen: false,
      aiOpen: true,
    });
  });

  it("tolerates missing or broken storage", () => {
    expect(restoreUiState(undefined)).toEqual({});
    expect(restoreUiState("garbage")).toEqual({});
  });
});
