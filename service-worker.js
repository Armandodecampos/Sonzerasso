self.addEventListener('install', (event) => {
    console.log('Service Worker instalado.');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker ativado.');
    // Aqui você pode limpar caches antigos, se necessário
});

self.addEventListener('fetch', (event) => {
    console.log('Interceptando fetch:', event.request.url);

    // Permitir que solicitações de áudio passem diretamente
    if (event.request.url.endsWith('.mp3') || event.request.url.endsWith('.wav')) {
        return;
    }

    // Exemplo de estratégia de cache para outros tipos de arquivos
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log('Servindo do cache:', event.request.url);
                return cachedResponse;
            }

            console.log('Fazendo fetch para:', event.request.url);
            return fetch(event.request).then((networkResponse) => {
                return caches.open('dynamic-cache').then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
});
