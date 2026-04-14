# 支付模块API文档和使用指南

## 1. 概述

支付模块是黑科易购项目的核心组件之一，提供了统一的支付接口和多种支付方式的支持。本文档详细介绍了支付模块的API接口、使用方法和集成步骤。

## 2. 模块结构

```
service-payment/
├── src/main/java/com/heikeji/mall/payment/
│   ├── controller/          # 控制器层
│   ├── service/             # 服务层接口
│   ├── service/impl/        # 服务层实现
│   ├── entity/              # 实体类
│   ├── mapper/              # Mapper接口
│   ├── config/              # 配置类
│   ├── strategy/            # 支付策略模式
│   ├── message/             # 消息队列相关
│   ├── util/                # 工具类
│   └── vo/                  # 数据传输对象
└── resources/               # 配置文件
```

## 3. 核心API接口

### 3.1 创建支付订单

**接口路径**: `/payment/create`
**请求方式**: POST
**请求参数**:
```json
{
  "orderNo": "20231025123456789",  // 订单号
  "orderName": "黑科易购订单",       // 订单名称
  "amount": 100.00,                // 订单金额(元)
  "paymentType": 1,                // 支付类型：1-微信支付
  "userId": 123456,                // 用户ID
  "productId": 7890,               // 商品ID
  "callbackUrl": "http://example.com/callback" // 回调URL
}
```

**响应参数**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "paymentId": "PAY20231025123456789",  // 支付订单ID
    "status": 1,                         // 支付状态：1-待支付
    "createdAt": "2023-10-25 10:30:00"   // 创建时间
  }
}
```

### 3.2 生成微信支付参数

**接口路径**: `/payment/wechat/generate-params`
**请求方式**: POST
**请求参数**:
```json
{
  "paymentId": "PAY20231025123456789",  // 支付订单ID
  "tradeType": "JSAPI",               // 交易类型：JSAPI/NATIVE/APP
  "openid": "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o"  // 用户openid(JSAPI交易类型必填)
}
```

**响应参数**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "appId": "wx2421b1c4370ec43b",
    "timeStamp": "1414561699",
    "nonceStr": "e61463f8efa94090b1f366cccfbbb444",
    "package": "prepay_id=u802345jgfjsdfgsdg888",
    "signType": "MD5",
    "paySign": "70EA570631E4BB79628FBCA90534C63FF7FADD89"
  }
}
```

### 3.3 查询支付状态

**接口路径**: `/payment/status/{paymentId}`
**请求方式**: GET
**路径参数**:
- paymentId: 支付订单ID

**响应参数**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "paymentId": "PAY20231025123456789",
    "status": 2,                         // 支付状态：1-待支付，2-已支付，3-已退款，4-已关闭
    "amount": 100.00,
    "paidAt": "2023-10-25 10:35:00",     // 支付时间
    "transactionId": "4009450740201411110007820472"  // 支付平台交易ID
  }
}
```

### 3.4 申请退款

**接口路径**: `/payment/refund`
**请求方式**: POST
**请求参数**:
```json
{
  "paymentId": "PAY20231025123456789",  // 支付订单ID
  "refundAmount": 100.00,               // 退款金额(元)
  "refundReason": "用户申请退款"          // 退款原因
}
```

**响应参数**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "refundId": "REFUND20231025123456789",  // 退款ID
    "status": 1,                            // 退款状态：1-退款中，2-退款成功，3-退款失败
    "refundAmount": 100.00
  }
}
```

### 3.5 关闭支付订单

**接口路径**: `/payment/close/{paymentId}`
**请求方式**: POST
**路径参数**:
- paymentId: 支付订单ID

**响应参数**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "paymentId": "PAY20231025123456789",
    "status": 4  // 支付状态：4-已关闭
  }
}
```

## 4. 支付状态说明

| 状态码 | 状态名称 | 说明 |
|--------|----------|------|
| 1      | 待支付   | 用户尚未完成支付 |
| 2      | 已支付   | 用户已完成支付 |
| 3      | 已退款   | 订单已退款 |
| 4      | 已关闭   | 订单已关闭，无法再支付 |

## 5. 集成步骤

### 5.1 依赖配置

在需要使用支付模块的服务中添加以下依赖：

```xml
<dependency>
  <groupId>com.heikeji.mall</groupId>
  <artifactId>service-payment</artifactId>
  <version>1.0.0</version>
