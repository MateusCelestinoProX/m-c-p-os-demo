const CACHE_NAME = 'mcp-os-v16';
const MEDIA_CACHE_NAME = 'mcp-offline-media-v1';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/media-cache-manager.js'
];

// Install: precache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        ASSETS_TO_CACHE.map((url) =>
          fetch(new Request(url, { cache: 'reload' }))
            .then((res) => { if (res && res.status === 200) return cache.put(url, res); })
            .catch(() => null)
        )
      )
    )
  );
  self.skipWaiting();
});

// Activate: remove caches antigos, preservando estritamente o MEDIA_CACHE_NAME
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((c) => {
          if (c !== CACHE_NAME && c !== MEDIA_CACHE_NAME) {
            return caches.delete(c);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

/**
 * Função auxiliar para sintetizar respostas 206 Partial Content a partir de um arquivo em cache
 */
async function createRangeResponse(response, rangeHeader) {
  const arrayBuffer = await response.arrayBuffer();
  const total = arrayBuffer.byteLength;
  const parts = rangeHeader.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : total - 1;

  if (start >= total || end >= total) {
    return new Response('', {
      status: 416,
      headers: {
        'Content-Range': `bytes */${total}`,
        'Accept-Ranges': 'bytes'
      }
    });
  }

  const sliced = arrayBuffer.slice(start, end + 1);
  const headers = new Headers(response.headers);
  headers.set('Content-Range', `bytes ${start}-${end}/${total}`);
  headers.set('Content-Length', String(sliced.byteLength));
  headers.set('Accept-Ranges', 'bytes');

  return new Response(sliced, {
    status: 206,
    statusText: 'Partial Content',
    headers: headers
  });
}

// Fetch Interceptor:
// 1. Supabase Storage / Mídias Pesadas: CACHE-FIRST com suporte a Range 206
// 2. App Shell: NETWORK-FIRST com fallback offline
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Mídias do Supabase Storage ou extensões de mídia
  const isSupabaseStorage = url.hostname.includes('supabase.co') && url.pathname.includes('/storage/v1/object/');
  const isMediaAsset = /\.(?:webp|png|jpe?g|gif|mp4|webm|mp3|wav|ogg|svg)(?:\?.*)?$/i.test(url.pathname);

  if (isSupabaseStorage || isMediaAsset) {
    event.respondWith(
      caches.open(MEDIA_CACHE_NAME).then(async (mediaCache) => {
        const rangeHeader = req.headers.get('range');
        const cleanUrl = req.url;

        // 1. Busca no cache de mídias
        const cached = await mediaCache.match(cleanUrl, { ignoreSearch: false });
        if (cached) {
          if (rangeHeader) {
            return await createRangeResponse(cached, rangeHeader);
          }
          return cached;
        }

        // 2. Se não estiver no cache, baixa e salva versão completa no cache
        try {
          // Se tiver Range mas não estiver em cache, fazemos o fetch direto para responder rápido
          if (rangeHeader) {
            const networkRes = await fetch(req);
            // Em segundo plano, armazena a versão completa
            fetch(cleanUrl, { mode: 'cors' }).then(fullRes => {
              if (fullRes && (fullRes.status === 200 || fullRes.type === 'opaque')) {
                mediaCache.put(cleanUrl, fullRes);
              }
            }).catch(() => {});
            return networkRes;
          }

          const networkRes = await fetch(req);
          if (networkRes && (networkRes.status === 200 || networkRes.type === 'opaque')) {
            mediaCache.put(cleanUrl, networkRes.clone());
          }
          return networkRes;
        } catch (e) {
          return cached || new Response('Offline Media Unavailable', { status: 503 });
        }
      })
    );
    return;
  }

  const isSameOrigin = url.origin === self.location.origin;
  const isAppShell =
    req.mode === 'navigate' ||
    (isSameOrigin && /\.(?:html|css|js)$/.test(url.pathname)) ||
    (isSameOrigin && url.pathname.endsWith('/'));

  if (isAppShell) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('./index.html')))
    );
    return;
  }

  // Cache-first para outros recursos
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return networkResponse;
      }).catch(() => cached);
    })
  );
});
