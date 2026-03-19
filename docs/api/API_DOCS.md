# API文档使用指南

## 📚 目录

- [文档概述](#文档概述)
- [快速开始](#快速开始)
- [访问方式](#访问方式)
- [认证说明](#认证说明)
- [服务API列表](#服务api列表)
- [使用示例](#使用示例)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

---

## 文档概述

黑科易购商城系统采用 **SpringDoc OpenAPI 3.0** 规范，提供完整的RESTful API文档。系统包含以下特性：

- 📖 **统一的API文档中心** - 聚合所有微服务的API接口
- 🔐 **JWT认证支持** - 完整的接口权限控制
- 🎯 **在线测试** - 直接在文档页面测试API
- 📊 **详细的接口说明** - 包含参数、响应、示例等完整信息
- 🔄 **实时更新** - 代码变更自动同步到文档

### 技术栈

- **SpringDoc OpenAPI** - OpenAPI 3.0规范实现
- **Swagger UI** - 交互式API文档界面
- **Spring Boot 3.2.2** - 微服务框架
- **JWT** - 身份认证

---

## 快速开始

### 1. 启动服务

```bash
# 启动所有服务（包括API文档服务）
./start-all.sh

# 或仅启动API文档服务
cd service-api-docs
mvn spring-boot:run
```

### 2. 访问文档

打开浏览器访问：

```
http://localhost:8089/swagger-ui.html
```

### 3. 配置认证

点击页面右上角的 **Authorize** 按钮，输入JWT Token：

```
Bearer <your-jwt-token>
```

---

## 访问方式

### 开发环境

| 服务名称 | 访问地址 | 说明 |
|---------|---------|------|
| API文档中心 | http://localhost:8089/swagger-ui.html | 所有服务的API聚合 |
| API文档JSON | http://localhost:8089/v3/api-docs | OpenAPI JSON格式 |
| 用户服务文档 | http://localhost:8081/swagger-ui.html | 用户服务独立文档 |
| 商品服务文档 | http://localhost:8082/swagger-ui.html | 商品服务独立文档 |
| 订单服务文档 | http://localhost:8083/swagger-ui.html | 订单服务独立文档 |
| 配送服务文档 | http://localhost:8001/swagger-ui.html | 配送服务独立文档 |
| 外卖服务文档 | http://localhost:8005/swagger-ui.html | 外卖服务独立文档 |
| 支付服务文档 | http://localhost:8004/swagger-ui.html | 支付服务独立文档 |
| 校园服务文档 | http://localhost:8003/swagger-ui.html | 校园服务独立文档 |
| 二手服务文档 | http://localhost:8006/swagger-ui.html | 二手服务独立文档 |
| 失物招领文档 | http://localhost:8007/swagger-ui.html | 失物招领独立文档 |
| 会员服务文档 | http://localhost:8088/swagger-ui.html | 会员服务独立文档 |

### 生产环境

生产环境请根据实际部署地址访问，建议配置反向代理：

```nginx
location /api-docs/ {
    proxy_pass http://localhost:8089/;
}
```

---

## 认证说明

### JWT Token获取

#### 1. 用户登录

**接口：** `POST /api/user/login`

**请求示例：**

```json
{
  "username": "user123",
  "password": "password123"
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "username": "user123",
      "nickname": "张三"
    }
  }
}
```

#### 2. 管理员登录

**接口：** `POST /api/auth/login`

**请求示例：**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

### 配置认证

在Swagger UI页面中：

1. 点击右上角的 **Authorize** 按钮
2. 在弹出的对话框中输入：`Bearer <your-jwt-token>`
3. 点击 **Authorize** 确认
4. 关闭对话框

**注意：** Token前需要添加 `Bearer ` 前缀（注意有空格）

### Token刷新

Token有效期默认为24小时，过期后需要重新登录获取新Token。

---

## 服务API列表

### 1. 用户服务 (service-user)

**端口：** 8081

**主要接口：**

| 接口路径 | 方法 | 说明 | 认证 |
|---------|------|------|------|
| `/api/user/register` | POST | 用户注册 | 否 |
| `/api/user/login` | POST | 用户登录 | 否 |
| `/api/user/logout` | POST | 用户登出 | 是 |
| `/api/user/info` | GET | 获取用户信息 | 是 |
| `/api/user/update` | PUT | 更新用户信息 | 是 |
| `/api/user/password` | PUT | 修改密码 | 是 |
| `/api/user/address` | GET | 获取地址列表 | 是 |
| `/api/user/address` | POST | 添加地址 | 是 |
| `/api/user/address/{id}` | PUT | 更新地址 | 是 |
| `/api/user/address/{id}` | DELETE | 删除地址 | 是 |

**控制器类：**
- [UserController](file:///home/zky/HKYG/heikeji-mall-service/service-user/src/main/java/com/heikeji/mall/user/controller/UserController.java)
- [AddressController](file:///home/zky/HKYG/heikeji-mall-service/service-user/src/main/java/com/heikeji/mall/user/controller/AddressController.java)
- [UserSecurityController](file:///home/zky/HKYG/heikeji-mall-service/service-user/src/main/java/com/heikeji/mall/user/controller/UserSecurityController.java)

---

### 2. 商品服务 (service-product)

**端口：** 8082

**主要接口：**

| 接口路径 | 方法 | 说明 | 认证 |
|---------|------|------|------|
| `/api/product/page` | GET | 分页查询商品 | 否 |
| `/api/product/{id}` | GET | 获取商品详情 | 否 |
| `/api/product/search` | GET | 搜索商品 | 否 |
| `/api/product/hot` | GET | 热门商品 | 否 |
| `/api/product/recommend` | GET | 推荐商品 | 是 |
| `/api/category/list` | GET | 分类列表 | 否 |
| `/api/category/tree` | GET | 分类树 | 否 |
| `/api/cart/add` | POST | 添加到购物车 | 是 |
| `/api/cart/list` | GET | 购物车列表 | 是 |
| `/api/cart/update` | PUT | 更新购物车 | 是 |
| `/api/cart/delete` | DELETE | 删除购物车 | 是 |

**控制器类：**
- [ProductController](file:///home/zky/HKYG/heikeji-mall-service/service-product/src/main/java/com/heikeji/mall/product/controller/ProductController.java)
- [CategoryController](file:///home/zky/HKYG/heikeji-mall-service/service-product/src/main/java/com/heikeji/mall/product/controller/CategoryController.java)
- [CartController](file:///home/zky/HKYG/heikeji-mall-service/service-product/src/main/java/com/heikeji/mall/product/controller/CartController.java)
- [ProductRecommendController](file:///home/zky/HKYG/heikeji-mall-service/service-product/src/main/java/com/heikeji/mall/product/controller/ProductRecommendController.java)

---

### 3. 订单服务 (service-order)

**端口：** 8083

**主要接口：**

| 接口路径 | 方法 | 说明 | 认证 |
|---------|------|------|------|
| `/api/order/create` | POST | 创建订单 | 是 |
| `/api/order/list` | GET | 订单列表 | 是 |
| `/api/order/{id}` | GET | 订单详情 | 是 |
| `/api/order/cancel` | PUT | 取消订单 | 是 |
| `/api/order/confirm` | PUT | 确认收货 | 是 |
| `/api/order/pay` | POST | 支付订单 | 是 |
| `/api/analysis/sales/overview` | GET | 销售概览 | 是 |
| `/api/analysis/sales/trend` | GET | 销售趋势 | 是 |

**控制器类：**
- [SalesAnalysisController](file:///home/zky/HKYG/heikeji-mall-service/service-order/src/main/java/com/heikeji/mall/order/controller/SalesAnalysisController.java)

---

### 4. 配送服务 (service-delivery)

**端口：** 8001

**主要接口：**

| 接口路径 | 方法 | 说明 | 认证 |
|---------|------|------|------|
| `/api/delivery/request` | POST | 创建配送请求 | 是 |
| `/api/delivery/list` | GET | 配送列表 | 是 |
| `/api/delivery/{id}` | GET | 配送详情 | 是 |
| `/api/delivery/accept` | PUT | 接单 | 是 |
| `/api/delivery/complete` | PUT | 完成配送 | 是 |
| `/api/delivery/cancel` | PUT | 取消配送 | 是 |

---

### 5. 外卖服务 (service-takeout)

**端口：** 8005

**主要接口：**

| 接口路径 | 方法 | 说明 | 认证 |
|---------|------|------|------|
| `/api/takeout/merchant/list` | GET | 商家列表 | 否 |
| `/api/takeout/merchant/{id}` | GET | 商家详情 | 否 |
| `/api/takeout/product/list` | GET | 商品列表 | 否 |
| `/api/takeout/order/create` | POST | 创建订单 | 是 |
| `/api/takeout/order/list` | GET | 订单列表 | 是 |
| `/api/takeout/order/{id}` | GET | 订单详情 | 是 |
| `/api/takeout/review` | POST | 添加评价 | 是 |
| `/api/takeout/review/list` | GET | 评价列表 | 否 |

**控制器类：**
- [TakeoutController](file:///home/zky/HKYG/heikeji-mall-service/service-takeout/src/main/java/com/heikeji/mall/takeout/controller/TakeoutController.java)
- [MerchantController](file:///home/zky/HKYG/heikeji-mall-service/service-takeout/src/main/java/com/heikeji/mall/takeout/controller/MerchantController.java)
- [TakeoutProductController](file:///home/zky/HKYG/heikeji-mall-service/service-takeout/src/main/java/com/heikeji/mall/takeout/controller/TakeoutProductController.java)
- [TakeoutReviewController](file:///home/zky/HKYG/heikeji-mall-service/service-takeout/src/main/java/com/heikeji/mall/takeout/controller/TakeoutReviewController.java)

---

### 6. 支付服务 (service-payment)

**端口：** 8004

**主要接口：**

| 接口路径 | 方法 | 说明 | 认证 |
|---------|------|------|------|
| `/api/payment/wechat/{paymentId}` | GET | 微信支付参数 | 是 |
| `/api/payment/alipay/{paymentId}` | GET | 支付宝支付参数 | 是 |
| `/api/payment/status/{orderNo}` | GET | 查询支付状态 | 是 |
| `/api/payment/refund` | POST | 申请退款 | 是 |
| `/api/payment/refund/status/{refundNo}` | GET | 退款状态 | 是 |
| `/api/reconciliation/list` | GET | 对账列表 | 是 |

**控制器类：**
- [PaymentController](file:///home/zky/HKYG/heikeji-mall-service/service-payment/src/main/java/com/heikeji/mall/payment/controller/PaymentController.java)
- [ReconciliationController](file:///home/zky/HKYG/heikeji-mall-service/service-payment/src/main/java/com/heikeji/mall/payment/controller/ReconciliationController.java)

---

### 7. 校园服务 (service-campus)

**端口：** 8003

**主要接口：**

| 接口路径 | 方法 | 说明 | 认证 |
|---------|------|------|------|
| `/api/campus/activity/list` | GET | 活动列表 | 否 |
| `/api/campus/activity/{id}` | GET | 活动详情 | 否 |
| `/api/campus/activity/join` | POST | 参加活动 | 是 |
| `/api/campus/notice/list` | GET | 通知列表 | 否 |
| `/api/campus/notice/{id}` | GET | 通知详情 | 否 |

---

### 8. 二手服务 (service-secondhand)

**端口：** 8006

**主要接口：**

| 接口路径 | 方法 | 说明 | 认证 |
|---------|------|------|------|
| `/api/secondhand/list` | GET | 商品列表 | 否 |
| `/api/secondhand/{id}` | GET | 商品详情 | 否 |
| `/api/secondhand/create` | POST | 发布商品 | 是 |
| `/api/secondhand/update` | PUT | 更新商品 | 是 |
| `/api/secondhand/delete` | DELETE | 删除商品 | 是 |
| `/api/secondhand/favorite` | POST | 收藏商品 | 是 |
| `/api/secondhand/favorite/list` | GET | 收藏列表 | 是 |

---

### 9. 失物招领服务 (service-lostfound)

**端口：** 8007

**主要接口：**

| 接口路径 | 方法 | 说明 | 认证 |
|---------|------|------|------|
| `/api/lostfound/list` | GET | 列表 | 否 |
| `/api/lostfound/{id}` | GET | 详情 | 否 |
| `/api/lostfound/create` | POST | 发布 | 是 |
| `/api/lostfound/update` | PUT | 更新 | 是 |
| `/api/lostfound/delete` | DELETE | 删除 | 是 |
| `/api/lostfound/claim` | POST | 认领 | 是 |

---

### 10. 会员服务 (service-member)

**端口：** 8088

**主要接口：**

| 接口路径 | 方法 | 说明 | 认证 |
|---------|------|------|------|
| `/api/member/level/list` | GET | 会员等级列表 | 否 |
| `/api/member/level/{id}` | GET | 会员等级详情 | 否 |
| `/api/member/point/list` | GET | 积分记录 | 是 |
| `/api/member/coupon/list` | GET | 优惠券列表 | 是 |
| `/api/member/coupon/receive` | POST | 领取优惠券 | 是 |
| `/api/member/activity/list` | GET | 营销活动列表 | 否 |

**控制器类：**
- [MemberLevelController](file:///home/zky/HKYG/heikeji-mall-service/service-member/src/main/java/com/heikeji/mall/member/controller/MemberLevelController.java)
- [PointController](file:///home/zky/HKYG/heikeji-mall-service/service-member/src/main/java/com/heikeji/mall/member/controller/PointController.java)
- [CouponController](file:///home/zky/HKYG/heikeji-mall-service/service-member/src/main/java/com/heikeji/mall/member/controller/CouponController.java)
- [MarketingActivityController](file:///home/zky/HKYG/heikeji-mall-service/service-member/src/main/java/com/heikeji/mall/member/controller/MarketingActivityController.java)

---

### 11. 系统管理服务 (heikeji-system)

**端口：** 8090

**主要接口：**

| 接口路径 | 方法 | 说明 | 认证 |
|---------|------|------|------|
| `/api/auth/login` | POST | 管理员登录 | 否 |
| `/api/auth/logout` | POST | 管理员登出 | 是 |
| `/api/user/list` | GET | 用户列表 | 是 |
| `/api/user/{id}` | GET | 用户详情 | 是 |
| `/api/role/list` | GET | 角色列表 | 是 |
| `/api/permission/list` | GET | 权限列表 | 是 |
| `/api/dashboard/stats` | GET | 仪表盘统计 | 是 |

**控制器类：**
- [AuthController](file:///home/zky/HKYG/heikeji-system/src/main/java/com/heikeji/system/controller/AuthController.java)
- [SysUserController](file:///home/zky/HKYG/heikeji-system/src/main/java/com/heikeji/system/controller/SysUserController.java)
- [SysRoleController](file:///home/zky/HKYG/heikeji-system/src/main/java/com/heikeji/system/controller/SysRoleController.java)
- [SysPermissionController](file:///home/zky/HKYG/heikeji-system/src/main/java/com/heikeji/system/controller/SysPermissionController.java)
- [DashboardController](file:///home/zky/HKYG/heikeji-system/src/main/java/com/heikeji/system/controller/DashboardController.java)

---

## 使用示例

### 示例1：用户注册并登录

#### 1.1 注册用户

**请求：**

```bash
curl -X POST http://localhost:8089/v3/api-docs/service-user/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "email": "test@example.com",
    "phone": "13800138000"
  }'
```

**响应：**

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

#### 1.2 用户登录

**请求：**

```bash
curl -X POST http://localhost:8089/v3/api-docs/service-user/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**响应：**

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "username": "testuser",
      "nickname": "测试用户"
    }
  }
}
```

---

### 示例2：查询商品列表

#### 2.1 分页查询商品

**请求：**

```bash
curl -X GET "http://localhost:8089/v3/api-docs/service-product/api/product/page?pageNo=1&pageSize=10&keyword=手机" \
  -H "Content-Type: application/json"
```

**响应：**

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "records": [
      {
        "id": 1,
        "name": "iPhone 15 Pro",
        "price": 8999.00,
        "stock": 100,
        "categoryId": 1,
        "merchantId": 1,
        "status": 1,
        "image": "https://example.com/image.jpg"
      }
    ],
    "total": 50,
    "size": 10,
    "current": 1
  }
}
```

---

### 示例3：创建订单

#### 3.1 创建订单（需要认证）

**请求：**

```bash
curl -X POST http://localhost:8089/v3/api-docs/service-order/api/order/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "productId": 1,
    "quantity": 2,
    "addressId": 1,
    "remark": "请尽快发货"
  }'
```

**响应：**

```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "orderId": "ORD202401011234567890",
    "totalAmount": 17998.00,
    "status": 0,
    "createTime": "2024-01-01 12:34:56"
  }
}
```

---

### 示例4：支付订单

#### 4.1 获取支付参数

**请求：**

```bash
curl -X GET http://localhost:8089/v3/api-docs/service-payment/api/payment/wechat/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应：**

```json
{
  "code": 200,
  "message": "获取支付参数成功",
  "data": {
    "appId": "wx1234567890",
    "timeStamp": "1704116096",
    "nonceStr": "abc123",
    "package": "prepay_id=wx1234567890",
    "signType": "MD5",
    "paySign": "abc123def456"
  }
}
```

---

## 最佳实践

### 1. 接口调用规范

#### 1.1 统一响应格式

所有接口返回统一的响应格式：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

**响应码说明：**

| 响应码 | 说明 |
|-------|------|
| 200 | 操作成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

#### 1.2 分页参数

```json
{
  "pageNo": 1,
  "pageSize": 10
}
```

#### 1.3 时间格式

所有时间字段统一使用以下格式：

```
yyyy-MM-dd HH:mm:ss
```

例如：`2024-01-01 12:34:56`

---

### 2. 错误处理

#### 2.1 错误响应示例

```json
{
  "code": 400,
  "message": "参数校验失败",
  "data": {
    "field": "username",
    "message": "用户名不能为空"
  }
}
```

#### 2.2 常见错误码

| 错误码 | 说明 | 解决方案 |
|-------|------|---------|
| 1001 | Token无效 | 重新登录获取新Token |
| 1002 | Token过期 | 重新登录获取新Token |
| 2001 | 用户不存在 | 检查用户名是否正确 |
| 2002 | 密码错误 | 检查密码是否正确 |
| 3001 | 商品不存在 | 检查商品ID是否正确 |
| 3002 | 库存不足 | 减少购买数量 |
| 4001 | 订单不存在 | 检查订单号是否正确 |
| 4002 | 订单状态异常 | 检查订单当前状态 |

---

### 3. 性能优化

#### 3.1 使用缓存

对于频繁访问的数据，建议使用缓存：

```bash
# 添加缓存头
curl -X GET "http://localhost:8089/v3/api-docs/service-product/api/product/hot" \
  -H "Cache-Control: max-age=3600"
```

#### 3.2 分页查询

对于大数据量查询，务必使用分页：

```bash
# 使用分页参数
curl -X GET "http://localhost:8089/v3/api-docs/service-product/api/product/list?pageNo=1&pageSize=20"
```

#### 3.3 字段过滤

只请求需要的字段，减少数据传输量：

```bash
# 使用fields参数过滤字段
curl -X GET "http://localhost:8089/v3/api-docs/service-product/api/product/1?fields=id,name,price"
```

---

### 4. 安全建议

#### 4.1 HTTPS

生产环境务必使用HTTPS协议：

```
https://api.heikeji.com/swagger-ui.html
```

#### 4.2 Token管理

- 不要在客户端存储敏感信息
- Token过期后及时刷新
- 登出时清除Token

#### 4.3 限流保护

系统实现了接口限流保护，避免频繁调用：

```java
@RateLimiter(timeWindow = 1, maxCount = 30)
```

---

## 常见问题

### Q1: 如何获取JWT Token？

**A:** 通过登录接口获取：

```bash
curl -X POST http://localhost:8089/v3/api-docs/service-user/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

响应中的 `data.token` 就是JWT Token。

---

### Q2: Token过期怎么办？

**A:** Token有效期为24小时，过期后需要重新登录获取新Token。

---

### Q3: 如何在Swagger UI中测试接口？

**A:**

1. 打开Swagger UI页面：`http://localhost:8089/swagger-ui.html`
2. 点击右上角的 **Authorize** 按钮
3. 输入JWT Token：`Bearer <your-token>`
4. 点击需要测试的接口
5. 点击 **Try it out** 按钮
6. 填写参数后点击 **Execute** 执行

---

### Q4: 接口调用返回401错误？

**A:** 401错误表示未授权，可能原因：

1. Token未配置或配置错误
2. Token已过期
3. Token格式不正确

解决方法：检查Token是否正确配置，格式应为 `Bearer <token>`。

---

### Q5: 接口调用返回403错误？

**A:** 403错误表示禁止访问，可能原因：

1. 当前用户没有该接口的访问权限
2. 接口需要管理员权限

解决方法：检查用户角色和权限配置。

---

### Q6: 如何查看接口的详细说明？

**A:** 在Swagger UI页面中：

1. 点击接口名称展开详细信息
2. 查看 **Description** 了解接口说明
3. 查看 **Parameters** 了解请求参数
4. 查看 **Responses** 了解响应格式

---

### Q7: 如何下载API文档？

**A:** 访问以下地址下载OpenAPI JSON格式文档：

```
http://localhost:8089/v3/api-docs
```

可以使用以下工具转换为其他格式：

- **Swagger Codegen** - 生成客户端SDK
- **OpenAPI Generator** - 生成多种格式的文档
- **Redoc** - 生成交互式文档

---

### Q8: 接口限流规则是什么？

**A:** 系统实现了基于令牌桶算法的限流保护：

- 默认限流：30次/秒
- 登录接口：5次/分钟
- 支付接口：10次/分钟

超过限流阈值会返回429错误：

```json
{
  "code": 429,
  "message": "请求过于频繁，请稍后再试"
}
```

---

### Q9: 如何处理分页数据？

**A:** 分页响应格式：

```json
{
  "code": 200,
  "data": {
    "records": [],
    "total": 100,
    "size": 10,
    "current": 1,
    "pages": 10
  }
}
```

**字段说明：**

- `records` - 当前页数据列表
- `total` - 总记录数
- `size` - 每页大小
- `current` - 当前页码
- `pages` - 总页数

---

### Q10: 如何上传文件？

**A:** 使用 `multipart/form-data` 格式上传文件：

```bash
curl -X POST http://localhost:8089/v3/api-docs/service-product/api/product/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/image.jpg"
```

---

## 附录

### A. 配置文件

#### API文档服务配置

文件位置：[service-api-docs/src/main/resources/application.yml](file:///home/zky/HKYG/service-api-docs/src/main/resources/application.yml)

```yaml
server:
  port: 8089

springdoc:
  api-docs:
    enabled: true
  swagger-ui:
    enabled: true
    path: /swagger-ui.html
```

#### 各服务Swagger配置

示例：[service-user/src/main/java/com/heikeji/mall/user/config/SwaggerConfig.java](file:///home/zky/HKYG/heikeji-mall-service/service-user/src/main/java/com/heikeji/mall/user/config/SwaggerConfig.java)

```java
@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("黑科易购用户服务API文档")
                        .version("1.0.0")
                        .description("黑科易购系统用户服务的API接口文档"))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
```

---

### B. 相关链接

- [SpringDoc官方文档](https://springdoc.org/)
- [OpenAPI 3.0规范](https://swagger.io/specification/)
- [Swagger UI文档](https://swagger.io/tools/swagger-ui/)
- [项目部署指南](file:///home/zky/HKYG/DEPLOYMENT.md)
- [项目README](file:///home/zky/HKYG/README.md)

---

### C. 更新日志

| 版本 | 日期 | 更新内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-06 | 初始版本，包含所有服务的API文档 |

---

### D. 联系方式

如有问题或建议，请联系：

- **邮箱：** dev@heikeji.com
- **项目地址：** http://www.heikeji.com
- **技术支持：** support@heikeji.com

---

**文档版本：** 1.0.1  
**最后更新：** 2026-03-16  
**维护团队：** 黑科易购开发团队
