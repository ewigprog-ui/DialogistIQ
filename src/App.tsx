// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import i18n from "@/i18n";
import { DEFAULT_SHORTCUTS, matchesShortcut, type ShortcutAction } from "@/lib/shortcuts";
import { applyTheme, resolveTheme } from "@/theme/applyTheme";
import { effectiveLanguage, useUiStore } from "@/store/uiStore";

function useThemeSync() {
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => applyTheme(resolveTheme(theme, media.matches));
    update();
    if (theme !== "system") return;
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [theme]);
}

function useLanguageSync() {
  const language = useUiStore((s) => s.language);

  useEffect(() => {
    const lang = effectiveLanguage(language);
    if (i18n.language !== lang) void i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [language]);
}

function useGlobalShortcuts() {
  useEffect(() => {
    const handlers: Record<ShortcutAction, () => void> = {
      toggleBinder: () => useUiStore.getState().toggleBinder(),
      toggleAi: () => useUiStore.getState().toggleAi(),
      toggleFocus: () => useUiStore.getState().toggleFocus(),
      exitFocus: () => useUiStore.getState().exitFocus(),
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const hit = DEFAULT_SHORTCUTS.find((s) => matchesShortcut(event, s.keys));
      if (!hit) return;
      if (hit.action === "exitFocus" && !useUiStore.getState().focusMode) return;
      event.preventDefault();
      handlers[hit.action]();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}

export default function App() {
  useThemeSync();
  useLanguageSync();
  useGlobalShortcuts();
  return <AppShell />;
}
