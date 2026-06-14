// 한 방에: 내레이션 → 음성·자막 → 합성(mp4)
// 사용법: npm run content:video -- <videoId> [voice] [rate]
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const id = process.argv[2];
const ttsArgs = process.argv.slice(3); // [voice] [rate]
if (!id) { console.error('사용법: npm run content:video -- <videoId> [voice] [rate]'); process.exit(1); }

function run(script, args) {
  const r = spawnSync('node', [path.join('scripts', 'content', script), id, ...args], { cwd: root, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status || 1);
}
run('tts.mjs', ttsArgs);
run('render.mjs', []);
console.log('\n🎬 완성:', `content/videos/${id}/${id}.mp4`, '— 유튜브 쇼츠로 업로드하면 됩니다.');
