// dist/ 를 로컬에서 미리보는 초경량 정적 서버 (의존성 없음)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = process.env.PORT || 8080;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.png': 'image/png', '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    let fp = path.join(root, p);
    try { if ((await stat(fp)).isDirectory()) fp = path.join(fp, 'index.html'); } catch (e) {}
    let data;
    try {
      data = await readFile(fp);
    } catch (e) {
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      res.end(await readFile(path.join(root, '404.html')).catch(() => Buffer.from('404 Not Found')));
      return;
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(fp)] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    res.writeHead(500); res.end('500');
  }
});

server.listen(PORT, () => console.log(`\n▶ http://localhost:${PORT}  (dist/ 서빙 중, Ctrl+C 로 종료)\n`));
