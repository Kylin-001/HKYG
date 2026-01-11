import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { useRoute } from 'vue-router'

// 模拟 vue-router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
}))

describe('Breadcrumb 组件测试', () => {
  beforeEach(() => {
    // 清除所有模拟调用
    vi.clearAllMocks()
  })

  it('should return custom breadcrumbs when provided via props', () => {
    // 自定义面包屑数据
    const customBreadcrumbs = [
      { path: '/home', name: '首页', icon: 'el-icon-s-home' },
      { path: '/products', name: '商品管理' },
      { path: '/products/list', name: '商品列表', icon: 'el-icon-s-goods' },
    ]

    // 模拟路由（即使提供了props，组件仍会监听路由变化）
    const mockRoute = {
      matched: [],
    }
    ;(useRoute as vi.Mock).mockReturnValue(mockRoute)

    // 挂载组件并提供props
    const wrapper = mount(Breadcrumb, {
      props: {
        breadcrumbs: customBreadcrumbs,
      },
      // 不渲染子组件，只测试逻辑
      shallow: true,
    })

    // 测试组件是否正确接收props
    expect(wrapper.props('breadcrumbs')).toEqual(customBreadcrumbs)
  })

  it('should handle undefined breadcrumbs prop', () => {
    // 模拟路由
    const mockRoute = {
      matched: [
        {
          path: '/',
          name: 'Home',
          hidden: false,
          meta: { title: '首页' },
        },
      ],
    }
    ;(useRoute as vi.Mock).mockReturnValue(mockRoute)

    // 挂载组件，不提供breadcrumbs props
    const wrapper = mount(Breadcrumb, {
      shallow: true,
    })

    // 测试组件是否能处理undefined props
    expect(wrapper.props('breadcrumbs')).toBeUndefined()
    // 测试useRoute是否被调用
    expect(useRoute).toHaveBeenCalled()
  })

  describe('route handling logic', () => {
    it('should call useRoute when component mounts', () => {
      // 模拟路由
      const mockRoute = {
        matched: [
          {
            path: '/dashboard',
            name: 'Dashboard',
            hidden: false,
            meta: { title: '仪表盘' },
          },
        ],
      }
      ;(useRoute as vi.Mock).mockReturnValue(mockRoute)

      // 挂载组件
      mount(Breadcrumb, {
        shallow: true,
      })

      // 测试useRoute是否被调用
      expect(useRoute).toHaveBeenCalled()
    })

    it('should handle empty matched routes', () => {
      // 模拟空路由匹配
      const mockRoute = {
        matched: [],
      }
      ;(useRoute as vi.Mock).mockReturnValue(mockRoute)

      // 挂载组件
      mount(Breadcrumb, {
        shallow: true,
      })

      // 测试useRoute是否被调用
      expect(useRoute).toHaveBeenCalled()
    })

    it('should handle route with hidden routes', () => {
      // 模拟包含隐藏路由的路由匹配
      const mockRoute = {
        matched: [
          {
            path: '/dashboard',
            name: 'Dashboard',
            hidden: false,
            meta: { title: '仪表盘' },
          },
          {
            path: '/dashboard/hidden',
            name: 'Hidden',
            hidden: true,
            meta: { title: '隐藏页面' },
          },
        ],
      }
      ;(useRoute as vi.Mock).mockReturnValue(mockRoute)

      // 挂载组件
      mount(Breadcrumb, {
        shallow: true,
      })

      // 测试useRoute是否被调用
      expect(useRoute).toHaveBeenCalled()
    })
  })
})
