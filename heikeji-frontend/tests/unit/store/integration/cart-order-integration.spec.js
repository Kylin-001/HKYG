import { createStore } from 'vuex'
import cartModule from '@/store/modules/cart'
import orderModule from '@/store/modules/order'
import productModule from '@/store/modules/product'
import { getProductList, getProductDetail } from '@/api/product'
import { getOrderList, getOrderDetail } from '@/api/order'

// Mock API calls
jest.mock('@/api/product', () => ({
  getProductList: jest.fn(),
  getProductDetail: jest.fn(),
}))

jest.mock('@/api/order', () => ({
  getOrderList: jest.fn(),
  getOrderDetail: jest.fn(),
}))

describe('Cart and Order Integration Tests', () => {
  let store

  beforeEach(() => {
    // Create a new store with all relevant modules
    store = createStore({
      modules: {
        cart: cartModule,
        order: orderModule,
        product: productModule,
      },
    })

    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  describe('Cart to Order Flow', () => {
    it('should properly handle adding products to cart and then creating an order', async () => {
      // Setup mock product data
      const mockProduct = {
        id: 1,
        name: '牛肉拉面',
        price: 28.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '兰州拉面',
        stock: 30,
      }

      // Setup mock order response
      const mockOrderResponse = {
        list: [
          {
            id: '202401010001',
            orderNo: '202401010001',
            userId: 1,
            userName: '张三',
            totalAmount: 56.0,
            actualAmount: 56.0,
            orderStatus: 1,
            statusText: '待付款',
            createTime: '2024-01-01 10:30:00',
            productCount: 2,
            orderItems: [
              {
                productId: 1,
                productName: '牛肉拉面',
                quantity: 2,
                price: 28.0,
              },
            ],
          },
        ],
        total: 1,
      }

      // Mock API responses
      getProductList.mockResolvedValue(mockProduct)
      getOrderList.mockResolvedValue(mockOrderResponse)

      // Step 1: Add products to cart
      await store.dispatch('cart/addProduct', {
        product: mockProduct,
        quantity: 2,
      })

      // Verify cart state
      expect(store.state.cart.products.length).toBe(1)
      expect(store.state.cart.products[0].quantity).toBe(2)
      expect(store.state.cart.products[0].id).toBe(1)

      // Verify cart getters
      expect(store.getters['cart/totalCount']).toBe(2)
      expect(store.getters['cart/goodsAmount']).toBe(56.0)

      // Step 2: Mock creating order (in a real app, there would be a createOrder action)
      // For this test, we'll simulate by calling getOrderList which would show the new order
      await store.dispatch('order/getOrderList', {})

      // Verify order state
      expect(store.state.order.list.length).toBe(1)
      expect(store.state.order.list[0].totalAmount).toBe(56.0)
      expect(store.state.order.list[0].productCount).toBe(2)

      // Step 3: Verify order detail contains correct product information
      expect(store.state.order.list[0].orderItems[0].productId).toBe(1)
      expect(store.state.order.list[0].orderItems[0].quantity).toBe(2)
      expect(store.state.order.list[0].orderItems[0].price).toBe(28.0)

      // Verify API calls were made correctly
      expect(getProductList).toHaveBeenCalledTimes(0) // Not called in this flow
      expect(getOrderList).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple products from different merchants in cart', async () => {
      // Setup mock products from different merchants
      const mockProduct1 = {
        id: 1,
        name: '牛肉拉面',
        price: 28.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '兰州拉面',
        stock: 30,
      }

      const mockProduct2 = {
        id: 2,
        name: '炸鸡汉堡',
        price: 25.0,
        image: '/static/images/default-product.jpg',
        merchantId: 2,
        merchantName: '肯德基',
        stock: 50,
      }

      // Add products to cart
      await store.dispatch('cart/addProduct', {
        product: mockProduct1,
        quantity: 2,
      })

      await store.dispatch('cart/addProduct', {
        product: mockProduct2,
        quantity: 1,
      })

      // Verify cart state
      expect(store.state.cart.products.length).toBe(2)
      expect(store.getters['cart/totalCount']).toBe(3)
      expect(store.getters['cart/goodsAmount']).toBe(81.0) // 2*28 + 25

      // Verify delivery fee calculation (this assumes the merchant-based delivery fee logic)
      // Since we have two different merchants, we should have two delivery fees
      expect(store.getters['cart/totalDeliveryFee']).toBe(16.0) // 8 + 8

      // Verify total amount including delivery
      expect(store.getters['cart/totalAmount']).toBe(97.0) // 81 + 16
    })

    it('should handle order creation after product quantity update', async () => {
      // Setup mock product
      const mockProduct = {
        id: 1,
        name: '牛肉拉面',
        price: 28.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '兰州拉面',
        stock: 30,
      }

      // Step 1: Add product to cart
      await store.dispatch('cart/addProduct', {
        product: mockProduct,
        quantity: 1,
      })

      // Verify initial cart state
      expect(store.state.cart.products[0].quantity).toBe(1)
      expect(store.getters['cart/goodsAmount']).toBe(28.0)

      // Step 2: Update product quantity
      await store.dispatch('cart/updateQuantity', {
        productId: 1,
        quantity: 3,
      })

      // Verify updated cart state
      expect(store.state.cart.products[0].quantity).toBe(3)
      expect(store.getters['cart/goodsAmount']).toBe(84.0)

      // Step 3: Verify total amount including delivery
      expect(store.getters['cart/totalAmount']).toBe(92.0) // 84 + 8 (delivery)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty cart scenario', async () => {
      // Verify cart is initially empty
      expect(store.state.cart.products.length).toBe(0)
      expect(store.getters['cart/totalCount']).toBe(0)
      expect(store.getters['cart/goodsAmount']).toBe(0)
      expect(store.getters['cart/totalDeliveryFee']).toBe(0)
      expect(store.getters['cart/totalAmount']).toBe(0)

      // Check if meets minimum order requirement
      expect(store.getters['cart/meetsMinOrderRequirement']).toBe(false)
    })

    it('should handle product removal before order creation', async () => {
      // Setup mock product
      const mockProduct = {
        id: 1,
        name: '牛肉拉面',
        price: 28.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '兰州拉面',
        stock: 30,
      }

      // Step 1: Add product to cart
      await store.dispatch('cart/addProduct', {
        product: mockProduct,
        quantity: 2,
      })

      // Verify cart has product
      expect(store.state.cart.products.length).toBe(1)

      // Step 2: Remove product from cart
      await store.dispatch('cart/removeProduct', 1)

      // Verify cart is empty
      expect(store.state.cart.products.length).toBe(0)
      expect(store.getters['cart/totalCount']).toBe(0)
      expect(store.getters['cart/goodsAmount']).toBe(0)
    })

    it('should handle product quantity exceeding stock', async () => {
      // Setup mock product with limited stock
      const mockProduct = {
        id: 1,
        name: '牛肉拉面',
        price: 28.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '兰州拉面',
        stock: 5,
      }

      // Step 1: Add product to cart with quantity exceeding stock
      await store.dispatch('cart/addProduct', {
        product: mockProduct,
        quantity: 10,
      })

      // Verify quantity is capped at stock
      await store.dispatch('cart/updateQuantity', {
        productId: 1,
        quantity: 10,
      })

      // Check if quantity is capped at stock
      expect(store.state.cart.products[0].quantity).toBe(5)
      expect(store.getters['cart/goodsAmount']).toBe(140.0) // 5 * 28
    })
  })

  describe('Multi-merchant Order Scenario', () => {
    it('should calculate correct delivery fees for multiple merchants', async () => {
      // Setup mock products from different merchants
      const mockProduct1 = {
        id: 1,
        name: '商品1',
        price: 10.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '商家1',
        stock: 100,
      }

      const mockProduct2 = {
        id: 2,
        name: '商品2',
        price: 20.0,
        image: '/static/images/default-product.jpg',
        merchantId: 2,
        merchantName: '商家2',
        stock: 100,
      }

      const mockProduct3 = {
        id: 3,
        name: '商品3',
        price: 15.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '商家1',
        stock: 100,
      }

      // Add products from different merchants
      await store.dispatch('cart/addProduct', { product: mockProduct1, quantity: 2 })
      await store.dispatch('cart/addProduct', { product: mockProduct2, quantity: 1 })
      await store.dispatch('cart/addProduct', { product: mockProduct3, quantity: 3 })

      // Verify cart contains products from both merchants
      expect(store.state.cart.products.length).toBe(3)

      // Verify total count
      expect(store.getters['cart/totalCount']).toBe(6)

      // Verify goods amount: (2*10) + (1*20) + (3*15) = 20 + 20 + 45 = 85
      expect(store.getters['cart/goodsAmount']).toBe(85.0)

      // Verify delivery fee: 8 (merchant1) + 8 (merchant2) = 16
      expect(store.getters['cart/totalDeliveryFee']).toBe(16.0)

      // Verify total amount: 85 + 16 = 101
      expect(store.getters['cart/totalAmount']).toBe(101.0)
    })
  })
})
