# 前端开发工具和环境配置

## 概述

本文档说明黑科易购项目的完整前端开发工具和环境配置，包括代码质量保证、性能优化、浏览器兼容性等各个方面。

## 核心配置文件

### 1. 代码质量保证

#### ESLint 配置 (`.eslintrc.js`)
- **规则集**: 基于 Vue 3 + TypeScript + Standard
- **主要特性**:
  - Vue 3 组合式 API 支持
  - TypeScript 严格类型检查
  - Prettier 代码格式化集成
  - 安全性规则和性能优化建议

#### Prettier 配置 (`.prettierrc`)
- **代码格式化**:
  - 单引号，尾随逗号，2空格缩进
  - 80字符行宽限制
  - Vue SFC 脚本和样式缩进

#### TypeScript 配置 (`tsconfig.json`)
- **目标**: ES2020
- **严格模式**: 启用所有严格检查
- **路径映射**: 支持 @ 别名导入
- **类型检查**: 完整的 Vue 3 + TypeScript 支持

### 2. 构建和编译配置

#### Vue CLI 配置 (`vue.config.js`)
- **开发服务器**: 
  - 主机: 0.0.0.0
  - 端口: 8080
  - 代理: /api -> localhost:8081
- **生产优化**:
  - 代码分割（第三方库分离）
  - Gzip 压缩
  - Source Map 移除
- **PWA 支持**: Service Worker 和缓存策略

#### Babel 配置 (`babel.config.js`)
- **目标浏览器**: 现代浏览器 + IE 11+
- **Polyfill**: 完整 ES6+ 特性支持
- **插件**: Vue 组件按需加载
- **缓存**: 启用 .cache/babel 目录缓存

### 3. 样式处理配置

#### PostCSS 配置 (`postcss.config.js`)
- **Autoprefixer**: 自动添加浏览器前缀
- **CSSnano**: CSS 压缩优化
- **PurgeCSS**: 移除未使用的 CSS
- **Preset Env**: CSS 现代特性支持

#### Browserlist 配置 (`.browserslistrc`)
- **覆盖率**: >1% 浏览器支持
- **版本控制**: 最新2个版本
- **兼容性**: 不支持 IE 11-

### 4. Git 忽略配置

#### Prettier Ignore (`.prettierignore`)
- **构建文件**: dist, dist-ssr, *.local
- **依赖目录**: node_modules
- **环境文件**: .env.*, *.local
- **覆盖率**: coverage, *.lcov
- **IDE 文件**: .vscode, .idea, *.swp
- **日志文件**: logs, *.log
- **缓存目录**: .cache, .sass-cache

## 开发工作流

### 1. 代码提交前检查
```bash
# 代码格式化
npm run lint:fix

# TypeScript 类型检查
npm run type-check

# 单元测试
npm run test:unit
```

### 2. 构建优化
```bash
# 开发构建
npm run build:dev

# 生产构建（带分析）
ANALYZE=true npm run build

# 性能分析
npm run build:analyze
```

### 3. 开发服务器
```bash
# 启动开发服务器
npm run dev

# Storybook 组件文档
npm run storybook

# 组件单元测试
npm run test:unit:watch
```

## 浏览器兼容性

### 支持的浏览器
- **现代浏览器**: Chrome 80+, Firefox 72+, Safari 12+, Edge 80+
- **移动端**: iOS Safari 12+, Chrome Android 80+
- **中国市场**: >1% 使用率的浏览器

### 不支持的浏览器
- Internet Explorer 11-
- 死亡版本浏览器

## 性能优化

### 1. 代码分割策略
- **第三方库分离**: 按类型分组 (vendor, element-ui, utils, charts)
- **路由懒加载**: 所有路由组件按需加载
- **组件懒加载**: 大型组件动态导入

### 2. 资源优化
- **CSS**: 自动添加前缀，压缩，Tree Shaking
- **JS**: Tree Shaking，压缩，Source Map 移除（生产）
- **图片**: WebP 格式，懒加载，响应式图片

### 3. 缓存策略
- **Service Worker**: PWA 离线缓存
- **HTTP 缓存**: 长效缓存策略
- **内存缓存**: 数据本地存储

## 开发工具推荐

### VSCode 扩展
- **Volar**: Vue 3 + TypeScript 支持
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Auto Rename Tag**: HTML 标签同步修改
- **Bracket Pair Colorizer**: 括号配对高亮

### 浏览器扩展
- **Vue.js devtools**: Vue 应用调试
- **React Developer Tools**: 通用组件调试
- **Lighthouse**: 性能分析

## 故障排除

### 常见问题

#### 1. ESLint 错误
```bash
# 重置 ESLint 缓存
npm run lint -- --cache

# 查看详细错误
npm run lint -- --verbose
```

#### 2. TypeScript 类型错误
```bash
# 检查类型
npm run type-check

# 更新类型定义
npm install @types/package-name --save-dev
```

#### 3. 构建性能问题
```bash
# 清理缓存
rm -rf node_modules/.cache
rm -rf dist

# 重新安装依赖
npm install

# 分析构建结果
npm run build:analyze
```

### 性能分析
- **开发环境**: webpack-bundle-analyzer
- **生产环境**: lighthouse-ci
- **内存使用**: Vue Performance Devtool

## 最佳实践

### 1. 代码风格
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化
- 组件命名使用 PascalCase

### 2. 性能优化
- 路由和组件懒加载
- 图片懒加载和压缩
- CSS 和 JS 压缩
- 使用 CDN 加速

### 3. 安全性
- 避免使用 `eval()` 和 `innerHTML`
- 启用 CSP (Content Security Policy)
- 定期更新依赖
- 使用 HTTPS

## 维护和更新

### 定期维护
- **每周**: 更新依赖包，检查安全漏洞
- **每月**: 性能分析和优化
- **每季度**: 工具链升级和重构

### 版本控制
- 使用语义化版本控制
- 保持 changelog 记录
- 自动化测试覆盖

---

> **注意**: 本配置基于项目需求定制，请根据实际情况调整参数和规则。