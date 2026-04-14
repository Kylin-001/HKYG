<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  /** 图标名称，格式: 前缀:图标名，如 'mdi:home' */
  icon: string
  /** 图标大小 */
  size?: string | number
  /** 图标颜色 */
  color?: string
  /** 自定义类名 */
  class?: string
  /** 是否内联显示 */
  inline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
  inline: true,
})

// 尺寸处理
const sizeValue = computed(() => {
  if (typeof props.size === 'number') {
    return `${props.size}px`
  }
  return props.size
})
</script>

<template>
  <Icon
    :icon="icon"
    :width="sizeValue"
    :height="sizeValue"
    :color="color"
    :inline="inline"
    :class="$props.class"
  />
</template>

<script lang="ts">
import { computed } from 'vue'

export default {
  name: 'IconifyIcon',
}
</script>
