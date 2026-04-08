<template>
  <div ref="containerRef" class="relative" :class="$attrs.class">
    <div class="pull-indicator" :style="{ height: pullHeight + 'px', transition: 'height 0.3s ease' }">
      <div class="flex items-center justify-center h-full">
        <template v-if="state === 'pulling' && !refreshing">
          <el-icon :size="18" :class="['text-gray-400 transition-transform duration-200', { 'rotate-180': distance > threshold }]"><ArrowDown /></el-icon>
          <span class="ml-2 text-xs text-gray-400">{{ distance > threshold ? '释放刷新' : '下拉刷新' }}</span>
        </template>
        <template v-else-if="refreshing || state === 'refreshing'">
          <div class="flex items-center gap-2">
            <svg class="animate-spin w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25"/>
              <path d="M12 2a10 10 0 0110 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            </svg>
            <span class="text-xs text-indigo-500 font-medium">正在刷新...</span>
          </div>
        </template>
        <template v-else-if="state === 'success'">
          <span class="text-xs text-emerald-500 flex items-center gap-1">
            <el-icon :size="14"><CircleCheckFilled /></el-icon>刷新成功
          </span>
        </template>
      </div>
    </div>

    <div @touchstart.passive="onTouchStart" @touchmove.prevent="onTouchMove" @touchend.passive="onTouchEnd"
      @wheel.passive="onWheel" class="overflow-hidden">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown, CircleCheckFilled } from '@element-plus/icons-vue'

const props = withDefaults(defineProps<{
  threshold?: number
  onRefresh?: () => Promise<void>
}>(), {
  threshold: 60,
})

const emit = defineEmits<{ refresh: [] }()

const containerRef = ref<HTMLElement>()
const state = ref<'idle' | 'pulling' | 'refreshing' | 'success'>('idle')
const startY = ref(0)
const currentY = ref(0)
const distance = ref(0)
const pullHeight = ref(0)
const refreshing = ref(false)

function onTouchStart(e: TouchEvent) {
  if (refreshing.value || state.value === 'refreshing') return
  const el = containerRef.value?.querySelector('[class*="overflow"]') || containerRef.value
  if (el.scrollTop <= 0) {
    startY.value = e.touches[0].clientY
    state.value = 'pulling'
  }
}

function onTouchMove(e: TouchEvent) {
  if (state.value !== 'pulling') return
  currentY.value = e.touches[0].clientY
  const diff = currentY.value - startY.value
  if (diff > 0) {
    distance.value = Math.min(diff * 0.5, 120)
    pullHeight.value = Math.min(distance.value, 80)
  }
}

async function onTouchEnd() {
  if (distance.value >= props.threshold) {
    state.value = 'refreshing'
    refreshing.value = true
    try {
      await props.onRefresh?.()
      emit('refresh')
      state.value = 'success'
      setTimeout(() => { state.value = 'idle'; refreshing.value = false }, 800)
    } catch {
      state.value = 'idle'
      refreshing.value = false
    }
  }
  startY.value = 0
  currentY.value = 0
  distance.value = 0
  setTimeout(() => { pullHeight.value = 0 }, 150)
}

function onWheel() {
  if (state.value === 'pulling') {
    state.value = 'idle'
    pullHeight.value = 0
    distance.value = 0
  }
}
</script>
