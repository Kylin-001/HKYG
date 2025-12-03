import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getOrderList,
  getOrderDetail,
  shipOrder,
  cancelOrder,
  confirmReceive,
  agreeRefund,
  remindPay,
  getLogisticsDetail,
  rejectRefund,
} from '@/api/order'
import logger from '@/utils/logger'
import type { Order } from '@/types/api'

// 定义订单状态选项类型
interface OrderStatusOption {
  value: number
  label: string
}

// 定义订单查询参数类型
interface OrderQueryParams {
  keyword?: string
  orderNo?: string
  userId?: number
  status?: number
  createTimeRange?: [string, string]
  page?: number
  size?: number
}

// 定义物流信息类型
interface LogisticsInfo {
  logisticsCompany: string
  logisticsNo: string
}

// 创建并导出order store
export const useOrderStore = defineStore('order', () => {
  // 状态定义
  const list = ref<Order[]>([])
  const total = ref(0)
  const detail = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 状态选项
  const statusOptions = ref<OrderStatusOption[]>([
    { value: 1, label: '待付款' },
    { value: 2, label: '待发货' },
    { value: 3, label: '待收货' },
    { value: 4, label: '已完成' },
    { value: 5, label: '已取消' },
    { value: 6, label: '退款中' },
    { value: 7, label: '已退款' },
  ])

  // 计算属性
  const hasOrders = computed(() => list.value.length > 0)
  const orderCount = computed(() => total.value)

  // 获取订单列表
  async function fetchOrderList(params: OrderQueryParams) {
    try {
      loading.value = true
      error.value = null

      const response = await getOrderList(params)

      // 确保返回格式兼容
      const result = {
        list: (response.data && response.data.records) || response.list || [],
        total: (response.data && response.data.total) || response.total || 0,
      }

      list.value = result.list
      total.value = result.total

      return result
    } catch (err: any) {
      logger.error('获取订单列表失败:', err)
      error.value = err.message || '获取订单列表失败'

      // 如果API调用失败，返回模拟数据作为备份
      const mockData = {
        list: [
          {
            orderId: '202401010001',
            orderNo: '202401010001',
            userId: 1,
            userName: '张三',
            totalAmount: 6999,
            actualAmount: 6999,
            paymentMethod: 'WECHAT_PAY',
            orderStatus: 2,
            paymentStatus: 1,
            deliveryStatus: 0,
            shippingAddress: '北京市朝阳区',
            receiverName: '张三',
            receiverPhone: '13800138000',
            statusText: '待发货',
            createTime: '2024-01-01 10:30:00',
            paymentTime: '2024-01-01 10:35:00',
            orderItems: [],
          },
          {
            orderId: '202401010002',
            orderNo: '202401010002',
            userId: 2,
            userName: '李四',
            totalAmount: 7999,
            actualAmount: 7999,
            paymentMethod: 'ALIPAY',
            orderStatus: 3,
            paymentStatus: 1,
            deliveryStatus: 1,
            shippingAddress: '上海市浦东新区',
            receiverName: '李四',
            receiverPhone: '13900139000',
            statusText: '待收货',
            createTime: '2024-01-01 11:20:00',
            paymentTime: '2024-01-01 11:25:00',
            orderItems: [],
          },
          {
            orderId: '202401010003',
            orderNo: '202401010003',
            userId: 3,
            userName: '王五',
            totalAmount: 14998,
            actualAmount: 14998,
            paymentMethod: 'WECHAT_PAY',
            orderStatus: 4,
            paymentStatus: 1,
            deliveryStatus: 2,
            shippingAddress: '广州市天河区',
            receiverName: '王五',
            receiverPhone: '13700137000',
            statusText: '已完成',
            createTime: '2024-01-01 14:15:00',
            paymentTime: '2024-01-01 14:20:00',
            deliveryTime: '2024-01-02 10:00:00',
            completeTime: '2024-01-04 16:30:00',
            orderItems: [],
          },
          {
            orderId: '202401020001',
            orderNo: '202401020001',
            userId: 4,
            userName: '赵六',
            totalAmount: 4990,
            actualAmount: 4990,
            paymentMethod: 'ALIPAY',
            orderStatus: 1,
            paymentStatus: 0,
            deliveryStatus: 0,
            shippingAddress: '深圳市南山区',
            receiverName: '赵六',
            receiverPhone: '13600136000',
            statusText: '待付款',
            createTime: '2024-01-02 09:45:00',
            orderItems: [],
          },
          {
            orderId: '202401020002',
            orderNo: '202401020002',
            userId: 1,
            userName: '张三',
            totalAmount: 9999,
            actualAmount: 9999,
            paymentMethod: 'WECHAT_PAY',
            orderStatus: 5,
            paymentStatus: 0,
            deliveryStatus: 0,
            shippingAddress: '北京市朝阳区',
            receiverName: '张三',
            receiverPhone: '13800138000',
            statusText: '已取消',
            createTime: '2024-01-02 15:30:00',
            cancelTime: '2024-01-02 16:00:00',
            orderItems: [],
          },
        ],
        total: 89,
      }

      list.value = mockData.list as Order[]
      total.value = mockData.total

      return mockData
    } finally {
      loading.value = false
    }
  }

  // 获取订单详情
  async function fetchOrderDetail(orderId: string) {
    try {
      loading.value = true
      error.value = null

      const response = await getOrderDetail(orderId)
      detail.value = response as Order

      return response
    } catch (err: any) {
      error.value = err.message || '获取订单详情失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 发货
  async function handleShipOrder(orderId: string, logisticsInfo: LogisticsInfo) {
    try {
      loading.value = true
      error.value = null

      const response = await shipOrder(orderId, logisticsInfo)

      // 更新订单列表中的状态
      const index = list.value.findIndex(order => order.orderId === orderId)
      if (index !== -1) {
        list.value[index] = { ...list.value[index], orderStatus: 3 }
      }

      return response
    } catch (err: any) {
      error.value = err.message || '发货失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 取消订单
  async function handleCancelOrder(orderId: string) {
    try {
      loading.value = true
      error.value = null

      const response = await cancelOrder(orderId)

      // 更新订单列表中的状态
      const index = list.value.findIndex(order => order.orderId === orderId)
      if (index !== -1) {
        list.value[index] = { ...list.value[index], orderStatus: 5 }
      }

      return response
    } catch (err: any) {
      error.value = err.message || '取消订单失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 确认收货
  async function handleConfirmReceive(orderId: string) {
    try {
      loading.value = true
      error.value = null

      const response = await confirmReceive(orderId)

      // 更新订单列表中的状态
      const index = list.value.findIndex(order => order.orderId === orderId)
      if (index !== -1) {
        list.value[index] = { ...list.value[index], orderStatus: 4 }
      }

      return response
    } catch (err: any) {
      error.value = err.message || '确认收货失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 提醒付款
  async function handleRemindPay(orderId: string) {
    try {
      loading.value = true
      error.value = null

      const response = await remindPay(orderId)
      return response
    } catch (err: any) {
      error.value = err.message || '提醒付款失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取物流详情
  async function fetchLogisticsDetail(orderId: string) {
    try {
      loading.value = true
      error.value = null

      const response = await getLogisticsDetail(orderId)
      return response
    } catch (err: any) {
      error.value = err.message || '获取物流详情失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 同意退款
  async function handleAgreeRefund(orderId: string, reason: string) {
    try {
      loading.value = true
      error.value = null

      const response = await agreeRefund(orderId, reason)

      // 更新订单列表中的状态
      const index = list.value.findIndex(order => order.orderId === orderId)
      if (index !== -1) {
        list.value[index] = { ...list.value[index], orderStatus: 7 }
      }

      return response
    } catch (err: any) {
      error.value = err.message || '同意退款失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 拒绝退款
  async function handleRejectRefund(orderId: string, reason: string) {
    try {
      loading.value = true
      error.value = null

      const response = await rejectRefund(orderId, reason)

      // 更新订单列表中的状态
      const index = list.value.findIndex(order => order.orderId === orderId)
      if (index !== -1) {
        list.value[index] = { ...list.value[index], orderStatus: 4 }
      }

      return response
    } catch (err: any) {
      error.value = err.message || '拒绝退款失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 重置订单详情
  function resetOrderDetail() {
    detail.value = null
  }

  // 重置错误信息
  function resetError() {
    error.value = null
  }

  return {
    // 状态
    list,
    total,
    detail,
    loading,
    error,
    statusOptions,

    // 计算属性
    hasOrders,
    orderCount,

    // 方法
    fetchOrderList,
    fetchOrderDetail,
    handleShipOrder,
    handleCancelOrder,
    handleConfirmReceive,
    handleRemindPay,
    fetchLogisticsDetail,
    handleAgreeRefund,
    handleRejectRefund,
    resetOrderDetail,
    resetError,
  }
})
