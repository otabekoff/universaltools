// Runs test/suite inside a downloaded VS Code (stable) with this extension loaded in
// development mode. Other extensions are disabled and a temporary profile is used,
// so your own VS Code is not touched. On Linux CI, run it under xvfb-run.

import { runTests } from "@vscode/test-electron";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// When launched from a terminal inside VS Code this is set, and it would make the
// test instance start as plain Node.js ("bad option: --disable-extensions").
delete process.env.ELECTRON_RUN_AS_NODE;

const root = resolve(import.meta.dirname, "..");
const profile = mkdtempSync(join(tmpdir(), "ut-integration-"));

try {
  await runTests({
    extensionDevelopmentPath: root,
    extensionTestsPath: join(root, "test", "suite", "index.js"),
    launchArgs: ["--disable-extensions", "--skip-welcome", "--skip-release-notes", `--user-data-dir=${join(profile, "data")}`],
  });
} catch (err) {
  console.error("Integration tests failed:", err?.message ?? err);
  process.exitCode = 1;
} finally {
  rmSync(profile, { recursive: true, force: true });
}
