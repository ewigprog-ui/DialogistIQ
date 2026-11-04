// SPDX-License-Identifier: GPL-3.0-or-later
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import de from "./de.json";
import en from "./en.json";
import ru from "./ru.json";
import { PRODUCT_NAME } from "@/config/product";

/** Interface languages in priority order (PROJECT_BIBLE.md §1). German is the default. */
export const LANGUAGES = ["de", "en", "ru"] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = "de";

export const resources = {
  de: { translation: de },
  en: { translation: en },
  ru: { translation: ru },
} as const;

export function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && (LANGUAGES as readonly string[]).includes(value);
}

/**
 * OS language if it is one of ours, otherwise German.
 * (An explicit user choice always wins; that is handled by the UI store.)
 */
export function detectLanguage(locales: readonly string[] = navigator.languages ?? []): Language {
  for (const locale of locales) {
    const base = locale.toLowerCase().split("-")[0];
    if (isLanguage(base)) return base;
  }
  return DEFAULT_LANGUAGE;
}

export function initI18n(language: Language) {
  return i18n.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false, // React escapes already
      defaultVariables: { productName: PRODUCT_NAME },
    },
    returnNull: false,
  });
}

export default i18n;
