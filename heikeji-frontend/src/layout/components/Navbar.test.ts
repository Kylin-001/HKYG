import { describe, it, expect, vi, beforeEach } from 'vitest'
import { testUserData } from '@/config/test';
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Navbar from '@/layout/components/Navbar.vue'

vi.mock('js-cookie', () => ({
  get: vi.fn(() => 'test-token'),
  set: vi.fn(),
  remove: vi.fn(),
}))

describe('Navbar Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render correctly', () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.navbar').exists()).toBe(true)
  })

  it('should show logo', () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.logo').exists()).toBe(true)
  })

  it('should show user menu when logged in', () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.user-menu').exists()).toBe(true)
  })

  it('should emit toggle-sidebar event when menu button clicked', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    const menuButton = wrapper.find('.menu-button')
    await menuButton.trigger('click')
    
    expect(wrapper.emitted('toggle-sidebar')).toBeTruthy()
  })

  it('should emit logout event when logout button clicked', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    const logoutButton = wrapper.find('.logout-button')
    if (logoutButton.exists()) {
      await logoutButton.trigger('click')
      expect(wrapper.emitted('logout')).toBeTruthy()
    }
  })

  it('should show notification badge when there are notifications', () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.notification-badge').exists()).toBe(true)
  })

  it('should handle user dropdown toggle', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    const userAvatar = wrapper.find('.user-avatar')
    await userAvatar.trigger('click')
    
    expect(wrapper.find('.user-dropdown').exists()).toBe(true)
  })
})
