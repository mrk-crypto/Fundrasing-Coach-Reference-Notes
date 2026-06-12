/* Fundraising Coach Reference — Service Worker v1 */
const CACHE = 'coach-ref-v1';
const CORE  = ['./'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c) { return c.addAll(CORE); })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) {
        /* Serve from cache, update in background */
        fetch(e.request).then(function(fresh) {
          if (fresh && fresh.status === 200) {
            caches.open(CACHE).then(function(c) { c.put(e.request, fresh); });
          }
        }).catch(function() {});
        return cached;
      }
      return fetch(e.request).then(function(resp) {
        if (!resp || resp.status !== 200) return resp;
        var clone = resp.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        return resp;
      }).catch(function() {
        return caches.match('./');
      });
    })
  );
});
