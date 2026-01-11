<template>
  <div class="tab-bar">
    <div
      v-for="item in tabItems"
      :key="item.path"
      class="tab-item"
      :class="{ active: currentRoute === item.path }"
      @click="navigateTo(item.path)"
    >
      <i :class="item.icon" class="tab-icon"></i>
      <span class="tab-text">{{ item.text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 定义Tab项类型
interface TabItem {
  path: string
  text: string
  icon: string
}

// 初始化路由
const route = useRoute()
const router = useRouter()

// 当前路由
const currentRoute = ref(route.path)

// Tab项配置
const tabItems: TabItem[] = [
  { path: '/app/product/list', text: '首页', icon: 'el-icon-s-home' },
  { path: '/app/category', text: '分类', icon: 'el-icon-menu' },
  { path: '/app/cart', text: '购物车', icon: 'el-icon-shopping-cart-full' },
  { path: '/app/user', text: '我的', icon: 'el-icon-user' },
]

// 导航到指定路径
const navigateTo = (path: string) => {
  router.push(path)
}

// 监听路由变化
watch(
  () => route.path,
  newPath => {
    currentRoute.value = newPath
  }
)
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 25%;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-item.active {
  color: #409eff;
}

.tab-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.tab-text {
  font-size: 12px;
}
</style>
