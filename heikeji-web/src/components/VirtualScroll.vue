<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  type CSSProperties,
} from 'vue'

interface VirtualScrollProps {
  items: any[]
  itemHeight: number | ((index: number) => number)
  containerHeight?: number | string
  overscan?: number
  buffer?: number
  /** 是否启用无限滚动 */
  infiniteScroll?: boolean
  /** 距离底部多少像素触发加载更多 */
  threshold?: number
  /** 是否启用滚动位置记忆 */
  rememberPosition?: boolean
  /** 位置记忆的key (用于多列表实例) */
  positionKey?: string
  /** 是否显示骨架屏 */
  showSkeleton?: boolean
  /** 骨架屏数量 */
  skeletonCount?: number
  /** 是否启用平滑滚动 */
  smoothScrolling?: boolean
  /** 滚动防抖延迟(ms) */
  scrollDebounce?: number
  /** 是否启用虚拟化（禁用时渲染所有项） */
  enabled?: boolean
  /** 唯一键字段名 */
  keyField?: string
  /** 预估平均项目高度（用于动态高度优化） */
  estimatedItemHeight?: number
}

const props = withDefaults(defineProps<VirtualScrollProps>(), {
  containerHeight: 400,
  overscan: 5,
  buffer: 10,
  infiniteScroll: false,
  threshold: 200,
  rememberPosition: true,
  positionKey: 'default',
  showSkeleton: true,
  skeletonCount: 10,
  smoothScrolling: true,
  scrollDebounce: 16,
  enabled: true,
  keyField: 'id',
  estimatedItemHeight: 50,
})

const emit = defineEmits<{
  scroll: [scrollTop: number]
  visibleChange: [startIndex: number, endIndex: number]
  loadMore: []
  itemResize: [index: number, height: number]
}>()

const containerRef = ref<HTMLElement>()
const scrollTop = ref(0)
const isScrolling = ref(false)
const isLoadingMore = ref(false)
let scrollTimer: ReturnType<typeof setTimeout> | null = null
let rafId: number | null = null

// ====== 动态高度缓存 ======
const heightCache = new Map<number, number>()
const measuredItems = new Set<number>()

// 使用二分查找优化的偏移计算
const getEstimatedTotalHeight = (): number => {
  if (!props.enabled || props.items.length === 0) return 0

  if (typeof props.itemHeight === 'number') {
    return props.items.length * props.itemHeight
  }

  // 动态高度：使用缓存的高度 + 未测量项目的预估高度
  let totalHeight = 0
  for (let i = 0; i < props.items.length; i++) {
    if (heightCache.has(i)) {
      totalHeight += heightCache.get(i)!
    } else {
      totalHeight += typeof props.itemHeight === 'function'
        ? props.itemHeight(i)
        : props.estimatedItemHeight
    }
  }

  return totalHeight
}

/**
 * 获取指定索引的项目高度
 */
const getItemHeight = (index: number): number => {
  // 优先使用缓存的实际测量值
  if (heightCache.has(index)) {
    return heightCache.get(index)!
  }

  if (typeof props.itemHeight === 'function') {
    const height = props.itemHeight(index)
    return height
  }

  return props.itemHeight
}

/**
 * 二分查找：根据偏移量找到对应的索引
 */
const findStartIndex = (offset: number): number => {
  if (!props.enabled || props.items.length === 0) return 0

  if (typeof props.itemHeight === 'number') {
    return Math.max(0, Math.floor(offset / props.itemHeight))
  }

  let low = 0
  let high = props.items.length - 1
  let accumulatedOffset = 0

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    const midOffset = getOffsetForIndex(mid)

    if (midOffset <= offset) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  return Math.max(0, low - 1)
}

/**
 * 获取指定索引的偏移量
 */
const getOffsetForIndex = (index: number): number => {
  if (!props.enabled || index <= 0) return 0

  if (typeof props.itemHeight === 'number') {
    return index * props.itemHeight
  }

  let offset = 0
  for (let i = 0; i < index; i++) {
    offset += getItemHeight(i)
  }

  return offset
}

// ====== 计算属性 ======

const totalHeight = computed(() => getEstimatedTotalHeight())

const containerStyle = computed<CSSProperties>(() => ({
  height: typeof props.containerHeight === 'number'
    ? `${props.containerHeight}px`
    : props.containerHeight || '400px',
  overflowY: 'auto',
  overflowX: 'hidden',
  position: 'relative' as const,
  WebkitOverflowScrolling: 'touch',
  willChange: props.smoothScrolling ? 'transform' : undefined,
}))

// 可见范围计算
const visibleRange = computed(() => {
  if (!props.enabled) {
    return { start: 0, end: props.items.length - 1 }
  }

  const start = Math.max(0, findStartIndex(scrollTop.value) - props.overscan)
  const end = Math.min(
    props.items.length - 1,
    findStartIndex(scrollTop.value + parseContainerHeight()) + props.overscan
  )

  return { start, end }
})

/**
 * 解析容器高度
 */
