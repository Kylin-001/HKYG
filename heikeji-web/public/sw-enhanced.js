/// <reference lib="webworker" />

/**
 * Enhanced Service Worker for 黑科易购 (Heikeji Mall)
 * Version 3.0 - Production Ready
 *
 * Features:
 * - Multiple cache strategies (Cache First, Network First, Stale While Revalidate, Network Only)
 * - Cache version management with automatic cleanup
 * - Offline fallback support
 * - Background Sync API support
 * - Resource precaching on install
 * - BroadcastChannel communication
 * - Performance optimization with TTL-based cache invalidation
 */

// ==================== Configuration ====================

const CACHE_VERSION = 'v3.0.0'
const CACHE_PREFIX = 'heikeji'

// Cache names with version control
const CACHE_NAMES = {
  static: `${CACHE_PREFIX}-static-${CACHE_VERSION}`,
  dynamic: `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`,
  api: `${CACHE_PREFIX}-api-${CACHE_VERSION}`,
  images: `${CACHE_PREFIX}-images-${CACHE_VERSION}`,
  fonts: `${CACHE_PREFIX}-fonts-${CACHE_VERSION}`
}

// TTL configuration (in milliseconds)
const CACHE_TTL = {
  static: 7 * 24 * 60 * 60 * 1000, // 7 days for static assets
  api: 5 * 60 * 1000, // 5 minutes for API responses
  images: 30 * 24 * 60 * 60 * 1000, // 30 days for images
  fonts: 365 * 24 * 60 * 60 * 1000 // 1 year for fonts
}

// Precache manifest - critical resources to cache during install
const PRECACHE_MANIFEST = [
  '/',
  '/index.html',
  '/manifest.json',
  '/manifest-enhanced.json',
  '/offline.html',
  '/favicon.svg',
  '/logo-new.png',
  '/images/campus-1.jpg',
  '/images/campus-2.jpg',
  '/images/campus-3.jpg',
  '/images/campus-4.jpg'
]

// Static resource extensions for Cache First strategy
const STATIC_EXTENSIONS = [
  '.js', '.css', '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.avif'
]

// Image-specific patterns
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif']
const FONT_EXTENSIONS = ['.woff', '.woff2', '.ttf', '.eot', '.otf']

// API request patterns for Network First strategy
const API_PATTERNS = [
  /\/api\//,
  /\/products/,
  /\/orders/,
  /\/user/,
  /\/cart/,
  /\/takeout/,
  /\/campus/,
  /\/community/,
  /\/payment/,
  /\/secondhand/
]

// Payment-related URLs that should use Network Only (security)
const PAYMENT_PATTERNS = [
  /\/api\/.*payment/,
  /\/api\/.*pay/,
  /\/api\/.*wechat/,
  /\/api\/.*alipay/
]

// Background sync tags
const SYNC_TAGS = {
  FORM_SUBMISSION: 'form-submission',
  ORDER_CREATE: 'order-create',
  REVIEW_SUBMIT: 'review-submit',
  FEEDBACK_SEND: 'feedback-send'
}

// ==================== Install Event ====================

self.addEventListener('install', (event: ExtendableEvent) => {
  console.log(`[SW-Enhanced] Installing Service Worker ${CACHE_VERSION}...`)

  event.waitUntil(
    Promise.all([
      // Precache critical resources
      precacheCriticalResources(),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ]).catch((error) => {
      console.error('[SW-Enhanced] Installation failed:', error)
    })
  )
})

/**
 * Precache critical resources during installation
 */
async function precacheCriticalResources(): Promise<void> {
  const cache = await caches.open(CACHE_NAMES.static)

  try {
    // Add all precache manifest URLs
    const results = await Promise.allSettled(
      PRECACHE_MANIFEST.map(url =>
        cache.add(url).catch(() => {
          console.warn(`[SW-Enhanced] Failed to precache: ${url}`)
        })
      )
    )

    const successful = results.filter(r => r.status === 'fulfilled').length
    console.log(`[SW-Enhanced] Precached ${successful}/${PRECACHE_MANIFEST.length} critical resources`)
  } catch (error) {
    console.error('[SW-Enhanced] Precaching error:', error)
  }
}

// ==================== Activate Event ====================

self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log(`[SW-Enhanced] Activating Service Worker ${CACHE_VERSION}...`)

  event.waitUntil(
    Promise.all([
      // Clean up old caches from previous versions
      cleanupOldCaches(),
      // Claim all clients immediately
      self.clients.claim()
    ])
  )

  // Notify clients about activation
  notifyClients({ type: 'ACTIVATED', version: CACHE_VERSION })
})

