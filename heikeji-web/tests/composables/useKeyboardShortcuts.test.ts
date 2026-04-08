import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'

// 创建测试组件
function createTestComponent(shortcuts: any[]) {
  return defineComponent({
    setup() {
      useKeyboardShortcuts(shortcuts)
      return {}
    },
    render() {
      return h('div', { class: 'keyboard-test' })
    },
  })
}

describe('useKeyboardShortcuts Composable', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('注册快捷键', () => {
    it('应该正确注册快捷键', () => {
      const handler = vi.fn()
      const shortcuts = [
        { key: 'k', ctrl: true, handler, description: '搜索' },
      ]

      const TestComponent = createTestComponent(shortcuts)
      wrapper = mount(TestComponent)

      // 验证组件正常挂载
      expect(wrapper.exists()).toBe(true)
    })

    it('可以注册多个快捷键', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const shortcuts = [
        { key: 'k', ctrl: true, handler: handler1, description: '搜索' },
        { key: '/', ctrl: false, handler: handler2, description: '帮助' },
      ]

      const TestComponent = createTestComponent(shortcuts)
      
      expect(() => mount(TestComponent)).not.toThrow()
    })
  })

  describe('Ctrl+K 触发处理器', () => {
    it('Ctrl+K应该触发对应的处理器', async () => {
      const handler = vi.fn()
      const shortcuts = [
        { key: 'k', ctrl: true, handler, description: '打开搜索' },
      ]

      const TestComponent = createTestComponent(shortcuts)
      wrapper = mount(TestComponent)

      // 模拟按下Ctrl+K
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
      })
      window.dispatchEvent(event)

      expect(handler).toHaveBeenCalledOnce()
    })

    it('只有Ctrl没有K不应该触发', () => {
      const handler = vi.fn()
      const shortcuts = [
        { key: 'k', ctrl: true, handler, description: '搜索' },
      ]

      const TestComponent = createTestComponent(shortcuts)
      wrapper = mount(TestComponent)

      // 按下Ctrl+其他键
      const event = new KeyboardEvent('keydown', {
        key: 'l',
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
      })
      window.dispatchEvent(event)

      expect(handler).not.toHaveBeenCalled()
    })

    it('只有K没有Ctrl不应该触发（当需要Ctrl时）', () => {
      const handler = vi.fn()
      const shortcuts = [
        { key: 'k', ctrl: true, handler, description: '搜索' },
      ]

      const TestComponent = createTestComponent(shortcuts)
      wrapper = mount(TestComponent)

      // 只按K不按Ctrl
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
      })
      window.dispatchEvent(event)

      expect(handler).not.toHaveBeenCalled()
    })

    it('大小写不敏感', () => {
      const handler = vi.fn()
      const shortcuts = [
        { key: 'k', ctrl: true, handler, description: '搜索' },
      ]

      const TestComponent = createTestComponent(shortcuts)
      wrapper = mount(TestComponent)

      // 大写K
      const event = new KeyboardEvent('keydown', {
        key: 'K',
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
      })
      window.dispatchEvent(event)

      expect(handler).toHaveBeenCalledOnce()
    })
  })

  describe('未注册的按键', () => {
    it('未注册的按键不应该触发任何处理器', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const shortcuts = [
        { key: 'k', ctrl: true, handler: handler1, description: '搜索' },
        { key: '/', ctrl: false, handler: handler2, description: '帮助' },
      ]

      const TestComponent = createTestComponent(shortcuts)
      wrapper = mount(TestComponent)

      // 按下未注册的键
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
      })
      window.dispatchEvent(event)

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).not.toHaveBeenCalled()
    })
  })

  describe('组合键支持', () => {
    it('Ctrl+Shift+P应该触发对应处理器', () => {
      const handler = vi.fn()
      const shortcuts = [
        { 
          key: 'p', 
          ctrl: true, 
          shift: true, 
          handler, 
          description: '命令面板' 
        },
      ]

      const TestComponent = createTestComponent(shortcuts)
      wrapper = mount(TestComponent)

      const event = new KeyboardEvent('keydown', {
        key: 'p',
        ctrlKey: true,
        shiftKey: true,
        altKey: false,
      })
      window.dispatchEvent(event)

      expect(handler).toHaveBeenCalledOnce()
    })

    it('缺少Shift不应该触发需要Shift的快捷键', () => {
      const handler = vi.fn()
      const shortcuts = [
        { 
          key: 'p', 
          ctrl: true, 
          shift: true, 
          handler, 
          description: '命令面板' 
        },
      ]

      const TestComponent = createTestComponent(shortcuts)
      wrapper = mount(TestComponent)

      // 只有Ctrl，没有Shift
      const event = new KeyboardEvent('keydown', {
        key: 'p',
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
      })
      window.dispatchEvent(event)

      expect(handler).not.toHaveBeenCalled()
    })

    it('Alt组合键应该工作', () => {
      const handler = vi.fn()
      const shortcuts = [
        { 
          key: 'f', 
          alt: true, 
          handler, 
          description: '查找' 
        },
      ]

      const TestComponent = createTestComponent(shortcuts)
      wrapper = mount(TestComponent)

      const event = new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
      })
      window.dispatchEvent(event)

      expect(handler).toHaveBeenCalledOnce()
    })
  })

  describe('事件阻止默认行为', () => {
    it('匹配的快捷键应该调用preventDefault', () => {
      const handler = vi.fn()
      const shortcuts = [
        { key: 's', ctrl: true, handler, description: '保存' },
      ]

      const TestComponent = createTestComponent(shortcuts)
      wrapper = mount(TestComponent)

      let defaultPrevented = false
      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
      }) as any
      
      // 覆盖preventDefault来检测是否被调用
      event.preventDefault = () => { defaultPrevented = true }
      
      window.dispatchEvent(event)

      expect(defaultPrevented).toBe(true)
      expect(handler).toHaveBeenCalledOnce()
    })

    it('未匹配的快捷键不应该preventDefault', () => {
      const handler = vi.fn()
      const shortcuts = [
        { key: 's', ctrl: true, handler, description: '保存' },
      ]

      const TestComponent = createTestComponent(shortcuts)
      wrapper = mount(TestComponent)

      let defaultPrevented = false
      const event = new KeyboardEvent('keydown', {
        key: 'x',
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
      }) as any
      
      event.preventDefault = () => { defaultPrevented = true }
      
      window.dispatchEvent(event)

      expect(defaultPrevented).toBe(false)
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('组件卸载时移除监听器', () => {
    it('卸载后快捷键不应该再触发', () => {
      const handler = vi.fn()
      const shortcuts = [
        { key: 'k', ctrl: true, handler, description: '搜索' },
      ]

      const TestComponent = createTestComponent(shortcuts)
      wrapper = mount(TestComponent)

      // 卸载前 - 应该能触发
      const eventBeforeUnmount = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
      })
      window.dispatchEvent(eventBeforeUnmount)
      expect(handler).toHaveBeenCalledTimes(1)

      // 卸载组件
      wrapper.unmount()

      // 卸载后 - 不应该再触发
      const eventAfterUnmount = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
      })
      window.dispatchEvent(eventAfterUnmount)
      expect(handler).toHaveBeenCalledTimes(1) // 还是1次，没有增加
    })
  })

  describe('Meta键支持（Mac）', () => {
    it('Meta键应该等同于Ctrl键', () => {
      const handler = vi.fn()
      const shortcuts = [
        { key: 'k', ctrl: true, handler, description: '搜索' },
      ]

      const TestComponent = createTestComponent(shortcuts)
      wrapper = mount(TestComponent)

      // 使用Meta键（Mac上的Command键）
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: false,
        metaKey: true, // Meta/Command键
        shiftKey: false,
        altKey: false,
      })
      window.dispatchEvent(event)

      expect(handler).toHaveBeenCalledOnce()
    })
  })

  describe('多个快捷键冲突处理', () => {
    it('第一个匹配的快捷键应该执行并停止后续匹配', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const shortcuts = [
        { key: 'k', ctrl: true, handler: handler1, description: '第一个' },
        { key: 'k', ctrl: true, handler: handler2, description: '第二个' },
      ]

      const TestComponent = createTestComponent(shortcuts)
      wrapper = mount(TestComponent)

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
      })
      window.dispatchEvent(event)

      // 第一个应该被调用
      expect(handler1).toHaveBeenCalledOnce()
      // 第二个不应该被调用（因为break）
      expect(handler2).not.toHaveBeenCalled()
    })
  })
})
