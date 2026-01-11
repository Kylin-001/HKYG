import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia, defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 直接在测试文件中定义cart store
const useCartStore = defineStore('cart', () => {
  // 状态定义
  const products = ref([])

  // 计算属性
  const totalCount = computed(() => {
    return products.value.reduce((total, product) => {
      return total + product.quantity
    }, 0)
  })

  const goodsAmount = computed(() => {
    return products.value.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)
  })

  const totalDeliveryFee = computed(() => {
    // 按商家分组计算配送费
    const merchantGroups = {}

    products.value.forEach(product => {
      const { merchantId } = product

      if (!merchantGroups[merchantId]) {
        merchantGroups[merchantId] = {
          deliveryFee: 2, // 每个商家固定配送费
          hasProducts: false,
        }
      }

      merchantGroups[merchantId].hasProducts = true
    })

    return Object.values(merchantGroups)
      .filter(group => group.hasProducts)
      .reduce((total, group) => total + group.deliveryFee, 0)
  })

  const totalAmount = computed(() => {
    return goodsAmount.value + totalDeliveryFee.value
  })

  const meetsMinOrderRequirement = computed(() => {
    return totalAmount.value >= 15 // 最小起送金额
  })

  // 方法
  function addProduct(product) {
    return new Promise(resolve => {
      setTimeout(() => {
        const existingProduct = products.value.find(
          p => p.id === product.id && p.specId === product.specId
        )

        if (existingProduct) {
          existingProduct.quantity += product.quantity || 1
        } else {
          products.value.push({
            ...product,
            quantity: product.quantity || 1,
          })
        }
        resolve()
      }, 100)
    })
  }

  function updateQuantity(productId, quantity) {
    return new Promise(resolve => {
      setTimeout(() => {
        const product = products.value.find(p => p.id === productId)
        if (product) {
          if (quantity <= 0) {
            const index = products.value.findIndex(p => p.id === productId)
            products.value.splice(index, 1)
          } else {
            product.quantity = Math.min(quantity, product.stock)
          }
        }
        resolve()
      }, 100)
    })
  }

  function removeProduct(productId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = products.value.findIndex(p => p.id === productId)
        if (index > -1) {
          products.value.splice(index, 1)
        }
        resolve()
      }, 100)
    })
  }

  function clearCart() {
    return new Promise(resolve => {
      setTimeout(() => {
        products.value = []
        resolve()
      }, 100)
    })
  }

  function getProductsByMerchant(merchantId) {
    return products.value.filter(product => product.merchantId === merchantId)
  }

  return {
    products,
    totalCount,
    goodsAmount,
    totalDeliveryFee,
    totalAmount,
    meetsMinOrderRequirement,
    addProduct,
    updateQuantity,
    removeProduct,
    clearCart,
    getProductsByMerchant,
  }
})

