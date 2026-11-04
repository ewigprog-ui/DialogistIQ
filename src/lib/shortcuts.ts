// SPDX-License-Identifier: GPL-3.0-or-later
/**
 * Global keyboard shortcuts as data (PROJECT_BIBLE.md §8.4: all shortcuts will
 * be remappable). Editor shortcuts (Ctrl+B, Ctrl+1…0 etc.) stay free for the editor.
 */
export type ShortcutAction = "toggleBinder" | "toggleAi" | "toggleFocus" | "exitFocus";

export interface Shortcut {
  action: ShortcutAction;
  /** e.g. "Ctrl+Shift+B"; "Ctrl" means Cmd on macOS. */
  keys: string;
}

export const DEFAULT_SHORTCUTS: Shortcut[] = [
  { action: "toggleBinder", keys: "Ctrl+Shift+B" },
  { action: "toggleAi", keys: "Ctrl+Shift+J" },
  { action: "toggleFocus", keys: "Ctrl+Shift+D" },
  { action: "exitFocus", keys: "Escape" },
];

const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.platform);

export function matchesShortcut(event: KeyboardEvent, keys: string): boolean {
  const parts = keys.split("+");
  const key = parts[parts.length - 1].toLowerCase();
  const want = new Set(parts.slice(0, -1).map((p) => p.toLowerCase()));
  const ctrl = isMac ? event.metaKey : event.ctrlKey;
  return (
    ctrl === want.has("ctrl") &&
    event.shiftKey === want.has("shift") &&
    event.altKey === want.has("alt") &&
    event.key.toLowerCase() === key
  );
}

/** Human-readable label for tooltips. */
export function shortcutLabel(action: ShortcutAction, shortcuts = DEFAULT_SHORTCUTS): string {
  const keys = shortcuts.find((s) => s.action === action)?.keys ?? "";
  return isMac ? keys.replace("Ctrl", "⌘") : keys;
}
