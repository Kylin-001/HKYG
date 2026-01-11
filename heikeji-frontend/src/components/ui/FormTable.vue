<!--
@fileoverview 增强表单表格组件
@description 支持表单验证、行内编辑、动态表单生成、与VirtualTable集成
@example
  <FormTable
    :columns="columns"
    :data="tableData"
    :rules="rules"
    @save="handleSave"
    @delete="handleDelete"
  />
-->
<template>
  <div class="form-table">
    <!-- 表格工具栏 -->
    <div class="table-toolbar" v-if="showToolbar">
      <div class="toolbar-left">
        <el-button type="primary" :disabled="disabled" @click="handleAddRow" :icon="h(Plus)">
          添加行
        </el-button>
        <el-button
          v-if="hasSelectedRows"
          type="danger"
          :disabled="disabled"
          @click="handleDeleteSelected"
          :icon="h(Delete)"
        >
          删除选中
        </el-button>
        <el-button
          v-if="hasSelectedRows"
          :disabled="disabled"
          @click="handleBatchSave"
          :icon="h(Check)"
        >
          保存选中
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-button :disabled="disabled" @click="handleRefresh" :icon="h(Refresh)"> 刷新 </el-button>
        <el-button :disabled="disabled" @click="handleExport" :icon="h(Download)"> 导出 </el-button>
      </div>
    </div>

    <!-- 表格主体 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      :height="height"
      :max-height="maxHeight"
      :stripe="stripe"
      :border="border"
      :row-key="rowKey"
      :default-expand-all="defaultExpandAll"
      :tree-props="treeProps"
      :row-class-name="rowClassName"
      :row-style="rowStyle"
      :cell-class-name="cellClassName"
      :cell-style="cellStyle"
      :header-row-class-name="headerRowClassName"
      :header-row-style="headerRowStyle"
      :header-cell-class-name="headerCellClassName"
      :header-cell-style="headerCellStyle"
      :select-on-indeterminate="selectOnIndeterminate"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblclick"
      @expand-change="handleExpandChange"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
      @current-change="handleCurrentChange"
      @header-click="handleHeaderClick"
      @header-contextmenu="handleHeaderContextmenu"
      @cell-click="handleCellClick"
      @cell-dblclick="handleCellDblclick"
      @cell-contextmenu="handleCellContextmenu"
      class="form-table__table"
    >
      <!-- 多选列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        :reserve-selection="reserveSelection"
        :selectable="selectable"
        :width="selectionWidth"
      />

      <!-- 展开列 -->
      <el-table-column v-if="showExpand" type="expand" :width="expandWidth">
        <template #default="{ row }">
          <slot name="expand" :row="row" :row-index="tableData.indexOf(row)">
            <!-- 默认展开内容 -->
            <div class="expand-content">
              <div v-for="(column, index) in columns" :key="index" class="expand-item">
                <span class="expand-label">{{ column.label }}:</span>
                <span class="expand-value">{{ row[column.prop] }}</span>
              </div>
            </div>
          </slot>
        </template>
      </el-table-column>

      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        :index="indexMethod"
        :width="indexWidth"
        label="序号"
      />

      <!-- 自定义列 -->
      <template v-for="column in columns" :key="column.prop || column.label">
        <!-- 基础列 -->
        <el-table-column
          v-if="!column.type"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :sortable="column.sortable"
          :sort-method="column.sortMethod"
          :sort-by="column.sortBy"
          :sort-orders="column.sortOrders"
          :resizable="column.resizable"
          :show-overflow-tooltip="column.showOverflowTooltip"
          :align="column.align || 'left'"
          :header-align="column.headerAlign || 'center'"
          :formatter="column.formatter"
          :filter-multiple="column.filterMultiple"
          :filters="column.filters"
          :filter-method="column.filterMethod"
          :filter-placement="column.filterPlacement"
          :filter-dropdown-class-name="column.filterDropdownClassName"
          :filter-dropdown="column.filterDropdown"
          :render-header="column.renderHeader"
        >
          <template #default="scope">
            <slot :name="`column-${column.prop}`" :scope="scope">
              {{ scope.row[column.prop] }}
            </slot>
          </template>
        </el-table-column>

        <!-- 可编辑列 -->
        <el-table-column
          v-else
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :sortable="column.sortable"
          :resizable="column.resizable"
          :show-overflow-tooltip="column.showOverflowTooltip"
          :align="column.align || 'left'"
          :header-align="column.headerAlign || 'center'"
        >
          <template #default="scope">
            <div
              class="editable-cell"
              @click="handleCellClick(scope.$index, column.prop, scope.row)"
            >
              <!-- 非编辑状态 -->
              <span v-if="!editingCells[scope.$index]?.[column.prop]" class="cell-text">
                <slot :name="`column-${column.prop}-display`" :scope="scope">
                  {{ formatCellValue(scope.row[column.prop], column, scope) }}
                </slot>
              </span>

              <!-- 编辑状态 -->
              <div v-else class="cell-editor">
                <el-form-item
                  :prop="`${scope.$index}.${column.prop}`"
                  :rules="rules[column.prop]"
                  class="editor-form-item"
                >
                  <!-- 输入框类型 -->
                  <el-input
                    v-if="column.type === 'input'"
                    v-model="scope.row[column.prop]"
                    :placeholder="column.placeholder || `请输入${column.label}`"
                    :disabled="column.disabled || disabled"
                    :maxlength="column.maxlength"
                    :minlength="column.minlength"
                    :show-word-limit="column.showWordLimit"
                    :type="column.inputType || 'text'"
                    @keyup.enter="handleSaveCell(scope.$index, column.prop, scope.row)"
                    @blur="handleSaveCell(scope.$index, column.prop, scope.row)"
                    ref="editorInputRef"
                    class="editor-input"
                  />

                  <!-- 数字输入框 -->
                  <el-input-number
                    v-else-if="column.type === 'input-number'"
                    v-model="scope.row[column.prop]"
                    :placeholder="column.placeholder || `请输入${column.label}`"
                    :disabled="column.disabled || disabled"
                    :min="column.min"
                    :max="column.max"
                    :step="column.step"
                    :precision="column.precision"
                    :controls-position="column.controlsPosition || 'right'"
                    @change="handleSaveCell(scope.$index, column.prop, scope.row)"
                    @blur="handleSaveCell(scope.$index, column.prop, scope.row)"
                    class="editor-input"
                  />

                  <!-- 选择框 -->
                  <el-select
                    v-else-if="column.type === 'select'"
                    v-model="scope.row[column.prop]"
                    :placeholder="column.placeholder || `请选择${column.label}`"
                    :disabled="column.disabled || disabled"
                    :multiple="column.multiple"
                    :multiple-limit="column.multipleLimit"
                    :filterable="column.filterable"
                    :remote="column.remote"
                    :remote-method="column.remoteMethod"
                    @change="handleSaveCell(scope.$index, column.prop, scope.row)"
                    @blur="handleSaveCell(scope.$index, column.prop, scope.row)"
                    class="editor-select"
                  >
                    <el-option
                      v-for="option in column.options"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>

                  <!-- 日期选择器 -->
                  <el-date-picker
                    v-else-if="column.type === 'date'"
                    v-model="scope.row[column.prop]"
                    :type="column.dateType || 'date'"
                    :placeholder="column.placeholder || `请选择${column.label}`"
                    :disabled="column.disabled || disabled"
                    :format="column.format || 'YYYY-MM-DD'"
                    :value-format="column.valueFormat || 'YYYY-MM-DD'"
                    :range-separator="column.rangeSeparator || '至'"
                    :start-placeholder="column.startPlaceholder || '开始日期'"
                    :end-placeholder="column.endPlaceholder || '结束日期'"
                    @change="handleSaveCell(scope.$index, column.prop, scope.row)"
                    @blur="handleSaveCell(scope.$index, column.prop, scope.row)"
                    class="editor-date"
                  />

                  <!-- 开关 -->
                  <el-switch
                    v-else-if="column.type === 'switch'"
                    v-model="scope.row[column.prop]"
                    :disabled="column.disabled || disabled"
                    :active-value="column.activeValue || true"
                    :inactive-value="column.inactiveValue || false"
                    :active-color="column.activeColor || '#409EFF'"
                    :inactive-color="column.inactiveColor || '#C0CCDA'"
                    @change="handleSaveCell(scope.$index, column.prop, scope.row)"
                    class="editor-switch"
                  />

                  <!-- 单选框组 -->
                  <el-radio-group
                    v-else-if="column.type === 'radio'"
                    v-model="scope.row[column.prop]"
                    :disabled="column.disabled || disabled"
                    @change="handleSaveCell(scope.$index, column.prop, scope.row)"
                    class="editor-radio"
                  >
                    <el-radio
                      v-for="option in column.options"
                      :key="option.value"
                      :label="option.value"
                      :border="column.radioBorder || false"
                      :size="column.radioSize || 'default'"
                    >
                      {{ option.label }}
                    </el-radio>
                  </el-radio-group>

                  <!-- 复选框组 -->
                  <el-checkbox-group
                    v-else-if="column.type === 'checkbox'"
                    v-model="scope.row[column.prop]"
                    :disabled="column.disabled || disabled"
                    @change="handleSaveCell(scope.$index, column.prop, scope.row)"
                    class="editor-checkbox"
                  >
                    <el-checkbox
                      v-for="option in column.options"
                      :key="option.value"
                      :label="option.value"
                      :border="column.checkboxBorder || false"
                      :size="column.checkboxSize || 'default'"
                    >
                      {{ option.label }}
                    </el-checkbox>
                  </el-checkbox-group>

                  <!-- 文本域 -->
                  <el-input
                    v-else-if="column.type === 'textarea'"
                    v-model="scope.row[column.prop]"
                    :placeholder="column.placeholder || `请输入${column.label}`"
                    :disabled="column.disabled || disabled"
                    :maxlength="column.maxlength"
                    :minlength="column.minlength"
                    :show-word-limit="column.showWordLimit"
                    :rows="column.rows || 3"
                    :autosize="column.autosize || { minRows: 3, maxRows: 6 }"
                    type="textarea"
                    @keyup.enter.ctrl="handleSaveCell(scope.$index, column.prop, scope.row)"
                    @blur="handleSaveCell(scope.$index, column.prop, scope.row)"
                    class="editor-textarea"
                  />

                  <!-- 自定义编辑器 -->
                  <div v-else class="custom-editor">
                    <slot
                      :name="`column-${column.prop}-editor`"
                      :scope="scope"
                      :column="column"
                      :on-save="() => handleSaveCell(scope.$index, column.prop, scope.row)"
                    />
                  </div>
                </el-form-item>
              </div>
            </div>
          </template>
        </el-table-column>
      </template>

      <!-- 操作列 -->
      <el-table-column
        v-if="showActionColumn"
        :label="actionColumnLabel"
        :width="actionColumnWidth"
        :fixed="actionColumnFixed"
        :align="actionColumnAlign || 'center'"
      >
        <template #default="scope">
          <div class="action-buttons">
            <slot name="actions" :scope="scope">
              <!-- 默认操作按钮 -->
              <el-button
                v-if="showEditButton"
                type="primary"
                size="small"
                :disabled="disabled"
                @click="handleEditRow(scope.row, scope.$index)"
                :icon="h(Edit)"
              >
                编辑
              </el-button>

              <el-button
                v-if="showSaveButton"
                type="success"
                size="small"
                :disabled="disabled"
                @click="handleSaveRow(scope.row, scope.$index)"
                :icon="h(Check)"
              >
                保存
              </el-button>

              <el-button
                v-if="showCancelButton"
                type="info"
                size="small"
                :disabled="disabled"
                @click="handleCancelRow(scope.row, scope.$index)"
                :icon="h(Cancel)"
              >
                取消
              </el-button>

              <el-button
                v-if="showDeleteButton"
                type="danger"
                size="small"
                :disabled="disabled"
                @click="handleDeleteRow(scope.row, scope.$index)"
                :icon="h(Delete)"
              >
                删除
              </el-button>
            </slot>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 表格底部 -->
    <div class="table-footer" v-if="showFooter">
      <slot name="footer">
        <!-- 分页 -->
        <div class="table-pagination" v-if="showPagination">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="pagination.pageSizes || [10, 20, 50, 100]"
            :layout="pagination.layout || 'total, sizes, prev, pager, next, jumper'"
            :total="pagination.total"
            :disabled="disabled"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </slot>
    </div>

    <!-- 表单验证 -->
    <el-form ref="formRef" :model="formData" :rules="rules" class="form-table__form" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, h } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Refresh, Download, Check, Edit, Cancel } from '@element-plus/icons-vue'
