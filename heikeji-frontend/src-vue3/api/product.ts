import request from '@/utils/request'
import type {
  Product,
  ProductListResponse,
  ProductSearchParams,
  ProductStats,
  ProductForm,
  ProductImportResult,
  ProductExportParams,
  ProductCategory,
  ProductBrand,
  ProductReview,
  ProductReviewStats,
  ProductStockRecord,
} from '@/types/product'

// 获取商品列表
export function getProductList(params: ProductSearchParams) {
  return request<ProductListResponse>({
    url: '/product/list',
    method: 'get',
    params,
  })
}

// 获取商品详情
export function getProductDetail(id: string) {
  return request<Product>({
    url: `/product/${id}`,
    method: 'get',
  })
}

// 创建商品
export function createProduct(data: ProductForm) {
  return request<string>({
    url: '/product',
    method: 'post',
    data,
  })
}

// 更新商品
export function updateProduct(id: string, data: ProductForm) {
  return request<boolean>({
    url: `/product/${id}`,
    method: 'put',
    data,
  })
}

// 删除商品
export function deleteProduct(id: string) {
  return request<boolean>({
    url: `/product/${id}`,
    method: 'delete',
  })
}

// 批量删除商品
export function batchDeleteProducts(ids: string[]) {
  return request<boolean>({
    url: '/product/batch',
    method: 'delete',
    data: { ids },
  })
}

// 更新商品状态
export function updateProductStatus(id: string, status: number) {
  return request<boolean>({
    url: `/product/${id}/status`,
    method: 'put',
    data: { status },
  })
}

// 批量更新商品状态
export function batchUpdateProductStatus(ids: string[], status: number) {
  return request<boolean>({
    url: '/product/batch/status',
    method: 'put',
    data: { ids, status },
  })
}

// 获取商品统计
export function getProductStats() {
  return request<ProductStats>({
    url: '/product/stats',
    method: 'get',
  })
}

// 导出商品数据
export function exportProducts(params: ProductExportParams) {
  return request<Blob>({
    url: '/product/export',
    method: 'get',
    params,
    responseType: 'blob',
  })
}

// 导入商品数据
export function importProducts(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return request<ProductImportResult>({
    url: '/product/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 下载商品导入模板
export function downloadImportTemplate() {
  return request<Blob>({
    url: '/product/import/template',
    method: 'get',
    responseType: 'blob',
  })
}

// 获取商品分类列表
export function getProductCategories(params?: { parentId?: string; level?: number }) {
  return request<ProductCategory[]>({
    url: '/product/categories',
    method: 'get',
    params,
  })
}

// 创建商品分类
export function createProductCategory(
  data: Omit<ProductCategory, 'id' | 'createTime' | 'updateTime'>
) {
  return request<string>({
    url: '/product/category',
    method: 'post',
    data,
  })
}

// 更新商品分类
export function updateProductCategory(id: string, data: Partial<ProductCategory>) {
  return request<boolean>({
    url: `/product/category/${id}`,
    method: 'put',
    data,
  })
}

// 删除商品分类
export function deleteProductCategory(id: string) {
  return request<boolean>({
    url: `/product/category/${id}`,
    method: 'delete',
  })
}

// 获取商品品牌列表
export function getProductBrands(params?: { name?: string; status?: number }) {
  return request<ProductBrand[]>({
    url: '/product/brands',
    method: 'get',
    params,
  })
}

// 创建商品品牌
export function createProductBrand(data: Omit<ProductBrand, 'id' | 'createTime' | 'updateTime'>) {
  return request<string>({
    url: '/product/brand',
    method: 'post',
    data,
  })
}

// 更新商品品牌
export function updateProductBrand(id: string, data: Partial<ProductBrand>) {
  return request<boolean>({
    url: `/product/brand/${id}`,
    method: 'put',
    data,
  })
}

// 删除商品品牌
export function deleteProductBrand(id: string) {
  return request<boolean>({
    url: `/product/brand/${id}`,
    method: 'delete',
  })
}

// 获取商品评价列表
export function getProductReviews(params: {
  productId?: string
  rating?: number
  status?: number
  pageNum?: number
  pageSize?: number
}) {
  return request<{
    list: ProductReview[]
    total: number
    pageNum: number
    pageSize: number
  }>({
    url: '/product/reviews',
    method: 'get',
    params,
  })
}

// 获取商品评价统计
export function getProductReviewStats(productId: string) {
  return request<ProductReviewStats>({
    url: `/product/${productId}/review/stats`,
    method: 'get',
  })
}

// 回复商品评价
export function replyProductReview(id: string, content: string) {
  return request<boolean>({
    url: `/product/review/${id}/reply`,
    method: 'post',
    data: { content },
  })
}

// 更新商品评价状态
export function updateProductReviewStatus(id: string, status: number) {
  return request<boolean>({
    url: `/product/review/${id}/status`,
    method: 'put',
    data: { status },
  })
}

// 获取商品库存记录
export function getProductStockRecords(params: {
  productId?: string
  type?: number
  startDate?: string
  endDate?: string
  pageNum?: number
  pageSize?: number
}) {
  return request<{
    list: ProductStockRecord[]
    total: number
    pageNum: number
    pageSize: number
  }>({
    url: '/product/stock/records',
    method: 'get',
    params,
  })
}

// 调整商品库存
export function adjustProductStock(data: {
  productId: string
  type: number
  quantity: number
  reason?: string
}) {
  return request<boolean>({
    url: '/product/stock/adjust',
    method: 'post',
    data,
  })
}

// 批量调整商品库存
export function batchAdjustProductStock(data: {
  adjustments: {
    productId: string
    quantity: number
    reason?: string
  }[]
}) {
  return request<boolean>({
    url: '/product/stock/batch-adjust',
    method: 'post',
    data,
  })
}
