<template>
  <div class="product-list-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>商品管理</h2>
        <span class="subtitle">管理平台的商品信息</span>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增商品
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-title">商品总数</div>
          <div class="stat-value">{{ totalProducts }}</div>
        </div>
        <div class="stat-icon product-total"><Goods /></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-title">上架商品</div>
          <div class="stat-value">{{ onlineProducts }}</div>
        </div>
        <div class="stat-icon online"><VideoPlay /></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-title">热销商品</div>
          <div class="stat-value">{{ hotProducts }}</div>
        </div>
        <div class="stat-icon hot"><Star /></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-title">新品</div>
          <div class="stat-value">{{ newProducts }}</div>
        </div>
        <div class="stat-icon new"><Plus /></div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-container">
      <div class="search-left">
        <el-input
          v-model="searchParams.keyword"
          placeholder="商品名称/编号"
          clearable
          size="small"
          style="width: 200px; margin-right: 10px"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="searchParams.categoryId"
          placeholder="商品分类"
          clearable
          size="small"
          style="width: 150px; margin-right: 10px"
        >
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
        <el-select
          v-model="searchParams.status"
          placeholder="商品状态"
          clearable
          size="small"
          style="width: 120px; margin-right: 10px"
        >
          <el-option label="全部" value="0" />
          <el-option label="上架" value="1" />
          <el-option label="下架" value="2" />
        </el-select>
        <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
        <el-button size="small" @click="handleReset">重置</el-button>
      </div>
    </div>

    <!-- 商品列表表格 -->
    <el-card class="product-table-card">
      <VirtualTable
        v-loading="loading"
        :data="products"
        :columns="columns"
        :total="total"
        :show-selection="true"
        :show-actions="true"
        :actions="tableActions"
        :actions-column-width="180"
        :row-key="row => row.id"
        :row-height="60"
        :table-height="500"
        :show-pagination="false"
        @selection-change="handleSelectionChange"
        @action="handleTableAction"
      />

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 商品详情对话框 -->
    <ProductDetailDialog
      v-model:visible="detailDialogVisible"
      :product-id="selectedProductId"
      @refresh="handleRefresh"
    />

    <!-- 商品编辑对话框 -->
    <ProductEditDialog
      v-model:visible="editDialogVisible"
      :product-id="selectedProductId"
      :mode="editMode"
      @refresh="handleRefresh"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Download, Goods, VideoPlay, Star, Search } from '@element-plus/icons-vue'
import VirtualTable from '@/components/VirtualTable/index.vue'
import ProductDetailDialog from './components/ProductDetailDialog.vue'
import ProductEditDialog from './components/ProductEditDialog.vue'
import { getProductList, getProductStats, deleteProduct, exportProducts } from '@/api/product'
import type { Product, ProductSearchParams, ProductStats } from '@/types/product'

// 响应式数据
const loading = ref(false)
const products = ref<Product[]>([])
const total = ref(0)
const totalProducts = ref(0)
const onlineProducts = ref(0)
const hotProducts = ref(0)
const newProducts = ref(0)
const categories = ref([])
const selectedProducts = ref<Product[]>([])

// 对话框状态
const detailDialogVisible = ref(false)
const editDialogVisible = ref(false)
const selectedProductId = ref<string | null>(null)
const editMode = ref<'add' | 'edit'>('add')

// 搜索参数
const searchParams = reactive<ProductSearchParams>({
  keyword: '',
  categoryId: '',
  status: '0',
  pageNum: 1,
  pageSize: 20,
})

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
})

// 表格列配置
const columns = ref([
  {
    key: 'image',
    label: '商品图片',
    width: 100,
    align: 'center',
    formatter: (value: string) => {
      return `
        <div class="product-image">
          <img src="${value}" alt="商品图片" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
        </div>
      `
    },
  },
  { key: 'name', label: '商品名称', width: 200 },
  { key: 'code', label: '商品编号', width: 120 },
  { key: 'categoryName', label: '分类', width: 120 },
  {
    key: 'price',
    label: '价格',
    width: 100,
    align: 'right',
    formatter: (value: number) => `¥${value.toFixed(2)}`,
  },
  { key: 'stock', label: '库存', width: 100, align: 'center' },
  { key: 'sales', label: '销量', width: 100, align: 'center' },
  {
    key: 'status',
    label: '状态',
    width: 100,
    align: 'center',
    formatter: (value: number) => {
      return `<el-tag type="${value === 1 ? 'success' : 'danger'}">${value === 1 ? '上架' : '下架'}</el-tag>`
    },
  },
  {
    key: 'createTime',
    label: '创建时间',
    width: 160,
    formatter: (value: string) => new Date(value).toLocaleString(),
  },
])