import VirtualTable from '../VirtualTable.vue'

// 定义接口
interface TableColumn {
  // 基础属性
  prop: string
  label: string
  type?: 'input' | 'input-number' | 'select' | 'date' | 'switch' | 'radio' | 'checkbox' | 'textarea'
  width?: number | string
  minWidth?: number | string
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean | 'custom'
  sortMethod?: (a: any, b: any) => number
  sortBy?: string | string[]
  sortOrders?: string[]
  resizable?: boolean
  showOverflowTooltip?: boolean
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  formatter?: (row: any, column: any, cellValue: any, index: number) => string
  renderHeader?: (h: any, { column, $index }: { column: any; $index: number }) => any
  // 编辑属性
  editable?: boolean
  placeholder?: string
  disabled?: boolean
  maxlength?: number
  minlength?: number
  showWordLimit?: boolean
  // 输入框属性
  inputType?: string
  // 数字输入框属性
  min?: number
  max?: number
  step?: number
  precision?: number
  controlsPosition?: 'left' | 'right'
  // 选择框属性
  options?: Array<{ label: string; value: any }>
  multiple?: boolean
  multipleLimit?: number
  filterable?: boolean
  remote?: boolean
  remoteMethod?: (query: string) => void
  // 日期选择器属性
  dateType?: 'year' | 'month' | 'date' | 'datetime' | 'datetimerange' | 'daterange' | 'monthrange'
  format?: string
  valueFormat?: string
  rangeSeparator?: string
  startPlaceholder?: string
  endPlaceholder?: string
  // 开关属性
  activeValue?: any
  inactiveValue?: any
  activeColor?: string
  inactiveColor?: string
  // 单选框属性
  radioBorder?: boolean
  radioSize?: 'large' | 'default' | 'small'
  // 复选框属性
  checkboxBorder?: boolean
  checkboxSize?: 'large' | 'default' | 'small'
  // 文本域属性
  rows?: number
  autosize?: boolean | { minRows?: number; maxRows?: number }
  // 筛选属性
  filterMultiple?: boolean
  filters?: Array<{ text: string; value: any }>
  filterMethod?: (value: any, row: any, column: any) => boolean
  filterPlacement?: string
  filterDropdown?: any
  filterDropdownVisible?: boolean
  // 展开属性
  children?: string
}

