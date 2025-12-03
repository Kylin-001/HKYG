<template>
  <div class="test-virtual-table">
    <h2>VirtualTable 功能测试</h2>

    <!-- 测试基本功能 -->
    <h3>1. 基本表格测试（1000条数据）</h3>
    <virtual-table :data="testData" :columns="basicColumns" :show-index="true" :row-height="60" />

    <!-- 测试搜索功能 -->
    <h3>2. 搜索和筛选测试</h3>
    <virtual-table
      :data="testData"
      :columns="searchColumns"
      :show-search="true"
      :show-index="true"
      :search-fields="searchFields"
      :row-height="60"
    />

    <!-- 测试操作按钮 -->
    <h3>3. 操作按钮测试</h3>
    <virtual-table
      :data="testData"
      :columns="actionColumns"
      :show-index="true"
      :actions="tableActions"
      :row-height="60"
      @action="handleAction"
    />

    <!-- 测试工具栏 -->
    <h3>4. 工具栏测试</h3>
    <virtual-table
      :data="testData"
      :columns="basicColumns"
      :show-index="true"
      :show-toolbar="true"
      :show-selection="true"
      :show-search="true"
      :search-fields="searchFields"
      :batch-actions="batchActions"
      :row-height="60"
      :refresh-handler="refreshData"
      :add-handler="addItem"
      :export-handler="exportData"
      @search="handleSearch"
      @selection-change="handleSelectionChange"
    >
      <template #toolbar-left>
        <el-button type="info" @click="bulkEdit"> <i class="el-icon-edit"></i> 批量编辑 </el-button>
      </template>

      <template #status-render="{ row, value }">
        <el-tag :type="row.status === 'active' ? 'success' : 'warning'">
          {{ row.status === 'active' ? '正常' : '待审核' }}
        </el-tag>
      </template>

      <template #avatar-render="{ row, value }">
        <el-avatar :size="40" :src="row.avatar">
          {{ row.name.charAt(0) }}
        </el-avatar>
      </template>

      <template #price-render="{ row, value }">
        <span style="color: #e6a23c; font-weight: bold"> ¥{{ row.price.toFixed(2) }} </span>
      </template>
    </virtual-table>

    <!-- 测试自定义渲染 -->
    <h3>5. 自定义渲染测试</h3>
    <virtual-table
      :data="testData"
      :columns="customRenderColumns"
      :show-index="true"
      :show-actions="true"
      :actions="tableActions"
      :row-height="60"
      @action="handleAction"
    />

    <!-- 性能测试 -->
    <h3>6. 性能测试（10000条数据）</h3>
    <div style="margin: 10px 0">
      <el-button @click="generateLargeData" :loading="generating"> 生成10000条数据 </el-button>
      <span style="margin-left: 20px"> 渲染时间: {{ renderTime }}ms </span>
    </div>

    <virtual-table
      v-if="largeData.length > 0"
      :data="largeData"
      :columns="basicColumns"
      :show-index="true"
      :row-height="60"
      :table-height="500"
      @render="handleRender"
    />
  </div>
</template>

<script setup lang="ts">
// 导入日志工具
import logger from '@/utils/logger'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 定义类型接口
interface TestDataItem {
  id: number
  name: string
  email: string
  department: string
  status: 'active' | 'pending'
  score: number
  avatar?: string
  price?: number
}

interface Column {
  key: string
  label: string
  width: number
  minWidth?: number
  sortable?: boolean
  align?: string
  showOverflow?: boolean
  render?: string
}

interface SearchField {
  key: string
  label: string
  type: 'input' | 'select'
  options?: Array<{ label: string; value: string }>
}

interface TableAction {
  key: string
  label: string
  type: 'primary' | 'success' | 'danger' | 'warning' | 'info'
  handler: (row: TestDataItem) => void
}

interface BatchAction {
  key: string
  label: string
  type: 'primary' | 'success' | 'danger' | 'warning' | 'info'
  handler: () => void
}

// 响应式数据
const testData = ref<TestDataItem[]>([])
const largeData = ref<TestDataItem[]>([])
const generating = ref(false)
const renderTime = ref(0)

// 表格列配置
const basicColumns: Column[] = [
  {
    key: 'id',
    label: 'ID',
    width: 80,
    sortable: true,
  },
  {
    key: 'name',
    label: '用户名',
    minWidth: 150,
    sortable: true,
  },
  {
    key: 'email',
    label: '邮箱',
    minWidth: 200,
    showOverflow: true,
  },
  {
    key: 'department',
    label: '部门',
    width: 120,
  },
  {
    key: 'score',
    label: '评分',
    width: 100,
    align: 'center',
    sortable: true,
  },
]

const searchColumns: Column[] = [
  {
    key: 'id',
    label: 'ID',
    width: 80,
  },
  {
    key: 'name',
    label: '用户名',
    width: 150,
  },
  {
    key: 'status',
    label: '状态',
    width: 100,
    render: 'status-render',
  },
  {
    key: 'department',
    label: '部门',
    width: 120,
  },
  {
    key: 'score',
    label: '评分',
    width: 100,
    align: 'center',
  },
]

const actionColumns: Column[] = [
  {
    key: 'id',
    label: 'ID',
    width: 80,
  },
  {
    key: 'name',
    label: '用户名',
    width: 150,
  },
  {
    key: 'avatar',
    label: '头像',
    width: 80,
    render: 'avatar-render',
  },
  {
    key: 'status',
    label: '状态',
    width: 100,
    render: 'status-render',
  },
  {
    key: 'price',
    label: '价格',
    width: 100,
    render: 'price-render',
  },
]

