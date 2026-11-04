// SPDX-License-Identifier: GPL-3.0-or-later
import React from "react";
import ReactDOM from "react-dom/client";
import "@/styles/globals.css";
import App from "@/App";
import { PRODUCT_NAME } from "@/config/product";
import { initI18n } from "@/i18n";
import { applyTheme, resolveTheme, systemPrefersDark } from "@/theme/applyTheme";
import { effectiveLanguage, useUiStore } from "@/store/uiStore";

document.title = PRODUCT_NAME;

// Apply theme and language before the first paint to avoid a flash of the wrong theme.
const { theme, language } = useUiStore.getState();
applyTheme(resolveTheme(theme, systemPrefersDark()));

void initI18n(effectiveLanguage(language)).then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