interface Pagination {
  currentPage: number
  pageSize: number
  pageSizes?: number[]
  total: number
  layout?: string
}

interface FormTableProps {
  // 表格数据
  data: any[]
  // 表格列配置
  columns: TableColumn[]
  // 表单验证规则
  rules?: Record<string, any[]>
  // 表格高度
  height?: number | string
  // 表格最大高度
  maxHeight?: number | string
  // 是否显示斑马纹
  stripe?: boolean
  // 是否显示边框
  border?: boolean
  // 是否启用虚拟滚动
  virtual?: boolean
  // 虚拟滚动行高
  rowHeight?: number
  // 虚拟滚动表格高度
  tableHeight?: number
  // 行标识字段
  rowKey?: string | ((row: any) => string)
  // 是否默认展开所有行
  defaultExpandAll?: boolean
  // 树形结构配置
  treeProps?: { children?: string; hasChildren?: string }
  // 是否显示选择列
  showSelection?: boolean
  // 是否显示展开列
  showExpand?: boolean
  // 是否显示序号列
  showIndex?: boolean
  // 是否显示操作列
  showActionColumn?: boolean
  // 操作列标题
  actionColumnLabel?: string
  // 操作列宽度
  actionColumnWidth?: number | string
  // 操作列固定位置
  actionColumnFixed?: boolean | 'left' | 'right'
  // 操作列对齐方式
  actionColumnAlign?: 'left' | 'center' | 'right'
  // 是否显示编辑按钮
  showEditButton?: boolean
  // 是否显示保存按钮
  showSaveButton?: boolean
  // 是否显示取消按钮
  showCancelButton?: boolean
  // 是否显示删除按钮
  showDeleteButton?: boolean
  // 是否显示工具栏
  showToolbar?: boolean
  // 是否显示分页
  showPagination?: boolean
  // 是否显示页脚
  showFooter?: boolean
  // 分页配置
  pagination?: Pagination
  // 加载状态
  loading?: boolean
  // 是否禁用
  disabled?: boolean
  // 选择列宽度
  selectionWidth?: number | string
  // 展开列宽度
  expandWidth?: number | string
  // 序号列宽度
  indexWidth?: number | string
  // 是否在多选时保留之前选中的数据
  reserveSelection?: boolean
  // 自定义选择逻辑
  selectable?: (row: any, index: number) => boolean
  // 是否在点击表头时选择整行
  selectOnIndeterminate?: boolean
  // 行类名
  rowClassName?: (row: any, index: number) => string
  // 行样式
  rowStyle?: (row: any, index: number) => object
  // 单元格类名
  cellClassName?: (row: any, column: any, cellValue: any, index: number) => string
  // 单元格样式
  cellStyle?: (row: any, column: any, cellValue: any, index: number) => object
  // 表头行类名
  headerRowClassName?: (row: any, index: number) => string
  // 表头行样式
  headerRowStyle?: (row: any, index: number) => object
  // 表头单元格类名
  headerCellClassName?: (row: any, index: number) => string
  // 表头单元格样式
  headerCellStyle?: (row: any, index: number) => object
  // 自定义序号生成方法
  indexMethod?: (index: number) => number
}

