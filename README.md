# UniversalTools

A curated extension pack for web development: Vue, React, Svelte, Astro, Tailwind, Vite/Vitest, Node.js and more, installed in one click.

**Developer:** [Otabek Sadiridinov](https://github.com/otabekoff) · [Source code](https://github.com/otabekoff/universaltools) · [Report an issue](https://github.com/otabekoff/universaltools/issues)

See [CHANGELOG.md](CHANGELOG.md) for what each release added or removed, and why.

## What's included

| Area | Extensions |
|---|---|
| Frameworks | Vue - Official (`Vue.volar`), Svelte (`svelte.svelte-vscode`), Astro (`astro-build.astro-vscode`), MDX (`unifiedjs.vscode-mdx`), Simple React Snippets, React on the fly |
| Lint / format | ESLint, Prettier, Biome, Oxc, EditorConfig, Stylelint |
| CSS | Tailwind CSS IntelliSense, UnoCSS, PostCSS, CSS IntelliSense for HTML (`ecmel.vscode-html-css`), CSS Peek, Some Sass, Sass (indented), Stylus, Live Sass Compiler, Color Highlight, HTML to CSS, HTML-to-CSS autocompletion |
| HTML | Auto Close Tag, Highlight Matching Tag, Split HTML Attributes, Emmet Live |
| Preview / run | Live Preview, Live Server, Open in Browser, Firefox Debugger, SVG (preview and editing), Image preview in gutter |
| Testing | Vitest, Playwright |
| Node / npm | npm IntelliSense, Path IntelliSense, npm Browser, Import Cost, REST Client, dotenv |
| Git / GitHub | GitLens, GitHub Pull Requests, GitHub Actions (VS Code's built-in Source Control Graph replaces Git History) |
| Tooling | Prisma, Container Tools, YAML, Even Better TOML, XML (Red Hat) |
| Quality of life | Error Lens, Pretty TypeScript Errors, Code Spell Checker, Todo Tree, i18n Ally, Iconify, Markdown All in One, markdownlint, Open file from path |
| Look | Shades of Purple theme, Material Icon Theme |

The full list of IDs is in [package.json](package.json) under `extensionPack`.

## Upgrading from 3.x

Version 4.0.0 removed many extensions (see the [changelog](CHANGELOG.md)). VS Code does not uninstall extensions when a pack drops them, so remove the ones you no longer want yourself. To remove all of them at once in PowerShell:

```powershell
@(
  # deprecated / replaced
  'CoenraadS.bracket-pair-colorizer','octref.vetur','johnsoncodehk.volar','liuji-jim.vue',
  'Equinusocio.vsc-material-theme','Equinusocio.vsc-community-material-theme','equinusocio.vsc-material-theme-icons',
  'VisualStudioExptTeam.vscodeintellicode','vsciot-vscode.vscode-arduino','eg2.vscode-npm-script',
  'formulahendry.auto-rename-tag','formulahendry.auto-complete-tag','ritwickdey.live-sass','tht13.html-preview-vscode',
  'sibiraj-s.vscode-scss-formatter','aeschli.vscode-css-formatter','mikeburgh.xml-format',
  'silvenon.mdx','xyc.vscode-mdx-preview','wayou.vscode-todo-highlight','mikestead.dotenv','Zignd.html-css-class-completion',
  'mrmlnc.vscode-scss','SimonSiefke.svg-preview','donjayamanne.githistory',
  # old Vue 2 / Quasar v1 helpers
  'Wscats.vue','hollowtree.vue-snippets','vaniship.vue-ls-snippets','jojoee.vue-cheatsheet','titiaiev.vue-docs',
  'ishiyama.vue-autoimport','AttilioCapocchiani.vuejs-helper','DevEscalus.vuejs-component-creator',
  'adrianthedev.vueGenerator','dariofuzinato.vue-peek','mariorodeghiero.vue-theme',
  'SimonMosesOnazi.quasar-v1-snippets','abdelaziz18003.quasar-snippets','fkkmemi.memi-quasar-snippets',
  # Svelte extras, auto-import, CSS prefixers, second icon theme
  'ardenivanov.svelte-intellisense','fivethree.vscode-svelte-snippets','pivaszbs.svelte-autoimport','NickScialli.svelte-dark',
  'steoates.autoimport','sporiley.css-auto-prefix','mrmlnc.vscode-autoprefixer','mrmlnc.vscode-attrs-sorter',
  'vscode-icons-team.vscode-icons',
  # general utilities that are not web development
  'helixquar.randomeverything','madprops.when-did-i-start-working','rid9.datetime',
  'lacroixdavid1.vscode-format-context-menu','funkyremi.vscode-google-translate','adpyke.codesnap'
) | ForEach-Object { code --uninstall-extension $_ }
```

Java, Python/Jupyter, C++ and React Native extensions were moved out of this pack. Keep them installed if you use those languages.

## Built-in replacements

These features used to need an extension and are now part of VS Code. Add the settings to your `settings.json` (**Ctrl+Shift+P** → *Preferences: Open User Settings (JSON)*). They are on by default except where noted; setting them explicitly makes sure they stay on.

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

### TODO highlighting (was TODO Highlight)

Todo Tree highlights tags in the editor as well as listing them in its panel:

```jsonc
"todo-tree.highlights.enabled": true,
"todo-tree.general.tags": ["TODO", "FIXME", "BUG", "HACK", "NOTE"]
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
| `npm run verify` | Checks every extension in the pack against the Marketplace. Fails if one is missing, unpublished, deprecated or listed twice; warns if one has not been updated for 3 years. |
| `npm run verify:all` | Same, and prints every extension with its last update date. |
| `npm run package` | Builds `universaltools-<version>.vsix`. |
| `npm run test:install:local` | Installs the `.vsix` into a throwaway profile of your own VS Code and checks every extension arrives. Your normal profile is not touched. |
| `npm run test:install` | Same, but downloads a fresh VS Code first (used in CI). |
| `npm test` | `verify` + `package` + `test:install`. |
| `npm run icon` | Redraws `icon.png` (512×512) from `scripts/make-icon.py`; needs Python with Pillow. The Marketplace does not accept SVG icons. |

Releases are automated: see [RELEASING.md](RELEASING.md).

## License

[MIT](LICENSE)
