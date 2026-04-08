import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { useWebSocket, type WebSocketOptions } from '@/utils/websocket'
import * as orderApi from '@/api/order'
import type { Order } from '@/types/order'

interface UseOrderStatusOptions {
  /** 订单ID */
  orderId: string | Ref<string>
  /** WebSocket URL (可选) */
  wsUrl?: string
  /** 是否启用轮询降级 */
  enablePolling?: boolean
  /** 轮询间隔(ms) */
  pollingInterval?: number
  /** 最大轮询次数（0表示无限） */
  maxPollingCount?: number
  /** 状态变化回调 */
  onStatusChange?: (newStatus: string, oldStatus: string, order: Order) => void
  /** 连接状态变化回调 */
  onConnectionChange?: (connected: boolean) => void
}

interface OrderStatusMessage {
  orderId: string
  status: string
  previousStatus?: string
  timestamp: number
  data?: Partial<Order>
}

/**
 * 订单状态实时更新 Composable
 *
 * 功能:
 * - WebSocket 实时推送（主要方案）
 * - 轮询降级（备用方案）
 * - 自动重连
 * - 状态变更动画提示
 * - 离线缓存
 */
export function useOrderStatus(options: UseOrderStatusOptions) {
  const {
    orderId,
    wsUrl = `${import.meta.env.VITE_WS_URL || 'wss://api.heikeji.com'}/ws/orders`,
    enablePolling = true,
    pollingInterval = 5000,
    maxPollingCount = 0,
    onStatusChange,
    onConnectionChange,
  } = options

  // 状态
  const currentStatus = ref<string>('')
  const previousStatus = ref<string>('')
  const orderData = ref<Order | null>(null)
  const isLoading = ref(false)
  const isConnected = ref(false)
  const isUsingPolling = ref(false)
  const lastUpdateTime = ref<Date | null>(null)
  const statusHistory = ref<Array<{
    status: string
    timestamp: Date
    source: 'websocket' | 'polling'
  }>>([])

  // 轮询相关
  let pollingTimer: ReturnType<typeof setInterval> | null = null
  let pollingCount = 0
  let wsUnsubscribe: (() => void) | null = null

  // ====== WebSocket 连接 ======

  /**
   * 初始化WebSocket连接
   */
  function initWebSocket(): void {
    if (!orderId || typeof orderId === 'object' && !orderId.value) return

    const resolvedOrderId = typeof orderId === 'string' ? orderId : orderId.value

    const wsOptions: WebSocketOptions = {
      url: `${wsUrl}/${resolvedOrderId}`,
      autoConnect: true,
      reconnect: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,

      onOpen: () => {
        console.log('[OrderStatus] WebSocket connected')
        isConnected.value = true
        isUsingPolling.value = false
        onConnectionChange?.(true)

        // 停止轮询
        stopPolling()
      },

      onMessage: (message) => {
        try {
          const data = message.data as OrderStatusMessage

          if (data.orderId && data.status) {
            handleStatusUpdate(data.status, data.previousStatus, data, 'websocket')
          }
        } catch (error) {
          console.error('[OrderStatus] Failed to parse message:', error)
        }
      },

      onClose: () => {
        console.log('[OrderStatus] WebSocket disconnected')
        isConnected.value = false
        onConnectionChange?.(false)

        // 自动切换到轮询模式
        if (enablePolling && !isUsingPolling.value) {
          switchToPolling()
        }
      },

      onError: (error) => {
        console.error('[OrderStatus] WebSocket error:', error)
        isConnected.value = false
      },
    }

    // 使用现有的useWebSocket hook
    const { subscribe } = useWebSocket(wsOptions)

    // 订阅订单状态更新消息
    wsUnsubscribe = subscribe('order_status_update', (data: unknown) => {
      const message = data as OrderStatusMessage
      if (message.status) {
        handleStatusUpdate(message.status, message.previousStatus, message, 'websocket')
      }
    })
  }

  // ====== 轮询降级 ======

  /**
   * 切换到轮询模式
   */
  function switchToPolling(): void {
    console.log('[OrderStatus] Switching to polling mode')
    isUsingPolling.value = true
    startPolling()
  }

  /**
   * 开始轮询
   */
  function startPolling(): void {
    if (pollingTimer) return

    console.log(`[OrderStatus] Starting polling (interval: ${pollingInterval}ms)`)

    // 立即执行一次
    pollOrderStatus()

    // 设置定时轮询
    pollingTimer = setInterval(() => {
      pollOrderStatus()
    }, pollingInterval)
  }

  /**
   * 停止轮询
   */
  function stopPolling(): void {
    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
  }

  /**
   * 执行一次轮询请求
   */
  async function pollOrderStatus(): Promise<void> {
    const resolvedOrderId = typeof orderId === 'string' ? orderId : orderId.value
    if (!resolvedOrderId) return

    // 检查最大轮询次数
    if (maxPollingCount > 0 && pollingCount >= maxPollingCount) {
      console.log('[OrderStatus] Max polling count reached')
      stopPolling()
      return
    }

    isLoading.value = true
    pollingCount++

    try {
      const order = await orderApi.getOrderDetail(resolvedOrderId)

      if (order?.status && order.status !== currentStatus.value) {
        handleStatusUpdate(order.status, currentStatus.value, order, 'polling')
      }

      orderData.value = order
      lastUpdateTime.value = new Date()

      // 如果WebSocket重新连接成功，停止轮询
      if (isConnected.value && isUsingPolling.value) {
        stopPolling()
        isUsingPolling.value = false
      }
    } catch (error) {
      console.error('[OrderStatus] Polling failed:', error)

      // 如果是网络错误且还没使用轮询，切换到轮询模式
      if (!isUsingPolling.value && enablePolling) {
        switchToPolling()
      }
    } finally {
      isLoading.value = false
    }
  }

  // ====== 状态处理 ======

  /**
   * 处理状态更新
   */
  function handleStatusUpdate(
    newStatus: string,
    oldStatus: string | undefined,
    data: OrderStatusMessage | Partial<Order>,
    source: 'websocket' | 'polling'
  ): void {
    previousStatus.value = currentStatus.value
    currentStatus.value = newStatus

    // 更新订单数据
    if ('id' in data && data.id) {
      orderData.value = { ...orderData.value, ...data } as Order
    }

    // 记录历史
    statusHistory.value.push({
      status: newStatus,
      timestamp: new Date(),
      source,
    })

    // 只保留最近50条记录
    if (statusHistory.value.length > 50) {
      statusHistory.value = statusHistory.value.slice(-50)
    }

    lastUpdateTime.value = new Date()

    // 触发回调
    if (onStatusChange && newStatus !== oldStatus) {
      onStatusChange(newStatus, oldStatus || '', orderData.value!)
    }

    // 触发状态变更动画
    triggerStatusAnimation(newStatus)
  }

  /**
   * 触发状态变更动画
   */
  function triggerStatusAnimation(status: string): void {
    // 创建自定义事件供UI层监听
    const event = new CustomEvent('order-status-change', {
      detail: {
        status,
        orderId: typeof orderId === 'string' ? orderId : orderId.value,
        timestamp: Date.now(),
      },
    })

    window.dispatchEvent(event)

    // 触觉反馈（移动端）
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  // ====== 手动操作 ======

  /**
   * 强制刷新状态
   */
  async function refreshStatus(): Promise<void> {
    await pollOrderStatus()
  }

  /**
   * 重置轮询计数器
   */
  function resetPollingCount(): void {
    pollingCount = 0
  }

  /**
   * 获取状态历史
   */
  function getStatusHistory(limit = 10): typeof statusHistory.value {
    return statusHistory.value.slice(-limit)
  }

  // ====== 生命周期 ======

  onMounted(() => {
    // 首先尝试获取当前状态
    pollOrderStatus().then(() => {
      // 然后初始化WebSocket
      initWebSocket()
    })
  })

  onUnmounted(() => {
    // 清理资源
    stopPolling()

    if (wsUnsubscribe) {
      wsUnsubscribe()
      wsUnsubscribe = null
    }
  })

  // 监听orderId变化
  watch(
    () => (typeof orderId === 'string' ? orderId : orderId.value),
    (newId, oldId) => {
      if (newId !== oldId) {
        // 重置状态
        currentStatus.value = ''
        previousStatus.value = ''
        orderData.value = null
        statusHistory.value = []
        pollingCount = 0

        // 重新连接
        if (wsUnsubscribe) {
          wsUnsubscribe()
          wsUnsubscribe = null
        }

        stopPolling()
        initWebSocket()
        pollOrderStatus()
      }
    }
  )

  return {
    // 状态
    currentStatus,
    previousStatus,
    orderData,
    isLoading,
    isConnected,
    isUsingPolling,
    lastUpdateTime,
    statusHistory,

    // 方法
    refreshStatus,
    resetPollingCount,
    getStatusHistory,
    startPolling,
    stopPolling,
  }
}
