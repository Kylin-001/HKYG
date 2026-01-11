<!--
@fileoverview 商品卡片组件
@description 展示商品信息、价格、库存状态和操作按钮
@example
  <ProductCard
    :product="product"
    :show-actions="true"
    @add-to-cart="handleAddToCart"
    @view-detail="handleViewDetail"
  />
-->
<template>
  <div
    class="product-card hover-float click-scale"
    :class="{
      disabled: disabled,
      hoverable: hoverable,
      'with-actions': showActions,
      'fade-in-up': animateOnMount,
    }"
    @click="handleClick"
  >
    <!-- 商品图片区域 -->
    <div class="product-image-container">
      <div class="product-image-wrapper">
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          :alt="product.name"
          class="product-image"
          @error="handleImageError"
        />
        <div v-else class="product-image-placeholder">
          <el-icon :size="48"><PictureFilled /></el-icon>
        </div>
      </div>

      <!-- 商品标签 -->
      <div v-if="product.tags && product.tags.length > 0" class="product-tags">
        <el-tag
          v-for="tag in product.tags"
          :key="tag"
          :type="getTagType(tag)"
          size="small"
          class="product-tag"
        >
          {{ tag }}
        </el-tag>
      </div>

      <!-- 库存状态 -->
      <div v-if="showStockStatus" class="stock-status">
        <StatusTag :type="getStockStatusType()" size="small" :text="getStockStatusText()" />
      </div>
    </div>

    <!-- 商品信息区域 -->
    <div class="product-info">
      <!-- 商品名称 -->
      <h3 class="product-name" :title="product.name">
        {{ product.name }}
      </h3>

      <!-- 商品描述 -->
      <p v-if="product.description" class="product-description" :title="product.description">
        {{ truncateDescription(product.description) }}
      </p>

      <!-- 商品价格 -->
      <div class="product-price">
        <span class="price-current" v-if="product.currentPrice">
          {{ currencySymbol }}{{ formatPrice(product.currentPrice) }}
        </span>
        <span v-if="product.originalPrice" class="price-original">
          {{ currencySymbol }}{{ formatPrice(product.originalPrice) }}
        </span>
        <span v-if="showDiscount" class="price-discount"> {{ calculateDiscount() }}折 </span>
      </div>

      <!-- 商品属性 -->
      <div v-if="product.attributes && product.attributes.length > 0" class="product-attributes">
        <template v-for="attr in product.attributes" :key="attr.name">
          <span class="attribute-item" :title="`${attr.name}: ${attr.value}`">
            {{ attr.name }}: {{ attr.value }}
          </span>
        </template>
      </div>

      <!-- 评分 -->
      <div v-if="showRating && product.rating" class="product-rating">
        <el-rate
          v-model="product.rating"
          :max="5"
          disabled
          show-score
          score-template="{{ value.toFixed(1) }}"
          size="small"
        />
        <span v-if="product.ratingCount" class="rating-count">({{ product.ratingCount }})</span>
      </div>

      <!-- 销量 -->
      <div v-if="showSales && product.salesCount" class="product-sales">
        <el-icon :size="14"><TrendCharts /></el-icon>
        <span>已售 {{ product.salesCount }}</span>
      </div>
    </div>

    <!-- 操作按钮区域 -->
    <div v-if="showActions" class="product-actions">
      <el-button
        v-if="showAddToCart"
        :type="buttonType"
        :size="buttonSize"
        :disabled="disabled || !product.stock || product.stock <= 0"
        @click="handleAddToCart"
        icon="el-icon-shopping-cart-plus"
      >
        加入购物车
      </el-button>

      <el-button
        v-if="showBuyNow"
        :type="primaryButtonType"
        :size="buttonSize"
        :disabled="disabled || !product.stock || product.stock <= 0"
        @click="handleBuyNow"
      >
        立即购买
      </el-button>

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
      <slot name="actions" :product="product" />
    </div>

    <!-- 底部信息区域 -->
    <div v-if="showFooter" class="product-footer">
      <slot name="footer" :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { PictureFilled, TrendCharts } from '@element-plus/icons-vue'
