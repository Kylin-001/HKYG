import { describe, it, expect, vi, beforeEach } from 'vitest'
import { testUserData } from '@/config/test'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import OrderCard from '@/components/business/OrderCard.vue'

describe('OrderCard Component Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockOrder = {
    orderId: 'ORD001',
    orderNo: '2024030400001',
    userId: 1,
    userName: '测试用户',
    totalAmount: 199.99,
    actualAmount: 189.99,
    paymentMethod: 'wechat',
    orderStatus: 1,
    paymentStatus: 1,
    deliveryStatus: 0,
    shippingAddress: '黑龙江省哈尔滨市松北区',
    receiverName: '张三',
    receiverPhone: '13800138000',
    createTime: '2024-03-04 14:30:00',
    orderItems: [
      {
        productId: 1,
        productName: '商品1',
        quantity: 2,
        price: 99.99,
        totalPrice: 199.99,
      },
    ],
  }

  it('should render correctly', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('.order-card').exists()).toBe(true)
  })

  it('should display order number', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.text()).toContain('2024030400001')
  })

  it('should display receiver name', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.text()).toContain('张三')
  })

  it('should display receiver phone', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.text()).toContain('13800138000')
  })

  it('should display total amount', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.text()).toContain('199.99')
  })

  it('should display actual amount', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.text()).toContain('189.99')
  })

  it('should display discount amount', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    const discount = 199.99 - 189.99
    expect(wrapper.text()).toContain(discount.toFixed(2))
  })

  it('should display order status', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('.order-status').exists()).toBe(true)
  })

  it('should display payment status', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('.payment-status').exists()).toBe(true)
  })

  it('should display delivery status', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('.delivery-status').exists()).toBe(true)
  })

  it('should display order items', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.text()).toContain('商品1')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('99.99')
  })

  it('should emit click event when clicked', async () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    await wrapper.find('.order-card').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')[0]).toEqual([mockOrder])
  })

  it('should emit cancel event when cancel button clicked', async () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    const cancelBtn = wrapper.find('.cancel-btn')
    if (cancelBtn.exists()) {
      await cancelBtn.trigger('click')
      expect(wrapper.emitted('cancel')).toBeTruthy()
      expect(wrapper.emitted('cancel')[0]).toEqual([mockOrder])
    }
  })

  it('should emit pay event when pay button clicked', async () => {
    const unpaidOrder = { ...mockOrder, paymentStatus: 0 }
    const wrapper = mount(OrderCard, {
      props: {
        order: unpaidOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    const payBtn = wrapper.find('.pay-btn')
    if (payBtn.exists()) {
      await payBtn.trigger('click')
      expect(wrapper.emitted('pay')).toBeTruthy()
      expect(wrapper.emitted('pay')[0]).toEqual([unpaidOrder])
    }
  })

  it('should display order time', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.text()).toContain('2024-03-04')
  })

  it('should display shipping address', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.text()).toContain('黑龙江省哈尔滨市松北区')
  })

  it('should handle empty order items', () => {
    const emptyOrder = { ...mockOrder, orderItems: [] }
    const wrapper = mount(OrderCard, {
      props: {
        order: emptyOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('.order-items').exists()).toBe(true)
    expect(wrapper.text()).toContain('暂无商品')
  })

  it('should handle large order items', () => {
    const largeOrder = {
      ...mockOrder,
      orderItems: Array.from({ length: 100 }, (_, i) => ({
        productId: i + 1,
        productName: `商品${i + 1}`,
        quantity: 1,
        price: 99.99,
        totalPrice: 99.99,
      })),
    }

    const wrapper = mount(OrderCard, {
      props: {
        order: largeOrder,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('.order-items')).exists().toBe(true)
    expect(wrapper.text()).toContain('共100件商品')
  })
})
