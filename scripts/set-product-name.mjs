// SPDX-License-Identifier: GPL-3.0-or-later
/**
 * Sets the final product name in every place that needs it (PROJECT_BIBLE.md §14):
 *   src/config/product.ts, src-tauri/tauri.conf.json, index.html
 *
 *   pnpm product:set-name "Final Name" org.example.appid
 *
 * Package, crate and folder names stay neutral ("studio") on purpose.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [name, appId] = process.argv.slice(2);

if (!name || !appId) {
  console.error('Usage: pnpm product:set-name "Final Name" org.example.appid');
  process.exit(2);
}
if (/[/\\:*?"<>|]/.test(name)) {
  console.error(`Product name must not contain any of / \\ : * ? " < > |`);
  process.exit(2);
}
if (!/^[a-zA-Z][a-zA-Z0-9-]*(\.[a-zA-Z0-9-]+)+$/.test(appId)) {
  console.error(`Invalid app identifier "${appId}". Use reverse-domain notation, e.g. org.example.writer`);
  process.exit(2);
}

function update(rel, transform) {
  const path = join(ROOT, rel);
  const before = readFileSync(path, "utf8");
  const after = transform(before);
  if (after === before) throw new Error(`${rel}: nothing changed — unexpected file layout`);
  writeFileSync(path, after, "utf8");
  console.log(`updated ${rel}`);
}

update("src/config/product.ts", (s) =>
  s
    .replace(/export const PRODUCT_NAME = ".*?";/, `export const PRODUCT_NAME = ${JSON.stringify(name)};`)
    .replace(/export const PRODUCT_ID = ".*?";/, `export const PRODUCT_ID = ${JSON.stringify(appId)};`),
);

update("src-tauri/tauri.conf.json", (s) => {
  const conf = JSON.parse(s);
  conf.productName = name;
  conf.identifier = appId;
  for (const w of conf.app?.windows ?? []) w.title = name;
  return JSON.stringify(conf, null, 2) + "\n";
});

update("index.html", (s) => s.replace(/<title>.*?<\/title>/, `<title>${name.replace(/</g, "&lt;")}</title>`));

console.log(`\nProduct name set to "${name}" (${appId}). Remember to update PROJECT_BIBLE.md §19.`);
