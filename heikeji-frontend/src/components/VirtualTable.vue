<template>
  <div class="virtual-table-container">
    <!-- 表格工具栏 -->
    <div v-if="showToolbar" class="table-toolbar">
      <div class="toolbar-left">
        <slot name="toolbar-left">
          <el-button v-if="showRefresh" type="primary" size="small" @click="refresh">
            <i class="el-icon-refresh"></i> 刷新
          </el-button>
          <el-button v-if="showAdd && addHandler" type="success" size="small" @click="handleAdd">
            <i class="el-icon-plus"></i> 添加
          </el-button>
          <el-button
            v-if="showExport && exportHandler"
            type="warning"
            size="small"
            @click="handleExport"
          >
            <i class="el-icon-download"></i> 导出
          </el-button>
        </slot>
      </div>
      <div class="toolbar-right">
        <slot name="toolbar-right">
          <!-- 自定义工具栏插槽 -->
        </slot>
      </div>
    </div>

    <!-- 批量操作栏 -->
    <div v-if="showBatchToolbar && selectedRows.length > 0" class="batch-toolbar">
      <el-tag size="small" type="info">已选择 {{ selectedRows.length }} 项</el-tag>
      <el-button
        v-for="action in batchActions"
        :key="action.key"
        :type="action.type || 'primary'"
        size="small"
        @click="handleBatchAction(action)"
      >
        {{ action.label }}
      </el-button>
    </div>

    <!-- 搜索栏 -->
    <div v-if="showSearch" class="search-toolbar">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item v-for="field in searchFields" :key="field.key" :label="field.label">
          <component
            :is="getSearchComponent(field)"
            v-model="searchForm[field.key]"
            v-bind="field.props"
            @change="handleSearchChange"
            clearable
          >
            <template v-if="field.type === 'select'">
              <el-option
                v-for="option in field.options || []"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </template>
          </component>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 虚拟滚动表格 -->
    <div
      ref="tableWrapper"
      class="virtual-table-wrapper"
      :style="{ height: tableHeight + 'px' }"
      @scroll="handleScroll"
    >
      <!-- 占位元素 -->
      <div :style="{ height: totalHeight + 'px', position: 'relative' }">
        <!-- 实际渲染的行 -->
        <div
          v-for="(row, index) in visibleData"
          :key="rowKey(row, index)"
          :style="{
            position: 'absolute',
            top: index * rowHeight + 'px',
            left: 0,
            right: 0,
            height: rowHeight + 'px',
          }"
          class="virtual-row"
        >
          <el-table
            :data="[row]"
            :show-header="index === 0"
            stripe
            border
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
            @sort-change="handleSortChange"
            size="small"
            style="width: 100%; height: 100%"
          >
            <!-- 选择列 -->
            <el-table-column
              v-if="showSelection"
              type="selection"
              width="55"
              :fixed="true"
            ></el-table-column>

            <!-- 索引列 -->
            <el-table-column
              v-if="showIndex"
              type="index"
              label="序号"
              width="80"
              :index="getIndex"
              :fixed="true"
            ></el-table-column>

            <!-- 自定义列 -->
            <template v-for="column in columns">
              <el-table-column
                :key="column.key"
                :prop="column.key"
                :label="column.label"
                :width="column.width"
                :min-width="column.minWidth"
                :fixed="column.fixed"
                :sortable="column.sortable"
                :align="column.align || 'left'"
                :show-overflow-tooltip="column.showOverflow !== false"
              >
                <template #default="scope">
                  <!-- 自定义渲染器 -->
                  <component
                    v-if="column.render"
                    :is="column.render"
                    :row="scope.row"
                    :value="scope.row[column.key]"
                    :column="column"
                    :index="scope.$index"
                  />
                  <span v-else>{{ formatCellValue(scope.row[column.key], column) }}</span>
                </template>
              </el-table-column>
            </template>

            <!-- 操作列 -->
            <el-table-column
              v-if="showActions && actions.length > 0"
              label="操作"
              :width="actionsColumnWidth"
              :fixed="actionsFixed"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-for="action in actions"
                  :key="action.key"
                  :type="action.type || 'primary'"
                  :size="action.size || 'small'"
                  @click="handleAction(action, scope.row, scope.$index)"
                  :disabled="action.disabled && action.disabled(scope.row)"
                >
                  <i v-if="action.icon" :class="action.icon"></i>
                  {{ action.label }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="showPagination" class="pagination-wrapper">
      <el-pagination
        background
        :layout="paginationLayout"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @prev-click="handlePrevClick"
        @next-click="handleNextClick"
      />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <el-loading-spinner />
      <div class="loading-text">{{ loadingText || '加载中...' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'

// 定义组件类型
interface SearchField {
  key: string
  label: string
  type: 'input' | 'select' | 'date' | 'datetime' | 'number'
  options?: { value: any; label: string }[]
  props?: Record<string, any>
}

interface Action {
  key: string
  label: string
  type?: string
  size?: string
  icon?: string
  handler?: (row: any, index?: number) => void
  disabled?: (row: any) => boolean
}

interface BatchAction {
  key: string
  label: string
  type?: string
  handler?: (rows: any[]) => void
}

interface Column {
  key: string
  label: string
  width?: number
  minWidth?: number
  fixed?: boolean
  sortable?: boolean
  align?: string
  showOverflow?: boolean
  type?: 'number' | 'currency' | 'date' | 'datetime' | 'boolean'
  formatter?: (value: any, column: Column) => string
  render?: any
}

// 定义props
const props = defineProps<{
  // 数据相关
  data: any[]
  columns: Column[]
  total: number

  // 配置相关
  rowKey?: (row: any, index: number) => any
  rowHeight?: number
  tableHeight?: number

  // 功能开关
  showToolbar?: boolean
  showSearch?: boolean
  showBatchToolbar?: boolean
  showSelection?: boolean
  showIndex?: boolean
  showActions?: boolean
  showPagination?: boolean
  showRefresh?: boolean
  showAdd?: boolean
  showExport?: boolean

  // 分页配置
  pageSize?: number
  currentPage?: number
  pageSizes?: number[]
  paginationLayout?: string

  // 操作配置
  actions?: Action[]
  actionsColumnWidth?: number
  actionsFixed?: string
  batchActions?: BatchAction[]

  // 搜索配置
  searchFields?: SearchField[]

  // 其他配置
  loading?: boolean
  loadingText?: string

  // 事件处理函数
  addHandler?: () => void
  exportHandler?: () => void
  refreshHandler?: () => void
}>()

// 定义默认值
const defaultProps = {
  rowKey: (row: any, index: number) => index,
  rowHeight: 60,
  tableHeight: 500,
  total: 0,
  showToolbar: true,
  showSearch: false,
  showBatchToolbar: false,
  showSelection: false,
  showIndex: false,
  showActions: true,
  showPagination: true,
  showRefresh: true,
  showAdd: false,
  showExport: false,
  pageSize: 20,
  currentPage: 1,
  pageSizes: [10, 20, 50, 100],
  paginationLayout: 'total, prev, pager, next, jumper',
  actions: [],
  actionsColumnWidth: 200,
  actionsFixed: 'right',
  batchActions: [],
  searchFields: [],
  loading: false,
  loadingText: '',
  data: [],
}

// 定义响应式数据
const tableWrapper = ref<HTMLElement | null>(null)
const selectedRows = ref<any[]>([])
const searchForm = reactive<Record<string, any>>({})
const scrollTop = ref(0)
const containerHeight = ref(props.tableHeight || defaultProps.tableHeight)
const visibleStart = ref(0)
const visibleEnd = ref(0)

// 定义computed
const totalHeight = computed(() => {
  return (props.data || []).length * (props.rowHeight || defaultProps.rowHeight)
})

const visibleData = computed(() => {
  const data = props.data || []
  if (!data || data.length === 0) {
    return []
  }

  const start = Math.max(0, visibleStart.value - 5) // 预加载更多行
  const end = Math.min(data.length, visibleEnd.value + 5)

  return data.slice(start, end)
})

// 定义emits
const emit = defineEmits<{
  (e: 'selection-change', rows: any[]): void
  (e: 'row-click', row: any, column: any, event: Event): void
  (e: 'sort-change', params: { column: any; prop: string; order: string }): void
  (e: 'size-change', size: number): void
  (e: 'current-change', page: number): void
  (e: 'prev-click'): void
  (e: 'next-click'): void
  (e: 'search', params: Record<string, any>): void
  (e: 'action', params: { action: Action; row: any; index: number }): void
  (e: 'batch-action', params: { action: BatchAction; rows: any[] }): void
  (e: 'add'): void
  (e: 'export'): void
  (e: 'refresh'): void
}>()

// 初始化搜索表单
const initSearchForm = () => {
  const form: Record<string, any> = {}(props.searchFields || []).forEach(field => {
    form[field.key] = ''
  })
  Object.assign(searchForm, form)
}

// 计算可见范围
const calculateVisibleRange = () => {
  visibleStart.value = Math.floor(scrollTop.value / (props.rowHeight || defaultProps.rowHeight))
  visibleEnd.value = Math.min(
    (props.data || []).length,
    visibleStart.value +
      Math.ceil(containerHeight.value / (props.rowHeight || defaultProps.rowHeight)) +
      1
  )
}

// 滚动处理
const handleScroll = (event: Event) => {
  scrollTop.value = (event.target as HTMLElement).scrollTop
  nextTick(() => {
    calculateVisibleRange()
  })
}

// 获取列索引
const getIndex = (index: number) => {
  return (
    index +
    (props.currentPage || defaultProps.currentPage) * (props.pageSize || defaultProps.pageSize) -
    (props.pageSize || defaultProps.pageSize) +
    1
  )
}

// 获取搜索组件
const getSearchComponent = (field: SearchField) => {
  const componentMap: Record<string, string> = {
    input: 'el-input',
    select: 'el-select',
    date: 'el-date-picker',
    datetime: 'el-date-picker',
    number: 'el-input-number',
  }
  return componentMap[field.type] || 'el-input'
}

// 格式化单元格值
const formatCellValue = (value: any, column: Column) => {
  if (column.formatter) {
    return column.formatter(value, column)
  }

  // 默认格式化
  if (value === null || value === undefined) {
    return '--'
  }

  if (column.type === 'number' && typeof value === 'number') {
    return value.toLocaleString()
  }

  if (column.type === 'currency') {
    return `¥${(value || 0).toFixed(2)}`
  }

  if (column.type === 'date') {
    return new Date(value).toLocaleDateString()
  }

  if (column.type === 'datetime') {
    return new Date(value).toLocaleString()
  }

  if (column.type === 'boolean') {
    return value ? '是' : '否'
  }

  return String(value)
}

// 事件处理方法
const handleSelectionChange = (selection: any[]) => {
  // 单独处理当前选择
  const currentRow = selection[selection.length - 1]
  if (currentRow) {
    const index = selectedRows.value.findIndex(
      row =>
        (props.rowKey || defaultProps.rowKey)(row) ===
        (props.rowKey || defaultProps.rowKey)(currentRow)
    )
    if (index > -1) {
      selectedRows.value.splice(index, 1)
    } else {
      selectedRows.value.push(currentRow)
    }
  }

  emit('selection-change', selectedRows.value)
}

const handleRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event)
}

const handleSortChange = ({
  column,
  prop,
  order,
}: {
  column: any
  prop: string
  order: string
}) => {
  emit('sort-change', { column, prop, order })
}

const handleSizeChange = (val: number) => {
  emit('size-change', val)
}

const handleCurrentChange = (val: number) => {
  emit('current-change', val)
}

const handlePrevClick = () => {
  emit('prev-click')
}

const handleNextClick = () => {
  emit('next-click')
}

const handleSearch = () => {
  emit('search', { ...searchForm })
}

const handleSearchChange = () => {
  // 搜索条件改变时的自动搜索
  // if (this.autoSearch) {
  //   this.handleSearch()
  // }
}

const resetSearch = () => {
  initSearchForm()
  emit('search', { ...searchForm })
}

const handleAction = (action: Action, row: any, index: number) => {
  if (action.handler) {
    action.handler(row, index)
  }
  emit('action', { action, row, index })
}

const handleBatchAction = (action: BatchAction) => {
  if (action.handler) {
    action.handler(selectedRows.value)
  }
  emit('batch-action', { action, rows: selectedRows.value })
}

const handleAdd = () => {
  if (props.addHandler) {
    props.addHandler()
  }
  emit('add')
}

const handleExport = () => {
  if (props.exportHandler) {
    props.exportHandler()
  }
  emit('export')
}

const refresh = () => {
  if (props.refreshHandler) {
    props.refreshHandler()
  }
  emit('refresh')
}

// 公共方法
const getSelectedRows = () => {
  return selectedRows.value
}

const clearSelection = () => {
  selectedRows.value = []
}

const toggleRowSelection = (row: any, selected: boolean) => {
  const index = selectedRows.value.findIndex(
    r => (props.rowKey || defaultProps.rowKey)(r) === (props.rowKey || defaultProps.rowKey)(row)
  )
  if (selected && index === -1) {
    selectedRows.value.push(row)
  } else if (!selected && index > -1) {
    selectedRows.value.splice(index, 1)
  }
}

// 生命周期钩子
onMounted(() => {
  calculateVisibleRange()
  initSearchForm()
})

// 暴露公共方法
defineExpose({
  getSelectedRows,
  clearSelection,
  toggleRowSelection,
})
</script>

<style scoped>
.virtual-table-container {
  position: relative;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.batch-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.search-toolbar {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  background: #fafafa;
}

.search-form .el-form-item {
  margin-bottom: 0;
}

.virtual-table-wrapper {
  overflow: auto;
  position: relative;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.virtual-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  background: white;
}

.virtual-row:hover {
  background: #f5f7fa;
}

.virtual-row:last-child {
  border-bottom: none;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 16px;
  border-top: 1px solid #ebeef5;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-text {
  margin-top: 16px;
  color: #606266;
}
</style>
