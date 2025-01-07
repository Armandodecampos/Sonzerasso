self.addEventListener('install', (event) => {
    console.log('Service Worker instalado.');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker ativado.');
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    console.log('Interceptando fetch:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});