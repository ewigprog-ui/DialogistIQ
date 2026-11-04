// SPDX-License-Identifier: GPL-3.0-or-later
import { useTranslation } from "react-i18next";
import { Send, Sparkles } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";

/** Right panel: AI roles and chat (PROJECT_BIBLE.md §11). Connected in stage 1. */
export function AIPanel() {
  const { t } = useTranslation();

  return (
    <aside aria-label={t("ai.title")} className="flex h-full flex-col bg-panel">
      <h2 className="flex items-center gap-2 px-4 pb-2 pt-4 text-[13px] font-semibold">
        <Sparkles className="size-4 text-accent" aria-hidden />
        {t("ai.title")}
      </h2>

      <div className="mx-3 rounded-lg bg-hover p-3 text-[13px] leading-relaxed text-ink-muted">
        {t("ai.empty")}
      </div>

      <div className="mt-auto p-3">
        <div className="flex items-center gap-1 rounded-lg border border-line bg-page px-3 py-1.5">
          <input
            disabled
            placeholder={t("ai.inputPlaceholder")}
            className="min-w-0 flex-1 bg-transparent py-1 text-[13px] outline-none placeholder:text-ink-muted disabled:cursor-not-allowed"
          />
          <IconButton size="sm" label={t("topbar.comingSoon")} disabled>
            <Send />
          </IconButton>
        </div>
      </div>
    </aside>
  );
}
