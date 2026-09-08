// sw.js - Located in the root directory
const CACHE_NAME = 'WebOS-V0.1';

// Add the exact paths to your core system files here
const ASSETS_TO_CACHE = [
   '/',
   '/index.html',
   '/html/DisplayManager_PopIT.html',
	'/html/BootScreen_popcorn.html',
   '/js/app.js',
	'/css/universal_css_native_stuff.css'
];

// Install Event: Download and cache core OS assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[WebOS Kernel] Caching system binaries and assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Force this worker to activate immediately
});

// Activate Event: Clear out old OS cache versions when you update the system
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[WebOS Kernel] Clearing legacy system cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all open windows/iframes immediately
});

// Fetch Event: Intercept network traffic. Try cache first, fall back to network.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return the cached file if we have it, otherwise fetch from server/local server
      return cachedResponse || fetch(event.request);
    })
  );
});
