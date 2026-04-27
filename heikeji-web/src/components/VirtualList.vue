<script setup lang="ts">
/**
 * 虚拟列表组件 - 用于渲染大量数据时减少 DOM 节点数量
 * 
 * 特性：
 * - 只渲染可视区域内的项目
 * - 支持动态高度
 * - 支持滚动到指定位置
 * - 支持上拉加载更多
 */
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

interface Props {
  items: any[]
  itemHeight: number
  bufferSize?: number
  containerHeight?: number
  keyField?: string
}

const props = withDefaults(defineProps<Props>(), {
  bufferSize: 5,
  containerHeight: 400,
  keyField: 'id'
})

const emit = defineEmits<{
  scroll: [event: Event]
  scrollEnd: []
  itemClick: [item: any, index: number]
}>()

// 容器引用
const containerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

// 滚动状态
const scrollTop = ref(0)
const containerHeight = ref(props.containerHeight)

// 计算可视区域
const visibleCount = computed(() => {
  return Math.ceil(containerHeight.value / props.itemHeight) + props.bufferSize * 2
})

const startIndex = computed(() => {
  const start = Math.floor(scrollTop.value / props.itemHeight) - props.bufferSize
  return Math.max(0, start)
})

const endIndex = computed(() => {
  const end = startIndex.value + visibleCount.value
  return Math.min(props.items.length, end)
})

// 可视区域数据
const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value).map((item, index) => ({
    item,
    index: startIndex.value + index,
    key: item[props.keyField] || startIndex.value + index
  }))
})

// 总高度
const totalHeight = computed(() => {
  return props.items.length * props.itemHeight
})

// 偏移量
const offsetY = computed(() => {
  return startIndex.value * props.itemHeight
})

// 处理滚动
let scrollTimer: number | null = null
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  scrollTop.value = target.scrollTop
  emit('scroll', e)

  // 检测滚动到底部
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }
  scrollTimer = window.setTimeout(() => {
    const { scrollTop, scrollHeight, clientHeight } = target
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      emit('scrollEnd')
    }
  }, 150)
}

// 滚动到指定索引
const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
  nextTick(() => {
    if (containerRef.value) {
      containerRef.value.scrollTo({
        top: index * props.itemHeight,
        behavior
      })
    }
  })
}

// 滚动到顶部
const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  scrollToIndex(0, behavior)
}

// 滚动到底部
const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
  nextTick(() => {
    if (containerRef.value) {
      containerRef.value.scrollTo({
        top: totalHeight.value,
        behavior
      })
    }
  })
}

// 监听数据变化，自动调整滚动位置
watch(() => props.items.length, (newLen, oldLen) => {
  if (newLen < oldLen) {
    // 数据减少时，确保滚动位置不超出范围
    const maxScroll = Math.max(0, totalHeight.value - containerHeight.value)
    if (scrollTop.value > maxScroll && containerRef.value) {
      containerRef.value.scrollTop = maxScroll
    }
  }
})

// 监听容器高度变化
const resizeObserver = ref<ResizeObserver | null>(null)

onMounted(() => {
  if (containerRef.value) {
    // 获取实际容器高度
    const rect = containerRef.value.getBoundingClientRect()
    containerHeight.value = rect.height || props.containerHeight

    // 监听容器大小变化
    resizeObserver.value = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerHeight.value = entry.contentRect.height
      }
    })
    resizeObserver.value.observe(containerRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver.value && containerRef.value) {
    resizeObserver.value.unobserve(containerRef.value)
  }
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }
})

// 暴露方法
defineExpose({
  scrollToIndex,
  scrollToTop,
  scrollToBottom,
  getScrollTop: () => scrollTop.value,
  getVisibleRange: () => ({ start: startIndex.value, end: endIndex.value })
})
</script>

<template>
  <div
    ref="containerRef"
    class="virtual-list-container"
    @scroll="handleScroll"
  >
    <div
      class="virtual-list-phantom"
      :style="{ height: `${totalHeight}px` }"
    />
    <div
      ref="contentRef"
      class="virtual-list-content"
      :style="{ transform: `translateY(${offsetY}px)` }"
    >
      <div
        v-for="{ item, index, key } in visibleItems"
        :key="key"
        class="virtual-list-item"
        :style="{ height: `${itemHeight}px` }"
        @click="emit('itemClick', item, index)"
      >
        <slot
          :item="item"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.virtual-list-container {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  -webkit-overflow-scrolling: touch;
}

.virtual-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.virtual-list-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  will-change: transform;
}

.virtual-list-item {
  box-sizing: border-box;
  width: 100%;
}
</style>
