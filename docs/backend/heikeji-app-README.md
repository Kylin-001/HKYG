# 黑科易购APP API服务

## 项目简介

本模块是黑科易购商城的APP端API服务，为移动端应用提供数据接口支持。

## 功能特性

- 用户认证（登录、注册、验证码）
- 产品浏览与搜索
- 购物车管理
- 版本更新检查
- JWT认证与安全控制

## 技术栈

- Spring Boot 2.7.x
- Spring Security
- JWT
- MyBatis-Plus
- Redis
- RabbitMQ
- Swagger2

## 目录结构

```
heikeji-app/
├── src/
│   └── main/
│       ├── java/com/heikeji/app/
│       │   ├── AppApplication.java       # 应用入口
│       │   ├── config/                   # 配置类
│       │   │   ├── JwtConfig.java
│       │   │   ├── AppVersionConfig.java
│       │   │   └── SecurityConfig.java
│       │   ├── controller/               # 控制器
│       │   │   ├── AuthController.java
│       │   │   ├── ProductController.java
│       │   │   ├── VersionController.java
│       │   │   └── CartController.java
│       │   ├── filter/                   # 过滤器
│       │   │   └── JwtAuthenticationFilter.java
│       │   ├── model/                    # 数据模型
│       │   │   ├── dto/                  # 数据传输对象
│       │   │   └── response/             # 响应模型
│       │   └── service/                  # 服务层
│       │       └── impl/                 # 服务实现
│       └── resources/
│           ├── application.yml           # 主配置文件
│           └── application-dev.yml       # 开发环境配置
├── pom.xml                               # Maven配置
├── build_app.bat                         # 构建脚本
└── start_app.bat                         # 启动脚本
```

## 快速开始

### 环境要求

- JDK 1.8+
- Maven 3.6+
- MySQL 5.7+
- Redis 5.0+
- RabbitMQ 3.8+

### 构建与运行

1. 构建项目：
   ```
   double click build_app.bat
   ```

2. 启动服务：
   ```
   double click start_app.bat
   ```

3. 访问API文档：
   ```
   http://localhost:8082/api/app/swagger-ui.html
   ```

## API接口说明

### 认证模块
- POST /api/app/auth/login - 用户登录
- POST /api/app/auth/register - 用户注册
- POST /api/app/auth/sendCode - 发送验证码
- POST /api/app/auth/refreshToken - 刷新Token

### 产品模块
- GET /api/app/product/list - 获取产品列表
- GET /api/app/product/detail/{productId} - 获取产品详情
- GET /api/app/product/recommend - 获取推荐产品
- GET /api/app/product/hot - 获取热销产品

### 购物车模块
- GET /api/app/cart/list - 获取购物车列表
- POST /api/app/cart/add - 添加商品到购物车
- PUT /api/app/cart/update - 更新购物车商品数量
- DELETE /api/app/cart/delete - 删除购物车商品
- DELETE /api/app/cart/clear - 清空购物车
- DELETE /api/app/cart/batchDelete - 批量删除购物车商品

### 版本模块
- GET /api/app/version/check - 检查版本更新

## 配置说明

主要配置文件：application.yml

核心配置项：
- server.port: 服务端口（默认8082）
- spring.datasource: 数据库配置
- spring.redis: Redis配置
- spring.rabbitmq: 消息队列配置
- app.jwt: JWT配置
- app.version: APP版本配置

## 安全说明

- 使用JWT进行身份验证
- 密码加密存储
- 接口访问权限控制
- 请求参数验证

## 注意事项

1. 启动前确保数据库、Redis和RabbitMQ服务正常运行
2. 修改配置文件中的数据库连接信息和其他服务地址
3. 生产环境中需修改JWT密钥和其他敏感配置
4. 服务默认在8082端口运行

## 维护指南

- 代码遵循Spring Boot最佳实践
- 新增功能需添加相应的单元测试
- 接口变更需更新Swagger文档
- 定期更新依赖版本
