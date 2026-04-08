import { get, post } from '@/utils/request'
import type { PaymentItem, PaymentRecord, GreenChannelApplication, PaymentSummary } from '@/types/payment'

// 缴费项目
export function getPaymentItems(): Promise<PaymentItem[]> {
  return get('/payment/items')
}

export function getPaymentItem(id: string): Promise<PaymentItem> {
  return get(`/payment/items/${id}`)
}

// 缴费操作
export function createPayment(data: { itemIds: string[]; method: string }): Promise<{ paymentUrl: string; orderId: string }> {
  return post('/payment/create', data)
}

export function queryPaymentStatus(orderId: string): Promise<{ status: string; paidAt?: string }> {
  return get(`/payment/status/${orderId}`)
}

// 缴费记录
export function getPaymentRecords(params?: { type?: string; year?: string }): Promise<PaymentRecord[]> {
  return get('/payment/records', { params })
}

// 汇总信息
export function getPaymentSummary(): Promise<PaymentSummary> {
  return get('/payment/summary')
}

// 绿色通道
export function submitGreenChannel(data: Omit<GreenChannelApplication, 'id' | 'status' | 'submittedAt'>): Promise<GreenChannelApplication> {
  return post('/payment/green-channel', data)
}

export function getGreenChannelApplications(): Promise<GreenChannelApplication[]> {
  return get('/payment/green-channel')
}
