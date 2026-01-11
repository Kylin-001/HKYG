<template>
  <div class="item-icon">
    <!-- Element Plus图标组件 -->
    <component v-if="elementPlusIcon" :is="elementPlusIcon" class="el-plus-icon" />
    <!-- SVG图标 -->
    <div :class="svgClass" v-else-if="iconType === 'svg'">
      <svg-icon :icon-class="iconName" />
    </div>
    <!-- 旧版Element UI图标（兼容） -->
    <i v-else :class="iconClass" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 定义props
const props = defineProps<{
  icon?: string
}>()

// 计算属性
const iconType = computed(() => {
  if (props.icon && props.icon.indexOf('svg-') === 0) {
    return 'svg'
  }
  return 'el-icon'
})

const iconName = computed(() => {
  if (iconType.value === 'svg') {
    return props.icon?.replace('svg-', '') || ''
  }
  return props.icon || ''
})

const iconClass = computed(() => {
  if (iconType.value === 'el-icon') {
    // 如果是以el-icon开头就直接用，如果不是则加上el-icon-
    return props.icon?.indexOf('el-icon') === 0 ? props.icon : `el-icon-${props.icon}`
  }
  return ''
})

const svgClass = computed(() => {
  return iconType.value === 'svg' ? 'svg-icon' : ''
})

// Element Plus图标处理
const elementPlusIcon = computed(() => {
  if (!props.icon) return null

  // 转换旧图标名称为Element Plus图标组件名称
  const iconMap: Record<string, string> = {
    'el-icon-s-home': 'House',
    'el-icon-menu': 'Menu',
    'el-icon-arrow-down': 'ArrowDown',
    'el-icon-arrow-up': 'ArrowUp',
    'el-icon-plus': 'Plus',
    'el-icon-minus': 'Minus',
    'el-icon-edit': 'Edit',
    'el-icon-delete': 'Delete',
    'el-icon-search': 'Search',
    'el-icon-refresh': 'Refresh',
    'el-icon-download': 'Download',
    'el-icon-upload2': 'Upload',
    'el-icon-star-on': 'StarFilled',
    'el-icon-star-off': 'Star',
    'el-icon-circle-check': 'CircleCheck',
    'el-icon-circle-close': 'CircleClose',
    'el-icon-data-line': 'DataLine',
    'el-icon-caret-top': 'CaretTop',
    'el-icon-caret-bottom': 'CaretBottom',
    'el-icon-s-fold': 'S-fold',
    'el-icon-setting': 'Setting',
    'el-icon-user': 'User',
    'el-icon-switch-button': 'SwitchButton',
    'el-icon-goods': 'Goods',
    'el-icon-view': 'View',
    'el-icon-refresh-left': 'RefreshLeft',
    'el-icon-s-unfold': 'S-unfold',
    'el-icon-circle-plus': 'CirclePlus',
    'el-icon-message': 'Message',
    'el-icon-bell': 'Bell',
    'el-icon-lock': 'Lock',
  }

  // 如果是Element Plus图标组件名称，直接返回
  if (ElementPlusIconsVue[props.icon as keyof typeof ElementPlusIconsVue]) {
    return ElementPlusIconsVue[props.icon as keyof typeof ElementPlusIconsVue]
  }

  // 如果是旧图标名称，转换为Element Plus图标组件
  const newIconName = iconMap[props.icon]
  if (newIconName && ElementPlusIconsVue[newIconName as keyof typeof ElementPlusIconsVue]) {
    return ElementPlusIconsVue[newIconName as keyof typeof ElementPlusIconsVue]
  }

  return null
})
</script>

<style lang="scss" scoped>
.item-icon {
  display: inline-block;

  // Element Plus图标样式
  .el-plus-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
  }

  // SVG图标样式
  &.svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
  }
}
</style>
