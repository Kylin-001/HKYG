/**
 * PWA Helper Utilities for 黑科易购 (Heikeji Mall)
 *
 * Provides comprehensive PWA functionality including:
 * - Service Worker registration and lifecycle management
 * - Update detection and management
 * - Cache management utilities
 * - Online/offline status detection
 * - Background sync support
 * - Install prompt handling
 */

// ==================== Type Definitions ====================

export interface SWRegistration extends ServiceWorkerRegistration {
  // Extended properties if needed
}

export interface SWStatus {
  supported: boolean
  registered: boolean
  state: 'installed' | 'activating' | 'activated' | 'waiting' | 'redundant' | null
  controller: ServiceWorker | null
  version: string | null
}

export interface CacheInfo {
  size: number // in KB
  entries: number
  caches: Array<{
    name: string
    count: number
  }>
}

export interface PendingSyncData {
  id: string
  url: string
  method?: string
  data: any
  token?: string
  timestamp: number
  retryCount?: number
}

type MessageHandler = (data: any) => void

// ==================== Constants ====================

const SW_SCRIPT_URL = '/sw-enhanced.js'
const SW_SCOPE = '/'
const BROADCAST_CHANNEL_NAME = 'sw-channel'
const INSTALL_PROMPT_SHOWN_KEY = 'pwa-install-prompt-shown'
const INSTALL_DEFERRED_DAYS = 3

// ==================== State Management ====================

let registration: SWRegistration | null = null
let broadcastChannel: BroadcastChannel | null = null
let messageHandlers: Map<string, Set<MessageHandler>> = new Map()
let onlineStatusListeners: Set<(online: boolean) => void> = new Set()

// ==================== Service Worker Registration ====================

/**
 * Register the enhanced service worker with full lifecycle management
 */
export async function registerServiceWorker(
  options?: {
    scriptUrl?: string
    scope?: string
    onUpdateFound?: (registration: SWRegistration) => void
    onSuccess?: (registration: SWRegistration) => void
    onError?: (error: Error) => void
  }
): Promise<SWRegistration | null> {
  // Check browser support
  if (!('serviceWorker' in navigator)) {
    console.warn('[PWA-Helper] Service Workers not supported')
    options?.onError?.(new Error('Service Workers not supported'))
    return null
  }

  try {
    const swUrl = options?.scriptUrl || SW_SCRIPT_URL
    const scope = options?.scope || SW_SCOPE

    console.log(`[PWA-Helper] Registering Service Worker from: ${swUrl}`)

    reg = await navigator.serviceWorker.register(swUrl, { scope })

    // Handle updates
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing

      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          console.log(`[PWA-Helper] SW state changed to: ${newWorker.state}`)

          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            options?.onUpdateFound?.(reg)
            notifyUpdateAvailable()
          }
        })
      }
    })

    // Setup communication channel
    setupBroadcastChannel()

    // Listen for controller changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[PWA-Helper] New controller activated, reloading page...')
      window.location.reload()
    })

    registration = reg
    options?.onSuccess?.(reg)

    console.log(`[PWA-Helper] Service Worker registered successfully with scope: ${reg.scope}`)
    return reg

  } catch (error) {
    console.error('[PWA-Helper] Service Worker registration failed:', error)
    options?.onError?.(error as Error)
    return null
  }
}

/**
 * Check for available service worker updates
 */
export async function checkUpdate(): Promise<boolean> {
  if (!registration) {
    console.warn('[PWA-Helper] No active registration to check for updates')
    return false
  }

  try {
    await registration.update()
    return true
  } catch (error) {
    console.error('[PWA-Helper] Update check failed:', error)
    return false
  }
}

/**
 * Skip waiting and activate the new service worker immediately
 */
export function skipWaiting(): void {
  if (!registration?.waiting) {
    console.warn('[PWA-Helper] No waiting service worker to activate')
    return
  }

  // Send skip waiting message to the waiting worker
  registration.waiting.postMessage({ type: 'SKIP_WAITING' })
  console.log('[PWA-Helper] Requested service worker to skip waiting')
}

