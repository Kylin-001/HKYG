<template>
  <div class="user-stats">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>用户统计</h2>
        <span class="subtitle">分析平台的用户数据</span>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <el-card class="stats-card">
      <div class="stats-grid">
        <el-statistic title="总用户数" :value="totalUsers">
          <template #suffix>
            <el-progress :percentage="userGrowth" :color="userGrowth > 0 ? '#67c23a' : '#f56c6c'" />
          </template>
        </el-statistic>
        <el-statistic title="新增用户数" :value="newUsers">
          <template #suffix>
            <el-progress
              :percentage="newUserGrowth"
              :color="newUserGrowth > 0 ? '#67c23a' : '#f56c6c'"
            />
          </template>
        </el-statistic>
        <el-statistic title="活跃用户数" :value="activeUsers">
          <template #suffix>
            <el-progress
              :percentage="activeUserGrowth"
              :color="activeUserGrowth > 0 ? '#67c23a' : '#f56c6c'"
            />
          </template>
        </el-statistic>
        <el-statistic title="用户留存率" :value="retentionRate" :precision="2" suffix="%">
          <template #suffix>
            <el-progress
              :percentage="retentionRate"
              :color="retentionRate > 50 ? '#67c23a' : '#e6a23c'"
            />
          </template>
        </el-statistic>
      </div>
    </el-card>

    <!-- 筛选区域 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterParams" class="filter-form">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterParams.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="dateShortcuts"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="filterParams.userType" placeholder="请选择用户类型" clearable>
            <el-option label="全部" value="" />
            <el-option label="普通用户" value="normal" />
            <el-option label="VIP用户" value="vip" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="注册渠道">
          <el-select v-model="filterParams.registerChannel" placeholder="请选择注册渠道" clearable>
            <el-option label="全部" value="" />
            <el-option label="网站注册" value="website" />
            <el-option label="移动端注册" value="mobile" />
            <el-option label="第三方登录" value="third_party" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshRight /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图表区域 -->
    <div class="chart-container">
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>用户增长趋势</span>
            <el-select v-model="chartType" placeholder="图表类型">
              <el-option label="折线图" value="line" />
              <el-option label="柱状图" value="bar" />
            </el-select>
          </div>
        </template>
        <div class="chart-wrapper">
          <div ref="userGrowthChart" class="chart" style="width: 100%; height: 400px"></div>
        </div>
      </el-card>

      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>用户分布</span>
            <el-select v-model="distributionType" placeholder="分布类型">
              <el-option label="用户类型分布" value="type" />
              <el-option label="注册渠道分布" value="channel" />
              <el-option label="地区分布" value="region" />
            </el-select>
          </div>
        </template>
        <div class="chart-wrapper">
          <div ref="userDistributionChart" class="chart" style="width: 100%; height: 400px"></div>
        </div>
      </el-card>
    </div>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="table-header">
          <span>用户统计详情</span>
          <el-select v-model="tableViewType" placeholder="视图类型">
            <el-option label="按日期统计" value="date" />
            <el-option label="按用户类型统计" value="type" />
            <el-option label="按注册渠道统计" value="channel" />
          </el-select>
        </div>
      </template>
      <div class="table-wrapper">
        <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
          <el-table-column v-if="tableViewType === 'date'" prop="date" label="日期" width="120" />
          <el-table-column
            v-else-if="tableViewType === 'type'"
            prop="userType"
            label="用户类型"
            width="120"
          />
          <el-table-column
            v-else-if="tableViewType === 'channel'"
            prop="registerChannel"
            label="注册渠道"
            width="120"
          />
          <el-table-column prop="totalUsers" label="总用户数" width="100" />
          <el-table-column prop="newUsers" label="新增用户数" width="100" />
          <el-table-column prop="activeUsers" label="活跃用户数" width="100" />
          <el-table-column
            prop="activeRate"
            label="活跃率(%)"
            width="100"
            :formatter="row => (row.activeRate * 100).toFixed(2)"
          />
          <el-table-column
            prop="retentionRate"
            label="留存率(%)"
            width="100"
            :formatter="row => (row.retentionRate * 100).toFixed(2)"
          />
          <el-table-column
            prop="avgStayTime"
            label="平均停留时长(min)"
            width="120"
            :formatter="row => row.avgStayTime.toFixed(2)"
          />
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { Download, Refresh, Search, RefreshRight } from '@element-plus/icons-vue'

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近90天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
  {
    text: '今年',
    value: () => {
      const end = new Date()
      const start = new Date(new Date().getFullYear(), 0, 1)
      return [start, end]
    },
  },
]

// 筛选参数
const filterParams = reactive({
  dateRange: [] as string[],
  userType: '',
  registerChannel: '',
})

// 图表类型
const chartType = ref('line')
const distributionType = ref('type')
const tableViewType = ref('date')

// 统计数据
const totalUsers = ref(12580)
const newUsers = ref(1250)
const activeUsers = ref(8560)
const retentionRate = ref(68.05)
const userGrowth = ref(12.5)
const newUserGrowth = ref(8.3)
const activeUserGrowth = ref(5.2)

// 表格数据
const loading = ref(false)
const total = ref(100)
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
})

