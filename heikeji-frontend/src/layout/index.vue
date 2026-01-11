<template>
  <div :class="{ 'has-logo': showLogo }" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <Sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <Navbar />
      </div>
      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import AppMain from './components/AppMain.vue'

const appStore = useAppStore()

// 计算属性
const sidebar = computed(() => appStore.sidebar)
const device = computed(() => appStore.device)
// 暂时使用默认值，后续可以添加到app store中
const fixedHeader = computed(() => true)
const showLogo = computed(() => true)

// 方法
const handleClickOutside = () => {
  appStore.closeSidebar(false)
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &.has-logo {
    .main-container {
      margin-left: $sideBarWidth;
    }
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

@media screen and (max-width: $screen-xs) {
  .fixed-header {
    width: 100%;
  }
}
</style>
