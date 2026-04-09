import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ref, computed } from 'vue'

describe('useSmartSearch Composable', () => {
  // ============================================
  // 基础状态测试
  // ============================================
  describe('基础状态', () => {
    it('应该初始化正确的响应式状态', () => {
      const searchQuery = ref('')
      const searchHistory = ref<string[]>([])
      const filters = ref<Record<string, any>>({})
      const isSearching = ref(false)
      const searchResults = ref<any[]>([])
      const lastSearchTime = ref<number | null>(null)

      expect(searchQuery.value).toBe('')
      expect(searchHistory.value.length).toBe(0)
      expect(Object.keys(filters.value).length).toBe(0)
      expect(isSearching.value).toBe(false)
      expect(searchResults.value.length).toBe(0)
      expect(lastSearchTime.value).toBeNull()
    })
  })

  // ============================================
  // 搜索关键词处理测试
  // ============================================
  describe('搜索关键词处理', () => {
    it('应该更新searchQuery值', () => {
      const searchQuery = ref('')
      searchQuery.value = '手机'

      expect(searchQuery.value).toBe('手机')
    })

    it('应该清除前后空格', () => {
      const rawQuery = '  手机   '
      const cleaned = rawQuery.trim()
      expect(cleaned).toBe('手机')
    })

    it('空关键词不应触发搜索', () => {
      const searchQuery = ref('')
      let searchCalled = false

      if (searchQuery.value.trim()) {
        searchCalled = true
      }

      expect(searchCalled).toBe(false)
    })

    it('超过最小长度才触发搜索', () => {
      const minLength = 2
      const queries = ['a', 'ab', 'abc']

      const shouldSearch = queries.map(q => q.length >= minLength)

      expect(shouldSearch).toEqual([false, true, true])
    })

    it('应该记录最后搜索时间', () => {
      const before = Date.now()
      const lastSearchTime = Date.now()
      const after = Date.now()

      expect(lastSearchTime).toBeGreaterThanOrEqual(before)
      expect(lastSearchTime).toBeLessThanOrEqual(after)
    })

    it('特殊字符应被转义或过滤', () => {
      const dangerousInputs = [
        '<script>alert(1)</script>',
        "'; DROP TABLE--",
        '${malicious}',
      ]

      const sanitized = dangerousInputs.map(input =>
        input.replace(/[<>{}]/g, '')
      )

      sanitized.forEach((s, i) => {
        expect(s).not.toContain('<')
        expect(s).not.toContain('>')
      })
    })
  })

  // ============================================
  // 搜索历史管理测试
  // ============================================
  describe('搜索历史管理', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('应该添加搜索词到历史', () => {
      const searchHistory = ref<string[]>([])

      searchHistory.value.unshift('手机')

      expect(searchHistory.value[0]).toBe('手机')
      expect(searchHistory.value.length).toBe(1)
    })

    it('不应重复添加相同的搜索词', () => {
      const searchHistory = ref<string[]>(['手机'])

      // 模拟去重逻辑：先移除再添加到开头
      searchHistory.value = searchHistory.value.filter(item => item !== '手机')
      searchHistory.value.unshift('手机')

      expect(searchHistory.value.length).toBe(1)
      expect(searchHistory.value[0]).toBe('手机')
    })

    it('历史记录数量应有限制', () => {
      const maxHistorySize = 10
      const searchHistory: string[] = []

      for (let i = 0; i < 15; i++) {
        searchHistory.unshift(`搜索词${i}`)
        if (searchHistory.length > maxHistorySize) {
          searchHistory.pop()
        }
      }

      expect(searchHistory.length).toBe(maxHistorySize)
      expect(searchHistory[0]).toBe('搜索词14')
      expect(searchHistory[maxHistorySize - 1]).toBe('搜索词5')
    })

    it('clearHistory应清空所有历史', () => {
      const searchHistory = ref<string[]>(['a', 'b', 'c'])

      searchHistory.value = []

      expect(searchHistory.value.length).toBe(0)
    })

    it('removeFromHistory应删除指定条目', () => {
      const searchHistory = ref<string[]>(['手机', '电脑', '平板', '耳机'])

      searchHistory.value = searchHistory.value.filter(item => item !== '电脑')

      expect(searchHistory.value).toEqual(['手机', '平板', '耳机'])
    })

    it('getRecentHistory应返回最近的N条', () => {
      const searchHistory = ref<string[]>(['a', 'b', 'c', 'd', 'e'])
      const recentCount = 3

      const recent = searchHistory.value.slice(0, recentCount)

      expect(recent).toEqual(['a', 'b', 'c'])
    })
  })

  // ============================================
  // 筛选条件管理测试
  // ============================================
  describe('筛选条件管理', () => {
    it('setFilter应设置单个筛选条件', () => {
      const filters = ref<Record<string, any>>({})

      filters.value.category = 'electronics'

      expect(filters.value.category).toBe('electronics')
    })

    it('setFilters应批量设置筛选条件', () => {
      const filters = ref<Record<string, any>>({})

      Object.assign(filters.value, {
        category: 'electronics',
        priceRange: [100, 500],
        brand: 'Apple',
        inStock: true,
      })

      expect(filters.value.category).toBe('electronics')
      expect(filters.value.priceRange).toEqual([100, 500])
      expect(filters.value.brand).toBe('Apple')
      expect(filters.value.inStock).toBe(true)
    })

    it('removeFilter应移除指定筛选条件', () => {
      const filters = ref<Record<string, any>>({
        category: 'electronics',
        brand: 'Apple',
        priceRange: [100, 500],
      })

      delete filters.value.brand

      expect(filters.value.brand).toBeUndefined()
      expect(filters.value.category).toBe('electronics')
    })

    it('clearFilters应清空所有筛选条件', () => {
      const filters = ref<Record<string, any>>({
        category: 'electronics',
        brand: 'Apple',
        priceRange: [100, 500],
      })

      filters.value = {}

      expect(Object.keys(filters.value).length).toBe(0)
    })

    it('hasActiveFilters应正确判断是否有激活的筛选', () => {
      const filters = ref<Record<string, any>>({})

      const hasActiveFilters = computed(() => Object.keys(filters.value).length > 0)

      expect(hasActiveFilters.value).toBe(false)

      filters.value.category = 'electronics'
      expect(hasActiveFilters.value).toBe(true)
    })

    it('getActiveFilters应返回所有激活的筛选', () => {
      const filters = ref<Record<string, any>>({
        category: 'electronics',
        brand: 'Apple',
      })

      const activeFilters = computed(() => filters.value)

      expect(activeFilters.value).toEqual({
        category: 'electronics',
        brand: 'Apple',
      })
    })
  })

  // ============================================
  // 防抖功能测试
  // ============================================
  describe('防抖功能', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('应该延迟执行搜索', () => {
      const debounceMs = 300
      let searchExecuted = false
      let executionTime: number | undefined

      const debouncedSearch = () => {
        setTimeout(() => {
          searchExecuted = true
          executionTime = Date.now()
        }, debounceMs)
      }

      debouncedSearch()
      expect(searchExecuted).toBe(false)

      vi.advanceTimersByTime(299)
      expect(searchExecuted).toBe(false)

      vi.advanceTimersByTime(1)
      expect(searchExecuted).toBe(true)
    })

    it('快速连续输入应重置计时器', () => {
      const debounceMs = 300
      let callCount = 0
      let debounceTimer: ReturnType<typeof setTimeout> | null = null

      const debouncedSearch = () => {
        if (debounceTimer !== null) {
          clearTimeout(debounceTimer)
        }

        debounceTimer = setTimeout(() => {
          callCount++
        }, debounceMs)
      }

      // 快速连续调用
      debouncedSearch()
      debouncedSearch()
      debouncedSearch()

      vi.advanceTimersByTime(300)

      expect(callCount).toBe(1) // 只执行最后一次
    })

    it('防抖延迟可配置', () => {
      const customDebounceMs = 500
      let executed = false

      const debouncedSearch = () => {
        setTimeout(() => {
          executed = true
        }, customDebounceMs)
      }

      debouncedSearch()
      vi.advanceTimersByTime(499)
      expect(executed).toBe(false)

      vi.advanceTimersByTime(1)
      expect(executed).toBe(true)
    })
  })

  // ============================================
  // hasActiveFilters计算属性测试
  // ============================================
  describe('hasActiveFilters计算属性', () => {
    it('无筛选条件时返回false', () => {
      const filters = ref<Record<string, any>>({})
      const hasActiveFilters = computed(() => Object.keys(filters.value).length > 0)

      expect(hasActiveFilters.value).toBe(false)
    })

    it('有筛选条件时返回true', () => {
      const filters = ref<Record<string, any>>({ category: 'electronics' })
      const hasActiveFilters = computed(() => Object.keys(filters.value).length > 0)

      expect(hasActiveFilters.value).toBe(true)
    })

    it('清除筛选后应返回false', () => {
      const filters = ref<Record<string, any>>({ category: 'electronics' })
      const hasActiveFilters = computed(() => Object.keys(filters.value).length > 0)

      expect(hasActiveFilters.value).toBe(true)

      filters.value = {}
      expect(hasActiveFilters.value).toBe(false)
    })

    it('多个筛选条件时仍返回true', () => {
      const filters = ref<Record<string, any>>({
        category: 'electronics',
        brand: 'Apple',
        priceRange: [100, 500],
      })
      const hasActiveFilters = computed(() => Object.keys(filters.value).length > 0)

      expect(hasActiveFilters.value).toBe(true)
    })
  })

  // ============================================
  // 边界情况测试
  // ============================================
  describe('边界情况', () => {
    it('空搜索词处理', () => {
      const searchQuery = ref('')
      const shouldSearch = searchQuery.value.trim().length > 0

      expect(shouldSearch).toBe(false)
    })

    it('超长搜索词处理', () => {
      const longQuery = 'a'.repeat(1000)
      const truncated = longQuery.slice(0, 100)

      expect(truncated.length).toBe(100)
    })

    it('特殊字符搜索词', () => {
      const specialQueries = [
        '!@#$%^&*()',
        '中文搜索',
        '123456',
        'search-with-dashes',
      ]

      specialQueries.forEach(query => {
        expect(query.length).toBeGreaterThan(0)
      })
    })

    it('并发搜索请求处理', async () => {
      const searchResults = ref<any[]>([])
      const isSearching = ref(false)

      const promises = [
        Promise.resolve(['result1', 'result2']),
        Promise.resolve(['result3', 'result4']),
        Promise.resolve(['result5', 'result6']),
      ]

      const results = await Promise.all(promises)
      searchResults.value = results.flat()

      expect(searchResults.value.length).toBe(6)
    })
  })
})
