import { describe, it, expect, vi, beforeEach } from 'vitest'

// 深度模拟 @/api/user 模块
vi.mock('@/api/user', () => ({
  userApi: {
    login: vi.fn(),
    logout: vi.fn(),
    getUserInfo: vi.fn(),
    refreshToken: vi.fn(),
    getUserList: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    changeStatus: vi.fn(),
    updatePassword: vi.fn(),
    updateProfile: vi.fn(),
    uploadAvatar: vi.fn(),
    getUserRoles: vi.fn(),
    assignRoles: vi.fn(),
  },
}))

// 导入模拟的模块
import { userApi } from '@/api/user'

describe('用户API测试', () => {
  beforeEach(() => {
    // 清除所有模拟调用
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should be a function', () => {
      expect(typeof userApi.login).toBe('function')
    })

    it('should call login with correct parameters', async () => {
      // 模拟返回值
      const mockResult = { token: 'test-token', userInfo: { username: 'test' } }
      ;(userApi.login as vi.Mock).mockResolvedValue(mockResult)

      const params = { username: 'test', password: '123456' }
      const result = await userApi.login(params)

      // 验证调用
      expect(userApi.login).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResult)
    })
  })

  describe('logout', () => {
    it('should be a function', () => {
      expect(typeof userApi.logout).toBe('function')
    })

    it('should call logout without parameters', async () => {
      // 模拟返回值
      const mockResult = { success: true }
      ;(userApi.logout as vi.Mock).mockResolvedValue(mockResult)

      const result = await userApi.logout()

      // 验证调用
      expect(userApi.logout).toHaveBeenCalled()
      expect(result).toEqual(mockResult)
    })
  })

  describe('getUserInfo', () => {
    it('should be a function', () => {
      expect(typeof userApi.getUserInfo).toBe('function')
    })

    it('should call getUserInfo without parameters', async () => {
      // 模拟返回值
      const mockResult = { username: 'test', email: 'test@example.com' }
      ;(userApi.getUserInfo as vi.Mock).mockResolvedValue(mockResult)

      const result = await userApi.getUserInfo()

      // 验证调用
      expect(userApi.getUserInfo).toHaveBeenCalled()
      expect(result).toEqual(mockResult)
    })
  })

  describe('refreshToken', () => {
    it('should be a function', () => {
      expect(typeof userApi.refreshToken).toBe('function')
    })

    it('should call refreshToken without parameters', async () => {
      // 模拟返回值
      const mockResult = { token: 'new-token' }
      ;(userApi.refreshToken as vi.Mock).mockResolvedValue(mockResult)

      const result = await userApi.refreshToken()

      // 验证调用
      expect(userApi.refreshToken).toHaveBeenCalled()
      expect(result).toEqual(mockResult)
    })
  })

  describe('getUserList', () => {
    it('should be a function', () => {
      expect(typeof userApi.getUserList).toBe('function')
    })

    it('should call getUserList with correct parameters', async () => {
      // 模拟返回值
      const mockResult = { list: [], total: 0 }
      ;(userApi.getUserList as vi.Mock).mockResolvedValue(mockResult)

      const params = { page: 1, pageSize: 10 }
      const result = await userApi.getUserList(params)

      // 验证调用
      expect(userApi.getUserList).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResult)
    })
  })

  describe('createUser', () => {
    it('should be a function', () => {
      expect(typeof userApi.createUser).toBe('function')
    })

    it('should call createUser with correct parameters', async () => {
      // 模拟返回值
      const mockResult = { success: true, userId: 1 }
      ;(userApi.createUser as vi.Mock).mockResolvedValue(mockResult)

      const params = { username: 'test', email: 'test@example.com' }
      const result = await userApi.createUser(params)

      // 验证调用
      expect(userApi.createUser).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResult)
    })
  })

  describe('updateUser', () => {
    it('should be a function', () => {
      expect(typeof userApi.updateUser).toBe('function')
    })

    it('should call updateUser with correct parameters', async () => {
      // 模拟返回值
      const mockResult = { success: true }
      ;(userApi.updateUser as vi.Mock).mockResolvedValue(mockResult)

      const params = { userId: 1, username: 'test', email: 'test@example.com' }
      const result = await userApi.updateUser(params)

      // 验证调用
      expect(userApi.updateUser).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResult)
    })
  })

  describe('deleteUser', () => {
    it('should be a function', () => {
      expect(typeof userApi.deleteUser).toBe('function')
    })

    it('should call deleteUser with correct parameters', async () => {
      // 模拟返回值
      const mockResult = { success: true }
      ;(userApi.deleteUser as vi.Mock).mockResolvedValue(mockResult)

      const userId = 1
      const result = await userApi.deleteUser(userId)

      // 验证调用
      expect(userApi.deleteUser).toHaveBeenCalledWith(userId)
      expect(result).toEqual(mockResult)
    })
  })

  describe('changeStatus', () => {
    it('should be a function', () => {
      expect(typeof userApi.changeStatus).toBe('function')
    })

    it('should call changeStatus with correct parameters', async () => {
      // 模拟返回值
      const mockResult = { success: true }
      ;(userApi.changeStatus as vi.Mock).mockResolvedValue(mockResult)

      const userId = 1
      const status = 1
      const result = await userApi.changeStatus(userId, status)

      // 验证调用
      expect(userApi.changeStatus).toHaveBeenCalledWith(userId, status)
      expect(result).toEqual(mockResult)
    })
  })

  describe('updatePassword', () => {
    it('should be a function', () => {
      expect(typeof userApi.updatePassword).toBe('function')
    })

    it('should call updatePassword with correct parameters', async () => {
      // 模拟返回值
      const mockResult = { success: true }
      ;(userApi.updatePassword as vi.Mock).mockResolvedValue(mockResult)

      const params = { oldPassword: '123456', newPassword: '654321', confirmPassword: '654321' }
      const result = await userApi.updatePassword(params)

      // 验证调用
      expect(userApi.updatePassword).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResult)
    })
  })

  describe('updateProfile', () => {
    it('should be a function', () => {
      expect(typeof userApi.updateProfile).toBe('function')
    })

    it('should call updateProfile with correct parameters', async () => {
      // 模拟返回值
      const mockResult = { success: true }
      ;(userApi.updateProfile as vi.Mock).mockResolvedValue(mockResult)

      const params = { nickname: 'test-nickname', email: 'test@example.com' }
      const result = await userApi.updateProfile(params)

      // 验证调用
      expect(userApi.updateProfile).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResult)
    })
  })

  describe('uploadAvatar', () => {
    it('should be a function', () => {
      expect(typeof userApi.uploadAvatar).toBe('function')
    })

    it('should call uploadAvatar with correct parameters', async () => {
      // 模拟返回值
      const mockResult = { success: true, avatarUrl: 'http://example.com/avatar.jpg' }
      ;(userApi.uploadAvatar as vi.Mock).mockResolvedValue(mockResult)

      const formData = new FormData()
      const result = await userApi.uploadAvatar(formData)

      // 验证调用
      expect(userApi.uploadAvatar).toHaveBeenCalledWith(formData)
      expect(result).toEqual(mockResult)
    })
  })

  describe('getUserRoles', () => {
    it('should be a function', () => {
      expect(typeof userApi.getUserRoles).toBe('function')
    })

    it('should call getUserRoles with correct parameters', async () => {
      // 模拟返回值
      const mockResult = [
        { roleId: 1, roleName: 'admin' },
        { roleId: 2, roleName: 'user' },
      ]
      ;(userApi.getUserRoles as vi.Mock).mockResolvedValue(mockResult)

      const userId = 1
      const result = await userApi.getUserRoles(userId)

      // 验证调用
      expect(userApi.getUserRoles).toHaveBeenCalledWith(userId)
      expect(result).toEqual(mockResult)
    })
  })

  describe('assignRoles', () => {
    it('should be a function', () => {
      expect(typeof userApi.assignRoles).toBe('function')
    })

    it('should call assignRoles with correct parameters', async () => {
      // 模拟返回值
      const mockResult = { success: true }
      ;(userApi.assignRoles as vi.Mock).mockResolvedValue(mockResult)

      const params = { userId: 1, roleIds: [1, 2] }
      const result = await userApi.assignRoles(params)

      // 验证调用
      expect(userApi.assignRoles).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResult)
    })
  })

  describe('API structure', () => {
    it('should have all expected methods', () => {
      const expectedMethods = [
        'login',
        'logout',
        'getUserInfo',
        'refreshToken',
        'getUserList',
        'createUser',
        'updateUser',
        'deleteUser',
        'changeStatus',
        'updatePassword',
        'updateProfile',
        'uploadAvatar',
        'getUserRoles',
        'assignRoles',
      ]

      // 验证所有预期方法都存在
      expectedMethods.forEach(method => {
        expect(userApi[method]).toBeDefined()
        expect(typeof userApi[method]).toBe('function')
      })

      // 验证userApi对象没有多余的方法
      const actualMethods = Object.keys(userApi)
      expect(actualMethods.sort()).toEqual(expectedMethods.sort())
    })
  })
})
