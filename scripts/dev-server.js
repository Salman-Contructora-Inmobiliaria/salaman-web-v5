/**
 * Servidor local SALMAN · sin dependencias externas obligatorias.
 * Sirve el sitio y las rutas /api/salma-chat, /api/chat, /api/meta-whatsapp y /api/health.
 *
 * Uso:
 *   node scripts/dev-server.js
 *
 * Carga .env.local o .env si existen.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const salmaChatHandler = require('../api/salma-chat');
const metaWhatsAppHandler = require('../api/meta-whatsapp');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 8080);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function loadEnv(file) {
  try {
    const text = fs.readFileSync(path.join(ROOT, file), 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match) {
        const value = match[2].replace(/^["']|["']$/g, '');
        if (!process.env[match[1]]) process.env[match[1]] = value;
      }
    }
  } catch (_) { /* archivo opcional */ }
}
loadEnv('.env.local');
loadEnv('.env');

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload));
}

function readBody(req, limit = 1_000_000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', chunk => {
      size += chunk.length;
      if (size > limit) { reject(new Error('body_too_large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const str = Buffer.concat(chunks).toString('utf8');
        resolve(str ? JSON.parse(str) : {});
      } catch (_) {
        reject(new Error('invalid_json'));
      }
    });
    req.on('error', reject);
  });
}

function serveStatic(req, res) {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = pathname === '/' ? '/index.html' : pathname;
  file = path.normalize(file).replace(/^(\.\.[/\\])+/, '');
  const abs = path.join(ROOT, file);
  if (!abs.startsWith(ROOT)) return json(res, 403, { error: 'forbidden' });
  fs.stat(abs, (err, stat) => {
    if (err || !stat.isFile()) return json(res, 404, { error: 'not_found' });
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(abs).pipe(res);
  });
}

function adaptServerlessRes(res) {
  return {
    setHeader: (k, v) => res.setHeader(k, v),
    status: (code) => ({
      json: (data) => json(res, code, data),
      send: (body) => {
        res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(body);
      },
      end: () => {
        res.writeHead(code);
        res.end();
      }
    })
  };
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, 'http://localhost');
  const pathname = parsedUrl.pathname;

  if (pathname === '/api/health' && req.method === 'GET') {
    return json(res, 200, {
      ok: true,
      service: 'salman-voice-chat',
      geminiConfigured: Boolean((process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim()),
      metaConfigured: Boolean((process.env.META_ACCESS_TOKEN || process.env.WHATSAPP_TOKEN || '').trim()),
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      voice: 'browser-webspeech-neural',
      runtime: 'local-node'
    });
  }

  if (pathname === '/api/salma-chat' || pathname === '/api/chat' || pathname === '/api/salma-voice') {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      return res.end();
    }
    try {
      req.body = await readBody(req);
    } catch (_) {
      req.body = {};
    }
    return salmaChatHandler(req, adaptServerlessRes(res));
  }

  if (pathname === '/api/meta-whatsapp' || pathname === '/api/whatsapp') {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      return res.end();
    }
    if (req.method === 'POST') {
      try {
        req.body = await readBody(req);
      } catch (_) {
        req.body = {};
      }
    }
    return metaWhatsAppHandler(req, adaptServerlessRes(res));
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return json(res, 405, { error: 'method_not_allowed' });
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  const geminiConfigured = Boolean((process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim());
  const metaConfigured = Boolean((process.env.META_ACCESS_TOKEN || process.env.WHATSAPP_TOKEN || '').trim());
  console.log(`SALMAN local:   http://localhost:${PORT}/`);
  console.log(`Voice Lab:      http://localhost:${PORT}/voz.html`);
  console.log(`Gemini Flash:   ${geminiConfigured ? 'conectado' : 'sin clave (modo demo/fallback)'}`);
  console.log(`Meta WhatsApp:  ${metaConfigured ? 'conectado' : 'modo sandbox/simulación'}`);
});
