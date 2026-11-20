// Checks every extension in package.json "extensionPack" against the VS Code Marketplace.
// Fails (exit 1) if an extension is missing, unpublished, deprecated, or listed twice.
// Warns about extensions that have not been updated for STALE_YEARS years.
//
// Usage: node scripts/verify-pack.mjs [--all]   (--all prints every extension, not only problems)

import { readFile } from "node:fs/promises";

const STALE_YEARS = 3;
const GALLERY = "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery";
const CONTROL = "https://main.vscode-cdn.net/extensions/marketplace.json";
const showAll = process.argv.includes("--all");

const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const ids = pkg.extensionPack ?? [];
const lower = (s) => s.toLowerCase();

let failed = false;
const fail = (msg) => { failed = true; console.log(`FAIL  ${msg}`); };
const warn = (msg) => console.log(`WARN  ${msg}`);

// duplicates (IDs are case-insensitive)
const seen = new Set();
for (const id of ids) {
  if (seen.has(lower(id))) fail(`${id}: listed more than once`);
  seen.add(lower(id));
}

const [gallery, control] = await Promise.all([
  fetch(GALLERY, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json;api-version=3.0-preview.1" },
    body: JSON.stringify({
      filters: [{ criteria: ids.map((value) => ({ filterType: 7, value })), pageSize: ids.length }],
      flags: 0x100, // include statistics/flags
    }),
  }).then((r) => { if (!r.ok) throw new Error(`Marketplace query failed: ${r.status}`); return r.json(); }),
  fetch(CONTROL).then((r) => { if (!r.ok) throw new Error(`Deprecation list fetch failed: ${r.status}`); return r.json(); }),
]);

const found = new Map(
  gallery.results[0].extensions.map((e) => [lower(`${e.publisher.publisherName}.${e.extensionName}`), e]),
);
const deprecated = new Map(Object.entries(control.deprecated ?? {}).map(([k, v]) => [lower(k), v]));
const malicious = new Set((control.malicious ?? []).map(lower));
const staleBefore = new Date();
staleBefore.setFullYear(staleBefore.getFullYear() - STALE_YEARS);

for (const id of ids) {
  const e = found.get(lower(id));
  if (malicious.has(lower(id))) fail(`${id}: flagged as malicious by the Marketplace`);
  if (!e) { fail(`${id}: not found on the Marketplace`); continue; }
  const flags = String(e.flags);
  if (flags.includes("unpublished")) fail(`${id}: unpublished`);
  if (deprecated.has(lower(id))) {
    const d = deprecated.get(lower(id));
    const alt = d?.extension?.id ? ` (use ${d.extension.id})` : d?.settings ? ` (use settings: ${d.settings.join(", ")})` : "";
    fail(`${id}: deprecated${alt}`);
  }
  const updated = new Date(e.lastUpdated);
  if (updated < staleBefore) warn(`${id}: last updated ${updated.toISOString().slice(0, 10)}`);
  else if (showAll) console.log(`ok    ${id}: last updated ${updated.toISOString().slice(0, 10)}`);
}

console.log(`\n${ids.length} extensions checked: ${failed ? "FAILED" : "all published and not deprecated"}.`);
process.exit(failed ? 1 : 0);
