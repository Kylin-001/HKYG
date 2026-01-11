<template>
  <div class="takeout-order-list">
    <div class="page-header">
      <h2>外卖订单管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleExport">
          <i class="el-icon-download"></i> 导出订单
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ stats.todayOrders }}</div>
              <div class="stats-label">今日订单</div>
            </div>
            <div class="stats-icon">
              <i class="el-icon-document"></i>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ stats.totalAmount }}</div>
              <div class="stats-label">今日营业额(元)</div>
            </div>
            <div class="stats-icon">
              <i class="el-icon-money"></i>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ stats.avgDeliveryTime }}</div>
              <div class="stats-label">平均配送时间(分钟)</div>
            </div>
            <div class="stats-icon">
              <i class="el-icon-time"></i>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ stats.satisfactionRate }}%</div>
              <div class="stats-label">用户满意度</div>
            </div>
            <div class="stats-icon">
              <i class="el-icon-star-on"></i>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="订单号">
          <el-input
            v-model="searchForm.orderNo"
            placeholder="请输入订单号"
            clearable
            style="width: 200px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="用户手机号">
          <el-input
            v-model="searchForm.phone"
            placeholder="请输入手机号"
            clearable
            style="width: 150px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="待支付" value="pending"></el-option>
            <el-option label="已支付" value="paid"></el-option>
            <el-option label="制作中" value="preparing"></el-option>
            <el-option label="配送中" value="delivering"></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="已取消" value="cancelled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商家">
          <el-select
            v-model="searchForm.merchantId"
            placeholder="请选择商家"
            clearable
            style="width: 200px"
          >
            <el-option label="兰州拉面" value="1"></el-option>
            <el-option label="黄焖鸡米饭" value="2"></el-option>
            <el-option label="沙县小吃" value="3"></el-option>
            <el-option label="麻辣烫" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 300px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 订单表格 -->
    <el-card class="table-card">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        element-loading-text="加载中..."
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
        <el-table-column prop="merchantName" label="商家名称" width="150"></el-table-column>
        <el-table-column prop="userName" label="用户姓名" width="120"></el-table-column>
        <el-table-column prop="userPhone" label="手机号" width="130"></el-table-column>
        <el-table-column prop="totalAmount" label="订单金额" width="100">
          <template v-slot:default="{ row }"> ¥{{ row.totalAmount.toFixed(2) }} </template>
        </el-table-column>
        <el-table-column prop="deliveryFee" label="配送费" width="80">
          <template v-slot:default="{ row }"> ¥{{ row.deliveryFee.toFixed(2) }} </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="100">
          <template v-slot:default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryTime" label="配送时间" width="120"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template v-slot:default="{ row }">
            <el-button size="mini" @click="handleDetail(row)">查看详情</el-button>
            <el-button
              v-if="row.status === 'preparing'"
              size="mini"
              type="primary"
              @click="handleAssignDelivery(row)"
              >分配配送员</el-button
            >
            <el-button
              v-if="row.status === 'delivering'"
              size="mini"
              type="success"
              @click="handleTrackDelivery(row)"
              >追踪配送</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog title="订单详情" v-model="detailDialogVisible" width="800px">
      <div v-if="currentOrder" class="order-detail">
        <el-row :gutter="20">
          <el-col :span="12">
            <h4>订单信息</h4>
            <p><strong>订单号：</strong>{{ currentOrder.orderNo }}</p>
            <p><strong>下单时间：</strong>{{ currentOrder.orderTime }}</p>
            <p>
              <strong>订单状态：</strong>
              <el-tag :type="getStatusTagType(currentOrder.status)" size="small">
                {{ getStatusText(currentOrder.status) }}
              </el-tag>
            </p>
            <p><strong>备注：</strong>{{ currentOrder.remark || '无' }}</p>
          </el-col>
          <el-col :span="12">
            <h4>用户信息</h4>
            <p><strong>姓名：</strong>{{ currentOrder.userName }}</p>
            <p><strong>手机号：</strong>{{ currentOrder.userPhone }}</p>
            <p><strong>配送地址：</strong>{{ currentOrder.deliveryAddress }}</p>
            <p><strong>配送时间：</strong>{{ currentOrder.deliveryTime }}</p>
          </el-col>
        </el-row>

        <h4>订单商品</h4>
        <el-table :data="currentOrder.items" size="small">
          <el-table-column prop="name" label="商品名称"></el-table-column>
          <el-table-column prop="quantity" label="数量" width="80"></el-table-column>
          <el-table-column prop="price" label="单价" width="100">
            <template v-slot:default="{ row }"> ¥{{ row.price.toFixed(2) }} </template>
          </el-table-column>
          <el-table-column prop="subtotal" label="小计" width="100">
            <template v-slot:default="{ row }"> ¥{{ row.subtotal.toFixed(2) }} </template>
          </el-table-column>
        </el-table>

        <div class="order-summary">
          <p><strong>商品小计：</strong>¥{{ currentOrder.subtotal.toFixed(2) }}</p>
          <p><strong>配送费：</strong>¥{{ currentOrder.deliveryFee.toFixed(2) }}</p>
          <p class="total"><strong>总计：</strong>¥{{ currentOrder.totalAmount.toFixed(2) }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入Vue 3组合式API
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElPrompt, ElAlert } from 'element-plus'
import logger from '@/utils/logger'
import { useTakeoutStore } from '@/store/modules/takeout'

