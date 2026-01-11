import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  formatDate,
  deepClone,
  isEmpty,
  debounce,
  throttle,
  formatNumber,
  formatFileSize,
  generateUniqueId,
  copyToClipboard,
  scrollToElement,
  getUrlParam,
  downloadFile,
  onResize,
} from '@/utils/index'

describe('工具函数测试', () => {
  describe('formatDate', () => {
    it('should format date correctly with default format', () => {
      const date = new Date('2024-01-01T12:34:56')
      expect(formatDate(date)).toBe('2024-01-01 12:34:56')
    })

    it('should format date with custom format', () => {
      const date = new Date('2024-01-01T12:34:56')
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-01')
      expect(formatDate(date, 'HH:mm:ss')).toBe('12:34:56')
      expect(formatDate(date, 'YYYY/MM/DD HH:mm')).toBe('2024/01/01 12:34')
    })

    it('should handle timestamp input', () => {
      const timestamp = new Date('2024-01-01T12:34:56').getTime()
      expect(formatDate(timestamp)).toBe('2024-01-01 12:34:56')
    })

    it('should handle string input', () => {
      const dateString = '2024-01-01T12:34:56'
      expect(formatDate(dateString)).toBe('2024-01-01 12:34:56')
    })
  })

  describe('deepClone', () => {
    it('should return primitive values as-is', () => {
      expect(deepClone(123)).toBe(123)
      expect(deepClone('test')).toBe('test')
      expect(deepClone(true)).toBe(true)
      expect(deepClone(null)).toBe(null)
      expect(deepClone(undefined)).toBe(undefined)
    })

    it('should clone objects deeply', () => {
      const original = { a: 1, b: { c: 2, d: [3, 4] } }
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).not.toBe(original.b)
      expect(cloned.b.d).not.toBe(original.b.d)
    })

    it('should clone arrays deeply', () => {
      const original = [1, 2, { a: 3, b: [4, 5] }]
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned[2]).not.toBe(original[2])
      expect(cloned[2].b).not.toBe(original[2].b)
    })

    it('should clone dates correctly', () => {
      const original = new Date()
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned instanceof Date).toBe(true)
    })
  })

  describe('isEmpty', () => {
    it('should return true for null and undefined', () => {
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
    })

    it('should return true for empty strings', () => {
      expect(isEmpty('')).toBe(true)
      expect(isEmpty('   ')).toBe(true)
    })

    it('should return true for empty arrays', () => {
      expect(isEmpty([])).toBe(true)
    })

    it('should return true for empty objects', () => {
      expect(isEmpty({})).toBe(true)
    })

    it('should return false for non-empty values', () => {
      expect(isEmpty('test')).toBe(false)
      expect(isEmpty([1, 2, 3])).toBe(false)
      expect(isEmpty({ a: 1 })).toBe(false)
      expect(isEmpty(0)).toBe(false)
      expect(isEmpty(false)).toBe(false)
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn(1, 2, 3)
      debouncedFn(4, 5, 6)
      debouncedFn(7, 8, 9)

      expect(mockFn).not.toHaveBeenCalled()

      return new Promise(resolve => {
        setTimeout(() => {
          expect(mockFn).toHaveBeenCalledTimes(1)
          expect(mockFn).toHaveBeenCalledWith(7, 8, 9)
          resolve(true)
        }, 150)
      })
    })

    it('should reset timeout when called again', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()

      setTimeout(() => {
        debouncedFn()
      }, 50)

      return new Promise(resolve => {
        setTimeout(() => {
          expect(mockFn).not.toHaveBeenCalled()
        }, 120)

        setTimeout(() => {
          expect(mockFn).toHaveBeenCalledTimes(1)
          resolve(true)
        }, 200)
      })
    })
  })

  describe('throttle', () => {
    it('should throttle function calls', () => {
      const mockFn = vi.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn(1)
      throttledFn(2)
      throttledFn(3)

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith(1)

      return new Promise(resolve => {
        setTimeout(() => {
          throttledFn(4)
          expect(mockFn).toHaveBeenCalledTimes(2)
          expect(mockFn).toHaveBeenCalledWith(4)
          resolve(true)
        }, 150)
      })
    })

    it('should not call function again within limit', () => {
      const mockFn = vi.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn(1)

      return new Promise(resolve => {
        setTimeout(() => {
          throttledFn(2)
          expect(mockFn).toHaveBeenCalledTimes(1)
          resolve(true)
        }, 50)
      })
    })
  })

  describe('formatNumber', () => {
    it('should format number with default decimals', () => {
      expect(formatNumber(1234567.89)).toBe('1,234,567.89')
    })

    it('should format number with custom decimals', () => {
      expect(formatNumber(1234.567, 1)).toBe('1,234.6')
      expect(formatNumber(1234.567, 0)).toBe('1,235')
    })

    it('should handle string input', () => {
      expect(formatNumber('1234.56')).toBe('1,234.56')
    })

    it('should handle NaN input', () => {
      expect(formatNumber(NaN)).toBe('0.00')
      expect(formatNumber('not a number')).toBe('0.00')
    })

    it('should handle zero input', () => {
      expect(formatNumber(0)).toBe('0.00')
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(100)).toBe('100 Bytes')
    })

    it('should format KB correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(2048)).toBe('2 KB')
    })

    it('should format MB correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB')
    })

    it('should format GB correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })

    it('should format TB correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe('1 TB')
    })
  })

  describe('generateUniqueId', () => {
    it('should generate unique ids', () => {
      const id1 = generateUniqueId()
      const id2 = generateUniqueId()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(10)
    })

    it('should generate id with correct format', () => {
      const id = generateUniqueId()
      // 检查是否由字母和数字组成
      expect(/^[a-z0-9]+$/i.test(id)).toBe(true)
    })
  })

  describe('copyToClipboard', () => {
    it('should copy text to clipboard using navigator.clipboard', async () => {
      const writeTextSpy = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText: writeTextSpy },
      })

      await copyToClipboard('test text')
      expect(writeTextSpy).toHaveBeenCalledWith('test text')
    })
  })

  describe('scrollToElement', () => {
    it('should scroll to element by selector', () => {
      // 模拟document.querySelector
      const mockElement = {
        getBoundingClientRect: vi.fn().mockReturnValue({
          top: 100,
        }),
      } as unknown as HTMLElement
      const querySelectorSpy = vi.spyOn(document, 'querySelector').mockReturnValue(mockElement)
      // 模拟window.scrollTo
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

      scrollToElement('#test-element', 50)
      expect(querySelectorSpy).toHaveBeenCalledWith('#test-element')
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 50,
        behavior: 'smooth',
      })

      // 清理spies
      querySelectorSpy.mockRestore()
      scrollToSpy.mockRestore()
    })

    it('should scroll to HTMLElement directly', () => {
      // 模拟HTMLElement
      const mockElement = {
        getBoundingClientRect: vi.fn().mockReturnValue({
          top: 200,
        }),
      } as unknown as HTMLElement
      // 模拟window.scrollTo
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

      scrollToElement(mockElement)
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 200,
        behavior: 'smooth',
      })

      // 清理spies
      scrollToSpy.mockRestore()
    })

    it('should do nothing if element not found', () => {
      // 模拟document.querySelector返回null
      const querySelectorSpy = vi.spyOn(document, 'querySelector').mockReturnValue(null)
      // 模拟window.scrollTo
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

      scrollToElement('#non-existent-element')
      expect(querySelectorSpy).toHaveBeenCalledWith('#non-existent-element')
      expect(scrollToSpy).not.toHaveBeenCalled()

      // 清理spies
      querySelectorSpy.mockRestore()
      scrollToSpy.mockRestore()
    })
  })

  describe('downloadFile', () => {
    it('should create and click download link', () => {
      // 模拟document.createElement
      const mockLink = {
        href: '',
        download: '',
        style: {},
        click: vi.fn(),
      } as unknown as HTMLAnchorElement
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink)
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockReturnValue(null)
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockReturnValue(null)

      downloadFile('http://example.com/file.txt', 'test.txt')
      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(mockLink.href).toBe('http://example.com/file.txt')
      expect(mockLink.download).toBe('test.txt')
      expect(mockLink.click).toHaveBeenCalled()
      expect(appendChildSpy).toHaveBeenCalled()
      expect(removeChildSpy).toHaveBeenCalled()
    })

    it('should use default filename when not provided', () => {
      // 模拟document.createElement
      const mockLink = {
        href: '',
        download: '',
        style: {},
        click: vi.fn(),
      } as unknown as HTMLAnchorElement
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink)
      vi.spyOn(document.body, 'appendChild').mockReturnValue(null)
      vi.spyOn(document.body, 'removeChild').mockReturnValue(null)

      downloadFile('http://example.com/file.txt')
      expect(mockLink.download).toBe('')
    })
  })

  describe('onResize', () => {
    it('should add resize event listener and return cleanup function', () => {
      // 模拟window.addEventListener和removeEventListener
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener').mockImplementation(() => {})
      const removeEventListenerSpy = vi
        .spyOn(window, 'removeEventListener')
        .mockImplementation(() => {})

      const callback = vi.fn()
      const cleanup = onResize(callback)

      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', callback)
      expect(callback).toHaveBeenCalledTimes(1) // 立即执行一次

      cleanup()
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', callback)
    })
  })
})
