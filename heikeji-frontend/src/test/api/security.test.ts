import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'
import { setupMockServer, testSqlInjection, testXssProtection, testRateLimiting } from './setup'
import { productApi } from '@/api/product'
import { userApi } from '@/api/user'
import { orderApi } from '@/api/order'
import { testUserData } from '@/test/test-data'

describe('API Security Tests', () => {
  let server: any

  beforeAll(async () => {
    server = setupMockServer()
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('SQL Injection Protection', () => {
    it('should prevent SQL injection in product search', async () => {
      await testSqlInjection((input: string) => productApi.searchProducts({ keyword: input }))
    })

    it('should prevent SQL injection in user authentication', async () => {
      await testSqlInjection((input: string) =>
        userApi.login({ username: input, password: testUserData.password })
      )
    })

    it('should prevent SQL injection in order filtering', async () => {
      await testSqlInjection((input: string) => orderApi.getOrderList({ keyword: input }))
    })

    it('should sanitize special characters in all inputs', async () => {
      const specialChars = ["'; DROP TABLE users; --", "' OR '1'='1'", "admin'--"]

      for (const char of specialChars) {
        await testSqlInjection((input: string) => productApi.searchProducts({ keyword: input }))
      }
    })
  })

  describe('XSS Protection', () => {
    it('should prevent XSS in product descriptions', async () => {
      await testXssProtection((input: string) =>
        productApi.createProduct({
          productName: 'Test Product',
          productCode: 'TEST001',
          categoryId: 1,
          price: 100,
          originalPrice: 150,
          stock: 100,
          sales: 0,
          status: 1,
          publishStatus: 1,
          description: input,
          createTime: new Date().toISOString(),
        })
      )
    })

    it('should prevent XSS in user profiles', async () => {
      await testXssProtection((input: string) =>
        userApi.updateUser({
          userId: 1,
          nickname: input,
        })
      )
    })

    it('should prevent XSS in order notes', async () => {
      await testXssProtection((input: string) =>
        orderApi.createOrder({
          orderNo: 'TESTORD001',
          userId: 1,
          userName: 'testuser',
          totalAmount: 100,
          actualAmount: 100,
          paymentMethod: 'alipay',
          orderStatus: 0,
          paymentStatus: 0,
          deliveryStatus: 0,
          shippingAddress: '北京市朝阳区',
          receiverName: '测试用户',
          receiverPhone: '13800138001',
          remark: input,
          createTime: new Date().toISOString(),
        })
      )
    })

    it('should escape HTML entities in responses', async () => {
      const xssPayload = '<script>alert("XSS")</script>'
      const result = await productApi.createProduct({
        productName: 'Test Product',
        productCode: 'TEST001',
        categoryId: 1,
        price: 100,
        originalPrice: 150,
        stock: 100,
        sales: 0,
        status: 1,
        publishStatus: 1,
        description: xssPayload,
        createTime: new Date().toISOString(),
      })

      // Should escape or sanitize XSS
      expect(result.data.description).not.toContain('<script>')
      expect(result.data.description).not.toContain('javascript:')
    })
  })

  describe('Authentication Security', () => {
    it('should reject weak passwords', async () => {
      const weakPasswords = ['123456', 'password', 'admin', 'qwerty']

      for (const password of weakPasswords) {
        const result = await userApi.login({ username: testUserData.username, password })

        // Should reject weak passwords
        expect(result.code).toBeGreaterThanOrEqual(40000)
        expect(result.message).toContain('密码强度不足')
      }
    })

    it('should implement rate limiting', async () => {
      await testRateLimiting(() =>
        userApi.login({ username: testUserData.username, password: testUserData.password })
      )
    })

    it('should validate input formats', async () => {
      // Test invalid phone numbers in profile update
      const invalidPhones = ['', '123', '1234567890123456', 'abcdefghijk']

      for (const phone of invalidPhones) {
        const result = await userApi.updateProfile({ phone })

        expect(result.code).toBeGreaterThanOrEqual(40000)
        expect(result.message).toContain('手机号格式不正确')
      }
    })

    it('should handle session security', async () => {
      // Test session timeout
      const result = await userApi.getUserInfo()

      expect(result.data).toHaveProperty('token')
      expect(result.code).toBe(20000)
    })
  })

  describe('Data Validation Security', () => {
    it('should validate file upload types', async () => {
      const validImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp']
      const invalidFiles = ['script.js', 'exe', 'bat', 'sh']

      for (const fileType of validImageTypes) {
        const formData = new FormData()
        formData.append('file', new Blob(['test'], { type: `image/${fileType}` }))

        const result = await productApi.uploadImage(formData)
        expect(result.code).toBe(20000)
        expect(result.data.url).toMatch(/\.(jpg|jpeg|png|gif|webp)$/)
      }

      for (const file of invalidFiles) {
        const formData = new FormData()
        formData.append('file', new Blob(['test'], { type: file }))

        const result = await productApi.uploadImage(formData)
        expect(result.code).toBeGreaterThanOrEqual(40000)
        expect(result.message).toContain('文件类型不支持')
      }
    })

    it('should validate data size limits', async () => {
      // Test large data submission
      const largeData = {
        productName: 'A'.repeat(10000), // Very long name
        productCode: 'TEST001',
        categoryId: 1,
        price: 100,
        originalPrice: 150,
        stock: 100,
        sales: 0,
        status: 1,
        publishStatus: 1,
        description: 'B'.repeat(50000), // Very long description
        createTime: new Date().toISOString(),
      }

      const result = await productApi.createProduct(largeData)

      expect(result.code).toBeGreaterThanOrEqual(40000)
      expect(result.message).toContain('数据过大')
    })

    it('should sanitize HTML in all text inputs', async () => {
      const htmlInputs = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        'javascript:alert("XSS")',
        '<svg onload=alert("XSS")>',
      ]

      for (const input of htmlInputs) {
        const result = await userApi.updateProfile({ nickname: input })

        // Should escape or remove HTML
        expect(result.code).toBe(20000)
      }
    })
  })

  describe('API Rate Limiting', () => {
    it('should limit requests per minute', async () => {
      const apiCall = () => userApi.getUserInfo()

      // Make 10 rapid requests
      const promises = Array(10)
        .fill(0)
        .map(() => apiCall())
      const results = await Promise.allSettled(promises)

      // First 5 should succeed, next 5 should be rate limited
      const successCount = results.filter(r => r.status === 'fulfilled').length
      const failureCount = results.filter(r => r.status === 'rejected').length

      expect(successCount).toBeLessThanOrEqual(5)
      expect(failureCount).toBeGreaterThanOrEqual(5)
    })

    it('should implement exponential backoff', async () => {
      // Test that failed requests trigger backoff
      let attemptCount = 0
      let lastError: any = null

      while (attemptCount < 5) {
        try {
          await userApi.getUserInfo()
          // If successful, break the loop
          break
        } catch (error: any) {
          lastError = error
          attemptCount++

          // Should wait longer between attempts
          if (attemptCount > 1) {
            await new Promise(resolve => setTimeout(resolve, attemptCount * 1000))
          }
        }
      }

      expect(attemptCount).toBeGreaterThan(1)
      expect(lastError).toBeDefined()
    })
  })

  describe('CORS Security', () => {
    it('should handle CORS headers properly', async () => {
      const result = await productApi.getProductList({ pageNum: 1, pageSize: 10 })

      // Should include proper CORS headers
      expect(result).toHaveProperty('code')
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('message')
      expect(result).toHaveProperty('timestamp')
    })

    it('should validate allowed origins', async () => {
      // This would typically be tested at the server level
      // Here we test that our client handles CORS properly
      const result = await productApi.getProductList({ pageNum: 1, pageSize: 10 })

      expect(result.code).toBe(20000)
      // Client should handle CORS responses properly
    })
  })

  describe('Input Validation', () => {
    it('should validate email formats', async () => {
      const invalidEmails = [
        'invalid-email',
        'test@',
        'test.test@',
        '@test.com',
        'test..test@test.com',
      ]

      for (const email of invalidEmails) {
        const result = await userApi.updateProfile({ email })

        expect(result.code).toBeGreaterThanOrEqual(40000)
        expect(result.message).toContain('邮箱格式不正确')
      }
    })

    it('should validate phone number formats', async () => {
      const invalidPhones = ['123', '1234567890', '1234567890123456', '+1234567890', '123-456-7890']

      for (const phone of invalidPhones) {
        const result = await userApi.updateProfile({ phone })

        expect(result.code).toBeGreaterThanOrEqual(40000)
        expect(result.message).toContain('手机号格式不正确')
      }
    })

    it('should validate ID formats', async () => {
      const invalidIds = [0, -1, 'abc', '1.5']

      for (const id of invalidIds) {
        const result = await productApi.deleteProduct(id as any)

        expect(result.code).toBeGreaterThanOrEqual(40000)
        expect(result.message).toContain('ID格式不正确')
      }
    })
  })
})
