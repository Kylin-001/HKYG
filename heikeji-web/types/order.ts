// ============================================
// 订单相关类型定义
// ============================================

export interface Order {
  id: string
  orderNo: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  discountAmount: number
  shippingFee: number
  payAmount: number
  status: OrderStatus
  paymentMethod?: PaymentMethod
  paymentTime?: string
  shippingAddress: ShippingAddress
  trackingNo?: string
  trackingCompany?: string
  remark?: string
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
}

export type OrderStatus =
  | 'pending_payment'
  | 'pending_shipment'
  | 'shipped'
  | 'completed'
  | 'cancelled'
  | 'refunding'
  | 'refunded'

export type PaymentMethod = 'alipay' | 'wechat' | 'balance' | 'campus_card'

export interface OrderItem {
  productId: string | number
  productName: string
  productImage: string
  price: number
  quantity: number
  spec?: string
}

export interface ShippingAddress {
  id: string
  receiverName: string
  receiverPhone: string
  province: string
  city: string
  district: string
  detail: string
  fullAddress: string
  isDefault: boolean
  tag?: string
}

export interface CreateOrderRequest {
  addressId: string
  items: {
    productId: string
    name?: string
    image?: string
    price?: number
    quantity: number
  }[]
  remark?: string
  paymentMethod: PaymentMethod
  couponId?: string
  // 金额信息
  totalAmount?: number
  discountAmount?: number
  couponDiscount?: number
  pointsDiscount?: number
  shippingFee?: number
  payAmount?: number
}

export interface OrderListParams {
  status?: OrderStatus
  keyword?: string
  page?: number
  pageSize?: number
}

export interface OrderListResponse {
  list: Order[]
  total: number
  page: number
  pageSize: number
}

export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; color: string }> = {
  pending_payment: { label: '待付款', color: '#D4A843' },
  pending_shipment: { label: '待发货', color: '#1A5FB4' },
  shipped: { label: '待收货', color: '#2D8659' },
  completed: { label: '已完成', color: '#718096' },
  cancelled: { label: '已取消', color: '#A0AEC0' },
  refunding: { label: '退款中', color: '#C41E3A' },
  refunded: { label: '已退款', color: '#A0AEC0' },
}
