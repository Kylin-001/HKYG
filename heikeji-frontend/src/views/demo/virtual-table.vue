<template>
  <div class="virtual-table-demo">
    <div class="demo-header">
      <h1>VirtualTable 组件演示</h1>
      <p>基于 Element UI 的增强虚拟滚动表格组件，支持大数据渲染和高级功能</p>
      <div class="demo-nav">
        <el-button-group>
          <el-button
            v-for="tab in tabs"
            :key="tab.key"
            :type="currentTab === tab.key ? 'primary' : ''"
            @click="currentTab = tab.key"
          >
            {{ tab.label }}
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 基本用法 -->
    <div v-if="currentTab === 'basic'" class="demo-section">
      <h2>基本用法</h2>
      <p>展示虚拟表格的基本功能，1000条模拟数据</p>

      <virtual-table
        :data="basicData"
        :columns="basicColumns"
        :show-index="true"
        :row-height="60"
        :table-height="400"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      />
    </div>

    <!-- 搜索功能 -->
    <div v-if="currentTab === 'search'" class="demo-section">
      <h2>搜索和筛选</h2>
      <p>内置搜索表单，支持多字段搜索和筛选</p>

      <virtual-table
        :data="searchData"
        :columns="searchColumns"
        :show-index="true"
        :show-search="true"
        :search-fields="searchFields"
        :row-height="60"
        :table-height="450"
        @search="handleSearch"
      >
        <template v-slot:status-render="{ row, value }">
          <el-tag :type="row.status === 1 ? 'success' : 'warning'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </virtual-table>
    </div>

    <!-- 自定义渲染 -->
    <div v-if="currentTab === 'custom'" class="demo-section">
      <h2>自定义渲染</h2>
      <p>展示各种自定义渲染功能：头像、状态、进度条、标签等</p>

      <virtual-table
        :data="customData"
        :columns="customColumns"
        :show-index="true"
        :row-height="60"
        :table-height="450"
      >
        <template v-slot:avatar-render="{ row, value }">
          <el-avatar :size="40" :src="row.avatar">
            {{ row.name.charAt(0) }}
          </el-avatar>
        </template>

        <template v-slot:department-render="{ row, value }">
          <el-tag type="info">{{ row.department }}</el-tag>
        </template>

        <template v-slot:progress-render="{ row, value }">
          <el-progress
            :percentage="row.progress"
            :status="row.progress === 100 ? 'success' : ''"
            :stroke-width="8"
          />
        </template>

        <template v-slot:level-render="{ row, value }">
          <el-rate v-model="row.level" disabled show-score text-color="#99A9BF" />
        </template>
      </virtual-table>
    </div>

    <!-- 操作功能 -->
    <div v-if="currentTab === 'actions'" class="demo-section">
      <h2>操作功能</h2>
      <p>内置操作按钮栏，支持自定义操作</p>

      <virtual-table
        :data="actionData"
        :columns="actionColumns"
        :show-index="true"
        :actions="tableActions"
        :row-height="60"
        :table-height="400"
        @action="handleAction"
      />
    </div>

    <!-- 工具栏 -->
    <div v-if="currentTab === 'toolbar'" class="demo-section">
      <h2>工具栏和批量操作</h2>
      <p>完整的表格工具栏，支持搜索、批量操作、导入导出</p>

      <virtual-table
        :data="toolbarData"
        :columns="toolbarColumns"
        :show-index="true"
        :show-toolbar="true"
        :show-selection="true"
        :show-search="true"
        :search-fields="toolbarSearchFields"
        :batch-actions="batchActions"
        :row-height="60"
        :table-height="500"
        :refresh-handler="refreshData"
        :add-handler="addItem"
        :export-handler="exportData"
        @search="handleSearch"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:toolbar-left>
          <el-button type="info" @click="bulkImport">
            <i class="el-icon-upload2"></i> 批量导入
          </el-button>
          <el-button type="warning" @click="bulkExport">
            <i class="el-icon-download"></i> 批量导出
          </el-button>
        </template>

        <template v-slot:toolbar-right>
          <el-button type="success" @click="settingTable">
            <i class="el-icon-setting"></i> 表格设置
          </el-button>
        </template>

        <template v-slot:price-render="{ row, value }">
          <span style="color: #f56c6c; font-weight: bold"> ¥{{ row.price.toFixed(2) }} </span>
        </template>

        <template v-slot:stock-render="{ row, value }">
          <el-tag :type="row.stock > 100 ? 'success' : row.stock > 10 ? 'warning' : 'danger'">
            {{ row.stock }}
          </el-tag>
        </template>
      </virtual-table>
    </div>

    <!-- 性能测试 -->
    <div v-if="currentTab === 'performance'" class="demo-section">
      <h2>性能测试</h2>
      <p>测试大数据量下的渲染性能</p>

      <div class="performance-controls">
        <el-form inline>
          <el-form-item label="数据量">
            <el-select v-model="performanceConfig.count" style="width: 120px">
              <el-option label="1000" :value="1000"></el-option>
              <el-option label="5000" :value="5000"></el-option>
              <el-option label="10000" :value="10000"></el-option>
              <el-option label="50000" :value="50000"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行高">
            <el-input-number
              v-model="performanceConfig.rowHeight"
              :min="40"
              :max="100"
              style="width: 100px"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="generatePerformanceData" :loading="generating"> 生成数据 </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="performanceData.length > 0" class="performance-info">
        <el-alert title="性能统计" type="info" :closable="false">
          <div>数据量: {{ performanceData.length }} 条</div>
          <div>渲染时间: {{ performanceStats.renderTime }}ms</div>
          <div>内存占用: {{ performanceStats.memoryUsage }}MB</div>
          <div>DOM 节点数: {{ performanceStats.domNodes }}</div>
        </el-alert>
      </div>

      <virtual-table
        v-if="performanceData.length > 0"
        :data="performanceData"
        :columns="performanceColumns"
        :show-index="true"
        :row-height="performanceConfig.rowHeight"
        :table-height="500"
        @render="handlePerformanceRender"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import logger from '@/utils/logger'

