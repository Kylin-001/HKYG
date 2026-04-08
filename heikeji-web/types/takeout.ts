// ============================================
// 外卖相关类型定义
// ============================================

export interface Merchant {
  id: string
  name: string
  logo: string
  bannerImage?: string
  category: MerchantCategory
  rating: number
  monthlySales: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  address: string
  phone: string
  isOpen: boolean
  tags: string[]
  description?: string
  latitude?: number
  longitude?: number
  distance?: number
  promotionText?: string
}

export type MerchantCategory = 'food' | 'drink' | 'dessert' | 'snack' | 'healthy' | 'fast_food'

export interface TakeoutProduct {
  id: string
  merchantId: string
  name: string
  image: string
  price: number
  originalPrice?: number
  category: string
  monthSales: number
  isRecommended: boolean
  tags?: string[]
  description?: string
}

export interface TakeoutCategory {
  id: string
  name: string
  products: TakeoutProduct[]
}

export interface MerchantDetail extends Merchant {
  categories: TakeoutCategory[]
  comments: TakeoutComment[]
}

export interface TakeoutComment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  content: string
  images?: string[]
  replyContent?: string
  createdAt: string
}

export interface DeliveryTrackInfo {
  orderNo: string
  status: DeliveryStatus
  currentStep: number
  steps: DeliveryStep[]
  riderInfo?: RiderInfo
  estimatedArrival?: string
}

export type DeliveryStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'picking_up'
  | 'delivering'
  | 'delivered'
  | 'cancelled'

export interface DeliveryStep {
  status: DeliveryStatus
  title: string
  desc: string
  time: string
  completed: boolean
  active: boolean
}

export interface RiderInfo {
  name: string
  avatar: string
  phone: string
  vehicleType: string
  plateNumber?: string
}

export interface CreateTakeoutOrderRequest {
  merchantId: string
  items: { productId: string; quantity: number }[]
  addressId: string
  remark?: string
  couponId?: string
}
