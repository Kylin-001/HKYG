# 虚拟滚动表格组件使用指南

## 概述

`VirtualTable.vue` 是一个高性能的表格组件，支持虚拟滚动技术，能够高效处理大数据集（支持上万条数据）。该组件基于 Element UI 的 `el-table` 构建，同时提供丰富的功能和灵活的定制选项。

## 主要特性

### 🎯 核心功能
- **虚拟滚动**：仅渲染可见区域，大幅提升性能
- **大数据支持**：支持处理上万条数据而保持流畅
- **响应式设计**：支持自定义行高、表格高度等
- **灵活配置**：丰富的列配置和自定义渲染

### 🔧 功能特性
- **内置工具栏**：搜索、刷新、添加、导出等功能
- **批量操作**：支持多选和批量操作
- **自定义渲染**：支持自定义列渲染器
- **分页支持**：内置分页组件和自定义分页配置
- **事件系统**：完整的事件回调机制
- **搜索功能**：内置搜索表单生成器

## 基础用法

### 1. 基本表格

```vue
<template>
  <virtual-table
    :data="dataList"
    :columns="columns"
    :total="total"
    @selection-change="handleSelection"
  />
</template>

<script>
import VirtualTable from '@/components/VirtualTable.vue'

export default {
  components: { VirtualTable },
  data() {
    return {
      dataList: [],
      total: 1000,
      columns: [
        { key: 'name', label: '姓名', width: 120 },
        { key: 'age', label: '年龄', width: 80 },
        { key: 'email', label: '邮箱', minWidth: 200 }
      ]
    }
  }
}
</script>
```

### 2. 带有操作的表格

```vue
<template>
  <virtual-table
    :data="dataList"
    :columns="columns"
    :actions="actions"
    :show-actions="true"
    :show-selection="true"
    :show-index="true"
    @action="handleRowAction"
  />
</template>

<script>
export default {
  data() {
    return {
      actions: [
        { key: 'view', label: '查看', type: 'primary', handler: this.viewRow },
        { key: 'edit', label: '编辑', type: 'success', handler: this.editRow },
        { key: 'delete', label: '删除', type: 'danger', handler: this.deleteRow }
      ]
    }
  },
  methods: {
    handleRowAction({ action, row, index }) {
      console.log('操作:', action.key, row)
    }
  }
}
</script>
```

### 3. 带搜索的表格

```vue
<template>
  <virtual-table
    :data="dataList"
    :columns="columns"
    :show-search="true"
    :search-fields="searchFields"
    @search="handleSearch"
  />
</template>

<script>
export default {
  data() {
    return {
      searchFields: [
        { key: 'name', label: '姓名', type: 'input' },
        { key: 'status', label: '状态', type: 'select', options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ]},
        { key: 'dateRange', label: '日期', type: 'daterange' }
      ]
    }
  }
}
</script>
```

## 高级配置

### 列配置详解

```javascript
columns: [
  {
    key: 'name',                    // 列字段名
    label: '姓名',                   // 列标题
    width: 120,                     // 固定宽度
    minWidth: 200,                  // 最小宽度
    fixed: 'left',                  // 固定位置: 'left'|'right'
    sortable: true,                 // 是否可排序
    align: 'center',                // 对齐方式
    showOverflow: false,            // 是否显示省略号
    type: 'currency',               // 数据类型: 'text'|'number'|'currency'|'date'|'datetime'|'boolean'
    formatter: (value, column) => { // 自定义格式化函数
      return '格式化后的值'
    },
    render: 'custom-render'         // 自定义渲染器名称
  }
]
```

### 自定义渲染器

```vue
<template>
  <virtual-table :data="dataList" :columns="columns">
    <!-- 图片渲染器 -->
    <template slot="image-render" slot-scope="{ row, value }">
      <img :src="row.avatar" style="width: 40px; height: 40px; border-radius: 4px;">
    </template>

    <!-- 状态渲染器 -->
    <template slot="status-render" slot-scope="{ row, value }">
      <el-tag :type="row.status === 1 ? 'success' : 'danger'">
        {{ row.status === 1 ? '启用' : '禁用' }}
      </el-tag>
    </template>

    <!-- 操作按钮渲染器 -->
    <template slot="action-render" slot-scope="{ row }">
      <el-button size="mini" @click="edit(row)">编辑</el-button>
      <el-button size="mini" type="danger" @click="delete(row)">删除</el-button>
    </template>
  </virtual-table>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { key: 'avatar', label: '头像', width: 80, render: 'image-render' },
        { key: 'name', label: '姓名' },
        { key: 'status', label: '状态', render: 'status-render' },
        { key: 'actions', label: '操作', width: 150, render: 'action-render' }
      ]
    }
  }
}
</script>
```

