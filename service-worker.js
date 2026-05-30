const CACHE_NAME = 'm1-good-good-jsonp-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './dashboard.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.url.includes('script.google.com') || req.url.includes('script.googleusercontent.com')) {
    event.respondWith(fetch(req));
    return;
  }
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});
