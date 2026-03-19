import { describe, it, expect, vi, beforeEach } from 'vitest'
import { testUserData } from '@/config/test'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Layout from '@/layout/index.vue'
import { useAppStore } from '@/store/modules/app'

vi.mock('@/layout/components/Navbar.vue', () => ({
  name: 'Navbar',
  template: '<div class="navbar-mock">Navbar</div>',
}))

vi.mock('@/layout/components/Sidebar.vue', () => ({
  name: 'Sidebar',
  template: '<div class="sidebar-mock">Sidebar</div>',
}))

vi.mock('@/layout/components/AppMain.vue', () => ({
  name: 'AppMain',
  template: '<div class="main-mock">Main</div>',
}))

describe('Layout Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render correctly', () => {
    const wrapper = mount(Layout, {
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('.app-wrapper').exists()).toBe(true)
    expect(wrapper.find('.navbar-mock').exists()).toBe(true)
    expect(wrapper.find('.sidebar-mock').exists()).toBe(true)
    expect(wrapper.find('.main-mock').exists()).toBe(true)
  })

  it('should show drawer background when sidebar is opened on mobile', () => {
    const wrapper = mount(Layout, {
      global: {
        plugins: [createPinia()],
      },
    })

    const appStore = useAppStore()
    appStore.setDevice('mobile')
    appStore.openSidebar()

    expect(wrapper.find('.drawer-bg').exists()).toBe(true)
  })

  it('should not show drawer background when sidebar is closed', () => {
    const wrapper = mount(Layout, {
      global: {
        plugins: [createPinia()],
      },
    })

    const appStore = useAppStore()
    appStore.setDevice('mobile')
    appStore.closeSidebar()

    expect(wrapper.find('.drawer-bg').exists()).toBe(false)
  })

  it('should not show drawer background on desktop', () => {
    const wrapper = mount(Layout, {
      global: {
        plugins: [createPinia()],
      },
    })

    const appStore = useAppStore()
    appStore.setDevice('desktop')
    appStore.openSidebar()

    expect(wrapper.find('.drawer-bg').exists()).toBe(false)
  })

  it('should apply fixed-header class when fixedHeader is true', () => {
    const wrapper = mount(Layout, {
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('.fixed-header').exists()).toBe(true)
  })

  it('should apply has-logo class when showLogo is true', () => {
    const wrapper = mount(Layout, {
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('.has-logo').exists()).toBe(true)
  })

  it('should handle click outside event', async () => {
    const wrapper = mount(Layout, {
      global: {
        plugins: [createPinia()],
      },
    })

    const appStore = useAppStore()
    appStore.setDevice('mobile')
    appStore.openSidebar()

    const drawerBg = wrapper.find('.drawer-bg')
    await drawerBg.trigger('click')

    expect(appStore.sidebar.opened).toBe(false)
  })

  it('should have correct styles applied', () => {
    const wrapper = mount(Layout, {
      global: {
        plugins: [createPinia()],
      },
    })

    const appWrapper = wrapper.find('.app-wrapper')
    expect(appWrapper.classes()).toContain('has-logo')
  })
})
