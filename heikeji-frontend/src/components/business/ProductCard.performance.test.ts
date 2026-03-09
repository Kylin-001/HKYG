import { describe, it, expect, vi, beforeEach } from 'vitest'
import { testUserData } from '@/config/test';
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductCard from '@/components/business/ProductCard.vue'

describe('ProductCard Performance Tests', () => {
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

  it('should render quickly with simple product', () => {
    const startTime = performance.now()
    
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    expect(renderTime).toBeLessThan(100)
    wrapper.unmount()
  })

  it('should handle rapid prop updates efficiently', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    const startTime = performance.now()
    
    for (let i = 0; i < 100; i++) {
      await wrapper.setProps({
        product: { ...mockProduct, price: 99.99 + i }
      })
    }
    
    const endTime = performance.now()
    const updateTime = endTime - startTime
    
    expect(updateTime).toBeLessThan(500)
    wrapper.unmount()
  })

  it('should not leak memory on multiple mounts', () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0
    
    for (let i = 0; i < 10; i++) {
      const wrapper = mount(ProductCard, {
        props: {
          product: mockProduct
        },
        global: {
          plugins: [createPinia()],
        },
      })
      wrapper.unmount()
    }
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0
    const memoryIncrease = finalMemory - initialMemory
    
    if (performance.memory) {
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
    }
  })

  it('should handle large product list efficiently', () => {
    const products = Array.from({ length: 100 }, (_, i) => ({
      ...mockProduct,
      id: i + 1,
      productName: `商品${i + 1}`
    }))
    
    const startTime = performance.now()
    
    const wrappers = products.map(product => 
      mount(ProductCard, {
        props: { product },
        global: {
          plugins: [createPinia()],
        },
      })
    )
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    expect(renderTime).toBeLessThan(1000)
    
    wrappers.forEach(wrapper => wrapper.unmount())
  })
})
