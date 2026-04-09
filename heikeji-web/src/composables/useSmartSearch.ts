import { ref, computed, watch, type Ref } from 'vue'
import Fuse from 'fuse.js'

export interface SearchableItem {
  id: string | number
  [key: string]: any
}

interface SearchFilter {
  key: string
  label: string
  value: any
  type: 'select' | 'range' | 'checkbox' | 'radio'
  options?: Array<{ label: string; value: any }>
}

interface SearchSuggestion {
  text: string
  type: 'keyword' | 'category' | 'product' | 'history'
  count?: number
  data?: any
}

interface UseSmartSearchOptions<T extends SearchableItem> {
  items: Ref<T[]>
  /** 搜索字段 (支持嵌套路径如 'category.name') */
  keys: string[]
  /** 搜索阈值 (0-1, 越低越严格) */
  threshold?: number
  /** 最大结果数 */
  limit?: number
  /** 是否启用拼音搜索 */
  pinyin?: boolean
  /** 搜索历史最大条数 */
  maxHistory?: number
  /** 热门搜索关键词 */
  hotKeywords?: string[]
  /** 搜索建议API (可选) */
  suggestionApi?: (keyword: string) => Promise<SearchSuggestion[]>
  /** 是否启用搜索建议 */
  enableSuggestions?: boolean
  /** 筛选条件定义 */
  filters?: SearchFilter[]
  /** 是否持久化筛选条件 */
  persistFilters?: boolean
  /** 防抖延迟(ms) */
  debounceDelay?: number
}

interface SearchResult<T> {
  item: T
  score: number
  matches?: readonly Fuse.FuseResultMatch[]
}

/**
 * AI智能搜索 Composable（增强版）
 *
 * 功能:
 * - 模糊搜索 (Fuse.js)
 * - 搜索建议 (实时 + API)
 * - 搜索历史 (本地存储)
 * - 热门搜索统计
 * - 筛选条件管理
 * - 筛选条件持久化
 * - 搜索结果高亮
 * - 搜索结果分组
 */
