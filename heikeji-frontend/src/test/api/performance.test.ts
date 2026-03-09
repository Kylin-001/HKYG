import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { setupMockServer, measureApiPerformance, createMockProduct } from './setup'
import { productApi } from '@/api/product'
import { userApi } from '@/api/user'
import { orderApi } from '@/api/order'

describe('API Performance Tests', () => {
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

  describe('Product API Performance', () => {
    it('should handle concurrent product list requests efficiently', async () => {
      const apiCall = () => productApi.getProductList({ page: 1, pageSize: 10 })
      const performance = await measureApiPerformance(apiCall, 5)
      
      expect(performance.avgTime).toBeLessThan(100) // Average response time should be less than 100ms
      expect(performance.maxTime).toBeLessThan(200) // Max response time should be less than 200ms
      expect(performance.times.every(time => time < 150)).toBe(true) // All requests should be under 150ms
    })

    it('should handle large data requests efficiently', async () => {
      const apiCall = () => productApi.getProductList({ page: 1, pageSize: 100 })
      const performance = await measureApiPerformance(apiCall, 3)
      
      expect(performance.avgTime).toBeLessThan(500) // Should handle large data efficiently
      expect(performance.maxTime).toBeLessThan(1000) // Max time should be reasonable
    })

    it('should maintain consistent response times', async () => {
      const apiCall = () => productApi.getProductDetail(1)
      const performance1 = await measureApiPerformance(apiCall, 5)
      const performance2 = await measureApiPerformance(apiCall, 5)
      
      // Response times should be consistent
      const variance = performance.times.reduce((sum, time) => {
        const diff = time - performance.avgTime
        return sum + diff * diff
      }, 0) / performance.times.length
      
      expect(variance).toBeLessThan(100) // Low variance indicates consistency
    })

    it('should handle API timeouts gracefully', async () => {
      // Mock a slow API call
      vi.spyOn(productApi, 'getProductList').mockImplementationOnce(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve({
            code: 20000,
            data: { records: [createMockProduct()] },
            message: '获取商品列表成功',
            timestamp: Date.now(),
          }), 5000) // 5 second timeout
        })
      })

      const startTime = Date.now()
      const result = await productApi.getProductList({ page: 1, pageSize: 10 })
      const endTime = Date.now()
      
      expect(endTime - startTime).toBeGreaterThan(5000) // Should take at least 5 seconds
      expect(result.code).toBe(20000)
    })
  })

  describe('User API Performance', () => {
    it('should handle concurrent user info requests efficiently', async () => {
      const apiCall = () => userApi.getUserInfo()
      const performance = await measureApiPerformance(apiCall, 10)
      
      expect(performance.avgTime).toBeLessThan(50) // User info should be very fast
      expect(performance.times.every(time => time < 100)).toBe(true) // All requests under 100ms
    })

    it('should handle authentication requests efficiently', async () => {
      const apiCall = () => userApi.login({ phone: testUserData.phone, password: testUserData.password })
      const performance = await measureApiPerformance(apiCall, 5)
      
      expect(performance.avgTime).toBeLessThan(200) // Auth should be fast but secure
      expect(performance.maxTime).toBeLessThan(500) // Max time should be reasonable
    })

    it('should cache user info requests', async () => {
      // Test caching behavior by calling same API multiple times
      const apiCall = () => userApi.getUserInfo()
      
      // First call
      const performance1 = await measureApiPerformance(apiCall, 3)
      
      // Second call (should be faster due to caching)
      const performance2 = await measureApiPerformance(apiCall, 3)
      
      expect(performance2.avgTime).toBeLessThan(performance1.avgTime * 0.8) // Second call should be faster
    })
  })

  describe('Order API Performance', () => {
    it('should handle order list pagination efficiently', async () => {
      const testPages = [1, 2, 3, 4, 5]
      const performances = []
      
      for (const page of testPages) {
        const apiCall = () => orderApi.getOrderList({ page, pageSize: 10 })
        const performance = await measureApiPerformance(apiCall, 3)
        performances.push(performance)
      }
      
      // Performance should be consistent across pages
      const avgTimes = performances.map(p => p.avgTime)
      const maxVariance = Math.max(...avgTimes.map(time => time => time * time))
      
      expect(maxVariance).toBeLessThan(1000) // Performance should be consistent
    })

    it('should handle order creation efficiently', async () => {
      const orderData = {
        items: Array(50).fill(0).map((_, index) => ({
          name: `商品${index + 1}`,
          price: Math.floor(Math.random() * 100) + 10,
          quantity: Math.floor(Math.random() * 5) + 1,
          total: 0,
        })),
        customerInfo: {
          name: '测试用户',
          phone: testUserData.phone,
          address: '北京市朝阳区测试地址',
        },
      }
      
      const apiCall = () => orderApi.createOrder(orderData)
      const performance = await measureApiPerformance(apiCall, 5)
      
      expect(performance.avgTime).toBeLessThan(1000) // Should handle large orders efficiently
      expect(performance.maxTime).toBeLessThan(2000) // Max time should be reasonable
    })
  })

  describe('Load Testing', () => {
    it('should handle 100 concurrent requests', async () => {
      const apiCall = () => productApi.getProductList({ page: 1, pageSize: 10 })
      
      const startTime = Date.now()
      const promises = Array(100).fill(0).map(() => apiCall())
      await Promise.all(promises)
      const endTime = Date.now()
      
      expect(endTime - startTime).toBeLessThan(10000) // Should complete within 10 seconds
    })

    it('should handle memory usage during load testing', async () => {
      const initialMemory = process.memoryUsage()
      
      const apiCall = () => productApi.getProductList({ page: 1, pageSize: 100 })
      
      // Make multiple calls to test memory usage
      for (let i = 0; i < 50; i++) {
        await apiCall()
      }
      
      const finalMemory = process.memoryUsage()
      
      // Memory usage should not increase significantly
      expect(finalMemory.heapUsed - initialMemory.heapUsed).toBeLessThan(50 * 1024 * 1024) // Less than 50MB increase
    })
  })

  describe('API Response Time Analysis', () => {
    it('should analyze response time patterns', async () => {
      const responseTimes = []
      
      // Collect response times for different operations
      const operations = [
        () => productApi.getProductList({ page: 1, pageSize: 10 }),
        () => productApi.getProductDetail(1),
        () => productApi.createProduct(createMockProduct()),
        () => userApi.getUserInfo(),
        () => orderApi.getOrderList({ page: 1, pageSize: 10 }),
      ]
      
      for (const operation of operations) {
        const startTime = performance.now()
        await operation()
        const endTime = performance.now()
        responseTimes.push(endTime - startTime)
      }
      
      // Analyze patterns
      const avgTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      const maxTime = Math.max(...responseTimes)
      const minTime = Math.min(...responseTimes)
      
      // List operations should be fastest
      expect(responseTimes[0]).toBeLessThan(avgTime)
      
      // Create operations should be slower than list operations
      expect(responseTimes[2]).toBeGreaterThan(avgTime)
      
      // Response times should be reasonable
      expect(maxTime).toBeLessThan(5000) // Max 5 seconds
      expect(minTime).toBeGreaterThan(10) // Min 10ms
    })
  })
})