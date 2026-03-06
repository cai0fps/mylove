const CACHE_NAME = 'mylove-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/offline.html',
    '/style.css',
    '/config.json',
    '/js/main.js',
    '/js/audio.js',
    '/js/ui.js',
    '/js/timer.js',
    '/js/wrapped.js',
    '/tela-inicial/nova.jpg'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            const fetchPromise = fetch(e.request).then(networkResponse => {
                // Atualiza o cache silenciosamente (Stale-While-Revalidate)
                if (networkResponse && networkResponse.status === 200) {
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, networkResponse.clone()));
                }
                return networkResponse;
            }).catch(() => {
                // Se falhar rede e não tiver cache HTML, mostra tela offline
                if (e.request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }
            });
            return cachedResponse || fetchPromise;
        })
    );
});
