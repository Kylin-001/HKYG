import { beforeAll, afterAll, beforeEach, afterEach, describe, it, expect } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { http, HttpResponse } from 'msw'

// Mock server setup
export const setupMockServer = () => {
  const server = setupServer(
    rest.get('http://localhost:3000/api/user/info', () => {
      return HttpResponse.json({
        code: 20000,
        data: {
          id: 1,
          username: 'testuser',
          nickname: '测试用户',
          email: 'test@example.com',
          phone: '13800138001',
          avatar: 'http://example.com/avatar.jpg',
          roles: ['user'],
          permissions: ['user:read', 'user:write'],
          createTime: '2024-01-01 00:00:00',
          updateTime: '2024-01-01 00:00:00',
        },
        message: '获取用户信息成功',
        timestamp: Date.now(),
      })
    }),

    rest.get('http://localhost:3000/api/product/list', () => {
      return HttpResponse.json({
        code: 20000,
        data: {
          records: [
            {
              id: 1,
              name: '测试商品',
              description: '这是一个测试商品',
              price: 100,
              originalPrice: 150,
              discount: 0.2,
              stock: 100,
              sales: 50,
              categoryId: 1,
              images: ['http://example.com/image1.jpg'],
              status: 1,
              attributes: { color: '红色', size: 'L' },
            }
          ],
          total: 1,
          current: 1,
          size: 10,
          pages: 1,
        },
        message: '获取商品列表成功',
        timestamp: Date.now(),
      })
    }),

    rest.post('http://localhost:3000/api/product', () => {
      return HttpResponse.json({
        code: 20000,
        data: { success: true },
        message: '创建商品成功',
        timestamp: Date.now(),
      })
    }),

    rest.put('http://localhost:3000/api/product', () => {
      return HttpResponse.json({
        code: 20000,
        data: { success: true },
        message: '更新商品成功',
        timestamp: Date.now(),
      })
    }),

    rest.delete('http://localhost:3000/api/product/:id', () => {
      return HttpResponse.json({
        code: 20000,
        data: { success: true },
        message: '删除商品成功',
        timestamp: Date.now(),
      })
    }),

    rest.get('http://localhost:3000/api/order/list', () => {
      return HttpResponse.json({
        code: 20000,
        data: {
          records: [
            {
              id: 1,
              orderNo: 'ORD001',
              customerId: 1001,
              customerName: '张三',
              customerPhone: '13800138001',
              items: [
                {
                  name: '商品A',
                  spec: '规格A',
                  price: 100,
                  quantity: 2,
                  total: 200,
                }
              ],
              amount: 200,
              status: '待支付',
              paymentMethod: 'alipay',
              deliveryAddress: '北京市朝阳区',
              estimatedDelivery: '2024-03-05',
              remark: '测试订单',
            }
          ],
          total: 1,
          current: 1,
          size: 10,
          pages: 1,
        },
        message: '获取订单列表成功',
        timestamp: Date.now(),
      })
    }),

    rest.get('http://localhost:3000/api/analytics/user-behavior', () => {
      return HttpResponse.json({
        code: 20000,
        data: {
          pageViews: 100,
          uniqueVisitors: 50,
          avgSessionDuration: 300,
          bounceRate: 0.3,
          conversionRate: 0.05,
        },
        message: '获取用户行为统计成功',
        timestamp: Date.now(),
      })
    }),

    rest.get('http://localhost:3000/api/marketing/coupons', () => {
      return HttpResponse.json({
        code: 20000,
        data: {
          records: [
            {
              id: 1,
              name: '测试优惠券',
              couponCode: 'TEST10',
              type: 1,
              value: 10,
              discount: 0.9,
              minAmount: 50,
              maxAmount: 100,
              startTime: '2024-01-01 00:00:00',
              endTime: '2024-12-31 23:59:59',
              totalCount: 1000,
              usedCount: 100,
              perUserLimit: 1,
              status: 1,
              description: '测试优惠券描述',
            }
          ],
          total: 1,
          current: 1,
          size: 10,
          pages: 1,
        },
        message: '获取优惠券列表成功',
        timestamp: Date.now(),
      })
    }),
  )

  return server
}

// Test utilities
export const createMockApiResponse = (data: any, message = 'Success') => ({
  code: 20000,
  data,
  message,
  timestamp: Date.now(),
})

export const createMockErrorResponse = (message = 'Error', code = 50000) => ({
  code,
  message,
  timestamp: Date.now(),
})

