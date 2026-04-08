export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  categoryId: number
  categoryName?: string
  merchantId: number
  merchantName?: string
  stock: number
  sales: number
  rating: number
  reviewCount: number
  tags: string[]
  status: 'active' | 'inactive' | 'sold_out'
  createdAt: string
  updatedAt: string
}

export interface ProductCategory {
  id: number
  name: string
  icon?: string
  parentId?: number
  children?: ProductCategory[]
  productCount: number
  sort: number
}

export interface ProductDetail extends Product {
  specifications: ProductSpecification[]
  reviews: ProductReview[]
  relatedProducts: Product[]
}

export interface ProductSpecification {
  id: number
  name: string
  value: string
  sort: number
}

export interface ProductReview {
  id: number
  userId: number
  userName: string
  userAvatar?: string
  rating: number
  content: string
  images?: string[]
  createdAt: string
  reply?: {
    content: string
    createdAt: string
  }
}

export interface ProductSearchParams extends PaginationParams {
  keyword?: string
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  merchantId?: number
  sortBy?: 'price' | 'sales' | 'rating' | 'createdAt'
}

// ====== 新增：商品对比相关类型 ======
export interface ProductCompareItem extends Pick<Product, 'id' | 'name' | 'price' | 'originalPrice' | 'images' | 'rating' | 'reviewCount' | 'sales'> {
  specifications: ProductSpecification[]
  merchantName?: string
}

// ====== 新增：商品分享相关类型 ======
export interface ShareLink {
  url: string
  shortUrl?: string
  qrCode?: string // Base64 编码的二维码图片
  expireAt?: Date
}

// ====== 新增：商品评价系统 ======
export interface CreateReviewRequest {
  productId: number
  orderId?: number
  rating: number
  content: string
  images?: string[]
  specifications?: Record<string, string>
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: Array<{
    stars: number
    count: number
    percentage: number
  }>
  tags: Array<{
    tag: string
    count: number
  }>
}

// ====== 新增：浏览历史 ======
export interface BrowsingHistoryItem {
  productId: number
  productName: string
  productImage: string
  price: number
  viewedAt: string
}

// ====== 新增：推荐系统 ======
export interface RecommendedProduct extends Product {
  recommendationReason: string
  score: number
}
