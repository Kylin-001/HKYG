# 黑科易购项目API接口文档

## 更新记录

- **2024-05-30**：更新接口文档，适配黑龙江科技大学特色校园服务需求

## 1. API概述

### 1.1 API设计原则

- **RESTful风格**：遵循RESTful设计规范，使用HTTP方法表示操作语义
- **版本化**：API接口采用版本化管理，便于向后兼容和升级
- **统一响应格式**：所有接口返回统一的响应格式，包含状态码、消息和数据
- **安全性**：接口访问需要进行身份认证和权限校验

### 1.2 API版本

- **当前版本**：v1
- **基础路径**：`/api/v1`
- **认证方式**：JWT Token认证

### 1.3 响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

**响应码说明：**
- `200`：请求成功
- `400`：请求参数错误
- `401`：未授权访问
- `403`：权限不足
- `404`：资源不存在
- `500`：服务器内部错误

## 2. 认证模块接口

### 2.1 微信登录

**接口路径**：`/auth/wx/login`
**请求方法**：`POST`
**请求参数**：
```json
{
  "code": "wx_code",
  "userInfo": {
    "nickName": "微信昵称",
    "avatarUrl": "头像URL",
    "gender": 1
  }
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "jwt_token",
    "userInfo": {
      "id": 1,
      "openId": "wx_openid",
      "nickname": "微信昵称",
      "avatar": "头像URL",
      "gender": 1
    }
  }
}
```

### 2.2 用户信息更新

**接口路径**：`/auth/user/update`
**请求方法**：`PUT`
**请求参数**：
```json
{
  "phone": "13800138000",
  "studentId": "20230001",
  "realName": "张三"
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "phone": "13800138000",
    "studentId": "20230001",
    "realName": "张三"
  }
}
```

## 3. 用户模块接口

### 3.1 获取用户信息

**接口路径**：`/user/info`
**请求方法**：`GET`
**认证要求**：需要JWT Token

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "openId": "wx_openid",
    "nickname": "微信昵称",
    "avatar": "头像URL",
    "gender": 1,
    "phone": "13800138000",
    "studentId": "20230001",
    "realName": "张三"
  }
}
```

### 3.2 地址管理

#### 3.2.1 获取地址列表

**接口路径**：`/user/address/list`
**请求方法**：`GET`
**认证要求**：需要JWT Token

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "consigneeName": "张三",
      "consigneePhone": "13800138000",
      "province": "北京市",
      "city": "北京市",
      "district": "海淀区",
      "detailAddress": "清华大学1号楼",
      "isDefault": 1
    }
  ]
}
```

#### 3.2.2 添加地址

**接口路径**：`/user/address/add`
**请求方法**：`POST`
**请求参数**：
```json
{
  "consigneeName": "张三",
  "consigneePhone": "13800138000",
  "province": "北京市",
  "city": "北京市",
  "district": "海淀区",
  "detailAddress": "清华大学1号楼",
  "isDefault": 1
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "添加成功",
  "data": {
    "id": 1
  }
}
```

### 3.3 收藏管理

#### 3.3.1 添加收藏

**接口路径**：`/user/collection/add`
**请求方法**：`POST`
**请求参数**：
```json
{
  "productId": 1
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "收藏成功",
  "data": {}
}
```

#### 3.3.2 获取收藏列表

**接口路径**：`/user/collection/list`
**请求方法**：`GET`
**查询参数**：
- `pageNum`: 页码，默认1
- `pageSize`: 每页数量，默认10

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "productId": 1,
        "productName": "商品名称",
        "mainImage": "商品图片URL",
        "price": 99.99,
        "collectTime": "2023-01-01 12:00:00"
      }
    ],
    "total": 1,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

## 4. 商品模块接口

### 4.1 商品分类

#### 4.1.1 获取分类列表

