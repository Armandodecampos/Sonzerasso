const CACHE_NAME = 'sonzerasso-cache-v1';
const urlsToCache = [
  '/', // Página inicial
  '/index.html', // Página principal
  '/manifest.json', // Manifest do PWA
  '/apple-touch-icon.png', // Ícones
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/site.webmanifest',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css', // Font Awesome
  'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2', // Biblioteca Fuse.js para busca
  // Adicione mais URLs estáticas ou músicas aqui para cache
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache criado com sucesso!');
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Cache antigo removido:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interceptação de solicitações para servir do cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Manter a reprodução em segundo plano
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
