import fs from 'fs';
import path from 'path';

const srcRoot = path.resolve(process.cwd(), 'frontend', 'src');

function fileList(dir, exts = ['.js', '.jsx', '.css']) {
  const out = [];
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) out.push(...fileList(p, exts));
    else if (exts.includes(path.extname(name.name))) out.push(p);
  }
  return out;
}

function replaceInFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const regex = /(["'\(])([^"'\(\)]+?)\.(png|jpg|jpeg)(["'\)])/gi;
  let changed = false;
  content = content.replace(regex, (m, p1, p2, p3, p4) => {
    const candidate = path.resolve(path.dirname(file), p2 + '.webp');
    // also try resolving relative to src
    const candidateAlt = path.resolve(srcRoot, p2.replace(/^\.\//, '') + '.webp');
    if (fs.existsSync(candidate) || fs.existsSync(candidateAlt)) {
      changed = true;
      return `${p1}${p2}.webp${p4}`;
    }
    return m;
  });
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated refs in', path.relative(process.cwd(), file));
  }
}

const files = fileList(srcRoot);
for (const f of files) replaceInFile(f);
console.log('Reference update complete.');
