import { get, post } from '@/utils/request'
import type { Merchant, MerchantDetail, DeliveryTrackInfo, CreateTakeoutOrderRequest } from '@/types/takeout'

export function getMerchantList(params?: { category?: string; keyword?: string; page?: number; pageSize?: number }): Promise<{ list: Merchant[]; total: number }> {
  return get('/takeout/merchants', { params })
}

export function getMerchantDetail(merchantId: string): Promise<MerchantDetail> {
  return get(`/takeout/merchants/${merchantId}`)
}

export function getNearbyMerchants(): Promise<Merchant[]> {
  return get('/takeout/nearby')
}

export function getHotMerchants(): Promise<Merchant[]> {
  return get('/takeout/hot')
}

export function getDeliveryTrack(orderId: string): Promise<DeliveryTrackInfo> {
  return get(`/takeout/orders/${orderId}/track`)
}

export function createTakeoutOrder(data: CreateTakeoutOrderRequest): Promise<any> {
  return post('/takeout/orders', data)
}

export function getTakeoutOrders(params?: { status?: string; page?: number }): Promise<{ list: any[]; total: number }> {
  return get('/takeout/orders', { params })
}
