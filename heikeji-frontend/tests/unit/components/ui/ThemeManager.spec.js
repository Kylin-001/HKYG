import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import ThemeManager from '@/components/ui/ThemeManager.vue'

describe('ThemeManager Component', () => {
  let wrapper

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()

    wrapper = mount(ThemeManager, {
      global: {
        plugins: [ElementPlus],
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should initialize with light theme by default', async () => {
    // Wait for component to initialize
    await wrapper.vm.$nextTick()
    // Check that the theme is applied to the root element
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('should render theme selector', async () => {
    // Wait for component to render
    await wrapper.vm.$nextTick()
    // Check that the theme selector is rendered
    expect(wrapper.find('.theme-manager').exists()).toBe(true)

    // Check that the theme dropdown is rendered
    expect(wrapper.find('.el-dropdown').exists()).toBe(true)
  })

  it('should expose switchTheme method', () => {
    // Check that the component exposes the switchTheme method
    expect(wrapper.vm.switchTheme).toBeDefined()
    expect(typeof wrapper.vm.switchTheme).toBe('function')
  })

  it('should switch to dark theme when switchTheme is called', async () => {
    // Call switchTheme method directly
    wrapper.vm.switchTheme('dark')
    await wrapper.vm.$nextTick()

    // Check that the theme has been switched to dark
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('should update theme in localStorage when switched', async () => {
    // Call switchTheme method directly
    wrapper.vm.switchTheme('dark')
    await wrapper.vm.$nextTick()

    // Check that the theme has been saved to localStorage
    expect(localStorage.getItem('heikeji-theme')).toBe('dark')
  })

  it('should apply theme immediately when initialized', async () => {
    // Wait for component to initialize
    await wrapper.vm.$nextTick()
    // Check that the theme is applied to the root element
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
