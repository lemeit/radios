const CACHE = 'miradio-v9';
const ASSETS = [
  './', './index.html', './manifest.json', './hls.min.js', './app.js', './styles.css',
  './icon-180.png', './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './assets/miradio-mark-v2.png', './assets/radio10.png', './assets/destape.png',
  './assets/station-2.png', './assets/station-3.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  // No interceptar las transmisiones ni los recursos de otros servidores.
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