// 定义组件属性
const props = withDefaults(defineProps<FormTableProps>(), {
  stripe: true,
  border: true,
  virtual: false,
  rowHeight: 60,
  tableHeight: 500,
  rowKey: 'id',
  defaultExpandAll: false,
  treeProps: () => ({ children: 'children' }),
  showSelection: false,
  showExpand: false,
  showIndex: false,
  showActionColumn: true,
  actionColumnLabel: '操作',
  actionColumnWidth: 200,
  actionColumnFixed: 'right',
  actionColumnAlign: 'center',
  showEditButton: true,
  showSaveButton: false,
  showCancelButton: false,
  showDeleteButton: true,
  showToolbar: true,
  showPagination: true,
  showFooter: true,
  pagination: () => ({ currentPage: 1, pageSize: 10, total: 0 }),
  loading: false,
  disabled: false,
  selectionWidth: 55,
  expandWidth: 40,
  indexWidth: 60,
  reserveSelection: false,
  selectOnIndeterminate: false,
  rules: () => ({}),
})

// 定义事件
const emit = defineEmits<{
  // 保存事件
  (e: 'save', data: any, index: number): void
  (e: 'save-all', data: any[]): void
  (e: 'save-cell', data: any, prop: string, index: number): void
  // 删除事件
  (e: 'delete', data: any, index: number): void
  (e: 'delete-selected', data: any[]): void
  // 编辑事件
  (e: 'edit', data: any, index: number): void
  (e: 'cancel', data: any, index: number): void
  // 选择事件
  (e: 'selection-change', selection: any[]): void
  (e: 'current-change', currentRow: any, oldCurrentRow: any): void
  // 分页事件
  (e: 'size-change', size: number): void
  (e: 'current-change', current: number): void
  // 排序和筛选事件
  (e: 'sort-change', sort: any): void
  (e: 'filter-change', filters: any): void
  // 行事件
  (e: 'row-click', row: any, column: any, event: any): void
  (e: 'row-dblclick', row: any, column: any, event: any): void
  (e: 'expand-change', row: any, expandedRows: any[]): void
  // 单元格事件
  (e: 'cell-click', row: any, column: any, cell: any, event: any): void
  (e: 'cell-dblclick', row: any, column: any, cell: any, event: any): void
  (e: 'cell-contextmenu', row: any, column: any, cell: any, event: any): void
  // 表头事件
  (e: 'header-click', column: any, event: any): void
  (e: 'header-contextmenu', column: any, event: any): void
  // 刷新和导出事件
  (e: 'refresh'): void
  (e: 'export'): void
  // 行添加事件
  (e: 'add'): void
}>()

