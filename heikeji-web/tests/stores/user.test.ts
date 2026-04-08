import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import * as userApi from '@/api/user'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock user API
vi.mock('@/api/user', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(() => Promise.resolve()),
  getUserInfo: vi.fn(),
  updateProfile: vi.fn(),
  uploadAvatar: vi.fn(),
  refreshToken: vi.fn(),
}))

const mockUser = {
  id: 1,
  username: 'testuser',
  nickname: '测试用户',
  email: 'test@example.com',
  avatar: '/avatar/default.png',
  phone: '13800138000',
}

const mockLoginResponse = {
  data: {
    token: 'mock-jwt-token-12345',
    user: mockUser,
  },
}

const mockRegisterResponse = {
  data: {
    id: 2,
    username: 'newuser',
    message: '注册成功',
  },
}

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  // ============================================
  // 初始状态验证
  // ============================================
  describe('初始状态验证', () => {
    it('user应该为null', () => {
      const store = useUserStore()
      expect(store.user).toBeNull()
    })

    it('token应该为空字符串', () => {
      const store = useUserStore()
      expect(store.token).toBe('')
    })

    it('isLoading应该为false', () => {
      const store = useUserStore()
      expect(store.isLoading).toBe(false)
    })

    it('error应该为null', () => {
      const store = useUserStore()
      expect(store.error).toBeNull()
    })
  })

  // ============================================
  // 计算属性测试
  // ============================================
  describe('计算属性', () => {
    describe('isAuthenticated', () => {
      it('有token和user时返回true', () => {
        const store = useUserStore()
        store.token = 'valid-token'
        store.user = mockUser as any

        expect(store.isAuthenticated).toBe(true)
      })

      it('无token时返回false', () => {
        const store = useUserStore()
        store.token = ''
        store.user = mockUser as any

        expect(store.isAuthenticated).toBe(false)
      })

      it('无user时返回false', () => {
        const store = useUserStore()
        store.token = 'valid-token'
        store.user = null

        expect(store.isAuthenticated).toBe(false)
      })
    })

    describe('userName', () => {
      it('优先显示nickname', () => {
        const store = useUserStore()
        store.user = mockUser as any

        expect(store.userName).toBe('测试用户')
      })

      it('nickname为空时显示username', () => {
        const store = useUserStore()
        store.user = { ...mockUser, nickname: '' } as any

        expect(store.userName).toBe('testuser')
      })

      it('未登录时显示默认文本', () => {
        const store = useUserStore()
        store.user = null

        expect(store.userName).toBe('未登录用户')
      })
    })

    describe('userAvatar', () => {
      it('有头像时返回头像URL', () => {
        const store = useUserStore()
        store.user = mockUser as any

        expect(store.userAvatar).toBe('/avatar/default.png')
      })

      it('无头像时返回默认头像', () => {
        const store = useUserStore()
        store.user = { ...mockUser, avatar: undefined } as any

        expect(store.userAvatar).toBe('/default-avatar.png')
      })
    })

    describe('userId', () => {
      it('登录状态下返回用户ID', () => {
        const store = useUserStore()
        store.user = mockUser as any

        expect(store.userId).toBe(1)
      })

      it('未登录时返回undefined', () => {
        const store = useUserStore()
        store.user = null

        expect(store.userId).toBeUndefined()
      })
    })
  })

  // ============================================
  // 登录功能测试
  // ============================================
  describe('login (登录)', () => {
    it('应该成功登录并更新状态', async () => {
      const store = useUserStore()
      vi.mocked(userApi.login).mockResolvedValue(mockLoginResponse as any)

      const result = await store.login({ username: 'testuser', password: '123456' })

      expect(userApi.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: '123456',
      })
      expect(result).toEqual(mockLoginResponse.data)
      expect(store.token).toBe(mockLoginResponse.data.token)
      expect(store.user).toEqual(mockLoginResponse.data.user)
      expect(store.isLoading).toBe(false)
    })

    it('应该将token和user持久化到localStorage', async () => {
      const store = useUserStore()
      vi.mocked(userApi.login).mockResolvedValue(mockLoginResponse as any)

      await store.login({ username: 'test', password: 'pass' })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'token',
        mockLoginResponse.data.token
      )
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(mockLoginResponse.data.user)
      )
    })

    it('API失败时应设置error并抛出错误', async () => {
      const store = useUserStore()
      vi.mocked(userApi.login).mockRejectedValue(new Error('密码错误'))

      await expect(
        store.login({ username: 'test', password: 'wrong' })
      ).rejects.toThrow('密码错误')
      expect(store.error).not.toBeNull()
      expect(store.isLoading).toBe(false)
    })

    it('使用服务器返回的错误消息', async () => {
      const store = useUserStore()
      vi.mocked(userApi.login).mockRejectedValue({
        response: { data: { message: '用户名或密码不正确' } },
      })

      try {
        await store.login({ username: 'test', password: 'wrong' })
      } catch {}

      expect(store.error).toBe('用户名或密码不正确')
    })

    it('请求期间loading应为true', async () => {
      const store = useUserStore()
      let resolve: (value: any) => void
      const promise = new Promise(r => { resolve = r })
      vi.mocked(userApi.login).mockReturnValue(promise)

      const loginPromise = store.login({ username: 'test', password: 'pass' })
      expect(store.isLoading).toBe(true)

      resolve!(mockLoginResponse as any)
      await loginPromise
      expect(store.isLoading).toBe(false)
    })
  })

  // ============================================
  // 注册功能测试
  // ============================================
  describe('register (注册)', () => {
    it('应该成功注册', async () => {
      const store = useUserStore()
      vi.mocked(userApi.register).mockResolvedValue(mockRegisterResponse as any)

      const result = await store.register({
        username: 'newuser',
        password: 'password123',
        confirmPassword: 'password123',
      })

      expect(userApi.register).toHaveBeenCalledWith({
        username: 'newuser',
        password: 'password123',
        confirmPassword: 'password123',
      })
      expect(result).toEqual(mockRegisterResponse.data)
    })

    it('API失败时应设置error并抛出错误', async () => {
      const store = useUserStore()
      vi.mocked(userApi.register).mockRejectedValue(new Error('用户已存在'))

      await expect(
        store.register({ username: 'existing', password: 'pass' })
      ).rejects.toThrow('用户已存在')
      expect(store.error).not.toBeNull()
    })

    it('使用服务器返回的错误消息', async () => {
      const store = useUserStore()
      vi.mocked(userApi.register).mockRejectedValue({
        response: { data: { message: '该手机号已被注册' } },
      })

      try {
        await store.register({ username: 'test', password: 'pass' })
      } catch {}

      expect(store.error).toBe('该手机号已被注册')
    })
  })

  // ============================================
  // 登出功能测试
  // ============================================
  describe('logout (登出)', () => {
    it('应该清除所有状态和localStorage', async () => {
      const store = useUserStore()
      // 先登录
      store.token = 'some-token'
      store.user = mockUser as any
      localStorageMock.setItem('token', 'some-token')
      localStorageMock.setItem('user', JSON.stringify(mockUser))

      await store.logout()

      expect(store.token).toBe('')
      expect(store.user).toBeNull()
      expect(store.error).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })

    it('无论API是否成功都应清除状态', async () => {
      const store = useUserStore()
      store.token = 'token'
      store.user = mockUser as any
      vi.mocked(userApi.logout).mockRejectedValue(new Error('Logout failed'))

      await store.logout() // 不应抛错

      expect(store.token).toBe('')
      expect(store.user).toBeNull()
    })

    it('无token时也能正常调用logout', async () => {
      const store = useUserStore()
      store.token = ''

      await store.logout() // 不应调用logout API

      expect(userApi.logout).not.toHaveBeenCalled()
    })
  })

  // ============================================
  // 获取用户信息测试
  // ============================================
  describe('fetchUserInfo (获取用户信息)', () => {
    it('应该成功获取用户信息', async () => {
      const store = useUserStore()
      store.token = 'valid-token'
      vi.mocked(userApi.getUserInfo).mockResolvedValue({
        data: { ...mockUser, nickname: '更新后的昵称' },
      })

      await store.fetchUserInfo()

      expect(userApi.getUserInfo).toHaveBeenCalledOnce()
      expect(store.user?.nickname).toBe('更新后的昵称')
      expect(store.isLoading).toBe(false)
    })

    it('无token时不发送请求', async () => {
      const store = useUserStore()
      store.token = ''

      await store.fetchUserInfo()

      expect(userApi.getUserInfo).not.toHaveBeenCalled()
    })

    it('API失败时应自动登出', async () => {
      const store = useUserStore()
      store.token = 'expired-token'
      store.user = mockUser as any
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(userApi.getUserInfo).mockRejectedValue(new Error('Token过期'))

      await store.fetchUserInfo()

      expect(store.token).toBe('')
      expect(store.user).toBeNull()
      consoleSpy.mockRestore()
    })
  })

  // ============================================
  // 更新用户信息测试
  // ============================================
  describe('updateProfile (更新用户信息)', () => {
    it('应该成功更新用户信息', async () => {
      const store = useUserStore()
      store.user = mockUser as any
      const updateData = { nickname: '新昵称', email: 'new@email.com' }
      vi.mocked(userApi.updateProfile).mockResolvedValue({
        data: updateData,
      })

      const result = await store.updateProfile(updateData)

      expect(userApi.updateProfile).toHaveBeenCalledWith(updateData)
      expect(result).toEqual(updateData)
      expect(store.user?.nickname).toBe('新昵称')
    })

    it('API失败时应设置error并抛出错误', async () => {
      const store = useUserStore()
      vi.mocked(userApi.updateProfile).mockRejectedValue(new Error('更新失败'))

      await expect(store.updateProfile({})).rejects.toThrow()
      expect(store.error).not.toBeNull()
    })
  })

  // ============================================
  // 上传头像测试
  // ============================================
  describe('uploadAvatar (上传头像)', () => {
    it('应该成功上传头像', async () => {
      const store = useUserStore()
      store.user = mockUser as any
      const mockFile = new File([''], 'avatar.jpg', { type: 'image/jpeg' })
      vi.mocked(userApi.uploadAvatar).mockResolvedValue({
        data: { url: '/avatars/new-avatar.jpg' },
      })

      const result = await store.uploadAvatar(mockFile)

      expect(userApi.uploadAvatar).toHaveBeenCalledWith(mockFile)
      expect(result.url).toBe('/avatars/new-avatar.jpg')
      expect(store.user?.avatar).toBe('/avatars/new-avatar.jpg')
    })

    it('API失败时应设置error并抛出错误', async () => {
      const store = useUserStore()
      const mockFile = new File([''], 'avatar.jpg', { type: 'image/jpeg' })
      vi.mocked(userApi.uploadAvatar).mockRejectedValue(new Error('上传失败'))

      await expect(store.uploadAvatar(mockFile)).rejects.toThrow()
      expect(store.error).toBe('上传头像失败')
    })
  })

  // ============================================
  // Token刷新测试
  // ============================================
  describe('refreshToken (刷新Token)', () => {
    it('应该成功刷新token', async () => {
      const store = useUserStore()
      store.token = 'old-token'
      vi.mocked(userApi.refreshToken).mockResolvedValue({
        data: { token: 'new-refreshed-token' },
      })

      const newToken = await store.refreshToken()

      expect(userApi.refreshToken).toHaveBeenCalledOnce()
      expect(newToken).toBe('new-refreshed-token')
      expect(store.token).toBe('new-refreshed-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'new-refreshed-token')
    })

    it('刷新失败时应抛出错误', async () => {
      const store = useUserStore()
      vi.mocked(userApi.refreshToken).mockRejectedValue(new Error('Refresh failed'))

      await expect(store.refreshToken()).rejects.toThrow('Refresh failed')
    })
  })

  // ============================================
  // 会话恢复测试
  // ============================================
  describe('restoreSession (会话恢复)', () => {
    it('应该从localStorage恢复登录状态', () => {
      const store = useUserStore()
      localStorageMock.setItem('token', 'saved-token')
      localStorageMock.setItem('user', JSON.stringify(mockUser))

      store.restoreSession()

      expect(store.token).toBe('saved-token')
      expect(store.user).toEqual(mockUser)
    })

    it('无保存的token时不恢复状态', () => {
      const store = useUserStore()

      store.restoreSession()

      expect(store.token).toBe('')
      expect(store.user).toBeNull()
    })

    it('有token但无user数据时只恢复token', () => {
      const store = useUserStore()
      localStorageMock.setItem('token', 'token-only')

      store.restoreSession()

      expect(store.token).toBe('token-only')
      expect(store.user).toBeNull()
    })

    it('用户数据格式错误时应优雅处理', () => {
      const store = useUserStore()
      localStorageMock.setItem('token', 'valid-token')
      localStorageMock.setItem('user', 'invalid-json')

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      store.restoreSession()

      expect(store.token).toBe('valid-token')
      expect(store.user).toBeNull() // 解析失败
      consoleSpy.mockRestore()
    })
  })

  // ============================================
  // clearError测试
  // ============================================
  describe('clearError (清除错误)', () => {
    it('应该清除error状态', () => {
      const store = useUserStore()
      store.error = 'Some error'

      store.clearError()

      expect(store.error).toBeNull()
    })

    it('error为null时不报错', () => {
      const store = useUserStore()
      store.error = null

      expect(() => store.clearError()).not.toThrow()
    })
  })

  // ============================================
  // loading状态管理测试
  // ============================================
  describe('loading状态管理', () => {
    it('login完成后loading应为false', async () => {
      const store = useUserStore()
      vi.mocked(userApi.login).mockResolvedValue(mockLoginResponse as any)

      const promise = store.login({ username: 't', password: 'p' })
      expect(store.isLoading).toBe(true)

      await promise
      expect(store.isLoading).toBe(false)
    })

    it('fetchUserInfo完成后loading应为false', async () => {
      const store = useUserStore()
      store.token = 't'
      vi.mocked(userApi.getUserInfo).mockResolvedValue({ data: mockUser })

      const promise = store.fetchUserInfo()
      expect(store.isLoading).toBe(true)

      await promise
      expect(store.isLoading).toBe(false)
    })
  })

  // ============================================
  // 边界情况测试
  // ============================================
  describe('边界情况', () => {
    it('多次快速登录应使用最后一次结果', async () => {
      const store = useUserStore()
      vi.mocked(userApi.login)
        .mockResolvedValueOnce({ data: { token: 'first', user: mockUser } } as any)
        .mockResolvedValueOnce({ data: { token: 'second', user: mockUser } } as any)

      const promise1 = store.login({ username: 'u1', password: 'p1' })
      const promise2 = store.login({ username: 'u2', password: 'p2' })

      const [result1, result2] = await Promise.all([promise1, promise2])

      expect(result2.token).toBe('second') // 最后一次的结果
    })

    it('并发操作时的状态一致性', async () => {
      const store = useUserStore()
      
      // 模拟login进行中
      let resolveLogin: (v: any) => void
      const loginPromise = new Promise(r => { resolveLogin = r })
      vi.mocked(userApi.login).mockReturnValue(loginPromise)

      const loginP = store.login({ username: 'u', password: 'p' })
      expect(store.isLoading).toBe(true)

      // 同时调用其他方法
      store.clearError()
      expect(store.error).toBeNull()

      resolveLogin!(mockLoginResponse as any)
      await loginP
      expect(store.isLoading).toBe(false)
    })
  })
})
