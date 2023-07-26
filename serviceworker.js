const staticDevCoffee = "agecalculus-v1";
const assets = [
   "/",
   "/index.html",
   "style.css",
   "index.js",
   "/assets/images/logo.png",
   "/assets/images/icon-arrow.svg",
   "/assets/images/favicon-32x32.png",
   "/assets/images/icon-72x72.png",
   "/assets/images/icon-96x96.png",
   "/assets/images/icon-128x128.png",
   "/assets/images/icon-144x144.png",
   "/assets/images/icon-152x152.png",
   "/assets/images/icon-192x192.png",
   "/assets/images/icon-384x384.png",
   "/assets/images/icon-512x512.png",
];

self.addEventListener("install", (event) => {
   event.waitUntil(
      caches.open(staticDevCoffee).then((cache) => {
         cache.addAll(assets);
      })
   );
});

self.addEventListener("fetch", (event) => {
   event.respondWith(
      caches.match(event.request).then((res) => {
         return res || fetch(event.request);
      })
   );
});
