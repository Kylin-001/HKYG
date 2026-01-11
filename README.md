# 黑科易购校园服务平台

> **你的时间很宝贵，跑腿的事交给我们。**

黑科易购校园服务平台是专为黑龙江科技大学学生打造的校园综合性服务平台，整合购物、外卖、跑腿、信息服务等功能，让大三大四学生足不出户即可解决生活、学习所需。

## 项目定位

- **目标用户：** 黑龙江科技大学大三、大四学生
- **核心价值：** 节省时间，提高效率，一站式解决校园生活需求
- **项目Slogan：** 你的时间很宝贵，跑腿的事交给我们

## 技术栈

### 后端
- **框架：** Spring Boot 2.7.14
- **ORM：** MyBatis Plus 3.5.3.1
- **安全框架：** Spring Security + JWT
- **数据库：** MySQL 8.0
- **缓存：** Redis 3.2.0
- **工具类：** Hutool 5.8.20

### 前端
- **小程序：** 微信小程序
- **管理后台：** Vue 3 + Element Plus

## 项目结构

```
heikeji-mall/
├── heikeji-common/              # 通用模块
│   ├── common-core/            # 核心工具类、常量、异常定义
│   └── common-security/        # 安全相关，JWT工具类
├── heikeji-system/             # 系统模块（用户、角色、权限管理）
├── heikeji-mall-api/           # API接口模块，定义对外接口和DTO
├── heikeji-mall-service/       # 核心业务服务模块
│   ├── service-user/           # 用户服务
│   ├── service-product/        # 商品服务
│   ├── service-order/          # 订单服务
│   ├── service-delivery/       # 跑腿/配送服务
│   ├── service-takeout/        # 外卖服务 ⭐
│   ├── service-payment/        # 支付服务（微信支付）
│   └── service-campus/         # 校园信息服务
├── heikeji-mall-job/           # 定时任务模块
├── heikeji-admin/              # 后台管理端API
├── heikeji-app/                # 手机应用APP端API
├── heikeji-miniprogram/        # 微信小程序
├── sql/                        # 数据库初始化脚本
├── docs/                       # 项目文档
│   ├── architecture/           # 架构相关文档
│   ├── development/            # 开发相关文档
│   ├── deployment/             # 部署相关文档
│   ├── operation/              # 运维相关文档
│   ├── test/                   # 测试相关文档
│   ├── module/                 # 模块说明文档
│   ├── api/                    # API接口文档
│   └── project/                # 项目管理文档
└── misc/                       # 杂项文档
    ├── issues/                 # 问题解决方案
    └── temp/                   # 临时文档
```

## 文档结构

### 主要文档目录

| 目录 | 内容说明 |
|------|----------|
| **docs/architecture** | 架构设计、服务拆分、技术方案等 |
| **docs/development** | 开发规范、开发计划、最佳实践、组件开发总结等 |
| **docs/deployment** | 部署文档、环境配置、数据库导入等 |
| **docs/operation** | 运维指南、监控方案、备份恢复等 |
| **docs/test** | 测试用例、质量保障、性能测试等 |
| **docs/module** | 各功能模块详细说明 |
| **docs/api** | API接口文档、接口规范等 |
| **docs/project** | 项目计划、上线准备、总结报告等 |

### 核心文档

- **架构设计**：docs/architecture/架构文档.md
- **开发规范**：docs/development/开发规范文档.md
- **组件开发**：docs/development/VirtualTable-Development-Summary.md
- **部署指南**：docs/deployment/部署文档.md
- **API文档**：docs/api/API接口文档.md
- **数据库设计**：docs/database/数据库设计文档.md
- **支付模块**：docs/payment/支付模块集成开发文档.md
- **前端开发**：docs/frontend/development/开发手册.md
- **小程序开发**：docs/frontend/miniprogram/README.md
- **上线计划**：docs/project/上线准备与演练计划.md

## 核心功能模块

