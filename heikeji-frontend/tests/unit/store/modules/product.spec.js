import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '@/store/modules/product'
import * as productApi from '@/api/product'

// Mock API calls
vi.mock('@/api/product', () => ({
  getProductList: vi.fn(),
  getProductDetail: vi.fn(),
  getProductCategories: vi.fn(),
  addProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}))

describe('Product Store Module', () => {
  let productStore
  let mockGetProductList
  let mockGetProductDetail
  let mockGetProductCategories

  beforeEach(() => {
    // Reset Pinia
    const pinia = createPinia()
    setActivePinia(pinia)

    // Create store instance
    productStore = useProductStore()

    // Get mocked functions
    mockGetProductList = productApi.getProductList
    mockGetProductDetail = productApi.getProductDetail
    mockGetProductCategories = productApi.getProductCategories

    // Clear all mocks
    vi.clearAllMocks()
  })

  // Test State initialization
  describe('State', () => {
    it('should have initial state with empty values', () => {
      expect(productStore.products).toEqual([])
      expect(productStore.total).toBe(0)
      expect(productStore.currentProduct).toBeNull()
      expect(productStore.categories).toEqual([])
      expect(productStore.loading).toBe(false)
      expect(productStore.error).toBeNull()
      expect(productStore.filterParams).toEqual({
        keyword: '',
        categoryId: 0,
        brandId: 0,
        status: 0,
        isNew: false,
        isHot: false,
      })
    })
  })

  // Test Getters (computed properties)
  describe('Getters', () => {
    it('should return correct computed properties', () => {
      // Initially, productList should be empty
      expect(productStore.productList).toEqual([])
      expect(productStore.productCount).toBe(0)
      expect(productStore.hasProducts).toBe(false)
      expect(productStore.isProductLoading).toBe(false)

      // Set some products
      productStore.products = [
        {
          id: 1,
          name: 'Product 1',
          price: 99.99,
          categoryId: 1,
          brandId: 1,
          status: 1,
          stock: 100,
          salesVolume: 0,
          isNew: false,
          isHot: false,
          createTime: '2024-01-01',
          updateTime: '2024-01-01',
          images: [],
          mainImage: '',
          skuList: [],
          categoryName: 'Category 1',
          brandName: 'Brand 1',
        },
        {
          id: 2,
          name: 'Product 2',
          price: 199.99,
          categoryId: 1,
          brandId: 1,
          status: 1,
          stock: 50,
          salesVolume: 0,
          isNew: true,
          isHot: true,
          createTime: '2024-01-02',
          updateTime: '2024-01-02',
          images: [],
          mainImage: '',
          skuList: [],
          categoryName: 'Category 1',
          brandName: 'Brand 1',
        },
      ]
      productStore.total = 2

      // Check computed properties again
      expect(productStore.productList).toEqual(productStore.products)
      expect(productStore.productCount).toBe(2)
      expect(productStore.hasProducts).toBe(true)
    })
  })

  // Test Actions (methods)
  describe('Actions', () => {
    describe('getProductList', () => {
      it('should set product list and total on success', async () => {
        const mockResponse = {
          data: {
            records: [
              {
                id: 1,
                name: 'Product 1',
                price: 99.99,
                categoryId: 1,
                brandId: 1,
                status: 1,
                stock: 100,
                salesVolume: 0,
                isNew: false,
                isHot: false,
                createTime: '2024-01-01',
                updateTime: '2024-01-01',
                images: [],
                mainImage: '',
                skuList: [],
                categoryName: 'Category 1',
                brandName: 'Brand 1',
              },
              {
                id: 2,
                name: 'Product 2',
                price: 199.99,
                categoryId: 1,
                brandId: 1,
                status: 1,
                stock: 50,
                salesVolume: 0,
                isNew: true,
                isHot: true,
                createTime: '2024-01-02',
                updateTime: '2024-01-02',
                images: [],
                mainImage: '',
                skuList: [],
                categoryName: 'Category 1',
                brandName: 'Brand 1',
              },
            ],
            total: 2,
          },
        }
        mockGetProductList.mockResolvedValue(mockResponse)

        const result = await productStore.getProductList(1, 10)

        expect(mockGetProductList).toHaveBeenCalledWith({
          keyword: '',
          categoryId: 0,
          brandId: 0,
          status: 0,
          isNew: false,
          isHot: false,
          page: 1,
          limit: 10,
        })
        expect(productStore.products).toEqual(mockResponse.data.records)
        expect(productStore.total).toBe(mockResponse.data.total)
        expect(result).toEqual(mockResponse)
      })

      it('should handle API error correctly', async () => {
        const error = new Error('API Error')
        mockGetProductList.mockRejectedValue(error)

        await expect(productStore.getProductList(1, 10)).rejects.toThrow('API Error')
        expect(productStore.error).toBe('API Error')
        expect(productStore.loading).toBe(false)
      })
    })

    describe('getProductDetail', () => {
      it('should set currentProduct on success', async () => {
        const mockDetail = {
          data: {
            id: 1,
            name: 'Product 1',
            price: 99.99,
            categoryId: 1,
            brandId: 1,
            status: 1,
            stock: 100,
            salesVolume: 0,
            isNew: false,
            isHot: false,
            createTime: '2024-01-01',
            updateTime: '2024-01-01',
            images: [],
            mainImage: '',
            skuList: [],
            categoryName: 'Category 1',
            brandName: 'Brand 1',
          },
        }
        mockGetProductDetail.mockResolvedValue(mockDetail)

        const result = await productStore.getProductDetail(1)

        expect(mockGetProductDetail).toHaveBeenCalledWith(1)
        expect(productStore.currentProduct).toEqual(mockDetail.data)
        expect(result).toEqual(mockDetail)
      })

      it('should handle API error correctly', async () => {
        const error = new Error('Product not found')
        mockGetProductDetail.mockRejectedValue(error)

        await expect(productStore.getProductDetail(999)).rejects.toThrow('Product not found')
        expect(productStore.error).toBe('Product not found')
        expect(productStore.loading).toBe(false)
      })
    })

    describe('getProductCategories', () => {
      it('should set categories on success', async () => {
        const mockCategories = {
          data: [
            { id: 1, name: 'Category 1', parentId: 0, level: 1, sort: 1, status: 1 },
            { id: 2, name: 'Category 2', parentId: 0, level: 1, sort: 2, status: 1 },
          ],
        }
        mockGetProductCategories.mockResolvedValue(mockCategories)

        const result = await productStore.getProductCategories()

        expect(mockGetProductCategories).toHaveBeenCalled()
        expect(productStore.categories).toEqual(mockCategories.data)
        expect(result).toEqual(mockCategories)
      })

      it('should handle API error correctly', async () => {
        const error = new Error('Network error')
        mockGetProductCategories.mockRejectedValue(error)

        await expect(productStore.getProductCategories()).rejects.toThrow('Network error')
        expect(productStore.error).toBe('Network error')
        expect(productStore.loading).toBe(false)
      })
    })

    describe('setFilterParams', () => {
      it('should update filter params', () => {
        // Set some filter params
        productStore.setFilterParams({
          keyword: 'test',
          categoryId: 1,
          status: 1,
        })

        expect(productStore.filterParams).toEqual({
          keyword: 'test',
          categoryId: 1,
          brandId: 0,
          status: 1,
          isNew: false,
          isHot: false,
        })
      })
    })

    describe('resetFilterParams', () => {
      it('should reset filter params to default values', () => {
        // First set some filter params
        productStore.setFilterParams({
          keyword: 'test',
          categoryId: 1,
          status: 1,
        })

        // Then reset them
        productStore.resetFilterParams()

        expect(productStore.filterParams).toEqual({
          keyword: '',
          categoryId: 0,
          brandId: 0,
          status: 0,
          isNew: false,
          isHot: false,
        })
      })
    })

    describe('resetProductState', () => {
      it('should reset all product state', () => {
        // First set some state
        productStore.products = [
          {
            id: 1,
            name: 'Product 1',
            price: 99.99,
            categoryId: 1,
            brandId: 1,
            status: 1,
            stock: 100,
            salesVolume: 0,
            isNew: false,
            isHot: false,
            createTime: '2024-01-01',
            updateTime: '2024-01-01',
            images: [],
            mainImage: '',
            skuList: [],
            categoryName: 'Category 1',
            brandName: 'Brand 1',
          },
        ]
        productStore.total = 1
        productStore.currentProduct = {
          id: 1,
          name: 'Product 1',
          price: 99.99,
          categoryId: 1,
          brandId: 1,
          status: 1,
          stock: 100,
          salesVolume: 0,
          isNew: false,
          isHot: false,
          createTime: '2024-01-01',
          updateTime: '2024-01-01',
          images: [],
          mainImage: '',
          skuList: [],
          categoryName: 'Category 1',
          brandName: 'Brand 1',
        }
        productStore.error = 'Some error'
        productStore.setFilterParams({ keyword: 'test' })

        // Then reset state
        productStore.resetProductState()

        // Check that all state is reset
        expect(productStore.products).toEqual([])
        expect(productStore.total).toBe(0)
        expect(productStore.currentProduct).toBeNull()
        expect(productStore.error).toBeNull()
        expect(productStore.filterParams).toEqual({
          keyword: '',
          categoryId: 0,
          brandId: 0,
          status: 0,
          isNew: false,
          isHot: false,
        })
      })
    })
  })

  // Test error handling scenarios
  describe('Error Handling', () => {
    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('timeout of 5000ms exceeded')
      mockGetProductList.mockRejectedValue(timeoutError)

      await expect(productStore.getProductList(1, 10)).rejects.toThrow('timeout')
      expect(productStore.error).toBe('timeout of 5000ms exceeded')
    })

    it('should handle server errors', async () => {
      const serverError = new Error('Internal Server Error')
      mockGetProductDetail.mockRejectedValue(serverError)

      await expect(productStore.getProductDetail(999)).rejects.toThrow('Internal Server Error')
      expect(productStore.error).toBe('Internal Server Error')
    })
  })

  // Test edge cases
  describe('Edge Cases', () => {
    it('should handle empty API responses', async () => {
      const mockEmptyResponse = {
        data: {
          records: [],
          total: 0,
        },
      }
      mockGetProductList.mockResolvedValue(mockEmptyResponse)

      await productStore.getProductList(1, 10)

      expect(productStore.products).toEqual([])
      expect(productStore.total).toBe(0)
    })

    it('should handle undefined API responses', async () => {
      const mockUndefinedResponse = { data: undefined }
      mockGetProductCategories.mockResolvedValue(mockUndefinedResponse)

      await productStore.getProductCategories()

      expect(productStore.categories).toEqual([])
    })
  })
})
