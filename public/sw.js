// Ev Dr. Boniphace J. Ndege Creator Hub - Modern PWA Service Worker
const CACHE_NAME = 'boniphace-hub-v2';
const CONTENT_CACHE = 'boniphace-reading-cache-v2';
const STATIC_ASSETS_CACHE = 'boniphace-static-v2';

// Essential assets to cache on install for offline navigation
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/api/blogs',
  '/api/books',
  '/api/profile',
  '/src/assets/images/boniphace_avatar_1791315268492.jpg',
  '/src/assets/images/boniphace_banner_1791315259974.jpg',
  '/src/assets/images/book_digital_vision_1791315278826.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
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
          if (key !== CACHE_NAME && key !== CONTENT_CACHE && key !== STATIC_ASSETS_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch handler with stale-while-revalidate and network-first strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore chrome-extension requests and non-http protocols
  if (!url.protocol.startsWith('http')) return;

  // Handle Blog & Book API requests: Network-first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
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
        .catch(async () => {
          const cache = await caches.open(CONTENT_CACHE);
          const cachedResponse = await cache.match(request);
          if (cachedResponse) return cachedResponse;
          return new Response(JSON.stringify([]), {
            headers: { 'Content-Type': 'application/json' },
          });
        })
    );
    return;
  }

  // Handle standard navigation requests (SPA support)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // Images & Static Assets: Cache-first with background revalidation
  if (request.destination === 'image' || url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.open(STATIC_ASSETS_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }

  // General requests: Cache-first fallback to network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).catch(() => {
        // Offline fallback
        return null;
      });
    })
  );
});

// Background Sync handler
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-cart-or-posts') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SYNC_COMPLETED', timestamp: Date.now() });
        });
      })
    );
  }
});

// Push notification listener
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Ev Dr. Boniphace J. Ndege Hub';
  const options = {
    body: data.body || 'New live room session or book announcement!',
    icon: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
    badge: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
    data: { url: data.url || '/' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Listen for message events (manual cache commands from client)
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
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
