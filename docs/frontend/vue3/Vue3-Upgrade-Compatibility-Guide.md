# Vue 3 升级兼容性保障指南

## 概述

本文档详细说明黑科易购校园服务平台前端项目从 Vue 2 升级到 Vue 3 后的兼容性保障措施，包括组件重构、API 变更处理、性能优化和测试策略。

## 1. 核心组件重构验证

### 1.1 布局组件

已完成从 Options API 到 Composition API 的重构：

- **AppLayout.vue**: 主布局容器，管理侧边栏状态和响应式布局
- **HeaderBar.vue**: 头部导航栏，包含用户信息和菜单控制
- **Sidebar.vue**: 侧边栏导航，支持折叠和子菜单
- **AppMain.vue**: 主内容区域，负责路由视图渲染

### 1.2 重构原则

1. **类型安全**: 所有组件使用 TypeScript 定义类型
2. **逻辑分离**: 使用 Composition API 更好地组织组件逻辑
3. **性能优化**: 减少不必要的响应式依赖
4. **兼容性保持**: 保持组件接口和行为一致性

## 2. Vue 3 API 变更处理

### 2.1 主要 API 变更

| Vue 2 API | Vue 3 替代方案 | 应用状态 |
|----------|--------------|--------|
| `$emit` | `defineEmits` | ✅ 已处理 |
| `props` | `defineProps` | ✅ 已处理 |
| `created/mounted` | `onMounted` | ✅ 已处理 |
| `computed` | `computed()` | ✅ 已处理 |
| `watch` | `watch()` | ✅ 已处理 |
| `data()` | `ref()/reactive()` | ✅ 已处理 |

### 2.2 生命周期钩子映射

已确保所有组件的生命周期钩子正确迁移：

- beforeCreate → 使用 setup()
- created → 使用 setup()
- beforeMount → onBeforeMount
- mounted → onMounted
- beforeUpdate → onBeforeUpdate
- updated → onUpdated
- beforeUnmount → onBeforeUnmount
- unmounted → onUnmounted

## 3. 组件兼容性测试

### 3.1 测试文件结构

已创建 Vue 3 兼容的单元测试：

```
tests/unit/layout/
├── AppLayout.spec.ts
└── components/
    ├── AppMain.spec.ts
    ├── HeaderBar.spec.ts
    └── Sidebar.spec.ts
```

### 3.2 测试重点

- **组件渲染**: 确保组件正确渲染且样式一致
- **Props 传递**: 验证 props 正常工作
- **事件触发**: 确保事件正确发出和处理
- **响应式行为**: 验证响应式状态更新
- **路由集成**: 确保与 Vue Router 4 正确集成

## 4. 兼容性问题及解决方案

### 4.1 Element Plus 迁移

- 所有 Element UI 组件已替换为 Element Plus 对应组件
- 图标系统更新为 @element-plus/icons-vue
- 全局配置已调整以适应 Element Plus API

### 4.2 防抖/节流函数

- 原 `$debounce` 实例方法已替换为组合式 API 中的显式导入
- 创建了可复用的防抖函数 `debounce`

### 4.3 路由变更

- 已更新为 Vue Router 4 的新 API
- 使用 `useRoute()` 和 `useRouter()` 替代 `this.$route` 和 `this.$router`

## 5. 构建与部署兼容性

### 5.1 Vite 构建配置

- 已迁移到 Vite 构建工具
- 配置了 TypeScript、Vue 和 SCSS 支持
- 添加了构建优化插件

### 5.2 浏览器兼容性

确保支持的浏览器范围：

- Chrome ≥ 90
- Firefox ≥ 88
- Safari ≥ 14
- Edge ≥ 90
- iOS Safari ≥ 14
- Android Chrome ≥ 90

## 6. 持续集成与测试

### 6.1 推荐的 CI/CD 检查

- **TypeScript 类型检查**: `vue-tsc --noEmit`
- **ESLint 检查**: `eslint . --ext .vue,.ts`
- **构建验证**: `npm run build`
- **预览验证**: 部署到预览环境验证功能

### 6.2 开发环境兼容性检查

开发时推荐执行以下检查确保兼容性：

1. 确保 Node.js 版本 ≥ 16.0.0
2. 使用最新的 npm 或 yarn 安装依赖
3. 运行 `npm run type-check` 检查类型错误
4. 运行 `npm run build` 验证构建是否成功

## 7. 性能监控

### 7.1 推荐的监控指标

- **首次内容绘制 (FCP)**: 应小于 1.8s
- **最大内容绘制 (LCP)**: 应小于 2.5s
- **首次输入延迟 (FID)**: 应小于 100ms
- **累积布局偏移 (CLS)**: 应小于 0.1

### 7.2 性能优化建议

- 组件懒加载
- 路由按需加载
- 图片优化和延迟加载
- 组件缓存策略

## 8. 后续维护注意事项

1. **避免使用已废弃的 API**
2. **优先使用 Composition API 编写新组件**
3. **确保类型定义正确**
4. **定期运行测试和类型检查**
5. **关注 Vue 生态系统更新**

---

本文档将随项目发展持续更新，确保所有组件和功能在 Vue 3 环境下正常运行。