/**
 * Get current service worker status
 */
export async function getSWStatus(): Promise<SWStatus> {
  const supported = 'serviceWorker' in navigator

  if (!supported) {
    return {
      supported: false,
      registered: false,
      state: null,
      controller: null,
      version: null
    }
  }

  const reg = await navigator.serviceWorker.getRegistration()

  return {
    supported: true,
    registered: !!reg,
    state: reg?.installing?.state ||
           reg?.waiting?.state ||
           reg?.active?.state ||
           null,
    controller: navigator.serviceWorker.controller,
    version: await getSWVersion(reg)
  }
}

async function getSWVersion(reg: ServiceWorkerRegistration | undefined): Promise<string | null> {
  if (!reg?.active) return null

  try {
    // Try to get version from service worker via message
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(null), 1000)

      const handler = (event: MessageEvent) => {
        if (event.data?.version) {
          clearTimeout(timeout)
          navigator.serviceWorker.removeEventListener('message', handler)
          resolve(event.data.version)
        }
      }

      navigator.serviceWorker.addEventListener('message', handler)

      // Request version info
      setTimeout(() => {
        clearTimeout(timeout)
        navigator.serviceWorker.removeEventListener('message', handler)
        resolve(null)
      }, 1000)
    })
  } catch {
    return null
  }
}

// ==================== Cache Management ====================

/**
 * Clear all caches managed by the service worker
 */
export async function clearAllCaches(): Promise<boolean> {
  if (!registration) {
    console.warn('[PWA-Helper] No active registration')
    return false
  }

  return new Promise((resolve) => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'ALL_CACHES_CLEARED') {
        navigator.serviceWorker.removeEventListener('message', handler)
        resolve(true)
        console.log('[PWA-Helper] All caches cleared successfully')
      }
    }

    navigator.serviceWorker.addEventListener('message', handler)

    // Timeout after 5 seconds
    setTimeout(() => {
      navigator.serviceWorker.removeEventListener('message', handler)
      resolve(false)
    }, 5000)

    // Send clear cache request
    registration!.postMessage({ type: 'CLEAR_ALL_CACHES' })
  })
}

/**
 * Get detailed cache information
 */
export async function getCacheInfo(): Promise<CacheInfo | null> {
  if (!registration) {
    return null
  }

  return new Promise((resolve) => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'CACHE_STATUS') {
        navigator.serviceWorker.removeEventListener('message', handler)
        resolve({
          size: event.data.size || 0,
          entries: event.data.totalEntries || 0,
          caches: event.data.caches || []
        })
      }
    }

    navigator.serviceWorker.addEventListener('message', handler)

    setTimeout(() => {
      navigator.serviceWorker.removeEventListener('message', handler)
      resolve(null)
    }, 5000)

    registration!.postMessage({ type: 'GET_CACHE_STATUS' })
  })
}

/**
 * Precache specific resources
 */
export async function precacheResources(urls: string[]): Promise<number> {
  if (!registration) {
    console.warn('[PWA-Helper] No active registration')
    return 0
  }

  return new Promise((resolve) => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'PRECACHED') {
        navigator.serviceWorker.removeEventListener('message', handler)
        resolve(event.data.count || 0)
      }
    }

    navigator.serviceWorker.addEventListener('message', handler)

    setTimeout(() => {
      navigator.serviceWorker.removeEventListener('message', handler)
      resolve(0)
    }, 30000) // Longer timeout for precaching

    registration!.postMessage({ type: 'PRECACHE_URLS', urls })
  })
}

// ==================== Online/Offline Status ====================

/**
 * Check current online status
 */
export function isOnline(): boolean {
  return navigator.onLine
}

/**
 * Add online/offline status listener
 */
