<template>
  <div class="empty-state py-16 px-4 text-center" :class="[`empty-state--${type}`, customClass]">
    <div :class="['mx-auto mb-5 rounded-full flex items-center justify-center', iconContainerClass]">
      <slot name="icon">
        <component :is="iconMap[type]" :size="iconSize" :class="iconColorClass" />
      </slot>
    </div>

    <h3 v-if="title" class="text-lg font-semibold mb-2" :class="titleClass">{{ title }}</h3>
    <p v-if="description" class="text-sm max-w-sm mx-auto leading-relaxed" :class="descClass">{{ description }}</p>

    <div v-if="$slots.action" class="mt-6">
      <slot name="action" />
    </div>

    <div v-if="$slots.extra" class="mt-4">
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Document, ShoppingCart, Search, FolderOpened, Warning,
  Connection, Box, Present, Ticket, Star, CircleClose, InfoFilled
} from '@element-plus/icons-vue'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'default' | 'search' | 'cart' | 'order' | 'network' | 'folder' | 'coupon' | 'favorite' | 'error' | 'info'
  title?: string
  description?: string
  iconSize?: number | string
  customClass?: string
}>(), {
  type: 'default',
  iconSize: 48,
})

const iconMap: Record<string, any> = {
  default: Document,
  search: Search,
  cart: ShoppingCart,
  order: Box,
  network: Connection,
  folder: FolderOpened,
  coupon: Ticket,
  favorite: Star,
  error: Warning,
  info: InfoFilled,
}

const typeConfig: Record<string, { iconBg: string; titleCls: string; descCls: string; iconColor: string }> = {
  default: { iconBg: 'bg-gray-100 text-gray-300', titleCls: 'text-text-primary', descCls: 'text-gray-400', iconColor: '' },
  search: { iconBg: 'bg-blue-50 text-blue-400', titleCls: 'text-text-primary', descCls: 'text-gray-400', iconColor: '' },
  cart: { iconBg: 'bg-red-50 text-red-300', titleCls: 'text-text-primary', descCls: 'text-gray-400', iconColor: '' },
  order: { iconBg: 'bg-orange-50 text-orange-400', titleCls: 'text-text-primary', descCls: 'text-gray-400', iconColor: '' },
  network: { iconBg: 'bg-yellow-50 text-yellow-500', titleCls: 'text-text-primary', descCls: 'text-gray-400', iconColor: '' },
  folder: { iconBg: 'bg-purple-50 text-purple-400', titleCls: 'text-text-primary', descCls: 'text-gray-400', iconColor: '' },
  coupon: { iconBg: 'bg-amber-50 text-amber-500', titleCls: 'text-text-primary', descCls: 'text-gray-400', iconColor: '' },
  favorite: { iconBg: 'bg-pink-50 text-pink-400', titleCls: 'text-text-primary', descCls: 'text-gray-400', iconColor: '' },
  error: { iconBg: 'bg-red-50 text-red-400', titleCls: 'text-red-600', descCls: 'text-red-400/70', iconColor: '' },
  info: { iconBg: 'bg-sky-50 text-sky-400', titleCls: 'text-sky-700', descCls: 'text-sky-600/70', iconColor: '' },
}

const config = computed(() => typeConfig[props.type] || typeConfig.default)
const iconContainerClass = computed(() => `w-${typeof props.iconSize === 'number' ? Math.round(props.iconSize * 1.8) : 20} h-${typeof props.iconSize === 'number' ? Math.round(props.iconSize * 1.8) : 20} ${config.value.iconBg}`)
const titleClass = computed(() => config.value.titleCls)
const descClass = computed(() => config.value.descClass)
const iconColorClass = computed(() => config.value.iconColor)
</script>
