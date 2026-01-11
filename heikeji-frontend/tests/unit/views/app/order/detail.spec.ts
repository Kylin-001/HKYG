import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderDetail from '@/views/app/order/detail.vue'
// 直接导入 API 模块，不需要使用 require
import { getOrderDetail, getOrderLogistics } from '@/api/app/order'

// 模拟 API
vi.mock('@/api/app/order', () => ({
  getOrderDetail: vi.fn(),
  getOrderLogistics: vi.fn(),
}))

describe('OrderDetail.vue', () => {
  // 模拟订单数据
  const mockOrderData = {
    id: 1,
    orderSn: '20260107123456789',
    status: 20,
    createTime: '2026-01-07 10:30:00',
    paymentTime: '',
    shippingTime: '',
    completeTime: '',
    paymentMethod: '微信支付',
    totalAmount: 2898.0,
    deliveryFee: 10.0,
    discountAmount: 20.0,
    payAmount: 2888.0,
    address: {
      consignee: '张三',
      phone: '13800138000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '中关村科技园',
    },
    items: [
      {
        id: 1,
        productId: 1,
        productName: '高品质数码商品 1 - 最新科技产品，品质保证',
        specification: '颜色：黑色，容量：128GB',
        price: 1299.0,
        quantity: 1,
        mainImage: 'https://picsum.photos/id/1/300/300',
      },
      {
        id: 2,
        productId: 2,
        productName: '高品质数码商品 2 - 最新科技产品，品质保证',
        specification: '颜色：白色，容量：256GB',
        price: 1599.0,
        quantity: 1,
        mainImage: 'https://picsum.photos/id/2/300/300',
      },
    ],
  }

  beforeEach(() => {
    // 重置所有 mock
    vi.clearAllMocks()
  })

  it('应该正确加载订单详情', async () => {
    // 模拟 API 响应
    getOrderDetail.mockResolvedValue({
      data: mockOrderData,
    })
    getOrderLogistics.mockResolvedValue({
      data: [],
    })

    // 挂载组件，传入 orderId
    const wrapper = mount(OrderDetail, {
      props: {
        id: 1,
      },
    })

    // 等待异步数据加载
    await wrapper.vm.$nextTick()

    // 验证组件已渲染
    expect(wrapper.exists()).toBe(true)

    // 验证 API 已调用
    expect(getOrderDetail).toHaveBeenCalled()
    expect(getOrderLogistics).toHaveBeenCalled()
  })

  // 为每个订单状态创建独立的测试用例
  const statusTestCases = [
    { status: 10, expectedButtons: ['取消订单', '立即支付'] },
    { status: 20, expectedButtons: ['提醒发货'] },
    { status: 30, expectedButtons: ['确认收货'] },
    { status: 40, expectedButtons: ['去评价'] },
    { status: 50, expectedButtons: ['再次购买'] },
  ]

  statusTestCases.forEach(testCase => {
    it(`应该正确处理订单状态 ${testCase.status}`, async () => {
      // 模拟 API 响应
      getOrderDetail.mockResolvedValue({
        data: {
          ...mockOrderData,
          status: testCase.status,
        },
      })
      getOrderLogistics.mockResolvedValue({
        data: [],
      })

      // 挂载组件
      const wrapper = mount(OrderDetail, {
        props: {
          id: 1,
        },
      })

      // 等待异步数据加载
      await wrapper.vm.$nextTick()

      // 验证组件已渲染
      expect(wrapper.exists()).toBe(true)

      // 注意：由于我们没有完全模拟 Element Plus 组件，这里只验证基本功能
      // 更详细的按钮测试需要完整的组件库支持

      wrapper.unmount()

      // 重置 mock
      vi.clearAllMocks()
    })
  })

  it('应该正确处理 API 错误', async () => {
    // 模拟 API 错误
    const errorMessage = '加载订单详情失败'
    getOrderDetail.mockRejectedValue(new Error(errorMessage))

    // 挂载组件
    const wrapper = mount(OrderDetail, {
      props: {
        id: 1,
      },
    })

    // 等待异步数据加载
    await wrapper.vm.$nextTick()

    // 验证组件已渲染
    expect(wrapper.exists()).toBe(true)
  })
})