// 定义类型
interface SearchForm {
  orderNo: string
  phone: string
  status: string
  merchantId: string
  dateRange: Date[] | null
}

interface Pagination {
  pageNum: number
  pageSize: number
  total: number
}

interface Stats {
  todayOrders: number
  totalAmount: number
  avgDeliveryTime: number
  satisfactionRate: number
}

interface OrderItem {
  name: string
  quantity: number
  price: number
  subtotal: number
}

interface Order {
  id: number
  orderNo: string
  merchantName: string
  userName: string
  userPhone: string
  totalAmount: number
  deliveryFee: number
  status: string
  deliveryTime: string
  orderTime: string
  remark?: string
  deliveryAddress?: string
  subtotal?: number
  items?: OrderItem[]
}

interface TrackingInfo {
  deliveryUserName?: string
  deliveryUserPhone?: string
  currentLocation?: string
  estimatedTime?: string
}

// 响应式数据
const loading = ref(false)
const searchForm = reactive<SearchForm>({
  orderNo: '',
  phone: '',
  status: '',
  merchantId: '',
  dateRange: null,
})

const tableData = ref<Order[]>([])
const pagination = reactive<Pagination>({
  pageNum: 1,
  pageSize: 10,
  total: 0,
})

const stats = reactive<Stats>({
  todayOrders: 0,
  totalAmount: 0,
  avgDeliveryTime: 0,
  satisfactionRate: 0,
})

const detailDialogVisible = ref(false)
const currentOrder = ref<Order | null>(null)
const selectedRows = ref<Order[]>([])

// Pinia Store
const takeoutStore = useTakeoutStore()

// 获取状态文本
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待支付',
    paid: '已支付',
    preparing: '制作中',
    delivering: '配送中',
    completed: '已完成',
    cancelled: '已取消',
  }
  return statusMap[status] || status
}

// 获取状态标签类型
const getStatusTagType = (status: string): string => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    paid: 'primary',
    preparing: 'info',
    delivering: 'warning',
    completed: 'success',
    cancelled: 'danger',
  }
  return typeMap[status] || ''
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  fetchData()
}

// 重置
const handleReset = () => {
  searchForm.orderNo = ''
  searchForm.phone = ''
  searchForm.status = ''
  searchForm.merchantId = ''
  searchForm.dateRange = null
  pagination.pageNum = 1
  fetchData()
}

// 导出订单
const handleExport = async () => {
  try {
    loading.value = true
    const params = {
      ...searchForm,
      dateRange: searchForm.dateRange
        ? [searchForm.dateRange[0].toISOString(), searchForm.dateRange[1].toISOString()]
        : null,
    }

    await takeoutStore.exportOrders(params)
    ElMessage.success('订单导出成功')
  } catch (error) {
    logger.error('导出订单失败', error)
    ElMessage.error('导出订单失败')
  } finally {
    loading.value = false
  }
}

