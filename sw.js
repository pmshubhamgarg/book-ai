const CACHE = 'book-ai-v2';

const PRECACHE = [
  '/book-ai/',
  '/book-ai/index.html',
  '/book-ai/shared.js',
  '/book-ai/manifest.json',
  '/book-ai/icon.svg',
  '/book-ai/outputs/hooked/index.html',
  '/book-ai/outputs/hooked/ch01-the-habit-zone.html',
  '/book-ai/outputs/hooked/ch02-trigger.html',
  '/book-ai/outputs/hooked/ch03-action.html',
  '/book-ai/outputs/hooked/ch04-variable-reward.html',
  '/book-ai/outputs/hooked/meta-summary.html',
];

// Pre-cache everything on install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Delete old caches on activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  const isHTML = url.pathname.endsWith('.html')
               || url.pathname.endsWith('/')
               || url.pathname === '/book-ai';

  if (isHTML) {
    // ── NETWORK FIRST for HTML pages ──────────────────────────────
    // Always try to get the freshest version. Fall back to cache only
    // if the user is truly offline.
    e.respondWith(
      fetch(e.request, { cache: 'no-cache' })
        .then(response => {
          if (response.ok) {
            caches.open(CACHE).then(c => c.put(e.request, response.clone()));
          }
          return response;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // ── CACHE FIRST for JS / images / assets ──────────────────────
    // Serve instantly from cache, but silently refresh in background
    // so the next visit gets the latest version.
    e.respondWith(
      caches.match(e.request).then(cached => {
        const networkFetch = fetch(e.request).then(response => {
          if (response.ok) {
            caches.open(CACHE).then(c => c.put(e.request, response.clone()));
          }
          return response;
        }).catch(() => cached);

        return cached || networkFetch;
      })
    );
  }
});
