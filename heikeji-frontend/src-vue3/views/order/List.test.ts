import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import List from '../List.vue'
import * as orderApi from '@/api/order'
import type { Order, OrderListResponse, OrderStats } from '@/types/order'

// Mock API
vi.mock('@/api/order', () => ({
  getOrderList: vi.fn(),
  getOrderStats: vi.fn(),
  updateOrderStatus: vi.fn(),
  cancelOrder: vi.fn(),
  exportOrders: vi.fn(),
}))

// Mock Element Plus components
vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElMessage: {
      success: vi.fn(),
      error: vi.fn(),
    },
    ElMessageBox: {
      confirm: vi.fn(),
      prompt: vi.fn(),
    },
  }
})

// Mock OrderDetailDialog and DeliveryDialog
vi.mock('../components/OrderDetailDialog.vue', () => ({
  default: {
    name: 'OrderDetailDialog',
    template: '<div class="order-detail-dialog-mock"></div>',
    props: ['visible', 'orderId'],
  },
}))

vi.mock('../components/DeliveryDialog.vue', () => ({
  default: {
    name: 'DeliveryDialog',
    template: '<div class="delivery-dialog-mock"></div>',
    props: ['visible', 'orderId'],
  },
}))

describe('Order List Component', () => {
  let wrapper: any

  const mockOrders: Order[] = [
    {
      id: '1',
      orderNo: 'ORD20230101001',
      userId: 'user1',
      userName: '张三',
      userPhone: '13800138000',
      userAddress: '北京市朝阳区某某街道',
      totalAmount: 199.99,
      discountAmount: 10.00,
      actualAmount: 189.99,
      paymentMethod: 'alipay',
      paymentStatus: 2,
      orderStatus: 2,
      deliveryType: 1,
      deliveryFee: 10.00,
      items: [
        {
          id: '1',
          orderId: '1',
          productId: 'prod1',
          productName: '测试商品1',
          productImage: 'https://example.com/image1.jpg',
          productPrice: 99.99,
          quantity: 2,
          totalPrice: 199.98,
        },
      ],
      createTime: '2023-01-01T10:00:00Z',
      updateTime: '2023-01-01T10:00:00Z',
      paymentTime: '2023-01-01T10:05:00Z',
    },
    {
      id: '2',
      orderNo: 'ORD20230101002',
      userId: 'user2',
      userName: '李四',
      userPhone: '13800138001',
      userAddress: '上海市浦东新区某某路',
      totalAmount: 99.99,
      discountAmount: 0,
      actualAmount: 99.99,
      paymentMethod: 'wechat',
      paymentStatus: 1,
      orderStatus: 1,
      deliveryType: 2,
      deliveryFee: 0,
      items: [
        {
          id: '2',
          orderId: '2',
          productId: 'prod2',
          productName: '测试商品2',
          productImage: 'https://example.com/image2.jpg',
          productPrice: 99.99,
          quantity: 1,
          totalPrice: 99.99,
        },
      ],
      createTime: '2023-01-01T11:00:00Z',
      updateTime: '2023-01-01T11:00:00Z',
    },
  ]

  const mockOrderListResponse: OrderListResponse = {
    list: mockOrders,
    total: 2,
    pageNum: 1,
    pageSize: 20,
  }

  const mockOrderStats: OrderStats = {
    total: 100,
    todayCount: 10,
    todayAmount: 1999.99,
    pendingPayment: 5,
    pendingConfirm: 3,
    delivering: 10,
    completed: 80,
    cancelled: 2,
    refunded: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default API responses
    vi.mocked(orderApi.getOrderList).mockResolvedValue({
      data: mockOrderListResponse,
    })
    
    vi.mocked(orderApi.getOrderStats).mockResolvedValue({
      data: mockOrderStats,
    })
    
    vi.mocked(orderApi.updateOrderStatus).mockResolvedValue({
      data: true,
    })
    
    vi.mocked(orderApi.cancelOrder).mockResolvedValue({
      data: true,
    })
    
    vi.mocked(orderApi.exportOrders).mockResolvedValue({
      data: new Blob(),
    })
    
    vi.mocked(ElMessageBox.confirm).mockResolvedValue('confirm')
    vi.mocked(ElMessageBox.prompt).mockResolvedValue({
      value: '测试取消原因',
    })
    
    wrapper = mount(List, {
      global: {
        stubs: {
          'el-button': true,
          'el-input': true,
          'el-select': true,
          'el-option': true,
          'el-card': true,
          'el-table': true,
          'el-table-column': true,
          'el-pagination': true,
          'el-icon': true,
          'el-tag': true,
          'el-date-picker': true,
          'el-link': true,
        },
      },
    })
  })

  it('renders correctly', () => {
    expect(wrapper.find('.order-list-container').exists()).toBe(true)
    expect(wrapper.find('.page-header').exists()).toBe(true)
    expect(wrapper.find('.stats-container').exists()).toBe(true)
    expect(wrapper.find('.search-container').exists()).toBe(true)
    expect(wrapper.find('.order-table-card').exists()).toBe(true)
  })

  it('loads orders on mount', async () => {
    await wrapper.vm.$nextTick()
    
    expect(orderApi.getOrderList).toHaveBeenCalledTimes(1)
    expect(orderApi.getOrderStats).toHaveBeenCalledTimes(1)
  })

  it('displays order stats correctly', async () => {
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('100')
    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('1999.99')
    expect(wrapper.text()).toContain('8') // pendingPayment + pendingConfirm
  })

  it('displays orders in table', async () => {
    await wrapper.vm.$nextTick()
    
    // Wait for API call to complete
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('ORD20230101001')
    expect(wrapper.text()).toContain('ORD20230101002')
    expect(wrapper.text()).toContain('张三')
    expect(wrapper.text()).toContain('李四')
  })

  it('handles search correctly', async () => {
    const searchInput = wrapper.find('.search-container input')
    await searchInput.setValue('ORD20230101001')
    await searchInput.trigger('keyup.enter')
    
    expect(orderApi.getOrderList).toHaveBeenCalledWith(
      expect.objectContaining({
        orderNo: 'ORD20230101001',
        pageNum: 1,
      })
    )
  })

  it('handles refresh correctly', async () => {
    const refreshButton = wrapper.find('.header-right button:nth-child(1)')
    await refreshButton.trigger('click')
    
    expect(orderApi.getOrderList).toHaveBeenCalledTimes(2)
    expect(orderApi.getOrderStats).toHaveBeenCalledTimes(2)
  })

  it('handles order confirmation correctly', async () => {
    // First load orders
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Mock the handleConfirm method
    wrapper.vm.handleConfirm(mockOrders[0])
    
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      expect.stringContaining('确定要确认订单"ORD20230101001"吗？'),
      '提示',
      expect.any(Object)
    )
    
    await wrapper.vm.$nextTick()
    
    expect(orderApi.updateOrderStatus).toHaveBeenCalledWith('1', 2)
  })

  it('handles order cancellation correctly', async () => {
    // First load orders
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Mock the handleCancel method
    wrapper.vm.handleCancel(mockOrders[0])
    
    expect(ElMessageBox.prompt).toHaveBeenCalledWith(
      expect.stringContaining('确定要取消订单"ORD20230101001"吗？'),
      '取消订单',
      expect.any(Object)
    )
    
    await wrapper.vm.$nextTick()
    
    expect(orderApi.cancelOrder).toHaveBeenCalledWith('1', '测试取消原因')
  })

  it('handles order delivery correctly', async () => {
    // First load orders
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Mock the handleDeliver method
    wrapper.vm.handleDeliver(mockOrders[0])
    
    expect(wrapper.vm.deliveryDialogVisible).toBe(true)
    expect(wrapper.vm.selectedOrderId).toBe('1')
  })

  it('handles order view correctly', async () => {
    // First load orders
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Mock the handleView method
    wrapper.vm.handleView(mockOrders[0])
    
    expect(wrapper.vm.detailDialogVisible).toBe(true)
    expect(wrapper.vm.selectedOrderId).toBe('1')
  })

  it('handles export correctly', async () => {
    const exportButton = wrapper.find('.header-right button:nth-child(2)')
    await exportButton.trigger('click')
    
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      '确定要导出订单数据吗？',
      '提示',
      expect.any(Object)
    )
    
    expect(orderApi.exportOrders).toHaveBeenCalled()
  })

  it('handles date range change correctly', async () => {
    const startDate = new Date('2023-01-01')
    const endDate = new Date('2023-01-31')
    
    wrapper.vm.handleDateChange([startDate, endDate])
    
    expect(wrapper.vm.searchParams.startDate).toBe('2023-01-01')
    expect(wrapper.vm.searchParams.endDate).toBe('2023-01-31')
  })

  it('handles reset search correctly', async () => {
    // Set search values
    wrapper.vm.searchParams.orderNo = 'ORD20230101001'
    wrapper.vm.searchParams.userName = '张三'
    wrapper.vm.searchParams.orderStatus = '1'
    wrapper.vm.searchParams.paymentStatus = '2'
    
    const resetButton = wrapper.find('.search-container button:last-child')
    await resetButton.trigger('click')
    
    expect(wrapper.vm.searchParams.orderNo).toBe('')
    expect(wrapper.vm.searchParams.userName).toBe('')
    expect(wrapper.vm.searchParams.orderStatus).toBe('')
    expect(wrapper.vm.searchParams.paymentStatus).toBe('')
    expect(wrapper.vm.searchParams.startDate).toBe('')
    expect(wrapper.vm.searchParams.endDate).toBe('')
    expect(wrapper.vm.pagination.currentPage).toBe(1)
  })

  it('formats payment status correctly', () => {
    expect(wrapper.vm.getPaymentStatusType(1)).toBe('warning')
    expect(wrapper.vm.getPaymentStatusType(2)).toBe('success')
    expect(wrapper.vm.getPaymentStatusType(3)).toBe('danger')
    expect(wrapper.vm.getPaymentStatusType(4)).toBe('info')
    
    expect(wrapper.vm.getPaymentStatusText(1)).toBe('待支付')
    expect(wrapper.vm.getPaymentStatusText(2)).toBe('已支付')
    expect(wrapper.vm.getPaymentStatusText(3)).toBe('支付失败')
    expect(wrapper.vm.getPaymentStatusText(4)).toBe('已退款')
  })

  it('formats order status correctly', () => {
    expect(wrapper.vm.getOrderStatusType(1)).toBe('warning')
    expect(wrapper.vm.getOrderStatusType(2)).toBe('primary')
    expect(wrapper.vm.getOrderStatusType(3)).toBe('success')
    expect(wrapper.vm.getOrderStatusType(4)).toBe('success')
    expect(wrapper.vm.getOrderStatusType(5)).toBe('info')
    
    expect(wrapper.vm.getOrderStatusText(1)).toBe('待确认')
    expect(wrapper.vm.getOrderStatusText(2)).toBe('已确认')
    expect(wrapper.vm.getOrderStatusText(3)).toBe('配送中')
    expect(wrapper.vm.getOrderStatusText(4)).toBe('已完成')
    expect(wrapper.vm.getOrderStatusText(5)).toBe('已取消')
  })

  it('formats delivery type correctly', () => {
    expect(wrapper.vm.getDeliveryTypeText(1)).toBe('快递配送')
    expect(wrapper.vm.getDeliveryTypeText(2)).toBe('自提')
    expect(wrapper.vm.getDeliveryTypeText(3)).toBe('外卖配送')
  })

  it('formats date correctly', () => {
    const dateString = '2023-01-01T10:00:00Z'
    const formattedDate = wrapper.vm.formatDate(dateString)
    expect(formattedDate).toBe(new Date(dateString).toLocaleString())
  })
})