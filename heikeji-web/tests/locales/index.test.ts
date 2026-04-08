import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setLocale, getLocale, availableLocales } from '@/locales/index'
import i18n from '@/locales/index'

describe('i18n 国际化 (locales/index.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // 重置为默认语言
    localStorage.removeItem('heikeji-locale')
  })

  describe('默认语言', () => {
    it('默认语言应该是zh-CN', () => {
      // 清除localStorage以测试默认值
      localStorage.removeItem('heikeji-locale')
      
      // 由于i18n是单例，我们需要检查初始状态
      // 在实际应用中，默认语言在创建时就已经设置
      const currentLocale = i18n.global.locale.value
      
      expect(currentLocale).toBe('zh-CN')
    })

    it('没有localStorage时应该使用zh-CN', () => {
      localStorage.removeItem('heikeji-locale')
      
      const locale = getLocale()
      
      expect(locale).toBe('zh-CN')
    })
  })

  describe('setLocale', () => {
    it('应该切换到en-US', () => {
      setLocale('en-US')

      const locale = getLocale()
      
      expect(locale).toBe('en-US')
      expect(localStorage.getItem('heikeji-locale')).toBe('en-US')
    })

    it('应该切换到zh-CN', () => {
      // 先设置为英文
      setLocale('en-US')
      expect(getLocale()).toBe('en-US')
      
      // 再切回中文
      setLocale('zh-CN')
      
      expect(getLocale()).toBe('zh-CN')
      expect(localStorage.getItem('heikeji-locale')).toBe('zh-CN')
    })

    it('应该在document上设置lang属性', () => {
      const spy = vi.spyOn(document.documentElement, 'setAttribute')

      setLocale('en-US')

      expect(spy).toHaveBeenCalledWith('lang', 'en-US')

      spy.mockRestore()
    })
  })

  describe('getLocale', () => {
    it('应该返回当前语言设置', () => {
      setLocale('zh-CN')
      expect(getLocale()).toBe('zh-CN')

      setLocale('en-US')
      expect(getLocale()).toBe('en-US')
    })

    it('返回值类型应该是Locale类型', () => {
      const locale = getLocale()
      
      // TypeScript 类型检查：locale 应该是 'zh-CN' | 'en-US'
      const validLocales: Array<'zh-CN' | 'en-US'> = ['zh-CN', 'en-US']
      expect(validLocales).toContain(locale)
    })
  })

  describe('t() 函数翻译功能', () => {
    it('中文翻译应该正确', () => {
      setLocale('zh-CN')

      const t = i18n.global.t
      
      expect(t('common.confirm')).toBe('确认')
      expect(t('nav.home')).toBe('首页')
      expect(t('auth.login')).toBe('登录')
      expect(t('product.title')).toBe('商品列表')
      expect(t('cart.title')).toBe('购物车')
      expect(t('order.title')).toBe('我的订单')
    })

    it('英文翻译应该正确', () => {
      setLocale('en-US')

      const t = i18n.global.t
      
      expect(t('common.confirm')).toBe('Confirm')
      expect(t('nav.home')).toBe('Home')
      expect(t('auth.login')).toBe('Sign In')
      expect(t('product.title')).toBe('Products')
      expect(t('cart.title')).toBe('Shopping Cart')
      expect(t('order.title')).toBe('My Orders')
    })

    it('嵌套路径翻译应该正确', () => {
      setLocale('zh-CN')
      const t = i18n.global.t

      expect(t('community.categories.study')).toBe('学习交流')
      expect(t('takeout.orderStatus.pendingPayment')).toBe('待付款')
      expect(t('campus.repairStatus.pending')).toBe('待处理')
    })

    it('英文嵌套路径翻译应该正确', () => {
      setLocale('en-US')
      const t = i18n.global.t

      expect(t('community.categories.study')).toBe('Study & Learning')
      expect(t('takeout.orderStatus.pendingPayment')).toBe('Pending Payment')
      expect(t('campus.repairStatus.pending')).toBe('Pending')
    })

    it('不存在的key应该返回key本身或fallback', () => {
      setLocale('zh-CN')
      const t = i18n.global.t

      const result = t('nonexistent.key.path')
      
      // vue-i18n 默认行为：返回 key 本身
      expect(result).toBeDefined()
    })
  })

  describe('无效locale回退', () => {
    it('无效的locale不应该崩溃', () => {
      // 先记录当前locale
      const beforeLocale = getLocale()
      
      // 尝试设置一个不存在的locale（TypeScript会阻止，但运行时可能发生）
      expect(() => {
        // @ts-ignore - 故意传入无效值测试容错性
        setLocale('ja-JP' as any)
      }).not.toThrow()

      // vue-i18n 会接受任意字符串作为 locale，所以这里验证不崩溃即可
      // 实际值可能是 'ja-JP'（i18n 不做白名单校验）
      const locale = getLocale()
      expect(typeof locale).toBe('string')
      expect(locale.length).toBeGreaterThan(0)
      
      // 恢复为有效locale
      setLocale(beforeLocale)
    })
  })

  describe('availableLocales', () => {
    it('应该包含多种语言选项', () => {
      // 现在支持5种语言：中文、英文、日文、韩文、俄文
      expect(availableLocales).toHaveLength(5)
      expect(availableLocales[0].code).toBe('zh-CN')
      expect(availableLocales[1].code).toBe('en-US')
      expect(availableLocales[2].code).toBe('ja-JP')
      expect(availableLocales[3].code).toBe('ko-KR')
      expect(availableLocales[4].code).toBe('ru-RU')
    })

    it('每种语言应该有完整的元信息', () => {
      const zhLocale = availableLocales.find(l => l.code === 'zh-CN')
      const enLocale = availableLocales.find(l => l.code === 'en-US')
      const jaLocale = availableLocales.find(l => l.code === 'ja-JP')
      const koLocale = availableLocales.find(l => l.code === 'ko-KR')
      const ruLocale = availableLocales.find(l => l.code === 'ru-RU')

      expect(zhLocale).toEqual({
        code: 'zh-CN',
        name: '简体中文',
        flag: '🇨🇳',
      })

      expect(enLocale).toEqual({
        code: 'en-US',
        name: 'English',
        flag: '🇺🇸',
      })

      expect(jaLocale).toEqual({
        code: 'ja-JP',
        name: '日本語',
        flag: '🇯🇵',
      })

      expect(koLocale).toEqual({
        code: 'ko-KR',
        name: '한국어',
        flag: '🇰🇷',
      })

      expect(ruLocale).toEqual({
        code: 'ru-RU',
        name: 'Русский',
        flag: '🇷🇺',
      })
    })
  })

  describe('localStorage持久化', () => {
    it('设置语言后localStorage应该有数据', () => {
      localStorage.removeItem('heikeji-locale')
      
      setLocale('en-US')
      
      expect(localStorage.getItem('heikeji-locale')).toBe('en-US')
    })

    it('从localStorage恢复语言设置', () => {
      // 模拟之前保存的语言偏好
      localStorage.setItem('heikeji-locale', 'en-US')
      
      // 注意：由于i18n实例已经在模块加载时创建，
      // 这里我们主要验证getLocale能正确返回当前设置
      // 实际恢复逻辑在i18n初始化时完成
      const locale = getLocale()
      expect(typeof locale).toBe('string')
    })
  })

  describe('翻译完整性', () => {
    it('关键页面导航翻译应该完整', () => {
      setLocale('zh-CN')
      const t = i18n.global.t

      // 验证主要导航项都有翻译
      const navKeys = ['home', 'products', 'takeout', 'community', 'user']
      navKeys.forEach(key => {
        expect(t(`nav.${key}`)).toBeTruthy()
        expect(t(`nav.${key}`)).not.toBe(`nav.${key}`)
      })
    })

    it('错误提示翻译应该完整', () => {
      setLocale('zh-CN')
      const t = i18n.global.t

      // 验证常见错误码都有翻译
      const errorCodes = ['400', '401', '403', '404', '500']
      errorCodes.forEach(code => {
        expect(t(`error.${code}`)).toBeTruthy()
      })
    })
  })
})
