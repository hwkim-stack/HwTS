// 영상 패키지 스캐폴드: npm run content:new -- <nicheId> "<제목/훅>"
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nicheId = process.argv[2];
const title = process.argv[3] || '';

const statePath = path.join(root, 'content', 'state.json');
const state = JSON.parse(await readFile(statePath, 'utf8'));
const niche = state.experiment.niches.find((n) => n.id === nicheId);

if (!nicheId || !niche) {
  console.error('사용법: npm run content:new -- <nicheId> "<제목/훅>"');
  console.error('가능한 nicheId: ' + state.experiment.niches.map((n) => n.id).join(', '));
  process.exit(1);
}

const seq = (state.videos || []).filter((v) => v.niche === nicheId).length + 1;
const id = nicheId + '-' + seq;
const dir = path.join(root, 'content', 'videos', id);
if (existsSync(dir)) { console.error('이미 존재:', id); process.exit(1); }
await mkdir(path.join(dir, 'assets'), { recursive: true });

const script = `# ${id} · ${niche.title}
제목/훅: ${title}

## 0~2초 훅 (스크롤 멈추게)
> TODO: 첫 문장. "왜 봐야 하는지"가 즉시 꽂혀야 함.

## 본문 (25~45초, 자막 그대로)
> TODO: 짧은 문장 6~10개. 군더더기 0. 끝까지 봐야 답 나오게.

## 마무리 / CTA
> TODO: 1개만 (구독 or "다음 편: ...")

## 비주얼 / 샷리스트
- 0:00 TODO
- 0:05 TODO
(스톡 영상/이미지 또는 generate_video/image 로 생성. 자막은 큰 글씨.)

## 성우(TTS) 대본
> 위 훅+본문+CTA를 자연스러운 구어체로. generate_audio 또는 무료 TTS.
`;

const meta = `[제목 후보]
1. ${title}
2. TODO
3. TODO

[설명]
TODO (1~2줄 + 관련 영상 링크)

[해시태그]
#TODO #TODO #TODO

[썸네일 문구(쇼츠는 첫 프레임)]
TODO (3~5글자, 크게)

[발행 전 체크]
- [ ] virality_predictor 점수 확인(선택)
- [ ] 자막 가독성
- [ ] 훅 0~2초 OK
- [ ] 저작권 음원/영상 확인
`;

await writeFile(path.join(dir, 'script.md'), script, 'utf8');
await writeFile(path.join(dir, 'meta.txt'), meta, 'utf8');

state.videos = state.videos || [];
state.videos.push({ id, niche: nicheId, title, status: 'draft', createdAt: new Date().toISOString().slice(0, 10) });
state.updatedAt = new Date().toISOString().slice(0, 10);
await writeFile(statePath, JSON.stringify(state, null, 2) + '\n', 'utf8');

console.log('✓ 생성:', path.relative(root, dir));
console.log('  - script.md / meta.txt 를 채우세요. (state.json 에 draft 로 등록됨)');
console.log('  다음: 대본·비주얼 완성 → /content-ship 으로 발행 기록');
