// Boniphace Ndege Creator Hub - Service Worker for Offline Data Persistence
const CACHE_NAME = 'boniphace-hub-cache-v1';
const CONTENT_CACHE = 'boniphace-reading-cache-v1';

// Essential assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/api/blogs',
  '/api/books',
  '/api/profile',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Attempt precaching, ignore non-fatal failures for dynamic routes
      return Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          fetch(url)
            .then((res) => {
              if (res.ok) return cache.put(url, res);
            })
            .catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== CONTENT_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first with cache fallback strategy for APIs, Cache-first for offline reading materials
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle Blog & Book API requests
  if (url.pathname === '/api/blogs' || url.pathname === '/api/books') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CONTENT_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return caches.open(CONTENT_CACHE).then((cache) => {
            return cache.match(request).then((cachedResponse) => {
              if (cachedResponse) return cachedResponse;
              return new Response(JSON.stringify([]), {
                headers: { 'Content-Type': 'application/json' },
              });
            });
          });
        })
    );
    return;
  }

  // Handle standard navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // For static assets and cached reading contents
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          // Cache image assets if valid
          if (
            response &&
            response.status === 200 &&
            (request.destination === 'image' || url.pathname.includes('/assets/'))
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // If offline and request failed
          return cached;
        });
    })
  );
});

// Listen for message events (e.g. manual offline save from UI)
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'CACHE_OFFLINE_ARTICLE') {
    const { id, url, data } = event.data;
    caches.open(CONTENT_CACHE).then((cache) => {
      const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
      cache.put(`/offline/material/${encodeURIComponent(id || url)}`, response);
    });
  }
});
