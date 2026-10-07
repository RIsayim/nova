import { readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const videos = [
  { name: 'lighting-story.mp4', size: 101026025, parts: 6 },
  { name: 'home-theater-story.mp4', size: 68423834, parts: 4 },
  { name: 'home-theater-feature.mp4', size: 51925210, parts: 3 },
];

for (const video of videos) {
  const output = path.join(root, 'public', 'videos', video.name);
  try {
    if ((await stat(output)).size === video.size) continue;
  } catch {}

  const chunks = [];
  for (let index = 0; index < video.parts; index += 1) {
    const suffix = String(index).padStart(3, '0');
    chunks.push(await readFile(path.join(root, 'assets', 'video-parts', video.name + '.' + suffix)));
  }
  const restored = Buffer.concat(chunks);
  if (restored.length !== video.size) throw new Error('Unexpected size for ' + video.name);
  await writeFile(output, restored);
}
