# 黑科易购项目后端API接口和业务逻辑完善方案

## 1. 当前后端架构分析

### 1.1 技术栈现状
- **Java 17**: 主要开发语言
- **Spring Boot 3.2.1**: 应用开发框架
- **Spring Cloud 2023.0.0**: 微服务框架
- **Spring Cloud Alibaba 2023.0.1.0**: 微服务生态组件
- **MyBatis Plus 3.5.5**: ORM框架
- **MySQL 8.0.33**: 关系型数据库
- **Redis 7.2.x**: 缓存服务
- **Nacos 2.0+**: 服务注册与配置中心
- **SpringDoc**: API文档
- **JWT**: 认证授权

### 1.2 项目架构概览
- **heikeji-admin**: 管理后台服务
- **heikeji-app**: 用户端应用服务
- **heikeji-mall-api**: API接口层
- **heikeji-mall-service**: 业务服务层，包含多个业务模块：
  - service-user: 用户服务
  - service-product: 商品服务
  - service-order: 订单服务
  - service-payment: 支付服务
  - service-delivery: 配送服务
  - service-campus: 校园服务
  - service-takeout: 外卖服务
  - service-member: 会员服务
- **heikeji-common**: 公共组件和工具类
- **heikeji-system**: 系统服务
- **heikeji-mall-job**: 定时任务服务

### 1.3 现有API接口分析

#### 1.3.1 用户端API (heikeji-app)
- 认证相关: 登录、注册、验证码发送
- 产品相关: 产品列表、产品详情、推荐产品、热销产品
- 购物车相关: 购物车操作

#### 1.3.2 管理后台API (heikeji-admin)
- 管理员认证: 登录、认证
- 用户管理: 管理员用户管理

#### 1.3.3 服务调用模式
- 使用Feign进行跨服务调用
- 采用REST API风格
- 统一的响应格式

## 2. API接口规范和标准

### 2.1 接口设计原则
- **RESTful API设计**: 遵循RESTful API设计规范
- **单一职责**: 每个API端点只负责一个功能
- **版本控制**: API接口添加版本号标识
- **一致的命名**: 接口命名、参数命名保持一致
- **合理的HTTP方法使用**: 正确使用GET、POST、PUT、DELETE等方法

### 2.2 API文档规范
- **Swagger/OpenAPI集成**: 所有API接口必须添加Swagger注解
- **完整的接口描述**: 包含接口功能、参数说明、响应格式等
- **示例请求和响应**: 提供接口调用示例
- **错误码说明**: 定义统一的错误码体系

### 2.3 响应格式规范
```json
{
  "code": 0,          // 状态码，0表示成功，非0表示错误
  "message": "success",  // 响应消息
  "data": {},         // 响应数据
  "timestamp": 1623456789012  // 时间戳
}
```

### 2.4 错误处理规范
- 全局异常处理机制
- 业务异常与系统异常区分
- 统一的错误码体系
- 详细的错误日志记录

## 3. 缺失API接口补充

### 3.1 用户服务模块

#### 3.1.1 用户基本信息管理
- GET /api/v1/user/profile - 获取用户个人信息
- PUT /api/v1/user/profile - 更新用户个人信息
- POST /api/v1/user/avatar - 上传用户头像

#### 3.1.2 地址管理
- GET /api/v1/user/addresses - 获取用户地址列表
- GET /api/v1/user/addresses/{id} - 获取单个地址详情
- POST /api/v1/user/addresses - 添加新地址
- PUT /api/v1/user/addresses/{id} - 更新地址信息
- DELETE /api/v1/user/addresses/{id} - 删除地址
- PUT /api/v1/user/addresses/{id}/default - 设置默认地址

#### 3.1.3 账户安全
- PUT /api/v1/user/password - 修改密码
- POST /api/v1/user/bind-phone - 绑定手机号
- POST /api/v1/user/bind-email - 绑定邮箱
- POST /api/v1/user/two-factor/enable - 启用双因素认证
- POST /api/v1/user/two-factor/disable - 禁用双因素认证

### 3.2 商品服务模块

#### 3.2.1 商品搜索
- POST /api/v1/products/search - 高级商品搜索
- GET /api/v1/products/categories - 获取商品分类
- GET /api/v1/products/categories/{id} - 获取分类详情

#### 3.2.2 商品评论
- GET /api/v1/products/{id}/comments - 获取商品评论列表
- POST /api/v1/products/{id}/comments - 添加商品评论
- GET /api/v1/products/{id}/comments/{commentId} - 获取单条评论详情
- DELETE /api/v1/products/{id}/comments/{commentId} - 删除评论

#### 3.2.3 商品收藏
- GET /api/v1/user/collections - 获取用户收藏列表
- POST /api/v1/products/{id}/collect - 收藏商品
- DELETE /api/v1/products/{id}/collect - 取消收藏
- GET /api/v1/products/{id}/collected - 检查是否已收藏

### 3.3 订单服务模块

