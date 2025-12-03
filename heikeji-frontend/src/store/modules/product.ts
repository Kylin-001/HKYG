import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import * as productApi from '@/api/product'

// 商品信息接口定义
interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice: number
  categoryId: number
  categoryName: string
  brandId: number
  brandName: string
  images: string[]
  mainImage: string
  skuList: ProductSku[]
  status: number
  salesVolume: number
  stock: number
  isNew: boolean
  isHot: boolean
  createTime: string
  updateTime: string
}

// 商品SKU接口定义
interface ProductSku {
  id: number
  productId: number
  skuName: string
  skuAttrs: string
  price: number
  stock: number
  sales: number
}

// 商品分类接口定义
interface ProductCategory {
  id: number
  name: string
  parentId: number
  level: number
  sort: number
  icon?: string
  status: number
  children?: ProductCategory[]
}

// 定义product store的状态类型
interface ProductState {
  products: Product[]
  currentProduct: Product | null
  categories: ProductCategory[]
  total: number
  loading: boolean
  error: string | null
  filterParams: {
    keyword: string
    categoryId: number
    brandId: number
    status: number
    isNew: boolean
    isHot: boolean
  }
}

// 创建并导出product store
export const useProductStore = defineStore('product', () => {
  // 状态定义
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const categories = ref<ProductCategory[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filterParams = ref({
    keyword: '',
    categoryId: 0,
    brandId: 0,
    status: 0,
    isNew: false,
    isHot: false,
  })

  // 计算属性
  const productList = computed(() => products.value)
  const productCount = computed(() => total.value)
  const hasProducts = computed(() => products.value.length > 0)
  const isProductLoading = computed(() => loading.value)

  // 方法 - 获取商品列表
  async function getProductList(page: number = 1, limit: number = 10) {
    try {
      loading.value = true
      error.value = null

      const params = {
        ...filterParams.value,
        page,
        limit,
      }

      const res = await productApi.getProductList(params)
      products.value = res.data.records
      total.value = res.data.total

      return res
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取商品列表失败'
      ElMessage.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 方法 - 获取商品详情
  async function getProductDetail(id: number) {
    try {
      loading.value = true
      error.value = null

      const res = await productApi.getProductDetail(id)
      currentProduct.value = res.data

      return res
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取商品详情失败'
      ElMessage.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 方法 - 添加商品
  async function addProduct(productData: Partial<Product>) {
    try {
      loading.value = true
      error.value = null

      const res = await productApi.addProduct(productData)
      ElMessage.success('添加商品成功')

      return res
    } catch (err) {
      error.value = err instanceof Error ? err.message : '添加商品失败'
      ElMessage.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 方法 - 更新商品
  async function updateProduct(id: number, productData: Partial<Product>) {
    try {
      loading.value = true
      error.value = null

      const res = await productApi.updateProduct(id, productData)
      ElMessage.success('更新商品成功')

      // 更新本地数据
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = { ...products.value[index], ...productData }
      }
      if (currentProduct.value?.id === id) {
        currentProduct.value = { ...currentProduct.value, ...productData }
      }

      return res
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新商品失败'
      ElMessage.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 方法 - 删除商品
  async function deleteProduct(id: number) {
    try {
      loading.value = true
      error.value = null

      const res = await productApi.deleteProduct(id)
      ElMessage.success('删除商品成功')

      // 更新本地数据
      products.value = products.value.filter(p => p.id !== id)
      total.value--
      if (currentProduct.value?.id === id) {
        currentProduct.value = null
      }

      return res
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除商品失败'
      ElMessage.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 方法 - 获取商品分类
  async function getProductCategories() {
    try {
      loading.value = true
      error.value = null

      const res = await productApi.getProductCategories()
      categories.value = res.data

      return res
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取商品分类失败'
      ElMessage.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 方法 - 设置过滤参数
  function setFilterParams(params: Partial<typeof filterParams.value>) {
    filterParams.value = { ...filterParams.value, ...params }
  }

  // 方法 - 重置过滤参数
  function resetFilterParams() {
    filterParams.value = {
      keyword: '',
      categoryId: 0,
      brandId: 0,
      status: 0,
      isNew: false,
      isHot: false,
    }
  }

  // 方法 - 重置商品状态
  function resetProductState() {
    products.value = []
    currentProduct.value = null
    total.value = 0
    error.value = null
    resetFilterParams()
  }

  // 导出状态、计算属性和方法
  return {
    // 状态
    products,
    currentProduct,
    categories,
    total,
    loading,
    error,
    filterParams,
    // 计算属性
    productList,
    productCount,
    hasProducts,
    isProductLoading,
    // 方法
    getProductList,
    getProductDetail,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductCategories,
    setFilterParams,
    resetFilterParams,
    resetProductState,
  }
})
