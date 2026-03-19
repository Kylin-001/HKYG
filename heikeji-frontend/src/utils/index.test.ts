import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { testUserData } from '@/config/test'
import { formatDate, debounce, throttle } from '@/utils'

describe('Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly with default format', () => {
      const date = new Date('2024-03-04T00:00:00')
      const result = formatDate(date)
      expect(result).toContain('2024-03-04')
    })

    it('should format date with custom format', () => {
      const date = new Date('2024-03-04T00:00:00')
      expect(formatDate(date, 'YYYY/MM/DD')).toBe('2024/03/04')
    })

    it('should format date with time', () => {
      const date = new Date('2024-03-04T14:30:00')
      const result = formatDate(date, 'YYYY-MM-DD HH:mm:ss')
      expect(result).toContain('2024-03-04')
      expect(result).toContain('14:30')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should debounce function calls', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 300)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(300)
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throttle function calls', () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 300)

      throttledFn()
      expect(fn).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(100)
      throttledFn()
      expect(fn).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(200)
      throttledFn()
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })
})
