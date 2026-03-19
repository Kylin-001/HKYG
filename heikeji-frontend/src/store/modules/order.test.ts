import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { testUserData } from '@/config/test'
import { setActivePinia, createPinia } from 'pinia'
import { useOrderStore } from './order'
import { orderApi } from '@/api/order'

// Mock API
vi.mock('@/api/order', () => ({
  orderApi: {
    getOrderList: vi.fn(() =>
      Promise.resolve({
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
                },
              ],
              amount: 200,
              status: '待支付',
              paymentMethod: 'alipay',
              deliveryAddress: '北京市朝阳区',
              estimatedDelivery: '2024-03-05',
              remark: '测试订单',
            },
          ],
          total: 1,
          current: 1,
          size: 10,
          pages: 1,
        },
      })
    ),
    getOrderDetail: vi.fn(() =>
      Promise.resolve({
        code: 20000,
        data: {
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
            },
          ],
          amount: 200,
          status: '待支付',
          paymentMethod: 'alipay',
          deliveryAddress: '北京市朝阳区',
          estimatedDelivery: '2024-03-05',
          remark: '测试订单',
          logisticsInfo: {
            company: '顺丰快递',
            trackingNo: 'SF123456789',
          },
        },
      })
    ),
    shipOrder: vi.fn(() =>
      Promise.resolve({
        code: 20000,
        data: { success: true },
      })
    ),
    cancelOrder: vi.fn(() =>
      Promise.resolve({
        code: 20000,
        data: { success: true },
      })
    ),
    confirmReceive: vi.fn(() =>
      Promise.resolve({
        code: 20000,
        data: { success: true },
      })
    ),
    remindPay: vi.fn(() =>
      Promise.resolve({
        code: 20000,
        data: { success: true },
      })
    ),
    getLogisticsDetail: vi.fn(() =>
      Promise.resolve({
        code: 20000,
        data: {
          company: '顺丰快递',
          trackingNo: 'SF123456789',
          status: '已发货',
          timeline: [
            {
              time: '2024-03-04 10:00:00',
              status: '已揽收',
              description: '快递员已揽收',
            },
            {
              time: '2024-03-04 12:00:00',
              status: '运输中',
              description: '包裹正在运输',
            },
            {
              time: '2024-03-05 09:00:00',
              status: '派送中',
              description: '包裹正在派送',
            },
          ],
        },
      })
    ),
    agreeRefund: vi.fn(() =>
      Promise.resolve({
        code: 20000,
        data: { success: true },
      })
    ),
    rejectRefund: vi.fn(() =>
      Promise.resolve({
        code: 20000,
        data: { success: true },
      })
    ),
  },
}))

