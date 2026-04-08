import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PaymentItem, PaymentRecord, GreenChannelApplication, PaymentSummary } from '@/types/payment'
import * as api from '@/api/payment'

export const usePaymentStore = defineStore('payment', () => {
  const items = ref<PaymentItem[]>([])
  const records = ref<PaymentRecord[]>([])
  const summary = ref<PaymentSummary | null>(null)
  const greenChannelApps = ref<GreenChannelApplication[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchItems() {
    try {
      loading.value = true
      items.value = await api.getPaymentItems()
      error.value = null
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取缴费项目失败'
    } finally {
      loading.value = false
    }
  }

  async function fetchRecords(params?: { type?: string; year?: string }) {
    try {
      records.value = await api.getPaymentRecords(params)
    } catch (err) {
      console.error('获取缴费记录失败:', err)
    }
  }

  async function fetchSummary() {
    try {
      summary.value = await api.getPaymentSummary()
    } catch (err) {
      console.error('获取缴费汇总失败:', err)
    }
  }

  async function payItems(itemIds: string[], method: string) {
    try {
      loading.value = true
      const res = await api.createPayment({ itemIds, method })
      await fetchItems()
      await fetchSummary()
      return res
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '创建支付订单失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function submitGreenChannel(data: Omit<GreenChannelApplication, 'id' | 'status' | 'submittedAt'>) {
    try {
      loading.value = true
      const result = await api.submitGreenChannel(data)
      await fetchGreenChannelApps()
      return result
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '提交绿色通道申请失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchGreenChannelApps() {
    try {
      greenChannelApps.value = await api.getGreenChannelApplications()
    } catch (err) {
      console.error('获取绿色通道申请记录失败:', err)
    }
  }

  return { items, records, summary, greenChannelApps, loading, error, fetchItems, fetchRecords, fetchSummary, payItems, submitGreenChannel, fetchGreenChannelApps }
})