/**
 * Remove old caches that don't match current version
 */
async function cleanupOldCaches(): Promise<void> {
  const cacheNames = await caches.keys()
  const oldCaches = cacheNames.filter(name => !Object.values(CACHE_NAMES).includes(name))

  if (oldCaches.length > 0) {
    console.log(`[SW-Enhanced] Cleaning up ${oldCaches.length} old caches:`)
    await Promise.all(oldCaches.map(async name => {
      console.log(`  - Deleting: ${name}`)
      await caches.delete(name)
    }))
  }
}

// ==================== Fetch Event - Strategy Router ====================

self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip non-http(s) requests (chrome-extension, etc.)
  if (!url.protocol.startsWith('http')) {
    return
  }

  // Skip cross-origin requests (unless explicitly allowed)
  if (url.origin !== self.location.origin) {
    return
  }

  // Route to appropriate caching strategy
  event.respondWith(routeRequest(request, url))
})

/**
 * Main routing function that determines which cache strategy to use
 */
async function routeRequest(request: Request, url: URL): Promise<Response> {
  const pathname = url.pathname

  // Strategy 1: Payment APIs - Network Only (security critical)
  if (isPaymentRequest(pathname)) {
    return networkOnly(request)
  }

  // Strategy 2: Font files - Cache First with long TTL
  if (isFontResource(pathname)) {
    return cacheFirstWithTTL(request, CACHE_NAMES.fonts, CACHE_TTL.fonts)
  }

  // Strategy 3: Image files - Cache First with medium TTL
  if (isImageResource(pathname)) {
    return cacheFirstWithTTL(request, CACHE_NAMES.images, CACHE_TTL.images)
  }

  // Strategy 4: Other static assets (JS/CSS) - Cache First with TTL
  if (isStaticResource(pathname)) {
    return cacheFirstWithTTL(request, CACHE_NAMES.static, CACHE_TTL.static)
  }

  // Strategy 5: API requests - Network First with fallback
  if (isAPIRequest(pathname)) {
    return networkFirstWithTTL(request, CACHE_NAMES.api, CACHE_TTL.api)
  }

  // Strategy 6: HTML pages - Stale While Revalidate
  if (isHTMLRequest(request)) {
    return staleWhileRevalidate(request, CACHE_NAMES.dynamic)
  }

  // Strategy 7: Default - Stale While Revalidate
  return staleWhileRevalidate(request, CACHE_NAMES.dynamic)
}

// ==================== Caching Strategies ====================

/**
 * Strategy 1: Cache First with TTL
 * Best for: Static assets (JS, CSS, Images, Fonts)
 */
async function cacheFirstWithTTL(
  request: Request,
  cacheName: string,
  ttl: number
): Promise<Response> {
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    // Check if cached response is still valid (within TTL)
    if (!isCacheExpired(cachedResponse, ttl)) {
      return cachedResponse
    }
    // Cache expired, fetch fresh copy in background
    fetchAndUpdateCache(request, cacheName)
    return cachedResponse // Return stale data while updating
  }

  // No cache, fetch from network
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const responseToCache = addCacheHeaders(networkResponse.clone())
      const cache = await caches.open(cacheName)
      cache.put(request, responseToCache)
    }

    return networkResponse
  } catch (error) {
    console.warn(`[SW-Enhanced] Network failed for: ${request.url}`)

    // Return offline fallback for images
    if (isImageResource(new URL(request.url).pathname)) {
      return createOfflineImageFallback()
    }

    throw error
  }
}

/**
 * Strategy 2: Network First with TTL and Fallback
 * Best for: API requests
 */
async function networkFirstWithTTL(
  request: Request,
  cacheName: string,
  ttl: number
): Promise<Response> {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      // Don't cache authentication errors
      if (networkResponse.status === 401 || networkResponse.status === 403) {
        return networkResponse
      }

      const responseToCache = addCacheHeaders(networkResponse.clone())
      const cache = await caches.open(cacheName)
      cache.put(request, responseToCache)
    }

    return networkResponse
  } catch (error) {
    console.log(`[SW-Enhanced] Network failed for API: ${request.url}, trying cache`)

    // Try to get from cache
    const cachedResponse = await caches.match(request)

    if (cachedResponse && !isCacheExpired(cachedResponse, ttl)) {
      // Return cached data but notify client it's stale
      notifyClients({
        type: 'STALE_DATA',
        url: request.url,
        timestamp: Date.now()
      })
      return cachedResponse
    }

    // Return offline-friendly error response
    return createOfflineAPIResponse(request.url)
  }
}

