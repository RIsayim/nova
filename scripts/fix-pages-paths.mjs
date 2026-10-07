import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('dist');
const base = '/nova';

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(file);
      continue;
    }

    if (!/\.(html|css|js|json)$/i.test(entry.name)) continue;
    const original = await readFile(file, 'utf8');
    const prefixed = original
      .replace(/(\b(?:href|src|srcset|poster|action|content|data-src|data-image)\s*=\s*["'])(\/(?!\/|nova(?:\/|["'])))/gi, '$1' + base + '$2')
      .replace(/(url\(\s*["']?)(\/(?!\/|nova(?:\/|["'])))/gi, '$1' + base + '$2');

    if (prefixed !== original) await writeFile(file, prefixed);
  }
}

await visit(output);
