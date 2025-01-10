// Instalação do Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Interceptação de requisições de áudio
self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('.mp3')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});

// Ativação do Service Worker
self.addEventListener('activate', () => {
  return self.clients.claim();
});
