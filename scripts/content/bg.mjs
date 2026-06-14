// 4단계(배경) 자동화: 주제 배경 이미지를 받아 bg.jpg 로 저장
// 사용법: node scripts/content/bg.mjs <videoId> "<검색어>"
//   키 있으면 → 주제 맞는 실제 사진(Pexels, 상업용 무료)
//   없으면    → 무작위 추상 배경(picsum, 살짝 블러)
// 키 위치(둘 중 하나): 환경변수 PEXELS_API_KEY  또는  mimi/secrets.json {"PEXELS_API_KEY":"..."}
import { writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const id = process.argv[2];
const query = process.argv.slice(3).join(' ');
if (!id) { console.error('사용법: node scripts/content/bg.mjs <videoId> "<검색어>"'); process.exit(1); }
const dir = path.join(root, 'content', 'videos', id);

function loadKey() {
  if (process.env.PEXELS_API_KEY) return process.env.PEXELS_API_KEY.trim();
  try {
    const s = JSON.parse(readFileSync(path.join(root, 'mimi', 'secrets.json'), 'utf8'));
    return (s.PEXELS_API_KEY || '').trim() || null;
  } catch { return null; }
}
const key = loadKey();

let url, note;
if (key && query) {
  const api = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=portrait&size=large&per_page=20`;
  const res = await fetch(api, { headers: { Authorization: key } });
  if (!res.ok) { console.error('Pexels 오류', res.status, '— 키를 확인하세요'); process.exit(1); }
  const data = await res.json();
  const ps = data.photos || [];
  if (!ps.length) { console.error('Pexels 결과 없음:', query); process.exit(1); }
  const p = ps[Math.floor(Math.random() * Math.min(ps.length, 12))];
  url = p.src.large2x || p.src.original || p.src.portrait;
  note = `Pexels · "${p.alt || query}" · © ${p.photographer}`;
} else {
  url = `https://picsum.photos/1080/1920?blur=2&random=${Date.now()}`;
  note = key ? '검색어 없음 → picsum 무작위' : 'PEXELS_API_KEY 없음 → picsum 무작위(주제성X)';
}

const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
writeFileSync(path.join(dir, 'bg.jpg'), buf);
console.log('✓ 배경 저장: content/videos/' + id + '/bg.jpg');
console.log('  ' + note);
