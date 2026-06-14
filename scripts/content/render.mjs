// 4·5단계 합성: 배경 + 자막(번인) + 음성 → 9:16 mp4  [FFmpeg]
//   content/videos/<id>/shots/bg_01.jpg... 있으면 → 자막 타이밍 동기 슬라이드쇼
//   없고 bg.jpg/bg.mp4 있으면 → 단일 배경
//   둘 다 없으면 → 단색
// 사용법: node scripts/content/render.mjs <videoId> [solidBgColor]
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
function findExe(dir, name) {
  if (!existsSync(dir)) return null;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { const f = findExe(p, name); if (f) return f; }
    else if (e.name.toLowerCase() === name) return p;
  }
  return null;
}
const FFMPEG = findExe(path.join(root, 'tools'), 'ffmpeg.exe') || 'ffmpeg';
const FFPROBE = findExe(path.join(root, 'tools'), 'ffprobe.exe') || 'ffprobe';

const id = process.argv[2];
const solid = process.argv[3] || '0x0E1320';
if (!id) { console.error('사용법: node scripts/content/render.mjs <videoId> [solidBgColor]'); process.exit(1); }
const dir = path.join(root, 'content', 'videos', id);
if (!existsSync(path.join(dir, 'voice.mp3')) || !existsSync(path.join(dir, 'captions.srt'))) {
  console.error('voice.mp3 / captions.srt 없음. 먼저: node scripts/content/tts.mjs ' + id); process.exit(1);
}

const dur = parseFloat((spawnSync(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', 'voice.mp3'], { cwd: dir, encoding: 'utf8' }).stdout || '').trim()) || 60;

const style = [
  'Fontname=Malgun Gothic', 'Fontsize=16', 'Bold=1',
  'PrimaryColour=&H00FFFFFF&', 'OutlineColour=&H00101010&',
  'BorderStyle=1', 'Outline=3', 'Shadow=1', 'Alignment=2', 'MarginV=120',
].join(',');
const subFilter = `subtitles=captions.srt:force_style='${style}'`;
const fill = 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30';

function srtStarts() {
  const txt = readFileSync(path.join(dir, 'captions.srt'), 'utf8');
  const out = [];
  const re = /(\d+):(\d+):(\d+),(\d+)\s*-->/g; let m;
  while ((m = re.exec(txt))) out.push(+m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000);
  return out;
}

const shotsDir = path.join(dir, 'shots');
const shotImgs = existsSync(shotsDir)
  ? readdirSync(shotsDir).filter((f) => /^bg_\d+\.(jpg|jpeg|png)$/i.test(f)).sort()
  : [];

let args;
if (shotImgs.length >= 2) {
  // ── 슬라이드쇼 (자막 타이밍 동기) ──
  const starts = srtStarts();
  const N = Math.min(starts.length, shotImgs.length);
  const bounds = [0, ...starts.slice(1, N), dur];
  const durs = [];
  for (let i = 0; i < N; i++) durs.push(Math.max(0.4, +(bounds[i + 1] - bounds[i]).toFixed(3)));

  const inputs = [];
  for (let i = 0; i < N; i++) inputs.push('-loop', '1', '-t', String(durs[i]), '-i', 'shots/' + shotImgs[i]);
  inputs.push('-i', 'voice.mp3');

  let fc = '';
  for (let i = 0; i < N; i++) fc += `[${i}:v]${fill}[v${i}];`;
  for (let i = 0; i < N; i++) fc += `[v${i}]`;
  fc += `concat=n=${N}:v=1:a=0[cat];`;
  fc += `[cat]drawbox=x=0:y=0:w=1080:h=1920:color=black@0.45:t=fill,${subFilter}[vout]`;

  args = ['-y', ...inputs, '-filter_complex', fc, '-map', '[vout]', '-map', `${N}:a`,
    '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-shortest', `${id}.mp4`];
  console.log(`▶ 합성  슬라이드쇼 ${N}컷  길이=${dur.toFixed(1)}s`);
} else {
  // ── 단일 배경/단색 ──
  const pick = (n) => n.find((f) => existsSync(path.join(dir, f))) || null;
  const vid = pick(['bg.mp4']);
  const img = pick(['bg.jpg', 'bg.jpeg', 'bg.png']);
  let inputs, pre, label;
  if (vid) { inputs = ['-stream_loop', '-1', '-i', vid]; pre = `${fill},drawbox=x=0:y=0:w=1080:h=1920:color=black@0.40:t=fill,`; label = '영상 ' + vid; }
  else if (img) { inputs = ['-loop', '1', '-i', img]; pre = `${fill},drawbox=x=0:y=0:w=1080:h=1920:color=black@0.45:t=fill,`; label = '이미지 ' + img; }
  else { inputs = ['-f', 'lavfi', '-i', `color=c=${solid}:s=1080x1920:r=30:d=${(dur + 0.4).toFixed(2)}`]; pre = ''; label = '단색 ' + solid; }
  args = ['-y', ...inputs, '-i', 'voice.mp3', '-vf', `${pre}${subFilter}`,
    '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-shortest', `${id}.mp4`];
  console.log(`▶ 합성  배경=${label}  길이=${dur.toFixed(1)}s`);
}

const r = spawnSync(FFMPEG, args, { cwd: dir, stdio: 'inherit' });
if (r.status !== 0) { console.error('✗ 합성 실패'); process.exit(1); }
console.log('✓ 완성:', path.relative(root, path.join(dir, id + '.mp4')));