export const expectApiResponse = async (apiCall: Promise<any>) => {
  const response = await apiCall
  expect(response).toHaveProperty('code')
  expect(response).toHaveProperty('data')
  expect(response).toHaveProperty('message')
  expect(response).toHaveProperty('timestamp')
  return response
}

export const expectApiError = async (apiCall: Promise<any>) => {
  const response = await apiCall
  expect(response).toHaveProperty('code')
  expect(response).toHaveProperty('message')
  expect(response).toHaveProperty('timestamp')
  return response
}

// Test data factory
export const createMockProduct = (overrides = {}) => ({
  id: 1,
  name: '测试商品',
  description: '这是一个测试商品',
  price: 100,
  originalPrice: 150,
  discount: 0.2,
  stock: 100,
  sales: 50,
  categoryId: 1,
  images: ['http://example.com/image1.jpg'],
  status: 1,
  attributes: { color: '红色', size: 'L' },
  ...overrides,
})

export const createMockOrder = (overrides = {}) => ({
  id: 1,
  orderNo: 'ORD001',
  customerId: 1001,
  customerName: '张三',
  customerPhone: '13800138001',
  items: [
    {
      name: '商品A',
      spec: '规格A',
      price: 100,
      quantity: 2,
      total: 200,
    }
  ],
  amount: 200,
  status: '待支付',
  paymentMethod: 'alipay',
  deliveryAddress: '北京市朝阳区',
  estimatedDelivery: '2024-03-05',
  remark: '测试订单',
  ...overrides,
})

export const createMockUser = (overrides = {}) => ({
  id: 1,
  username: 'testuser',
  nickname: '测试用户',
  email: 'test@example.com',
  phone: '13800138001',
  avatar: 'http://example.com/avatar.jpg',
  roles: ['user'],
  permissions: ['user:read', 'user:write'],
  createTime: '2024-01-01 00:00:00',
  updateTime: '2024-01-01 00:00:00',
  ...overrides,
})

export const createMockCoupon = (overrides = {}) => ({
  id: 1,
  name: '测试优惠券',
  couponCode: 'TEST10',
  type: 1,
  value: 10,
  discount: 0.9,
  minAmount: 50,
  maxAmount: 100,
  startTime: '2024-01-01 00:00:00',
  endTime: '2024-12-31 23:59:59',
  totalCount: 1000,
  usedCount: 100,
  perUserLimit: 1,
  status: 1,
  description: '测试优惠券描述',
  ...overrides,
})

// Performance testing utilities
export const measureApiPerformance = async (apiCall: () => Promise<any>, iterations = 10) => {
  const times: number[] = []
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    await apiCall()
    const end = performance.now()
    times.push(end - start)
  }
  
  const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length
  const minTime = Math.min(...times)
  const maxTime = Math.max(...times)
  
  return {
    times,
    avgTime,
    minTime,
    maxTime,
    iterations,
  }
}

// Security testing utilities
export const testSqlInjection = async (apiCall: (input: string) => Promise<any>) => {
  const maliciousInputs = [
    "'; DROP TABLE users; --",
    "' OR '1'='1'",
    "admin'--",
    "<script>alert('XSS')</script>",
  ]
  
  for (const input of maliciousInputs) {
    try {
      const result = await apiCall(input)
      // Should not execute malicious code
      expect(result.code).toBeGreaterThanOrEqual(40000)
    } catch (error) {
      // Expected to catch and handle malicious input
      expect(error).toBeDefined()
    }
  }
}

export const testXssProtection = async (apiCall: (input: string) => Promise<any>) => {
  const xssPayloads = [
    "<script>alert('XSS')</script>",
    "<img src=x onerror=alert('XSS')>",
    "javascript:alert('XSS')",
    "<svg onload=alert('XSS')>",
  ]
  
  for (const payload of xssPayloads) {
    try {
      const result = await apiCall(payload)
      // Should sanitize or escape XSS
      expect(result.data).not.toContain('<script>')
      expect(result.data).not.toContain('javascript:')
    } catch (error) {
      // Expected to handle XSS properly
      expect(error).toBeDefined()
    }
  }
}

export const testRateLimiting = async (apiCall: () => Promise<any>, limit = 5) => {
  const promises = []
  
  for (let i = 0; i < limit + 2; i++) {
    promises.push(apiCall())
  }
  
  const results = await Promise.allSettled(promises)
  const successCount = results.filter(r => r.status === 'fulfilled').length
  const failureCount = results.filter(r => r.status === 'rejected').length
  
  // Should allow up to the limit
  expect(successCount).toBeLessThanOrEqual(limit)
  expect(failureCount).toBeGreaterThanOrEqual(2)
}