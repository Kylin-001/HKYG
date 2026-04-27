import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTakeoutStore } from '@/stores/takeout'
import * as takeoutApi from '@/api/takeout'

// Mock API
vi.mock('@/api/takeout', () => ({
  getMerchants: vi.fn(),
  getMerchantDetail: vi.fn(),
  getMerchantProducts: vi.fn(),
  createOrder: vi.fn(),
  getDeliveryTrack: vi.fn(),
}))

describe('Takeout Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('State', () => {
    it('应该有正确的初始状态', () => {
      const store = useTakeoutStore()

      expect(store.merchants).toEqual([])
      expect(store.merchantDetail).toBeNull()
      expect(store.products).toEqual([])
      expect(store.orders).toEqual([])
      expect(store.currentOrder).toBeNull()
      expect(store.deliveryTrack).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('Actions - fetchMerchants', () => {
    it('应该成功获取商家列表', async () => {
      const store = useTakeoutStore()
      const mockMerchants = {
        list: [
          { id: '1', name: '测试商家1', rating: 4.8 },
          { id: '2', name: '测试商家2', rating: 4.5 },
        ],
        total: 2,
        hasMore: false,
      }

      vi.mocked(takeoutApi.getMerchants).mockResolvedValue(mockMerchants)

      const result = await store.fetchMerchants({})

      expect(takeoutApi.getMerchants).toHaveBeenCalledWith({})
      expect(store.merchants).toEqual(mockMerchants.list)
      expect(result).toEqual(mockMerchants)
    })

    it('应该处理获取商家列表失败', async () => {
      const store = useTakeoutStore()
      const error = new Error('网络错误')

      vi.mocked(takeoutApi.getMerchants).mockRejectedValue(error)

      await expect(store.fetchMerchants({})).rejects.toThrow('网络错误')
      expect(store.error).toBe('网络错误')
    })

    it('应该支持分页加载', async () => {
      const store = useTakeoutStore()
      const mockMerchants = {
        list: [{ id: '1', name: '商家1' }],
        total: 10,
        hasMore: true,
      }

      vi.mocked(takeoutApi.getMerchants).mockResolvedValue(mockMerchants)

      await store.fetchMerchants({ page: 1, pageSize: 10 })

      expect(takeoutApi.getMerchants).toHaveBeenCalledWith({ page: 1, pageSize: 10 })
    })
  })

  describe('Actions - fetchMerchantDetail', () => {
    it('应该成功获取商家详情', async () => {
      const store = useTakeoutStore()
      const mockDetail = {
        id: '1',
        name: '测试商家',
        rating: 4.8,
        deliveryTime: '30分钟',
        minOrder: 20,
        deliveryFee: 3,
      }

      vi.mocked(takeoutApi.getMerchantDetail).mockResolvedValue(mockDetail)

      await store.fetchMerchantDetail('1')

      expect(takeoutApi.getMerchantDetail).toHaveBeenCalledWith('1')
      expect(store.merchantDetail).toEqual(mockDetail)
    })

    it('应该处理商家不存在的情况', async () => {
      const store = useTakeoutStore()

      vi.mocked(takeoutApi.getMerchantDetail).mockResolvedValue(null)

      await store.fetchMerchantDetail('999')

      expect(store.merchantDetail).toBeNull()
    })
  })

  describe('Actions - fetchMerchantProducts', () => {
    it('应该成功获取商家商品列表', async () => {
      const store = useTakeoutStore()
      const mockProducts = [
        { id: '1', name: '商品1', price: 15 },
        { id: '2', name: '商品2', price: 25 },
      ]

      vi.mocked(takeoutApi.getMerchantProducts).mockResolvedValue(mockProducts)

      const result = await store.fetchMerchantProducts('1')

      expect(takeoutApi.getMerchantProducts).toHaveBeenCalledWith('1')
      expect(store.products).toEqual(mockProducts)
      expect(result).toEqual(mockProducts)
    })
  })

  describe('Actions - createOrder', () => {
    it('应该成功创建订单', async () => {
      const store = useTakeoutStore()
      const orderData = {
        merchantId: '1',
        items: [{ id: '1', name: '商品1', price: 15, quantity: 2 }],
        totalAmount: 30,
      }
      const mockOrder = {
        id: 'order-001',
        ...orderData,
        status: 'pending',
        createTime: new Date().toISOString(),
      }

      vi.mocked(takeoutApi.createOrder).mockResolvedValue(mockOrder)

      const result = await store.createOrder(orderData)

      expect(takeoutApi.createOrder).toHaveBeenCalledWith(orderData)
      expect(store.currentOrder).toEqual(mockOrder)
      expect(result).toEqual(mockOrder)
    })
  })

  describe('Actions - fetchDeliveryTrack', () => {
    it('应该成功获取配送追踪信息', async () => {
      const store = useTakeoutStore()
      const mockTrack = {
        orderId: 'order-001',
        status: 'delivering',
        riderName: '张骑手',
        riderPhone: '13800138000',
        location: { lat: 45.76, lng: 126.63 },
        estimatedTime: '15分钟',
      }

      vi.mocked(takeoutApi.getDeliveryTrack).mockResolvedValue(mockTrack)

      await store.fetchDeliveryTrack('order-001')

      expect(takeoutApi.getDeliveryTrack).toHaveBeenCalledWith('order-001')
      expect(store.deliveryTrack).toEqual(mockTrack)
    })
  })

  describe('Getters', () => {
    it('应该计算正确的商家数量', () => {
      const store = useTakeoutStore()
      store.merchants = [
        { id: '1', name: '商家1' },
        { id: '2', name: '商家2' },
      ]

      expect(store.merchantCount).toBe(2)
    })

    it('应该返回当前商家的商品', () => {
      const store = useTakeoutStore()
      store.products = [
        { id: '1', name: '商品1', merchantId: '1' },
        { id: '2', name: '商品2', merchantId: '1' },
        { id: '3', name: '商品3', merchantId: '2' },
      ]

      const merchant1Products = store.getProductsByMerchant('1')
      expect(merchant1Products).toHaveLength(2)
    })

    it('应该返回订单状态文本', () => {
      const store = useTakeoutStore()

      expect(store.getOrderStatusText('pending')).toBe('待支付')
      expect(store.getOrderStatusText('paid')).toBe('已支付')
      expect(store.getOrderStatusText('delivering')).toBe('配送中')
      expect(store.getOrderStatusText('completed')).toBe('已完成')
      expect(store.getOrderStatusText('cancelled')).toBe('已取消')
    })
  })
})
