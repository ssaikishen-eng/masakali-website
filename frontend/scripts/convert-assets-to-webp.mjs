/*
Convert all JPG/PNG images under `frontend/src/assets/img` to WebP.
- Creates `.webp` files next to originals.
- By default it keeps originals; run with `--delete-originals` to remove originals after converting.
Usage (from project `frontend` folder):
  npm install sharp
  node scripts/convert-assets-to-webp.mjs [--delete-originals]
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, '..', 'src', 'assets', 'img');
const deleteOriginals = process.argv.includes('--delete-originals');
const exts = new Set(['.jpg', '.jpeg', '.png']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

(async function main() {
  if (!fs.existsSync(imgDir)) {
    console.error('Image directory not found:', imgDir);
    process.exit(1);
  }

  const files = walk(imgDir).filter(f => exts.has(path.extname(f).toLowerCase()));
  if (files.length === 0) {
    console.log('No JPG/PNG images found to convert.');
    return;
  }

  for (const file of files) {
    try {
      const outPath = file.replace(/\.[^.]+$/, '.webp');
      if (fs.existsSync(outPath)) {
        console.log('Skipping (already exists):', path.relative(imgDir, outPath));
        continue;
      }
      console.log('Converting:', path.relative(imgDir, file));
      await sharp(file).webp({ quality: 80 }).toFile(outPath);
      console.log('Saved:', path.relative(imgDir, outPath));
      if (deleteOriginals) {
        fs.unlinkSync(file);
        console.log('Deleted original:', path.relative(imgDir, file));
      }
    } catch (err) {
      console.error('Failed converting', file, err.message);
    }
  }

  console.log('Done.');
})();
