// 产品相关类型定义

export interface Product {
  id: string
  name: string
  code: string
  description?: string
  image: string
  images?: string[]
  categoryId: string
  categoryName: string
  price: number
  originalPrice?: number
  costPrice?: number
  stock: number
  sales: number
  status: number // 1-上架 2-下架
  isHot: boolean
  isNew: boolean
  isRecommended: boolean
  tags?: string[]
  specifications?: ProductSpecification[]
  details?: string
  seoKeywords?: string
  seoDescription?: string
  sort: number
  createTime: string
  updateTime: string
  createUser?: string
  updateUser?: string
}

export interface ProductSpecification {
  id: string
  productId: string
  name: string
  value: string
  sort: number
}

export interface ProductCategory {
  id: string
  name: string
  code: string
  icon?: string
  image?: string
  description?: string
  parentId?: string
  level: number
  sort: number
  status: number // 1-启用 0-禁用
  children?: ProductCategory[]
  createTime: string
  updateTime: string
}

export interface ProductBrand {
  id: string
  name: string
  code: string
  logo?: string
  description?: string
  url?: string
  sort: number
  status: number // 1-启用 0-禁用
  createTime: string
  updateTime: string
}

export interface ProductSearchParams {
  keyword?: string
  categoryId?: string
  brandId?: string
  status?: string
  isHot?: boolean
  isNew?: boolean
  minPrice?: number
  maxPrice?: number
  pageNum?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ProductListResponse {
  list: Product[]
  total: number
  pageNum: number
  pageSize: number
}

export interface ProductStats {
  total: number
  online: number
  offline: number
  hot: number
  new: number
  lowStock: number
  outOfStock: number
}

export interface ProductForm {
  id?: string
  name: string
  code: string
  description?: string
  image: string
  images: string[]
  categoryId: string
  price: number
  originalPrice?: number
  costPrice?: number
  stock: number
  status: number
  isHot: boolean
  isNew: boolean
  isRecommended: boolean
  tags: string[]
  specifications: ProductSpecification[]
  details: string
  seoKeywords?: string
  seoDescription?: string
  sort: number
}

export interface ProductImportResult {
  success: number
  failed: number
  errors: {
    row: number
    data: any
    message: string
  }[]
}

export interface ProductExportParams extends ProductSearchParams {
  fields?: string[]
  format?: 'xlsx' | 'csv'
}

// 商品评价相关类型
export interface ProductReview {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  orderId: string
  rating: number // 1-5星
  content: string
  images?: string[]
  isAnonymous: boolean
  isTop: boolean
  status: number // 1-显示 0-隐藏
  replyContent?: string
  replyTime?: string
  createTime: string
  updateTime: string
}

export interface ProductReviewStats {
  total: number
  averageRating: number
  ratingDistribution: {
    rating: number
    count: number
    percentage: number
  }[]
}

// 商品库存记录类型
export interface ProductStockRecord {
  id: string
  productId: string
  productName: string
  productCode: string
  type: number // 1-入库 2-出库 3-盘点调整
  quantity: number
  beforeStock: number
  afterStock: number
  reason?: string
  operatorId: string
  operatorName: string
  createTime: string
}