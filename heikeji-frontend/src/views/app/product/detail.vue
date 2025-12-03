<template>
  <div class="app-product-detail">
    <!-- 页面加载中 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>
    </div>

    <!-- 商品详情内容 -->
    <div v-else-if="productDetail" class="product-content">
      <!-- 商品图片轮播 -->
      <div class="product-images">
        <div class="main-image">
          <img
            :src="productDetail.images[currentImageIndex]"
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
            <img :src="image" :alt="`商品图片 ${index + 1}`" />
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

    <!-- 图片预览弹窗 -->
    <div v-if="showPreview" class="image-preview-overlay" @click="closePreview">
      <div class="image-preview-content" @click.stop>
        <button class="close-preview" @click="closePreview">
          <i class="iconfont icon-close"></i>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductById } from '@/api/product'
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
    const response = await getProductById(productId.value)
    productDetail.value = response.data

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
  } catch (error) {
    logger.error('加载商品详情失败', error)
    ElMessage.error('加载商品详情失败，请重试')
  } finally {
    loading.value = false
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

  try {
    // 模拟加入购物车API调用
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

// 生命周期钩子
onMounted(() => {
  loadProductDetail()
  addSwipeEvents()
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
}
</style>
