// SPDX-License-Identifier: GPL-3.0-or-later
import { useTranslation } from "react-i18next";

/**
 * Centre: writing surface. Stage 0 renders a static screenplay sample to check
 * fonts, tokens and US-standard indents (PROJECT_BIBLE.md §7.2, §7.4).
 *
 * Indents are expressed in `ch` of the 12 pt monospace font (10 characters per inch),
 * measured from the left text margin (1.5" from the page edge):
 *   character 3.7" → 22ch · parenthetical 3.1" → 16ch · dialogue 2.5" → 10ch, width 35ch.
 */
export function EditorPanel() {
  const { t } = useTranslation();

  return (
    <main className="flex h-full flex-col bg-app">
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-8">
        {/* 42rem = 60 characters of 16px Courier (9.6px each) + 2 × 3rem padding; shrinks with the panel. */}
        <div className="mx-auto w-full max-w-[42rem]">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            {t("editor.previewLabel")}
          </p>

          <article
            className="w-full select-text rounded-sm bg-page px-12 py-14 font-script text-[16px] leading-[1.25] text-ink shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          >
            <p className="mb-[1.25em] uppercase">{t("editor.sample.heading")}</p>
            <p className="mb-[1.25em]">{t("editor.sample.action")}</p>

            <p className="ml-[22ch] uppercase">{t("editor.sample.character1")}</p>
            <p className="mb-[1.25em] ml-[10ch] max-w-[35ch]">{t("editor.sample.dialogue1")}</p>

            <p className="ml-[22ch] uppercase">{t("editor.sample.character2")}</p>
            <p className="ml-[10ch] max-w-[35ch]">{t("editor.sample.dialogue2")}</p>
          </article>

          <p className="mt-4 text-[12px] text-ink-muted">{t("editor.hint")}</p>
        </div>
      </div>
    </main>
  );
}
