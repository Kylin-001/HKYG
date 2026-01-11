<!--
@fileoverview 订单卡片组件
@description 展示订单状态、时间信息、金额显示和快捷操作
@example
  <OrderCard
    :order="order"
    :show-actions="true"
    @view-detail="handleViewDetail"
    @pay="handlePay"
  />
-->
<template>
  <div
    class="order-card hover-float click-scale"
    :class="{
      disabled: disabled,
      hoverable: hoverable,
      'with-actions': showActions,
      'fade-in-up': animateOnMount,
    }"
    @click="handleClick"
  >
    <!-- 订单头部信息 -->
    <div class="order-header">
      <div class="order-main-info">
        <!-- 订单号 -->
        <div class="order-id">
          <span class="label">订单号：</span>
          <span class="value">{{ order.orderNo }}</span>
        </div>

        <!-- 订单状态 -->
        <div class="order-status">
          <StatusTag :type="getStatusTagType()" :text="getStatusText()" :size="statusTagSize" />
        </div>
      </div>

      <!-- 订单时间信息 -->
      <div class="order-time-info">
        <div v-if="order.createTime" class="time-item">
          <el-icon :size="14"><Calendar /></el-icon>
          <span>{{ formatDateTime(order.createTime) }}</span>
        </div>
        <div v-if="order.payTime" class="time-item">
          <el-icon :size="14"><Money /></el-icon>
          <span>支付：{{ formatDateTime(order.payTime) }}</span>
        </div>
        <div v-if="order.deliverTime" class="time-item">
          <el-icon :size="14"><Van /></el-icon>
          <span>发货：{{ formatDateTime(order.deliverTime) }}</span>
        </div>
        <div v-if="order.completeTime" class="time-item">
          <el-icon :size="14"><CircleCheck /></el-icon>
          <span>完成：{{ formatDateTime(order.completeTime) }}</span>
        </div>
      </div>
    </div>

    <!-- 订单商品列表 -->
    <div v-if="order.items && order.items.length > 0" class="order-items">
      <div v-for="item in order.items" :key="item.id" class="order-item">
        <div class="item-image">
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.name"
            @error="handleImageError(item)"
          />
          <div v-else class="item-image-placeholder">
            <el-icon :size="24"><PictureFilled /></el-icon>
          </div>
        </div>
        <div class="item-info">
          <div class="item-name" :title="item.name">{{ item.name }}</div>
          <div v-if="item.specification" class="item-spec" :title="item.specification">
            {{ item.specification }}
          </div>
          <div class="item-amount">
            <span class="item-price">{{ currencySymbol }}{{ formatPrice(item.price) }}</span>
            <span class="item-quantity">x {{ item.quantity }}</span>
          </div>
        </div>
      </div>

      <!-- 更多商品提示 -->
      <div v-if="order.totalItems > order.items.length" class="more-items">
        <span>共 {{ order.totalItems }} 件商品，显示 {{ order.items.length }} 件</span>
      </div>
    </div>

    <!-- 订单金额信息 -->
    <div class="order-amount">
      <div class="amount-item">
        <span class="label">商品总价：</span>
        <span class="value">{{ currencySymbol }}{{ formatPrice(order.totalAmount) }}</span>
      </div>
      <div v-if="order.discountAmount > 0" class="amount-item">
        <span class="label">优惠：</span>
        <span class="value discount"
          >-{{ currencySymbol }}{{ formatPrice(order.discountAmount) }}</span
        >
      </div>
      <div v-if="order.shippingFee > 0" class="amount-item">
        <span class="label">运费：</span>
        <span class="value">{{ currencySymbol }}{{ formatPrice(order.shippingFee) }}</span>
      </div>
      <div class="amount-item total">
        <span class="label">实付款：</span>
        <span class="value total">{{ currencySymbol }}{{ formatPrice(order.actualAmount) }}</span>
      </div>
    </div>

    <!-- 收货信息 -->
    <div v-if="order.receiverInfo" class="order-receiver">
      <el-icon :size="16"><User /></el-icon>
      <span class="receiver-name">{{ order.receiverInfo.name }}</span>
      <span class="receiver-phone">{{ order.receiverInfo.phone }}</span>
      <span class="receiver-address">{{ order.receiverInfo.address }}</span>
    </div>

    <!-- 操作按钮区域 -->
    <div v-if="showActions" class="order-actions">
      <!-- 待付款状态 -->
      <template v-if="order.status === 'pending_payment'">
        <el-button
          v-if="showCancel"
          :type="cancelButtonType"
          :size="buttonSize"
          :disabled="disabled"
          @click="handleCancel"
        >
          取消订单
        </el-button>
        <el-button
          v-if="showPay"
          :type="primaryButtonType"
          :size="buttonSize"
          :disabled="disabled"
          @click="handlePay"
        >
          立即支付
        </el-button>
      </template>

      <!-- 待发货状态 -->
      <template v-else-if="order.status === 'pending_delivery'">
        <el-button
          v-if="showRemind"
          :type="buttonType"
          :size="buttonSize"
          :disabled="disabled"
          @click="handleRemind"
        >
          提醒发货
        </el-button>
      </template>

      <!-- 待收货状态 -->
      <template v-else-if="order.status === 'pending_receipt'">
        <el-button
          v-if="showConfirm"
          :type="primaryButtonType"
          :size="buttonSize"
          :disabled="disabled"
          @click="handleConfirm"
        >
          确认收货
        </el-button>
        <el-button
          v-if="showLogistics"
          :type="buttonType"
          :size="buttonSize"
          :disabled="disabled"
          @click="handleLogistics"
        >
          查看物流
        </el-button>
      </template>

      <!-- 已完成状态 -->
      <template v-else-if="order.status === 'completed'">
        <el-button
          v-if="showReview"
          :type="buttonType"
          :size="buttonSize"
          :disabled="disabled || order.isReviewed"
          @click="handleReview"
        >
          {{ order.isReviewed ? '已评价' : '评价' }}
        </el-button>
        <el-button
          v-if="showBuyAgain"
          :type="buttonType"
          :size="buttonSize"
          :disabled="disabled"
          @click="handleBuyAgain"
        >
          再次购买
        </el-button>
      </template>

      <!-- 已取消状态 -->
      <template v-else-if="order.status === 'cancelled'">
        <el-button
          v-if="showDelete"
          :type="textButtonType"
          :size="buttonSize"
          :disabled="disabled"
          @click="handleDelete"
        >
          删除订单
        </el-button>
      </template>

      <!-- 查看详情按钮 -->
      <el-button
        v-if="showViewDetail"
        :type="textButtonType"
        :size="buttonSize"
        :disabled="disabled"
        @click="handleViewDetail"
        icon="el-icon-view"
      >
        查看详情
      </el-button>

      <!-- 自定义操作插槽 -->
      <slot name="actions" :order="order" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Calendar, Money, Van, CircleCheck, User, PictureFilled } from '@element-plus/icons-vue'