/**
 * Strategy 3: Stale While Revalidate
 * Best for: HTML pages and dynamic content
 */
async function staleWhileRevalidate(
  request: Request,
  cacheName: string
): Promise<Response> {
  const cachedResponse = await caches.match(request)

  // Always try to update in background
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const responseToCache = addCacheHeaders(networkResponse.clone())
        caches.open(cacheName).then(cache => {
          cache.put(request, responseToCache)
        })

        // Notify client about update
        notifyClients({
          type: 'CONTENT_UPDATED',
          url: request.url
        })
      }
      return networkResponse
    })
    .catch(error => {
      console.warn(`[SW-Enhanced] Background revalidation failed: ${request.url}`, error)
    })

  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse
  }

  // If no cache, wait for network
  try {
    return await fetchPromise || createOfflineHTMLResponse()
  } catch {
    return createOfflineHTMLResponse()
  }
}

/**
 * Strategy 4: Network Only
 * Best for: Payment and security-sensitive operations
 */
async function networkOnly(request: Request): Promise<Response> {
  try {
    return await fetch(request)
  } catch (error) {
    console.error('[SW-Enhanced] Network only request failed:', error)
    return new Response(JSON.stringify({
      error: 'Network Error',
      code: 'NETWORK_ERROR',
      message: '网络连接失败，请检查您的网络连接后重试'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// ==================== Helper Functions ====================

function isStaticResource(pathname: string): boolean {
  return STATIC_EXTENSIONS.some(ext => pathname.endsWith(ext))
}

function isImageResource(pathname: string): boolean {
  return IMAGE_EXTENSIONS.some(ext => pathname.endsWith(ext))
}

function isFontResource(pathname: string): boolean {
  return FONT_EXTENSIONS.some(ext => pathname.endsWith(ext))
}

function isAPIRequest(pathname: string): boolean {
  return API_PATTERNS.some(pattern => pattern.test(pathname))
}

function isPaymentRequest(pathname: string): boolean {
  return PAYMENT_PATTERNS.some(pattern => pattern.test(pathname))
}

function isHTMLRequest(request: Request): boolean {
  return request.headers.get('accept')?.includes('text/html') ||
         new URL(request.url).pathname.endsWith('.html')
}

/**
 * Add custom headers to track cache metadata
 */
function addCacheHeaders(response: Response): Response {
  const newHeaders = new Headers(response.headers)
  newHeaders.set('sw-cached-at', new Date().toISOString())
  newHeaders.set('sw-cache-version', CACHE_VERSION)

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}

/**
 * Check if a cached response has expired based on TTL
 */
function isCacheExpired(response: Response, ttl: number): boolean {
  const cachedAt = response.headers.get('sw-cached-at')

  if (!cachedAt) {
    return true // Assume expired if no timestamp
  }

  const cachedTime = new Date(cachedAt).getTime()
  const now = Date.now()

  return (now - cachedTime) > ttl
}

/**
 * Create offline image placeholder
 */
function createOfflineImageFallback(): Response {
  // Return a simple SVG placeholder
  const svgPlaceholder = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect fill="#E2E8F0" width="200" height="200"/>
      <text x="100" y="105" font-family="system-ui" font-size="14" fill="#94A3B8" text-anchor="middle">离线</text>
    </svg>
  `

  return new Response(svgPlaceholder, {
    headers: { 'Content-Type': 'image/svg+xml' }
  })
}

/**
 * Create offline API response
 */
function createOfflineAPIResponse(url: string): Response {
  return new Response(JSON.stringify({
    error: 'Offline',
    code: 'OFFLINE',
    message: '当前处于离线模式，请检查网络连接后重试',
    url,
    cachedAt: null
  }), {
    status: 503,
    headers: {
      'Content-Type': 'application/json',
      'X-Offline-Mode': 'true'
    }
  })
}

/**
 * Create offline HTML response
 */
function createOfflineHTMLResponse(): Response {
  return caches.match('/offline.html').then(cached => {
    if (cached) {
      return cached
    }
    return new Response(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>离线 - 黑科易购</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #F5F7FA;
            color: #1a1a2e;
          }
          .container {
            text-align: center;
            padding: 40px;
            max-width: 400px;
          }
          h1 { font-size: 24px; margin-bottom: 12px; }
          p { color: #64748b; line-height: 1.6; }
          button {
            margin-top: 20px;
            padding: 12px 32px;
            background: #003B80;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>离线模式</h1>
          <p>您当前处于离线状态。请检查网络连接后刷新页面。</p>
          <button onclick="window.location.reload()">重新加载</button>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 200
    })
  })
}

/**
 * Update cache in background without blocking
 */
async function fetchAndUpdateCache(request: Request, cacheName: string): Promise<void> {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, addCacheHeaders(networkResponse.clone()))
    }
  } catch (error) {
    // Silent fail - this is just background update
  }
}

// ==================== Background Sync ====================

self.addEventListener('sync', (event: SyncEvent) => {
  console.log(`[SW-Enhanced] Background sync triggered: ${event.tag}`)

  switch (event.tag) {
    case SYNC_TAGS.FORM_SUBMISSION:
      event.waitUntil(syncPendingForms())
      break

    case SYNC_TAGS.ORDER_CREATE:
      event.waitUntil(syncPendingOrders())
      break

    case SYNC_TAGS.REVIEW_SUBMIT:
      event.waitUntil(syncPendingReviews())
      break

    case SYNC_TAGS.FEEDBACK_SEND:
      event.waitUntil(syncPendingFeedback())
      break

    default:
      console.warn(`[SW-Enhanced] Unknown sync tag: ${event.tag}`)
  }
})

/**
 * Sync pending form submissions
 */
async function syncPendingForms(): Promise<void> {
  const pendingForms = await getPendingData('pending-forms')

  for (const form of pendingForms) {
    try {
      const response = await fetch(form.url, {
        method: form.method || 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.data)
      })

      if (response.ok) {
        await removePendingData('pending-forms', form.id)
        notifyClients({ type: 'FORM_SYNCED', formId: form.id })
      }
    } catch (error) {
      console.error('[SW-Enhanced] Form sync failed:', error)
    }
  }
}

/**
 * Sync pending orders
 */
async function syncPendingOrders(): Promise<void> {
  const pendingOrders = await getPendingData('pending-orders')

  for (const order of pendingOrders) {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${order.token}`
        },
        body: JSON.stringify(order.data)
      })

      if (response.ok) {
        await removePendingData('pending-orders', order.id)
        notifyClients({ type: 'ORDER_SYNCED', orderId: order.id })
      }
    } catch (error) {
      console.error('[SW-Enhanced] Order sync failed:', error)
    }
  }
}