export function addOnlineStatusListener(callback: (online: boolean) => void): () => void {
  onlineStatusListeners.add(callback)

  // Return unsubscribe function
  return () => {
    onlineStatusListeners.delete(callback)
  }
}

/**
 * Initialize online/offline monitoring
 */
function initOnlineMonitoring(): void {
  window.addEventListener('online', () => {
    console.log('[PWA-Helper] Network connection restored')
    onlineStatusListeners.forEach(listener => listener(true))
  })

  window.addEventListener('offline', () => {
    console.log('[PWA-Helper] Network connection lost')
    onlineStatusListeners.forEach(listener => listener(false))
  })
}

// ==================== Background Sync ====================

/**
 * Request background sync for a specific tag
 */
export async function requestBackgroundSync(tag: string): Promise<boolean> {
  if (!registration) {
    console.warn('[PWA-Helper] No active registration for background sync')
    return false
  }

  return new Promise((resolve) => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC_REGISTERED') {
        navigator.serviceWorker.removeEventListener('message', handler)
        resolve(event.data.success || false)
      }
    }

    navigator.serviceWorker.addEventListener('message', handler)

    setTimeout(() => {
      navigator.serviceWorker.removeEventListener('message', handler)
      resolve(false)
    }, 5000)

    registration!.postMessage({ type: 'REQUEST_SYNC', tag })
  })
}

/**
 * Save data for background sync when offline
 */
export async function savePendingData(
  storeName: string,
  data: Omit<PendingSyncData, 'id' | 'timestamp'>
): Promise<boolean> {
  if (!registration) {
    console.warn('[PWA-Helper] No active registration')
    return false
  }

  const payload: PendingSyncData = {
    ...data,
    id: generateUniqueId(),
    timestamp: Date.now(),
    retryCount: 0
  }

  return new Promise((resolve) => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'DATA_SAVED') {
        navigator.serviceWorker.removeEventListener('message', handler)
        resolve(true)
      }
    }

    navigator.serviceWorker.addEventListener('message', handler)

    setTimeout(() => {
      navigator.serviceWorker.removeEventListener('message', handler)
      resolve(false)
    }, 5000)

    registration!.postMessage({
      type: 'SAVE_PENDING_DATA',
      storeName,
      payload
    })
  })
}

// ==================== Communication Channel ====================

/**
 * Setup BroadcastChannel for real-time communication with SW
 */
function setupBroadcastChannel(): void {
  if ('BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME)

    broadcastChannel.onmessage = (event) => {
      handleSWMessage(event.data)
    }

    console.log('[PWA-Helper] BroadcastChannel established')
  } else {
    // Fallback: Listen for messages from SW
    navigator.serviceWorker.addEventListener('message', (event) => {
      handleSWMessage(event.data)
    })
  }
}

/**
 * Handle incoming messages from service worker
 */
function handleSWMessage(data: any): void {
  if (!data?.type) return

  console.log('[PWA-Helper] Received message from SW:', data.type)

  // Call registered handlers for this message type
  const handlers = messageHandlers.get(data.type)
  if (handlers) {
    handlers.forEach(handler => handler(data))
  }

  // Handle special message types
  switch (data.type) {
    case 'ACTIVATED':
      console.log(`[PWA-Helper] Service Worker activated: ${data.version}`)
      break

    case 'CONTENT_UPDATED':
      console.log(`[PWA-Helper] Content updated: ${data.url}`)
      break

    case 'STALE_DATA':
      console.warn(`[PWA-Helper] Serving stale data: ${data.url}`)
      break

    case 'FORM_SYNCED':
    case 'ORDER_SYNCED':
    case 'REVIEW_SYNCED':
    case 'FEEDBACK_SYNCED':
      console.log(`[PWA-Helper] Background sync completed: ${data.type}`)
      break
  }
}

/**
 * Register a custom message handler
 */
