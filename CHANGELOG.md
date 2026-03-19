# 黑科易购项目变更记录

## 2024-10-16

### 修复
- 修复 Element Plus loading-spinner 组件导入错误
  - 在以下文件中替换 el-loading-spinner 组件为自定义加载动画：
    - src/views/order/detail.vue
    - src/views/app/order/list.vue
    - src/views/app/product/search.vue
    - src/components/VirtualTable.vue
  - 添加了自定义加载动画的 CSS 样式

### 构建优化
- 修复 vite.config.optimized.ts 中的 Rollup 3+ 兼容性问题
  - 移除了已弃用的选项：hashDigest、hashDigestLength、hashFunction
  - 暂时禁用了 rollup-plugin-visualizer 插件以解决路径问题
- 安装了缺失的 terser 依赖用于代码压缩
- 优化了构建配置，启用了 gzip 和 brotli 压缩

### 部署
- 确认项目支持传统部署和 Docker Compose 部署两种方式
- 部署脚本包含了完整的部署流程，包括依赖检查、构建、启动服务和 Nginx 配置等步骤

## 性能优化
- 优化了构建输出，生成了压缩后的静态文件
- 配置了合理的代码分割和 chunk 优化策略

## 注意事项
- TypeScript 类型检查发现了一些错误，主要集中在测试文件和工具文件中
- 这些错误不会直接影响生产构建，但需要在后续开发中修复
- 构建过程中出现了一些 Sass @import 和 ::v-deep 的弃用警告，建议在后续开发中迁移到新的语法