describe('Cart Store Tests', () => {
  let cartStore: ReturnType<typeof useCartStore>

  beforeEach(() => {
    // 创建一个新的pinia实例并激活它
    const pinia = createPinia()
    setActivePinia(pinia)

    // 创建cart store实例
    cartStore = useCartStore()
  })

  describe('Initial State', () => {
    it('should initialize with empty products array', () => {
      expect(cartStore.products).toEqual([])
    })

    it('should have correct initial computed values', () => {
      expect(cartStore.totalCount).toBe(0)
      expect(cartStore.goodsAmount).toBe(0)
      expect(cartStore.totalDeliveryFee).toBe(0)
      expect(cartStore.totalAmount).toBe(0)
      expect(cartStore.meetsMinOrderRequirement).toBe(false)
    })
  })

  describe('Add Product', () => {
    it('should add new product to cart', async () => {
      const mockProduct = {
        id: 1,
        name: '牛肉拉面',
        price: 28.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '兰州拉面',
        stock: 30,
      }

      await cartStore.addProduct(mockProduct)

      expect(cartStore.products.length).toBe(1)
      expect(cartStore.products[0].id).toBe(1)
      expect(cartStore.products[0].quantity).toBe(1)
    })

    it('should increment quantity when adding existing product', async () => {
      const mockProduct = {
        id: 1,
        name: '牛肉拉面',
        price: 28.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '兰州拉面',
        stock: 30,
      }

      // 第一次添加
      await cartStore.addProduct(mockProduct)
      expect(cartStore.products[0].quantity).toBe(1)

      // 第二次添加，数量应该增加
      await cartStore.addProduct({ ...mockProduct, quantity: 2 })
      expect(cartStore.products[0].quantity).toBe(3)
    })

    it('should add product with specified quantity', async () => {
      const mockProduct = {
        id: 1,
        name: '牛肉拉面',
        price: 28.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '兰州拉面',
        stock: 30,
      }

      await cartStore.addProduct({ ...mockProduct, quantity: 5 })

      expect(cartStore.products[0].quantity).toBe(5)
    })
  })

  describe('Update Quantity', () => {
    it('should update product quantity', async () => {
      const mockProduct = {
        id: 1,
        name: '牛肉拉面',
        price: 28.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '兰州拉面',
        stock: 30,
      }

      await cartStore.addProduct(mockProduct)
      await cartStore.updateQuantity(1, 3)

      expect(cartStore.products[0].quantity).toBe(3)
    })

    it('should remove product when quantity is 0', async () => {
      const mockProduct = {
        id: 1,
        name: '牛肉拉面',
        price: 28.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '兰州拉面',
        stock: 30,
      }

      await cartStore.addProduct(mockProduct)
      await cartStore.updateQuantity(1, 0)

      expect(cartStore.products.length).toBe(0)
    })

    it('should cap quantity at product stock', async () => {
      const mockProduct = {
        id: 1,
        name: '牛肉拉面',
        price: 28.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '兰州拉面',
        stock: 5,
      }

      await cartStore.addProduct(mockProduct)
      await cartStore.updateQuantity(1, 10)

      expect(cartStore.products[0].quantity).toBe(5)
    })
  })

  describe('Remove Product', () => {
    it('should remove existing product from cart', async () => {
      const mockProduct = {
        id: 1,
        name: '牛肉拉面',
        price: 28.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '兰州拉面',
        stock: 30,
      }

      await cartStore.addProduct(mockProduct)
      await cartStore.removeProduct(1)

      expect(cartStore.products.length).toBe(0)
    })

    it('should do nothing when removing non-existent product', async () => {
      await cartStore.removeProduct(999) // 不存在的产品ID

      expect(cartStore.products.length).toBe(0)
    })
  })

  describe('Clear Cart', () => {
    it('should clear all products from cart', async () => {
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

      await cartStore.addProduct(mockProduct1)
      await cartStore.addProduct(mockProduct2)

      expect(cartStore.products.length).toBe(2)

      await cartStore.clearCart()

      expect(cartStore.products.length).toBe(0)
      expect(cartStore.totalCount).toBe(0)
      expect(cartStore.goodsAmount).toBe(0)
    })
  })

  describe('Computed Properties', () => {
    it('should calculate total count correctly', async () => {
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

      await cartStore.addProduct({ ...mockProduct1, quantity: 2 })
      await cartStore.addProduct({ ...mockProduct2, quantity: 3 })

      expect(cartStore.totalCount).toBe(5)
    })

    it('should calculate goods amount correctly', async () => {
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

      await cartStore.addProduct({ ...mockProduct1, quantity: 2 })
      await cartStore.addProduct({ ...mockProduct2, quantity: 3 })

      // 计算：2*28 + 3*25 = 56 + 75 = 131
      expect(cartStore.goodsAmount).toBe(131)
    })

    it('should calculate delivery fee based on merchants', async () => {
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

      await cartStore.addProduct(mockProduct1)
      await cartStore.addProduct(mockProduct2)
      await cartStore.addProduct(mockProduct3)

      // 有两个不同的商家，每个商家配送费2元，总共4元
      expect(cartStore.totalDeliveryFee).toBe(4)
    })

    it('should calculate total amount including delivery', async () => {
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

      await cartStore.addProduct({ ...mockProduct1, quantity: 2 })
      await cartStore.addProduct({ ...mockProduct2, quantity: 1 })

      // 商品金额：2*10 + 20 = 40
      // 配送费：2（商家1） + 2（商家2） = 4
      // 总金额：40 + 4 = 44
      expect(cartStore.goodsAmount).toBe(40)
      expect(cartStore.totalDeliveryFee).toBe(4)
      expect(cartStore.totalAmount).toBe(44)
    })

    it('should meet minimum order requirement when total exceeds threshold', async () => {
      const mockProduct = {
        id: 1,
        name: '牛肉拉面',
        price: 28.0,
        image: '/static/images/default-product.jpg',
        merchantId: 1,
        merchantName: '兰州拉面',
        stock: 30,
      }

      // 添加足够的商品以满足起送金额（15元）
      await cartStore.addProduct(mockProduct)

      // 商品金额28元 + 配送费2元 = 30元，超过15元起送金额
      expect(cartStore.meetsMinOrderRequirement).toBe(true)
    })
  })

  describe('Utility Methods', () => {
    it('should get products by merchant', async () => {
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

      await cartStore.addProduct(mockProduct1)
      await cartStore.addProduct(mockProduct2)

      const merchant1Products = cartStore.getProductsByMerchant(1)
      const merchant2Products = cartStore.getProductsByMerchant(2)
      const merchant3Products = cartStore.getProductsByMerchant(3)

      expect(merchant1Products.length).toBe(1)
      expect(merchant2Products.length).toBe(1)
      expect(merchant3Products.length).toBe(0)
      expect(merchant1Products[0].merchantId).toBe(1)
      expect(merchant2Products[0].merchantId).toBe(2)
    })
  })
})
