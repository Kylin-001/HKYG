# 黑科易购校园服务平台

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.2-green.svg)
![Vue](https://img.shields.io/badge/Vue-3.5-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

一个为黑龙江科技大学师生提供便捷服务的校园服务平台

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [技术架构](#-技术架构) • [部署指南](#-部署指南) • [项目文档](#-项目文档) • [贡献指南](#-贡献指南)

</div>

---

## 📋 项目简介

黑科易购是一个基于微服务架构的校园服务平台，为黑龙江科技大学师生提供商品交易、外卖配送、二手交易、失物招领、校园服务等多种便捷服务。

### 项目背景

随着校园信息化建设的推进，传统的校园服务方式已无法满足师生日益增长的需求。黑科易购平台通过整合多种校园服务，提供一站式解决方案，极大提升了校园生活的便利性。

### 项目目标

- 为师生提供便捷的校园服务
- 构建安全、稳定、高效的微服务架构
- 提供优秀的用户体验和性能表现
- 支持高并发和大规模用户访问

---

## ✨ 功能特性

### 🛒 核心业务功能
- **商品交易**：商品浏览、搜索、购买、评价
- **外卖服务**：商家入驻、菜品管理、订单配送、外卖柜管理
- **二手交易**：商品发布、交易管理、消息沟通、评价系统
- **失物招领**：失物发布、寻物启事、归还管理、消息通知
- **校园服务**：校园公告、活动管理、社团管理、场地预订

### 🎯 营销系统
- **优惠券系统**：满减券、折扣券、优惠券领取和使用
- **积分系统**：积分获取、积分兑换、积分商城、积分记录
- **会员等级**：等级权益、等级升级、等级折扣
- **营销活动**：活动发布、活动参与、活动奖励、效果分析

### 📊 数据分析
- **用户行为分析**：浏览、点击、购买行为追踪
- **销售数据分析**：销售趋势、热门商品、营收统计
- **推荐效果分析**：点击率、转化率、推荐效果追踪
- **数据可视化**：ECharts图表展示、实时数据更新

### 🤖 智能推荐
- **User-CF算法**：基于用户的协同过滤推荐
- **Item-CF算法**：基于物品的协同过滤推荐
- **混合推荐**：结合多种推荐策略
- **实时更新**：根据用户行为动态调整推荐

### 🔒 安全系统
- **JWT认证**：基于Token的用户认证
- **RBAC权限**：基于角色的访问控制
- **密码加密**：BCrypt密码加密存储
- **设备指纹**：设备识别和安全检测
- **环境检测**：开发/生产环境安全检测

### 📈 性能优化
- **代码分割**：按路由分割代码，减少首屏加载时间
- **懒加载**：组件按需加载，提升性能
- **缓存策略**：多级缓存机制（浏览器、Redis、CDN）
- **Gzip压缩**：资源压缩传输，减少带宽占用

### 🧪 测试体系
- **单元测试**：完善的单元测试覆盖
- **集成测试**：服务间集成测试
- **E2E测试**：端到端自动化测试
- **性能测试**：性能监控和优化

### 📡 系统监控
- **性能监控**：实时性能指标收集
- **错误追踪**：Sentry错误监控和报警
- **告警机制**：自动告警检查和通知
- **数据分析**：历史数据查询和分析

---

## 🚀 快速开始

### 环境要求

#### 后端环境
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Redis 6.0+
- Nacos 2.0+

#### 前端环境
- Node.js 16+
- npm 8+
- 现代浏览器（Chrome、Firefox、Edge、Safari）

### 安装步骤

#### 1. 克隆项目
```bash
git clone <repository-url>
cd heikeji-mall
```

#### 2. 数据库配置
```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE heikeji_mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 导入表结构
mysql -u root -p heikeji_mall < sql/root_scripts/init/full_db.sql
```

#### 3. 后端配置
修改各模块的 `application.yml` 文件，配置数据库和Redis连接：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/heikeji_mall?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
  redis:
    host: localhost
    port: 6379
    password: 
```

#### 4. 启动服务

**方式1：使用嵌入式Nacos启动（推荐，无需Docker）**
```bash
# 启动所有服务（Nacos + 微服务）
./scripts/linux/start-with-embedded-nacos.sh start

# 停止所有服务
./scripts/linux/start-with-embedded-nacos.sh stop

# 重启所有服务
./scripts/linux/start-with-embedded-nacos.sh restart

# 检查服务状态
./scripts/linux/start-with-embedded-nacos.sh status

# 仅管理Nacos
./scripts/linux/start-with-embedded-nacos.sh nacos start
./scripts/linux/start-with-embedded-nacos.sh nacos stop
```

**方式2：传统启动方式**
```bash
# Linux/Mac系统
./scripts/linux/start-all.sh

# Windows系统
scripts\windows\start-all.bat
```

#### 5. 访问应用
- **前端**：http://localhost:5173
- **后端API**：http://localhost:8080
- **Nacos控制台**：http://localhost:8848/nacos
- **Gateway**：http://localhost:8080
- **Admin**：http://localhost:8081
- **API文档中心**：http://localhost:8089/swagger-ui.html

#### 6. API文档使用
项目提供了完整的API文档，支持在线测试和接口调试：

**访问API文档：**

```bash
# 方式1：直接访问
open http://localhost:8089/swagger-ui.html

# 方式2：使用快速访问工具
./scripts/linux/api-docs-tool.sh
```

**API文档功能：**

- 📖 **统一文档中心** - 聚合所有微服务的API接口
- 🔐 **JWT认证支持** - 完整的接口权限控制
- 🎯 **在线测试** - 直接在文档页面测试API
- 📊 **详细说明** - 包含参数、响应、示例等完整信息

**快速测试API：**

```bash
# 运行API自动化测试
./scripts/linux/api-test.sh
```

详细的API文档使用说明请参考：[API文档使用指南](API_DOCS.md)

---

## 🏗 技术架构

### 后端技术栈
| 技术 | 版本 | 说明 |
|------|------|------|
| Spring Boot | 3.2.2 | 基础框架 |
| Spring Cloud | 2023.0.0 | 微服务框架 |
| Spring Cloud Alibaba | 2022.0.0-RC2 | 阿里云组件 |
| Spring Cloud Gateway | 4.1.1 | API网关 |
| MyBatis-Plus | 3.5.5 | 持久层框架 |
| MySQL | 8.0.33 | 数据库 |
| Redis | 4.4.3 | 缓存 |
| Nacos | 2.0.0 | 服务注册与配置中心 |
| Hutool | 5.8.26 | 工具库 |
| Lombok | 1.18.32 | 简化代码 |
| SpringDoc | 2.3.0 | API文档 |
| Sentry | 7.6.0 | 错误追踪 |

### 前端技术栈
| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5.1 | 前端框架 |
| Vite | 5.0.0 | 构建工具 |
| Element Plus | 2.4.4 | UI组件库 |
| Pinia | 2.1.7 | 状态管理 |
| Vue Router | 4.2.5 | 路由管理 |
| Axios | 1.6.0 | HTTP客户端 |
| ECharts | 5.4.0 | 图表库 |
| Vue I18n | 12.0.0 | 国际化 |
| TypeScript | 5.2.2 | 类型检查 |

### 微服务架构
```
┌─────────────────────────────────────────────────┐
│              Nacos (服务注册中心)              │
└─────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────┐
│        Spring Cloud Gateway (API网关)        │
└─────────────────────────────────────────────────┘
                            ↓
        ┌───────────┬───────────┬───────────┬───────────┐
        │   Admin   │   User    │  Product  │   Order   │
        │ (管理后台) │(用户服务) │(商品服务) │(订单服务) │
        └───────────┴───────────┴───────────┴───────────┘
        ┌───────────┬───────────┬───────────┬───────────┐
        │ Payment  │  Takeout  │ Secondhand│ Lostfound │
        │ (支付服务)│(外卖服务) │(二手服务) │(失物服务) │
        └───────────┴───────────┴───────────┴───────────┘
        ┌───────────┬───────────┐
        │  Campus  │ Delivery │
        │(校园服务)│(配送服务) │
        └───────────┴───────────┘
        ┌───────────┐
        │  Member  │
        │(会员服务)│
        └───────────┘
```

---

## 📦 项目结构

```
heikeji-mall/
├── heikeji-admin/              # 管理后台
├── heikeji-app/               # 移动端应用
├── heikeji-common/            # 公共模块
│   ├── common-api/            # API接口定义
│   ├── common-core/           # 核心工具模块
│   ├── common-security/        # 安全模块
│   ├── common-third-party/     # 第三方集成
│   └── common-monitoring/      # 监控模块
├── heikeji-mall-api/          # API接口模块
├── heikeji-mall-job/          # 定时任务模块
├── heikeji-mall-service/      # 业务服务模块
│   ├── service-user/          # 用户服务
│   ├── service-product/       # 商品服务
│   ├── service-order/         # 订单服务
│   ├── service-payment/       # 支付服务
│   ├── service-takeout/       # 外卖服务
│   ├── service-secondhand/    # 二手服务
│   ├── service-lostfound/     # 失物服务
│   ├── service-campus/       # 校园服务
│   ├── service-delivery/      # 配送服务
│   └── service-member/       # 会员服务
├── service-api-docs/          # API文档聚合服务
├── heikeji-system/            # 系统模块
├── heikeji-gateway/           # API网关
├── heikeji-frontend/          # 前端项目
│   ├── src/
│   │   ├── api/              # API接口
│   │   ├── assets/           # 静态资源
│   │   ├── components/       # 公共组件
│   │   ├── layout/           # 布局组件
│   │   ├── router/           # 路由配置
│   │   ├── store/            # 状态管理
│   │   ├── utils/            # 工具函数
│   │   └── views/            # 页面组件
│   ├── public/              # 公共资源
│   └── package.json
├── heikeji-miniprogram/       # 小程序项目
├── sql/                     # 数据库脚本
│   ├── root_scripts/        # 根脚本
│   │   ├── init/           # 初始化脚本
│   │   └── updates/        # 更新脚本
│   ├── schema/              # 数据库结构
│   ├── migrations/         # 数据库迁移
│   ├── data/               # 数据文件
│   ├── test_data/          # 测试数据
│   ├── security/           # 安全相关
│   ├── deployment/         # 部署脚本
│   └── maintenance/        # 维护脚本
├── docs/                    # 项目文档
│   ├── project/            # 项目文档
│   ├── development/        # 开发文档
│   ├── frontend/           # 前端文档
│   ├── backend/            # 后端文档
│   ├── architecture/        # 架构文档
│   ├── database/           # 数据库文档
│   ├── deployment/         # 部署文档
│   ├── api/               # API文档
│   ├── module/            # 模块文档
│   ├── payment/            # 支付文档
│   ├── features/           # 功能文档
│   ├── monitoring/         # 监控文档
│   ├── troubleshooting/    # 故障排除
│   ├── security/           # 安全文档
│   ├── nacos/             # Nacos文档
│   ├── project-status/     # 项目状态文档
│   └── archive/            # 归档文档
├── scripts/                 # 脚本文件
│   ├── linux/              # Linux脚本
│   ├── windows/            # Windows脚本
│   ├── powershell/         # PowerShell脚本
│   └── README.md
├── logs/                    # 日志文件
│   └── archive/           # 归档日志
├── downloads/               # 下载文件
├── reports/                 # 报告文件
├── tools/                   # 工具文件
├── test/                    # 测试文件
├── config/                  # 配置文件
├── pom.xml                  # Maven配置
├── docker-compose.yml        # Docker编排配置
├── docker-compose-nacos.yml  # Nacos Docker配置
├── Dockerfile               # Docker镜像构建文件
├── README.md                # 项目说明
├── DEPLOYMENT.md            # 部署文档
├── PROJECT_SUMMARY.md        # 项目总结
├── PROJECT_PROGRESS.md       # 项目进展
├── API_DOCS.md              # API文档使用指南
├── SERVICE_PORTS.md          # 服务端口配置
├── SERVICE_STARTUP.md        # 服务启动指南
└── NACOS_INSTALL_GUIDE.md   # Nacos安装指南
```

---

## 🚢 部署指南

详细的部署指南请参考 [DEPLOYMENT.md](docs/deployment/DEPLOYMENT.md)

### 快速部署

#### 1. 编译打包

**后端打包：**
```bash
# 编译所有模块
mvn clean package -DskipTests

# 单独编译模块
cd heikeji-admin
mvn clean package -DskipTests
```

**前端打包：**
```bash
cd heikeji-frontend
npm run build
```

#### 2. 部署后端
```bash
# 复制JAR文件到服务器
scp target/*.jar user@server:/opt/heikeji/

# 启动服务
ssh user@server
cd /opt/heikeji
java -jar heikeji-admin-1.0.0.jar
```

#### 3. 部署前端
```bash
# 复制dist目录到服务器
scp -r dist/* user@server:/var/www/html/

# 配置Nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker部署
```bash
# 构建镜像
docker build -t heikeji-mall:latest .

# 运行容器
docker-compose up -d
```

---

## 📚 项目文档

### 核心文档
- [项目总结](docs/project/项目总结报告.md) - 详细的项目总结报告
- [项目进展](PROJECT_PROGRESS.md) - 项目开发进展总结
- [部署指南](docs/deployment/DEPLOYMENT.md) - 完整的部署文档
- [API文档使用指南](docs/api/API_DOCS.md) - API接口文档使用说明

### 服务文档
- [服务端口配置](docs/project/SERVICE_PORTS.md) - 服务端口配置说明
- [服务启动指南](docs/project/SERVICE_STARTUP.md) - 服务启动顺序和依赖关系
- [Nacos安装指南](docs/nacos/NACOS_INSTALL_GUIDE.md) - Nacos安装和配置指南

### 文档目录
- [文档索引](docs/DOCUMENTATION_INDEX.md) - 完整的文档导航索引
- [项目文档](docs/project/) - 项目规划、总结、验收报告等
- [开发文档](docs/development/) - 开发规范、开发计划等
- [前端文档](docs/frontend/) - 前端开发、优化、测试等
- [后端文档](docs/backend/) - 后端模块说明
- [架构文档](docs/architecture/) - 系统架构设计
- [数据库文档](docs/database/) - 数据库设计、导入、优化等
- [部署文档](docs/deployment/) - 部署和运维相关文档
- [API文档](docs/api/) - API接口文档
- [模块文档](docs/module/) - 各功能模块说明
- [支付文档](docs/payment/) - 支付模块文档
- [功能文档](docs/features/) - 功能使用指南
- [监控文档](docs/monitoring/) - 系统监控文档
- [故障排除](docs/troubleshooting/) - 常见问题解决方案
- [安全文档](docs/security/) - 安全相关文档
- [Nacos文档](docs/nacos/) - Nacos安装和配置文档
- [项目状态](docs/project-status/) - 项目状态和进展文档
- [归档文档](docs/archive/) - 历史文档归档

### API文档工具
- [API文档快速访问工具](scripts/linux/api-docs-tool.sh) - 交互式API文档访问工具
- [API自动化测试脚本](scripts/linux/api-test.sh) - API接口自动化测试

---

## 🤝 贡献指南

### 开发规范

1. **代码规范**
   - 遵循阿里巴巴Java开发手册
   - 遵循Vue官方风格指南
   - 使用有意义的变量和函数命名

2. **提交规范**
   - 使用清晰的提交信息
   - 遵循Conventional Commits规范
   - 一个提交只包含一个功能

3. **分支管理**
   - main分支用于生产环境
   - develop分支用于开发环境
   - feature分支用于新功能开发

### Pull Request流程

1. Fork本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 进行开发并提交代码
4. 推送到分支：`git push origin feature/your-feature`
5. 创建Pull Request

---

## 📞 项目统计

### 代码统计
- **后端代码行数**：约50,000行
- **前端代码行数**：约30,000行
- **总文件数**：约500个
- **Java类数**：约300个
- **Vue组件数**：约200个

### 功能统计
- **后端服务数**：11个
- **API接口数**：约200个
- **前端页面数**：约50个
- **数据库表数**：约30个

### 测试统计
- **测试文件数**：约30个
- **测试用例数**：约250个
- **测试覆盖率**：约77%

---

## 🎯 项目路线图

### 已完成 ✅
- [x] Vue 3迁移
- [x] 测试体系完善
- [x] 性能优化
- [x] 安全加固
- [x] 用户认证优化
- [x] 权限控制优化
- [x] 商品推荐系统
- [x] 支付安全增强
- [x] 营销系统开发
- [x] 数据分析系统
- [x] 协同过滤算法
- [x] 系统监控功能
- [x] 营销系统后端服务
- [x] 营销系统前端页面
- [x] 项目文档整理

### 已完成 ✅
- [x] 前端页面开发
- [x] 后端服务完善
- [x] 架构优化
- [x] 功能完善
- [x] AI和机器学习
- [x] 大数据分析
- [x] 国际化支持
- [x] 微前端架构完善

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 👥 团队成员

- **项目负责人**：项目团队
- **技术负责人**：技术团队
- **开发团队**：开发团队
- **测试团队**：测试团队

---

## 🙏 致谢

感谢所有为项目做出贡献的开发者、测试者和使用者！

特别感谢：
- Spring Boot团队
- Vue.js团队
- Element Plus团队
- 所有开源项目的贡献者

---

## 📞 联系方式

- **技术支持**：support@heikeji.com
- **项目文档**：https://docs.heikeji.com
- **问题反馈**：https://github.com/heikeji/heikeji-mall/issues
- **官方网站**：https://www.heikeji.com

---

<div align="center">

**如果觉得项目对您有帮助，请给一个⭐️**

Made with ❤️ by 黑科易购团队

</div>
