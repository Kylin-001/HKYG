import { defineStore } from 'pinia'
import logger from '@/utils/logger'

// 定义主题存储类型
export interface ThemeState {
  // 当前主题模式: 'light' | 'dark'
  mode: 'light' | 'dark'
  // 页面转场动画类型
  pageTransition: string
  // 主题颜色配置
  colors: {
    primary: string
    secondary: string
  }
  // 组件动画开关
  componentAnimations: boolean
  // 过渡动画时长
  animationDuration: number
}

// 创建主题存储
export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    mode: 'light',
    pageTransition: 'fade-transform',
    colors: {
      primary: '#003366',
      secondary: '#cc0000',
    },
    componentAnimations: true,
    animationDuration: 300,
  }),

  getters: {
    // 获取当前主题模式
    isDarkMode: state => state.mode === 'dark',

    // 获取当前动画配置
    animationConfig: state => ({
      duration: state.animationDuration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }),
  },

  actions: {
    // 切换主题模式
    toggleTheme() {
      this.mode = this.mode === 'light' ? 'dark' : 'light'
      this.applyTheme()
      this.saveTheme()
    },

    // 设置主题模式
    setTheme(mode: 'light' | 'dark') {
      this.mode = mode
      this.applyTheme()
      this.saveTheme()
    },

    // 设置页面转场动画
    setPageTransition(transition: string) {
      this.pageTransition = transition
      this.saveTheme()
    },

    // 切换组件动画开关
    toggleComponentAnimations() {
      this.componentAnimations = !this.componentAnimations
      this.saveTheme()
    },

    // 设置动画时长
    setAnimationDuration(duration: number) {
      this.animationDuration = duration
      this.saveTheme()
    },

    // 应用主题到DOM
    applyTheme() {
      const html = document.documentElement
      if (this.mode === 'dark') {
        html.setAttribute('data-theme', 'dark')
        html.classList.add('dark')
      } else {
        html.setAttribute('data-theme', 'light')
        html.classList.remove('dark')
      }

      // 应用主题颜色
      html.style.setProperty('--primary-color', this.colors.primary)
      html.style.setProperty('--secondary-color', this.colors.secondary)

      if (import.meta.env.MODE === 'development') {
        logger.debug('主题已应用:', this.mode)
      }
    },

    // 保存主题到本地存储
    saveTheme() {
      try {
        localStorage.setItem(
          'heikeji-theme',
          JSON.stringify({
            mode: this.mode,
            pageTransition: this.pageTransition,
            colors: this.colors,
            componentAnimations: this.componentAnimations,
            animationDuration: this.animationDuration,
          })
        )
      } catch (error) {
        logger.error('保存主题失败:', error)
      }
    },

    // 从本地存储加载主题
    loadTheme() {
      try {
        const savedTheme = localStorage.getItem('heikeji-theme')
        if (savedTheme) {
          const parsedTheme = JSON.parse(savedTheme)
          this.mode = parsedTheme.mode || 'light'
          this.pageTransition = parsedTheme.pageTransition || 'fade-transform'
          this.colors = parsedTheme.colors || this.colors
          this.componentAnimations =
            parsedTheme.componentAnimations !== undefined ? parsedTheme.componentAnimations : true
          this.animationDuration = parsedTheme.animationDuration || 300
          this.applyTheme()
        }
      } catch (error) {
        logger.error('加载主题失败:', error)
      }
    },

    // 重置主题为默认值
    resetTheme() {
      this.mode = 'light'
      this.pageTransition = 'fade-transform'
      this.colors = {
        primary: '#003366',
        secondary: '#cc0000',
      }
      this.componentAnimations = true
      this.animationDuration = 300
      this.applyTheme()
      this.saveTheme()
    },
  },
})
