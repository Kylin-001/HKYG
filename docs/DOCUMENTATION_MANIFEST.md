# 黑科易购校园服务平台 - 文档体系总清单

> **版本**: v3.0.0 | **最后更新**: 2026-04-05 | **维护者**: 黑科易购开发团队

---

## 📋 文档体系概述

本文档是黑科易购项目所有文档的**唯一权威索引**，记录每份文档的状态、位置、版本和相互关系。

### 总体统计

| 类别 | 数量 | 状态说明 |
|------|------|----------|
| 📌 核心文档 (活跃) | 25 | 当前有效，定期更新 |
| 📁 归档文档 (历史) | 120+ | 历史参考，不再更新 |
| ❌ 过时待归档 | ~14 | 内容过时，需移入归档 |
| 🔲 缺失待创建 | 5 | 计划新建 |
| **合计** | **~164** | |

---

## 🗂️ 文档目录结构 (v3.0)

```
heikeji-mall/
│
├── README.md                              # ⭐ 项目主入口文档 (v2.0.0)
├── CHANGELOG.md                           # ⭐ 项目变更日志 (v2.0.0)
├── PROJECT_STATUS.md                      # ⭐ 项目状态总览 (v2.0.0)
├── PROJECT_SUMMARY.md                     # ⭐ 项目总结报告 (v2.0.0)
├── PROJECT_PROGRESS.md                    # ⭐ 项目进展详情 (v2.1.0)
│
├── docs/                                  # 📚 主文档目录
│   │
│   ├── DOCUMENTATION_INDEX.md             # 📑 文档导航索引 (v3.0.0)
│   ├── DOCUMENTATION_MANIFEST.md          # 📋 本文件 - 文档总清单
│   ├── PRODUCTION_DEPLOYMENT_STANDARD.md  # 🏭 生产部署标准
│   │
│   ├── architecture/                      # 🏛️ 架构设计 (6个文档)
│   │   ├── 架构文档.md                     # [活跃] 系统架构总览
│   │   ├── 架构优化总结文档.md              # [活跃] 架构优化记录
│   │   ├── 技术优化和重构方案.md            # [活跃] 技术优化方案
│   │   ├── 服务拆分与边界定义优化方案.md     # [活跃] 服务拆分设计
│   │   ├── 安全加固和性能优化方案.md        # [活跃] 安全性能方案
│   │   └── 黑龙江科技大学特色校园服务平台架构设计.md  # [活跃] 特色架构
│   │   └── Micro-Frontend-Architecture.md  # [活跃] 微前端架构
│   │
│   ├── api/                               # 🔌 API接口 (2个文档)
│   │   ├── API接口文档.md                  # [活跃] API接口定义
│   │   └── API_DOCUMENTATION_COMPLETE.md   # [活跃] 完整API文档
│   │
│   ├── archive/                           # 📦 归档文档 (历史版本)
│   │   ├── FINAL_PROJECT_SUMMARY.md       # [归档] 最终项目总结 v1
│   │   ├── PROJECT_COMPLETION_FINAL_SUMMARY.md  # [归档] 完成总结 v2
│   │   └── PROJECT_COMPLETION_REPORT.md    # [归档] 完成报告
│   │
│   ├── backend/                           # 🔧 后端相关 (1个文档)
│   │   └── heikeji-admin-README.md         # [活跃] 管理后台说明
│   │
│   ├── database/                          # 🗄️ 数据库 (12个文档)
│   │   ├── 数据库设计文档.md               # [活跃] 数据库设计
│   │   ├── 数据库设计和性能优化方案.md      # [活跃] 性能优化
│   │   ├── 校园特色服务数据库设计.md        # [活跃] 特色DB设计
│   │   ├── SQL_Complete_Guide.md          # [活跃] SQL完整指南
│   │   ├── SQL_Management_Plan.md         # [活跃] SQL管理计划
│   │   ├── 数据库导入说明.md               # [活跃] 导入说明
│   │   ├── Quick_Start_Guide.md           # [活跃] 快速开始
│   │   ├── README.md                      # [活跃] DB目录说明
│   │   └── [其他运维/故障排除文档]          # [辅助]
│   │
│   ├── deployment/                        # 🚀 部署运维 (7个文档)
│   │   ├── 部署文档.md                     # [活跃] 主部署指南
│   │   ├── DEPLOYMENT_SIMPLIFIED.md       # [活跃] 简化部署
│   │   ├── 全面部署和运维指南.md            # [活跃] 全面部署
│   │   ├── 部署和配置指南.md               # [活跃] 配置指南
│   │   ├── 部署和运维策略.md               # [活跃] 运维策略
│   │   └── DOCKER_MIRROR_CONFIG.md        # [活跃] Docker配置
│   │
│   ├── development/                       # 💻 开发规范 (12个文档)
│   │   ├── 开发规范文档.md                 # [活跃] 编码规范
│   │   ├── 开发计划.md                     # [活跃] 开发计划
│   │   ├── 后端API优化方案.md              # [活跃] API优化
│   │   ├── 后端API接口和业务逻辑完善方案.md  # [活跃] 业务逻辑
│   │   ├── [各功能模块完善计划]             # [活跃]
│   │
│   ├── features/                          # ✨ 功能文档 (1个文档)
│   │   └── 外卖柜监控界面使用指南.md         # [活跃]
│   │
│   ├── frontend/                          # 🎨 前端文档 (24个文档)
│   │   ├── 前端开发最佳实践与规范.md         # [活跃] 前端规范
│   │   ├── 前端开发规划.md                 # [活跃] 前端规划
│   │   ├── 前端架构优化方案.md              # [活跃] 前端架构
│   │   ├── 前端模块(heikeji-frontend)规划文档.md  # [活跃]
│   │   ├── vue3/                          # Vue3迁移文档
│   │   ├── miniprogram/                   # 小程序文档
│   │   ├── components/                    # 组件文档
│   │   ├── development/                   # 前端开发手册
│   │   ├── optimization/                  # 优化文档
│   │   ├── security/                      # 安全审计
│   │   └── api/                           # 前端API文档
│   │
│   ├── module/                            # 📦 模块文档 (7个文档)
│   │   ├── 后端服务(heikeji-mall-service)规划文档.md  # [活跃]
│   │   ├── 商品模块说明.md                 # [活跃]
│   │   ├── 订单模块说明.md                 # [活跃]
│   │   ├── 外卖服务模块说明.md              # [活跃]
│   │   ├── 订单状态定义规范.md              # [活跃]
│   │   ├── 商品推荐功能说明.md              # [活跃]
│   │   └── 商品推荐功能实现说明.md           # [活跃]
│   │
│   ├── monitoring/                        # 📊 监控 (1个文档)
│   │   └── Sentry错误追踪集成文档.md         # [活跃]
│   │
│   ├── nacos/                             # 🔧 Nacos (5个文档)
│   │   ├── NACOS_INSTALL_GUIDE.md         # [活跃]
│   │   ├── NACOS_QUICK_START_GUIDE.md     # [活跃]
│   │   ├── embedded-nacos-solution.md     # [活跃]
│   │   └── [其他Nacos文档]                  # [辅助]
│   │
│   ├── operation/                         # 🔧 运维 (1个文档)
│   │   └── 运维文档.md                     # [活跃]
│   │
│   ├── payment/                           # 💳 支付 (2个文档)
│   │   ├── 支付模块集成开发文档.md           # [活跃]
│   │   └── 订单支付API接口文档.md           # [活跃]
│   │
│   ├── performance/                       # ⚡ 性能 (2个文档)
│   │   ├── Redis-Cache-Strategy.md        # [活跃]
│   │   └── Performance-Benchmark-Testing.md  # [活跃]
│   │
│   ├── planning/                          # 📋 规划文档 (6个文档)
│   │   ├── PROGRESS_REPORT_2026-04-05.md  # [⭐最新] Phase 2进度
│   │   ├── PHASE2_OPTIMIZATION_PLAN.md    # [⭐最新] Phase 2计划
│   │   ├── New-Feature-Development-Plan.md  # [活跃]
│   │   ├── PHASE2_OPTIMIZATION_PLAN.md    # [活跃]
│   │   └── PROGRESS_REPORT_BATCH*.md       # [归档] 历史进度
│   │
│   ├── project/                           # 📁 项目管理 (20个文档) ⚠️ 需整理
│   │   ├── ★ 项目README.md                # [活跃] 项目说明
│   │   ├── ★ 快速开始指南.md               # [活跃] 快速上手
│   │   ├── ★ SERVICE_PORTS.md             # [活跃] 端口配置
│   │   ├── ★ SERVICE_STARTUP.md           # [活跃] 启动指南
│   │   ├── ★ 后续开发路线图.md             # [活跃] 路线图
│   │   ├── ★ 完整开发路线图.md             # [活跃] 完整路线图
│   │   ├── ★ 项目结构说明.md              # [活跃] 结构说明
│   │   ├── ★ 项目升级计划.md              # [活跃] 升级计划
│   │   ├── ★ 上线准备与演练计划.md         # [活跃] 上线计划
│   │   ├── ★ 项目上线前最终检查报告.md     # [活跃] 检查报告
│   │   ├── ★ 黑龙江科技大学数据导入指南.md   # [活跃] 数据导入
│   │   ├── ├─ 项目总结报告.md              # ⚠️ [过时] Spring Boot 2.7
│   │   ├── ├─ 项目说明文档.md              # ⚠️ [过时] 2024-05版本
│   │   ├── ├─ 项目整合文档.md              # ⚠️ [过时] Spring Cloud 2021
│   │   ├── ├─ 项目验收和总结报告.md         # ⚠️ [过时] 旧版技术栈
│   │   ├── ├─ 技术栈升级方案.md            # ⚠️ [待检查]
│   │   ├── └─ Spring-Boot-3.x-测试上线计划.md  # [待检查]
│   │
│   ├── project-plan/                      # 📋 项目计划 (19个文档) ⚠️ 大量重复
│   │   ├── [与docs/project/高度重叠的文档]   # ⚠️ 待去重
│   │   ├── [历史计划文档]                   # [归档候选]
│   │   └── 文档整理计划.md                  # [参考] 整理计划本身
│   │
│   ├── project-status/                    # 📊 项目状态 (3个文档)
│   │   ├── PROJECT_STATUS.md              # [过时, 已被根目录替代]
│   │   ├── NEW_FEATURES_DEVELOPMENT_REPORT.md  # [活跃]
│   │   └── CURRENT_STATUS_AND_NEXT_STEPS.md    # [活跃]
│   │
│   ├── security/                          # 🔐 安全 (4个文档)
│   │   ├── Security-Hardening-Guide.md    # [活跃] 安全加固
│   │   ├── Security-Penetration-Testing.md # [活跃] 渗透测试
│   │   ├── user_security_guide.md         # [活跃] 用户安全
│   │   └── ACCOUNT_INFO.md                # [敏感] 账号信息
│   │
│   ├── sql/                               # 🗃️ SQL脚本 (4个文件)
│   │
│   ├── test/                              # 🧪 测试 (1个文档)
│   │   └── 测试用例和质量保障措施.md        # [活跃]
│   │
│   └── troubleshooting/                   # 🔧 故障排除 (2个文档)
│       ├── NACOS_INSTALL_FIX.md           # [活跃]
│       └── YUM_UPDATE_FIX.md              # [活跃]
│
├── heikeji-web/                           # 🌐 前端项目
│   ├── README.md                          # [活跃v1.0.0] 前端项目说明
│   ├── CHANGELOG.md                       # [活跃v1.0.0] 前端变更日志
│   └── DEPLOYMENT.md                      # [活跃] 前端部署
│
├── heikeji-miniprogram/                   # 📱 小程序项目
│   └── README.md                          # [活跃] 小程序说明
│
├── heikeji-admin/                         # 🔐 管理后台
│   └── README.md                          # [活跃] 管理后台说明
│
└── heikeji-mall-service/service-payment/   # 💳 支付服务
    └── PAYMENT_API_GUIDE.md               # [活跃] 支付API
```

