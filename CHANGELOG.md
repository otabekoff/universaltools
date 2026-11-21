# Change Log

All notable changes to the "universaltools" extension pack will be documented in this file.

## [4.4.0]

### New standalone packs

Not installed by the main UniversalTools web pack; install the ones you need.

- **UniversalTools: AI:** Claude Code (`anthropic.claude-code`), GitHub Copilot Chat (`GitHub.copilot-chat`), Codex (`openai.chatgpt`), Google Antigravity (`Google.google-antigravity`), Gemini Code Assist (`Google.geminicodeassist`), Cline (`saoudrizwan.claude-dev`), Continue (`Continue.continue`), Ollama (`Ollama.ollama`), Hugging Face provider for Copilot Chat (`HuggingFace.huggingface-vscode-chat`)
- **UniversalTools: DevOps & Config:** Remote - SSH (`ms-vscode-remote.remote-ssh`), Remote Explorer (`ms-vscode.remote-explorer`), PowerShell (`ms-vscode.PowerShell`), ShellCheck (`timonwong.shellcheck`), shell-format (`foxundermoon.shell-format`), NGINX Configuration Language Support (`ahmadalli.vscode-nginx-conf`), Apache Conf (`mrmlnc.vscode-apache`), systemd unit files (`coolbear.systemd-unit-file`), Log File Highlighter (`emilast.LogFileHighlighter`), Rainbow CSV (`mechatroner.rainbow-csv`)

### Changed

