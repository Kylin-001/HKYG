import { describe, it, expect, beforeEach } from 'vitest'
import { calculateVisibleRange, calculateTotalHeight, type VirtualScrollOptions } from '@/utils/virtualScroll'

describe('Virtual Scroll Utils', () => {
  describe('calculateVisibleRange', () => {
    const defaultOptions: VirtualScrollOptions = {
      itemHeight: 50,
      containerHeight: 300,
      scrollTop: 0,
      totalItems: 100,
      bufferSize: 2,
    }

    it('应该计算正确的可视范围', () => {
      const range = calculateVisibleRange(defaultOptions)

      expect(range.startIndex).toBe(0)
      expect(range.endIndex).toBe(8) // 300/50 + 2(buffer)
      expect(range.visibleCount).toBe(6) // 300/50
    })

    it('应该考虑滚动位置', () => {
      const range = calculateVisibleRange({
        ...defaultOptions,
        scrollTop: 250,
      })

      expect(range.startIndex).toBe(3) // 250/50 - 2(buffer)
      expect(range.endIndex).toBe(13) // 250/50 + 6 + 2(buffer)
    })

    it('不应该超出总项目数', () => {
      const range = calculateVisibleRange({
        ...defaultOptions,
        scrollTop: 5000,
        totalItems: 10,
      })

      expect(range.endIndex).toBeLessThanOrEqual(10)
    })

    it('起始索引不应该小于0', () => {
      const range = calculateVisibleRange({
        ...defaultOptions,
        scrollTop: -100,
      })

      expect(range.startIndex).toBe(0)
    })
  })

  describe('calculateTotalHeight', () => {
    it('应该计算正确的总高度', () => {
      const height = calculateTotalHeight(100, 50)
      expect(height).toBe(5000)
    })

    it('应该处理0个项目', () => {
      const height = calculateTotalHeight(0, 50)
      expect(height).toBe(0)
    })

    it('应该处理不同的高度', () => {
      const height = calculateTotalHeight(50, 100)
      expect(height).toBe(5000)
    })
  })
})
