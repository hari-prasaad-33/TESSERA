/**
 * Converts textures from website/textures-source/ into website/public/images/textures/.
 *
 * - Raster: every *diff*4k.jpg (Poly Haven albedo) plus any other JPG that is not a map/disp.
 * - EXR skies: ImageMagick `magick` on PATH, else fallbacks (see FALLBACK_SKIES).
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

/** Normalize output basename so existing site URLs stay stable. */
const SLUG_ALIASES = {
  'coast-sand-rocks-02': 'coast-sand-rocks',
  'moon-01-diff': 'moon-01',
};

const SKY_EXR = [
  { inFile: 'rogland_clear_night_4k.exr', base: 'rogland-clear-night' },
  { inFile: 'qwantani_moon_noon_puresky_4k.exr', base: 'qwantani-moon-noon' },
  { inFile: 'quarry_04_puresky_4k.exr', base: 'quarry-04-puresky' },
];

const FALLBACK_SKIES = {
  'rogland-clear-night': 'rogland-night.jpg',
  'qwantani-moon-noon': 'coast-sand-rocks.jpg',
  'quarry-04-puresky': 'cliff-side.jpg',
};

const SKIP_JPG = /(?:^|[_-])(disp|normal|rough|metal|arm|ao|orm|height|package|thumb)(?:[_-]|\.)/i;

function slugFromFilename(filename) {
  const noExt = filename.replace(/\.jpe?g$/i, '');
  let s = noExt
    .replace(/_diff_\d+k$/i, '')
    .replace(/_diff_4k$/i, '')
    .replace(/_diff$/i, '')
    .replace(/_4k$/i, '')
    .replace(/_8k$/i, '');
  if (!s) return null;
  return s.replace(/_/g, '-').toLowerCase();
}

function magickAvailable() {
  const r = spawnSync('magick', ['-version'], { encoding: 'utf8' });
  return r.status === 0;
}

function convertExrWithMagick(inputPath, baseName) {
  const jpg = path.join(OUT, `${baseName}.jpg`);
  const webp = path.join(OUT, `${baseName}.webp`);
  const args = [inputPath, '-resize', `${MAX_W}x>`, '-quality', '85', jpg];
  const r = spawnSync('magick', args, { encoding: 'utf8' });
  if (r.status !== 0) {
    console.warn(`magick failed for ${baseName}:`, r.stderr?.slice(0, 400) || r.error);
    return false;
  }
  spawnSync('magick', [jpg, '-quality', '80', '-define', 'webp:method=6', webp], { encoding: 'utf8' });
  console.log(`EXR → ${path.basename(jpg)}, ${path.basename(webp)}`);
  return true;
}

async function emitRaster(inputPath, baseName) {
  const img = sharp(inputPath).rotate();
  const meta = await img.metadata();
  const w = meta.width || MAX_W;
  const pipeline = w > MAX_W ? img.resize({ width: MAX_W, withoutEnlargement: true }) : img;

  const jpgPath = path.join(OUT, `${baseName}.jpg`);
  const webpPath = path.join(OUT, `${baseName}.webp`);

  await pipeline.clone().jpeg({ quality: 85, mozjpeg: true }).toFile(jpgPath);
  await pipeline.clone().webp({ quality: 80, effort: 6 }).toFile(webpPath);
  console.log(`Raster → ${baseName}.jpg / .webp`);
}

async function discoverRasterFiles() {
  const files = await readdir(SRC);
  const bySlug = new Map();

  for (const f of files) {
    if (!/\.jpe?g$/i.test(f)) continue;
    if (SKIP_JPG.test(f)) continue;
    if (!/_diff_(?:\d+k)?\.jpe?g$/i.test(f)) continue;

    let slug = slugFromFilename(f);
    if (!slug) continue;
    if (SLUG_ALIASES[slug]) slug = SLUG_ALIASES[slug];
    if (!bySlug.has(slug)) {
      bySlug.set(slug, f);
    }
  }

  return [...bySlug.entries()].map(([base, inFile]) => ({ base, inFile }));
}

async function main() {
  await mkdir(OUT, { recursive: true });
  if (!existsSync(SRC)) {
    console.error(`Missing source dir: ${SRC}`);
    process.exit(1);
  }

  const rasterJobs = await discoverRasterFiles();
  if (rasterJobs.length === 0) {
    console.warn('No *_diff_4k.jpg files found in textures-source.');
  }
  for (const { inFile, base } of rasterJobs) {
    await emitRaster(path.join(SRC, inFile), base);
  }

  const useMagick = magickAvailable();
  if (!useMagick) {
    console.warn('ImageMagick (`magick`) not on PATH — skipping EXR conversion. Using raster fallbacks for skies.');
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
  console.log('Done. Outputs:', listed.filter((x) => !x.startsWith('_')).sort().join(', '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
