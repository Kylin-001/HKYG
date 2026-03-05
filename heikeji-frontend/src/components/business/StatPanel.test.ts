import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import StatPanel from '@/components/business/StatPanel.vue'

describe('StatPanel Component', () => {
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
    }
  ]

  it('should render stats correctly', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: mockStats
      }
    })
    
    expect(wrapper.text()).toContain('总用户数')
    expect(wrapper.text()).toContain('12345')
    expect(wrapper.text()).toContain('今日订单')
    expect(wrapper.text()).toContain('678')
  })

  it('should render icons correctly', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: mockStats
      }
    })
    
    const icons = wrapper.findAll('.stat-icon')
    expect(icons.length).toBe(2)
  })

  it('should show trend indicators', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: mockStats
      }
    })
    
    expect(wrapper.text()).toContain('12.5%')
    expect(wrapper.text()).toContain('3.2%')
  })

  it('should apply correct color for upward trend', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: [mockStats[0]]
      }
    })
    
    expect(wrapper.find('.trend-up').exists()).toBe(true)
  })

  it('should apply correct color for downward trend', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: [mockStats[1]]
      }
    })
    
    expect(wrapper.find('.trend-down').exists()).toBe(true)
  })

  it('should emit click event when stat is clicked', async () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: mockStats
      }
    })
    
    const statCard = wrapper.findAll('.stat-card')[0]
    await statCard.trigger('click')
    expect(wrapper.emitted('stat-click')).toBeTruthy()
    expect(wrapper.emitted('stat-click')[0]).toEqual([mockStats[0]])
  })

  it('should show loading state', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: mockStats,
        loading: true
      }
    })
    
    expect(wrapper.find('.loading-skeleton').exists()).toBe(true)
  })

  it('should handle empty stats', () => {
    const wrapper = mount(StatPanel, {
      props: {
        stats: []
      }
    })
    
    expect(wrapper.text()).toContain('暂无数据')
  })
})
