// Simple service worker for offline caching of static assets.

// Bump the cache version whenever assets change to ensure updated files are
// fetched and cached.  Version 2 adds new gallery and bulletin assets.
const CACHE_NAME = 'live-stream-hub-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-512x512.png',
  // Newly added assets for the gallery and bulletin
  '/cathedral.jpg',
  '/ordination.jpg',
  '/adoption.jpg',
  '/uganda-martyrs.jpg',
  '/stream-concept.png',
  '/martyrs-monument.png',
  '/pilgrimage.mp4'
];

self.addEventListener('install', event => {
  // Pre-cache the application shell and assets.
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', event => {
  // Clean up old caches if any.
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Respond with cache-first strategy.
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});