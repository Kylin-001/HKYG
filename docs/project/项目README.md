# 黑科易购项目

## 1. 项目概述

黑科易购是一个面向校园的综合电商平台，为大学生提供商品购买、外卖订购、跑腿代办等一站式服务。平台支持PC管理后台、应用APP和微信小程序三种终端，采用微服务架构设计，具备高可用性、可扩展性和安全性。

### 1.1 核心功能

- **用户中心**：微信一键登录、个人信息管理、地址管理、会员等级
- **商品商城**：商品浏览、搜索、分类、购物车、订单管理
- **外卖服务**：商家列表、菜单浏览、外卖下单、订单跟踪
- **跑腿服务**：发布跑腿、配送员接单、订单跟踪、费用结算
- **支付中心**：微信支付、余额管理、账单查询
- **营销活动**：优惠券、促销活动、积分商城
- **校园服务**：校园信息、公告通知、站点管理

## 2. 技术栈

### 2.1 后端技术栈

- **基础框架**：Spring Boot 2.7.14，计划升级至Spring Boot 3.2.x
- **微服务架构**：Spring Cloud 2021，计划升级至Spring Cloud 2023.x
- **持久层框架**：MyBatis Plus 3.5.5
- **数据库**：MySQL 8.0+，Redis 5.0+
- **服务注册与发现**：Nacos 2.0+
- **安全框架**：Spring Security + JWT
- **API文档**：Swagger/OpenAPI

### 2.2 前端技术栈

- **管理后台**：Vue 2.7.16，计划升级至Vue 3.5.x
- **状态管理**：Vuex 3.6.2，计划升级至Pinia
- **UI框架**：Element UI 2.15.14，计划升级至Element Plus
- **构建工具**：Webpack，计划升级至Vite
- **手机应用APP**：移动端应用开发
- **小程序**：微信小程序原生开发

## 3. 项目结构

```
heikeji-mall/
├── heikeji-common/              # 通用模块
│   ├── common-core/            # 核心工具类、常量、异常定义
│   ├── common-db/              # 数据库相关公共组件
│   └── common-security/        # 安全相关，JWT工具类
├── heikeji-gateway/            # API网关模块
├── heikeji-system/             # 系统模块（用户、角色、权限管理）
├── heikeji-auth/               # 认证授权模块
├── heikeji-mall-api/           # API接口模块，定义对外接口和DTO
├── heikeji-mall-service/       # 核心业务服务模块
│   ├── service-user/           # 用户服务
│   ├── service-product/        # 商品服务
│   ├── service-order/          # 订单服务
│   ├── service-delivery/       # 跑腿/配送服务
│   ├── service-takeout/        # 外卖服务
│   ├── service-payment/        # 支付服务（微信支付）
│   └── service-campus/         # 校园信息服务
├── heikeji-mall-job/           # 定时任务模块
├── heikeji-admin/              # 后台管理端API
├── heikeji-app/                # 手机应用APP端API
├── heikeji-miniprogram/        # 微信小程序
├── heikeji-frontend/           # 前端模块（管理后台）
├── sql/                        # 数据库初始化脚本
└── docs/                       # 项目文档
```

## 4. 快速开始

### 4.1 环境准备

- JDK 1.8+（推荐17+）
- Maven 3.6+
- MySQL 8.0+
- Redis 5.0+
- Node.js 16+
- Nacos 2.0+

### 4.2 后端部署

1. **数据库初始化**
   - 创建数据库 `heikeji_mall`
   - 执行 `sql/schema.sql` 脚本创建表结构
   - 执行 `sql/init_data.sql` 脚本初始化基础数据

2. **修改配置文件**
   - 进入各模块的 `src/main/resources` 目录
   - 修改 `application-dev.yml` 文件中的数据库连接信息
   - 修改 Redis、Nacos 等配置信息

3. **编译打包**
   ```bash
   cd heikeji-mall
   mvn clean package -DskipTests
   ```

