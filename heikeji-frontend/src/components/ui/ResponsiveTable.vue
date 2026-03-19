<template>
  <div class="responsive-table-wrapper" :class="{ 'is-mobile': isMobile }">
    <div v-if="isMobile && cardMode" class="mobile-cards">
      <div
        v-for="(row, index) in displayedData"
        :key="index"
        class="table-card"
        @click="handleRowClick(row)"
      >
        <div v-for="column in visibleColumns" :key="column.prop" class="card-item">
          <div class="card-label">{{ column.label }}</div>
          <div class="card-value">
            <slot :name="column.prop" :row="row" :value="row[column.prop]">
              {{ formatValue(row[column.prop], column) }}
            </slot>
          </div>
        </div>
        <div v-if="$slots.actions" class="card-actions">
          <slot name="actions" :row="row" />
        </div>
      </div>
    </div>

    <el-table
      v-else
      ref="tableRef"
      :data="displayedData"
      :height="tableHeight"
      :max-height="maxHeight"
      :stripe="stripe"
      :border="border"
      :size="size"
      :row-key="rowKey"
      :expand-row-keys="expandRowKeys"
      :default-expand-all="defaultExpandAll"
      :default-sort="defaultSort"
      :highlight-current-row="highlightCurrentRow"
      :cell-class-name="cellClassName"
      :row-class-name="rowClassName"
      :header-row-class-name="headerRowClassName"
      :span-method="spanMethod"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
      @cell-click="handleCellClick"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblClick"
      @sort-change="handleSortChange"
      @current-change="handleCurrentChange"
      @header-click="handleHeaderClick"
      @header-contextmenu="handleHeaderContextmenu"
    >
      <el-table-column
        v-if="showSelection"
        type="selection"
        :selectable="selectable"
        :width="selectionWidth"
        :fixed="selectionFixed"
      />

      <el-table-column
        v-if="showIndex"
        type="index"
        :index="indexMethod"
        :width="indexWidth"
        :label="indexLabel"
        :fixed="indexFixed"
      />

      <el-table-column v-if="showExpand" type="expand" :width="expandWidth">
        <template #default="props">
          <slot name="expand" :row="props.row" />
        </template>
      </el-table-column>

      <template v-for="column in visibleColumns" :key="column.prop">
        <el-table-column
          v-if="!column.hidden"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :sortable="column.sortable"
          :resizable="column.resizable"
          :formatter="column.formatter"
          :show-overflow-tooltip="column.showOverflowTooltip ?? showOverflowTooltip"
          :align="column.align || align"
          :header-align="column.headerAlign || headerAlign"
          :class-name="column.className"
          :label-class-name="column.labelClassName"
          :filters="column.filters"
          :filter-placement="column.filterPlacement"
          :filter-multiple="column.filterMultiple"
          :filter-method="column.filterMethod"
          :filtered-value="column.filteredValue"
        >
          <template #header v-if="column.renderHeader">
            <slot :name="`header-${column.prop}`" :column="column" />
          </template>

          <template #default="scope">
            <slot
              :name="column.prop"
              :row="scope.row"
              :column="column"
              :value="scope.row[column.prop]"
              :index="scope.$index"
            >
              {{ formatValue(scope.row[column.prop], column) }}
            </slot>
          </template>
        </el-table-column>
      </template>

      <el-table-column
        v-if="showActions"
        :label="actionsLabel"
        :width="actionsWidth"
        :fixed="actionsFixed"
        :align="actionsAlign"
      >
        <template #default="scope">
          <slot name="actions" :row="scope.row" :index="scope.$index" />
        </template>
      </el-table-column>
    </el-table>

    <div v-if="showPagination && !isMobile" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :layout="paginationLayout"
        :total="total"
        :background="paginationBackground"
        :small="paginationSmall"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <div v-if="showPagination && isMobile" class="mobile-pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :layout="['prev', 'pager', 'next'].join(', ')"
        :total="total"
        :small="true"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useResponsive } from '@/utils/responsive'

interface Column {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean | 'custom'
  resizable?: boolean
  formatter?: (row: any, column: any, cellValue: any, index: number) => string
  showOverflowTooltip?: boolean
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  className?: string
  labelClassName?: string
  filters?: Array<{ text: string; value: string }>
  filterPlacement?: string
  filterMultiple?: boolean
  filterMethod?: (value: any, row: any, column: any) => boolean
  filteredValue?: string[]
  hidden?: boolean
  renderHeader?: (h: any, column: any) => any
}

