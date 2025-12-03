<template>
  <div class="takeout-order-detail">
    <div class="page-header">
      <el-button @click="goBack" icon="el-icon-arrow-left">返回</el-button>
      <h2>外卖订单详情</h2>
    </div>

    <div v-if="order" class="order-detail-container">
      <el-row :gutter="20">
        <!-- 订单基本信息 -->
        <el-col :span="16">
          <el-card class="info-card">
            <template v-slot:header>
              <span>订单信息</span>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="订单号">{{ order.orderNo }}</el-descriptions-item>
              <el-descriptions-item label="下单时间">{{ order.orderTime }}</el-descriptions-item>
              <el-descriptions-item label="商家名称">{{ order.merchantName }}</el-descriptions-item>
              <el-descriptions-item label="商家电话">{{
                order.merchantPhone
              }}</el-descriptions-item>
              <el-descriptions-item label="用户姓名">{{ order.userName }}</el-descriptions-item>
              <el-descriptions-item label="用户电话">{{ order.userPhone }}</el-descriptions-item>
              <el-descriptions-item label="订单状态">
                <el-tag :type="getStatusTagType(order.status)">
                  {{ getStatusText(order.status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="配送时间">{{ order.deliveryTime }}</el-descriptions-item>
              <el-descriptions-item label="备注" :span="2">{{
                order.remark || '无'
              }}</el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- 配送信息 -->
          <el-card class="info-card" style="margin-top: 20px">
            <template v-slot:header>
              <span>配送信息</span>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="配送地址">{{
                order.deliveryAddress
              }}</el-descriptions-item>
              <el-descriptions-item label="配送员">{{
                order.deliveryPerson || '未分配'
              }}</el-descriptions-item>
              <el-descriptions-item label="配送员电话">{{
                order.deliveryPersonPhone || '-'
              }}</el-descriptions-item>
              <el-descriptions-item label="预计送达">{{
                order.estimatedDeliveryTime
              }}</el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- 订单商品 -->
          <el-card class="info-card" style="margin-top: 20px">
            <template v-slot:header>
              <span>订单商品</span>
            </template>
            <el-table :data="order.items" border>
              <el-table-column prop="name" label="商品名称"></el-table-column>
              <el-table-column prop="specification" label="规格" width="120"></el-table-column>
              <el-table-column prop="quantity" label="数量" width="80"></el-table-column>
              <el-table-column prop="price" label="单价(元)" width="100">
                <template v-slot:default="{ row }"> ¥{{ row.price.toFixed(2) }} </template>
              </el-table-column>
              <el-table-column prop="subtotal" label="小计(元)" width="100">
                <template v-slot:default="{ row }"> ¥{{ row.subtotal.toFixed(2) }} </template>
              </el-table-column>
            </el-table>
          </el-card>

          <!-- 操作日志 -->
          <el-card class="info-card" style="margin-top: 20px">
            <template v-slot:header>
              <span>操作日志</span>
            </template>
            <el-timeline>
              <el-timeline-item
                v-for="(log, index) in order.logs"
                :key="index"
                :timestamp="log.time"
                :type="log.type"
              >
                {{ log.action }}
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>

        <!-- 订单状态和操作 -->
        <el-col :span="8">
          <el-card class="status-card">
            <template v-slot:header>
              <span>订单状态</span>
            </template>
            <div class="status-flow">
              <div
                v-for="(step, index) in statusFlow"
                :key="index"
                class="status-step"
                :class="{
                  active: isStepActive(step.status),
                  completed: isStepCompleted(step.status),
                }"
              >
                <div class="step-icon">
                  <i :class="step.icon"></i>
                </div>
                <div class="step-info">
                  <div class="step-title">{{ step.title }}</div>
                  <div class="step-desc">{{ step.desc }}</div>
                </div>
              </div>
            </div>
          </el-card>

          <el-card class="action-card" style="margin-top: 20px">
            <template v-slot:header>
              <span>订单操作</span>
            </template>
            <div class="action-buttons">
              <el-button
                v-if="order.status === 'paid'"
                type="primary"
                @click="handleStartPreparing"
                style="width: 100%; margin-bottom: 10px"
              >
                开始制作
              </el-button>
              <el-button
                v-if="order.status === 'preparing'"
                type="warning"
                @click="handleAssignDelivery"
                style="width: 100%; margin-bottom: 10px"
              >
                分配配送员
              </el-button>
              <el-button
                v-if="order.status === 'delivering'"
                type="success"
                @click="handleTrackDelivery"
                style="width: 100%; margin-bottom: 10px"
              >
                追踪配送
              </el-button>
              <el-button
                v-if="['paid', 'preparing'].includes(order.status)"
                type="danger"
                @click="handleCancelOrder"
                style="width: 100%; margin-bottom: 10px"
              >
                取消订单
              </el-button>
              <el-button
                v-if="order.status === 'delivering'"
                type="info"
                @click="handleContactCustomer"
                style="width: 100%; margin-bottom: 10px"
              >
                联系用户
              </el-button>
              <el-button
                v-if="order.status === 'delivering'"
                type="info"
                @click="handleContactMerchant"
                style="width: 100%; margin-bottom: 10px"
              >
                联系商家
              </el-button>
            </div>
          </el-card>

          <!-- 费用明细 -->
          <el-card class="fee-card" style="margin-top: 20px">
            <template v-slot:header>
              <span>费用明细</span>
            </template>
            <div class="fee-list">
              <div class="fee-item">
                <span>商品小计</span>
                <span>¥{{ order.subtotal.toFixed(2) }}</span>
              </div>
              <div class="fee-item">
                <span>配送费</span>
                <span>¥{{ order.deliveryFee.toFixed(2) }}</span>
              </div>
              <div class="fee-item" v-if="order.discountAmount > 0">
                <span>优惠减免</span>
                <span>-¥{{ order.discountAmount.toFixed(2) }}</span>
              </div>
              <div class="fee-total">
                <span>实付金额</span>
                <span>¥{{ order.totalAmount.toFixed(2) }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义类型
interface OrderItem {
  name: string
  specification: string
  quantity: number
  price: number
  subtotal: number
}

interface OrderLog {
  time: string
  action: string
  type: string
}

interface StatusStep {
  status: string
  title: string
  desc: string
  icon: string
}

interface Order {
  orderNo: string
  orderTime: string
  merchantName: string
  merchantPhone: string
  userName: string
  userPhone: string
  status: string
  deliveryTime: string
  estimatedDeliveryTime: string
  remark: string
  deliveryAddress: string
  deliveryPerson: string | null
  deliveryPersonPhone: string | null
  subtotal: number
  deliveryFee: number
  discountAmount: number
  totalAmount: number
  items: OrderItem[]
  logs: OrderLog[]
}

// 响应式数据
const orderId = ref<string | null>(null)
const order = reactive<Order>({
  orderNo: 'TW2024011510001',
  orderTime: '2024-01-15 10:30:00',
  merchantName: '兰州拉面',
  merchantPhone: '13800138003',
  userName: '张三',
  userPhone: '13800138001',
  status: 'delivering',
  deliveryTime: '30分钟',
  estimatedDeliveryTime: '2024-01-15 11:00:00',
  remark: '不要香菜，多加点葱',
  deliveryAddress: '东北校区第一宿舍楼A座101',
  deliveryPerson: '王师傅',
  deliveryPersonPhone: '13900139001',
  subtotal: 21.0,
  deliveryFee: 3.0,
  discountAmount: 0,
  totalAmount: 24.0,
  items: [
    {
      name: '牛肉拉面',
      specification: '大份',
      quantity: 1,
      price: 18.0,
      subtotal: 18.0,
    },
    {
      name: '小菜',
      specification: '',
      quantity: 1,
      price: 3.0,
      subtotal: 3.0,
    },
  ],
  logs: [
    {
      time: '2024-01-15 10:30:00',
      action: '用户下单',
      type: 'primary',
    },
    {
      time: '2024-01-15 10:31:00',
      action: '订单支付成功',
      type: 'success',
    },
    {
      time: '2024-01-15 10:35:00',
      action: '商家接单，开始制作',
      type: 'info',
    },
    {
      time: '2024-01-15 10:50:00',
      action: '分配配送员：王师傅',
      type: 'warning',
    },
    {
      time: '2024-01-15 10:55:00',
      action: '商品制作完成，配送员取货',
      type: 'success',
    },
  ],
})

const statusFlow = reactive<StatusStep[]>([
  {
    status: 'paid',
    title: '已支付',
    desc: '等待商家接单',
    icon: 'el-icon-success',
  },
  {
    status: 'preparing',
    title: '制作中',
    desc: '商家正在制作',
    icon: 'el-icon-time',
  },
  {
    status: 'delivering',
    title: '配送中',
    desc: '配送员正在配送',
    icon: 'el-icon-truck',
  },
  {
    status: 'completed',
    title: '已完成',
    desc: '订单已完成',
    icon: 'el-icon-circle-check',
  },
])

const route = useRoute()
const router = useRouter()

// 返回上一页
const goBack = () => {
  router.go(-1)
}

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

// 判断步骤是否激活
const isStepActive = (status: string): boolean => {
  return order.status === status
}

// 判断步骤是否已完成
const isStepCompleted = (status: string): boolean => {
  const statusOrder = ['paid', 'preparing', 'delivering', 'completed']
  const currentIndex = statusOrder.indexOf(order.status)
  const stepIndex = statusOrder.indexOf(status)
  return stepIndex < currentIndex
}

// 获取订单详情
const fetchOrderDetail = () => {
  // 这里应该是实际的API调用
  // 获取订单详情
}

// 开始制作
const handleStartPreparing = () => {
  ElMessageBox.confirm('确认开始制作订单？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info',
  }).then(() => {
    ElMessage.success('已开始制作')
    order.status = 'preparing'
  })
}

// 分配配送员
const handleAssignDelivery = () => {
  // 分配配送员逻辑
  ElMessage.info('分配配送员功能开发中')
}

// 追踪配送
const handleTrackDelivery = () => {
  // 追踪配送逻辑
  ElMessage.info('追踪配送功能开发中')
}

// 取消订单
const handleCancelOrder = () => {
  ElMessageBox.confirm('确认取消订单？取消后无法恢复。', '警告', {
    confirmButtonText: '确认取消',
    cancelButtonText: '再想想',
    type: 'warning',
  }).then(() => {
    ElMessage.success('订单已取消')
    order.status = 'cancelled'
  })
}

// 联系用户
const handleContactCustomer = () => {
  // 联系用户逻辑
  ElMessage.info('联系用户功能开发中')
}

// 联系商家
const handleContactMerchant = () => {
  // 联系商家逻辑
  ElMessage.info('联系商家功能开发中')
}

// 生命周期
onMounted(() => {
  orderId.value = route.params.id as string
  fetchOrderDetail()
})
</script>

<style scoped>
.takeout-order-detail {
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 0 20px;
  color: #303133;
}

.order-detail-container {
  min-height: 500px;
}

.info-card .el-descriptions {
  margin-bottom: 0;
}

.status-flow {
  padding: 10px 0;
}

.status-step {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #ebeef5;
}

.status-step:last-child {
  border-bottom: none;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 18px;
  color: #c0c4cc;
  background-color: #f5f7fa;
}

.status-step.completed .step-icon {
  color: #67c23a;
  background-color: #f0f9ff;
}

.status-step.active .step-icon {
  color: #409eff;
  background-color: #ecf5ff;
}

.step-info {
  flex: 1;
}

.step-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 5px;
}

.step-desc {
  font-size: 14px;
  color: #909399;
}

.action-buttons .el-button {
  margin-bottom: 10px;
}

.fee-list {
  padding: 10px 0;
}

.fee-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f5f7fa;
}

.fee-total {
  display: flex;
  justify-content: space-between;
  padding: 15px 0 0 0;
  margin-top: 10px;
  border-top: 2px solid #303133;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}
</style>