#### 3.3.1 订单管理
- POST /api/v1/orders - 创建订单
- GET /api/v1/orders - 获取订单列表
- GET /api/v1/orders/{id} - 获取订单详情
- PUT /api/v1/orders/{id}/cancel - 取消订单
- PUT /api/v1/orders/{id}/confirm-receipt - 确认收货
- GET /api/v1/orders/status/count - 获取各状态订单数量

#### 3.3.2 订单商品
- GET /api/v1/orders/{id}/items - 获取订单商品列表

#### 3.3.3 订单支付
- POST /api/v1/orders/{id}/pay - 订单支付
- GET /api/v1/orders/{id}/payment/status - 查询支付状态
- POST /api/v1/orders/{id}/refund - 申请退款
- GET /api/v1/orders/refunds - 获取退款记录

### 3.4 购物车模块

#### 3.4.1 购物车管理
- GET /api/v1/cart - 获取购物车列表
- POST /api/v1/cart - 添加商品到购物车
- PUT /api/v1/cart/{skuId} - 更新购物车商品数量
- DELETE /api/v1/cart/{skuId} - 从购物车移除商品
- DELETE /api/v1/cart/clear - 清空购物车
- GET /api/v1/cart/count - 获取购物车商品数量

### 3.5 营销模块

#### 3.5.1 优惠券
- GET /api/v1/coupons - 获取可用优惠券列表
- GET /api/v1/coupons/{id} - 获取优惠券详情
- POST /api/v1/coupons/{id}/receive - 领取优惠券
- GET /api/v1/user/coupons - 获取用户已领优惠券

#### 3.5.2 积分
- GET /api/v1/user/points - 获取用户积分
- GET /api/v1/user/points/history - 获取积分历史记录
- POST /api/v1/user/points/exchange - 积分兑换

### 3.6 校园服务模块

#### 3.6.1 校园站点
- GET /api/v1/campus/stations - 获取校园站点列表
- GET /api/v1/campus/stations/{id} - 获取站点详情

#### 3.6.2 智能柜
- GET /api/v1/campus/lockers - 获取智能柜列表
- GET /api/v1/campus/lockers/{id} - 获取智能柜详情
- GET /api/v1/campus/lockers/available - 获取可用智能柜

### 3.7 外卖服务模块

#### 3.7.1 商家
- GET /api/v1/takeout/merchants - 获取商家列表
- GET /api/v1/takeout/merchants/{id} - 获取商家详情
- GET /api/v1/takeout/merchants/{id}/menus - 获取商家菜单

#### 3.7.2 外卖订单
- POST /api/v1/takeout/orders - 创建外卖订单
- GET /api/v1/takeout/orders - 获取外卖订单列表
- GET /api/v1/takeout/orders/{id} - 获取外卖订单详情
- PUT /api/v1/takeout/orders/{id}/cancel - 取消外卖订单
- POST /api/v1/takeout/orders/{id}/pay - 支付外卖订单

### 3.8 配送服务模块

#### 3.8.1 配送员
- GET /api/v1/courier/info - 获取配送员信息
- PUT /api/v1/courier/info - 更新配送员信息
- GET /api/v1/courier/orders - 获取配送订单列表
- PUT /api/v1/courier/orders/{id}/status - 更新订单状态
- GET /api/v1/courier/statistics - 获取配送统计数据

#### 3.8.2 跑腿服务
- POST /api/v1/errand/orders - 创建跑腿订单
- GET /api/v1/errand/orders - 获取跑腿订单列表
- GET /api/v1/errand/orders/{id} - 获取跑腿订单详情
- PUT /api/v1/errand/orders/{id}/status - 更新跑腿订单状态

## 4. 业务逻辑优化建议

### 4.1 用户服务优化

#### 4.1.1 认证与授权优化
- 完善JWT Token管理：实现Token刷新机制、黑名单管理
- 增强认证安全性：添加双因素认证、异常登录检测
- 优化权限粒度：基于RBAC模型实现更细粒度的权限控制

#### 4.1.2 用户数据管理
- 实现用户数据脱敏：敏感信息加密存储
- 添加用户行为日志：记录关键操作，便于审计和问题排查
- 优化用户搜索：支持多维度、模糊搜索

### 4.2 商品服务优化

#### 4.2.1 商品管理优化
- 商品库存管理：实现库存锁定、库存预警
- 商品搜索引擎：集成Elasticsearch，提升搜索体验
- 商品推荐算法：基于用户行为和商品关联性实现个性化推荐

#### 4.2.2 商品缓存策略
- 实现多级缓存：本地缓存+Redis分布式缓存
- 缓存预热：系统启动时预加载热点商品数据
- 缓存更新：实现缓存与数据库的一致性保障

### 4.3 订单服务优化

#### 4.3.1 订单流程优化
- 实现分布式事务：确保订单状态一致性
- 订单超时处理：基于定时任务或延时队列处理超时订单
- 订单自动分配：根据配送员位置和负载自动分配订单

