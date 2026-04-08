import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'

describe('useCarousel - Pure Logic Tests', () => {
  const createCarousel = (options?: any) => {
    const items = ref([
      { id: 1, title: 'Banner 1' },
      { id: 2, title: 'Banner 2' },
      { id: 3, title: 'Banner 3' },
    ])

    let currentIndexValue = 0
    let isTransitioningValue = false

    return {
      items,
      currentIndex: {
        get value() { return currentIndexValue },
        set value(v: number) { currentIndexValue = v }
      },
      currentItem: {
        get value() { return items.value[currentIndexValue] || null }
      },
      totalItems: {
        get value() { return items.value.length }
      },
      isPlaying: ref(options?.autoplay ?? true),
      isTransitioning: {
        get value() { return isTransitioningValue }
      },
      canGoPrev: {
        get value() {
          const loop = options?.loop ?? true
          return loop || currentIndexValue > 0
        }
      },
      canGoNext: {
        get value() {
          const loop = options?.loop ?? true
          return loop || currentIndexValue < items.value.length - 1
        }
      },
      goTo(index: number) {
        if (isTransitioningValue) return
        if (index < 0 || index >= items.value.length) return
        if (index === currentIndexValue) return

        isTransitioningValue = true
        currentIndexValue = index

        setTimeout(() => {
          isTransitioningValue = false
        }, 500)
      },
      goNext() {
        if (items.value.length <= 1) return
        const loop = options?.loop ?? true

        if (currentIndexValue >= items.value.length - 1) {
          if (loop) {
            currentIndexValue = 0
          }
        } else {
          currentIndexValue++
        }
      },
      goPrev() {
        if (items.value.length <= 1) return
        const loop = options?.loop ?? true

        if (currentIndexValue <= 0) {
          if (loop) {
            currentIndexValue = items.value.length - 1
          }
        } else {
          currentIndexValue--
        }
      },
    }
  }

  it('should initialize with first item', () => {
    const carousel = createCarousel({ autoplay: false })

    expect(carousel.currentIndex.value).toBe(0)
    expect(carousel.currentItem.value).toEqual({ id: 1, title: 'Banner 1' })
  })

  it('should go to next item', () => {
    const carousel = createCarousel({ autoplay: false })

    carousel.goNext()
    expect(carousel.currentIndex.value).toBe(1)

    carousel.goNext()
    expect(carousel.currentIndex.value).toBe(2)
  })

  it('should loop to first item when at end', () => {
    const carousel = createCarousel({ autoplay: false, loop: true })

    carousel.goNext() // index 1
    carousel.goNext() // index 2
    carousel.goNext() // should loop to 0

    expect(carousel.currentIndex.value).toBe(0)
  })

  it('should not loop when loop is false', () => {
    const carousel = createCarousel({ autoplay: false, loop: false })

    carousel.goNext() // index 1
    carousel.goNext() // index 2
    carousel.goNext() // should stay at 2

    expect(carousel.currentIndex.value).toBe(2)
    expect(carousel.canGoNext.value).toBe(false)
  })

  it('should go to previous item', () => {
    const carousel = createCarousel({ autoplay: false })

    carousel.goNext() // index 1
    carousel.goPrev()

    expect(carousel.currentIndex.value).toBe(0)
  })

  it('should loop to last item when at start', () => {
    const carousel = createCarousel({ autoplay: false, loop: true })

    carousel.goPrev() // should loop to last item (index 2)

    expect(carousel.currentIndex.value).toBe(2)
  })

  it('should navigate to specific index', () => {
    const carousel = createCarousel({ autoplay: false })

    carousel.goTo(2)

    expect(carousel.currentIndex.value).toBe(2)
  })

  it('should not navigate if index out of bounds', () => {
    const carousel = createCarousel({ autoplay: false })

    carousel.goTo(-1)
    expect(carousel.currentIndex.value).toBe(0)

    carousel.goTo(10)
    expect(carousel.currentIndex.value).toBe(0)
  })

  it('should calculate total items correctly', () => {
    const carousel = createCarousel({ autoplay: false })

    expect(carousel.totalItems.value).toBe(3)
  })

  it('should not navigate during transition', () => {
    const carousel = createCarousel({ autoplay: false })

    // Start transition
    carousel.goTo(1)
    expect(carousel.isTransitioning.value).toBe(true)

    // Try to navigate during transition (should be blocked)
    carousel.goTo(2)
    expect(carousel.currentIndex.value).toBe(1) // Should stay at 1
  })
})
