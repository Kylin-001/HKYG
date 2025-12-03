import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppMain from '@/layout/components/AppMain.vue'

// 创建测试路由和组件
const TestComponent1 = { template: '<div class="test-component-1">Component 1</div>' }
const TestComponent2 = { template: '<div class="test-component-2">Component 2</div>' }

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/test1',
      component: TestComponent1,
    },
    {
      path: '/test2',
      component: TestComponent2,
    },
  ],
})

describe('AppMain.vue', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    // 设置初始路由
    await router.push('/test1')
    await router.isReady()

    wrapper = mount(AppMain, {
      global: {
        plugins: [router],
      },
    })
  })

  it('组件应该正确渲染', () => {
    expect(wrapper.find('.app-main').exists()).toBeTruthy()
  })

  it('应该正确渲染当前路由组件', () => {
    expect(wrapper.find('.test-component-1').exists()).toBeTruthy()
    expect(wrapper.find('.test-component-1').text()).toBe('Component 1')
  })

  it('应该在路由变化时更新显示的组件', async () => {
    // 初始组件应该是TestComponent1
    expect(wrapper.find('.test-component-1').exists()).toBeTruthy()
    expect(wrapper.find('.test-component-2').exists()).toBe(false)

    // 切换路由
    await router.push('/test2')
    await wrapper.vm.$nextTick()

    // 应该显示TestComponent2
    expect(wrapper.find('.test-component-1').exists()).toBe(false)
    expect(wrapper.find('.test-component-2').exists()).toBeTruthy()
    expect(wrapper.find('.test-component-2').text()).toBe('Component 2')
  })

  it('应该正确应用动画过渡', () => {
    // 验证过渡元素存在
    expect(wrapper.find('transition').exists()).toBeTruthy()
    expect(wrapper.find('transition').attributes('name')).toBe('fade-transform')
    expect(wrapper.find('transition').attributes('mode')).toBe('out-in')
  })

  it('应该为router-view设置正确的key', async () => {
    // 初始路由
    const routerView = wrapper.findComponent({ name: 'RouterView' })
    expect(routerView.props('key')).toBe('/test1')

    // 切换路由后检查key是否更新
    await router.push('/test2')
    await wrapper.vm.$nextTick()

    const updatedRouterView = wrapper.findComponent({ name: 'RouterView' })
    expect(updatedRouterView.props('key')).toBe('/test2')
  })

  it('应该应用正确的样式', () => {
    const appMainElement = wrapper.find('.app-main').element as HTMLElement

    // 检查基本样式
    expect(appMainElement.style.minHeight).toBeTruthy()
    expect(appMainElement.style.backgroundColor).toBeTruthy()
    expect(appMainElement.style.padding).toBeTruthy()
    expect(appMainElement.style.transition).toBeTruthy()
  })
})
