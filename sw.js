const CACHE_NAME = 'mylove-cache-v6';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './tela-inicial/nova.jpg',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Utiliza fetch com no-cors para impedir que falhas em domínios externos quebrem a instalação
                return Promise.all(
                    urlsToCache.map(url => {
                        return fetch(new Request(url, { mode: url.startsWith('http') ? 'no-cors' : 'cors' }))
                            .then(response => cache.put(url, response))
                            .catch(err => console.warn('Falha ao cachear URL:', url));
                    })
                );
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache); // Limpa cache velha
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request).then(fetchRes => {
                    return caches.open(CACHE_NAME).then(cache => {
                        if(event.request.method === 'GET') {
                            cache.put(event.request, fetchRes.clone());
                        }
                        return fetchRes;
                    });
                });
            }).catch(() => {
                return new Response('Conteúdo offline não disponível.');
            })
    );
});
