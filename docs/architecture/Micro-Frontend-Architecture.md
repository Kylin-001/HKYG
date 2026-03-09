# HKYG项目微前端架构实现方案

## 概述

本方案将HKYG的单体前端应用拆分为微前端架构，使用Vue 3和Module Federation实现独立开发、部署和运行的微应用。

## 微前端架构设计

### 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         主应用 (Host)                         │
│                    Vue 3 + Router + State                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  商品管理微应用  │  │  订单管理微应用  │  │ 用户管理微应用│ │
│  │  (Remote)        │  │  (Remote)        │  │  (Remote)    │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  统计分析微应用  │  │  共享模块库     │                    │
│  │  (Remote)        │  │  (Remote)        │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

### 技术选型

- **主框架**: Vue 3 + TypeScript
- **构建工具**: Vite 5.x
- **模块联邦**: @originjs/vite-plugin-federation
- **状态管理**: Pinia 2.x (共享Store)
- **路由**: Vue Router 4.x
- **UI组件库**: Element Plus 2.x
- **通信方式**: Custom Events + Shared Store
- **样式隔离**: CSS Modules + BEM命名规范

### 应用拆分

#### 1. 主应用 (heikeji-host)

**职责**:
- 路由管理和微应用加载
- 全局状态管理
- 公共组件和工具库
- 权限控制
- 登录页和首页

**技术栈**:
- Vue 3 + TypeScript
- Vite 5.x
- Vue Router 4.x
- Pinia 2.x
- Element Plus 2.x

**目录结构**:
```
heikeji-host/
├── src/
│   ├── components/       # 公共组件
│   ├── layouts/         # 布局组件
│   ├── router/          # 路由配置
│   ├── stores/          # 全局状态
│   ├── utils/           # 工具函数
│   ├── views/           # 页面组件
│   │   ├── Home.vue
│   │   └── Login.vue
│   ├── App.vue
│   └── main.ts
├── vite.config.ts
└── package.json
```

#### 2. 商品管理微应用 (micro-product)

**职责**:
- 商品列表和详情
- 商品分类管理
- 商品搜索
- 商品评价

**技术栈**:
- Vue 3 + TypeScript
- Vite 5.x
- Element Plus 2.x

**目录结构**:
```
micro-product/
├── src/
│   ├── components/       # 商品相关组件
│   ├── router/          # 商品路由
│   ├── stores/          # 商品状态
│   ├── api/             # 商品API
│   ├── views/           # 商品页面
│   │   ├── ProductList.vue
│   │   ├── ProductDetail.vue
│   │   └── CategoryManage.vue
│   ├── App.vue
│   └── main.ts
├── vite.config.ts
└── package.json
```

#### 3. 订单管理微应用 (micro-order)

**职责**:
- 订单列表和详情
- 购物车管理
- 订单支付
- 退款申请

**技术栈**:
- Vue 3 + TypeScript
- Vite 5.x
- Element Plus 2.x

**目录结构**:
```
micro-order/
├── src/
│   ├── components/       # 订单相关组件
│   ├── router/          # 订单路由
│   ├── stores/          # 订单状态
│   ├── api/             # 订单API
│   ├── views/           # 订单页面
│   │   ├── OrderList.vue
│   │   ├── OrderDetail.vue
│   │   └── Cart.vue
│   ├── App.vue
│   └── main.ts
├── vite.config.ts
└── package.json
```

#### 4. 用户管理微应用 (micro-user)

**职责**:
- 用户信息管理
- 地址管理
- 会员等级
- 收藏夹

**技术栈**:
- Vue 3 + TypeScript
- Vite 5.x
- Element Plus 2.x

**目录结构**:
```
micro-user/
├── src/
│   ├── components/       # 用户相关组件
│   ├── router/          # 用户路由
│   ├── stores/          # 用户状态
│   ├── api/             # 用户API
│   ├── views/           # 用户页面
│   │   ├── UserProfile.vue
│   │   ├── AddressManage.vue
│   │   └── MemberLevel.vue
│   ├── App.vue
│   └── main.ts
├── vite.config.ts
└── package.json
```

#### 5. 统计分析微应用 (micro-analytics)

**职责**:
- 数据看板
- 销售统计
- 用户分析
- 报表导出

**技术栈**:
- Vue 3 + TypeScript
- Vite 5.x
- Element Plus 2.x
- ECharts 5.x

