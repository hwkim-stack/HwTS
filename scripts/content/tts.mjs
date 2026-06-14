// 2·3단계 자동화: 내레이션 텍스트 → 음성(mp3) + 자막(srt)  [edge-tts, 무료·키 불필요]
// 사용법: node scripts/content/tts.mjs <videoId> [voice] [rate]
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const id = process.argv[2];
const voice = process.argv[3] || 'ko-KR-SunHiNeural'; // 여성. 남성: ko-KR-InJoonNeural
const rate = process.argv[4] || '+8%';                // 쇼츠는 살짝 빠르게

if (!id) {
  console.error('사용법: node scripts/content/tts.mjs <videoId> [voice] [rate]');
  process.exit(1);
}
const dir = path.join(root, 'content', 'videos', id);
const narration = path.join(dir, 'narration.txt');
if (!existsSync(narration)) {
  console.error('narration.txt 가 없습니다:', narration);
  console.error('→ content/videos/' + id + '/narration.txt 에 읽을 문장을 한 줄씩 넣으세요.');
  process.exit(1);
}
const audio = path.join(dir, 'voice.mp3');
const srt = path.join(dir, 'captions.srt');

console.log(`▶ TTS 생성  voice=${voice}  rate=${rate}`);
const r = spawnSync('python', [
  '-m', 'edge_tts',
  '--file', narration,
  '--voice', voice,
  `--rate=${rate}`,
  '--write-media', audio,
  '--write-subtitles', srt,
], { stdio: 'inherit' });

if (r.status !== 0) {
  console.error('✗ TTS 실패 (위 오류 확인). python -m pip install --user edge-tts 로 재설치 가능.');
  process.exit(1);
}
console.log('✓ 음성:', path.relative(root, audio));
console.log('✓ 자막:', path.relative(root, srt));
console.log('  다음: 합성(FFmpeg) 단계에서 배경+자막+음성 → mp4');
