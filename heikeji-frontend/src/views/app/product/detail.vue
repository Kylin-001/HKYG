<template>
  <div class="app-product-detail">
    <!-- 页面加载中 - 骨架屏 -->
    <div v-if="loading" class="skeleton-container">
      <!-- 商品图片骨架屏 -->
      <div class="skeleton-item product-images-skeleton">
        <div class="skeleton-main-image"></div>
        <div class="skeleton-thumbnails">
          <div class="skeleton-thumbnail-item" v-for="i in 4" :key="i"></div>
        </div>
      </div>

      <!-- 商品信息骨架屏 -->
      <div class="skeleton-item product-info-skeleton">
        <div class="skeleton-title"></div>
        <div class="skeleton-price"></div>
        <div class="skeleton-meta"></div>
        <div class="skeleton-promotions"></div>
        <div class="skeleton-specs" v-for="i in 2" :key="i"></div>
        <div class="skeleton-quantity"></div>
      </div>

      <!-- 商品详情骨架屏 -->
      <div class="skeleton-item product-detail-skeleton">
        <div class="skeleton-section-title"></div>
        <div class="skeleton-detail-content" v-for="i in 5" :key="i"></div>
      </div>

      <!-- 商品参数骨架屏 -->
      <div class="skeleton-item product-params-skeleton">
        <div class="skeleton-section-title"></div>
        <div class="skeleton-param-item" v-for="i in 8" :key="i"></div>
      </div>

      <!-- 商品评价骨架屏 -->
      <div class="skeleton-item product-reviews-skeleton">
        <div class="skeleton-section-title"></div>
        <div class="skeleton-review-stats"></div>
        <div class="skeleton-review-filter"></div>
        <div class="skeleton-review-item" v-for="i in 3" :key="i"></div>
      </div>
    </div>

    <!-- 商品详情内容 -->
    <div v-else-if="productDetail" class="product-content">
      <!-- 商品图片轮播 -->
      <div class="product-images">
        <div class="main-image">
          <img
            v-lazy="productDetail.images[currentImageIndex]"
            :alt="productDetail.name"
            @click="showImagePreview(currentImageIndex)"
          />
        </div>
        <div class="thumbnails">
          <div
            v-for="(image, index) in productDetail.images"
            :key="index"
            class="thumbnail-item"
            :class="{ active: currentImageIndex === index }"
            @click="switchImage(index)"
          >
            <img v-lazy="image" :alt="`商品图片 ${index + 1}`" />
          </div>
        </div>
      </div>

      <!-- 商品基本信息 -->
      <div class="product-info">
        <h1 class="product-title">{{ productDetail.name }}</h1>
        <div class="product-price">
          <span class="current-price">¥{{ productDetail.price.toFixed(2) }}</span>
          <span v-if="productDetail.originalPrice" class="original-price"
            >¥{{ productDetail.originalPrice.toFixed(2) }}</span
          >
        </div>
        <div class="product-meta">
          <span class="sales">销量: {{ productDetail.sales || 0 }}</span>
          <span class="stock">库存: {{ availableStock }}</span>
        </div>

        <!-- 优惠信息 -->
        <div
          v-if="productDetail.promotions && productDetail.promotions.length > 0"
          class="promotions"
        >
          <div v-for="promo in productDetail.promotions" :key="promo.id" class="promotion-item">
            <span class="promo-label">{{ promo.type }}</span>
            <span class="promo-content">{{ promo.content }}</span>
          </div>
        </div>

        <!-- 规格选择 -->
        <div v-if="productDetail.specs && productDetail.specs.length > 0" class="specs-section">
          <div
            v-for="spec in productDetail.specs"
            :key="spec.name"
            class="spec-item"
            :class="{ error: isSpecMissing(spec.name) }"
            :data-spec-name="spec.name"
          >
            <div class="spec-name">{{ spec.name }}:</div>
            <div class="spec-values">
              <div
                v-for="value in spec.values"
                :key="value"
                class="spec-value"
                :class="{
                  selected: selectedSpecs[spec.name] === value,
                  disabled: !isSpecAvailable(spec.name, value),
                }"
                :data-spec-name="spec.name"
                :data-spec-value="value"
                @click="selectSpec(spec.name, value)"
              >
                {{ value }}
              </div>
            </div>
          </div>
        </div>

        <!-- 数量选择 -->
        <div class="quantity-section">
          <div class="quantity-label">数量:</div>
          <div class="quantity-control">
            <button
              class="quantity-btn decrease"
              @click="decreaseQuantity"
              :disabled="quantity <= 1"
            >
              -
            </button>
            <input
              type="number"
              v-model="quantity"
              @input="validateQuantity"
              :min="1"
              :max="availableStock"
              class="quantity-input"
            />
            <button
              class="quantity-btn increase"
              @click="increaseQuantity"
              :disabled="quantity >= availableStock"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <!-- 商品详情和参数 -->
      <div class="product-detail-section">
        <!-- 商品详情 -->
        <div class="product-detail-content">
          <div class="section-title">商品详情</div>
          <div
            v-if="productDetail.detail"
            class="detail-html"
            v-html="productDetail.detail"
            @click="handleDetailImageClick"
          ></div>
          <div v-else class="detail-loading">
            <div class="loading-spinner"></div>
            <span>加载详情...</span>
          </div>
        </div>

        <!-- 商品参数 -->
        <div class="product-params">
          <div class="section-title">商品参数</div>
          <div class="params-list">
            <div v-for="(param, key) in productDetail.params" :key="key" class="param-item">
              <div class="param-key">{{ key }}:</div>
              <div class="param-value">{{ param }}</div>
            </div>
          </div>
        </div>

        <!-- 商品评价 -->
        <div class="product-reviews">
          <div class="section-title">商品评价</div>

          <!-- 评价统计 -->
          <div class="review-stats">
            <div class="stat-item">
              <div class="stat-value">{{ reviewStats.rate }}%</div>
              <div class="stat-label">好评率</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ reviewStats.total }}</div>
              <div class="stat-label">评价数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ reviewStats.good }}</div>
              <div class="stat-label">好评</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ reviewStats.medium }}</div>
              <div class="stat-label">中评</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ reviewStats.bad }}</div>
              <div class="stat-label">差评</div>
            </div>
          </div>

          <!-- 评价筛选 -->
          <div class="review-filter">
            <div
              v-for="filter in reviewFilters"
              :key="filter.type"
              class="filter-item"
              :class="{ active: currentReviewFilter === filter.type }"
              @click="changeReviewFilter(filter.type)"
            >
              {{ filter.text }}
            </div>
          </div>

          <!-- 评价列表 -->
          <div class="review-list">
            <!-- 加载状态 -->
            <div v-if="reviewLoading" class="review-loading">
              <div class="loading-spinner"></div>
              <span>加载评价...</span>
            </div>

            <!-- 空状态 -->
            <div v-else-if="reviews.length === 0" class="review-empty">
              <i class="el-icon-comment"></i>
              <span>暂无评价</span>
            </div>

            <!-- 评价列表 -->
            <div v-else class="reviews">
              <div v-for="review in reviews" :key="review.id" class="review-item">
                <div class="review-header">
                  <div class="review-user">
                    <div class="user-avatar">
                      <img
                        v-lazy="review.avatar || '/static/images/default-avatar.png'"
                        :alt="review.userName"
                      />
                    </div>
                    <div class="user-info">
                      <div class="user-name">{{ review.userName }}</div>
                      <div class="review-time">{{ review.createTime }}</div>
                    </div>
                  </div>
                  <div class="review-rating">
                    <i
                      v-for="star in 5"
                      :key="star"
                      class="el-icon-star"
                      :class="{ active: star <= review.rating }"
                    ></i>
                  </div>
                </div>
                <div class="review-content">{{ review.content }}</div>
                <div v-if="review.images && review.images.length > 0" class="review-images">
                  <div
                    v-for="(image, index) in review.images"
                    :key="index"
                    class="review-image"
                    @click="previewReviewImage(review.images, index)"
                  >
                    <img v-lazy="image" :alt="`评价图片 ${index + 1}`" />
                  </div>
                </div>
                <div class="review-meta">
                  <div class="review-spec">{{ review.specification }}</div>
                  <div class="review-helpful">
                    <i class="el-icon-thumb-up"></i>
                    <span>{{ review.helpfulCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 评价分页 -->
          <div v-if="reviews.length > 0" class="review-pagination">
            <el-pagination
              v-model:current-page="reviewCurrentPage"
              v-model:page-size="reviewPageSize"
              layout="total, prev, pager, next"
              :total="reviewStats.total"
              @size-change="handleReviewSizeChange"
              @current-change="handleReviewCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="bottom-action-bar">
        <div class="nav-item" @click="goToHome">
          <i class="iconfont icon-home"></i>
          <span>首页</span>
        </div>
        <div class="nav-item" @click="goToCart">
          <i class="iconfont icon-cart"></i>
          <span>购物车</span>
        </div>
        <div class="nav-item" @click="goToUserCenter">
          <i class="iconfont icon-user"></i>
          <span>我的</span>
        </div>
        <div class="action-buttons">
          <button class="action-btn add-to-cart-btn" @click="addToCart">加入购物车</button>
          <button class="action-btn buy-now-btn" @click="buyNow">立即购买</button>
        </div>
      </div>
    </div>

    <!-- 商品不存在 -->
    <div v-else class="product-not-found">
      <i class="iconfont icon-error"></i>
      <p>商品不存在或已下架</p>
      <button class="back-btn" @click="$router.back()">返回上一页</button>
    </div>

    <!-- 商品图片预览弹窗 -->
    <div v-if="showPreview" class="image-preview-overlay" @click="closePreview">
      <div class="image-preview-content" @click.stop>
        <button class="close-preview" @click="closePreview">
          <i class="el-icon-close"></i>
        </button>
        <div class="preview-images">
          <img
            v-for="(image, index) in productDetail.images"
            :key="index"
            :src="image"
            :alt="`预览图片 ${index + 1}`"
            class="preview-image"
            :class="{ active: index === previewIndex }"
          />
        </div>
        <div class="preview-thumbnails">
          <div
            v-for="(image, index) in productDetail.images"
            :key="index"
            class="preview-thumbnail"
            :class="{ active: index === previewIndex }"
            @click="previewIndex = index"
          >
            <img :src="image" :alt="`缩略图 ${index + 1}`" />
          </div>
        </div>
      </div>
    </div>

    <!-- 评价图片预览弹窗 -->
    <div
      v-if="reviewImagePreview.visible"
      class="review-image-preview-overlay"
      @click="closeReviewImagePreview"
    >
      <div class="review-image-preview-content" @click.stop>
        <div class="review-image-preview-close" @click="closeReviewImagePreview">
          <i class="el-icon-close"></i>
        </div>
        <div class="review-image-preview-nav">
          <button
            v-if="reviewImagePreview.currentIndex > 0"
            @click="switchReviewImage(reviewImagePreview.currentIndex - 1)"
          >
            <i class="el-icon-arrow-left"></i>
          </button>
          <button
            v-if="reviewImagePreview.currentIndex < reviewImagePreview.images.length - 1"
            @click="switchReviewImage(reviewImagePreview.currentIndex + 1)"
          >
            <i class="el-icon-arrow-right"></i>
          </button>
        </div>
        <img
          :src="reviewImagePreview.images[reviewImagePreview.currentIndex]"
          :alt="`评价图片 ${reviewImagePreview.currentIndex + 1}`"
        />
        <div class="review-image-preview-indicator">
          {{ reviewImagePreview.currentIndex + 1 }} / {{ reviewImagePreview.images.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductById } from '@/api/product'
import { getProductReviews, getProductReviewStats } from '@/api/app/product'
import { addToCart as addToCartApi } from '@/api/app/cart'
import logger from '@/utils/logger'

// 定义类型接口
interface ProductImage {
  id?: number
  url: string
}

interface ProductSpec {
  name: string
  values: string[]
}

interface ProductSku {
  id: number
  specs: Record<string, string> | string
  price: number
  stock: number
  image?: string
}

interface ProductPromotion {
  id: number
  type: string
  content: string
}

interface ProductDetail {
  id: number
  name: string
  price: number
  originalPrice?: number
  sales: number
  stock: number
  images: ProductImage[]
  specs?: ProductSpec[]
  skus?: ProductSku[]
  promotions?: ProductPromotion[]
  detail?: string
  params?: Record<string, any>
}

// 评价相关类型
interface ProductReview {
  id: number
  userName: string
  avatar: string
  content: string
  rating: number
  createTime: string
  images: string[]
  specification: string
  helpfulCount: number
}

interface ReviewStat {
  total: number
  rate: number
  good: number
  medium: number
  bad: number
}

interface ReviewFilter {
  type: string
  text: string
}

// 路由和响应式数据
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const productDetail = ref<ProductDetail | null>(null)
const productId = ref(route.params.id as string)

// 图片轮播相关
const currentImageIndex = ref(0)
const previewIndex = ref(0)
const showPreview = ref(false)
const startX = ref(0)
const endX = ref(0)
let swipeContainer: HTMLElement | null = null

// 规格选择相关
const selectedSpecs = reactive<Record<string, string>>({})
const selectedSku = ref<ProductSku | null>(null)
const specErrors = reactive<Record<string, boolean>>({})
const quantity = ref(1)

// 评价相关
const reviewLoading = ref(false)
const reviews = ref<ProductReview[]>([])
const reviewStats = ref<ReviewStat>({
  total: 0,
  rate: 100,
  good: 0,
  medium: 0,
  bad: 0,
})
const reviewCurrentPage = ref(1)
const reviewPageSize = ref(10)
const currentReviewFilter = ref('all')
const reviewFilters = ref<ReviewFilter[]>([
  { type: 'all', text: '全部' },
  { type: 'good', text: '好评' },
  { type: 'medium', text: '中评' },
  { type: 'bad', text: '差评' },
])

// 评价图片预览
const reviewImagePreview = ref({
  visible: false,
  images: [] as string[],
  currentIndex: 0,
})

// 计算属性：可用库存
const availableStock = computed(() => {
  if (selectedSku.value) {
    return selectedSku.value.stock
  }
  return productDetail.value?.stock || 0
})

// 加载商品详情
const loadProductDetail = async () => {
  try {
    loading.value = true

    // 尝试从缓存获取商品详情
    const cachedProduct = localStorage.getItem(`product_${productId.value}`)
    if (cachedProduct) {
      productDetail.value = JSON.parse(cachedProduct)
      initProductData()
      loading.value = false

      // 后台异步刷新商品数据
      refreshProductData()
      return
    }

    // 缓存不存在，从API获取
    const response = await getProductById(productId.value)
    productDetail.value = response.data

    // 缓存商品详情，有效期30分钟
    localStorage.setItem(`product_${productId.value}`, JSON.stringify(response.data))
    localStorage.setItem(`product_${productId.value}_expire`, Date.now() + 30 * 60 * 1000)

    initProductData()
  } catch (error) {
    logger.error('加载商品详情失败', error)
    ElMessage.error('加载商品详情失败，请重试')
  } finally {
    loading.value = false
  }
}

// 初始化商品数据
const initProductData = () => {
  if (!productDetail.value) return

  // 初始化默认选中第一个SKU（如果有）
  if (productDetail.value.skus && productDetail.value.skus.length > 0) {
    selectedSku.value = productDetail.value.skus[0]

    // 提取第一个SKU的规格作为默认选中
    if (
      productDetail.value.skus[0].specs &&
      typeof productDetail.value.skus[0].specs === 'object'
    ) {
      Object.assign(selectedSpecs, productDetail.value.skus[0].specs)
    }
  }
}

// 后台异步刷新商品数据
const refreshProductData = async () => {
  try {
    const response = await getProductById(productId.value)

    // 更新缓存
    localStorage.setItem(`product_${productId.value}`, JSON.stringify(response.data))
    localStorage.setItem(`product_${productId.value}_expire`, Date.now() + 30 * 60 * 1000)

    // 更新商品详情
    productDetail.value = response.data
    initProductData()
  } catch (error) {
    logger.error('刷新商品详情失败', error)
    // 后台刷新失败不影响用户体验
  }
}

// 选择规格
const selectSpec = (specName: string, value: string) => {
  selectedSpecs[specName] = value
  delete specErrors[specName]

  // 添加选择动画效果
  addSpecSelectionEffect(specName, value)

  // 查找匹配的SKU
  findSelectedSku()
}

// 判断规格是否可用
const isSpecAvailable = (specName: string, value: string) => {
  if (!productDetail.value || !productDetail.value.skus) return true

  // 构建当前已选规格（排除正在判断的规格）
  const currentSpecs = { ...selectedSpecs }
  currentSpecs[specName] = value

  // 检查是否有SKU匹配当前规格组合且库存大于0
  return productDetail.value.skus.some(sku => {
    try {
      // 处理新格式（对象）
      if (typeof sku.specs === 'object' && sku.specs !== null) {
        const skuSpecs = sku.specs as Record<string, string>
        return (
          Object.entries(currentSpecs).every(([name, val]) => skuSpecs[name] === val) &&
          sku.stock > 0
        )
      } else {
        // 处理旧格式（字符串）
        const currentSpecStr = Object.entries(currentSpecs)
          .map(([name, val]) => `${name}:${val}`)
          .join(',')
        return String(sku.specs).includes(currentSpecStr) && sku.stock > 0
      }
    } catch (error) {
      logger.error('规格可用性检查失败', error)
      return false
    }
  })
}

// 判断规格是否缺失
const isSpecMissing = (specName: string) => {
  return specErrors[specName]
}

// 添加规格选择动画效果
const addSpecSelectionEffect = (specName: string, value: string) => {
  const specElement = document.querySelector(
    `.spec-value[data-spec-name="${specName}"][data-spec-value="${value}"]`
  )
  if (specElement) {
    specElement.classList.add('selected-animation')
    setTimeout(() => {
      specElement.classList.remove('selected-animation')
    }, 300)
  }
}

// 查找选中的SKU
const findSelectedSku = () => {
  if (!productDetail.value || !productDetail.value.skus) return

  const specsStr = Object.entries(selectedSpecs)
    .map(([name, value]) => `${name}:${value}`)
    .sort()
    .join(',')

  const sku = productDetail.value.skus.find(sku => {
    const skuSpecsStr =
      typeof sku.specs === 'object'
        ? Object.entries(sku.specs as Record<string, string>)
            .map(([name, value]) => `${name}:${value}`)
            .sort()
            .join(',')
        : String(sku.specs).split(',').sort().join(',')

    return skuSpecsStr === specsStr
  })

  if (sku) {
    selectedSku.value = sku
  }
}

// 增加数量
const increaseQuantity = () => {
  const maxQuantity = selectedSku.value
    ? selectedSku.value.stock
    : productDetail.value?.stock || 999
  if (quantity.value < maxQuantity) {
    quantity.value++
  }
}

// 减少数量
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// 验证数量
const validateQuantity = () => {
  const maxQuantity = selectedSku.value
    ? selectedSku.value.stock
    : productDetail.value?.stock || 999
  if (quantity.value < 1) {
    quantity.value = 1
  } else if (quantity.value > maxQuantity) {
    quantity.value = maxQuantity
    ElMessage.warning(`最多只能购买${maxQuantity}件`)
  }
}

// 切换图片
const switchImage = (index: number) => {
  currentImageIndex.value = index
}

// 显示图片预览
const showImagePreview = (index: number) => {
  previewIndex.value = index
  showPreview.value = true
}

// 关闭图片预览
const closePreview = () => {
  showPreview.value = false
}

// 添加轮播手势事件
const addSwipeEvents = () => {
  const container = document.querySelector('.swiper-container') as HTMLElement
  if (!container) return

  const handleTouchStart = (e: TouchEvent) => {
    startX.value = e.touches[0].clientX
  }

  const handleTouchEnd = (e: TouchEvent) => {
    endX.value = e.changedTouches[0].clientX
    handleSwipe()
  }

  container.addEventListener('touchstart', handleTouchStart)
  container.addEventListener('touchend', handleTouchEnd)

  swipeContainer = container
}

// 移除轮播手势事件
const removeSwipeEvents = () => {
  if (swipeContainer) {
    swipeContainer.removeEventListener('touchstart', () => {})
    swipeContainer.removeEventListener('touchend', () => {})
  }
}

// 处理滑动
const handleSwipe = () => {
  const diff = endX.value - startX.value
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      // 向左滑动
      nextImage()
    } else {
      // 向右滑动
      prevImage()
    }
  }
}

// 下一张图片
const nextImage = () => {
  if (productDetail.value && productDetail.value.images && productDetail.value.images.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % productDetail.value.images.length
  }
}

// 上一张图片
const prevImage = () => {
  if (productDetail.value && productDetail.value.images && productDetail.value.images.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value - 1 + productDetail.value.images.length) %
      productDetail.value.images.length
  }
}

