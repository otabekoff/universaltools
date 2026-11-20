// Installs the built .vsix into a throwaway VS Code profile and checks that every
// extension listed in "extensionPack" was installed alongside it.
//
// Usage:
//   node scripts/install-test.mjs                 download VS Code stable (used in CI)
//   node scripts/install-test.mjs --use-installed use the `code` command on PATH
//
// Your own VS Code profile and extensions are never touched: --user-data-dir and
// --extensions-dir point at a temporary folder that is deleted afterwards.

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const vsix = join(root, `${pkg.name}-${pkg.version}.vsix`);
if (!existsSync(vsix)) {
  console.error(`Missing ${vsix}. Run "npm run package" first.`);
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
  console.log(`Installing ${vsix} into ${tmp} ...`);
  run("--install-extension", vsix);
  const installed = new Set(run("--list-extensions").split(/\r?\n/).filter(Boolean).map((s) => s.toLowerCase()));

  const self = `${pkg.publisher}.${pkg.name}`.toLowerCase();
  const missing = pkg.extensionPack.filter((id) => !installed.has(id.toLowerCase()));
  if (!installed.has(self)) missing.unshift(`${self} (the pack itself)`);

  console.log(`Installed ${installed.size} extensions; pack lists ${pkg.extensionPack.length}.`);
  if (missing.length) {
    console.error(`Missing after install:\n  ${missing.join("\n  ")}`);
    process.exitCode = 1;
  } else {
    console.log("OK: the pack and every extension in it installed.");
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
