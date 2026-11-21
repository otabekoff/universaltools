// Generates packs/<dir>/ (package.json, README.md, LICENSE, CHANGELOG.md, icon.png) and icon.png from
// packs/packs.json, sets the main pack's "extensionPack" to the sub-packs, and writes
// src/pack-contents.json for the health check.
//
// Usage:
//   node scripts/sync-packs.mjs           write everything (icons only when missing)
//   node scripts/sync-packs.mjs --icons   also redraw every icon, the main pack's included (scripts/make-icon.mjs)
//   node scripts/sync-packs.mjs --check   change nothing; exit 1 if any generated file is out of date

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { root, rootPkg, packDefs, packName, packId, packDir, inMain, readJson } from "./packs.mjs";
import { renderIcon } from "./make-icon.mjs";

const mainStyle = readJson(join(root, "packs", "packs.json")).main;

const check = process.argv.includes("--check");
const redrawIcons = process.argv.includes("--icons");
const main = rootPkg();
const repo = main.repository.url;
const json = (value) => JSON.stringify(value, null, 4) + "\n";
const stale = [];

function put(file, content) {
  const current = existsSync(file) ? readFileSync(file, "utf8").replace(/\r\n/g, "\n") : null;
  if (current === content) return;
  if (check) stale.push(file.slice(root.length + 1));
  else writeFileSync(file, content);
}

const marketplace = (id) => `https://marketplace.visualstudio.com/items?itemName=${id}`;

for (const def of packDefs()) {
  const dir = packDir(def);
  if (!check) mkdirSync(dir, { recursive: true });

  const pkg = {
    name: packName(def),
    displayName: def.displayName,
    description: def.description,
    version: main.version,
    publisher: main.publisher,
    author: main.author,
    license: main.license,
    icon: "icon.png",
    galleryBanner: main.galleryBanner,
    homepage: `${repo}/tree/master/packs/${def.dir}#readme`,
    bugs: main.bugs,
    repository: { ...main.repository, directory: `packs/${def.dir}` },
    engines: main.engines,
    categories: ["Extension Packs"],
    keywords: def.keywords,
    extensionPack: def.extensions,
  };
  put(join(dir, "package.json"), json(pkg));

  const rows = def.extensions.map((id) => `| [${id}](${marketplace(id)}) |`).join("\n");
  put(
    join(dir, "README.md"),
    `# ${def.displayName}

${def.description}

${
  inMain(def)
    ? `Part of [UniversalTools](${marketplace(`${main.publisher}.${main.name}`)}), which installs this pack together with the other UniversalTools packs. Install this one on its own if you only need these extensions.`
    : `A standalone UniversalTools pack. The main [UniversalTools](${marketplace(`${main.publisher}.${main.name}`)}) web pack does not install it; install it on its own when you need these extensions.`
}

**Developer:** [${main.author.name}](${main.author.url}) · [Source code](${repo}/tree/master/packs/${def.dir}) · [Report an issue](${main.bugs.url})

## Included extensions

| Extension |
|---|
${rows}

## License

MIT
`,
  );

  put(join(dir, "LICENSE"), readFileSync(join(root, "LICENSE"), "utf8").replace(/\r\n/g, "\n"));

  // a pack ships only its manifest, README, CHANGELOG, LICENSE and icon (vsce adds those itself)
  put(join(dir, ".vscodeignore"), "**/*.vsix\n**/.DS_Store\n");

  const changelog = join(dir, "CHANGELOG.md");
  if (!existsSync(changelog) && !check) {
    writeFileSync(
      changelog,
      `# Change Log\n\n## [${main.version}]\n\n- ${inMain(def) ? `First release as a separate pack, split out of UniversalTools ${main.version}.` : "First release."}\n`,
    );
  }

  const icon = join(dir, "icon.png");
  if (!check && (redrawIcons || !existsSync(icon))) renderIcon(icon, def.accent, def.icon, def.iconColor);
  if (check && !existsSync(icon)) stale.push(`packs/${def.dir}/icon.png`);
}

// the main pack's own icon
const mainIcon = join(root, "icon.png");
if (!check && (redrawIcons || !existsSync(mainIcon))) renderIcon(mainIcon, mainStyle.accent, mainStyle.icon, mainStyle.iconColor);

// main pack: installs the sub-packs
const mainPkg = rootPkg();
mainPkg.extensionPack = packDefs().filter(inMain).map((def) => packId(def, main.publisher));
put(join(root, "package.json"), json(mainPkg));

// list of what each sub-pack installs, used by the health check in extension.js
const contents = Object.fromEntries(packDefs().filter(inMain).map((def) => [packId(def, main.publisher), def.extensions]));
put(join(root, "src", "pack-contents.json"), json(contents));

if (check) {
  if (stale.length) {
    console.error(`Out of date (run "npm run sync"):\n  ${stale.join("\n  ")}`);
    process.exit(1);
  }
  console.log("Sub-packs are in sync with packs/packs.json.");
} else {
  console.log(`Synced ${packDefs().length} sub-packs.`);
}
