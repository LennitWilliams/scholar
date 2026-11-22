/* Scholar service worker: app shell works offline; libraries are cached the first time you open the app online. */
const VER = 'scholar-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
const LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/epub.js/0.3.93/epub.min.js',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap'
];
const REMOTE_OK = /^https:\/\/(cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//;

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VER);
    await c.addAll(SHELL);                         // must succeed
    await Promise.allSettled(LIBS.map(async u => { // best effort
      const r = await fetch(u); if (r.ok) await c.put(u, r);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VER) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // app shell: network first (so updates arrive), fall back to cache offline
    e.respondWith((async () => {
      const c = await caches.open(VER);
      try {
        const r = await fetch(req);
        if (r.ok) c.put(req, r.clone());
        return r;
      } catch (err) {
        return (await c.match(req, { ignoreSearch: true })) || (req.mode === 'navigate' ? await c.match('index.html') : Response.error());
      }
    })());
  } else if (REMOTE_OK.test(req.url)) {
    // libraries & fonts: cache first
    e.respondWith((async () => {
      const c = await caches.open(VER);
      const hit = await c.match(req.url);
      if (hit) return hit;
      try {
        const r = await fetch(req.url.startsWith('https://fonts.gstatic') ? req : req.url);
        if (r.ok) c.put(req.url, r.clone());
        return r;
      } catch (err) { return Response.error(); }
    })());
  }
});
