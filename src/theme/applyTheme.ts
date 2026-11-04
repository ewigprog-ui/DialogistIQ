// SPDX-License-Identifier: GPL-3.0-or-later
import { THEMES, TOKEN_CSS_VARS, type ThemeId, type ThemeTokens } from "./themes";

export type ThemePreference = "system" | ThemeId;

export function resolveTheme(pref: ThemePreference, systemPrefersDark: boolean): ThemeId {
  if (pref === "system") return systemPrefersDark ? "dark" : "paper";
  return pref;
}

/** Writes the theme tokens as CSS variables on <html>. */
export function applyTheme(id: ThemeId, root: HTMLElement = document.documentElement): void {
  const theme = THEMES[id];
  for (const key of Object.keys(TOKEN_CSS_VARS) as (keyof ThemeTokens)[]) {
    root.style.setProperty(TOKEN_CSS_VARS[key], theme.tokens[key]);
  }
  root.style.colorScheme = theme.isDark ? "dark" : "light";
  root.dataset.theme = id;
}

export function systemPrefersDark(): boolean {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}