**目录结构**:
```
micro-analytics/
├── src/
│   ├── components/       # 图表组件
│   ├── router/          # 分析路由
│   ├── stores/          # 分析状态
│   ├── api/             # 分析API
│   ├── views/           # 分析页面
│   │   ├── Dashboard.vue
│   │   ├── SalesReport.vue
│   │   └── UserAnalysis.vue
│   ├── App.vue
│   └── main.ts
├── vite.config.ts
└── package.json
```

#### 6. 共享模块库 (micro-shared)

**职责**:
- 公共组件库
- 工具函数库
- TypeScript类型定义
- API接口封装
- 样式主题

**技术栈**:
- Vue 3 + TypeScript
- Vite 5.x
- Element Plus 2.x

**目录结构**:
```
micro-shared/
├── src/
│   ├── components/       # 公共组件
│   │   ├── Header.vue
│   │   ├── Sidebar.vue
│   │   └── Loading.vue
│   ├── composables/      # 组合式函数
│   │   ├── useAuth.ts
│   │   ├── useRequest.ts
│   │   └── usePermission.ts
│   ├── utils/           # 工具函数
│   │   ├── request.ts
│   │   ├── storage.ts
│   │   └── validate.ts
│   ├── types/           # 类型定义
│   │   ├── index.ts
│   │   └── api.ts
│   ├── api/             # API基础
│   │   └── index.ts
│   └── styles/          # 样式主题
│       ├── variables.scss
│       ├── mixins.scss
│       └── theme.scss
├── vite.config.ts
└── package.json
```

## 配置实现

### 主应用 Vite 配置

```typescript
// heikeji-host/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host-app',
      remotes: {
        microProduct: {
          external: 'http://localhost:5001/assets/remoteEntry.js',
          externalType: 'url',
          format: 'esm',
        },
        microOrder: {
          external: 'http://localhost:5002/assets/remoteEntry.js',
          externalType: 'url',
          format: 'esm',
        },
        microUser: {
          external: 'http://localhost:5003/assets/remoteEntry.js',
          externalType: 'url',
          format: 'esm',
        },
        microAnalytics: {
          external: 'http://localhost:5004/assets/remoteEntry.js',
          externalType: 'url',
          format: 'esm',
        },
      },
      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.4.0',
        },
        'vue-router': {
          singleton: true,
          requiredVersion: '^4.2.0',
        },
        pinia: {
          singleton: true,
          requiredVersion: '^2.1.0',
        },
        'element-plus': {
          singleton: true,
          requiredVersion: '^2.8.0',
        },
      },
    }),
  ],
  server: {
    port: 5000,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
  },
})
```

### 微应用 Vite 配置

```typescript
// micro-product/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'micro-product',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductList': './src/views/ProductList.vue',
        './ProductDetail': './src/views/ProductDetail.vue',
        './CategoryManage': './src/views/CategoryManage.vue',
        './ProductStore': './src/stores/product.ts',
        './ProductApi': './src/api/product.ts',
      },
      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.4.0',
        },
        'vue-router': {
          singleton: true,
          requiredVersion: '^4.2.0',
        },
        pinia: {
          singleton: true,
          requiredVersion: '^2.1.0',
        },
        'element-plus': {
          singleton: true,
          requiredVersion: '^2.8.0',
        },
        'micro-shared': {
          singleton: true,
        },
      },
    }),
  ],
  server: {
    port: 5001,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
  },
})
```

## 路由实现

### 主应用路由

