// 4·5단계 자동화: 배경(이미지/영상/단색) + 자막(번인) + 음성 → 9:16 mp4  [FFmpeg]
// 사용법: node scripts/content/render.mjs <videoId> [solidBgColor]
//   폴더에 bg.mp4 있으면 영상 배경, bg.jpg/png 있으면 이미지 배경, 없으면 단색.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
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
const toolsDir = path.join(root, 'tools');
const FFMPEG = findExe(toolsDir, 'ffmpeg.exe') || 'ffmpeg';
const FFPROBE = findExe(toolsDir, 'ffprobe.exe') || 'ffprobe';

const id = process.argv[2];
const solid = process.argv[3] || '0x0E1320';
if (!id) { console.error('사용법: node scripts/content/render.mjs <videoId> [solidBgColor]'); process.exit(1); }

const dir = path.join(root, 'content', 'videos', id);
if (!existsSync(path.join(dir, 'voice.mp3')) || !existsSync(path.join(dir, 'captions.srt'))) {
  console.error('voice.mp3 / captions.srt 가 없습니다. 먼저: node scripts/content/tts.mjs ' + id);
  process.exit(1);
}

const probe = spawnSync(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', 'voice.mp3'], { cwd: dir, encoding: 'utf8' });
const dur = parseFloat((probe.stdout || '').trim()) || 60;
const total = (dur + 0.6).toFixed(2);

const style = [
  'Fontname=Malgun Gothic',
  'Fontsize=16',
  'Bold=1',
  'PrimaryColour=&H00FFFFFF&',
  'OutlineColour=&H00101010&',
  'BorderStyle=1',
  'Outline=3',
  'Shadow=1',
  'Alignment=2',
  'MarginV=120',
].join(',');

// 배경 소스 결정
const pick = (names) => names.find((n) => existsSync(path.join(dir, n))) || null;
const vid = pick(['bg.mp4']);
const img = pick(['bg.jpg', 'bg.jpeg', 'bg.png']);
const fill = 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30';

let inputs, pre, srcLabel;
if (vid) {
  inputs = ['-stream_loop', '-1', '-i', vid];
  pre = `${fill},drawbox=x=0:y=0:w=1080:h=1920:color=black@0.40:t=fill,`;
  srcLabel = '영상 ' + vid;
} else if (img) {
  inputs = ['-loop', '1', '-i', img];
  pre = `${fill},drawbox=x=0:y=0:w=1080:h=1920:color=black@0.45:t=fill,`;
  srcLabel = '이미지 ' + img;
} else {
  inputs = ['-f', 'lavfi', '-i', `color=c=${solid}:s=1080x1920:r=30:d=${total}`];
  pre = '';
  srcLabel = '단색 ' + solid;
}

const args = [
  '-y',
  ...inputs,
  '-i', 'voice.mp3',
  '-vf', `${pre}subtitles=captions.srt:force_style='${style}'`,
  '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '128k',
  '-shortest',
  `${id}.mp4`,
];

console.log(`▶ 합성  배경=${srcLabel}  길이=${dur.toFixed(1)}s`);
const r = spawnSync(FFMPEG, args, { cwd: dir, stdio: 'inherit' });
if (r.status !== 0) { console.error('✗ 합성 실패 (위 로그 확인)'); process.exit(1); }
console.log('✓ 완성:', path.relative(root, path.join(dir, id + '.mp4')));
