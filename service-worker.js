const CACHE_NAME = 'audio-player-cache-v1';

// Evento de instalação
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalado');
  self.skipWaiting();
});

// Evento de ativação
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativado');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

// Evento de busca (Cache falling back to Network)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      return (
        cacheResponse ||
        fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
      );
    })
  );
});
