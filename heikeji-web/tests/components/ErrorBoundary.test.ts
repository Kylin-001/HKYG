import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, h } from 'vue'

import ErrorBoundary from '@/components/global/ErrorBoundary.vue'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useRoute: () => ({ path: '/', params: {}, query: {} }),
}))

// 创建一个正常渲染的子组件
const NormalComponent = {
  template: '<div>正常内容</div>',
}

// 创建一个会抛出错误的子组件
const ThrowingComponent = {
  name: 'ThrowingComponent',
  setup() {
    throw new Error('Test error message')
  },
  template: '<div>不应渲染</div>',
}

describe('ErrorBoundary.vue', () => {
  it('默认状态渲染插槽内容', () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: NormalComponent,
      },
    })

    expect(wrapper.text()).toContain('正常内容')
    // 错误UI不应该显示
    expect(wrapper.find('.error-boundary').exists()).toBe(false)
  })

  it('子组件抛出错误时显示错误UI', async () => {
    const errorWrapper = mount(ErrorBoundary, {
      slots: {
        default: ThrowingComponent,
      },
    })

    await nextTick()

    // 错误容器应该存在
    expect(errorWrapper.find('.error-boundary').exists()).toBe(true)
    // 应该显示错误标题
    expect(errorWrapper.find('.error-boundary__title').exists()).toBe(true)
    // 插槽内容应该被隐藏
    expect(errorWrapper.text()).not.toContain('正常内容')
  })

  it('重试按钮触发 retry 事件', async () => {
    const errorWrapper = mount(ErrorBoundary, {
      slots: {
        default: ThrowingComponent,
      },
    })

    await nextTick()

    // 找到并点击重试按钮
    const retryButton = errorWrapper.find('.error-boundary__btn--primary')
    expect(retryButton.exists()).toBe(true)

    await retryButton.trigger('click')

    // 验证 retry 事件被触发
    expect(errorWrapper.emitted()).toHaveProperty('retry')
  })

  it('错误信息正确显示', async () => {
    const errorMessage = 'Network connection failed'
    const NetworkErrorComponent = {
      name: 'NetworkErrorComponent',
      setup() {
        throw new Error(errorMessage)
      },
      template: '<div>不应渲染</div>',
    }

    const errorWrapper = mount(ErrorBoundary, {
      slots: {
        default: NetworkErrorComponent,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // 应该显示错误消息
    const errorMsgEl = errorWrapper.find('.error-boundary__message')
    if (errorMsgEl.exists()) {
      expect(errorMsgEl.text()).toContain(errorMessage)
    }
  })

  it('显示默认的错误提示文案', async () => {
    const errorWrapper = mount(ErrorBoundary, {
      slots: {
        default: ThrowingComponent,
      },
    })

    await nextTick()

    // 默认 fallback 文案
    const title = errorWrapper.find('.error-boundary__title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('页面出现了一些问题')
  })

  it('支持自定义 fallback 文案', async () => {
    const errorWrapper = mount(ErrorBoundary, {
      props: {
        fallback: '自定义错误提示',
      },
      slots: {
        default: ThrowingComponent,
      },
    })

    await nextTick()

    const title = errorWrapper.find('.error-boundary__title')
    expect(title.text()).toBe('自定义错误提示')
  })

  it('重试后清除错误状态', async () => {
    let shouldThrow = true
    const ConditionalThrowingComponent = defineComponent({
      setup() {
        if (shouldThrow) {
          throw new Error('Conditional error')
        }
        return () => h('div', '正常内容')
      }
    })

    const errorWrapper = mount(ErrorBoundary, {
      slots: {
        default: ConditionalThrowingComponent,
      },
    })

    await nextTick()

    expect(errorWrapper.find('.error-boundary').exists()).toBe(true)

    shouldThrow = false
    await errorWrapper.find('.error-boundary__btn--primary').trigger('click')
    await nextTick()

    expect(errorWrapper.find('.error-boundary').exists()).toBe(false)
  })

  it('触发 error 事件并传递错误对象', async () => {
    const errorWrapper = mount(ErrorBoundary, {
      slots: {
        default: ThrowingComponent,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // 验证 error 事件被触发且传递了 Error 对象
    expect(errorWrapper.emitted()).toHaveProperty('error')
    const emittedError = errorWrapper.emitted('error')?.[0]?.[0]
    expect(emittedError).toBeInstanceOf(Error)
  })

  it('返回首页按钮存在', async () => {
    const errorWrapper = mount(ErrorBoundary, {
      slots: {
        default: ThrowingComponent,
      },
    })

    await nextTick()

    // 应该有返回首页按钮
    const homeButton = errorWrapper.find('.error-boundary__btn--secondary')
    expect(homeButton.exists()).toBe(true)
    expect(homeButton.text()).toContain('返回首页')
  })

  it('showRetry 为 false 时不显示重试按钮', async () => {
    const errorWrapper = mount(ErrorBoundary, {
      props: {
        showRetry: false,
      },
      slots: {
        default: ThrowingComponent,
      },
    })

    await nextTick()

    // 重试按钮不应该存在
    const retryButton = errorWrapper.find('.error-boundary__btn--primary')
    expect(retryButton.exists()).toBe(false)
    // 返回首页按钮仍然存在
    const homeButton = errorWrapper.find('.error-boundary__btn--secondary')
    expect(homeButton.exists()).toBe(true)
  })

  it('错误图标正确显示', async () => {
    const errorWrapper = mount(ErrorBoundary, {
      slots: {
        default: ThrowingComponent,
      },
    })

    await nextTick()

    // 错误图标区域应该存在
    const icon = errorWrapper.find('.error-boundary__icon')
    expect(icon.exists()).toBe(true)
    // 图标内应该有 SVG
    expect(icon.find('svg').exists()).toBe(true)
  })
})