**接口路径**：`/product/category/list`
**请求方法**：`GET`
**查询参数**：
- `parentId`: 父分类ID，默认为0（获取一级分类）

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "电子数码",
      "parentId": 0,
      "level": 1,
      "icon": "分类图标URL"
    }
  ]
}
```

### 4.2 热词推荐

#### 4.2.1 获取热门搜索词

**接口路径**：`/app/product/hotWords`
**请求方法**：`GET`
**接口描述**：获取系统中的热门搜索词列表，按搜索次数降序排列

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "hotWord": "手机",
      "searchCount": 100,
      "isHomeShow": 1,
      "sort": 1,
      "createTime": "2024-01-01 10:00:00"
    },
    {
      "id": 2,
      "hotWord": "电脑",
      "searchCount": 80,
      "isHomeShow": 1,
      "sort": 2,
      "createTime": "2024-01-01 10:00:00"
    }
  ]
}
```

#### 4.2.2 获取首页展示热词

**接口路径**：`/app/product/homeHotWords`
**请求方法**：`GET`
**接口描述**：获取设置为首页展示的热门搜索词列表，按排序字段排序

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "hotWord": "手机",
      "searchCount": 100,
      "isHomeShow": 1,
      "sort": 1,
      "createTime": "2024-01-01 10:00:00"
    },
    {
      "id": 2,
      "hotWord": "电脑",
      "searchCount": 80,
      "isHomeShow": 1,
      "sort": 2,
      "createTime": "2024-01-01 10:00:00"
    }
  ]
}
```

#### 4.2.3 获取搜索建议

**接口路径**：`/app/product/searchSuggestions`
**请求方法**：`GET`
**查询参数**：
- `keyword`: 搜索关键词

**接口描述**：根据用户输入的关键词，返回相关的搜索建议列表

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    "手机",
    "智能手机",
    "手机壳"
  ]
}
```

## 5. 用户行为分析模块接口

### 5.1 记录用户行为

**接口路径**：`/user/behavior/record`
**请求方法**：`POST`
**请求参数**：
```json
{
  "userId": 1,
  "behaviorType": "browse",
  "behaviorContent": "1"
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "记录成功",
  "data": true
}
```

### 5.2 获取用户统计信息

**接口路径**：`/user/statistics`
**请求方法**：`GET`
**查询参数**：
- `userId`: 用户ID
- `startDate`: 开始时间（格式：yyyy-MM-dd HH:mm:ss）
- `endDate`: 结束时间（格式：yyyy-MM-dd HH:mm:ss）

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": 1,
    "startDate": "2024-01-01 00:00:00",
    "endDate": "2024-01-31 23:59:59",
    "totalBrowsingCount": 100,
    "totalPurchaseCount": 10,
    "totalFavoritesCount": 5,
    "totalCommentsCount": 3,
    "totalOrderAmount": 1000.00
  }
}
```

### 5.3 获取用户行为趋势

**接口路径**：`/user/behavior/trend`
**请求方法**：`GET`
**查询参数**：
- `userId`: 用户ID
- `behaviorType`: 行为类型（可选）
- `days`: 天数

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "date": "2024-01-01",
      "count": 10
    },
    {
      "date": "2024-01-02",
      "count": 15
    }
  ]
}
```

### 5.4 获取用户热门商品

**接口路径**：`/user/behavior/hot-products`
**请求方法**：`GET`
**查询参数**：
- `userId`: 用户ID
- `limit`: 限制数量

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "productId": "1",
      "heat": 100
    },
    {
      "productId": "2",
      "heat": 80
    }
  ]
}
```

### 5.5 获取用户活跃度

**接口路径**：`/user/behavior/activity`
**请求方法**：`GET`
**查询参数**：
- `userId`: 用户ID
- `days`: 天数

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": 85.5
}
```

### 5.6 获取用户偏好

