// 콘텐츠 P&L 대시보드: content/state.json + content/metrics.csv → 콘솔
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const state = JSON.parse(await readFile(path.join(root, 'content', 'state.json'), 'utf8'));
const chicken = 22000;

// videoId -> niche 매핑
const nicheOf = {};
for (const v of state.videos || []) nicheOf[v.id] = v.niche;

const rows = [];
const csvPath = path.join(root, 'content', 'metrics.csv');
if (existsSync(csvPath)) {
  const txt = (await readFile(csvPath, 'utf8')).trim();
  const lines = txt.split(/\r?\n/).filter((l) => l && !l.startsWith('#') && !l.startsWith('videoId'));
  for (const ln of lines) {
    const [id, date, platform, views, avs, ctr, rev] = ln.split(',');
    if (!id) continue;
    rows.push({ id: id.trim(), date, platform, views: +views || 0, avs: +avs || 0, ctr: +ctr || 0, rev: +rev || 0 });
  }
}

// 영상별 최신 수치(같은 id면 최신 날짜 사용)
const latest = {};
for (const r of rows) {
  if (!latest[r.id] || r.date > latest[r.id].date) latest[r.id] = r;
}

// 니치별 집계
const byNiche = {};
for (const niche of state.experiment.niches) byNiche[niche.id] = { title: niche.title, vids: 0, views: 0, rev: 0, avsSum: 0 };
let totalRev = 0, totalViews = 0;
for (const id in latest) {
  const r = latest[id];
  const n = nicheOf[id];
  if (!byNiche[n]) byNiche[n] = { title: n || '(미분류)', vids: 0, views: 0, rev: 0, avsSum: 0 };
  byNiche[n].vids++; byNiche[n].views += r.views; byNiche[n].rev += r.rev; byNiche[n].avsSum += r.avs;
  totalRev += r.rev; totalViews += r.views;
}

const won = (n) => '₩' + Math.round(n).toLocaleString('ko-KR');
const draftCount = (state.videos || []).filter((v) => v.status === 'draft').length;
const readyCount = (state.videos || []).filter((v) => v.status === 'ready').length;
const liveCount = (state.videos || []).filter((v) => v.status === 'published').length;

console.log('\n══════════ 🎬 미미 v2 콘텐츠 대시보드 ══════════');
console.log(`반복: ${state.iteration}   단계: ${state.currentStep}   영상: 초안 ${draftCount} · 발행대기 ${readyCount} · 발행 ${liveCount}`);
console.log(`실험: ${state.experiment.name}  (니치당 목표 ${state.experiment.perNiche}편)`);
console.log('────────────────────────────────────────────');
console.log(`총 조회수: ${totalViews.toLocaleString('ko-KR')}   총 추정수익: ${won(totalRev)}   🍗 ${Math.round((totalRev / chicken) * 100) / 100}마리`);
console.log('────────────────────────────────────────────');
console.log('니치별 성과 (조회순):');
const ranked = Object.entries(byNiche).sort((a, b) => b[1].views - a[1].views);
let hasData = false;
for (const [id, n] of ranked) {
  const avgViews = n.vids ? Math.round(n.views / n.vids) : 0;
  const avgAvs = n.vids ? Math.round(n.avsSum / n.vids) : 0;
  if (n.vids) hasData = true;
  console.log(`  ${id.padEnd(9)} ${n.title.padEnd(22)} 영상 ${n.vids}  조회 ${String(n.views).padStart(7)}  평균조회 ${String(avgViews).padStart(6)}  평균시청 ${avgAvs}s  수익 ${won(n.rev)}`);
}
if (!hasData) console.log('  (아직 발행/데이터 없음 — /content-make 로 첫 영상을 만드세요)');

console.log('────────────────────────────────────────────');
if (hasData) {
  const winner = ranked.find(([, n]) => n.vids > 0);
  console.log(`현재 선두 니치: ${winner[0]} (${winner[1].title})`);
  console.log('다음: /content-decide 로 더블다운/중단 결정');
} else {
  console.log('다음: /content-plan → /content-make 로 9편(니치 3×3)을 만들어 올리세요.');
}
console.log('');
