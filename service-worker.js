self.addEventListener('install', (event) => {
  console.log('Service Worker instalado.');
  event.waitUntil(
    caches.open('sonzerasso-v1').then((cache) => {
      return cache.addAll([
        '/', 
        '/index.html', 
        '/style.css', 
        '/script.js',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Background Sync para ressincronizar dados offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-audio') {
    event.waitUntil(
      fetch('/sync-audio-endpoint').then(() => {
        console.log('Áudio sincronizado em segundo plano.');
      })
    );
  }
});
