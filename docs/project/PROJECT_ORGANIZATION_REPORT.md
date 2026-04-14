# 项目整理报告

**生成日期**: 2026-03-13

---

## 一、项目概述

本项目是**黑科易购校园服务平台**（Heikeji Campus Service Platform），是一个基于微服务架构的校园服务平台，为黑龙江科技大学师生提供商品交易、外卖配送、二手交易、失物招领、校园服务等多种便捷服务。

### 技术栈
- **后端**: Java 17, Spring Boot 3.2.2, Spring Cloud
- **前端**: Vue 3.5, 微信小程序
- **数据库**: MySQL 8.0, Redis
- **服务治理**: Nacos, Gateway
- **部署**: Docker, Docker Compose

---

## 二、当前项目结构

### 2.1 根目录文件结构

```
/home/zky/HKYG/
├── README.md                      # 项目主文档
├── PROJECT_PROGRESS.md            # 项目进度
├── PROJECT_SUMMARY.md             # 项目概要
├── PROJECT_ORGANIZATION_REPORT.md # 项目组织报告
├── DOCUMENTATION_ORGANIZATION_REPORT.md # 文档组织报告
├── API_DOCS.md                    # API文档
├── SERVICE_PORTS.md               # 服务端口配置
├── SERVICE_STARTUP.md             # 服务启动说明
├── DEPLOYMENT.md                  # 部署文档
├── NACOS_INSTALL_GUIDE.md         # Nacos安装指南
├── DOCKER_MIRROR_CONFIG.md        # Docker镜像配置
│
├── pom.xml                        # Maven配置
├── Dockerfile                     # Docker配置
├── docker-compose.yml             # Docker Compose配置
├── docker-compose-all.yml         # 完整Docker Compose配置
├── docker-compose-nacos.yml       # Nacos Docker Compose配置
│
├── .env.dev / .env.prod / .env.test / .env.example  # 环境配置
├── .gitignore
│
├── heikeji-admin/                 # 管理后台模块
├── heikeji-common/               # 公共模块
│   ├── common-core/
│   └── common-security/
├── heikeji-frontend/             # Vue3前端
├── heikeji-gateway/              # 网关服务
├── heikeji-mall-api/             # 商城API
├── heikeji-mall-job/             # 定时任务
├── heikeji-mall-service/         # 商城服务
├── heikeji-miniprogram/          # 微信小程序
├── heikeji-system/               # 系统模块
├── service-api-docs/             # API文档服务
│
├── config/                       # 配置文件目录
├── docs/                        # 文档目录（26个子目录）
├── downloads/                   # 下载目录
├── logs/                        # 日志目录
├── nacos/                       # Nacos服务目录
├── ppt_venv/                    # Python虚拟环境
├── reports/                     # 报告目录
├── scripts/                     # 脚本目录
├── sql/                         # SQL脚本目录
├── src/                         # 源代码目录
├── test/                        # 测试文件目录
├── tools/                       # 工具目录
├── work/                        # 工作目录
│
├── .github/                     # GitHub配置
├── .trae/                       # Trae IDE配置
└── .vscode/                     # VS Code配置
```

---

## 三、文档目录结构 (docs/)

### 3.1 当前子目录（按文件数量排序）