4. **启动服务**
   - 首先启动 Nacos 服务
   - 然后按照以下顺序启动各模块：
     ```bash
     # 启动网关
     java -jar heikeji-gateway/target/heikeji-gateway-1.0.0.jar
     
     # 启动认证服务
     java -jar heikeji-auth/target/heikeji-auth-1.0.0.jar
     
     # 启动系统服务
     java -jar heikeji-system/target/heikeji-system-1.0.0.jar
     
     # 启动业务服务（可并行启动）
     java -jar heikeji-mall-service/service-user/target/service-user-1.0.0.jar
     java -jar heikeji-mall-service/service-product/target/service-product-1.0.0.jar
     # ... 其他服务
     
     # 启动管理端API
     java -jar heikeji-admin/target/heikeji-admin-1.0.0.jar
     
     # 启动应用APP端API
     java -jar heikeji-app/target/heikeji-app-1.0.0.jar
     ```

### 4.3 前端部署

1. **安装依赖**
   ```bash
   cd heikeji-frontend
   npm install
   ```

2. **修改配置**
   - 修改 `.env.development` 文件中的API基础URL

3. **开发环境启动**
   ```bash
   npm run dev
   ```

4. **生产环境构建**
   ```bash
   npm run build
   ```
   构建完成后，将 `dist` 目录部署到Web服务器即可。

## 5. API文档

系统集成了Swagger/OpenAPI进行API文档管理，启动服务后，可以通过以下地址访问API文档：

- 管理端API文档：`http://localhost:8001/doc.html`
- 应用APP API文档：`http://localhost:8002/doc.html`

## 6. 系统功能

### 6.1 管理后台功能

- **用户管理**：用户列表、用户详情、用户状态管理
- **商品管理**：商品分类、商品列表、商品上架/下架
- **订单管理**：订单列表、订单详情、订单状态处理
- **商家管理**：商家入驻、商家信息管理
- **配送管理**：配送员管理、配送订单管理
- **财务管理**：收入统计、提现管理
- **营销管理**：优惠券管理、活动管理
- **系统管理**：管理员管理、角色权限管理、系统日志

### 6.2 应用APP和小程序功能

#### 应用APP功能

- **首页**：轮播图、快捷入口、推荐商品
- **分类**：商品分类浏览
- **购物车**：商品添加、数量修改、结算
- **订单**：订单列表、订单详情、订单取消、确认收货
- **个人中心**：个人信息、地址管理、我的收藏、优惠券
- **跑腿服务**：发布跑腿、查看跑腿订单
- **外卖服务**：商家列表、菜单浏览、外卖下单

#### 小程序功能
- **首页**：轮播图、快捷入口、推荐商品
- **分类**：商品分类浏览
- **购物车**：商品添加、数量修改、结算
- **订单**：订单列表、订单详情、订单取消、确认收货
- **个人中心**：个人信息、地址管理、我的收藏、优惠券

## 7. 开发指南

### 7.1 新功能开发流程

1. 创建功能分支：`feature/功能名称`
2. 实现功能代码，编写单元测试
3. 提交代码，创建合并请求
4. 代码审查通过后，合并到develop分支

### 7.2 代码规范

请参考 `docs/开发规范文档.md` 文件。

## 8. 常见问题

### 8.1 启动问题

- **服务无法启动**：检查端口是否被占用，配置文件是否正确
- **数据库连接失败**：检查数据库地址、用户名、密码是否正确
- **Nacos连接失败**：检查Nacos服务是否启动，地址是否正确

### 8.2 功能问题

- **登录失败**：检查账号密码是否正确，用户状态是否正常
- **权限不足**：检查用户角色权限配置
- **数据异常**：检查业务逻辑，查看系统日志

## 9. 联系方式

如有问题或建议，请联系项目管理员。

## 10. 版权信息

本项目为黑科易购校园电商平台所有，未经授权，不得商用。