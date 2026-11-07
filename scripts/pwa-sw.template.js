const PRECACHE_NAME = "__PRECACHE_NAME__";
const RUNTIME_NAME = "__RUNTIME_NAME__";
// eslint-disable-next-line no-undef
const PRECACHE_URLS = __PRECACHE_URLS__;
const MAX_RUNTIME_ENTRIES = 80;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(PRECACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name.startsWith("flashmedic-") && name !== PRECACHE_NAME && name !== RUNTIME_NAME)
          .map((name) => caches.delete(name)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

async function trimRuntimeCache() {
  const cache = await caches.open(RUNTIME_NAME);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_RUNTIME_ENTRIES)).map((key) => cache.delete(key)));
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_NAME);
      await cache.put(request, response.clone());
      void trimRuntimeCache();
    }
    return response;
  } catch {
    return (
      (await caches.match(request)) ||
      (await caches.match("/")) ||
      (await caches.match("/index.html")) ||
      (await caches.match("/offline.html")) ||
      Response.error()
    );
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.type === "basic") {
    const cache = await caches.open(RUNTIME_NAME);
    await cache.put(request, response.clone());
    void trimRuntimeCache();
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }
  event.respondWith(cacheFirst(request));
});
