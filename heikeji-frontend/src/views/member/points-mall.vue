<template>
  <div class="points-mall-container">
    <el-card class="points-summary-card">
      <div class="points-summary">
        <div class="points-info">
          <div class="points-label">我的积分</div>
          <div class="points-value">{{ userPoints }}</div>
        </div>
        <div class="points-actions">
          <el-button type="primary" @click="showPointRecords">积分记录</el-button>
        </div>
      </div>
    </el-card>

    <el-card class="products-card">
      <template #header>
        <div class="card-header">
          <span>积分商城</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品"
            style="width: 200px"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </template>

      <div v-loading="loading" class="products-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-item"
          @click="showProductDetail(product)"
        >
          <div class="product-image">
            <el-image
              :src="product.image || 'https://via.placeholder.com/200x200'"
              fit="cover"
              lazy
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div v-if="!product.canExchange" class="product-out-of-stock">已售罄</div>
          </div>
          <div class="product-info">
            <div class="product-name" :title="product.name">{{ product.name }}</div>
            <div class="product-points">
              <el-icon class="points-icon"><Coin /></el-icon>
              <span>{{ product.points }} 积分</span>
            </div>
            <div class="product-stock">库存: {{ product.stock }}</div>
          </div>
        </div>

        <el-empty v-if="filteredProducts.length === 0" description="暂无商品" />
      </div>
    </el-card>

    <el-dialog
      v-model="detailDialogVisible"
      title="商品详情"
      width="600px"
      @close="handleCloseDetail"
    >
      <div v-if="selectedProduct" class="product-detail">
        <div class="detail-image">
          <el-image
            :src="selectedProduct.image || 'https://via.placeholder.com/400x400'"
            fit="cover"
          >
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
        <div class="detail-info">
          <h3 class="detail-name">{{ selectedProduct.name }}</h3>
          <div class="detail-points">
            <el-icon class="points-icon"><Coin /></el-icon>
            <span class="points-value">{{ selectedProduct.points }} 积分</span>
          </div>
          <div class="detail-stock">库存: {{ selectedProduct.stock }}</div>
          <div class="detail-description">{{ selectedProduct.description }}</div>
          <div class="detail-actions">
            <el-button
              type="primary"
              size="large"
              :disabled="!selectedProduct.canExchange || userPoints < selectedProduct.points"
              @click="handleExchange"
              :loading="exchanging"
            >
              {{ selectedProduct.canExchange ? '立即兑换' : '已售罄' }}
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="recordsDialogVisible"
      title="积分记录"
      width="800px"
    >
      <div v-loading="loadingRecords" class="point-records">
        <el-table :data="pointRecords" stripe max-height="400">
          <el-table-column prop="points" label="积分变动" width="120" align="center">
            <template #default="{ row }">
              <span :class="row.points > 0 ? 'points-add' : 'points-deduct'">
                {{ row.points > 0 ? '+' : '' }}{{ row.points }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="balance" label="变动后余额" width="120" align="center" />
          <el-table-column prop="typeText" label="类型" width="120" align="center" />
          <el-table-column prop="source" label="来源" min-width="150" />
          <el-table-column prop="remark" label="备注" min-width="200" />
          <el-table-column prop="createTime" label="时间" width="180" align="center">
            <template #default="{ row }">
              {{ formatTime(row.createTime) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Picture, Coin } from '@element-plus/icons-vue'
import * as memberApi from '@/api/member'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const userPoints = ref(0)
const products = ref([])
const searchKeyword = ref('')
const loading = ref(false)
const detailDialogVisible = ref(false)
const recordsDialogVisible = ref(false)
const selectedProduct = ref(null)
const pointRecords = ref([])
const loadingRecords = ref(false)
const exchanging = ref(false)

const filteredProducts = computed(() => {
  if (!searchKeyword.value) {
    return products.value
  }
  return products.value.filter(product =>
    product.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const fetchUserPoints = async () => {
  try {
    const userId = userStore.userId || 1
    const res = await memberApi.getUserPoints(userId)
    userPoints.value = res.data || 0
  } catch (error) {
    console.error('获取积分失败:', error)
  }
}

const fetchProducts = async () => {
  try {
    loading.value = true
    const res = await memberApi.getPointProducts()
    products.value = res.data || []
  } catch (error) {
    console.error('获取商品失败:', error)
    ElMessage.error('获取商品失败')
  } finally {
    loading.value = false
  }
}

const fetchPointRecords = async () => {
  try {
    loadingRecords.value = true
    const userId = userStore.userId || 1
    const res = await memberApi.getUserPointRecords(userId)
    pointRecords.value = res.data || []
  } catch (error) {
    console.error('获取积分记录失败:', error)
    ElMessage.error('获取积分记录失败')
  } finally {
    loadingRecords.value = false
  }
}

const showProductDetail = (product) => {
  selectedProduct.value = product
  detailDialogVisible.value = true
}

const handleCloseDetail = () => {
  selectedProduct.value = null
  detailDialogVisible.value = false
}

const handleExchange = async () => {
  if (!selectedProduct.value) return

  try {
    await ElMessageBox.confirm(
      `确定要用 ${selectedProduct.value.points} 积分兑换 ${selectedProduct.value.name} 吗？`,
      '确认兑换',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    exchanging.value = true
    const userId = userStore.userId || 1
    await memberApi.exchangeProduct(userId, selectedProduct.value.id)
    ElMessage.success('兑换成功')
    detailDialogVisible.value = false
    await fetchUserPoints()
    await fetchProducts()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('兑换失败:', error)
      ElMessage.error(error.message || '兑换失败')
    }
  } finally {
    exchanging.value = false
  }
}

const showPointRecords = () => {
  recordsDialogVisible.value = true
  fetchPointRecords()
}

const handleSearch = () => {
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  fetchUserPoints()
  fetchProducts()
})
</script>

<style scoped>
.points-mall-container {
  padding: 20px;
}

.points-summary-card {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.points-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.points-info {
  flex: 1;
}

.points-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.points-value {
  font-size: 48px;
  font-weight: bold;
}

.points-actions :deep(.el-button) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.points-actions :deep(.el-button:hover) {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  min-height: 400px;
}

.product-item {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.product-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: #f5f7fa;
}

.product-image :deep(.el-image) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.product-out-of-stock {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.product-info {
  padding: 12px;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-points {
  display: flex;
  align-items: center;
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 4px;
}

.points-icon {
  margin-right: 4px;
  font-size: 18px;
}

.product-stock {
  font-size: 12px;
  color: #909399;
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #f5f7fa;
  color: #c0c4cc;
  font-size: 48px;
}

.product-detail {
  display: flex;
  gap: 20px;
}

.detail-image {
  flex: 0 0 300px;
}

.detail-image :deep(.el-image) {
  width: 100%;
  border-radius: 8px;
}

.detail-info {
  flex: 1;
}

.detail-name {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 16px 0;
}

.detail-points {
  display: flex;
  align-items: center;
  color: #f56c6c;
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 12px;
}

.detail-points .points-value {
  margin-left: 8px;
}

.detail-stock {
  color: #909399;
  margin-bottom: 16px;
}

.detail-description {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 24px;
  min-height: 60px;
}

.detail-actions {
  text-align: right;
}

.points-add {
  color: #67c23a;
  font-weight: bold;
}

.points-deduct {
  color: #f56c6c;
  font-weight: bold;
}

.point-records {
  max-height: 500px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .points-summary {
    flex-direction: column;
    gap: 16px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  .product-detail {
    flex-direction: column;
  }

  .detail-image {
    flex: 0 0 auto;
  }
}
</style>
