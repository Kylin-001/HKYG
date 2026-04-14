# 项目脚本管理

## 📋 脚本目录结构

```
├── start-services.ps1              # 主启动脚本（Windows PowerShell）
├── scripts/
│   ├── README.md                   # 本文档
│   ├── linux/                      # Linux Shell脚本
│   │   ├── start-all.sh           # 启动所有服务
│   │   ├── stop-all.sh            # 停止所有服务
│   │   ├── health-check.sh        # 服务健康检查
│   │   ├── deploy.sh              # 项目部署
│   │   ├── production-quick-start.sh  # 生产环境快速启动
│   │   ├── production-health-check.sh # 生产环境健康检查
│   │   ├── api-test.sh            # API测试
│   │   ├── api-docs-tool.sh       # API文档工具
│   │   ├── convert_swagger_to_openapi.sh  # Swagger转换
│   │   └── fix-ports.sh           # 端口修复
│   ├── powershell/                # PowerShell脚本（Windows）
│   │   ├── build.ps1              # Maven构建（Java 17）
│   │   ├── install_jdk17.ps1      # 安装JDK 17
│   │   ├── set_java17_env.ps1     # 设置Java 17环境
│   │   ├── set_permanent_java_env.ps1  # 永久设置Java环境
│   │   ├── check_java_version.ps1 # 检查Java版本
│   │   └── init_database_fixed.ps1    # 数据库初始化
│   ├── security-audit.js          # 安全审计工具
│   └── database-performance-monitor.js  # 数据库性能监控
├── heikeji-web/scripts/            # 前端专用脚本
│   ├── dev-tools.mjs             # 开发工具集
│   ├── deploy.sh                 # 前端部署
│   ├── generate.mjs              # 代码生成
│   ├── changelog.mjs             # 变更日志生成
│   ├── generate-pwa-icons.js     # PWA图标生成
│   └── security-audit.mjs        # 前端安全审计
└── tools/                         # 辅助工具
    ├── complete-fix.js           # Vue文件修复
    ├── organize_project.sh       # 项目整理
    ├── static-server.js          # 静态服务器
    ├── *.py                      # Python数据处理工具
    └── *.java                    # Java工具
```

---

## 🚀 快速开始

### Windows用户（推荐）

#### 启动所有服务
```powershell
# 在项目根目录执行
.\start-services.ps1
```
此脚本会：
- ✅ 自动安装前端依赖（如需要）
- ✅ 启动前端开发服务器（http://localhost:5174/）
- ✅ 启动所有后端微服务（14个服务）
- ✅ 每个服务在独立窗口中运行

#### 构建项目
```powershell
cd scripts\powershell
.\build.ps1
```

#### 环境配置（首次使用）
```powershell
# 安装JDK 17
.\scripts\powershell\install_jdk17.ps1

# 设置Java环境变量（临时）
.\scripts\powershell\set_java17_env.ps1

# 或永久设置
.\scripts\powershell\set_permanent_java_env.ps1
```

### Linux用户

#### 启动服务
```bash
# 交互式菜单
./scripts/linux/start-all.sh

# 或直接启动全部服务
./scripts/linux/start-all.sh all

# 仅启动后端
./scripts/linux/start-all.sh backend

# 仅启动前端
./scripts/linux/start-all.sh frontend
```

#### 停止服务
```bash
./scripts/linux/stop-all.sh
```

#### 部署到生产环境
```bash
# 传统部署
./scripts/linux/deploy.sh

# 或Docker部署
./scripts/linux/deploy.sh --mode docker
```

---

## 📖 脚本详细说明

### 1️⃣ 服务管理脚本

#### `start-services.ps1` （主启动脚本 - Windows）
**位置**: 项目根目录  
**功能**: 一键启动前后端所有服务  
**特点**:
- 动态获取项目路径（无需硬编码）
- 自动检测并安装前端依赖
- 支持前端+14个后端微服务
- 彩色输出，清晰的进度显示
- 显示完整的端口和访问URL列表

**服务端口列表**:
| 服务 | 端口 | 说明 |
|------|------|------|
| heikeji-web | 5174 | 前端开发服务器 |
| heikeji-gateway | 8080 | API网关 |
| heikeji-system | 8002 | 系统服务 |
| service-user | 8085 | 用户服务 |
| service-product | 8082 | 商品服务 |
| service-order | 8083 | 订单服务 |
| service-payment | 8004 | 支付服务 |
| service-delivery | 8010 | 配送服务 |
| service-takeout | 8005 | 外卖服务 |
| service-campus | 8003 | 校园服务 |
| service-secondhand | 8006 | 二手服务 |
| service-lostfound | 8007 | 失物招领 |
| service-member | 8088 | 会员服务 |
| heikeji-admin | 8090 | 管理后台 |
| heikeji-mall-job | 8086 | 定时任务 |
| service-api-docs | 8089 | API文档 |

