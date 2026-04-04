/**
 * Converts textures from website/textures-source/ into website/public/images/textures/.
 *
 * - Raster JPGs: resize to max width 2560, emit JPG (q85) + WebP (q80) via sharp.
 * - Sky EXRs: requires ImageMagick 7+ (`magick` on PATH). If missing, copies fallbacks
 *   (see FALLBACK_SKIES below) so the site still has distinct hero/problem/answer imagery.
 *
 * Run: npm run convert:textures
 */

import { mkdir, copyFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'textures-source');
const OUT = path.join(ROOT, 'public', 'images', 'textures');
const MAX_W = 2560;

const RASTER = [
  { inFile: 'lichen_rock_diff_4k.jpg', base: 'lichen-rock' },
  { inFile: 'coast_sand_rocks_02_diff_4k.jpg', base: 'coast-sand-rocks' },
  { inFile: 'cliff_side_diff_4k.jpg', base: 'cliff-side' },
  { inFile: 'moon_01_diff_4k.jpg', base: 'moon-01' },
];

/** EXR inputs → canonical public names (plan). */
const SKY_EXR = [
  { inFile: 'rogland_clear_night_4k.exr', base: 'rogland-clear-night' },
  { inFile: 'qwantani_moon_noon_puresky_4k.exr', base: 'qwantani-moon-noon' },
  { inFile: 'quarry_04_puresky_4k.exr', base: 'quarry-04-puresky' },
];

/** When magick is unavailable: use these already-built JPGs (same OUT dir). */
const FALLBACK_SKIES = {
  'rogland-clear-night': 'rogland-night.jpg',
  'qwantani-moon-noon': 'coast-sand-rocks.jpg',
  'quarry-04-puresky': 'cliff-side.jpg',
};

function magickAvailable() {
  const r = spawnSync('magick', ['-version'], { encoding: 'utf8' });
  return r.status === 0;
}

function convertExrWithMagick(inputPath, baseName) {
  const jpg = path.join(OUT, `${baseName}.jpg`);
  const webp = path.join(OUT, `${baseName}.webp`);
  const args = [
    inputPath,
    '-resize',
    `${MAX_W}x>`,
    '-quality',
    '85',
    jpg,
  ];
  const r = spawnSync('magick', args, { encoding: 'utf8' });
  if (r.status !== 0) {
    console.warn(`magick failed for ${baseName}:`, r.stderr?.slice(0, 400) || r.error);
    return false;
  }
  const wargs = [
    jpg,
    '-quality',
    '80',
    '-define',
    'webp:method=6',
    webp,
  ];
  spawnSync('magick', wargs, { encoding: 'utf8' });
  console.log(`EXR → ${path.basename(jpg)}, ${path.basename(webp)}`);
  return true;
}

async function emitRaster(inFile, baseName) {
  const inputPath = path.join(SRC, inFile);
  if (!existsSync(inputPath)) {
    console.warn(`Skip raster (missing): ${inFile}`);
    return;
  }
  const img = sharp(inputPath).rotate();
  const meta = await img.metadata();
  const w = meta.width || MAX_W;
  const pipeline = w > MAX_W ? img.resize({ width: MAX_W, withoutEnlargement: true }) : img;

  const jpgPath = path.join(OUT, `${baseName}.jpg`);
  const webpPath = path.join(OUT, `${baseName}.webp`);

  await pipeline
    .clone()
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(jpgPath);

  await pipeline
    .clone()
    .webp({ quality: 80, effort: 6 })
    .toFile(webpPath);

  console.log(`Raster → ${baseName}.jpg / .webp`);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  if (!existsSync(SRC)) {
    console.error(`Missing source dir: ${SRC}`);
    process.exit(1);
  }

  for (const { inFile, base } of RASTER) {
    await emitRaster(inFile, base);
  }

  const useMagick = magickAvailable();
  if (!useMagick) {
    console.warn('ImageMagick (`magick`) not on PATH — skipping EXR conversion. Using raster fallbacks for sky slots where needed.');
  }

  for (const { inFile, base } of SKY_EXR) {
    const inputPath = path.join(SRC, inFile);
    if (!existsSync(inputPath)) {
      console.warn(`Skip sky (missing): ${inFile}`);
      continue;
    }
    if (useMagick && convertExrWithMagick(inputPath, base)) {
      continue;
    }
    const fallback = FALLBACK_SKIES[base];
    if (!fallback) continue;
    const from = path.join(OUT, fallback);
    const toJpg = path.join(OUT, `${base}.jpg`);
    if (existsSync(from)) {
      await copyFile(from, toJpg);
      console.log(`Sky fallback: ${fallback} → ${base}.jpg`);
    } else {
      console.warn(`No fallback for ${base} (${from} missing)`);
    }
  }

  const listed = await readdir(OUT);
  console.log('Done. Outputs:', listed.filter((f) => !f.startsWith('_')).sort().join(', '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
