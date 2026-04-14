# 黑科易购项目文档索引

> **版本**: v3.1.0 | **最后更新**: 2026-04-05
> **完整文档清单**: 请参阅 [DOCUMENTATION_MANIFEST.md](DOCUMENTATION_MANIFEST.md)

---

## 📂 文档目录结构

```
docs/
├── DOCUMENTATION_INDEX.md          # 📑 本文档 - 导航索引
├── DOCUMENTATION_MANIFEST.md       # 📋 文档总清单 (唯一事实来源)
├── PRODUCTION_DEPLOYMENT_STANDARD.md # 🏭 生产部署标准
│
├── architecture/                    # 🏛️ 架构设计 (6个)
├── api/                            # 🔌 API接口 (2个)
├── archive/                        # 📦 归档文档 (历史/过时) ⭐新增
│   └── ARCHIVE_README.md           # 归档说明
├── backend/                        # 🔧 后端 (1个)
├── database/                       # 🗄️ 数据库 (12个)
├── deployment/                     # 🚀 部署运维 (7个)
├── development/                    # 💻 开发规范 (12个)
├── features/                       # ✨ 功能文档 (1个)
├── frontend/                       # 🎨 前端文档 (24个)
├── module/                         # 📦 模块文档 (7个)
├── monitoring/                     # 📊 监控 (1个)
├── nacos/                          # 🔧 Nacos (5个)
├── operation/                      # 🔧 运维 (1个)
├── payment/                        # 💳 支付 (2个)
├── performance/                    # ⚡ 性能 (2个)
├── planning/                       # 📋 规划文档 (6个, 含最新Phase 2)
├── project/                        # 📁 项目管理 (22个) ⭐含新建
│   ├── requirements-specification.md   # [⭐新] 需求规格说明书
│   ├── user-manual.md                  # [⭐新] 用户使用手册
│   ├── ★ 项目README / 快速开始 / 端口配置 等  # 活跃文档
│   └── ├─ [过时文档4个]                 # 待归档 → archive/
├── project-plan/                   # 📋 项目计划 (19个, 大量重复待整理)
├── project-status/                 # 📊 项目状态 (3个)
├── security/                       # 🔐 安全 (5个) ⭐含新建
│   └── api-security-specification.md   # [⭐新] API安全规范
├── sql/                            # 🗃️ SQL脚本 (4个)
├── test/                           # 🧪 测试 (1个)
└── troubleshooting/                # 🔧 故障排除 (2个)
```

**总计**: ~164个文档文件 | **活跃**: ~25个 | **归档**: ~120+ | **缺失已补**: 3个

---

## 📚 核心文档速查

### ⭐ 必读文档 (项目入口)

