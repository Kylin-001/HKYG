<!--
@fileoverview 统计面板组件
@description 支持多指标展示、趋势图表、颜色编码和动画效果
@example
  <StatPanel
    :metrics="metricsData"
    :show-trend="true"
    :color-coded="true"
    animation
  />
-->
<template>
  <div class="stat-panel" :class="{ 'with-animation': animation, 'color-coded': colorCoded }">
    <div v-if="title" class="panel-title">
      <span class="title-text">{{ title }}</span>
      <slot name="title-extra"></slot>
    </div>

    <!-- 单指标模式 -->
    <div v-if="metrics.length === 1" class="single-metric">
      <div class="metric-item" :class="`metric-${metrics[0].type}`">
        <div class="metric-header">
          <div class="metric-title">
            <span class="title">{{ metrics[0].title }}</span>
            <el-tag
              v-if="metrics[0].tag"
              :type="metrics[0].tag.type || 'info'"
              size="small"
              class="metric-tag"
            >
              {{ metrics[0].tag.text }}
            </el-tag>
          </div>
          <div class="metric-value-container">
            <span
              class="metric-value"
              :class="{ 'up-trend': isUpTrend(metrics[0]), 'down-trend': isDownTrend(metrics[0]) }"
            >
              {{ formatValue(metrics[0]) }}
            </span>
            <div v-if="showComparison && metrics[0].comparison" class="metric-comparison">
              <el-icon :size="14">
                <component :is="isUpTrend(metrics[0]) ? ArrowUp : ArrowDown" />
              </el-icon>
              <span>{{ metrics[0].comparison.value }}%</span>
              <span v-if="metrics[0].comparison.label" class="comparison-label">{{
                metrics[0].comparison.label
              }}</span>
            </div>
          </div>
        </div>
        <div v-if="showTrend && metrics[0].trendData" class="metric-trend">
          <div
            ref="trendChartRef"
            class="trend-chart"
            :style="{ height: chartHeight + 'px' }"
          ></div>
        </div>
        <div v-if="metrics[0].description" class="metric-description">
          {{ metrics[0].description }}
        </div>
      </div>
    </div>

    <!-- 多指标模式 -->
    <div v-else class="multi-metric">
      <div
        v-for="(metric, index) in metrics"
        :key="index"
        class="metric-item"
        :class="`metric-${metric.type}`"
      >
        <div class="metric-title">
          <span class="title">{{ metric.title }}</span>
          <el-tag
            v-if="metric.tag"
            :type="metric.tag.type || 'info'"
            size="small"
            class="metric-tag"
          >
            {{ metric.tag.text }}
          </el-tag>
        </div>
        <div class="metric-value-container">
          <span
            class="metric-value"
            :class="{ 'up-trend': isUpTrend(metric), 'down-trend': isDownTrend(metric) }"
          >
            {{ formatValue(metric) }}
          </span>
          <div v-if="showComparison && metric.comparison" class="metric-comparison">
            <el-icon :size="12">
              <component :is="isUpTrend(metric) ? ArrowUp : ArrowDown" />
            </el-icon>
            <span>{{ metric.comparison.value }}%</span>
          </div>
        </div>
        <div v-if="showTrend && metric.trendData" class="metric-trend">
          <div
            ref="trendChartRefs[index]"
            class="trend-chart small"
            :style="{ height: smallChartHeight + 'px' }"
          ></div>
        </div>
        <div v-if="metric.description" class="metric-description">
          {{ metric.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 定义接口
interface MetricTag {
  text: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

interface MetricComparison {
  value: number
  label?: string
}

interface Metric {
  title: string
  value: number | string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  unit?: string
  prefix?: string
  suffix?: string
  precision?: number
  comparison?: MetricComparison
  trendData?: number[]
  tag?: MetricTag
  description?: string
  [key: string]: any
}

// 定义组件属性
const props = defineProps<{
  // 指标数据
  metrics: Metric[]
  // 面板标题
  title?: string
  // 是否显示趋势图
  showTrend?: boolean
  // 是否显示比较数据
  showComparison?: boolean
  // 是否颜色编码
  colorCoded?: boolean
  // 是否启用动画
  animation?: boolean
  // 图表高度
  chartHeight?: number
  // 小型图表高度
  smallChartHeight?: number
}>()

// 定义默认值
const defaultProps = {
  showTrend: true,
  showComparison: true,
  colorCoded: true,
  animation: true,
  chartHeight: 120,
  smallChartHeight: 60,
}

// 合并默认值
const mergedProps = { ...defaultProps, ...props }

// 响应式数据
const trendChartRef = ref<HTMLElement | null>(null)
const trendChartRefs = ref<(HTMLElement | null)[]>([])
const charts: echarts.ECharts[] = []

// 监听指标变化
watch(
  () => props.metrics,
  () => {
    nextTick(() => {
      initCharts()
    })
  },
  { deep: true }
)

// 生命周期钩子
onMounted(() => {
  initCharts()
})

onBeforeUnmount(() => {
  destroyCharts()
})

// 初始化图表
const initCharts = () => {
  destroyCharts()

  if (!mergedProps.showTrend) return

  // 单指标模式
  if (props.metrics.length === 1 && trendChartRef.value) {
    const chart = initSingleChart(trendChartRef.value, props.metrics[0])
    if (chart) charts.push(chart)
  }
  // 多指标模式
  else {
    props.metrics.forEach((metric, index) => {
      if (metric.trendData && trendChartRefs.value[index]) {
        const chart = initSingleChart(trendChartRefs.value[index]!, metric)
        if (chart) charts.push(chart)
      }
    })
  }
}

// 初始化单个图表
const initSingleChart = (container: HTMLElement, metric: Metric): echarts.ECharts | null => {
  if (!metric.trendData || metric.trendData.length === 0) return null

  const chart = echarts.init(container)

  const option = {
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#909399',
          width: 1,
          type: 'dashed',
        },
      },
      formatter: (params: any) => {
        return `${metric.title}: ${params[0].value}`
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: metric.trendData.map((_, index) => index + 1),
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        type: 'line',
        data: metric.trendData,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: getTrendColor(metric),
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: `${getTrendColor(metric)}40`, // 半透明颜色
              },
              {
                offset: 1,
                color: `${getTrendColor(metric)}00`, // 完全透明
              },
            ],
          },
        },
        animationDuration: mergedProps.animation ? 1000 : 0,
      },
    ],
  }

  chart.setOption(option)

  // 监听窗口大小变化
  window.addEventListener('resize', () => chart.resize())

  return chart
}

