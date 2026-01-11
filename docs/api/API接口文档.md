# 黑科易购API接口文档

## 1. 接口概述

黑科易购API接口采用RESTful设计风格，提供了用户管理、商品管理、订单管理、支付管理等核心业务功能的接口。所有接口均返回JSON格式数据，使用HTTP状态码表示请求结果。

## 2. 接口规范

### 2.1 基础URL

- **开发环境**：http://localhost:8080/api
- **测试环境**：http://test.heikeji.com/api
- **生产环境**：http://api.heikeji.com/api

### 2.2 请求方式

支持的HTTP请求方式：

- GET：获取资源
- POST：创建资源
- PUT：更新资源
- DELETE：删除资源

### 2.3 数据格式

- **请求格式**：JSON
- **响应格式**：JSON

### 2.4 响应状态码

| 状态码 | 描述 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 拒绝访问，权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 502 | 网关错误 |
| 503 | 服务不可用 |
| 504 | 网关超时 |

### 2.5 响应数据结构

```json
{
  "code": 200,
  "message": "请求成功",
  "data": {}
}
```

- **code**：响应状态码
- **message**：响应信息
- **data**：响应数据，根据接口不同返回不同的数据结构

## 3. 认证与授权

### 3.1 JWT认证

- 所有需要认证的接口都需要在请求头中携带JWT Token
- Token格式：`Bearer {token}`
- Token有效期：7天

### 3.2 权限控制

- 基于RBAC（角色基于访问控制）的权限模型
- 接口权限通过注解 `@PreAuthorize` 控制
- 支持菜单级、按钮级权限控制

## 4. 接口列表

### 4.1 用户管理接口

#### 4.1.1 用户登录

- **接口地址**：`/api/auth/login`
- **请求方式**：POST
- **请求参数**：
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "string",
      "userInfo": {
        "id": 1,
        "username": "string",
        "nickname": "string",
        "avatar": "string",
        "roles": ["admin", "user"]
      }
    }
  }
  ```

#### 4.1.2 用户注册

- **接口地址**：`/api/auth/register`
- **请求方式**：POST
- **请求参数**：
  ```json
  {
    "username": "string",
    "password": "string",
    "nickname": "string",
    "mobile": "string"
  }
  ```
- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "注册成功",
    "data": {
      "id": 1,
      "username": "string"
    }
  }
  ```

#### 4.1.3 获取用户信息

- **接口地址**：`/api/user/info`
- **请求方式**：GET
- **请求头**：`Authorization: Bearer {token}`
- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": 1,
      "username": "string",
      "nickname": "string",
      "avatar": "string",
      "mobile": "string",
      "email": "string",
      "roles": ["admin", "user"]
    }
  }
  ```

#### 4.1.4 更新用户信息

- **接口地址**：`/api/user/update`
- **请求方式**：PUT
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
  ```json
  {
    "nickname": "string",
    "avatar": "string",
    "mobile": "string",
    "email": "string"
  }
  ```
- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "更新成功",
    "data": null
  }
  ```

### 4.2 商品管理接口

#### 4.2.1 获取商品列表

- **接口地址**：`/api/product/list`
- **请求方式**：GET
- **请求参数**：
  - categoryId：分类ID（可选）
  - keyword：搜索关键词（可选）
  - pageNum：页码（默认1）
  - pageSize：每页数量（默认10）
- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "records": [
        {
          "id": 1,
          "productName": "string",
          "productPrice": 99.99,
          "originalPrice": 129.99,
          "productPic": "string",
          "sales": 100,
          "stock": 500
        }
      ],
      "total": 100,
      "size": 10,
      "current": 1,
      "pages": 10
    }
  }
  ```

#### 4.2.2 获取商品详情

- **接口地址**：`/api/product/{id}`
- **请求方式**：GET
- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": 1,
      "productName": "string",
      "productDesc": "string",
      "productPrice": 99.99,
      "originalPrice": 129.99,
      "productPic": "string",
      "sales": 100,
      "stock": 500,
      "skuList": [
        {
          "id": 1,
          "skuCode": "string",
          "skuName": "string",
          "skuPrice": 99.99,
          "skuStock": 200,
          "sp1": "红色",
          "sp2": "L",
          "sp3": ""
        }
      ]
    }
  }
  ```

### 4.3 订单管理接口

#### 4.3.1 创建订单

- **接口地址**：`/api/order/create`
- **请求方式**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
  ```json
  {
    "addressId": 1,
    "orderItems": [
      {
        "skuId": 1,
        "quantity": 2,
        "price": 99.99
      }
    ],
    "remark": "不要辣"
  }
  ```
- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "创建成功",
    "data": {
      "orderId": 1,
      "orderSn": "202310011234567890",
      "totalAmount": 199.98
    }
  }
  ```

#### 4.3.2 获取订单列表

- **接口地址**：`/api/order/list`
- **请求方式**：GET
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
  - orderStatus：订单状态（可选）
  - pageNum：页码（默认1）
  - pageSize：每页数量（默认10）
- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "records": [
        {
          "id": 1,
          "orderSn": "202310011234567890",
          "orderStatus": 1,
          "orderStatusName": "待发货",
          "totalAmount": 199.98,
          "createTime": "2023-10-01 12:00:00"
        }
      ],
      "total": 10,
      "size": 10,
      "current": 1,
      "pages": 1
    }
  }
  ```

### 4.4 外卖订单接口

#### 4.4.1 创建外卖订单

- **接口地址**：`/api/app/takeout/order/create`
- **请求方式**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
  ```json
  {
    "merchantId": 1,
    "deliveryType": 1,  // 1-外卖柜，2-特殊地点，3-送到寝室
    "deliveryLockerCode": "LOCKER001",  // 配送方式为1时必填
    "deliverySpecialPlace": "西区1号楼门口饮料机",  // 配送方式为2时必填
    "deliveryDormBuilding": "西区1号楼A栋",  // 配送方式为3时必填
    "deliveryDormRoom": "501",  // 配送方式为3时必填
    "receiverName": "张三",
    "receiverPhone": "13800138000",
    "receiverAddress": "黑龙江科技大学西区",
    "orderItems": [
      {
        "productId": 1,
        "quantity": 2,
        "price": 25.00
      }
    ],
    "remark": "不要辣"
  }
  ```
- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "创建成功",
    "data": {
      "orderId": 1,
      "orderSn": "TK202310011234567890",
      "totalAmount": 50.00
    }
  }
  ```

#### 4.4.2 获取外卖订单列表

- **接口地址**：`/api/app/takeout/order/list`
- **请求方式**：GET
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
  - orderStatus：订单状态（可选）
  - pageNum：页码（默认1）
  - pageSize：每页数量（默认10）
- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "records": [
        {
          "id": 1,
          "orderSn": "TK202310011234567890",
          "orderStatus": 2,
          "orderStatusName": "制作中",
          "totalAmount": 50.00,
          "merchantName": "美味餐厅",
          "createTime": "2023-10-01 12:00:00"
        }
      ],
      "total": 5,
      "size": 10,
      "current": 1,
      "pages": 1
    }
  }
  ```

### 4.5 支付接口

#### 4.5.1 发起支付

- **接口地址**：`/api/pay/create`
- **请求方式**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
  ```json
  {
    "orderSn": "202310011234567890",
    "payType": 1,  // 1-微信支付，2-支付宝支付
    "payAmount": 199.98
  }
  ```
- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "支付请求成功",
    "data": {
      "payUrl": "https://pay.weixin.qq.com/xxx",
      "qrCode": "data:image/png;base64,xxx"
    }
  }
  ```

#### 4.5.2 查询支付状态

- **接口地址**：`/api/pay/query/{orderSn}`
- **请求方式**：GET
- **请求头**：`Authorization: Bearer {token}`
- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "查询成功",
    "data": {
      "orderSn": "202310011234567890",
      "payStatus": 1,  // 0-待支付，1-已支付，2-支付失败
      "payStatusName": "已支付",
      "payTime": "2023-10-01 12:05:00"
    }
  }
  ```

## 5. 错误码定义

| 错误码 | 描述 |
|--------|------|
| 200 | 请求成功 |
| 40001 | 参数错误 |
| 40002 | 验证码错误 |
| 40101 | 未登录或登录过期 |
| 40102 | 权限不足 |
| 40301 | 拒绝访问 |
| 40401 | 资源不存在 |
| 50001 | 服务器内部错误 |
| 50002 | 数据库错误 |
| 50003 | 第三方服务错误 |

## 6. 接口版本管理

- 接口版本通过URL路径区分，如 `/api/v1/user/list`、`/api/v2/user/list`
- 建议定期更新接口版本，保持API的兼容性和可扩展性
- 旧版本接口应提供至少6个月的过渡期，以便客户端平滑升级

## 7. 最佳实践

- **请求参数验证**：客户端应在发送请求前验证参数的合法性
- **错误处理**：客户端应根据响应状态码和错误信息进行适当的错误处理
- **超时设置**：客户端应设置合理的请求超时时间（建议5-10秒）
- **重试机制**：对于幂等操作，可以实现失败重试机制
- **缓存策略**：对于不经常变化的数据，客户端可以实现本地缓存
- **日志记录**：客户端应记录关键接口的请求和响应日志，便于调试和问题定位

## 8. 接口变更日志

| 日期 | 版本 | 变更内容 |
|------|------|----------|
| 2023-10-01 | v1.0 | 初始版本，包含用户、商品、订单、支付等核心接口 |
| 2023-11-01 | v1.1 | 新增外卖订单接口 |
| 2023-12-01 | v1.2 | 优化支付接口，支持更多支付方式 |

## 9. 联系我们

- **技术支持**：tech@heikeji.com
- **问题反馈**：https://github.com/heikeji/heikeji-mall/issues
- **文档更新**：https://docs.heikeji.com/api