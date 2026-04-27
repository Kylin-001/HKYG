# 后端 API 接口文档

## 基础配置

### 开发环境
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/ws
```

### 生产环境
```env
VITE_API_BASE_URL=https://api.heikeji.com/api
VITE_WS_URL=wss://api.heikeji.com/ws
```

---

## 接口列表

### 1. 商家模块

#### 1.1 获取商家列表
- **URL**: `GET /api/takeout/merchants`
- **请求参数**:
  ```typescript
  {
    page?: number      // 页码，默认 1
    limit?: number     // 每页数量，默认 10
    category?: string  // 分类筛选
    sort?: string      // 排序方式：rating|sales|distance|time
  }
  ```
- **响应数据**:
  ```typescript
  {
    code: 200
    data: {
      list: Merchant[]
      total: number
    }
    message: "success"
    success: true
  }
  ```

#### 1.2 搜索商家
- **URL**: `GET /api/takeout/merchants/search`
- **请求参数**:
  ```typescript
  {
    keyword: string    // 搜索关键词
  }
  ```
- **响应数据**: `Merchant[]`

#### 1.3 获取商家详情
- **URL**: `GET /api/takeout/merchants/{merchantId}`
- **响应数据**: `MerchantDetail`

#### 1.4 获取商家商品列表
- **URL**: `GET /api/takeout/merchants/{merchantId}/products`
- **请求参数**:
  ```typescript
  {
    category?: string  // 分类筛选
    page?: number      // 页码
    limit?: number     // 每页数量
  }
  ```
- **响应数据**:
  ```typescript
  {
    list: Product[]
    total: number
  }
  ```

---

### 2. 订单模块

#### 2.1 创建订单
- **URL**: `POST /api/takeout/orders`
- **请求体**:
  ```typescript
  {
    merchantId: string
    items: Array<{
      productId: string
      quantity: number
      specs?: Record<string, string>
    }>
    addressId: string
    remark?: string
    couponId?: string
    usePoints?: boolean
    paymentMethod: string
  }
  ```
- **响应数据**: `TakeoutOrder`

#### 2.2 获取订单详情
- **URL**: `GET /api/takeout/orders/{orderId}`
- **响应数据**: `TakeoutOrder`

#### 2.3 获取订单列表
- **URL**: `GET /api/takeout/orders`
- **请求参数**:
  ```typescript
  {
    status?: string    // 订单状态
    page?: number
    limit?: number
  }
  ```
- **响应数据**:
  ```typescript
  {
    list: TakeoutOrder[]
    total: number
    page: number
    limit: number
  }
  ```

#### 2.4 取消订单
- **URL**: `POST /api/takeout/orders/{orderId}/cancel`
- **请求体**:
  ```typescript
  {
    reason?: string
  }
  ```

#### 2.5 确认收货
- **URL**: `POST /api/takeout/orders/{orderId}/confirm`

#### 2.6 提交评价
- **URL**: `POST /api/takeout/orders/{orderId}/review`
- **请求体**:
  ```typescript
  {
    rating: number
    foodRating: number
    deliveryRating: number
    serviceRating: number
    content: string
    tags: string[]
    isAnonymous: boolean
    itemRatings: Record<string, number>
  }
  ```

---

### 3. 配送模块

#### 3.1 获取配送追踪
- **URL**: `GET /api/takeout/orders/{orderId}/delivery/track`
- **响应数据**: `DeliveryTrack`

#### 3.2 获取订单状态
- **URL**: `GET /api/takeout/orders/{orderId}/status`
- **响应数据**:
  ```typescript
  {
    status: string
    statusText: string
    updateTime: string
  }
  ```

#### 3.3 获取订单进度
- **URL**: `GET /api/takeout/orders/{orderId}/progress`
- **响应数据**:
  ```typescript
  {
    currentStep: number
    totalSteps: number
    estimatedTime: string
  }
  ```

#### 3.4 获取订单时间线
- **URL**: `GET /api/takeout/orders/{orderId}/timeline`
- **响应数据**:
  ```typescript
  Array<{
    status: string
    time: string
    description: string
    completed: boolean
  }>
  ```

---

### 4. WebSocket 实时配送

#### 4.1 连接地址
```
ws://localhost:3000/ws/delivery/{orderId}
```

#### 4.2 消息类型

**客户端发送**:
```typescript
// 订阅配送更新
{
  type: 'subscribe'
  orderId: string
}

// 取消订阅
{
  type: 'unsubscribe'
  orderId: string
}
```

**服务端推送**:
```typescript
// 位置更新
{
  type: 'location'
  data: {
    lat: number
    lng: number
    timestamp: number
  }
}

// 状态更新
{
  type: 'status'
  data: {
    status: string
    message: string
    timestamp: number
  }
}

// 配送员信息
{
  type: 'rider'
  data: {
    name: string
    phone: string
    avatar: string
  }
}
```

---

## 数据模型

### Merchant（商家）
```typescript
interface Merchant {
  id: string
  name: string
  logo: string
  coverImage: string
  rating: number
  sales: number
  minOrder: number
  deliveryFee: number
  deliveryTime: string
  tags: string[]
  isOpen: boolean
  location: string
}
```

### Product（商品）
```typescript
interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  sales: number
  description: string
  category: string
  isRecommended: boolean
  tags: string[]
  specifications?: DishSpecification[]
}
```

### TakeoutOrder（订单）
```typescript
interface TakeoutOrder {
  id: string
  orderNo: string
  merchantId: string
  merchantName: string
  merchantLogo: string
  items: OrderItem[]
  status: string
  statusText: string
  totalAmount: number
  deliveryFee: number
  discountAmount: number
  payAmount: number
  address: Address
  remark?: string
  createTime: string
  payTime?: string
  deliveryTime?: string
  completeTime?: string
}
```

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 1001 | 商家已打烊 |
| 1002 | 超出配送范围 |
| 1003 | 库存不足 |
| 1004 | 优惠券已过期 |

---

## 测试建议

1. 使用 Postman 或 Apifox 测试接口
2. 先测试商家列表接口，确保基础功能正常
3. 测试订单创建流程
4. 测试 WebSocket 连接
