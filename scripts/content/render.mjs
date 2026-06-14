// 4·5단계 자동화: 배경 + 자막(번인) + 음성 → 9:16 mp4  [FFmpeg, 무료]
// 사용법: node scripts/content/render.mjs <videoId> [bgColor]
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

// tools/ 에 받은 정적 빌드에서 ffmpeg/ffprobe 찾기 → 없으면 시스템 PATH
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
const bg = process.argv[3] || '0x0E1320'; // 어두운 남색
if (!id) { console.error('사용법: node scripts/content/render.mjs <videoId> [bgColor]'); process.exit(1); }

const dir = path.join(root, 'content', 'videos', id);
const audio = path.join(dir, 'voice.mp3');
const srt = path.join(dir, 'captions.srt');
if (!existsSync(audio) || !existsSync(srt)) {
  console.error('voice.mp3 / captions.srt 가 없습니다. 먼저: node scripts/content/tts.mjs ' + id);
  process.exit(1);
}

// 음성 길이
const probe = spawnSync(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', 'voice.mp3'], { cwd: dir, encoding: 'utf8' });
const dur = parseFloat((probe.stdout || '').trim()) || 60;
const total = (dur + 0.6).toFixed(2);

// 자막 스타일 (큰 글씨·가운데·외곽선). 한글 폰트 = 맑은 고딕
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

// cwd=영상폴더 → 파일명만 써서 윈도우 경로 이스케이프 회피
const args = [
  '-y',
  '-f', 'lavfi', '-i', `color=c=${bg}:s=1080x1920:r=30:d=${total}`,
  '-i', 'voice.mp3',
  '-vf', `subtitles=captions.srt:force_style='${style}'`,
  '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '128k',
  '-shortest',
  `${id}.mp4`,
];

console.log(`▶ 합성  ffmpeg=${path.basename(FFMPEG)}  길이=${dur.toFixed(1)}s  배경=${bg}`);
const r = spawnSync(FFMPEG, args, { cwd: dir, stdio: 'inherit' });
if (r.status !== 0) { console.error('✗ 합성 실패 (위 로그 확인)'); process.exit(1); }
console.log('✓ 완성:', path.relative(root, path.join(dir, id + '.mp4')));
