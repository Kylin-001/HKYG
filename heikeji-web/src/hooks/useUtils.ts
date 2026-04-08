import { ref, onMounted, onUnmounted } from 'vue'

export function useDebounce<T extends (...args: any[]) => any>(fn: T, delay = 300): T {
  let timer: ReturnType<typeof setTimeout> | null = null
  return ((...args: any[]) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as unknown as T
}

export function useThrottle<T extends (...args: any[]) => any>(fn: T, limit = 200): T {
  let inThrottle = false
  return ((...args: any[]) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => { inThrottle = false }, limit)
    }
  }) as unknown as T
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(defaultValue)

  try {
    const stored = localStorage.getItem(key)
    if (stored !== null) data.value = JSON.parse(stored)
  } catch {}

  function save(value: T) {
    data.value = value
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  }

  watch(data, (val) => { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }, { deep: true })

  return { data, save }
}

export function useMediaQuery(query: string) {
  const matches = ref(false)
  let mql: MediaQueryList | null = null

  function update(e?: MediaQueryListEvent) { matches.value = e?.matches ?? mql?.matches ?? false }

  onMounted(() => {
    mql = window.matchMedia(query)
    update()
    mql.addEventListener('change', update)
  })
  onUnmounted(() => { mql?.removeEventListener('change', update) })

  return matches
}
