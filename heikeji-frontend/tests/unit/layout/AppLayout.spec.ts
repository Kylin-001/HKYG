import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

// Mock组件
const mockComponents = {
  HeaderBar: {
    template: '<div class="mock-header"><slot /></div>',
    props: ['collapsed', 'username'],
  },
  Sidebar: {
    template: '<div class="mock-sidebar"><slot /></div>',
    props: ['collapsed', 'showMobile', 'routes', 'submenuOpenStatus'],
  },
  AppMain: {
    template: '<div class="mock-main"><slot /></div>',
  },
}

// 创建测试路由
const mockRoutes = [
  {
    path: '/login',
    component: { template: '<div>Login</div>' },
    meta: { hidden: true },
  },
  {
    path: '/dashboard',
    component: { template: '<div>Dashboard</div>' },
    meta: { title: '首页', icon: 'el-icon-s-home' },
  },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes: mockRoutes,
})

describe('AppLayout.vue', () => {
  let wrapper: VueWrapper
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    wrapper = mount(AppLayout, {
      global: {
        plugins: [pinia, router],
        components: mockComponents,
      },
      data() {
        return {
          sidebarCollapsed: false,
          showMobileMenu: false,
          submenuOpenStatus: {},
        }
      },
    })
  })

  it('组件应该正确渲染', () => {
    expect(wrapper.find('.app-container').exists()).toBeTruthy()
    expect(wrapper.findComponent(mockComponents.HeaderBar).exists()).toBeTruthy()
    expect(wrapper.findComponent(mockComponents.Sidebar).exists()).toBeTruthy()
    expect(wrapper.findComponent(mockComponents.AppMain).exists()).toBeTruthy()
  })

  it('应该正确处理侧边栏折叠状态', async () => {
    // 初始状态应该是展开的
    expect(wrapper.vm.sidebarCollapsed).toBe(false)

    // 触发折叠事件
    const headerBar = wrapper.findComponent(mockComponents.HeaderBar)
    await headerBar.trigger('toggle-sidebar')

    // 验证状态改变
    expect(wrapper.vm.sidebarCollapsed).toBe(true)
  })

  it('应该正确处理移动端菜单显示/隐藏', async () => {
    // 初始状态应该是隐藏的
    expect(wrapper.vm.showMobileMenu).toBe(false)

    // 触发显示事件
    const headerBar = wrapper.findComponent(mockComponents.HeaderBar)
    await headerBar.trigger('toggle-mobile-menu')

    // 验证状态改变
    expect(wrapper.vm.showMobileMenu).toBe(true)

    // 再次触发应该隐藏
    await headerBar.trigger('toggle-mobile-menu')
    expect(wrapper.vm.showMobileMenu).toBe(false)
  })

  it('应该正确处理子菜单展开/折叠状态', async () => {
    const sidebar = wrapper.findComponent(mockComponents.Sidebar)
    await sidebar.trigger('toggle-submenu', '/test-path')

    // 验证子菜单状态已更新
    expect(wrapper.vm.submenuOpenStatus['/test-path']).toBe(true)

    // 再次触发应该折叠
    await sidebar.trigger('toggle-submenu', '/test-path')
    expect(wrapper.vm.submenuOpenStatus['/test-path']).toBe(false)
  })

  it('应该正确处理用户命令', async () => {
    const headerBar = wrapper.findComponent(mockComponents.HeaderBar)

    // 模拟退出登录命令
    await headerBar.trigger('handle-command', 'logout')

    // 这里可以添加更多关于命令处理的测试
    // 因为实际的退出登录逻辑会调用router和store，这里需要更多的mock
  })

  it('组件销毁时应该移除事件监听器', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    wrapper.unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })
})
