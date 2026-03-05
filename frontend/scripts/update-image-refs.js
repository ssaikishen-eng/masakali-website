const fs = require('fs');
const path = require('path');

const srcRoot = path.resolve(process.cwd(), 'src');

function listFiles(dir, exts = ['.js', '.jsx', '.css', '.ts', '.tsx']) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(p, exts));
    else if (exts.includes(path.extname(entry.name))) out.push(p);
  }
  return out;
}

function tryWebpResolved(originalPath, fileDir) {
  // originalPath may be absolute, root-relative or relative
  // try to resolve relative to current file dir
  const withoutQuery = originalPath.split('?')[0];
  const ext = path.extname(withoutQuery);
  const base = withoutQuery.slice(0, -ext.length);
  const candidates = [];
  if (base.startsWith('/')) {
    candidates.push(path.join(process.cwd(), 'frontend', 'src', base));
  } else {
    candidates.push(path.resolve(fileDir, base));
  }
  for (const c of candidates) {
    const webp = c + '.webp';
    if (fs.existsSync(webp)) return (base.startsWith('/') ? path.join('', base + '.webp') : path.relative(fileDir, webp).replace(/\\/g, '/'));
    const webpSameDir = path.join(path.dirname(c), path.basename(base) + '.webp');
    if (fs.existsSync(webpSameDir)) return (base.startsWith('/') ? path.join('', path.dirname(base), path.basename(base) + '.webp') : path.relative(fileDir, webpSameDir).replace(/\\/g, '/'));
  }
  return null;
}

const files = listFiles(srcRoot);
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  const fileDir = path.dirname(file);

  // match import ... from '...png' and require('...png')
  content = content.replace(/(["'\(])([^"'\)]+?)\.(png|jpe?g)(["'\)])/gi, (m, p1, p2, p3, p4) => {
    const candidate = tryWebpResolved(p2 + '.' + p3, fileDir);
    if (candidate) {
      // keep surrounding characters the same
      // if candidate is relative (starts without /) and doesn't start with './' add './'
      let out = candidate;
      if (!out.startsWith('/') && !out.startsWith('./') && !out.startsWith('../')) out = './' + out;
      return p1 + out + p4;
    }
    return m;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', path.relative(process.cwd(), file));
  }
}

console.log('Image reference update complete.');