**接口路径**：`/user/behavior/preferences`
**请求方法**：`GET`
**查询参数**：
- `userId`: 用户ID

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "preferredProductIds": ["1", "2", "3"],
    "productInterest": {
      "1": 100,
      "2": 80,
      "3": 60
    },
    "behaviorTypeDistribution": {
      "browse": 100,
      "purchase": 10,
      "favorite": 5
    }
  }
}
```

### 5.7 获取用户流失风险

**接口路径**：`/user/behavior/churn-risk`
**请求方法**：`GET`
**查询参数**：
- `userId`: 用户ID

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "riskLevel": "低",
    "riskScore": 0.3,
    "riskFactors": ["最近30天有购买记录"],
    "lastActiveTime": "2024-01-31 12:00:00",
    "daysSinceLastActive": 0
  }
}
```

### 5.8 获取用户群体行为分析

**接口路径**：`/user/behavior/group-analysis`
**请求方法**：`GET`
**查询参数**：
- `userGroup`: 用户群体
- `behaviorType`: 行为类型（可选）
- `startDate`: 开始时间（格式：yyyy-MM-dd HH:mm:ss）
- `endDate`: 结束时间（格式：yyyy-MM-dd HH:mm:ss）

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userGroup": "学生",
    "behaviorType": "browse",
    "startDate": "2024-01-01 00:00:00",
    "endDate": "2024-01-31 23:59:59",
    "totalBehaviorCount": 1000,
    "uniqueUserCount": 100,
    "avgBehaviorPerUser": 10.0,
    "behaviorTypeDistribution": {
      "browse": 800,
      "purchase": 150,
      "favorite": 50
    },
    "dailyBehaviorTrend": {
      "2024-01-01": 50,
      "2024-01-02": 60
    },
    "totalPurchaseAmount": 15000.00
  }
}
```

### 5.9 预测用户购买意向

**接口路径**：`/user/behavior/purchase-intent`
**请求方法**：`GET`
**查询参数**：
- `userId`: 用户ID

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "intentLevel": "高",
    "confidence": 0.8,
    "factors": {
      "recentBrowseCount": 15,
      "recentFavoriteCount": 8,
      "recentPurchaseCount": 2
    }
  }
}
```

### 4.2 商品列表

#### 4.2.1 获取商品列表

**接口路径**：`/product/list`
**请求方法**：`GET`
**查询参数**：
- `categoryId`: 分类ID
- `keyword`: 搜索关键词
- `pageNum`: 页码，默认1
- `pageSize`: 每页数量，默认10
- `sortBy`: 排序字段（price/sales）
- `order`: 排序方式（asc/desc）

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "商品名称",
        "subtitle": "商品副标题",
        "mainImage": "主图URL",
        "price": 99.99,
        "sales": 100
      }
    ],
    "total": 100,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

### 4.3 商品详情

**接口路径**：`/product/detail/{id}`
**请求方法**：`GET`
**路径参数**：
- `id`: 商品ID

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "商品名称",
    "subtitle": "商品副标题",
    "description": "商品描述",
    "mainImage": "主图URL",
    "imageList": ["图片1URL", "图片2URL"],
    "price": 99.99,
    "stock": 100,
    "sales": 100,
    "skuList": [
      {
        "id": 1,
        "specValues": "红色,XL",
        "price": 99.99,
        "stock": 50
      }
    ]
  }
}
```

### 4.4 搜索建议

**接口路径**：`/product/search/suggest`
**请求方法**：`GET`
**查询参数**：
- `keyword`: 搜索关键词

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": ["手机壳", "手机膜", "充电宝"]
}
```

## 5. 购物车模块接口

### 5.1 添加购物车

**接口路径**：`/cart/add`
**请求方法**：`POST`
**请求参数**：
```json
{
  "productId": 1,
  "skuId": 1,
  "quantity": 1
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "添加成功",
  "data": {}
}
```

### 5.2 获取购物车列表

