// Builds every sub-pack and the main pack into dist/.
// Extra arguments are passed to `vsce package` (e.g. --pre-release).

import { mkdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { root, packDefs, packDir } from "./packs.mjs";

const vsce = join(root, "node_modules", "@vscode", "vsce", "vsce");
const dist = join(root, "dist");
const extra = process.argv.slice(2);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);

const dirs = [...packDefs().map(packDir), root];
for (const cwd of dirs) {
  const r = spawnSync(process.execPath, [vsce, "package", "--no-dependencies", "--out", dist + "/", ...extra], {
    cwd,
    stdio: "inherit",
  });
  if (r.status !== 0) {
    console.error(`vsce package failed in ${cwd}`);
    process.exit(r.status ?? 1);
  }
}
