import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock @element-plus/icons-vue
vi.mock('@element-plus/icons-vue', () => ({
  Top: { template: '<svg class="top-icon"></svg>' },
}))

import BackToTop from '@/components/global/BackToTop.vue'

describe('BackToTop.vue', () => {
  let wrapper: ReturnType<typeof mount>

  // 保存原始的 scrollY
  let originalScrollY: number

  const createWrapper = () => {
    return mount(BackToTop, {
      global: {
        stubs: {
          'el-icon': { template: '<span><slot /></span>' },
        },
      },
    })
  }

  beforeEach(() => {
    // Mock window.scrollY
    originalScrollY = (window as any).scrollY || 0

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    })

    // Mock scrollTo
    window.scrollTo = vi.fn()

    wrapper = createWrapper()
  })

  afterEach(() => {
    // 恢复 scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: originalScrollY,
    })
  })

  it('默认隐藏（滚动位置 < 阈值）', async () => {
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)

    await nextTick()

    // 默认 scrollY = 0，小于阈值 300
    // v-show 设置 display:none，检查 style 或可见性
    const style = button.attributes('style') || ''
    expect(style).toContain('display: none') || expect(style).toContain('display:none')
  })

  it('滚动超过阈值后显示', async () => {
    // 设置 scrollY 大于阈值 (300)
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 500,
    })

    // 触发 scroll 事件
    window.dispatchEvent(new Event('scroll'))

    await nextTick()

    const button = wrapper.find('button')
    // 按钮应该可见（没有 display:none）
    const style = button.attributes('style') || ''
    expect(style).not.toContain('display: none')
    expect(style).not.toContain('display:none')
  })

  it('点击滚动到顶部', async () => {
    // 先让按钮可见
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 500,
    })

    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    const button = wrapper.find('button')
    await button.trigger('click')

    // 验证 scrollTo 被调用，且参数正确
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    })
  })

  it('使用 z-index CSS 变量', () => {
    const button = wrapper.find('button')

    // 检查 z-index 是否使用 CSS 变量（Tailwind 任意值语法）
    const className = button.attributes('class') || ''
    expect(className).toContain('z-[')
  })

  it('按钮包含正确的样式类', () => {
    const button = wrapper.find('button')

    // 验证固定定位类
    const classes = button.classes()
    expect(classes).toContain('fixed')
    expect(classes.some(c => c.includes('right'))).toBe(true)
    expect(classes.some(c => c.includes('bottom'))).toBe(true)

    // 验证形状和尺寸
    expect(classes).toContain('rounded-full')
    // w-11 和 h-11 是具体的类名
    expect(classes).toContain('w-11')
    expect(classes).toContain('h-11')

    // 验证其他样式
    expect(classes).toContain('bg-white')
    expect(classes).toContain('shadow-brand')
    expect(classes).toContain('border')
  })

  it('按钮包含图标组件', () => {
    // 图标通过 el-icon stub 渲染或直接渲染
    const icon = wrapper.find('.top-icon') || wrapper.find('svg')
    expect(icon.exists()).toBe(true)
  })

  it('按钮有正确的 title 属性', () => {
    const button = wrapper.find('button')
    expect(button.attributes('title')).toBe('返回顶部')
  })

  it('挂载时添加滚动事件监听器，卸载时移除', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    // 重新挂载以捕获事件监听器的添加
    const newWrapper = createWrapper()

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.objectContaining({ passive: true }),
    )

    // 卸载组件
    newWrapper.unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    )

    // 清理 spies
    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })

  it('在阈值边界处的行为（scrollY = 300）', async () => {
    // 正好在阈值处
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 300,
    })

    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    const button = wrapper.find('button')
    // scrollY > 300 才显示，300 不大于 300，所以应该隐藏
    const style = button.attributes('style') || ''
    expect(style).toContain('display: none') || expect(style).toContain('display:none')
  })

  it('从可见状态回到不可见状态', async () => {
    // 先显示按钮
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 500,
    })

    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    let button = wrapper.find('button')
    let style = button.attributes('style') || ''
    expect(style).not.toContain('display: none')

    // 然后滚回顶部
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    })

    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    button = wrapper.find('button')
    style = button.attributes('style') || ''
    expect(style).toContain('display: none') || expect(style).toContain('display:none')
  })

  it('过渡动画类名正确', () => {
    // 组件使用了 Transition name="back-to-top"
    const transitionEl = wrapper.findComponent({ name: 'Transition' })
    expect(transitionEl.exists()).toBe(true)
    expect(transitionEl.props('name')).toBe('back-to-top')
  })
})
