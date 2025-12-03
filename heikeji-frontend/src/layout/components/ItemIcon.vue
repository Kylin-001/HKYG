<template>
  <div :class="['item-icon', svgClass]" v-if="iconType === 'svg'">
    <svg-icon :icon-class="iconName" />
  </div>
  <i v-else :class="iconClass" />
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

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
</script>

<style lang="scss" scoped>
.item-icon {
  display: inline-block;
  &.svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
  }
}
</style>
