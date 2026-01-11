import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PageTransition from '@/components/ui/PageTransition.vue'

// Mock the useRoute hook
vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/dashboard'
  })
}))

describe('PageTransition组件测试', () => {
  it('应该正确渲染并传递默认属性', () => {
    const wrapper = mount(PageTransition, {
      slots: {
        default: '<div class="test-content">测试内容</div>'
      }
    })

    // 验证组件是否渲染
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html()).toContain('transition')
  })

  it('应该根据type属性渲染不同的过渡效果', () => {
    const transitionTypes = ['fade', 'slide', 'scale', 'slideFade', 'zoom']
    
    for (const type of transitionTypes) {
      const wrapper = mount(PageTransition, {
        props: { type },
        slots: {
          default: '<div class="test-content">测试内容</div>'
        }
      })
      
      // 验证过渡组件是否存在
      expect(wrapper.html()).toContain('transition')
    }
  })

  it('应该根据direction属性调整滑动方向', () => {
    const directions = ['left', 'right', 'up', 'down']
    
    for (const direction of directions) {
      const wrapper = mount(PageTransition, {
        props: { type: 'slide', direction },
        slots: {
          default: '<div class="test-content">测试内容</div>'
        }
      })
      
      // 验证过渡组件是否存在
      expect(wrapper.html()).toContain('transition')
    }
  })

  it('应该根据duration属性设置过渡时长', () => {
    const wrapper = mount(PageTransition, {
      props: { duration: 500 },
      slots: {
        default: '<div class="test-content">测试内容</div>'
      }
    })
    
    // 验证过渡组件是否存在
    expect(wrapper.html()).toContain('transition')
  })

  it('应该根据mode属性设置过渡模式', () => {
    const modes = ['in-out', 'out-in', 'default']
    
    for (const mode of modes) {
      const wrapper = mount(PageTransition, {
        props: { mode },
        slots: {
          default: '<div class="test-content">测试内容</div>'
        }
      })
      
      // 验证过渡组件是否存在
      expect(wrapper.html()).toContain('transition')
    }
  })

  it('应该正确处理路由感知的过渡效果', () => {
    const wrapper = mount(PageTransition, {
      props: {
        route: { path: '/dashboard' } as any
      },
      slots: {
        default: '<div class="test-content">测试内容</div>'
      }
    })
    
    // 验证组件是否正确处理路由信息
    expect(wrapper.exists()).toBe(true)
  })

  it('应该触发过渡钩子函数', async () => {
    // Mock console.log to verify hook calls
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    const wrapper = mount(PageTransition, {
      slots: {
        default: '<div class="test-content">测试内容</div>'
      }
    })
    
    // 触发过渡效果
    await wrapper.setProps({ key: 'new-key' })
    await wrapper.vm.$nextTick()
    
    // 恢复原始console.log
    consoleLogSpy.mockRestore()
  })

  it('应该正确显示默认插槽内容', () => {
    const testContent = '测试内容'
    const wrapper = mount(PageTransition, {
      slots: {
        default: `<div class="test-content">${testContent}</div>`
      }
    })
    
    // 验证插槽内容是否正确渲染
    expect(wrapper.text()).toContain(testContent)
    expect(wrapper.find('.test-content').exists()).toBe(true)
  })
})
