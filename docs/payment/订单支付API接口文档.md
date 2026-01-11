# 订单支付API接口文档

## 1. 概述

本文档详细描述黑科易购项目中订单和支付相关的API接口，包括接口URL、请求方法、请求参数、响应格式和示例等信息，供前后端开发人员参考使用。

## 2. 基础信息

- API基础路径：`/api`
- 认证方式：JWT Token（在请求头中添加 `Authorization: Bearer {token}`）
- 响应格式：JSON
- 成功响应码：`200`

## 3. 订单相关接口

### 3.1 创建普通订单

**URL**: `/order/create`
**方法**: `POST`
**功能**: 创建普通商品订单

**请求参数**:
```json
{
  "userId": 1,
  "orderType": 1,         // 1: 普通订单, 2: 外卖订单, 3: 跑腿订单
  "receiverName": "张三",
  "receiverPhone": "13800138000",
  "receiverAddress": "北京市朝阳区某某路1号",
  "remark": "送货时请轻拿轻放",
  "couponCode": "DISCOUNT10",  // 优惠券码
  "orderItems": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 59.99
    }
  ]
}
```

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": "ORD20231201123456",
    "userId": 1,
    "orderType": 1,
    "orderStatus": 10,         // 10: 待付款
    "payStatus": 0,            // 0: 未支付
    "totalAmount": 109.98,     // 订单总金额
    "createTime": "2023-12-01T12:34:56",
    "expireTime": "2023-12-01T13:04:56" // 支付过期时间
  }
}
```

### 3.2 创建外卖订单

**URL**: `/order/takeout/create`
**方法**: `POST`
**功能**: 创建外卖订单

**请求参数**:
```json
{
  "userId": 1,
  "shopId": 101,
  "receiverName": "李四",
  "receiverPhone": "13900139000",
  "receiverAddress": "北京市海淀区某某路2号",
  "deliveryType": 1,         // 1: 商家配送, 2: 平台配送
  "remark": "不要辣",
  "orderItems": [
    {
      "productId": 201,
      "quantity": 1,
      "price": 39.99
    }
  ]
}
```

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": "TAK20231201123456",
    "userId": 1,
    "orderType": 2,
    "orderStatus": 10,
    "payStatus": 0,
    "totalAmount": 44.99,      // 商品金额+配送费
    "productAmount": 39.99,
    "deliveryFee": 5.00,
    "createTime": "2023-12-01T12:34:56",
    "expireTime": "2023-12-01T13:04:56"
  }
}
```

### 3.3 订单支付

**URL**: `/order/pay/{orderId}`
**方法**: `POST`
**功能**: 发起订单支付

**请求参数**:
```json
{
  "paymentMethod": 1    // 1: 微信支付, 2: 支付宝, 3: 余额支付
}
```

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "paymentId": "PAY20231201123456",
    "orderId": "ORD20231201123456",
    "amount": 109.98,
    "paymentMethod": 1,
    "paymentUrl": "weixin://wxpay/bizpayurl?pr=xxx", // 微信支付链接
    "qrCode": "base64编码的二维码图片" // 可选，扫码支付二维码
  }
}
```

### 3.4 支付回调

**URL**: `/order/pay/callback`
**方法**: `POST`
**功能**: 处理支付平台的回调通知

**请求参数**:
```
orderId=ORD20231201123456&payStatus=1&transactionId=TXN123456789&payTime=2023-12-01T12:40:00&sign=xxx
```

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": "ORD20231201123456",
    "status": "success",
    "orderStatus": 20  // 20: 已支付
  }
}
```

### 3.5 查询订单详情

