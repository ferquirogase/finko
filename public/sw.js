const CACHE_NAME = "finko-v3"
const urlsToCache = [
  "/",
  "/calculadora",
  "/presupuestos",
  "/recibos",
  "/pagos-exterior",
  "/finko.png",
  "/finko-fav.png",
  "/manifest.json",
]

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache opened")
      return cache.addAll(urlsToCache)
    }),
  )
  // Forzar la activación inmediata
  self.skipWaiting()
})

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  // Tomar control de las páginas inmediatamente
  event.waitUntil(self.clients.claim())
})

// Interceptar solicitudes de red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si encontramos una coincidencia en la caché, la devolvemos
      if (response) {
        return response
      }

      // Si no está en caché, buscamos en la red
      return fetch(event.request)
        .then((response) => {
          // Si la respuesta no es válida, simplemente la devolvemos
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clonamos la respuesta porque es un stream que solo se puede consumir una vez
          var responseToCache = response.clone()

          // Guardamos la respuesta en la caché
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Si hay un error en la red, intentamos devolver una página offline
          if (event.request.mode === "navigate") {
            return caches.match("/")
          }
        })
    }),
  )
})

// Evento push para notificaciones
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body || "Nueva notificación",
      icon: "/finko-fav.png",
      badge: "/finko-fav.png",
    }

    event.waitUntil(self.registration.showNotification(data.title || "Finko", options))
  }
})

// Evento para manejar clics en notificaciones
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow("/"))
})