interface Props {
  data?: any[]
  columns?: Column[]
  height?: string | number
  maxHeight?: string | number
  stripe?: boolean
  border?: boolean
  size?: 'large' | 'default' | 'small'
  rowKey?: string | ((row: any) => string)
  expandRowKeys?: string[]
  defaultExpandAll?: boolean
  defaultSort?: { prop: string; order?: 'ascending' | 'descending' }
  highlightCurrentRow?: boolean
  cellClassName?: (row: any, column: any, rowIndex: number, columnIndex: number) => string
  rowClassName?: (row: any, rowIndex: number) => string
  headerRowClassName?: (row: any, rowIndex: number) => string
  spanMethod?: (param: {
    row: any
    column: number
    rowIndex: number
    columnIndex: number
  }) => [number, number] | object
  cellStyle?: (row: any, column: any, rowIndex: number, columnIndex: number) => object
  headerCellStyle?: (row: any, column: any, rowIndex: number, columnIndex: number) => object
  showSelection?: boolean
  selectionWidth?: number | string
  selectionFixed?: boolean | 'left' | 'right'
  selectable?: (row: any, index: number) => boolean
  showIndex?: boolean
  indexMethod?: (index: number) => number
  indexWidth?: number | string
  indexLabel?: string
  indexFixed?: boolean | 'left' | 'right'
  showExpand?: boolean
  expandWidth?: number | string
  showOverflowTooltip?: boolean
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  showActions?: boolean
  actionsLabel?: string
  actionsWidth?: number | string
  actionsFixed?: boolean | 'left' | 'right'
  actionsAlign?: 'left' | 'center' | 'right'
  showPagination?: boolean
  total?: number
  currentPage?: number
  pageSize?: number
  pageSizes?: number[]
  paginationLayout?: string
  paginationBackground?: boolean
  paginationSmall?: boolean
  cardMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  height: undefined,
  maxHeight: undefined,
  stripe: false,
  border: true,
  size: 'default',
  rowKey: 'id',
  expandRowKeys: () => [],
  defaultExpandAll: false,
  defaultSort: undefined,
  highlightCurrentRow: false,
  cellClassName: undefined,
  rowClassName: undefined,
  headerRowClassName: undefined,
  spanMethod: undefined,
  cellStyle: undefined,
  headerCellStyle: undefined,
  showSelection: false,
  selectionWidth: 55,
  selectionFixed: 'left',
  selectable: undefined,
  showIndex: false,
  indexMethod: undefined,
  indexWidth: 60,
  indexLabel: '#',
  indexFixed: 'left',
  showExpand: false,
  expandWidth: 50,
  showOverflowTooltip: true,
  align: 'left',
  headerAlign: undefined,
  showActions: false,
  actionsLabel: '操作',
  actionsWidth: 150,
  actionsFixed: 'right',
  actionsAlign: 'center',
  showPagination: true,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 50, 100],
  paginationLayout: 'total, sizes, prev, pager, next, jumper',
  paginationBackground: true,
  paginationSmall: false,
  cardMode: true,
})

const emit = defineEmits<{
  'update:currentPage': [value: number]
  'update:pageSize': [value: number]
  select: [selection: any[], row: any]
  'select-all': [selection: any[]]
  'selection-change': [selection: any[]]
  'cell-click': [row: any, column: any, cell: any, event: Event]
  'row-click': [row: any, column: any, event: Event]
  'row-dblclick': [row: any, column: any, event: Event]
  'sort-change': [param: { prop: string; order: string }]
  'current-change': [currentRow: any, oldCurrentRow: any]
  'header-click': [column: any, event: Event]
  'header-contextmenu': [column: any, event: Event]
}>()

const { isMobile } = useResponsive()

const tableRef = ref()
const currentPage = ref(props.currentPage)
const pageSize = ref(props.pageSize)

const visibleColumns = computed(() => {
  return props.columns.filter(col => !col.hidden)
})

const displayedData = computed(() => {
  if (props.showPagination) {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return props.data.slice(start, end)
  }
  return props.data
})

const tableHeight = computed(() => {
  if (props.height) {
    return isMobile.value ? 'auto' : props.height
  }
  return isMobile.value ? 'auto' : undefined
})

const formatValue = (value: any, column: Column) => {
  if (value === null || value === undefined) {
    return '-'
  }
  if (column.formatter) {
    return column.formatter(value, column, value, 0)
  }
  return value
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  emit('update:pageSize', size)
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  emit('update:currentPage', page)
}

const handleSelect = (selection: any[], row: any) => {
  emit('select', selection, row)
}

const handleSelectAll = (selection: any[]) => {
  emit('select-all', selection)
}

const handleSelectionChange = (selection: any[]) => {
  emit('selection-change', selection)
}

const handleCellClick = (row: any, column: any, cell: any, event: Event) => {
  emit('cell-click', row, column, cell, event)
}

const handleRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event)
}

const handleRowDblClick = (row: any, column: any, event: Event) => {
  emit('row-dblclick', row, column, event)
}

const handleSortChange = (param: { prop: string; order: string }) => {
  emit('sort-change', param)
}

const handleCurrentChange = (currentRow: any, oldCurrentRow: any) => {
  emit('current-change', currentRow, oldCurrentRow)
}

const handleHeaderClick = (column: any, event: Event) => {
  emit('header-click', column, event)
}

const handleHeaderContextmenu = (column: any, event: Event) => {
  emit('header-contextmenu', column, event)
}

watch(
  () => props.currentPage,
  val => {
    currentPage.value = val
  }
)

watch(
  () => props.pageSize,
  val => {
    pageSize.value = val
  }
)

onMounted(() => {
  if (props.showPagination) {
    props.total = props.data.length
  }
})

defineExpose({
  tableRef,
  currentPage,
  pageSize,
})
</script>

<style scoped lang="scss">
.responsive-table-wrapper {
  &.is-mobile {
    .mobile-cards {
      .table-card {
        background: #fff;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        cursor: pointer;
        transition: all 0.3s;

        &:active {
          transform: scale(0.98);
        }

        .card-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          .card-label {
            color: #909399;
            font-size: 13px;
            flex-shrink: 0;
          }

          .card-value {
            color: #303133;
            font-size: 14px;
            text-align: right;
            word-break: break-all;
          }
        }

        .card-actions {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
      }
    }
  }

  .pagination-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .mobile-pagination {
    margin-top: 16px;
    display: flex;
    justify-content: center;
  }
}
</style>
