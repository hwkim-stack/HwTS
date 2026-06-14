// 4단계(배경) 고급: 자막 컷마다 다른 배경 이미지를 수집 → shots/bg_01.jpg ...
// 사용법: node scripts/content/bg-shots.mjs <videoId>
//   content/videos/<id>/shots.json 의 "shots"(컷별 검색어) + captions.srt(컷 수)를 사용
//   PEXELS_API_KEY(env 또는 mimi/secrets.json) 있으면 주제 사진, 없으면 picsum 무작위
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const id = process.argv[2];
if (!id) { console.error('사용법: node scripts/content/bg-shots.mjs <videoId>'); process.exit(1); }
const dir = path.join(root, 'content', 'videos', id);

function loadKey() {
  if (process.env.PEXELS_API_KEY) return process.env.PEXELS_API_KEY.trim();
  try { return (JSON.parse(readFileSync(path.join(root, 'mimi', 'secrets.json'), 'utf8')).PEXELS_API_KEY || '').trim() || null; }
  catch { return null; }
}
const key = loadKey();

// 자막 컷 수
const srt = readFileSync(path.join(dir, 'captions.srt'), 'utf8');
const cueCount = (srt.match(/-->/g) || []).length;
if (!cueCount) { console.error('captions.srt 컷이 없습니다. 먼저 tts 실행.'); process.exit(1); }

// 컷별 검색어
let shots = [];
try { shots = JSON.parse(readFileSync(path.join(dir, 'shots.json'), 'utf8')).shots || []; } catch {}
const queryFor = (i) => shots[i] || shots[shots.length - 1] || 'abstract dark background';

const outDir = path.join(dir, 'shots');
mkdirSync(outDir, { recursive: true });

async function pexels(q) {
  const api = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&orientation=portrait&size=large&per_page=20`;
  const res = await fetch(api, { headers: { Authorization: key } });
  if (!res.ok) throw new Error('Pexels ' + res.status);
  const ps = (await res.json()).photos || [];
  if (!ps.length) return null;
  const p = ps[Math.floor(Math.random() * Math.min(ps.length, 12))];
  return { url: p.src.large2x || p.src.original || p.src.portrait, by: p.photographer };
}

console.log(`▶ 컷 ${cueCount}개 배경 수집  (${key ? 'Pexels 주제 사진' : 'picsum 무작위'})`);
for (let i = 0; i < cueCount; i++) {
  const n = String(i + 1).padStart(2, '0');
  const q = queryFor(i);
  let url, label;
  try {
    if (key) { const r = await pexels(q); if (r) { url = r.url; label = `"${q}" © ${r.by}`; } }
  } catch (e) { /* fall through */ }
  if (!url) { url = `https://picsum.photos/1080/1920?blur=2&random=${Date.now()}_${i}`; label = key ? `(결과없음→picsum) ${q}` : `picsum`; }
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(path.join(outDir, `bg_${n}.jpg`), buf);
  console.log(`  ${n}  ${label}`);
}
console.log('✓ 저장: content/videos/' + id + '/shots/  (다음: render)');