// 响应式数据
const tableRef = ref<any>(null)
const virtualTableRef = ref<any>(null)
const formRef = ref<any>(null)
const editorInputRef = ref<any>(null)
const selectedRows = ref<any[]>([])
const editingCells = ref<Record<number, Record<string, boolean>>>({})
const originalData = ref<any[]>([])
const currentEditingRow = ref<number | null>(null)
const formData = ref<any[]>([])

// 计算属性
const hasSelectedRows = computed(() => selectedRows.value.length > 0)

// 虚拟表格相关计算属性
const formatColumnsForVirtualTable = computed(() => {
  return props.columns.map(column => {
    return {
      key: column.prop,
      label: column.label,
      width: column.width || column.minWidth || 120,
      minWidth: column.minWidth,
      align: column.align || 'left',
      fixed: column.fixed,
      sortable: column.sortable,
      render: column.prop,
    }
  })
})

const virtualActions = computed(() => {
  const actions = []

  if (props.showEditButton) {
    actions.push({
      key: 'edit',
      label: '编辑',
      type: 'primary',
      icon: 'edit',
    })
  }

  if (props.showSaveButton) {
    actions.push({
      key: 'save',
      label: '保存',
      type: 'success',
      icon: 'check',
    })
  }

  if (props.showCancelButton) {
    actions.push({
      key: 'cancel',
      label: '取消',
      type: 'info',
      icon: 'close',
    })
  }

  if (props.showDeleteButton) {
    actions.push({
      key: 'delete',
      label: '删除',
      type: 'danger',
      icon: 'delete',
    })
  }

  return actions
})

