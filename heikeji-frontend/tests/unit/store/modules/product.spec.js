import productModule from '@/store/modules/product'
import { getProductList, getProductDetail, getCategoryList, getBrandList } from '@/api/product'

// Mock API calls
jest.mock('@/api/product', () => ({
  getProductList: jest.fn(),
  getProductDetail: jest.fn(),
  getCategoryList: jest.fn(),
  getBrandList: jest.fn(),
}))

describe('Product Store Module', () => {
  let state
  let commit
  let dispatch

  beforeEach(() => {
    // Reset state
    state = {
      list: [],
      total: 0,
      detail: {},
      categories: [],
      brands: [],
    }
    commit = jest.fn()
    dispatch = jest.fn()
  })

  // Test State initialization
  describe('State', () => {
    it('should have initial state with empty values', () => {
      expect(productModule.state.list).toEqual([])
      expect(productModule.state.total).toBe(0)
      expect(productModule.state.detail).toEqual({})
      expect(productModule.state.categories).toEqual([])
      expect(productModule.state.brands).toEqual([])
    })
  })

  // Test Mutations
  describe('Mutations', () => {
    it('SET_PRODUCT_LIST should set product list', () => {
      const productList = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ]
      productModule.mutations.SET_PRODUCT_LIST(state, productList)
      expect(state.list).toEqual(productList)
    })

    it('SET_PRODUCT_TOTAL should set product total', () => {
      productModule.mutations.SET_PRODUCT_TOTAL(state, 100)
      expect(state.total).toBe(100)
    })

    it('SET_PRODUCT_DETAIL should set product detail', () => {
      const productDetail = { id: 1, name: 'Product 1', price: 99.99 }
      productModule.mutations.SET_PRODUCT_DETAIL(state, productDetail)
      expect(state.detail).toEqual(productDetail)
    })

    it('SET_CATEGORIES should set categories', () => {
      const categories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ]
      productModule.mutations.SET_CATEGORIES(state, categories)
      expect(state.categories).toEqual(categories)
    })

    it('SET_BRANDS should set brands', () => {
      const brands = [
        { id: 1, name: 'Brand 1' },
        { id: 2, name: 'Brand 2' },
      ]
      productModule.mutations.SET_BRANDS(state, brands)
      expect(state.brands).toEqual(brands)
    })

    it('SET_PRODUCT_LIST should handle empty list', () => {
      productModule.mutations.SET_PRODUCT_LIST(state, null)
      expect(state.list).toBeNull()
    })

    it('SET_PRODUCT_DETAIL should handle empty detail', () => {
      productModule.mutations.SET_PRODUCT_DETAIL(state, null)
      expect(state.detail).toBeNull()
    })
  })

  // Test Actions
  describe('Actions', () => {
    describe('getProductList', () => {
      it('should commit product list and total on success', async () => {
        const mockResponse = {
          list: [
            { id: 1, name: 'Product 1' },
            { id: 2, name: 'Product 2' },
          ],
          total: 2,
        }
        getProductList.mockResolvedValue(mockResponse)

        const params = { page: 1, limit: 10 }
        const result = await productModule.actions.getProductList({ commit }, params)

        expect(getProductList).toHaveBeenCalledWith(params)
        expect(commit).toHaveBeenCalledWith('SET_PRODUCT_LIST', mockResponse.list)
        expect(commit).toHaveBeenCalledWith('SET_PRODUCT_TOTAL', mockResponse.total)
        expect(result).toEqual(mockResponse)
      })

      it('should handle empty response correctly', async () => {
        getProductList.mockResolvedValue({})

        const result = await productModule.actions.getProductList({ commit }, {})

        expect(commit).toHaveBeenCalledWith('SET_PRODUCT_LIST', [])
        expect(commit).toHaveBeenCalledWith('SET_PRODUCT_TOTAL', 0)
      })

      it('should reject with error on API failure', async () => {
        const error = new Error('API Error')
        getProductList.mockRejectedValue(error)

        await expect(productModule.actions.getProductList({ commit }, {})).rejects.toThrow(
          'API Error'
        )
        expect(commit).not.toHaveBeenCalled()
      })
    })

    describe('getProductDetail', () => {
      it('should commit product detail on success', async () => {
        const mockDetail = { id: 1, name: 'Product 1', price: 99.99 }
        getProductDetail.mockResolvedValue(mockDetail)

        const result = await productModule.actions.getProductDetail({ commit }, 1)

        expect(getProductDetail).toHaveBeenCalledWith(1)
        expect(commit).toHaveBeenCalledWith('SET_PRODUCT_DETAIL', mockDetail)
        expect(result).toEqual(mockDetail)
      })

      it('should handle empty detail correctly', async () => {
        getProductDetail.mockResolvedValue({})

        const result = await productModule.actions.getProductDetail({ commit }, 1)

        expect(commit).toHaveBeenCalledWith('SET_PRODUCT_DETAIL', {})
      })

      it('should reject with error on API failure', async () => {
        const error = new Error('Product not found')
        getProductDetail.mockRejectedValue(error)

        await expect(productModule.actions.getProductDetail({ commit }, 1)).rejects.toThrow(
          'Product not found'
        )
        expect(commit).not.toHaveBeenCalled()
      })
    })

    describe('getCategories', () => {
      it('should commit categories on success', async () => {
        const mockCategories = [
          { id: 1, name: 'Category 1' },
          { id: 2, name: 'Category 2' },
        ]
        getCategoryList.mockResolvedValue(mockCategories)

        const result = await productModule.actions.getCategories({ commit })

        expect(getCategoryList).toHaveBeenCalled()
        expect(commit).toHaveBeenCalledWith('SET_CATEGORIES', mockCategories)
        expect(result).toEqual(mockCategories)
      })

      it('should handle empty categories correctly', async () => {
        getCategoryList.mockResolvedValue([])

        const result = await productModule.actions.getCategories({ commit })

        expect(commit).toHaveBeenCalledWith('SET_CATEGORIES', [])
      })

      it('should reject with error on API failure', async () => {
        const error = new Error('Network error')
        getCategoryList.mockRejectedValue(error)

        await expect(productModule.actions.getCategories({ commit })).rejects.toThrow(
          'Network error'
        )
        expect(commit).not.toHaveBeenCalled()
      })
    })

    describe('getBrands', () => {
      it('should commit brands on success with params', async () => {
        const mockBrands = [
          { id: 1, name: 'Brand 1' },
          { id: 2, name: 'Brand 2' },
        ]
        getBrandList.mockResolvedValue(mockBrands)

        const params = { page: 1, limit: 10 }
        const result = await productModule.actions.getBrands({ commit }, params)

        expect(getBrandList).toHaveBeenCalledWith(params)
        expect(commit).toHaveBeenCalledWith('SET_BRANDS', mockBrands)
        expect(result).toEqual(mockBrands)
      })

      it('should commit brands on success with default empty params', async () => {
        const mockBrands = [{ id: 1, name: 'Brand 1' }]
        getBrandList.mockResolvedValue(mockBrands)

        const result = await productModule.actions.getBrands({ commit })

        expect(getBrandList).toHaveBeenCalledWith({})
        expect(commit).toHaveBeenCalledWith('SET_BRANDS', mockBrands)
      })

      it('should handle null brands response', async () => {
        getBrandList.mockResolvedValue(null)

        const result = await productModule.actions.getBrands({ commit })

        expect(commit).toHaveBeenCalledWith('SET_BRANDS', null)
      })

      it('should reject with error on API failure', async () => {
        const error = new Error('Server error')
        getBrandList.mockRejectedValue(error)

        await expect(productModule.actions.getBrands({ commit })).rejects.toThrow('Server error')
        expect(commit).not.toHaveBeenCalled()
      })
    })
  })

  // Test error handling scenarios
  describe('Error Handling', () => {
    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('timeout of 5000ms exceeded')
      getProductList.mockRejectedValue(timeoutError)

      await expect(productModule.actions.getProductList({ commit }, {})).rejects.toThrow('timeout')
    })

    it('should handle server errors', async () => {
      const serverError = new Error('Internal Server Error')
      getProductDetail.mockRejectedValue(serverError)

      await expect(productModule.actions.getProductDetail({ commit }, 999)).rejects.toThrow(
        'Internal Server Error'
      )
    })
  })

  // Test edge cases
  describe('Edge Cases', () => {
    it('should handle negative product ID', async () => {
      const mockDetail = { id: -1, name: 'Invalid Product' }
      getProductDetail.mockResolvedValue(mockDetail)

      const result = await productModule.actions.getProductDetail({ commit }, -1)

      expect(getProductDetail).toHaveBeenCalledWith(-1)
      expect(result).toEqual(mockDetail)
    })

    it('should handle zero total products', async () => {
      const mockResponse = { list: [], total: 0 }
      getProductList.mockResolvedValue(mockResponse)

      await productModule.actions.getProductList({ commit }, {})

      expect(commit).toHaveBeenCalledWith('SET_PRODUCT_TOTAL', 0)
    })

    it('should handle undefined API responses', async () => {
      getCategoryList.mockResolvedValue(undefined)

      await productModule.actions.getCategories({ commit })

      expect(commit).toHaveBeenCalledWith('SET_CATEGORIES', undefined)
    })
  })
})
