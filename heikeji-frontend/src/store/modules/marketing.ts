import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getRefundList, getRefundDetail, approveRefund, rejectRefund } from '@/api/order'
import logger from '@/utils/logger'

// 定义退款项类型
interface RefundItem {
  id: string
  refundNo: string
  orderNo: string
  userId: string
  userName: string
  type: number
  refundAmount: number
  status: number
  statusText: string
  applyTime: string
  processTime: string
  refundReason: string
  refundExplain: string
  images: string[]
  handler: string
  processRemark: string
  refundItems: RefundProductItem[]
}

// 定义退款商品项类型
interface RefundProductItem {
  productImage: string
  productName: string
  skuAttributes: string
  price: number
  quantity: number
  refundAmount: number
}

// 定义退款查询参数类型
interface RefundQueryParams {
  keyword?: string
  orderNo?: string
  userId?: number
  status?: number
  createTimeRange?: [string, string]
  page?: number
  size?: number
  startDate?: string
  endDate?: string
  type?: string
}

// 创建并导出marketing store
export const useMarketingStore = defineStore('marketing', () => {
  // 状态定义
  const refunds = ref<RefundItem[]>([])
  const refundDetail = ref<RefundItem | null>(null)
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取退款列表
  async function getRefunds(params: RefundQueryParams) {
    try {
      loading.value = true
      error.value = null

      const response = await getRefundList(params)
      
      // 确保返回格式兼容
      const result = {
        success: true,
        data: {
          list: (response.data && response.data.records) || response.list || [],
          total: (response.data && response.data.total) || response.total || 0
        }
      }

      refunds.value = result.data.list
      total.value = result.data.total

      return result
    } catch (err: any) {
      logger.error('获取退款列表失败:', err)
      error.value = err.message || '获取退款列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取退款详情
  async function getRefundDetail(refundId: string) {
    try {
      loading.value = true
      error.value = null

      const response = await getRefundDetail(refundId)
      
      // 确保返回格式兼容
      const result = {
        success: true,
        data: response
      }

      refundDetail.value = result.data

      return result
    } catch (err: any) {
      logger.error('获取退款详情失败:', err)
      error.value = err.message || '获取退款详情失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 处理退款（同意或拒绝）
  async function processRefund(params: { id: string; type: number; remark: string }) {
    try {
      loading.value = true
      error.value = null

      let response
      if (params.type === 1) {
        // 同意退款
        response = await approveRefund(params.id, params.remark)
      } else {
        // 拒绝退款
        response = await rejectRefund(params.id, params.remark)
      }
      
      // 确保返回格式兼容
      const result = {
        success: true,
        data: response
      }

      return result
    } catch (err: any) {
      logger.error('处理退款失败:', err)
      error.value = err.message || '处理退款失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    refunds,
    refundDetail,
    total,
    loading,
    error,

    // 方法
    getRefunds,
    getRefundDetail,
    processRefund
  }
})