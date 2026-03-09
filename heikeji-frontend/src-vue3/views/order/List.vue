<template>
  <div class="order-list-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>订单管理</h2>
        <span class="subtitle">管理平台的所有订单信息</span>
      </div>
      <div class="header-right">
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-title">订单总数</div>
          <div class="stat-value">{{ orderStats.total }}</div>
        </div>
        <div class="stat-icon total"><Document /></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-title">今日订单</div>
          <div class="stat-value">{{ orderStats.todayCount }}</div>
        </div>
        <div class="stat-icon today"><Calendar /></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-title">今日金额</div>
          <div class="stat-value">¥{{ orderStats.todayAmount.toFixed(2) }}</div>
        </div>
        <div class="stat-icon amount"><Money /></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-title">待处理</div>
          <div class="stat-value">{{ orderStats.pendingPayment + orderStats.pendingConfirm }}</div>
        </div>
        <div class="stat-icon pending"><Warning /></div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-container">
      <div class="search-left">
        <el-input
          v-model="searchParams.orderNo"
          placeholder="订单编号"
          clearable
          size="small"
          style="width: 200px; margin-right: 10px"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-input
          v-model="searchParams.userName"
          placeholder="用户姓名"
          clearable
          size="small"
          style="width: 150px; margin-right: 10px"
        />
        <el-input
          v-model="searchParams.userPhone"
          placeholder="用户手机"
          clearable
          size="small"
          style="width: 150px; margin-right: 10px"
        />
        <el-select
          v-model="searchParams.orderStatus"
          placeholder="订单状态"
          clearable
          size="small"
          style="width: 120px; margin-right: 10px"
        >
          <el-option label="全部" value="" />
          <el-option label="待确认" value="1" />
          <el-option label="已确认" value="2" />
          <el-option label="配送中" value="3" />
          <el-option label="已完成" value="4" />
          <el-option label="已取消" value="5" />
        </el-select>
        <el-select
          v-model="searchParams.paymentStatus"
          placeholder="支付状态"
          clearable
          size="small"
          style="width: 120px; margin-right: 10px"
        >
          <el-option label="全部" value="" />
          <el-option label="待支付" value="1" />
          <el-option label="已支付" value="2" />
          <el-option label="支付失败" value="3" />
          <el-option label="已退款" value="4" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          style="width: 240px; margin-right: 10px"
          @change="handleDateChange"
        />
        <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
        <el-button size="small" @click="handleReset">重置</el-button>
      </div>
    </div>

    <!-- 订单列表表格 -->
    <el-card class="order-table-card">
      <el-table
        v-loading="loading"
        :data="orders"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="orderNo" label="订单编号" width="180" fixed="left">
          <template #default="{ row }">
            <el-link type="primary" @click="handleView(row)">
              {{ row.orderNo }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户姓名" width="100" />
        <el-table-column prop="userPhone" label="用户手机" width="120" />
        <el-table-column label="订单金额" width="120" align="right">
          <template #default="{ row }">
            <span>¥{{ row.actualAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getPaymentStatusType(row.paymentStatus)">
              {{ getPaymentStatusText(row.paymentStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getOrderStatusType(row.orderStatus)">
              {{ getOrderStatusText(row.orderStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="配送方式" width="100" align="center">
          <template #default="{ row }">
            {{ getDeliveryTypeText(row.deliveryType) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleView(row)"
            >
              查看
            </el-button>
            <el-button
              v-if="row.orderStatus === 1"
              type="success"
              size="small"
              link
              @click="handleConfirm(row)"
            >
              确认
            </el-button>
            <el-button
              v-if="row.orderStatus === 2"
              type="warning"
              size="small"
              link
              @click="handleDeliver(row)"
            >
              发货
            </el-button>
            <el-button
              v-if="row.orderStatus === 1"
              type="danger"
              size="small"
              link
              @click="handleCancel(row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
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
    </el-card>

    <!-- 订单详情对话框 -->
    <OrderDetailDialog
      v-model:visible="detailDialogVisible"
      :order-id="selectedOrderId"
      @refresh="handleRefresh"
    />

    <!-- 发货对话框 -->
    <DeliveryDialog
      v-model:visible="deliveryDialogVisible"
      :order-id="selectedOrderId"
      @refresh="handleRefresh"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Refresh, 
  Download, 
  Document, 
  Calendar, 
  Money, 
  Warning, 
  Search 
} from '@element-plus/icons-vue'
import OrderDetailDialog from './components/OrderDetailDialog.vue'
import DeliveryDialog from './components/DeliveryDialog.vue'
import { 
  getOrderList, 
  getOrderStats, 
  updateOrderStatus, 
  cancelOrder,
  exportOrders
} from '@/api/order'
import type { Order, OrderSearchParams, OrderStats } from '@/types/order'

// 响应式数据
const loading = ref(false)
const orders = ref<Order[]>([])
const total = ref(0)
const selectedOrders = ref<Order[]>([])
const orderStats = ref<OrderStats>({
  total: 0,
  todayCount: 0,
  todayAmount: 0,
  pendingPayment: 0,
  pendingConfirm: 0,
  delivering: 0,
  completed: 0,
  cancelled: 0,
  refunded: 0,
})

// 对话框状态
const detailDialogVisible = ref(false)
const deliveryDialogVisible = ref(false)
const selectedOrderId = ref<string | null>(null)

// 搜索参数
const searchParams = reactive<OrderSearchParams>({
  orderNo: '',
  userName: '',
  userPhone: '',
  orderStatus: '',
  paymentStatus: '',
  startDate: '',
  endDate: '',
  pageNum: 1,
  pageSize: 20,
})

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
})

// 日期范围
const dateRange = ref<[Date, Date] | null>(null)

// 计算属性
const hasSelected = computed(() => selectedOrders.value.length > 0)

// 方法
const loadOrders = async () => {
  loading.value = true
  try {
    searchParams.pageNum = pagination.currentPage
    searchParams.pageSize = pagination.pageSize
    
    const res = await getOrderList(searchParams)
    orders.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取订单列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const loadOrderStats = async () => {
  try {
    const res = await getOrderStats()
    orderStats.value = res.data
  } catch (error) {
    console.error('获取订单统计失败', error)
  }
}

const handleSearch = () => {
  pagination.currentPage = 1
  loadOrders()
}

const handleReset = () => {
  searchParams.orderNo = ''
  searchParams.userName = ''
  searchParams.userPhone = ''
  searchParams.orderStatus = ''
  searchParams.paymentStatus = ''
  searchParams.startDate = ''
  searchParams.endDate = ''
  dateRange.value = null
  pagination.currentPage = 1
  loadOrders()
}

const handleRefresh = () => {
  loadOrders()
  loadOrderStats()
}

const handleExport = async () => {
  try {
    await ElMessageBox.confirm('确定要导出订单数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    const res = await exportOrders(searchParams)
    
    // 创建下载链接
    const blob = new Blob([res.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `订单列表_${new Date().toLocaleDateString()}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('导出成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('导出失败')
      console.error(error)
    }
  }
}

const handleSelectionChange = (selection: Order[]) => {
  selectedOrders.value = selection
}

const handleView = (row: Order) => {
  selectedOrderId.value = row.id
  detailDialogVisible.value = true
}

const handleConfirm = async (row: Order) => {
  try {
    await ElMessageBox.confirm(
      `确定要确认订单"${row.orderNo}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await updateOrderStatus(row.id, 2)
    ElMessage.success('订单确认成功')
    loadOrders()
    loadOrderStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('订单确认失败')
      console.error(error)
    }
  }
}

const handleDeliver = (row: Order) => {
  selectedOrderId.value = row.id
  deliveryDialogVisible.value = true
}

const handleCancel = async (row: Order) => {
  try {
    const { value: reason } = await ElMessageBox.prompt(
      `确定要取消订单"${row.orderNo}"吗？请输入取消原因。`,
      '取消订单',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入取消原因',
      }
    )
    
    await cancelOrder(row.id, reason)
    ElMessage.success('订单取消成功')
    loadOrders()
    loadOrderStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('订单取消失败')
      console.error(error)
    }
  }
}

const handleDateChange = (dates: [Date, Date] | null) => {
  if (dates) {
    searchParams.startDate = dates[0].toISOString().split('T')[0]
    searchParams.endDate = dates[1].toISOString().split('T')[0]
  } else {
    searchParams.startDate = ''
    searchParams.endDate = ''
  }
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadOrders()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  loadOrders()
}

// 辅助方法
const getPaymentStatusType = (status: number) => {
  const types: Record<number, string> = {
    1: 'warning',
    2: 'success',
    3: 'danger',
    4: 'info',
  }
  return types[status] || 'info'
}

const getPaymentStatusText = (status: number) => {
  const texts: Record<number, string> = {
    1: '待支付',
    2: '已支付',
    3: '支付失败',
    4: '已退款',
  }
  return texts[status] || '未知'
}

const getOrderStatusType = (status: number) => {
  const types: Record<number, string> = {
    1: 'warning',
    2: 'primary',
    3: 'success',
    4: 'success',
    5: 'info',
  }
  return types[status] || 'info'
}

const getOrderStatusText = (status: number) => {
  const texts: Record<number, string> = {
    1: '待确认',
    2: '已确认',
    3: '配送中',
    4: '已完成',
    5: '已取消',
  }
  return texts[status] || '未知'
}

const getDeliveryTypeText = (type: number) => {
  const texts: Record<number, string> = {
    1: '快递配送',
    2: '自提',
    3: '外卖配送',
  }
  return texts[type] || '未知'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

// 生命周期
onMounted(() => {
  loadOrders()
  loadOrderStats()
})
</script>

<style lang="scss" scoped>
.order-list-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .header-left {
    h2 {
      margin: 0 0 5px 0;
      font-size: 24px;
      color: #303133;
    }

    .subtitle {
      color: #909399;
      font-size: 14px;
    }
  }

  .header-right {
    display: flex;
    gap: 10px;
  }
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .stat-info {
    flex: 1;

    .stat-title {
      color: #909399;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: #303133;
    }
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #fff;

    &.total {
      background-color: #409eff;
    }

    &.today {
      background-color: #67c23a;
    }

    &.amount {
      background-color: #e6a23c;
    }

    &.pending {
      background-color: #f56c6c;
    }
  }
}

.search-container {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.order-table-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

@media (max-width: 1200px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .search-left {
    flex-direction: column;
    gap: 10px;

    .el-input,
    .el-select,
    .el-date-picker,
    .el-button {
      width: 100% !important;
      margin-right: 0 !important;
      margin-bottom: 10px;
    }
  }
}
</style>