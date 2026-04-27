# 黑科易购 WebSocket 服务器

实时配送追踪 WebSocket 服务器

## 功能特性

- 🚀 实时位置追踪
- 📡 双向通信
- 🔄 自动重连支持
- 📊 多订单并发处理
- 🎯 消息广播

## 快速开始

### 安装依赖

```bash
cd websocket-server
npm install
```

### 启动服务器

```bash
# 生产环境
npm start

# 开发环境（热重载）
npm run dev
```

### 环境变量

```bash
WS_PORT=3000      # WebSocket 端口
WS_HOST=0.0.0.0   # 监听地址
```

## API 文档

### 连接地址

```
ws://localhost:3000/ws/delivery/{orderId}
```

### 消息类型

#### 客户端 -> 服务器

```typescript
// 心跳
{ type: 'ping' }

// 订阅订单
{ type: 'subscribe', orderId: 'order-001' }

// 开始配送
{ type: 'start_delivery' }

// 位置更新
{
  type: 'location_update',
  data: { lat: 45.76, lng: 126.63 }
}

// 状态更新
{
  type: 'status_update',
  data: { status: 'delivering', message: '配送中' }
}
```

#### 服务器 -> 客户端

```typescript
// 连接成功
{
  type: 'connected',
  data: { clientId: 'uuid', orderId: 'order-001', timestamp: 1234567890 }
}

// 位置更新
{
  type: 'location',
  data: { lat: 45.76, lng: 126.63, status: '配送中', timestamp: 1234567890 }
}

// 状态更新
{
  type: 'status',
  data: { status: 'delivering', message: '骑手正在配送中' }
}

// 心跳响应
{ type: 'pong', timestamp: 1234567890 }

// 错误
{ type: 'error', data: { message: '错误信息' } }
```

## 测试

```bash
npm test
```

## 部署

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Systemd 服务

```ini
[Unit]
Description=Heikeji WebSocket Server
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/path/to/websocket-server
ExecStart=/usr/bin/node server.js
Restart=always
Environment=WS_PORT=3000

[Install]
WantedBy=multi-user.target
```
