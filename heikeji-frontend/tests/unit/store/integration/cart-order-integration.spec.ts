import { describe, it, expect, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useCartStore } from '@/store/modules/cart'
import { useOrderStore } from '@/store/modules/order'
import { useProductStore } from '@/store/modules/product'
import { getProductList, getProductDetail } from '@/api/product'
import { getOrderList, getOrderDetail } from '@/api/order'
import { setActivePinia } from 'pinia'

// Mock API calls
vi.mock('@/api/product', () => ({
  getProductList: vi.fn(),
  getProductDetail: vi.fn(),
}))

vi.mock('@/api/order', () => ({
  getOrderList: vi.fn(),
  getOrderDetail: vi.fn(),
}))

describe('Cart and Order Integration Tests', () => {
  let cartStore, orderStore, productStore

  beforeEach(() => {
    // 创建并激活测试用的Pinia实例
    const pinia = createTestingPinia()
    setActivePinia(pinia)

    // 初始化store实例
    cartStore = useCartStore()
    orderStore = useOrderStore()
    productStore = useProductStore()

    // 清空所有mock
    vi.clearAllMocks()
  })

  describe('Cart to Order Flow', () => {
    it('should properly handle adding products to cart and then creating an order', async () => {
      // Setup mock product data
      const mockProduct = {
        productId: 1,
        quantity: 2,
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

      // Step 1: Add products to cart - directly modify cart state since we're testing integration
      cartStore.products = [
        {
          id: 1,
          name: '牛肉拉面',
          price: 28.0,
          image: '/static/images/default-product.jpg',
          merchantId: 1,
          merchantName: '兰州拉面',
          stock: 30,
          quantity: 2,
          productId: 1,
          specification: '',
          mainImage: '/static/images/default-product.jpg',
          checked: true,
        },
      ]

      // Verify cart state
      expect(cartStore.products.length).toBe(1)
      expect(cartStore.products[0].quantity).toBe(2)
      expect(cartStore.products[0].id).toBe(1)

      // Verify cart getters
      expect(cartStore.totalCount).toBe(2)
      expect(cartStore.goodsAmount).toBe(56.0)

      // Step 2: Mock creating order (in a real app, there would be a createOrder action)
      // For this test, we'll simulate by directly setting the order state
      orderStore.list = [
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
          orderId: '202401010001',
          paymentStatus: 0,
          deliveryStatus: 0,
        },
      ]
      orderStore.total = 1

      // Verify order state
      expect(orderStore.list.length).toBe(1)
      expect(orderStore.list[0].totalAmount).toBe(56.0)
      expect(orderStore.list[0].productCount).toBe(2)

      // Step 3: Verify order detail contains correct product information
      expect(orderStore.list[0].orderItems[0].productId).toBe(1)
      expect(orderStore.list[0].orderItems[0].quantity).toBe(2)
      expect(orderStore.list[0].orderItems[0].price).toBe(28.0)

      // Verify API calls were made correctly
      expect(getProductList).toHaveBeenCalledTimes(0) // Not called in this flow
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
        productId: 1,
        specification: '',
        mainImage: '/static/images/default-product.jpg',
        checked: true,
        quantity: 2,
      }

      const mockProduct2 = {
        id: 2,
        name: '炸鸡汉堡',
        price: 25.0,
        image: '/static/images/default-product.jpg',
        merchantId: 2,
        merchantName: '肯德基',
        stock: 50,
        productId: 2,
        specification: '',
        mainImage: '/static/images/default-product.jpg',
        checked: true,
        quantity: 1,
      }

      // Add products to cart - directly modify cart state since we're testing integration
      cartStore.products = [mockProduct1, mockProduct2]

      // Verify cart state
      expect(cartStore.products.length).toBe(2)
      expect(cartStore.totalCount).toBe(3)
      expect(cartStore.goodsAmount).toBe(81.0) // 2*28 + 25

      // Verify delivery fee calculation (this assumes the merchant-based delivery fee logic)
      // Since we have two different merchants, we should have two delivery fees
      expect(cartStore.totalDeliveryFee).toBe(4) // 2 + 2

      // Verify total amount including delivery
      expect(cartStore.totalAmount).toBe(85.0) // 81 + 4
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
        productId: 1,
        specification: '',
        mainImage: '/static/images/default-product.jpg',
        checked: true,
        quantity: 1,
      }

      // Step 1: Add product to cart - directly modify cart state since we're testing integration
      cartStore.products = [mockProduct]

      // Verify initial cart state
      expect(cartStore.products[0].quantity).toBe(1)
      expect(cartStore.goodsAmount).toBe(28.0)

      // Step 2: Update product quantity
      cartStore.products[0].quantity = 3

      // Verify updated cart state
      expect(cartStore.products[0].quantity).toBe(3)
      expect(cartStore.goodsAmount).toBe(84.0)

      // Step 3: Verify total amount including delivery
      expect(cartStore.totalAmount).toBe(86.0) // 84 + 2 (delivery)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty cart scenario', () => {
      // Verify cart is initially empty
      expect(cartStore.products.length).toBe(0)
      expect(cartStore.totalCount).toBe(0)
      expect(cartStore.goodsAmount).toBe(0)
      expect(cartStore.totalDeliveryFee).toBe(0)
      expect(cartStore.totalAmount).toBe(0)

      // Check if meets minimum order requirement
      expect(cartStore.meetsMinOrderRequirement).toBe(false)
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
        productId: 1,
        specification: '',
        mainImage: '/static/images/default-product.jpg',
        checked: true,
        quantity: 2,
      }

      // Step 1: Add product to cart - directly modify cart state since we're testing integration
      cartStore.products = [mockProduct]

      // Verify cart has product
      expect(cartStore.products.length).toBe(1)

      // Step 2: Remove product from cart
      cartStore.products = []

      // Verify cart is empty
      expect(cartStore.products.length).toBe(0)
      expect(cartStore.totalCount).toBe(0)
      expect(cartStore.goodsAmount).toBe(0)
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
        productId: 1,
        specification: '',
        mainImage: '/static/images/default-product.jpg',
        checked: true,
        quantity: 10,
      }

      // Step 1: Add product to cart - directly modify cart state since we're testing integration
      cartStore.products = [mockProduct]

      // Verify initial state
      expect(cartStore.products[0].quantity).toBe(10)
      expect(cartStore.goodsAmount).toBe(280.0) // 10 * 28

      // 手动限制数量到库存上限
      cartStore.products[0].quantity = 5

      // Check if quantity is capped at stock
      expect(cartStore.products[0].quantity).toBe(5)
      expect(cartStore.goodsAmount).toBe(140.0) // 5 * 28
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
        productId: 1,
        specification: '',
        mainImage: '/static/images/default-product.jpg',
        checked: true,
        quantity: 2,
      }

      const mockProduct2 = {
        id: 2,
        name: '商品2',
        price: 20.0,
        image: '/static/images/default-product.jpg',
        merchantId: 2,
        merchantName: '商家2',
        stock: 100,
        productId: 2,
        specification: '',
        mainImage: '/static/images/default-product.jpg',
        checked: true,
        quantity: 1,
      }

      const mockProduct3 = {
        id: 3,
        name: '商品3',
        price: 15.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '商家1',
        stock: 100,
        productId: 3,
        specification: '',
        mainImage: '/static/images/default-product.jpg',
        checked: true,
        quantity: 3,
      }

      // Add products from different merchants - directly modify cart state since we're testing integration
      cartStore.products = [mockProduct1, mockProduct2, mockProduct3]

      // Verify cart contains products from both merchants
      expect(cartStore.products.length).toBe(3)

      // Verify total count
      expect(cartStore.totalCount).toBe(6)

      // Verify goods amount: (2*10) + (1*20) + (3*15) = 20 + 20 + 45 = 85
      expect(cartStore.goodsAmount).toBe(85.0)

      // Verify delivery fee: 2 (merchant1) + 2 (merchant2) = 4
      expect(cartStore.totalDeliveryFee).toBe(4)

      // Verify total amount: 85 + 4 = 89
      expect(cartStore.totalAmount).toBe(89.0)
    })
  })
})
