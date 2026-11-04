// Keeps the 15MB pose model and engine on the phone after the first visit,
// so later runs start fast and work on weak connections.
const CACHE = 'pushup-v1';
const HEAVY = ['lib/vision_bundle.js', 'lib/vision_wasm_internal.js', 'lib/vision_wasm_internal.wasm', 'model/pose_landmarker_lite.task'];

self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  const heavy = HEAVY.some((p) => url.pathname.endsWith(p));
  if (heavy) {
    // cache first: these files never change for a given version
    e.respondWith(caches.open(CACHE).then(async (c) => {
      const hit = await c.match(e.request);
      if (hit) return hit;
      const res = await fetch(e.request);
      if (res.ok) c.put(e.request, res.clone());
      return res;
    }));
  } else {
    // network first for the page itself, so updates show up; fall back to cache offline
    e.respondWith(fetch(e.request).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request)));
  }
});
