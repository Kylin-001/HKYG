# 项目数据来源分析报告

生成时间：2026-04-18

## 📊 数据来源概览

| 来源类型 | 模块数量 | 状态 |
|---------|---------|------|
| 后端 API | 15+ | 主要来源 |
| Mock 数据 | 5 | 开发/测试使用 |
| 混合模式 | 3 | Mock + 真实 API |

---

## 🔗 各模块数据来源详情

### 1. 二手市场模块 (`src/api/secondhand.ts`)

**数据来源：** 后端 API
```typescript
// 直接调用后端接口
get('/secondhand/items', { params })
get(`/secondhand/items/${itemId}`)
post('/secondhand/items', data)
```

**Mock 备用方案：**
- 文件：`src/mock/secondhandData.ts` (新版)
- 状态：✅ 已重构，使用 @faker-js/faker
- 数据量：200+ 商品
- 使用方式：通过 `request.ts` 中的 mock 拦截器

---

### 2. 外卖模块 (`src/api/takeout.ts`)

**数据来源：** Mock / 真实 API 混合
```typescript
// 使用适配器模式
export const getMerchantList = apiAdapter(mockApi.getMerchantList, realApi.getMerchantListReal)
```

**Mock 数据来源：**
- 文件：`src/api/takeout-mock.ts` (新版)
- 状态：✅ 已更新，使用新的生成器
- 数据量：
  - 商家：50 个
  - 菜品：每商家 12 道
  - 订单：30 个

**生成器来源：**
```typescript
import {
  generateMerchants,
  generateMerchantDetail,
  generateMerchantDishes,
  generateOrders,
  generateDeliveryTrack,
} from '@/mock/generators'
```

---

### 3. 用户模块 (`src/api/user.ts`)

**数据来源：** 后端 API
```typescript
get('/user/info')
post('/auth/login', data)
post('/auth/register', data)
```

**Mock 备用：**
- 位置：`src/mock/index.ts` -> `mockAPI.user`
- 状态：基础 mock 数据

---

### 4. 校园服务模块 (`src/api/campus.ts`)

**数据来源：** 后端 API
- 课程表
- 成绩查询
- 教室预约
- 宿舍报修
- 图书馆

**状态：** 暂无 mock 数据，完全依赖后端

---

### 5. 学工模块 (`src/api/studentAffairs.ts`)

**数据来源：** 后端 API
- 通知公告
- 奖学金
- 请假申请
- 活动管理

**Mock 备用方案：**
- 文件：`src/mock/generators/studentAffairs.ts` (新版)
- 状态：✅ 已创建，未接入
- 数据量：
  - 通知：30 条
  - 活动：20 个
  - 请假：20 条
  - 奖学金：10 个

---

### 6. 社区/论坛模块 (`src/api/community.ts`)

**数据来源：** 后端 API

**Mock 备用方案：**
- 文件：`src/mock/generators/forum.ts` (新版)
- 状态：✅ 已创建，未接入
- 数据量：
  - 帖子：50 个
  - 评论：500+ 条

---

### 7. 搜索页面 (`src/views/search/Index.vue`)

**数据来源：** Mock 数据（已更新）
```typescript
// 新版实现
import { generateMerchants, generateProducts } from '@/mock/generators'

function mockTakeoutSearch(kw: string) {
  const allMerchants = generateMerchants(30)
  return filterMerchants(allMerchants, { keyword: kw })
}

function mockSecondhandSearch(kw: string) {
  const allProducts = generateProducts(50)
  return filterProducts(allProducts, { keyword: kw })
}
```

**状态：** ✅ 已使用新生成器

---

### 8. 订单模块 (`src/api/order.ts`)

**数据来源：** 后端 API

**Mock 备用：**
- 通过外卖模块的 `generateOrders()` 生成
- 状态：✅ 可用

---

### 9. 购物车模块 (`src/api/cart.ts`)

**数据来源：** 后端 API

**状态：** 暂无专门 mock 数据

---

### 10. 支付模块 (`src/api/payment.ts`)

**数据来源：** 后端 API

**状态：** 暂无 mock 数据

---

### 11. 公告模块 (`src/api/announcement.ts`)

**数据来源：** 后端 API

**状态：** 暂无 mock 数据

---

### 12. 管理后台 (`src/api/admin.ts`)

**数据来源：** 后端 API
- 用户管理
- 角色管理
- 菜单管理
- 部门管理
- 文件管理
- 系统配置

**状态：** 暂无 mock 数据

