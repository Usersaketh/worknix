// Improved service worker: network-first for navigations, cache-first for hashed assets.
// Prevents stale UI (e.g., outdated footer buttons) sticking around after deploy.

const VERSION = 'v2';
const CACHE_PREFIX = 'worknix-static-';
const CACHE_NAME = `${CACHE_PREFIX}${VERSION}`;
const STATIC_ASSETS = [
  '/site.webmanifest',
  // Add any always-needed small static files here (logo, icons) if desired
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

function isAssetRequest(request) {
  const url = new URL(request.url);
  // Cache hashed build assets (vite /assets/*) & images.
  return url.pathname.startsWith('/assets/') || /\.(css|js|woff2?|png|svg|jpg|jpeg|gif|webp)$/.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Network-first for navigation (HTML) to get fresh app shell quickly.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => {
        // Optionally cache index.html for offline fallback
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put('/', copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match('/') || caches.match('/index.html'))
    );
    return;
  }

  // Asset requests: cache-first then update in background (stale-while-revalidate style simplified)
  if (isAssetRequest(req)) {
    event.respondWith(
      caches.match(req).then(cached => {
        const fetchPromise = fetch(req).then(networkRes => {
          if (networkRes.ok) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(()=>{});
          }
          return networkRes;
        }).catch(() => cached); // fall back to cached if network fails
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Default: pass-through network (optionally could add small caching logic)
});
