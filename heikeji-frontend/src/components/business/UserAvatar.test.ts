import { describe, it, expect, vi } from 'vitest'
import { testUserData } from '@/config/test'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import UserAvatar from '@/components/business/UserAvatar.vue'

describe('UserAvatar Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockUser = {
    userId: 1,
    username: 'testuser',
    nickname: '测试用户',
    avatar: 'http://example.com/avatar.jpg',
    status: 'online',
  }

  it('should render avatar image correctly', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser,
      },
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('http://example.com/avatar.jpg')
    expect(img.attributes('alt')).toBe('测试用户')
  })

  it('should show nickname when provided', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser,
        showName: true,
      },
    })

    expect(wrapper.text()).toContain('测试用户')
  })

  it('should show username when nickname not provided', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: { ...mockUser, nickname: null },
        showName: true,
      },
    })

    expect(wrapper.text()).toContain('testuser')
  })

  it('should show online status indicator', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser,
      },
    })

    expect(wrapper.find('.status-online').exists()).toBe(true)
  })

  it('should show offline status indicator', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: { ...mockUser, status: 'offline' },
      },
    })

    expect(wrapper.find('.status-offline').exists()).toBe(true)
  })

  it('should apply custom size', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser,
        size: 'large',
      },
    })

    expect(wrapper.find('.avatar-large').exists()).toBe(true)
  })

  it('should apply default size', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser,
      },
    })

    expect(wrapper.find('.avatar-medium').exists()).toBe(true)
  })

  it('should show role badge when provided', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser,
        role: 'admin',
      },
    })

    expect(wrapper.find('.role-badge').exists()).toBe(true)
    expect(wrapper.text()).toContain('admin')
  })

  it('should emit click event when clicked', async () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser,
      },
    })

    await wrapper.find('.user-avatar').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')[0]).toEqual([mockUser])
  })

  it('should show default avatar when user avatar not provided', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: { ...mockUser, avatar: null },
      },
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toContain('default-avatar')
  })
})
