import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as takeoutApi from '@/api/takeout'
import logger from '@/utils/logger'

// 定义订单状态类型
type OrderStatus = 'pending' | 'paid' | 'preparing' | 'delivering' | 'completed' | 'cancelled'

// 定义商品类型
interface OrderItem {
  name: string
  quantity: number
  price: number
  subtotal: number
}

// 定义地址类型
interface Address {
  name: string
  phone: string
  fullAddress: string
}

// 定义订单类型
interface Order {
  id: number
  orderNo: string
  merchantName: string
  userName: string
  userPhone: string
  totalAmount: number
  deliveryFee: number
  status: OrderStatus
  deliveryTime: string
  orderTime: string
  remark?: string
  deliveryAddress?: string
  subtotal?: number
  items?: OrderItem[]
  address?: Address
}

// 定义统计数据类型
interface Stats {
  todayOrders: number
  totalAmount: number
  avgDeliveryTime: number
  satisfactionRate: number
}

// 创建并导出takeout store
export const useTakeoutStore = defineStore('takeout', () => {
  // 状态定义
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const orderDetail = ref<Order | null>(null)
  const stats = ref<Stats>({
    todayOrders: 0,
    totalAmount: 0,
    avgDeliveryTime: 0,
    satisfactionRate: 0,
  })

  // 计算属性
  const totalOrders = computed(() => orders.value.length)
  const pendingOrders = computed(
    () => orders.value.filter(order => order.status === 'pending').length
  )
  const completedOrders = computed(
    () => orders.value.filter(order => order.status === 'completed').length
  )

  // 获取订单列表
  async function fetchOrderList(params: any) {
    try {
      loading.value = true
      error.value = null
      const response = await takeoutApi.getOrderList(params)
      orders.value = response.data.records || []
      return response.data
    } catch (err: any) {
      error.value = err.message || '获取订单列表失败'
      logger.error('获取订单列表失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取订单详情
  async function fetchOrderDetail(orderId: number) {
    try {
      loading.value = true
      error.value = null
      const response = await takeoutApi.getOrderDetail(orderId)
      orderDetail.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || '获取订单详情失败'
      logger.error('获取订单详情失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取订单统计
  async function fetchOrderStats() {
    try {
      loading.value = true
      error.value = null
      const response = await takeoutApi.getOrderStats()
      stats.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || '获取订单统计失败'
      logger.error('获取订单统计失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 导出订单
  async function exportOrders(params: any) {
    try {
      loading.value = true
      error.value = null
      await takeoutApi.exportOrders(params)
    } catch (err: any) {
      error.value = err.message || '导出订单失败'
      logger.error('导出订单失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 分配配送员
  async function assignDelivery(params: any) {
    try {
      loading.value = true
      error.value = null
      const response = await takeoutApi.assignDelivery(params)
      return response.data
    } catch (err: any) {
      error.value = err.message || '分配配送员失败'
      logger.error('分配配送员失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 跟踪配送
  async function trackDelivery(orderId: number) {
    try {
      loading.value = true
      error.value = null
      const response = await takeoutApi.trackDelivery(orderId)
      return response.data
    } catch (err: any) {
      error.value = err.message || '跟踪配送失败'
      logger.error('跟踪配送失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 重置订单详情
  function resetOrderDetail() {
    orderDetail.value = null
  }

  // 重置错误信息
  function resetError() {
    error.value = null
  }

  // 导出状态、计算属性和方法
  return {
    // 状态
    orders,
    loading,
    error,
    orderDetail,
    stats,
    // 计算属性
    totalOrders,
    pendingOrders,
    completedOrders,
    // 方法
    fetchOrderList,
    fetchOrderDetail,
    fetchOrderStats,
    exportOrders,
    assignDelivery,
    trackDelivery,
    resetOrderDetail,
    resetError,
  }
})
