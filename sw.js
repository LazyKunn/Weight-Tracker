// Service worker: cacheia tudo o que a app precisa para funcionar 100% offline.
const CACHE_NAME = "peso-app-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.4/chart.umd.min.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // guarda uma cópia em cache para a próxima vez que estiver offline
          if (res && res.status === 200 && req.method === "GET") {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});

// Permite ao lembrete semanal disparar uma notificação mesmo com a app em segundo plano
// (só funciona enquanto o service worker está ativo; ver nota na app sobre limitações).
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_REMINDER") {
    self.registration.showNotification("Hora de te pesares ⚖️", {
      body: "Registo semanal — abre a app e regista o teu peso de hoje.",
      icon: "./icon-192.png",
      badge: "./icon-192.png",
      tag: "peso-reminder"
    });
  }
});