// 查看订单详情
const handleDetail = async (row: Order) => {
  try {
    const orderDetail = await takeoutStore.fetchOrderDetail(row.id)
    currentOrder.value = orderDetail.data
    detailDialogVisible.value = true
  } catch (error) {
    logger.error('获取订单详情失败', error)
    ElMessage.error('获取订单详情失败')
  }
}

// 分配配送员
const handleAssignDelivery = async (row: Order) => {
  try {
    const result = await ElPrompt.confirm('请输入配送员ID', '分配配送员', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^\d+$/,
      inputErrorMessage: '配送员ID格式不正确',
    })

    await takeoutStore.assignDelivery({
      orderId: row.id,
      deliveryUserId: result.value,
    })

    ElMessage.success('配送员分配成功')
    fetchData() // 刷新列表
  } catch (error) {
    if (error !== 'cancel') {
      logger.error('分配配送员失败', error)
      ElMessage.error('分配配送员失败')
    }
  }
}

// 追踪配送
const handleTrackDelivery = async (row: Order) => {
  try {
    const trackingInfo = await takeoutStore.trackDelivery(row.id)
    const { data } = trackingInfo

    ElAlert.alert(
      `
      <div>
        <p><strong>配送员：</strong>${data.deliveryUserName || '未知'}</p>
        <p><strong>联系方式：</strong>${data.deliveryUserPhone || '未知'}</p>
        <p><strong>当前位置：</strong>${data.currentLocation || '未知'}</p>
        <p><strong>预计送达时间：</strong>${data.estimatedTime || '未知'}</p>
      </div>
    `,
      '配送追踪信息',
      {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true,
      }
    )
  } catch (error) {
    logger.error('获取配送信息失败', error)
    ElMessage.error('获取配送信息失败')
  }
}

// 选择行变化
const handleSelectionChange = (val: Order[]) => {
  selectedRows.value = val
}

// 分页大小变化
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.pageNum = 1
  fetchData()
}

// 当前页码变化
const handleCurrentChange = (val: number) => {
  pagination.pageNum = val
  fetchData()
}

// 获取统计数据
const fetchStats = async () => {
  try {
    const statsResponse = await takeoutStore.fetchOrderStats()
    Object.assign(stats, statsResponse.data)
  } catch (error) {
    logger.error('获取统计数据失败', error)
    ElMessage.error('获取统计数据失败')
  }
}

// 获取订单列表数据
const fetchData = async () => {
  try {
    loading.value = true

    const params = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...searchForm,
    }

    // 处理日期范围
    if (params.dateRange && params.dateRange.length === 2) {
      params.startDate = params.dateRange[0].toISOString()
      params.endDate = params.dateRange[1].toISOString()
      delete params.dateRange
    }

    const response = await takeoutStore.fetchOrderList(params)

    tableData.value = response.data.records || []
    pagination.total = response.data.total || 0

    // 刷新统计数据
    fetchStats()
  } catch (error) {
    logger.error('获取订单列表失败', error)
    ElMessage.error('获取订单列表失败')
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 页面加载时执行
onMounted(() => {
  fetchData()
  fetchStats()
})
</script>

<style scoped>
.takeout-order-list {
  padding: 20px;
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

.stats-cards {
  margin-bottom: 20px;
}

.stats-card {
  position: relative;
  overflow: hidden;
}

.stats-content {
  display: inline-block;
}

.stats-number {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stats-label {
  font-size: 14px;
  color: #909399;
}

.stats-icon {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  font-size: 40px;
  color: #e6e8eb;
}

.search-card,
.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.order-detail h4 {
  margin: 15px 0 10px 0;
  color: #303133;
}

.order-detail p {
  margin: 5px 0;
  line-height: 1.6;
}

.order-summary {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.order-summary .total {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-top: 10px;
}
</style>
