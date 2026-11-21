// Installs every built .vsix from dist/ (web sub-packs, main pack, language packs) into a throwaway
// VS Code profile and checks that every pack and every extension they list was installed.
//
// Usage:
//   node scripts/install-test.mjs                 download VS Code stable (used in CI)
//   node scripts/install-test.mjs --use-installed use the `code` command on PATH
//
// Your own VS Code profile and extensions are never touched: --user-data-dir and
// --extensions-dir point at a temporary folder that is deleted afterwards.

import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { root, rootPkg, packDefs, packId, leafExtensions, vsixFiles } from "./packs.mjs";

const pkg = rootPkg();
const files = vsixFiles().map((f) => join(root, "dist", f));
const absent = files.filter((f) => !existsSync(f));
if (absent.length) {
  console.error(`Missing:\n  ${absent.join("\n  ")}\nRun "npm run package" first.`);
  process.exit(1);
}

let cli = "code";
if (!process.argv.includes("--use-installed")) {
  const { downloadAndUnzipVSCode, resolveCliPathFromVSCodeExecutablePath } = await import("@vscode/test-electron");
  cli = resolveCliPathFromVSCodeExecutablePath(await downloadAndUnzipVSCode("stable"));
}

const tmp = mkdtempSync(join(tmpdir(), "ut-install-test-"));
const profile = [`--user-data-dir=${join(tmp, "data")}`, `--extensions-dir=${join(tmp, "ext")}`];
const win = process.platform === "win32"; // `code` is a .cmd there, so it needs a shell
// quote only when needed: a quoted `"code"` breaks how code.cmd locates its own folder
const q = (s) => (win && /\s/.test(s) ? `"${s}"` : s);
const run = (...args) => {
  const all = [...profile, ...args];
  const r = win
    ? spawnSync([cli, ...all].map(q).join(" "), { encoding: "utf8", shell: true })
    : spawnSync(cli, all, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`${cli} ${args.join(" ")} failed:\n${r.stderr || r.stdout}`);
  return r.stdout;
};

try {
  for (const vsix of files) {
    console.log(`Installing ${vsix} ...`);
    run("--install-extension", vsix);
  }
  const installed = new Set(run("--list-extensions").split(/\r?\n/).filter(Boolean).map((s) => s.toLowerCase()));

  const expected = [`${pkg.publisher}.${pkg.name}`, ...packDefs().map((def) => packId(def)), ...leafExtensions()];
  const missing = expected.filter((id) => !installed.has(id.toLowerCase()));

  console.log(`Installed ${installed.size} extensions; expected ${expected.length} (main pack, ${packDefs().length} sub-packs, ${leafExtensions().length} extensions).`);
  if (missing.length) {
    console.error(`Missing after install:\n  ${missing.join("\n  ")}`);
    process.exitCode = 1;
  } else {
    console.log("OK: every pack and every extension in them installed.");
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