</dependency>
```

### 5.2 配置文件

在application.yml中添加支付模块的配置：

```yaml
payment:
  wechat:
    app-id: wx2421b1c4370ec43b
    mch-id: 10000100
    mch-key: 8934e7d15453e97507ef794cf7b0519d
    notify-url: http://example.com/payment/wechat/notify
  refund:
    notify-url: http://example.com/payment/refund/notify
```

### 5.3 调用示例

#### 5.3.1 创建支付订单

```java
// 导入必要的类
import com.heikeji.mall.payment.entity.Payment;
import com.heikeji.mall.payment.service.PaymentService;

// 注入支付服务
@Autowired
private PaymentService paymentService;

// 创建支付订单请求对象
Payment payment = new Payment();
payment.setOrderNo("20231025123456789");
payment.setOrderName("黑科易购订单");
payment.setAmount(new BigDecimal("100.00"));
payment.setPaymentType(1); // 微信支付
payment.setUserId(123456L);
payment.setProductId(7890L);
payment.setCallbackUrl("http://example.com/callback");

// 调用创建支付订单接口
Payment result = paymentService.createPayment(payment);
System.out.println("支付订单ID: " + result.getId());
```

#### 5.3.2 生成微信支付参数

```java
// 导入必要的类
import com.heikeji.mall.payment.vo.WechatPayParamsVO;
import com.heikeji.mall.payment.service.PaymentService;

// 注入支付服务
@Autowired
private PaymentService paymentService;

// 调用生成微信支付参数接口
WechatPayParamsVO params = paymentService.generateWechatPayParams(
    "PAY20231025123456789", // 支付订单ID
    "JSAPI",                 // 交易类型
    "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o" // 用户openid
);

// 返回给前端用于调起微信支付
return params;
```

## 6. 支付流程

### 6.1 正常支付流程

1. 用户在前端确认订单并选择支付方式
2. 前端调用后端创建支付订单接口
3. 后端调用支付服务创建支付订单，并返回支付订单ID
4. 前端使用支付订单ID调用生成支付参数接口
5. 后端根据支付方式生成对应的支付参数并返回
6. 前端使用返回的支付参数调起支付客户端（如微信支付）
7. 用户完成支付
8. 支付平台回调后端的支付通知接口
9. 后端处理支付结果，更新订单状态并发送支付成功消息
10. 前端轮询或通过WebSocket获取支付结果

### 6.2 退款流程

1. 用户申请退款
2. 前端调用后端退款接口
3. 后端调用支付服务申请退款
4. 支付服务验证支付状态并生成退款单号
5. 调用支付平台退款接口
6. 更新退款信息和支付状态
7. 支付平台回调后端的退款通知接口
8. 后端处理退款结果，更新订单状态并发送退款成功消息

## 7. 安全注意事项

1. 所有支付请求必须进行签名验证，防止请求被篡改
2. 支付回调接口必须进行严格的签名验证
3. 敏感信息（如支付密钥）必须加密存储
4. 支付日志必须记录详细的请求和响应信息，便于问题排查
5. 定期更换支付密钥，提高系统安全性

## 8. 常见问题

### 8.1 支付订单创建失败

**可能原因**:
- 订单号重复
- 金额格式错误
- 支付方式不支持

**解决方案**:
- 检查订单号是否已存在
- 确保金额为正数且格式正确
- 确认选择的支付方式是否已配置

### 8.2 支付回调处理失败

**可能原因**:
- 签名验证失败
- 订单状态不一致
- 网络异常

**解决方案**:
- 检查签名算法和密钥是否正确
- 确保订单状态的幂等性处理
- 实现重试机制，确保回调消息被正确处理

### 8.3 退款失败

**可能原因**:
- 支付状态不正确
- 退款金额超过支付金额
- 支付平台退款限制

**解决方案**:
- 确认订单已支付且未退款
- 确保退款金额不超过支付金额
- 检查支付平台的退款规则和限制

## 9. 联系信息

如有任何问题或建议，请联系支付模块的开发团队：

- 团队负责人：张三
- 联系邮箱：zhangsan@heikeji.com
- 联系电话：13800138000

## 10. 更新记录

| 日期 | 版本 | 更新内容 | 作者 |
|------|------|----------|------|
| 2023-10-25 | 1.0.0 | 初始版本 | 张三 |
| 2023-11-01 | 1.1.0 | 增加退款功能 | 李四 |
| 2023-11-15 | 1.2.0 | 优化支付回调处理 | 王五 |