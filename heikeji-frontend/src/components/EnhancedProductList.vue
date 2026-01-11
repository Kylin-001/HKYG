<template>
  <div class="enhanced-product-list">
    <VirtualTable
      :data="productList"
      :columns="tableColumns"
      :total="total"
      :show-selection="true"
      :show-index="true"
      :show-actions="true"
      :show-search="true"
      :show-batch-toolbar="true"
      :row-height="70"
      :table-height="600"
      :actions="rowActions"
      :batch-actions="batchActions"
      :search-fields="searchFields"
      :loading="loading"
      :refresh-handler="refreshData"
      :add-handler="addProduct"
      :export-handler="exportProducts"
      @selection-change="handleSelectionChange"
      @search="handleSearch"
      @action="handleRowAction"
      @batch-action="handleBatchAction"
      ref="virtualTable"
    >
      <!-- 自定义工具栏 -->
      <template #toolbar-left>
        <el-button type="success" size="small" @click="exportProducts">
          <i class="el-icon-download"></i> 导出产品
        </el-button>
        <el-button type="primary" size="small" @click="importProducts">
          <i class="el-icon-upload2"></i> 导入产品
        </el-button>
      </template>

      <!-- 统计卡片插槽 -->
      <template #toolbar-right>
        <div class="stats-container">
          <div class="stat-item">
            <span class="stat-label">商品总数:</span>
            <span class="stat-value">{{ productStats.total }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">上架商品:</span>
            <span class="stat-value">{{ productStats.onSale }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">热销商品:</span>
            <span class="stat-value">{{ productStats.hotSales }}</span>
          </div>
        </div>
      </template>

      <!-- 自定义列渲染 -->
      <template #image-render="{ row, value }">
        <el-image
          :src="row.imageUrl || defaultImageUrl"
          :preview-src-list="[row.imageUrl]"
          fit="cover"
          style="width: 50px; height: 50px; border-radius: 4px"
        ></el-image>
      </template>

      <template #name-render="{ row, value }">
        <div class="product-name-cell">
          <div class="name">{{ row.name }}</div>
          <div class="tags">
            <el-tag v-if="row.isHot" size="mini" type="danger" effect="plain">热销</el-tag>
            <el-tag v-if="row.isNew" size="mini" type="info" effect="plain">新品</el-tag>
          </div>
        </div>
      </template>

      <template #rating-render="{ row, value }">
        <el-rate
          v-model="row.rating"
          disabled
          :max="5"
          show-score
          :texts="['1分', '2分', '3分', '4分', '5分']"
          score-template="{value}分"
        ></el-rate>
      </template>

      <template #status-render="{ row, value }">
        <el-switch
          v-model="row.status"
          @change="handleStatusChange(row)"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0"
        ></el-switch>
      </template>
    </VirtualTable>

    <!-- 状态统计面板 -->
    <div class="status-panel">
      <el-card>
        <template #header>
          <span>实时统计</span>
        </template>
        <div class="stats-grid">
          <div class="stat-card" v-for="stat in statusStats" :key="stat.key">
            <div class="stat-icon" :class="stat.color">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import VirtualTable from '@/components/VirtualTable.vue'
import logger from '@/utils/logger'

// 类型定义
interface Product {
  id: number
  name: string
  category: string
  brand: string
  price: number
  stock: number
  sales: number
  rating: number
  status: string
  isHot: boolean
  isNew: boolean
  imageUrl: string
  createTime: string
}

interface ProductStats {
  total: number
  onSale: number
  hotSales: number
  newArrivals: number
}

interface StatusStat {
  key: string
  label: string
  value: number
  icon: string
  color: string
}

interface TableColumn {
  key: string
  label: string
  width?: number
  minWidth?: number
  fixed?: boolean
  sortable?: boolean
  type?: string
  align?: string
  render?: string
}

interface Action {
  key: string
  label: string
  type: string
  icon?: string
  handler: (row?: Product, rows?: Product[]) => void
}

interface SearchField {
  key: string
  label: string
  type: string
  placeholder?: string
  options?: { label: string; value: string }[]
}

// 响应式数据
const loading = ref(false)
const productList = ref<Product[]>([])
const defaultImageUrl = ref('https://via.placeholder.com/50x50?text=商品')
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(50)
const selectedProducts = ref<Product[]>([])
const virtualTable = ref<any>(null)

// 搜索表单
const searchForm = reactive({
  name: '',
  category: '',
  brand: '',
  status: '',
})

// 商品统计数据
const productStats = ref<ProductStats>({
  total: 0,
  onSale: 0,
  hotSales: 0,
  newArrivals: 0,
})

// 状态统计
const statusStats = ref<StatusStat[]>([
  { key: 'total', label: '总数', value: 0, icon: 'el-icon-goods', color: 'primary' },
  { key: 'onSale', label: '在售', value: 0, icon: 'el-icon-circle-check', color: 'success' },
  { key: 'offSale', label: '下架', value: 0, icon: 'el-icon-circle-close', color: 'danger' },
  { key: 'hot', label: '热销', value: 0, icon: 'el-icon-star-on', color: 'warning' },
])

// 表格列配置
const tableColumns: TableColumn[] = [
  {
    key: 'image',
    label: '商品图片',
    width: 100,
    fixed: true,
    render: 'image-render',
  },
  {
    key: 'name',
    label: '商品名称',
    minWidth: 200,
    fixed: true,
    render: 'name-render',
  },
  {
    key: 'category',
    label: '分类',
    width: 120,
  },
  {
    key: 'brand',
    label: '品牌',
    width: 120,
  },
  {
    key: 'price',
    label: '价格',
    width: 100,
    sortable: true,
    type: 'currency',
  },
  {
    key: 'stock',
    label: '库存',
    width: 100,
    sortable: true,
    align: 'right',
  },
  {
    key: 'sales',
    label: '销量',
    width: 100,
    sortable: true,
    align: 'right',
  },
  {
    key: 'rating',
    label: '评分',
    width: 120,
    sortable: true,
    render: 'rating-render',
  },
  {
    key: 'status',
    label: '状态',
    width: 100,
    render: 'status-render',
  },
]

// 模拟数据
const categories = [
  { id: 1, name: '电子产品' },
  { id: 2, name: '服装' },
  { id: 3, name: '家居' },
  { id: 4, name: '图书' },
]

const brands = [
  { id: 1, name: '苹果' },
  { id: 2, name: '三星' },
  { id: 3, name: '华为' },
  { id: 4, name: '小米' },
]

// 单个操作方法
const viewProduct = (row: Product) => {
  ElMessage.info(`查看商品: ${row.name}`)
}

const editProduct = (row: Product) => {
  ElMessage.info(`编辑商品: ${row.name}`)
}

const deleteProduct = (row: Product) => {
  ElMessageBox.confirm(`确认删除商品 ${row.name}？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('删除成功')
  })
}

// 批量操作方法
const batchOnSale = (rows: Product[]) => {
  ElMessage.success(`批量上架 ${rows.length} 个商品`)
}

const batchOffSale = (rows: Product[]) => {
  ElMessage.success(`批量下架 ${rows.length} 个商品`)
}

const batchDelete = (rows: Product[]) => {
  ElMessageBox.confirm(`确认删除选中的 ${rows.length} 个商品？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('批量删除成功')
  })
}

const addProduct = () => {
  ElMessage.info('添加新商品')
}

const exportProducts = () => {
  ElMessage.success('导出商品数据')
}

const importProducts = () => {
  ElMessage.info('导入商品数据')
}

// 行操作按钮
const rowActions: Action[] = [
  {
    key: 'view',
    label: '查看',
    type: 'primary',
    icon: 'el-icon-view',
    handler: viewProduct,
  },
  {
    key: 'edit',
    label: '编辑',
    type: 'success',
    icon: 'el-icon-edit',
    handler: editProduct,
  },
  {
    key: 'delete',
    label: '删除',
    type: 'danger',
    icon: 'el-icon-delete',
    handler: deleteProduct,
  },
]

// 批量操作
const batchActions: Action[] = [
  {
    key: 'batchOnSale',
    label: '批量上架',
    type: 'success',
    handler: batchOnSale,
  },
  {
    key: 'batchOffSale',
    label: '批量下架',
    type: 'warning',
    handler: batchOffSale,
  },
  {
    key: 'batchDelete',
    label: '批量删除',
    type: 'danger',
    handler: batchDelete,
  },
]

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    key: 'name',
    label: '商品名称',
    type: 'input',
    placeholder: '请输入商品名称',
  },
  {
    key: 'category',
    label: '分类',
    type: 'select',
    options: [
      { label: '电子产品', value: 'electronics' },
      { label: '服装', value: 'clothing' },
      { label: '家居', value: 'home' },
      { label: '图书', value: 'books' },
    ],
  },
  {
    key: 'brand',
    label: '品牌',
    type: 'select',
    options: [
      { label: '苹果', value: 'apple' },
      { label: '三星', value: 'samsung' },
      { label: '华为', value: 'huawei' },
      { label: '小米', value: 'xiaomi' },
    ],
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '上架', value: '1' },
      { label: '下架', value: '0' },
    ],
  },
]