const customRenderColumns: Column[] = [
  {
    key: 'id',
    label: 'ID',
    width: 80,
  },
  {
    key: 'name',
    label: '用户名',
    width: 150,
    render: 'name-render',
  },
  {
    key: 'email',
    label: '邮箱',
    width: 200,
    render: 'email-render',
  },
  {
    key: 'score',
    label: '评分',
    width: 100,
    align: 'center',
    render: 'score-render',
  },
]

// 搜索字段配置
const searchFields = ref<SearchField[]>([
  {
    key: 'name',
    label: '用户名',
    type: 'input',
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '正常', value: 'active' },
      { label: '待审核', value: 'pending' },
    ],
  },
  {
    key: 'department',
    label: '部门',
    type: 'select',
    options: [],
  },
])

// 表格操作配置
const tableActions: TableAction[] = [
  {
    key: 'view',
    label: '查看',
    type: 'primary',
    handler: viewItem,
  },
  {
    key: 'edit',
    label: '编辑',
    type: 'success',
    handler: editItem,
  },
  {
    key: 'delete',
    label: '删除',
    type: 'danger',
    handler: deleteItem,
  },
]

// 批量操作配置
const batchActions: BatchAction[] = [
  {
    key: 'delete',
    label: '批量删除',
    type: 'danger',
    handler: batchDelete,
  },
  {
    key: 'export',
    label: '批量导出',
    type: 'warning',
    handler: batchExport,
  },
]

// 生成测试数据
function generateTestData() {
  const departments = ['技术部', '产品部', '市场部', '运营部', '财务部']
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
  const surnames = [
    '伟',
    '芳',
    '娜',
    '敏',
    '静',
    '丽',
    '强',
    '磊',
    '军',
    '洋',
    '勇',
    '艳',
    '杰',
    '涛',
    '明',
    '超',
    '秀英',
    '霞',
    '平',
    '刚',
  ]

  const data: TestDataItem[] = []
  for (let i = 1; i <= 1000; i++) {
    const surname = surnames[Math.floor(Math.random() * surnames.length)]
    const name = names[Math.floor(Math.random() * names.length)]
    const department = departments[Math.floor(Math.random() * departments.length)]

    data.push({
      id: i,
      name: surname + name,
      email: `${surname.toLowerCase()}${name.toLowerCase()}@company.com`,
      department,
      status: Math.random() > 0.3 ? 'active' : 'pending',
      score: Math.floor(Math.random() * 100),
      avatar: `https://via.placeholder.com/40x40?text=${name.charAt(0)}`,
      price: Math.random() * 1000,
    })
  }
  testData.value = data
}

// 生成部门选项
function generateDepartmentOptions() {
  const departments = ['技术部', '产品部', '市场部', '运营部', '财务部']
  const departmentField = searchFields.value.find(field => field.key === 'department')
  if (departmentField) {
    departmentField.options = departments.map(dept => ({ label: dept, value: dept }))
  }
}

// 生成大量数据
async function generateLargeData() {
  generating.value = true
  const startTime = Date.now()

  const departments = ['技术部', '产品部', '市场部', '运营部', '财务部']
  const surnames = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋']

  const data: TestDataItem[] = []
  for (let i = 1; i <= 10000; i++) {
    const surname = surnames[Math.floor(Math.random() * surnames.length)]
    const department = departments[Math.floor(Math.random() * departments.length)]

    data.push({
      id: i,
      name: surname + i,
      email: `user${i}@company.com`,
      department,
      status: Math.random() > 0.5 ? 'active' : 'pending',
      score: Math.floor(Math.random() * 100),
    })
  }

  largeData.value = data
  renderTime.value = Date.now() - startTime
  generating.value = false
  ElMessage.success(`生成了 ${largeData.value.length} 条数据，耗时 ${renderTime.value}ms`)
}

// 事件处理方法
function handleSearch(searchParams: any) {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('搜索参数:', searchParams)
  }
  ElMessage.info(`搜索: ${JSON.stringify(searchParams)}`)
}

function handleSelectionChange(selection: TestDataItem[]) {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('选中项:', selection)
  }
}

function handleAction(action: string, row: TestDataItem) {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('操作:', action, row)
  }
  ElMessage.info(`执行操作: ${action} - ${row.name}`)
}

function handleRender() {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('表格渲染完成')
  }
}

// 工具栏操作
function refreshData() {
  generateTestData()
  ElMessage.success('数据已刷新')
}

function addItem() {
  ElMessage.info('添加新项目')
}

function exportData() {
  ElMessage.info('导出数据')
}

function bulkEdit() {
  ElMessage.info('批量编辑')
}

// 操作处理
function viewItem(row: TestDataItem) {
  ElMessage.info(`查看: ${row.name}`)
}

function editItem(row: TestDataItem) {
  ElMessage.info(`编辑: ${row.name}`)
}

function deleteItem(row: TestDataItem) {
  ElMessage.warning(`删除: ${row.name}`)
}

// 批量操作
function batchDelete() {
  ElMessage.warning('批量删除')
}

function batchExport() {
  ElMessage.info('批量导出')
}

// 组件挂载时初始化数据
onMounted(() => {
  generateTestData()
  generateDepartmentOptions()
})
</script>

<style scoped>
.test-virtual-table {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.test-virtual-table h2 {
  color: #303133;
  margin-bottom: 30px;
  text-align: center;
}

.test-virtual-table h3 {
  color: #606266;
  margin: 30px 0 15px 0;
  font-size: 18px;
  border-bottom: 2px solid #e4e7ed;
  padding-bottom: 10px;
}

.virtual-table {
  margin-bottom: 40px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
