<template>
  <div class="delivery-request-list">
    <div class="page-header">
      <h2>跑腿请求管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleExport">
          <i class="el-icon-download"></i> 导出请求
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ stats.todayRequests }}</div>
              <div class="stats-label">今日请求</div>
            </div>
            <div class="stats-icon">
              <i class="el-icon-document"></i>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ stats.pendingRequests }}</div>
              <div class="stats-label">待处理请求</div>
            </div>
            <div class="stats-icon">
              <i class="el-icon-time"></i>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ stats.avgFee }}</div>
              <div class="stats-label">平均跑腿费(元)</div>
            </div>
            <div class="stats-icon">
              <i class="el-icon-money"></i>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ stats.completionRate }}%</div>
              <div class="stats-label">完成率</div>
            </div>
            <div class="stats-icon">
              <i class="el-icon-success"></i>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="请求编号">
          <el-input
            v-model="searchForm.requestNo"
            placeholder="请输入请求编号"
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
        <el-form-item label="请求状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="待接单" value="pending"></el-option>
            <el-option label="已接单" value="assigned"></el-option>
            <el-option label="进行中" value="in_progress"></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="已取消" value="cancelled"></el-option>
            <el-option label="已超时" value="timeout"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跑腿类型">
          <el-select
            v-model="searchForm.type"
            placeholder="请选择类型"
            clearable
            style="width: 150px"
          >
            <el-option label="代购" value="purchase"></el-option>
            <el-option label="代取" value="pickup"></el-option>
            <el-option label="代送" value="delivery"></el-option>
            <el-option label="代领" value="collect"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="紧急程度">
          <el-select
            v-model="searchForm.urgency"
            placeholder="请选择紧急程度"
            clearable
            style="width: 150px"
          >
            <el-option label="普通" value="normal"></el-option>
            <el-option label="紧急" value="urgent"></el-option>
            <el-option label="特急" value="urgent_plus"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求时间">
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

    <!-- 跑腿请求表格 -->
    <el-card class="table-card">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        element-loading-text="加载中..."
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="requestNo" label="请求编号" width="180"></el-table-column>
        <el-table-column prop="userName" label="用户姓名" width="120"></el-table-column>
        <el-table-column prop="userPhone" label="手机号" width="130"></el-table-column>
        <el-table-column prop="type" label="跑腿类型" width="100">
          <template v-slot="{ row }">
            <el-tag :type="getTypeTagType(row.type)">
              {{ getTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="请求标题" min-width="200"></el-table-column>
        <el-table-column prop="fee" label="跑腿费" width="80">
          <template v-slot="{ row }"> ¥{{ row.fee.toFixed(2) }} </template>
        </el-table-column>
        <el-table-column prop="urgency" label="紧急程度" width="100">
          <template v-slot="{ row }">
            <el-tag :type="getUrgencyTagType(row.urgency)" size="small">
              {{ getUrgencyText(row.urgency) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template v-slot="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template v-slot="{ row }">
            <el-button size="mini" @click="handleDetail(row)">查看详情</el-button>
            <el-button
              v-if="row.status === 'pending'"
              size="mini"
              type="primary"
              @click="handleAssign(row)"
              >分配跑腿员</el-button
            >
            <el-button
              v-if="row.status === 'assigned'"
              size="mini"
              type="warning"
              @click="handleFollow(row)"
              >跟踪进度</el-button
            >
            <el-button
              v-if="['pending', 'assigned'].includes(row.status)"
              size="mini"
              type="danger"
              @click="handleCancel(row)"
              >取消</el-button
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

// TypeScript 类型定义
interface DeliveryRequest {
  id: number
  requestNo: string
  userName: string
  userPhone: string
  type: 'purchase' | 'pickup' | 'delivery' | 'collect'
  title: string
  description?: string
  fee: number
  urgency: 'normal' | 'urgent' | 'urgent_plus'
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'timeout'
  pickupAddress: string
  deliveryAddress: string
  createTime: string
  estimatedTime: string
  deliveryPerson?: string
  deliveryPersonPhone?: string
}

interface SearchForm {
  requestNo: string
  phone: string
  status: string
  type: string
  urgency: string
  dateRange: any[] | null
}

interface Pagination {
  pageNum: number
  pageSize: number
  total: number
}

interface Stats {
  todayRequests: number
  pendingRequests: number
  avgFee: number
  completionRate: number
}

// 响应式数据
const loading = ref(false)

const searchForm = reactive<SearchForm>({
  requestNo: '',
  phone: '',
  status: '',
  type: '',
  urgency: '',
  dateRange: null,
})

const tableData = ref<DeliveryRequest[]>([
  {
    id: 1,
    requestNo: 'DE2024011510001',
    userName: '张三',
    userPhone: '13800138001',
    type: 'purchase',
    title: '帮我买一个充电器',
    description: '需要买一个华为快充充电器，型号P40',
    fee: 5.0,
    urgency: 'normal',
    status: 'pending',
    pickupAddress: '学校北门快递点',
    deliveryAddress: '东北校区第一宿舍楼A座101',
    createTime: '2024-01-15 10:30:00',
    estimatedTime: '30分钟',
  },
  {
    id: 2,
    requestNo: 'DE2024011510002',
    userName: '李四',
    userPhone: '13800138002',
    type: 'pickup',
    title: '取快递',
    description: '韵达快递，包裹号码：YT123456789',
    fee: 3.0,
    urgency: 'urgent',
    status: 'assigned',
    pickupAddress: '学校南门快递柜',
    deliveryAddress: '东北校区第二宿舍楼B座202',
    createTime: '2024-01-15 11:00:00',
    estimatedTime: '20分钟',
    deliveryPerson: '王师傅',
    deliveryPersonPhone: '13900139001',
  },
  {
    id: 3,
    requestNo: 'DE2024011510003',
    userName: '王五',
    userPhone: '13800138003',
    type: 'delivery',
    title: '送文件到办公室',
    description: '将简历送到行政楼人事部',
    fee: 8.0,
    urgency: 'urgent_plus',
    status: 'in_progress',
    pickupAddress: '东北校区第三宿舍楼C座303',
    deliveryAddress: '行政楼人事部',
    createTime: '2024-01-15 09:00:00',
    estimatedTime: '15分钟',
    deliveryPerson: '李师傅',
    deliveryPersonPhone: '13900139002',
  },
])

const pagination = reactive<Pagination>({
  pageNum: 1,
  pageSize: 10,
  total: 3,
})

const stats = reactive<Stats>({
  todayRequests: 24,
  pendingRequests: 6,
  avgFee: 5.2,
  completionRate: 92,
})

const selectedRows = ref<DeliveryRequest[]>([])

const router = useRouter()

// 生命周期钩子
onMounted(() => {
  fetchData()
})

// 方法
const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    purchase: '代购',
    pickup: '代取',
    delivery: '代送',
    collect: '代领',
  }
  return typeMap[type] || type
}

const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    purchase: 'primary',
    pickup: 'success',
    delivery: 'warning',
    collect: 'info',
  }
  return typeMap[type] || ''
}

