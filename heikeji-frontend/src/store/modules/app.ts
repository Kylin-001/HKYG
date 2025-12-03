import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 定义app store的状态类型
interface AppState {
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  device: 'desktop' | 'mobile'
  size: string
  language: string
  theme: string
}

// 创建并导出app store
export const useAppStore = defineStore('app', () => {
  // 状态定义
  const sidebar = ref({
    opened: true,
    withoutAnimation: false,
  })

  const device = ref<'desktop' | 'mobile'>('desktop')
  const size = ref(localStorage.getItem('size') || 'medium')
  const language = ref(localStorage.getItem('language') || 'zh-CN')
  const theme = ref(localStorage.getItem('theme') || 'default')

  // 计算属性
  const sidebarOpened = computed(() => sidebar.value.opened)
  const currentDevice = computed(() => device.value)
  const currentSize = computed(() => size.value)
  const currentLanguage = computed(() => language.value)
  const currentTheme = computed(() => theme.value)

  // 方法
  function toggleSidebar() {
    sidebar.value.opened = !sidebar.value.opened
    sidebar.value.withoutAnimation = false
  }

  function closeSidebar(withoutAnimation: boolean) {
    sidebar.value.opened = false
    sidebar.value.withoutAnimation = withoutAnimation
  }

  function toggleDevice(val: 'desktop' | 'mobile') {
    device.value = val
  }

  function setSize(val: string) {
    size.value = val
    localStorage.setItem('size', val)
  }

  function setLanguage(val: string) {
    language.value = val
    localStorage.setItem('language', val)
  }

  function setTheme(val: string) {
    theme.value = val
    localStorage.setItem('theme', val)
  }

  // 导出状态、计算属性和方法
  return {
    // 状态
    sidebar,
    device,
    size,
    language,
    theme,
    // 计算属性
    sidebarOpened,
    currentDevice,
    currentSize,
    currentLanguage,
    currentTheme,
    // 方法
    toggleSidebar,
    closeSidebar,
    toggleDevice,
    setSize,
    setLanguage,
    setTheme,
  }
})