```typescript
// heikeji-host/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/product',
    children: [
      {
        path: 'list',
        name: 'ProductList',
        component: defineAsyncComponent(() => import('microProduct/ProductList')),
      },
      {
        path: 'detail/:id',
        name: 'ProductDetail',
        component: defineAsyncComponent(() => import('microProduct/ProductDetail')),
      },
      {
        path: 'category',
        name: 'CategoryManage',
        component: defineAsyncComponent(() => import('microProduct/CategoryManage')),
      },
    ],
  },
  {
    path: '/order',
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: defineAsyncComponent(() => import('microOrder/OrderList')),
      },
      {
        path: 'detail/:id',
        name: 'OrderDetail',
        component: defineAsyncComponent(() => import('microOrder/OrderDetail')),
      },
      {
        path: 'cart',
        name: 'Cart',
        component: defineAsyncComponent(() => import('microOrder/Cart')),
      },
    ],
  },
  {
    path: '/user',
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        component: defineAsyncComponent(() => import('microUser/UserProfile')),
      },
      {
        path: 'address',
        name: 'AddressManage',
        component: defineAsyncComponent(() => import('microUser/AddressManage')),
      },
      {
        path: 'member',
        name: 'MemberLevel',
        component: defineAsyncComponent(() => import('microUser/MemberLevel')),
      },
    ],
  },
  {
    path: '/analytics',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: defineAsyncComponent(() => import('microAnalytics/Dashboard')),
      },
      {
        path: 'sales',
        name: 'SalesReport',
        component: defineAsyncComponent(() => import('microAnalytics/SalesReport')),
      },
      {
        path: 'users',
        name: 'UserAnalysis',
        component: defineAsyncComponent(() => import('microAnalytics/UserAnalysis')),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

## 状态管理

### 共享 Store

```typescript
// heikeji-host/src/stores/shared.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSharedStore = defineStore('shared', () => {
  // 用户信息
  const user = ref(null)
  const token = ref('')
  const permissions = ref([])

  // 应用信息
  const currentApp = ref('')
  const loading = ref(false)
  const notification = ref(null)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.name || '')

  // Actions
  function setUser(userData) {
    user.value = userData
  }

  function setToken(newToken) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  function setPermissions(perms) {
    permissions.value = perms
  }

  function setCurrentApp(appName) {
    currentApp.value = appName
  }

  function setLoading(status) {
    loading.value = status
  }

  function showNotification(message, type = 'info') {
    notification.value = { message, type }
    setTimeout(() => {
      notification.value = null
    }, 3000)
  }

  function logout() {
    user.value = null
    token.value = ''
    permissions.value = []
    localStorage.removeItem('token')
  }

  return {
    // State
    user,
    token,
    permissions,
    currentApp,
    loading,
    notification,
    // Computed
    isAuthenticated,
    userName,
    // Actions
    setUser,
    setToken,
    setPermissions,
    setCurrentApp,
    setLoading,
    showNotification,
    logout,
  }
})
```

## 微应用间通信

### 事件总线

```typescript
// heikeji-host/src/utils/eventBus.ts
class EventBus {
  constructor() {
    this.events = new Map()
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event).push(callback)
    return () => this.off(event, callback)
  }

  off(event, callback) {
    if (this.events.has(event)) {
      const callbacks = this.events.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Event callback error:`, error)
        }
      })
    }
  }

  once(event, callback) {
    const unsubscribe = this.on(event, (data) => {
      unsubscribe()
      callback(data)
    })
    return unsubscribe
  }
}

export const eventBus = new EventBus()
```

### 通信示例

```typescript
// 商品微应用中
import { useSharedStore } from 'micro-shared/stores'
import { eventBus } from 'micro-shared/utils'

const sharedStore = useSharedStore()

// 发送事件
function addToCart(product, quantity) {
  eventBus.emit('cart:add', { product, quantity })
}

// 监听事件
onMounted(() => {
  eventBus.on('user:login', (user) => {
    console.log('用户登录', user)
  })
})

// 使用共享状态
const userName = computed(() => sharedStore.userName)
```

## 部署方案

### 开发环境

```bash
# 启动共享库
cd micro-shared && npm install && npm run dev

# 启动各微应用
cd micro-product && npm install && npm run dev
cd micro-order && npm install && npm run dev
cd micro-user && npm install && npm run dev
cd micro-analytics && npm install && npm run dev

# 启动主应用
cd heikeji-host && npm install && npm run dev
```

### 生产环境

```bash
# 构建共享库
cd micro-shared && npm run build

# 构建各微应用
cd micro-product && npm run build
cd micro-order && npm run build
cd micro-user && npm run build
cd micro-analytics && npm run build

# 构建主应用
cd heikeji-host && npm run build

# 使用 Nginx 部署
docker-compose -f docker-compose-micro-frontend.yml up -d
```

## 优势与挑战

### 优势

1. **独立开发部署**
   - 各团队独立开发，互不干扰
   - 独立部署，灵活发布
   - 技术栈灵活，可独立升级

2. **增量升级**
   - 可以逐步迁移旧代码
   - 降低重构风险
   - A/B测试更容易

3. **性能优化**
   - 按需加载，减少首屏加载时间
   - 更好的代码分割
   - 独立缓存策略

### 挑战

1. **复杂性增加**
   - 应用间通信复杂
   - 状态管理困难
   - 样式隔离需要注意

2. **调试难度**
   - 跨应用调试困难
   - 错误定位复杂
   - 需要完善的监控

3. **首次加载**
   - 远程模块加载延迟
   - 应用切换时的加载体验
   - 需要合理的加载策略

## 总结

微前端架构为HKYG项目提供了更灵活的开发和部署方式，特别适合多团队协作的大型项目。通过合理的应用拆分和通信机制，可以显著提升开发效率和系统可维护性。