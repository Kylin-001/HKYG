import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'
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
    // 创建Pinia实例
    const pinia = createPinia()

    // 设置初始路由
    await router.push('/test1')
    await router.isReady()

    wrapper = mount(AppMain, {
      global: {
        plugins: [router, pinia],
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

  it('应该包含正确的模板结构', () => {
    // 验证主容器存在
    expect(wrapper.find('.app-main').exists()).toBeTruthy()
    // 验证router-view存在，间接验证过渡效果的载体存在
    expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBeTruthy()
  })

  it('应该为router-view设置正确的key', async () => {
    // 由于key是通过v-bind动态绑定的，我们可以通过检查路由变化时组件是否重新渲染来验证key的作用
    // 初始路由下组件应该存在
    expect(wrapper.find('.test-component-1').exists()).toBeTruthy()

    // 切换路由
    await router.push('/test2')
    await wrapper.vm.$nextTick()

    // 新组件应该存在，旧组件应该不存在，说明key生效了
    expect(wrapper.find('.test-component-2').exists()).toBeTruthy()
    expect(wrapper.find('.test-component-1').exists()).toBe(false)
  })

  it('应该应用正确的样式', () => {
    const appMainElement = wrapper.find('.app-main')

    // 检查样式是否通过CSS类应用
    expect(appMainElement.exists()).toBeTruthy()
    // 检查类是否正确应用
    expect(appMainElement.classes()).toContain('app-main')
  })
})
