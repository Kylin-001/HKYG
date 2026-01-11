import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as cartApi from '@/api/app/cart'

// 定义商品类型
interface Product {
  id: number
  productId: number
  productName: string
  specification: string
  price: number
  quantity: number
  stock: number
  mainImage: string
  checked: boolean
  merchantId: number
  merchantName: string
}

// 创建并导出cart store
export const useCartStore = defineStore('cart', () => {
  // 状态定义
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

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
    const merchantGroups: Record<number, { deliveryFee: number; hasProducts: boolean }> = {}

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

  // 获取购物车列表
  async function fetchCartList() {
    loading.value = true
    error.value = null
    try {
      const response = await cartApi.getCartList()
      products.value = response.data || []
    } catch (err: any) {
      error.value = err.message || '获取购物车列表失败'
      console.error('获取购物车列表失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 添加商品到购物车
  async function addProduct(product: {
    productId: number
    quantity?: number
    specification?: string
  }) {
    loading.value = true
    error.value = null
    try {
      await cartApi.addToCart(product)
      // 重新获取购物车列表
      await fetchCartList()
    } catch (err: any) {
      error.value = err.message || '添加商品到购物车失败'
      console.error('添加商品到购物车失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 更新购物车商品数量
  async function updateQuantity(cartId: number, quantity: number) {
    loading.value = true
    error.value = null
    try {
      await cartApi.updateCartQuantity({ cartId, quantity })
      // 重新获取购物车列表
      await fetchCartList()
    } catch (err: any) {
      error.value = err.message || '更新商品数量失败'
      console.error('更新商品数量失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 删除购物车商品
  async function removeProduct(cartId: number) {
    loading.value = true
    error.value = null
    try {
      await cartApi.deleteCartItems([cartId])
      // 重新获取购物车列表
      await fetchCartList()
    } catch (err: any) {
      error.value = err.message || '删除商品失败'
      console.error('删除商品失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 批量删除购物车商品
  async function deleteSelectedItems() {
    loading.value = true
    error.value = null
    try {
      const selectedIds = products.value.filter(item => item.checked).map(item => item.id)
      if (selectedIds.length > 0) {
        await cartApi.deleteCartItems(selectedIds)
        // 重新获取购物车列表
        await fetchCartList()
      }
    } catch (err: any) {
      error.value = err.message || '删除选中商品失败'
      console.error('删除选中商品失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 清空购物车
  async function clearCart() {
    loading.value = true
    error.value = null
    try {
      await cartApi.clearCart()
      products.value = []
    } catch (err: any) {
      error.value = err.message || '清空购物车失败'
      console.error('清空购物车失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 选择/取消选择商品
  async function toggleItemCheck(cartId: number, checked: boolean) {
    loading.value = true
    error.value = null
    try {
      await cartApi.checkCartItems({ cartIds: [cartId], checked })
      // 重新获取购物车列表
      await fetchCartList()
    } catch (err: any) {
      error.value = err.message || '更新商品选中状态失败'
      console.error('更新商品选中状态失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 全选/取消全选
  async function toggleAllCheck(checked: boolean) {
    loading.value = true
    error.value = null
    try {
      await cartApi.checkAllCartItems(checked)
      // 重新获取购物车列表
      await fetchCartList()
    } catch (err: any) {
      error.value = err.message || '更新全选状态失败'
      console.error('更新全选状态失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 按商家分组获取商品
  function getProductsByMerchant(merchantId: number) {
    return products.value.filter(product => product.merchantId === merchantId)
  }

  // 获取购物车商品数量
  async function fetchCartCount() {
    try {
      const response = await cartApi.getCartCount()
      return response.data || 0
    } catch (err: any) {
      console.error('获取购物车数量失败:', err)
      return totalCount.value
    }
  }

  // 导出状态、计算属性和方法
  return {
    // 状态
    products,
    loading,
    error,

    // 计算属性
    totalCount,
    goodsAmount,
    totalDeliveryFee,
    totalAmount,
    meetsMinOrderRequirement,

    // 方法
    fetchCartList,
    addProduct,
    updateQuantity,
    removeProduct,
    deleteSelectedItems,
    clearCart,
    toggleItemCheck,
    toggleAllCheck,
    getProductsByMerchant,
    fetchCartCount,
  }
})
