# 黑科易购校园服务平台

> **你的时间很宝贵，跑腿的事交给我们。**

黑科易购校园服务平台是专为黑龙江科技大学学生打造的校园综合性服务平台，整合购物、外卖、跑腿、信息服务等功能，让学生足不出户即可解决生活、学习所需。

## 项目定位

- **目标用户：** 黑龙江科技大学全体学生
- **核心价值：** 节省时间，提高效率，一站式解决校园生活需求
- **项目Slogan：** 你的时间很宝贵，跑腿的事交给我们

## 技术栈

### 后端
- **框架：** Spring Boot 2.7.x
- **ORM：** MyBatis Plus 3.5.x
- **安全框架：** Spring Security + JWT
- **数据库：** MySQL 8.0
- **缓存：** Redis 3.2.0+
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
│   ├── service-campus/         # 校园信息服务
│   ├── service-lostfound/      # 失物招领服务
│   └── service-secondhand/     # 二手市场服务
├── heikeji-mall-job/           # 定时任务模块
├── heikeji-admin/              # 后台管理端API
├── heikeji-app/                # 手机应用APP端API
├── heikeji-miniprogram/        # 微信小程序
├── heikeji-gateway/            # API网关
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
└── service-api-docs/           # API文档服务
```

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
- 校园地图导航
- 学业辅助（课程表、考试安排）

### 6. 二手市场
- 闲置物品发布与浏览
- 物品分类与搜索
- 交易管理

### 7. 失物招领
- 失物发布与认领
- 招领信息管理

### 8. 订单与支付
- 统一订单管理（商品、跑腿、外卖）
- 微信支付集成
- 订单状态实时跟踪

### 9. 后台管理系统
- 数据看板
- 用户管理
- 商品与商家管理
- 订单管理
- 内容管理
- 服务配置

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

# 导入表结构和测试数据
mysql -u root -p heikeji_mall < sql/full_db.sql
```

### 3. 配置文件
修改各服务模块下的 `application.yml` 或 `application.properties` 文件，配置数据库、Redis等信息。

### 4. 运行项目
```bash
# 编译项目
mvn clean install

# 启动所有服务（使用脚本）
cd heikeji-mall-service
./start_services_final.sh
```

### 5. 访问服务
- API网关地址：`http://localhost:8080`
- 外卖服务接口：`http://localhost:8081/api/app/takeout/order/create`
- API文档地址：`http://localhost:8888/swagger-ui.html`

## API文档

项目提供了完整的API文档，可通过以下方式访问：

1. **Swagger UI：** 访问 `http://localhost:8888/swagger-ui.html` 查看各服务接口
2. **API文档服务：** 运行 `service-api-docs` 模块查看整合后的API文档
3. **本地文档：** 查看 `docs/API接口文档.md` 获取详细的接口说明

## 文档结构

### 主要文档目录

| 目录 | 内容说明 |
|------|----------|
| **docs/architecture** | 架构设计、服务拆分、技术方案等 |
| **docs/development** | 开发规范、开发计划、最佳实践等 |
| **docs/deployment** | 部署文档、环境配置、数据库导入等 |
| **docs/operation** | 运维指南、监控方案、备份恢复等 |
| **docs/test** | 测试用例、质量保障、性能测试等 |
| **docs/module** | 各功能模块详细说明 |
| **docs/api** | API接口文档、接口规范等 |
| **docs/project** | 项目计划、上线准备、总结报告等 |

### 核心文档

- **架构设计**：docs/架构文档.md
- **开发规范**：docs/开发规范文档.md
- **部署指南**：docs/部署和配置指南.md
- **API文档**：docs/API接口文档.md
- **数据库设计**：docs/数据库设计文档.md

## 开发计划

- [x] 项目结构搭建
- [x] 数据库表设计
- [x] 通用模块开发
- [x] 外卖服务核心功能
- [x] 用户服务完善
- [x] 商品服务完善
- [x] 订单服务完善
- [x] 支付服务集成
- [x] 微信小程序前端
- [x] 管理后台前端

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

MIT License

## 联系方式

- 项目地址：[GitHub]
- 问题反馈：[Issues]

---

**让校园生活更简单，让时间更宝贵！** 🎓✨