const getUrgencyText = (urgency: string) => {
  const urgencyMap: Record<string, string> = {
    normal: '普通',
    urgent: '紧急',
    urgent_plus: '特急',
  }
  return urgencyMap[urgency] || urgency
}

const getUrgencyTagType = (urgency: string) => {
  const typeMap: Record<string, string> = {
    normal: '',
    urgent: 'warning',
    urgent_plus: 'danger',
  }
  return typeMap[urgency] || ''
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待接单',
    assigned: '已接单',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消',
    timeout: '已超时',
  }
  return statusMap[status] || status
}

const getStatusTagType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    assigned: 'primary',
    in_progress: 'info',
    completed: 'success',
    cancelled: 'danger',
    timeout: 'danger',
  }
  return typeMap[status] || ''
}

const handleSearch = () => {
  fetchData()
}

const handleReset = () => {
  Object.assign(searchForm, {
    requestNo: '',
    phone: '',
    status: '',
    type: '',
    urgency: '',
    dateRange: null,
  })
  fetchData()
}

const handleExport = () => {
  // 导出请求逻辑
  ElMessage.success('请求导出成功')
}

const handleDetail = (row: DeliveryRequest) => {
  router.push(`/delivery/request/detail/${row.id}`)
}

const handleAssign = (row: DeliveryRequest) => {
  // 分配跑腿员逻辑
  ElMessage.info('分配跑腿员功能开发中')
}

const handleFollow = (row: DeliveryRequest) => {
  // 跟踪进度逻辑
  ElMessage.info('跟踪进度功能开发中')
}

const handleCancel = (row: DeliveryRequest) => {
  ElMessageBox.confirm('确定要取消这个跑腿请求吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 这里应该是实际的取消API调用
    ElMessage.success('请求已取消')
    fetchData()
  })
}

const handleSelectionChange = (val: DeliveryRequest[]) => {
  selectedRows.value = val
}

const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  pagination.pageNum = val
  fetchData()
}

const fetchData = () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    loading.value = false
    // 这里应该是实际的API调用
  }, 500)
}
</script>

<style scoped>
.delivery-request-list {
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
</style>