export function onSWMessage(type: string, handler: MessageHandler): () => void {
  if (!messageHandlers.has(type)) {
    messageHandlers.set(type, new Set())
  }

  messageHandlers.get(type)!.add(handler)

  // Return unsubscribe function
  return () => {
    messageHandlers.get(type)?.delete(handler)
  }
}

// ==================== Install Prompt ====================

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: BeforeInstallPromptEvent | null = null

/**
 * Setup install prompt listener
 */
export function setupInstallPrompt(
  onInstallable?: () => void,
  onInstalled?: () => void
): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e as BeforeInstallPromptEvent
    onInstallable?.()
    console.log('[PWA-Helper] App is installable')
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    localStorage.setItem(INSTALL_PROMPT_SHOWN_KEY, 'installed')
    onInstalled?.()
    console.log('[PWA-Helper] App was installed')

    // Track installation (optional)
    trackInstallation()
  })
}

/**
 * Check if app can be installed
 */
export function canInstall(): boolean {
  return deferredPrompt !== null
}

/**
 * Show native install prompt
 */
export async function showInstallPrompt(): Promise<'accepted' | 'dismissed'> {
  if (!deferredPrompt) {
    throw new Error('App cannot be installed at this time')
  }

  try {
    await deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    deferredPrompt = null

    if (result.outcome === 'accepted') {
      console.log('[PWA-Helper] User accepted installation')
    } else {
      console.log('[PWA-Helper] User dismissed installation')
    }

    return result.outcome
  } catch (error) {
    console.error('[PWA-Helper] Install prompt failed:', error)
    throw error
  }
}

/**
 * Check if we should show install prompt based on user preferences
 */
export function shouldShowInstallPrompt(): boolean {
  const lastShown = localStorage.getItem(INSTALL_PROMPT_SHOWN_KEY)

  if (lastShown === 'installed') {
    return false // Already installed
  }

  if (!lastShown) {
    return true // Never shown before
  }

  // Check if enough time has passed since last dismissal
  const lastDate = new Date(lastShown)
  const now = new Date()
  const daysSinceLastShow = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

  return daysSinceLastShow >= INSTALL_DEFERRED_DAYS
}

/**
 * Record that prompt was shown/dismissed
 */
export function recordPromptShown(): void {
  localStorage.setItem(INSTALL_PROMPT_SHOWN_KEY, new Date().toISOString())
}

/**
 * Check if app is already installed
 */
export function isInstalled(): boolean {
  // Check various indicators of installation
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true
  }

  if ((navigator as any).standalone === true) {
    return true // iOS Safari
  }

  return localStorage.getItem(INSTALL_PROMPT_SHOWN_KEY) === 'installed'
}

// ==================== Analytics ====================

function trackInstallation(): void {
  // Optional: Send installation analytics
  try {
    // Example: Send to your analytics endpoint
    // fetch('/api/analytics/pwa-installed', { method: 'POST' })
    console.log('[PWA-Helper] Installation tracked')
  } catch (error) {
    // Silently fail
  }
}

// ==================== Utility Functions ====================

function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function notifyUpdateAvailable(): void {
  // Dispatch custom event that components can listen to
  window.dispatchEvent(new CustomEvent('pwa-update-available', {
    detail: { registration }
  }))
}

// ==================== Initialization ====================

/**
 * Initialize all PWA features
 * Call this once in your app's entry point
 */
export async function initPWA(options?: {
  onInstallable?: () => void
  onInstalled?: () => void
  onUpdateFound?: (registration: SWRegistration) => void
}): Promise<SWRegistration | null> {
  // Initialize online monitoring
  initOnlineMonitoring()

  // Setup install prompt
  setupInstallPrompt(options?.onInstallable, options?.onInstalled)

  // Register service worker
  const reg = await registerServiceWorker({
    onUpdateFound: options?.onUpdateFound
  })

  return reg
}

// Export singleton instance getter
export function getRegistration(): SWRegistration | null {
  return registration
}
