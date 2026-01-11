<template>
  <div class="evaluate-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left" @click="goBack">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="header-title">评价商品</div>
        <div class="header-right">
          <ElButton type="primary" :loading="submitting" @click="submitEvaluation"
            >提交评价</ElButton
          >
        </div>
      </div>
    </div>

    <!-- 订单信息 -->
    <div class="order-info-section" v-if="orderInfo">
      <div class="section-title">订单信息</div>
      <div class="info-item">
        <span class="info-label">订单编号</span>
        <span class="info-value">{{ orderInfo.orderSn }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">购买时间</span>
        <span class="info-value">{{ orderInfo.createTime }}</span>
      </div>
    </div>

    <!-- 评价商品列表 -->
    <div class="evaluation-section">
      <div class="section-title">评价商品</div>
      <div class="evaluation-list">
        <div v-for="(item, index) in evaluationItems" :key="item.id" class="evaluation-item">
          <div class="goods-info">
            <div class="goods-image">
              <img
                v-lazy="item.mainImage || '/static/images/default-product.png'"
                :alt="item.productName"
              />
            </div>
            <div class="goods-detail">
              <div class="goods-name">{{ item.productName }}</div>
              <div class="goods-spec">{{ item.specification }}</div>
              <div class="goods-price">¥{{ item.price }}</div>
              <div class="goods-quantity">x{{ item.quantity }}</div>
            </div>
          </div>

          <!-- 评分 -->
          <div class="rating-section">
            <div class="rating-label">商品评分：</div>
            <div class="rating-stars">
              <ElRate
                v-model="item.rating"
                :max="5"
                show-score
                text-color="#ff9900"
                score-template="{value} 分"
              />
            </div>
          </div>

          <!-- 评价内容 -->
          <div class="content-section">
            <div class="content-label">评价内容：</div>
            <ElInput
              v-model="item.content"
              type="textarea"
              :rows="4"
              placeholder="请输入您的评价内容，分享您的购物体验..."
            ></ElInput>
          </div>

          <!-- 上传图片 -->
          <div class="images-section">
            <div class="images-label">上传图片（最多5张）：</div>
            <ElUpload
              v-model:file-list="item.images"
              class="image-uploader"
              action=""
              :auto-upload="false"
              :on-change="(file, fileList) => handleImageChange(file, fileList, index)"
              :on-remove="(file, fileList) => handleImageRemove(file, fileList, index)"
              list-type="picture-card"
              :limit="5"
            >
              <ElIcon><Plus /></ElIcon>
              <template #file="{ file }">
                <div class="uploaded-image">
                  <img :src="file.url || file.thumbUrl" alt="" />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file, index)"
                    >
                      <ElIcon><ZoomIn /></ElIcon>
                    </span>
                    <span class="el-upload-list__item-delete" @click="handleRemove(file, index)">
                      <ElIcon><Delete /></ElIcon>
                    </span>
                  </span>
                </div>
              </template>
            </ElUpload>
          </div>

          <!-- 是否匿名评价 -->
          <div class="anonymous-section">
            <ElCheckbox v-model="item.anonymous">匿名评价</ElCheckbox>
          </div>
        </div>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="submit-section">
      <ElButton
        type="primary"
        :loading="submitting"
        @click="submitEvaluation"
        class="submit-button"
      >
        提交评价
      </ElButton>
    </div>

    <!-- 图片预览 -->
    <ElDialog v-model="dialogVisible" title="图片预览" width="50%">
      <img v-if="dialogImageUrl" :src="dialogImageUrl" alt="Preview" style="width: 100%" />
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ElMessage,
  ElRate,
  ElInput,
  ElUpload,
  ElCheckbox,
  ElButton,
  ElDialog,
  ElIcon,
} from 'element-plus'
import { Plus, ZoomIn, Delete } from '@element-plus/icons-vue'
import { getOrderDetail } from '@/api/app/order'

// 初始化路由
const router = useRouter()
const route = useRoute()

