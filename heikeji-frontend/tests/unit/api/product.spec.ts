import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProductById, getProductList, searchProducts } from '@/api/product'

// 模拟axios请求
vi.mock('@/utils/request', () => ({
  get: vi.fn(),
  post: vi.fn(),
}))

import request from '@/utils/request'

const mockRequest = request as any

describe('Product API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getProductById should fetch product by ID', async () => {
    const mockProduct = {
      id: 1,
      productName: '测试商品',
      price: 100,
      stock: 10,
    }

    mockRequest.get.mockResolvedValue({
      code: 200,
      message: 'success',
      data: mockProduct,
      success: true,
    })

    const result = await getProductById(1)
    expect(result.data).toEqual(mockProduct)
    expect(mockRequest.get).toHaveBeenCalledWith('/product/1')
  })

  it('getProductList should fetch product list with pagination', async () => {
    const mockProducts = [
      {
        id: 1,
        productName: '商品1',
        price: 100,
      },
      {
        id: 2,
        productName: '商品2',
        price: 200,
      },
    ]

    mockRequest.get.mockResolvedValue({
      code: 200,
      message: 'success',
      data: {
        list: mockProducts,
        total: 2,
        pageNum: 1,
        pageSize: 10,
      },
      success: true,
    })

    const result = await getProductList({ page: 1, pageSize: 10 })
    expect(result.data.list).toEqual(mockProducts)
    expect(mockRequest.get).toHaveBeenCalledWith('/product/list', { page: 1, pageSize: 10 })
  })

  it('searchProducts should search products by keyword', async () => {
    const mockProducts = [
      {
        id: 1,
        productName: '测试商品1',
        price: 100,
      },
    ]

    mockRequest.get.mockResolvedValue({
      code: 200,
      message: 'success',
      data: {
        list: mockProducts,
        total: 1,
      },
      success: true,
    })

    const result = await searchProducts('测试')
    expect(result.data.list).toEqual(mockProducts)
    expect(mockRequest.get).toHaveBeenCalledWith('/product/search', { keyword: '测试' })
  })

  it('getProductById should handle error', async () => {
    mockRequest.get.mockRejectedValue(new Error('Network error'))

    await expect(getProductById(1)).rejects.toThrow('Network error')
  })

  it('getProductList should handle empty response', async () => {
    mockRequest.get.mockResolvedValue({
      code: 200,
      message: 'success',
      data: {
        list: [],
        total: 0,
      },
      success: true,
    })

    const result = await getProductList()
    expect(result.data.list).toEqual([])
    expect(result.data.total).toBe(0)
  })
})