import StatusTag from '../ui/StatusTag.vue'

// 定义接口
interface ProductAttribute {
  name: string
  value: string
}

interface Product {
  id: string
  name: string
  description?: string
  imageUrl?: string
  currentPrice: number
  originalPrice?: number
  stock: number
  status: 'in_stock' | 'out_of_stock' | 'low_stock' | 'disabled'
  tags?: string[]
  attributes?: ProductAttribute[]
  rating?: number
  ratingCount?: number
  salesCount?: number
  [key: string]: any
}

// 定义组件属性
const props = withDefaults(
  defineProps<{
    // 商品数据
    product: Product
    // 是否禁用
    disabled?: boolean
    // 是否显示悬停效果
    hoverable?: boolean
    // 是否显示操作按钮
    showActions?: boolean
    // 是否显示添加到购物车按钮
    showAddToCart?: boolean
    // 是否显示立即购买按钮
    showBuyNow?: boolean
    // 是否显示查看详情按钮
    showViewDetail?: boolean
    // 是否显示库存状态
    showStockStatus?: boolean
    // 是否显示评分
    showRating?: boolean
    // 是否显示销量
    showSales?: boolean
    // 是否显示折扣
    showDiscount?: boolean
    // 是否显示底部信息
    showFooter?: boolean
    // 按钮类型
    buttonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
    // 主按钮类型
    primaryButtonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
    // 文本按钮类型
    textButtonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
    // 按钮大小
    buttonSize?: 'large' | 'default' | 'small'
    // 货币符号
    currencySymbol?: string
    // 描述最大长度
    descriptionMaxLength?: number
    // 图片加载失败占位符
    imagePlaceholder?: string
    // 是否在挂载时显示动画
    animateOnMount?: boolean
  }>(),
  {
    disabled: false,
    hoverable: true,
    showActions: true,
    showAddToCart: true,
    showBuyNow: true,
    showViewDetail: true,
    showStockStatus: true,
    showRating: true,
    showSales: true,
    showDiscount: true,
    showFooter: false,
    buttonType: 'default',
    primaryButtonType: 'primary',
    textButtonType: 'text',
    buttonSize: 'small',
    currencySymbol: '¥',
    descriptionMaxLength: 50,
    imagePlaceholder: '',
    animateOnMount: false,
  }
)

// 定义事件
const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void
  (e: 'buy-now', product: Product): void
  (e: 'view-detail', product: Product): void
  (e: 'image-error', product: Product): void
  (e: 'click', product: Product): void
}>()

// 图片加载失败处理
const handleImageError = () => {
  emit('image-error', props.product)
}

// 截断描述
const truncateDescription = (description: string): string => {
  if (description.length <= props.descriptionMaxLength) {
    return description
  }
  return `${description.substring(0, props.descriptionMaxLength)}...`
}

// 格式化价格
const formatPrice = (price: number): string => {
  return price.toFixed(2)
}

// 计算折扣
const calculateDiscount = (): string => {
  if (!props.product.originalPrice || props.product.originalPrice <= 0) {
    return '10'
  }
  const discount = (props.product.currentPrice / props.product.originalPrice) * 10
  return discount.toFixed(1)
}

// 获取标签类型
const getTagType = (tag: string): string => {
  const tagLower = tag.toLowerCase()
  if (tagLower.includes('新') || tagLower.includes('新品')) {
    return 'success'
  }
  if (tagLower.includes('热') || tagLower.includes('热销')) {
    return 'warning'
  }
  if (tagLower.includes('限时') || tagLower.includes('促销')) {
    return 'danger'
  }
  if (tagLower.includes('推荐')) {
    return 'primary'
  }
  return 'info'
}

// 获取库存状态类型
const getStockStatusType = (): string => {
  switch (props.product.status) {
    case 'in_stock':
      return 'success'
    case 'out_of_stock':
      return 'danger'
    case 'low_stock':
      return 'warning'
    case 'disabled':
      return 'info'
    default:
      return 'info'
  }
}

