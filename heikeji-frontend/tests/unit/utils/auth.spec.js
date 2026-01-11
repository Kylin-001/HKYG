import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getToken, setToken, removeToken } from '@/utils/auth.js'
import Cookies from 'js-cookie'

// 模拟 js-cookie 模块
vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('auth.js 工具函数测试', () => {
  beforeEach(() => {
    // 清除所有模拟调用
    vi.clearAllMocks()
  })

  describe('getToken', () => {
    it('should call Cookies.get with TokenKey', () => {
      getToken()
      expect(Cookies.get).toHaveBeenCalledWith('Admin-Token')
    })

    it('should return the value from Cookies.get', () => {
      const mockToken = 'test-token-123'
      Cookies.get.mockReturnValue(mockToken)
      const result = getToken()
      expect(result).toBe(mockToken)
    })
  })

  describe('setToken', () => {
    it('should call Cookies.set with TokenKey and provided token', () => {
      const mockToken = 'new-test-token'
      setToken(mockToken)
      expect(Cookies.set).toHaveBeenCalledWith('Admin-Token', mockToken)
    })

    it('should return the result from Cookies.set', () => {
      const mockResult = 'set-success'
      Cookies.set.mockReturnValue(mockResult)
      const result = setToken('test-token')
      expect(result).toBe(mockResult)
    })
  })

  describe('removeToken', () => {
    it('should call Cookies.remove with TokenKey', () => {
      removeToken()
      expect(Cookies.remove).toHaveBeenCalledWith('Admin-Token')
    })

    it('should return the result from Cookies.remove', () => {
      const mockResult = 'remove-success'
      Cookies.remove.mockReturnValue(mockResult)
      const result = removeToken()
      expect(result).toBe(mockResult)
    })
  })
})
