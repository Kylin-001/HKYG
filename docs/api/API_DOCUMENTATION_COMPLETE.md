# 黑科易购校园服务平台 - 完整API文档

## 📚 文档概述

本文档包含黑科易购校园服务平台的所有API接口说明，涵盖用户端、管理端、商家端和配送端的所有功能模块。

**文档版本**: v2.0  
**最后更新**: 2026-03-28  
**API版本**: v1.0

---

## 🔐 认证方式

### JWT Token认证

所有API请求（除公开接口外）都需要在Header中携带JWT Token：

```http
Authorization: Bearer <your-jwt-token>
```

### Token获取

通过登录接口获取：

```http
POST /api/user/login
Content-Type: application/json

{
  "account": "用户名/手机号/邮箱",
  "password": "密码",
  "code": "验证码" // 如果需要
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 7200,
    "userInfo": {
      "id": 1,
      "username": "zhangsan",
      "nickname": "张三",
      "avatar": "https://...",
      "role": "user"
    }
  }
}
```

---

## 👤 用户模块 API

### 1. 用户认证

#### 1.1 用户注册
```http
POST /api/user/register
Content-Type: application/json

{
  "username": "zhangsan",
  "password": "password123",
  "confirmPassword": "password123",
  "phone": "13800138000",
  "smsCode": "123456",
  "nickname": "张三"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "id": 1,
    "username": "zhangsan",
    "nickname": "张三"
  }
}
```

#### 1.2 用户登录
```http
POST /api/user/login
Content-Type: application/json

{
  "account": "zhangsan",
  "password": "password123",
  "code": "",
  "codeId": ""
}
```

#### 1.3 发送短信验证码
```http
POST /api/user/sms-code
Content-Type: application/json

{
  "phone": "13800138000",
  "type": "register" // register, login, resetPassword
}
```

#### 1.4 刷新Token
```http
POST /api/user/refresh-token
Authorization: Bearer <refresh-token>
```

#### 1.5 用户登出
```http
POST /api/user/logout
Authorization: Bearer <token>
```

### 2. 用户信息管理

#### 2.1 获取当前用户信息
```http
GET /api/user/me
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "zhangsan",
    "nickname": "张三",
    "avatar": "https://...",
    "phone": "138****8000",
    "email": "zhang***@qq.com",
    "gender": 1,
    "birthday": "2000-01-01",
    "signature": "这个人很懒...",
    "points": 1000,
    "level": 3,
    "verified": true,
    "createTime": "2024-01-01 10:00:00"
  }
}
```

#### 2.2 更新用户信息
```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "nickname": "张三",
  "avatar": "https://...",
  "gender": 1,
  "birthday": "2000-01-01",
  "signature": "新的签名"
}
```

#### 2.3 修改密码
```http
PUT /api/user/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "oldPass123",
  "newPassword": "newPass123",
  "confirmPassword": "newPass123"
}
```

#### 2.4 上传头像
```http
POST /api/user/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <图片文件>
```

### 3. 用户地址管理

#### 3.1 获取地址列表
```http
GET /api/user/address/list
Authorization: Bearer <token>
```

#### 3.2 添加地址
```http
POST /api/user/address
Authorization: Bearer <token>
Content-Type: application/json

{
  "consignee": "张三",
  "phone": "13800138000",
  "province": "黑龙江",
  "city": "哈尔滨",
  "district": "南岗区",
  "detail": "黑科技大学主校区3号楼",
  "isDefault": true
}
```

#### 3.3 更新地址
```http
PUT /api/user/address/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "consignee": "张三",
  "phone": "13800138000",
  "province": "黑龙江",
  "city": "哈尔滨",
  "district": "南岗区",
  "detail": "黑科技大学主校区3号楼",
  "isDefault": true
}
```

#### 3.4 删除地址
```http
DELETE /api/user/address/{id}
Authorization: Bearer <token>
```

#### 3.5 设置默认地址
```http
PUT /api/user/address/{id}/default
Authorization: Bearer <token>
```

---

## 🛍️ 商品模块 API

### 1. 商品管理