---

## 📊 文档状态分类

### ⭐ 活跃文档 (Active) - 当前有效

这些文档内容准确，代表当前系统状态，应保持更新。

**核心活跃文档 (必须保持准确):**
| 文档路径 | 版本 | 最后确认 |
|---------|------|----------|
| `README.md` | v2.0.0 | 2026-04-05 |
| `PROJECT_SUMMARY.md` | v2.0.0 | 2026-04-05 |
| `PROJECT_STATUS.md` | v2.0.0 | 2026-04-05 |
| `PROJECT_PROGRESS.md` | v2.1.0 | 2026-04-05 |
| `CHANGELOG.md` | v2.0.0 | 2026-04-05 |
| `docs/planning/PROGRESS_REPORT_2026-04-05.md` | v1.0 | 2026-04-05 |
| `docs/planning/PHASE2_OPTIMIZATION_PLAN.md` | v1.0 | 2026-04-05 |
| `heikeji-web/README.md` | v1.0.0 | 2026-04-05 |
| `docs/DOCUMENTATION_INDEX.md` | v3.0.0 | 2026-04-05 |

### ⚠️ 过时文档 (Outdated) - 需要归档或更新

以下文档包含过时的技术栈信息（如Spring Boot 2.7.x、Vue 2等），需要处理：

