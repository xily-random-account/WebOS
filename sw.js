const CACHE_NAME = 'webos-v3';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/html/BootScreen_popcorn.html',
  '/html/DisplayManager_PopIT.html',
  '/html/Launcher_Popo.html',
  '/html/apps/emulator_alpine/index.html',
  '/css/universal_css_native_stuff.css',
  '/js/app.js',
  '/js/libv86.js',
  '/html/apps/emulator_alpine/emulator.js',
  '/html/apps/emulator_alpine/seabios.bin',
  '/html/apps/emulator_alpine/vgabios.bin',
  '/html/apps/emulator_alpine/v86.wasm'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames
        .filter((cacheName) => cacheName !== CACHE_NAME)
        .map((cacheName) => caches.delete(cacheName))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
          const responseCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseCopy));
        }
        return networkResponse;
      });
    })
  );
});