### 搜索字段配置

```javascript
searchFields: [
  {
    key: 'name',
    label: '姓名',
    type: 'input',           // input | select | date | datetime | number
    placeholder: '请输入姓名',
    props: {                 // 组件属性
      clearable: true
    },
    options: [               // 仅对 select 类型有效
      { label: '选项1', value: 1 },
      { label: '选项2', value: 2 }
    ]
  }
]
```

### 批量操作配置

```javascript
batchActions: [
  {
    key: 'batchEnable',
    label: '批量启用',
    type: 'success',
    handler: (rows) => {
      // 批量启用逻辑
      console.log('批量启用:', rows)
    }
  },
  {
    key: 'batchDelete',
    label: '批量删除',
    type: 'danger',
    handler: (rows) => {
      // 批量删除逻辑
      console.log('批量删除:', rows)
    }
  }
]
```

### 工具栏配置

```vue
<template>
  <virtual-table
    :show-toolbar="true"
    :show-refresh="true"
    :show-add="true"
    :show-export="true"
    :refresh-handler="refreshData"
    :add-handler="addItem"
    :export-handler="exportData"
  >
    <!-- 自定义工具栏 -->
    <template slot="toolbar-left">
      <el-button type="warning" size="small" @click="importData">
        <i class="el-icon-upload2"></i> 导入
      </el-button>
    </template>

    <template slot="toolbar-right">
      <div class="custom-toolbar">
        <!-- 自定义右侧工具栏内容 -->
        <span>总计: {{ total }} 条记录</span>
      </div>
    </template>
  </virtual-table>
</template>
```

## API 文档

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | Array | [] | 表格数据 |
| columns | Array | - | 列配置（必填） |
| total | Number | 0 | 总数据量 |
| rowKey | Function | (row, index) => index | 行数据唯一标识函数 |
| rowHeight | Number | 60 | 行高（像素） |
| tableHeight | Number | 500 | 表格容器高度（像素） |
| showToolbar | Boolean | true | 是否显示工具栏 |
| showSearch | Boolean | false | 是否显示搜索栏 |
| showBatchToolbar | Boolean | false | 是否显示批量操作栏 |
| showSelection | Boolean | false | 是否显示选择列 |
| showIndex | Boolean | false | 是否显示序号列 |
| showActions | Boolean | true | 是否显示操作列 |
| showPagination | Boolean | true | 是否显示分页 |
| pageSize | Number | 20 | 每页数量 |
| currentPage | Number | 1 | 当前页码 |
| actions | Array | [] | 行操作配置 |
| searchFields | Array | [] | 搜索字段配置 |
| loading | Boolean | false | 是否加载中 |
| loadingText | String | - | 加载提示文本 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| selection-change | selection | 选择变化 |
| row-click | row, column, event | 行点击 |
| sort-change | { column, prop, order } | 排序变化 |
| size-change | size | 页大小变化 |
| current-change | page | 当前页变化 |
| search | searchParams | 搜索 |
| action | { action, row, index } | 行操作 |
| batch-action | { action, rows } | 批量操作 |
| add | - | 添加操作 |
| export | - | 导出操作 |
| refresh | - | 刷新操作 |

### 方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| getSelectedRows | - | 获取选中的行数据 |
| clearSelection | - | 清空选择 |
| toggleRowSelection | row, selected | 切换行选择状态 |

## 性能优化建议

### 1. 合理设置行高
- 根据内容合理设置 `rowHeight`
- 行高过小会影响用户体验，过大会浪费性能

### 2. 表格高度设置
- 根据页面布局设置合适的 `tableHeight`
- 避免表格过高导致虚拟滚动计算量过大

### 3. 数据优化
- 对于大数据集，考虑前端分页或懒加载
- 避免在表格中渲染过于复杂的组件

### 4. 列配置优化
- 合理设置列宽，避免内容溢出
- 复杂渲染的列建议使用虚拟渲染

## 常见问题

### Q: 如何处理自定义排序？
A: 在 `sort-change` 事件中处理排序逻辑，并重新请求数据。

### Q: 如何实现无限滚动？
A: 可以监听滚动事件，在接近底部时自动加载下一页数据。

### Q: 如何支持行内编辑？
A: 可以通过自定义渲染器实现行内编辑功能。

## 更新日志

### v1.0.0
- 初始版本发布
- 支持虚拟滚动
- 支持自定义渲染器
- 支持搜索和批量操作
- 完整的事件系统

---

更多信息请参考示例代码或联系开发团队。