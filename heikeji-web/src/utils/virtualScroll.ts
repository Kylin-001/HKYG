import { ref, computed, onMounted, onUnmounted, watch, type Ref } from 'vue'

interface VirtualScrollOptions<T> {
  items: Ref<T[]> | T[]
  itemHeight: number | ((item: T, index: number) => number)
  containerHeight: number
  overscan?: number
  buffer?: number
}

interface VisibleRange {
  startIndex: number
  endIndex: number
  scrollTop: number
}

export function useVirtualScroll<T = any>(options: VirtualScrollOptions<T>) {
  const {
    items: rawItems,
    itemHeight: rawItemHeight,
    containerHeight,
    overscan = 5,
    buffer = 0,
  } = options

  const items = ref(rawItems) as Ref<T[]>
  const scrollTop = ref(0)
  const scrollContainer = ref<HTMLElement | null>(null)
  const isDynamic = typeof rawItemHeight === 'function'

  const getItemHeight = (item: T, index: number): number => {
    if (typeof rawItemHeight === 'function') {
      return rawItemHeight(item, index)
    }
    return rawItemHeight as number
  }

  const sizeMap = ref<Map<number, number>>(new Map())

  const cachedOffsetMap = computed(() => {
    const map = [0]
    let offset = 0

    for (let i = 0; i < items.value.length; i++) {
      const height = isDynamic
        ? (sizeMap.value.get(i) ?? getItemHeight(items.value[i], i))
        : getItemHeight(items.value[i], i)
      offset += height
      map.push(offset)
    }

    return map
  })

  const totalHeight = computed(() => {
    if (items.value.length === 0) return 0
    return cachedOffsetMap.value[items.value.length]
  })

  const visibleRange = computed<VisibleRange>(() => {
    const st = scrollTop.value
    let startIdx = 0
    let endIdx = items.value.length - 1

    const offsets = cachedOffsetMap.value
    let left = 0
    let right = offsets.length - 1

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      if (offsets[mid] <= st) {
        startIdx = mid
        left = mid + 1
      } else {
        right = mid - 1
      }
    }

    left = startIdx
    right = offsets.length - 1
    const viewportBottom = st + containerHeight + buffer

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      if (offsets[mid] < viewportBottom) {
        endIdx = mid
        left = mid + 1
      } else {
        right = mid - 1
      }
    }

    return {
      startIndex: Math.max(0, startIdx - overscan),
      endIndex: Math.min(items.value.length - 1, endIdx + overscan),
      scrollTop: st,
    }
  })

  const visibleItems = computed(() => {
    const { startIndex, endIndex } = visibleRange.value
    return items.value.slice(startIndex, endIndex + 1).map((item, idx) => ({
      item,
      index: startIndex + idx,
    }))
  })

  const wrapperStyle = computed(() => ({
    position: 'relative',
    height: `${totalHeight.value}px`,
    overflow: 'hidden',
  }))

  const innerStyle = computed(() => ({
    transform: `translateY(${cachedOffsetMap.value[visibleRange.value.startIndex]}px)`,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
  }))

  function handleScroll(event: Event) {
    const target = event.target as HTMLElement
    scrollTop.value = target.scrollTop
  }

  function scrollToIndex(index: number, behavior: ScrollBehavior = 'auto'): void {
    if (index < 0 || index >= items.value.length) return

    const offset = cachedOffsetMap.value[index]
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({
        top: offset,
        behavior,
      })
    }
  }

  function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({ top: 0, behavior })
    }
  }

  function updateItemSize(index: number, height: number): void {
    if (isDynamic) {
      const newMap = new Map(sizeMap.value)
      newMap.set(index, height)
      sizeMap.value = newMap
    }
  }

  function resetSizes(): void {
    sizeMap.value = new Map()
    scrollTop.value = 0
  }

  onMounted(() => {
    if (scrollContainer.value) {
      scrollContainer.value.addEventListener('scroll', handleScroll, { passive: true })
    }
  })

  onUnmounted(() => {
    if (scrollContainer.value) {
      scrollContainer.value.removeEventListener('scroll', handleScroll)
    }
  })

  watch(items, () => {
    resetSizes()
  })

  return {
    items,
    scrollContainer,
    scrollTop,
    visibleRange,
    visibleItems,
    wrapperStyle,
    innerStyle,
    totalHeight,
    handleScroll,
    scrollToIndex,
    scrollToTop,
    updateItemSize,
    resetSizes,
  }
}

export interface VirtualListItem {
  item: any
  index: number
}