// 表格操作配置
const tableActions = ref([
  {
    key: 'view',
    label: '查看',
    type: 'primary',
    size: 'small',
    icon: 'el-icon-view',
  },
  {
    key: 'edit',
    label: '编辑',
    type: 'success',
    size: 'small',
    icon: 'el-icon-edit',
  },
  {
    key: 'delete',
    label: '删除',
    type: 'danger',
    size: 'small',
    icon: 'el-icon-delete',
  },
])

// 计算属性
const hasSelected = computed(() => selectedProducts.value.length > 0)

// 方法
const loadProducts = async () => {
  loading.value = true
  try {
    searchParams.pageNum = pagination.currentPage
    searchParams.pageSize = pagination.pageSize

    const res = await getProductList(searchParams)
    products.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取商品列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const loadProductStats = async () => {
  try {
    const res = await getProductStats()
    const stats: ProductStats = res.data
    totalProducts.value = stats.total
    onlineProducts.value = stats.online
    hotProducts.value = stats.hot
    newProducts.value = stats.new
  } catch (error) {
    console.error('获取商品统计失败', error)
  }
}

const loadCategories = async () => {
  try {
    // 这里应该调用获取分类的API
    // const res = await getCategories()
    // categories.value = res.data

    // 模拟数据
    categories.value = [
      { id: '1', name: '数码电器' },
      { id: '2', name: '服装鞋帽' },
      { id: '3', name: '图书文具' },
      { id: '4', name: '生活用品' },
    ]
  } catch (error) {
    console.error('获取分类列表失败', error)
  }
}

const handleSearch = () => {
  pagination.currentPage = 1
  loadProducts()
}

const handleReset = () => {
  searchParams.keyword = ''
  searchParams.categoryId = ''
  searchParams.status = '0'
  pagination.currentPage = 1
  loadProducts()
}

const handleRefresh = () => {
  loadProducts()
  loadProductStats()
}

const handleAdd = () => {
  selectedProductId.value = null
  editMode.value = 'add'
  editDialogVisible.value = true
}

const handleExport = async () => {
  try {
    await ElMessageBox.confirm('确定要导出商品数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const res = await exportProducts(searchParams)

    // 创建下载链接
    const blob = new Blob([res.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `商品列表_${new Date().toLocaleDateString()}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)

    ElMessage.success('导出成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('导出失败')
      console.error(error)
    }
  }
}

const handleSelectionChange = (selection: Product[]) => {
  selectedProducts.value = selection
}

const handleTableAction = async (action: string, row: Product) => {
  switch (action) {
    case 'view':
      selectedProductId.value = row.id
      detailDialogVisible.value = true
      break
    case 'edit':
      selectedProductId.value = row.id
      editMode.value = 'edit'
      editDialogVisible.value = true
      break
    case 'delete':
      handleDelete(row)
      break
  }
}

const handleDelete = async (row: Product) => {
  try {
    await ElMessageBox.confirm(`确定要删除商品"${row.name}"吗？此操作不可恢复！`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteProduct(row.id)
    ElMessage.success('删除成功')
    loadProducts()
    loadProductStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadProducts()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  loadProducts()
}

// 生命周期
onMounted(() => {
  loadProducts()
  loadProductStats()
  loadCategories()
})
</script>

<style lang="scss" scoped>
.product-list-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .header-left {
    h2 {
      margin: 0 0 5px 0;
      font-size: 24px;
      color: #303133;
    }

    .subtitle {
      color: #909399;
      font-size: 14px;
    }
  }

  .header-right {
    display: flex;
    gap: 10px;
  }
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .stat-info {
    flex: 1;

    .stat-title {
      color: #909399;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: #303133;
    }
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #fff;

    &.product-total {
      background-color: #409eff;
    }

    &.online {
      background-color: #67c23a;
    }

    &.hot {
      background-color: #e6a23c;
    }

    &.new {
      background-color: #f56c6c;
    }
  }
}

.search-container {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.product-table-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.product-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

@media (max-width: 1200px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .search-left {
    flex-direction: column;
    gap: 10px;

    .el-input,
    .el-select,
    .el-button {
      width: 100% !important;
      margin-right: 0 !important;
    }
  }
}
</style>
