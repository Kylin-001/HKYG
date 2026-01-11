import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import * as dashboardApi from '@/api/dashboard'
import logger from '@/utils/logger'

// 仪表板数据接口定义
interface DashboardData {
  totalUsers: number
  totalOrders: number
  totalMerchants: number
  totalRevenue: number
  dailyActiveUsers: number
  dailyOrders: number
  [key: string]: any
}

// 系统健康状态接口定义
interface SystemHealth {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  uptime: number
  [key: string]: any
}

// 销售趋势数据接口定义
interface SalesTrendItem {
  date: string
  value: number
  [key: string]: any
}

// 订单分类数据接口定义
interface OrderCategoryItem {
  name: string
  value: number
  [key: string]: any
}

// 定义dashboard store的状态类型
interface DashboardState {
  dashboardData: DashboardData
  systemHealth: SystemHealth
  salesTrend: SalesTrendItem[]
  orderCategory: OrderCategoryItem[]
  latestOrders: any[]
  hotProducts: any[]
  loading: boolean
  error: string | null
}

// 创建并导出dashboard store
export const useDashboardStore = defineStore('dashboard', () => {
  // 状态定义
  const dashboardData = ref<DashboardData>({
    totalUsers: 0,
    totalOrders: 0,
    totalMerchants: 0,
    totalRevenue: 0,
    dailyActiveUsers: 0,
    dailyOrders: 0
  })
  const systemHealth = ref<SystemHealth>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    uptime: 0
  })
  const salesTrend = ref<SalesTrendItem[]>([])
  const orderCategory = ref<OrderCategoryItem[]>([])
  const latestOrders = ref<any[]>([])
  const hotProducts = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const currentDashboardData = computed(() => dashboardData.value)
  const isSystemHealthy = computed(() => {
    if (!systemHealth.value) return false
    return systemHealth.value.cpuUsage < 80 && systemHealth.value.memoryUsage < 80
  })
  const totalRevenue = computed(() => dashboardData.value.totalRevenue || 0)
  const totalOrders = computed(() => dashboardData.value.totalOrders || 0)

  // 方法
  async function getDashboardData() {
    try {
      loading.value = true
      error.value = null
      const response = await dashboardApi.getDashboardData()
      dashboardData.value = response.data
      return response.data
    } catch (err) {
      const errorMsg = '获取仪表板数据失败'
      error.value = errorMsg
      logger.error(errorMsg, err)
      ElMessage.error(errorMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getSystemHealth() {
    try {
      loading.value = true
      error.value = null
      const response = await dashboardApi.getSystemHealth()
      systemHealth.value = response.data
      return response.data
    } catch (err) {
      const errorMsg = '获取系统健康状态失败'
      error.value = errorMsg
      logger.error(errorMsg, err)
      ElMessage.error(errorMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getSalesTrend(params: any = {}) {
    try {
      loading.value = true
      error.value = null
      const response = await dashboardApi.getSalesTrend(params)
      salesTrend.value = response.data
      return response.data
    } catch (err) {
      const errorMsg = '获取销售趋势数据失败'
      error.value = errorMsg
      logger.error(errorMsg, err)
      ElMessage.error(errorMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getOrderCategory() {
    try {
      loading.value = true
      error.value = null
      const response = await dashboardApi.getOrderCategory()
      orderCategory.value = response.data
      return response.data
    } catch (err) {
      const errorMsg = '获取订单分类数据失败'
      error.value = errorMsg
      logger.error(errorMsg, err)
      ElMessage.error(errorMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getLatestOrders() {
    try {
      loading.value = true
      error.value = null
      const response = await dashboardApi.getLatestOrders()
      latestOrders.value = response.data
      return response.data
    } catch (err) {
      const errorMsg = '获取最新订单数据失败'
      error.value = errorMsg
      logger.error(errorMsg, err)
      ElMessage.error(errorMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getHotProducts() {
    try {
      loading.value = true
      error.value = null
      const response = await dashboardApi.getHotProducts()
      hotProducts.value = response.data
      return response.data
    } catch (err) {
      const errorMsg = '获取热门商品数据失败'
      error.value = errorMsg
      logger.error(errorMsg, err)
      ElMessage.error(errorMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 重置状态
  function resetState() {
    dashboardData.value = {
      totalUsers: 0,
      totalOrders: 0,
      totalMerchants: 0,
      totalRevenue: 0,
      dailyActiveUsers: 0,
      dailyOrders: 0
    }
    systemHealth.value = {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      uptime: 0
    }
    salesTrend.value = []
    orderCategory.value = []
    latestOrders.value = []
    hotProducts.value = []
    error.value = null
  }

  return {
    // 状态
    dashboardData,
    systemHealth,
    salesTrend,
    orderCategory,
    latestOrders,
    hotProducts,
    loading,
    error,

    // 计算属性
    currentDashboardData,
    isSystemHealthy,
    totalRevenue,
    totalOrders,

    // 方法
    getDashboardData,
    getSystemHealth,
    getSalesTrend,
    getOrderCategory,
    getLatestOrders,
    getHotProducts,
    resetState,
  }
})
