import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import Login from '@/views/login/index.vue'
import Dashboard from '@/views/dashboard/index.vue'
import { useUserStore } from '@/store/modules/user'

vi.mock('@/api/login', () => ({
  login: vi.fn(),
  getCaptcha: vi.fn(),
}))

vi.mock('@/utils/auth', () => ({
  setToken: vi.fn(),
}))

describe('登录流程集成测试', () => {
  let pinia: any
  let router: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/login', component: Login },
        { path: '/dashboard', component: Dashboard }
      ]
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('应该成功登录并跳转到仪表盘', async () => {
    const { login } = await import('@/api/login')
    const { setToken } = await import('@/utils/auth')
    
    login.mockResolvedValue({ 
      data: { 
        token: testUserData.token,
        userInfo: {
          userId: 1,
          username: 'testuser',
          nickname: '测试用户'
        }
      } 
    })
    
    const wrapper = mount(Login, {
      global: {
        plugins: [pinia, router],
      },
    })
    
    await wrapper.vm.$nextTick()
    
    const usernameInput = wrapper.find('input[placeholder="请输入用户名"]')
    const passwordInput = wrapper.find('input[placeholder="请输入密码"]')
    const loginButton = wrapper.find('.login-button')
    
    await usernameInput.setValue('testuser')
    await passwordInput.setValue('password123')
    await loginButton.trigger('click')
    
    await wrapper.vm.$nextTick()
    
    expect(login).toHaveBeenCalledWith({
      username: 'testuser',
      password: testUserData.password
    })
    expect(setToken).toHaveBeenCalledWith('test-token-123')
    expect(router.currentRoute.value.path).toBe('/dashboard')
  })

  it('应该在登录失败时显示错误信息', async () => {
    const { login } = await import('@/api/login')
    
    login.mockRejectedValue(new Error('用户名或密码错误'))
    
    const wrapper = mount(Login, {
      global: {
        plugins: [pinia, router],
      },
    })
    
    await wrapper.vm.$nextTick()
    
    const usernameInput = wrapper.find('input[placeholder="请输入用户名"]')
    const passwordInput = wrapper.find('input[placeholder="请输入密码"]')
    const loginButton = wrapper.find('.login-button')
    
    await usernameInput.setValue('wronguser')
    await passwordInput.setValue('wrongpassword')
    await loginButton.trigger('click')
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toContain('用户名或密码错误')
  })

  it('应该在登录成功后保存用户信息', async () => {
    const { login } = await import('@/api/login')
    const { setToken } = await import('@/utils/auth')
    
    login.mockResolvedValue({ 
      data: { 
        token: testUserData.token,
        userInfo: {
          userId: 1,
          username: 'testuser',
          nickname: '测试用户',
          avatar: 'http://example.com/avatar.jpg',
          phone: '13800138000',
          email: 'test@example.com'
        }
      } 
    })
    
    const wrapper = mount(Login, {
      global: {
        plugins: [pinia, router],
      },
    })
    
    await wrapper.vm.$nextTick()
    
    const usernameInput = wrapper.find('input[placeholder="请输入用户名"]')
    const passwordInput = wrapper.find('input[placeholder="请输入密码"]')
    const loginButton = wrapper.find('.login-button')
    
    await usernameInput.setValue('testuser')
    await passwordInput.setValue('password123')
    await loginButton.trigger('click')
    
    await wrapper.vm.$nextTick()
    
    const userStore = useUserStore()
    expect(userStore.token).toBe('test-token-123')
    expect(userStore.userInfo).toEqual({
      userId: 1,
      username: 'testuser',
      nickname: '测试用户',
      avatar: 'http://example.com/avatar.jpg',
      phone: '13800138000',
      email: 'test@example.com'
    })
  })

  it('应该在登录成功后保存权限信息', async () => {
    const { login } = await import('@/api/login')
    const { setToken } = await import('@/utils/auth')
    
    login.mockResolvedValue({ 
      data: { 
        token: testUserData.token,
        userInfo: {
          userId: 1,
          username: 'testuser'
        },
        permissions: ['user:view', 'user:add', 'user:edit', 'product:view']
      } 
    })
    
    const wrapper = mount(Login, {
      global: {
        plugins: [pinia, router],
      },
    })
    
    await wrapper.vm.$nextTick()
    
    const usernameInput = wrapper.find('input[placeholder="请输入用户名"]')
    const passwordInput = wrapper.find('input[placeholder="请输入密码"]')
    const loginButton = wrapper.find('.login-button')
    
    await usernameInput.setValue('testuser')
    await passwordInput.setValue('password123')
    await loginButton.trigger('click')
    
    await wrapper.vm.$nextTick()
    
    const userStore = useUserStore()
    expect(userStore.permissions).toEqual(['user:view', 'user:add', 'user:edit', 'product:view'])
  })

  it('应该支持验证码登录', async () => {
    const { login } = await import('@/api/login')
    const { getCaptcha } = await import('@/api/login')
    const { setToken } = await import('@/utils/auth')
    
    getCaptcha.mockResolvedValue({ 
      data: { 
        captchaId: '123456',
        captchaImage: 'data:image/png;base64,ABC123'
      } 
    })
    
    login.mockResolvedValue({ 
      data: { 
        token: testUserData.token,
        userInfo: {
          userId: 1,
          username: 'testuser'
        }
      } 
    })
    
    const wrapper = mount(Login, {
      global: {
        plugins: [pinia, router],
      },
    })
    
    await wrapper.vm.$nextTick()
    
    expect(getCaptcha).toHaveBeenCalled()
    expect(wrapper.find('.captcha-image').exists()).toBe(true)
    
    const usernameInput = wrapper.find('input[placeholder="请输入用户名"]')
    const passwordInput = wrapper.find('input[placeholder="请输入密码"]')
    const captchaInput = wrapper.find('input[placeholder="请输入验证码"]')
    const loginButton = wrapper.find('.login-button')
    
    await usernameInput.setValue('testuser')
    await passwordInput.setValue('password123')
    await captchaInput.setValue('123456')
    await loginButton.trigger('click')
    
    await wrapper.vm.$nextTick()
    
    expect(login).toHaveBeenCalledWith({
      username: 'testuser',
      password: testUserData.password,
      captchaId: '123456',
      captchaCode: '123456'
    })
  })

  it('应该在登录成功后清除表单', async () => {
    const { login } = await import('@/api/login')
    const { setToken } = await import('@/utils/auth')
    
    login.mockResolvedValue({ 
      data: { 
        token: testUserData.token,
        userInfo: {
          userId: 1,
          username: 'testuser'
        }
      } 
    })
    
    const wrapper = mount(Login, {
      global: {
        plugins: [pinia, router],
      },
    })
    
    await wrapper.vm.$nextTick()
    
    const usernameInput = wrapper.find('input[placeholder="请输入用户名"]')
    const passwordInput = wrapper.find('input[placeholder="请输入密码"]')
    const loginButton = wrapper.find('.login-button')
    
    await usernameInput.setValue('testuser')
    await passwordInput.setValue('password123')
    await loginButton.trigger('click')
    
    await wrapper.vm.$nextTick()
    
    expect(await usernameInput.value()).toBe('')
    expect(await passwordInput.value()).toBe('')
  })
})
