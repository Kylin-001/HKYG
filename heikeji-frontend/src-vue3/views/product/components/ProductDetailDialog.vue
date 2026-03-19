<template>
  <el-dialog
    v-model="dialogVisible"
    title="商品详情"
    width="80%"
    :before-close="handleClose"
    destroy-on-close
  >
    <div v-loading="loading" class="product-detail-container">
      <template v-if="product">
        <!-- 基本信息 -->
        <el-card class="detail-section">
          <template #header>
            <div class="section-header">
              <span>基本信息</span>
            </div>
          </template>

          <el-row :gutter="20">
            <el-col :span="8">
              <div class="product-image-container">
                <el-image
                  :src="product.image"
                  :preview-src-list="product.images || [product.image]"
                  fit="cover"
                  class="product-image"
                />
              </div>
            </el-col>
            <el-col :span="16">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="商品名称">{{ product.name }}</el-descriptions-item>
                <el-descriptions-item label="商品编号">{{ product.code }}</el-descriptions-item>
                <el-descriptions-item label="商品分类">{{
                  product.categoryName
                }}</el-descriptions-item>
                <el-descriptions-item label="商品状态">
                  <el-tag :type="product.status === 1 ? 'success' : 'danger'">
                    {{ product.status === 1 ? '上架' : '下架' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="销售价格"
                  >¥{{ product.price.toFixed(2) }}</el-descriptions-item
                >
                <el-descriptions-item label="原价" v-if="product.originalPrice">
                  ¥{{ product.originalPrice.toFixed(2) }}
                </el-descriptions-item>
                <el-descriptions-item label="库存数量">{{ product.stock }}</el-descriptions-item>
                <el-descriptions-item label="销量">{{ product.sales }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{
                  formatDate(product.createTime)
                }}</el-descriptions-item>
                <el-descriptions-item label="更新时间">{{
                  formatDate(product.updateTime)
                }}</el-descriptions-item>
              </el-descriptions>

              <div class="product-tags" v-if="product.tags && product.tags.length">
                <el-tag
                  v-for="tag in product.tags"
                  :key="tag"
                  type="info"
                  size="small"
                  class="tag-item"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- 商品描述 -->
        <el-card class="detail-section" v-if="product.description">
          <template #header>
            <div class="section-header">
              <span>商品描述</span>
            </div>
          </template>
          <div class="product-description">{{ product.description }}</div>
        </el-card>

        <!-- 商品规格 -->
        <el-card
          class="detail-section"
          v-if="product.specifications && product.specifications.length"
        >
          <template #header>
            <div class="section-header">
              <span>商品规格</span>
            </div>
          </template>
          <el-table :data="product.specifications" border>
            <el-table-column prop="name" label="规格名称" />
            <el-table-column prop="value" label="规格值" />
            <el-table-column prop="sort" label="排序" width="80" align="center" />
          </el-table>
        </el-card>

        <!-- 商品图片 -->
        <el-card class="detail-section" v-if="product.images && product.images.length">
          <template #header>
            <div class="section-header">
              <span>商品图片</span>
            </div>
          </template>
          <div class="product-images">
            <el-image
              v-for="(image, index) in product.images"
              :key="index"
              :src="image"
              :preview-src-list="product.images"
              fit="cover"
              class="product-gallery-image"
            />
          </div>
        </el-card>

        <!-- SEO信息 -->
        <el-card class="detail-section" v-if="product.seoKeywords || product.seoDescription">
          <template #header>
            <div class="section-header">
              <span>SEO信息</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="SEO关键词" v-if="product.seoKeywords">
              {{ product.seoKeywords }}
            </el-descriptions-item>
            <el-descriptions-item label="SEO描述" v-if="product.seoDescription">
              {{ product.seoDescription }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 商品详情 -->
        <el-card class="detail-section" v-if="product.details">
          <template #header>
            <div class="section-header">
              <span>商品详情</span>
            </div>
          </template>
          <div class="product-details" v-html="product.details"></div>
        </el-card>
      </template>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleEdit">编辑商品</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getProductDetail } from '@/api/product'
import type { Product } from '@/types/product'

interface Props {
  visible: boolean
  productId: string | null
}

interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'edit', productId: string): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const product = ref<Product | null>(null)

const dialogVisible = computed({
  get: () => props.visible,
  set: value => emit('update:visible', value),
})

const loadProductDetail = async () => {
  if (!props.productId) return

  loading.value = true
  try {
    const res = await getProductDetail(props.productId)
    product.value = res.data
  } catch (error) {
    ElMessage.error('获取商品详情失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  dialogVisible.value = false
  product.value = null
}

const handleEdit = () => {
  if (props.productId) {
    emit('edit', props.productId)
    handleClose()
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

// 监听productId变化
watch(
  () => props.productId,
  newId => {
    if (newId && props.visible) {
      loadProductDetail()
    }
  },
  { immediate: true }
)

// 监听对话框显示状态
watch(
  () => props.visible,
  visible => {
    if (visible && props.productId) {
      loadProductDetail()
    }
  }
)
</script>

<style lang="scss" scoped>
.product-detail-container {
  .detail-section {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-header {
      font-weight: bold;
      color: #303133;
    }
  }

  .product-image-container {
    text-align: center;

    .product-image {
      width: 200px;
      height: 200px;
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }

  .product-tags {
    margin-top: 15px;

    .tag-item {
      margin-right: 8px;
      margin-bottom: 8px;
    }
  }

  .product-description {
    line-height: 1.6;
    color: #606266;
  }

  .product-images {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .product-gallery-image {
      width: 120px;
      height: 120px;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .product-details {
    line-height: 1.8;
    color: #303133;

    :deep(img) {
      max-width: 100%;
      height: auto;
    }
  }
}

.dialog-footer {
  text-align: right;
}
</style>
