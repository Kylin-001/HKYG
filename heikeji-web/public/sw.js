/// <reference lib="webworker" />

const CACHE_NAME = 'heikeji-v3'
const STATIC_CACHE = 'heikeji-static-v2'
const DYNAMIC_CACHE = 'heikeji-dynamic-v2'
const API_CACHE = 'heikeji-api-v2'
const IMAGE_CACHE = 'heikeji-image-v1'

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
]

const STATIC_EXTENSIONS = [
  '.js', '.css', '.woff', '.woff2', '.ttf', '.eot',
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.avif',
]

const API_PATTERNS = [
  /\/api\//,
  /\/products/,
  /\/orders/,
  /\/user/,
  /\/student-affairs/,
  /\/payment/,
  /\/announcements/,
  /\/campus/,
  /\/community/,
  /\/admin/,
]

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg']

self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('[SW] Installing Service Worker v3...')

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Pre-caching static assets')
        return cache.addAll(PRECACHE_URLS).catch((err) => {
          console.warn('[SW] Some precache resources failed:', err)
        })
      })
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('[SW] Activating Service Worker v3...')

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && 
                           name !== STATIC_CACHE && 
                           name !== DYNAMIC_CACHE &&
                           name !== API_CACHE &&
                           name !== IMAGE_CACHE)
            .map((name) => {
              console.log(`[SW] Deleting old cache: ${name}`)
              return caches.delete(name)
            })
        )
      })
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') return
  if (!url.origin.includes(self.location.origin)) return

  if (isStaticResource(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  if (isImageResource(url.pathname)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE))
    return
  }

  if (isAPIRequest(url.pathname)) {
    event.respondWith(networkFirstWithSWR(request, API_CACHE))
    return
  }

  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstWithFallback(request))
    return
  }

  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
})

function isStaticResource(pathname: string): boolean {
  const isStatic = STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext))
  if (isStatic && !IMAGE_EXTENSIONS.some((ext) => pathname.endsWith(ext))) {
    return true
  }
  return false
}

function isImageResource(pathname: string): boolean {
  return IMAGE_EXTENSIONS.some((ext) => pathname.endsWith(ext))
}

function isAPIRequest(pathname: string): boolean {
  return API_PATTERNS.some((pattern) => pattern.test(pathname))
}

async function cacheFirst(request: Request, cacheName: string): Promise<Response> {
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.warn(`[SW] Cache failed for: ${request.url}`, error)

    if (request.url.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)$/)) {
      return new Response('', { status: 404 })
    }

    return caches.match('/offline.html') || new Response('Offline', { status: 503 })
  }
}

async function networkFirstWithSWR(request: Request, cacheName: string): Promise<Response> {
  const cachedResponse = await caches.match(request)

  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())

      return networkResponse
    } else if (networkResponse.status === 401 || networkResponse.status === 403) {
      return networkResponse
    }

    if (cachedResponse) {
      return cachedResponse
    }

    return networkResponse
  } catch (error) {
    console.log(`[SW] Network failed for: ${request.url}, trying cache`)

    if (cachedResponse) {
      const headers = new Headers(cachedResponse.headers)
      headers.set('X-SW-Cache', 'stale')
      headers.set('X-SW-Cache-Time', new Date().toISOString())

      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers,
      })
    }

    return new Response(JSON.stringify({ error: 'Offline', code: 'OFFLINE' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function networkFirstWithFallback(request: Request): Promise<Response> {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log(`[SW] HTML request offline: ${request.url}`)

    const cachedResponse = await caches.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    return caches.match('/offline.html') || new Response(
      '<html><body><h1>离线中</h1><p>请检查网络连接</p></body></html>',
      { headers: { 'Content-Type': 'text/html' }, status: 200 }
    )
  }
}

async function staleWhileRevalidate(request: Request, cacheName: string): Promise<Response> {
  const cachedResponse = await caches.match(request)

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        caches.open(cacheName).then((cache) => {
          cache.put(request, networkResponse.clone())
        })
      }
      return networkResponse
    })
    .catch(() => {})

  return cachedResponse || await fetchPromise || new Response('Offline', { status: 503 })
}

// ====== 后台同步 ======
self.addEventListener('sync', (event: SyncEvent) => {
  console.log('[SW] Background sync:', event.tag)

  if (event.tag === 'sync-pending-requests') {
    event.waitUntil(syncPendingRequests())
  }
})

async function syncPendingRequests(): Promise<void> {
  try {
    const pendingData = await getPendingRequestsFromDB()
    if (!pendingData || pendingData.length === 0) return

    for (const item of pendingData) {
      try {
        await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: JSON.stringify(item.data),
        })

        await removePendingRequestFromDB(item.id)
        console.log(`[SW] Synced request: ${item.id}`)
      } catch (err) {
        console.error(`[SW] Failed to sync request: ${item.id}`, err)
      }
    }
  } catch (err) {
    console.error('[SW] Background sync error:', err)
  }
}

async function getPendingRequestsFromDB(): Promise<any[]> {
  return []
}

async function removePendingRequestFromDB(_id: string): Promise<void> {}

// ====== 消息通信 ======
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  const data = event.data

  switch (data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break

    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.source?.postMessage({ type: 'CACHE_CLEARED' })
      })
      break

    case 'GET_CACHE_SIZE':
      getCacheSize().then((size) => {
        event.source?.postMessage({ type: 'CACHE_SIZE', size })
      })
      break

    case 'PRECACHE_URLS':
      if (data.urls && Array.isArray(data.urls)) {
        precacheUrls(data.urls).then(() => {
          event.source?.postMessage({ type: 'PRECACHE_DONE' })
        })
      }
      break

    default:
      console.log('[SW] Unknown message type:', data.type)
  }
})

async function precacheUrls(urls: string[]): Promise<void> {
  const cache = await caches.open(STATIC_CACHE)
  const results = await Promise.allSettled(
    urls.map((url) =>
      fetch(url).then((response) => {
        if (response.ok) {
          cache.put(url, response)
        }
      }).catch(() => {})
    )
  )
  const failed = results.filter((r) => r.status === 'rejected').length
  console.log(`[SW] Precache completed: ${urls.length - failed}/${urls.length} succeeded`)
}

async function clearAllCaches(): Promise<void> {
  const names = await caches.keys()
  await Promise.all(names.map((name) => caches.delete(name)))
  console.log('[SW] All caches cleared')
}

async function getCacheSize(): Promise<number> {
  let totalSize = 0
  const names = await caches.keys()

  for (const name of names) {
    const cache = await caches.open(name)
    const keys = await cache.keys()

    for (const request of keys) {
      const response = await cache.match(request)
      if (response) {
        const blob = await response.clone().blob()
        totalSize += blob.size
      }
    }
  }

  return Math.round(totalSize / 1024)
}

console.log('[SW] Service Worker v3 loaded')
