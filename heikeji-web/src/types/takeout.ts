// ============================================
// 外卖模块类型定义
// ============================================

export interface Merchant {
  id: string
  name: string
  logo: string
  coverImage: string
  category: MerchantCategory
  rating: number
  reviewCount: number
  monthlySales: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  address: string
  distance?: number
  isOpen: boolean
  tags: string[]
  promotions?: Promotion[]
  createdAt: string
}

export type MerchantCategory = 'food' | 'drinks' | 'dessert' | 'supermarket' | 'fruit' | 'other'

export interface MerchantDetail extends Merchant {
  bannerImages: string[]
  description: string
  phone: string
  businessHours: string
  menuCategories: MenuCategory[]
  reviews: MerchantReview[]
  isFavorite: boolean
}

export interface MenuCategory {
  id: string
  name: string
  icon?: string
  dishes: Dish[]
}

export interface Dish {
  id: string
  name: string
  description: string
  image: string
  price: number
  originalPrice?: number
  monthlySales: number
  rating: number
  tags: string[]
  isAvailable: boolean
  isRecommended?: boolean
  isSpicy?: boolean
  category: string
  // ====== 新增：规格选择 ======
  specifications?: DishSpecification[] // 规格选项（大小份、口味等）
}

// ====== 新增：菜品规格类型 ======
export interface DishSpecification {
  id: string
  name: string // 规格名称，如"大小份"、"口味"、"加料"
  required: boolean // 是否必选
  multiple: boolean // 是否可多选
  maxSelect?: number // 最大可选数量
  options: SpecOption[]
}

export interface SpecOption {
  id: string
  name: string // 选项名称，如"大份"、"微辣"
  price: number // 价格（可能为负数表示优惠）
  stock?: number // 库存
  default?: boolean // 是否默认选中
}

export interface Promotion {
  id: string
  type: 'full_discount' | 'discount' | 'gift' | 'coupon'
  title: string
  description: string
  minValue?: number
  discountValue?: number
  validFrom: string
  validTo: string
}

// ====== 新增：多商家购物车 ======
export interface CartItem {
  id: string
  merchantId: string
  merchantName: string
  dish: Dish
  quantity: number
  selectedSpecs?: Record<string, SpecOption[]> // 选中的规格
  totalPrice: number
}

export interface MultiMerchantCart {
  items: CartItem[]
  merchants: Array<{
    merchantId: string
    merchantName: string
    deliveryFee: number
    minOrder: number
    items: CartItem[]
    subtotal: number
  }>
  totalAmount: number
  totalDeliveryFee: number
  finalAmount: number
  itemCount: number
}

export interface TakeoutOrder {
  id: string
  orderNo: string
  merchantId: string
  merchantName: string
  items: OrderItem[]
  totalAmount: number
  deliveryFee: number
  discountAmount: number
  finalAmount: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  deliveryAddress: DeliveryAddress
  remark?: string
  estimatedDeliveryTime: string
  actualDeliveryTime?: string
  createdAt: string
  paidAt?: string
  deliveredAt?: string
  cancelledAt?: string
  cancelReason?: string
}

export interface OrderItem {
  dishId: string
  dishName: string
  dishImage: string
  quantity: unit
  price: number
  totalPrice: number
  specs?: string
  selectedSpecs?: Record<string, SpecOption[]> // 新增：选中的规格详情
}

export type PaymentMethod = 'alipay' | 'wechat' | 'balance'

export type OrderStatus = 'pending_payment' | 'pending_shipment' | 'shipped' | 'completed' | 'cancelled' | 'refunding'

export interface DeliveryAddress {
  id: string
  recipientName: string
  phone: string
  dormitory: string
  roomNumber: string
  detailAddress: string
  isDefault: boolean
  latitude?: number
  longitude?: number
  // ====== 新增：智能推荐相关 ======
  distanceToMerchant?: number // 距离商家的距离
  estimatedTime?: number // 预计配送时间(分钟)
  isRecommended?: boolean // 是否为推荐地址
  lastUsedAt?: string // 最后使用时间
}

export interface DeliveryTrackInfo {
  orderNo: string
  status: 'accepted' | 'preparing' | 'picking_up' | 'delivering' | 'delivered'
  currentStep: number
  steps: DeliveryStep[]
  riderInfo?: RiderInfo
  estimatedArrival: string
  // ====== 新增：实时追踪地图 ======
  riderLocation?: { latitude: number; longitude: number } // 骑手实时位置
  routePoints?: Array<{ latitude: number; longitude: number }> // 路线点
}

export interface DeliveryStep {
  status: string
  title: string
  desc: string
  time: string
  completed: boolean
}

export interface RiderInfo {
  name: string
  avatar: string
  phone: string
}

// ====== 新增：外卖评价系统 ======
export interface TakeoutReview {
  id: number
  orderId: string
  userId: number
  userName: string
  userAvatar?: string
  merchantId: string
  merchantRating: number // 商家评分 1-5
  deliveryRating: number // 配送评分 1-5
  tasteRating: number // 口味评分 1-5
  packagingRating: number // 包装评分 1-5
  content: string
  images?: string[]
  isAnonymous: boolean
  createdAt: string
  reply?: {
    content: string
    repliedBy: string
    createdAt: string
  }
}

export interface CreateTakeoutReviewRequest {
  orderId: string
  merchantRating: number
  deliveryRating: number
  tasteRating: number
  packagingRating: number
  content: string
  images?: string[]
  isAnonymous?: boolean
}
