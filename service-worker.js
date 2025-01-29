const CACHE_NAME = 'sonzerasso-cache-v1';
const urlsToCache = [
  '/', 
  '/index.html', 
  '/manifest.json',
  '/favicon-32x32.png',
  '/apple-touchs-icon.png',
  '/favicon-16x16.png',
  '/site.webmanifest',
  '/styles.css', 
  '/script.js', 
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
    caches.match(event.event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Ativar o Service Worker, limpar caches antigos e verificar atualizações
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

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            return fetch(key.url).then((response) => {
              if (response.status === 200) {
                cache.put(key, response);
              }
            });
          })
        );
      });
    })
  );
});

// Manter a música tocando com sincronização em segundo plano
self.addEventListener('message', (event) => {
  if (event.data === 'keep-alive') {
    console.log('Manter ativo no segundo plano');
  }
});