// 类型定义
interface Tab {
  key: string
  label: string
}

interface Column {
  key: string
  label: string
  width?: number
  minWidth?: number
  sortable?: boolean
  showOverflow?: boolean
  align?: string
  render?: string
}

interface SearchField {
  key: string
  label: string
  type: string
  options?: Array<{ label: string; value: string | number }>
}

interface TableAction {
  key: string
  label: string
  type: string
  handler: Function
}

interface PerformanceConfig {
  count: number
  rowHeight: number
}

interface PerformanceStats {
  renderTime: number
  memoryUsage: number
  domNodes: number
}

interface BasicDataItem {
  id: number
  name: string
  email: string
  phone: string
  department: string
  position: string
  joinDate: string
}

interface SearchDataItem {
  id: number
  name: string
  status: number
  department: string
  score: number
}

interface CustomDataItem {
  id: number
  name: string
  avatar: string
  department: string
  progress: number
  level: number
}

interface ActionDataItem {
  id: number
  name: string
  title: string
  createTime: string
}

interface ToolbarDataItem {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: string
}

interface PerformanceDataItem {
  id: number
  name: string
  email: string
  department: string
  score: number
}

// 响应式数据
const currentTab = ref('basic')
const tabs = ref<Tab[]>([
  { key: 'basic', label: '基本用法' },
  { key: 'search', label: '搜索功能' },
  { key: 'custom', label: '自定义渲染' },
  { key: 'actions', label: '操作功能' },
  { key: 'toolbar', label: '工具栏' },
  { key: 'performance', label: '性能测试' },
])

// 基本用法数据
const basicData = ref<BasicDataItem[]>([])
const basicColumns = ref<Column[]>([
  { key: 'id', label: 'ID', width: 80, sortable: true },
  { key: 'name', label: '姓名', minWidth: 150, sortable: true },
  { key: 'email', label: '邮箱', minWidth: 200, showOverflow: true },
  { key: 'phone', label: '电话', width: 120 },
  { key: 'department', label: '部门', width: 120 },
  { key: 'position', label: '职位', width: 120 },
  { key: 'joinDate', label: '入职日期', width: 120 },
])

// 搜索数据
const searchData = ref<SearchDataItem[]>([])
const searchColumns = ref<Column[]>([
  { key: 'id', label: 'ID', width: 80 },
  { key: 'name', label: '姓名', width: 120 },
  { key: 'status', label: '状态', width: 100, render: 'status-render' },
  { key: 'department', label: '部门', width: 120 },
  { key: 'score', label: '评分', width: 100, align: 'center' },
])
const searchFields = ref<SearchField[]>([
  { key: 'name', label: '姓名', type: 'input' },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ],
  },
  { key: 'department', label: '部门', type: 'select', options: [] },
])

// 自定义渲染数据
const customData = ref<CustomDataItem[]>([])
const customColumns = ref<Column[]>([
  { key: 'id', label: 'ID', width: 80 },
  { key: 'avatar', label: '头像', width: 80, render: 'avatar-render' },
  { key: 'name', label: '姓名', width: 120 },
  { key: 'department', label: '部门', width: 120, render: 'department-render' },
  { key: 'progress', label: '进度', width: 150, render: 'progress-render' },
  { key: 'level', label: '评级', width: 180, render: 'level-render' },
])

