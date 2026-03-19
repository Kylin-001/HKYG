import request from '@/utils/request'
import { Product, Category, ProductQuery } from '@/types/api'

interface Brand {
  id: string
  name: string
  logo?: string
  status: number
  createTime: string
}

interface BrandQueryParams {
  page?: number
  limit?: number
  keyword?: string
  status?: number
}

interface CreateBrandParams {
  name: string
  logo?: string
  status: number
}

interface UpdateBrandParams {
  id: string
  name?: string
  logo?: string
  status?: number
}

interface UpdateBrandStatusParams {
  id: string
  status: boolean
}

interface CategoryQueryParams {
  page?: number
  limit?: number
  keyword?: string
  status?: number
}

interface SearchParams {
  keyword: string
  page?: number
  limit?: number
}

interface BehaviorRecordParams {
  productId: number
  behaviorType: string
  duration?: number
}

export const productApi = {
  getProductList: (params: ProductQuery) => request.get('/api/product/list', params),

  getProductDetail: (productId: number) => request.get<Product>(`/api/product/${productId}`),

  createProduct: (data: Product) => request.post('/api/product', data),

  updateProduct: (data: Product) => request.put('/api/product', data),

  deleteProduct: (productId: number) => request.delete(`/api/product/${productId}`),

  batchDeleteProduct: (productIds: number[]) =>
    request.delete('/api/product/batch', { productIds }),

  changeStatus: (productId: number, status: number) =>
    request.put('/api/product/changeStatus', { productId, status }),

  publishProduct: (productIds: number[]) => request.put('/api/product/publish', { productIds }),

  offlineProduct: (productIds: number[]) => request.put('/api/product/offline', { productIds }),

  importProduct: (formData: FormData) => request.upload('/api/product/import', formData),

  exportProduct: (params?: ProductQuery) => request.get('/api/product/export', params),

  getCategoryTree: () => request.get<Category[]>('/api/category/tree'),

  getCategoryList: (params?: CategoryQueryParams) => request.get('/api/category/list', params),

  getCategoryDetail: (categoryId: number) => request.get<Category>(`/api/category/${categoryId}`),

  createCategory: (data: Category) => request.post('/api/category', data),

  updateCategory: (data: Category) => request.put('/api/category', data),

  deleteCategory: (categoryId: number) => request.delete(`/api/category/${categoryId}`),

  uploadImage: (formData: FormData) =>
    request.upload<{ url: string }>('/api/product/upload/image', formData),

  getRecommendProducts: (limit: number = 10) => request.get('/api/product/recommend', { limit }),

  getPersonalizedRecommendations: (userId: number, limit: number = 10) =>
    request.get('/api/product/recommend/personalized', { userId, limit }),

  getSimilarProducts: (productId: number, limit: number = 10) =>
    request.get(`/api/product/recommend/similar/${productId}`, { limit }),

  getHotProducts: (limit: number = 10) => request.get('/api/product/recommend/hot', { limit }),

  recordUserBehavior: (data: BehaviorRecordParams) =>
    request.post('/api/user/behavior/record', data),

  getRecommendReason: (userId: number, productId: number) =>
    request.get('/api/product/recommend/reason', { userId, productId }),

  searchProducts: (params: SearchParams) => request.get('/api/product/search', params),

  getBrands: (params?: BrandQueryParams) => request.get('/api/brand/list', params),

  createBrand: (data: CreateBrandParams) => request.post('/api/brand', data),

  updateBrand: (data: UpdateBrandParams) => request.put('/api/brand', data),

  deleteBrand: (brandId: string) => request.delete(`/api/brand/${brandId}`),

  updateBrandStatus: (data: UpdateBrandStatusParams) => request.put('/api/brand/status', data),

  uploadBrandLogo: (formData: FormData) =>
    request.upload<{ url: string }>('/api/brand/upload/logo', formData),
}
