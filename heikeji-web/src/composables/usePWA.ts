import { ref, onMounted, type Ref } from 'vue'

interface SWRegistration {
  registration: ServiceWorkerRegistration | null
  isSupported: boolean
  isOnline: navigator.onLine
  updateAvailable: boolean
  cacheSize: number | null
}

type SWMessageType = 'SKIP_WAITING' | 'CLEAR_CACHE' | 'GET_CACHE_SIZE' | 'PRECACHE_URLS'

interface SWMessage {
  type: SWMessageType
  urls?: string[]
}

export function usePWA() {
  const registration = ref<ServiceWorkerRegistration | null>(null)
  const isSupported = ref('serviceWorker' in navigator)
  const isOnline = ref(navigator.onLine)
  const updateAvailable = ref(false)
  const cacheSize = ref<number | null>(null)
  const installing = ref<boolean>(false)

  async function registerSW(swUrl: string = '/sw.js', scope: string = '/'): Promise<void> {
    if (!isSupported.value) {
      console.warn('[PWA] Service Worker not supported')
      return
    }

    try {
      installing.value = true
      const reg = await navigator.serviceWorker.register(swUrl, { scope })
      registration.value = reg

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              updateAvailable.value = true
            }
          })
        }
      })

      console.log('[PWA] Service Worker registered:', swUrl)
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error)
    } finally {
      installing.value = false
    }
  }

  async function skipWaiting(): Promise<void> {
    await sendMessage({ type: 'SKIP_WAITING' })

    return new Promise((resolve) => {
      if (!registration.value) {
        resolve()
        return
      }

      const newWorker = registration.value.waiting || registration.value.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            resolve()
          }
        })
      } else {
        resolve()
      }
    })
  }

  async function applyUpdate(): Promise<void> {
    await skipWaiting()
    window.location.reload()
  }

  async function clearCache(): Promise<number> {
    const sizeBefore = cacheSize.value || 0
    await sendMessage({ type: 'CLEAR_CACHE' })
    await getCacheSize()
    return sizeBefore
  }

  async function getCacheSize(): Promise<number> {
    if (!isSupported.value) return 0

    try {
      await sendMessage({ type: 'GET_CACHE_SIZE' })

      return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
          if (event.data?.type === 'CACHE_SIZE') {
            cacheSize.value = event.data.size
            navigator.serviceWorker.removeEventListener('message', handler)
            resolve(event.data.size)
          }
        }

        navigator.serviceWorker.addEventListener('message', handler)

        setTimeout(() => {
          navigator.serviceWorker.removeEventListener('message', handler)
          resolve(0)
        }, 3000)
      })
    } catch {
      return 0
    }
  }

  async function precacheUrls(urls: string[]): Promise<void> {
    await sendMessage({ type: 'PRECACHE_URLS', urls })
  }

  async function sendMessage(message: SWMessage): Promise<void> {
    if (!registration.value) return

    try {
      if (registration.value.active) {
        registration.value.active.postMessage(message)
      } else if (registration.value.installing) {
        const waitForActive = new Promise<void>((resolve) => {
          const worker = registration.value!.installing!
          const checkState = () => {
            if (worker.state === 'activated') {
              worker.removeEventListener('statechange', checkState)
              resolve()
            }
          }
          worker.addEventListener('statechange', checkState)
          if (worker.state === 'activated') resolve()
        })

        await waitForActive
        registration.value.active?.postMessage(message)
      }
    } catch (error) {
      console.error('[PWA] Failed to send message to SW:', error)
    }
  }

  function setupNetworkListeners(): void {
    if (typeof window === 'undefined') return

    window.addEventListener('online', () => { isOnline.value = true })
    window.addEventListener('offline', () => { isOnline.value = false })
  }

  async function canInstall(): Promise<boolean> {
    if (!isSupported.value) return false

    const promptEvent = (window as any).beforeinstallprompt
    return !!promptEvent
  }

  async function promptInstall(): Promise<boolean> {
    const promptEvent = (window as any).beforeinstallprompt
    if (!promptEvent) return false

    promptEvent.prompt()
    const result = await promptEvent.userChoice
    return result.outcome === 'accepted'
  }

  onMounted(() => {
    setupNetworkListeners()
    getCacheSize()
  })

  return {
    registration,
    isSupported,
    isOnline,
    updateAvailable,
    cacheSize,
    installing,
    registerSW,
    skipWaiting,
    applyUpdate,
    clearCache,
    getCacheSize,
    precacheUrls,
    canInstall,
    promptInstall,
  }
}
