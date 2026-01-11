# 黑科易购校园服务平台 API 文档

## 目录结构

- [用户模块](#用户模块)
- [校园服务模块](#校园服务模块)
- [外卖服务模块](#外卖服务模块)
- [跑腿服务模块](#跑腿服务模块)
- [订单模块](#订单模块)
- [营销管理模块](#营销管理模块)
- [系统管理模块](#系统管理模块)

## 用户模块

### 用户登录

**URL**: `/api/user/login`
**方法**: `POST`
**参数**: 
```json
{
  "username": "string",
  "password": "string",
  "captchaKey": "string",
  "captchaValue": "string"
}
```
**成功响应**: 
```json
{
  "code": 200,
  "data": {
    "token": "string",
    "userInfo": {
      "id": 1,
      "username": "string",
      "nickname": "string",
      "avatar": "string",
      "role": "string"
    }
  },
  "message": "登录成功"
}
```

### 获取用户信息

**URL**: `/api/user/info`
**方法**: `GET`
**请求头**: `Authorization: Bearer {token}`
**成功响应**: 
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "string",
    "nickname": "string",
    "avatar": "string",
    "phone": "string",
    "email": "string",
    "campusId": 1,
    "buildingId": 1,
    "roomNumber": "string"
  },
  "message": "获取成功"
}
```

## 校园服务模块

### 获取校区列表

**URL**: `/api/campus/list`
**方法**: `GET`
**参数**: 
```
page: 页码
limit: 每页数量
name: 校区名称(可选)
status: 状态(可选)
```
**成功响应**: 
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "name": "紫金港校区",
        "address": "浙江省杭州市西湖区余杭塘路866号",
        "status": 1,
        "createTime": "2024-01-01 00:00:00"
      }
    ],
    "total": 10
  },
  "message": "获取成功"
}
```

### 添加校区

**URL**: `/api/campus/add`
**方法**: `POST`
**参数**: 
```json
{
  "name": "string",
  "address": "string",
  "status": 1
}
```
**成功响应**: 
```json
{
  "code": 200,
  "data": null,
  "message": "添加成功"
}
```

## 外卖服务模块

### 获取商户列表

**URL**: `/api/merchant/list`
**方法**: `GET`
**参数**: 
```
page: 页码
limit: 每页数量
name: 商户名称(可选)
campusId: 校区ID(可选)
status: 状态(可选)
category: 分类(可选)
```
**成功响应**: 
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "name": "麦当劳",
        "logo": "string",
        "category": "快餐",
        "rating": 4.5,
        "minOrderAmount": 20,
        "deliveryFee": 5,
        "estimatedTime": "30-45分钟",
        "campusId": 1,
        "status": 1
      }
    ],
    "total": 20
  },
  "message": "获取成功"
}
```

### 获取商品列表

**URL**: `/api/product/list`
**方法**: `GET`
**参数**: 
```
page: 页码
limit: 每页数量
merchantId: 商户ID(必选)
categoryId: 分类ID(可选)
keyword: 关键词搜索(可选)
```
**成功响应**: 
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "name": "巨无霸汉堡",
        "price": 20.5,
        "originalPrice": 25,
        "stock": 100,
        "sales": 200,
        "image": "string",
        "categoryId": 1,
        "merchantId": 1,
        "status": 1
      }
    ],
    "total": 50
  },
  "message": "获取成功"
}
```

## 跑腿服务模块

### 创建跑腿请求

**URL**: `/api/errand/create`
**方法**: `POST`
**参数**: 
```json
{
  "type": "string", // 取快递, 买零食, 买饭, 其他
  "description": "string",
  "pickupLocation": "string",
  "deliveryLocation": "string",
  "expectedTime": "string",
  "reward": 10,
  "campusId": 1
}
```
**成功响应**: 
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "orderNo": "ERR202401010001"
  },
  "message": "创建成功"
}
```

### 获取跑腿请求列表

**URL**: `/api/errand/list`
**方法**: `GET`
**参数**: 
```
page: 页码
limit: 每页数量
status: 状态(可选)
type: 类型(可选)
```
**成功响应**: 
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "orderNo": "ERR202401010001",
        "type": "取快递",
        "description": "string",
        "reward": 10,
        "status": 1, // 待接单
        "createTime": "2024-01-01 10:00:00"
      }
    ],
    "total": 30
  },
  "message": "获取成功"
}
```

