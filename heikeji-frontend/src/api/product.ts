import request from '@/utils/request'
import { Product, Category, ProductQuery } from '@/types/api'

/**
 * 商品相关API
 */
export const productApi = {
  /**
   * 获取商品列表
   * @param params 商品查询参数
   */
  getProductList: (params: ProductQuery) => request.get('/api/product/list', params),

  /**
   * 获取商品详情
   * @param productId 商品ID
   */
  getProductDetail: (productId: number) => request.get<Product>(`/api/product/${productId}`),

  /**
   * 创建商品
   * @param data 商品数据
   */
  createProduct: (data: Product) => request.post('/api/product', data),

  /**
   * 更新商品
   * @param data 商品数据
   */
  updateProduct: (data: Product) => request.put('/api/product', data),

  /**
   * 删除商品
   * @param productId 商品ID
   */
  deleteProduct: (productId: number) => request.delete(`/api/product/${productId}`),

  /**
   * 批量删除商品
   * @param productIds 商品ID列表
   */
  batchDeleteProduct: (productIds: number[]) =>
    request.delete('/api/product/batch', { productIds }),

  /**
   * 更新商品状态
   * @param productId 商品ID
   * @param status 状态
   */
  changeStatus: (productId: number, status: number) =>
    request.put('/api/product/changeStatus', { productId, status }),

  /**
   * 上架商品
   * @param productIds 商品ID列表
   */
  publishProduct: (productIds: number[]) => request.put('/api/product/publish', { productIds }),

  /**
   * 下架商品
   * @param productIds 商品ID列表
   */
  offlineProduct: (productIds: number[]) => request.put('/api/product/offline', { productIds }),

  /**
   * 导入商品
   * @param formData 商品数据文件
   */
  importProduct: (formData: FormData) => request.upload('/api/product/import', formData),

  /**
   * 导出商品
   * @param params 查询参数
   */
  exportProduct: (params?: ProductQuery) => request.get('/api/product/export', params),

  /**
   * 获取商品分类树
   */
  getCategoryTree: () => request.get<Category[]>('/api/category/tree'),

  /**
   * 获取商品分类列表
   * @param params 查询参数
   */
  getCategoryList: (params?: any) => request.get('/api/category/list', params),

  /**
   * 获取分类详情
   * @param categoryId 分类ID
   */
  getCategoryDetail: (categoryId: number) => request.get<Category>(`/api/category/${categoryId}`),

  /**
   * 创建分类
   * @param data 分类数据
   */
  createCategory: (data: Category) => request.post('/api/category', data),

  /**
   * 更新分类
   * @param data 分类数据
   */
  updateCategory: (data: Category) => request.put('/api/category', data),

  /**
   * 删除分类
   * @param categoryId 分类ID
   */
  deleteCategory: (categoryId: number) => request.delete(`/api/category/${categoryId}`),

  /**
   * 上传商品图片
   * @param formData 图片文件
   */
  uploadImage: (formData: FormData) => request.upload('/api/product/upload/image', formData),

  /**
   * 获取热门商品
   * @param limit 数量限制
   */
  getHotProducts: (limit?: number) => request.get('/api/product/hot', { limit }),

  /**
   * 获取推荐商品
   * @param limit 数量限制
   */
  getRecommendProducts: (limit?: number) => request.get('/api/product/recommend', { limit }),

  /**
   * 搜索商品
   * @param params 搜索参数
   */
  searchProducts: (params: { keyword: string; page?: number; limit?: number }) =>
    request.get('/api/product/search', params),
}