// 加入购物车
const addToCart = async () => {
  // 验证规格选择
  if (!validateSpecSelection()) {
    return
  }

  // 验证库存
  const maxQuantity = selectedSku.value
    ? selectedSku.value.stock
    : productDetail.value?.stock || 999
  if (quantity.value > maxQuantity) {
    ElMessage.warning(`最多只能购买${maxQuantity}件`)
    return
  }

  if (!productDetail.value) return

  try {
    // 构建规格字符串
    const specification = Object.entries(selectedSpecs)
      .map(([name, value]) => `${name}:${value}`)
      .join(', ')

    // 调用真实API加入购物车
    await addToCartApi({
      productId: productDetail.value.id,
      quantity: quantity.value,
      specification,
    })

    ElMessage.success('成功加入购物车')
    // 添加购物车数量提示动画
    showAddToCartAnimation()
  } catch (error) {
    logger.error('加入购物车失败', error)
    ElMessage.error('加入购物车失败，请重试')
  }
}

// 立即购买
const buyNow = () => {
  // 验证规格选择
  if (!validateSpecSelection()) {
    return
  }

  // 验证库存
  const maxQuantity = selectedSku.value
    ? selectedSku.value.stock
    : productDetail.value?.stock || 999
  if (quantity.value > maxQuantity) {
    ElMessage.warning(`最多只能购买${maxQuantity}件`)
    return
  }

  const skuId = selectedSku.value ? selectedSku.value.id : productDetail.value?.id
  router.push({
    path: '/app/order/checkout',
    query: {
      productId: productDetail.value?.id,
      skuId,
      quantity: quantity.value,
    },
  })
}

