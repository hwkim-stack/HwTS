import { pageShell, adUnit, esc } from './layout.mjs';

export function renderToolPage({ config, tool, tools }) {
  const bp = config.basePath || '';
  const faq = tool.faq || [];
  const faqHtml = faq.length
    ? `<section class="faq"><h2>자주 묻는 질문</h2>${faq
        .map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
        .join('')}</section>`
    : '';

  const related = tools
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 6)
    .map((t) => `<a href="${bp}/tools/${t.slug}/">${esc(t.title)}</a>`)
    .join('');

  const body = `
<nav class="breadcrumb"><a href="${bp}/">홈</a> › <span>${esc(tool.title)}</span></nav>
<h1>${esc(tool.title)}</h1>
<p class="lead">${esc(tool.description)}</p>
${adUnit(config, 'top')}
<section class="tool-card">
${tool.body || ''}
</section>
${tool.content ? `<section class="prose">${tool.content}</section>` : ''}
${adUnit(config, 'inContent')}
${faqHtml}
<section class="related"><h2>다른 도구</h2><div class="related-links">${related}</div></section>
${adUnit(config, 'footer')}
<script>${tool.script || ''}</script>
`;

  const jsonLd = faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  return pageShell({
    config,
    tools,
    title: `${tool.title} · ${config.siteName}`,
    description: tool.description,
    canonicalPath: `/tools/${tool.slug}/`,
    body,
    jsonLd,
  });
}
