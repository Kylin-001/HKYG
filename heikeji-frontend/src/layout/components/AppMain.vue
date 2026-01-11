<template>
  <main class="app-main">
    <!-- 页面转场动画 - 使用从设计系统继承的动画类型 -->
    <transition :name="transitionName" mode="out-in">
      <router-view :key="key"></router-view>
    </transition>
  </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useThemeStore } from '@/store/modules/theme'

// 组件名称
const name = 'AppMain'

// 路由和状态管理
const route = useRoute()
const themeStore = useThemeStore()

// 计算属性
const key = computed(() => route.path)

// 从主题存储中获取转场动画类型
const transitionName = computed(() => {
  // 可以从路由元信息或主题设置中获取动画类型
  return route.meta.transition || themeStore.pageTransition || 'fade-transform'
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/animations.scss';

.app-main {
  min-height: calc(100vh - #{$header-height});
  background-color: $background-color;
  padding: 20px;
  transition: all $animation-duration $animation-easing;
  position: relative;
  overflow: hidden;

  // 响应式 padding
  @media (max-width: 768px) {
    padding: 15px 10px;
  }

  @media (max-width: 480px) {
    padding: 10px 5px;
  }
}

/* 页面转场动画 - 从 animations.scss 继承，这里只保留组件特定样式 */

/* 滚动条美化 - 使用设计令牌 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: theme-color(border-light);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: theme-color(text-placeholder);
  border-radius: 3px;
  transition: all $animation-duration $animation-easing;
}

::-webkit-scrollbar-thumb:hover {
  background: theme-color(text-secondary);
}
</style>
