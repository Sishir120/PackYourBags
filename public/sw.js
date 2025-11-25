const CACHE_NAME = 'packyourbags-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Filter out URLs that don't exist to prevent installation failures
        const validUrls = urlsToCache.filter(url => {
          // Skip URLs that are likely to fail
          return !url.includes('.jsx') && !url.includes('src/');
        });
        
        return cache.addAll(validUrls).catch(error => {
          console.warn('Failed to cache some resources:', error);
          // Continue with installation even if some resources fail to cache
          return Promise.resolve();
        });
      })
  );
});

self.addEventListener('fetch', event => {
  // Skip cross-origin requests to avoid issues with external APIs
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip requests for source maps and other development files
  if (event.request.url.includes('.jsx') || 
      event.request.url.includes('src/') ||
      event.request.url.includes('.map')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Try to fetch from network
        return fetch(event.request).catch(() => {
          // If fetch fails, return a basic response or offline page
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});

self.addEventListener('activate', event => {
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