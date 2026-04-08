import { ref, onMounted, onUnmounted } from 'vue'

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting'

interface WebSocketMessage {
  type: string
  data: unknown
  timestamp: number
  id?: string
}

interface WebSocketOptions {
  url: string
  protocols?: string | string[]
  reconnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  heartbeatMessage?: string | object
  onOpen?: (event: Event) => void
  onMessage?: (message: WebSocketMessage) => void
  onClose?: (event: CloseEvent) => void
  onError?: (event: Event) => void
  autoConnect?: boolean
}

class WebSocketManager {
  private ws: WebSocket | null = null
  private options: Required<WebSocketOptions>
  private status = ref<WebSocketStatus>('disconnected')
  private reconnectAttempts = 0
  private heartbeatTimer: number | null = null
  private reconnectTimer: number | null = null
  private messageQueue: WebSocketMessage[] = []
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map()
  private isManualClose = false

  constructor(options: WebSocketOptions) {
    this.options = {
      ...options,
      reconnect: options.reconnect ?? true,
      reconnectInterval: options.reconnectInterval ?? 3000,
      maxReconnectAttempts: options.maxReconnectAttempts ?? 10,
      heartbeatInterval: options.heartbeatInterval ?? 30000,
      heartbeatMessage: options.heartbeatMessage ?? { type: 'ping' },
      autoConnect: options.autoConnect ?? true,
    }

    if (this.options.autoConnect) {
      this.connect()
    }
  }

  get currentStatus(): WebSocketStatus {
    return this.status.value
  }

  connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }

    this.isManualClose = false
    this.status.value = 'connecting'

    try {
      this.ws = new WebSocket(this.options.url, this.options.protocols)

      this.ws.onopen = (event) => {
        this.status.value = 'connected'
        this.reconnectAttempts = 0
        
        this.startHeartbeat()
        
        while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift()
          if (message) {
            this.send(message.type, message.data)
          }
        }

        this.options.onOpen?.(event)
      }

      this.ws.onmessage = (event) => {
        try {
          let parsedData: WebSocketMessage
          
          if (typeof event.data === 'string') {
            parsedData = JSON.parse(event.data)
          } else {
            parsedData = {
              type: 'binary',
              data: event.data,
              timestamp: Date.now(),
            }
          }

          if (parsedData.type === 'pong' || parsedData.type === 'ping') {
            return
          }

          const listeners = this.listeners.get(parsedData.type)
          if (listeners) {
            listeners.forEach((callback) => {
              callback(parsedData.data)
            })
          }

          this.options.onMessage?.(parsedData)
        } catch (error) {
          console.error('[WebSocket] Message parse error:', error)
        }
      }

      this.ws.onclose = (event) => {
        this.stopHeartbeat()
        this.status.value = 'disconnected'
        this.options.onClose?.(event)

        if (!this.isManualClose && this.options.reconnect && this.reconnectAttempts < this.options.maxReconnectAttempts) {
          this.scheduleReconnect()
        }
      }

      this.ws.onerror = (event) => {
        this.status.value = 'error'
        this.options.onError?.(event)
      }
    } catch (error) {
      console.error('[WebSocket] Connection error:', error)
      this.status.value = 'error'
    }
  }

  disconnect(): void {
    this.isManualClose = true
    
    this.stopHeartbeat()
    
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close(1000, 'Normal closure')
      this.ws = null
    }

    this.status.value = 'disconnected'
  }

  send(type: string, data?: unknown): boolean {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now(),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message))
        return true
      } catch (error) {
        console.error('[WebSocket] Send error:', error)
        this.messageQueue.push(message)
        return false
      }
    } else {
      this.messageQueue.push(message)
      return false
    }
  }

  on(type: string, callback: (data: unknown) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }

    this.listeners.get(type)!.add(callback)

    return () => {
      this.listeners.get(type)?.delete(callback)
    }
  }

  off(type: string, callback?: (data: unknown) => void): void {
    if (callback) {
      this.listeners.get(type)?.delete(callback)
    } else {
      this.listeners.delete(type)
    }
  }

  once(type: string, callback: (data: unknown) => void): () => void {
    const unsubscribe = this.on(type, (data) => {
      callback(data)
      unsubscribe()
    })

    return unsubscribe
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()

    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const message = typeof this.options.heartbeatMessage === 'string'
          ? this.options.heartbeatMessage
          : JSON.stringify(this.options.heartbeatMessage)
        
        this.ws.send(message)
      }
    }, this.options.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++
    this.status.value = 'reconnecting'

    const delay = Math.min(
      this.options.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1),
      30000
    )

    console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`)

    this.reconnectTimer = window.setTimeout(() => {
      this.connect()
    }, delay)
  }

  destroy(): void {
    this.disconnect()
    this.listeners.clear()
    this.messageQueue = []
  }
}

export function useWebSocket(options: WebSocketOptions) {
  let wsManager: WebSocketManager | null = null
  const status = ref<WebSocketStatus>('disconnected')
  const lastMessage = ref<WebSocketMessage | null>(null)
  const messageHistory = ref<WebSocketMessage[]>([])
  const maxHistoryLength = 100

  onMounted(() => {
    wsManager = new WebSocketManager({
      ...options,
      onOpen: (event) => {
        status.value = 'connected'
        options.onOpen?.(event)
      },
      onMessage: (message) => {
        lastMessage.value = message
        messageHistory.value.unshift(message)
        
        if (messageHistory.value.length > maxHistoryLength) {
          messageHistory.value = messageHistory.value.slice(0, maxHistoryLength)
        }
        
        options.onMessage?.(message)
      },
      onClose: (event) => {
        status.value = 'disconnected'
        options.onClose?.(event)
      },
      onError: (event) => {
        status.value = 'error'
        options.onError?.(event)
      },
    })

    status.value = wsManager.currentStatus
  })

  onUnmounted(() => {
    wsManager?.destroy()
    wsManager = null
  })

  function send(type: string, data?: unknown): boolean {
    return wsManager?.send(type, data) ?? false
  }

  function subscribe(type: string, callback: (data: unknown) => void): () => void {
    return wsManager?.on(type, callback) ?? (() => {})
  }

  function unsubscribe(type: string, callback?: (data: unknown) => void): void {
    wsManager?.off(type, callback)
  }

  function reconnect(): void {
    wsManager?.disconnect()
    setTimeout(() => {
      wsManager?.connect()
    }, 100)
  }

  function clearHistory(): void {
    messageHistory.value = []
  }

  return {
    status,
    lastMessage,
    messageHistory,
    send,
    subscribe,
    unsubscribe,
    reconnect,
    clearHistory,
    isConnected: computed(() => status.value === 'connected'),
    isConnecting: computed(() => status.value === 'connecting'),
    isDisconnected: computed(() => status.value === 'disconnected'),
  }
}

export { WebSocketManager }
export type { WebSocketStatus, WebSocketMessage, WebSocketOptions }