import StatusTag from '../ui/StatusTag.vue'

// 定义接口
interface OrderItem {
  id: string
  name: string
  specification?: string
  imageUrl?: string
  price: number
  quantity: number
}

interface ReceiverInfo {
  name: string
  phone: string
  address: string
}

interface Order {
  id: string
  orderNo: string
  status:
    | 'pending_payment'
    | 'pending_delivery'
    | 'pending_receipt'
    | 'completed'
    | 'cancelled'
    | 'refunded'
  createTime: string
  payTime?: string
  deliverTime?: string
  completeTime?: string
  totalAmount: number
  discountAmount: number
  shippingFee: number
  actualAmount: number
  totalItems: number
  items: OrderItem[]
  receiverInfo?: ReceiverInfo
  isReviewed?: boolean
  [key: string]: any
}

// 定义组件属性
const props = defineProps<{
  // 订单数据
  order: Order
  // 是否禁用
  disabled?: boolean
  // 是否显示悬停效果
  hoverable?: boolean
  // 是否显示操作按钮
  showActions?: boolean
  // 是否显示取消订单按钮
  showCancel?: boolean
  // 是否显示支付按钮
  showPay?: boolean
  // 是否显示提醒发货按钮
  showRemind?: boolean
  // 是否显示确认收货按钮
  showConfirm?: boolean
  // 是否显示查看物流按钮
  showLogistics?: boolean
  // 是否显示评价按钮
  showReview?: boolean
  // 是否显示再次购买按钮
  showBuyAgain?: boolean
  // 是否显示删除按钮
  showDelete?: boolean
  // 是否显示查看详情按钮
  showViewDetail?: boolean
  // 按钮类型
  buttonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
  // 主按钮类型
  primaryButtonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
  // 取消按钮类型
  cancelButtonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
  // 文本按钮类型
  textButtonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
  // 按钮大小
  buttonSize?: 'large' | 'default' | 'small'
  // 货币符号
  currencySymbol?: string
  // 状态标签大小
  statusTagSize?: 'large' | 'medium' | 'small' | 'mini'
  // 是否在挂载时显示动画
  animateOnMount?: boolean
}>()

