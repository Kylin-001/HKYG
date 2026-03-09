import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { testUserData } from '@/config/test';
import { productApi } from './product'

// Mock request
vi.mock('@/utils/request', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({
      code: 20000,
      data: {
        records: [
          {
            id: 1,
            name: '测试商品',
            description: '这是一个测试商品',
            price: 100,
            originalPrice: 150,
            discount: 0.2,
            stock: 100,
            sales: 50,
            categoryId: 1,
            images: ['http://example.com/image1.jpg'],
            status: 1,
            attributes: { color: '红色', size: 'L' },
          }
        ],
        total: 1,
        current: 1,
        size: 10,
        pages: 1,
      }
    })),
    post: vi.fn(() => Promise.resolve({
      code: 20000,
      data: { success: true }
    })),
    put: vi.fn(() => Promise.resolve({
      code: 20000,
      data: { success: true }
    })),
    delete: vi.fn(() => Promise.resolve({
      code: 20000,
      data: { success: true }
    })),
    upload: vi.fn(() => Promise.resolve({
      code: 20000,
      data: { url: 'http://example.com/uploaded.jpg' }
    })),
  },
}))

describe('Product API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should get product list correctly', async () => {
    const params = { page: 1, pageSize: 10, keyword: '测试' }
    
    const result = await productApi.getProductList(params)
    
    expect(result.data.records).toHaveLength(1)
    expect(result.data.records[0]).toMatchObject({
      id: 1,
      name: '测试商品',
      price: 100,
    })
  })

  it('should get product detail correctly', async () => {
    const productId = 1
    
    const result = await productApi.getProductDetail(productId)
    
    expect(result.data).toMatchObject({
      id: 1,
      name: '测试商品',
      description: '这是一个测试商品',
      price: 100,
    })
  })

  it('should create product correctly', async () => {
    const productData = {
      name: '新商品',
      description: '这是一个新商品',
      price: 200,
      categoryId: 1,
      images: ['http://example.com/image1.jpg'],
      attributes: { color: '蓝色', size: 'M' },
    }
    
    const result = await productApi.createProduct(productData)
    
    expect(result.data.success).toBe(true)
  })

  it('should update product correctly', async () => {
    const productData = {
      id: 1,
      name: '更新的商品',
      description: '这是一个更新的商品',
      price: 150,
      categoryId: 1,
    }
    
    const result = await productApi.updateProduct(productData)
    
    expect(result.data.success).toBe(true)
  })

  it('should delete product correctly', async () => {
    const productId = 1
    
    const result = await productApi.deleteProduct(productId)
    
    expect(result.data.success).toBe(true)
  })

  it('should change product status correctly', async () => {
    const productId = 1
    const status = 2
    
    const result = await productApi.changeStatus(productId, status)
    
    expect(result.data.success).toBe(true)
  })

  it('should publish product correctly', async () => {
    const productIds = [1, 2, 3]
    
    const result = await productApi.publishProduct(productIds)
    
    expect(result.data.success).toBe(true)
  })

  it('should offline product correctly', async () => {
    const productIds = [1, 2, 3]
    
    const result = await productApi.offlineProduct(productIds)
    
    expect(result.data.success).toBe(true)
  })

  it('should get category tree correctly', async () => {
    const result = await productApi.getCategoryTree()
    
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
  })

  it('should get category list correctly', async () => {
    const params = { page: 1, pageSize: 10 }
    
    const result = await productApi.getCategoryList(params)
    
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
  })

  it('should create category correctly', async () => {
    const categoryData = {
      name: '新分类',
      parentId: 0,
      sort: 1,
    }
    
    const result = await productApi.createCategory(categoryData)
    
    expect(result.data.success).toBe(true)
  })

  it('should update category correctly', async () => {
    const categoryData = {
      id: 1,
      name: '更新的分类',
      sort: 2,
    }
    
    const result = await productApi.updateCategory(categoryData)
    
    expect(result.data.success).toBe(true)
  })

  it('should delete category correctly', async () => {
    const categoryId = 1
    
    const result = await productApi.deleteCategory(categoryId)
    
    expect(result.data.success).toBe(true)
  })

  it('should upload image correctly', async () => {
    const formData = new FormData()
    formData.append('file', new Blob(['test']))
    
    const result = await productApi.uploadImage(formData)
    
    expect(result.data.url).toBe('http://example.com/uploaded.jpg')
  })

  it('should get recommend products correctly', async () => {
    const limit = 10
    
    const result = await productApi.getRecommendProducts(limit)
    
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
  })

  it('should get personalized recommendations correctly', async () => {
    const userId = 1
    const limit = 10
    
    const result = await productApi.getPersonalizedRecommendations(userId, limit)
    
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
  })

  it('should get similar products correctly', async () => {
    const productId = 1
    const limit = 10
    
    const result = await productApi.getSimilarProducts(productId, limit)
    
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
  })

  it('should get hot products correctly', async () => {
    const limit = 10
    
    const result = await productApi.getHotProducts(limit)
    
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
  })

  it('should record user behavior correctly', async () => {
    const behaviorData = {
      productId: 1,
      behaviorType: 'view',
      duration: 5000,
    }
    
    const result = await productApi.recordUserBehavior(behaviorData)
    
    expect(result.data.success).toBe(true)
  })

  it('should get recommend reason correctly', async () => {
    const userId = 1
    const productId = 1
    
    const result = await productApi.getRecommendReason(userId, productId)
    
    expect(result.data).toBeDefined()
  })

  it('should search products correctly', async () => {
    const params = { keyword: '测试商品', page: 1, limit: 10 }
    
    const result = await productApi.searchProducts(params)
    
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
  })

  it('should get brands correctly', async () => {
    const params = { page: 1, pageSize: 10 }
    
    const result = await productApi.getBrands(params)
    
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
  })

  it('should create brand correctly', async () => {
    const brandData = {
      name: '新品牌',
      logo: 'http://example.com/logo.jpg',
      status: 1,
    }
    
    const result = await productApi.createBrand(brandData)
    
    expect(result.data.success).toBe(true)
  })

  it('should update brand correctly', async () => {
    const brandData = {
      id: 1,
      name: '更新的品牌',
      status: 2,
    }
    
    const result = await productApi.updateBrand(brandData)
    
    expect(result.data.success).toBe(true)
  })

  it('should delete brand correctly', async () => {
    const brandId = 1
    
    const result = await productApi.deleteBrand(brandId)
    
    expect(result.data.success).toBe(true)
  })

  it('should update brand status correctly', async () => {
    const data = {
      id: 1,
      status: true,
    }
    
    const result = await productApi.updateBrandStatus(data)
    
    expect(result.data.success).toBe(true)
  })

  it('should upload brand logo correctly', async () => {
    const formData = new FormData()
    formData.append('file', new Blob(['test']))
    
    const result = await productApi.uploadBrandLogo(formData)
    
    expect(result.data.url).toBe('http://example.com/uploaded.jpg')
  })

  it('should handle API error correctly', async () => {
    const mockError = new Error('Network error')
    ;(productApi.deleteProduct as any).mockRejectedValue(mockError)
    
    await expect(productApi.deleteProduct(1)).rejects.toThrow()
  })
})