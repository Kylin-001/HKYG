# 黑科易购项目变更记录

## [2.0.0] - 2026-04-05

### ✨ 新增功能 (Phase 2 前端交互优化)

#### Composable 函数库
- **useCarousel** - 首页Banner轮播Composable
  - 自动轮播 (5秒间隔, 无限循环)
  - 手势滑动支持 (触摸设备)
  - 鼠标悬停暂停
  - 淡入淡出过渡动画 (500ms)
  - 指示器点击跳转
- **useSmartSearch** - 智能搜索Composable
  - 防抖搜索 (300ms)
  - 关键词高亮显示
  - 搜索历史记录管理
  - 热门搜索推荐
- **useA11y** - 无障碍访问增强Composable
  - WCAG AA标准支持
  - 键盘导航优化
  - 屏幕阅读器跳转链接
  - 焦点陷阱管理
- **useKeyboardShortcuts** - 全局键盘快捷键
  - 快捷键注册与绑定
  - 组合键支持 (Mod+K, Mod+/等)
  - 冲突检测机制
  - 自定义快捷键映射

#### 图片懒加载指令 v2.0 升级
- WebP自动格式转换和降级
- 多次错误重试机制 (最多2次, 递增延迟)
- 模糊占位图渐进式加载 (类似Medium/GitHub)
- preload预加载模式 (提前100px)
- priority优先级控制 (1-10级)
- srcset/sizes响应式图片支持
- 性能监控指标收集

#### 国际化扩展
- 新增日文 (ja-JP) 语言包
- 新增韩文 (ko-KR) 语言包
- 新增俄文 (ru-RU) 语言包
- 总计5种语言支持

### 🔄 变更

#### 技术栈升级
- Vue: 3.5 → 3.5.30
- Vite: 5.x → 8.0.1
- TypeScript: 5.2 → 5.9.3 (strict mode)
- Element Plus: 2.4 → 2.13.6
- Pinia: 2.1 → 3.0.4
- ECharts: 5.4 → 6.0.0
- Tailwind CSS: 引入 v4.2.2
- Vitest: 引入 4.1.2 单元测试框架
- Playwright: 引入 1.59.1 E2E测试框架
- GSAP: 引入 3.14.2 动画库
- Vee-Validate: 引入 4.x 表单验证库

#### 项目结构优化
- 新增 `composables/` 目录存放可复用组合式函数
- 新增 `tokens/` 目录存放设计令牌系统 (colors/spacing/typography/animation/theme)
- 扩展 `utils/security/` 安全工具模块 (xss/csrf/csp)
- 扩展 `utils/performance/` 性能监控模块 (baseline/monitor/bundleOptimizer/resourceHints)

#### 文档更新
- 更新所有核心文档至 v2.0.0 版本
- 新增 Phase 2 优化计划文档
- 更新技术栈版本号至实际版本
- 重写项目进展文档，修复文件路径引用

### 🐛 修复

- 修复懒加载指令TypeScript类型定义问题
- 修复模板语法错误
- 修正JSON数据格式问题
- 修复异步函数处理逻辑

---

## [1.5.0] - 2026-03-16

### ✨ 新增功能

#### 核心功能模块
- 二手交易模块完整实现 (后端API + 前端页面)
- 失物招领模块完整实现 (后端API + 前端页面)
- 营销活动管理页面
- 数据分析报表前端页面
- 智能客服系统 (后端API + 前端聊天界面)

#### 基础设施
- API文档聚合服务 (service-api-docs)
- 服务端口统一配置和修复
- Nacos嵌入式启动方案
- Docker Compose部署配置
- GitHub Actions CI/CD流水线

### 🔄 变更

- 微服务架构优化 (11个服务全部注册Nacos)
- 网关路由和白名单配置完善
- Redis可选依赖改造
- RabbitMQ消息队列集成
- 远程MySQL数据库连接配置

### 📝 文档

- 新增 API_DOCS.md 使用指南
- 新增 SERVICE_PORTS.md 端口配置说明
- 新增 SERVICE_STARTUP.md 启动指南
- 新增 NACOS_INSTALL_GUIDE.md 安装指南
- 新增 PROJECT_STATUS.md 状态总结

---

## [1.0.0] - 2024-10-16

### 初始版本发布

#### 核心功能
- 商品交易系统 (浏览/搜索/购买/评价)
- 外卖服务 (商家入驻/菜品管理/订单配送)
- 用户认证 (JWT + RBAC权限)
- 订单管理系统
- 支付集成

#### 技术基础
- Spring Boot 3.x 后端框架
- Vue 3 + Element Plus 前端框架
- MySQL + Redis 数据存储
- Nacos 服务注册中心
- Spring Cloud Gateway API网关

### 修复
- Element Plus loading-spinner 组件导入错误
- Vite构建Rollup兼容性问题
- TypeScript类型检查错误

### 构建优化
- Gzip和Brotli压缩配置
- 代码分割和chunk优化
- Sass弃用警告处理

---

## Version History

| Version | Date | Type | Key Changes |
|---------|------|------|-------------|
| 2.0.0 | 2026-04-05 | Major | Phase 2前端优化, 5个新Composable, 懒加载v2, 5语言国际化 |
| 1.5.0 | 2026-03-16 | Minor | 二手/失物招领模块, API文档服务, CI/CD流水线 |
| 1.0.0 | 2024-10-16 | Major | 初始版本发布, 核心电商功能 |

---

*遵循 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) 规范*
*遵循 [Semantic Versioning](https://semver.org/spec/v2.0.0.html) 版本规范*
