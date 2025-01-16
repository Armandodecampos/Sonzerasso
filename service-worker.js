self.addEventListener('install', function(event) {
    console.log('Service Worker instalado.');
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker ativado.');
});

// Mantém o áudio tocando em segundo plano
self.addEventListener('fetch', function(event) {
    if (event.request.url.includes('audio')) {
        event.respondWith(fetch(event.request));
    }
});
