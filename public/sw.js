// Nombre de la caché
const CACHE_NAME = "finko-cache-v3"

// Archivos a cachear inicialmente
const urlsToCache = [
  "/",
  "/offline.html",
  "/finko.png",
  "/finko-fav.png",
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/maskable-icon.png",
  "/pwa/apple-icon-180.png",
]

// Instalación del service worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Instalando...")
  // Realizar tareas de instalación
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Cacheando archivos")
      return cache.addAll(urlsToCache)
    }),
  )
  // Forzar la activación inmediata
  self.skipWaiting()
})

// Activación del service worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activando...")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: Limpiando caché antigua", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        // Tomar control de los clientes inmediatamente
        console.log("Service Worker: Ahora está activo")
        return self.clients.claim()
      }),
  )
})

// Interceptar solicitudes de red - estrategia más segura para móviles
self.addEventListener("fetch", (event) => {
  // No interceptar solicitudes a chunks de JavaScript o recursos críticos
  if (
    event.request.url.includes("/next/static/chunks/") ||
    event.request.url.includes("/_next/") ||
    event.request.url.includes("webpack") ||
    event.request.url.includes("analytics") ||
    event.request.url.includes("gtag")
  ) {
    return
  }

  // Estrategia: Network first, fallback to cache, then offline page
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, clonarla y guardarla en caché
        if (response && response.status === 200) {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            // Solo cachear GET requests
            if (event.request.method === "GET") {
              cache.put(event.request, responseToCache)
            }
          })
        }
        return response
      })
      .catch(() => {
        // Si falla la red, intentar desde caché
        return caches.match(event.request).then((cachedResponse) => {
          // Si está en caché, devolver la respuesta cacheada
          if (cachedResponse) {
            return cachedResponse
          }

          // Si es una navegación y no está en caché, mostrar página offline
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html")
          }

          // Para otros recursos, devolver un error
          return new Response("", {
            status: 404,
            statusText: "Not Found",
          })
        })
      }),
  )
})

// Evento para sincronización en segundo plano (útil para móviles)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData())
  }
})

// Función para sincronizar datos (placeholder)
function syncData() {
  return Promise.resolve()
}

// Manejar notificaciones push
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()

    const options = {
      body: data.body,
      icon: "/pwa/icon-192.png",
      badge: "/pwa/icon-192.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/",
      },
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

// Manejar clics en notificaciones
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url))
  }
})
