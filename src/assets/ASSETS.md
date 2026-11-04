# Asset register

Every font, sound, icon and image shipped with the product, with source and licence
(PROJECT_BIBLE.md §13.4). Add a row before adding an asset.

## Fonts

All fonts are bundled from npm packages (no requests to Google Fonts at runtime).

| Font | Use | Package | Licence |
|---|---|---|---|
| Courier Prime | Screenplay text (Latin) and print | `@fontsource/courier-prime` | SIL OFL 1.1 |
| Cousine | Screenplay text fallback for Cyrillic — same 0.6 em advance as Courier, so fixed pitch and pagination stay intact | `@fontsource/cousine` | SIL OFL 1.1 (per package metadata; originally released under Apache-2.0 — both GPL-compatible) |
| Literata | Prose on screen | `@fontsource-variable/literata` | SIL OFL 1.1 |
| Inter | User interface | `@fontsource-variable/inter` | SIL OFL 1.1 |

## Icons

| Set | Package | Licence |
|---|---|---|
| Lucide | `lucide-react` | ISC |

## Sounds

None yet. Typewriter sounds must be CC0 or our own recordings (§8.3).

## Images

| File | Source | Licence |
|---|---|---|
| `docs/mockup-main-window.png` | Concept mockup from TZ.odt (project owner) | Project-owned |
| `src-tauri/icons/*` | Tauri template placeholder icons | MIT / Apache-2.0 (Tauri) — to be replaced with our own icon |
