// Checks every extension the sub-packs in packs/packs.json install against the VS Code Marketplace.
// Fails (exit 1) if an extension is missing, unpublished, deprecated, or listed twice in one pack.
// Warns about extensions that have not been updated for STALE_YEARS years.
// The sub-packs themselves are built in this repo, so they are only reported, never failed.
//
// Usage: node scripts/verify-pack.mjs [--all]   (--all prints every extension, not only problems)

import { packDefs, packId, leafExtensions } from "./packs.mjs";

const STALE_YEARS = 3;
const GALLERY = "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery";
const CONTROL = "https://main.vscode-cdn.net/extensions/marketplace.json";
const showAll = process.argv.includes("--all");

const ids = leafExtensions();
const subPackIds = packDefs().map((def) => packId(def));
const lower = (s) => s.toLowerCase();

let failed = false;
const fail = (msg) => { failed = true; console.log(`FAIL  ${msg}`); };
const warn = (msg) => console.log(`WARN  ${msg}`);

// duplicates inside one pack (IDs are case-insensitive); the same extension in two packs is fine
for (const def of packDefs()) {
  const seen = new Set();
  for (const id of def.extensions) {
    if (seen.has(lower(id))) fail(`${id}: listed more than once in packs/${def.dir}`);
    seen.add(lower(id));
  }
}

const [gallery, control] = await Promise.all([
  fetch(GALLERY, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json;api-version=3.0-preview.1" },
    body: JSON.stringify({
      filters: [{ criteria: [...ids, ...subPackIds].map((value) => ({ filterType: 7, value })), pageSize: ids.length + subPackIds.length }],
      flags: 0x100 | 0x1, // include statistics/flags and the latest version
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

for (const id of subPackIds) {
  const e = found.get(lower(id));
  console.log(`info  ${id}: ${e ? `on the Marketplace, v${e.versions?.[0]?.version ?? "?"}` : "not published yet (built from this repo)"}`);
}

console.log(`\n${ids.length} extensions checked: ${failed ? "FAILED" : "all published and not deprecated"}.`);
process.exit(failed ? 1 : 0);