- **Web Core:** Oxc and Vitest are now installed through the Vite Plus Extension Pack (`VoidZero.vite-plus-extension-pack`), which contains exactly those two. Added Git History (`donjayamanne.githistory`).
- **C/C++:** C/C++ and CMake Tools are now installed through Microsoft's C/C++ Extension Pack (`ms-vscode.cpptools-extension-pack`), which also adds C/C++ DevTools and C/C++ Themes. Added CMake IntelliSense (`KylinIdeTeam.cmake-intellisence`) and TestMate C++ (`matepek.vscode-catch2-test-adapter`).
- README and extension description now credit the pack as provided by Otabek Sadiridinov via [MohirLab](https://mohirlab.uz).

Every extension was checked on the VS Code Marketplace in November 2026: published and not deprecated. Git History (last updated 2023) and Apache Conf (2019) are no longer updated but still work, and nothing maintained replaces them.

## [4.2.0]

### Added

- **Web Core:** Microsoft Edge Tools (`ms-edgedevtools.vscode-edge-devtools`), Live Share (`MS-vsliveshare.vsliveshare`)
- **Frameworks:** Slidev (`antfu.slidev`), Tauri (`tauri-apps.tauri-vscode`)
- **Everyday Tools:** Code Runner (`formulahendry.code-runner`), Terminal Keeper (`nguyenngoclong.terminal-keeper`), vscode-pdf (`tomoki1207.pdf`)

All seven were checked on the VS Code Marketplace: published, not deprecated, and maintained.

### New language packs

Standalone packs, **not** installed by the main UniversalTools web pack:

- **UniversalTools: Python:** Python, Pylance, Python Debugger, Python Environments, Ruff, Jupyter, Mypy
- **UniversalTools: C/C++:** C/C++, CMake Tools, Makefile Tools, CodeLLDB
- **UniversalTools: Rust:** rust-analyzer, CodeLLDB, Even Better TOML, Dependi
- **UniversalTools: Dart & Flutter:** Dart, Flutter
- **UniversalTools: Java & Kotlin:** Language Support for Java, Java Debugger, Java Test Runner, Maven, Gradle, Project Manager for Java, Kotlin by JetBrains
- **UniversalTools: Mobile:** Expo Tools, React Native Tools
- **UniversalTools: Go:** Go

### Changed

- **New icons:** every pack now has its own icon on a coloured tile: a `</>` code icon on yellow for UniversalTools, a toolbox for Everyday Tools, a globe for Web Core, and the language or framework logo, in its brand colour, for the other packs. Icons come from Simple Icons (CC0), Lucide (ISC) and the official C++ logo, and each is scaled by its outline so the spacing is the same on every icon.
- **Check Pack Health** now groups leftover extensions by why they were dropped, and says clearly that the Python, C/C++, Java and React Native extensions are not deprecated.

## [4.0.0]

A clean-up release: deprecated and unmaintained extensions are removed, and modern replacements are added.
Removing an extension from a pack does not uninstall it, so you can uninstall the old ones yourself (see the README).
For features that are now built into VS Code, see **Built-in replacements** in the README.

Every removal below was checked against the VS Code Marketplace (its deprecation list and each extension's page) in November 2026.

### Changed

- New icon (512×512 PNG).
- Requires VS Code 1.90 or newer (was 1.44).
- The pack is now focused on web development plus everyday tools: 97 → 69 extensions.
- **Split into five packs** that UniversalTools installs together, each also available on its own: **Web Core**, **HTML & CSS**, **Frameworks**, **Quasar** and **Everyday Tools**.
- **New Quasar pack** for Quasar 2: `simonhe.common-intellisense` (Quasar 2 component IntelliSense) and `hossaini.quasar-intellisense` (Quasar CSS classes), with `Vue.volar`.
- The pack is now a small extension too:
  - **Recommended settings as defaults:** `editor.linkedEditing`, `editor.guides.bracketPairs: "active"`, Prettier for CSS/SCSS/Less and Red Hat XML for XML. Your own settings still win.
  - **Get Started walkthrough**, shown after install.
  - **UniversalTools: Check Pack Health** and **UniversalTools: Remove Extensions Dropped in 4.0** commands.
- License holder is now Otabek Sadiridinov.
- Developer, homepage, issue tracker, keywords and Marketplace banner added to the manifest.
- New checks: `npm run verify` tests every extension against the Marketplace, `npm run test:install` installs the built pack into a clean VS Code, and `npm run test:integration` tests the commands, walkthrough and defaults inside VS Code.
- Releases are automated with GitHub Actions and published with Marketplace Trusted Publishing (see RELEASING.md).

### Removed: deprecated on the Marketplace

| Removed | Marketplace status | Replaced by |
|---|---|---|
| `CoenraadS.bracket-pair-colorizer` | Deprecated and unpublished; replaced by built-in settings | Built in: `editor.bracketPairColorization.enabled`, `editor.guides.bracketPairs` |
| `Equinusocio.vsc-material-theme`, `equinusocio.vsc-material-theme-icons` | Deprecated, install blocked: "Material Theme is now Vira Theme" | `PKief.material-icon-theme` (already included) for file icons; the author's successor is `vira.vsc-vira-theme` |
| `Equinusocio.vsc-community-material-theme` | Deprecated, unpublished, install blocked | As above |
| `VisualStudioExptTeam.vscodeintellicode` | Deprecated, install blocked; Marketplace points to GitHub Copilot Chat | Nothing in the pack |
| `vsciot-vscode.vscode-arduino` | Deprecated and unpublished: "no longer maintained" | Nothing (not web development) |
| `eg2.vscode-npm-script` | Deprecated | Built in: **NPM Scripts** view |
| `ritwickdey.live-sass` | Deprecated, install blocked; Marketplace points to the new one | `glenn2223.live-sass` |
| `tht13.html-preview-vscode` | Deprecated | `ms-vscode.live-server` (Live Preview) |
| `silvenon.mdx` | Deprecated, install blocked; Marketplace points to the new one | `unifiedjs.vscode-mdx` |
| `liuji-jim.vue` | Deprecated, install blocked; Marketplace points to the Vue language extension | `Vue.volar` |
| `johnsoncodehk.volar` | No longer on the Marketplace (moved to `Vue.volar`) | `Vue.volar` (Vue - Official) |

### Removed: superseded, or not updated for years

| Removed | Evidence | Replaced by |
|---|---|---|
| `octref.vetur` | Its own page points to the new official Vue extension; last updated 2023 | `Vue.volar` |
| `formulahendry.auto-rename-tag` | Its own page says to use the built-in `editor.linkedEditing` (VS Code 1.44+); last updated 2022 | Built in: `editor.linkedEditing` |
| `formulahendry.auto-complete-tag` | Only bundles Auto Close Tag and Auto Rename Tag; last updated 2018 | Auto Close Tag stays in the pack; renaming is built in |
| `wayou.vscode-todo-highlight` | Last updated 2021 | `FanaticPythoner.better-todo-tree` (it also highlights) |
| `Gruntfuggly.todo-tree` | Last updated 2023 | `FanaticPythoner.better-todo-tree`, its maintained fork, which imports existing Todo Tree settings |
| `aeschli.vscode-css-formatter` | Last updated 2021 | `esbenp.prettier-vscode` (already included; formats CSS, SCSS and Less) |
| `sibiraj-s.vscode-scss-formatter` | Still maintained, but does the same job as Prettier | `esbenp.prettier-vscode` |
| `mikeburgh.xml-format` | Last updated 2022 | `redhat.vscode-xml` |
| `xyc.vscode-mdx-preview` | Last updated 2021 | `unifiedjs.vscode-mdx` |
| `mikestead.dotenv` | Last updated 2018 | `dotenv.dotenv-vscode` (official dotenv extension) |
| `Zignd.html-css-class-completion` | Last updated 2020 | `ecmel.vscode-html-css` (class and id completion) |
| `mrmlnc.vscode-scss` | Last updated 2021; Some Sass began as this extension and asks you to uninstall it | `SomewhatStationery.some-sass` |
| `SimonSiefke.svg-preview` | Last updated 2020 | `jock.svg` (live preview, editing, PNG export) |
| `donjayamanne.githistory` | Last updated 2023; VS Code now has a built-in Source Control Graph | Built in, plus `eamodio.gitlens` (already included) |

### Removed: old Vue 2 and Quasar v1 helpers

Covered by `Vue.volar`: `Wscats.vue`, `hollowtree.vue-snippets`, `vaniship.vue-ls-snippets`, `jojoee.vue-cheatsheet`, `titiaiev.vue-docs`, `ishiyama.vue-autoimport`, `AttilioCapocchiani.vuejs-helper`, `DevEscalus.vuejs-component-creator`, `adrianthedev.vueGenerator`, `dariofuzinato.vue-peek`, `mariorodeghiero.vue-theme`, `SimonMosesOnazi.quasar-v1-snippets`, `abdelaziz18003.quasar-snippets`, `fkkmemi.memi-quasar-snippets`.

### Removed: redundant

| Removed | Covered by |
|---|---|
| `ardenivanov.svelte-intellisense`, `fivethree.vscode-svelte-snippets`, `pivaszbs.svelte-autoimport`, `NickScialli.svelte-dark` | `svelte.svelte-vscode` |
| `steoates.autoimport` | VS Code's built-in TypeScript/JavaScript auto imports |
| `sporiley.css-auto-prefix`, `mrmlnc.vscode-autoprefixer`, `mrmlnc.vscode-attrs-sorter` | Autoprefixer through PostCSS in your build |
| `vscode-icons-team.vscode-icons` | `PKief.material-icon-theme` (one icon theme is enough) |

### Removed: not web development

- **Moved to separate packs (planned):** `redhat.java`, `vscjava.vscode-java-debug`, `vscjava.vscode-java-test`, `ms-python.python`, `ms-python.vscode-pylance`, `ms-toolsai.jupyter`, `ms-toolsai.jupyter-renderers`, `ms-vscode.cpptools`, `msjsdiag.vscode-react-native`.

### Kept

These were considered for removal but are still maintained or still needed:

- Everyday tools: `adpyke.codesnap`, `funkyremi.vscode-google-translate`, `helixquar.randomeverything`, `rid9.datetime`, `madprops.when-did-i-start-working`, `lacroixdavid1.vscode-format-context-menu`.
- `ritwickdey.LiveServer`: updated in 2026.
- `techer.open-in-browser`: updated in 2026.
- `formulahendry.auto-close-tag`: VS Code closes tags itself only in HTML, Handlebars and Razor (and JSX/TSX); this extension adds it for Vue, XML, PHP and others.
- `burkeholland.simple-react-snippets`: updated in 2024. The suggested replacement, `dsznajder.es7-react-js-snippets`, was last updated in 2022, so it was not added.

### Added

- **Lint / format:** `biomejs.biome`, `oxc.oxc-vscode`, `EditorConfig.EditorConfig`, `stylelint.vscode-stylelint`
- **CSS:** `bradlc.vscode-tailwindcss`, `antfu.unocss`, `csstools.postcss`, `ecmel.vscode-html-css`
- **Testing:** `vitest.explorer`, `ms-playwright.playwright`
- **Quality of life:** `usernamehw.errorlens`, `yoavbls.pretty-ts-errors`, `streetsidesoftware.code-spell-checker`, `dotenv.dotenv-vscode`, `antfu.iconify`, `Lokalise.i18n-ally`, `FanaticPythoner.better-todo-tree`
- **Tooling:** `Prisma.prisma`, `GitHub.vscode-github-actions`, `ms-azuretools.vscode-containers`, `tamasfe.even-better-toml`, `redhat.vscode-xml`
- **Frameworks:** `Vue.volar`, `astro-build.astro-vscode`, `unifiedjs.vscode-mdx`
- **Preview / Sass:** `ms-vscode.live-server`, `glenn2223.live-sass`, `SomewhatStationery.some-sass`, `jock.svg`
- **Editing:** `christian-kohler.path-intellisense`, `redhat.vscode-yaml`, `DavidAnson.vscode-markdownlint`
- **GitHub:** `GitHub.vscode-pull-request-github`

## [Release 0.0.1]

- Initial release
- Added all necessary extensions
- Added a new theme(Shades of purple)
- Added file icon theme(VSCode icons)
- Version 0.0.1 release upgraded
