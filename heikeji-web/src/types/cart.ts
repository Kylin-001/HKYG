export interface CartItem {
  id: string
  productId: string
  product?: {
    id: string
    name: string
    image: string
    price: number
    originalPrice?: number
    stock: number
    status: string
  }
  quantity: number
  specifications?: Record<string, string>
  selected: boolean
  addedAt: string
}

export interface Cart {
  items: CartItem[]
  totalCount: number
  totalAmount: number
  selectedCount: number
  selectedAmount: number
  invalidItems: CartItem[]
}

export interface AddToCartRequest {
  productId: string | number
  quantity: number
  specifications?: Record<string, string>
}

export interface UpdateCartRequest {
  itemId: string
  quantity?: number
  selected?: boolean
}

export interface CartResponse {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  savedAmount?: number
  selectedCount: number
  selectedAmount: number
}
