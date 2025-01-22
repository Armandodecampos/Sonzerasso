const CACHE_NAME = 'artistas-cache-v1';
const CACHE_KEY = 'links-artistas';

// Evento de instalação do Service Worker
self.addEventListener('install', function (event) {
  console.log('Service Worker instalado.');
});

// Evento de ativação do Service Worker
self.addEventListener('activate', function (event) {
  console.log('Service Worker ativado.');
});

// Evento de busca no cache e manutenção de áudio em segundo plano
self.addEventListener('fetch', function (event) {
  if (event.request.url.includes('audio')) {
    // Garantir que o áudio continue sendo reproduzido em segundo plano
    event.respondWith(fetch(event.request));
    return;
  }

  // Lógica de cache para os links dos artistas
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(CACHE_KEY).then((response) => {
        if (response) {
          return response; // Retorna os links do cache
        }

        // Busca o recurso na rede e o armazena no cache
        return fetch(event.request).then((networkResponse) => {
          if (event.request.url.includes('links-artistas')) {
            cache.put(CACHE_KEY, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});