describe('Order Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useOrderStore()

    expect(store.orders).toEqual([])
    expect(store.detail).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.pagination).toEqual({
      current: 1,
      pageSize: 10,
      total: 0,
    })
  })

  it('should fetch order list correctly', async () => {
    const store = useOrderStore()
    const mockParams = { page: 1, pageSize: 10 }

    await store.fetchOrderList(mockParams)

    expect(orderApi.getOrderList).toHaveBeenCalledWith(mockParams)
    expect(store.orders).toHaveLength(1)
    expect(store.orders[0]).toMatchObject({
      id: 1,
      orderNo: 'ORD001',
      customerName: '张三',
    })
    expect(store.pagination.total).toBe(1)
    expect(store.loading).toBe(false)
  })

  it('should fetch order detail correctly', async () => {
    const store = useOrderStore()
    const orderId = 1

    await store.fetchOrderDetail(orderId)

    expect(orderApi.getOrderDetail).toHaveBeenCalledWith(orderId)
    expect(store.detail).toMatchObject({
      id: 1,
      orderNo: 'ORD001',
      customerName: '张三',
      logisticsInfo: {
        company: '顺丰快递',
        trackingNo: 'SF123456789',
      },
    })
    expect(store.loading).toBe(false)
  })

  it('should handle order list fetch error', async () => {
    const store = useOrderStore()
    const mockError = new Error('Network error')
    ;(orderApi.getOrderList as any).mockRejectedValue(mockError)

    await expect(store.fetchOrderList({})).rejects.toThrow()
    expect(store.error).toBe('Network error')
    expect(store.loading).toBe(false)
  })

  it('should ship order correctly', async () => {
    const store = useOrderStore()
    const orderId = 1
    const logisticsInfo = {
      company: '顺丰快递',
      trackingNo: 'SF123456789',
    }

    await store.handleShipOrder(orderId, logisticsInfo)

    expect(orderApi.shipOrder).toHaveBeenCalledWith(orderId, logisticsInfo)
    expect(store.orders[0].status).toBe('已发货')
    expect(store.loading).toBe(false)
  })

  it('should cancel order correctly', async () => {
    const store = useOrderStore()
    const orderId = 1

    await store.handleCancelOrder(orderId)

    expect(orderApi.cancelOrder).toHaveBeenCalledWith(orderId)
    expect(store.orders[0].status).toBe('已取消')
    expect(store.loading).toBe(false)
  })

  it('should confirm receive correctly', async () => {
    const store = useOrderStore()
    const orderId = 1

    await store.handleConfirmReceive(orderId)

    expect(orderApi.confirmReceive).toHaveBeenCalledWith(orderId)
    expect(store.orders[0].status).toBe('已收货')
    expect(store.loading).toBe(false)
  })

  it('should remind pay correctly', async () => {
    const store = useOrderStore()
    const orderId = 1

    await store.handleRemindPay(orderId)

    expect(orderApi.remindPay).toHaveBeenCalledWith(orderId)
    expect(store.loading).toBe(false)
  })

  it('should fetch logistics detail correctly', async () => {
    const store = useOrderStore()
    const orderId = 1

    await store.fetchLogisticsDetail(orderId)

    expect(orderApi.getLogisticsDetail).toHaveBeenCalledWith(orderId)
    expect(store.detail?.logisticsInfo).toMatchObject({
      company: '顺丰快递',
      trackingNo: 'SF123456789',
      status: '已发货',
    })
    expect(store.loading).toBe(false)
  })

  it('should agree refund correctly', async () => {
    const store = useOrderStore()
    const orderId = 1
    const reason = '商品质量问题'

    await store.handleAgreeRefund(orderId, reason)

    expect(orderApi.agreeRefund).toHaveBeenCalledWith(orderId, reason)
    expect(store.orders[0].status).toBe('已退款')
    expect(store.loading).toBe(false)
  })

  it('should reject refund correctly', async () => {
    const store = useOrderStore()
    const orderId = 1
    const reason = '非质量问题'

    await store.handleRejectRefund(orderId, reason)

    expect(orderApi.rejectRefund).toHaveBeenCalledWith(orderId, reason)
    expect(store.orders[0].status).toBe('已完成')
    expect(store.loading).toBe(false)
  })

  it('should reset order state correctly', () => {
    const store = useOrderStore()

    // 先设置一些数据
    store.orders = [{ id: 1, orderNo: 'ORD001' }] as any
    store.detail = { id: 1, orderNo: 'ORD001' } as any
    store.error = 'Test error' as any

    store.resetOrderState()

    expect(store.orders).toEqual([])
    expect(store.detail).toBeNull()
    expect(store.error).toBeNull()
    expect(store.pagination).toEqual({
      current: 1,
      pageSize: 10,
      total: 0,
    })
  })

  it('should update pagination correctly', () => {
    const store = useOrderStore()

    store.updatePagination({ current: 2, pageSize: 20 })

    expect(store.pagination).toEqual({
      current: 2,
      pageSize: 20,
      total: 0,
    })
  })

  it('should filter orders correctly', () => {
    const store = useOrderStore()
    const orders = [
      { id: 1, orderNo: 'ORD001', status: '待支付' },
      { id: 2, orderNo: 'ORD002', status: '已发货' },
      { id: 3, orderNo: 'ORD003', status: '已完成' },
    ] as any

    store.orders = orders
    store.updateFilter({ status: '待支付' })

    expect(store.filteredOrders).toEqual([{ id: 1, orderNo: 'ORD001', status: '待支付' }])
  })

  it('should get order statistics correctly', () => {
    const store = useOrderStore()
    const orders = [
      { id: 1, orderNo: 'ORD001', status: '待支付' },
      { id: 2, orderNo: 'ORD002', status: '已发货' },
      { id: 3, orderNo: 'ORD003', status: '已完成' },
    ] as any

    store.orders = orders

    const stats = store.getOrderStats()

    expect(stats.total).toBe(3)
    expect(stats.pending).toBe(1)
    expect(stats.shipped).toBe(1)
    expect(stats.completed).toBe(1)
  })
})
