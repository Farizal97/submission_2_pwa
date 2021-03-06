const CACHE_NAME = "football-data-app-v5";

const base_url = 'https://api.football-data.org/v2/'
var urlsToCache = [
    "/",
    "/index.html",
    "/nav.html",
    "/team.html",
    "/manifest.json",
    "/assets/css/materialize.min.css",
    "/assets/css/style.css",
    "/assets/js/idb.js",
    "/assets/js/db.js",
    "/assets/js/materialize.min.js",
    "/assets/js/api.js",
    "/assets/js/nav.js",
    "/assets/js/init.js",
    "/assets/js/script.js",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "/assets/images/icon-128x128.png",
    "/assets/images/icon-256x256.png",
    "/assets/images/icon-512x512.png",
    "/pages/fav-team.html",
    "/pages/home.html",
    "/pages/match.html"
]

// install cache
self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    )
})

self.addEventListener("fetch", function (e) {

    if (e.request.url.indexOf(base_url) > -1) {
        e.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return fetch(e.request).then(function (response) {
                    cache.put(e.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        e.respondWith(
            caches.match(e.request, { ignoreSearch: true }).then(function (response) {
                return response || fetch(e.request);
            })
        )
    }

})

// update cache 
self.addEventListener("activate", function (e) {
    e.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            )
        })
    )
})

self.addEventListener("push", function (e) {
    var body;
    if (e.data) {
        body = e.data.text();
    } else {
        body = "Push message no payload"
    }

    var options = {
        body: body,
        icon: 'assets/images/icon-512x512.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    e.waitUntil(
        self.registration.showNotification("Push notification", options)
    );
});