// SPDX-License-Identifier: GPL-3.0-or-later
/**
 * Single source of the product identity (PROJECT_BIBLE.md §14).
 *
 * Never write the product name anywhere else in the code: import it from here,
 * or use {{productName}} in translation strings.
 *
 * To rename the product, run:
 *   pnpm product:set-name "New Name" org.example.appid
 * which updates this file, src-tauri/tauri.conf.json and index.html together.
 */
export const PRODUCT_NAME = "DialogistIQ";
export const PRODUCT_ID = "io.github.ewigprog-ui.dialogistiq";
export const PRODUCT_LICENSE = "GPL-3.0-or-later";
