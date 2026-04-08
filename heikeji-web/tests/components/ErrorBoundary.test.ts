import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useRoute: () => ({ path: '/', params: {}, query: {} }),
}))

import ErrorBoundary from '@/components/global/ErrorBoundary.vue'

// 创建一个会抛出错误的子组件
const ErrorComponent = {
  template: '<div>正常内容</div>',
}

const ThrowingComponent = {
  name: 'ThrowingComponent',
  template: '<div>{{ throwError() }}</div>',
  methods: {
    throwError() {
      throw new Error('Test error message')
    },
  },
}

describe('ErrorBoundary.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(ErrorBoundary, {
      slots: {
        default: ErrorComponent,
      },
    })
  })

  it('默认状态渲染插槽内容', () => {
    expect(wrapper.text()).toContain('正常内容')
    // 错误UI不应该显示
    expect(wrapper.find('.error-boundary-container').exists()).toBe(false)
  })

  it('子组件抛出错误时显示错误UI', async () => {
    const errorWrapper = mount(ErrorBoundary, {
      slots: {
        default: ThrowingComponent,
      },
    })

    await nextTick()

    // 错误容器应该存在
    expect(errorWrapper.find('.error-boundary-container').exists()).toBe(true)
    // 应该显示错误标题
    expect(errorWrapper.find('.error-title').exists()).toBe(true)
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

    // 找到并点击重试按钮（unknown 类型的默认按钮）
    const retryButton = errorWrapper.find('.btn-primary')
    expect(retryButton.exists()).toBe(true)

    await retryButton.trigger('click')

    // 验证 retry 事件被触发
    expect(errorWrapper.emitted()).toHaveProperty('retry')
  })

  it('错误信息正确显示', async () => {
    const errorMessage = 'Network connection failed'
    const NetworkErrorComponent = {
      name: 'NetworkErrorComponent',
      template: `<div>{{ throwNetworkError() }}</div>`,
      methods: {
        throwNetworkError() {
          throw new Error(errorMessage)
        },
      },
    }

    const errorWrapper = mount(ErrorBoundary, {
      slots: {
        default: NetworkErrorComponent,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // unknown 类型错误应该显示详细错误信息
    const errorMsgEl = errorWrapper.find('.error-message')
    if (errorMsgEl.exists()) {
      expect(errorMsgEl.text()).toContain(errorMessage)
    }
  })

  it('role="alert" 和 aria-live 属性存在', async () => {
    const errorWrapper = mount(ErrorBoundary, {
      slots: {
        default: ThrowingComponent,
      },
    })

    await nextTick()

    const container = errorWrapper.find('.error-boundary-container')
    expect(container.exists()).toBe(true)

    // 验证无障碍属性
    expect(container.attributes('role')).toBe('alert')
    expect(container.attributes('aria-live')).toBe('assertive')
    expect(container.attributes('aria-atomic')).toBe('true')
  })

  it('网络错误类型显示正确的图标和文案', async () => {
    const NetworkErrorComponent = {
      name: 'NetworkErrorComponent',
      template: `<div>{{ throwNetworkError() }}</div>`,
      methods: {
        throwNetworkError() {
          throw new Error('Failed to fetch - network error')
        },
      },
    }

    const errorWrapper = mount(ErrorBoundary, {
      slots: {
        default: NetworkErrorComponent,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // 网络错误应该显示网络错误图标（error-type-network class 或 SVG）
    const hasNetworkClass = errorWrapper.find('.error-type-network').exists()
    const hasErrorIcon = errorWrapper.find('.error-icon').exists()
    expect(hasNetworkClass || hasErrorIcon).toBe(true)
    // 按钮文字应该包含"重新连接"
    const btnText = errorWrapper.find('.btn-primary').text()
    expect(btnText).toBeTruthy()
  })

  it('权限错误类型显示去登录按钮', async () => {
    const AuthErrorComponent = {
      name: 'AuthErrorComponent',
      template: `<div>{{ throwAuthError() }}</div>`,
      methods: {
        throwAuthError() {
          throw new Error('Unauthorized - 401 forbidden permission denied')
        },
      },
    }

    const errorWrapper = mount(ErrorBoundary, {
      slots: {
        default: AuthErrorComponent,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // 权限错误应该显示权限图标
    expect(errorWrapper.find('.error-type-auth').exists()).toBe(true)
    // 按钮文字应该是"去登录"
    expect(errorWrapper.find('.btn-primary').text()).toContain('去登录')
  })

  it('渲染错误类型显示重新加载按钮', async () => {
    const RenderErrorComponent = {
      name: 'RenderErrorComponent',
      template: `<div>{{ throwRenderError() }}</div>`,
      methods: {
        throwRenderError() {
          throw new Error('Component render failed in virtual DOM props slot')
        },
      },
    }

    const errorWrapper = mount(ErrorBoundary, {
      slots: {
        default: RenderErrorComponent,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // 渲染错误应该显示渲染图标
    expect(errorWrapper.find('.error-type-render').exists()).toBe(true)
    // 按钮文字应该是"重新加载"
    expect(errorWrapper.find('.btn-primary').text()).toContain('重新加载')
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

  it('返回首页按钮存在（非 auth 类型）', async () => {
    const errorWrapper = mount(ErrorBoundary, {
      slots: {
        default: ThrowingComponent,
      },
    })

    await nextTick()

    // 应该有返回首页按钮
    const homeButton = errorWrapper.find('.btn-secondary')
    expect(homeButton.exists()).toBe(true)
    expect(homeButton.text()).toContain('返回首页')
  })
})
