// Nombre de la caché
const CACHE_NAME = "finko-cache-v1"

// Archivos a cachear inicialmente
const urlsToCache = [
  "/",
  "/calculadora",
  "/presupuestos",
  "/recibos",
  "/pagos-exterior",
  "/manifest.json",
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/finko.png",
  "/finko-fav.png",
]

// Instalación del service worker
self.addEventListener("install", (event) => {
  // Realizar tareas de instalación
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Activación del service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Interceptar solicitudes de red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})