#### `start-all.sh` / `stop-all.sh` （Linux）
**位置**: `scripts/linux/`  
**功能**: Linux环境下的服务启停管理  
**特性**:
- 交互式菜单界面
- 环境依赖检查（Java/Maven/Node.js/MySQL/Redis）
- 支持分模块启动（前端/后端/全部）
- 后台运行模式，日志输出到文件

---

### 2️⃣ 构建和部署脚本

#### `build.ps1` （Windows构建）
**位置**: `scripts/powershell/build.ps1`  
**功能**: 使用Maven构建整个项目  
**流程**:
1. 自动检测并配置Java 17环境
2. 显示Java和Maven版本信息
3. 执行 `mvn clean install -DskipTests`
4. 显示构建结果

#### `deploy.sh` （Linux部署）
**位置**: `scripts/linux/deploy.sh`  
**功能**: 完整的项目部署解决方案  
**支持模式**:
- 传统部署（默认）
- Docker Compose部署

**命令**:
```bash
./deploy.sh build          # 构建镜像
./deploy.sh deploy         # 部署应用
./deploy.sh start          # 启动服务
./deploy.sh stop           # 停止服务
./deploy.sh restart        # 重启服务
./deploy.sh logs           # 查看日志
./deploy.sh status         # 查看状态
./deploy.sh backup         # 备份数据
./deploy.sh cleanup        # 清理资源
./deploy.sh benchmark      # 性能测试
```

#### `heikeji-web/scripts/deploy.sh` （前端部署）
**位置**: `heikeji-web/scripts/deploy.sh`  
**功能**: 前端项目的Docker部署  
**特性**:
- Docker镜像构建
- 容器生命周期管理
- 日志查看和监控
- 数据备份和恢复
- 性能基准测试

---

### 3️⃣ 环境配置脚本

#### Java环境配置（Windows）

| 脚本 | 功能 | 使用场景 |
|------|------|----------|
| `install_jdk17.ps1` | 安装JDK 17 | 首次配置环境 |
| `set_java17_env.ps1` | 临时设置Java环境 | 当前会话 |
| `set_permanent_java_env.ps1` | 永久设置Java环境 | 推荐方式 |
| `check_java_version.ps1` | 检查Java版本 | 故障排查 |

#### 数据库初始化
```powershell
.\scripts\powershell\init_database_fixed.ps1
```

---

### 4️⃣ 开发工具脚本

#### `dev-tools.mjs` （前端开发工具集）
**位置**: `heikeji-web/scripts/dev-tools.mjs`  
**功能**: 前端开发辅助命令集合

**可用命令**:
```bash
node scripts/dev-tools.mjs clean              # 清理构建产物
node scripts/dev-tools.mjs check-deps         # 检查过时依赖
node scripts/dev-tools.mjs analyze-bundle     # 分析打包体积
node scripts/dev-tools.mjs gen-types          # 生成类型声明
node scripts/dev-tools.mjs lint-fix           # ESLint自动修复
node scripts/dev-tools.mjs format-all         # Prettier格式化
node scripts/dev-tools.mjs test-coverage      # 测试覆盖率
node scripts/dev-tools.mjs health-check       # 项目健康检查
```

---

### 5️⃣ 监控和审计脚本

#### 安全审计
```bash
# 全项目安全扫描
node scripts/security-audit.js

# 仅前端安全扫描
node heikeji-web/scripts/security-audit.mjs
```

**检测内容**:
- 🔴 硬编码密码和密钥
- 🔴 API密钥泄露
- 🔴 数据库连接字符串暴露
- 🟡 XSS漏洞（innerHTML/eval/v-html）
- 🟡 CSRF漏洞
- 🟡 调试信息残留
- 📊 依赖包漏洞扫描

**输出报告**:
- JSON格式详细报告
- HTML可视化报告（含图表）

#### 数据库性能监控
```bash
node scripts/database-performance-monitor.js
```

**监控指标**:
- 📊 表大小分布
- 📊 慢查询分析
- 📊 索引使用情况
- 💡 优化建议（表分区/索引优化/查询优化）

---

### 6️⃣ 辅助工具（tools/）

#### `complete-fix.js`
修复Vue文件中的转义引号问题

