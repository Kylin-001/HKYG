import request from '@/utils/request'
import type { 
  Order, 
  OrderListResponse, 
  OrderSearchParams, 
  OrderStats, 
  OrderForm,
  Payment,
  PaymentParams,
  PaymentResult,
  Refund,
  RefundForm,
  Delivery,
  DeliveryForm,
  OrderReview,
  OrderReviewForm
} from '@/types/order'

// 获取订单列表
export function getOrderList(params: OrderSearchParams) {
  return request<OrderListResponse>({
    url: '/order/list',
    method: 'get',
    params,
  })
}

// 获取订单详情
export function getOrderDetail(id: string) {
  return request<Order>({
    url: `/order/${id}`,
    method: 'get',
  })
}

// 创建订单
export function createOrder(data: OrderForm) {
  return request<string>({
    url: '/order',
    method: 'post',
    data,
  })
}

// 更新订单状态
export function updateOrderStatus(id: string, status: number, remark?: string) {
  return request<boolean>({
    url: `/order/${id}/status`,
    method: 'put',
    data: { status, remark },
  })
}

// 取消订单
export function cancelOrder(id: string, reason: string) {
  return request<boolean>({
    url: `/order/${id}/cancel`,
    method: 'put',
    data: { reason },
  })
}

// 确认订单
export function confirmOrder(id: string) {
  return request<boolean>({
    url: `/order/${id}/confirm`,
    method: 'put',
  })
}

// 删除订单
export function deleteOrder(id: string) {
  return request<boolean>({
    url: `/order/${id}`,
    method: 'delete',
  })
}

// 获取订单统计
export function getOrderStats() {
  return request<OrderStats>({
    url: '/order/stats',
    method: 'get',
  })
}

// 导出订单数据
export function exportOrders(params: OrderSearchParams) {
  return request<Blob>({
    url: '/order/export',
    method: 'get',
    params,
    responseType: 'blob',
  })
}

// 获取支付信息
export function getPaymentInfo(orderId: string) {
  return request<Payment>({
    url: `/payment/${orderId}`,
    method: 'get',
  })
}

// 创建支付
export function createPayment(data: PaymentParams) {
  return request<PaymentResult>({
    url: '/payment',
    method: 'post',
    data,
  })
}

// 查询支付结果
export function queryPaymentResult(orderId: string) {
  return request<PaymentResult>({
    url: `/payment/${orderId}/result`,
    method: 'get',
  })
}

// 申请退款
export function applyRefund(data: RefundForm) {
  return request<string>({
    url: '/refund',
    method: 'post',
    data,
  })
}

// 获取退款列表
export function getRefundList(params: {
  orderId?: string
  refundStatus?: number
  startDate?: string
  endDate?: string
  pageNum?: number
  pageSize?: number
}) {
  return request<{
    list: Refund[]
    total: number
    pageNum: number
    pageSize: number
  }>({
    url: '/refund/list',
    method: 'get',
    params,
  })
}

// 获取退款详情
export function getRefundDetail(id: string) {
  return request<Refund>({
    url: `/refund/${id}`,
    method: 'get',
  })
}

// 审核退款
export function auditRefund(id: string, status: number, remark?: string) {
  return request<boolean>({
    url: `/refund/${id}/audit`,
    method: 'put',
    data: { status, remark },
  })
}

// 发货
export function deliverOrder(data: DeliveryForm) {
  return request<boolean>({
    url: '/order/deliver',
    method: 'post',
    data,
  })
}

// 获取物流信息
export function getDeliveryInfo(orderId: string) {
  return request<Delivery>({
    url: `/delivery/${orderId}`,
    method: 'get',
  })
}

// 创建订单评价
export function createOrderReview(data: OrderReviewForm) {
  return request<boolean>({
    url: '/order/review',
    method: 'post',
    data,
  })
}

// 获取订单评价列表
export function getOrderReviewList(params: {
  orderId?: string
  productId?: string
  rating?: number
  status?: number
  pageNum?: number
  pageSize?: number
}) {
  return request<{
    list: OrderReview[]
    total: number
    pageNum: number
    pageSize: number
  }>({
    url: '/order/review/list',
    method: 'get',
    params,
  })
}

// 回复订单评价
export function replyOrderReview(id: string, content: string) {
  return request<boolean>({
    url: `/order/review/${id}/reply`,
    method: 'post',
    data: { content },
  })
}