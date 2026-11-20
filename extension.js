// UniversalTools: commands that help keep the extension pack healthy.
// Plain CommonJS with no dependencies, so there is no build step.

const vscode = require("vscode");
const { extensionPack } = require("./package.json");
const dropped = require("./src/dropped");

const lower = (id) => id.toLowerCase();

/** Enabled extension ids in this VS Code window, lower-cased. */
function enabledIds() {
  return new Set(vscode.extensions.all.map((e) => lower(e.id)));
}

/** Extensions dropped from the pack that are still installed and enabled. */
function findDropped() {
  const have = enabledIds();
  return dropped.flatMap((group) =>
    group.ids.filter((id) => have.has(lower(id))).map((id) => ({ id, group: group.label, preselect: group.preselect })),
  );
}

/** Pack extensions that are not installed or are disabled. */
function findMissing() {
  const have = enabledIds();
  return extensionPack.filter((id) => !have.has(lower(id)));
}

async function removeDroppedExtensions(options = {}) {
  const found = findDropped();
  if (options.silent) return { found: found.map((f) => f.id), removed: [] };
  if (found.length === 0) {
    vscode.window.showInformationMessage("UniversalTools: none of the extensions dropped in 4.0 are installed.");
    return { found: [], removed: [] };
  }

  const items = [];
  for (const group of dropped) {
    const inGroup = found.filter((f) => f.group === group.label);
    if (!inGroup.length) continue;
    items.push({ label: group.label, kind: vscode.QuickPickItemKind.Separator });
    for (const f of inGroup) {
      const ext = vscode.extensions.getExtension(f.id);
      items.push({ label: ext?.packageJSON?.displayName ?? f.id, description: f.id, id: f.id, picked: f.preselect });
    }
  }

  const picked = await vscode.window.showQuickPick(items, {
    canPickMany: true,
    title: "Remove extensions dropped from UniversalTools 4.0",
    placeHolder: "Ticked extensions will be uninstalled. Untick any you want to keep.",
  });
  if (!picked || picked.length === 0) return { found: found.map((f) => f.id), removed: [] };

  const removed = [];
  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: "UniversalTools: uninstalling", cancellable: false },
    async (progress) => {
      for (const item of picked) {
        progress.report({ message: item.id, increment: 100 / picked.length });
        try {
          await vscode.commands.executeCommand("workbench.extensions.uninstallExtension", item.id);
          removed.push(item.id);
        } catch (err) {
          vscode.window.showWarningMessage(`Could not uninstall ${item.id}: ${err?.message ?? err}`);
        }
      }
    },
  );

  const choice = await vscode.window.showInformationMessage(
    `UniversalTools: uninstalled ${removed.length} extension(s). Reload the window to finish.`,
    "Reload Window",
  );
  if (choice === "Reload Window") await vscode.commands.executeCommand("workbench.action.reloadWindow");
  return { found: found.map((f) => f.id), removed };
}

async function checkHealth(options = {}) {
  const missing = findMissing();
  const leftovers = findDropped().map((f) => f.id);
  const result = { total: extensionPack.length, missing, dropped: leftovers };
  if (options.silent) return result;

  const out = getOutput();
  out.clear();
  out.appendLine(`UniversalTools pack health: ${extensionPack.length - missing.length}/${extensionPack.length} extensions installed and enabled.`);
  out.appendLine("");
  out.appendLine(missing.length ? "Missing or disabled:" : "Nothing is missing.");
  missing.forEach((id) => out.appendLine(`  - ${id}`));
  if (leftovers.length) {
    out.appendLine("");
    out.appendLine("Still installed, but dropped from the pack in 4.0:");
    leftovers.forEach((id) => out.appendLine(`  - ${id}`));
  }

  const actions = [];
  if (missing.length) actions.push("Install Missing");
  if (leftovers.length) actions.push("Remove Dropped");
  actions.push("Show Report");
  const summary = missing.length || leftovers.length
    ? `UniversalTools: ${missing.length} missing, ${leftovers.length} dropped extension(s) still installed.`
    : "UniversalTools: all pack extensions are installed and enabled.";
  const choice = await vscode.window.showInformationMessage(summary, ...actions);

  if (choice === "Show Report") out.show();
  if (choice === "Remove Dropped") await removeDroppedExtensions();
  if (choice === "Install Missing") {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: "UniversalTools: installing", cancellable: false },
      async (progress) => {
        for (const id of missing) {
          progress.report({ message: id, increment: 100 / missing.length });
          try {
            await vscode.commands.executeCommand("workbench.extensions.installExtension", id);
          } catch (err) {
            out.appendLine(`Could not install ${id}: ${err?.message ?? err}`);
          }
        }
      },
    );
    out.show();
  }
  return result;
}

function openWalkthrough() {
  return vscode.commands.executeCommand(
    "workbench.action.openWalkthrough",
    "universaltools.universaltools#universaltools.welcome",
    false,
  );
}

let output;
function getOutput() {
  output ??= vscode.window.createOutputChannel("UniversalTools");
  return output;
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("universaltools.removeDroppedExtensions", removeDroppedExtensions),
    vscode.commands.registerCommand("universaltools.checkHealth", checkHealth),
    vscode.commands.registerCommand("universaltools.openWalkthrough", openWalkthrough),
  );
}

function deactivate() {
  output?.dispose();
}

module.exports = { activate, deactivate };