### 1. 用户中心
- 微信一键登录，绑定学号实名认证
- 个人信息管理（昵称、头像、收货地址）
- 我的钱包（余额、充值、消费记录）
- 我的订单统一管理

### 2. 商品商城
- 商品分类浏览（零食饮料、日用百货、文具书籍等）
- 商品搜索与排序
- 购物车与下单
- 商家入驻与管理

### 3. 校园跑腿 ⭐
- **取快递：** 自动填充菜鸟驿站地址，输入取件码即可
- **代购：** 指定商品和购买地点
- **代办：** 交材料、打印文件等
- 悬赏金设置，跑腿员接单

### 4. 外卖服务 ⭐⭐⭐
支持三种配送方式：

#### 方式一：外卖柜配送
- 选择学校指定的外卖柜
- 自动分配格口，支持取餐码

#### 方式二：特殊地点配送
- 外卖员根据实际情况进行配送
- 支持自定义地点（如：寝室楼门口饮料机、指定楼栋等）

#### 方式三：送到寝室
- 直接配送至寝室
- 需要提供楼栋和房间号

### 5. 校园信息服务
- 空教室查询
- 校园公告同步
- 二手市场（集成在商城中）

### 6. 订单与支付
- 统一订单管理（商品、跑腿、外卖）
- 微信支付集成
- 订单状态实时跟踪

### 7. 后台管理系统
- 数据看板
- 用户管理
- 商品与商家管理
- 订单管理
- 内容管理

## 数据库设计

核心表结构已包含在 `sql/schema.sql` 中：

- `user` - 用户表
- `user_auth` - 用户认证表（微信OpenID）
- `address` - 收货地址表
- `merchant` - 商家表
- `category` - 商品分类表
- `product` - 商品表
- `cart` - 购物车表
- `order` - 订单主表
- `order_item` - 订单商品明细表
- `delivery_request` - 跑腿需求表
- `takeout_order` - 外卖订单表 ⭐
- `delivery_locker` - 外卖柜表 ⭐
- `payment` - 支付记录表
- `delivery_person` - 跑腿员表
- `campus_info` - 校园信息表

## 快速开始

### 1. 环境要求
- JDK 1.8+
- Maven 3.6+
- MySQL 8.0+
- Redis 5.0+

### 2. 数据库初始化
```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE heikeji_mall DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 导入表结构
mysql -u root -p heikeji_mall < sql/schema.sql
```

### 3. 配置文件
修改 `heikeji-app/src/main/resources/application.yml` 中的数据库和Redis配置

### 4. 运行项目
```bash
# 编译项目
mvn clean install

# 运行小程序端API
cd heikeji-app
mvn spring-boot:run
```

### 5. 访问接口
- 接口地址：`http://localhost:8080/api`
- 外卖订单创建：`POST /api/app/takeout/order/create`

## 外卖功能说明

外卖服务是项目的核心特色功能之一，支持三种灵活的配送方式：

1. **外卖柜配送** (`delivery_type = 1`)
   - 适用于：学生不在寝室或需要自取的情况
   - 特点：安全、便捷、24小时可取

2. **特殊地点配送** (`delivery_type = 2`)
   - 适用于：需要送到特定位置的情况
   - 特点：灵活、可自定义地点描述

3. **送到寝室** (`delivery_type = 3`)
   - 适用于：学生希望直接送到寝室的情况
   - 特点：最便捷，需要提供楼栋和房间号

## API文档

### 外卖订单API

#### 创建外卖订单
```
POST /api/app/takeout/order/create
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
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

## 开发计划

- [x] 项目结构搭建
- [x] 数据库表设计
- [x] 通用模块开发
- [x] 外卖服务核心功能
- [ ] 用户服务完善
- [ ] 商品服务完善
- [ ] 订单服务完善
- [ ] 支付服务集成
- [ ] 微信小程序前端
- [ ] 管理后台前端

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

MIT License

## 联系方式

- 项目地址：[GitHub]
- 问题反馈：[Issues]

---

**让校园生活更简单，让时间更宝贵！** 🎓✨