const tableData = ref([
  {
    date: '2026-01-01',
    totalUsers: 11200,
    newUsers: 85,
    activeUsers: 7800,
    activeRate: 0.696,
    retentionRate: 0.65,
    avgStayTime: 15.2,
  },
  {
    date: '2026-01-02',
    totalUsers: 11300,
    newUsers: 100,
    activeUsers: 7950,
    activeRate: 0.704,
    retentionRate: 0.66,
    avgStayTime: 14.8,
  },
  {
    date: '2026-01-03',
    totalUsers: 11450,
    newUsers: 150,
    activeUsers: 8100,
    activeRate: 0.707,
    retentionRate: 0.67,
    avgStayTime: 15.5,
  },
  {
    date: '2026-01-04',
    totalUsers: 11600,
    newUsers: 150,
    activeUsers: 8250,
    activeRate: 0.711,
    retentionRate: 0.68,
    avgStayTime: 16.2,
  },
  {
    date: '2026-01-05',
    totalUsers: 11800,
    newUsers: 200,
    activeUsers: 8400,
    activeRate: 0.712,
    retentionRate: 0.69,
    avgStayTime: 15.8,
  },
  {
    date: '2026-01-06',
    totalUsers: 12000,
    newUsers: 200,
    activeUsers: 8550,
    activeRate: 0.713,
    retentionRate: 0.7,
    avgStayTime: 16.5,
  },
  {
    date: '2026-01-07',
    totalUsers: 12200,
    newUsers: 200,
    activeUsers: 8700,
    activeRate: 0.713,
    retentionRate: 0.71,
    avgStayTime: 17.0,
  },
  {
    date: '2026-01-08',
    totalUsers: 12580,
    newUsers: 380,
    activeUsers: 8950,
    activeRate: 0.712,
    retentionRate: 0.72,
    avgStayTime: 16.8,
  },
])

// 图表实例
let userGrowthChartInstance: echarts.ECharts | null = null
let userDistributionChartInstance: echarts.ECharts | null = null

// 图表DOM引用
const userGrowthChart = ref<HTMLElement | null>(null)
const userDistributionChart = ref<HTMLElement | null>(null)

// 初始化图表
const initUserGrowthChart = () => {
  if (!userGrowthChartInstance && userGrowthChart.value) {
    userGrowthChartInstance = echarts.init(userGrowthChart.value)
  }

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['总用户数', '新增用户数', '活跃用户数'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['1月1日', '1月2日', '1月3日', '1月4日', '1月5日', '1月6日', '1月7日', '1月8日'],
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '用户数',
        min: 0,
        max: 15000,
        interval: 3000,
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: [
      {
        name: '总用户数',
        type: chartType.value,
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: [11200, 11300, 11450, 11600, 11800, 12000, 12200, 12580],
      },
      {
        name: '新增用户数',
        type: chartType.value,
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: [85, 100, 150, 150, 200, 200, 200, 380],
      },
      {
        name: '活跃用户数',
        type: chartType.value,
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: [7800, 7950, 8100, 8250, 8400, 8550, 8700, 8950],
      },
    ],
  }

  userGrowthChartInstance.setOption(option)
}

const initUserDistributionChart = () => {
  if (!userDistributionChartInstance && userDistributionChart.value) {
    userDistributionChartInstance = echarts.init(userDistributionChart.value)
  }

  let option: echarts.EChartsOption

  if (distributionType.value === 'type') {
    option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '用户类型分布',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 8500, name: '普通用户' },
            { value: 3500, name: 'VIP用户' },
            { value: 580, name: '管理员' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
  } else if (distributionType.value === 'channel') {
    option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '注册渠道分布',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 6500, name: '网站注册' },
            { value: 4500, name: '移动端注册' },
            { value: 1580, name: '第三方登录' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
  } else {
    option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '地区分布',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 3500, name: '黑龙江' },
            { value: 2500, name: '吉林' },
            { value: 2000, name: '辽宁' },
            { value: 1500, name: '北京' },
            { value: 1000, name: '上海' },
            { value: 2080, name: '其他地区' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
  }

  userDistributionChartInstance.setOption(option)
}

// 刷新图表
const refreshCharts = () => {
  initUserGrowthChart()
  initUserDistributionChart()
}

// 窗口大小变化时调整图表
const handleResize = () => {
  userGrowthChartInstance?.resize()
  userDistributionChartInstance?.resize()
}

// 查询数据
const handleSearch = () => {
  loading.value = true
  // 模拟API请求
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询成功')
  }, 500)
}

// 重置筛选条件
const handleReset = () => {
  Object.assign(filterParams, {
    dateRange: [],
    userType: '',
    registerChannel: '',
  })
}

// 导出数据
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 刷新数据
const handleRefresh = () => {
  loading.value = true
  // 模拟API请求
  setTimeout(() => {
    loading.value = false
    ElMessage.success('刷新成功')
    refreshCharts()
  }, 500)
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  handleSearch()
}

// 当前页变化
const handleCurrentChange = (current: number) => {
  pagination.currentPage = current
  handleSearch()
}

// 监听图表类型变化
watch(chartType, () => {
  initUserGrowthChart()
})

watch(distributionType, () => {
  initUserDistributionChart()
})

// 生命周期
onMounted(() => {
  // 初始化图表
  setTimeout(() => {
    initUserGrowthChart()
    initUserDistributionChart()
  }, 100)

  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)
})

// 组件卸载时清理
const beforeUnmount = () => {
  window.removeEventListener('resize', handleResize)
  userGrowthChartInstance?.dispose()
  userDistributionChartInstance?.dispose()
}
</script>

<style scoped lang="scss">
.user-stats {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .header-left {
    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #303133;
    }

    .subtitle {
      font-size: 14px;
      color: #909399;
      margin-left: 10px;
    }
  }

  .header-right {
    display: flex;
    gap: 10px;
  }
}

.stats-card {
  margin-bottom: 20px;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;

    .el-statistic {
      background-color: #fafafa;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
  }
}

.filter-card {
  margin-bottom: 20px;

  .filter-form {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .el-form-item {
      margin-bottom: 16px;
    }
  }
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
  }

  .chart-wrapper {
    margin-top: 20px;
  }
}

.table-card {
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
  }

  .table-wrapper {
    margin-top: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
