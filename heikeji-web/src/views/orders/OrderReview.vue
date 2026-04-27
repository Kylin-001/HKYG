<template>
  <div class="page min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-gray-800">
          订单评价
        </h1>
        <el-button
          round
          class="!rounded-full !px-5"
          @click="$router.back()"
        >
          <el-icon><ArrowLeft /></el-icon>返回
        </el-button>
      </div>

      <div class="max-w-2xl mx-auto">
        <!-- 订单信息卡片 -->
        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-6 mb-6">
          <div class="flex items-center gap-4">
            <img
              :src="orderInfo.merchantLogo"
              :alt="orderInfo.merchantName"
              class="w-16 h-16 rounded-xl object-cover"
            >
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-gray-800">
                {{ orderInfo.merchantName }}
              </h2>
              <p class="text-sm text-gray-500 mt-1">
                订单号：{{ orderInfo.orderId }}
              </p>
              <p class="text-sm text-gray-500">
                下单时间：{{ orderInfo.orderTime }}
              </p>
            </div>
          </div>
        </div>

        <!-- 评价表单 -->
        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-6">
            为商家评分
          </h3>

          <!-- 综合评分 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              综合评分
            </label>
            <el-rate
              v-model="reviewForm.rating"
              :max="5"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              void-color="#C6D1DE"
              size="large"
            />
            <p class="text-sm text-gray-500 mt-1">
              {{ ratingText }}
            </p>
          </div>

          <!-- 分项评分 -->
          <div class="space-y-4 mb-6">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">菜品质量</span>
              <el-rate
                v-model="reviewForm.foodRating"
                :max="5"
                size="small"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">配送速度</span>
              <el-rate
                v-model="reviewForm.deliveryRating"
                :max="5"
                size="small"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">服务态度</span>
              <el-rate
                v-model="reviewForm.serviceRating"
                :max="5"
                size="small"
              />
            </div>
          </div>

          <!-- 评价内容 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              评价内容
            </label>
            <el-input
              v-model="reviewForm.content"
              type="textarea"
              :rows="4"
              placeholder="分享您的用餐体验，帮助其他用户做出选择..."
              maxlength="500"
              show-word-limit
            />
          </div>

          <!-- 快捷标签 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              快捷标签
            </label>
            <div class="flex flex-wrap gap-2">
              <el-check-tag
                v-for="tag in quickTags"
                :key="tag"
                :checked="reviewForm.tags.includes(tag)"
                @change="toggleTag(tag)"
              >
                {{ tag }}
              </el-check-tag>
            </div>
          </div>

          <!-- 匿名评价 -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-700">匿名评价</span>
            <el-switch v-model="reviewForm.isAnonymous" />
          </div>
        </div>

        <!-- 商品评价 -->
        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-6">
            评价商品
          </h3>

          <div class="space-y-4">
            <div
              v-for="item in orderInfo.items"
              :key="item.id"
              class="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-16 h-16 rounded-lg object-cover"
              >
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-800">
                  {{ item.name }}
                </h4>
                <p class="text-xs text-gray-500 mt-1">
                  x{{ item.quantity }}
                </p>
              </div>
              <el-rate
                v-model="itemRatings[item.id]"
                :max="5"
                size="small"
              />
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="flex gap-4">
          <el-button
            type="primary"
            size="large"
            class="flex-1 !rounded-full"
            :loading="submitting"
            @click="submitReview"
          >
            提交评价
          </el-button>
          <el-button
            size="large"
            class="!rounded-full"
            @click="$router.back()"
          >
            取消
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useOrderStore } from '@/stores/order'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const orderId = computed(() => route.params.orderId as string)
const submitting = ref(false)

// 订单信息（模拟数据）
const orderInfo = ref({
  orderId: orderId.value,
  merchantName: '一食堂快餐',
  merchantLogo: '/images/merchants/merchant-1.jpg',
  orderTime: '2024-01-15 12:30:00',
  items: [
    { id: 1, name: '红烧肉套餐', image: '/images/dishes/红烧肉.jpg', quantity: 1 },
    { id: 2, name: '清炒时蔬', image: '/images/dishes/清炒时蔬.jpg', quantity: 1 },
  ]
})

// 评价表单
const reviewForm = ref({
  rating: 5,
  foodRating: 5,
  deliveryRating: 5,
  serviceRating: 5,
  content: '',
  tags: [] as string[],
  isAnonymous: false,
})

// 商品评分
const itemRatings = ref<Record<number, number>>({})

// 快捷标签
const quickTags = [
  '味道好',
  '分量足',
  '配送快',
  '包装精美',
  '服务态度好',
  '性价比高',
  '食材新鲜',
  '会回购',
]

// 评分文本
const ratingText = computed(() => {
  const texts = ['非常差', '差', '一般', '好', '非常好']
  return texts[reviewForm.value.rating - 1] || ''
})

// 切换标签
const toggleTag = (tag: string) => {
  const index = reviewForm.value.tags.indexOf(tag)
  if (index > -1) {
    reviewForm.value.tags.splice(index, 1)
  } else {
    reviewForm.value.tags.push(tag)
  }
}

// 提交评价
const submitReview = async () => {
  if (reviewForm.value.rating === 0) {
    ElMessage.warning('请为商家评分')
    return
  }

  submitting.value = true
  try {
    // 构建评价数据
    const reviewData = {
      orderId: orderId.value,
      ...reviewForm.value,
      itemRatings: itemRatings.value,
      createTime: new Date().toISOString(),
    }

    console.log('提交评价:', reviewData)

    // 调用 API 提交评价
    // await orderStore.submitReview(reviewData)

    ElMessage.success('评价提交成功！')
    router.back()
  } catch (error) {
    ElMessage.error('评价提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  // 获取订单详情
  // const orderDetail = await orderStore.getOrderDetail(orderId.value)
  // orderInfo.value = orderDetail
})
</script>

<style scoped>
.page {
  min-height: 100vh;
}
</style>
