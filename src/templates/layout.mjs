// 공용 페이지 템플릿. 모든 페이지는 pageShell()로 감싼다.

export function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function adsenseReady(config) {
  const ad = config.adsense || {};
  return !!(ad.enabled && ad.publisherId && !ad.publisherId.includes('XXXX'));
}

// 광고 슬롯. AdSense 미설정 시에는 레이아웃 확인용 플레이스홀더를 렌더한다.
export function adUnit(config, slotKey) {
  const ad = config.adsense || {};
  const slot = ad.slots && ad.slots[slotKey];
  const ready = adsenseReady(config) && slot && !/^0+$/.test(slot);
  if (!ready) {
    return `<div class="ad ad--ph" aria-hidden="true">광고 영역 · AdSense 승인 후 표시됩니다</div>`;
  }
  return `<ins class="adsbygoogle ad" style="display:block" data-ad-client="${esc(ad.publisherId)}" data-ad-slot="${esc(slot)}" data-ad-format="auto" data-full-width-responsive="true"></ins>` +
    `<script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>`;
}

export function pageShell({ config, title, description, canonicalPath = '/', body, tools = [], jsonLd = null, extraHead = '' }) {
  const base = (config.baseUrl || '').replace(/\/$/, '');
  const canonical = base + canonicalPath;
  const bp = config.basePath || '';
  const ad = config.adsense || {};
  const adsenseHead = adsenseReady(config)
    ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(ad.publisherId)}" crossorigin="anonymous"></script>`
    : '<!-- AdSense: mimi/config.json 의 adsense.publisherId 설정 후 npm run build -->';
  const nav = tools
    .map((t) => `<a href="${bp}/tools/${t.slug}/">${esc(t.title)}</a>`)
    .join('');
  const jsonLdTag = jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
    : '';

  return `<!doctype html>
<html lang="${esc(config.locale || 'ko-KR')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${esc(canonical)}">
<meta name="robots" content="index,follow">
<link rel="icon" href="${bp}/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${bp}/assets/styles.css">
${adsenseHead}
${jsonLdTag}
${extraHead}
</head>
<body>
<header class="site-header">
  <a class="brand" href="${bp}/">🐣 ${esc(config.siteName || 'ToolSeed')}</a>
  <nav class="nav">${nav}</nav>
  <button id="theme-toggle" class="theme-toggle" type="button" aria-label="테마 전환">🌓</button>
</header>
<main class="container">
${body}
</main>
<footer class="site-footer">
  <p><strong>${esc(config.siteName || 'ToolSeed')}</strong> · ${esc(config.tagline || '')}</p>
  <p class="muted">© <span id="yr"></span> ${esc(config.siteName || 'ToolSeed')} · 모든 계산은 브라우저 안에서 처리되며 입력값은 서버로 전송되지 않습니다.</p>
</footer>
<script src="${bp}/assets/main.js" defer></script>
</body>
</html>`;
}