// 监听数据变化
watch(
  () => props.data,
  newData => {
    formData.value = [...newData]
    originalData.value = JSON.parse(JSON.stringify(newData))
  },
  { deep: true, immediate: true }
)

// 生命周期钩子
onMounted(() => {
  // 初始化数据
  formData.value = [...props.data]
  originalData.value = JSON.parse(JSON.stringify(props.data))
})

// 格式化单元格值
const formatCellValue = (value: any, column: TableColumn, scope: any): string => {
  if (column.formatter) {
    return column.formatter(scope.row, column, value, scope.$index)
  }

  if (column.type === 'select' && column.options) {
    const option = column.options.find(opt => opt.value === value)
    return option ? option.label : value
  }

  if (column.type === 'switch') {
    return value ? '是' : '否'
  }

  return value === null || value === undefined ? '' : String(value)
}

// 开始编辑单元格
const startEditCell = (rowIndex: number, prop: string) => {
  if (!editingCells.value[rowIndex]) {
    editingCells.value[rowIndex] = {}
  }
  editingCells.value[rowIndex][prop] = true

  // 聚焦到编辑器
  setTimeout(() => {
    const editor = document.querySelector(
      `.form-table__table .cell-editor:focus-within input, .form-table__table .cell-editor:focus-within textarea`
    )
    if (editor) {
      ;(editor as HTMLElement).focus()
    }
  }, 100)
}

