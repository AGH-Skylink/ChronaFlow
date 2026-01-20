const CACHE_NAME = "chronaflow-v3";
const BASE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const withBase = (path) => `${BASE_PATH}${path}`;

const CORE_ASSETS = [
  withBase("/"),
  withBase("/index.html"),
  withBase("/offline.html"),
  withBase("/manifest.json"),
  withBase("/favicon.png"),
  withBase("/apple-touch-icon.png"),
  withBase("/icons/icon-192.png"),
  withBase("/icons/icon-512.png"),
  withBase("/icons/icon-192-maskable.png"),
  withBase("/icons/icon-512-maskable.png"),
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(precache());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
            return undefined;
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(navigate(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function precache() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(CORE_ASSETS.map((url) => fetchAndCache(cache, url)));

  const manifestUrl = withBase("/precache-manifest.json");
  try {
    const response = await fetch(manifestUrl, { cache: "reload" });
    if (!response.ok) {
      return;
    }
    const assets = await response.json();
    if (!Array.isArray(assets)) {
      return;
    }
    await Promise.all(
      assets.map((asset) => fetchAndCache(cache, withBase(asset)))
    );
  } catch (error) {
    return;
  }
}

async function fetchAndCache(cache, url) {
  try {
    const response = await fetch(url, { cache: "reload" });
    if (response && response.ok) {
      await cache.put(url, response.clone());
    }
  } catch (error) {
    return;
  }
}

async function navigate(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    // Fall through to cache-based navigation.
  }

  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  const fallbackCandidates = getHtmlFallbacks(request.url);
  for (const candidate of fallbackCandidates) {
    const match = await cache.match(candidate);
    if (match) {
      return match;
    }
  }

  return (
    (await cache.match(withBase("/offline.html"))) ||
    (await cache.match(withBase("/index.html"))) ||
    Response.error()
  );
}

function getHtmlFallbacks(urlString) {
  const url = new URL(urlString);
  const pathname = url.pathname.replace(/\/$/, "");
  const candidates = [];

  if (pathname === "" || pathname === BASE_PATH) {
    candidates.push(withBase("/index.html"));
  } else if (pathname.endsWith(".html")) {
    candidates.push(pathname);
  } else {
    candidates.push(`${pathname}.html`);
    candidates.push(`${pathname}/index.html`);
  }

  return candidates.map((candidate) => {
    if (candidate.startsWith(BASE_PATH)) {
      return candidate;
    }
    return withBase(candidate.startsWith("/") ? candidate : `/${candidate}`);
  });
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    const fallback =
      (await cache.match(withBase("/"))) ||
      (await cache.match(withBase("/index.html"))) ||
      (await cache.match(withBase("/offline.html")));
    return fallback || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return Response.error();
  }
}
