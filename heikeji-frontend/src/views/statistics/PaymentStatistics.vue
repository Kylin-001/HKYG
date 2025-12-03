<template>
  <div class="payment-statistics-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>支付数据统计与报表</h2>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-location"></i> 首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>支付统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" label-position="right" label-width="80px">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']"
            @change="handleDateRangeChange"
          />
        </el-form-item>

        <el-form-item label="支付方式">
          <el-select v-model="filterForm.paymentMethod" placeholder="全部">
            <el-option label="全部" value="" />
            <el-option label="微信支付" value="WECHAT_PAY" />
            <el-option label="支付宝" value="ALIPAY" />
            <el-option label="余额支付" value="BALANCE" />
          </el-select>
        </el-form-item>

        <el-form-item label="支付状态">
          <el-select v-model="filterForm.paymentStatus" placeholder="全部">
            <el-option label="全部" value="" />
            <el-option label="已支付" :value="1" />
            <el-option label="未支付" :value="0" />
            <el-option label="已退款" :value="2" />
            <el-option label="支付失败" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="info" @click="handleExport">导出报表</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 统计总览卡片 -->
    <div class="overview-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="overview-card success-card">
            <div class="card-content">
              <div class="card-title">总交易额</div>
              <div class="card-value">¥{{ totalAmount.toFixed(2) }}</div>
              <div class="card-info">
                <span :class="{ 'text-green': amountTrend > 0, 'text-red': amountTrend < 0 }">
                  {{ amountTrend > 0 ? '+' : '' }}{{ amountTrend.toFixed(2) }}%
                </span>
                <span class="info-text">较上期</span>
              </div>
            </div>
            <div class="card-icon">
              <i class="el-icon-wallet"></i>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="overview-card primary-card">
            <div class="card-content">
              <div class="card-title">支付订单数</div>
              <div class="card-value">{{ totalOrders }}</div>
              <div class="card-info">
                <span :class="{ 'text-green': orderTrend > 0, 'text-red': orderTrend < 0 }">
                  {{ orderTrend > 0 ? '+' : '' }}{{ orderTrend.toFixed(2) }}%
                </span>
                <span class="info-text">较上期</span>
              </div>
            </div>
            <div class="card-icon">
              <i class="el-icon-document"></i>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="overview-card warning-card">
            <div class="card-content">
              <div class="card-title">支付成功率</div>
              <div class="card-value">{{ successRate.toFixed(2) }}%</div>
              <div class="card-info">
                <span
                  :class="{ 'text-green': successRateTrend > 0, 'text-red': successRateTrend < 0 }"
                >
                  {{ successRateTrend > 0 ? '+' : '' }}{{ successRateTrend.toFixed(2) }}%
                </span>
                <span class="info-text">较上期</span>
              </div>
            </div>
            <div class="card-icon">
              <i class="el-icon-check"></i>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="overview-card danger-card">
            <div class="card-content">
              <div class="card-title">退款金额</div>
              <div class="card-value">¥{{ refundAmount.toFixed(2) }}</div>
              <div class="card-info">
                <span class="info-text">退款率: {{ refundRate.toFixed(2) }}%</span>
              </div>
            </div>
            <div class="card-icon">
              <i class="el-icon-refresh-left"></i>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 图表区域 -->
    <div class="chart-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="chart-card">
            <div slot="header" class="card-header">
              <span>支付趋势图</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="line">折线图</el-radio-button>
                <el-radio-button label="bar">柱状图</el-radio-button>
              </el-radio-group>
            </div>
            <div ref="trendChart" class="chart-container"></div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="chart-card">
            <div slot="header" class="card-header">
              <span>支付方式分布</span>
            </div>
            <div ref="paymentMethodChart" class="chart-container"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <el-card class="table-card">
        <div slot="header" class="card-header">
          <span>支付明细列表</span>
        </div>

        <el-table
          v-loading="loading"
          :data="paymentRecords"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="paymentId" label="支付ID" width="180" />
          <el-table-column prop="orderId" label="订单ID" width="180" />
          <el-table-column prop="amount" label="支付金额" width="120" align="right">
            <template slot-scope="scope">¥{{ scope.row.amount.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="paymentMethod" label="支付方式" width="120">
            <template slot-scope="scope">
              <el-tag :type="getPaymentMethodTagType(scope.row.paymentMethod)">
                {{ getPaymentMethodText(scope.row.paymentMethod) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="支付状态" width="100">
            <template slot-scope="scope">
              <el-tag :type="getStatusTagType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="payTime" label="支付时间" width="180">
            <template slot-scope="scope">
              {{ formatDateTime(scope.row.payTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="transactionId" label="交易流水号" width="200" />
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="handleViewDetail(scope.row)"
                v-if="scope.row.status === 1"
              >
                查看详情
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="handleViewRefund(scope.row)"
                v-if="scope.row.hasRefund"
              >
                查看退款
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog title="支付详情" :visible.sync="detailDialogVisible" width="600px">
      <div class="detail-content" v-if="currentPayment">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="支付ID">{{ currentPayment.paymentId }}</el-descriptions-item>
          <el-descriptions-item label="订单ID">{{ currentPayment.orderId }}</el-descriptions-item>
          <el-descriptions-item label="支付金额"
            >¥{{ currentPayment.amount.toFixed(2) }}</el-descriptions-item
          >
          <el-descriptions-item label="支付方式">{{
            getPaymentMethodText(currentPayment.paymentMethod)
          }}</el-descriptions-item>
          <el-descriptions-item label="支付状态">{{
            getStatusText(currentPayment.status)
          }}</el-descriptions-item>
          <el-descriptions-item label="支付时间">{{
            formatDateTime(currentPayment.payTime)
          }}</el-descriptions-item>
          <el-descriptions-item label="交易流水号">{{
            currentPayment.transactionId
          }}</el-descriptions-item>
          <el-descriptions-item label="支付IP">{{ currentPayment.payIp }}</el-descriptions-item>
          <el-descriptions-item label="客户端信息">{{
            currentPayment.clientInfo
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import * as echarts from 'echarts'
import { formatDateTime } from '@/utils/date-utils'

export default {
  name: 'PaymentStatistics',
  data() {
    return {
      // 筛选条件
      filterForm: {
        dateRange: [],
        paymentMethod: '',
        paymentStatus: '',
      },

      // 表格数据
      paymentRecords: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: false,
      selectedRows: [],

      // 统计数据
      totalAmount: 0,
      totalOrders: 0,
      successRate: 0,
      refundAmount: 0,
      refundRate: 0,
      amountTrend: 0,
      orderTrend: 0,
      successRateTrend: 0,

      // 图表配置
      chartType: 'line',
      trendChart: null,
      paymentMethodChart: null,

      // 弹窗状态
      detailDialogVisible: false,
      currentPayment: null,
    }
  },

  mounted() {
    // 初始化默认时间范围（最近7天）
    this.initDefaultDateRange()
    // 加载数据
    this.loadStatisticsData()
    // 初始化图表
    this.$nextTick(() => {
      this.initTrendChart()
      this.initPaymentMethodChart()
    })
  },

  beforeDestroy() {
    // 销毁图表实例
    if (this.trendChart) {
      this.trendChart.dispose()
    }
    if (this.paymentMethodChart) {
      this.paymentMethodChart.dispose()
    }
  },

  methods: {
    // 初始化默认时间范围
    initDefaultDateRange() {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 6) // 最近7天

      this.filterForm.dateRange = [
        start.toISOString().split('T')[0],
        end.toISOString().split('T')[0],
      ]
    },

    // 处理日期范围变化
    handleDateRangeChange() {
      this.currentPage = 1
      this.loadStatisticsData()
    },

    // 处理查询
    handleQuery() {
      this.currentPage = 1
      this.loadStatisticsData()
    },

    // 处理重置
    handleReset() {
      this.filterForm = {
        dateRange: [],
        paymentMethod: '',
        paymentStatus: '',
      }
      this.initDefaultDateRange()
      this.currentPage = 1
      this.loadStatisticsData()
    },

    // 加载统计数据
    async loadStatisticsData() {
      this.loading = true
      try {
        // 获取统计概览数据
        const overviewRes = await this.getPaymentOverview()
        if (overviewRes && overviewRes.code === 200) {
          const { data } = overviewRes
          this.totalAmount = data.totalAmount || 0
          this.totalOrders = data.totalOrders || 0
          this.successRate = data.successRate || 0
          this.refundAmount = data.refundAmount || 0
          this.refundRate = data.refundRate || 0
          this.amountTrend = data.amountTrend || 0
          this.orderTrend = data.orderTrend || 0
          this.successRateTrend = data.successRateTrend || 0
        }

        // 获取支付明细数据
        await this.loadPaymentRecords()

        // 获取图表数据
        await this.loadChartData()
      } catch (error) {
        console.error('加载统计数据失败:', error)
        this.$message.error('加载数据失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    // 获取支付概览数据
    async getPaymentOverview() {
      const params = this.getQueryParams()
      return request({
        url: '/statistics/payment/overview',
        method: 'get',
        params,
      })
    },

    // 加载支付记录
    async loadPaymentRecords() {
      const params = {
        ...this.getQueryParams(),
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      }

      const res = await request({
        url: '/payment/records',
        method: 'get',
        params,
      })

      if (res && res.code === 200) {
        this.paymentRecords = res.data.list || []
        this.total = res.data.total || 0
      }
    },

    // 加载图表数据
    async loadChartData() {
      // 获取趋势图数据
      const trendData = await this.getPaymentTrendData()
      if (trendData && trendData.code === 200) {
        this.updateTrendChart(trendData.data)
      }

      // 获取支付方式分布数据
      const methodData = await this.getPaymentMethodData()
      if (methodData && methodData.code === 200) {
        this.updatePaymentMethodChart(methodData.data)
      }
    },

    // 获取支付趋势数据
    async getPaymentTrendData() {
      const params = this.getQueryParams()
      return request({
        url: '/statistics/payment/trend',
        method: 'get',
        params,
      })
    },

    // 获取支付方式分布数据
    async getPaymentMethodData() {
      const params = this.getQueryParams()
      return request({
        url: '/statistics/payment/method',
        method: 'get',
        params,
      })
    },

    // 初始化趋势图
    initTrendChart() {
      const chartDom = this.$refs.trendChart
      if (chartDom) {
        this.trendChart = echarts.init(chartDom)
        this.trendChart.setOption({
          title: {
            text: '',
            left: 'center',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
          },
          legend: {
            data: ['交易额', '订单数'],
            top: 30,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
          },
          yAxis: [
            {
              type: 'value',
              name: '交易额',
              position: 'left',
            },
            {
              type: 'value',
              name: '订单数',
              position: 'right',
            },
          ],
          series: [
            {
              name: '交易额',
              type: 'line',
              yAxisIndex: 0,
              data: [],
              smooth: true,
              areaStyle: {
                opacity: 0.3,
              },
            },
            {
              name: '订单数',
              type: 'line',
              yAxisIndex: 1,
              data: [],
            },
          ],
        })
      }
    },

    // 更新趋势图
    updateTrendChart(data) {
      if (this.trendChart && data) {
        const option = this.trendChart.getOption()
        option.xAxis[0].data = data.labels || []
        option.series[0].type = this.chartType
        option.series[1].type = this.chartType
        option.series[0].data = data.amountData || []
        option.series[1].data = data.orderData || []
        this.trendChart.setOption(option)
      }
    },

    // 初始化支付方式分布图
    initPaymentMethodChart() {
      const chartDom = this.$refs.paymentMethodChart
      if (chartDom) {
        this.paymentMethodChart = echarts.init(chartDom)
        this.paymentMethodChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: [],
          },
          series: [
            {
              name: '支付方式',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
              },
              label: {
                show: false,
                position: 'center',
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '18',
                  fontWeight: 'bold',
                },
              },
              labelLine: {
                show: false,
              },
              data: [],
            },
          ],
        })
      }
    },

    // 更新支付方式分布图
    updatePaymentMethodChart(data) {
      if (this.paymentMethodChart && data) {
        const option = this.paymentMethodChart.getOption()
        option.legend[0].data = data.map(item => item.name)
        option.series[0].data = data
        this.paymentMethodChart.setOption(option)
      }
    },

    // 获取查询参数
    getQueryParams() {
      const params = {}

      if (this.filterForm.dateRange && this.filterForm.dateRange.length === 2) {
        params.startDate = this.filterForm.dateRange[0]
        params.endDate = this.filterForm.dateRange[1]
      }

      if (this.filterForm.paymentMethod) {
        params.paymentMethod = this.filterForm.paymentMethod
      }

      if (this.filterForm.paymentStatus !== '') {
        params.status = this.filterForm.paymentStatus
      }

      return params
    },

    // 处理图表类型切换
    handleChartTypeChange() {
      this.loadChartData()
    },

    // 获取支付方式文本
    getPaymentMethodText(method) {
      const methodMap = {
        WECHAT_PAY: '微信支付',
        ALIPAY: '支付宝',
        BALANCE: '余额支付',
      }
      return methodMap[method] || '其他'
    },

    // 获取支付方式标签类型
    getPaymentMethodTagType(method) {
      const typeMap = {
        WECHAT_PAY: 'success',
        ALIPAY: 'primary',
        BALANCE: 'warning',
      }
      return typeMap[method] || 'info'
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        0: '未支付',
        1: '已支付',
        2: '已退款',
        3: '支付失败',
      }
      return statusMap[status] || '未知'
    },

    // 获取状态标签类型
    getStatusTagType(status) {
      const typeMap = {
        0: 'info',
        1: 'success',
        2: 'warning',
        3: 'danger',
      }
      return typeMap[status] || 'default'
    },

    // 格式化日期时间
    formatDateTime(time) {
      return formatDateTime(time)
    },

    // 处理表格选择
    handleSelectionChange(rows) {
      this.selectedRows = rows
    },

    // 处理分页大小变化
    handleSizeChange(size) {
      this.pageSize = size
      this.loadPaymentRecords()
    },

    // 处理当前页变化
    handleCurrentChange(current) {
      this.currentPage = current
      this.loadPaymentRecords()
    },

    // 处理查看详情
    handleViewDetail(row) {
      this.currentPayment = row
      this.detailDialogVisible = true
    },

    // 处理查看退款
    handleViewRefund(row) {
      this.$router.push({
        path: '/order/refund/detail',
        query: { orderId: row.orderId },
      })
    },

    // 导出报表
    handleExport() {
      const params = this.getQueryParams()
      const queryStr = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&')
      window.open(`/api/v1/statistics/payment/export?${queryStr}`, '_blank')
    },
  },

  watch: {
    // 监听图表类型变化
    chartType() {
      this.handleChartTypeChange()
    },
  },
}
</script>

<style scoped>
.payment-statistics-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.filter-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.overview-section {
  margin-bottom: 20px;
}

.overview-card {
  position: relative;
  height: 140px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.card-content {
  position: relative;
  z-index: 1;
  padding: 20px;
}

.card-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.card-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}

.card-info {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.info-text {
  color: #909399;
  margin-left: 5px;
}

.card-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 60px;
  opacity: 0.1;
  color: currentColor;
}

.success-card {
  color: #67c23a;
}
.primary-card {
  color: #409eff;
}
.warning-card {
  color: #e6a23c;
}
.danger-card {
  color: #f56c6c;
}

.chart-section {
  margin-bottom: 20px;
}

.chart-card {
  height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  width: 100%;
  height: 320px;
}

.table-section {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.table-card {
  border: none;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.detail-content {
  max-height: 400px;
  overflow-y: auto;
}

.text-green {
  color: #67c23a;
}

.text-red {
  color: #f56c6c;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .overview-card .card-value {
    font-size: 24px;
  }

  .chart-card {
    height: 350px;
  }

  .chart-container {
    height: 280px;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-header h2 {
    margin-bottom: 10px;
  }

  .filter-section {
    padding: 15px;
  }

  .chart-card {
    height: 300px;
  }

  .chart-container {
    height: 240px;
  }
}
</style>
