/**
 * 黑科易购 WebSocket 服务器
 * 用于实时配送追踪
 */

const WebSocket = require('ws')
const http = require('http')
const { v4: uuidv4 } = require('uuid')

// 配置
const PORT = process.env.WS_PORT || 3000
const HOST = process.env.WS_HOST || '0.0.0.0'

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({
    status: 'ok',
    service: 'heikeji-websocket-server',
    version: '1.0.0',
    connections: wss.clients.size
  }))
})

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ server, path: '/ws' })

// 存储订单连接
const orderConnections = new Map()

// 模拟配送路径
const mockDeliveryPaths = {
  'order-001': [
    { lat: 45.768, lng: 126.635, status: '取货中', timestamp: Date.now() },
    { lat: 45.766, lng: 126.634, status: '配送中', timestamp: Date.now() + 60000 },
    { lat: 45.764, lng: 126.633, status: '配送中', timestamp: Date.now() + 120000 },
    { lat: 45.762, lng: 126.632, status: '即将到达', timestamp: Date.now() + 180000 },
    { lat: 45.760, lng: 126.630, status: '已送达', timestamp: Date.now() + 240000 },
  ]
}

/**
 * 广播消息给所有连接的客户端
 */
function broadcast(message, excludeClient = null) {
  wss.clients.forEach(client => {
    if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}

/**
 * 发送消息给特定订单的所有连接
 */
function broadcastToOrder(orderId, message) {
  const connections = orderConnections.get(orderId)
  if (connections) {
    connections.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })
  }
}

/**
 * 模拟配送进度
 */
function simulateDelivery(orderId) {
  const path = mockDeliveryPaths[orderId] || generateMockPath()
  let step = 0

  const interval = setInterval(() => {
    if (step >= path.length) {
      clearInterval(interval)
      broadcastToOrder(orderId, {
        type: 'status',
        data: { status: 'completed', message: '订单已完成' }
      })
      return
    }

    const location = path[step]
    broadcastToOrder(orderId, {
      type: 'location',
      data: {
        ...location,
        timestamp: Date.now()
      }
    })

    broadcastToOrder(orderId, {
      type: 'status',
      data: { status: 'delivering', message: location.status }
    })

    step++
  }, 5000) // 每5秒更新一次位置

  return interval
}

/**
 * 生成模拟配送路径
 */
function generateMockPath() {
  const baseLat = 45.76
  const baseLng = 126.63
  const path = []

  for (let i = 0; i < 10; i++) {
    path.push({
      lat: baseLat + (Math.random() - 0.5) * 0.01,
      lng: baseLng + (Math.random() - 0.5) * 0.01,
      status: i < 3 ? '取货中' : i < 8 ? '配送中' : '即将到达',
      timestamp: Date.now() + i * 60000
    })
  }

  return path
}

// WebSocket 连接处理
wss.on('connection', (ws, req) => {
  const clientId = uuidv4()
  const url = new URL(req.url, `http://${req.headers.host}`)
  const orderId = url.pathname.split('/').pop() || 'unknown'

  console.log(`[WebSocket] 客户端连接: ${clientId}, 订单: ${orderId}`)

  // 将连接添加到订单组
  if (!orderConnections.has(orderId)) {
    orderConnections.set(orderId, new Set())
  }
  orderConnections.get(orderId).add(ws)

  // 发送连接成功消息
  ws.send(JSON.stringify({
    type: 'connected',
    data: { clientId, orderId, timestamp: Date.now() }
  }))

  // 发送初始状态
  ws.send(JSON.stringify({
    type: 'status',
    data: { status: 'preparing', message: '商家正在准备商品' }
  }))

  // 处理消息
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message)
      console.log('[WebSocket] 收到消息:', data)

      // 处理不同类型的消息
      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }))
          break

        case 'subscribe':
          // 订阅订单更新
          console.log(`[WebSocket] 订阅订单: ${data.orderId}`)
          break

        case 'start_delivery':
          // 开始配送模拟
          console.log(`[WebSocket] 开始配送: ${orderId}`)
          simulateDelivery(orderId)
          break

        case 'location_update':
          // 转发位置更新给同一订单的其他客户端
          broadcastToOrder(orderId, {
            type: 'location',
            data: data.data
          })
          break

        case 'status_update':
          // 转发状态更新
          broadcastToOrder(orderId, {
            type: 'status',
            data: data.data
          })
          break

        default:
          console.log(`[WebSocket] 未知消息类型: ${data.type}`)
      }
    } catch (error) {
      console.error('[WebSocket] 消息处理错误:', error)
      ws.send(JSON.stringify({
        type: 'error',
        data: { message: '消息格式错误' }
      }))
    }
  })

  // 处理关闭
  ws.on('close', () => {
    console.log(`[WebSocket] 客户端断开: ${clientId}`)
    const connections = orderConnections.get(orderId)
    if (connections) {
      connections.delete(ws)
      if (connections.size === 0) {
        orderConnections.delete(orderId)
      }
    }
  })

  // 处理错误
  ws.on('error', (error) => {
    console.error(`[WebSocket] 客户端错误: ${clientId}`, error)
  })
})

// 启动服务器
server.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║     黑科易购 WebSocket 服务器已启动                      ║
╠════════════════════════════════════════════════════════╣
║  地址: ws://${HOST}:${PORT}/ws                          ║
║  健康检查: http://${HOST}:${PORT}/                      ║
╚════════════════════════════════════════════════════════╝
  `)
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('[WebSocket] 正在关闭服务器...')
  wss.clients.forEach(client => client.close())
  server.close(() => {
    console.log('[WebSocket] 服务器已关闭')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('[WebSocket] 正在关闭服务器...')
  wss.clients.forEach(client => client.close())
  server.close(() => {
    console.log('[WebSocket] 服务器已关闭')
    process.exit(0)
  })
})

module.exports = { server, wss }
