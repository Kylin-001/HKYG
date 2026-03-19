// 订单相关类型定义

export interface Order {
  id: string
  orderNo: string
  userId: string
  userName: string
  userPhone: string
  userAddress: string
  totalAmount: number
  discountAmount: number
  actualAmount: number
  paymentMethod: string
  paymentStatus: number // 1-待支付 2-已支付 3-支付失败 4-已退款
  orderStatus: number // 1-待确认 2-已确认 3-配送中 4-已完成 5-已取消
  deliveryType: number // 1-快递配送 2-自提 3-外卖配送
  deliveryAddress?: string
  deliveryFee: number
  remark?: string
  items: OrderItem[]
  createTime: string
  updateTime: string
  paymentTime?: string
  deliveryTime?: string
  completeTime?: string
  cancelTime?: string
  cancelReason?: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  productImage: string
  productPrice: number
  quantity: number
  totalPrice: number
  specifications?: string
}

export interface OrderSearchParams {
  orderNo?: string
  userId?: string
  userName?: string
  userPhone?: string
  paymentStatus?: string
  orderStatus?: string
  deliveryType?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  pageNum?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface OrderListResponse {
  list: Order[]
  total: number
  pageNum: number
  pageSize: number
}

export interface OrderStats {
  total: number
  todayCount: number
  todayAmount: number
  pendingPayment: number
  pendingConfirm: number
  delivering: number
  completed: number
  cancelled: number
  refunded: number
}

export interface OrderForm {
  id?: string
  userId: string
  items: {
    productId: string
    quantity: number
  }[]
  deliveryType: number
  deliveryAddress?: string
  remark?: string
  couponId?: string
}

// 支付相关类型
export interface Payment {
  id: string
  orderId: string
  orderNo: string
  paymentNo: string
  amount: number
  paymentMethod: string
  paymentStatus: number
  transactionId?: string
  paymentTime?: string
  createTime: string
  updateTime: string
}

export interface PaymentParams {
  orderId: string
  paymentMethod: string
  returnUrl?: string
  notifyUrl?: string
}

export interface PaymentResult {
  success: boolean
  paymentUrl?: string
  qrCode?: string
  message?: string
}

// 退款相关类型
export interface Refund {
  id: string
  orderId: string
  orderNo: string
  refundNo: string
  refundAmount: number
  refundReason: string
  refundStatus: number // 1-申请中 2-审核通过 3-已退款 4-审核拒绝
  applyTime: string
  auditTime?: string
  refundTime?: string
  auditRemark?: string
}

export interface RefundForm {
  orderId: string
  refundAmount: number
  refundReason: string
  refundItems?: {
    orderItemId: string
    quantity: number
  }[]
}

// 物流相关类型
export interface Delivery {
  id: string
  orderId: string
  orderNo: string
  deliveryNo: string
  deliveryCompany: string
  deliveryStatus: number // 1-待发货 2-已发货 3-运输中 4-已签收 5-配送失败
  deliveryTime?: string
  receiveTime?: string
  tracks: DeliveryTrack[]
}

export interface DeliveryTrack {
  time: string
  status: string
  description: string
}

export interface DeliveryForm {
  orderId: string
  deliveryCompany: string
  deliveryNo: string
}

// 订单评价相关类型
export interface OrderReview {
  id: string
  orderId: string
  orderNo: string
  userId: string
  userName: string
  productId: string
  productName: string
  productImage: string
  rating: number // 1-5星
  content: string
  images?: string[]
  isAnonymous: boolean
  status: number // 1-显示 0-隐藏
  replyContent?: string
  replyTime?: string
  createTime: string
  updateTime: string
}

export interface OrderReviewForm {
  orderId: string
  reviews: {
    orderItemId: string
    rating: number
    content: string
    images?: string[]
  }[]
}