// 生成模拟数据
const generateMockData = () => {
  const data: Product[] = []
  const categories = ['电子产品', '服装', '家居', '图书']
  const brands = ['苹果', '三星', '华为', '小米', '联想', 'OPPO']

  for (let i = 1; i <= 1000; i++) {
    data.push({
      id: i,
      name: `商品${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      price: Math.round(Math.random() * 1000) + 10,
      stock: Math.floor(Math.random() * 1000),
      sales: Math.floor(Math.random() * 500),
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      status: Math.random() > 0.3 ? '1' : '0',
      isHot: Math.random() > 0.8,
      isNew: Math.random() > 0.9,
      imageUrl: `https://via.placeholder.com/60x60?text=商品${i}`,
      createTime: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
    })
  }

  productList.value = data
  total.value = data.length
  calculateStats()
}

// 计算统计数据
const calculateStats = () => {
  const totalProducts = productList.value.length
  const onSale = productList.value.filter(item => item.status === '1').length
  const hotSales = productList.value.filter(item => item.isHot).length
  const newArrivals = productList.value.filter(item => item.isNew).length

  productStats.value = { total: totalProducts, onSale, hotSales, newArrivals }

  // 更新状态统计
  statusStats.value = [
    { key: 'total', label: '总数', value: totalProducts, icon: 'el-icon-goods', color: 'primary' },
    { key: 'onSale', label: '在售', value: onSale, icon: 'el-icon-circle-check', color: 'success' },
    {
      key: 'offSale',
      label: '下架',
      value: totalProducts - onSale,
      icon: 'el-icon-circle-close',
      color: 'danger',
    },
    { key: 'hot', label: '热销', value: hotSales, icon: 'el-icon-star-on', color: 'warning' },
  ]
}

