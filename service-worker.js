const CACHE_NAME = 'sonzerasso-cache-v1';
const urlsToCache = [
  '/', // Página inicial
  '/index.html', // Substitua pelo caminho do seu arquivo HTML
  '/manifest.json',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/favicon-16x16.png',
  '/site.webmanifest',
  '/styles.css', // Substitua pelo caminho do seu CSS (separado)
  '/script.js', // Substitua pelo caminho do seu JS principal
];

// Instalar o Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Abrindo cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptar requisições e servir do cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Ativar o Service Worker e limpar caches antigos
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

// Manter a música tocando com sincronização em segundo plano
self.addEventListener('message', (event) => {
  if (event.data === 'keep-alive') {
    console.log('Manter ativo no segundo plano');
  }
});



