const CACHE_NAME = 'webos-v10';

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
  '/html/apps/emulator_alpine/alpine.ext2',
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

  if (requestUrl.pathname === '/html/apps/emulator_alpine/alpine.ext2' && request.headers.has('range')) {
    event.respondWith(serveRange(request));
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

async function serveRange(request) {
  const cache = await caches.open(CACHE_NAME);
  let response = await cache.match('/html/apps/emulator_alpine/alpine.ext2');
  if (!response) {
    response = await fetch('/html/apps/emulator_alpine/alpine.ext2');
    if (!response.ok) return response;
    await cache.put('/html/apps/emulator_alpine/alpine.ext2', response.clone());
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  const range = request.headers.get('range').match(/bytes=(\d+)-(\d*)/);
  if (!range) return new Response(bytes, { status: 200, headers: response.headers });

  const start = Number(range[1]);
  const requestedEnd = range[2] ? Number(range[2]) : bytes.length - 1;
  const end = Math.min(requestedEnd, bytes.length - 1);
  if (start >= bytes.length || start > end) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${bytes.length}` } });
  }

  return new Response(bytes.slice(start, end + 1), {
    status: 206,
    headers: {
      'Accept-Ranges': 'bytes',
      'Content-Length': String(end - start + 1),
      'Content-Range': `bytes ${start}-${end}/${bytes.length}`,
      'Content-Type': 'application/octet-stream',
      'ETag': 'webos-alpine-ext2'
    }
  });
}
