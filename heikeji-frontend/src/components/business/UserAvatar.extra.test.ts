import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import UserAvatar from '@/components/business/UserAvatar.vue'

describe('UserAvatar Component Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockUser = {
    userId: 1,
    username: 'testuser',
    nickname: '测试用户',
    avatar: 'http://example.com/avatar.jpg',
    status: 'online',
    email: 'test@example.com',
    phone: '13800138000'
  }

  it('should render correctly', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.user-avatar').exists()).toBe(true)
  })

  it('should display avatar image', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser
      },
      global: {
        plugins: [createPinia()],
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
        showName: true
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.text()).toContain('测试用户')
  })

  it('should show username when nickname not provided', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: { ...mockUser, nickname: null },
        showName: true
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.text()).toContain('testuser')
  })

  it('should show online status indicator', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.status-online')).exists().toBe(true)
  })

  it('should show offline status indicator', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: { ...mockUser, status: 'offline' }
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.status-offline')).exists().toBe(true)
  })

  it('should apply custom size', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser,
        size: 'large'
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.avatar-large')).exists().toBe(true)
  })

  it('should apply default size', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.avatar-medium')).exists().toBe(true)
  })

  it('should show role badge when provided', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser,
        role: 'admin'
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.role-badge')).exists().toBe(true)
    expect(wrapper.text()).toContain('admin')
  })

  it('should emit click event when clicked', async () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    await wrapper.find('.user-avatar').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')[0]).toEqual([mockUser])
  })

  it('should show default avatar when user avatar not provided', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: { ...mockUser, avatar: null }
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    const img = wrapper.find('img')
    expect(img.attributes('src')).toContain('default-avatar')
  })

  it('should handle small size', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser,
        size: 'small'
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.avatar-small')).exists().toBe(true)
  })

  it('should handle extra large size', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser,
        size: 'xlarge'
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.avatar-xlarge')).exists().toBe(true)
  })

  it('should show multiple role badges', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: mockUser,
        roles: ['admin', 'moderator', 'vip']
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    const badges = wrapper.findAll('.role-badge')
    expect(badges.length).toBe(3)
  })

  it('should handle long nickname', () => {
    const longNickname = '这是一个非常长的昵称，用来测试组件的显示效果'
    const wrapper = mount(UserAvatar, {
      props: {
        user: { ...mockUser, nickname: longNickname },
        showName: true
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.text()).toContain(longNickname)
  })

  it('should handle special characters in nickname', () => {
    const specialNickname = '测试用户@#$%'
    const wrapper = mount(UserAvatar, {
      props: {
        user: { ...mockUser, nickname: specialNickname },
        showName: true
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.text()).toContain(specialNickname)
  })
})
