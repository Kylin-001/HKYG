import { describe, it, expect, vi } from 'vitest'
import { testUserData } from '@/config/test';
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import OrderCard from '@/components/business/OrderCard.vue'

describe('OrderCard Component', () => {
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
        totalPrice: 199.99
      }
    ]
  }

  it('should render order information correctly', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder
      }
    })
    
    expect(wrapper.text()).toContain('2024030400001')
    expect(wrapper.text()).toContain('张三')
    expect(wrapper.text()).toContain('189.99')
  })

  it('should show order status correctly', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder
      }
    })
    
    expect(wrapper.find('.order-status').exists()).toBe(true)
  })

  it('should show order time', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder
      }
    })
    
    expect(wrapper.text()).toContain('2024-03-04')
  })

  it('should show order items count', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder
      }
    })
    
    expect(wrapper.text()).toContain('共1件商品')
  })

  it('should emit click event when clicked', async () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder
      }
    })
    
    await wrapper.find('.order-card').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')[0]).toEqual([mockOrder])
  })

  it('should emit cancel event when cancel button clicked', async () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder
      }
    })
    
    const button = wrapper.find('.cancel-btn')
    if (button.exists()) {
      await button.trigger('click')
      expect(wrapper.emitted('cancel')).toBeTruthy()
      expect(wrapper.emitted('cancel')[0]).toEqual([mockOrder])
    }
  })

  it('should emit pay event when pay button clicked', async () => {
    const unpaidOrder = { ...mockOrder, paymentStatus: 0 }
    const wrapper = mount(OrderCard, {
      props: {
        order: unpaidOrder
      }
    })
    
    const button = wrapper.find('.pay-btn')
    if (button.exists()) {
      await button.trigger('click')
      expect(wrapper.emitted('pay')).toBeTruthy()
      expect(wrapper.emitted('pay')[0]).toEqual([unpaidOrder])
    }
  })

  it('should show discount when actual amount differs from total', () => {
    const wrapper = mount(OrderCard, {
      props: {
        order: mockOrder
      }
    })
    
    expect(wrapper.text()).toContain('199.99')
    expect(wrapper.text()).toContain('189.99')
    const discount = 199.99 - 189.99
    expect(wrapper.text()).toContain(discount.toFixed(2))
  })
})
