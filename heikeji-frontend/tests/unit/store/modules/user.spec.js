import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import * as appAuthApi from '@/api/app/auth'

// Mock API calls
vi.mock('@/api/app/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getUserInfo: vi.fn(),
  updateUserInfo: vi.fn(),
  updateAvatar: vi.fn(),
  loginByCode: vi.fn(),
  register: vi.fn(),
  getVerificationCode: vi.fn(),
}))

describe('User Store Module', () => {
  let userStore

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()

    // Clear localStorage
    localStorage.clear()

    // Setup Pinia for testing
    const pinia = createPinia()
    setActivePinia(pinia)

    // Create user store instance
    userStore = useUserStore()
  })

  describe('State Initialization', () => {
    it('should have correct initial state', () => {
      expect(userStore.token).toBe('')
      expect(userStore.userInfo).toBeNull()
      expect(userStore.roles).toEqual([])
      expect(userStore.permissions).toEqual([])
      expect(userStore.isLoading).toBe(false)
      expect(userStore.isAuthenticated).toBe(false)
      expect(userStore.currentUser).toBeNull()
    })

    it('should initialize with token from localStorage', () => {
      // Setup localStorage with a token
      localStorage.setItem('token', 'test-token-from-storage')

      // Create a new store instance to test initialization
      const newPinia = createPinia()
      setActivePinia(newPinia)
      const newUserStore = useUserStore()

      expect(newUserStore.token).toBe('test-token-from-storage')
      expect(newUserStore.isAuthenticated).toBe(true)
    })
  })

  describe('Auth Actions', () => {
    describe('loginAction', () => {
      it('should login successfully with phone and password', async () => {
        const mockResponse = {
          data: {
            token: 'test-login-token',
          },
        }

        appAuthApi.login.mockResolvedValue(mockResponse)

        // Mock getUserInfo to avoid nested calls
        appAuthApi.getUserInfo.mockResolvedValue({
          data: {
            id: 1,
            username: 'testuser',
            nickname: 'Test User',
            avatar: 'test-avatar.jpg',
            phone: '13800138000',
            roles: ['user'],
            permissions: ['read'],
            createTime: '2023-01-01T00:00:00',
            status: 1,
          },
        })

        const result = await userStore.loginAction('13800138000', 'password123')

        expect(appAuthApi.login).toHaveBeenCalledWith({
          phone: '13800138000',
          password: 'password123',
        })
        expect(userStore.token).toBe('test-login-token')
        expect(localStorage.getItem('token')).toBe('test-login-token')
        expect(userStore.isAuthenticated).toBe(true)
        expect(result).toEqual(mockResponse)
      })

      it('should handle login failure', async () => {
        const error = new Error('登录失败')
        appAuthApi.login.mockRejectedValue(error)

        await expect(userStore.loginAction('13800138000', 'wrongpassword')).rejects.toThrow(
          '登录失败'
        )
        expect(userStore.token).toBe('')
        expect(localStorage.getItem('token')).toBeNull()
        expect(userStore.isAuthenticated).toBe(false)
      })
    })

    describe('getUserInfoAction', () => {
      it('should get user info successfully', async () => {
        // Setup token first
        userStore.token = 'test-token'

        const mockUserInfo = {
          id: 1,
          username: 'testuser',
          nickname: 'Test User',
          avatar: 'test-avatar.jpg',
          phone: '13800138000',
          roles: ['admin', 'user'],
          permissions: ['read', 'write'],
          createTime: '2023-01-01T00:00:00',
          status: 1,
        }

        appAuthApi.getUserInfo.mockResolvedValue({
          data: mockUserInfo,
        })

        const result = await userStore.getUserInfoAction()

        expect(appAuthApi.getUserInfo).toHaveBeenCalled()
        expect(userStore.userInfo).toEqual(mockUserInfo)
        expect(userStore.roles).toEqual(['admin', 'user'])
        expect(userStore.permissions).toEqual(['read', 'write'])
        expect(userStore.currentUser).toEqual(mockUserInfo)
        expect(result).toEqual({ data: mockUserInfo })
      })

      it('should handle get user info failure', async () => {
        // Setup token first
        userStore.token = 'test-token'

        const error = new Error('获取用户信息失败')
        appAuthApi.getUserInfo.mockRejectedValue(error)

        await expect(userStore.getUserInfoAction()).rejects.toThrow('获取用户信息失败')

        // Check if state was cleared
        expect(userStore.token).toBe('')
        expect(userStore.userInfo).toBeNull()
        expect(userStore.roles).toEqual([])
        expect(userStore.permissions).toEqual([])
      })
    })

    describe('logoutAction', () => {
      it('should logout successfully', async () => {
        // Setup initial state
        userStore.token = 'test-token'
        userStore.userInfo = {
          id: 1,
          username: 'testuser',
          nickname: 'Test User',
          avatar: 'test-avatar.jpg',
          phone: '13800138000',
          roles: ['admin'],
          permissions: ['read', 'write'],
          createTime: '2023-01-01T00:00:00',
          status: 1,
        }
        userStore.roles = ['admin']
        userStore.permissions = ['read', 'write']

        appAuthApi.logout.mockResolvedValue({})

        await userStore.logoutAction()

        expect(appAuthApi.logout).toHaveBeenCalled()
        expect(userStore.token).toBe('')
        expect(userStore.userInfo).toBeNull()
        expect(userStore.roles).toEqual([])
        expect(userStore.permissions).toEqual([])
        expect(localStorage.getItem('token')).toBeNull()
        expect(userStore.isAuthenticated).toBe(false)
      })

      it('should handle logout API failure gracefully', async () => {
        // Setup initial state
        userStore.token = 'test-token'
        userStore.userInfo = {
          id: 1,
          username: 'testuser',
          nickname: 'Test User',
          avatar: 'test-avatar.jpg',
          phone: '13800138000',
          roles: ['admin'],
          permissions: ['read', 'write'],
          createTime: '2023-01-01T00:00:00',
          status: 1,
        }

        appAuthApi.logout.mockRejectedValue(new Error('登出失败'))

        await userStore.logoutAction()

        // Should still clear local state even if API fails
        expect(userStore.token).toBe('')
        expect(userStore.userInfo).toBeNull()
        expect(userStore.roles).toEqual([])
        expect(userStore.permissions).toEqual([])
        expect(localStorage.getItem('token')).toBeNull()
      })
    })
  })

  describe('Computed Properties', () => {
    it('should return correct isAuthenticated value', () => {
      // When no token, should be false
      expect(userStore.isAuthenticated).toBe(false)

      // When token exists, should be true
      userStore.token = 'test-token'
      expect(userStore.isAuthenticated).toBe(true)
    })

    it('should return currentUser correctly', () => {
      // When no user info, should be null
      expect(userStore.currentUser).toBeNull()

      // When user info exists, should return it
      const mockUserInfo = {
        id: 1,
        username: 'testuser',
        nickname: 'Test User',
        avatar: 'test-avatar.jpg',
        phone: '13800138000',
        roles: ['user'],
        permissions: ['read'],
        createTime: '2023-01-01T00:00:00',
        status: 1,
      }
      userStore.userInfo = mockUserInfo
      expect(userStore.currentUser).toEqual(mockUserInfo)
    })

    it('should check roles correctly with hasRole', () => {
      userStore.roles = ['admin', 'user']

      expect(userStore.hasRole('admin')).toBe(true)
      expect(userStore.hasRole('user')).toBe(true)
      expect(userStore.hasRole('guest')).toBe(false)
    })

    it('should check permissions correctly with hasPermission', () => {
      userStore.permissions = ['read', 'write']

      expect(userStore.hasPermission('read')).toBe(true)
      expect(userStore.hasPermission('write')).toBe(true)
      expect(userStore.hasPermission('delete')).toBe(false)
    })
  })

  describe('Helper Methods', () => {
    it('should reset state correctly', () => {
      // Setup initial state
      userStore.token = 'test-token'
      userStore.userInfo = {
        id: 1,
        username: 'testuser',
        nickname: 'Test User',
        avatar: 'test-avatar.jpg',
        phone: '13800138000',
        roles: ['admin'],
        permissions: ['read', 'write'],
        createTime: '2023-01-01T00:00:00',
        status: 1,
      }
      userStore.roles = ['admin']
      userStore.permissions = ['read', 'write']

      // Reset state
      userStore.resetState()

      // Check that all state is reset
      expect(userStore.token).toBe('')
      expect(userStore.userInfo).toBeNull()
      expect(userStore.roles).toEqual([])
      expect(userStore.permissions).toEqual([])
      expect(localStorage.getItem('token')).toBeNull()
    })
  })
})