**URL**: `/order/detail/{orderId}`
**方法**: `GET`
**功能**: 根据订单ID查询订单详情

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": "ORD20231201123456",
    "userId": 1,
    "orderType": 1,
    "orderStatus": 20,
    "payStatus": 1,
    "totalAmount": 109.98,
    "transactionId": "TXN123456789",
    "payTime": "2023-12-01T12:40:00",
    "createTime": "2023-12-01T12:34:56",
    "receiverName": "张三",
    "receiverPhone": "138****8000",
    "receiverAddress": "北京市朝阳区某某路1号",
    "orderItems": [
      {
        "itemId": 1,
        "productId": 1,
        "productName": "商品名称",
        "quantity": 2,
        "price": 59.99,
        "totalPrice": 119.98
      }
    ]
  }
}
```

### 3.6 取消订单

**URL**: `/order/cancel/{orderId}`
**方法**: `PUT`
**功能**: 取消订单

**请求参数**:
```json
{
  "reason": "用户不想购买了",
  "userId": 1
}
```

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": "ORD20231201123456",
    "orderStatus": 70,  // 70: 已取消
    "cancelTime": "2023-12-01T12:45:00"
  }
}
```

### 3.7 确认收货

**URL**: `/order/confirm/{orderId}`
**方法**: `PUT`
**功能**: 确认收货

**请求参数**:
```json
{
  "userId": 1
}
```

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": "ORD20231201123456",
    "orderStatus": 60,  // 60: 已完成
    "confirmTime": "2023-12-03T15:30:00"
  }
}
```

### 3.8 查询订单列表

**URL**: `/order/list`
**方法**: `GET`
**功能**: 查询订单列表

**请求参数**:
- `userId`: 用户ID（可选）
- `orderType`: 订单类型（可选）
- `orderStatus`: 订单状态（可选）
- `pageNum`: 页码，默认1
- `pageSize`: 每页数量，默认10
- `startTime`: 开始时间（可选）
- `endTime`: 结束时间（可选）

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "orderId": "ORD20231201123456",
        "orderType": 1,
        "orderStatus": 20,
        "totalAmount": 109.98,
        "createTime": "2023-12-01T12:34:56",
        "payTime": "2023-12-01T12:40:00"
      }
    ],
    "total": 1,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

## 4. 支付相关接口

### 4.1 获取支付方式列表

**URL**: `/payment/methods`
**方法**: `GET`
**功能**: 获取系统支持的支付方式列表

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "微信支付",
      "code": "wechat",
      "icon": "https://example.com/wechat.png",
      "enabled": true
    },
    {
      "id": 2,
      "name": "支付宝",
      "code": "alipay",
      "icon": "https://example.com/alipay.png",
      "enabled": true
    },
    {
      "id": 3,
      "name": "余额支付",
      "code": "balance",
      "icon": "https://example.com/balance.png",
      "enabled": true
    }
  ]
}
```

### 4.2 微信支付

**URL**: `/payment/wechat/create/{orderId}`
**方法**: `POST`
**功能**: 生成微信支付参数

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "appId": "wx1234567890123456",
    "timeStamp": "1638345678",
    "nonceStr": "abcdefghijklmnopqrstuvwxyz",
    "package": "prepay_id=wx1234567890123456",
    "signType": "MD5",
    "paySign": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "qrCode": "base64编码的二维码图片" // 扫码支付二维码
  }
}
```

### 4.3 支付宝支付

**URL**: `/payment/alipay/create/{orderId}`
**方法**: `POST`
**功能**: 生成支付宝支付参数

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "formData": "app_id=2021000000000000&method=alipay.trade.page.pay&charset=utf-8&...",
    "qrCode": "base64编码的二维码图片",
    "paymentUrl": "https://openapi.alipay.com/gateway.do?app_id=..."
  }
}
```

### 4.4 余额支付

**URL**: `/payment/balance/{orderId}`
**方法**: `POST`
**功能**: 使用余额支付订单

