// Nombre de la caché
const CACHE_NAME = "finko-cache-v1"

// Archivos a cachear inicialmente
const urlsToCache = ["/", "/offline.html", "/finko.png", "/finko-fav.png", "/pwa/icon-192.png", "/pwa/icon-512.png"]

// Instalación del service worker
self.addEventListener("install", (event) => {
  // Realizar tareas de instalación
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(urlsToCache)
    }),
  )
  // Forzar la activación inmediata
  self.skipWaiting()
})

// Activación del service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        // Tomar control de los clientes inmediatamente
        return self.clients.claim()
      }),
  )
})

// Interceptar solicitudes de red - estrategia más segura
self.addEventListener("fetch", (event) => {
  // No interceptar solicitudes a chunks de JavaScript o recursos críticos
  if (
    event.request.url.includes("/next/static/chunks/") ||
    event.request.url.includes("/_next/") ||
    event.request.url.includes("webpack")
  ) {
    return
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      // Solo usar caché para navegación si la red falla
      if (event.request.mode === "navigate") {
        return caches.match("/offline.html")
      }

      // Para otros recursos, intentar desde caché
      return caches.match(event.request)
    }),
  )
})
