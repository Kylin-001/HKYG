import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order, OrderListParams, ShippingAddress, CreateOrderRequest, PayOrderResponse, OrderReview, CreateOrderReviewRequest, RefundRequest, CreateRefundRequest, InvoiceInfo, CreateInvoiceRequest, LogisticsTracking } from '@/types/order'
import type { PayOrderRequest } from '@/api/order'
import * as orderApi from '@/api/order'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const addresses = ref<ShippingAddress[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 用于跟踪并发请求数
  let loadingCount = 0

  // ====== 新增状态 ======
  
  // 订单评价
  const orderReviews = ref<OrderReview[]>([])
  const currentReview = ref<OrderReview | null>(null)
  
  // 售后/退款
  const refunds = ref<RefundRequest[]>([])
  const currentRefund = ref<RefundRequest | null>(null)
  
  // 发票
  const invoices = ref<InvoiceInfo[]>([])
  
  // 物流信息
  const logisticsInfo = ref<LogisticsTracking | null>(null)

  async function fetchOrders(params?: OrderListParams) {
    try {
      loadingCount++
      loading.value = true
      error.value = null
      const res = await orderApi.getOrderList(params)
      orders.value = res.list || []
      total.value = res.total || 0
      return orders.value
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取订单失败'
      error.value = message
      throw err
    } finally {
      loadingCount--
      if (loadingCount === 0) {
        loading.value = false
      }
    }
  }

  async function fetchOrderDetail(orderId: string) {
    try {
      loadingCount++
      loading.value = true
      const res = await orderApi.getOrderDetail(orderId)
      currentOrder.value = res

      // 同时加载物流信息（如果已发货）
      if (['shipped', 'delivered', 'completed'].includes(res.status)) {
        fetchLogistics(orderId)
      }

      return currentOrder.value
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取订单详情失败'
      error.value = message
      throw err
    } finally {
      loadingCount--
      if (loadingCount === 0) {
        loading.value = false
      }
    }
  }

  async function createOrder(data: CreateOrderRequest) {
    const res = await orderApi.createOrder(data)
    currentOrder.value = res
    return res
  }

  async function cancelOrder(orderId: string, reason?: string) {
    await orderApi.cancelOrder(orderId, reason)
    await fetchOrders()
  }

  async function confirmReceive(orderId: string) {
    await orderApi.confirmReceive(orderId)
    await fetchOrders()
  }

  async function payOrder(orderId: string, paymentMethod: string, password?: string) {
    const res = await orderApi.payOrder({ orderId, paymentMethod, password })
    // 支付成功后刷新订单详情
    if (currentOrder.value?.id === orderId || currentOrder.value?.orderNo === orderId) {
      await fetchOrderDetail(orderId)
    }
    return res
  }

  async function fetchAddresses() {
    try {
      const res = await orderApi.getAddressList()
      addresses.value = res || []
    } catch (err) {
      console.error('获取地址失败:', err)
    }
  }

  async function addAddress(data: Omit<ShippingAddress, 'id'>) {
    const res = await orderApi.addAddress(data)
    await fetchAddresses()
    return res
  }

  async function updateAddress(id: string, data: Partial<ShippingAddress>) {
    await orderApi.updateAddress(id, data)
    await fetchAddresses()
  }

  async function deleteAddress(id: string) {
    await orderApi.deleteAddress(id)
    await fetchAddresses()
  }

  async function setDefaultAddress(id: string) {
    await orderApi.setDefaultAddress(id)
    await fetchAddresses()
  }

  // ====== 新增：订单评价功能 ======
  
  /**
   * 获取用户的订单评价列表
   */
  async function fetchOrderReviews(params?: PaginationParams) {
    try {
      const res = await orderApi.getOrderReviews(params)
      orderReviews.value = res.list || []
      return orderReviews.value
    } catch (err) {
      console.error('获取订单评价列表失败:', err)
      throw err
    }
  }
  
  /**
   * 获取指定订单的评价
   */
  async function fetchOrderReview(orderId: number): Promise<OrderReview | null> {
    try {
      const review = await orderApi.getOrderReview(orderId)
      currentReview.value = review
      return review
    } catch (err) {
      console.error('获取订单评价失败:', err)
      return null
    }
  }
  
  /**
   * 提交订单评价
   */
  async function submitReview(data: CreateOrderReviewRequest): Promise<void> {
    await orderApi.submitOrderReview(data)
    // 刷新评价列表
    await fetchOrderReviews()
  }

  // ====== 新增：售后/退款功能 ======
  
  /**
   * 获取退款列表
   */
  async function fetchRefunds(params?: PaginationParams & { status?: string }) {
    try {
      const res = await orderApi.getRefundList(params)
      refunds.value = res.list || []
      return refunds.value
    } catch (err) {
      console.error('获取退款列表失败:', err)
      throw err
    }
  }
  
  /**
   * 获取退款详情
   */
  async function fetchRefundDetail(refundId: number): Promise<RefundRequest> {
    try {
      const refund = await orderApi.getRefundDetail(refundId)
      currentRefund.value = refund
      return refund
    } catch (err) {
      console.error('获取退款详情失败:', err)
      throw err
    }
  }
  
  /**
   * 申请退款
   */
  async function applyForRefund(data: CreateRefundRequest): Promise<RefundRequest> {
    const refund = await orderApi.applyRefund(data)
    // 刷新退款列表
    await fetchRefunds()
    return refund
  }
  
  /**
   * 取消退款申请
   */
  async function cancelRefundApplication(refundId: number): Promise<void> {
    await orderApi.cancelRefund(refundId)
    await fetchRefunds()
  }
  
  /**
   * 提交退货物流单号
   */
  async function submitReturnTracking(refundId: number, trackingNumber: string, logisticsCompany: string): Promise<void> {
    await orderApi.submitReturnTracking(refundId, trackingNumber, logisticsCompany)
    await fetchRefundDetail(refundId)
  }

  // ====== 新增：发票功能 ======
  
  /**
   * 获取发票列表
   */
  async function fetchInvoices(params?: PaginationParams) {
    try {
      const res = await orderApi.getInvoiceList(params)
      invoices.value = res.list || []
      return invoices.value
    } catch (err) {
      console.error('获取发票列表失败:', err)
      throw err
    }
  }
  
  /**
   * 申请开具发票
   */
  async function applyForInvoice(data: CreateInvoiceRequest): Promise<InvoiceInfo> {
    const invoice = await orderApi.applyInvoice(data)
    await fetchInvoices()
    return invoice
  }
  
  /**
   * 下载发票
   */
  async function downloadInvoiceFile(invoiceId: number): Promise<{ url: string; fileName: string }> {
    return orderApi.downloadInvoice(invoiceId)
  }

  // ====== 新增：物流查询功能 ======
  
  /**
   * 获取订单物流信息
   */
  async function fetchLogistics(orderId: string): Promise<LogisticsTracking> {
    try {
      const tracking = await orderApi.getOrderLogistics(orderId)
      logisticsInfo.value = tracking
      return tracking
    } catch (err) {
      console.error('获取物流信息失败:', err)
      throw err
    }
  }
  
  /**
   * 订阅物流更新（返回取消订阅函数）
   */
  function subscribeToLogisticsUpdates(orderId: string, callback: (tracking: LogisticsTracking) => void): () => void {
    return orderApi.subscribeLogisticsUpdates(orderId, callback)
  }

  // ====== 新增：订单导出功能 ======
  
  /**
   * 导出订单
   */
  async function exportOrders(params: { format: 'pdf' | 'excel'; includeDetails?: boolean }) {
    return orderApi.exportOrders({
      format: params.format,
      includeDetails: params.includeDetails,
    })
  }

  return {
    // 原有状态和方法
    orders, currentOrder, addresses, total, loading, error,
    fetchOrders, fetchOrderDetail, createOrder,
    cancelOrder, confirmReceive, payOrder, fetchAddresses,
    addAddress, updateAddress, deleteAddress, setDefaultAddress,
    
    // 订单评价
    orderReviews, currentReview,
    fetchOrderReviews, fetchOrderReview, submitReview,
    
    // 售后/退款
    refunds, currentRefund,
    fetchRefunds, fetchRefundDetail, applyForRefund, cancelRefundApplication, submitReturnTracking,
    
    // 发票管理
    invoices,
    fetchInvoices, applyForInvoice, downloadInvoiceFile,
    
    // 物流查询
    logisticsInfo,
    fetchLogistics, subscribeToLogisticsUpdates,
    
    // 订单导出
    exportOrders,
  }
})
