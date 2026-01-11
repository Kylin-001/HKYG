import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import HeaderBar from '@/layout/components/HeaderBar.vue'

// 模拟ThemeManager组件
vi.mock('@/components/ui/ThemeManager.vue', () => ({
  default: {
    template: '<div class="mock-theme-manager"></div>',
  },
}))

// 模拟防抖函数
vi.mock('@/utils/index', () => ({
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
      global: {
        stubs: {
          // 替换所有Element Plus组件
          'el-button': {
            template: '<button class="mock-el-button"><slot /></button>',
          },
          'el-dropdown': {
            template: '<div class="mock-el-dropdown"><slot /><slot name="dropdown"></slot></div>',
            props: ['trigger', 'hide-on-click'],
          },
          'el-dropdown-menu': {
            template: '<div class="mock-el-dropdown-menu"><slot /></div>',
          },
          'el-dropdown-item': {
            template: '<div class="mock-el-dropdown-item"><slot /></div>',
            props: ['command', 'disabled', 'divided'],
          },
          'el-icon': {
            template: '<div class="mock-el-icon"><slot /></div>',
            props: ['size'],
          },
          'el-icon-s-fold': {
            template: '<div class="mock-el-icon-s-fold"></div>',
          },
          'el-icon-menu': {
            template: '<div class="mock-el-icon-menu"></div>',
          },
          'el-icon-user': {
            template: '<div class="mock-el-icon-user"></div>',
          },
          'el-icon-arrow-down': {
            template: '<div class="mock-el-icon-arrow-down"></div>',
          },
          'el-icon-setting': {
            template: '<div class="mock-el-icon-setting"></div>',
          },
          'el-icon-switch-button': {
            template: '<div class="mock-el-icon-switch-button"></div>',
          },
          Check: {
            template: '<div class="mock-check-icon"></div>',
          },
          Sun: {
            template: '<div class="mock-sun-icon"></div>',
          },
          Moon: {
            template: '<div class="mock-moon-icon"></div>',
          },
          Monitor: {
            template: '<div class="mock-monitor-icon"></div>',
          },
        },
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
    // 直接调用组件内部的handleCommand方法
    const { handleCommand } = wrapper.vm

    // 模拟调用handleCommand方法
    handleCommand('profile')

    expect(wrapper.emitted('handle-command')).toBeTruthy()
    expect(wrapper.emitted('handle-command')![0]).toEqual(['profile'])
  })

  it('应该正确处理不同的命令类型', async () => {
    // 获取组件内部的handleCommand方法
    const { handleCommand } = wrapper.vm

    // 测试个人中心命令
    handleCommand('profile')
    expect(wrapper.emitted('handle-command')![0]).toEqual(['profile'])

    // 测试系统设置命令
    handleCommand('settings')
    expect(wrapper.emitted('handle-command')![1]).toEqual(['settings'])

    // 测试退出登录命令
    handleCommand('logout')
    expect(wrapper.emitted('handle-command')![2]).toEqual(['logout'])
  })
})
