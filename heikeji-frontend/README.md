# 黑科易购前端项目

## 项目简介

黑科易购校园电商平台前端项目，基于Vue 3 + TypeScript + Vite构建，为黑龙江科技大学师生提供便捷的校园电商服务。

## 技术栈

### 核心框架
- **Vue 3.5.1** - 渐进式JavaScript框架
- **TypeScript 5.2.2** - JavaScript超集
- **Vite 5.0.0** - 下一代前端构建工具
- **Vue Router 4.2.5** - Vue.js官方路由
- **Pinia 2.1.7** - Vue.js状态管理

### UI框架
- **Element Plus 2.4.4** - 基于Vue 3的组件库
- **@element-plus/icons-vue 2.3.1** - Element Plus图标库

### 工具库
- **@vueuse/core 10.7.2** - Vue Composition API工具集
- **axios 1.6.7** - HTTP客户端
- **dayjs 1.11.10** - 轻量级日期处理库
- **lodash-es 4.17.21** - JavaScript实用工具库
- **js-cookie 3.0.5** - Cookie操作库

### 测试框架
- **Vitest 4.0.16** - 下一代测试框架
- **@vue/test-utils 2.4.3** - Vue.js单元测试工具
- **@vitest/ui 1.1.0** - Vitest UI界面
- **@vitest/coverage-v8 1.1.1** - 测试覆盖率工具
- **Playwright 1.41.1** - 端到端测试框架

### 代码质量
- **ESLint 8.57.0** - JavaScript代码检查工具
- **@typescript-eslint/parser 7.1.1** - TypeScript ESLint解析器
- **@typescript-eslint/eslint-plugin 7.1.1** - TypeScript ESLint插件
- **Prettier 3.2.5** - 代码格式化工具
- **Stylelint 16.2.1** - CSS代码检查工具

### 构建工具
- **Vite 5.0.0** - 前端构建工具
- **unplugin-vue-components 0.26.0** - Vue组件自动导入
- **unplugin-auto-import 0.17.5** - API自动导入
- **sass 1.71.1** - CSS预处理器

## 项目结构

```
heikeji-frontend/
├── src/
│   ├── api/              # API接口
│   ├── assets/           # 静态资源
│   ├── components/        # 公共组件
│   │   ├── ui/          # UI组件
│   │   └── business/    # 业务组件
│   ├── composables/      # 组合式函数
│   ├── directives/       # 自定义指令
│   ├── layout/          # 布局组件
│   ├── router/          # 路由配置
│   ├── store/           # 状态管理
│   ├── styles/          # 全局样式
│   ├── types/           # TypeScript类型定义
│   ├── utils/           # 工具函数
│   └── views/           # 页面组件
├── e2e/               # 端到端测试
├── public/             # 公共资源
└── tests/              # 测试配置
```

## 开发指南

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 测试

### 运行单元测试
```bash
npm run test:unit
```

### 运行测试覆盖率
```bash
npm run test:coverage
```

### 运行端到端测试
```bash
npm run test:e2e
```

### 测试UI界面
```bash
npm run test:ui
```

## 代码质量

### 运行ESLint检查
```bash
npm run lint
```

### 自动修复ESLint问题
```bash
npm run lint:fix
```

### 运行Prettier格式化
```bash
npm run format
```

### 检查Prettier格式
```bash
npm run format:check
```

### 运行Stylelint检查
```bash
npm run lint:style
```

## 测试覆盖情况

### 单元测试
- **测试文件数**: 20个
- **测试用例数**: 约175个
- **测试覆盖率**: 约77%

### 端到端测试
- **测试文件数**: 6个
- **测试用例数**: 约50个

### 性能测试
- **测试文件数**: 3个
- **测试用例数**: 约15个

## CI/CD

### GitHub Actions
项目配置了GitHub Actions CI/CD流水线，包括：
- 代码检查（Lint）
- 单元测试
- 端到端测试
- 构建项目
- 自动部署

