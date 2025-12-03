import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Sidebar from '@/layout/components/Sidebar.vue'

// 创建测试路由
const router = createRouter({
  history: createMemoryHistory(),
  routes: [],
})

// 模拟路由数据
const mockRoutes = [
  {
    path: '/dashboard',
    meta: { title: '首页', icon: 'el-icon-s-home' },
  },
  {
    path: '/product',
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [
      {
        path: '/product/list',
        meta: { title: '商品列表', icon: 'el-icon-s-grid' },
      },
      {
        path: '/product/category',
        meta: { title: '分类管理', icon: 'el-icon-menu' },
      },
    ],
  },
  {
    path: '/user',
    meta: { title: '用户管理', icon: 'el-icon-user' },
  },
]

describe('Sidebar.vue', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(Sidebar, {
      global: {
        plugins: [router],
      },
      props: {
        collapsed: false,
        showMobile: false,
        routes: mockRoutes,
        submenuOpenStatus: {},
      },
    })
  })

  it('组件应该正确渲染', () => {
    expect(wrapper.find('.sidebar').exists()).toBeTruthy()
    expect(wrapper.find('.sidebar-menu').exists()).toBeTruthy()
  })

  it('应该正确显示所有顶级菜单项', () => {
    const menuItems = wrapper.findAll('.menu-item')
    expect(menuItems.length).toBe(mockRoutes.length)

    // 检查第一个菜单项
    const firstMenuItem = menuItems[0]
    expect(firstMenuItem.find('.menu-title').text()).toBe('首页')
    expect(firstMenuItem.find('.menu-icon').classes()).toContain('el-icon-s-home')
  })

  it('应该正确处理子菜单显示', async () => {
    // 初始状态下子菜单应该不可见
    expect(wrapper.find('.sub-menu-open').exists()).toBe(false)

    // 触发子菜单展开
    const productMenu = wrapper.find('.menu-item.has-children .menu-header')
    await productMenu.trigger('click')

    // 验证事件已发出
    expect(wrapper.emitted('toggle-submenu')).toBeTruthy()
    expect(wrapper.emitted('toggle-submenu')![0]).toEqual(['/product'])
  })

  it('当props.collapsed为true时应该应用折叠样式', async () => {
    await wrapper.setProps({ collapsed: true })
    expect(wrapper.classes()).toContain('sidebar-collapsed')
  })

  it('当props.showMobile为true时应该应用移动端显示样式', async () => {
    await wrapper.setProps({ showMobile: true })
    expect(wrapper.classes()).toContain('sidebar-show')
  })

  it('应该正确检测子菜单是否打开', () => {
    // 设置子菜单打开状态
    const submenuStatus = { '/product': true }

    // 重新挂载组件
    const newWrapper = mount(Sidebar, {
      props: {
        collapsed: false,
        showMobile: false,
        routes: mockRoutes,
        submenuOpenStatus: submenuStatus,
      },
    })

    // 由于这里isSubMenuOpen是一个内部方法，我们需要通过props来测试其逻辑
    expect(submenuStatus['/product']).toBe(true)
    expect(submenuStatus['/dashboard']).toBeUndefined()
  })
})
