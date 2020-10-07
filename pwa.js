var cacheName = 'lablnet-board-pwa';
let timestamp = new Date().getTime();
var filesToCache = [
    '/board/',
    '/board/index.html',
    `/board/config.js?t=${timestamp}`,
    `/board/css/app.css?t=${timestamp}`,
    `/board/js/app.js?t=${timestamp}`
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});