## 订单模块

### 创建订单

**URL**: `/api/order/create`
**方法**: `POST`
**参数**: 
```json
{
  "type": "takeout", // takeout: 外卖, errand: 跑腿
  "merchantId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 20.5
    }
  ],
  "deliveryType": 1, // 1: 外卖柜, 2: 送货上门
  "lockerId": 1,
  "buildingId": 1,
  "roomNumber": "302",
  "contactPhone": "13800138000",
  "remark": "不要辣",
  "totalAmount": 46
}
```
**成功响应**: 
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "orderNo": "ORD202401010001",
    "paymentAmount": 46,
    "paymentUrl": "string"
  },
  "message": "创建成功"
}
```

### 获取订单列表

**URL**: `/api/order/list`
**方法**: `GET`
**参数**: 
```
page: 页码
limit: 每页数量
type: 订单类型(可选)
status: 订单状态(可选)
keyword: 订单号或商户名搜索(可选)
```
**成功响应**: 
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "orderNo": "ORD202401010001",
        "type": "takeout",
        "merchantName": "麦当劳",
        "totalAmount": 46,
        "status": 2, // 已支付
        "createTime": "2024-01-01 10:00:00",
        "paymentTime": "2024-01-01 10:05:00"
      }
    ],
    "total": 60
  },
  "message": "获取成功"
}
```

## 营销管理模块

### 创建优惠券

**URL**: `/api/coupon/create`
**方法**: `POST`
**参数**: 
```json
{
  "name": "新用户立减券",
  "type": 1, // 1: 满减券, 2: 折扣券
  "value": 10,
  "minSpend": 30,
  "startTime": "2024-01-01 00:00:00",
  "endTime": "2024-01-31 23:59:59",
  "totalQuantity": 1000,
  "perUserLimit": 1,
  "scope": 1 // 1: 全场通用, 2: 指定商户, 3: 指定品类
}
```
**成功响应**: 
```json
{
  "code": 200,
  "data": {
    "id": 1
  },
  "message": "创建成功"
}
```

### 获取轮播图列表

**URL**: `/api/banner/list`
**方法**: `GET`
**参数**: 
```
page: 页码
limit: 每页数量
position: 位置(可选)
status: 状态(可选)
```
**成功响应**: 
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "title": "新年特惠活动",
        "imageUrl": "string",
        "linkUrl": "string",
        "position": 1,
        "sort": 1,
        "status": 1,
        "startTime": "2024-01-01 00:00:00",
        "endTime": "2024-01-31 23:59:59"
      }
    ],
    "total": 10
  },
  "message": "获取成功"
}
```

## 系统管理模块

### 获取管理员列表

**URL**: `/api/system/user/list`
**方法**: `GET`
**参数**: 
```
page: 页码
limit: 每页数量
username: 用户名(可选)
status: 状态(可选)
```
**成功响应**: 
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "username": "admin",
        "nickname": "系统管理员",
        "roleId": 1,
        "status": 1,
        "createTime": "2024-01-01 00:00:00"
      }
    ],
    "total": 5
  },
  "message": "获取成功"
}
```

### 获取操作日志

**URL**: `/system/log/list`
**方法**: `GET`
**参数**: 
```
page: 页码
limit: 每页数量
username: 操作人(可选)
operation: 操作类型(可选)
startTime: 开始时间(可选)
endTime: 结束时间(可选)
```
**成功响应**: 
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "username": "admin",
        "operation": "用户登录",
        "ip": "192.168.1.1",
        "createTime": "2024-01-01 10:00:00"
      }
    ],
    "total": 100
  },
  "message": "获取成功"
}
```