#### 1.1 获取商品列表
```http
GET /api/product/list?page=1&size=10&categoryId=1&keyword=手机&sort=price&order=asc
```

**查询参数**:
- `page`: 页码，默认1
- `size`: 每页数量，默认10
- `categoryId`: 分类ID
- `keyword`: 搜索关键词
- `sort`: 排序字段（price, sales, createTime）
- `order`: 排序方式（asc, desc）

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "productName": "iPhone 13",
        "mainImage": "https://...",
        "price": 5999.00,
        "originalPrice": 6999.00,
        "sales": 1000,
        "stock": 100,
        "categoryId": 1,
        "categoryName": "手机数码",
        "description": "商品描述...",
        "isNew": true,
        "isHot": true
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  }
}
```

#### 1.2 获取商品详情
```http
GET /api/product/detail/{id}
```

#### 1.3 获取商品分类
```http
GET /api/product/category/list
```

#### 1.4 获取推荐商品
```http
GET /api/product/recommend?type=hot&limit=10
```

**查询参数**:
- `type`: 推荐类型（hot热销, new新品, recommend推荐）
- `limit`: 数量限制

### 2. 购物车

#### 2.1 获取购物车列表
```http
GET /api/cart/list
Authorization: Bearer <token>
```

#### 2.2 添加商品到购物车
```http
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "skuId": 1,
  "quantity": 2
}
```

#### 2.3 更新购物车商品数量
```http
PUT /api/cart/update/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### 2.4 删除购物车商品
```http
DELETE /api/cart/delete/{id}
Authorization: Bearer <token>
```

#### 2.5 清空购物车
```http
DELETE /api/cart/clear
Authorization: Bearer <token>
```

---

## 📦 订单模块 API

### 1. 订单管理

#### 1.1 创建订单
```http
POST /api/order/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "addressId": 1,
  "items": [
    {
      "productId": 1,
      "skuId": 1,
      "quantity": 2
    }
  ],
  "remark": "订单备注",
  "couponId": null
}
```

#### 1.2 获取订单列表
```http
GET /api/order/list?page=1&size=10&status=1
Authorization: Bearer <token>
```

**查询参数**:
- `status`: 订单状态
  - 0: 全部
  - 10: 待付款
  - 20: 待发货
  - 30: 待收货
  - 40: 已完成
  - 50: 已取消

#### 1.3 获取订单详情
```http
GET /api/order/detail/{id}
Authorization: Bearer <token>
```

#### 1.4 取消订单
```http
PUT /api/order/cancel/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "不想要了"
}
```

#### 1.5 确认收货
```http
PUT /api/order/confirm/{id}
Authorization: Bearer <token>
```

#### 1.6 删除订单
```http
DELETE /api/order/delete/{id}
Authorization: Bearer <token>
```

### 2. 订单评价

#### 2.1 提交评价
```http
POST /api/order/evaluate
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": 1,
  "items": [
    {
      "productId": 1,
      "rating": 5,
      "content": "商品很好，物流很快！",
      "images": ["https://..."]
    }
  ],
  "isAnonymous": false
}
```

#### 2.2 获取评价列表
```http
GET /api/product/evaluate/list?productId=1&page=1&size=10
```

---

## 💰 支付模块 API

### 1. 支付管理

#### 1.1 创建支付订单
```http
POST /api/payment/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": 1,
  "paymentType": "wechat", // wechat, alipay
  "returnUrl": "https://..."
}
```

#### 1.2 查询支付状态
```http
GET /api/payment/status/{orderId}
Authorization: Bearer <token>
```

#### 1.3 支付回调
```http
POST /api/payment/callback/{type}
Content-Type: application/json

{
  // 支付平台回调参数
}
```

---

## 🏪 二手市场 API

### 1. 二手商品管理

#### 1.1 获取二手商品列表
```http
GET /api/secondhand/list?page=1&size=10&categoryId=1&keyword=手机&condition=1
```

**查询参数**:
- `condition`: 商品成色（0全新, 1九成新, 2八成新, 3七成新, 4六成新及以下）

#### 1.2 获取二手商品详情
```http
GET /api/secondhand/detail/{id}
```