| 序号 | 目录名 | 描述 | 文件数 |
|------|--------|------|--------|
| 1 | frontend | 前端文档 | ~25 |
| 2 | project | 项目文档 | ~15 |
| 3 | database | 数据库文档 | ~12 |
| 4 | development | 开发文档 | ~12 |
| 5 | deployment | 部署文档 | ~7 |
| 6 | archive | 归档文档 | ~11 |
| 7 | architecture | 架构文档 | ~6 |
| 8 | nacos | Nacos文档 | ~4 |
| 9 | performance | 性能文档 | ~2 |
| 10 | project-status | 项目状态 | ~3 |
| 11 | module | 模块文档 | ~5 |
| 12 | api | API文档 | ~2 |
| 13 | backend | 后端文档 | ~2 |
| 14 | operation | 运维文档 | ~1 |
| 15 | payment | 支付文档 | ~2 |
| 16 | security | 安全文档 | ~3 |
| 17 | troubleshooting | 故障排除 | ~2 |
| 18 | features | 功能文档 | ~1 |
| 19 | planning | 规划文档 | ~1 |
| 20 | monitoring | 监控文档 | ~1 |
| 21 | mysql | MySQL文档 | ~0 |
| 22 | tools | 工具文档 | ~0 |
| 23 | test | 测试文档 | ~0 |
| 24 | sql | SQL文档 | ~0 |

### 3.2 根目录文档文件（docs/*.md）

| 文件名 | 建议操作 |
|--------|----------|
| PRODUCTION_DEPLOYMENT_STANDARD.md | 移至 docs/deployment/ |
| 项目整合文档.md | 移至 docs/project/ 或与 docs/快速开始指南.md 合并 |
| 快速开始指南.md | 保留或移至 docs/project/ |
| user_security_guide.md | 移至 docs/security/ |

---

## 四、重复文件分析

### 4.1 重复文件列表

| 文档主题 | 重复位置 | 建议保留 |
|----------|----------|----------|
| 黑龙江科技大学数据导入指南 | docs/archive/, docs/project/ | docs/project/ |
| 项目开发计划 | docs/archive/, docs/development/ | docs/development/ |
| 数据库导入说明 | docs/archive/, docs/database/ | docs/database/ |
| MySQL故障排除 | docs/archive/, docs/database/ | docs/database/ |
| MySQL认证方案 | docs/archive/, docs/database/ | docs/database/ |
| MySQL卸载指南 | docs/database/ | 保留 |
| MySQL初始化方案 | docs/database/ | 保留 |
| 项目完成总结 | docs/archive/ (多个版本) | 保留最新版本 |
| optimization-documentation | docs/archive/, docs/frontend/optimization/ | 保留 docs/frontend/optimization/ |

---

## 五、需要清理的文件

### 5.1 根目录的Python脚本（应移至tools/）

- `generate_pptx.py` → tools/
- `read_docx_simple.py` → tools/
- `docx_parser.py` → tools/

### 5.2 归档目录中的过时文档（可删除）

以下文档属于过时的归档文件，可考虑删除：

- docs/archive/黑龙江科技大学数据导入指南.md
- docs/archive/数据库导入说明.md
- docs/archive/项目开发计划_更新版.md
- docs/archive/Frontend-Development-Plan-v2.0.md
- docs/archive/MYSQL_AUTHENTICATION_SOLUTION.md
- docs/archive/MYSQL_START_TROUBLESHOOT.md
- docs/archive/optimization-documentation.md

### 5.3 空目录

- docs/mysql/ (空)
- docs/tools/ (空)
- docs/test/ (空)
- docs/sql/ (空)

---

## 六、建议的整理方案

### 6.1 文档整理建议

1. **保留的根目录文档**（核心项目文档）：
   - README.md
   - PROJECT_PROGRESS.md
   - pom.xml

2. **移至docs/的根目录文档**：
   - API_DOCS.md → docs/api/
   - SERVICE_PORTS.md → docs/project/
   - SERVICE_STARTUP.md → docs/project/
   - DEPLOYMENT.md → docs/deployment/
   - NACOS_INSTALL_GUIDE.md → docs/nacos/
   - DOCKER_MIRROR_CONFIG.md → docs/deployment/

3. **重复文件处理**：
   - 删除 docs/archive/ 中的重复文件
   - 保留 docs/database/, docs/project/, docs/development/ 中的最新版本

4. **空目录处理**：
   - 删除 docs/mysql/, docs/tools/, docs/test/, docs/sql/ 空目录

### 6.2 工具文件整理

