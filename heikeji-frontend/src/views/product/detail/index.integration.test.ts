import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import ProductDetail from '@/views/product/detail/index.vue'
import ProductCard from '@/components/business/ProductCard.vue'
import { useCartStore } from '@/store/modules/cart'
import { useProductStore } from '@/store/modules/product'

vi.mock('@/components/business/ProductCard.vue', () => ({
  name: 'ProductCard',
  template: '<div class="product-card-mock">ProductCard</div>'
}))

describe('商品详情集成测试', () => {
  let pinia: any
  let router: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/product/detail/:id', component: ProductDetail }
      ]
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('应该正确显示商品详情', async () => {
    const productStore = useProductStore()
    const mockProduct = {
      id: 1,
      productName: '测试商品',
      productCode: 'P001',
      price: 99.99,
      originalPrice: 129.99,
      stock: 100,
      sales: 50,
      coverImage: 'http://example.com/product.jpg',
      description: '这是一个测试商品',
      status: 1,
      publishStatus: 1
    }
    
    productStore.setCurrentProduct(mockProduct)
    
    await router.push('/product/detail/1')
    
    const wrapper = mount(ProductDetail, {
      global: {
        plugins: [pinia, router],
      },
    })
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.product-detail').exists()).toBe(true)
    expect(wrapper.text()).toContain('测试商品')
    expect(wrapper.text()).toContain('99.99')
    expect(wrapper.text()).toContain('129.99')
  })

  it('应该支持添加商品到购物车', async () => {
    const productStore = useProductStore()
    const cartStore = useCartStore()
    const mockProduct = {
      id: 1,
      productName: '测试商品',
      price: 99.99,
      stock: 100
    }
    
    productStore.setCurrentProduct(mockProduct)
    
    await router.push('/product/detail/1')
    
    const wrapper = mount(ProductDetail, {
      global: {
        plugins: [pinia, router],
      },
    })
    
    await wrapper.vm.$nextTick()
    
    const addToCartBtn = wrapper.find('.add-to-cart-btn')
    await addToCartBtn.trigger('click')
    
    expect(cartStore.cartItems.length).toBe(1)
    expect(cartStore.cartItems[0]).toEqual(expect.objectContaining({
      productId: 1,
      quantity: 1
    }))
  })

  it('应该支持修改购买数量', async () => {
    const productStore = useProductStore()
    const cartStore = useCartStore()
    const mockProduct = {
      id: 1,
      productName: '测试商品',
      price: 99.99,
      stock: 100
    }
    
    productStore.setCurrentProduct(mockProduct)
    
    await router.push('/product/detail/1')
    
    const wrapper = mount(ProductDetail, {
      global: {
        plugins: [pinia, router],
      },
    })
    
    await wrapper.vm.$nextTick()
    
    const quantityInput = wrapper.find('.quantity-input')
    await quantityInput.setValue(5)
    
    const addToCartBtn = wrapper.find('.add-to-cart-btn')
    await addToCartBtn.trigger('click')
    
    expect(cartStore.cartItems[0].quantity).toBe(5)
  })

  it('应该支持立即购买', async () => {
    const productStore = useProductStore()
    const cartStore = useCartStore()
    const mockProduct = {
      id: 1,
      productName: '测试商品',
      price: 99.99,
      stock: 100
    }
    
    productStore.setCurrentProduct(mockProduct)
    
    await router.push('/product/detail/1')
    
    const wrapper = mount(ProductDetail, {
      global: {
        plugins: [pinia, router],
      },
    })
    
    await wrapper.vm.$nextTick()
    
    const buyNowBtn = wrapper.find('.buy-now-btn')
    await buyNowBtn.trigger('click')
    
    expect(router.currentRoute.value.path).toBe('/app/order/confirm')
  })

  it('应该显示商品评价', async () => {
    const productStore = useProductStore()
    const mockProduct = {
      id: 1,
      productName: '测试商品',
      price: 99.99,
      stock: 100,
      reviews: [
        {
          id: 1,
          userId: 1,
          username: '用户1',
          rating: 5,
          content: '商品很好',
          createTime: '2024-03-04 10:00:00'
        },
        {
          id: 2,
          userId: 2,
          username: '用户2',
          rating: 4,
          content: '性价比高',
          createTime: '2024-03-03 15:00:00'
        }
      ]
    }
    
    productStore.setCurrentProduct(mockProduct)
    
    await router.push('/product/detail/1')
    
    const wrapper = mount(ProductDetail, {
      global: {
        plugins: [pinia, router],
      },
    })
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.product-reviews').exists()).toBe(true)
    expect(wrapper.text()).toContain('商品很好')
    expect(wrapper.text()).toContain('性价比高')
  })

  it('应该显示推荐商品', async () => {
    const productStore = useProductStore()
    const mockProduct = {
      id: 1,
      productName: '测试商品',
      price: 99.99,
      stock: 100
    }
    
    const recommendedProducts = [
      { id: 2, productName: '推荐商品1', price: 89.99, stock: 50 },
      { id: 3, productName: '推荐商品2', price: 79.99, stock: 30 },
      { id: 4, productName: '推荐商品3', price: 69.99, stock: 20 }
    ]
    
    productStore.setCurrentProduct(mockProduct)
    productStore.setProducts(recommendedProducts)
    
    await router.push('/product/detail/1')
    
    const wrapper = mount(ProductDetail, {
      global: {
        plugins: [pinia, router],
      },
    })
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.recommended-products').exists()).toBe(true)
    expect(wrapper.text()).toContain('推荐商品1')
    expect(wrapper.text()).toContain('推荐商品2')
    expect(wrapper.text()).toContain('推荐商品3')
  })

  it('应该支持收藏商品', async () => {
    const productStore = useProductStore()
    const mockProduct = {
      id: 1,
      productName: '测试商品',
      price: 99.99,
      stock: 100
    }
    
    productStore.setCurrentProduct(mockProduct)
    
    await router.push('/product/detail/1')
    
    const wrapper = mount(ProductDetail, {
      global: {
        plugins: [pinia, router],
      },
    })
    
    await wrapper.vm.$nextTick()
    
    const favoriteBtn = wrapper.find('.favorite-btn')
    await favoriteBtn.trigger('click')
    
    expect(favoriteBtn.classes()).toContain('active')
  })

  it('应该显示库存状态', async () => {
    const productStore = useProductStore()
    const inStockProduct = {
      id: 1,
      productName: '有货商品',
      price: 99.99,
      stock: 100
    }
    
    productStore.setCurrentProduct(inStockProduct)
    
    await router.push('/product/detail/1')
    
    const wrapper = mount(ProductDetail, {
      global: {
        plugins: [pinia, router],
      },
    })
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.in-stock').exists()).toBe(true)
    expect(wrapper.find('.out-of-stock').exists()).toBe(false)
  })

  it('应该显示缺货状态', async () => {
    const productStore = useProductStore()
    const outOfStockProduct = {
      id: 1,
      productName: '缺货商品',
      price: 99.99,
      stock: 0
    }
    
    productStore.setCurrentProduct(outOfStockProduct)
    
    await router.push('/product/detail/1')
    
    const wrapper = mount(ProductDetail, {
      global: {
        plugins: [pinia, router],
      },
    })
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.out-of-stock').exists()).toBe(true)
    expect(wrapper.find('.in-stock').exists()).toBe(false)
  })
})
