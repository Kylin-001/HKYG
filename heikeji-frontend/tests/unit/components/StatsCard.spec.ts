import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import StatsCard from '@/components/StatsCard.vue'

describe('StatsCard.vue', () => {
  let wrapper: any

  // 测试用例数据
  const mockProps = {
    title: '测试指标',
    value: 12345,
    icon: 'el-icon-s-data',
    trend: 12.5,
    trendText: '较上月',
  }

  beforeEach(() => {
    wrapper = mount(StatsCard, {
      props: mockProps,
    })
  })

  it('组件应该正确渲染', () => {
    expect(wrapper.find('.stats-card').exists()).toBeTruthy()
    expect(wrapper.find('.stats-title').text()).toBe(mockProps.title)
    expect(wrapper.find('.stats-value').text()).toBe(mockProps.value.toString())
    expect(wrapper.find('.stats-icon').classes()).toContain(mockProps.icon)
  })

  it('应该正确处理不同类型的数值', async () => {
    // 测试数字类型
    expect(wrapper.find('.stats-value').text()).toBe('12345')

    // 测试字符串类型
    await wrapper.setProps({ value: '24680' })
    expect(wrapper.find('.stats-value').text()).toBe('24680')

    // 测试小数
    await wrapper.setProps({ value: 123.45 })
    expect(wrapper.find('.stats-value').text()).toBe('123.45')

    // 测试负数
    await wrapper.setProps({ value: -54321 })
    expect(wrapper.find('.stats-value').text()).toBe('-54321')
  })

  it('应该正确显示趋势和趋势文本', async () => {
    // 测试上升趋势
    expect(wrapper.find('.stats-trend.positive').exists()).toBeTruthy()
    expect(wrapper.find('.trend-value').text()).toBe('12.5%')
    expect(wrapper.find('.trend-text').text()).toBe(mockProps.trendText)

    // 测试下降趋势
    await wrapper.setProps({ trend: -8.2, trendText: '较上月' })
    expect(wrapper.find('.stats-trend.negative').exists()).toBeTruthy()
    expect(wrapper.find('.trend-value').text()).toBe('8.2%')

    // 测试持平趋势
    await wrapper.setProps({ trend: 0, trendText: '较上月' })
    expect(wrapper.find('.stats-trend.positive').exists()).toBeFalsy()
    expect(wrapper.find('.stats-trend.negative').exists()).toBeFalsy()
    expect(wrapper.find('.trend-value').text()).toBe('0%')
  })

  it('应该使用默认值', () => {
    const minimalWrapper = mount(StatsCard, {
      props: {
        title: '仅标题',
        value: 123,
        icon: 'el-icon-data-line', // icon是必填属性
      },
    })

    expect(minimalWrapper.find('.stats-card').exists()).toBeTruthy()
    expect(minimalWrapper.find('.stats-trend').exists()).toBeTruthy()
    expect(minimalWrapper.vm.trend).toBe(0)
    expect(minimalWrapper.vm.trendIcon).toBe('el-icon-caret-top')
    expect(minimalWrapper.vm.trendText).toBe('')
  })

  it('应该支持自定义趋势图标', async () => {
    const customIcon = 'el-icon-caret-bottom'
    await wrapper.setProps({ trendIcon: customIcon })
    expect(wrapper.find('.stats-trend i').classes()).toContain(customIcon)
  })

  it('应该正确应用样式', () => {
    // 测试卡片基本样式
    expect(wrapper.classes()).toContain('stats-card')
    expect(wrapper.find('.stats-icon-container').exists()).toBeTruthy()
    expect(wrapper.find('.stats-content').exists()).toBeTruthy()
  })

  // 测试不同的图标
  it('应该正确处理el-icon-s-data图标', async () => {
    await wrapper.setProps({ icon: 'el-icon-s-data' })
    expect(wrapper.find('.stats-icon').classes()).toContain('el-icon-s-data')
  })

  it('应该正确处理el-icon-data-line图标', async () => {
    await wrapper.setProps({ icon: 'el-icon-data-line' })
    expect(wrapper.find('.stats-icon').classes()).toContain('el-icon-data-line')
  })

  it('应该正确处理el-icon-pie-chart图标', async () => {
    await wrapper.setProps({ icon: 'el-icon-pie-chart' })
    expect(wrapper.find('.stats-icon').classes()).toContain('el-icon-pie-chart')
  })

  it('应该正确处理el-icon-line-chart图标', async () => {
    await wrapper.setProps({ icon: 'el-icon-line-chart' })
    expect(wrapper.find('.stats-icon').classes()).toContain('el-icon-line-chart')
  })

  it('应该正确处理无趋势文本的情况', async () => {
    await wrapper.setProps({ trendText: '' })
    expect(wrapper.find('.trend-text').text()).toBe('')
  })

  it('应该正确响应属性变化', async () => {
    // 测试属性变化时的响应
    await wrapper.setProps({ title: '更新后的标题', value: 54321, trend: -5.5 })

    expect(wrapper.find('.stats-title').text()).toBe('更新后的标题')
    expect(wrapper.find('.stats-value').text()).toBe('54321')
    expect(wrapper.find('.stats-trend.negative').exists()).toBeTruthy()
    expect(wrapper.find('.trend-value').text()).toBe('5.5%')
  })
})