**接口路径**：`/cart/list`
**请求方法**：`GET`
**认证要求**：需要JWT Token

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "productId": 1,
        "skuId": 1,
        "productName": "商品名称",
        "image": "商品图片URL",
        "specInfo": "红色,XL",
        "price": 99.99,
        "quantity": 1,
        "checked": true
      }
    ],
    "totalPrice": 99.99,
    "checkedCount": 1
  }
}
```

### 5.3 更新购物车

**接口路径**：`/cart/update/{id}`
**请求方法**：`PUT`
**请求参数**：
```json
{
  "quantity": 2,
  "checked": true
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {}
}
```

### 5.4 删除购物车

**接口路径**：`/cart/delete/{ids}`
**请求方法**：`DELETE`
**路径参数**：
- `ids`: 购物车项ID列表，用逗号分隔

**响应数据**：
```json
{
  "code": 200,
  "message": "删除成功",
  "data": {}
}
```

## 6. 订单模块接口

### 6.1 创建订单

**接口路径**：`/order/create`
**请求方法**：`POST`
**请求参数**：
```json
{
  "addressId": 1,
  "cartIds": [1, 2],
  "couponId": 1,
  "remark": "订单备注"
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "orderId": 1,
    "orderSn": "20230101123456",
    "totalAmount": 199.98,
    "actualAmount": 199.98
  }
}
```

### 6.2 获取订单列表

**接口路径**：`/order/list`
**请求方法**：`GET`
**查询参数**：
- `status`: 订单状态
- `pageNum`: 页码，默认1
- `pageSize`: 每页数量，默认10

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "orderSn": "20230101123456",
        "totalAmount": 199.98,
        "actualAmount": 199.98,
        "orderStatus": 0,
        "orderStatusText": "待付款",
        "createTime": "2023-01-01 12:00:00",
        "productList": [
          {
            "name": "商品名称",
            "image": "商品图片URL",
            "quantity": 1,
            "price": 99.99
          }
        ]
      }
    ],
    "total": 10,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

### 6.3 获取订单详情

**接口路径**：`/order/detail/{id}`
**请求方法**：`GET`
**路径参数**：
- `id`: 订单ID

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "orderSn": "20230101123456",
    "totalAmount": 199.98,
    "actualAmount": 199.98,
    "orderStatus": 0,
    "orderStatusText": "待付款",
    "paymentMethod": 1,
    "paymentMethodText": "微信支付",
    "consigneeName": "张三",
    "consigneePhone": "13800138000",
    "shippingAddress": "北京市海淀区清华大学1号楼",
    "remark": "订单备注",
    "createTime": "2023-01-01 12:00:00",
    "orderItems": [
      {
        "productName": "商品名称",
        "image": "商品图片URL",
        "specInfo": "红色,XL",
        "quantity": 1,
        "price": 99.99,
        "totalPrice": 99.99
      }
    ]
  }
}
```

### 6.4 取消订单

**接口路径**：`/order/cancel/{id}`
**请求方法**：`POST`
**路径参数**：
- `id`: 订单ID

**响应数据**：
```json
{
  "code": 200,
  "message": "取消成功",
  "data": {}
}
```

### 6.5 确认收货

**接口路径**：`/order/confirm/{id}`
**请求方法**：`POST`
**路径参数**：
- `id`: 订单ID

**响应数据**：
```json
{
  "code": 200,
  "message": "确认成功",
  "data": {}
}
```

## 7. 支付模块接口

### 7.1 创建支付

**接口路径**：`/payment/create`
**请求方法**：`POST`
**请求参数**：
```json
{
  "orderId": 1,
  "payType": 1
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "timeStamp": "1672531200",
    "nonceStr": "随机字符串",
    "package": "prepay_id=wx123456",
    "signType": "MD5",
    "paySign": "签名值"
  }
}
```

### 7.2 支付回调

**接口路径**：`/payment/wx/callback`
**请求方法**：`POST`
**请求体**：微信支付回调XML数据