// 验证规格选择
const validateSpecSelection = () => {
  if (!productDetail.value?.specs) return true

  let isValid = true
  Object.keys(specErrors).forEach(key => delete specErrors[key])

  // 检查每个规格是否都已选择
  productDetail.value.specs.forEach(spec => {
    if (selectedSpecs[spec.name] === undefined) {
      specErrors[spec.name] = true
      isValid = false
    }
  })

  if (!isValid) {
    ElMessage.warning('请选择完整的商品规格')
    // 滚动到第一个未选择的规格
    scrollToFirstError()
  }

  return isValid
}

// 滚动到第一个错误的规格
const scrollToFirstError = () => {
  const firstErrorSpec = Object.keys(specErrors)[0]
  if (firstErrorSpec) {
    const specElement = document.querySelector(
      `[data-spec-name="${firstErrorSpec}"]`
    ) as HTMLElement
    if (specElement) {
      specElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

// 显示加入购物车动画
const showAddToCartAnimation = () => {
  const animation = document.createElement('div')
  animation.className = 'cart-animation'
  animation.innerHTML = `+${quantity.value}`

  // 设置动画位置（按钮位置）
  const addToCartBtn = document.querySelector('.add-to-cart-btn') as HTMLElement
  const btnRect = addToCartBtn.getBoundingClientRect()

  animation.style.left = `${btnRect.left + btnRect.width / 2}px`
  animation.style.top = `${btnRect.top + btnRect.height / 2}px`

  document.body.appendChild(animation)

  // 启动动画
  setTimeout(() => {
    animation.classList.add('active')
  }, 10)

  // 移除动画元素
  setTimeout(() => {
    document.body.removeChild(animation)
  }, 1000)
}

// 处理详情页图片点击事件
const handleDetailImageClick = (e: MouseEvent) => {
  // 检查是否点击的是图片元素
  if ((e.target as HTMLElement).tagName.toLowerCase() === 'img') {
    e.preventDefault()
    e.stopPropagation()

    const imageSrc = (e.target as HTMLImageElement).src
    // 在商品图片列表中查找对应的索引
    const imageIndex = productDetail.value?.images.findIndex(
      img => img.url === imageSrc || img.url.includes(imageSrc.split('/').pop() || '')
    )

    // 如果找到了对应的图片，显示预览
    if (imageIndex !== undefined && imageIndex !== -1) {
      showImagePreview(imageIndex)
    } else {
      // 如果没找到，使用当前点击的图片创建临时预览
      previewIndex.value = 0
      showPreview.value = true
      // 临时替换预览列表
      const originalImages = productDetail.value?.images || []
      if (productDetail.value) {
        productDetail.value.images = [{ url: imageSrc }]
      }

      // 关闭预览时恢复原始图片列表
      setTimeout(() => {
        const closeBtn = document.querySelector('.close-preview') as HTMLElement
        if (closeBtn && productDetail.value) {
          const originalCloseHandler = closeBtn.onclick
          closeBtn.onclick = () => {
            productDetail.value!.images = originalImages
            if (typeof originalCloseHandler === 'function') {
              originalCloseHandler()
            } else {
              closePreview()
            }
          }
        }
      }, 100)
    }
  }
}

// 页面导航方法
const goToHome = () => {
  router.push('/app/index')
}

const goToCart = () => {
  router.push('/app/cart')
}

const goToUserCenter = () => {
  router.push('/app/user')
}

// 评价相关方法

// 加载商品评价
const loadProductReviews = async () => {
  if (!productDetail.value) return

  try {
    reviewLoading.value = true

    // 获取评价列表
    const reviewsResponse = await getProductReviews({
      productId: productDetail.value.id,
      page: reviewCurrentPage.value,
      pageSize: reviewPageSize.value,
      type: currentReviewFilter.value,
    })

    // 获取评价统计
    const statsResponse = await getProductReviewStats(productDetail.value.id)

    // 更新评价数据
    reviews.value = reviewsResponse.data.list || []

    // 更新评价统计
    reviewStats.value = statsResponse.data || {
      total: 0,
      rate: 100,
      good: 0,
      medium: 0,
      bad: 0,
    }
  } catch (error) {
    logger.error('加载评价失败', error)
    ElMessage.error('加载评价失败，请重试')
  } finally {
    reviewLoading.value = false
  }
}

// 切换评价筛选
const changeReviewFilter = (type: string) => {
  currentReviewFilter.value = type
  reviewCurrentPage.value = 1
  loadProductReviews()
}

// 预览评价图片
const previewReviewImage = (images: string[], index: number) => {
  reviewImagePreview.value.images = images
  reviewImagePreview.value.currentIndex = index
  reviewImagePreview.value.visible = true
}

// 关闭评价图片预览
const closeReviewImagePreview = () => {
  reviewImagePreview.value.visible = false
}

// 切换评价图片
const switchReviewImage = (index: number) => {
  reviewImagePreview.value.currentIndex = index
}

// 处理评价分页大小变化
const handleReviewSizeChange = (size: number) => {
  reviewPageSize.value = size
  reviewCurrentPage.value = 1
  loadProductReviews()
}

// 处理评价当前页变化
const handleReviewCurrentChange = (page: number) => {
  reviewCurrentPage.value = page
  loadProductReviews()
}

// 生命周期钩子
onMounted(() => {
  loadProductDetail()
  addSwipeEvents()
  // 延迟加载评价，提高页面加载速度
  setTimeout(() => {
    loadProductReviews()
  }, 1000)
})

onBeforeUnmount(() => {
  removeSwipeEvents()
})
</script>

<style>
.app-product-detail {
  // 购物车动画
    .cart-animation {
    position: fixed;
    font-size: 16px;
    font-weight: bold;
    color: #f56c6c;
    z-index: 9999;
    pointer-events: none;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .cart-animation.active {
    opacity: 1;
    transform: translate(-50%, -150%) scale(0.6);
  }

  /* 商品详情富文本区域样式 */
  .product-detail-content {
    margin-top: 20px;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  }

  .section-title {
    font-size: 18px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #f56c6c;
    position: relative;
  }

  .section-title::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 2px;
    background-color: #f56c6c;
  }

  .detail-html {
    line-height: 1.8;
    color: #606266;
    font-size: 14px;
    padding: 10px 0;
  }

  .detail-html img {
    max-width: 100%;
    height: auto;
    margin: 10px 0;
    border-radius: 4px;
    transition: transform 0.3s ease;
    cursor: pointer;
    border: 1px solid #ebeef5;
    padding: 5px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .detail-html img:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .detail-html p {
    margin-bottom: 15px;
  }

  .detail-html h1,
  .detail-html h2,
  .detail-html h3,
  .detail-html h4,
  .detail-html h5,
  .detail-html h6 {
    color: #303133;
    margin: 20px 0 10px 0;
    font-weight: bold;
  }

  .detail-html ul,
  .detail-html ol {
    padding-left: 20px;
    margin-bottom: 15px;
  }

  .detail-html li {
    margin-bottom: 5px;
  }

  .detail-html table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
    border: 1px solid #ebeef5;
  }

  .detail-html th,
  .detail-html td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ebeef5;
  }

  .detail-html th {
    background-color: #f5f7fa;
    font-weight: bold;
    color: #303133;
  }

  .detail-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #909399;
    font-size: 14px;
  }

  .loading-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #ebeef5;
    border-top: 3px solid #f56c6c;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* 商品参数区域样式 */
  .product-params {
    margin-top: 20px;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  }

  .params-list {
    padding: 10px 0;
  }

  .param-item {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .param-item:last-child {
    border-bottom: none;
  }

  .param-key {
    width: 80px;
    flex-shrink: 0;
    font-weight: bold;
    color: #606266;
  }

  .param-value {
    flex: 1;
    color: #909399;
    word-break: break-word;
  }

  /* 规格选择样式 */
  .specs-section {
    margin: 20px 0;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .spec-item {
    margin-bottom: 20px;
  }

  .spec-item:last-child {
    margin-bottom: 0;
  }

  .spec-name {
    font-weight: bold;
    margin-bottom: 12px;
    color: #303133;
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  .spec-name::after {
    content: ':';
    margin-left: 5px;
  }

  .spec-values {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .spec-value {
    padding: 10px 18px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #fff;
    color: #303133;
    font-size: 13px;
    position: relative;
    overflow: hidden;
  }

  .spec-value::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.03);
    transition: left 0.3s ease;
  }

  .spec-value:hover {
    border-color: #409eff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  }

  .spec-value:hover::before {
    left: 0;
  }

  .spec-value.selected {
    border-color: #409eff;
    color: #409eff;
    background-color: #ecf5ff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
  }

  .spec-value.selected::after {
    content: '✓';
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    font-weight: bold;
  }

  .spec-value.disabled {
    color: #c0c4cc;
    border-color: #ebeef5;
    background-color: #fafafa;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .spec-value.disabled:hover {
    transform: none;
    box-shadow: none;
  }

  /* 规格选择动画 */
  .spec-value.selected-animation {
    animation: specSelect 0.3s ease;
  }

  @keyframes specSelect {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  /* 规格选择错误提示 */
  .spec-item.error .spec-name {
    color: #f56c6c;
  }

  .spec-item.error .spec-value {
    border-color: #f56c6c;
  }

  /* 商品评价区域样式 */
  .product-reviews {
    margin-top: 20px;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  }

  /* 评价统计 */
  .review-stats {
    display: flex;
    justify-content: space-around;
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 15px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-value {
    font-size: 20px;
    font-weight: bold;
    color: #f56c6c;
    margin-bottom: 5px;
  }

  .stat-label {
    font-size: 12px;
    color: #909399;
  }

  /* 评价筛选 */
  .review-filter {
    display: flex;
    justify-content: space-around;
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 15px;
  }

  .filter-item {
    padding: 8px 16px;
    border-radius: 16px;
    font-size: 14px;
    color: #606266;
    cursor: pointer;
    transition: all 0.3s;
  }

  .filter-item.active {
    background-color: #f56c6c;
    color: #fff;
  }

  /* 评价列表 */
  .review-list {
    margin-top: 15px;
  }

  .review-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    color: #909399;
  }

  .review-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    color: #909399;
  }

  .review-empty i {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  .review-item {
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .review-item:last-child {
    border-bottom: none;
  }

  /* 评价头部 */
  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
  }

  .review-user {
    display: flex;
    align-items: center;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
  }

  .user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .user-info {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-weight: bold;
    color: #303133;
    margin-bottom: 4px;
  }

  .review-time {
    font-size: 12px;
    color: #909399;
  }

  .review-rating {
    display: flex;
    align-items: center;
  }

  .review-rating i {
    font-size: 16px;
    color: #e0e0e0;
    margin-left: 4px;
  }

  .review-rating i.active {
    color: #f56c6c;
  }

  /* 评价内容 */
  .review-content {
    color: #303133;
    line-height: 1.6;
    margin-bottom: 10px;
    font-size: 14px;
  }

  /* 评价图片 */
  .review-images {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }

  .review-image {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: transform 0.3s;
  }

  .review-image:last-child {
    margin-right: 0;
  }

  .review-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .review-image:hover {
    transform: scale(1.05);
  }

  /* 评价元信息 */
  .review-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #909399;
  }

  .review-spec {
    flex: 1;
  }

  .review-helpful {
    display: flex;
    align-items: center;
  }

  .review-helpful i {
    margin-right: 4px;
  }

  /* 评价分页 */
  .review-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  /* 评价图片预览 */
  .review-image-preview-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .review-image-preview-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
  }

  .review-image-preview-content img {
    max-width: 100%;
    max-height: 90vh;
  }

  .review-image-preview-nav {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    transform: translateY(-50%);
  }

  .review-image-preview-nav button {
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 20px;
  }

  .review-image-preview-close {
    position: absolute;
    top: -40px;
    right: 0;
    color: #fff;
    font-size: 30px;
    cursor: pointer;
  }
}
/* 骨架屏样式 */
.skeleton-container {
  background-color: #fff;
  padding: 16px;
}

.skeleton-item {
  margin-bottom: 20px;
  opacity: 0.7;
  animation: skeleton-loading 1.4s infinite ease-in-out;
}

@keyframes skeleton-loading {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

/* 商品图片骨架屏 */
.product-images-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-main-image {
  width: 100%;
  height: 300px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  animation: skeleton-shimmer 1.4s infinite ease-in-out;
}

.skeleton-thumbnails {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.skeleton-thumbnail-item {
  width: 80px;
  height: 80px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  flex-shrink: 0;
  animation: skeleton-shimmer 1.4s infinite ease-in-out;
}

/* 商品信息骨架屏 */
.skeleton-title {
  width: 80%;
  height: 28px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 12px;
  animation: skeleton-shimmer 1.4s infinite ease-in-out;
}

.skeleton-price {
  width: 40%;
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 12px;
  animation: skeleton-shimmer 1.4s infinite ease-in-out;
}

.skeleton-meta {
  width: 60%;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 16px;
  animation: skeleton-shimmer 1.4s infinite ease-in-out;
}

.skeleton-promotions {
  width: 90%;
  height: 36px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 16px;
  animation: skeleton-shimmer 1.4s infinite ease-in-out;
}

.skeleton-specs {
  width: 100%;
  height: 60px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 16px;
  animation: skeleton-shimmer 1.4s infinite ease-in-out;
}

.skeleton-quantity {
  width: 40%;
  height: 40px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: skeleton-shimmer 1.4s infinite ease-in-out;
}

/* 商品详情骨架屏 */
.skeleton-section-title {
  width: 30%;
  height: 24px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 16px;
  animation: skeleton-shimmer 1.4s infinite ease-in-out;
}

.skeleton-detail-content {
  width: 100%;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 12px;
  animation: skeleton-shimmer 1.4s infinite ease-in-out;
}

.skeleton-detail-content:nth-child(2) {
  width: 90%;
}

.skeleton-detail-content:nth-child(3) {
  width: 95%;
}

.skeleton-detail-content:nth-child(4) {
  width: 85%;
}

/* 商品参数骨架屏 */
.skeleton-param-item {
  display: flex;
  margin-bottom: 12px;
}

.skeleton-param-item::before {
  content: '';
  width: 20%;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-right: 16px;
  animation: skeleton-shimmer 1.4s infinite ease-in-out;
}

.skeleton-param-item::after {
  content: '';
  width: 60%;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: skeleton-shimmer 1.4s infinite ease-in-out;
}

/* 商品评价骨架屏 */
.skeleton-review-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}

.skeleton-review-stats::before,
.skeleton-review-stats::after {
  content: '';
  width: 20%;
  height: 40px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: skeleton-shimmer 1.4s infinite ease-in-out;
}

.skeleton-review-stats::after {
  width: 50%;
}

.skeleton-review-filter {
  width: 100%;
  height: 36px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 16px;
  animation: skeleton-shimmer 1.4s infinite ease-in-out;
}

.skeleton-review-item {
  width: 100%;
  height: 100px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  margin-bottom: 16px;
  animation: skeleton-shimmer 1.4s infinite ease-in-out;
}

/* 骨架屏闪烁动画 */
@keyframes skeleton-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
