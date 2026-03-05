import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Login from '@/views/login/index.vue'

vi.mock('@/api/login', () => ({
  login: vi.fn(),
  getCaptcha: vi.fn(),
}))

vi.mock('@/utils/auth', () => ({
  setToken: vi.fn(),
}))

describe('Login Page', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should render correctly', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.login-container')).exists().toBe(true)
    expect(wrapper.find('.login-title')).text().toContain('黑龙江科技大学')
    expect(wrapper.find('.login-subtitle')).text().toContain('黑科易购校园电商平台')
  })

  it('should render login form with username and password fields', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('input[placeholder="请输入用户名"]')).exists().toBe(true)
    expect(wrapper.find('input[placeholder="请输入密码"]')).exists().toBe(true)
  })

  it('should show captcha field when showCode is true', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.code-wrapper')).exists().toBe(true)
  })

  it('should call login API when form is submitted', async () => {
    const { login } = await import('@/api/login')
    const { setToken } = await import('@/utils/auth')
    
    const wrapper = mount(Login, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    await wrapper.vm.handleLogin()
    expect(login).toHaveBeenCalled()
  })

  it('should set token when login is successful', async () => {
    const { login } = await import('@/api/login')
    const { setToken } = await import('@/utils/auth')
    
    login.mockResolvedValue({ data: { token: 'test-token-123' } })
    
    const wrapper = mount(Login, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    await wrapper.vm.handleLogin()
    expect(setToken).toHaveBeenCalledWith('test-token-123')
  })

  it('should show loading state during login', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    wrapper.vm.loading = true
    await wrapper.vm.$nextTick()
    
    const loginButton = wrapper.find('.el-button')
    expect(loginButton.attributes('disabled')).toBeDefined()
  })

  it('should validate username is required', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    wrapper.vm.loginForm.username = ''
    await wrapper.vm.handleLogin()
    
    expect(wrapper.find('.el-form-item__error')).exists().toBe(true)
  })

  it('should validate password is required', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    wrapper.vm.loginForm.password = ''
    await wrapper.vm.handleLogin()
    
    expect(wrapper.find('.el-form-item__error')).exists().toBe(true)
  })

  it('should handle login error', async () => {
    const { login } = await import('@/api/login')
    login.mockRejectedValue(new Error('Invalid credentials'))
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const wrapper = mount(Login, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    await wrapper.vm.handleLogin()
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should call getCaptcha on mount', async () => {
    const { getCaptcha } = await import('@/api/login')
    getCaptcha.mockResolvedValue({ data: { captchaId: '123', captchaImage: 'data:image' } })
    
    mount(Login, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(getCaptcha).toHaveBeenCalled()
  })

  it('should redirect to dashboard after successful login', async () => {
    const { login } = await import('@/api/login')
    const { useRouter } = await import('vue-router')
    const mockPush = vi.fn()
    
    useRouter.mockReturnValue({ push: mockPush })
    login.mockResolvedValue({ data: { token: 'test-token' } })
    
    const wrapper = mount(Login, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    await wrapper.vm.handleLogin()
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })
})
