// SPDX-License-Identifier: GPL-3.0-or-later
import { Popover } from "radix-ui";
import { useTranslation } from "react-i18next";
import { Check, SlidersHorizontal } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { LANGUAGES } from "@/i18n";
import type { ThemePreference } from "@/theme/applyTheme";
import { cn } from "@/lib/utils";
import { effectiveLanguage, useUiStore } from "@/store/uiStore";

const THEME_OPTIONS: { value: ThemePreference; labelKey: string }[] = [
  { value: "system", labelKey: "settings.themeSystem" },
  { value: "paper", labelKey: "settings.themePaper" },
  { value: "dark", labelKey: "settings.themeDark" },
];

function Option({ selected, onSelect, children }: { selected: boolean; onSelect: () => void; children: string }) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-hover",
        selected && "font-medium",
      )}
    >
      {children}
      {selected && <Check className="size-4 text-accent" aria-hidden />}
    </button>
  );
}

/** Stage 0 quick settings: colour scheme and interface language. */
export function QuickSettings() {
  const { t } = useTranslation();
  const { theme, setTheme, language, setLanguage } = useUiStore();
  const current = effectiveLanguage(language);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton label={t("topbar.settings")}>
          <SlidersHorizontal />
        </IconButton>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={6}
          className="z-50 w-60 rounded-lg border border-line bg-page p-2 text-ink shadow-lg"
        >
          <p className="px-2 pb-1 pt-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            {t("settings.theme")}
          </p>
          <div role="menu" aria-label={t("settings.theme")}>
            {THEME_OPTIONS.map((o) => (
              <Option key={o.value} selected={theme === o.value} onSelect={() => setTheme(o.value)}>
                {t(o.labelKey)}
              </Option>
            ))}
          </div>

          <div className="my-2 h-px bg-line" />

          <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            {t("settings.language")}
          </p>
          <div role="menu" aria-label={t("settings.language")}>
            {LANGUAGES.map((lang) => (
              <Option key={lang} selected={current === lang} onSelect={() => setLanguage(lang)}>
                {t(`languages.${lang}`)}
              </Option>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