| 文档路径 | 问题 | 建议操作 |
|---------|------|----------|
| `docs/project/项目总结报告.md` | Spring Boot 2.7.x, Vue 2 | → 移入 `archive/` |
| `docs/project/项目说明文档.md` | 更新于2024-05, 信息陈旧 | → 移入 `archive/` |
| `docs/project/项目整合文档.md` | Spring Cloud 2021.x | → 移入 `archive/` |
| `docs/project/项目验收和总结报告.md` | Spring Boot 2.7.14 | → 移入 `archive/` |
| `docs/project-status/PROJECT_STATUS.md` | 已被根目录替代 | → 移入 `archive/` |
| `docs/project/技术栈升级方案.md` | 可能已执行完毕 | → 检查后归档 |
| `docs/project/Spring-Boot-3.x-测试上线计划.md` | 可能已完成 | → 检查后归档 |
| `docs/project-plan/` (大部分) | 与project/高度重复 | → 批量归档 |

### 🔲 缺失文档 (Missing) - 建议创建

以下关键文档类型在项目中缺失，建议补充：

| 优先级 | 文档名称 | 建议位置 | 说明 |
|--------|----------|----------|------|
| P0 | **需求规格说明书** | `docs/project/requirements-spec.md` | 功能需求、非功能需求、用户故事 |
| P0 | **用户使用手册** | `docs/project/user-manual.md` | 各角色操作指南 |
| P1 | **API安全规范** | `docs/security/api-security-spec.md` | 认证/授权/限流规范 |
| P1 | **数据库ER图文档** | `docs/database/database-er-diagram.md` | 表关系可视化 |
| P2 | **编码规范详细版** | `docs/development/coding-standards.md` | Git/Commit/Review规范 |