/**
 * Sync pending reviews
 */
async function syncPendingReviews(): Promise<void> {
  const pendingReviews = await getPendingData('pending-reviews')

  for (const review of pendingReviews) {
    try {
      const response = await fetch(`/api/products/${review.productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${review.token}`
        },
        body: JSON.stringify(review.data)
      })

      if (response.ok) {
        await removePendingData('pending-reviews', review.id)
        notifyClients({ type: 'REVIEW_SYNCED', reviewId: review.id })
      }
    } catch (error) {
      console.error('[SW-Enhanced] Review sync failed:', error)
    }
  }
}

/**
 * Sync pending feedback
 */
async function syncPendingFeedback(): Promise<void> {
  const pendingFeedback = await getPendingData('pending-feedback')

  for (const feedback of pendingFeedback) {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${feedback.token}`
        },
        body: JSON.stringify(feedback.data)
      })

      if (response.ok) {
        await removePendingData('pending-feedback', feedback.id)
        notifyClients({ type: 'FEEDBACK_SYNCED', feedbackId: feedback.id })
      }
    } catch (error) {
      console.error('[SW-Enhanced] Feedback sync failed:', error)
    }
  }
}

// ==================== IndexedDB for Pending Data ====================

function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('heikeji-sw-db', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create object stores for different types of pending data
      if (!db.objectStoreNames.contains('pending-forms')) {
        db.createObjectStore('pending-forms', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('pending-orders')) {
        db.createObjectStore('pending-orders', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('pending-reviews')) {
        db.createObjectStore('pending-reviews', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('pending-feedback')) {
        db.createObjectStore('pending-feedback', { keyPath: 'id' })
      }
    }
  })
}

async function getPendingData(storeName: string): Promise<any[]> {
  const db = await openIDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function removePendingData(storeName: string, id: string): Promise<void> {
  const db = await openIDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

async function savePendingData(storeName: string, data: any): Promise<void> {
  const db = await openIDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.put(data)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// ==================== Message Handler ====================

self.addEventListener('message', (event: ExtendableMessageEvent) => {
  const data = event.data

  if (!data || !data.type) {
    return
  }

  switch (data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break

    case 'CLEAR_ALL_CACHES':
      clearAllCaches().then(() => {
        event.source?.postMessage({ type: 'ALL_CACHES_CLEARED' })
      })
      break

    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.source?.postMessage({ type: 'CACHE_SIZE', size })
      })
      break

    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.source?.postMessage({ type: 'CACHE_STATUS', ...status })
      })
      break

    case 'PRECACHE_URLS':
      if (data.urls && Array.isArray(data.urls)) {
        precacheResources(data.urls).then(count => {
          event.source?.postMessage({ type: 'PRECACHED', count })
        })
      }
      break

    case 'SAVE_PENDING_DATA':
      if (data.storeName && data.payload) {
        savePendingData(data.storeName, data.payload).then(() => {
          event.source?.postMessage({ type: 'DATA_SAVED', storeName: data.storeName })
        })
      }
      break

    case 'REQUEST_SYNC':
      if (data.tag) {
        registerBackgroundSync(data.tag).then(success => {
          event.source?.postMessage({ type: 'SYNC_REGISTERED', success, tag: data.tag })
        })
      }
      break

    default:
      console.warn('[SW-Enhanced] Unknown message type:', data.type)
  }
})

/**
 * Clear all caches
 */
async function clearAllCaches(): Promise<void> {
  const names = await caches.keys()
  await Promise.all(names.map(name => caches.delete(name)))
  console.log('[SW-Enhanced] All caches cleared')
}

/**
 * Get total cache size in KB
 */
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

/**
 * Get detailed cache status
 */
async function getCacheStatus(): Promise<{
  caches: Array<{ name: string; count: number }>
  totalEntries: number
}> {
  const result = []
  let totalEntries = 0
  const names = await caches.keys()

  for (const name of names) {
    const cache = await caches.open(name)
    const keys = await cache.keys()
    result.push({ name, count: keys.length })
    totalEntries += keys.length
  }

  return { caches: result, totalEntries }
}

/**
 * Precache specific resources
 */
async function precacheResources(urls: string[]): Promise<number> {
  const cache = await caches.open(CACHE_NAMES.static)
  let successCount = 0

  for (const url of urls) {
    try {
      await cache.add(url)
      successCount++
    } catch (error) {
      console.warn(`[SW-Enhanced] Failed to precache: ${url}`)
    }
  }

  return successCount
}

/**
 * Register background sync
 */
async function registerBackgroundSync(tag: string): Promise<boolean> {
  if ('sync' in registration) {
    try {
      await (registration as any).sync.register(tag)
      return true
    } catch (error) {
      console.error('[SW-Enhanced] Background sync registration failed:', error)
      return false
    }
  }
  return false
}

// ==================== Client Notification ====================

let broadcastChannel: BroadcastChannel | null = null

/**
 * Send notification to all clients via BroadcastChannel
 */
function notifyClients(message: any): void {
  try {
    // Use BroadcastChannel if available
    if (!broadcastChannel) {
      broadcastChannel = new BroadcastChannel('sw-channel')
    }
    broadcastChannel.postMessage(message)
  } catch (error) {
    // Fallback to client messaging
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage(message)
      })
    })
  }
}

// ==================== Push Notifications (Optional) ====================

self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return

  const data = event.data.json()
  const options: NotificationOptions = {
    body: data.body || '您有新消息',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false
  }

  event.waitUntil(
    self.registration.showNotification(data.title || '黑科易购', options)
  )
})

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close()

  const data = event.notification.data

  if (data && data.url) {
    event.waitUntil(clients.openWindow(data.url))
  } else {
    event.waitUntil(clients.openWindow('/'))
  }
})

// ==================== Console Log ====================

console.log(`[SW-Enhanced] Service Worker ${CACHE_VERSION} loaded successfully`)
console.log('[SW-Enhanced] Features enabled:')
console.log('  - Cache strategies: Cache First, Network First, Stale While Revalidate, Network Only')
console.log('  - TTL-based cache invalidation')
console.log('  - Background Sync API')
console.log('  - Precache on install')
console.log('  - BroadcastChannel communication')
