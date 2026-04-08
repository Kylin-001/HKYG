// ============================================
// 购物车相关类型定义
// ============================================

export interface CartItem {
  id: string
  productId: string | number
  product: CartProductInfo
  quantity: number
  selected: boolean
  addedAt: string
}

export interface CartProductInfo {
  id: string | number
  name: string
  image: string
  price: number
  originalPrice: number
  stock: number
  spec?: string
}

export interface CartResponse {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  savedAmount: number
  selectedCount: number
  selectedAmount: number
}

export interface AddToCartRequest {
  productId: string | number
  quantity: number
  specId?: string
}

export interface UpdateCartRequest {
  itemId: string
  quantity?: number
  selected?: boolean
}
