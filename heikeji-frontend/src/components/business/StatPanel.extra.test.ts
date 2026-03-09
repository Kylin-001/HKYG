import { describe, it, expect, vi, beforeEach } from 'vitest'
import { testUserData } from '@/config/test';
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import StatPanel from '@/components/business/StatPanel.vue'

describe('StatPanel Component Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockStats = [
    {
      id: 1,
      title: '总用户数',
      value: 12345,
      icon: 'User',
      trend: 'up',
      trendIcon: 'ArrowUp',
      trendText: '12.5%'
    },
    {
      id: 2,
      title: '今日订单',
      value: 678,
      icon: 'ShoppingCart',
      trend: 'down',
      trendIcon: 'ArrowDown',
      trendText: '3.2%'
    },
    {
      id: 3,
      title: '今日销售额',
      value: 45678.90,
      icon: 'Money',
      trend: 'up',
      trendIcon: 'ArrowUp',
      trendText: '8.7%'
    },
    {
      id: 4,
      title: '活跃用户',
      value: 2345,
      icon: 'User',
      trend: 'up',
      trendIcon: 'ArrowUp',
      trendText: '5.3%'
    }
  ]

  it('should render correctly', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: mockStats
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.stat-panel')).exists().toBe(true)
  })

  it('should render all stats', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: mockStats
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.text()).toContain('总用户数')
    expect(wrapper.text()).toContain('今日订单')
    expect(wrapper.text()).toContain('今日销售额')
    expect(wrapper.text()).toContain('活跃用户')
  })

  it('should display stat values', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: mockStats
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.text()).toContain('12345')
    expect(wrapper.text()).toContain('678')
    expect(wrapper.text()).toContain('45678.90')
    expect(wrapper.text()).toContain('2345')
  })

  it('should render icons', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: mockStats
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    const icons = wrapper.findAll('.stat-icon')
    expect(icons.length).toBe(4)
  })

  it('should show trend indicators', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: mockStats
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.text()).toContain('12.5%')
    expect(wrapper.text()).toContain('3.2%')
    expect(wrapper.text()).toContain('8.7%')
    expect(wrapper.text()).toContain('5.3%')
  })

  it('should apply correct color for upward trend', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: [mockStats[0]]
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.trend-up').exists()).toBe(true)
  })

  it('should apply correct color for downward trend', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: [mockStats[1]]
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.trend-down').exists()).toBe(true)
  })

  it('should emit stat-click event when stat is clicked', async () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: mockStats
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    const statCards = wrapper.findAll('.stat-card')
    await statCards[0].trigger('click')
    
    expect(wrapper.emitted('stat-click')).toBeTruthy()
    expect(wrapper.emitted('stat-click')[0]).toEqual([mockStats[0]])
  })

  it('should handle empty stats', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: []
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('should handle single stat', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: [mockStats[0]]
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.text()).toContain('总用户数')
    expect(wrapper.text()).toContain('12345')
  })

  it('should handle large number formatting', () => {
    const largeStats = [
      {
        id: 1,
        title: '总销售额',
        value: 123456789.12,
        icon: 'Money',
        trend: 'up',
        trendIcon: 'ArrowUp',
        trendText: '15.3%'
      }
    ]
    
    const wrapper = mount(StatPanel, {
      props: {
        stats: largeStats
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.text()).toContain('123,456,789.12')
  })

  it('should handle zero values', () => {
    const zeroStats = [
      {
        id: 1,
        title: '今日订单',
        value: 0,
        icon: 'ShoppingCart',
        trend: 'down',
        trendIcon: 'ArrowDown',
        trendText: '0%'
      }
    ]
    
    const wrapper = mount(StatPanel, {
      props: {
        stats: zeroStats
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.text()).toContain('0')
  })

  it('should show loading state', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: mockStats,
        loading: true
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.loading-skeleton')).exists().toBe(true)
  })

  it('should handle error state', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: mockStats,
        error: '加载失败'
      },
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.text()).toContain('加载失败')
  })
})
