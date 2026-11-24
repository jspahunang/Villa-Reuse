const http = require('http');
const fs = require('fs');
const path = require('path');

let port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  if (pathname === '/') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(path.join(__dirname, pathname));
  if (!safePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    let filePath = safePath;
    if (stats.isDirectory()) {
      filePath = path.join(safePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

function startServer(p) {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${p} is in use, trying ${p + 1}...`);
      startServer(p + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(p, () => {
    console.log(`\n  🌱 Villa-Reuse is running at:`);
    console.log(`  > Local:      http://localhost:${p}/`);
    console.log(`  > Post Item:  http://localhost:${p}/donate.html`);
    console.log(`  > Requests:   http://localhost:${p}/requests.html`);
    console.log(`  > Moderation: http://localhost:${p}/moderation.html`);
    console.log(`  > Admin:      http://localhost:${p}/admin.html`);
    console.log(`  > Impact:     http://localhost:${p}/impact.html`);
    console.log(`  > Profile:    http://localhost:${p}/profile.html`);
    console.log(`  > Sign In:    http://localhost:${p}/login.html\n`);
  });
}

startServer(port);
