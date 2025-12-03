<template>
  <div class="performance-monitor-demo">
    <el-card class="box-card">
      <div slot="header" class="card-header">
        <h2>性能监控仪表板</h2>
        <div class="header-actions">
          <el-button
            :type="isMonitoring ? 'danger' : 'primary'"
            @click="toggleMonitoring"
            :icon="isMonitoring ? 'el-icon-video-pause' : 'el-icon-video-play'"
          >
            {{ isMonitoring ? '停止监控' : '开始监控' }}
          </el-button>
          <el-button @click="generateReport" icon="el-icon-document">生成报告</el-button>
          <el-button @click="clearData" icon="el-icon-delete">清空数据</el-button>
        </div>
      </div>

      <!-- 实时性能指标 -->
      <div class="metrics-grid">
        <div class="metric-card" v-for="metric in realTimeMetrics" :key="metric.key">
          <div class="metric-header">
            <span class="metric-name">{{ metric.name }}</span>
            <el-tag :type="getRatingType(metric.rating)" size="small">{{ metric.rating }}</el-tag>
          </div>
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-unit">{{ metric.unit }}</div>
        </div>
      </div>

      <!-- 测试功能区域 -->
      <div class="test-section">
        <h3>性能测试工具</h3>
        <div class="test-buttons">
          <el-button @click="testLargeDataRender" icon="el-icon-data-line"
            >大数据渲染测试</el-button
          >
          <el-button @click="testNetworkDelay" icon="el-icon-link">网络延迟测试</el-button>
          <el-button @click="testMemoryUsage" icon="el-icon-cpu">内存使用测试</el-button>
          <el-button @click="testComponentRender" icon="el-icon-view">组件渲染测试</el-button>
        </div>
      </div>

      <!-- 性能图表 -->
      <div class="charts-section">
        <h3>性能趋势图表</h3>
        <div class="charts-container">
          <div class="chart-item">
            <h4>页面加载时间趋势</h4>
            <div class="chart-placeholder">
              <el-progress :percentage="pageLoadProgress" :stroke-width="18" />
              <div class="chart-label">平均加载时间: {{ averagePageLoadTime }}ms</div>
            </div>
          </div>
          <div class="chart-item">
            <h4>资源加载分析</h4>
            <div class="resource-stats">
              <div class="resource-item">
                <span>JS文件</span>
                <el-progress :percentage="jsResourcePercentage" status="success" />
              </div>
              <div class="resource-item">
                <span>CSS文件</span>
                <el-progress :percentage="cssResourcePercentage" status="success" />
              </div>
              <div class="resource-item">
                <span>图片资源</span>
                <el-progress :percentage="imageResourcePercentage" status="success" />
              </div>
              <div class="resource-item">
                <span>API请求</span>
                <el-progress :percentage="apiResourcePercentage" status="success" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细数据表格 -->
      <div class="data-section">
        <h3>详细性能数据</h3>
        <el-table :data="performanceData" height="400">
          <el-table-column prop="timestamp" label="时间" width="180">
            <template slot-scope="scope">
              {{ formatTime(scope.row.timestamp) }}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="120">
            <template slot-scope="scope">
              <el-tag :type="getTypeTagType(scope.row.type)">{{ scope.row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="指标名称" width="200" />
          <el-table-column prop="value" label="数值" width="120">
            <template slot-scope="scope">
              {{ scope.row.value.toFixed(2) }}{{ getUnit(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="rating" label="评级" width="100">
            <template slot-scope="scope">
              <el-tag :type="getRatingType(scope.row.rating)">{{ scope.row.rating }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="页面URL" min-width="200" show-overflow-tooltip />
        </el-table>
      </div>

      <!-- 错误监控 -->
      <div class="error-section">
        <h3>错误监控</h3>
        <el-alert
          v-if="errors.length === 0"
          title="暂无错误记录"
          type="success"
          :closable="false"
          show-icon
        />
        <div v-else class="error-list">
          <el-alert
            v-for="error in errors"
            :key="error.id"
            :title="error.metadata.message"
            :description="error.metadata.filename + ':' + error.metadata.lineno"
            type="error"
            :closable="true"
            @close="removeError(error.id)"
            show-icon
            class="error-item"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'
import { performanceMonitor } from '@/utils/performance-monitor'
import logger from '@/utils/logger'

export default {
  name: 'PerformanceMonitorDemo',
  data() {
    return {
      isMonitoring: false,
      performanceData: [],
      errors: [],
      realTimeMetrics: [
        {
          key: 'lcp',
          name: 'Largest Contentful Paint',
          value: 0,
          rating: 'unknown',
          unit: 'ms',
        },
        {
          key: 'fid',
          name: 'First Input Delay',
          value: 0,
          rating: 'unknown',
          unit: 'ms',
        },
        {
          key: 'cls',
          name: 'Cumulative Layout Shift',
          value: 0,
          rating: 'unknown',
          unit: '',
        },
        {
          key: 'ttfb',
          name: 'Time to First Byte',
          value: 0,
          rating: 'unknown',
          unit: 'ms',
        },
        {
          key: 'fcp',
          name: 'First Contentful Paint',
          value: 0,
          rating: 'unknown',
          unit: 'ms',
        },
        {
          key: 'domReady',
          name: 'DOM Ready Time',
          value: 0,
          rating: 'unknown',
          unit: 'ms',
        },
      ],
      pageLoadProgress: 0,
      averagePageLoadTime: 0,
      resourceStats: {
        js: 0,
        css: 0,
        image: 0,
        api: 0,
      },
    }
  },
  computed: {
    jsResourcePercentage() {
      return Math.round((this.resourceStats.js / 100) * 100)
    },
    cssResourcePercentage() {
      return Math.round((this.resourceStats.css / 100) * 100)
    },
    imageResourcePercentage() {
      return Math.round((this.resourceStats.image / 100) * 100)
    },
    apiResourcePercentage() {
      return Math.round((this.resourceStats.api / 100) * 100)
    },
  },
  mounted() {
    this.initPerformanceMonitor()
    this.setupPerformanceSubscriptions()
  },
  beforeDestroy() {
    if (this.isMonitoring) {
      this.stopMonitoring()
    }
  },
  methods: {
    initPerformanceMonitor() {
      // 初始化监控
      if (process.env.NODE_ENV === 'development') {
        logger.debug('初始化性能监控系统...')
      }
    },

    setupPerformanceSubscriptions() {
      // 订阅不同类型的性能指标
      const subscriptions = [
        { type: 'largest-contentful-paint', callback: this.handleLCP },
        { type: 'first-input-delay', callback: this.handleFID },
        { type: 'layout-shift-score', callback: this.handleCLS },
        { type: 'navigation', callback: this.handleNavigation },
        { type: 'resource', callback: this.handleResource },
        { type: 'error', callback: this.handleError },
      ]

      subscriptions.forEach(sub => {
        performanceMonitor.subscribe(sub.type, sub.callback)
      })
    },

    toggleMonitoring() {
      this.isMonitoring = !this.isMonitoring
      if (this.isMonitoring) {
        this.startMonitoring()
      } else {
        this.stopMonitoring()
      }
    },

    startMonitoring() {
      // 开始监控时的初始化
      performanceMonitor.mark('monitoring-start')
      this.$message.success('性能监控已开始')
    },

    stopMonitoring() {
      performanceMonitor.mark('monitoring-stop')
      this.$message.info('性能监控已停止')
    },

    generateReport() {
      const report = performanceMonitor.getPerformanceReport()
      if (process.env.NODE_ENV === 'development') {
        logger.debug('性能报告:', report)
      }
      this.$message.success('性能报告已生成，请查看控制台')
    },

    clearData() {
      this.performanceData = []
      this.errors = []
      this.$message.success('数据已清空')
    },

    // 性能指标处理器
    handleLCP(metric) {
      this.updateRealTimeMetric('lcp', metric.value, metric.rating)
      this.performanceData.unshift(metric)
    },

    handleFID(metric) {
      this.updateRealTimeMetric('fid', metric.value, metric.rating)
      this.performanceData.unshift(metric)
    },

    handleCLS(metric) {
      this.updateRealTimeMetric('cls', metric.value, metric.rating)
      this.performanceData.unshift(metric)
    },

    handleNavigation(metric) {
      this.updateRealTimeMetric(
        'ttfb',
        metric.metadata.ttfb,
        this.getTTFBRating(metric.metadata.ttfb)
      )
      this.updateRealTimeMetric(
        'domReady',
        metric.metadata.domReadyTime,
        this.getDomReadyRating(metric.metadata.domReadyTime)
      )

      this.averagePageLoadTime = Math.round(metric.value)
      this.pageLoadProgress = Math.min((metric.value / 3000) * 100, 100)

      this.performanceData.unshift(metric)
    },

    handleResource(metric) {
      // 统计资源类型
      const { initiatorType } = metric.metadata
      if (initiatorType === 'script') {
        this.resourceStats.js += metric.value
      } else if (initiatorType === 'css') {
        this.resourceStats.css += metric.value
      } else if (initiatorType === 'img') {
        this.resourceStats.image += metric.value
      } else if (initiatorType === 'xmlhttprequest' || initiatorType === 'fetch') {
        this.resourceStats.api += metric.value
      }

      this.performanceData.unshift(metric)
    },

    handleError(metric) {
      this.errors.unshift(metric)
    },

    updateRealTimeMetric(key, value, rating) {
      const metric = this.realTimeMetrics.find(m => m.key === key)
      if (metric) {
        metric.value = Math.round(value)
        metric.rating = rating
      }
    },

    // 测试方法
    async testLargeDataRender() {
      this.$message.info('开始大数据渲染测试...')
      performanceMonitor.mark('large-data-test-start')

      // 模拟大数据渲染
      const largeArray = new Array(10000).fill(0).map((_, index) => ({
        id: index,
        name: `Item ${index}`,
        value: Math.random() * 1000,
      }))

      // 模拟DOM操作
      await this.$nextTick()
      performanceMonitor.mark('large-data-test-end')
      performanceMonitor.measure(
        'large-data-render',
        'large-data-test-start',
        'large-data-test-end'
      )

      this.$message.success('大数据渲染测试完成')
    },

    async testNetworkDelay() {
      this.$message.info('开始网络延迟测试...')
      performanceMonitor.mark('network-test-start')

      try {
        await performanceMonitor.monitorRequest('/api/test-delay', {
          method: 'GET',
        })
        this.$message.success('网络延迟测试完成')
      } catch (error) {
        this.$message.error(`网络测试失败: ${error.message}`)
      }
    },

    async testMemoryUsage() {
      this.$message.info('开始内存使用测试...')
      performanceMonitor.mark('memory-test-start')

      // 模拟内存消耗
      const largeData = new Array(100000).fill(0).map(() => ({
        data: new Array(100).fill('x'.repeat(50)),
      }))

      await new Promise(resolve => setTimeout(resolve, 100))

      performanceMonitor.mark('memory-test-end')
      performanceMonitor.measure('memory-usage', 'memory-test-start', 'memory-test-end')

      // 清理内存
      largeData.length = 0

      this.$message.success('内存使用测试完成')
    },

    testComponentRender() {
      this.$message.info('开始组件渲染测试...')
      performanceMonitor.mark('component-test-start')

      // 动态创建组件测试
      const ComponentClass = Vue.extend({
        template: '<div>Test Component {{ message }}</div>',
        data() {
          return {
            message: 'Hello World',
          }
        },
        mounted() {
          performanceMonitor.mark('component-test-render-end')
          performanceMonitor.measure(
            'component-render',
            'component-test-start',
            'component-test-render-end'
          )
        },
      })

      const component = new ComponentClass()
      component.$mount()

      this.$message.success('组件渲染测试完成')
    },

    // 工具方法
    getRatingType(rating) {
      const typeMap = {
        good: 'success',
        'needs-improvement': 'warning',
        poor: 'danger',
        unknown: 'info',
      }
      return typeMap[rating] || 'info'
    },

    getTypeTagType(type) {
      const typeMap = {
        'largest-contentful-paint': 'primary',
        'first-input-delay': 'success',
        'layout-shift-score': 'warning',
        navigation: 'info',
        resource: 'success',
        error: 'danger',
      }
      return typeMap[type] || 'info'
    },

    getUnit(type) {
      const unitMap = {
        'largest-contentful-paint': 'ms',
        'first-input-delay': 'ms',
        'layout-shift-score': '',
        navigation: 'ms',
        resource: 'ms',
        error: '',
      }
      return unitMap[type] || ''
    },

    getTTFBRating(value) {
      if (value <= 200) return 'good'
      if (value <= 500) return 'needs-improvement'
      return 'poor'
    },

    getDomReadyRating(value) {
      if (value <= 1000) return 'good'
      if (value <= 2000) return 'needs-improvement'
      return 'poor'
    },

    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString()
    },

    removeError(errorId) {
      this.errors = this.errors.filter(error => error.id !== errorId)
    },
  },
}
</script>

<style scoped>
.performance-monitor-demo {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.metric-name {
  font-size: 14px;
  color: #606266;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 8px 0 4px;
}

.metric-unit {
  font-size: 12px;
  color: #909399;
}

.test-section {
  margin: 24px 0;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.test-buttons {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.charts-section {
  margin: 24px 0;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 16px;
}

.chart-item {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
}

.chart-placeholder {
  text-align: center;
  margin: 16px 0;
}

.chart-label {
  margin-top: 8px;
  font-size: 14px;
  color: #606266;
}

.resource-stats {
  margin-top: 16px;
}

.resource-item {
  display: flex;
  align-items: center;
  margin: 12px 0;
}

.resource-item span {
  width: 80px;
  font-size: 14px;
  color: #606266;
}

.resource-item .el-progress {
  flex: 1;
  margin-left: 16px;
}

.data-section {
  margin: 24px 0;
}

.error-section {
  margin: 24px 0;
}

.error-list {
  max-height: 200px;
  overflow-y: auto;
}

.error-item {
  margin: 8px 0;
}

@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }

  .test-buttons {
    flex-direction: column;
  }

  .header-actions {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
