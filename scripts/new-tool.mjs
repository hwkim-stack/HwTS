// 새 도구 스캐폴드: npm run new -- <slug> "<제목>"
import { writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
const title = process.argv[3] || slug;

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('사용법: npm run new -- <slug(영소문자·숫자·하이픈)> "<제목>"');
  console.error('예시:   npm run new -- bmi-calculator "BMI 계산기"');
  process.exit(1);
}

const file = path.join(root, 'src', 'tools', slug + '.mjs');
if (existsSync(file)) {
  console.error('이미 존재합니다:', path.relative(root, file));
  process.exit(1);
}

const tpl = `export default {
  slug: '${slug}',
  title: ${JSON.stringify(title)},
  icon: '🛠️',
  order: 100,
  description: ${JSON.stringify(title + ' — 무료 온라인 도구.')},
  keywords: [${JSON.stringify(title)}],
  body: \`
  <!-- TODO: 도구 UI (input/button/output) -->
  <p>여기에 도구를 구현하세요.</p>
  \`,
  content: \`<h2>사용 방법</h2><p>TODO: 검색 노출용 설명을 한국어로 작성하세요.</p>\`,
  faq: [
    { q: 'TODO 질문?', a: 'TODO 답변.' },
    { q: 'TODO 질문?', a: 'TODO 답변.' },
  ],
  // 주의: script 안에서는 백틱(\`) 금지, 따옴표만 사용하세요(빌드 템플릿 충돌 방지).
  script: \`
  // TODO: 순수 클라이언트 JS. 외부 라이브러리/네트워크 호출 금지.
  \`,
};
`;

await writeFile(file, tpl, 'utf8');
console.log('✓ 생성:', path.relative(root, file));
console.log('  도구 로직을 채운 뒤  npm run build  →  npm run serve  로 확인하세요.');