#### 1.3 发布二手商品
```http
POST /api/secondhand/publish
Authorization: Bearer <token>
Content-Type: application/json

{
  "productName": "iPhone 13",
  "categoryId": 1,
  "price": 4500.00,
  "originalPrice": 5999.00,
  "condition": 1,
  "productDesc": "九成新，无划痕...",
  "images": ["https://..."],
  "tradeType": ["face", "express"],
  "tradeLocation": "黑科技大学",
  "tags": "手机,苹果,九成新"
}
```

#### 1.4 更新二手商品
```http
PUT /api/secondhand/update/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "productName": "iPhone 13",
  "price": 4200.00,
  "productDesc": "更新描述...",
  "images": ["https://..."]
}
```

#### 1.5 删除二手商品
```http
DELETE /api/secondhand/delete/{id}
Authorization: Bearer <token>
```

#### 1.6 获取我的发布
```http
GET /api/secondhand/my/list?page=1&size=10&status=1
Authorization: Bearer <token>
```

### 2. 二手商品分类

#### 2.1 获取分类列表
```http
GET /api/secondhand/category/list
```

---

## 🔍 失物招领 API

### 1. 失物招领管理

#### 1.1 获取失物招领列表
```http
GET /api/lostfound/list?page=1&size=10&type=0&status=1
```

**查询参数**:
- `type`: 类型（0寻物, 1招领）
- `status`: 状态（0进行中, 1已解决）

#### 1.2 获取失物招领详情
```http
GET /api/lostfound/detail/{id}
```

#### 1.3 发布失物招领
```http
POST /api/lostfound/publish
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": 0,
  "title": "寻找校园卡",
  "itemName": "校园卡",
  "location": "图书馆",
  "lostTime": "2024-03-28 10:00:00",
  "description": "黑色钱包，内有校园卡和身份证...",
  "images": ["https://..."],
  "contact": "13800138000",
  "reward": 50.00
}
```

#### 1.4 更新失物招领
```http
PUT /api/lostfound/update/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "寻找校园卡（已找到）",
  "status": 1
}
```

#### 1.5 删除失物招领
```http
DELETE /api/lostfound/delete/{id}
Authorization: Bearer <token>
```

#### 1.6 获取我的发布
```http
GET /api/lostfound/my/list?page=1&size=10
Authorization: Bearer <token>
```

---

## 🔔 消息通知 API

### 1. 消息管理

#### 1.1 获取消息列表
```http
GET /api/message/list?page=1&size=10&type=all&read=false
Authorization: Bearer <token>
```

**查询参数**:
- `type`: 消息类型（all全部, system系统, order订单, activity活动, coupon优惠券）
- `read`: 是否已读（true, false）

#### 1.2 获取消息详情
```http
GET /api/message/detail/{id}
Authorization: Bearer <token>
```

#### 1.3 标记消息已读
```http
PUT /api/message/read/{id}
Authorization: Bearer <token>
```

#### 1.4 标记全部已读
```http
PUT /api/message/read-all
Authorization: Bearer <token>
```

#### 1.5 删除消息
```http
DELETE /api/message/delete/{id}
Authorization: Bearer <token>
```

#### 1.6 获取未读消息数量
```http
GET /api/message/unread-count
Authorization: Bearer <token>
```

### 2. 消息设置

#### 2.1 获取消息设置
```http
GET /api/message/settings
Authorization: Bearer <token>
```

#### 2.2 更新消息设置
```http
PUT /api/message/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "enablePush": true,
  "enableSound": true,
  "enableVibration": false,
  "orderNotification": true,
  "activityNotification": true,
  "systemNotification": true
}
```

---

## 🎫 营销模块 API

### 1. 优惠券

#### 1.1 获取优惠券列表
```http
GET /api/coupon/list?page=1&size=10&status=1
Authorization: Bearer <token>
```

**查询参数**:
- `status`: 状态（1未使用, 2已使用, 3已过期）

#### 1.2 领取优惠券
```http
POST /api/coupon/receive/{id}
Authorization: Bearer <token>
```

#### 1.3 获取可用优惠券
```http
GET /api/coupon/available?amount=100
Authorization: Bearer <token>
```

