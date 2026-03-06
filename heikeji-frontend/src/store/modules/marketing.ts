import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as marketingApi from '@/api/marketing'
import { ElMessage } from 'element-plus'

export const useMarketingStore = defineStore('marketing', () => {
  const coupons = ref([])
  const userCoupons = ref([])
  const selectedCoupon = ref(null)
  const userPoints = ref(0)
  const pointRecords = ref([])
  const pointProducts = ref([])
  const userLevel = ref(null)
  const allLevels = ref([])
  const activities = ref([])
  const currentActivity = ref(null)
  const loading = ref(false)

  async function fetchCouponList(params: any) {
    try {
      loading.value = true
      const res = await marketingApi.getCouponList(params)
      coupons.value = res.data || []
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '获取优惠券列表失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createCoupon(data: any) {
    try {
      loading.value = true
      const res = await marketingApi.createCoupon(data)
      ElMessage.success('创建优惠券成功')
      await fetchCouponList()
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '创建优惠券失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateCoupon(data: any) {
    try {
      loading.value = true
      const res = await marketingApi.updateCoupon(data)
      ElMessage.success('更新优惠券成功')
      await fetchCouponList()
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '更新优惠券失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteCoupon(id: number) {
    try {
      loading.value = true
      const res = await marketingApi.deleteCoupon(id)
      ElMessage.success('删除优惠券成功')
      await fetchCouponList()
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '删除优惠券失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function batchSendCoupon(data: any) {
    try {
      loading.value = true
      const res = await marketingApi.batchSendCoupon(data)
      ElMessage.success('批量发放成功')
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '批量发放失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchUserCoupons(params: any) {
    try {
      loading.value = true
      const res = await marketingApi.getUserCoupons(params)
      userCoupons.value = res.data || []
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '获取我的优惠券失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  function selectCoupon(coupon: any) {
    selectedCoupon.value = coupon
  }

  async function useCoupon(data: any) {
    try {
      loading.value = true
      const res = await marketingApi.useCoupon(data)
      ElMessage.success('使用优惠券成功')
      await fetchUserCoupons()
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '使用优惠券失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchUserPoints() {
    try {
      loading.value = true
      const res = await marketingApi.getUserPoints()
      userPoints.value = res.data || 0
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '获取积分失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchPointRecords(params: any) {
    try {
      loading.value = true
      const res = await marketingApi.getPointRecords(params)
      pointRecords.value = res.data || []
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '获取积分记录失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchPointProducts(params: any) {
    try {
      loading.value = true
      const res = await marketingApi.getPointProducts(params)
      pointProducts.value = res.data || []
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '获取积分商品失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function exchangeProduct(data: any) {
    try {
      loading.value = true
      const res = await marketingApi.exchangeProduct(data)
      ElMessage.success('兑换成功')
      await fetchUserPoints()
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '兑换失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function checkIn() {
    try {
      loading.value = true
      const res = await marketingApi.checkIn()
      ElMessage.success(`签到成功，+${res.data}积分`)
      await fetchUserPoints()
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '签到失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchPointRanking(limit: number = 10) {
    try {
      loading.value = true
      const res = await marketingApi.getPointRanking(limit)
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '获取排行榜失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchUserLevel() {
    try {
      loading.value = true
      const res = await marketingApi.getUserLevel()
      userLevel.value = res.data || null
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '获取会员等级失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchAllLevels() {
    try {
      loading.value = true
      const res = await marketingApi.getAllLevels()
      allLevels.value = res.data || []
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '获取等级列表失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchActivities(params: any) {
    try {
      loading.value = true
      const res = await marketingApi.getActivities(params)
      activities.value = res.data || []
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '获取活动列表失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function joinActivity(data: any) {
    try {
      loading.value = true
      const res = await marketingApi.joinActivity(data)
      ElMessage.success('参与活动成功')
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '参与活动失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  function resetMarketingState() {
    coupons.value = []
    userCoupons.value = []
    selectedCoupon.value = null
    userPoints.value = 0
    pointRecords.value = []
    pointProducts.value = []
    userLevel.value = null
    allLevels.value = []
    activities.value = []
    currentActivity.value = null
  }

  return {
    coupons,
    userCoupons,
    selectedCoupon,
    userPoints,
    pointRecords,
    pointProducts,
    userLevel,
    allLevels,
    activities,
    currentActivity,
    loading,
    fetchCouponList,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    batchSendCoupon,
    fetchUserCoupons,
    selectCoupon,
    useCoupon,
    fetchUserPoints,
    fetchPointRecords,
    fetchPointProducts,
    exchangeProduct,
    checkIn,
    fetchPointRanking,
    fetchUserLevel,
    fetchAllLevels,
    fetchActivities,
    joinActivity,
    resetMarketingState,
  }
})