// 操作功能数据
const actionData = ref<ActionDataItem[]>([])
const actionColumns = ref<Column[]>([
  { key: 'id', label: 'ID', width: 80 },
  { key: 'name', label: '姓名', width: 120 },
  { key: 'title', label: '标题', minWidth: 200 },
  { key: 'createTime', label: '创建时间', width: 120 },
])
const tableActions = ref<TableAction[]>([
  { key: 'view', label: '查看', type: 'primary', handler: viewItem },
  { key: 'edit', label: '编辑', type: 'success', handler: editItem },
  { key: 'delete', label: '删除', type: 'danger', handler: deleteItem },
])

// 工具栏数据
const toolbarData = ref<ToolbarDataItem[]>([])
const toolbarColumns = ref<Column[]>([
  { key: 'id', label: 'ID', width: 80 },
  { key: 'name', label: '商品名称', minWidth: 200 },
  { key: 'category', label: '分类', width: 120 },
  { key: 'price', label: '价格', width: 100, render: 'price-render' },
  { key: 'stock', label: '库存', width: 100, render: 'stock-render' },
  { key: 'status', label: '状态', width: 100 },
])
const toolbarSearchFields = ref<SearchField[]>([
  { key: 'name', label: '商品名称', type: 'input' },
  { key: 'category', label: '分类', type: 'select', options: [] },
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
])
const batchActions = ref<TableAction[]>([
  { key: 'delete', label: '批量删除', type: 'danger', handler: batchDelete },
  { key: 'export', label: '批量导出', type: 'warning', handler: batchExport },
])

// 性能测试数据
const performanceData = ref<PerformanceDataItem[]>([])
const performanceConfig = reactive<PerformanceConfig>({
  count: 10000,
  rowHeight: 60,
})
const performanceStats = reactive<PerformanceStats>({
  renderTime: 0,
  memoryUsage: 0,
  domNodes: 0,
})
const performanceColumns = ref<Column[]>([
  { key: 'id', label: 'ID', width: 80 },
  { key: 'name', label: '姓名', width: 150 },
  { key: 'email', label: '邮箱', minWidth: 200 },
  { key: 'department', label: '部门', width: 120 },
  { key: 'score', label: '评分', width: 100, align: 'center' },
])
const generating = ref(false)

// 生命周期钩子
onMounted(() => {
  initData()
})

// 初始化数据
function initData() {
  generateBasicData()
  generateSearchData()
  generateCustomData()
  generateActionData()
  generateToolbarData()
  generateDepartmentOptions()
}

// 生成基本数据
function generateBasicData() {
  const departments = ['技术部', '产品部', '市场部', '运营部', '财务部']
  const positions = ['工程师', '产品经理', '市场专员', '运营专员', '会计']
  const surnames = ['王', '李', '张', '刘', '陈', '杨', '黄', '赵', '吴', '周']
  const givenNames = ['伟', '芳', '娜', '秀', '敏', '静', '丽', '强', '磊', '军']

  basicData.value = []
  for (let i = 1; i <= 1000; i++) {
    const surname = surnames[Math.floor(Math.random() * surnames.length)]
    const givenName = givenNames[Math.floor(Math.random() * givenNames.length)]
    const department = departments[Math.floor(Math.random() * departments.length)]
    const position = positions[Math.floor(Math.random() * positions.length)]

    basicData.value.push({
      id: i,
      name: surname + givenName,
      email: `user${i}@company.com`,
      phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      department,
      position,
      joinDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    })
  }
}

// 生成搜索数据
function generateSearchData() {
  const departments = ['技术部', '产品部', '市场部', '运营部', '财务部']

  searchData.value = []
  for (let i = 1; i <= 500; i++) {
    searchData.value.push({
      id: i,
      name: `用户${i}`,
      status: Math.random() > 0.3 ? 1 : 0,
      department: departments[Math.floor(Math.random() * departments.length)],
      score: Math.floor(Math.random() * 100),
    })
  }
}

