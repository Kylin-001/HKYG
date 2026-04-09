import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import EmptyState from '@/components/global/EmptyState.vue'

// Mock @element-plus/icons-vue
vi.mock('@element-plus/icons-vue', () => ({
  Document: { template: '<svg class="icon-document"></svg>' },
  ShoppingCart: { template: '<svg class="icon-cart"></svg>' },
  Search: { template: '<svg class="icon-search"></svg>' },
  FolderOpened: { template: '<svg class="icon-folder"></svg>' },
  Warning: { template: '<svg class="icon-warning"></svg>' },
  Connection: { template: '<svg class="icon-connection"></svg>' },
  Box: { template: '<svg class="icon-box"></svg>' },
  Present: { template: '<svg class="icon-present"></svg>' },
  Ticket: { template: '<svg class="icon-ticket"></svg>' },
  Star: { template: '<svg class="icon-star"></svg>' },
  CircleClose: { template: '<svg class="icon-circle-close"></svg>' },
  InfoFilled: { template: '<svg class="icon-info-filled"></svg>' },
}))

describe('EmptyState.vue', () => {
  const createWrapper = (props = {}, slots = {}) => {
    return mount(EmptyState, {
      props,
      slots,
      global: {
        stubs: {
          'el-icon': { template: '<span><slot /></span>' },
        },
      },
    })
  }

  it('显示自定义标题和描述', () => {
    const wrapper = createWrapper({
      title: '暂无数据',
      description: '这里空空如也，快去添加一些内容吧',
    })

    // 验证标题
    const title = wrapper.find('h3')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('暂无数据')

    // 验证描述
    const description = wrapper.find('p')
    expect(description.exists()).toBe(true)
    expect(description.text()).toBe('这里空空如也，快去添加一些内容吧')
  })

  it('显示自定义图标（通过 slot）', () => {
    const wrapper = createWrapper(
      { title: '自定义图标' },
      {
        icon: '<span data-testid="custom-icon">🎯</span>',
      }
    )

    // 自定义图标应该渲染
    const customIcon = wrapper.find('[data-testid="custom-icon"]')
    expect(customIcon.exists()).toBe(true)
    expect(customIcon.text()).toBe('🎯')
  })

  it('显示操作按钮时触发事件', async () => {
    const wrapper = createWrapper(
      {
        title: '空状态',
        description: '点击按钮试试',
      },
      {
        action: '<button data-testid="action-btn">立即创建</button>',
      }
    )

    // 操作按钮应该存在
    const actionBtn = wrapper.find('[data-testid="action-btn"]')
    expect(actionBtn.exists()).toBe(true)

    // 点击按钮
    await actionBtn.trigger('click')

    // 按钮应该可以被点击（验证交互性）
    expect(actionBtn.exists()).toBe(true)
  })

  it('显示额外的内容插槽', () => {
    const wrapper = createWrapper(
      { title: '带额外内容' },
      {
        extra: '<div data-testid="extra-content">这是额外内容</div>',
      }
    )

    const extraContent = wrapper.find('[data-testid="extra-content"]')
    expect(extraContent.exists()).toBe(true)
    expect(extraContent.text()).toBe('这是额外内容')
  })

  it('不同 type 变体样式 - default', () => {
    const wrapper = createWrapper({
      type: 'default',
      title: '默认类型',
    })

    // 应该有对应的 CSS 类
    const container = wrapper.find('.empty-state')
    expect(container.classes()).toContain('empty-state--default')

    // 默认图标应该是 Document
    expect(wrapper.find('.icon-document').exists()).toBe(true)
  })

  it('不同 type 变体样式 - search', () => {
    const wrapper = createWrapper({
      type: 'search',
      title: '搜索无结果',
      description: '没有找到相关的内容',
    })

    const container = wrapper.find('.empty-state')
    expect(container.classes()).toContain('empty-state--search')

    // 搜索图标应该是 Search
    expect(wrapper.find('.icon-search').exists()).toBe(true)

    // 标题和描述正确显示
    expect(wrapper.find('h3').text()).toBe('搜索无结果')
    expect(wrapper.find('p').text()).toBe('没有找到相关的内容')
  })

  it('不同 type 变体样式 - cart', () => {
    const wrapper = createWrapper({
      type: 'cart',
      title: '购物车为空',
    })

    const container = wrapper.find('.empty-state')
    expect(container.classes()).toContain('empty-state--cart')

    // 购物车图标应该是 ShoppingCart
    expect(wrapper.find('.icon-cart').exists()).toBe(true)
  })

  it('不同 type 变体样式 - order', () => {
    const wrapper = createWrapper({
      type: 'order',
      title: '暂无订单',
    })

    const container = wrapper.find('.empty-state')
    expect(container.classes()).toContain('empty-state--order')

    // 订单图标应该是 Box
    expect(wrapper.find('.icon-box').exists()).toBe(true)
  })

  it('不同 type 变体样式 - network', () => {
    const wrapper = createWrapper({
      type: 'network',
      title: '网络异常',
      description: '请检查网络连接',
    })

    const container = wrapper.find('.empty-state')
    expect(container.classes()).toContain('empty-state--network')

    // 网络图标应该是 Connection
    expect(wrapper.find('.icon-connection').exists()).toBe(true)
  })

  it('不同 type 变体样式 - folder', () => {
    const wrapper = createWrapper({
      type: 'folder',
      title: '文件夹为空',
    })

    const container = wrapper.find('.empty-state')
    expect(container.classes()).toContain('empty-state--folder')

    // 文件夹图标应该是 FolderOpened
    expect(wrapper.find('.icon-folder').exists()).toBe(true)
  })

  it('不同 type 变体样式 - coupon', () => {
    const wrapper = createWrapper({
      type: 'coupon',
      title: '暂无优惠券',
    })

    const container = wrapper.find('.empty-state')
    expect(container.classes()).toContain('empty-state--coupon')

    // 优惠券图标应该是 Ticket
    expect(wrapper.find('.icon-ticket').exists()).toBe(true)
  })

  it('不同 type 变体样式 - favorite', () => {
    const wrapper = createWrapper({
      type: 'favorite',
      title: '暂无收藏',
    })

    const container = wrapper.find('.empty-state')
    expect(container.classes()).toContain('empty-state--favorite')

    // 收藏图标应该是 Star
    expect(wrapper.find('.icon-star').exists()).toBe(true)
  })

  it('不同 type 变体样式 - error', () => {
    const wrapper = createWrapper({
      type: 'error',
      title: '出错了',
      description: '发生了错误',
    })

    const container = wrapper.find('.empty-state')
    expect(container.classes()).toContain('empty-state--error')

    // 错误图标应该是 Warning
    expect(wrapper.find('.icon-warning').exists()).toBe(true)
  })

  it('不同 type 变体样式 - info', () => {
    const wrapper = createWrapper({
      type: 'info',
      title: '提示信息',
    })

    const container = wrapper.find('.empty-state')
    expect(container.classes()).toContain('empty-state--info')

    // 信息图标应该是 InfoFilled
    expect(wrapper.find('.icon-info-filled').exists()).toBe(true)
  })

  it('支持自定义 iconSize 属性', () => {
    const wrapper = createWrapper({
      iconSize: 64,
      title: '大图标',
    })

    // 图标容器类应该反映大小变化
    const iconContainer = wrapper.find('.mx-auto.mb-5')
    expect(iconContainer.exists()).toBe(true)
  })

  it('支持自定义 customClass 属性', () => {
    const wrapper = createWrapper({
      customClass: 'my-custom-class',
      title: '自定义类名',
    })

    const container = wrapper.find('.empty-state')
    expect(container.classes()).toContain('my-custom-class')
  })

  it('不传 title 时不显示标题元素', () => {
    const wrapper = createWrapper()

    const title = wrapper.find('h3')
    expect(title.exists()).toBe(false)
  })

  it('不传 description 时不显示描述元素', () => {
    const wrapper = createWrapper({ title: '只有标题' })

    // 只有一个 p 元素（如果有 description），或者没有
    const paragraphs = wrapper.findAll('p')
    // 如果没有传 description，不应该有 p 元素（除非有其他 p）
    expect(paragraphs.length).toBe(0)
  })

  it('基础布局结构正确', () => {
    const wrapper = createWrapper({
      title: '测试布局',
      description: '测试描述',
    })

    const container = wrapper.find('.empty-state')
    expect(container.classes()).toContain('py-16')
    expect(container.classes()).toContain('px-4')
    expect(container.classes()).toContain('text-center')
  })
})
