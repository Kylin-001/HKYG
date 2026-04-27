# 项目图标使用指南

## 当前方案

项目同时使用两种图标方案：

### 1. Element Plus 图标（主要使用）

```vue
<template>
  <el-icon><Home /></el-icon>
  <el-icon :size="24"><Search /></el-icon>
  <el-icon color="#003B80"><User /></el-icon>
</template>

<script setup>
import { Home, Search, User } from '@element-plus/icons-vue'
</script>
```

### 2. Iconify 图标（扩展使用）

```vue
<template>
  <IconifyIcon icon="mdi:home" size="24" />
  <IconifyIcon icon="mdi:food" size="32" color="#ff6b6b" />
</template>

<script setup>
import IconifyIcon from '@/components/base/IconifyIcon.vue'
</script>
```

## 常用图标映射表

| 功能 | Element Plus | Iconify |
|------|-------------|---------|
| 首页 | `Home` | `mdi:home` |
| 搜索 | `Search` | `mdi:magnify` |
| 用户 | `User` | `mdi:account` |
| 购物车 | `ShoppingCart` | `mdi:cart` |
| 返回 | `ArrowLeft` | `mdi:arrow-left` |
| 收藏 | `Star` | `mdi:star` |
| 设置 | `Setting` | `mdi:cog` |
| 删除 | `Delete` | `mdi:delete` |
| 编辑 | `Edit` | `mdi:pencil` |
| 添加 | `Plus` | `mdi:plus` |
| 美食 | - | `mdi:food` |
| 外卖 | - | `mdi:truck-delivery` |
| 校园 | - | `mdi:school` |
| 二手市场 | - | `mdi:store` |
| 社区 | - | `mdi:forum` |

## 推荐：使用 Iconify 的场景

1. **Element Plus 没有的图标**
2. **需要更多风格选择**
3. **需要动态切换图标**

## 图标库资源

- [Iconify 图标搜索](https://icon-sets.iconify.design/)
- [Material Design Icons](https://materialdesignicons.com/)
- [Element Plus 图标](https://element-plus.org/zh-CN/component/icon.html)
