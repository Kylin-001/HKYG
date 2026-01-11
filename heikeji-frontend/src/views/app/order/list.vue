<template>
  <div class="order-list-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">我的订单</div>
      </div>
    </div>

    <!-- 订单状态筛选 -->
    <div class="status-filter">
      <div
        v-for="status in statusList"
        :key="status.value"
        class="filter-item"
        :class="{ active: currentStatus === status.value }"
        @click="changeStatus(status.value)"
      >
        <span class="status-text">{{ status.text }}</span>
        <span v-if="status.count > 0" class="status-count">{{ status.count }}</span>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-loading-spinner></el-loading-spinner>
        <span>正在加载...</span>
      </div>

      <!-- 空状态 -->
      <div v-else-if="orderList.length === 0" class="empty-container">
        <i class="el-icon-document"></i>
        <p>暂无订单</p>
        <button class="go-shopping-btn" @click="goShopping">去购物</button>
      </div>

      <!-- 订单列表 -->
      <div v-else class="orders">
        <div v-for="order in orderList" :key="order.id" class="order-item">
          <!-- 订单头部 -->
          <div class="order-header">
            <div class="order-info">
              <span class="order-time">{{ order.createTime }}</span>
              <span class="order-number">订单号：{{ order.orderSn }}</span>
            </div>
            <div class="order-status" :class="`status-${order.status}`">
              {{ getStatusText(order.status) }}
            </div>
          </div>

          <!-- 商品列表 -->
          <div class="order-goods">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="goods-item"
              @click="goToDetail(order.id)"
            >
              <div class="goods-image">
                <img
                  v-lazy="item.mainImage || '/static/images/default-product.png'"
                  :alt="item.productName"
                />
              </div>
              <div class="goods-info">
                <div class="goods-name">{{ item.productName }}</div>
                <div class="goods-spec">{{ item.specification }}</div>
                <div class="goods-price">¥{{ item.price }}</div>
              </div>
              <div class="goods-quantity">x{{ item.quantity }}</div>
            </div>
          </div>

          <!-- 订单底部 -->
          <div class="order-footer">
            <div class="order-total">
              <span>共 {{ order.totalQuantity }} 件商品 合计：</span>
              <span class="total-price">¥{{ order.totalAmount }}</span>
            </div>
            <div class="order-actions">
              <button
                v-if="order.status === 10"
                class="action-btn cancel-btn"
                @click="handleCancelOrder(order.id)"
              >
                取消订单
              </button>
              <button
                v-if="order.status === 10"
                class="action-btn pay-btn"
                @click="goToPay(order.id)"
              >
                立即支付
              </button>
              <button
                v-if="order.status === 20"
                class="action-btn remind-btn"
                @click="handleRemindShip(order.id)"
              >
                提醒发货
              </button>
              <button
                v-if="order.status === 30"
                class="action-btn confirm-btn"
                @click="handleConfirmReceipt(order.id)"
              >
                确认收货
              </button>
              <button
                v-if="order.status === 40"
                class="action-btn evaluate-btn"
                @click="goToEvaluate(order.id)"
              >
                去评价
              </button>
              <button
                v-if="order.status === 50"
                class="action-btn again-btn"
                @click="buyAgain(order.id)"
              >
                再次购买
              </button>
              <button class="action-btn detail-btn" @click="goToDetail(order.id)">订单详情</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="orderList.length > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  getOrderList,
  cancelOrder,
  confirmReceipt,
  remindShip,
  getOrderStatusStats,
} from '@/api/app/order'

// 初始化路由
const router = useRouter()

// 加载状态
const loading = ref(false)

// 当前状态
const currentStatus = ref('all')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 订单列表
const orderList = ref([])

// 状态列表
const statusList = ref([
  { value: 'all', text: '全部', count: 0 },
  { value: '10', text: '待付款', count: 0 },
  { value: '20', text: '待发货', count: 2 },
  { value: '30', text: '待收货', count: 1 },
  { value: '40', text: '待评价', count: 0 },
  { value: '50', text: '已完成', count: 0 },
])

// 根据状态值获取状态文本
const getStatusText = (status: number) => {
  const statusMap = {
    10: '待付款',
    20: '待发货',
    30: '待收货',
    40: '待评价',
    50: '已完成',
    60: '已取消',
  }
  return statusMap[status] || '未知状态'
}

// 切换状态
const changeStatus = (status: string) => {
  currentStatus.value = status
  currentPage.value = 1
  loadOrders()
}

