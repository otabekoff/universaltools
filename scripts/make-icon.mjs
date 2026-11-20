// Draws a UniversalTools icon: the blue gradient badge with four tiles, where the top-right
// tile carries the pack's accent colour and a flat white icon.
//
// Icons come from Simple Icons (brand/language logos, CC0), Lucide (general icons, ISC) or this repo:
//   "si:python"     -> simple-icons siPython
//   "lucide:wrench" -> lucide-static icons/wrench.svg
//   "custom:globe"  -> scripts/icons/globe.svg (24x24, stroke-based, drawn for this project)
//   "file:cpp-mark"  -> scripts/icons/cpp-mark.svg, a complete SVG drawn in its own colours
// Every icon is scaled by its visible outline to the same size (ICON_BOX), so spacing is identical.
// Icons are white unless the entry sets "iconColor".
// The accent is one colour ("#3776AB") or a diagonal gradient ("#E34F26>#1572B6").
//
// Usage: node scripts/make-icon.mjs <out.png> <accent> <icon>

import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import * as simpleIcons from "simple-icons";

const require = createRequire(import.meta.url);
const S = 1024; // drawing size; rendered to 512px
const OUT_PX = 512;

const ICON_BOX = 136; // every icon's visible outline is scaled to fit this square, so the gap to the tile edges is the same

const innerOf = (svg) =>
  svg.replace(/<!--[\s\S]*?-->/g, "").replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

/** An icon's markup in its own coordinates, plus the size of that coordinate space. */
function rawGlyph(icon, color) {
  const [source, name] = icon.split(":");
  if (source === "si") {
    const key = "si" + name.charAt(0).toUpperCase() + name.slice(1);
    const si = simpleIcons[key];
    if (!si) throw new Error(`Simple Icons has no "${key}"`);
    return { w: 24, h: 24, markup: `<path fill="${color}" d="${si.path}"/>` };
  }
  if (source === "lucide" || source === "custom") {
    const dir = source === "lucide"
      ? join(dirname(require.resolve("lucide-static/package.json")), "icons")
      : join(import.meta.dirname, "icons");
    const inner = innerOf(readFileSync(join(dir, `${name}.svg`), "utf8"));
    return {
      w: 24, h: 24,
      markup: `<g fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`,
    };
  }
  if (source === "file") {
    // a complete SVG drawn in its own colours (scripts/icons/<name>.svg)
    const svg = readFileSync(join(import.meta.dirname, "icons", `${name}.svg`), "utf8");
    const [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(/[\s,]+/).map(Number);
    return { w, h, markup: innerOf(svg) };
  }
  throw new Error(`Unknown icon source in "${icon}" (use si:, lucide:, custom: or file:)`);
}

/** The icon scaled so its visible outline (strokes included) fits ICON_BOX, centred on (cx, cy). */
function glyph(icon, cx, cy, color = "#FFFFFF") {
  const { w, h, markup } = rawGlyph(icon, color);
  const bbox = new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${markup}</svg>`).innerBBox();
  if (!bbox) throw new Error(`"${icon}" draws nothing`);
  const k = ICON_BOX / Math.max(bbox.width, bbox.height);
  const [bx, by] = [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
  return `<g transform="translate(${cx} ${cy}) scale(${k}) translate(${-bx} ${-by})">${markup}</g>`;
}

export function iconSvg(accent, icon, iconColor) {
  const tile = 250, gap = 56, r = 56;
  const x0 = (S - (2 * tile + gap)) / 2;
  const y0 = x0;
  const tiles = [
    [x0, y0 + tile + gap],
    [x0 + tile + gap, y0 + tile + gap],
    [x0, y0],
  ];
  const [ax, ay] = [x0 + tile + gap, y0]; // top-right: the accent tile
  const [c1, c2] = accent.split(">");
  const accentFill = c2 ? "url(#accent)" : c1;
  const rect = (x, y, fill, extra = "") => `<rect x="${x}" y="${y}" width="${tile}" height="${tile}" rx="${r}" fill="${fill}" ${extra}/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4F46E5"/>
      <stop offset="1" stop-color="#06B6D4"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2 ?? c1}"/>
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
    ${rect(ax, ay, accentFill)}
  </g>
  ${glyph(icon, ax + tile / 2, ay + tile / 2, iconColor)}
</svg>`;
}

export function renderIcon(out, accent, icon, iconColor) {
  const png = new Resvg(iconSvg(accent, icon, iconColor), { fitTo: { mode: "width", value: OUT_PX } }).render().asPng();
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
