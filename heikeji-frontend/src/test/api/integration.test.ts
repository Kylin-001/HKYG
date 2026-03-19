import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { setupMockServer } from './setup'
import { productApi } from '@/api/product'
import { userApi } from '@/api/user'
import { orderApi } from '@/api/order'
import { marketingApi } from '@/api/marketing'
import { analyticsApi } from '@/api/analytics'
import {
  createMockProduct,
  createMockUser,
  createMockOrder,
  createMockCoupon,
  expectApiResponse,
  expectApiError,
} from './setup'

describe('API Integration Tests', () => {
  let server: any

  beforeAll(async () => {
    server = setupMockServer()
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Restore all mocks after each test
    vi.restoreAllMocks()
  })

  describe('Product API Integration', () => {
    it('should create product successfully', async () => {
      const productData = createMockProduct()
      const result = await productApi.createProduct(productData)

      expect(result.code).toBe(20000)
      expect(result.data.success).toBe(true)
      expect(result.message).toBe('创建商品成功')
    })

    it('should get product list successfully', async () => {
      const result = await productApi.getProductList({ page: 1, pageSize: 10 })

      expect(result.code).toBe(20000)
      expect(result.data.records).toHaveLength(1)
      expect(result.data.records[0]).toMatchObject(createMockProduct())
    })

    it('should update product successfully', async () => {
      const productData = createMockProduct({ name: '更新的商品' })
      const result = await productApi.updateProduct(productData)

      expect(result.code).toBe(20000)
      expect(result.data.success).toBe(true)
      expect(result.message).toBe('更新商品成功')
    })

    it('should delete product successfully', async () => {
      const productId = 1
      const result = await productApi.deleteProduct(productId)

      expect(result.code).toBe(20000)
      expect(result.data.success).toBe(true)
      expect(result.message).toBe('删除商品成功')
    })

    it('should handle product API errors', async () => {
      // Mock a failed API call
      const productData = createMockProduct()
      const result = await productApi.createProduct(productData)

      // The mock should return an error response
      expect(result.code).toBeGreaterThanOrEqual(40000)
    })
  })

  describe('User API Integration', () => {
    it('should get user info successfully', async () => {
      const result = await userApi.getUserInfo()

      expect(result.code).toBe(20000)
      expect(result.data).toMatchObject(createMockUser())
      expect(result.message).toBe('获取用户信息成功')
    })

    it('should login successfully', async () => {
      const loginData = { username: testUserData.username, password: testUserData.password }
      const result = await userApi.login(loginData)

      expect(result.code).toBe(20000)
      expect(result.data.token).toBeDefined()
    })

    it('should update user profile successfully', async () => {
      const updateData = { nickname: '更新的昵称' }
      const result = await userApi.updateProfile(updateData)

      expect(result.code).toBe(20000)
    })

    it('should handle user API errors', async () => {
      // Mock a failed API call
      const result = await userApi.getUserInfo()

      // The mock should return an error response
      expect(result.code).toBeGreaterThanOrEqual(40000)
    })
  })

  describe('Order API Integration', () => {
    it('should get order list successfully', async () => {
      const result = await orderApi.getOrderList({ page: 1, pageSize: 10 })

      expect(result.code).toBe(20000)
      expect(result.data.records).toHaveLength(1)
      expect(result.data.records[0]).toMatchObject(createMockOrder())
    })

    it('should create order successfully', async () => {
      const orderData = createMockOrder()
      const result = await orderApi.createOrder(orderData)

      expect(result.code).toBe(20000)
      expect(result.data.success).toBe(true)
      expect(result.message).toBe('创建订单成功')
    })

    it('should update order status successfully', async () => {
      const orderId = 1
      const status = 2
      const result = await orderApi.updateOrderStatus(orderId, status)

      expect(result.code).toBe(20000)
      expect(result.data.success).toBe(true)
    })

    it('should handle order API errors', async () => {
      // Mock a failed API call
      const result = await orderApi.getOrderList({} as any)

      // The mock should return an error response
      expect(result.code).toBeGreaterThanOrEqual(40000)
    })
  })

  describe('Marketing API Integration', () => {
    it('should get coupon list successfully', async () => {
      const result = await marketingApi.getCouponList({ page: 1, pageSize: 10 })

      expect(result.code).toBe(20000)
      expect(result.data.records).toHaveLength(1)
      expect(result.data.records[0]).toMatchObject(createMockCoupon())
    })

    it('should create coupon successfully', async () => {
      const couponData = createMockCoupon()
      const result = await marketingApi.createCoupon(couponData)

      expect(result.code).toBe(20000)
      expect(result.data.success).toBe(true)
      expect(result.message).toBe('创建优惠券成功')
    })

    it('should use coupon successfully', async () => {
      const useData = { couponId: 1, orderNo: 'ORD001' }
      const result = await marketingApi.useCoupon(useData)

      expect(result.code).toBe(20000)
      expect(result.data.success).toBe(true)
    })

    it('should handle marketing API errors', async () => {
      // Mock a failed API call
      const result = await marketingApi.getCouponList({} as any)

      // The mock should return an error response
      expect(result.code).toBeGreaterThanOrEqual(40000)
    })
  })

  describe('Analytics API Integration', () => {
    it('should get user behavior stats successfully', async () => {
      const result = await analyticsApi.getUserBehaviorStats(1, 'day')

      expect(result.code).toBe(20000)
      expect(result.data.pageViews).toBe(100)
      expect(result.data.uniqueVisitors).toBe(50)
      expect(result.data.avgSessionDuration).toBe(300)
    })

    it('should get sales stats successfully', async () => {
      const result = await analyticsApi.getSalesStats('day')

      expect(result.code).toBe(20000)
      expect(result.data.totalRevenue).toBe(10000)
      expect(result.data.totalOrders).toBe(100)
    })

    it('should handle analytics API errors', async () => {
      // Mock a failed API call
      const result = await analyticsApi.getUserBehaviorStats(1, 'day')

      // The mock should return an error response
      expect(result.code).toBeGreaterThanOrEqual(40000)
    })
  })

  describe('API Response Format Validation', () => {
    it('should validate success response format', async () => {
      const result = await productApi.getProductList({ page: 1, pageSize: 10 })

      expect(result).toHaveProperty('code')
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('message')
      expect(result).toHaveProperty('timestamp')
      expect(typeof result.code).toBe('number')
      expect(typeof result.message).toBe('string')
      expect(typeof result.timestamp).toBe('number')
    })

    it('should validate error response format', async () => {
      // Mock a failed API call
      const result = await productApi.deleteProduct(999)

      expect(result).toHaveProperty('code')
      expect(result).toHaveProperty('message')
      expect(result).toHaveProperty('timestamp')
      expect(result.code).toBeGreaterThanOrEqual(40000)
      expect(result.message).toContain('失败')
    })
  })
})
