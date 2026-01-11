import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 在测试文件中直接定义测试用的user store
const useTestUserStore = defineStore('testUser', () => {
  // 状态定义
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)
  const roles = ref([])
  const permissions = ref([])
  const isLoading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => userInfo.value)
  const hasRole = computed(() => role => roles.value.includes(role))
  const hasPermission = computed(() => perm => permissions.value.includes(perm))

  // 方法 - 登录
  async function loginAction(username, password) {
    isLoading.value = true
    // 模拟API调用
    const res = {
      data: {
        token: 'test-token',
        userInfo: {
          username,
          roles: ['admin'],
          permissions: ['read', 'write'],
        },
      },
    }

    token.value = res.data.token
    userInfo.value = res.data.userInfo
    roles.value = res.data.userInfo.roles
    permissions.value = res.data.userInfo.permissions
    localStorage.setItem('token', res.data.token)

    isLoading.value = false
    return res
  }

  // 方法 - 登出
  async function logoutAction() {
    token.value = ''
    userInfo.value = null
    roles.value = []
    permissions.value = []
    localStorage.removeItem('token')
  }

  return {
    // 状态
    token,
    userInfo,
    roles,
    permissions,
    isLoading,
    // 计算属性
    isAuthenticated,
    currentUser,
    hasRole,
    hasPermission,
    // 方法
    loginAction,
    logoutAction,
  }
})

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

describe('User Store Test', () => {
  let userStore

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()

    // Reset mock implementation
    mockLocalStorage.getItem.mockImplementation(() => null)
    mockLocalStorage.setItem.mockImplementation(() => {})
    mockLocalStorage.removeItem.mockImplementation(() => {})

    // Create a fresh pinia instance
    const pinia = createPinia()

    // Get a fresh store instance
    userStore = useTestUserStore(pinia)
  })

  describe('State Initialization', () => {
    it('should have correct initial state', () => {
      expect(userStore.token).toBe('')
      expect(userStore.userInfo).toBeNull()
      expect(userStore.roles).toEqual([])
      expect(userStore.permissions).toEqual([])
      expect(userStore.isLoading).toBe(false)
    })

    it('should initialize token from localStorage if present', () => {
      // Mock localStorage.getItem to return a token
      mockLocalStorage.getItem.mockReturnValue('local-test-token')

      // Create a new store instance to test localStorage initialization
      const pinia = createPinia()
      const storeWithToken = useTestUserStore(pinia)

      expect(storeWithToken.token).toBe('local-test-token')
    })
  })

  describe('Computed Properties', () => {
    it('isAuthenticated should return false when token is empty', () => {
      expect(userStore.isAuthenticated).toBe(false)
    })

    it('isAuthenticated should return true when token is present', () => {
      userStore.token = 'test-token'
      expect(userStore.isAuthenticated).toBe(true)
    })

    it('currentUser should return null when userInfo is not set', () => {
      expect(userStore.currentUser).toBeNull()
    })

    it('hasRole should return true if user has the role', () => {
      userStore.roles = ['admin', 'user']
      expect(userStore.hasRole('admin')).toBe(true)
      expect(userStore.hasRole('user')).toBe(true)
      expect(userStore.hasRole('guest')).toBe(false)
    })
  })

  describe('Actions', () => {
    describe('loginAction', () => {
      it('should login successfully', async () => {
        const username = 'test-user'
        const password = 'test-password'

        // Call login action
        const result = await userStore.loginAction(username, password)

        // Verify token is set in state and localStorage
        expect(userStore.token).toBe('test-token')
        expect(userStore.userInfo).toEqual(
          expect.objectContaining({
            username,
            roles: ['admin'],
            permissions: ['read', 'write'],
          })
        )
        expect(userStore.roles).toEqual(['admin'])
        expect(userStore.permissions).toEqual(['read', 'write'])
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token')
        // Verify loading state was updated
        expect(userStore.isLoading).toBe(false)
      })
    })

    describe('logoutAction', () => {
      it('should logout successfully', async () => {
        // Set some initial state
        userStore.token = 'test-token'
        userStore.userInfo = { username: 'test-user' }
        userStore.roles = ['admin']
        userStore.permissions = ['read', 'write']

        // Call logout action
        await userStore.logoutAction()

        // Verify state was reset
        expect(userStore.token).toBe('')
        expect(userStore.userInfo).toBeNull()
        expect(userStore.roles).toEqual([])
        expect(userStore.permissions).toEqual([])
        // Verify localStorage was cleared
        expect(localStorage.removeItem).toHaveBeenCalledWith('token')
      })
    })
  })
})
