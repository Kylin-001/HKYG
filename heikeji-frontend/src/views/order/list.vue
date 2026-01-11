<template>
  <div class="order-list-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>订单管理</h2>
        <span class="subtitle">管理平台的订单信息</span>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出订单
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 订单列表 -->
    <el-card class="order-list-card">
      <!-- 搜索和筛选 -->
      <div class="search-filter">
        <el-form :inline="true" :model="searchParams" class="search-form">
          <el-form-item label="订单号">
            <el-input v-model="searchParams.orderId" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="searchParams.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="searchParams.orderStatus" placeholder="请选择订单状态">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="option in orderStore.statusOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间">
            <el-date-picker
              v-model="searchParams.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 订单表格 -->
      <el-table
        v-loading="orderStore.loading"
        :data="orderStore.list"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="orderNo" label="订单号" min-width="160"></el-table-column>
        <el-table-column prop="userName" label="用户信息" width="150"></el-table-column>
        <el-table-column prop="totalAmount" label="订单金额" width="120" align="right">
          <template #default="scope">¥{{ (scope.row.totalAmount || 0).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.orderStatus)">
              {{ scope.row.statusText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180"></el-table-column>
        <el-table-column prop="paymentTime" label="支付时间" width="180"></el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleViewDetail(scope.row.orderId)">
              <el-icon><View /></el-icon>
              查看详情
            </el-button>
            <el-button
              v-if="scope.row.orderStatus === 1"
              size="small"
              type="warning"
              @click="handleRemindPay(scope.row.orderId)"
            >
              <el-icon><Bell /></el-icon>
              提醒付款
            </el-button>
            <el-button
              v-if="scope.row.orderStatus === 2"
              size="small"
              type="primary"
              @click="handleShip(scope.row.orderId)"
            >
              <el-icon><Van /></el-icon><el-icon><CirclePlus /></el-icon>
              发货
            </el-button>
            <el-button
              v-if="scope.row.orderStatus === 6"
              size="small"
              type="primary"
              @click="handleRefund(scope.row.orderId)"
            >
              <el-icon><Money /></el-icon>
              处理退款
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="orderStore.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useOrderStore } from '@/store/modules/order'
import logger from '@/utils/logger'
import {
  Download,
  Refresh,
  Search,
  View,
  Bell,
  Van,
  CirclePlus,
  Money,
} from '@element-plus/icons-vue'

const orderStore = useOrderStore()
const router = useRouter()

// 搜索参数
const searchParams = reactive({
  orderId: '',
  userName: '',
  orderStatus: '',
  dateRange: [] as [string, string],
})

// 选中的订单
const selectedOrders = ref<any[]>([])

// 分页参数
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
})

// 加载订单数据
async function loadData() {
  try {
    const params = {
      keyword: searchParams.orderId,
      orderNo: searchParams.orderId,
      userName: searchParams.userName,
      status: searchParams.orderStatus,
      page: pagination.pageNum,
      size: pagination.pageSize,
    }

    // 格式化日期范围
    if (searchParams.dateRange && searchParams.dateRange.length === 2) {
      params.createTimeRange = searchParams.dateRange
    }

    await orderStore.fetchOrderList(params)
  } catch (error) {
    console.error('获取订单列表失败', error)
    ElMessage.error('获取订单列表失败')
  }
}

// 搜索
function handleSearch() {
  pagination.pageNum = 1
  loadData()
}

// 重置搜索
function handleReset() {
  searchParams.orderId = ''
  searchParams.userName = ''
  searchParams.orderStatus = ''
  searchParams.dateRange = [] as [string, string]
  pagination.pageNum = 1
  loadData()
}

// 刷新数据
function handleRefresh() {
  loadData()
}

// 导出订单
function handleExport() {
  ElMessage.success('导出功能已触发')
}

// 处理选择变更
function handleSelectionChange(selection: any[]) {
  selectedOrders.value = selection
}

// 处理分页大小变化
function handleSizeChange(size: number) {
  pagination.pageSize = size
  loadData()
}

// 处理当前页变化
function handleCurrentChange(current: number) {
  pagination.pageNum = current
  loadData()
}

// 查看详情
function handleViewDetail(orderId: string) {
  router.push({ path: `/order/detail/${orderId}` })
}

// 提醒付款
async function handleRemindPay(orderId: string) {
  try {
    await ElMessageBox.confirm('确定要提醒用户付款吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await orderStore.handleRemindPay(orderId)
    ElMessage.success('提醒成功')
  } catch (error: any) {
    if (error !== 'cancel') {
      logger.error('提醒付款失败', error)
      ElMessage.error('提醒付款失败')
    } else {
      ElMessage.info('已取消操作')
    }
  }
}

// 发货
function handleShip(orderId: string) {
  // 跳转到订单详情页面
  router.push({ path: `/order/detail/${orderId}` })
}

// 处理退款
function handleRefund(orderId: string) {
  // 跳转到订单详情页面处理退款
  router.push({ path: `/order/detail/${orderId}` })
}

// 获取状态类型
function getStatusType(status: number) {
  const typeMap: Record<number, string> = {
    1: 'warning',
    2: 'info',
    3: 'primary',
    4: 'success',
    5: 'danger',
    6: 'warning',
    7: 'danger',
  }
  return typeMap[status] || 'info'
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
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

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }

  .subtitle {
    display: block;
    margin-top: 5px;
    font-size: 14px;
    color: #999;
  }

  .header-right {
    display: flex;
    gap: 10px;
  }
}

.order-list-card {
  margin-bottom: 20px;
}

.search-filter {
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
