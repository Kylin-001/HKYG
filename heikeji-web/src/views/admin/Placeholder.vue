<template>
  <div class="flex flex-col items-center justify-center min-h-[400px] text-center">
    <div class="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
      <el-icon :size="36" class="text-primary/30"><component :is="iconMap[pageName] || Setting" /></el-icon>
    </div>
    <h2 class="text-lg font-bold text-text-primary mb-1">{{ pageTitle }}</h2>
    <p class="text-sm text-text-tertiary max-w-sm">该功能模块正在开发中，敬请期待。当前可使用数据看板功能。</p>
    <router-link to="/admin/dashboard"
      class="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold shadow-brand hover:shadow-lg transition-all">
      前往数据看板
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Goods, User, Document, Setting, DataAnalysis
} from '@element-plus/icons-vue'

const route = useRoute()

const iconMap: Record<string, any> = {
  AdminProducts: Goods,
  AdminUsers: User,
  AdminOrders: Document,
  AdminSystem: Setting,
  AdminDashboard: DataAnalysis,
}

const pageName = computed(() => route.name as string)

const pageTitle = computed(() => (route.meta.title as string) || '开发中')
</script>
