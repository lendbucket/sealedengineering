// Generates the raster favicon set from the one vector mark.
//
//   npm run brand-rasters
//
// WHY GENERATE RATHER THAN CHECK IN
// ---------------------------------
// There is no logo yet. The mark in src/app/icon.svg is a typographic
// placeholder and it WILL be replaced. A checked-in set of PNGs is five files
// that quietly keep showing the old mark after somebody updates the vector,
// and favicons are the last thing anybody checks. Generating them from the
// single source means the replacement is one file plus one command.
//
// The SVG is rendered through a standalone copy of the geometry rather than by
// reading icon.svg directly, because icon.svg uses a font-family that resolves
// differently on every machine. Text drawn by whatever font happens to be
// installed is not a brand mark. Here the letters are drawn as paths.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const OUT = "public";
const SIZES = [16, 32, 48, 180, 192, 512];

const SEAL = "#0f3b2e";
const PAPER = "#faf7f1";

/**
 * The mark, as pure geometry.
 *
 * The scalloped disc is the wax seal. The monogram is drawn with rounded
 * strokes rather than set as type, so it renders identically everywhere and
 * stays legible at 16px, where an actual typeface would turn to mud.
 */
function markSvg(size, { rounded = true } = {}) {
  const r = rounded ? 6 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="${r}" fill="${SEAL}"/>
  <path fill="${PAPER}" d="M16 4.2c1 0 1.8 1.2 2.7 1.5.9.2 2.2-.4 3 .1.8.5.8 2 1.5 2.6.6.6 2.1.7 2.6 1.5.5.8-.2 2.1.1 3 .2.9 1.4 1.7 1.4 2.7 0 1-1.2 1.8-1.4 2.7-.3.9.4 2.2-.1 3-.5.8-2 .9-2.6 1.5-.7.6-.7 2.1-1.5 2.6-.8.5-2.1-.2-3 .1-.9.2-1.7 1.4-2.7 1.4s-1.8-1.2-2.7-1.4c-.9-.3-2.2.4-3-.1-.8-.5-.8-2-1.5-2.6-.6-.6-2.1-.7-2.6-1.5-.5-.8.2-2.1-.1-3C5.4 17.8 4.2 17 4.2 16s1.2-1.8 1.4-2.7c.3-.9-.4-2.2.1-3 .5-.8 2-.9 2.6-1.5.7-.6.7-2.1 1.5-2.6.8-.5 2.1.1 3-.1.9-.3 1.7-1.9 3.2-1.9Z"/>
  <g fill="none" stroke="${SEAL}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15.1 12.1c-.9-.7-2.6-.7-3.2.2-.6.9.2 1.7 1.2 2 1.1.4 2.2.5 2.4 1.6.2 1.1-1.1 1.9-2.3 1.7-.8-.1-1.3-.4-1.7-.8"/>
    <path d="M17.9 11.6h3.3M17.9 15.2h2.8M17.9 18.8h3.3"/>
  </g>
</svg>`;
}

fs.mkdirSync(OUT, { recursive: true });

const written = [];
for (const size of SIZES) {
  // The maskable and apple sizes want the rounded plate; the small ones are
  // shown inside the browser's own rounding and look pinched with two radii.
  const rounded = size >= 180;
  const buf = Buffer.from(markSvg(size, { rounded }));
  const file = path.join(OUT, `favicon-${size}.png`);
  await sharp(buf).resize(size, size).png().toFile(file);
  written.push(file);
}

// apple-touch-icon.png is looked for at the site root by name, so it gets its
// own copy rather than a rename of the 180.
fs.copyFileSync(path.join(OUT, "favicon-180.png"), path.join(OUT, "apple-touch-icon.png"));
written.push(path.join(OUT, "apple-touch-icon.png"));

// favicon.ico still matters: some feed readers, some crawlers, and every
// browser that predates the SVG icon support ask for it by name at the root.
const ico = await pngToIco([
  path.join(OUT, "favicon-16.png"),
  path.join(OUT, "favicon-32.png"),
  path.join(OUT, "favicon-48.png"),
]);
fs.writeFileSync(path.join(OUT, "favicon.ico"), ico);
written.push(path.join(OUT, "favicon.ico"));

console.log("=== BRAND RASTERS ===");
for (const f of written) console.log(`  wrote ${f}`);
console.log(
  "\nRegenerate with `npm run brand-rasters` after the real logo replaces the placeholder mark.",
);
