// SPDX-License-Identifier: GPL-3.0-or-later
/**
 * Themes are data, not code (PROJECT_BIBLE.md §5.5, §14).
 * Each theme is a set of design-token values that is applied as CSS variables.
 *
 * Rules enforced by themes.test.ts:
 * - no pure white background and no pure black text (and vice versa in dark themes);
 * - main text contrast >= 7:1, secondary text >= 4.5:1 (WCAG AA).
 */

export type ThemeId = "paper" | "dark";

export interface ThemeTokens {
  /** Window background behind the panels. */
  app: string;
  /** Side panels (binder, AI). */
  panel: string;
  /** Writing surface ("paper"). */
  page: string;
  /** Hover / subtle fill. */
  hover: string;
  /** Selected item fill. */
  selected: string;
  /** Thin separators and borders. */
  line: string;
  /** Main text. */
  ink: string;
  /** Secondary text (labels, status bar). */
  inkMuted: string;
  /** Calm accent for focus, active states and links. */
  accent: string;
  /** Text selection background. */
  selection: string;
}

export interface Theme {
  id: ThemeId;
  isDark: boolean;
  tokens: ThemeTokens;
}

export const THEMES: Record<ThemeId, Theme> = {
  paper: {
    id: "paper",
    isDark: false,
    tokens: {
      app: "#F2EFE8",
      panel: "#F2EFE8",
      page: "#FAF8F3",
      hover: "#E9E5DC",
      selected: "#E2DDD1",
      line: "#DEDAD0",
      ink: "#2B2A27",
      inkMuted: "#625E57",
      accent: "#4E6582",
      selection: "#D7DEE8",
    },
  },
  dark: {
    id: "dark",
    isDark: true,
    tokens: {
      app: "#1C1C1E",
      panel: "#1F1F22",
      page: "#232326",
      hover: "#2B2B2F",
      selected: "#323238",
      line: "#34343A",
      ink: "#D9D6CF",
      inkMuted: "#A09C94",
      accent: "#93A7C2",
      selection: "#3A4556",
    },
  },
};

/** Maps token names to CSS custom properties consumed by globals.css. */
export const TOKEN_CSS_VARS: Record<keyof ThemeTokens, string> = {
  app: "--app",
  panel: "--panel",
  page: "--page",
  hover: "--hover",
  selected: "--selected",
  line: "--line",
  ink: "--ink",
  inkMuted: "--ink-muted",
  accent: "--accent",
  selection: "--selection",
};
