import { describe, it, expect, vi, beforeEach } from 'vitest'
import { testUserData } from '@/config/test'

vi.mock('@/utils/request', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ code: 20000, data: {} })),
    post: vi.fn(() => Promise.resolve({ code: 20000, data: {} })),
    put: vi.fn(() => Promise.resolve({ code: 20000, data: {} })),
    delete: vi.fn(() => Promise.resolve({ code: 20000, data: {} })),
    upload: vi.fn(() => Promise.resolve({ code: 20000, data: {} })),
  },
}))

import request from '@/utils/request'
import { userApi } from '@/api/user'

describe('User API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call login API correctly', async () => {
    const mockData = {
      username: 'testuser',
      password: testUserData.password
    }
    const mockResponse = { code: 20000, data: { token: testUserData.token } }
    ;(request.post as any).mockResolvedValue(mockResponse)
    
    const result = await userApi.login(mockData)
    expect(request.post).toHaveBeenCalledWith('/api/login', mockData)
    expect(result).toEqual(mockResponse)
  })

  it('should call logout API correctly', async () => {
    const mockResponse = { code: 20000, data: { success: true } }
    ;(request.post as any).mockResolvedValue(mockResponse)
    
    const result = await userApi.logout()
    expect(request.post).toHaveBeenCalledWith('/api/logout')
    expect(result).toEqual(mockResponse)
  })

  it('should call getUserInfo API correctly', async () => {
    const mockResponse = { code: 20000, data: { userId: 1, username: 'testuser' } }
    ;(request.get as any).mockResolvedValue(mockResponse)
    
    const result = await userApi.getUserInfo()
    expect(request.get).toHaveBeenCalledWith('/api/user/info')
    expect(result).toEqual(mockResponse)
  })

  it('should call refreshToken API correctly', async () => {
    const mockResponse = { code: 20000, data: { token: testConfig.user.newToken || 'new_test_token_456' } }
    ;(request.post as any).mockResolvedValue(mockResponse)
    
    const result = await userApi.refreshToken()
    expect(request.post).toHaveBeenCalledWith('/api/auth/refresh')
    expect(result).toEqual(mockResponse)
  })

  it('should call getUserList API correctly', async () => {
    const mockParams = { page: 1, pageSize: 10 }
    const mockResponse = { code: 20000, data: { list: [], total: 0 } }
    ;(request.get as any).mockResolvedValue(mockResponse)
    
    const result = await userApi.getUserList(mockParams)
    expect(request.get).toHaveBeenCalledWith('/api/system/user/list', mockParams)
    expect(result).toEqual(mockResponse)
  })

  it('should call createUser API correctly', async () => {
    const mockData = { username: 'newuser', password: testUserData.password }
    const mockResponse = { code: 20000, data: { userId: 2 } }
    ;(request.post as any).mockResolvedValue(mockResponse)
    
    const result = await userApi.createUser(mockData)
    expect(request.post).toHaveBeenCalledWith('/api/system/user', mockData)
    expect(result).toEqual(mockResponse)
  })

  it('should call updateUser API correctly', async () => {
    const mockData = { userId: 1, username: 'updateduser' }
    const mockResponse = { code: 20000, data: { success: true } }
    ;(request.put as any).mockResolvedValue(mockResponse)
    
    const result = await userApi.updateUser(mockData)
    expect(request.put).toHaveBeenCalledWith('/api/system/user', mockData)
    expect(result).toEqual(mockResponse)
  })

  it('should handle login API error', async () => {
    const mockData = { username: 'testuser', password: testConfig.user.wrongPassword || 'wrong_test_password' }
    const mockError = new Error('Invalid credentials')
    ;(request.post as any).mockRejectedValue(mockError)
    
    await expect(userApi.login(mockData)).rejects.toThrow()
  })

  it('should handle getUserInfo API error', async () => {
    const mockError = new Error('Unauthorized')
    ;(request.get as any).mockRejectedValue(mockError)
    
    await expect(userApi.getUserInfo()).rejects.toThrow()
  })
})
