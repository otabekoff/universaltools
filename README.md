# UniversalTools

A curated extension pack for web development: Vue, React, Svelte, Astro, Tailwind, Vite/Vitest, Node.js and more, installed in one click.

**Developer:** [Otabek Sadiridinov](https://github.com/otabekoff) · [Source code](https://github.com/otabekoff/universaltools) · [Report an issue](https://github.com/otabekoff/universaltools/issues)

See [CHANGELOG.md](CHANGELOG.md) for what each release added or removed, and why.

## Features

Besides installing the extensions, UniversalTools:

- **Turns on recommended settings** as defaults: auto rename tag, bracket pair guides, and Prettier / Red Hat XML as formatters for CSS, SCSS, Less and XML. Anything you set yourself still wins. Details are under [Recommended settings](#recommended-settings).
- **Opens a Get Started walkthrough** after install. Reopen it any time with **UniversalTools: Get Started**.
- **UniversalTools: Check Pack Health** shows which pack extensions are missing or disabled, and installs the missing ones.
- **UniversalTools: Remove Extensions Dropped in 4.0** lists extensions from older versions of the pack that are still installed and uninstalls the ones you tick.

## What's included

UniversalTools installs five smaller packs. Install any of them on its own if you only need part of the set.

| Pack | What it contains |
|---|---|
| [UniversalTools: Web Core](https://marketplace.visualstudio.com/items?itemName=universaltools.universaltools-web-core) | ESLint, Prettier, Biome, Oxc, EditorConfig · GitLens, GitHub Pull Requests, GitHub Actions · Live Preview, Live Server, Open in Browser, Firefox Debugger, Microsoft Edge Tools · Live Share · Vitest, Playwright · npm and Path IntelliSense, npm Browser, Import Cost, REST Client, dotenv · Prisma, Container Tools, YAML, TOML, XML · Error Lens, Pretty TypeScript Errors, Code Spell Checker, Better Todo Tree, i18n Ally, Iconify, Markdown All in One, markdownlint, Open file from path, SVG, Image preview |
| [UniversalTools: HTML & CSS](https://marketplace.visualstudio.com/items?itemName=universaltools.universaltools-html-css) | Auto Close Tag, Highlight Matching Tag, Split HTML Attributes, Emmet Live · Tailwind CSS, UnoCSS, PostCSS, Stylelint · CSS IntelliSense for HTML, CSS Peek, Some Sass, Sass (indented), Stylus, Live Sass Compiler, Color Highlight, HTML to CSS (two) |
| [UniversalTools: Frameworks](https://marketplace.visualstudio.com/items?itemName=universaltools.universaltools-frameworks) | Vue - Official, Svelte, Astro, MDX, Simple React Snippets, React on the fly, Slidev, Tauri |
| [UniversalTools: Quasar](https://marketplace.visualstudio.com/items?itemName=universaltools.universaltools-quasar) | Vue - Official, Common Intellisense (Quasar 2 components), Quasar IntelliSense (Quasar CSS classes) |
| [UniversalTools: Everyday Tools](https://marketplace.visualstudio.com/items?itemName=universaltools.universaltools-everyday-tools) | CodeSnap, Google Translate, Code Runner, Terminal Keeper, PDF viewer, Random Everything, DateTime, When Did I Start Working, Format in Context Menus · Material Icon Theme, Shades of Purple theme |

The full lists are in [packs/packs.json](https://github.com/otabekoff/universaltools/blob/master/packs/packs.json).

## Language packs

Separate packs for other languages. The main UniversalTools pack does **not** install these; install the ones you need.

| Pack | What it contains |
|---|---|
| [UniversalTools: Python](https://marketplace.visualstudio.com/items?itemName=universaltools.universaltools-python) | Python, Pylance, Python Debugger, Python Environments, Ruff, Jupyter, Mypy |
| [UniversalTools: C/C++](https://marketplace.visualstudio.com/items?itemName=universaltools.universaltools-cpp) | C/C++, CMake Tools, Makefile Tools, CodeLLDB |
| [UniversalTools: Rust](https://marketplace.visualstudio.com/items?itemName=universaltools.universaltools-rust) | rust-analyzer, CodeLLDB, Even Better TOML, Dependi |
| [UniversalTools: Dart & Flutter](https://marketplace.visualstudio.com/items?itemName=universaltools.universaltools-dart-flutter) | Dart, Flutter |
| [UniversalTools: Java & Kotlin](https://marketplace.visualstudio.com/items?itemName=universaltools.universaltools-java-kotlin) | Language Support for Java, Java Debugger, Java Test Runner, Maven, Gradle, Project Manager for Java, Kotlin by JetBrains |
| [UniversalTools: Mobile](https://marketplace.visualstudio.com/items?itemName=universaltools.universaltools-mobile) | Expo Tools, React Native Tools |
| [UniversalTools: Go](https://marketplace.visualstudio.com/items?itemName=universaltools.universaltools-go) | Go |

## Upgrading from 3.x

Version 4.0.0 removed many extensions (see the [changelog](CHANGELOG.md)). VS Code does not uninstall extensions when a pack drops them.

The easiest way: run **UniversalTools: Remove Extensions Dropped in 4.0** from the Command Palette (**Ctrl+Shift+P**) and untick anything you want to keep.

<details>
<summary>Or remove all of them at once in PowerShell</summary>

```powershell
@(
  # deprecated / replaced
  'CoenraadS.bracket-pair-colorizer','octref.vetur','johnsoncodehk.volar','liuji-jim.vue',
  'Equinusocio.vsc-material-theme','Equinusocio.vsc-community-material-theme','equinusocio.vsc-material-theme-icons',
  'VisualStudioExptTeam.vscodeintellicode','vsciot-vscode.vscode-arduino','eg2.vscode-npm-script',
  'formulahendry.auto-rename-tag','formulahendry.auto-complete-tag','ritwickdey.live-sass','tht13.html-preview-vscode',
  'sibiraj-s.vscode-scss-formatter','aeschli.vscode-css-formatter','mikeburgh.xml-format',
  'silvenon.mdx','xyc.vscode-mdx-preview','wayou.vscode-todo-highlight','mikestead.dotenv','Zignd.html-css-class-completion',
  'mrmlnc.vscode-scss','SimonSiefke.svg-preview','donjayamanne.githistory','Gruntfuggly.todo-tree',
  # old Vue 2 / Quasar v1 helpers
  'Wscats.vue','hollowtree.vue-snippets','vaniship.vue-ls-snippets','jojoee.vue-cheatsheet','titiaiev.vue-docs',
  'ishiyama.vue-autoimport','AttilioCapocchiani.vuejs-helper','DevEscalus.vuejs-component-creator',
  'adrianthedev.vueGenerator','dariofuzinato.vue-peek','mariorodeghiero.vue-theme',
  'SimonMosesOnazi.quasar-v1-snippets','abdelaziz18003.quasar-snippets','fkkmemi.memi-quasar-snippets',
  # Svelte extras, auto-import, CSS prefixers, second icon theme
  'ardenivanov.svelte-intellisense','fivethree.vscode-svelte-snippets','pivaszbs.svelte-autoimport','NickScialli.svelte-dark',
  'steoates.autoimport','sporiley.css-auto-prefix','mrmlnc.vscode-autoprefixer','mrmlnc.vscode-attrs-sorter',
  'vscode-icons-team.vscode-icons'
) | ForEach-Object { code --uninstall-extension $_ }
```

</details>

Java, Python/Jupyter, C++ and React Native extensions were moved out of this pack. Keep them installed if you use those languages.

## Recommended settings

UniversalTools sets these as **defaults**, so they work right after install. The table and the sections below explain each one, in case you want to change it: put your own value in `settings.json` (**Ctrl+Shift+P** → *Preferences: Open User Settings (JSON)*) and it overrides the pack's default.

| Setting | Default from UniversalTools | VS Code's own default |
|---|---|---|
| `editor.linkedEditing` | `true` | `false` |
| `editor.guides.bracketPairs` | `"active"` | `false` |
| `[css]`, `[scss]`, `[less]` → `editor.defaultFormatter` | `"esbenp.prettier-vscode"` | none |
| `[xml]` → `editor.defaultFormatter` | `"redhat.vscode-xml"` | none |

## Built-in replacements

These features used to need an extension and are now part of VS Code. They are on by default except where noted (and UniversalTools turns on the ones that aren't); setting them yourself makes sure they stay the way you want.

### Bracket pair colours (was Bracket Pair Colorizer)

```jsonc
"editor.bracketPairColorization.enabled": true,
"editor.guides.bracketPairs": "active"   // off by default; shows guide lines for the active pair
```

### Closing tags in HTML and JSX/TSX

VS Code closes HTML, Handlebars and Razor tags, and JSX/TSX tags, by itself. For Vue, XML, PHP and other languages, the pack keeps `formulahendry.auto-close-tag`.

```jsonc
"html.autoClosingTags": true,
"js/ts.autoClosingTags.enabled": true   // JSX/TSX; replaces the older javascript.* / typescript.autoClosingTags
```

### Auto rename tag (was Auto Rename Tag)

Editing an opening HTML tag also renames its closing tag. This is **off by default**:

```jsonc
"editor.linkedEditing": true
```

### npm scripts (was npm Script Runner)

The **NPM Scripts** view is hidden by default. In the Explorer, click the **…** menu at the top and tick **NPM Scripts**. To run a script with one click instead of opening `package.json`:

```jsonc
"npm.scriptExplorerAction": "run"
```

### Auto imports (was Auto Import)

VS Code's built-in TypeScript/JavaScript support suggests and adds imports as you type. No setting is needed.

## Settings for the replacement extensions

### Formatting CSS, SCSS and Less with Prettier (was CSS Formatter / SCSS Formatter)

```jsonc
"[css]":  { "editor.defaultFormatter": "esbenp.prettier-vscode" },
"[scss]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
"[less]": { "editor.defaultFormatter": "esbenp.prettier-vscode" }
```

### Formatting XML (was XML Format)

```jsonc
"xml.format.enabled": true,
"[xml]": { "editor.defaultFormatter": "redhat.vscode-xml" }
```

### TODO highlighting (was TODO Highlight and Todo Tree)

Better Todo Tree is the maintained fork of Todo Tree. It highlights tags in the editor as well as listing them in its panel, and it imports existing `todo-tree.*` settings:

```jsonc
"better-todo-tree.highlights.enabled": true,
"better-todo-tree.general.tags": ["TODO", "FIXME", "BUG", "HACK", "NOTE"]
```

### Live Sass Compiler (was ritwickdey.live-sass)

`glenn2223.live-sass` is the replacement named on the Marketplace and uses the same `liveSassCompile.settings.formats` setting, so you can keep your existing setting:

```jsonc
"liveSassCompile.settings.formats": [
  { "format": "compressed", "extensionName": ".min.css", "savePath": "/css" }
]
```

Start it with **Live Sass: Watch Sass** from the Command Palette.

### HTML preview (was HTML Preview)

With Live Preview, open an HTML file and click the preview button at the top right of the editor, or right-click the file and pick the preview option. Live Server (`ritwickdey.LiveServer`) is still in the pack if you prefer it.

### Vendor prefixes (was Autoprefixer / CSS Auto Prefix)

Add prefixes in your build instead of in the editor, so they always match your browser targets. Vite runs PostCSS automatically when a `postcss.config.js` is present:

```js
// postcss.config.js  (npm i -D autoprefixer)
export default { plugins: { autoprefixer: {} } }
```

### Themes and file icons (was Material Theme / vscode-icons)

The Material Theme is now **Vira Theme** (`vira.vsc-vira-theme`); install it yourself if you want it. The pack keeps one file icon theme, Material Icon Theme:

```jsonc
"workbench.iconTheme": "material-icon-theme"
```

## Development

Run `npm ci` once, then:

| Command | What it does |
|---|---|
| `npm run sync` | Regenerates `packs/<pack>/` and the main pack's list from `packs/packs.json`. Edit that file to add or remove extensions, then run this. `npm run sync:check` only reports drift (used in CI). |
| `npm run verify` | Checks every extension in the pack against the Marketplace. Fails if one is missing, unpublished, deprecated or listed twice; warns if one has not been updated for 3 years. |
| `npm run verify:all` | Same, and prints every extension with its last update date. |
| `npm run package` | Builds every sub-pack and the main pack into `dist/`. |
| `npm run test:install:local` | Installs every `.vsix` into a throwaway profile of your own VS Code and checks every extension arrives. Your normal profile is not touched. |
| `npm run test:install` | Same, but downloads a fresh VS Code first (used in CI). |
| `npm run test:integration` | Starts a downloaded VS Code with the extension loaded and tests the commands, the walkthrough and the default settings. |
| `npm test` | All of the above, in order. |
| `npm run icon` | Redraws every icon (main pack and sub-packs, 512×512) from the `accent` colour and white `icon` in `packs/packs.json`, using [Simple Icons](https://simpleicons.org) (CC0) and [Lucide](https://lucide.dev) (ISC). The Marketplace does not accept SVG icons, so they are rendered to PNG. |
| `npm run publish:openvsx-first` | One-time first upload to Open VSX with a token; see [RELEASING.md](RELEASING.md). |

The code is plain JavaScript with no build step: [extension.js](extension.js) holds the commands, [src/dropped.js](src/dropped.js) the list of extensions dropped in 4.0, and [walkthrough/](walkthrough/) the Get Started pages.

Releases are automated: see [RELEASING.md](RELEASING.md).

## Credits

Provided by [Otabek Sadiridinov](https://github.com/otabekoff) via [MohirLab](https://mohirlab.uz).

## License

[MIT](LICENSE)
