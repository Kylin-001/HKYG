import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Dashboard from '@/views/dashboard/index.vue'

vi.mock('@/components/business/StatPanel.vue', () => ({
  name: 'StatPanel',
  template: '<div class="stat-panel-mock">StatPanel</div>'
}))

describe('Dashboard Page', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should render correctly', () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.dashboard-container')).exists().toBe(true)
    expect(wrapper.find('.school-banner')).exists().toBe(true)
    expect(wrapper.find('.dashboard-header')).exists().toBe(true)
  })

  it('should display school slogan', () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.school-slogan').text()).toContain('自强不息，创业创新')
    expect(wrapper.find('.school-motto').text()).toContain('黑龙江科技大学校训')
  })

  it('should display dashboard title', () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.dashboard-title').text()).toContain('黑科易购校园电商平台管理系统')
    expect(wrapper.find('.dashboard-subtitle').text()).toContain('为黑龙江科技大学师生提供便捷的校园电商服务')
  })

  it('should show loading state', () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    wrapper.vm.loading = true
    expect(wrapper.find('.loading-container')).exists().toBe(true)
    expect(wrapper.find('.el-skeleton')).exists().toBe(true)
  })

  it('should render stat cards', () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.stats-card-group')).exists().toBe(true)
    expect(wrapper.findComponent({ name: 'StatPanel' })).toBeTruthy()
  })

  it('should render chart containers', () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.charts-container')).exists().toBe(true)
    expect(wrapper.find('.chart-card')).exists().toBe(true)
  })

  it('should render service trend chart', () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.chart-title').text()).toContain('服务趋势分析')
    expect(wrapper.find('.ve-chart')).exists().toBe(true)
  })

  it('should render service type chart', () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    const chartCards = wrapper.findAll('.chart-card')
    expect(chartCards.length).toBeGreaterThan(1)
  })

  it('should render recent requests container', () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.recent-requests-container')).exists().toBe(true)
    expect(wrapper.find('.chart-card')).exists().toBe(true)
  })

  it('should render order table', () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.order-table-container')).exists().toBe(true)
    expect(wrapper.find('.el-table')).exists().toBe(true)
  })

  it('should render tabs for order types', () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    expect(wrapper.find('.el-tabs')).exists().toBe(true)
    expect(wrapper.find('.el-tab-pane')).exists().toBe(true)
  })

  it('should have navigation buttons', () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    const buttons = wrapper.findAll('.el-button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should emit navigation events', async () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()],
      },
    })
    
    const buttons = wrapper.findAll('.el-button')
    if (buttons.length > 0) {
      await buttons[0].trigger('click')
    }
  })
})
