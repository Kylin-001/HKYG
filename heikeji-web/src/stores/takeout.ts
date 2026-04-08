import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Merchant, MerchantDetail, DeliveryTrackInfo, CreateTakeoutOrderRequest, TakeoutOrder } from '@/types/takeout'
import * as takeoutApi from '@/api/takeout'

export const useTakeoutStore = defineStore('takeout', () => {
  const merchants = ref<Merchant[]>([])
  const merchantDetail = ref<MerchantDetail | null>(null)
  const nearbyMerchants = ref<Merchant[]>([])
  const hotMerchants = ref<Merchant[]>([])
  const deliveryTrack = ref<DeliveryTrackInfo | null>(null)
  const myOrders = ref<TakeoutOrder[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchMerchants(params?: { category?: string; keyword?: string; page?: number }) {
    try {
      loading.value = true
      error.value = null
      const res = await takeoutApi.getMerchantList(params)
      merchants.value = res.list || []
      return merchants.value
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取商家列表失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMerchantDetail(merchantId: string) {
    try {
      loading.value = true
      const res = await takeoutApi.getMerchantDetail(merchantId)
      merchantDetail.value = res
      return merchantDetail.value
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取商家详情失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchNearbyMerchants() {
    try {
      const res = await takeoutApi.getNearbyMerchants()
      nearbyMerchants.value = res || []
      return nearbyMerchants.value
    } catch (err) {
      console.error('获取附近商家失败:', err)
      return []
    }
  }

  async function fetchHotMerchants() {
    try {
      const res = await takeoutApi.getHotMerchants()
      hotMerchants.value = res || []
      return hotMerchants.value
    } catch (err) {
      console.error('获取热门商家失败:', err)
      return []
    }
  }

  async function fetchDeliveryTrack(orderId: string) {
    try {
      const res = await takeoutApi.getDeliveryTrack(orderId)
      deliveryTrack.value = res
      return deliveryTrack.value
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取配送信息失败'
      error.value = message
      throw err
    }
  }

  async function createOrder(data: CreateTakeoutOrderRequest) {
    const res = await takeoutApi.createTakeoutOrder(data)
    return res
  }

  async function fetchMyOrders(params?: { status?: string; page?: number }) {
    try {
      const res = await takeoutApi.getTakeoutOrders(params)
      myOrders.value = res.list || []
      return myOrders.value
    } catch (err) {
      console.error('获取外卖订单失败:', err)
      return []
    }
  }

  return {
    merchants, merchantDetail, nearbyMerchants, hotMerchants,
    deliveryTrack, myOrders, loading, error,
    fetchMerchants, fetchMerchantDetail, fetchNearbyMerchants,
    fetchHotMerchants, fetchDeliveryTrack, createOrder, fetchMyOrders,
  }
})
