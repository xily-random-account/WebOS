const CACHE_NAME = 'webos-v8';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/html/BootScreen_popcorn.html',
  '/html/DisplayManager_PopIT.html',
  '/js/os/desktop/app-registry.js',
  '/js/os/desktop/filesystem.js',
  '/html/Launcher_Popo.html',
  '/html/apps/emulator_alpine/index.html',
  '/html/apps/emulator_alpine/asset-config.js',
  '/css/universal_css_native_stuff.css',
  '/js/app.js'
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
  const requestUrl = new URL(request.url);
  if (request.method !== 'GET' || requestUrl.origin !== self.location.origin || requestUrl.pathname.endsWith('.iso')) {
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
