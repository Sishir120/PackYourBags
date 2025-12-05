// EMERGENCY SERVICE WORKER UNINSTALLER
// This service worker will uninstall itself and clear all caches
// Use this to force all users to get a fresh start

self.addEventListener('install', event => {
  console.log('[SW] Emergency uninstaller - installing...');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Emergency uninstaller - clearing all caches...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('[SW] Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        console.log('[SW] All caches cleared!');
        // Unregister this service worker
        return self.registration.unregister();
      })
      .then(() => {
        console.log('[SW] Service worker unregistered!');
        // Force reload all clients
        return self.clients.claim();
      })
      .then(() => {
        // Tell all clients to reload
        return self.clients.matchAll();
      })
      .then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'FORCE_RELOAD' });
        });
      })
  );
});

// Don't cache anything - just pass through
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});