// 保存单元格
const handleSaveCell = async (rowIndex: number, prop: string, row: any) => {
  // 验证表单
  if (!formRef.value) return

  try {
    await formRef.value.validateField(`${rowIndex}.${prop}`)
    editingCells.value[rowIndex][prop] = false
    emit('save-cell', row, prop, rowIndex)
  } catch (error) {
    console.error('表单验证失败:', error)
    // 验证失败，保持编辑状态
  }
}

// 编辑行
const handleEditRow = (row: any, index: number) => {
  currentEditingRow.value = index
  emit('edit', row, index)
}

// 保存行
const handleSaveRow = async (row: any, index: number) => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('save', row, index)
    currentEditingRow.value = null
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 取消行编辑
const handleCancelRow = (row: any, index: number) => {
  // 恢复原始数据
  formData.value[index] = JSON.parse(JSON.stringify(originalData.value[index]))
  currentEditingRow.value = null
  emit('cancel', row, index)
}

// 删除行
const handleDeleteRow = (row: any, index: number) => {
  ElMessageBox.confirm('确定要删除这条数据吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      emit('delete', row, index)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 批量删除
const handleDeleteSelected = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的数据')
    return
  }

  ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条数据吗？`, '批量删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      emit('delete-selected', selectedRows.value)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 添加行
const handleAddRow = () => {
  const newRow: any = {}
  // 初始化新行数据
  props.columns.forEach(column => {
    if (column.type === 'checkbox') {
      newRow[column.prop] = []
    } else if (column.type === 'select' && column.multiple) {
      newRow[column.prop] = []
    } else {
      newRow[column.prop] = null
    }
  })

  formData.value.push(newRow)
  originalData.value.push(JSON.parse(JSON.stringify(newRow)))
  emit('add')

  // 自动进入编辑状态
  setTimeout(() => {
    handleEditRow(newRow, formData.value.length - 1)
  }, 100)
}

// 刷新数据
const handleRefresh = () => {
  emit('refresh')
}

// 导出数据
const handleExport = () => {
  emit('export')
}

// 批量保存
const handleBatchSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('save-all', formData.value)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 单元格点击事件
const handleCellClick = (row: any, column: any, cell: any, event: any) => {
  // 如果是可编辑列且不在编辑状态，点击进入编辑状态
  const columnConfig = props.columns.find(col => col.prop === column.property)
  if (
    columnConfig &&
    columnConfig.editable &&
    !editingCells.value[props.data.indexOf(row)]?.[column.property]
  ) {
    startEditCell(props.data.indexOf(row), column.property)
  }
  emit('cell-click', row, column, cell, event)
}

// 选择事件处理
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
  emit('selection-change', selection)
}

// 当前行变化事件
const handleCurrentChange = (currentRow: any, oldCurrentRow: any) => {
  emit('current-change', currentRow, oldCurrentRow)
}

// 分页大小变化事件
const handleSizeChange = (size: number) => {
  emit('size-change', size)
}

// 行点击事件
const handleRowClick = (row: any, column: any, event: any) => {
  emit('row-click', row, column, event)
}

// 行双击事件
const handleRowDblclick = (row: any, column: any, event: any) => {
  emit('row-dblclick', row, column, event)
}

// 操作事件处理（用于虚拟表格）
const handleAction = ({ action, row, index }: { action: any; row: any; index: number }) => {
  switch (action.key) {
    case 'edit':
      handleEditRow(index, row)
      break
    case 'save':
      handleSaveRow(index, row)
      break
    case 'cancel':
      handleCancelEdit(index, row)
      break
    case 'delete':
      handleDeleteRow(index, row)
      break
    default:
      emit('action', { action, row, index })
  }
}

// 展开行事件
const handleExpandChange = (row: any, expandedRows: any[]) => {
  emit('expand-change', row, expandedRows)
}

// 排序事件
const handleSortChange = (sort: any) => {
  emit('sort-change', sort)
}

// 筛选事件
const handleFilterChange = (filters: any) => {
  emit('filter-change', filters)
}

// 表头点击事件
const handleHeaderClick = (column: any, event: any) => {
  emit('header-click', column, event)
}

// 表头右键事件
const handleHeaderContextmenu = (column: any, event: any) => {
  emit('header-contextmenu', column, event)
}

// 单元格双击事件
const handleCellDblclick = (row: any, column: any, cell: any, event: any) => {
  emit('cell-dblclick', row, column, cell, event)
}

// 单元格右键事件
const handleCellContextmenu = (row: any, column: any, cell: any, event: any) => {
  emit('cell-contextmenu', row, column, cell, event)
}

// 暴露方法给父组件
const validate = () => {
  if (!formRef.value) return Promise.resolve()
  return formRef.value.validate()
}

const validateField = (field: string | string[]) => {
  if (!formRef.value) return Promise.resolve()
  return formRef.value.validateField(field)
}

const clearValidate = (field?: string | string[]) => {
  if (!formRef.value) return
  formRef.value.clearValidate(field)
}

defineExpose({
  // 表单方法
  validate,
  validateField,
  clearValidate,
  // 表格方法
  tableRef,
  // 数据方法
  formData,
  // 编辑方法
  startEditCell,
  handleSaveCell,
  handleSaveRow,
})
</script>

<style lang="scss" scoped>
.form-table {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  &__table {
    width: 100%;

    .el-table__body-wrapper {
      overflow-x: auto;
    }

    .el-table__row {
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f5f7fa;
      }
    }

    .el-table-column--selection {
      .cell {
        padding-left: 16px;
      }
    }

    .editable-cell {
      position: relative;

      .cell-text {
        display: inline-block;
        padding: 4px 0;
        transition: all 0.3s;
      }

      .cell-editor {
        margin: -4px -12px;
        padding: 4px 12px;
        background-color: #fff9e6;
        border-radius: 4px;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);

        .editor-form-item {
          margin-bottom: 0;

          .el-form-item__error {
            position: absolute;
            bottom: -20px;
            left: 0;
            right: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .editor-input,
        .editor-select,
        .editor-date,
        .editor-textarea {
          width: 100%;
        }

        .editor-radio,
        .editor-checkbox {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .editor-switch {
          margin-top: 4px;
        }

        .custom-editor {
          width: 100%;
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;

      .el-button {
        padding: 4px 12px;
        font-size: 12px;
      }
    }
  }

  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background-color: #fafafa;
    border-bottom: 1px solid #f0f0f0;

    .toolbar-left,
    .toolbar-right {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }

  .table-footer {
    padding: 16px 20px;
    background-color: #fafafa;
    border-top: 1px solid #f0f0f0;

    .table-pagination {
      display: flex;
      justify-content: flex-end;
    }
  }

  .expand-content {
    padding: 16px;

    .expand-item {
      display: flex;
      margin-bottom: 8px;

      .expand-label {
        width: 120px;
        font-weight: 600;
        color: #606266;
      }

      .expand-value {
        flex: 1;
        color: #303133;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .form-table {
    .table-toolbar {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;

      .toolbar-left,
      .toolbar-right {
        justify-content: center;
      }
    }

    .table-footer {
      .table-pagination {
        justify-content: center;
      }
    }

    .action-buttons {
      flex-wrap: wrap;
    }
  }
}
</style>