// 刷新数据
const refreshData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    calculateStats()
  } catch (error) {
    ElMessage.error('刷新数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = (searchParams: any) => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('搜索参数:', searchParams)
  }
  // 实现搜索逻辑
  refreshData()
}

// 选择变化处理
const handleSelectionChange = (selection: Product[]) => {
  selectedProducts.value = selection
}

// 行操作处理
const handleRowAction = ({
  action,
  row,
  index,
}: {
  action: Action
  row: Product
  index: number
}) => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('行操作:', action.key, row)
  }
  if (action.handler) {
    action.handler(row)
  }
}

// 批量操作处理
const handleBatchAction = ({ action, rows }: { action: Action; rows: Product[] }) => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('批量操作:', action.key, rows)
  }
  if (action.handler) {
    action.handler(undefined, rows)
  }
  ElMessage.success(`执行批量操作: ${action.label}`)
}

// 商品状态切换
const handleStatusChange = (row: Product) => {
  ElMessage.success(`商品 ${row.name} 状态已更新`)
}

// 生命周期钩子
onMounted(() => {
  generateMockData()
  refreshData()
})
</script>

<style scoped>
.enhanced-product-list {
  padding: 20px;
  background: #f5f7fa;
}

.status-panel {
  margin-top: 20px;
}

.stats-container {
  display: flex;
  gap: 20px;
  align-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #409eff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8eaed;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 20px;
  color: white;
}

.stat-icon.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.danger {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-icon.warning {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 4px;
}

.product-name-cell .name {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 4px;
}

.product-name-cell .tags {
  display: flex;
  gap: 4px;
}
</style>