---

## 🎯 Mock 数据生成器汇总

### 已创建并接入的生成器

| 生成器 | 文件路径 | 状态 | 使用位置 |
|--------|---------|------|---------|
| 商品生成器 | `src/mock/generators/product.ts` | ✅ 已接入 | 搜索页、外卖 mock |
| 商家生成器 | `src/mock/generators/merchant.ts` | ✅ 已接入 | 外卖 mock、搜索页 |
| 订单生成器 | `src/mock/generators/takeout.ts` | ✅ 已接入 | 外卖 mock |
| 用户生成器 | `src/mock/generators/user.ts` | ✅ 可用 | 待接入 |

### 已创建但未接入的生成器

| 生成器 | 文件路径 | 状态 | 建议接入位置 |
|--------|---------|------|-------------|
| 论坛生成器 | `src/mock/generators/forum.ts` | ⏳ 未接入 | `src/api/community.ts` |
| 学工生成器 | `src/mock/generators/studentAffairs.ts` | ⏳ 未接入 | `src/api/studentAffairs.ts` |

---

## ⚙️ Mock 配置说明

### 1. 全局 Mock 开关

**位置：** `src/utils/request.ts` (第 551 行)
```typescript
// const isMockEnabled = import.meta.env.VITE_ENABLE_MOCK === 'true' || import.meta.env.DEV
const isMockEnabled = false // 当前禁用，使用后端 API
```

### 2. 外卖模块 Mock 开关

**位置：** `src/api/adapter.ts` (第 9 行)
```typescript
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
```

**环境变量控制：**
```bash
# .env.development
VITE_USE_MOCK=true  # 启用 mock
VITE_USE_MOCK=false # 禁用 mock，使用真实 API
```

---

## 📈 数据流向图

```
┌─────────────────────────────────────────────────────────────┐
│                        组件层 (Vue)                          │
├─────────────────────────────────────────────────────────────┤
│  - views/search/Index.vue    ──────┐                        │
│  - views/takeout/*.vue      ───────┼─── 使用 API 层          │
│  - stores/*.ts              ───────┘                        │
├─────────────────────────────────────────────────────────────┤
│                        API 层                               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  secondhand.ts  │  │  takeout.ts     │                  │
│  │  (后端 API)     │  │  (Mock/真实)    │                  │
│  └────────┬────────┘  └────────┬────────┘                  │
│           │                    │                            │
│           ▼                    ▼                            │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  request.ts     │  │  takeout-mock.ts│                  │
│  │  (Mock 拦截器)  │  │  (新版生成器)   │                  │
│  └────────┬────────┘  └────────┬────────┘                  │
│           │                    │                            │
│           ▼                    ▼                            │
│  ┌─────────────────────────────────────┐                   │
│  │      Mock 数据生成器层               │                   │
│  │  ┌─────────┐ ┌─────────┐ ┌────────┐│                   │
│  │  │ product │ │ merchant│ │ takeout││                   │
│  │  └─────────┘ └─────────┘ └────────┘│                   │
│  └─────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 建议优化项

### 高优先级

1. **启用 Mock 数据**
   ```typescript
   // src/utils/request.ts 第 551 行
   const isMockEnabled = true // 开发环境启用
   ```

2. **接入论坛 Mock 数据**
   - 更新 `src/api/community.ts`
   - 使用 `src/mock/generators/forum.ts`

3. **接入学工 Mock 数据**
   - 更新 `src/api/studentAffairs.ts`
   - 使用 `src/mock/generators/studentAffairs.ts`

### 中优先级

4. **统一 Mock 配置**
   - 使用环境变量控制所有模块
   - 避免分散的配置

5. **添加更多模块的 Mock**
   - 校园服务模块
   - 购物车模块
   - 支付模块

---

## 📊 数据统计

| 指标 | 数值 |
|------|------|
| API 文件总数 | 18 个 |
| 使用 Mock 的 API | 3 个 |
| Mock 生成器 | 7 个 |
| 生成的数据量 | 1000+ 条 |
| 已接入生成器 | 4 个 |
| 待接入生成器 | 2 个 |

---

## ✅ 总结

- **当前状态：** Mock 数据系统已完善，但大部分模块仍直接调用后端 API
- **主要问题：** `request.ts` 中 Mock 被禁用（`isMockEnabled = false`）
- **解决方案：** 启用 Mock 或按需接入新生成器到各 API 模块
- **数据质量：** ✅ 使用 @faker-js/faker 生成真实中文数据
