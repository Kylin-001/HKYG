<template>
  <div class="order-detail-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单详情</span>
        <el-button-group>
          <el-button size="small" @click="handlePrint" :loading="printLoading">打印订单</el-button>
          <el-button size="small" @click="handleExport" :loading="exportLoading"
            >导出订单</el-button
          >
          <el-button size="small" type="primary" @click="$router.back()">返回列表</el-button>
        </el-button-group>
      </div>

      <!-- 加载中状态 -->
      <el-row v-if="loading" type="flex" justify="center" align="middle" style="height: 300px">
        <el-col>
          <el-loading-spinner type="snake" :size="40" />
          <p style="margin-top: 20px; text-align: center">加载中...</p>
        </el-col>
      </el-row>

      <!-- 订单信息 -->
      <div v-else-if="orderInfo" class="order-content">
        <!-- 订单状态卡片 -->
        <el-card class="order-status-card" shadow="hover">
          <el-row :gutter="20">
            <el-col :span="18">
              <div class="order-status-info">
                <h3 class="order-status-title">
                  订单 #{{ orderInfo.orderNo }} 状态：
                  <el-tag :type="getStatusType(orderInfo.orderStatus)" size="large">
                    {{ getStatusText(orderInfo.orderStatus) }}
                  </el-tag>
                </h3>
                <p class="order-create-time">
                  创建时间：{{ formatDateTime(orderInfo.createTime) }}
                </p>
                <div v-if="orderActions.length > 0" class="order-actions">
                  <el-button
                    v-for="action in orderActions"
                    :key="action.type"
                    :type="action.type === 'primary' ? 'primary' : ''"
                    :loading="action.loading"
                    size="small"
                    @click="handleOrderAction(action)"
                  >
                    {{ action.text }}
                  </el-button>
                </div>
                <!-- 退款进度提示 -->
                <div
                  v-if="orderInfo.orderStatus === 6 && orderInfo.refundInfo"
                  class="refund-progress-tip"
                >
                  <el-progress
                    :percentage="getRefundProgressPercentage"
                    :color="getRefundProgressColor"
                    :status="getRefundProgressStatus"
                    :format="formatRefundProgress"
                  ></el-progress>
                  <p class="progress-text">{{ getRefundProgressText }}</p>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="order-amount-info">
                <p class="total-amount-label">实付金额：</p>
                <p class="total-amount-value">¥{{ orderInfo.actualAmount.toFixed(2) }}</p>
                <p class="total-goods-count">共{{ orderInfo.totalCount }}件商品</p>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- 订单状态时间线 -->
        <el-card class="order-timeline-card mt-20" shadow="hover">
          <div slot="header" class="card-header">
            <span class="card-title"><i class="el-icon-time"></i> 订单进度</span>
          </div>
          <div class="order-timeline">
            <div class="timeline-item active">
              <div class="timeline-dot"></div>
              <div class="timeline-line"></div>
              <div class="timeline-content">
                <p class="timeline-title">订单创建</p>
                <p class="timeline-description">您的订单已提交，等待确认</p>
                <p class="timeline-time">{{ formatDateTime(orderInfo.createTime) }}</p>
              </div>
            </div>
            <div class="timeline-item" :class="{ active: orderInfo.orderStatus >= 2 }">
              <div class="timeline-dot"></div>
              <div class="timeline-line"></div>
              <div class="timeline-content">
                <p class="timeline-title">支付成功</p>
                <p class="timeline-description">感谢您的支付，我们将尽快处理您的订单</p>
                <p class="timeline-time">
                  {{ orderInfo.paymentTime ? formatDateTime(orderInfo.paymentTime) : '待支付' }}
                </p>
              </div>
            </div>
            <div class="timeline-item" :class="{ active: orderInfo.orderStatus >= 3 }">
              <div class="timeline-dot"></div>
              <div class="timeline-line"></div>
              <div class="timeline-content">
                <p class="timeline-title">商品发货</p>
                <p class="timeline-description">
                  {{
                    orderInfo.logisticsInfo
                      ? `${orderInfo.logisticsInfo.expressCompany} 已揽件`
                      : '商家正在备货'
                  }}
                </p>
                <p class="timeline-time">
                  {{ orderInfo.shipTime ? formatDateTime(orderInfo.shipTime) : '待发货' }}
                </p>
              </div>
            </div>
            <div class="timeline-item" :class="{ active: orderInfo.orderStatus >= 4 }">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <p class="timeline-title">交易完成</p>
                <p class="timeline-description">感谢您的购买，期待您的好评</p>
                <p class="timeline-time">
                  {{ orderInfo.completeTime ? formatDateTime(orderInfo.completeTime) : '待完成' }}
                </p>
              </div>
            </div>
          </div>
        </el-card>

        <el-row :gutter="20" class="mt-20">
          <el-col :span="16">
            <!-- 商品信息 -->
            <el-card class="goods-info-card" shadow="hover">
              <template v-slot:header>
                <div class="card-header">
                  <span class="card-title">商品信息</span>
                </div>
              </template>
              <el-table
                :data="orderInfo.orderItems"
                style="width: 100%"
                border
                :show-summary="true"
                :summary-method="getOrderItemsSummary"
                height="400"
              >
                <el-table-column prop="productImage" label="商品图片" width="100">
                  <template v-slot:default="scope">
                    <el-image
                      :src="scope.row.productImage"
                      fit="cover"
                      style="width: 80px; height: 80px"
                    ></el-image>
                  </template>
                </el-table-column>
                <el-table-column prop="productName" label="商品名称" min-width="200">
                  <template v-slot:default="scope">
                    {{ scope.row.productName }}
                    <div v-if="scope.row.skuAttributes" class="sku-attributes">
                      {{ scope.row.skuAttributes }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="单价" width="120" align="right">
                  <template v-slot:default="scope">¥{{ scope.row.price.toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="quantity" label="数量" width="80" align="center">
                  <template v-slot:default="scope">{{ scope.row.quantity }}</template>
                </el-table-column>
                <el-table-column prop="totalPrice" label="小计" width="120" align="right">
                  <template v-slot:default="scope">¥{{ scope.row.totalPrice.toFixed(2) }}</template>
                </el-table-column>
              </el-table>
            </el-card>

            <!-- 支付信息 -->
            <el-card v-if="orderInfo.paymentInfo" class="payment-info-card mt-20" shadow="hover">
              <template v-slot:header>
                <div class="card-header">
                  <span class="card-title">支付信息</span>
                </div>
              </template>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="支付方式">{{
                  orderInfo.paymentInfo.paymentMethodText
                }}</el-descriptions-item>
                <el-descriptions-item label="支付金额"
                  >¥{{ orderInfo.paymentInfo.amount.toFixed(2) }}</el-descriptions-item
                >
                <el-descriptions-item label="交易流水号">{{
                  orderInfo.paymentInfo.transactionId
                }}</el-descriptions-item>
                <el-descriptions-item label="支付时间">{{
                  formatDateTime(orderInfo.paymentInfo.paymentTime)
                }}</el-descriptions-item>
                <el-descriptions-item label="支付状态">
                  <el-tag type="success">已支付</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>

            <!-- 物流信息 -->
            <el-card
              v-if="orderInfo.logisticsInfo"
              class="logistics-info-card mt-20"
              shadow="hover"
            >
              <template v-slot:header>
                <div class="card-header">
                  <span class="card-title">物流信息</span>
                  <el-button
                    v-if="orderInfo.logisticsInfo.trackingNumber"
                    size="small"
                    @click="handleViewLogistics"
                  >
                    查看物流详情
                  </el-button>
                </div>
              </template>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="物流公司">{{
                  orderInfo.logisticsInfo.expressCompany
                }}</el-descriptions-item>
                <el-descriptions-item label="物流单号">{{
                  orderInfo.logisticsInfo.trackingNumber
                }}</el-descriptions-item>
                <el-descriptions-item label="发货时间">{{
                  formatDateTime(orderInfo.logisticsInfo.shipTime)
                }}</el-descriptions-item>
                <el-descriptions-item label="物流状态">
                  <el-tag :type="getLogisticsStatusType(orderInfo.logisticsInfo.status)">
                    {{ getLogisticsStatusText(orderInfo.logisticsInfo.status) }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>

          <el-col :span="8">
            <!-- 收货信息 -->
            <el-card class="shipping-info-card" shadow="hover">
              <template v-slot:header>
                <div class="card-header">
                  <span class="card-title">收货信息</span>
                </div>
              </template>
              <el-descriptions :column="1" border>
                <el-descriptions-item label="收货人">{{
                  orderInfo.shippingInfo.receiverName
                }}</el-descriptions-item>
                <el-descriptions-item label="联系电话">{{
                  orderInfo.shippingInfo.receiverPhone
                }}</el-descriptions-item>
                <el-descriptions-item label="收货地址">{{
                  orderInfo.shippingInfo.fullAddress
                }}</el-descriptions-item>
                <el-descriptions-item label="买家留言">{{
                  orderInfo.shippingInfo.buyerMessage || '无'
                }}</el-descriptions-item>
              </el-descriptions>
            </el-card>

            <!-- 订单金额 -->
            <el-card class="order-price-card mt-20" shadow="hover">
              <template v-slot:header>
                <div class="card-header">
                  <span class="card-title">订单金额</span>
                </div>
              </template>
              <div class="price-details">
                <div class="price-row">
                  <span class="price-label">商品金额：</span>
                  <span class="price-value">¥{{ orderInfo.goodsAmount.toFixed(2) }}</span>
                </div>
                <div class="price-row">
                  <span class="price-label">运费：</span>
                  <span class="price-value">¥{{ orderInfo.expressFee.toFixed(2) }}</span>
                </div>
                <div class="price-row" v-if="orderInfo.couponAmount > 0">
                  <span class="price-label">优惠券：</span>
                  <span class="price-value negative"
                    >-¥{{ orderInfo.couponAmount.toFixed(2) }}</span
                  >
                </div>
                <div class="price-row" v-if="orderInfo.pointsAmount > 0">
                  <span class="price-label">积分抵扣：</span>
                  <span class="price-value negative"
                    >-¥{{ orderInfo.pointsAmount.toFixed(2) }}</span
                  >
                </div>
                <div class="price-row total-price-row">
                  <span class="price-label total-label">实付金额：</span>
                  <span class="price-value total-value"
                    >¥{{ orderInfo.actualAmount.toFixed(2) }}</span
                  >
                </div>
              </div>
            </el-card>

            <!-- 订单信息 -->
            <el-card class="order-meta-card mt-20" shadow="hover">
              <template v-slot:header>
                <div class="card-header">
                  <span class="card-title">订单信息</span>
                </div>
              </template>
              <el-descriptions :column="1" border>
                <el-descriptions-item label="订单编号">{{
                  orderInfo.orderNo
                }}</el-descriptions-item>
                <el-descriptions-item label="下单时间">{{
                  formatDateTime(orderInfo.createTime)
                }}</el-descriptions-item>
                <el-descriptions-item label="支付时间">{{
                  orderInfo.paymentTime ? formatDateTime(orderInfo.paymentTime) : '未支付'
                }}</el-descriptions-item>
                <el-descriptions-item label="发货时间">{{
                  orderInfo.shipTime ? formatDateTime(orderInfo.shipTime) : '未发货'
                }}</el-descriptions-item>
                <el-descriptions-item label="完成时间">{{
                  orderInfo.completeTime ? formatDateTime(orderInfo.completeTime) : '未完成'
                }}</el-descriptions-item>
                <el-descriptions-item label="用户ID">{{ orderInfo.userId }}</el-descriptions-item>
                <el-descriptions-item label="用户姓名">{{
                  orderInfo.userName
                }}</el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 订单不存在 -->
      <el-row v-else type="flex" justify="center" align="middle" style="height: 300px">
        <el-col>
          <div class="order-not-found">
            <i class="el-icon-document-remove" style="font-size: 48px; color: #909399"></i>
            <p style="margin-top: 20px; text-align: center">订单不存在或已被删除</p>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 物流详情对话框 -->
    <el-dialog title="物流详情" v-model="logisticsDialogVisible" width="800px" top="10%">
      <div v-if="logisticsDetails" class="logistics-timeline">
        <div
          v-for="(item, index) in logisticsDetails"
          :key="index"
          class="logistics-item"
          :class="{ 'first-item': index === 0 }"
        >
          <div class="logistics-dot"></div>
          <div class="logistics-line" v-if="index !== logisticsDetails.length - 1"></div>
          <div class="logistics-content">
            <p class="logistics-time">{{ formatDateTime(item.time) }}</p>
            <p class="logistics-description">{{ item.description }}</p>
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="logisticsDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 订单操作对话框 -->
    <el-dialog :title="currentActionTitle" v-model="actionDialogVisible" width="500px">
      <el-form
        :model="actionForm"
        :rules="actionFormRules"
        ref="actionFormRef"
        label-width="100px"
        v-if="currentActionType === 'refund' || currentActionType === 'rejectRefund'"
      >
        <el-form-item label="操作原因" prop="reason">
          <el-input
            v-model="actionForm.reason"
            type="textarea"
            rows="3"
            placeholder="请输入操作原因"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="actionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmOrderAction">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入必要的API和类型
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox, ElPrompt } from 'element-plus'
import { FormInstance } from 'element-plus'

// 导入日志工具
import logger from '@/utils/logger'
import notificationService from '@/utils/notification-service'

// 类型定义
interface LogisticsItem {
  time: string
  description: string
}

interface OrderItem {
  productImage: string
  productName: string
  skuAttributes?: string
  price: number
  quantity: number
  totalPrice: number
}

interface PaymentInfo {
  paymentMethodText: string
  amount: number
  transactionId: string
  paymentTime: string
}

interface LogisticsInfo {
  expressCompany: string
  trackingNumber: string
  shipTime: string
  status: number
}

interface ShippingInfo {
  receiverName: string
  receiverPhone: string
  fullAddress: string
  buyerMessage?: string
}

interface RefundInfo {
  status: string
  reason?: string
}

interface OrderInfo {
  orderNo: string
  orderStatus: number
  createTime: string
  actualAmount: number
  totalCount: number
  orderItems: OrderItem[]
  paymentInfo?: PaymentInfo
  logisticsInfo?: LogisticsInfo
  shippingInfo: ShippingInfo
  refundInfo?: RefundInfo
  paymentTime?: string
  shipTime?: string
  completeTime?: string
  userId: string
  userName: string
  goodsAmount: number
  expressFee: number
  couponAmount?: number
  pointsAmount?: number
}

interface ActionForm {
  reason: string
}

interface OrderAction {
  text: string
  type: string
  action: string
  loading: boolean
}

// 响应式数据
const loading = ref(true)
const printLoading = ref(false)
const exportLoading = ref(false)
const orderInfo = ref<OrderInfo | null>(null)
const orderId = ref('')
const logisticsDialogVisible = ref(false)
const logisticsDetails = ref<LogisticsItem[] | null>(null)
const actionDialogVisible = ref(false)
const currentActionType = ref('')
const currentActionTitle = ref('')
const actionForm = reactive<ActionForm>({ reason: '' })
const orderActions = ref<OrderAction[]>([])

// 表单引用
const actionFormRef = ref<FormInstance | null>(null)

// 路由和状态管理
const route = useRoute()
const router = useRouter()
const store = useStore()

// 表单规则
const actionFormRules = reactive({
  reason: [
    { required: true, message: '请输入操作原因', trigger: 'blur' },
    { max: 200, message: '原因长度不能超过200个字符', trigger: 'blur' },
  ],
})

// 生命周期钩子
onMounted(() => {
  // 获取订单ID
  orderId.value = (route.params.id as string) || (route.query.id as string)
  if (orderId.value) {
    fetchOrderDetail()
  } else {
    loading.value = false
  }
})

// 获取订单详情
async function fetchOrderDetail() {
  loading.value = true
  try {
    orderInfo.value = await store.dispatch('order/getOrderDetail', orderId.value)
    // 根据订单状态设置可用操作
    setOrderActions()
  } catch (error) {
    logger.error('获取订单详情失败', error)
    ElMessage.error('获取订单详情失败')
    orderInfo.value = null
  } finally {
    loading.value = false
  }
}

// 设置订单操作按钮
function setOrderActions() {
  if (!orderInfo.value) return

  orderActions.value = []
  switch (orderInfo.value.orderStatus) {
    case 1: // 待支付
      orderActions.value.push(
        { text: '立即支付', type: 'primary', action: 'pay', loading: false },
        { text: '提醒付款', type: 'warning', action: 'remind', loading: false },
        { text: '取消订单', type: 'danger', action: 'cancel', loading: false }
      )
      break
    case 2: // 待发货
      orderActions.value.push({ text: '发货', type: 'primary', action: 'ship', loading: false })
      break
    case 3: // 待收货
      orderActions.value.push(
        { text: '查看物流', type: '', action: 'logistics', loading: false },
        { text: '确认收货', type: 'primary', action: 'confirm', loading: false },
        { text: '申请退款', type: 'warning', action: 'applyRefund', loading: false }
      )
      break
    case 4: // 已完成
      orderActions.value.push({
        text: '申请售后',
        type: 'warning',
        action: 'applyRefund',
        loading: false,
      })
      break
    case 6: // 退款中
      orderActions.value.push(
        { text: '同意退款', type: 'primary', action: 'refund', loading: false },
        { text: '拒绝退款', type: 'danger', action: 'rejectRefund', loading: false },
        { text: '查看退款详情', type: '', action: 'viewRefundDetail', loading: false }
      )
      break
  }
}

// 获取订单状态文本
function getStatusText(status: number): string {
  const statusMap: Record<number, string> = {
    1: '待支付',
    2: '待发货',
    3: '待收货',
    4: '已完成',
    5: '已取消',
    6: '退款中',
    7: '已退款',
  }
  return statusMap[status] || '未知状态'
}

// 获取订单状态标签类型
function getStatusType(status: number): string {
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

// 获取退款进度百分比
const getRefundProgressPercentage = computed(() => {
  if (!orderInfo.value || !orderInfo.value.refundInfo) return 0

  const refundStatus = orderInfo.value.refundInfo.status
  const statusProgress: Record<string, number> = {
    APPLIED: 25,
    REVIEWING: 50,
    APPROVED: 75,
    REFUNDED: 100,
    REJECTED: 0,
  }

  return statusProgress[refundStatus] || 0
})

// 获取退款进度颜色
const getRefundProgressColor = computed(() => {
  if (!orderInfo.value || !orderInfo.value.refundInfo) return '#909399'

  const refundStatus = orderInfo.value.refundInfo.status
  if (refundStatus === 'REJECTED') {
    return '#f56c6c'
  }
  return '#409eff'
})

// 获取退款进度状态
const getRefundProgressStatus = computed(() => {
  if (!orderInfo.value || !orderInfo.value.refundInfo) return 'exception'

  const refundStatus = orderInfo.value.refundInfo.status
  if (refundStatus === 'REFUNDED') {
    return 'success'
  } else if (refundStatus === 'REJECTED') {
    return 'exception'
  }
  return 'active'
})

// 格式化退款进度显示
function formatRefundProgress(percentage: number): string {
  if (!orderInfo.value || !orderInfo.value.refundInfo) return ''

  const refundStatus = orderInfo.value.refundInfo.status
  const statusText: Record<string, string> = {
    APPLIED: '已申请',
    REVIEWING: '审核中',
    APPROVED: '已通过',
    REFUNDED: '已退款',
    REJECTED: '已拒绝',
  }

  return statusText[refundStatus] || ''
}

// 获取退款进度文本说明
const getRefundProgressText = computed(() => {
  if (!orderInfo.value || !orderInfo.value.refundInfo) return ''

  const refundStatus = orderInfo.value.refundInfo.status
  const statusDescriptions: Record<string, string> = {
    APPLIED: '您的退款申请已提交，等待商家审核',
    REVIEWING: '商家正在审核您的退款申请，预计1-3个工作日内完成',
    APPROVED: '退款申请已通过，正在处理退款',
    REFUNDED: '退款已成功，资金将在1-7个工作日内原路返回',
    REJECTED: '退款申请未通过，请查看拒绝原因或联系客服',
  }

  return statusDescriptions[refundStatus] || '退款处理中'
})

// 获取物流状态文本
function getLogisticsStatusText(status: number): string {
  const statusMap: Record<number, string> = {
    1: '待发货',
    2: '已发货',
    3: '运输中',
    4: '已签收',
    5: '已退件',
  }
  return statusMap[status] || '未知状态'
}

// 获取物流状态标签类型
function getLogisticsStatusType(status: number): string {
  const typeMap: Record<number, string> = {
    1: 'warning',
    2: 'info',
    3: 'primary',
    4: 'success',
    5: 'danger',
  }
  return typeMap[status] || 'info'
}

// 格式化日期时间
function formatDateTime(date: string): string {
  if (!date) return '--'
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

// 获取订单商品汇总
function getOrderItemsSummary(data: OrderItem[]): any[] {
  let totalQuantity = 0
  let totalPrice = 0
  data.forEach(row => {
    totalQuantity += row.quantity
    totalPrice += row.totalPrice
  })
  return [
    { colSpan: 3, rowSpan: 1, children: [{ type: 'selection', rowSpan: 1 }] },
    {
      colSpan: 1,
      rowSpan: 1,
      children: [{ text: '合计', rowSpan: 1, style: { fontWeight: 'bold' } }],
    },
    {
      colSpan: 1,
      rowSpan: 1,
      children: [{ text: `共${totalQuantity}件商品`, rowSpan: 1, style: { fontWeight: 'bold' } }],
    },
    {
      colSpan: 1,
      rowSpan: 1,
      children: [
        {
          text: `¥${totalPrice.toFixed(2)}`,
          rowSpan: 1,
          style: { fontWeight: 'bold', color: '#f56c6c' },
        },
      ],
    },
  ]
}

// 处理订单操作
function handleOrderAction(action: OrderAction) {
  if (action.loading) return
  action.loading = true
  switch (action.action) {
    case 'pay':
      handlePayOrder()
      break
    case 'remind':
      handleRemindPay()
      break
    case 'cancel':
      handleCancelOrder()
      break
    case 'ship':
      handleShipOrder()
      break
    case 'logistics':
      handleViewLogistics()
      break
    case 'confirm':
      handleConfirmReceive()
      break
    case 'refund':
      handleAgreeRefund()
      break
    case 'rejectRefund':
      handleRejectRefund()
      break
    case 'applyRefund':
      handleApplyRefund()
      break
    case 'viewRefundDetail':
      handleViewRefundDetail()
      break
  }
  // 模拟异步操作，100ms后重置按钮状态
  setTimeout(() => {
    action.loading = false
  }, 100)
}

// 立即支付
function handlePayOrder() {
  // 跳转到支付页面
  router.push(`/order/payment/${orderId.value}`)
}

// 提醒付款
function handleRemindPay() {
  ElMessageBox.confirm('确定要提醒用户付款吗？', '提醒', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage.success('提醒成功')
    })
    .catch(() => {
      ElMessage.info('已取消操作')
    })
}

// 取消订单
async function handleCancelOrder() {
  ElMessageBox.confirm('确定要取消订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger',
  })
    .then(async () => {
      try {
        await store.dispatch('order/cancelOrder', orderId.value)
        if (orderInfo.value) {
          orderInfo.value.orderStatus = 5
        }
        ElMessage.success('订单已取消')
        setOrderActions()
      } catch (error) {
        logger.error('取消订单失败', error)
        ElMessage.error('取消订单失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消操作')
    })
}

// 发货
function handleShipOrder() {
  ElPrompt.prompt('请输入物流单号', '发货', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入物流单号',
    inputValidator: value => {
      if (!value || value.trim() === '') {
        return '请输入物流单号'
      }
      return true
    },
  })
    .then(async ({ value }) => {
      try {
        await store.dispatch('order/shipOrder', {
          orderId: orderId.value,
          trackingNumber: value.trim(),
        })
        if (orderInfo.value) {
          orderInfo.value.orderStatus = 3
          orderInfo.value.logisticsInfo = {
            trackingNumber: value.trim(),
            expressCompany: '待更新',
            shipTime: new Date().toISOString(),
            status: 2,
          }
        }
        ElMessage.success('发货成功')
        setOrderActions()
      } catch (error) {
        logger.error('发货失败', error)
        ElMessage.error('发货失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消操作')
    })
}

// 查看物流
async function handleViewLogistics() {
  logisticsDialogVisible.value = true
  try {
    logisticsDetails.value = await store.dispatch('order/getLogisticsDetail', orderId.value)
  } catch (error) {
    logger.error('获取物流详情失败', error)
    ElMessage.error('获取物流详情失败')
  }
}

// 确认收货
async function handleConfirmReceive() {
  ElMessageBox.confirm('确认用户已收到商品吗？', '确认收货', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await store.dispatch('order/confirmReceive', orderId.value)
        if (orderInfo.value) {
          orderInfo.value.orderStatus = 4
          orderInfo.value.completeTime = new Date().toISOString()
        }
        ElMessage.success('确认收货成功')
        setOrderActions()
      } catch (error) {
        logger.error('确认收货失败', error)
        ElMessage.error('确认收货失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消操作')
    })
}

// 同意退款
function handleAgreeRefund() {
  currentActionType.value = 'refund'
  currentActionTitle.value = '同意退款'
  actionForm.reason = ''
  actionDialogVisible.value = true
}

// 拒绝退款
function handleRejectRefund() {
  currentActionType.value = 'rejectRefund'
  currentActionTitle.value = '拒绝退款'
  actionForm.reason = ''
  actionDialogVisible.value = true
}

// 用户申请退款
function handleApplyRefund() {
  // 先显示退款政策说明
  ElMessageBox.confirm(
    `<div>
      <h4 style="margin-bottom: 10px;">退款政策说明：</h4>
      <ul style="text-align: left; margin-bottom: 10px; padding-left: 20px;">
        <li>未发货订单可全额退款</li>
        <li>已发货订单需等待商品退回后处理</li>
        <li>退款处理时间一般为1-3个工作日</li>
        <li>特殊商品可能有额外退款限制</li>
      </ul>
      <p style="text-align: left;">确认继续申请退款吗？</p>
    </div>`,
    '退款申请',
    {
      confirmButtonText: '确认申请',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: true,
    }
  ).then(() => {
    // 跳转到退款申请页面
    router.push({
      path: '/order/refund/apply',
      query: { orderId: orderId.value },
    })
  })
}

// 查看退款详情
function handleViewRefundDetail() {
  router.push({
    path: '/order/refund/detail',
    query: { orderId: orderId.value },
  })
}

// 确认操作
async function confirmOrderAction() {
  if (!actionFormRef.value) return

  actionFormRef.value.validate(async valid => {
    if (valid) {
      try {
        if (currentActionType.value === 'refund') {
          await store.dispatch('order/agreeRefund', {
            orderId: orderId.value,
            reason: actionForm.reason,
          })
          if (orderInfo.value) {
            orderInfo.value.orderStatus = 7
          }
          ElMessage.success('退款处理成功')
        } else if (currentActionType.value === 'rejectRefund') {
          await store.dispatch('order/rejectRefund', {
            orderId: orderId.value,
            reason: actionForm.reason,
          })
          if (orderInfo.value) {
            orderInfo.value.orderStatus = 3
          }
          ElMessage.success('已拒绝退款')
        }
        actionDialogVisible.value = false
        setOrderActions()
      } catch (error) {
        logger.error('操作失败', error)
        ElMessage.error('操作失败')
      }
    }
  })
}

// 打印订单
function handlePrint() {
  printLoading.value = true
  try {
    // 创建打印样式
    const printStyle = document.createElement('style')
    printStyle.setAttribute('media', 'print')
    printStyle.textContent = `
      body { font-family: Arial, sans-serif; }
      .no-print { display: none; }
      .order-detail-card { page-break-inside: avoid; margin-bottom: 20px; }
      .order-content { padding: 20px; }
    `
    document.head.appendChild(printStyle)

    // 延迟执行打印，确保样式生效
    setTimeout(() => {
      window.print()
      // 移除打印样式
      document.head.removeChild(printStyle)
      printLoading.value = false
    }, 100)
  } catch (error) {
    logger.error('打印订单失败', error)
    ElMessage.error('打印失败，请重试')
    printLoading.value = false
  }
}

// 导出订单
async function handleExport() {
  exportLoading.value = true
  try {
    // 模拟导出操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 在实际项目中，这里应该调用后端API导出订单数据
    ElMessage.success('订单已导出')
  } catch (error) {
    logger.error('导出订单失败', error)
    ElMessage.error('导出失败，请重试')
  } finally {
    exportLoading.value = false
  }
}
</script>

<style scoped>
.order-detail-container {
  padding: 20px;
}

.order-status-card {
  margin-bottom: 20px;
}

.order-status-info {
  padding: 10px 0;
}

.order-status-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #303133;
}

.order-create-time {
  color: #606266;
  margin: 0 0 15px 0;
}

.order-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.refund-progress-tip {
  width: 100%;
  margin-top: 15px;
  padding: 15px;
  background-color: #f0f9ff;
  border-radius: 4px;
}

.progress-text {
  margin-top: 10px;
  font-size: 12px;
  color: #606266;
  text-align: left;
}

.refund-progress-tip .el-progress {
  margin-bottom: 5px;
}

.order-amount-info {
  text-align: right;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.total-amount-label {
  color: #606266;
  margin: 0 0 5px 0;
}

.total-amount-value {
  font-size: 24px;
  font-weight: bold;
  color: #e6a23c;
  margin: 0 0 5px 0;
}

.total-goods-count {
  color: #909399;
  margin: 0;
}

.mt-20 {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-weight: bold;
}

.sku-attributes {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.price-details {
  padding: 10px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
}

.price-row:last-child {
  border-bottom: none;
}

.price-label {
  color: #606266;
}

.price-value {
  color: #303133;
  font-weight: 500;
}

.price-value.negative {
  color: #f56c6c;
}

.total-price-row {
  border-top: 2px solid #e6a23c;
  margin-top: 10px;
  padding-top: 15px;
}

.total-label {
  font-weight: bold;
  color: #303133;
}

.total-value {
  font-size: 18px;
  font-weight: bold;
  color: #e6a23c;
}

.logistics-timeline {
  position: relative;
  padding: 20px 0;
}

.logistics-item {
  position: relative;
  padding-left: 30px;
  margin-bottom: 20px;
}

.logistics-item:first-child {
  margin-top: 10px;
}

.logistics-dot {
  position: absolute;
  left: 6px;
  top: 6px;
  width: 8px;
  height: 8px;
  background-color: #409eff;
  border-radius: 50%;
}

.logistics-item:first-child .logistics-dot {
  background-color: #67c23a;
  width: 12px;
  height: 12px;
  left: 4px;
  top: 4px;
}

.logistics-line {
  position: absolute;
  left: 10px;
  top: 18px;
  width: 2px;
  height: calc(100% + 10px);
  background-color: #e4e7ed;
}

.logistics-item:last-child .logistics-line {
  display: none;
}

.logistics-content {
  padding: 5px 0;
}

.logistics-time {
  color: #909399;
  font-size: 12px;
  margin: 0 0 5px 0;
}

.logistics-description {
  color: #606266;
  margin: 0;
  line-height: 1.5;
}

.order-not-found {
  text-align: center;
  padding: 40px 0;
}

.dialog-footer {
  text-align: center;
}

.order-content {
  padding: 0;
}
/* 订单时间线样式 */
.order-timeline-card {
  margin-bottom: 20px;
}

.order-timeline {
  position: relative;
  padding: 20px 0;
}

.timeline-item {
  position: relative;
  padding-left: 50px;
  margin-bottom: 30px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-item:last-child .timeline-line {
  display: none;
}

.timeline-dot {
  position: absolute;
  left: 18px;
  top: 5px;
  width: 16px;
  height: 16px;
  background-color: #dcdfe6;
  border-radius: 50%;
  border: 3px solid #f5f7fa;
  transition: all 0.3s;
}

.timeline-line {
  position: absolute;
  left: 25px;
  top: 25px;
  width: 2px;
  height: calc(100% + 15px);
  background-color: #dcdfe6;
  transition: all 0.3s;
}

.timeline-item.active .timeline-dot {
  background-color: #409eff;
  border-color: #ecf5ff;
}

.timeline-item.active .timeline-line {
  background-color: #409eff;
}

.timeline-content {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.timeline-item.active .timeline-content {
  background: #ecf5ff;
  border-left: 4px solid #409eff;
}

.timeline-title {
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  font-size: 16px;
}

.timeline-description {
  color: #606266;
  margin-bottom: 8px;
  line-height: 1.5;
}

.timeline-time {
  font-size: 12px;
  color: #909399;
}

/* 商品图片预览样式 */
.el-image-viewer__img {
  max-width: 100%;
  max-height: 100%;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .order-detail-container {
    padding: 10px;
  }

  .order-status-card .el-row {
    flex-direction: column;
  }

  .order-status-card .el-col {
    width: 100% !important;
  }

  .order-amount-info {
    text-align: left !important;
    margin-top: 20px;
  }

  .timeline-item {
    padding-left: 40px;
  }

  .timeline-dot {
    left: 13px;
  }

  .timeline-line {
    left: 20px;
  }
}

/* 打印样式 */
@media print {
  .no-print {
    display: none !important;
  }

  .el-card {
    box-shadow: none;
    border: 1px solid #e4e7ed;
  }

  .order-detail-container {
    padding: 0;
  }
}
</style>
