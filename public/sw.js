// Generate dynamic cache name with timestamp to force cache updates on new deployments
const CACHE_VERSION = 'v2'; // Increment this when you want to force a cache refresh
const CACHE_NAME = `packyourbags-${CACHE_VERSION}-${Date.now()}`;
const STATIC_CACHE_NAME = `packyourbags-static-${CACHE_VERSION}`;

// Static resources that rarely change
const STATIC_RESOURCES = [
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// Force the service worker to activate immediately
self.addEventListener('install', event => {
  console.log('[SW] Installing new service worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static resources');
        return cache.addAll(STATIC_RESOURCES).catch(error => {
          console.warn('[SW] Failed to cache some static resources:', error);
          return Promise.resolve();
        });
      })
      .then(() => self.skipWaiting()) // Force activation
  );
});

// Clean up old caches on activation
self.addEventListener('activate', event => {
  console.log('[SW] Activating new service worker...');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete all old caches except current static cache
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
      .then(() => self.clients.claim()) // Take control immediately
  );
});

// Network-first strategy for HTML and JS/CSS assets
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip development files
  if (url.pathname.includes('.jsx') ||
    url.pathname.includes('src/') ||
    url.pathname.includes('.map')) {
    return;
  }

  // Network-first strategy for HTML, JS, and CSS
  if (request.destination === 'document' ||
    url.pathname.endsWith('.html') ||
    url.pathname.includes('/assets/')) {

    event.respondWith(
      fetch(request)
        .then(response => {
          // If fetch succeeds, update cache and return response
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache as fallback
          return caches.match(request).then(cachedResponse => {
            if (cachedResponse) {
              console.log('[SW] Serving from cache (offline):', request.url);
              return cachedResponse;
            }
            // Return offline page for documents
            if (request.destination === 'document') {
              return new Response(
                '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
                { headers: { 'Content-Type': 'text/html' } }
              );
            }
            return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
          });
        })
    );
  }
  // Cache-first for static resources (icons, manifest)
  else if (STATIC_RESOURCES.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        return cachedResponse || fetch(request).then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
    );
  }
  // Default: network-only for everything else (API calls, images, etc.)
  else {
    event.respondWith(fetch(request));
  }
});