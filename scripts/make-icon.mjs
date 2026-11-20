// Draws a UniversalTools icon: the blue gradient badge with four tiles, where the top-right
// tile carries the pack's accent colour and a flat white icon.
//
// Icons come from Simple Icons (brand/language logos, CC0) or Lucide (general icons, ISC):
//   "si:python"    -> simple-icons siPython
//   "lucide:globe" -> lucide-static icons/globe.svg
//
// Usage: node scripts/make-icon.mjs <out.png> <accent #RRGGBB> <icon>

import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import * as simpleIcons from "simple-icons";

const require = createRequire(import.meta.url);
const S = 1024; // drawing size; rendered to 512px
const OUT_PX = 512;

/** Returns the SVG markup for a white icon centred in a box at (cx, cy) of the given size. */
function glyph(icon, cx, cy, size) {
  const [source, name] = icon.split(":");
  if (source === "si") {
    const key = "si" + name.charAt(0).toUpperCase() + name.slice(1);
    const si = simpleIcons[key];
    if (!si) throw new Error(`Simple Icons has no "${key}"`);
    const scale = size / 24;
    return `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${scale})"><path fill="#FFFFFF" d="${si.path}"/></g>`;
  }
  if (source === "lucide") {
    const dir = dirname(require.resolve("lucide-static/package.json"));
    const svg = readFileSync(join(dir, "icons", `${name}.svg`), "utf8");
    const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
    const scale = size / 24;
    return `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${scale})" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;
  }
  throw new Error(`Unknown icon source in "${icon}" (use si:<name> or lucide:<name>)`);
}

export function iconSvg(accent, icon) {
  const tile = 250, gap = 56, r = 56;
  const x0 = (S - (2 * tile + gap)) / 2;
  const y0 = x0;
  const tiles = [
    [x0, y0 + tile + gap],
    [x0 + tile + gap, y0 + tile + gap],
    [x0, y0],
  ];
  const [ax, ay] = [x0 + tile + gap, y0]; // top-right: the accent tile
  const isLucide = icon.startsWith("lucide:");
  const rect = (x, y, fill, extra = "") => `<rect x="${x}" y="${y}" width="${tile}" height="${tile}" rx="${r}" fill="${fill}" ${extra}/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4F46E5"/>
      <stop offset="1" stop-color="#06B6D4"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="22"/>
      <feOffset dx="10" dy="22"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${S}" height="${S}" rx="${S * 0.22}" fill="url(#bg)"/>
  <g filter="url(#shadow)">
    ${tiles.map(([x, y]) => rect(x, y, "#FFFFFF", 'fill-opacity="0.94"')).join("\n    ")}
    ${rect(ax, ay, accent)}
  </g>
  ${glyph(icon, ax + tile / 2, ay + tile / 2, isLucide ? 150 : 140)}
</svg>`;
}

export function renderIcon(out, accent, icon) {
  const png = new Resvg(iconSvg(accent, icon), { fitTo: { mode: "width", value: OUT_PX } }).render().asPng();
  writeFileSync(out, png);
  console.log(`wrote ${out}`);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop())) {
  const [out, accent, icon] = process.argv.slice(2);
  if (!out || !accent || !icon) {
    console.error("Usage: node scripts/make-icon.mjs <out.png> <accent #RRGGBB> <icon>");
    process.exit(1);
  }
  renderIcon(out, accent, icon);
}