**响应数据**：
```xml
<xml>
  <return_code><![CDATA[SUCCESS]]></return_code>
  <return_msg><![CDATA[OK]]></return_msg>
</xml>
```

## 8. 营销模块接口

### 8.1 优惠券列表

**接口路径**：`/coupon/list`
**请求方法**：`GET`
**查询参数**：
- `type`: 类型（1-可领取，2-已领取）
- `pageNum`: 页码，默认1
- `pageSize`: 每页数量，默认10

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "新人满减券",
        "type": 1,
        "value": 10,
        "minAmount": 50,
        "startTime": "2023-01-01 00:00:00",
        "endTime": "2023-12-31 23:59:59"
      }
    ],
    "total": 5,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

### 8.2 领取优惠券

**接口路径**：`/coupon/receive/{id}`
**请求方法**：`POST`
**路径参数**：
- `id`: 优惠券ID

**响应数据**：
```json
{
  "code": 200,
  "message": "领取成功",
  "data": {}
}
```

## 9. 系统管理接口

### 9.1 管理员登录

**接口路径**：`/admin/auth/login`
**请求方法**：`POST`
**请求参数**：
```json
{
  "username": "admin",
  "password": "123456"
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "jwt_token",
    "adminInfo": {
      "id": 1,
      "username": "admin",
      "realName": "管理员",
      "avatar": "头像URL"
    },
    "permissions": ["user:list", "order:create"]
  }
}
```

### 9.2 管理员信息

**接口路径**：`/admin/auth/info`
**请求方法**：`GET`
**认证要求**：需要JWT Token

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "realName": "管理员",
    "avatar": "头像URL",
    "permissions": ["user:list", "order:create"]
  }
}
```

## 10. 外卖服务接口

### 10.1 获取商家列表

**接口路径**：`/delivery/store/list`
**请求方法**：`GET`
**查询参数**：
- `categoryId`: 商家分类ID
- `keyword`: 搜索关键词
- `pageNum`: 页码，默认1
- `pageSize`: 每页数量，默认10
- `sortBy`: 排序字段（sales/rating/distance）
- `order`: 排序方式（asc/desc）

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "食堂一楼",
        "logo": "商家Logo URL",
        "rating": 4.8,
        "sales": 1000,
        "distance": "500m",
        "deliveryTime": "30分钟",
        "minOrderAmount": 15,
        "deliveryFee": 2,
        "activityInfo": "满20减5"
      }
    ],
    "total": 50,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

### 10.2 获取商家详情

**接口路径**：`/delivery/store/detail/{id}`
**请求方法**：`GET`
**路径参数**：
- `id`: 商家ID

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "食堂一楼",
    "logo": "商家Logo URL",
    "banner": "商家Banner URL",
    "rating": 4.8,
    "sales": 1000,
    "distance": "500m",
    "deliveryTime": "30分钟",
    "minOrderAmount": 15,
    "deliveryFee": 2,
    "description": "商家描述",
    "businessHours": "06:00-22:00"
  }
}
```

### 10.3 获取商家菜品列表

**接口路径**：`/delivery/food/list/{storeId}`
**请求方法**：`GET`
**路径参数**：
- `storeId`: 商家ID

