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
        <div class="stat-icon new"><Calendar /></div>
      </div>
    </div>

    <!-- 批量操作和搜索 -->
    <div class="filter-container">
      <div class="batch-operations">
        <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
        <el-button type="primary" size="small" :disabled="selectedProductIds.length === 0">
          <el-icon><Check /></el-icon>
          批量上架
        </el-button>
        <el-button type="warning" size="small" :disabled="selectedProductIds.length === 0">
          <el-icon><Close /></el-icon>
          批量下架
        </el-button>
        <el-button
          type="danger"
          size="small"
          :disabled="selectedProductIds.length === 0"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
      </div>

      <div class="search-container">
        <el-input
          v-model="searchParams.keyword"
          placeholder="商品名称"
          clearable
          size="small"
          style="width: 200px; margin-right: 10px"
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
          style="width: 180px; margin-right: 10px"
        >
          <el-option label="全部" value="0" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import VirtualTable from '@/components/VirtualTable.vue'
import { useProductStore } from '@/store/modules/product'
import { ElMessage, ElMessageBox } from 'element-plus'
// 导入图标
import {
  Plus,
  Refresh,
  Download,
  Goods,
  VideoPlay,
  Star,
  Calendar,
  Search,
  Check,
  Close,
  Delete,
} from '@element-plus/icons-vue'

// 初始化路由和store
const router = useRouter()
const productStore = useProductStore()

// 表格列配置
const columns = ref([
  { key: 'id', label: 'ID', width: 80, align: 'center' },
  {
    key: 'productName',
    label: '商品名称',
    minWidth: 200,
    formatter: (value: any, row: any) => {
      return `
        <div class="product-name">
          <img 
            src="${row.coverImage}" 
            alt="${row.productName}" 
            class="product-image"
            style="width: 40px; height: 40px; margin-right: 10px; display: inline-block; vertical-align: middle;"
          />
          <span>${row.productName}</span>
        </div>
      `
    },
  },
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
  {
    key: 'toggle-status',
    label: '切换状态',
    type: 'warning',
    size: 'small',
    icon: 'el-icon-refresh',
  },
])

// 搜索参数
const searchParams = ref({
  keyword: '',
  categoryId: 0,
  status: 0,
})

// 分页参数
const pagination = ref({
  currentPage: 1,
  pageSize: 20,
})

// 选中的商品ID
const selectedProductIds = ref<number[]>([])

// 计算属性：全选
const selectAll = computed({
  get() {
    return (
      selectedProductIds.value.length === productStore.products.length &&
      productStore.products.length > 0
    )
  },
  set(value) {
    selectedProductIds.value = value ? productStore.products.map(item => item.id) : []
  },
})

// 计算属性：从store获取数据
const products = computed(() => productStore.products)
const total = computed(() => productStore.total)
const loading = computed(() => productStore.loading)
const categories = computed(() => productStore.categories)

// 统计信息计算
const totalProducts = computed(() => productStore.total)
const onlineProducts = computed(
  () => productStore.products.filter(item => item.status === 1).length
)
const hotProducts = computed(() => productStore.products.filter(item => item.sales > 100).length)
const newProducts = computed(() => {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return productStore.products.filter(item => new Date(item.createTime) >= sevenDaysAgo).length
})

// 加载商品列表
const loadProductList = async () => {
  try {
    await productStore.getProductList({
      ...searchParams.value,
      pageNum: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    })
  } catch (error) {
    console.error('加载商品列表失败:', error)
  }
}

// 加载商品分类
const loadCategories = async () => {
  try {
    await productStore.getProductCategories()
  } catch (error) {
    console.error('加载商品分类失败:', error)
  }
}

// 处理全选
const handleSelectAll = () => {
  // 已通过computed实现
}

// 处理选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedProductIds.value = selection.map(item => item.id)
}

// 搜索
const handleSearch = () => {
  pagination.value.currentPage = 1
  loadProductList()
}

// 重置
const handleReset = () => {
  searchParams.value = {
    keyword: '',
    categoryId: 0,
    status: 0,
  }
  pagination.value.currentPage = 1
  loadProductList()
}

// 刷新
const handleRefresh = () => {
  loadProductList()
}

// 新增商品
const handleAdd = () => {
  router.push('/product/add')
}

// 查看商品
const handleView = (id: number) => {
  router.push(`/product/detail/${id}`)
}

// 编辑商品
const handleEdit = (id: number) => {
  router.push(`/product/edit/${id}`)
}

// 删除商品
const handleDelete = async (id: number, name: string) => {
  try {
    await ElMessageBox.confirm(`确定要删除商品"${name}"吗？`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await productStore.deleteProduct(id)
    ElMessage.success('删除成功')
    // 重新加载列表
    loadProductList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

// 批量删除商品
const handleBatchDelete = async () => {
  const currentSelectedIds = [...selectedProductIds.value] // 创建当前选中ID的副本
  if (currentSelectedIds.length === 0) return

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的${currentSelectedIds.length}个商品吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    // 使用Promise.all优化批量删除
    await Promise.all(currentSelectedIds.map(id => productStore.deleteProduct(id)))
    ElMessage.success('批量删除成功')
    // eslint-disable-next-line require-atomic-updates
    selectedProductIds.value = []
    loadProductList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
    }
  }
}

// 导出商品
const handleExport = () => {
  // 实现导出功能
  ElMessage.info('导出功能开发中')
}

// 处理表格操作
const handleTableAction = ({ action, row }: { action: any; row: any }) => {
  switch (action.key) {
    case 'view':
      handleView(row.id)
      break
    case 'edit':
      handleEdit(row.id)
      break
    case 'delete':
      handleDelete(row.id, row.productName)
      break
    case 'toggle-status':
      // 这里可以实现切换状态的逻辑
      ElMessage.info(`切换商品${row.productName}的状态`)
      break
    default:
      break
  }
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  loadProductList()
}

const handleCurrentChange = (current: number) => {
  pagination.value.currentPage = current
  loadProductList()
}

// 组件挂载时加载数据
onMounted(() => {
  loadCategories()
  loadProductList()
})
</script>

<style scoped>
.product-list-container {
  padding: 20px;
}

// 商品图片样式
.product-image {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
}

// 商品名称容器
.product-name {
  display: flex;
  align-items: center;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.header-left .subtitle {
  color: #909399;
  font-size: 14px;
  margin-left: 10px;
}

.header-right {
  display: flex;
  gap: 10px;
}

.stats-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-info .stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-info .stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.stat-icon.product-total {
  background-color: #e6f7ff;
  color: #1890ff;
}

.stat-icon.online {
  background-color: #f6ffed;
  color: #52c41a;
}

.stat-icon.hot {
  background-color: #fff2e8;
  color: #fa8c16;
}

.stat-icon.new {
  background-color: #fff0f6;
  color: #eb2f96;
}

.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.batch-operations {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-container {
  display: flex;
  align-items: center;
}

.product-table-card {
  margin-bottom: 20px;
}

.product-name {
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