// 加载订单列表
const loadOrders = async () => {
  loading.value = true

  try {
    // 调用真实API获取订单列表
    const response = await getOrderList({
      page: currentPage.value,
      pageSize: pageSize.value,
      status: currentStatus.value === 'all' ? undefined : currentStatus.value,
    })

    orderList.value = response.data.list || []
    total.value = response.data.total || 0
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
    orderList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 加载订单状态统计
const loadOrderStats = async () => {
  try {
    const response = await getOrderStatusStats()
    const stats = response.data || {}

    // 更新状态列表中的数量
    statusList.value.forEach(status => {
      if (status.value === 'all') {
        status.count = Object.values(stats).reduce((total, count) => total + count, 0)
      } else {
        status.count = stats[status.value] || 0
      }
    })
  } catch (error) {
    console.error('获取订单状态统计失败:', error)
  }
}

// 取消订单
const handleCancelOrder = async (orderId: number) => {
  try {
    await cancelOrder(orderId, '用户取消')
    ElMessage.success('取消订单成功')
    // 重新加载订单列表和状态统计
    loadOrders()
    loadOrderStats()
  } catch (error) {
    console.error('取消订单失败:', error)
    ElMessage.error('取消订单失败')
  }
}

// 去支付
const goToPay = (orderId: number) => {
  router.push(`/app/payment?orderId=${orderId}`)
}

// 提醒发货
const handleRemindShip = async (orderId: number) => {
  try {
    await remindShip(orderId)
    ElMessage.success('提醒发货成功')
  } catch (error) {
    console.error('提醒发货失败:', error)
    ElMessage.error('提醒发货失败')
  }
}

// 确认收货
const handleConfirmReceipt = async (orderId: number) => {
  ElMessage.confirm('确定要确认收货吗？', '确认收货', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await confirmReceipt(orderId)
        ElMessage.success('确认收货成功')
        // 重新加载订单列表和状态统计
        loadOrders()
        loadOrderStats()
      } catch (error) {
        console.error('确认收货失败:', error)
        ElMessage.error('确认收货失败')
      }
    })
    .catch(() => {
      // 取消操作
    })
}

// 去评价
const goToEvaluate = (orderId: number) => {
  ElMessage.info('去评价功能开发中')
}

// 再次购买
const buyAgain = (orderId: number) => {
  ElMessage.info('再次购买功能开发中')
}

// 查看订单详情
const goToDetail = (orderId: number) => {
  router.push(`/app/order/detail/${orderId}`)
}

// 去购物
const goShopping = () => {
  router.push('/app/product/list')
}

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadOrders()
}

// 处理当前页变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadOrders()
}

// 组件挂载时加载订单列表和状态统计
onMounted(() => {
  loadOrders()
  loadOrderStats()
})
</script>

<style scoped>
.order-list-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 60px;
}

/* 页面头部 */
.page-header {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 状态筛选 */
.status-filter {
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 50px;
  z-index: 99;
}

.filter-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  cursor: pointer;
  position: relative;
  font-size: 14px;
  color: #666;
  transition: all 0.3s;
}

.filter-item.active {
  color: #409eff;
  border-bottom: 2px solid #409eff;
}

.status-count {
  background-color: #f56c6c;
  color: #fff;
  font-size: 10px;
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  margin-left: 4px;
  padding: 0 4px;
}

/* 订单列表 */
.order-list {
  padding: 8px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-container span {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #999;
}

.empty-container i {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-container p {
  margin-bottom: 24px;
}

.go-shopping-btn {
  padding: 10px 24px;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.go-shopping-btn:hover {
  background-color: #66b1ff;
}

/* 订单项 */
.order-item {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 订单头部 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.order-info {
  font-size: 14px;
  color: #666;
}

.order-time {
  margin-right: 16px;
}

.order-status {
  font-size: 14px;
  font-weight: bold;
}

.status-10 {
  color: #e6a23c;
}

.status-20 {
  color: #409eff;
}

.status-30 {
  color: #67c23a;
}

.status-40 {
  color: #909399;
}

.status-50 {
  color: #606266;
}

.status-60 {
  color: #909399;
}

/* 订单商品 */
.order-goods {
  padding: 12px 16px;
}

.goods-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
}

.goods-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.goods-image {
  width: 80px;
  height: 80px;
  margin-right: 12px;
  border-radius: 4px;
  overflow: hidden;
}

.goods-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-info {
  flex: 1;
  min-width: 0;
}

.goods-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40px;
}

.goods-spec {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.goods-price {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}

.goods-quantity {
  font-size: 14px;
  color: #666;
}

/* 订单底部 */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.order-total {
  font-size: 14px;
  color: #666;
}

.total-price {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  background-color: #fff;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.cancel-btn {
  color: #909399;
  border-color: #dcdfe6;
}

.pay-btn {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}

.pay-btn:hover {
  background-color: #f78989;
  border-color: #f78989;
  color: #fff;
}

.confirm-btn {
  color: #409eff;
  border-color: #409eff;
}

.evaluate-btn {
  color: #67c23a;
  border-color: #67c23a;
}

.again-btn {
  color: #e6a23c;
  border-color: #e6a23c;
}

.detail-btn {
  color: #909399;
  border-color: #dcdfe6;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  background-color: #fff;
  margin-top: 8px;
  border-radius: 8px;
}
</style>