**查询参数**：
- `categoryId`: 菜品分类ID，可选

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "categoryId": 1,
      "categoryName": "主食",
      "foods": [
        {
          "id": 1,
          "name": "红烧肉盖饭",
          "image": "菜品图片URL",
          "price": 15,
          "originalPrice": 18,
          "sales": 200,
          "description": "菜品描述",
          "specs": [
            {
              "id": 1,
              "name": "标准",
              "price": 15
            }
          ],
          "addons": [
            {
              "id": 1,
              "name": "加饭",
              "price": 2
            }
          ]
        }
      ]
    }
  ]
}
```

### 10.4 创建外卖订单

**接口路径**：`/delivery/order/create`
**请求方法**：`POST`
**请求参数**：
```json
{
  "storeId": 1,
  "deliveryAddressId": 1,
  "foodItems": [
    {
      "foodId": 1,
      "specId": 1,
      "quantity": 1,
      "addonIds": [1]
    }
  ],
  "remark": "备注信息",
  "deliveryType": 1, // 1-外卖配送，2-自提
  "pickupTime": "2024-05-30 12:00:00" // 自提时间，配送类型为自提时必填
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "orderId": 1,
    "orderSn": "D20240530123456",
    "totalAmount": 25,
    "actualAmount": 20,
    "deliveryFee": 2
  }
}
```

### 10.5 获取外卖订单列表

**接口路径**：`/delivery/order/list`
**请求方法**：`GET`
**查询参数**：
- `status`: 订单状态
- `pageNum`: 页码，默认1
- `pageSize`: 每页数量，默认10

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "orderSn": "D20240530123456",
        "storeName": "食堂一楼",
        "totalAmount": 25,
        "actualAmount": 20,
        "orderStatus": 1,
        "orderStatusText": "待接单",
        "createTime": "2024-05-30 11:30:00",
        "deliveryType": 1,
        "deliveryTypeText": "外卖配送"
      }
    ],
    "total": 10,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

### 10.6 获取外卖订单详情

**接口路径**：`/delivery/order/detail/{id}`
**请求方法**：`GET`
**路径参数**：
- `id`: 订单ID

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "orderSn": "D20240530123456",
    "storeId": 1,
    "storeName": "食堂一楼",
    "totalAmount": 25,
    "actualAmount": 20,
    "deliveryFee": 2,
    "orderStatus": 3,
    "orderStatusText": "配送中",
    "createTime": "2024-05-30 11:30:00",
    "deliveryType": 1,
    "deliveryTypeText": "外卖配送",
    "consigneeName": "张三",
    "consigneePhone": "13800138000",
    "deliveryAddress": "学生公寓1号楼301",
    "remark": "少油少盐",
    "foodItems": [
      {
        "foodName": "红烧肉盖饭",
        "specName": "标准",
        "quantity": 1,
        "price": 15,
        "addons": ["加饭"]
      }
    ],
    "riderInfo": {
      "name": "王师傅",
      "phone": "13900139000",
      "avatar": "骑手头像URL"
    },
    "deliveryProgress": [
      {
        "time": "2024-05-30 11:30:00",
        "status": "订单已创建"
      },
      {
        "time": "2024-05-30 11:32:00",
        "status": "商家已接单"
      },
      {
        "time": "2024-05-30 11:40:00",
        "status": "骑手已取餐"
      },
      {
        "time": "2024-05-30 11:45:00",
        "status": "配送中"
      }
    ]
  }
}
```

## 11. 配送服务接口

### 11.1 获取配送地址列表

**接口路径**：`/delivery/address/list`
**请求方法**：`GET`
**认证要求**：需要JWT Token

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "consigneeName": "张三",
      "consigneePhone": "13800138000",
      "building": "学生公寓1号楼",
      "room": "301",
      "latitude": 45.8038,
      "longitude": 126.5348,
      "isDefault": 1
    }
  ]
}
```

### 11.2 添加配送地址

**接口路径**：`/delivery/address/add`
**请求方法**：`POST`
**请求参数**：
```json
{
  "consigneeName": "张三",
  "consigneePhone": "13800138000",
  "building": "学生公寓1号楼",
  "room": "301",
  "latitude": 45.8038,
  "longitude": 126.5348,
  "isDefault": 1
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "添加成功",
  "data": {
    "id": 1
  }
}
```

### 11.3 获取配送员位置

**接口路径**：`/delivery/rider/location`
**请求方法**：`GET`
**查询参数**：
- `orderId`: 订单ID

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "riderId": 1,
    "name": "王师傅",
    "avatar": "骑手头像URL",
    "latitude": 45.8040,
    "longitude": 126.5350,
    "updateTime": "2024-05-30 11:45:00"
  }
}
```

