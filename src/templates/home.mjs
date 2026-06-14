import { pageShell, adUnit, esc } from './layout.mjs';

export function renderHome({ config, tools }) {
  const bp = config.basePath || '';
  const cards = tools
    .map((t) => {
      const name = (t.title + ' ' + (t.keywords || []).join(' ')).toLowerCase();
      return `<a class="card" href="${bp}/tools/${t.slug}/" data-name="${esc(name)}">
  <span class="card-ico">${esc(t.icon || '🛠️')}</span>
  <span class="card-title">${esc(t.title)}</span>
  <span class="card-desc">${esc(t.description)}</span>
</a>`;
    })
    .join('\n');

  const body = `
<section class="hero">
  <h1>${esc(config.siteName)} — ${esc(config.tagline)}</h1>
  <p class="lead">설치 없이 바로 쓰는 무료 온라인 도구 모음. 미미 루프가 한 바퀴 돌 때마다 도구가 하나씩 늘어납니다.</p>
  <input id="tool-search" class="search" type="search" placeholder="도구 검색…" aria-label="도구 검색">
</section>
${adUnit(config, 'top')}
<section class="grid" id="tool-grid">
${cards}
</section>
${adUnit(config, 'footer')}
`;

  return pageShell({
    config,
    tools,
    title: `${config.siteName} · ${config.tagline}`,
    description: `${config.siteName} — ${config.tagline}. 퍼센트 계산기, 글자수 세기, 비밀번호 생성기 등 무료 온라인 도구.`,
    canonicalPath: '/',
    body,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: config.siteName,
      url: config.baseUrl || '',
    },
  });
}
