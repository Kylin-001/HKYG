import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductCard from '@/components/ProductCard.vue'

const mockProduct = {
  id: '1',
  name: '测试商品',
  price: 99.99,
  originalPrice: 199.99,
  image: 'https://example.com/product.jpg',
  category: 'electronics' as const,
  sales: 1234,
  rating: 4.5,
  tags: ['热门', '新品'],
}

describe('ProductCard.vue', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('正确渲染商品信息', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        plugins: [pinia],
      },
    })

    expect(wrapper.text()).toContain(mockProduct.name)
    expect(wrapper.text()).toContain('¥99.99')
    expect(wrapper.text()).toContain('199.99')
    expect(wrapper.find('img').attributes('alt')).toBe(mockProduct.name)
  })

  it('计算正确的折扣百分比', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        plugins: [pinia],
      },
    })

    expect(wrapper.find('.product-card__discount-badge').text()).toBe('-50%')
  })

  it('没有原价时不显示折扣标签', () => {
    const noDiscountProduct = { ...mockProduct, originalPrice: 0 }
    
    const wrapper = mount(ProductCard, {
      props: {
        product: noDiscountProduct,
      },
      global: {
        plugins: [pinia],
      },
    })

    expect(wrapper.find('.product-card__discount-badge').exists()).toBe(false)
  })

  it('点击时触发click事件', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        plugins: [pinia],
      },
    })

    await wrapper.find('.product-card').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
    expect(wrapper.emitted('click')?.[0]).toEqual([mockProduct])
  })

  it('触发addToCart事件', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        plugins: [pinia],
      },
    })

    await wrapper.find('.product-card__cart-btn').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('addToCart')
  })

  it('支持不同的尺寸变体', () => {
    const sizes = ['small', 'medium', 'large'] as const

    sizes.forEach((size) => {
      const wrapper = mount(ProductCard, {
        props: {
          product: mockProduct,
          size,
        },
        global: {
          plugins: [pinia],
        },
      })

      expect(wrapper.find(`.product-card--${size}`).exists()).toBe(true)
    })
  })

  it('正确处理图片懒加载属性', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        plugins: [pinia],
      },
    })

    const img = wrapper.find('img')
    expect(img.attributes('loading')).toBe('lazy')
  })
})