## 12. 校园服务接口

### 12.1 获取校园地图

**接口路径**：`/campus/map`
**请求方法**：`GET`

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "mapUrl": "校园地图URL",
    "buildings": [
      {
        "id": 1,
        "name": "教学主楼",
        "latitude": 45.8030,
        "longitude": 126.5330,
        "description": "学校主教学楼",
        "type": "teaching"
      },
      {
        "id": 2,
        "name": "学生公寓1号楼",
        "latitude": 45.8040,
        "longitude": 126.5350,
        "description": "学生宿舍",
        "type": "dormitory"
      }
    ]
  }
}
```

### 12.2 获取校园公告

**接口路径**：`/campus/announcement/list`
**请求方法**：`GET`
**查询参数**：
- `pageNum`: 页码，默认1
- `pageSize`: 每页数量，默认10

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "期末考试安排",
        "content": "考试内容...",
        "publishTime": "2024-05-28 10:00:00",
        "publisher": "教务处"
      }
    ],
    "total": 20,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

### 12.3 获取校园活动

**接口路径**：`/campus/activity/list`
**请求方法**：`GET`
**查询参数**：
- `type`: 活动类型
- `pageNum`: 页码，默认1
- `pageSize`: 每页数量，默认10

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "校园招聘会",
        "image": "活动图片URL",
        "description": "招聘会详情",
        "startTime": "2024-06-10 09:00:00",
        "endTime": "2024-06-10 16:00:00",
        "location": "体育馆",
        "organizer": "就业指导中心"
      }
    ],
    "total": 15,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

### 12.4 学业辅助服务

**接口路径**：`/campus/study/assistant`
**请求方法**：`GET`

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "courseSchedule": [
      {
        "day": 1,
        "courses": [
          {
            "id": 1,
            "name": "高等数学",
            "teacher": "李教授",
            "location": "教学主楼A301",
            "startTime": "08:00",
            "endTime": "09:40"
          }
        ]
      }
    ],
    "examSchedule": [
      {
        "id": 1,
        "courseName": "高等数学",
        "examTime": "2024-06-20 09:00-11:00",
        "location": "教学主楼B401"
      }
    ]
  }
}
```

## 13. 社区服务接口

### 13.1 获取社区动态

**接口路径**：`/community/post/list`
**请求方法**：`GET`
**查询参数**：
- `type`: 动态类型（1-求助，2-闲置，3-交友，4-其他）
- `pageNum`: 页码，默认1
- `pageSize`: 每页数量，默认10

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 1,
        "username": "张三",
        "avatar": "用户头像URL",
        "title": "求购二手课本",
        "content": "求购高等数学课本，有意者联系",
        "images": ["图片1URL"],
        "type": 1,
        "typeText": "求助",
        "createTime": "2024-05-30 10:00:00",
        "likeCount": 5,
        "commentCount": 3,
        "isLiked": false
      }
    ],
    "total": 100,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

### 13.2 发布社区动态

**接口路径**：`/community/post/create`
**请求方法**：`POST`
**请求参数**：
```json
{
  "title": "求购二手课本",
  "content": "求购高等数学课本，有意者联系",
  "images": ["图片1URL"],
  "type": 1
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "id": 1
  }
}
```

### 13.3 点赞/取消点赞

**接口路径**：`/community/post/like/{postId}`
**请求方法**：`POST`
**路径参数**：
- `postId`: 动态ID

