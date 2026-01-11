<template>
  <div class="product-detail-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/product/list' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <template v-slot:header>
        <div class="clearfix">
          <span>商品详情</span>
          <el-button-group>
            <el-button type="primary" @click="handleEdit">编辑</el-button>
            <el-button @click="handleBack">返回列表</el-button>
          </el-button-group>
        </div>
      </template>

      <div v-if="loading" class="loading-container">
        <el-loading :fullscreen="false" text="加载中..."></el-loading>
      </div>

      <div v-else-if="productDetail" class="detail-content">
        <!-- 基本信息 -->
        <div class="section">
          <h3 class="section-title">基本信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <label class="info-label">商品ID：</label>
              <span class="info-value">{{ productDetail.id }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">商品名称：</label>
              <span class="info-value">{{ productDetail.name }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">商品分类：</label>
              <span class="info-value">{{ getCategoryName(productDetail.categoryId) }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">商品品牌：</label>
              <span class="info-value">{{ getBrandName(productDetail.brandId) }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">商品价格：</label>
              <span class="info-value price">{{ productDetail.price }}元</span>
            </div>
            <div class="info-item">
              <label class="info-label">商品库存：</label>
              <span class="info-value">{{ productDetail.stock }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">商品销量：</label>
              <span class="info-value">{{ productDetail.sales }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">商品状态：</label>
              <el-tag :type="productDetail.status === '1' ? 'success' : 'danger'">
                {{ productDetail.status === '1' ? '上架' : '下架' }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 商品图片 -->
        <div class="section">
          <h3 class="section-title">商品图片</h3>
          <div class="image-gallery">
            <LazyImage
              v-for="(image, index) in productDetail.images"
              :key="index"
              :src="image"
              :alt="`商品图片${index + 1}`"
              :show-progress="true"
              :show-loading="true"
              :show-retry-button="true"
              fit="cover"
              class="gallery-image"
            ></LazyImage>
          </div>
        </div>

        <!-- 商品描述 -->
        <div class="section">
          <h3 class="section-title">商品描述</h3>
          <div class="description">
            {{ productDetail.description }}
          </div>
        </div>

        <!-- 商品详情 -->
        <div class="section">
          <h3 class="section-title">详细介绍</h3>
          <div class="detail-content-html" v-html="productDetail.detail"></div>
        </div>

        <!-- 商品参数 -->
        <div class="section">
          <h3 class="section-title">商品参数</h3>
          <el-table :data="productDetail.params" style="width: 100%" border>
            <el-table-column prop="key" label="参数名" width="180"></el-table-column>
            <el-table-column prop="value" label="参数值"></el-table-column>
          </el-table>
        </div>

        <!-- 操作记录 -->
        <div class="section">
          <h3 class="section-title">操作记录</h3>
          <el-table :data="operationLogs" style="width: 100%" border>
            <el-table-column prop="operateTime" label="操作时间" width="180"></el-table-column>
            <el-table-column prop="operator" label="操作人" width="120"></el-table-column>
            <el-table-column prop="operation" label="操作类型" width="120"></el-table-column>
            <el-table-column prop="remark" label="操作备注"></el-table-column>
          </el-table>
        </div>
      </div>

      <div v-else class="empty-state">
        <el-empty description="未找到商品信息"></el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入日志工具
import logger from '@/utils/logger'
import { getProductById, getProductOperationLogs } from '@/api/product'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import LazyImage from '@/components/ui/LazyImage.vue'

// 定义类型
interface ProductDetail {
  id: number
  name: string
  categoryId: number
  brandId: number
  price: number
  stock: number
  sales: number
  status: string
  images: string[]
  description: string
  detail: string
  params: Array<{ key: string; value: string }>
}

interface OperationLog {
  operateTime: string
  operator: string
  operation: string
  remark: string
}

interface CategoryOption {
  value: number
  label: string
}

interface Brand {
  id: number
  name: string
}

// 响应式数据
const loading = ref(true)
const productDetail = ref<ProductDetail | null>(null)
const operationLogs = ref<OperationLog[]>([])
const categoryOptions = ref<CategoryOption[]>([])
const brandList = ref<Brand[]>([])

const route = useRoute()
const router = useRouter()

// 初始化数据
const initData = () => {
  const id = route.params.id as string
  if (id) {
    fetchProductDetail(id)
    fetchOperationLogs(id)
  } else {
    loading.value = false
  }

  // 加载分类和品牌数据
  loadCategoryAndBrand()
}

// 获取商品详情
const fetchProductDetail = (id: string) => {
  loading.value = true
  // 调用真实API
  getProductById(id)
    .then(response => {
      productDetail.value = response.data
      loading.value = false
    })
    .catch(error => {
      logger.error('获取商品详情失败', error)
      ElMessage.error('获取商品详情失败')
      loading.value = false
    })
}

// 获取操作记录
const fetchOperationLogs = (id: string) => {
  getProductOperationLogs(id)
    .then(response => {
      operationLogs.value = response.data
    })
    .catch(error => {
      logger.error('获取操作记录失败', error)
    })
}

// 加载分类和品牌数据
const loadCategoryAndBrand = () => {
  // 在实际项目中，应该从API获取
  // 这里使用模拟数据
  categoryOptions.value = [
    { value: 1, label: '手机数码' },
    { value: 11, label: '智能手机' },
    { value: 111, label: '华为' },
    { value: 112, label: '小米' },
    { value: 113, label: '苹果' },
    { value: 12, label: '笔记本电脑' },
    { value: 13, label: '平板电脑' },
    { value: 2, label: '家用电器' },
    { value: 21, label: '冰箱' },
    { value: 22, label: '洗衣机' },
  ]

  brandList.value = [
    { id: 1, name: '华为' },
    { id: 2, name: '小米' },
    { id: 3, name: '苹果' },
    { id: 4, name: '三星' },
    { id: 5, name: '联想' },
  ]
}

// 获取分类名称
const getCategoryName = (categoryId: number): string => {
  const category = categoryOptions.value.find(cat => cat.value === categoryId)
  return category ? category.label : '未知分类'
}

// 获取品牌名称
const getBrandName = (brandId: number): string => {
  const brand = brandList.value.find(b => b.id === brandId)
  return brand ? brand.name : '未知品牌'
}

// 编辑商品
const handleEdit = () => {
  const id = route.params.id as string
  router.push(`/product/edit?id=${id}`)
}

// 返回列表
const handleBack = () => {
  router.push('/product/list')
}

// 生命周期
onMounted(() => {
  initData()
})
</script>

<style scoped>
.product-detail-container {
  padding: 20px;
}

// 商品图片样式
.gallery-image {
  width: 150px;
  height: 150px;
  margin-right: 10px;
  margin-bottom: 10px;
  display: inline-block;
  vertical-align: middle;
}

.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  width: 100px;
  color: #606266;
  font-weight: 500;
}

.info-value {
  color: #303133;
}

.price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: 600;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
}

.description {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  min-height: 60px;
  line-height: 1.8;
}

.detail-content-html {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
  min-height: 200px;
  line-height: 1.8;
}

.detail-content-html img {
  max-width: 100%;
  height: auto;
}

.loading-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
