import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductCard from '@/components/business/ProductCard.vue'

describe('ProductCard Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockProduct = {
    id: 1,
    productName: '测试商品',
    productCode: 'P001',
    price: 99.99,
    originalPrice: 129.99,
    stock: 100,
    sales: 50,
    coverImage: 'http://example.com/product.jpg',
    status: 1,
    publishStatus: 1
  }

  it('should render product information correctly', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      }
    })
    
    expect(wrapper.text()).toContain('测试商品')
    expect(wrapper.text()).toContain('99.99')
    expect(wrapper.text()).toContain('129.99')
  })

  it('should show discount when original price exists', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      }
    })
    
    const discount = Math.round((1 - 99.99 / 129.99) * 100)
    expect(wrapper.text()).toContain(discount.toString())
  })

  it('should show stock status', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      }
    })
    
    expect(wrapper.text()).toContain('库存: 100')
  })

  it('should show sales count', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      }
    })
    
    expect(wrapper.text()).toContain('已售: 50')
  })

  it('should emit click event when clicked', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      }
    })
    
    await wrapper.find('.product-card').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')[0]).toEqual([mockProduct])
  })

  it('should emit add-to-cart event when button clicked', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      }
    })
    
    const button = wrapper.find('.add-to-cart-btn')
    await button.trigger('click')
    expect(wrapper.emitted('add-to-cart')).toBeTruthy()
    expect(wrapper.emitted('add-to-cart')[0]).toEqual([mockProduct])
  })

  it('should disable add-to-cart button when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    const wrapper = mount(ProductCard, {
      props: {
        product: outOfStockProduct
      }
    })
    
    const button = wrapper.find('.add-to-cart-btn')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('should show loading state', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
        loading: true
      }
    })
    
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
  })
})
