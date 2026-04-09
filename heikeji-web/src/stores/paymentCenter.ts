import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getPaymentOverview,
  getTuitionInfo,
  payTuition,
  getDormitoryFeeInfo,
  payDormitoryFee,
  getPaymentRecords,
  applyGreenChannel
} from '@/api/paymentCenter'
import type {
  PaymentOverview,
  PendingPaymentItem,
  TuitionInfo,
  DormitoryFeeInfo,
  PaymentRecord,
  GreenChannelRequest
} from '@/api/paymentCenter'

/**
 * 缴费中心状态管理
 * 管理学费、住宿费缴纳，缴费记录，绿色通道申请等功能
 */
export const usePaymentCenterStore = defineStore('paymentCenter', () => {
  // ==================== State ====================
  
  /** 缴费概览 */
  const overview = ref<PaymentOverview | null>(null)
  
  /** 学费信息 */
  const tuitionInfo = ref<TuitionInfo | null>(null)
  
  /** 住宿费信息 */
  const dormitoryFeeInfo = ref<DormitoryFeeInfo | null>(null)
  
  /** 缴费记录列表 */
  const records = ref<PaymentRecord[]>([])
  
  /** 记录总数 */
  const recordsTotal = ref(0)
  
  /** 当前页码 */
  const currentPage = ref(1)
  
  /** 每页数量 */
  const pageSize = ref(10)
  
  /** 加载状态 */
  const loading = ref(false)
  
  /** 提交状态 */
  const submitting = ref(false)
  
  /** 错误信息 */
  const error = ref<string | null>(null)

  // ==================== Getters ====================
  
  /**
   * 待缴费用总额
   */
  const totalPendingAmount = computed(() => {
    return overview.value?.totalPending || 0
  })
  
  /**
   * 待缴费用项目列表
   */
  const pendingItems = computed(() => {
    return overview.value?.items || []
  })
  
  /**
   * 是否有待缴费用
   */
  const hasPendingPayments = computed(() => {
    return pendingItems.value.length > 0
  })
  
  /**
   * 学费待缴金额
   */
  const tuitionPendingAmount = computed(() => {
    if (!tuitionInfo.value) return 0
    return tuitionInfo.value.totalAmount - tuitionInfo.value.paidAmount
  })
  
  /**
   * 学费缴纳状态
   */
  const tuitionStatus = computed(() => {
    return tuitionInfo.value?.status || 'pending'
  })
  
  /**
   * 住宿费待缴金额
   */
  const dormitoryPendingAmount = computed(() => {
    if (!dormitoryFeeInfo.value) return 0
    return dormitoryFeeInfo.value.amount - dormitoryFeeInfo.value.paidAmount
  })
  
  /**
   * 住宿费缴纳状态
   */
  const dormitoryStatus = computed(() => {
    return dormitoryFeeInfo.value?.status || 'pending'
  })
  
  /**
   * 缴费记录分页信息
   */
  const recordsPagination = computed(() => ({
    page: currentPage.value,
    pageSize: pageSize.value,
    total: recordsTotal.value,
    totalPages: Math.ceil(recordsTotal.value / pageSize.value)
  }))
  
  /**
   * 是否还有更多记录
   */
  const hasMoreRecords = computed(() => {
    return currentPage.value * pageSize.value < recordsTotal.value
  })

  // ==================== Actions ====================
  
  /**
   * 获取缴费概览
   */
  async function fetchOverview() {
    loading.value = true
    error.value = null
    
    try {
      const res = await getPaymentOverview()
      overview.value = res
      return res
    } catch (err: any) {
      error.value = err.message || '获取缴费概览失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 获取学费信息
   */
  async function fetchTuitionInfo(semester?: string) {
    loading.value = true
    error.value = null
    
    try {
      const res = await getTuitionInfo(semester)
      tuitionInfo.value = res
      return res
    } catch (err: any) {
      error.value = err.message || '获取学费信息失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 缴纳学费
   * @param semester 学期
   * @param amount 缴纳金额
   * @param method 支付方式
   */
  async function payTuitionFee(semester: string, amount: number, method: string) {
    submitting.value = true
    error.value = null
    
    try {
      const res = await payTuition({
        semester,
        amount,
        method
      })
      
      // 缴费成功后刷新学费信息
      await fetchTuitionInfo(semester)
      // 刷新缴费概览
      await fetchOverview()
      
      return res
    } catch (err: any) {
      error.value = err.message || '学费缴纳失败'
      throw err
    } finally {
      submitting.value = false
    }
  }
  
  /**
   * 获取住宿费信息
   */
  async function fetchDormitoryFeeInfo(year?: string) {
    loading.value = true
    error.value = null
    
    try {
      const res = await getDormitoryFeeInfo(year)
      dormitoryFeeInfo.value = res
      return res
    } catch (err: any) {
      error.value = err.message || '获取住宿费信息失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 缴纳住宿费
   * @param year 学年
   * @param amount 缴纳金额
   * @param method 支付方式
   */
  async function payDormitoryFeeFee(year: string, amount: number, method: string) {
    submitting.value = true
    error.value = null
    
    try {
      const res = await payDormitoryFee({
        year,
        amount,
        method
      })
      
      // 缴费成功后刷新住宿费信息
      await fetchDormitoryFeeInfo(year)
      // 刷新缴费概览
      await fetchOverview()
      
      return res
    } catch (err: any) {
      error.value = err.message || '住宿费缴纳失败'
      throw err
    } finally {
      submitting.value = false
    }
  }
  
  /**
   * 获取缴费记录
   * @param page 页码
   * @param pageSize 每页数量
   */
  async function fetchRecords(page = 1, pageSize = 10) {
    loading.value = true
    error.value = null
    
    try {
      const res = await getPaymentRecords({ page, pageSize })
      
      if (page === 1) {
        records.value = res.list
      } else {
        records.value.push(...res.list)
      }
      
      recordsTotal.value = res.total
      currentPage.value = page
      
      return res
    } catch (err: any) {
      error.value = err.message || '获取缴费记录失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 加载更多记录
   */
  async function loadMoreRecords() {
    if (!hasMoreRecords.value || loading.value) return
    
    await fetchRecords(currentPage.value + 1, pageSize.value)
  }
  
  /**
   * 刷新记录列表
   */
  async function refreshRecords() {
    await fetchRecords(1, pageSize.value)
  }
  
  /**
   * 申请绿色通道
   * @param data 申请信息
   */
  async function applyForGreenChannel(data: GreenChannelRequest) {
    submitting.value = true
    error.value = null
    
    try {
      const res = await applyGreenChannel(data)
      
      // 申请成功后刷新缴费概览
      await fetchOverview()
      
      return res
    } catch (err: any) {
      error.value = err.message || '绿色通道申请失败'
      throw err
    } finally {
      submitting.value = false
    }
  }
  
  /**
   * 清除错误信息
   */
  function clearError() {
    error.value = null
  }
  
  /**
   * 重置状态
   */
  function reset() {
    overview.value = null
    tuitionInfo.value = null
    dormitoryFeeInfo.value = null
    records.value = []
    recordsTotal.value = 0
    currentPage.value = 1
    pageSize.value = 10
    loading.value = false
    submitting.value = false
    error.value = null
  }

  // ==================== Return ====================
  
  return {
    // State
    overview,
    tuitionInfo,
    dormitoryFeeInfo,
    records,
    recordsTotal,
    currentPage,
    pageSize,
    loading,
    submitting,
    error,
    
    // Getters
    totalPendingAmount,
    pendingItems,
    hasPendingPayments,
    tuitionPendingAmount,
    tuitionStatus,
    dormitoryPendingAmount,
    dormitoryStatus,
    recordsPagination,
    hasMoreRecords,
    
    // Actions
    fetchOverview,
    fetchTuitionInfo,
    payTuitionFee,
    fetchDormitoryFeeInfo,
    payDormitoryFeeFee,
    fetchRecords,
    loadMoreRecords,
    refreshRecords,
    applyForGreenChannel,
    clearError,
    reset
  }
})
