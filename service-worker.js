self.addEventListener('install', (event) => {
  console.log('Service Worker instalado.');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado.');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  console.log('Interceptando fetch:', event.request.url);
  
  if (event.request.url.match(/\.(mp3|wav)$/)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
