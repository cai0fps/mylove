const CACHE_NAME = 'mylove-cache-v24';

const APP_SHELL = [
  './',
  './index.html',
  './offline.html',
  './style.css',
  './config.json',
  './js/main.js',
  './js/audio.js',
  './js/ui.js',
  './js/timer.js',
  './js/wrapped.js',
  './tela-inicial/nova.jpg'
];

// instala e já força a nova versão
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

// ativa e remove caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// estratégia:
// - HTML: network first
// - CSS/JS/imagens locais: cache first com atualização em background
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // só trata GET
  if (request.method !== 'GET') return;

  // HTML / navegação -> busca na rede primeiro
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put('./index.html', responseClone);
          });
          return networkResponse;
        })
        .catch(() => caches.match('./offline.html'))
    );
    return;
  }

  // arquivos locais do próprio site
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