// 订单ID
const orderId = ref(route.params.id || '')

// 加载状态
const loading = ref(true)
const submitting = ref(false)
const error = ref('')

// 订单信息
const orderInfo = ref({
  id: 0,
  orderSn: '',
  createTime: '',
  items: [],
})

// 评价商品列表
const evaluationItems = ref([])

// 图片预览
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

// 处理图片变化
const handleImageChange = (file, fileList, index) => {
  evaluationItems.value[index].images = fileList
}

// 处理图片移除
const handleImageRemove = (file, fileList, index) => {
  evaluationItems.value[index].images = fileList
}

// 处理图片预览
const handlePictureCardPreview = (file, index) => {
  dialogImageUrl.value = file.url || file.thumbUrl
  dialogVisible.value = true
}

// 处理图片删除
const handleRemove = (file, index) => {
  const item = evaluationItems.value[index]
  const fileIndex = item.images.findIndex(f => f.uid === file.uid)
  if (fileIndex > -1) {
    item.images.splice(fileIndex, 1)
  }
}

// 加载订单详情
const loadOrderDetail = async () => {
  if (!orderId.value) {
    error.value = '订单ID无效'
    loading.value = false
    return
  }

  try {
    const response = await getOrderDetail(orderId.value)
    orderInfo.value = response.data

    // 初始化评价商品列表
    evaluationItems.value = response.data.items.map(item => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      specification: item.specification,
      price: item.price,
      quantity: item.quantity,
      mainImage: item.mainImage,
      rating: 5, // 默认5分
      content: '',
      images: [],
      anonymous: false,
    }))
  } catch (err: any) {
    error.value = err.message || '加载订单详情失败'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

// 提交评价
const submitEvaluation = async () => {
  // 验证评价内容
  for (const item of evaluationItems.value) {
    if (item.content.trim().length < 10) {
      ElMessage.error('评价内容不能少于10个字符')
      return
    }
  }

  submitting.value = true

  try {
    // 这里应该调用提交评价的API
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))

    ElMessage.success('评价提交成功')
    router.push(`/app/order/detail/${orderId.value}`)
  } catch (err: any) {
    ElMessage.error(err.message || '评价提交失败')
  } finally {
    submitting.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 组件挂载时加载数据
onMounted(() => {
  loadOrderDetail()
})
</script>

<style scoped>
.evaluate-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 20px;
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

.header-left,
.header-right {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header-right {
  width: auto;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 通用区域样式 */
.order-info-section,
.evaluation-section {
  background-color: #fff;
  margin: 8px;
  padding: 16px;
  border-radius: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

/* 订单信息 */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
}

/* 评价商品列表 */
.evaluation-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.evaluation-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

/* 商品信息 */
.goods-info {
  display: flex;
  margin-bottom: 16px;
}

.goods-image {
  width: 80px;
  height: 80px;
  margin-right: 16px;
  border-radius: 4px;
  overflow: hidden;
}

.goods-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-detail {
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
  margin-bottom: 4px;
}

.goods-quantity {
  font-size: 14px;
  color: #666;
}

/* 评分 */
.rating-section {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.rating-label {
  font-size: 14px;
  color: #666;
  margin-right: 16px;
}

.rating-stars {
  flex: 1;
}

/* 评价内容 */
.content-section {
  margin-bottom: 16px;
}

.content-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: block;
}

.content-section :deep(.el-textarea) {
  width: 100%;
}

/* 上传图片 */
.images-section {
  margin-bottom: 16px;
}

.images-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: block;
}

.image-uploader :deep(.el-upload--picture-card) {
  width: 80px;
  height: 80px;
}

.uploaded-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 匿名评价 */
.anonymous-section {
  margin-top: 16px;
}

/* 提交按钮 */
.submit-section {
  margin: 20px 8px;
  display: flex;
  justify-content: center;
}

.submit-button {
  width: 200px;
  height: 44px;
  font-size: 16px;
  border-radius: 22px;
}
</style>