function parseContainerHeight(): number {
  if (typeof props.containerHeight === 'number') {
    return props.containerHeight
  }

  if (containerRef.value) {
    return containerRef.value.clientHeight
  }

  return 400
}

const visibleItems = computed(() => {
  const { start, end } = visibleRange.value

  if (!props.enabled) {
    return props.items.map((item, index) => ({
      item,
      index,
      style: {
        position: 'relative' as const,
        minHeight: `${getItemHeight(index)}px`,
      },
    }))
  }

  return props.items.slice(start, end + 1).map((item, idx) => {
    const actualIndex = start + idx
    return {
      item,
      index: actualIndex,
      style: {
        position: 'absolute' as const,
        top: `${getOffsetForIndex(actualIndex)}px`,
        left: '0',
        right: '0',
        height: typeof props.itemHeight === 'number'
          ? `${props.itemHeight}px`
          : `${getItemHeight(actualIndex)}px`,
      } as CSSProperties,
    }
  })
})

// ====== 滚动处理 ======

/**
 * 优化的滚动处理器（使用requestAnimationFrame）
 */
function handleScroll() {
  if (!containerRef.value) return

  // 取消之前的动画帧
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }

  rafId = requestAnimationFrame(() => {
    scrollTop.value = containerRef.value!.scrollTop
    isScrolling.value = true

    emit('scroll', scrollTop.value)
    emit('visibleChange', visibleRange.value.start, visibleRange.value.end)

    // 无限滚动检测
    if (props.infiniteScroll && !isLoadingMore.value) {
      const { scrollHeight, clientHeight, scrollTop: st } = containerRef.value!
      const distanceToBottom = scrollHeight - clientHeight - st

      if (distanceToBottom < props.threshold) {
        loadMore()
      }
    }

    // 保存位置
    if (props.rememberPosition) {
      savePosition(scrollTop.value)
    }
  })

  // 设置滚动结束检测
  if (scrollTimer !== null) {
    clearTimeout(scrollTimer)
  }

  scrollTimer = window.setTimeout(() => {
    isScrolling.value = false
  }, 150)
}

// ====== 无限滚动 ======

async function loadMore() {
  if (isLoadingMore.value) return

  isLoadingMore.value = true
  emit('loadMore')

  // 等待外部数据加载完成后重置状态
  await nextTick()
  setTimeout(() => {
    isLoadingMore.value = false
  }, 500)
}

// ====== 位置记忆 ======

const POSITION_STORAGE_PREFIX = 'virtual-scroll-position-'

function savePosition(position: number) {
  try {
    const key = `${POSITION_STORAGE_PREFIX}${props.positionKey}`
    sessionStorage.setItem(key, String(position))
  } catch (e) {
    console.warn('[VirtualScroll] Failed to save position:', e)
  }
}

function restorePosition(): number {
  try {
    const key = `${POSITION_STORAGE_PREFIX}${props.positionKey}`
    const saved = sessionStorage.getItem(key)
    return saved ? Number(saved) : 0
  } catch (e) {
    return 0
  }
}

// ====== 动态高度测量 ======

/**
 * 测量实际元素高度并更新缓存
 */
function measureItem(index: number, element: HTMLElement | null): void {
  if (!element || !props.enabled) return

  const rect = element.getBoundingClientRect()
  const height = rect.height

  // 只有当高度变化时才更新
  if (!heightCache.has(index) || Math.abs(heightCache.get(index)! - height) > 1) {
    heightCache.set(index, height)
    measuredItems.add(index)
    emit('itemResize', index, height)
  }
}

/**
 * 批量测量可见项
 */
function measureVisibleItems(): void {
  if (!containerRef.value || !props.enabled) return

  const itemElements = containerRef.value.querySelectorAll('[data-virtual-index]')

  itemElements.forEach((el) => {
    const index = parseInt(el.getAttribute('data-virtual-index') || '0', 10)
    measureItem(index, el as HTMLElement)
  })
}

// ====== 滚动控制方法 ======

function scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth'): void {
  if (!containerRef.value) return

  const offset = getOffsetForIndex(index)
  containerRef.value.scrollTo({
    top: offset,
    behavior: props.smoothScrolling ? behavior : 'auto',
  })
}

function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
  scrollToIndex(0, behavior)
}

function scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
  if (!containerRef.value) return

  containerRef.value.scrollTo({
    top: totalHeight.value,
    behavior: props.smoothScrolling ? behavior : 'auto',
  })
}

function scrollToOffset(offset: number, behavior: ScrollBehavior = 'smooth'): void {
  if (!containerRef.value) return

  containerRef.value.scrollTo({
    top: offset,
    behavior: props.smoothScrolling ? behavior : 'auto',
  })
}

/**
 * 滚动到指定位置并确保可见
 */