// 获取库存状态文本
const getStockStatusText = (): string => {
  switch (props.product.status) {
    case 'in_stock':
      return `库存: ${props.product.stock}`
    case 'out_of_stock':
      return '缺货'
    case 'low_stock':
      return `库存紧张: ${props.product.stock}`
    case 'disabled':
      return '已下架'
    default:
      return `库存: ${props.product.stock}`
  }
}

// 处理添加到购物车
const handleAddToCart = () => {
  emit('add-to-cart', props.product)
}

// 处理立即购买
const handleBuyNow = () => {
  emit('buy-now', props.product)
}

// 处理查看详情
const handleViewDetail = () => {
  emit('view-detail', props.product)
}

// 处理卡片点击
const handleClick = () => {
  emit('click', props.product)
}
</script>

<style lang="scss" scoped>
.product-card {
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
      transform: translateY(-5px);
    }
  }

  &.with-actions {
    padding-bottom: 12px;
  }

  // 商品图片区域
  .product-image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    background-color: #f5f7fa;
    border-radius: 8px;
    overflow: hidden;

    .product-image-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: scale(1.05);
      }

      .product-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          transform: scale(1.1);
        }
      }

      .product-image-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f7fa;
        color: #909399;
      }
    }

    .product-tags {
      position: absolute;
      top: 8px;
      left: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      z-index: 10;

      .product-tag {
        margin: 0;
        animation: fadeInLeft 0.3s ease;
      }
    }

    .stock-status {
      position: absolute;
      bottom: 8px;
      left: 8px;
      z-index: 10;
      animation: fadeInRight 0.3s ease;
    }
  }

  // 商品信息区域
  .product-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;

    .product-name {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
      margin: 0;
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

    .product-description {
      font-size: 14px;
      color: #606266;
      margin: 0;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .product-price {
      display: flex;
      align-items: center;
      gap: 8px;
      animation: fadeInUp 0.3s ease 0.1s both;

      .price-current {
        font-size: 20px;
        font-weight: 600;
        color: #f56c6c;
        transition: transform 0.2s ease;

        &:hover {
          transform: scale(1.05);
        }
      }

      .price-original {
        font-size: 14px;
        color: #909399;
        text-decoration: line-through;
      }

      .price-discount {
        font-size: 12px;
        color: #f56c6c;
        background-color: rgba(245, 108, 108, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        transition: all 0.3s ease;

        &:hover {
          background-color: rgba(245, 108, 108, 0.2);
          transform: scale(1.1);
        }
      }
    }

    .product-attributes {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      animation: fadeInUp 0.3s ease 0.2s both;

      .attribute-item {
        font-size: 12px;
        color: #909399;
        background-color: #f5f7fa;
        padding: 2px 8px;
        border-radius: 4px;
        white-space: nowrap;
        transition: all 0.3s ease;

        &:hover {
          background-color: #e6f0ff;
          color: var(--color-primary, #409eff);
          transform: translateY(-2px);
        }
      }
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      animation: fadeInUp 0.3s ease 0.3s both;

      .rating-count {
        font-size: 12px;
        color: #909399;
      }
    }

    .product-sales {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #909399;
      animation: fadeInUp 0.3s ease 0.4s both;
      transition: all 0.3s ease;

      &:hover {
        color: var(--color-primary, #409eff);
        transform: translateX(5px);
      }
    }
  }

  // 操作按钮区域
  .product-actions {
    display: flex;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    animation: fadeInUp 0.3s ease 0.5s both;

    > * {
      flex: 1;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;

      &:hover {
        transform: translateY(-2px);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }

  // 底部信息区域
  .product-footer {
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    font-size: 12px;
    color: #909399;
    animation: fadeInUp 0.3s ease 0.6s both;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .product-card {
    padding: 12px;

    .product-info {
      .product-name {
        font-size: 14px;
      }

      .product-price {
        .price-current {
          font-size: 18px;
        }
      }
    }

    .product-actions {
      flex-direction: column;

      > * {
        width: 100%;
      }
    }
  }
}
</style>
