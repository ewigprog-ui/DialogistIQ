// SPDX-License-Identifier: GPL-3.0-or-later
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ThemePreference } from "@/theme/applyTheme";
import { detectLanguage, type Language } from "@/i18n";

export const MODES = ["write", "develop", "world", "ai", "stats"] as const;
export type Mode = (typeof MODES)[number];

interface UiState {
  theme: ThemePreference;
  /** null = not chosen by the user yet → follow the OS language (fallback German). */
  language: Language | null;
  mode: Mode;
  binderOpen: boolean;
  aiOpen: boolean;
  focusMode: boolean;
  /** Panel visibility before entering focus mode, restored on exit. */
  beforeFocus: { binderOpen: boolean; aiOpen: boolean } | null;

  setTheme: (theme: ThemePreference) => void;
  setLanguage: (language: Language) => void;
  setMode: (mode: Mode) => void;
  setBinderOpen: (open: boolean) => void;
  setAiOpen: (open: boolean) => void;
  toggleBinder: () => void;
  toggleAi: () => void;
  enterFocus: () => void;
  exitFocus: () => void;
  toggleFocus: () => void;
}

/**
 * UI preferences of this device. Stage 0 keeps them in browser storage;
 * from stage 1 on, settings move to settings.json in the app data folder
 * (PROJECT_BIBLE.md §15.1).
 */
export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      theme: "system",
      language: null,
      mode: "write",
      binderOpen: true,
      aiOpen: true,
      focusMode: false,
      beforeFocus: null,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setMode: (mode) => set({ mode }),
      setBinderOpen: (binderOpen) => set({ binderOpen }),
      setAiOpen: (aiOpen) => set({ aiOpen }),
      toggleBinder: () => set((s) => ({ binderOpen: !s.binderOpen })),
      toggleAi: () => set((s) => ({ aiOpen: !s.aiOpen })),
      enterFocus: () => {
        const { focusMode, binderOpen, aiOpen } = get();
        if (focusMode) return;
        set({ focusMode: true, beforeFocus: { binderOpen, aiOpen }, binderOpen: false, aiOpen: false });
      },
      exitFocus: () => {
        const { focusMode, beforeFocus } = get();
        if (!focusMode) return;
        set({
          focusMode: false,
          binderOpen: beforeFocus?.binderOpen ?? true,
          aiOpen: beforeFocus?.aiOpen ?? true,
          beforeFocus: null,
        });
      },
      toggleFocus: () => (get().focusMode ? get().exitFocus() : get().enterFocus()),
    }),
    {
      name: "ui-preferences",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ theme, language, mode, binderOpen, aiOpen, focusMode, beforeFocus }) => ({
        theme,
        language,
        mode,
        binderOpen,
        aiOpen,
        focusMode,
        beforeFocus,
      }),
      merge: (persisted, current) => ({ ...current, ...restoreUiState(persisted) }),
    },
  ),
);

type PersistedUi = Partial<
  Pick<UiState, "theme" | "language" | "mode" | "binderOpen" | "aiOpen" | "focusMode" | "beforeFocus">
>;

/**
 * Focus mode is per session: the app never starts in it. If it was closed in
 * focus mode, the panels come back as they were before entering it.
 */
export function restoreUiState(persisted: unknown): PersistedUi {
  if (!persisted || typeof persisted !== "object") return {};
  const state = { ...(persisted as PersistedUi) };
  if (state.focusMode && state.beforeFocus) {
    state.binderOpen = state.beforeFocus.binderOpen;
    state.aiOpen = state.beforeFocus.aiOpen;
  }
  state.focusMode = false;
  state.beforeFocus = null;
  return state;
}

export function effectiveLanguage(language: Language | null): Language {
  return language ?? detectLanguage();
}