**响应数据**：
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "isLiked": true,
    "likeCount": 6
  }
}
```

### 13.4 获取评论列表

**接口路径**：`/community/comment/list/{postId}`
**请求方法**：`GET`
**路径参数**：
- `postId`: 动态ID

**查询参数**：
- `pageNum`: 页码，默认1
- `pageSize`: 每页数量，默认10

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 2,
        "username": "李四",
        "avatar": "用户头像URL",
        "content": "我有一本，怎么联系？",
        "createTime": "2024-05-30 10:30:00",
        "likeCount": 2
      }
    ],
    "total": 3,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

## 14. 接口安全规范

### 10.1 认证授权
- 所有用户接口必须使用JWT Token进行身份认证
- 管理员接口使用独立的JWT Token
- 敏感操作需要二次验证

### 10.2 数据安全
- 密码使用BCrypt加密存储
- 敏感信息传输使用HTTPS
- 防止SQL注入、XSS攻击等常见安全问题

### 10.3 接口限流
- 对API接口实施限流策略，防止恶意请求
- 根据接口重要性设置不同的限流阈值

## 11. 接口文档使用说明

### 11.1 开发环境
- 本地开发环境：http://localhost:8080/api/v1
- Swagger文档地址：http://localhost:8080/swagger-ui.html

### 11.2 生产环境
- 生产环境API地址：https://api.heikeji.com/v1

本API接口文档将根据业务需求和接口更新而不断完善。

## 15. 黑龙江科技大学特色服务说明

### 15.1 校园地图导航
- 支持校园内建筑物精确定位
- 提供教学楼、宿舍、食堂等关键位置的导航服务
- 支持外卖配送区域划分

### 15.2 学业辅助功能
- 课程表查询
- 考试安排查询
- 成绩查询入口

### 15.3 校园生活服务
- 校内食堂外卖服务
- 快递代取服务
- 校园公告和活动信息发布

### 15.4 校园社区功能
- 学生互助平台
- 闲置物品交易
- 校园交友板块

## 16. 用户行为分析模块接口

### 16.1 记录页面浏览

**接口路径**：`/user-behavior/page-view`
**请求方法**：`POST`
**请求参数**：
```json
{
  "pagePath": "/product/detail/123",
  "pageTitle": "商品详情页",
  "referrer": "/product/list",
  "stayTime": 120000
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "记录成功",
  "data": null
}
```

### 16.2 记录点击事件

**接口路径**：`/user-behavior/click-event`
**请求方法**：`POST`
**请求参数**：
```json
{
  "eventType": "button_click",
  "elementId": "buy_now_button",
  "elementName": "立即购买",
  "pagePath": "/product/detail/123",
  "pageTitle": "商品详情页",
  "clickPosition": {"x": 100, "y": 200}
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "记录成功",
  "data": null
}
```

### 16.3 记录购买行为

**接口路径**：`/user-behavior/purchase`
**请求方法**：`POST`
**请求参数**：
```json
{
  "orderId": 12345,
  "productId": 123,
  "productName": "商品名称",
  "categoryId": 456,
  "categoryName": "商品分类",
  "price": 99.9,
  "quantity": 1,
  "totalAmount": 99.9
}
```

**响应数据**：
```json
{
  "code": 200,
  "message": "记录成功",
  "data": null
}
```

### 16.4 获取用户行为统计

**接口路径**：`/user-behavior/stats`
**请求方法**：`GET`
**请求参数**：
```
startTime: 2024-05-01 00:00:00
endTime: 2024-05-31 23:59:59
statType: [pageView, clickEvent, purchase]
```

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "pageViewCount": 1000,
    "clickEventCount": 500,
    "purchaseCount": 100,
    "totalAmount": 9990
  }
}
```

### 16.5 获取用户偏好分析

**接口路径**：`/user-behavior/preferences`
**请求方法**：`GET`
**请求参数**：
```
userId: 123
```

**响应数据**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "favoriteCategories": [
      {"categoryId": 456, "categoryName": "电子产品", "viewCount": 50},
      {"categoryId": 789, "categoryName": "服装", "viewCount": 30}
    ],
    "favoriteProducts": [
      {"productId": 123, "productName": "商品名称", "viewCount": 20}
    ],
    "activeTimePeriods": [
      {"hour": 10, "count": 30},
      {"hour": 20, "count": 50}
    ]
  }
}
```