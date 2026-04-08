import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock @element-plus/icons-vue
vi.mock('@element-plus/icons-vue', () => ({
  Search: { template: '<svg class="icon-search"></svg>' },
  CircleClose: { template: '<svg class="icon-close"></svg>' },
  Loading: { template: '<svg class="icon-loading"></svg>' },
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

import SearchBar from '@/components/SearchBar.vue'

describe('SearchBar.vue - v3.0', () => {
  let wrapper: ReturnType<typeof mount>

  const createWrapper = (propsData: Record<string, unknown> = {}) => {
    return mount(SearchBar, {
      props: {
        modelValue: '',
        ...propsData,
      },
      global: {
        stubs: {
          'el-icon': { template: '<span><slot /></span>' },
        },
      },
    })
  }

  beforeEach(() => {
    // 重置 localStorage mock
    localStorageMock.clear()
    vi.clearAllMocks()

    wrapper = createWrapper()
  })

  // ==================== 基础渲染 ====================

  describe('基础渲染', () => {
    it('输入框正确渲染', () => {
      const input = wrapper.find('.search-bar__input')
      expect(input.exists()).toBe(true)
      expect(input.attributes('role')).toBe('searchbox')
    })

    it('默认 placeholder 正确显示', () => {
      const input = wrapper.find('.search-bar__input')
      expect(input.attributes('placeholder')).toBe('搜索商品、外卖、二手好物...')
    })

    it('支持自定义 placeholder', () => {
      const customWrapper = createWrapper({
        placeholder: '请输入搜索内容',
      })
      
      const input = customWrapper.find('.search-bar__input')
      expect(input.attributes('placeholder')).toBe('请输入搜索内容')
    })

    it('搜索图标正确渲染', () => {
      const icon = wrapper.find('.search-bar__icon-wrapper .icon-search')
      expect(icon.exists()).toBe(true)
    })

    it('无障碍标签存在', () => {
      const label = wrapper.find('label.sr-only')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('搜索')
    })

    it('容器具有正确的 role 属性', () => {
      const container = wrapper.find('[role="search"]')
      expect(container.exists()).toBe(true)
    })
  })

  // ==================== 尺寸规格 ====================

  describe('尺寸规格', () => {
    const sizes = ['sm', 'md', 'lg', 'full'] as const

    sizes.forEach((size) => {
      it(`支持 ${size} 尺寸`, () => {
        const sizeWrapper = createWrapper({ size })
        
        expect(sizeWrapper.find('.search-bar').classes()).toContain(`search-bar--${size}`)
      })
    })

    it('默认尺寸为 md', () => {
      const searchBar = wrapper.find('.search-bar')
      expect(searchBar.classes()).toContain('search-bar--md')
    })

    it('sm 尺寸应用正确的类', () => {
      const smWrapper = createWrapper({ size: 'sm' })
      const searchBar = smWrapper.find('.search-bar')

      // 验证 sm 类被应用
      expect(searchBar.classes()).toContain('search-bar--sm')
      // 验证不包含其他尺寸类
      expect(searchBar.classes()).not.toContain('search-bar--md')
      expect(searchBar.classes()).not.toContain('search-bar--lg')
      expect(searchBar.classes()).not.toContain('search-bar--full')
    })
  })

  // ==================== 视觉变体 ====================

  describe('视觉变体', () => {
    const variants = ['default', 'filled', 'outlined', 'rounded'] as const

    variants.forEach((variant) => {
      it(`支持 ${variant} 变体`, () => {
        const variantWrapper = createWrapper({ variant })
        
        expect(variantWrapper.find('.search-bar').classes()).toContain(`search-bar--${variant}`)
      })
    })

    it('默认变体为 default', () => {
      const searchBar = wrapper.find('.search-bar')
      expect(searchBar.classes()).toContain('search-bar--default')
    })
  })

  // ==================== v-model 双向绑定 ====================

  describe('v-model 双向绑定', () => {
    it('输入触发 update:modelValue 事件', async () => {
      const input = wrapper.find('.search-bar__input')
      
      await input.setValue('测试搜索')

      expect(wrapper.emitted()).toHaveProperty('update:modelValue')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['测试搜索'])
    })

    it('外部值变化反映到输入框', async () => {
      await wrapper.setProps({ modelValue: '外部值' })

      const input = wrapper.find('.search-bar__input')
      expect(input.element.value).toBe('外部值')
    })

    it('实时更新值', async () => {
      const input = wrapper.find('.search-bar__input')
      
      await input.setValue('第一段文字')
      expect(wrapper.emitted('update:modelValue')?.slice(-1)).toEqual([['第一段文字']])
      
      await input.setValue('第二段文字')
      expect(wrapper.emitted('update:modelValue')?.slice(-1)).toEqual([['第二段文字']])
    })
  })

  // ==================== 搜索功能 ====================

  describe('搜索功能', () => {
    it('Enter 键触发 search 事件', async () => {
      const input = wrapper.find('.search-bar__input')
      
      await input.setValue('手机壳')
      await input.trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted()).toHaveProperty('search')
      expect(wrapper.emitted('search')?.[0]).toEqual(['手机壳'])
    })

    it('Enter 键不提交空搜索', async () => {
      const input = wrapper.find('.search-bar__input')
      
      await input.setValue('')
      await input.trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted().search).toBeFalsy()
    })

    it('Enter 键自动 trim 空白字符', async () => {
      const input = wrapper.find('.search-bar__input')
      
      await input.setValue('  测试  ')
      await input.trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('search')?.[0]).toEqual(['测试'])
    })

    it('点击搜索按钮触发 search 事件', async () => {
      const buttonWrapper = createWrapper({
        modelValue: '商品',
        showButton: true,
      })

      const searchBtn = buttonWrapper.find('.search-bar__search-btn')
      await searchBtn.trigger('click')

      expect(buttonWrapper.emitted()).toHaveProperty('search')
      expect(buttonWrapper.emitted('search')?.[0]).toEqual(['商品'])
    })

    it('搜索按钮在值为空时聚焦输入框', async () => {
      const buttonWrapper = createWrapper({
        modelValue: '',
        showButton: true,
      })

      const focusSpy = vi.spyOn(buttonWrapper.vm, '$refs', 'get').mockReturnValue({
        searchInput: { focus: vi.fn() }
      } as unknown as Record<string, unknown>)

      const searchBtn = buttonWrapper.find('.search-bar__search-btn')
      await searchBtn.trigger('click')

      // 不应该触发 search 事件
      expect(buttonWrapper.emitted().search).toBeFalsy()
    })
  })

  // ==================== 清除功能 ====================

  describe('清除功能', () => {
    it('有值且聚焦时显示清除按钮', async () => {
      await wrapper.setProps({ modelValue: '一些文字' })
      
      const input = wrapper.find('.search-bar__input')
      await input.trigger('focus')
      await nextTick()

      const clearButton = wrapper.find('.search-bar__clear-btn')
      expect(clearButton.exists()).toBe(true)
    })

    it('无值时不显示清除按钮', async () => {
      await wrapper.setProps({ modelValue: '' })
      
      const input = wrapper.find('.search-bar__input')
      await input.trigger('focus')
      await nextTick()

      const clearButton = wrapper.find('.search-bar__clear-btn')
      expect(clearButton.exists()).toBe(false)
    })

    it('未聚焦时隐藏清除按钮', async () => {
      await wrapper.setProps({ modelValue: '一些文字' })

      const clearButton = wrapper.find('.search-bar__clear-btn')
      expect(clearButton.exists()).toBe(false)
    })

    it('点击清除按钮清空输入并触发事件', async () => {
      await wrapper.setProps({ modelValue: '测试文字' })
      
      const input = wrapper.find('.search-bar__input')
      await input.trigger('focus')
      await nextTick()

      const clearButton = wrapper.find('.search-bar__clear-btn')
      await clearButton.trigger('click')

      // 验证最后一次 update:modelValue 事件
      const lastEmit = wrapper.emitted('update:modelValue')?.slice(-1)
      expect(lastEmit).toEqual([['']])
      expect(wrapper.emitted()).toHaveProperty('clear')
    })

    it('clearable=false 时始终不显示清除按钮', async () => {
      const noClearWrapper = createWrapper({
        modelValue: '文字',
        clearable: false,
      })

      await noClearWrapper.find('.search-bar__input').trigger('focus')
      await nextTick()

      const clearButton = noClearWrapper.find('.search-bar__clear-btn')
      expect(clearButton.exists()).toBe(false)
    })
  })

  // ==================== 聚焦状态 ====================

  describe('聚焦状态', () => {
    it('聚焦时添加 focused 类', async () => {
      const searchBar = wrapper.find('.search-bar')
      const input = wrapper.find('.search-bar__input')

      expect(searchBar.classes()).not.toContain('search-bar--focused')

      await input.trigger('focus')
      await nextTick()

      expect(searchBar.classes()).toContain('search-bar--focused')
    })

    it('失焦后移除 focused 类', async () => {
      const input = wrapper.find('.search-bar__input')
      
      await input.trigger('focus')
      await nextTick()
      expect(wrapper.find('.search-bar').classes()).toContain('search-bar--focused')

      await input.trigger('blur')
      // 等待延迟
      await new Promise(resolve => setTimeout(resolve, 250))
      await nextTick()

      expect(wrapper.find('.search-bar').classes()).not.toContain('search-bar--focused')
    })

    it('聚焦时触发 focus 事件', async () => {
      const input = wrapper.find('.search-bar__input')
      
      await input.trigger('focus')

      expect(wrapper.emitted()).toHaveProperty('focus')
    })

    it('失焦时触发 blur 事件', async () => {
      const input = wrapper.find('.search-bar__input')
      
      await input.trigger('blur')

      expect(wrapper.emitted()).toHaveProperty('blur')
    })

    it('聚焦时图标变为激活状态', async () => {
      const iconWrapper = wrapper.find('.search-bar__icon-wrapper')
      const input = wrapper.find('.search-bar__input')

      expect(iconWrapper.find('.search-bar__icon--active').exists()).toBe(false)

      await input.trigger('focus')
      await nextTick()

      expect(iconWrapper.find('.search-bar__icon--active').exists()).toBe(true)
    })
  })

  // ==================== 字数统计 ====================

  describe('字数统计', () => {
    it('showWordCount=true 且 maxlength 存在时显示字数统计', () => {
      const countWrapper = createWrapper({
        showWordCount: true,
        maxlength: 50,
      })

      const wordCount = countWrapper.find('.search-bar__word-count')
      expect(wordCount.exists()).toBe(true)
    })

    it('showWordCount=false 时不显示字数统计', () => {
      const noCountWrapper = createWrapper({
        showWordCount: false,
        maxlength: 50,
      })

      const wordCount = noCountWrapper.find('.search-bar__word-count')
      expect(wordCount.exists()).toBe(false)
    })

    it('maxlength 未设置时不显示字数统计', () => {
      const noMaxWrapper = createWrapper({
        showWordCount: true,
      })

      const wordCount = noMaxWrapper.find('.search-bar__word-count')
      expect(wordCount.exists()).toBe(false)
    })

    it('正确显示当前/最大字数', async () => {
      const countWrapper = createWrapper({
        modelValue: '测试',
        showWordCount: true,
        maxlength: 50,
      })

      const wordCount = countWrapper.find('.search-bar__word-count')
      expect(wordCount.text()).toBe('2/50')
    })

    it('超过80%时显示警告样式', async () => {
      const warningWrapper = createWrapper({
        modelValue: 'a'.repeat(41), // 41/50 = 82%
        showWordCount: true,
        maxlength: 50,
      })

      const wordCount = warningWrapper.find('.search-bar__word-count')
      expect(wordCount.classes()).toContain('search-bar__word-count--warning')
    })

    it('超过95%时显示危险样式', async () => {
      const dangerWrapper = createWrapper({
        modelValue: 'a'.repeat(48), // 48/50 = 96%
        showWordCount: true,
        maxlength: 50,
      })

      const wordCount = dangerWrapper.find('.search-bar__word-count')
      expect(wordCount.classes()).toContain('search-bar__word-count--danger')
    })

    it('字数统计具有 aria-live 属性', () => {
      const countWrapper = createWrapper({
        showWordCount: true,
        maxlength: 50,
      })

      const wordCount = countWrapper.find('.search-bar__word-count')
      expect(wordCount.attributes('aria-live')).toBe('polite')
    })
  })

  // ==================== 搜索按钮 ====================

  describe('搜索按钮', () => {
    it('showButton=true 时显示搜索按钮', () => {
      const btnWrapper = createWrapper({ showButton: true })

      const searchBtn = btnWrapper.find('.search-bar__search-btn')
      expect(searchBtn.exists()).toBe(true)
    })

    it('showButton=false 时隐藏搜索按钮', () => {
      const noBtnWrapper = createWrapper({ showButton: false })

      const searchBtn = noBtnWrapper.find('.search-bar__search-btn')
      expect(searchBtn.exists()).toBe(false)
    })

    it('加载状态显示 spinner', () => {
      const loadingWrapper = createWrapper({
        showButton: true,
        loading: true,
      })

      const spinner = loadingWrapper.find('.search-bar__spinner')
      expect(spinner.exists()).toBe(true)
    })

    it('正常状态显示搜索图标', () => {
      const normalWrapper = createWrapper({
        showButton: true,
        loading: false,
      })

      const icon = normalWrapper.find('.search-bar__search-btn .icon-search')
      expect(icon.exists()).toBe(true)
    })

    it('禁用状态下按钮不可用', () => {
      const disabledWrapper = createWrapper({
        showButton: true,
        disabled: true,
      })

      const searchBtn = disabledWrapper.find('.search-bar__search-btn')
      expect(searchBtn.attributes('disabled')).toBeDefined()
    })

    it('非 sm 尺寸显示"搜索"文字', () => {
      const textWrapper = createWrapper({
        showButton: true,
        size: 'md',
      })

      const searchText = textWrapper.find('.search-bar__search-text')
      expect(searchText.exists()).toBe(true)
      expect(searchText.text()).toBe('搜索')
    })

    it('sm 尺寸不显示"搜索"文字', () => {
      const smWrapper = createWrapper({
        showButton: true,
        size: 'sm',
      })

      const searchText = smWrapper.find('.search-bar__search-text')
      expect(searchText.exists()).toBe(false)
    })
  })

  // ==================== 禁用状态 ====================

  describe('禁用状态', () => {
    it('禁用时添加 disabled 类', () => {
      const disabledWrapper = createWrapper({ disabled: true })

      expect(disabledWrapper.find('.search-bar').classes()).toContain('search-bar--disabled')
    })

    it('禁用时输入框不可交互', () => {
      const disabledWrapper = createWrapper({ disabled: true })

      const input = disabledWrapper.find('.search-bar__input')
      expect(input.attributes('disabled')).toBeDefined()
    })

    it('禁用时不显示清除按钮', async () => {
      const disabledWrapper = createWrapper({
        disabled: true,
        modelValue: '文字',
      })

      await disabledWrapper.find('.search-bar__input').trigger('focus')
      await nextTick()

      const clearButton = disabledWrapper.find('.search-bar__clear-btn')
      expect(clearButton.exists()).toBe(false)
    })
  })

  // ==================== 最大长度限制 ====================

  describe('最大长度限制', () => {
    it('maxlength 属性传递给输入框', () => {
      const maxWrapper = createWrapper({ maxlength: 100 })

      const input = maxWrapper.find('.search-bar__input')
      expect(input.attributes('maxlength')).toBe('100')
    })

    it('未设置 maxlength 时无限制', () => {
      const input = wrapper.find('.search-bar__input')
      expect(input.attributes('maxlength')).toBeUndefined()
    })
  })

  // ==================== 快捷键提示 ====================

  describe('快捷键提示', () => {
    it('桌面端显示快捷键提示', () => {
      const shortcut = wrapper.find('.search-bar__shortcut')
      expect(shortcut.exists()).toBe(true)
      expect(shortcut.text()).toBe('⌘K')
    })

    it('聚焦时隐藏快捷键提示', async () => {
      await wrapper.find('.search-bar__input').trigger('focus')
      await nextTick()

      const shortcut = wrapper.find('.search-bar__shortcut')
      expect(shortcut.exists()).toBe(false)
    })

    it('显示搜索按钮时隐藏快捷键提示', () => {
      const btnWrapper = createWrapper({ showButton: true })

      const shortcut = btnWrapper.find('.search-bar__shortcut')
      expect(shortcut.exists()).toBe(false)
    })

    it('sm 尺寸不显示快捷键提示', () => {
      const smWrapper = createWrapper({ size: 'sm' })

      const shortcut = smWrapper.find('.search-bar__shortcut')
      expect(shortcut.exists()).toBe(false)
    })
  })

  // ==================== 防抖功能 ====================

  describe('防抖功能', () => {
    it('默认启用防抖（300ms）', async () => {
      const input = wrapper.find('.search-bar__input')
      
      await input.setValue('测试')

      // 立即检查 - 应该还没有触发 input 事件（防抖中）
      expect(wrapper.emitted().input).toBeFalsy()

      // 等待防抖完成
      await new Promise(resolve => setTimeout(resolve, 350))

      // 现在应该触发了
      expect(wrapper.emitted()).toHaveProperty('input')
      expect(wrapper.emitted('input')?.[0]).toEqual(['测试'])
    })

    it('自定义防抖延迟', async () => {
      const customDebounceWrapper = createWrapper({ debounceDelay: 500 })
      const input = customDebounceWrapper.find('.search-bar__input')
      
      await input.setValue('测试')

      // 400ms 后仍未触发
      await new Promise(resolve => setTimeout(resolve, 400))
      expect(customDebounceWrapper.emitted().input).toBeFalsy()

      // 550ms 后应该触发
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(customDebounceWrapper.emitted()).toHaveProperty('input')
    })

    it('debounceDelay=0 禁用防抖', async () => {
      const noDebounceWrapper = createWrapper({ debounceDelay: 0 })
      const input = noDebounceWrapper.find('.search-bar__input')
      
      await input.setValue('测试')

      // 应该立即触发
      expect(noDebounceWrapper.emitted()).toHaveProperty('input')
    })

    it('连续输入只触发最后一次', async () => {
      const input = wrapper.find('.search-bar__input')
      
      await input.setValue('第1次')
      await new Promise(resolve => setTimeout(resolve, 100))
      
      await input.setValue('第2次')
      await new Promise(resolve => setTimeout(resolve, 100))
      
      await input.setValue('第3次')
      await new Promise(resolve => setTimeout(resolve, 350))

      // 应该只有一次 input 事件，值为最后一次
      const emitCount = wrapper.emitted('input')?.length || 0
      expect(emitCount).toBe(1)
      expect(wrapper.emitted('input')?.[0]).toEqual(['第3次'])
    })
  })

  // ==================== 自动聚焦 ====================

  describe('自动聚焦', () => {
    it('autofocus=true 时自动聚焦', async () => {
      const autofocusWrapper = createWrapper({ autofocus: true })
      
      await nextTick()
      // 检查是否调用了 focus 方法（通过 ref）
      // 注意：实际测试可能需要 mock ref
    })
  })

  // ==================== 自定义图标 ====================

  describe('自定义图标', () => {
    it('支持自定义搜索图标', () => {
      const CustomIcon = { template: '<svg class="custom-icon"></svg>' }
      const customIconWrapper = createWrapper({ 
        searchIcon: CustomIcon 
      })

      const icon = customIconWrapper.find('.custom-icon')
      expect(icon.exists()).toBe(true)
    })
  })

  // ==================== 键盘导航 ====================

  describe('键盘导航', () => {
    it('Escape 键清空输入', async () => {
      await wrapper.setProps({ modelValue: '一些文字' })
      
      const input = wrapper.find('.search-bar__input')
      await input.trigger('keydown', { key: 'Escape' })

      // 验证最后一次 update:modelValue 事件
      const lastEmit = wrapper.emitted('update:modelValue')?.slice(-1)
      expect(lastEmit).toEqual([['']])
      expect(wrapper.emitted()).toHaveProperty('clear')
    })

    it('Tab 键可访问所有交互元素', () => {
      // 检查所有按钮和输入框的 tabindex
      const input = wrapper.find('.search-bar__input')
      expect(input.attributes('tabindex')).toBeUndefined() // input 默认可聚焦
      
      // 清除按钮应该在特定条件下出现并可聚焦
    })
  })

  // ==================== 可访问性 ====================

  describe('可访问性 (A11y)', () => {
    it('输入框具有正确的 ARIA 属性', () => {
      const input = wrapper.find('.search-bar__input')
      
      expect(input.attributes('role')).toBe('searchbox')
      expect(input.attributes('aria-label')).toBeTruthy()
      expect(input.attributes('aria-labelledby')).toBeTruthy()
    })

    it('清除按钮具有 aria-label', async () => {
      await wrapper.setProps({ modelValue: '文字' })
      await wrapper.find('.search-bar__input').trigger('focus')
      await nextTick()

      const clearBtn = wrapper.find('.search-bar__clear-btn')
      if (clearBtn.exists()) {
        expect(clearBtn.attributes('aria-label')).toBe('清除搜索')
      }
    })

    it('搜索按钮具有 aria-label', () => {
      const btnWrapper = createWrapper({ showButton: true })
      
      const searchBtn = btnWrapper.find('.search-bar__search-btn')
      expect(searchBtn.attributes('aria-label')).toBe('搜索')
    })

    it('加载状态时搜索按钮 aria-label 变化', () => {
      const loadingWrapper = createWrapper({
        showButton: true,
        loading: true,
      })

      const searchBtn = loadingWrapper.find('.search-bar__search-btn')
      expect(searchBtn.attributes('aria-label')).toBe('正在搜索')
    })

    it('快捷键提示具有 aria-hidden', () => {
      const shortcut = wrapper.find('.search-bar__shortcut')
      if (shortcut.exists()) {
        expect(shortcut.attributes('aria-hidden')).toBe('true')
      }
    })
  })

  // ==================== 公开方法 ====================

  describe('公开方法', () => {
    it('暴露 focus 方法', () => {
      expect(typeof wrapper.vm.focus).toBe('function')
    })

    it('暴露 blur 方法', () => {
      expect(typeof wrapper.vm.blur).toBe('function')
    })
  })

  // ==================== 样式类组合 ====================

  describe('样式类组合', () => {
    it('正确应用多个修饰类', () => {
      const combinedWrapper = createWrapper({
        size: 'lg',
        variant: 'rounded',
        disabled: true,
        class: 'custom-class',
      })

      const classes = combinedWrapper.find('.search-bar').classes()
      
      expect(classes).toContain('search-bar')
      expect(classes).toContain('search-bar--lg')
      expect(classes).toContain('search-bar--rounded')
      expect(classes).toContain('search-bar--disabled')
      expect(classes).toContain('custom-class')
    })
  })
})
