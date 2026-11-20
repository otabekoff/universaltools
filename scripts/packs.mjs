// Shared helpers for the main pack and the sub-packs defined in packs/packs.json.

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export const root = resolve(import.meta.dirname, "..");
export const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
export const rootPkg = () => readJson(join(root, "package.json"));
export const packDefs = () => readJson(join(root, "packs", "packs.json")).packs;

/** Extension name of a sub-pack, e.g. "universaltools-web-core". */
export const packName = (def) => `universaltools-${def.dir}`;
/** Full id of a sub-pack, e.g. "universaltools.universaltools-web-core". */
export const packId = (def, publisher = rootPkg().publisher) => `${publisher}.${packName(def)}`;
export const packDir = (def) => join(root, "packs", def.dir);

/** Every extension the sub-packs install, de-duplicated (case-insensitive), in definition order. */
export function leafExtensions() {
  const seen = new Set();
  const out = [];
  for (const def of packDefs()) {
    for (const id of def.extensions) {
      if (!seen.has(id.toLowerCase())) {
        seen.add(id.toLowerCase());
        out.push(id);
      }
    }
  }
  return out;
}

/** .vsix file names in dist/, sub-packs first and the main pack last (publishing order). */
export function vsixFiles(version = rootPkg().version) {
  const subs = packDefs().map((def) => `${packName(def)}-${version}.vsix`);
  return [...subs, `${rootPkg().name}-${version}.vsix`];
}
