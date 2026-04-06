const CACHE = 'book-ai-v1';

const ASSETS = [
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

// Pre-cache all assets on install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Clean up old caches on activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache-first, falling back to network — then cache new responses
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
