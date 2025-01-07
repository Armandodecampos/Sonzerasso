self.addEventListener('install', (event) => {
    console.log('Service Worker instalado.');
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    console.log('Interceptando fetch:', event.request.url);
    // Permitir que as solicitações de áudio passem
    if (event.request.url.includes('.mp3') || event.request.url.includes('.wav')) {
        return;
    }
});
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration.scope);
    }).catch((error) => {
        console.error('Falha ao registrar o Service Worker:', error);
    });
}