#### 4.3.2 订单状态流转
- 完善订单状态机：清晰定义订单状态转换规则
- 状态变更通知：状态变更时发送消息通知相关方
- 异常订单处理：针对异常订单提供特殊处理流程

### 4.4 支付服务优化

#### 4.4.1 支付流程优化
- 支付渠道拓展：支持多种支付方式
- 支付回调处理：完善支付回调逻辑，添加幂等性处理
- 对账机制：实现与支付渠道的自动对账

#### 4.4.2 支付安全
- 支付信息加密：敏感支付信息加密存储
- 支付风险控制：实现风险交易检测
- 支付限额：设置合理的支付限额

### 4.5 营销服务优化

#### 4.5.1 优惠券系统
- 完善优惠券规则：支持多种优惠券类型和使用规则
- 优惠券推荐：基于用户行为推荐适合的优惠券
- 优惠券效果分析：跟踪优惠券使用效果

#### 4.5.2 积分系统
- 积分规则配置：灵活配置积分获取和消耗规则
- 积分过期机制：实现积分自动过期处理
- 积分商城：拓展积分使用场景

### 4.6 消息通知优化

#### 4.6.1 通知系统
- 实现消息队列：解耦消息发送和业务处理
- 支持多渠道通知：短信、邮件、站内信、推送等
- 消息状态跟踪：记录消息发送状态和阅读状态

#### 4.6.2 事件驱动架构
- 基于事件的业务处理：将核心业务事件化
- 事件溯源：记录所有状态变更事件
- 事件总线：实现事件的发布和订阅

## 5. API性能优化

### 5.1 数据库优化
- SQL优化：检查并优化慢查询
- 索引优化：为频繁查询的字段添加合适的索引
- 数据库连接池：配置合理的连接池参数

### 5.2 缓存优化
- 热点数据缓存：将高频访问数据缓存到Redis
- 数据预热：提前加载热点数据到缓存
- 缓存过期策略：合理设置缓存过期时间

### 5.3 异步处理
- 异步任务：将耗时操作异步化
- 消息队列：使用消息队列解耦和削峰
- 异步接口：提供异步接口处理复杂请求

### 5.4 并发优化
- 线程池配置：优化线程池参数
- 分布式锁：解决并发访问问题
- 请求限流：防止接口被恶意调用

## 6. API安全增强

### 6.1 接口安全
- 请求认证：确保所有接口都经过认证
- 参数验证：严格验证输入参数
- 防XSS攻击：过滤用户输入
- 防SQL注入：使用参数化查询

### 6.2 权限控制
- 基于角色的访问控制：实现细粒度的权限管理
- API权限校验：确保用户只能访问有权限的接口
- 敏感操作二次验证：关键操作需要二次确认

### 6.3 数据安全
- 数据加密：敏感数据加密存储
- 数据脱敏：返回给前端的数据进行脱敏处理
- 安全传输：使用HTTPS加密传输

### 6.4 日志与审计
- 操作日志：记录所有关键操作
- 访问日志：记录API访问情况
- 异常日志：详细记录异常信息

## 7. 实施计划

### 7.1 第一阶段：基础架构优化（2-3周）
- 完善API文档规范
- 统一响应格式和错误处理
- 优化异常处理机制
- 实现请求日志记录

### 7.2 第二阶段：核心API补充（4-6周）
- 补充用户模块缺失API
- 补充商品模块缺失API
- 补充订单模块缺失API
- 补充购物车模块缺失API

### 7.3 第三阶段：业务逻辑优化（6-8周）
- 优化认证与授权
- 实现多级缓存策略
- 完善订单流程
- 增强支付安全

### 7.4 第四阶段：性能与安全增强（3-4周）
- 数据库优化
- 并发优化
- 安全加固
- 实施监控与告警

### 7.5 第五阶段：测试与上线（2-3周）
- API自动化测试
- 性能测试
- 安全测试
- 灰度发布

## 8. 风险与挑战

### 8.1 兼容性风险
- 新增API需要考虑与前端的兼容性
- 现有API的修改需要兼容已有调用方

### 8.2 性能挑战
- 高频API的性能优化
- 大数据量查询的性能处理

### 8.3 安全挑战
- 确保API的安全性
- 防止常见的Web安全漏洞

### 8.4 团队协作
- 前后端协作开发
- 跨团队协作与沟通

## 9. 预期收益

### 9.1 功能完善
- 覆盖所有业务场景的API接口
- 丰富的业务功能支持

### 9.2 性能提升
- 响应时间缩短
- 系统吞吐量提升

### 9.3 安全性增强
- 降低安全风险
- 增强数据保护

### 9.4 可维护性提升
- 统一的接口规范
- 完善的文档和日志

---

本方案旨在完善黑科易购项目的后端API接口和业务逻辑，提升系统的功能完整性、性能和安全性。实施过程中需要团队密切配合，按照计划分阶段推进，确保项目质量和进度。