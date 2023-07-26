const cacheName = "cache-v1.0";
const resourcesToPreCache = [
   "/",
   "index.html",
   "style.css",
   "index.js",
   "manifest.json",
   "assets/images/favicon-32x32.png",
   "assets/images/icon-arrow.svg",
];

self.addEventListener("install", (event) => {
   event.waitUntil(
      caches.open(cacheName).then((cache) => {
         return cache.addAll(resourcesToPreCache);
      })
   );
});

self.addEventListener("activate", (event) => {
   console.log("activate event");
});

self.addEventListener("fetch", (event) => {
   event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
         return cachedResponse || fetch(event.request);
      })
   );
});
