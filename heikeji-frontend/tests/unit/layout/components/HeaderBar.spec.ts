import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import HeaderBar from '@/layout/components/HeaderBar.vue'

// 模拟防抖函数
vi.mock('@/utils/helper', () => ({
  debounce: (fn: Function, delay: number) => {
    return fn // 简化测试，直接返回函数
  },
}))

describe('HeaderBar.vue', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(HeaderBar, {
      props: {
        collapsed: false,
        username: '测试管理员',
      },
    })
  })

  it('组件应该正确渲染', () => {
    expect(wrapper.find('.main-header').exists()).toBeTruthy()
    expect(wrapper.find('.header-left').exists()).toBeTruthy()
    expect(wrapper.find('.header-right').exists()).toBeTruthy()
  })

  it('应该正确显示用户名', () => {
    const userInfo = wrapper.find('.user-info')
    expect(userInfo.text()).toContain('测试管理员')
  })

  it('当未提供用户名时应该显示默认值', async () => {
    await wrapper.setProps({ username: '' })
    const userInfo = wrapper.find('.user-info')
    expect(userInfo.text()).toContain('管理员')
  })

  it('点击侧边栏折叠按钮应该触发toggle-sidebar事件', async () => {
    const toggleButton = wrapper.find('.sidebar-toggle')
    await toggleButton.trigger('click')

    expect(wrapper.emitted('toggle-sidebar')).toBeTruthy()
  })

  it('点击移动端菜单按钮应该触发toggle-mobile-menu事件', async () => {
    const mobileButton = wrapper.find('.mobile-menu-btn')
    await mobileButton.trigger('click')

    expect(wrapper.emitted('toggle-mobile-menu')).toBeTruthy()
  })

  it('点击用户信息下拉菜单项应该触发handle-command事件', async () => {
    // 模拟下拉菜单点击
    const userInfo = wrapper.find('.user-info')
    // 这里我们直接触发command事件，模拟点击下拉菜单项
    await userInfo.trigger('click') // 先点击显示下拉菜单

    // 模拟触发command事件
    await wrapper.trigger('command', 'profile')

    expect(wrapper.emitted('handle-command')).toBeTruthy()
    expect(wrapper.emitted('handle-command')![0]).toEqual(['profile'])
  })

  it('应该正确处理不同的命令类型', async () => {
    // 测试个人中心命令
    await wrapper.trigger('command', 'profile')
    expect(wrapper.emitted('handle-command')![0]).toEqual(['profile'])

    // 测试系统设置命令
    await wrapper.trigger('command', 'settings')
    expect(wrapper.emitted('handle-command')![1]).toEqual(['settings'])

    // 测试退出登录命令
    await wrapper.trigger('command', 'logout')
    expect(wrapper.emitted('handle-command')![2]).toEqual(['logout'])
  })
})
