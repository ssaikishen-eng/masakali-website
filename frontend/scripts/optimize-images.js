import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const assetDirs = [
  path.resolve(process.cwd(), 'frontend', 'src', 'assets', 'images'),
  path.resolve(process.cwd(), 'frontend', 'src', 'assets', 'img'),
  path.resolve(process.cwd(), 'frontend', 'src', 'assets', 'img', 'brand')
];

async function ensureDir(dir) {
  try { await fs.promises.access(dir); } catch { await fs.promises.mkdir(dir, { recursive: true }); }
}

async function convertFile(dir, file) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const input = path.join(dir, file);
  const output = path.join(dir, base + '.webp');
  try {
    await sharp(input)
      .webp({ quality: 80, lossless: false })
      .toFile(output);
    console.log('Converted', file, '->', path.relative(process.cwd(), output));
  } catch (err) {
    console.error('Failed', file, err.message);
  }
}

async function run() {
  for (const dir of assetDirs) {
    try {
      await ensureDir(dir);
      const files = await fs.promises.readdir(dir);
      const images = files.filter(f => /\.(png|jpe?g)$/i.test(f));
      for (const f of images) await convertFile(dir, f);
      console.log('Processed', dir);
    } catch (err) {
      // skip missing directories
    }
  }
  console.log('Done. WebP images are created alongside originals where possible.');
}

run().catch(err => { console.error(err); process.exit(1); });
