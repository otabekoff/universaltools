// Integration tests, run inside VS Code by test/run-integration.mjs.
// No test framework: each test is an async function; any thrown error fails the run.

const assert = require("node:assert/strict");
const vscode = require("vscode");

const EXT_ID = "universaltools.universaltools";

// What UniversalTools installs: its sub-packs, then every extension they list (once, case-insensitive).
const packContents = require("../../src/pack-contents.json");
const extensionPack = [
  ...new Map([...Object.keys(packContents), ...Object.values(packContents).flat()].map((id) => [id.toLowerCase(), id])).values(),
];

const tests = {
  async "extension is present and activates"() {
    const ext = vscode.extensions.getExtension(EXT_ID);
    assert.ok(ext, `${EXT_ID} not found`);
    await ext.activate();
    assert.equal(ext.isActive, true);
  },

  async "commands are registered"() {
    const all = await vscode.commands.getCommands(true);
    for (const id of ["universaltools.checkHealth", "universaltools.removeDroppedExtensions", "universaltools.openWalkthrough"]) {
      assert.ok(all.includes(id), `missing command ${id}`);
    }
  },

  async "recommended defaults take effect"() {
    const editor = vscode.workspace.getConfiguration("editor");
    assert.equal(editor.inspect("linkedEditing").defaultValue, true, "editor.linkedEditing");
    assert.equal(editor.inspect("guides.bracketPairs").defaultValue, "active", "editor.guides.bracketPairs");
    for (const [languageId, formatter] of [
      ["css", "esbenp.prettier-vscode"],
      ["scss", "esbenp.prettier-vscode"],
      ["less", "esbenp.prettier-vscode"],
      ["xml", "redhat.vscode-xml"],
    ]) {
      const value = vscode.workspace.getConfiguration("editor", { languageId }).get("defaultFormatter");
      assert.equal(value, formatter, `[${languageId}] editor.defaultFormatter`);
    }
  },

  async "health check reports every pack extension as missing in a clean profile"() {
    const result = await vscode.commands.executeCommand("universaltools.checkHealth", { silent: true });
    assert.equal(result.total, extensionPack.length);
    assert.deepEqual(result.missing, extensionPack);
    assert.deepEqual(result.dropped, []);
  },

  async "remove-dropped finds nothing in a clean profile"() {
    const result = await vscode.commands.executeCommand("universaltools.removeDroppedExtensions", { silent: true });
    assert.deepEqual(result, { found: [], removed: [] });
  },

  async "dropped list and pack list do not overlap"() {
    const dropped = require("../../src/dropped").flatMap((g) => g.ids.map((id) => id.toLowerCase()));
    const overlap = extensionPack.filter((id) => dropped.includes(id.toLowerCase()));
    assert.deepEqual(overlap, [], "an extension is both in the pack and in the dropped list");
  },

  async "main pack installs exactly the sub-packs"() {
    const { extensionPack: listed } = vscode.extensions.getExtension(EXT_ID).packageJSON;
    assert.deepEqual(listed, Object.keys(packContents));
  },

  async "walkthrough is contributed with its markdown pages"() {
    const ext = vscode.extensions.getExtension(EXT_ID);
    const [walkthrough] = ext.packageJSON.contributes.walkthroughs;
    assert.equal(walkthrough.id, "universaltools.welcome");
    for (const step of walkthrough.steps) {
      const uri = vscode.Uri.joinPath(ext.extensionUri, step.media.markdown);
      await vscode.workspace.fs.stat(uri); // throws if the file is missing
    }
  },
};

async function run() {
  let failed = 0;
  for (const [name, fn] of Object.entries(tests)) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
    } catch (err) {
      failed++;
      console.error(`  ✗ ${name}\n    ${err.message}`);
    }
  }
  console.log(`\n${Object.keys(tests).length - failed} passed, ${failed} failed`);
  if (failed) throw new Error(`${failed} integration test(s) failed`);
}

module.exports = { run };