function scrollIntoView(index: number, behavior: ScrollBehavior = 'smooth'): void {
  if (!containerRef.value) return

  const offset = getOffsetForIndex(index)
  const itemHeight = getItemHeight(index)
  const containerHeight = parseContainerHeight()

  // 确保项目在可视区域内
  if (offset < scrollTop.value) {
    // 项目在视口上方
    scrollToOffset(offset, behavior)
  } else if (offset + itemHeight > scrollTop.value + containerHeight) {
    // 项目在视口下方
    scrollToOffset(offset + itemHeight - containerHeight, behavior)
  }
}

// ====== 公开方法和状态 ======

defineExpose({
  scrollToIndex,
  scrollToTop,
  scrollToBottom,
  scrollToOffset,
  scrollIntoView,
  visibleRange,
  scrollTop,
  isLoadingMore,
  measureItem,
  measureVisibleItems,
  getTotalHeight: () => totalHeight.value,
  getMeasuredItemCount: () => measuredItems.size,
})

// ====== 生命周期 ======

onMounted(() => {
  // 恢复滚动位置
  if (props.rememberPosition) {
    const savedPosition = restorePosition()
    if (savedPosition > 0) {
      nextTick(() => {
        if (containerRef.value) {
          containerRef.value.scrollTop = Math.min(savedPosition, totalHeight.value)
        }
      })
    }
  }

  // 初始测量
  nextTick(() => {
    measureVisibleItems()
  })
})

watch(
  () => props.items.length,
  () => {
    nextTick(() => {
      // 如果内容变短，调整滚动位置防止空白
      if (
        containerRef.value &&
        scrollTop.value > totalHeight.value - parseContainerHeight()
      ) {
        containerRef.value.scrollTop = Math.max(
          0,
          totalHeight.value - parseContainerHeight()
        )
      }

      // 重新测量
      measureVisibleItems()
    })
  }
)

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }

  if (scrollTimer !== null) {
    clearTimeout(scrollTimer)
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="virtual-scroll-container"
    :style="containerStyle"
    @scroll.passive="handleScroll"
  >
    <!-- 主内容区 -->
    <div
      class="virtual-scroll-spacer"
      :style="{ height: `${totalHeight}px`, position: 'relative' }"
    >
      <!-- 实际项目 -->
      <div
        v-for="{ item, index, style } in visibleItems"
        :key="item[keyField] || index"
        :data-virtual-index="index"
        :data-index="index"
        :style="style"
        class="virtual-scroll-item"
        :class="{ 'virtual-scroll-item--visible': !isScrolling || (index >= visibleRange.start && index <= visibleRange.end) }"
      >
        <slot
          name="item"
          :item="item"
          :index="index"
          :is-visible="!isScrolling || (index >= visibleRange.start && index <= visibleRange.end)"
          :measure="(el: HTMLElement | null) => measureItem(index, el)"
        />
      </div>
    </div>

    <!-- 加载更多指示器 -->
    <div v-if="infiniteScroll" class="virtual-scroll-load-more">
      <slot name="loading" :loading="isLoadingMore">
        <div v-if="isLoadingMore" class="load-more-indicator">
          <span class="spinner"></span>
          <span>加载中...</span>
        </div>
        <div v-else-if="items.length > 0" class="load-more-hint">
          <span>上拉加载更多</span>
        </div>
      </slot>
    </div>

    <!-- 骨架屏（首次加载或数据为空时显示） -->
    <template v-if="showSkeleton && (items.length === 0 || isLoadingMore)">
      <div v-if="items.length === 0" class="virtual-scroll-skeleton">
        <slot name="skeleton">
          <div
            v-for="i in skeletonCount"
            :key="`skeleton-${i}`"
            class="skeleton-item"
            :style="{
              height: typeof itemHeight === 'number'
                ? `${itemHeight}px`
                : `${estimatedItemHeight}px`,
              marginBottom: '12px',
            }"
          >
            <div class="skeleton-item__content">
              <div class="skeleton-item__avatar"></div>
              <div class="skeleton-item__text">
                <div class="skeleton-item__line"></div>
                <div class="skeleton-item__line short"></div>
              </div>
            </div>
          </div>
        </slot>
      </div>
    </template>

    <!-- 空状态 -->
    <div v-if="!isLoadingMore && items.length === 0" class="virtual-scroll-empty">
      <slot name="empty">
        <p class="text-center text-gray-400 py-8">暂无数据</p>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.virtual-scroll-container {
  -webkit-overflow-scrolling: touch;
}

.virtual-scroll-item {
  will-change: transform;
  contain: layout style paint;
}

.virtual-scroll-item--visible {
  /* 可以在这里添加可见时的特殊样式 */
}

.virtual-scroll-load-more {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 16px;
  text-align: center;
  z-index: 10;
}

.load-more-indicator,
.load-more-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 骨架屏样式 */
.virtual-scroll-skeleton {
  padding: 16px;
}

.skeleton-item {
  border-radius: 8px;
  background: #fff;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.skeleton-item__content {
  display: flex;
  gap: 12px;
  align-items: center;
}

.skeleton-item__avatar {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-item__text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-item__line {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-item__line.short {
  width: 60%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.virtual-scroll-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}
</style>
