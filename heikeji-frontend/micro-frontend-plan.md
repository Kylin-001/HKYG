# 微前端架构实现方案

## 1. 技术选型

| 技术 | 版本 | 说明 |
|-----|-----|-----|
| Vite | ^5.0.0 | 构建工具 |
| vite-plugin-federation | ^1.0.0 | 实现微前端模块联邦 |
| Vue | ^3.5.1 | 主框架 |
| Vue Router | ^4.2.5 | 路由管理 |
| Pinia | ^2.1.7 | 状态管理 |

## 2. 架构设计

### 2.1 整体架构

```
┌───────────────────────────────────────────────────────────────────────────┐
│                               主应用 (Host)                              │
├─────────────────┬─────────────────┬─────────────────┬───────────────────┤
│  商品管理微应用  │  订单管理微应用  │  用户管理微应用  │  统计分析微应用    │
│   (Remote)     │   (Remote)     │   (Remote)     │   (Remote)       │
└─────────────────┴─────────────────┴─────────────────┴───────────────────┘
        │                 │                 │                 │
        └─────────────────┼─────────────────┼─────────────────┘
                          │                 │
                          ▼                 ▼
                  ┌─────────────────────────────────┐
                  │          共享模块库             │
                  │  (公共组件、工具函数、状态管理)   │
                  └─────────────────────────────────┘
```

### 2.2 模块划分

| 模块 | 类型 | 说明 |
|-----|-----|-----|
| main-app | Host | 主应用，负责路由管理和微应用加载 |
| product-microapp | Remote | 商品管理模块 |
| order-microapp | Remote | 订单管理模块 |
| user-microapp | Remote | 用户管理模块 |
| stats-microapp | Remote | 统计分析模块 |
| shared-lib | Remote | 共享模块库 |

### 2.3 目录结构

```
├── main-app/                  # 主应用
│   ├── src/                   # 主应用源码
│   ├── vite.config.ts         # 主应用Vite配置
│   └── package.json           # 主应用依赖
├── microapps/                 # 微应用目录
│   ├── product/               # 商品管理微应用
│   ├── order/                 # 订单管理微应用
│   ├── user/                  # 用户管理微应用
│   └── stats/                 # 统计分析微应用
└── shared-lib/                # 共享模块库
    ├── components/            # 公共组件
    ├── utils/                 # 工具函数
    └── store/                 # 共享状态管理
```

## 3. 实现步骤

### 3.1 第一步：安装依赖

```bash
# 安装vite-plugin-federation
npm install vite-plugin-federation --save-dev
```

### 3.2 第二步：修改主应用配置

修改 `vite.config.ts`，添加模块联邦配置：

```typescript
import federation from 'vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'main-app',
      remotes: {
        // 微应用配置
        'product-microapp': 'http://localhost:3001/assets/remoteEntry.js',
        'order-microapp': 'http://localhost:3002/assets/remoteEntry.js',
        'user-microapp': 'http://localhost:3003/assets/remoteEntry.js',
        'stats-microapp': 'http://localhost:3004/assets/remoteEntry.js',
        'shared-lib': 'http://localhost:3005/assets/remoteEntry.js'
      },
      shared: {
        // 共享依赖
        vue: {
          requiredVersion: '^3.5.1',
          singleton: true
        },
        'vue-router': {
          requiredVersion: '^4.2.5',
          singleton: true
        },
        pinia: {
          requiredVersion: '^2.1.7',
          singleton: true
        }
      }
    })
  ]
})
```

### 3.3 第三步：创建共享模块库

1. 创建 `shared-lib` 目录
2. 配置 `vite.config.ts`：

```typescript
import federation from 'vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'shared-lib',
      filename: 'remoteEntry.js',
      exposes: {
        // 暴露共享模块
        './components': './src/components/index.ts',
        './utils': './src/utils/index.ts',
        './store': './src/store/index.ts'
      },
      shared: {
        vue: {
          requiredVersion: '^3.5.1',
          singleton: true
        },
        'vue-router': {
          requiredVersion: '^4.2.5',
          singleton: true
        },
        pinia: {
          requiredVersion: '^2.1.7',
          singleton: true
        }
      }
    })
  ]
})
```

### 3.4 第四步：创建微应用

以商品管理微应用为例：

1. 创建 `microapps/product` 目录
2. 配置 `vite.config.ts`：

```typescript
import federation from 'vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'product-microapp',
      filename: 'remoteEntry.js',
      exposes: {
        // 暴露商品管理模块
        './App': './src/App.vue',
        './router': './src/router/index.ts',
        './store': './src/store/index.ts'
      },
      shared: {
        vue: {
          requiredVersion: '^3.5.1',
          singleton: true
        },
        'vue-router': {
          requiredVersion: '^4.2.5',
          singleton: true
        },
        pinia: {
          requiredVersion: '^2.1.7',
          singleton: true
        }
      }
    })
  ]
})
```

### 3.5 第五步：主应用集成微应用

1. 修改主应用路由配置：

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      component: () => import('@/views/dashboard/index.vue'),
      meta: { title: '首页', icon: 'House' }
    },
    // 微应用路由
    {
      path: '/product/*',
      component: () => import('product-microapp/App'),
      meta: { title: '商品管理', icon: 'Goods' }
    },
    {
      path: '/order/*',
      component: () => import('order-microapp/App'),
      meta: { title: '订单管理', icon: 'List' }
    },
    {
      path: '/user/*',
      component: () => import('user-microapp/App'),
      meta: { title: '用户管理', icon: 'User' }
    },
    {
      path: '/stats/*',
      component: () => import('stats-microapp/App'),
      meta: { title: '统计分析', icon: 'DataAnalysis' }
    }
  ]
})
```

2. 主应用加载微应用：

```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 导入微应用路由
import productRoutes from 'product-microapp/router'
import orderRoutes from 'order-microapp/router'
import userRoutes from 'user-microapp/router'
import statsRoutes from 'stats-microapp/router'