将根目录的Python脚本移至 tools/ 目录：
- tools/generate_pptx.py
- tools/read_docx_simple.py
- tools/docx_parser.py

---

## 七、项目模块说明

| 模块名 | 类型 | 描述 |
|--------|------|------|
| heikeji-admin | 后端 | 管理后台服务 |
| heikeji-common | 后端 | 公共模块（core, security） |
| heikeji-frontend | 前端 | Vue3管理后台 |
| heikeji-gateway | 后端 | Spring Cloud Gateway |
| heikeji-mall-api | 后端 | 商城API服务 |
| heikeji-mall-job | 后端 | 定时任务服务 |
| heikeji-mall-service | 后端 | 商城核心服务 |
| heikeji-miniprogram | 前端 | 微信小程序 |
| heikeji-system | 后端 | 系统服务 |
| service-api-docs | 后端 | API文档服务 |

---

## 八、当前项目状态

根据 PROJECT_PROGRESS.md 文件显示，项目目前处于**开发完善阶段**，主要工作包括：

- 核心业务功能开发
- 微服务架构完善
- 前端界面优化
- 性能优化
- 测试和部署准备

---

## 九、已完成的整理工作

### 9.1 已完成的操作 (2026-03-13)

1. ✅ **Python脚本归类** - 已将以下脚本复制到 tools/ 目录：
   - generate_pptx.py (PPT生成工具)
   - read_docx_simple.py (Word文档读取工具)
   - docx_parser.py (Word文档解析工具)

2. ✅ **创建整理脚本** - 已创建 tools/organize_project.sh 便捷清理脚本

### 9.2 待手动执行的操作

由于工具权限限制，以下操作需要手动执行：

```bash
# 在项目根目录执行
cd /home/zky/HKYG

# 1. 删除根目录的Python脚本（tools目录已有副本）
rm generate_pptx.py
rm read_docx_simple.py
rm docx_parser.py

# 2. 移动Markdown文档到docs对应目录
mv API_DOCS.md docs/api/api-usage-guide.md
mv SERVICE_PORTS.md docs/project/
mv SERVICE_STARTUP.md docs/project/
mv DEPLOYMENT.md docs/deployment/
mv NACOS_INSTALL_GUIDE.md docs/nacos/
mv DOCKER_MIRROR_CONFIG.md docs/deployment/
mv PRODUCTION_DEPLOYMENT_STANDARD.md docs/deployment/

# 3. 移动docs根目录的Markdown文件
mv docs/项目整合文档.md docs/project/
mv docs/快速开始指南.md docs/project/
mv docs/user_security_guide.md docs/security/

# 4. 清理重复的归档文件
rm docs/archive/黑龙江科技大学数据导入指南.md
rm docs/archive/数据库导入说明.md
rm docs/archive/项目开发计划_更新版.md
rm docs/archive/Frontend-Development-Plan-v2.0.md
rm docs/archive/MYSQL_AUTHENTICATION_SOLUTION.md
rm docs/archive/MYSQL_START_TROUBLESHOOT.md
rm docs/archive/optimization-documentation.md

# 5. 删除空目录
rmdir docs/mysql 2>/dev/null
rmdir docs/tools 2>/dev/null
rmdir docs/test 2>/dev/null
rmdir docs/sql 2>/dev/null
```

---

## 十、总结

本项目是一个功能完善的校园服务平台，具有良好的微服务架构。通过本次整理，已完成以下优化：

1. ✅ Python脚本已归类到 tools/ 目录
2. ✅ 创建了便捷的整理执行脚本
3. ⚠️ Markdown文档需要手动移动（权限限制）
4. ⚠️ 重复归档文件需要手动删除（权限限制）
5. ⚠️ 空目录需要手动清理（权限限制）

建议按照上述命令手动完成剩余整理工作，提高项目可维护性。

---

*本报告由项目整理工具自动生成，最后更新：2026-03-13*