// 生成自定义渲染数据
function generateCustomData() {
  const departments = ['前端团队', '后端团队', '设计团队', '测试团队', '运维团队']

  customData.value = []
  for (let i = 1; i <= 200; i++) {
    customData.value.push({
      id: i,
      name: `用户${i}`,
      avatar: `https://via.placeholder.com/40x40?text=${i}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      progress: Math.floor(Math.random() * 100),
      level: Math.floor(Math.random() * 5) + 1,
    })
  }
}

// 生成操作数据
function generateActionData() {
  actionData.value = []
  for (let i = 1; i <= 300; i++) {
    actionData.value.push({
      id: i,
      name: `项目${i}`,
      title: `这是第${i}个项目的标题，用于测试操作功能`,
      createTime: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    })
  }
}

// 生成工具栏数据
function generateToolbarData() {
  const categories = ['电子产品', '服装', '食品', '图书', '家居']

  toolbarData.value = []
  for (let i = 1; i <= 800; i++) {
    toolbarData.value.push({
      id: i,
      name: `商品${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price: Math.random() * 1000,
      stock: Math.floor(Math.random() * 500),
      status: Math.random() > 0.5 ? '1' : '0',
    })
  }
}

// 生成部门选项
function generateDepartmentOptions() {
  const departments = ['技术部', '产品部', '市场部', '运营部', '财务部']
  const departmentField = searchFields.value.find(field => field.key === 'department')
  if (departmentField) {
    departmentField.options = departments.map(dept => ({ label: dept, value: dept }))
  }

  const categories = ['电子产品', '服装', '食品', '图书', '家居']
  const categoryField = toolbarSearchFields.value.find(field => field.key === 'category')
  if (categoryField) {
    categoryField.options = categories.map(cat => ({ label: cat, value: cat }))
  }
}

// 事件处理
function handleSelectionChange(selection: any[]) {
  handleLog('选中项:', selection)
}

function handleSortChange({ column, prop, order }: any) {
  handleLog('排序变化:', { column, prop, order })
}

function handleSearch(searchParams: any) {
  handleLog('搜索参数:', searchParams)
  ElMessage.info(`搜索条件: ${JSON.stringify(searchParams)}`)
}

function handleAction(action: string, row: any) {
  handleLog('操作:', action, row)
  ElMessage.success(`执行操作: ${action} - ${row.name || row.title}`)
}

// 统一日志处理方法
function handleLog(...args: any[]) {
  logger.debug(...args)
}

// 工具栏操作
function refreshData() {
  initData()
  ElMessage.success('数据已刷新')
}

function addItem() {
  ElMessage.info('添加新项目')
}

function exportData() {
  ElMessage.info('导出数据')
}

function bulkImport() {
  ElMessage.info('批量导入')
}

function bulkExport() {
  ElMessage.info('批量导出')
}

function settingTable() {
  ElMessage.info('表格设置')
}

// 操作处理
function viewItem(row: any) {
  ElMessage.info(`查看: ${row.name}`)
}

function editItem(row: any) {
  ElMessage.info(`编辑: ${row.name}`)
}

function deleteItem(row: any) {
  ElMessage.warning(`删除: ${row.name}`)
}

// 批量操作
function batchDelete() {
  ElMessage.warning('批量删除')
}

// 性能测试
async function generatePerformanceData() {
  generating.value = true
  const startTime = Date.now()

  const departments = ['技术部', '产品部', '市场部', '运营部', '财务部']
  const surnames = ['王', '李', '张', '刘', '陈']

  performanceData.value = []
  for (let i = 1; i <= performanceConfig.count; i++) {
    const surname = surnames[Math.floor(Math.random() * surnames.length)]
    performanceData.value.push({
      id: i,
      name: `${surname}${i}`,
      email: `user${i}@company.com`,
      department: departments[Math.floor(Math.random() * departments.length)],
      score: Math.floor(Math.random() * 100),
    })
  }

  performanceStats.renderTime = Date.now() - startTime
  generating.value = false
  ElMessage.success(`生成了 ${performanceData.value.length} 条数据`)
}

function handlePerformanceRender() {
  // 估算DOM节点数量（显示的行数约等于表格高度/行高）
  const visibleRows = Math.ceil(500 / performanceConfig.rowHeight)
  performanceStats.domNodes = visibleRows + 10 // 加上表头等额外节点

  // 内存使用估算（粗略）
  performanceStats.memoryUsage = performanceData.value.length * 0.001
}
</script>

<style scoped>
.virtual-table-demo {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.demo-header h1 {
  color: #303133;
  margin-bottom: 10px;
}

.demo-header p {
  color: #606266;
  margin-bottom: 20px;
}

.demo-nav {
  display: flex;
  justify-content: center;
}

.demo-section {
  background: white;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  color: #303133;
  margin-bottom: 10px;
  border-bottom: 2px solid #e4e7ed;
  padding-bottom: 10px;
}

.demo-section p {
  color: #606266;
  margin-bottom: 20px;
}

.performance-controls {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.performance-info {
  margin-bottom: 20px;
}

.el-button-group {
  display: flex;
  justify-content: center;
}
</style>
