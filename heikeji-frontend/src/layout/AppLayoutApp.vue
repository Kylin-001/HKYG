<template>
  <div class="app-layout">
    <!-- 主内容区域 -->
    <main class="main-content">
      <router-view :key="route.fullPath" v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>

    <!-- 底部导航栏 -->
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import TabBar from '@/components/ui/TabBar.vue'

// 路由信息
const route = useRoute()
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-bottom: 56px; /* 为底部导航栏留出空间 */
}
</style>