// 定义默认值
const defaultProps = {
  disabled: false,
  hoverable: true,
  showActions: true,
  showCancel: true,
  showPay: true,
  showRemind: true,
  showConfirm: true,
  showLogistics: true,
  showReview: true,
  showBuyAgain: true,
  showDelete: true,
  showViewDetail: true,
  buttonType: 'default',
  primaryButtonType: 'primary',
  cancelButtonType: 'warning',
  textButtonType: 'text',
  buttonSize: 'small',
  currencySymbol: '¥',
  statusTagSize: 'medium',
  animateOnMount: false,
}

// 合并默认值
const mergedProps = { ...defaultProps, ...props }

// 定义事件
const emit = defineEmits<{
  (e: 'view-detail', order: Order): void
  (e: 'pay', order: Order): void
  (e: 'cancel', order: Order): void
  (e: 'remind', order: Order): void
  (e: 'confirm', order: Order): void
  (e: 'logistics', order: Order): void
  (e: 'review', order: Order): void
  (e: 'buy-again', order: Order): void
  (e: 'delete', order: Order): void
  (e: 'image-error', item: OrderItem): void
  (e: 'click', order: Order): void
}>()

// 格式化日期时间
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 格式化价格
const formatPrice = (price: number): string => {
  return price.toFixed(2)
}

// 获取状态文本
const getStatusText = (): string => {
  const statusMap: Record<string, string> = {
    pending_payment: '待付款',
    pending_delivery: '待发货',
    pending_receipt: '待收货',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款',
  }
  return statusMap[props.order.status] || '未知状态'
}

// 获取状态标签类型
const getStatusTagType = (): string => {
  const typeMap: Record<string, string> = {
    pending_payment: 'warning',
    pending_delivery: 'info',
    pending_receipt: 'primary',
    completed: 'success',
    cancelled: 'danger',
    refunded: 'danger',
  }
  return typeMap[props.order.status] || 'info'
}

// 图片加载失败处理
const handleImageError = (item: OrderItem) => {
  emit('image-error', item)
}

// 处理查看详情
const handleViewDetail = () => {
  emit('view-detail', props.order)
}

// 处理支付
const handlePay = () => {
  emit('pay', props.order)
}

// 处理取消订单
const handleCancel = () => {
  emit('cancel', props.order)
}

// 处理提醒发货
const handleRemind = () => {
  emit('remind', props.order)
}

// 处理确认收货
const handleConfirm = () => {
  emit('confirm', props.order)
}

// 处理查看物流
const handleLogistics = () => {
  emit('logistics', props.order)
}

// 处理评价
const handleReview = () => {
  emit('review', props.order)
}

// 处理再次购买
const handleBuyAgain = () => {
  emit('buy-again', props.order)
}

// 处理删除订单
const handleDelete = () => {
  emit('delete', props.order)
}

// 处理卡片点击
const handleClick = () => {
  emit('click', props.order)
}
</script>

