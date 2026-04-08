export interface Order {
  id: number
  orderNo: string
  userId: number
  items: OrderItem[]
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod
  totalAmount: number
  discountAmount: number
  shippingAmount: number
  finalAmount: number
  address: ShippingAddress
  remark?: string
  couponId?: number
  couponDiscount?: number
  createdAt: string
  updatedAt: string
  paidAt?: string
  shippedAt?: string
  deliveredAt?: string
  cancelledAt?: string
  cancelledReason?: string
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunding'
  | 'refunded'

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'failed'

export type PaymentMethod = 'alipay' | 'wechat' | 'balance' | 'campus_card'

export interface OrderItem {
  id: number
  productId: number
  productName: string
  productImage: string
  price: number
  quantity: number
  specifications?: Record<string, string>
  subtotal: number
}

export interface ShippingAddress {
  id: number
  recipientName: string
  phone: string
  province: string
  city: string
  district: string
  detailAddress: string
  fullAddress: string
  isDefault: boolean
}

export interface OrderSearchParams extends PaginationParams {
  status?: OrderStatus
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  keyword?: string
}

// ====== 新增：订单评价相关类型 ======
export interface OrderReview {
  id: number
  orderId: number
  orderItemId: number
  productId: number
  userId: number
  rating: number // 商品评分 1-5
  merchantRating: number // 商家评分 1-5
  logisticsRating: number // 物流评分 1-5
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

export interface CreateOrderReviewRequest {
  orderId: number
  items: Array<{
    orderItemId: number
    productId: number
    rating: number
    merchantRating: number
    logisticsRating: number
    content: string
    images?: string[]
    specifications?: Record<string, string>
  }>
  isAnonymous?: boolean
}

// ====== 新增：售后/退款相关类型 ======
export type RefundReason =
  | 'not_as_described'
  | 'quality_issue'
  | 'damaged'
  | 'wrong_item'
  | 'not_received'
  | 'no_longer_needed'
  | 'other'

export type RefundStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'processing'
  | 'shipping_back'
  | 'completed'
  | 'cancelled'

export interface RefundRequest {
  id: number
  orderId: number
  orderItemId?: number
  refundNo: string
  reason: RefundReason
  reasonDetail?: string
  amount: number
  status: RefundStatus
  evidenceImages?: string[]
  trackingNumber?: string
  rejectReason?: string
  createdAt: string
  updatedAt: string
  approvedAt?: string
  completedAt?: string
}

export interface CreateRefundRequest {
  orderId: number
  orderItemId?: number
  reason: RefundReason
  reasonDetail?: string
  amount: number
  evidenceImages?: string[]
}

// ====== 新增：发票相关类型 ======
export type InvoiceType = 'personal' | 'company'
export type InvoiceCategory = 'normal' | 'vat' // 普票/专票

export interface InvoiceInfo {
  id: number
  orderId: number
  invoiceType: InvoiceType
  invoiceCategory: InvoiceCategory
  title: string // 发票抬头
  taxNumber?: string // 税号（企业）
  email: string // 接收邮箱
  amount: number
  status: 'pending' | 'issued' | 'sent' | 'failed'
  invoiceUrl?: string // 电子发票下载链接
  createdAt: string
  issuedAt?: string
}

export interface CreateInvoiceRequest {
  orderId: number
  invoiceType: InvoiceType
  invoiceCategory: InvoiceCategory
  title: string
  taxNumber?: string
  email: string
}

// ====== 新增：物流信息类型 ======
export interface LogisticsTracking {
  orderId: number
  trackingNumber: string
  logisticsCompany: string
  status: 'collected' | 'in_transit' | 'arriving' | 'delivered'
  currentLocation?: string
  estimatedDelivery?: string
  traces: LogisticsTrace[]
}

export interface LogisticsTrace {
  time: string
  location: string
  description: string
  status: string
}

// ====== 新增：订单导出类型 ======
export type ExportFormat = 'pdf' | 'excel'

export interface ExportOrderParams {
  orderIds?: number[] // 导出指定订单，不传则按筛选条件导出
  format: ExportFormat
  includeDetails?: boolean
  startDate?: string
  endDate?: string
  status?: OrderStatus
}
