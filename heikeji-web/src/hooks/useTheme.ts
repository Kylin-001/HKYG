import { ref, computed, watch, onMounted } from 'vue'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'heikeji-theme'
const MEDIA_QUERY = '(prefers-color-scheme: dark)'

const theme = ref<Theme>('system')
const resolvedTheme = ref<ResolvedTheme>('light')
const isDark = computed(() => resolvedTheme.value === 'dark')

let mediaQueryList: MediaQueryList | null = null

function getSystemTheme(): ResolvedTheme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light'
  }
  return 'light'
}

function applyTheme(newTheme: ResolvedTheme) {
  resolvedTheme.value = newTheme
  
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#1a1a2e' : '#F5F7FA')
    }
  }
}

function resolveAndApplyTheme(currentTheme: Theme) {
  if (currentTheme === 'system') {
    applyTheme(getSystemTheme())
  } else {
    applyTheme(currentTheme)
  }
}

function setTheme(newTheme: Theme) {
  theme.value = newTheme
  resolveAndApplyTheme(newTheme)
  
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, newTheme)
  }
}

function toggleTheme() {
  if (isDark.value) {
    setTheme('light')
  } else {
    setTheme('dark')
  }
}

function initTheme() {
  if (typeof localStorage !== 'undefined') {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      theme.value = savedTheme
    }
  }
  
  resolveAndApplyTheme(theme.value)

  if (typeof window !== 'undefined' && window.matchMedia) {
    mediaQueryList = window.matchMedia(MEDIA_QUERY)
    
    mediaQueryList.addEventListener('change', (e) => {
      if (theme.value === 'system') {
        applyTheme(e.matches ? 'dark' : 'light')
      }
    })
  }
}

function cleanup() {
  if (mediaQueryList) {
    mediaQueryList.removeEventListener('change', () => {})
    mediaQueryList = null
  }
}

watch(theme, (newTheme) => {
  resolveAndApplyTheme(newTheme)
})

export function useTheme() {
  onMounted(() => {
    initTheme()
  })

  return {
    theme,
    isDark,
    resolvedTheme,
    setTheme,
    toggleTheme,
    initTheme,
    cleanup,
  }
}
