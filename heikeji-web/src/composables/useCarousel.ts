import { ref, onMounted, onUnmounted, computed, type Ref } from 'vue'

export interface CarouselItem {
  id: number | string
  [key: string]: any
}

interface UseCarouselOptions {
  items: Ref<CarouselItem[]>
  autoplay?: boolean
  interval?: number
  transition?: 'fade' | 'slide'
  loop?: boolean
  pauseOnHover?: boolean
  touchSupport?: boolean
}

export function useCarousel(options: UseCarouselOptions) {
  const {
    items,
    autoplay = true,
    interval = 5000,
    transition = 'fade',
    loop = true,
    pauseOnHover = true,
    touchSupport = true,
  } = options

  const currentIndex = ref(0)
  const isPlaying = ref(autoplay)
  const isTransitioning = ref(false)
  const touchStartX = ref(0)
  const touchEndX = ref(0)

  let timer: ReturnType<typeof setInterval> | null = null

  const currentItem = computed(() => items.value[currentIndex.value] || null)
  const totalItems = computed(() => items.value.length)
  const canGoPrev = computed(() => loop || currentIndex.value > 0)
  const canGoNext = computed(() => loop || currentIndex.value < totalItems.value - 1)

  function goTo(index: number) {
    if (isTransitioning.value) return
    if (index < 0 || index >= totalItems.value) return
    if (index === currentIndex.value) return

    isTransitioning.value = true
    currentIndex.value = index

    setTimeout(() => {
      isTransitioning.value = false
    }, 500)
  }

  function goNext() {
    if (totalItems.value <= 1) return

    if (currentIndex.value >= totalItems.value - 1) {
      if (loop) {
        goTo(0)
      }
    } else {
      goTo(currentIndex.value + 1)
    }
  }

  function goPrev() {
    if (totalItems.value <= 1) return

    if (currentIndex.value <= 0) {
      if (loop) {
        goTo(totalItems.value - 1)
      }
    } else {
      goTo(currentIndex.value - 1)
    }
  }

  function play() {
    if (!autoplay) return
    isPlaying.value = true
    startTimer()
  }

  function pause() {
    isPlaying.value = false
    stopTimer()
  }

  function toggle() {
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }

  function startTimer() {
    stopTimer()
    if (autoplay && totalItems.value > 1) {
      timer = setInterval(goNext, interval)
    }
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function handleTouchStart(e: TouchEvent) {
    if (!touchSupport) return
    touchStartX.value = e.touches[0].clientX
  }

  function handleTouchMove(e: TouchEvent) {
    if (!touchSupport) return
    touchEndX.value = e.changedTouches[0].clientX
  }

  function handleTouchEnd() {
    if (!touchSupport) return
    const diff = touchStartX.value - touchEndX.value
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goNext()
      } else {
        goPrev()
      }
    }

    touchStartX.value = 0
    touchEndX.value = 0
  }

  function handleMouseEnter() {
    if (pauseOnHover) {
      pause()
    }
  }

  function handleMouseLeave() {
    if (pauseOnHover && isPlaying.value === false) {
      play()
    }
  }

  onMounted(() => {
    if (autoplay && totalItems.value > 1) {
      startTimer()
    }
  })

  onUnmounted(() => {
    stopTimer()
  })

  return {
    currentIndex,
    currentItem,
    totalItems,
    isPlaying,
    isTransitioning,
    canGoPrev,
    canGoNext,
    goTo,
    goNext,
    goPrev,
    play,
    pause,
    toggle,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseEnter,
    handleMouseLeave,
  }
}
