import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from '@/utils/request'
import { productApi } from '@/api/product'

vi.mock('@/utils/request')

describe('Product API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call getProductList API correctly', async () => {
    const mockParams = { page: 1, pageSize: 10, categoryId: 1 }
    const mockResponse = { data: { list: [], total: 0 } }
    vi.mocked(request).get.mockResolvedValue(mockResponse)
    
    const result = await productApi.getProductList(mockParams)
    expect(request.get).toHaveBeenCalledWith('/api/product/list', mockParams)
    expect(result).toEqual(mockResponse.data)
  })

  it('should call getProductDetail API correctly', async () => {
    const productId = 123
    const mockResponse = { data: { id: 123, productName: '测试商品' } }
    vi.mocked(request).get.mockResolvedValue(mockResponse)
    
    const result = await productApi.getProductDetail(productId)
    expect(request.get).toHaveBeenCalledWith('/api/product/123')
    expect(result).toEqual(mockResponse.data)
  })

  it('should call createProduct API correctly', async () => {
    const mockData = { productName: '新商品', price: 99.99 }
    const mockResponse = { data: { id: 456 } }
    vi.mocked(request).post.mockResolvedValue(mockResponse)
    
    const result = await productApi.createProduct(mockData)
    expect(request.post).toHaveBeenCalledWith('/api/product', mockData)
    expect(result).toEqual(mockResponse.data)
  })

  it('should call updateProduct API correctly', async () => {
    const mockData = { id: 123, productName: '更新商品', price: 109.99 }
    const mockResponse = { data: { success: true } }
    vi.mocked(request).put.mockResolvedValue(mockResponse)
    
    const result = await productApi.updateProduct(mockData)
    expect(request.put).toHaveBeenCalledWith('/api/product', mockData)
    expect(result).toEqual(mockResponse.data)
  })

  it('should call deleteProduct API correctly', async () => {
    const productId = 123
    const mockResponse = { data: { success: true } }
    vi.mocked(request).delete.mockResolvedValue(mockResponse)
    
    const result = await productApi.deleteProduct(productId)
    expect(request.delete).toHaveBeenCalledWith('/api/product/123')
    expect(result).toEqual(mockResponse.data)
  })

  it('should call batchDeleteProduct API correctly', async () => {
    const productIds = [1, 2, 3]
    const mockResponse = { data: { success: true } }
    vi.mocked(request).delete.mockResolvedValue(mockResponse)
    
    const result = await productApi.batchDeleteProduct(productIds)
    expect(request.delete).toHaveBeenCalledWith('/api/product/batch', { productIds })
    expect(result).toEqual(mockResponse.data)
  })

  it('should call changeStatus API correctly', async () => {
    const productId = 123
    const status = 1
    const mockResponse = { data: { success: true } }
    vi.mocked(request).put.mockResolvedValue(mockResponse)
    
    const result = await productApi.changeStatus(productId, status)
    expect(request.put).toHaveBeenCalledWith('/api/product/123/status', { status })
    expect(result).toEqual(mockResponse.data)
  })

  it('should handle getProductList API error', async () => {
    const mockParams = { page: 1, pageSize: 10 }
    const mockError = new Error('Network Error')
    vi.mocked(request).get.mockRejectedValue(mockError)
    
    await expect(productApi.getProductList(mockParams)).rejects.toThrow()
  })

  it('should handle getProductDetail API error', async () => {
    const productId = 123
    const mockError = new Error('Product not found')
    vi.mocked(request).get.mockRejectedValue(mockError)
    
    await expect(productApi.getProductDetail(productId)).rejects.toThrow()
  })
})
