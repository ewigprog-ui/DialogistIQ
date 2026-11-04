// SPDX-License-Identifier: GPL-3.0-or-later
import { useTranslation } from "react-i18next";
import { BookOpen, Focus, History, PanelLeft, PanelRight, Search } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { QuickSettings } from "@/components/settings/QuickSettings";
import { PRODUCT_NAME } from "@/config/product";
import { shortcutLabel } from "@/lib/shortcuts";
import { cn } from "@/lib/utils";
import { MODES, useUiStore } from "@/store/uiStore";

export function TopBar() {
  const { t } = useTranslation();
  const { mode, setMode, binderOpen, aiOpen, toggleBinder, toggleAi, enterFocus } = useUiStore();

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-line bg-panel px-2">
      <IconButton
        label={`${t("topbar.toggleBinder")} (${shortcutLabel("toggleBinder")})`}
        active={binderOpen}
        onClick={toggleBinder}
      >
        <PanelLeft />
      </IconButton>

      <div className="flex min-w-0 items-center gap-2 pl-1 text-[13px]">
        <BookOpen className="size-[18px] shrink-0 text-ink-muted" aria-hidden />
        <span className="truncate font-semibold">{PRODUCT_NAME}</span>
        <span className="text-ink-muted" aria-hidden>
          /
        </span>
        <span className="truncate text-ink-muted">{t("topbar.library")}</span>
        <span className="text-ink-muted" aria-hidden>
          /
        </span>
        <span className="truncate text-ink-muted">{t("topbar.noProject")}</span>
      </div>

      <nav
        aria-label={t("modes.label")}
        className="mx-auto flex items-center gap-0.5 rounded-lg bg-app p-0.5"
      >
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-md px-3 py-1 text-[13px] transition-colors duration-100",
              mode === m ? "bg-page font-medium text-ink shadow-sm" : "text-ink-muted hover:text-ink",
            )}
          >
            {t(`modes.${m}`)}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-0.5">
        <IconButton label={`${t("topbar.search")} · ${t("topbar.comingSoon")}`} disabled>
          <Search />
        </IconButton>
        <IconButton label={`${t("topbar.history")} · ${t("topbar.comingSoon")}`} disabled>
          <History />
        </IconButton>
        <QuickSettings />
        <IconButton label={`${t("topbar.focusMode")} (${shortcutLabel("toggleFocus")})`} onClick={enterFocus}>
          <Focus />
        </IconButton>
        <IconButton
          label={`${t("topbar.toggleAi")} (${shortcutLabel("toggleAi")})`}
          active={aiOpen}
          onClick={toggleAi}
        >
          <PanelRight />
        </IconButton>
      </div>
    </header>
  );
}
