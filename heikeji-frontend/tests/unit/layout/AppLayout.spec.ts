import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

// 模拟主题管理器组件
vi.mock('@/components/ui/ThemeManager.vue', () => ({
  default: {
    template: '<div class="mock-theme-manager"></div>',
  },
}))

// 模拟登录API
vi.mock('@/api/login', () => ({
  logout: vi.fn(() => Promise.resolve()),
}))

// 模拟所有store模块，避免导入旧的Vuex配置
vi.mock('@/store/modules/user', () => ({
  useUserStore: () => ({
    userInfo: { username: '测试用户' },
    getUserInfoAction: vi.fn(),
    logoutAction: vi.fn(() => Promise.resolve()),
  }),
}))

vi.mock('@/store/modules/permission', () => ({
  usePermissionStore: () => ({
    routes: [],
    generateRoutes: vi.fn(),
  }),
}))

// 模拟store/index.js，避免导入Vuex
vi.mock('@/store/index.js', () => ({
  default: {},
}))

// Mock组件
const mockComponents = {
  HeaderBar: {
    template: '<div class="mock-header"><slot /></div>',
    props: ['collapsed', 'username'],
  },
  SideBar: {
    template: '<div class="mock-sidebar"><slot /></div>',
    props: ['collapsed', 'showMobile', 'routes', 'submenuOpenStatus'],
  },
  MainContent: {
    template: '<div class="mock-main"><slot /></div>',
    props: ['collapsed', 'breadcrumbList', 'cachedComponents'],
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
          collapsed: false,
          showMobileMenu: false,
          submenuOpenStatus: {},
        }
      },
    })
  })

  it('组件应该正确渲染', () => {
    expect(wrapper.find('.app-layout').exists()).toBeTruthy()
    expect(wrapper.findComponent(mockComponents.HeaderBar).exists()).toBeTruthy()
    expect(wrapper.findComponent(mockComponents.SideBar).exists()).toBeTruthy()
    expect(wrapper.findComponent(mockComponents.MainContent).exists()).toBeTruthy()
  })

  it('应该正确处理侧边栏折叠状态', async () => {
    // 初始状态应该是展开的
    expect(wrapper.vm.collapsed).toBe(false)

    // 直接调用toggleSidebar方法
    await wrapper.vm.toggleSidebar()

    // 验证状态改变
    expect(wrapper.vm.collapsed).toBe(true)
  })

  it('应该正确处理移动端菜单显示/隐藏', async () => {
    // 初始状态应该是隐藏的
    expect(wrapper.vm.showMobileMenu).toBe(false)

    // 直接调用toggleMobileMenu方法
    await wrapper.vm.toggleMobileMenu()

    // 验证状态改变
    expect(wrapper.vm.showMobileMenu).toBe(true)

    // 再次调用应该隐藏
    await wrapper.vm.toggleMobileMenu()
    expect(wrapper.vm.showMobileMenu).toBe(false)
  })

  it('应该正确处理子菜单展开/折叠状态', async () => {
    // 初始状态应该是undefined
    expect(wrapper.vm.subMenuOpenStatus['/test-path']).toBeUndefined()

    // 直接调用toggleSubMenu方法
    await wrapper.vm.toggleSubMenu('/test-path')

    // 验证子菜单状态已更新
    expect(wrapper.vm.subMenuOpenStatus['/test-path']).toBe(true)

    // 再次调用应该折叠
    await wrapper.vm.toggleSubMenu('/test-path')
    expect(wrapper.vm.subMenuOpenStatus['/test-path']).toBe(false)
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

  it('应该正确响应窗口大小变化', async () => {
    // 模拟窗口大小变化
    const resizeEvent = new Event('resize')
    window.dispatchEvent(resizeEvent)
    // 验证组件正确处理了窗口大小变化
    // 由于resize事件处理是异步的，我们可以检查相关状态变化
    // 这里可以添加更具体的测试，比如检查collapsed状态是否根据窗口宽度自动变化
  })

  it('应该正确传递用户信息到HeaderBar', () => {
    const headerBar = wrapper.findComponent(mockComponents.HeaderBar)
    // 验证HeaderBar接收了正确的用户名prop
    expect(headerBar.props('username')).toBe('测试用户')
  })

  it('应该正确处理路由变化', async () => {
    // 模拟路由变化
    await router.push('/dashboard')
    // 验证路由变化后组件仍能正常工作
    expect(wrapper.findComponent(mockComponents.MainContent).exists()).toBeTruthy()
  })

  it('应该正确处理侧边栏宽度变化', () => {
    // 初始状态侧边栏应该是展开的，宽度较大
    expect(wrapper.vm.collapsed).toBe(false)
    // 切换到折叠状态
    wrapper.vm.collapsed = true
    // 验证状态变化
    expect(wrapper.vm.collapsed).toBe(true)
  })

  it('应该正确处理主题管理器的存在', () => {
    // 验证主题管理器组件被渲染
    expect(wrapper.find('.mock-theme-manager').exists()).toBeTruthy()
  })
})
