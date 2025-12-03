<template>
  <div class="delivery-request-detail">
    <div class="page-header">
      <h2>跑腿请求详情</h2>
      <div class="header-actions">
        <el-button @click="$router.go(-1)"> <i class="el-icon-arrow-left"></i> 返回列表 </el-button>
        <el-button type="primary" @click="handleEdit" v-if="requestDetail.status === 'pending'">
          <i class="el-icon-edit"></i> 编辑
        </el-button>
        <el-button
          type="danger"
          @click="handleCancel"
          v-if="['pending', 'assigned'].includes(requestDetail.status)"
        >
          <i class="el-icon-close"></i> 取消
        </el-button>
      </div>
    </div>

    <div class="detail-container" v-loading="loading">
      <!-- 请求基本信息 -->
      <el-card class="info-card">
        <div v-slot:header>
          <span>请求基本信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <label>请求编号：</label>
              <span>{{ requestDetail.requestNo }}</span>
            </div>
            <div class="info-item">
              <label>请求类型：</label>
              <el-tag :type="getTypeTagType(requestDetail.type)">
                {{ getTypeText(requestDetail.type) }}
              </el-tag>
            </div>
            <div class="info-item">
              <label>请求标题：</label>
              <span>{{ requestDetail.title }}</span>
            </div>
            <div class="info-item">
              <label>跑腿费：</label>
              <span class="fee-highlight">¥{{ requestDetail.fee.toFixed(2) }}</span>
            </div>
            <div class="info-item">
              <label>紧急程度：</label>
              <el-tag :type="getUrgencyTagType(requestDetail.urgency)">
                {{ getUrgencyText(requestDetail.urgency) }}
              </el-tag>
            </div>
            <div class="info-item">
              <label>状态：</label>
              <el-tag :type="getStatusTagType(requestDetail.status)" size="large">
                {{ getStatusText(requestDetail.status) }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <label>创建时间：</label>
              <span>{{ requestDetail.createTime }}</span>
            </div>
            <div class="info-item">
              <label>预计用时：</label>
              <span>{{ requestDetail.estimatedTime }}</span>
            </div>
            <div class="info-item">
              <label>用户姓名：</label>
              <span>{{ requestDetail.userName }}</span>
            </div>
            <div class="info-item">
              <label>用户手机：</label>
              <span>{{ requestDetail.userPhone }}</span>
            </div>
            <div class="info-item">
              <label>完成时间：</label>
              <span>{{ requestDetail.completedTime || '-' }}</span>
            </div>
            <div class="info-item">
              <label>评价分数：</label>
              <div class="rating-container">
                <el-rate
                  v-model="requestDetail.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}/5"
                  v-if="requestDetail.rating"
                >
                </el-rate>
                <span v-else>-</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 任务描述 -->
      <el-card class="info-card">
        <div v-slot:header>
          <span>任务描述</span>
        </div>
        <div class="description-content">
          {{ requestDetail.description || '暂无描述' }}
        </div>
        <div
          class="attachments"
          v-if="requestDetail.attachments && requestDetail.attachments.length > 0"
        >
          <h4>附件：</h4>
          <div class="attachment-list">
            <el-button
              v-for="(attachment, index) in requestDetail.attachments"
              :key="index"
              type="text"
              size="small"
              @click="handleDownload(attachment)"
            >
              <i class="el-icon-paperclip"></i>
              {{ attachment.name }}
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 地址信息 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="info-card">
            <div v-slot:header>
              <span>取货地址</span>
            </div>
            <div class="address-info">
              <div class="address-icon">
                <i class="el-icon-location-outline"></i>
              </div>
              <div class="address-content">
                <p class="address-text">{{ requestDetail.pickupAddress }}</p>
                <p class="contact-info">
                  联系人：{{ requestDetail.pickupContact || requestDetail.userName }}
                </p>
                <p class="contact-info">
                  电话：{{ requestDetail.pickupPhone || requestDetail.userPhone }}
                </p>
                <el-button
                  v-if="requestDetail.pickupAddress"
                  type="text"
                  size="small"
                  @click="handleMapNavigate(requestDetail.pickupAddress, 'pickup')"
                >
                  <i class="el-icon-map-location"></i> 导航
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="info-card">
            <div v-slot:header>
              <span>送货地址</span>
            </div>
            <div class="address-info">
              <div class="address-icon">
                <i class="el-icon-location-outline"></i>
              </div>
              <div class="address-content">
                <p class="address-text">{{ requestDetail.deliveryAddress }}</p>
                <p class="contact-info">
                  联系人：{{ requestDetail.deliveryContact || requestDetail.userName }}
                </p>
                <p class="contact-info">
                  电话：{{ requestDetail.deliveryPhone || requestDetail.userPhone }}
                </p>
                <el-button
                  v-if="requestDetail.deliveryAddress"
                  type="text"
                  size="small"
                  @click="handleMapNavigate(requestDetail.deliveryAddress, 'delivery')"
                >
                  <i class="el-icon-map-location"></i> 导航
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 跑腿员信息 -->
      <el-card class="info-card" v-if="requestDetail.deliveryPerson">
        <div v-slot:header>
          <span>跑腿员信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <label>姓名：</label>
              <span>{{ requestDetail.deliveryPerson }}</span>
            </div>
            <div class="info-item">
              <label>手机号：</label>
              <span>{{ requestDetail.deliveryPersonPhone }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <label>接单时间：</label>
              <span>{{ requestDetail.assignedTime }}</span>
            </div>
            <div class="info-item">
              <label>当前状态：</label>
              <span>{{ requestDetail.deliveryStatus || '工作中' }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 费用明细 -->
      <el-card class="info-card">
        <div v-slot:header>
          <span>费用明细</span>
        </div>
        <div class="fee-breakdown">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="fee-item">
                <span class="fee-label">基础跑腿费：</span>
                <span class="fee-value">¥{{ requestDetail.baseFee.toFixed(2) }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="fee-item">
                <span class="fee-label">紧急费用：</span>
                <span class="fee-value">¥{{ requestDetail.urgencyFee.toFixed(2) }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="fee-item total">
                <span class="fee-label">总计：</span>
                <span class="fee-value">¥{{ requestDetail.fee.toFixed(2) }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <!-- 操作日志 -->
      <el-card class="info-card">
        <div v-slot:header>
          <span>操作日志</span>
        </div>
        <el-timeline>
          <el-timeline-item
            v-for="(log, index) in requestDetail.operationLogs"
            :key="index"
            :timestamp="log.time"
            :type="getLogType(log.type)"
          >
            <div class="log-content">
              <p class="log-action">{{ log.action }}</p>
              <p class="log-detail" v-if="log.detail">{{ log.detail }}</p>
              <p class="log-operator" v-if="log.operator">操作人：{{ log.operator }}</p>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>

      <!-- 进度跟踪 -->
      <el-card class="info-card">
        <div v-slot:header>
          <span>进度跟踪</span>
        </div>
        <div class="progress-timeline">
          <el-steps :active="getProgressActive()" finish-status="success">
            <el-step
              title="创建请求"
              :description="requestDetail.createTime"
              :status="requestDetail.createTime ? 'finish' : 'wait'"
            ></el-step>
            <el-step
              title="跑腿员接单"
              :description="requestDetail.assignedTime"
              :status="requestDetail.assignedTime ? 'finish' : 'wait'"
            ></el-step>
            <el-step
              title="开始取货"
              :description="requestDetail.pickupStartTime"
              :status="requestDetail.pickupStartTime ? 'finish' : 'wait'"
            ></el-step>
            <el-step
              title="货物已取"
              :description="requestDetail.pickupCompleteTime"
              :status="requestDetail.pickupCompleteTime ? 'finish' : 'wait'"
            ></el-step>
            <el-step
              title="开始送货"
              :description="requestDetail.deliveryStartTime"
              :status="requestDetail.deliveryStartTime ? 'finish' : 'wait'"
            ></el-step>
            <el-step
              title="送货完成"
              :description="requestDetail.completedTime"
              :status="requestDetail.completedTime ? 'finish' : 'wait'"
            ></el-step>
          </el-steps>
        </div>
      </el-card>

      <!-- 地图显示 -->
      <el-card class="info-card">
        <div v-slot:header>
          <span>路线地图</span>
        </div>
        <div
          class="map-container"
          style="
            height: 400px;
            background: #f5f7fa;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <div style="text-align: center; color: #909399">
            <i class="el-icon-map-location" style="font-size: 48px; margin-bottom: 16px"></i>
            <p>地图功能开发中...</p>
            <p>将在此处显示取货到送货的路线地图</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入日志工具
import logger from '@/utils/logger'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

// TypeScript 类型定义
interface OperationLog {
  time: string
  type: string
  action: string
  detail?: string
  operator?: string
}

interface Attachment {
  name: string
  url: string
}

interface RequestDetail {
  id: number
  requestNo: string
  type: 'purchase' | 'pickup' | 'delivery' | 'collect'
  title: string
  description?: string
  fee: number
  baseFee: number
  urgencyFee: number
  urgency: 'normal' | 'urgent' | 'urgent_plus'
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'timeout'
  createTime: string
  estimatedTime: string
  completedTime: string | null
  rating: number | null
  userName: string
  userPhone: string
  pickupAddress: string
  deliveryAddress: string
  pickupContact: string | null
  pickupPhone: string | null
  deliveryContact: string | null
  deliveryPhone: string | null
  deliveryPerson: string | null
  deliveryPersonPhone: string | null
  assignedTime: string | null
  deliveryStatus: string | null
  pickupStartTime: string | null
  pickupCompleteTime: string | null
  deliveryStartTime: string | null
  operationLogs: OperationLog[]
  attachments: Attachment[]
}

// 响应式数据
const loading = ref(false)
const requestId = ref<string | number | undefined>(undefined)
const route = useRoute()
const router = useRouter()

const requestDetail = reactive<RequestDetail>({
  id: 1,
  requestNo: 'DE2024011510001',
  type: 'purchase',
  title: '帮我买一个充电器',
  description: '需要买一个华为快充充电器，型号P40，功率20W',
  fee: 5.0,
  baseFee: 3.0,
  urgencyFee: 2.0,
  urgency: 'normal',
  status: 'pending',
  createTime: '2024-01-15 10:30:00',
  estimatedTime: '30分钟',
  completedTime: null,
  rating: null,
  userName: '张三',
  userPhone: '13800138001',
  pickupAddress: '学校北门快递点',
  deliveryAddress: '东北校区第一宿舍楼A座101',
  pickupContact: null,
  pickupPhone: null,
  deliveryContact: null,
  deliveryPhone: null,
  deliveryPerson: null,
  deliveryPersonPhone: null,
  assignedTime: null,
  deliveryStatus: null,
  pickupStartTime: null,
  pickupCompleteTime: null,
  deliveryStartTime: null,
  operationLogs: [
    {
      time: '2024-01-15 10:30:00',
      type: 'create',
      action: '创建跑腿请求',
      detail: '用户提交了新的代购请求',
      operator: '张三',
    },
  ],
  attachments: [
    {
      name: '商品图片.jpg',
      url: '/uploads/product.jpg',
    },
  ],
})

// 生命周期钩子
onMounted(() => {
  requestId.value = route.params.id
  fetchRequestDetail()
})

// 方法
const fetchRequestDetail = () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    loading.value = false
    // 这里应该是实际的API调用
    logger.log('获取请求详情:', requestId.value)
  }, 500)
}

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

const getLogType = (type: string) => {
  const typeMap: Record<string, string> = {
    create: 'primary',
    update: 'success',
    assign: 'warning',
    complete: 'success',
    cancel: 'danger',
  }
  return typeMap[type] || 'info'
}

const getProgressActive = () => {
  const { status } = requestDetail
  const progressMap: Record<string, number> = {
    pending: 1,
    assigned: 2,
    in_progress: 3,
    completed: 6,
    cancelled: 0,
    timeout: 0,
  }
  return progressMap[status] || 0
}

const handleEdit = () => {
  ElMessage.info('编辑功能开发中')
}

const handleCancel = () => {
  ElMessageBox.confirm('确定要取消这个跑腿请求吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 这里应该是实际的取消API调用
    ElMessage.success('请求已取消')
    router.go(-1)
  })
}

const handleDownload = (attachment: Attachment) => {
  ElMessage.info(`下载文件: ${attachment.name}`)
}

const handleMapNavigate = (address: string, type: string) => {
  ElMessage.info(`导航到${type === 'pickup' ? '取货' : '送货'}地址: ${address}`)
}
</script>

<style scoped>
.delivery-request-detail {
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

.info-card {
  margin-bottom: 20px;
}

.info-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.info-item label {
  width: 100px;
  font-weight: 500;
  color: #606266;
}

.fee-highlight {
  color: #e6a23c;
  font-weight: bold;
  font-size: 16px;
}

.rating-container {
  display: inline-flex;
  align-items: center;
}

.description-content {
  line-height: 1.6;
  color: #303133;
}

.attachments {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.attachment-list {
  margin-top: 10px;
}

.address-info {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.address-icon {
  color: #409eff;
  font-size: 24px;
  margin-top: 4px;
}

.address-content {
  flex: 1;
}

.address-text {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.contact-info {
  margin: 5px 0;
  color: #606266;
  font-size: 14px;
}

.fee-breakdown {
  padding: 10px 0;
}

.fee-item {
  margin-bottom: 10px;
}

.fee-item.total {
  border-top: 1px solid #ebeef5;
  padding-top: 10px;
  margin-top: 10px;
}

.fee-label {
  color: #606266;
}

.fee-value {
  font-weight: bold;
  color: #e6a23c;
}

.log-content {
  margin-bottom: 10px;
}

.log-action {
  font-weight: 500;
  color: #303133;
  margin-bottom: 5px;
}

.log-detail {
  color: #606266;
  margin-bottom: 5px;
}

.log-operator {
  color: #909399;
  font-size: 12px;
}

.progress-timeline {
  margin-top: 20px;
}
</style>
