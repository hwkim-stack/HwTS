// P&L 대시보드: mimi/state.json + mimi/metrics.csv → 콘솔 리포트
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(await readFile(path.join(root, 'mimi', 'config.json'), 'utf8'));
const state = JSON.parse(await readFile(path.join(root, 'mimi', 'state.json'), 'utf8'));
const econ = config.economics || {};
const chicken = econ.chickenPriceKRW || 22000;
const domainYear = econ.domainCostPerYearKRW || 15000;

const rows = [];
const csvPath = path.join(root, 'mimi', 'metrics.csv');
if (existsSync(csvPath)) {
  const txt = (await readFile(csvPath, 'utf8')).trim();
  const lines = txt.split(/\r?\n/).filter((l) => l && !l.startsWith('#') && !l.startsWith('date,'));
  for (const ln of lines) {
    const [date, slug, pv, clicks, rev] = ln.split(',');
    if (!date || !slug) continue;
    rows.push({ date: date.trim(), slug: slug.trim(), pv: +pv || 0, clicks: +clicks || 0, rev: +rev || 0 });
  }
}

const byTool = {};
let total = 0;
const dates = new Set();
for (const r of rows) {
  byTool[r.slug] = byTool[r.slug] || { pv: 0, rev: 0, clicks: 0 };
  byTool[r.slug].pv += r.pv;
  byTool[r.slug].rev += r.rev;
  byTool[r.slug].clicks += r.clicks;
  total += r.rev;
  dates.add(r.date);
}
const days = Math.max(1, dates.size);
const perDay = total / days;
const won = (n) => '₩' + Math.round(n).toLocaleString('ko-KR');

console.log('\n══════════ 🐣 미미 P&L 대시보드 ══════════');
console.log(`반복(iteration): ${state.iteration}   현재 단계: ${state.currentStep}   도구: ${state.tools.length}개`);
console.log(`데이터 기간: ${days}일 (${rows.length}개 레코드)`);
console.log('──────────────────────────────────────────');
console.log(`총 광고수익      : ${won(total)}`);
console.log(`일평균 수익      : ${won(perDay)}`);
const chPerDay = perDay / chicken;
console.log(`🍗 치킨 지표      : ${Math.round(chPerDay * 100) / 100} 마리/일  (치킨 1마리 = ${won(chicken)})`);
const dailyDomain = domainYear / 365;
console.log(`순익(일)         : ${won(perDay - dailyDomain)}  (도메인비 -${won(dailyDomain)}/일)`);
console.log('──────────────────────────────────────────');
console.log('도구별 성과 (수익순):');
const ranked = Object.entries(byTool).sort((a, b) => b[1].rev - a[1].rev);
if (ranked.length === 0) {
  console.log('  (아직 metrics.csv 데이터가 없습니다 — /mimi-analyze 로 수치를 입력하세요)');
} else {
  for (const [slug, m] of ranked) {
    const rpm = m.pv ? (m.rev / m.pv) * 1000 : 0;
    console.log(`  ${slug.padEnd(24)} 수익 ${won(m.rev).padStart(10)}  PV ${String(m.pv).padStart(7)}  RPM ${won(rpm)}`);
  }
}
const noData = state.tools.filter((t) => !byTool[t.slug]);
if (noData.length) console.log('\n데이터 없는 도구: ' + noData.map((t) => t.slug).join(', '));

const goal = chicken * 3.5;
console.log('──────────────────────────────────────────');
console.log(`목표: 하루 치킨 3.5마리(${won(goal)}/일)까지  현재 ${Math.round((perDay / goal) * 100)}% 달성`);
console.log('다음: /mimi-decide 로 유지·개선·확장·중단을 결정하세요.\n');
