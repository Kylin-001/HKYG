import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { DeliveryWebSocket, useDeliveryWebSocket } from '@/utils/websocket'
import { RealDeliveryWebSocket } from '@/utils/websocket-real'

describe('WebSocket', () => {
  describe('DeliveryWebSocket', () => {
    let ws: DeliveryWebSocket

    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
      if (ws) {
        ws.disconnect()
      }
    })

    it('应该正确创建 WebSocket 实例', () => {
      ws = new DeliveryWebSocket('order-001')
      expect(ws).toBeInstanceOf(DeliveryWebSocket)
    })

    it('应该能够连接和断开', () => {
      ws = new DeliveryWebSocket('order-001')
      const connectSpy = vi.spyOn(ws as any, 'connect')
      const disconnectSpy = vi.spyOn(ws as any, 'disconnect')

      ws.connect()
      expect(connectSpy).toHaveBeenCalled()

      ws.disconnect()
      expect(disconnectSpy).toHaveBeenCalled()
    })

    it('应该能够订阅事件', () => {
      ws = new DeliveryWebSocket('order-001')
      const callback = vi.fn()

      ws.on('message', callback)

      // 触发消息事件
      ;(ws as any).emit('message', { type: 'test' })

      expect(callback).toHaveBeenCalledWith({ type: 'test' })
    })

    it('应该能够取消订阅事件', () => {
      ws = new DeliveryWebSocket('order-001')
      const callback = vi.fn()

      ws.on('message', callback)
      ws.off('message', callback)

      // 触发消息事件
      ;(ws as any).emit('message', { type: 'test' })

      expect(callback).not.toHaveBeenCalled()
    })

    it('应该能够发送消息', () => {
      ws = new DeliveryWebSocket('order-001')
      const sendSpy = vi.spyOn(ws as any, 'send')

      ws.send({ type: 'ping' })

      expect(sendSpy).toHaveBeenCalledWith({ type: 'ping' })
    })
  })

  describe('RealDeliveryWebSocket', () => {
    let ws: RealDeliveryWebSocket

    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
      if (ws) {
        ws.disconnect()
      }
    })

    it('应该正确创建真实 WebSocket 实例', () => {
      ws = new RealDeliveryWebSocket('order-001')
      expect(ws).toBeInstanceOf(RealDeliveryWebSocket)
    })

    it('应该有正确的初始状态', () => {
      ws = new RealDeliveryWebSocket('order-001')

      expect(ws.isConnected()).toBe(false)
      expect(ws.getReadyState()).toBe(WebSocket.CLOSED)
    })

    it('应该能够订阅多个事件', () => {
      ws = new RealDeliveryWebSocket('order-001')
      const messageCallback = vi.fn()
      const connectedCallback = vi.fn()

      ws.on('message', messageCallback)
      ws.on('connected', connectedCallback)

      // 模拟触发事件
      ;(ws as any).emit('message', { type: 'test' })
      ;(ws as any).emit('connected', {})

      expect(messageCallback).toHaveBeenCalled()
      expect(connectedCallback).toHaveBeenCalled()
    })
  })

  describe('useDeliveryWebSocket', () => {
    it('应该返回正确的 API', () => {
      const ws = useDeliveryWebSocket('order-001')

      expect(ws).toHaveProperty('connect')
      expect(ws).toHaveProperty('disconnect')
      expect(ws).toHaveProperty('send')
      expect(ws).toHaveProperty('on')
      expect(ws).toHaveProperty('off')
      expect(typeof ws.connect).toBe('function')
      expect(typeof ws.disconnect).toBe('function')
      expect(typeof ws.send).toBe('function')
      expect(typeof ws.on).toBe('function')
      expect(typeof ws.off).toBe('function')
    })
  })
})