### 2. 积分

#### 2.1 获取积分明细
```http
GET /api/points/list?page=1&size=10
Authorization: Bearer <token>
```

#### 2.2 获取积分规则
```http
GET /api/points/rules
```

### 3. 会员等级

#### 3.1 获取会员等级信息
```http
GET /api/member/level
Authorization: Bearer <token>
```

#### 3.2 获取等级权益
```http
GET /api/member/benefits
Authorization: Bearer <token>
```

---

## 🏫 校园服务 API

### 1. 公告管理

#### 1.1 获取公告列表
```http
GET /api/campus/announcement/list?page=1&size=10&type=notice
```

#### 1.2 获取公告详情
```http
GET /api/campus/announcement/detail/{id}
```

### 2. 课表管理

#### 2.1 获取课表
```http
GET /api/campus/schedule?week=1
Authorization: Bearer <token>
```

#### 2.2 导入课表
```http
POST /api/campus/schedule/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <课表文件>
```

### 3. 空教室查询

#### 3.1 查询空教室
```http
GET /api/campus/empty-classroom?date=2024-03-28&building=1&section=1
```

---

## 📊 数据统计 API

### 1. 用户统计

#### 1.1 获取用户统计
```http
GET /api/stats/user
Authorization: Bearer <token>
```

### 2. 销售统计

#### 2.1 获取销售统计
```http
GET /api/stats/sales?startDate=2024-03-01&endDate=2024-03-28
Authorization: Bearer <token>
```

### 3. 订单统计

#### 3.1 获取订单统计
```http
GET /api/stats/order
Authorization: Bearer <token>
```

---

## 🔧 系统模块 API

### 1. 文件上传

#### 1.1 上传图片
```http
POST /api/upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <图片文件>
```

#### 1.2 上传文件
```http
POST /api/upload/file
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <文件>
```

### 2. 地区数据

#### 2.1 获取省市区数据
```http
GET /api/region/list?parentId=0
```

### 3. 系统配置

#### 3.1 获取系统配置
```http
GET /api/config/system
```

---

## 📱 小程序专用 API

### 1. 微信登录

#### 1.1 小程序登录
```http
POST /api/wechat/mini-program/login
Content-Type: application/json

{
  "code": "wx-login-code",
  "encryptedData": "...",
  "iv": "..."
}
```

### 2. 微信支付

#### 2.1 创建小程序支付
```http
POST /api/payment/wechat/mini-program
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": 1,
  "openId": "user-open-id"
}
```

---

## ⚠️ 错误码说明

| 错误码 | 说明 | 处理方式 |
|--------|------|----------|
| 200 | 成功 | - |
| 400 | 请求参数错误 | 检查请求参数 |
| 401 | 未授权 | 重新登录获取Token |
| 403 | 禁止访问 | 检查权限 |
| 404 | 资源不存在 | 检查资源ID |
| 500 | 服务器错误 | 联系管理员 |
| 1001 | 用户名已存在 | 更换用户名 |
| 1002 | 手机号已注册 | 使用其他手机号 |
| 1003 | 验证码错误 | 重新获取验证码 |
| 1004 | 密码错误 | 检查密码 |
| 1005 | 账号被禁用 | 联系客服 |
| 2001 | 商品库存不足 | 减少购买数量 |
| 2002 | 订单已过期 | 重新下单 |
| 2003 | 优惠券不可用 | 检查优惠券条件 |

---

## 📞 技术支持

- **技术支持邮箱**: support@heikeji.com
- **技术文档**: https://docs.heikeji.com
- **API测试工具**: https://api.heikeji.com/swagger

---

## 📝 更新日志

### v2.0 (2026-03-28)
- ✅ 新增消息中心API
- ✅ 新增搜索功能API
- ✅ 完善二手市场API
- ✅ 完善失物招领API
- ✅ 优化API文档结构
- ✅ 补充错误码说明

### v1.0 (2024-01-01)
- ✅ 基础功能API
- ✅ 用户认证API
- ✅ 商品订单API
- ✅ 支付功能API

---

**文档维护**: 黑科易购技术团队  
**最后更新**: 2026-03-28