// 销毁图表
const destroyCharts = () => {
  charts.forEach(chart => {
    chart.dispose()
  })
  charts.length = 0
}

// 获取趋势颜色
const getTrendColor = (metric: Metric): string => {
  if (metric.type) {
    const colorMap: Record<string, string> = {
      primary: '#409eff',
      success: '#67c23a',
      warning: '#e6a23c',
      danger: '#f56c6c',
      info: '#909399',
    }
    return colorMap[metric.type] || '#409eff'
  }

  return isUpTrend(metric) ? '#67c23a' : '#f56c6c'
}

// 格式化值
const formatValue = (metric: Metric): string => {
  const { value } = metric
  const precision = metric.precision ?? 0

  let formattedValue = ''

  if (typeof value === 'number') {
    // 格式化数字
    formattedValue = value.toFixed(precision)
  } else {
    formattedValue = String(value)
  }

  // 添加前缀和后缀
  return `${metric.prefix || ''}${formattedValue}${metric.suffix || ''}${metric.unit || ''}`
}

// 判断是否为上升趋势
const isUpTrend = (metric: Metric): boolean => {
  if (!metric.comparison) return false
  return metric.comparison.value > 0
}

// 判断是否为下降趋势
const isDownTrend = (metric: Metric): boolean => {
  if (!metric.comparison) return false
  return metric.comparison.value < 0
}
</script>

<style lang="scss" scoped>
.stat-panel {
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &.with-animation {
    .metric-value {
      animation: valueFadeIn 0.6s ease-out;
    }
  }

  &.color-coded {
    .metric-primary {
      --metric-color: #409eff;
    }

    .metric-success {
      --metric-color: #67c23a;
    }

    .metric-warning {
      --metric-color: #e6a23c;
    }

    .metric-danger {
      --metric-color: #f56c6c;
    }

    .metric-info {
      --metric-color: #909399;
    }
  }

  // 面板标题
  .panel-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;

    .title-text {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  // 单指标模式
  .single-metric {
    .metric-item {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
      background-color: #fafafa;
      border-radius: 8px;

      .metric-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
      }

      .metric-title {
        display: flex;
        align-items: center;
        gap: 8px;

        .title {
          font-size: 18px;
          font-weight: 500;
          color: #606266;
        }

        .metric-tag {
          margin: 0;
        }
      }

      .metric-value-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;

        .metric-value {
          font-size: 32px;
          font-weight: 600;
          color: #303133;
          line-height: 1;
          transition: all 0.3s ease;

          &.up-trend {
            color: #67c23a;
          }

          &.down-trend {
            color: #f56c6c;
          }

          .color-coded & {
            color: var(--metric-color);
          }
        }

        .metric-comparison {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;

          &:has(.el-icon-arrow-up) {
            color: #67c23a;
          }

          &:has(.el-icon-arrow-down) {
            color: #f56c6c;
          }

          .comparison-label {
            font-size: 12px;
            color: #909399;
            margin-left: 4px;
          }
        }
      }

      .metric-trend {
        width: 100%;

        .trend-chart {
          width: 100%;
          min-height: 120px;
        }
      }

      .metric-description {
        font-size: 14px;
        color: #909399;
        line-height: 1.5;
      }
    }
  }

  // 多指标模式
  .multi-metric {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;

    .metric-item {
      background-color: #fafafa;
      border-radius: 8px;
      padding: 16px;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: 12px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .metric-title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
          font-size: 14px;
          color: #606266;
          font-weight: 500;
        }

        .metric-tag {
          margin: 0;
        }
      }

      .metric-value-container {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 8px;

        .metric-value {
          font-size: 24px;
          font-weight: 600;
          color: #303133;
          line-height: 1;
          transition: all 0.3s ease;

          &.up-trend {
            color: #67c23a;
          }

          &.down-trend {
            color: #f56c6c;
          }

          .color-coded & {
            color: var(--metric-color);
          }
        }

        .metric-comparison {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;

          &:has(.el-icon-arrow-up) {
            color: #67c23a;
          }

          &:has(.el-icon-arrow-down) {
            color: #f56c6c;
          }
        }
      }

      .metric-trend {
        width: 100%;

        .trend-chart {
          width: 100%;
          min-height: 60px;

          &.small {
            min-height: 40px;
          }
        }
      }

      .metric-description {
        font-size: 12px;
        color: #909399;
        line-height: 1.4;
      }
    }
  }
}

// 值淡入动画
@keyframes valueFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .stat-panel {
    padding: 16px;

    .panel-title {
      padding-bottom: 12px;
    }

    .single-metric {
      .metric-item {
        padding: 16px;

        .metric-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .metric-value-container {
          align-items: flex-start;
        }

        .metric-value {
          font-size: 28px;
        }

        .trend-chart {
          min-height: 100px !important;
        }
      }
    }

    .multi-metric {
      grid-template-columns: 1fr;
      gap: 12px;

      .metric-item {
        padding: 12px;

        .metric-value {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
