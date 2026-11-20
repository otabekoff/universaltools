// Extensions that earlier versions of the pack installed but 4.0 no longer includes.
// `preselect: false` groups are offered for removal but not ticked, because people may still use them.

module.exports = [
  {
    label: "Deprecated or replaced",
    preselect: true,
    ids: [
      "CoenraadS.bracket-pair-colorizer", "octref.vetur", "johnsoncodehk.volar", "liuji-jim.vue",
      "Equinusocio.vsc-material-theme", "Equinusocio.vsc-community-material-theme", "equinusocio.vsc-material-theme-icons",
      "VisualStudioExptTeam.vscodeintellicode", "vsciot-vscode.vscode-arduino", "eg2.vscode-npm-script",
      "formulahendry.auto-rename-tag", "formulahendry.auto-complete-tag", "ritwickdey.live-sass", "tht13.html-preview-vscode",
      "sibiraj-s.vscode-scss-formatter", "aeschli.vscode-css-formatter", "mikeburgh.xml-format",
      "silvenon.mdx", "xyc.vscode-mdx-preview", "wayou.vscode-todo-highlight", "mikestead.dotenv",
      "Zignd.html-css-class-completion", "mrmlnc.vscode-scss", "SimonSiefke.svg-preview", "donjayamanne.githistory",
      "Gruntfuggly.todo-tree",
    ],
  },
  {
    label: "Old Vue 2 / Quasar v1 helpers",
    preselect: true,
    ids: [
      "Wscats.vue", "hollowtree.vue-snippets", "vaniship.vue-ls-snippets", "jojoee.vue-cheatsheet", "titiaiev.vue-docs",
      "ishiyama.vue-autoimport", "AttilioCapocchiani.vuejs-helper", "DevEscalus.vuejs-component-creator",
      "adrianthedev.vueGenerator", "dariofuzinato.vue-peek", "mariorodeghiero.vue-theme",
      "SimonMosesOnazi.quasar-v1-snippets", "abdelaziz18003.quasar-snippets", "fkkmemi.memi-quasar-snippets",
    ],
  },
  {
    label: "Redundant",
    preselect: true,
    ids: [
      "ardenivanov.svelte-intellisense", "fivethree.vscode-svelte-snippets", "pivaszbs.svelte-autoimport", "NickScialli.svelte-dark",
      "steoates.autoimport", "sporiley.css-auto-prefix", "mrmlnc.vscode-autoprefixer", "mrmlnc.vscode-attrs-sorter",
      "vscode-icons-team.vscode-icons",
    ],
  },
  {
    label: "Other languages (moved out of this web pack; keep them if you use these languages)",
    preselect: false,
    ids: [
      "redhat.java", "vscjava.vscode-java-debug", "vscjava.vscode-java-test",
      "ms-python.python", "ms-python.vscode-pylance", "ms-toolsai.jupyter", "ms-toolsai.jupyter-renderers",
      "ms-vscode.cpptools", "msjsdiag.vscode-react-native",
    ],
  },
];