**请求参数**:
```json
{
  "password": "123456" // 支付密码
}
```

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": "ORD20231201123456",
    "paymentId": "PAY20231201123456",
    "amount": 109.98,
    "balance": 990.02,  // 支付后余额
    "transactionId": "BAL123456789"
  }
}
```

### 4.5 查询支付状态

**URL**: `/payment/status/{orderId}`
**方法**: `GET`
**功能**: 查询订单的支付状态

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": "ORD20231201123456",
    "status": "SUCCESS",  // SUCCESS, FAILED, PENDING
    "payStatus": 1,       // 1: 已支付
    "transactionId": "TXN123456789",
    "payTime": "2023-12-01T12:40:00"
  }
}
```

### 4.6 申请退款

**URL**: `/payment/refund/apply/{orderId}`
**方法**: `POST`
**功能**: 申请退款

**请求参数**:
```json
{
  "refundAmount": 109.98,
  "refundReason": "商品质量问题",
  "contactPhone": "13800138000"
}
```

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "refundId": "REF20231201123456",
    "orderId": "ORD20231201123456",
    "refundAmount": 109.98,
    "refundStatus": 10,  // 10: 退款中
    "applyTime": "2023-12-02T10:30:00"
  }
}
```

## 5. 错误码说明

### 5.1 通用错误码

| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| 400 | 请求参数错误 | 检查请求参数格式和必填项 |
| 401 | 未授权或Token过期 | 重新登录获取Token |
| 403 | 权限不足 | 联系管理员获取权限 |
| 404 | 资源不存在 | 检查请求的资源是否存在 |
| 500 | 服务器内部错误 | 联系技术支持 |

### 5.2 订单相关错误码

| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| 1001 | 订单不存在 | 检查订单ID是否正确 |
| 1002 | 订单状态错误 | 当前订单状态不允许执行该操作 |
| 1003 | 库存不足 | 选择其他商品或等待库存补充 |
| 1004 | 优惠券无效 | 检查优惠券是否过期或已使用 |
| 1005 | 订单已超时 | 重新下单 |

### 5.3 支付相关错误码

| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| 2001 | 支付金额不匹配 | 检查订单金额 |
| 2002 | 支付方式不支持 | 选择其他支付方式 |
| 2003 | 余额不足 | 充值或选择其他支付方式 |
| 2004 | 支付密码错误 | 检查支付密码 |
| 2005 | 支付请求失败 | 稍后重试或选择其他支付方式 |
| 2006 | 支付已超时 | 重新发起支付 |

## 6. 接口调用示例

### 6.1 创建订单并支付示例（前端代码）

```javascript
// 导入API
import { createOrderAndPay } from '@/api/order'

// 创建订单并支付
async function submitOrder(orderData) {
  try {
    const response = await createOrderAndPay({
      ...orderData,
      paymentMethod: 1 // 微信支付
    })
    
    if (response.code === 200) {
      const { paymentUrl, qrCode } = response.data
      // 处理支付，如跳转到支付页面或显示二维码
      if (paymentUrl) {
        window.location.href = paymentUrl
      } else if (qrCode) {
        // 显示支付二维码
        showPaymentQrCode(qrCode)
        // 轮询支付结果
        pollPaymentResult(orderData.orderId)
      }
    }
  } catch (error) {
    // 处理错误
    console.error('订单提交失败:', error)
  }
}

// 轮询支付结果
async function pollPaymentResult(orderId) {
  import { getPaymentStatus } from '@/api/payment'
  
  let attempts = 0
  const maxAttempts = 20
  
  const checkPayment = async () => {
    try {
      const response = await getPaymentStatus(orderId)
      if (response.data.status === 'SUCCESS') {
        // 支付成功，更新页面
        this.$message.success('支付成功！')
        this.$router.push(`/order/detail/${orderId}`)
      } else if (attempts < maxAttempts) {
        attempts++
        setTimeout(checkPayment, 3000) // 3秒后再次检查
      } else {
        // 支付超时
        this.$message.warning('支付超时，请检查订单状态')
      }
    } catch (error) {
      console.error('查询支付状态失败:', error)
    }
  }
  
  checkPayment()
}
```

---

文档版本：v1.0
最后更新：2023年12月