<style lang="scss" scoped>
.order-card {
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
  cursor: pointer;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
    box-shadow: none;
  }

  &.hoverable {
    transition:
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }
  }

  &.with-actions {
    padding-bottom: 12px;
  }

  // 订单头部信息
  .order-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
    animation: fadeInUp 0.3s ease 0.1s both;

    .order-main-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;

      &:hover {
        gap: 16px;
      }

      .order-id {
        display: flex;
        align-items: center;
        gap: 4px;
        transition: all 0.3s ease;

        &:hover {
          gap: 8px;
        }

        .label {
          font-size: 14px;
          color: #606266;
        }

        .value {
          font-size: 14px;
          color: #303133;
          font-weight: 500;
        }
      }

      .order-status {
        transition: transform 0.2s ease;
        &:hover {
          transform: scale(1.05);
        }
      }
    }

    .order-time-info {
      display: flex;
      gap: 16px;
      transition: all 0.3s ease;

      &:hover {
        gap: 20px;
      }

      .time-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #909399;
        transition: all 0.3s ease;

        &:hover {
          color: var(--color-primary, #409eff);
          transform: translateX(5px);
        }
      }
    }
  }

  // 订单商品列表
  .order-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
    animation: fadeInUp 0.3s ease 0.2s both;

    .order-item {
      display: flex;
      gap: 12px;
      align-items: center;
      transition: all 0.3s ease;

      &:hover {
        gap: 16px;
        background-color: #fafafa;
        padding: 8px;
        border-radius: 6px;
      }

      .item-image {
        width: 60px;
        height: 60px;
        object-fit: contain;
        background-color: #f5f7fa;
        border-radius: 4px;
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.1);
          opacity: 0.9;
        }
      }

      .item-image-placeholder {
        width: 60px;
        height: 60px;
        background-color: #f5f7fa;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #909399;
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.1);
        }
      }

      .item-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;

        .item-name {
          font-size: 14px;
          color: #303133;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          transition: color 0.3s ease;

          &:hover {
            color: var(--color-primary, #409eff);
          }
        }

        .item-spec {
          font-size: 12px;
          color: #909399;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: color 0.3s ease;

          &:hover {
            color: var(--color-primary, #409eff);
          }
        }

        .item-amount {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
          transition: all 0.3s ease;

          &:hover {
            gap: 16px;
          }

          .item-price {
            font-size: 14px;
            color: #f56c6c;
            font-weight: 500;
            transition: transform 0.2s ease;

            &:hover {
              transform: scale(1.05);
            }
          }

          .item-quantity {
            font-size: 12px;
            color: #909399;
            transition: color 0.3s ease;

            &:hover {
              color: var(--color-primary, #409eff);
            }
          }
        }
      }
    }

    .more-items {
      font-size: 12px;
      color: #909399;
      text-align: center;
      padding-top: 8px;
      border-top: 1px dashed #ebeef5;
      transition: all 0.3s ease;

      &:hover {
        color: var(--color-primary, #409eff);
        transform: translateY(-2px);
      }
    }
  }

  // 订单金额信息
  .order-amount {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
    padding: 12px;
    background-color: #fafafa;
    border-radius: 6px;
    transition: all 0.3s ease;
    animation: fadeInUp 0.3s ease 0.3s both;

    &:hover {
      transform: translateX(-5px);
      background-color: #f5f7fa;
    }

    .amount-item {
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.3s ease;

      &:hover {
        gap: 16px;
      }

      .label {
        font-size: 14px;
        color: #606266;
        transition: all 0.3s ease;
      }

      .value {
        font-size: 14px;
        color: #303133;
        transition: all 0.3s ease;
      }

      .value.discount {
        color: #67c23a;
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.1);
        }
      }

      &.total {
        margin-top: 4px;
        padding-top: 8px;
        border-top: 1px solid #ebeef5;
        transition: all 0.3s ease;

        &:hover {
          gap: 20px;
        }

        .label {
          font-size: 14px;
          font-weight: 500;
        }

        .value.total {
          font-size: 16px;
          color: #f56c6c;
          font-weight: 600;
          transition: transform 0.2s ease;

          &:hover {
            transform: scale(1.1);
          }
        }
      }
    }
  }

  // 收货信息
  .order-receiver {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background-color: #f5f7fa;
    border-radius: 6px;
    font-size: 14px;
    color: #303133;
    transition: all 0.3s ease;
    animation: fadeInUp 0.3s ease 0.4s both;

    &:hover {
      transform: translateY(-3px);
      background-color: #e6f0ff;
    }

    .receiver-name {
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        color: var(--color-primary, #409eff);
      }
    }

    .receiver-phone {
      color: #606266;
      transition: all 0.3s ease;

      &:hover {
        color: var(--color-primary, #409eff);
      }
    }

    .receiver-address {
      flex: 1;
      color: #606266;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: 4px;
      transition: all 0.3s ease;

      &:hover {
        color: var(--color-primary, #409eff);
      }
    }
  }

  // 操作按钮区域
  .order-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    animation: fadeInUp 0.3s ease 0.5s both;

    > * {
      white-space: nowrap;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;

      &:hover {
        transform: translateY(-2px);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .order-card {
    padding: 12px;
    gap: 12px;

    .order-header {
      .order-main-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .order-time-info {
        flex-direction: column;
        gap: 4px;
        align-items: flex-start;
      }
    }

    .order-items {
      .order-item {
        .item-image {
          width: 50px;
          height: 50px;
        }

        .item-image-placeholder {
          width: 50px;
          height: 50px;
        }
      }
    }

    .order-amount {
      padding: 8px;

      .amount-item {
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
      }
    }

    .order-receiver {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      padding: 8px;

      .receiver-address {
        margin-left: 0;
        overflow: visible;
        white-space: normal;
        line-height: 1.4;
      }
    }

    .order-actions {
      flex-wrap: wrap;
      justify-content: stretch;

      > * {
        flex: 1;
      }
    }
  }
}
</style>
