import { get, post, put, del } from '@/utils/request'
import type { Order, OrderListParams, OrderListResponse, CreateOrderRequest, ShippingAddress, OrderReview, CreateOrderReviewRequest, RefundRequest, CreateRefundRequest, InvoiceInfo, CreateInvoiceRequest, LogisticsTracking, ExportOrderParams } from '@/types/order'

export function getOrderList(params?: OrderListParams): Promise<OrderListResponse> {
  return get('/orders', { params })
}

export function getOrderDetail(orderId: string): Promise<Order> {
  return get(`/orders/${orderId}`)
}

export function createOrder(data: CreateOrderRequest): Promise<Order> {
  return post('/orders', data)
}

export function cancelOrder(orderId: string, reason?: string): Promise<void> {
  return post(`/orders/${orderId}/cancel`, { reason })
}

export function confirmReceive(orderId: string): Promise<void> {
  return post(`/orders/${orderId}/confirm`)
}

export function deleteOrder(orderId: string | number): Promise<void> {
  return del(`/orders/${orderId}`)
}

export interface OrderTrackingInfo {
  orderId: string
  status: string
  steps: {
    time: string
    status: string
    description: string
    location?: string
  }[]
  currentLocation?: string
  estimatedDelivery?: string
}

export function getOrderTracking(orderId: string): Promise<OrderTrackingInfo> {
  return get(`/orders/${orderId}/tracking`)
}

export function getAddressList(): Promise<ShippingAddress[]> {
  return get('/addresses')
}

export function addAddress(data: Omit<ShippingAddress, 'id'>): Promise<ShippingAddress> {
  return post('/addresses', data)
}

export function updateAddress(id: string, data: Partial<ShippingAddress>): Promise<ShippingAddress> {
  return put(`/addresses/${id}`, data)
}

export function deleteAddress(id: string): Promise<void> {
  return post(`/addresses/${id}/delete`)
}

export function setDefaultAddress(id: string): Promise<void> {
  return post(`/addresses/${id}/default`)
}

export interface PayOrderRequest {
  orderId: string
  paymentMethod: string
  password?: string
}

export interface PayOrderResponse {
  paymentId: string
  orderId: string
  status: string
  paymentTime: string
  amount: number
}

export function payOrder(data: PayOrderRequest): Promise<PayOrderResponse> {
  return post('/payments', data)
}

// ====== 新增：订单评价功能 ======

/**
 * 获取订单评价列表（用户的所有评价）
 */
export function getOrderReviews(params?: PaginationParams): Promise<{ list: OrderReview[]; total: number }> {
  return get('/orders/reviews', { params })
}

/**
 * 获取指定订单的评价详情
 */
export function getOrderReview(orderId: number): Promise<OrderReview | null> {
  return get(`/orders/${orderId}/review`)
}

/**
 * 提交订单评价（支持多商品批量评价）
 */
export function submitOrderReview(data: CreateOrderReviewRequest): Promise<void> {
  return post('/orders/reviews', data)
}

// ====== 新增：售后/退款功能 ======

/**
 * 获取用户的退款/售后列表
 */
export function getRefundList(params?: PaginationParams & { status?: string }): Promise<{ list: RefundRequest[]; total: number }> {
  return get('/refunds', { params })
}

/**
 * 获取退款详情
 */
export function getRefundDetail(refundId: number): Promise<RefundRequest> {
  return get(`/refunds/${refundId}`)
}

/**
 * 申请退款/售后
 */
export function applyRefund(data: CreateRefundRequest): Promise<RefundRequest> {
  return post('/refunds', data)
}

/**
 * 取消退款申请（仅pending状态可取消）
 */
export function cancelRefund(refundId: number): Promise<void> {
  return post(`/refunds/${refundId}/cancel`)
}

/**
 * 填写退货物流单号
 */
export function submitReturnTracking(refundId: number, trackingNumber: string, logisticsCompany: string): Promise<void> {
  return post(`/refunds/${refundId}/return-tracking`, { trackingNumber, logisticsCompany })
}

// ====== 新增：发票功能 ======

/**
 * 获取发票列表
 */
export function getInvoiceList(params?: PaginationParams): Promise<{ list: InvoiceInfo[]; total: number }> {
  return get('/invoices', { params })
}

/**
 * 申请开具发票
 */
export function applyInvoice(data: CreateInvoiceRequest): Promise<InvoiceInfo> {
  return post('/invoices', data)
}

/**
 * 获取发票详情
 */
export function getInvoiceDetail(invoiceId: number): Promise<InvoiceInfo> {
  return get(`/invoices/${invoiceId}`)
}

/**
 * 下载电子发票（返回下载链接或文件）
 */
export function downloadInvoice(invoiceId: number): Promise<{ url: string; fileName: string }> {
  return get(`/invoices/${invoiceId}/download`)
}

// ====== 新增：物流查询功能 ======

/**
 * 获取订单实时物流信息
 */
export function getOrderLogistics(orderId: string): Promise<LogisticsTracking> {
  return get(`/orders/${orderId}/logistics`)
}

/**
 * 订阅物流更新（WebSocket 或轮询）
 */
export function subscribeLogisticsUpdates(orderId: string, callback: (tracking: LogisticsTracking) => void): () => void {
  // 这里可以实现 WebSocket 订阅或定时轮询
  // 简化实现：使用轮询
  let polling = true

  const poll = async () => {
    if (!polling) return

    try {
      const tracking = await getOrderLogistics(orderId)
      callback(tracking)
    } catch (error) {
      console.error('获取物流信息失败:', error)
    }

    // 每30秒刷新一次
    setTimeout(poll, 30000)
  }

  poll()

  // 返回取消订阅函数
  return () => { polling = false }
}

// ====== 新增：订单导出功能 ======

/**
 * 导出订单（PDF或Excel）
 */
export function exportOrders(params: ExportOrderParams): Promise<{ downloadUrl: string; fileName: string }> {
  return post('/orders/export', params)
}

/**
 * 获取导出任务状态（异步导出）
 */
export function getExportStatus(taskId: string): Promise<{
  status: 'processing' | 'completed' | 'failed'
  downloadUrl?: string
  error?: string
}> {
  return get(`/orders/export/status/${taskId}`)
}
