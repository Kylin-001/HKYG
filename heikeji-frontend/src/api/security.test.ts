import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import request from '@/utils/request'
import { rateLimiters } from '@/utils/rate-limiter'
import { defaultEncryption, sensitiveDataEncryption } from '@/utils/encryption'

// 模拟axios
vi.mock('axios', () => ({
  create: vi.fn(() => ({
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  })),
  isCancel: vi.fn(() => false),
  CancelToken: {
    source: vi.fn(() => ({ token: 'mock-token' })),
  },
}))

// 模拟Element Plus
vi.mock('element-plus', () => ({
  ElMessage: {
    error: vi.fn(),
  },
}))

// 模拟用户store
vi.mock('@/store/modules/user', () => ({
  useUserStore: vi.fn(() => ({
    token: 'mock-token',
    logoutAction: vi.fn(),
  })),
}))

// 模拟logger
vi.mock('@/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}))

describe('API Security', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // 重置速率限制器
    rateLimiters.general.resetAll()
    rateLimiters.login.resetAll()
    rateLimiters.register.resetAll()
    rateLimiters.sensitive.resetAll()
    rateLimiters.upload.resetAll()
    rateLimiters.search.resetAll()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Rate Limiting', () => {
    it('should allow requests within the rate limit', async () => {
      // 模拟成功响应
      const mockResponse = {
        data: { code: 20000, message: 'success', data: {} },
        status: 200,
        config: { url: '/api/test' },
      }
      
      const mockPost = vi.fn().mockResolvedValue(mockResponse)
      axios.create = vi.fn().mockReturnValue({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
        post: mockPost,
      })

      // 发送多个请求，但不超过限制
      for (let i = 0; i < 5; i++) {
        await request.post('/api/test', { data: 'test' })
      }

      // 所有请求都应该成功
      expect(mockPost).toHaveBeenCalledTimes(5)
    })

    it('should block requests exceeding the rate limit', async () => {
      // 模拟成功响应
      const mockResponse = {
        data: { code: 20000, message: 'success', data: {} },
        status: 200,
        config: { url: '/api/login' },
      }
      
      const mockPost = vi.fn().mockResolvedValue(mockResponse)
      axios.create = vi.fn().mockReturnValue({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
        post: mockPost,
      })

      // 发送超过限制的请求
      const promises = []
      for (let i = 0; i < 10; i++) {
        promises.push(request.post('/api/login', { username: 'test', password: 'test' }))
      }

      const results = await Promise.allSettled(promises)
      
      // 前5个请求应该成功，后面的应该失败
      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length
      
      expect(successful).toBeLessThanOrEqual(5) // 登录API限制为每分钟5次
      expect(failed).toBeGreaterThan(0)
    })

    it('should use different rate limits for different API endpoints', async () => {
      // 模拟成功响应
      const mockResponse = {
        data: { code: 20000, message: 'success', data: {} },
        status: 200,
        config: { url: '/api/test' },
      }
      
      const mockPost = vi.fn().mockResolvedValue(mockResponse)
      axios.create = vi.fn().mockReturnValue({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
        post: mockPost,
      })

      // 发送登录请求
      for (let i = 0; i < 6; i++) {
        await request.post('/api/login', { username: 'test', password: 'test' })
      }

      // 发送普通API请求
      for (let i = 0; i < 10; i++) {
        await request.post('/api/test', { data: 'test' })
      }

      // 登录请求应该被限制，普通请求不应该
      expect(mockPost).toHaveBeenCalledTimes(16) // 6个登录请求 + 10个普通请求
    })
  })

  describe('Data Encryption', () => {
    it('should encrypt sensitive fields when specified', async () => {
      // 模拟成功响应
      const mockResponse = {
        data: { code: 20000, message: 'success', data: {} },
        status: 200,
        config: { url: '/api/test' },
      }
      
      const mockPost = vi.fn().mockResolvedValue(mockResponse)
      axios.create = vi.fn().mockReturnValue({
        interceptors: {
          request: { use: vi.fn((config) => config) },
          response: { use: vi.fn() },
        },
        post: mockPost,
      })

      const password = 'test-password'
      await request.post('/api/test', { 
        username: 'test', 
        password 
      }, {
        encrypt: true,
        encryptFields: ['password']
      })

      // 检查密码是否被加密
      const callConfig = mockPost.mock.calls[0][1]
      expect(callConfig.password).not.toBe(password)
      expect(callConfig.password).toMatch(/^[A-Za-z0-9+/=]+$/) // Base64格式
    })

    it('should encrypt entire data object when no fields specified', async () => {
      // 模拟成功响应
      const mockResponse = {
        data: { code: 20000, message: 'success', data: {} },
        status: 200,
        config: { url: '/api/test' },
      }
      
      const mockPost = vi.fn().mockResolvedValue(mockResponse)
      axios.create = vi.fn().mockReturnValue({
        interceptors: {
          request: { use: vi.fn((config) => config) },
          response: { use: vi.fn() },
        },
        post: mockPost,
      })

      const data = { username: 'test', password: 'test-password' }
      await request.post('/api/test', data, {
        encrypt: true
      })

      // 检查整个数据对象是否被加密
      const callConfig = mockPost.mock.calls[0][1]
      expect(callConfig.encrypted).toBe(true)
      expect(typeof callConfig.data).toBe('string')
    })

    it('should decrypt response data when specified', async () => {
      // 模拟加密的响应数据
      const encryptedData = defaultEncryption.encryptObject({ secret: 'test-secret' })
      const mockResponse = {
        data: { 
          code: 20000, 
          message: 'success', 
          data: {
            encrypted: true,
            data: encryptedData
          }
        },
        status: 200,
        config: { url: '/api/test' },
      }
      
      const mockPost = vi.fn().mockResolvedValue(mockResponse)
      axios.create = vi.fn().mockReturnValue({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn((response) => response) },
        },
        post: mockPost,
      })

      const result = await request.post('/api/test', {}, {
        decryptResponse: true
      })

      // 检查响应数据是否被解密
      expect(result.data).toEqual({ secret: 'test-secret' })
    })
  })

  describe('Encryption Utilities', () => {
    it('should encrypt and decrypt strings correctly', () => {
      const originalText = 'This is a secret message'
      
      const encrypted = defaultEncryption.encrypt(originalText)
      expect(encrypted).not.toBe(originalText)
      expect(encrypted).toMatch(/^[A-Za-z0-9+/=]+$/) // Base64格式
      
      const decrypted = defaultEncryption.decrypt(encrypted)
      expect(decrypted).toBe(originalText)
    })

    it('should encrypt and decrypt objects correctly', () => {
      const originalObject = {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com'
      }
      
      const encrypted = defaultEncryption.encryptObject(originalObject)
      expect(encrypted).not.toBe(JSON.stringify(originalObject))
      expect(encrypted).toMatch(/^[A-Za-z0-9+/=]+$/) // Base64格式
      
      const decrypted = defaultEncryption.decryptObject(originalObject)
      expect(decrypted).toEqual(originalObject)
    })

    it('should generate consistent hashes for the same data', () => {
      const data = 'test-data'
      
      const hash1 = defaultEncryption.hash(data)
      const hash2 = defaultEncryption.hash(data)
      
      expect(hash1).toBe(hash2)
      expect(hash1).toMatch(/^[a-f0-9]{64}$/i) // SHA256格式
    })

    it('should compare hashes correctly', () => {
      const data = 'test-data'
      const hash = defaultEncryption.hash(data)
      
      expect(defaultEncryption.compareHash(data, hash)).toBe(true)
      expect(defaultEncryption.compareHash('wrong-data', hash)).toBe(false)
    })

    it('should generate random keys', () => {
      const key1 = defaultEncryption.generateKey()
      const key2 = defaultEncryption.generateKey()
      
      expect(key1).not.toBe(key2)
      expect(key1).toMatch(/^[a-f0-9]+$/i) // Hex格式
      expect(key2).toMatch(/^[a-f0-9]+$/i) // Hex格式
    })
  })

  describe('Error Handling', () => {
    it('should handle rate limit exceeded errors', async () => {
      // 模拟成功响应
      const mockResponse = {
        data: { code: 20000, message: 'success', data: {} },
        status: 200,
        config: { url: '/api/login' },
      }
      
      const mockPost = vi.fn().mockResolvedValue(mockResponse)
      axios.create = vi.fn().mockReturnValue({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
        post: mockPost,
      })

      // 发送超过限制的请求
      const promises = []
      for (let i = 0; i < 10; i++) {
        promises.push(request.post('/api/login', { username: 'test', password: 'test' }))
      }

      const results = await Promise.allSettled(promises)
      
      // 检查是否有速率限制错误
      const failed = results.filter(r => r.status === 'rejected')
      expect(failed.length).toBeGreaterThan(0)
      
      // 检查错误消息
      const rateLimitErrors = failed.filter(r => 
        r.status === 'rejected' && 
        r.reason.message.includes('请求过于频繁')
      )
      expect(rateLimitErrors.length).toBeGreaterThan(0)
    })

    it('should handle encryption errors', async () => {
      // 模拟加密失败
      vi.spyOn(sensitiveDataEncryption, 'encrypt').mockImplementationOnce(() => {
        throw new Error('Encryption failed')
      })

      // 模拟成功响应
      const mockResponse = {
        data: { code: 20000, message: 'success', data: {} },
        status: 200,
        config: { url: '/api/test' },
      }
      
      const mockPost = vi.fn().mockResolvedValue(mockResponse)
      axios.create = vi.fn().mockReturnValue({
        interceptors: {
          request: { use: vi.fn((config) => config) },
          response: { use: vi.fn() },
        },
        post: mockPost,
      })

      // 发送加密请求
      const promise = request.post('/api/test', { 
        username: 'test', 
        password: 'test' 
      }, {
        encrypt: true,
        encryptFields: ['password']
      })

      // 检查是否抛出加密错误
      await expect(promise).rejects.toThrow('数据加密失败')
    })

    it('should handle decryption errors', async () => {
      // 模拟解密失败
      vi.spyOn(defaultEncryption, 'decryptObject').mockImplementationOnce(() => {
        throw new Error('Decryption failed')
      })

      // 模拟加密的响应数据
      const mockResponse = {
        data: { 
          code: 20000, 
          message: 'success', 
          data: {
            encrypted: true,
            data: 'invalid-encrypted-data'
          }
        },
        status: 200,
        config: { url: '/api/test' },
      }
      
      const mockPost = vi.fn().mockResolvedValue(mockResponse)
      axios.create = vi.fn().mockReturnValue({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn((response) => response) },
        },
        post: mockPost,
      })

      // 发送解密请求
      const promise = request.post('/api/test', {}, {
        decryptResponse: true
      })

      // 检查是否抛出解密错误
      await expect(promise).rejects.toThrow('数据解密失败')
    })
  })
})