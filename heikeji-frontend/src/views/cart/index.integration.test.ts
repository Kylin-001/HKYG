import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import Cart from '@/views/cart/index.vue'
import ProductCard from '@/components/business/ProductCard.vue'
import { useCartStore } from '@/store/modules/cart'
import { mockProduct, outOfStockProduct } from '@/test/test-data'

vi.mock('@/components/business/ProductCard.vue', () => ({
  name: 'ProductCard',
  template: '<div class="product-card-mock">ProductCard</div>',
}))

describe('购物车集成测试', () => {
  let pinia: any
  let router: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/app/cart', component: Cart }],
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('应该正确显示购物车中的商品', async () => {
    const cartStore = useCartStore()
    const mockProduct = {
      id: 1,
      productName: '测试商品',
      price: 99.99,
      stock: 100,
    }

    cartStore.addProduct({ productId: mockProduct.id, quantity: 2 })

    const wrapper = mount(Cart, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.cart-list').exists()).toBe(true)
    expect(wrapper.text()).toContain('测试商品')
    expect(wrapper.text()).toContain('99.99')
  })

  it('应该正确计算购物车总价', async () => {
    const cartStore = useCartStore()

    cartStore.addProduct({ productId: 1, quantity: 2 })
    cartStore.addProduct({ productId: 2, quantity: 3 })

    const wrapper = mount(Cart, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.vm.$nextTick()

    const totalPrice = wrapper.find('.total-price').text()
    expect(totalPrice).toContain('350.00')
  })

  it('应该支持从购物车跳转到商品详情', async () => {
    const cartStore = useCartStore()
    const mockProduct = {
      id: 1,
      productName: '测试商品',
      price: 99.99,
      stock: 100,
    }

    cartStore.addProduct({ productId: mockProduct.id, quantity: 1 })

    const wrapper = mount(Cart, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.vm.$nextTick()

    const productCard = wrapper.findComponent(ProductCard)
    await productCard.trigger('click')

    expect(router.currentRoute.value.path).toBe('/product/detail/1')
  })

  it('应该支持从购物车直接结算', async () => {
    const cartStore = useCartStore()
    const mockProduct = {
      id: 1,
      productName: '测试商品',
      price: 99.99,
      stock: 100,
    }

    cartStore.addProduct({ productId: mockProduct.id, quantity: 1 })

    const wrapper = mount(Cart, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.vm.$nextTick()

    const checkoutBtn = wrapper.find('.checkout-btn')
    await checkoutBtn.trigger('click')

    expect(router.currentRoute.value.path).toBe('/app/order/confirm')
  })

  it('应该支持修改商品数量', async () => {
    const cartStore = useCartStore()
    const mockProduct = {
      id: 1,
      productName: '测试商品',
      price: 99.99,
      stock: 100,
    }

    cartStore.addProduct({ productId: mockProduct.id, quantity: 1 })

    const wrapper = mount(Cart, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.vm.$nextTick()

    const increaseBtn = wrapper.find('.increase-btn')
    await increaseBtn.trigger('click')

    expect(cartStore.products[0].quantity).toBe(2)
  })

  it('应该支持删除商品', async () => {
    const cartStore = useCartStore()
    const mockProduct = {
      id: 1,
      productName: '测试商品',
      price: 99.99,
      stock: 100,
    }

    cartStore.addProduct({ productId: mockProduct.id, quantity: 1 })

    const wrapper = mount(Cart, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.vm.$nextTick()

    const deleteBtn = wrapper.find('.delete-btn')
    await deleteBtn.trigger('click')

    expect(cartStore.products.length).toBe(0)
  })

  it('应该支持清空购物车', async () => {
    const cartStore = useCartStore()

    cartStore.addProduct({ productId: 1, quantity: 1 })
    cartStore.addProduct({ productId: 2, quantity: 1 })

    const wrapper = mount(Cart, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.vm.$nextTick()

    const clearBtn = wrapper.find('.clear-cart-btn')
    await clearBtn.trigger('click')

    expect(cartStore.products.length).toBe(0)
  })

  it('应该显示库存不足提示', async () => {
    const cartStore = useCartStore()
    const outOfStockProduct = {
      id: 1,
      productName: '缺货商品',
      price: 99.99,
      stock: 0,
    }

    cartStore.addProduct({ productId: outOfStockProduct.id, quantity: 1 })

    const wrapper = mount(Cart, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.out-of-stock').exists()).toBe(true)
  })

  it('应该正确应用优惠券', async () => {
    const cartStore = useCartStore()
    const mockProduct = {
      id: 1,
      productName: '测试商品',
      price: 100,
      stock: 100,
    }

    cartStore.addProduct({ productId: mockProduct.id, quantity: 2 })

    const wrapper = mount(Cart, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.vm.$nextTick()

    const couponInput = wrapper.find('.coupon-input')
    await couponInput.setValue('SAVE10')

    const applyBtn = wrapper.find('.apply-coupon-btn')
    await applyBtn.trigger('click')

    const discountInfo = wrapper.find('.discount-info')
    expect(discountInfo.text()).toContain('20.00')
  })
})
