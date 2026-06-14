// 사이트 빌더: src/tools/*.mjs + mimi/config.json → dist/
import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { pageShell } from '../src/templates/layout.mjs';
import { renderHome } from '../src/templates/home.mjs';
import { renderToolPage } from '../src/templates/tool.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const toolsDir = path.join(root, 'src', 'tools');

async function loadConfig() {
  return JSON.parse(await readFile(path.join(root, 'mimi', 'config.json'), 'utf8'));
}

function normPath(p) {
  if (!p) return '';
  p = String(p).trim();
  if (p && !p.startsWith('/')) p = '/' + p;
  return p.replace(/\/$/, '');
}

// 우선순위: config 에 명시값이 있으면 그것, 없으면 CI 환경변수(자동), 없으면 기본값.
// → 로컬은 루트(""), GitHub Pages 프로젝트 사이트는 /저장소명, 커스텀 도메인은 config 로 덮어쓰기.
function resolveConfig(raw) {
  const basePath = raw.basePath != null
    ? normPath(raw.basePath)
    : (process.env.SITE_BASE_PATH != null ? normPath(process.env.SITE_BASE_PATH) : '');
  const placeholderUrl = !raw.baseUrl || raw.baseUrl.includes('example.com');
  const baseUrl = placeholderUrl ? (process.env.SITE_BASE_URL || raw.baseUrl || '') : raw.baseUrl;
  return { ...raw, basePath, baseUrl };
}

async function loadTools() {
  const files = (await readdir(toolsDir)).filter((f) => f.endsWith('.mjs') && f !== 'index.mjs');
  const tools = [];
  for (const f of files.sort()) {
    const mod = await import(pathToFileURL(path.join(toolsDir, f)).href);
    if (mod.default && mod.default.slug) tools.push(mod.default);
    else console.warn('! 건너뜀(default export 없음):', f);
  }
  tools.sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.title.localeCompare(b.title, 'ko'));
  return tools;
}

function today() { return new Date().toISOString().slice(0, 10); }

function renderSitemap(config, tools) {
  const base = (config.baseUrl || '').replace(/\/$/, '');
  const urls = ['/', ...tools.map((t) => `/tools/${t.slug}/`)];
  const body = urls
    .map((u) => `  <url><loc>${base}${u}</loc><lastmod>${today()}</lastmod></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function renderRobots(config) {
  const base = (config.baseUrl || '').replace(/\/$/, '');
  return `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`;
}

function renderAdsTxt(config) {
  const pub = (config.adsense && config.adsense.publisherId) || '';
  if (!pub || pub.includes('XXXX')) {
    return '# AdSense 승인 후 mimi/config.json 의 publisherId 를 채우고 npm run build 하면 자동 생성됩니다.\n';
  }
  const pubNum = pub.replace(/^ca-/, '');
  return `google.com, ${pubNum}, DIRECT, f08c47fec0942fa0\n`;
}

function render404(config, tools) {
  return pageShell({
    config,
    tools,
    title: `페이지를 찾을 수 없음 · ${config.siteName}`,
    description: '요청하신 페이지가 없습니다.',
    canonicalPath: '/404.html',
    body: `<section class="hero"><h1>404</h1><p class="lead">찾는 페이지가 없습니다.</p><p><a href="${config.basePath || ''}/">홈으로 돌아가기</a></p></section>`,
  });
}

async function build() {
  const config = resolveConfig(await loadConfig());
  const tools = await loadTools();

  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });

  const assetsSrc = path.join(root, 'src', 'assets');
  if (existsSync(assetsSrc)) await cp(assetsSrc, path.join(distDir, 'assets'), { recursive: true });

  await writeFile(path.join(distDir, 'index.html'), renderHome({ config, tools }), 'utf8');

  for (const tool of tools) {
    const dir = path.join(distDir, 'tools', tool.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), renderToolPage({ config, tool, tools }), 'utf8');
  }

  await writeFile(path.join(distDir, 'sitemap.xml'), renderSitemap(config, tools), 'utf8');
  await writeFile(path.join(distDir, 'robots.txt'), renderRobots(config), 'utf8');
  await writeFile(path.join(distDir, 'ads.txt'), renderAdsTxt(config), 'utf8');
  await writeFile(path.join(distDir, '404.html'), render404(config, tools), 'utf8');
  await writeFile(path.join(distDir, '.nojekyll'), '', 'utf8'); // GitHub Pages: Jekyll 처리 비활성화
  if (config.cname) await writeFile(path.join(distDir, 'CNAME'), String(config.cname).trim() + '\n', 'utf8');

  console.log(`\n✓ 빌드 완료 — 도구 ${tools.length}개 → dist/  (basePath: "${config.basePath || '(root)'}")`);
  console.log('  ' + tools.map((t) => t.slug).join(', '));
  const adReady = config.adsense && config.adsense.publisherId && !config.adsense.publisherId.includes('XXXX');
  if (!adReady) console.log('  ⚠ AdSense 미설정: mimi/config.json 의 publisherId 를 채우면 실제 광고가 표시됩니다.');
  if ((config.baseUrl || '').includes('example.com')) console.log('  ⚠ baseUrl 이 example.com 입니다. 실제 도메인으로 바꾸세요(sitemap/canonical에 사용).');
  console.log('  미리보기: npm run serve\n');
}

build().catch((e) => { console.error(e); process.exit(1); });
