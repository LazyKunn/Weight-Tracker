// Service worker: makes the app work offline and keeps it up to date.
//
// Strategy:
// - App files (HTML, CSS, JS, icons): "network-first".
//   Try the internet first to always get the latest version;
//   if there is no internet, use the copy saved in the cache.
// - Chart.js from the CDN: "cache-first".
//   The URL includes the version (4.4.4), so the file never changes.

const CACHE_NAME = "peso-app-v6";

// Files from our own app, saved during installation
const APP_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

// External library (saved separately, so a CDN failure doesn't break the install)
const CDN_ASSETS = [
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"
];

// How long to wait for the internet before falling back to the cache (in milliseconds)
const NETWORK_TIMEOUT_MS = 4000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(APP_ASSETS);
      // If the CDN is down, the app still installs (the chart shows a warning instead)
      await cache.addAll(CDN_ASSETS).catch(() => {});
    })
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

  // Only handle normal "read" requests
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isOwnFile = url.origin === self.location.origin;

  if (isOwnFile) {
    event.respondWith(networkFirst(req));
  } else {
    event.respondWith(cacheFirst(req));
  }
});

// 1) Try the internet  2) If it fails or takes too long, use the cache
async function networkFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const res = await fetchWithTimeout(req, NETWORK_TIMEOUT_MS);
    if (res && res.ok) {
      cache.put(req, res.clone()); // update the saved copy
    }
    return res;
  } catch (err) {
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    // Opening the app offline: show the saved home page
    if (req.mode === "navigate") {
      const home = await cache.match("./index.html");
      if (home) return home;
    }
    throw err;
  }
}

// 1) Use the cache  2) If not there, fetch it and save it for next time
async function cacheFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  if (res && res.ok) {
    cache.put(req, res.clone());
  }
  return res;
}

// fetch() that gives up after "ms" milliseconds (useful on very slow connections).
// cache: "no-cache" makes the browser check with the server instead of
// reusing its own HTTP cache (GitHub Pages tells browsers to keep files for 10 min).
function fetchWithTimeout(req, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    fetch(req.url, { cache: "no-cache" }).then(
      (res) => { clearTimeout(timer); resolve(res); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

// Lets the weekly reminder show a notification even with the app in the background
// (only works while the service worker is active; see the note in the app about limitations).
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
