// ONE-TIME: publishes every .vsix in dist/ to Open VSX with an access token, web sub-packs first, then the main pack, then the language packs.
// Open VSX Trusted Publishing only works for extensions that already exist there, so the very
// first version must be uploaded this way. After that, the Release workflow publishes with
// Trusted Publishing and no token. See RELEASING.md.
//
// Usage (PowerShell):  $env:OVSX_PAT = "<token>"; npm run publish:openvsx-first; Remove-Item Env:OVSX_PAT

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { root, vsixFiles } from "./packs.mjs";

if (!process.env.OVSX_PAT) {
  console.error('Set the token first, e.g. in PowerShell: $env:OVSX_PAT = "<token>"');
  process.exit(1);
}

const cli = join(root, "node_modules", "ovsx", "bin", "ovsx");

for (const file of vsixFiles()) {
  const vsix = join(root, "dist", file);
  if (!existsSync(vsix)) {
    console.error(`Missing ${vsix}. Run "npm run package" first.`);
    process.exit(1);
  }
  console.log(`Publishing ${file} to Open VSX ...`);
  // ovsx reads the token from the OVSX_PAT environment variable
  const r = spawnSync(process.execPath, [cli, "publish", "--packagePath", vsix, "--skip-duplicate"], { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
console.log("Done. Now register the Trusted Publishers (RELEASING.md) and delete the token.");