---

## 🔄 文档版本控制机制

### 版本号规则

遵循 [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

- **MAJOR** (X.0.0): 文档结构重大调整或完全重写
- **MINOR** (x.Y.0): 新增章节或重要内容更新
- **PATCH** (x.y.Z): 错别字修正、链接修复等小改动

### 文档头部模板

每个活跃文档应包含标准头部：

```markdown
# 文档标题

> **版本**: vX.Y.Z | **状态**: Active | **分类**: [类别]
> **创建日期**: YYYY-MM-DD | **最后更新**: YYYY-MM-DD
> **维护者**: [负责人] | **审核人**: [审核人]

---

## 变更记录

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| vX.Y.Z | YYYY-MM-DD | 变更描述 | name |
```

### 更新流程

1. 修改文档前，更新版本号和变更记录
2. 同步更新 `DOCUMENTATION_MANIFEST.md` 中的对应条目
3. 对于重大文档变更，同步更新 `CHANGELOG.md`
4. 每月进行一次文档审计，检查过时内容

---

## 📝 文档整理行动计划

### 第一阶段: 归档过时文档 (本次执行)
- [ ] 将8个过时的项目文档移入 `docs/archive/`
- [ ] 将 `docs/project-plan/` 中已完成的计划文档归档
- [ ] 清理 `docs/project-status/` 中的冗余文件

### 第二阶段: 补充缺失文档 (本次执行)
- [ ] 创建需求规格说明书框架
- [ ] 创建用户使用手册框架
- [ ] 创建API安全规范文档

### 第三阶段: 格式统一 (后续)
- [ ] 统一所有活跃文档的头部格式
- [ ] 统一表格、代码块样式
- [ ] 检查并修复所有内部链接

---

*本文档由黑科易购开发团队维护*
*最后审计时间: 2026-04-05*