#### `organize_project.sh`
项目文件整理和清理脚本

#### `static-server.js`
简单的静态文件服务器

#### Python工具 (`*.py`)
- 数据库测试数据生成
- PPT/Word文档处理
- 数据导入导出

---

## 🔧 使用场景指南

### 场景1：首次搭建开发环境

**Windows**:
```powershell
# 1. 安装JDK 17
.\scripts\powershell\install_jdk17.ps1

# 2. 设置永久环境变量
.\scripts\powershell\set_permanent_java_env.ps1

# 3. 初始化数据库
.\scripts\powershell\init_database_fixed.ps1

# 4. 启动所有服务
.\start-services.ps1
```

**Linux**:
```bash
# 1. 检查环境
./scripts/linux/start-all.sh check

# 2. 启动服务
./scripts/linux/start-all.sh all
```

### 场景2：日常开发

```powershell
# 启动服务
.\start-services.ps1

# 在另一个终端运行开发工具
cd heikeji-web
node scripts/dev-tools.mjs lint-fix
node scripts/dev-tools.mjs format-all
```

### 场景3：构建和部署

**本地构建**:
```powershell
.\scripts\powershell\build.ps1
```

**生产部署**（Linux）:
```bash
./scripts/linux/deploy.sh --mode docker
```

### 场景4：代码质量检查

```bash
# 安全审计
node scripts/security-audit.js

# 前端健康检查
cd heikeji-web
node scripts/dev-tools.mjs health-check

# 数据库性能分析
node scripts/database-performance-monitor.js
```

### 场景5：故障排查

```powershell
# 检查Java版本
.\scripts\powershell\check_java_version.ps1

# Linux健康检查
./scripts/linux/health-check.sh

# 生产环境检查
./scripts/linux/production-health-check.sh
```

---

## ⚠️ 注意事项

### 前置要求

**Windows开发环境**:
- ✅ JDK 17+
- ✅ Maven 3.6+
- ✅ Node.js 16+
- ✅ PowerShell 5.1+

**Linux生产环境**:
- ✅ JDK 17+
- ✅ Maven 3.6+
- ✅ Node.js 16+
- ✅ MySQL 8.0+
- ✅ Redis 6.0+
- ✅ Docker & Docker Compose（可选）

### 最佳实践

1. **首次使用前**
   - 运行环境检查脚本确认依赖已安装
   - 配置好数据库连接信息
   - 确保Nacos注册中心可用

2. **日常开发**
   - 使用 `start-services.ps1` 启动服务
   - 定期运行安全审计脚本
   - 使用 `dev-tools.mjs` 保持代码质量

3. **部署前**
   - 运行完整构建确保无编译错误
   - 执行安全审计和性能测试
   - 备份现有数据和配置

4. **日志管理**
   - 服务日志位于各服务目录下
   - 定期清理避免磁盘占满
   - 重要错误及时排查

### 常见问题

**Q: 启动脚本报错"找不到路径"？**  
A: 确保从项目根目录执行脚本，或使用绝对路径

**Q: Java版本不正确？**  
A: 运行 `set_permanent_java_env.ps1` 永久设置环境变量

**Q: 端口被占用？**  
A: 运行 `fix-ports.sh`（Linux）或手动关闭占用进程

**Q: 前端依赖安装失败？**  
A: 检查Node.js版本，尝试删除 node_modules 后重新安装

**Q: 数据库连接失败？**  
A: 检查MySQL服务状态，确认数据库配置正确

---

## 📊 脚本统计

| 类别 | 数量 | 主要用途 |
|------|------|----------|
| 服务启动/停止 | 3 | 开发环境管理 |
| 构建/部署 | 4 | CI/CD和发布 |
| 环境配置 | 5 | 开发环境搭建 |
| 开发工具 | 8+ | 代码质量和效率 |
| 监控/审计 | 3 | 安全和性能 |
| 辅助工具 | 10+ | 数据处理和维护 |

**总计**: 30+ 个脚本覆盖项目全生命周期

---

## 🔄 更新日志

### 2026-04-05
- ✅ 整理重复的启动脚本，保留功能完善的版本
- ✅ 更新文档以反映实际脚本情况
- ✅ 统一脚本命名规范说明
- ✅ 添加使用场景指南
- ✅ 补充常见问题解答

---

## 📞 技术支持

如遇到脚本相关问题：
1. 查看本文档的"常见问题"部分
2. 检查脚本的输出日志
3. 确认环境依赖是否满足
4. 在项目Issues中反馈问题