export function useSmartSearch<T extends SearchableItem>(options: UseSmartSearchOptions<T>) {
  const {
    items,
    keys,
    threshold = 0.3,
    limit = 10,
    pinyin = false,
    maxHistory = 20,
    hotKeywords = [],
    suggestionApi,
    enableSuggestions = true,
    filters = [],
    persistFilters = true,
    debounceDelay = 300,
  } = options

  const searchKeyword = ref('')
  const searchResults = ref<SearchResult<T>[]>([])
  const isSearching = ref(false)
  const showSuggestions = ref(false)
  const suggestions = ref<SearchSuggestion[]>([])
  const isFetchingSuggestions = ref(false)

  // 搜索历史
  const searchHistory = ref<string[]>([])
  const HISTORY_KEY = 'smart-search-history'

  // 热门搜索
  const hotSearches = ref<string[]>(hotKeywords)
  const HOT_KEY_PREFIX = 'smart-search-hot-'

  // 筛选条件
  const activeFilters = ref<Map<string, any>>(new Map())
  const FILTERS_KEY = 'smart-search-filters'

  // Fuse.js 实例
  let fuseInstance: Fuse<T> | null = null

  /**
   * 初始化/更新Fuse.js实例
   */
  function initFuse() {
    if (!items.value || items.value.length === 0) return

    fuseInstance = new Fuse(items.value, {
      keys,
      threshold,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 1,
      ignoreLocation: true,
      useExtendedSearch: true,
      findAllMatches: false,
      isCaseSensitive: false,
      shouldSort: true,
      sortFn: (a, b) => (a.score ?? 0) - (b.score ?? 0),
    })
  }

  /**
   * 执行搜索
   */
  function search(keyword: string): SearchResult<T>[] {
    if (!keyword.trim()) {
      searchResults.value = []
      return []
    }

    if (!fuseInstance || items.value.length === 0) {
      searchResults.value = []
      return []
    }

    isSearching.value = true

    try {
      // 应用筛选条件
      let filteredItems = items.value

      activeFilters.value.forEach((value, key) => {
        filteredItems = applyFilter(filteredItems, key, value)
      })

      // 如果有筛选条件且没有关键词，返回筛选后的所有项目
      if (!keyword.trim() && activeFilters.value.size > 0) {
        searchResults.value = filteredItems.map((item) => ({
          item,
          score: 1,
        }))
        return searchResults.value
      }

      // 对筛选后的数据执行搜索
      if (filteredItems.length > 0 && keyword.trim()) {
        const tempFuse = new Fuse(filteredItems, {
          keys,
          threshold,
          includeScore: true,
          includeMatches: true,
          minMatchCharLength: 1,
          ignoreLocation: true,
          useExtendedSearch: true,
          findAllMatches: false,
          isCaseSensitive: false,
          shouldSort: true,
        })

        const results = tempFuse.search(keyword, { limit })

        searchResults.value = results.map((result) => ({
          item: result.item,
          score: result.score ?? 0,
          matches: result.matches,
        }))
      } else {
        searchResults.value = []
      }

      return searchResults.value
    } catch (error) {
      console.error('[SmartSearch] Search error:', error)
      searchResults.value = []
      return []
    } finally {
      isSearching.value = false
    }
  }

  /**
   * 应用单个筛选条件
   */
  function applyFilter(items: T[], filterKey: string, value: any): T[] {
    const filterDef = filters.find(f => f.key === filterKey)
    if (!filterDef) return items

    switch (filterDef.type) {
      case 'select':
      case 'radio':
        return items.filter(item => item[filterKey] === value)

      case 'range':
        if (Array.isArray(value) && value.length === 2) {
          return items.filter(
            item => item[filterKey] >= value[0] && item[filterKey] <= value[1]
          )
        }
        return items

      case 'checkbox':
        if (Array.isArray(value)) {
          return items.filter(item => value.includes(item[filterKey]))
        }
        return items.filter(item => item[filterKey] === value)

      default:
        return items.filter(item => item[filterKey] === value)
    }
  }

  /**
   * 防抖搜索
   */
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function debouncedSearch(keyword: string, delay = debounceDelay): void {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      search(keyword)

      // 同时获取搜索建议
      if (enableSuggestions && keyword.trim().length > 0) {
        fetchSuggestions(keyword)
      }

      showSuggestions.value = keyword.length > 0
    }, delay)
  }

  /**
   * 获取搜索建议
   */
  async function fetchSuggestions(keyword: string): Promise<void> {
    if (!suggestionApi || !enableSuggestions) {
      suggestions.value = generateLocalSuggestions(keyword)
      return
    }

    isFetchingSuggestions.value = true

    try {
      const apiSuggestions = await suggestionApi(keyword)

      // 合并本地建议和API建议
      const localSuggestions = generateLocalSuggestions(keyword)
      const merged = [...apiSuggestions]

      // 去重
      apiSuggestions.forEach(apiSuggestion => {
        const exists = localSuggestions.some(
          local => local.text.toLowerCase() === apiSuggestion.text.toLowerCase()
        )
        if (!exists) {
          merged.push(apiSuggestion)
        }
      })

      suggestions.value = merged.slice(0, 10)
    } catch (error) {
      console.warn('[SmartSearch] Failed to fetch suggestions:', error)
      // 降级到本地建议
      suggestions.value = generateLocalSuggestions(keyword)
    } finally {
      isFetchingSuggestions.value = false
    }
  }

  /**
   * 生成本地搜索建议
   */
  function generateLocalSuggestions(keyword: string): SearchSuggestion[] {
    const result: SearchSuggestion[] = []

    // 从历史记录中匹配
    const matchingHistory = searchHistory.value.filter(h =>
      h.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 3)

    matchingHistory.forEach(text => {
      result.push({ text, type: 'history' })
    })

    // 从热门搜索中匹配
    const matchingHot = hotSearches.value.filter(h =>
      h.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 3)

    matchingHot.forEach(text => {
      if (!result.some(r => r.text === text)) {
        result.push({ text, type: 'keyword', count: getHotSearchCount(text) })
      }
    })

    return result
  }

  /**
   * 高亮匹配文本
   */
  function highlightText(text: string, matches?: readonly Fuse.FuseResultMatch[]): string {
    if (!matches || matches.length === 0) return text

    let highlightedText = text

    for (const match of matches) {
      if (match.indices && Array.isArray(match.indices)) {
        const indices = [...match.indices].sort((a, b) => a[0] - b[0])

        let offset = 0

        for (const [start, end] of indices) {
          const prefix = highlightedText.slice(0, start + offset)
          const matched = highlightedText.slice(start + offset, end + offset + 1)
          const suffix = highlightedText.slice(end + offset + 1)

          highlightedText = `${prefix}<mark class="search-highlight">${matched}</mark>${suffix}`
          offset += '<mark class="search-highlight">'.length + '</mark>'.length
        }
      }
    }

    return highlightedText
  }

  /**
   * 获取字段的高亮值
   */
  function getHighlightedField(item: T, field: string, matches?: Array<{ key: string; indices: Array<[number, number]> }>): string {
    const value = getNestedValue(item, field)

    if (typeof value !== 'string') return String(value)

    const fieldMatch = matches?.find((m) => m.key === field)

    return highlightText(value, fieldMatch ? [fieldMatch] : undefined)
  }

  /**
   * 获取嵌套对象值
   */
  function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  // ====== 搜索历史 ======

  /**
   * 添加到搜索历史
   */
  function addToHistory(keyword: string): void {
    keyword = keyword.trim()
    if (!keyword) return

    // 移除重复项
    const index = searchHistory.value.indexOf(keyword)
    if (index > -1) {
      searchHistory.value.splice(index, 1)
    }

    // 添加到开头
    searchHistory.value.unshift(keyword)

    // 限制数量
    if (searchHistory.value.length > maxHistory) {
      searchHistory.value = searchHistory.value.slice(0, maxHistory)
    }

    // 持久化存储
    saveHistory()
  }

  /**
   * 从历史中移除
   */
  function removeFromHistory(keyword: string): void {
    searchHistory.value = searchHistory.value.filter((k) => k !== keyword)
    saveHistory()
  }

  /**
   * 清空搜索历史
   */
  function clearHistory(): void {
    searchHistory.value = []
    localStorage.removeItem(HISTORY_KEY)
  }

  /**
   * 加载搜索历史
   */
  function loadHistory(): void {
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      if (saved) {
        searchHistory.value = JSON.parse(saved)
      }
    } catch (e) {
      console.warn('[SmartSearch] Failed to load history:', e)
    }
  }

  /**
   * 保存搜索历史
   */
  function saveHistory(): void {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(searchHistory.value))
    } catch (e) {
      console.warn('[SmartSearch] Failed to save history:', e)
    }
  }

  // ====== 热门搜索 ======

  /**
   * 记录热门搜索
   */
  function recordHotSearch(keyword: string): void {
    keyword = keyword.trim().toLowerCase()
    if (!keyword) return

    const key = `${HOT_KEY_PREFIX}${keyword}`

    try {
      let count = parseInt(localStorage.getItem(key) || '0', 10)
      count++
      localStorage.setItem(key, String(count))
    } catch (e) {}
  }

  /**
   * 获取热门搜索计数
   */
  function getHotSearchCount(keyword: string): number {
    const key = `${HOT_KEY_PREFIX}${keyword}`
    return parseInt(localStorage.getItem(key) || '0', 10)
  }

  /**
   * 获取热门搜索排行
   */
  async function getTopHotSearches(limitCount = 10): Promise<string[]> {
    const counts: { keyword: string; count: number }[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(HOT_KEY_PREFIX)) {
        const keyword = key.replace(HOT_KEY_PREFIX, '')
        const count = parseInt(localStorage.getItem(key) || '0', 10)

        if (count > 0) {
          counts.push({ keyword, count })
        }
      }
    }

    // 排序并返回前N个
    counts.sort((a, b) => b.count - a.count)

    return counts.slice(0, limitCount).map((item) => item.keyword)
  }

  // ====== 筛选条件管理 ======

  /**
   * 设置筛选条件
   */
  function setFilter(filterKey: string, value: any): void {
    if (value === null || value === undefined || value === '') {
      activeFilters.value.delete(filterKey)
    } else {
      activeFilters.value.set(filterKey, value)
    }

    // 持久化
    if (persistFilters) {
      saveFilters()
    }

    // 重新搜索
    if (searchKeyword.value) {
      search(searchKeyword.value)
    }
  }

  /**
   * 清除指定筛选条件
   */
  function clearFilter(filterKey: string): void {
    activeFilters.value.delete(filterKey)

    if (persistFilters) {
      saveFilters()
    }

    if (searchKeyword.value) {
      search(searchKeyword.value)
    }
  }

  /**
   * 清除所有筛选条件
   */
  function clearAllFilters(): void {
    activeFilters.value.clear()

    if (persistFilters) {
      saveFilters()
    }

    if (searchKeyword.value) {
      search(searchKeyword.value)
    }
  }

  /**
   * 加载筛选条件
   */
  function loadFilters(): void {
    if (!persistFilters) return

    try {
      const saved = localStorage.getItem(FILTERS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        activeFilters.value = new Map(Object.entries(parsed))
      }
    } catch (e) {
      console.warn('[SmartSearch] Failed to load filters:', e)
    }
  }

  /**
   * 保存筛选条件
   */
  function saveFilters(): void {
    try {
      const obj = Object.fromEntries(activeFilters)
      localStorage.setItem(FILTERS_KEY, JSON.stringify(obj))
    } catch (e) {
      console.warn('[SmartSearch] Failed to save filters:', e)
    }
  }

  /**
   * 获取筛选条件的显示值
   */
  function getFilterDisplayValue(filterKey: string): string {
    const value = activeFilters.value.get(filterKey)
    const filterDef = filters.find(f => f.key === filterKey)

    if (!filterDef || !value) return ''

    if (filterDef.options) {
      const option = filterDef.options.find(opt => opt.value === value)
      return option?.label || String(value)
    }

    if (Array.isArray(value)) {
      return value.map(v => {
        const opt = filterDef.options?.find(o => o.value === v)
        return opt?.label || String(v)
      }).join(', ')
    }

    return String(value)
  }

  // ====== 结果选择 ======

  /**
   * 选择搜索结果
   */
  function selectResult(result: SearchResult<T>): void {
    addToHistory(searchKeyword.value)
    recordHotSearch(searchKeyword.value)
    showSuggestions.value = false

    return result.item
  }

  /**
   * 清空搜索
   */
  function clearSearch(): void {
    searchKeyword.value = ''
    searchResults.value = []
    showSuggestions.value = false
    suggestions.value = []
  }

  /**
   * 从历史中选择
   */
  function selectFromHistory(keyword: string): void {
    searchKeyword.value = keyword
    search(keyword)
    addToHistory(keyword)
  }

  // 计算属性
  const hasResults = computed(() => searchResults.value.length > 0)
  const hasHistory = computed(() => searchHistory.value.length > 0)
  const hasActiveFilters = computed(() => activeFilters.value.size > 0)

  const suggestionItems = computed(() => {
    if (suggestions.value.length > 0) {
      return suggestions.value.slice(0, 5).map(suggestion => ({
        type: 'suggestion' as const,
        data: suggestion,
      }))
    }

    if (hasResults.value) {
      return searchResults.value.slice(0, 5).map((r) => ({
        type: 'result' as const,
        data: r,
      }))
    }

    if (hasHistory.value && !searchKeyword.value) {
      return searchHistory.value.slice(0, 5).map((keyword) => ({
        type: 'history' as const,
        data: keyword,
      }))
    }

    return []
  })

  // 监听items变化重新初始化Fuse
  watch(
    () => items.value,
    () => {
      initFuse()
      // 如果有搜索词或筛选条件，自动重新搜索
      if (searchKeyword.value || activeFilters.value.size > 0) {
        search(searchKeyword.value)
      }
    },
    { deep: true }
  )

  // 初始化
  loadHistory()
  loadFilters()
  initFuse()

  return {
    // 响应式数据
    searchKeyword,
    searchResults,
    isSearching,
    showSuggestions,
    suggestions,
    isFetchingSuggestions,
    searchHistory,
    hotSearches,
    activeFilters,

    // 计算属性
    hasResults,
    hasHistory,
    hasActiveFilters,
    suggestionItems,

    // 搜索方法
    search,
    debouncedSearch,
    highlightText,
    getHighlightedField,
    selectResult,
    clearSearch,
    selectFromHistory,

    // 历史方法
    addToHistory,
    removeFromHistory,
    clearHistory,

    // 热门搜索方法
    recordHotSearch,
    getTopHotSearches,
    fetchSuggestions,

    // 筛选方法
    setFilter,
    clearFilter,
    clearAllFilters,
    getFilterDisplayValue,
  }
}
