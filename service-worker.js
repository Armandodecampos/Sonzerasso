// Nome do cache
const CACHE_NAME = 'audio-cache-dynamic-v1';

// Evento de instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalado');
  // Ativa o Service Worker imediatamente sem esperar o navegador atualizar
  self.skipWaiting();
});

// Evento de ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativado');
  // Remove caches antigos se o nome do cache for atualizado
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
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

// Evento de busca no cache
self.addEventListener('fetch', (event) => {
  // Ignora requisições que não sejam GET
  if (event.request.method !== 'GET') return;

  // Adiciona as requisições dinamicamente ao cache
  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      // Retorna do cache se disponível, senão busca na rede
      return (
        cacheResponse ||
        fetch(event.request).then((networkResponse) => {
          // Adiciona a resposta da rede ao cache
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
      );
    })
  );
});

// Gerenciar notificações e manter áudio ativo no background
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});