// 导入微应用store
import productStore from 'product-microapp/store'
import orderStore from 'order-microapp/store'
import userStore from 'user-microapp/store'
import statsStore from 'stats-microapp/store'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

// 注册微应用路由
productRoutes.forEach(route => router.addRoute(route))
orderRoutes.forEach(route => router.addRoute(route))
userRoutes.forEach(route => router.addRoute(route))
statsRoutes.forEach(route => router.addRoute(route))

// 注册微应用store
app.use(productStore)
app.use(orderStore)
app.use(userStore)
app.use(statsStore)

app.mount('#app')
```

### 3.6 第六步：微应用间通信

使用事件总线实现微应用间通信：

```typescript
// src/utils/event-bus.ts
class EventBus {
  private events: Record<string, Function[]> = {}

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(...args))
    }
  }

  off(event: string, callback: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }

  once(event: string, callback: Function) {
    const onceCallback = (...args: any[]) => {
      callback(...args)
      this.off(event, onceCallback)
    }
    this.on(event, onceCallback)
  }
}

export default new EventBus()
```

### 3.7 第七步：部署配置

| 应用 | 端口 | 访问地址 |
|-----|-----|---------|
| 主应用 | 3000 | http://localhost:3000 |
| 商品管理微应用 | 3001 | http://localhost:3001 |
| 订单管理微应用 | 3002 | http://localhost:3002 |
| 用户管理微应用 | 3003 | http://localhost:3003 |
| 统计分析微应用 | 3004 | http://localhost:3004 |
| 共享模块库 | 3005 | http://localhost:3005 |

## 4. 实现计划

| 阶段 | 任务 | 负责人 | 完成时间 |
|-----|-----|-------|---------|
| 第一阶段 | 安装依赖，修改主应用配置 | 开发人员 | 2026-01-10 |
| 第二阶段 | 创建共享模块库 | 开发人员 | 2026-01-11 |
| 第三阶段 | 将商品管理模块拆分为微应用 | 开发人员 | 2026-01-12 |
| 第四阶段 | 将订单管理模块拆分为微应用 | 开发人员 | 2026-01-13 |
| 第五阶段 | 将用户管理模块拆分为微应用 | 开发人员 | 2026-01-14 |
| 第六阶段 | 将统计分析模块拆分为微应用 | 开发人员 | 2026-01-15 |
| 第七阶段 | 实现微应用间通信 | 开发人员 | 2026-01-16 |
| 第八阶段 | 测试和部署 | 开发人员 | 2026-01-17 |

## 5. 注意事项

1. **版本兼容**：确保所有微应用使用相同版本的Vue、Vue Router和Pinia
2. **样式隔离**：使用CSS Modules或Shadow DOM确保样式隔离
3. **状态管理**：共享状态使用Pinia，确保单例模式
4. **路由管理**：主应用负责顶层路由，微应用负责内部路由
5. **性能优化**：使用懒加载和代码分割优化加载性能
6. **错误处理**：添加全局错误处理，确保单个微应用错误不影响整个应用
7. **测试策略**：每个微应用独立测试，主应用集成测试

## 6. 预期效果

1. **技术栈统一**：使用Vue 3 + TypeScript + Vite，技术栈统一
2. **独立开发**：各微应用可以独立开发、测试和部署
3. **共享模块**：公共组件、工具函数、状态管理等可以共享
4. **灵活扩展**：可以随时添加新的微应用，扩展功能
5. **性能优化**：支持模块懒加载，减少初始加载时间
6. **易于维护**：各模块职责清晰，易于维护和升级

## 7. 风险评估

| 风险 | 概率 | 影响 | 缓解措施 |
|-----|-----|-----|---------|
| 依赖冲突 | 高 | 应用无法正常运行 | 严格控制依赖版本，使用singleton模式 |
| 样式冲突 | 中 | 界面样式混乱 | 使用CSS Modules或Shadow DOM |
| 性能问题 | 中 | 加载缓慢 | 使用懒加载和代码分割，优化资源加载 |
| 通信复杂 | 中 | 微应用间通信困难 | 使用事件总线或共享状态管理 |
| 部署复杂 | 中 | 部署流程复杂 | 自动化部署脚本，CI/CD配置 |

## 8. 后续优化方向

1. **动态注册**：支持动态注册微应用，无需修改主应用代码
2. **权限管理**：实现统一的权限管理，控制微应用访问权限
3. **监控告警**：添加微应用性能监控和错误告警
4. **热更新**：支持微应用热更新，无需重启主应用
5. **离线支持**：实现PWA支持，支持离线访问
6. **国际化**：支持多语言切换，国际化支持

## 9. 结论

本方案采用vite-plugin-federation实现微前端架构，与现有技术栈兼容，配置简单，支持模块共享和懒加载。通过将现有业务模块拆分为独立的微应用，可以实现独立开发、测试和部署，提高开发效率和系统可维护性。同时，通过共享模块库，可以减少代码冗余，提高代码复用率。

该方案的实施将有助于提高系统的可扩展性和可维护性，为后续功能扩展和技术升级打下良好的基础。