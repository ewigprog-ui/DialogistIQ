// SPDX-License-Identifier: GPL-3.0-or-later
import { useTranslation } from "react-i18next";
import { Minimize2 } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { effectiveLanguage, useUiStore } from "@/store/uiStore";

const DASH = "–";

/**
 * Live statistics line (PROJECT_BIBLE.md §5.2, §9.1).
 * Stage 0: no project → values are placeholders.
 */
export function StatusBar() {
  const { t } = useTranslation();
  const { mode, language, focusMode, exitFocus } = useUiStore();
  const lang = effectiveLanguage(language).toUpperCase();

  if (focusMode) {
    return (
      <footer className="group flex h-8 shrink-0 items-center justify-between px-3 text-[12px] text-ink-muted">
        <span>{t("status.words", { count: DASH })}</span>
        <span className="opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {t("status.focusHint")}
        </span>
        <IconButton size="sm" label={t("status.focusHint")} onClick={exitFocus}>
          <Minimize2 />
        </IconButton>
      </footer>
    );
  }

  return (
    <footer className="flex h-7 shrink-0 items-center gap-4 border-t border-line bg-panel px-3 text-[12px] text-ink-muted">
      <span>
        {t(`modes.${mode}`)} · {t("app.stage")}
      </span>
      <span className="ml-auto">{t("status.page", { current: DASH, total: DASH })}</span>
      <span>{t("status.runtime", { time: DASH })}</span>
      <span>{t("status.words", { count: DASH })}</span>
      <span>
        {lang} · {t("status.local")}
      </span>
    </footer>
  );
}
