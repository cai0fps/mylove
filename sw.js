const CACHE_NAME = 'mylove-cache-v5';
const localUrlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json'
];

const externalUrlsToCache = [
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Instalação síncrona dos arquivos locais cruciais
                cache.addAll(localUrlsToCache);
                
                // Fetch de dependências externas ignorando bloqueio de CORS
                return Promise.all(
                    externalUrlsToCache.map(url => {
                        return fetch(new Request(url, { mode: 'no-cors' }))
                            .then(response => cache.put(url, response))
                            .catch(err => console.warn('Falha ao cachear URL externa (verifique conexão):', url));
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
    // Evita cachear extensões ou esquemas não HTTP/HTTPS
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Devolve a versão em cache se existir, caso contrário busca na internet
                return response || fetch(event.request).then(fetchRes => {
                    return caches.open(CACHE_NAME).then(cache => {
                        // Guarda na cache os novos recursos que forem sendo carregados
                        if(event.request.method === 'GET') {
                            cache.put(event.request, fetchRes.clone());
                        }
                        return fetchRes;
                    });
                });
            }).catch(() => {
                // Proteção contra falha total
                return new Response('Conteúdo offline não disponível.');
            })
    );
});