| 文档 | 路径 | 说明 |
|------|------|------|
| **项目主文档** | [`README.md`](../README.md) | 项目概览、技术栈、快速启动 |
| **项目总结** | [`PROJECT_SUMMARY.md`](../PROJECT_SUMMARY.md) | 完整项目总结报告 v2.0.0 |
| **项目状态** | [`PROJECT_STATUS.md`](../PROJECT_STATUS.md) | 当前状态、完成度、服务运行情况 |
| **项目进展** | [`PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md) | 详细开发进展、Phase 2 优化记录 |
| **变更日志** | [`CHANGELOG.md`](../CHANGELOG.md) | 版本变更历史 |

### 🏗️ 架构与设计

| 文档 | 说明 |
|------|------|
| [架构文档](architecture/架构文档.md) | 系统架构总览 |
| [架构优化总结](architecture/架构优化总结文档.md) | 优化详情 |
| [微前端架构](architecture/Micro-Frontend-Architecture.md) | 前端架构设计 |
| [特色校园服务平台架构](architecture/黑龙江科技大学特色校园服务平台架构设计.md) | 业务架构设计 |

### 🚀 部署与运维

| 文档 | 说明 |
|------|------|
| [部署文档](deployment/部署文档.md) | 主部署指南 |
| [简化部署指南](deployment/DEPLOYMENT_SIMPLIFIED.md) | 快速部署 |
| [全面部署和运维指南](deployment/全面部署和运维指南.md) | 完整运维手册 |
| [Nacos安装指南](nacos/NACOS_INSTALL_GUIDE.md) | Nacos部署 |
| [生产部署标准](PRODUCTION_DEPLOYMENT_STANDARD.md) | 生产环境标准 |

### 🔌 API 与接口

| 文档 | 说明 |
|------|------|
| [API接口文档](api/API接口文档.md) | 接口定义 |
| [完整API文档](api/API_DOCUMENTATION_COMPLETE.md) | 全量API文档 |
| [API安全规范](security/api-security-specification.md) | ⭐ 认证/授权/限流规范 |
| [支付API指南](../heikeji-mall-service/service-payment/PAYMENT_API_GUIDE.md) | 支付接口说明 |

### 🗄️ 数据库

| 文档 | 说明 |
|------|------|
| [数据库设计文档](database/数据库设计文档.md) | 表结构设计 |
| [SQL完整指南](database/SQL_Complete_Guide.md) | SQL操作手册 |
| [数据库导入说明](database/数据库导入说明.md) | 数据导入流程 |
| [性能优化方案](database/数据库设计和性能优化方案.md) | DB优化 |

### 💻 开发相关

| 文档 | 说明 |
|------|------|
| [开发规范文档](development/开发规范文档.md) | 编码规范 |
| [开发计划](development/开发计划.md) | 开发时间表 |
| [后端API优化方案](development/后端API优化方案.md) | API优化 |
| [需求规格说明书](project/requirements-specification.md) | ⭐ 功能需求定义 |
| [用户使用手册](project/user-manual.md) | ⭐ 操作指南 |

### 🎨 前端相关

| 文档 | 说明 |
|------|------|
| [前端README](../heikeji-web/README.md) | 前端项目完整说明 |
| [前端开发最佳实践](frontend/前端开发最佳实践与规范.md) | 前端规范 |
| [前端架构优化](frontend/前端架构优化方案.md) | 前端架构 |
| [Vue3迁移进度](frontend/vue3/Migration-Progress.md) | 迁移状态 |
| [小程序文档](frontend/miniprogram/README.md) | 小程序说明 |
| [组件设计规范](frontend/components/Component-Design-Guidelines.md) | 组件规范 |

### 🔐 安全相关

| 文档 | 说明 |
|------|------|
| [安全加固指南](security/Security-Hardening-Guide.md) | 安全加固措施 |
| [渗透测试报告](security/Security-Penetration-Testing.md) | 安全测试结果 |
| [用户安全指南](security/user_security_guide.md) | 用户安全建议 |
| [API安全规范](security/api-security-specification.md) | ⭐ API安全详细规范 |

### 📋 规划与进展

| 文档 | 说明 |
|------|------|
| [Phase 2 进度报告](planning/PROGRESS_REPORT_2026-04-05.md) | ⭐ 最新: Phase 2优化进展 |
| [Phase 2 优化计划](planning/PHASE2_OPTIMIZATION_PLAN.md) | ⭐ 12周实施路线图 |
| [后续开发路线图](project/后续开发路线图.md) | 未来规划 |
| [完整开发路线图](project/完整开发路线图.md) | 全量路线图 |

### 📦 模块文档

| 文档 | 说明 |
|------|------|
| [后端服务规划](module/后端服务(heikeji-mall-service)规划文档.md) | 服务模块说明 |
| [商品模块](module/商品模块说明.md) | 商品功能 |
| [订单模块](module/订单模块说明.md) | 订单功能 |
| [外卖服务模块](module/外卖服务模块说明.md) | 外卖功能 |

---

## 👤 按角色导航

### 👨‍💻 开发人员 (入门必读)

**阅读顺序建议:**
1. [README.md](../README.md) → 了解项目全貌
2. [快速开始指南](project/快速开始指南.md) → 环境搭建
3. [开发规范文档](development/开发规范文档.md) → 编码规范
4. [API接口文档](api/API接口文档.md) → 接口说明
5. [数据库设计文档](database/数据库设计文档.md) → 数据模型

### 🚀 运维人员

1. [部署文档](deployment/部署文档.md) → 部署步骤
2. [全面部署和运维指南](deployment/全面部署和运维指南.md) → 运维手册
3. [Nacos安装指南](nacos/NACOS_INSTALL_GUIDE.md) → 中间件部署
4. [运维文档](operation/运维文档.md) → 日常运维
5. [故障排除](troubleshooting/) → 问题解决

### 📊 项目经理

1. [项目总结报告](../PROJECT_SUMMARY.md) → 项目概况
2. [项目状态](../PROJECT_STATUS.md) → 当前进度
3. [需求规格说明书](project/requirements-specification.md) → 需求范围
4. [后续开发路线图](project/后续开发路线图.md) → 未来规划
5. [完整开发路线图](project/完整开发路线图.md) → 全量规划

### 🔒 安全审计人员

1. [安全加固指南](security/Security-Hardening-Guide.md) → 加固措施
2. [API安全规范](security/api-security-specification.md) → API安全
3. [渗透测试报告](security/Security-Penetration-Testing.md) → 测试结果
4. [安全审计报告](frontend/security/security-audit-report.md) → 前端安全

### 👤 普通用户

1. [用户使用手册](project/user-manual.md) → 操作指南
2. [外卖柜监控指南](features/外卖柜监控界面使用指南.md) → 功能使用

---

## 📝 文档更新记录

| 日期 | 更新内容 | 版本 |
|------|----------|------|
| 2026-04-05 | 全面整理文档体系: 新增MANIFEST/需求规格/用户手册/安全规范/归档目录 | 3.1.0 |
| 2026-04-05 | 同步更新核心文档至v2.0.0, 新增Phase 2文档索引 | 3.0.0 |
| 2026-03-30 | 合并API文档、精简部署文档、统一计划文档位置 | 2.0.0 |
| 2026-03-16 | 初始文档索引 | 1.0.0 |

---

## 🆕 本轮更新新增文档 (2026-04-05)

| 文档 | 位置 | 类型 | 说明 |
|------|------|------|------|
| **DOCUMENTATION_MANIFEST.md** | docs/ | 总清单 | 所有文档的单一事实来源 |
| **ARCHIVE_README.md** | docs/archive/ | 归档说明 | 过时文档存放指引 |
| **requirements-specification.md** | docs/project/ | 需求规格 | 功能/非功能需求定义 |
| **user-manual.md** | docs/project/ | 用户手册 | 各角色操作指南 |
| **api-security-specification.md** | docs/security/ | 安全规范 | API认证/授权/限流详细规范 |

## ⚠️ 待处理项

- [ ] 将 `docs/project/` 中4个过时文档移入 `archive/`
- [ ] 整理 `docs/project-plan/` 中的重复文档
- [ ] 统一所有活跃文档的头部格式模板
- [ ] 补充数据库ER图文档

---

**文档版本**: 3.1.0
**最后更新**: 2026-04-05
**维护团队**: 黑科易购开发团队
