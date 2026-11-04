// SPDX-License-Identifier: GPL-3.0-or-later
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  Clapperboard,
  Library,
  Lightbulb,
  MapPin,
  StickyNote,
  Users,
  type LucideIcon,
} from "lucide-react";

const SECTIONS: { key: string; icon: LucideIcon }[] = [
  { key: "development", icon: Lightbulb },
  { key: "screenplay", icon: Clapperboard },
  { key: "characters", icon: Users },
  { key: "locations", icon: MapPin },
  { key: "timeline", icon: CalendarDays },
  { key: "research", icon: Library },
  { key: "notes", icon: StickyNote },
];

/** Left panel: project binder (PROJECT_BIBLE.md §5.4). Stage 0 shows the structure only. */
export function BinderPanel() {
  const { t } = useTranslation();

  return (
    <aside aria-label={t("binder.title")} className="flex h-full flex-col bg-panel">
      <h2 className="px-4 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
        {t("binder.title")}
      </h2>

      <ul className="px-2">
        {SECTIONS.map(({ key, icon: Icon }) => (
          <li key={key}>
            <div
              aria-disabled
              title={t("topbar.comingSoon")}
              className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-ink-muted"
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {t(`binder.${key}`)}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-auto px-4 pb-4 text-[12px] leading-relaxed text-ink-muted">{t("binder.empty")}</p>
    </aside>
  );
}