### GitLab CI
项目配置了GitLab CI流水线，包括：
- 代码检查（Lint）
- 单元测试
- 端到端测试
- 构建项目
- 部署到测试环境
- 部署到生产环境

## 文档

### 开发文档
- [测试开发总结](./测试开发总结.md) - 第一阶段测试开发总结
- [测试开发进度报告-第二阶段](./测试开发进度报告-第二阶段.md) - 第二阶段测试开发进度报告
- [测试开发完成总结报告](./测试开发完成总结报告.md) - 测试开发完成总结报告
- [测试最佳实践与规范](./测试最佳实践与规范.md) - 测试规范和最佳实践

### 设计文档
- [组件设计规范](./组件设计规范.md) - 组件设计规范
- [Frontend Development Plan v2.0](./Frontend-Development-Plan-v2.0.md) - 前端开发计划

### 优化文档
- [优化文档](./optimization-documentation.md) - 项目优化文档
- [Frontend Optimization Project Summary](./Frontend-Optimization-Project-Summary.md) - 前端优化项目总结

### 安全文档
- [安全审计报告](./security-audit-report.md) - 安全审计报告

## 测试最佳实践

### 测试文件组织
```
src/
├── components/
│   ├── ui/
│   │   ├── StatusTag.vue
│   │   └── StatusTag.test.ts
│   └── business/
│       ├── ProductCard.vue
│       └── ProductCard.test.ts
├── store/
│   └── modules/
│       ├── user.ts
│       └── user.test.ts
├── api/
│   ├── user.ts
│   └── user.test.ts
├── utils/
│   ├── index.ts
│   └── index.test.ts
├── router/
│   ├── index.ts
│   └── index.test.ts
└── views/
    ├── login/
    │   └── index.vue
    │   └── index.test.ts
    └── dashboard/
        └── index.vue
        └── index.test.ts
```

### 测试命名规范
- 测试套件：使用`describe`描述测试组
- 测试用例：使用`it`描述具体测试
- 测试名称：使用描述性的名称，如`should render correctly`

### 测试覆盖率目标
- **语句覆盖率（Statements）**: ≥ 70%
- **分支覆盖率（Branches）**: ≥ 70%
- **函数覆盖率（Functions）**: ≥ 70%
- **行覆盖率（Lines）**: ≥ 70%

## 贡献指南

### 开发流程
1. 从main分支创建feature分支
2. 编写代码和测试
3. 运行测试确保通过
4. 提交代码并推送到远程仓库
5. 创建Pull Request

### 代码规范
- 遵循ESLint规则
- 使用Prettier格式化代码
- 编写单元测试
- 保持测试覆盖率≥70%

## 部署

### 环境变量
创建`.env.production`文件：
```env
VITE_API_BASE_URL=https://api.heikeji.com
VITE_APP_TITLE=黑科易购
```

### 构建命令
```bash
npm run build
```

### 部署命令
```bash
# 使用CI/CD自动部署
# 或手动部署dist目录到服务器
```

## 常见问题

### Q: 如何添加新的API接口？
A: 在`src/api/`目录下创建对应的API文件，使用`request`工具进行HTTP请求。

### Q: 如何添加新的页面？
A: 在`src/views/`目录下创建页面组件，并在`src/router/`中配置路由。

### Q: 如何添加新的状态管理？
A: 在`src/store/modules/`目录下创建对应的store文件，使用Pinia进行状态管理。

### Q: 如何运行测试？
A: 运行`npm run test:unit`运行单元测试，运行`npm run test:e2e`运行端到端测试。

## 许可证

MIT License

## 联系方式

- 项目地址: [GitHub](https://github.com/yourusername/heikeji-frontend)
- 问题反馈: [Issues](https://github.com/yourusername/heikeji-frontend/issues)

---

**最后更新**: 2026-03-04
**版本**: 1.0.0
