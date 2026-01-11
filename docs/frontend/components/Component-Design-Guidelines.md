# 组件设计规范文档

## 1. 命名规范

### 1.1 文件命名
- **组件文件**：PascalCase 命名，如 `SearchFilter.vue`
- **业务组件**：业务前缀 + PascalCase，如 `ProductCard.vue`
- **组件目录**：小写短横线，如 `form-table/`

### 1.2 组件命名
```vue
<!-- 基础组件 -->
<SearchFilter />
<FormTable />

<!-- 业务组件 -->
<ProductCard />
<OrderCard />
<StatPanel />
```

### 1.3 属性命名
- **Props**：camelCase
- **事件**：kebab-case
- **插槽**：PascalCase

```vue
<!-- 正确示例 -->
<SearchFilter
  :search-fields="searchFields"
  :default-values="defaultValues"
  @search="handleSearch"
  @reset="handleReset"
>
  <template #advanced>
    <!-- 高级搜索内容 -->
  </template>
</SearchFilter>
```

## 2. Props 接口规范

### 2.1 基础配置
```javascript
export default {
  name: 'BaseComponent',
  props: {
    // Boolean类型
    disabled: {
      type: Boolean,
      default: false
    },
    
    // String类型
    placeholder: {
      type: String,
      default: ''
    },
    
    // Array类型
    options: {
      type: Array,
      default: () => []
    },
    
    // Object类型
    config: {
      type: Object,
      default: () => ({})
    },
    
    // Function类型
    handler: {
      type: Function,
      default: () => {}
    }
  }
}
```

### 2.2 复杂配置
```javascript
export default {
  name: 'FormTable',
  props: {
    columns: {
      type: Array,
      required: true,
      validator: function (value) {
        return value.every(col => {
          return col.key !== undefined && col.title !== undefined
        })
      }
    },
    
    dataSource: {
      type: Array,
      default: () => []
    },
    
    loading: {
      type: Boolean,
      default: false
    }
  }
}
```

## 3. 事件规范

### 3.1 标准事件
- **更新事件**：`update:propName`
- **动作事件**：`@search`, `@select`, `@change`, `@submit`
- **生命周期事件**：`@ready`, `@mount`, `@unmount`

### 3.2 事件数据格式
```javascript
// 简单事件
this.$emit('search', this.searchValue)

// 复杂事件
this.$emit('selection-change', {
  selected: this.selectedRows,
  total: this.data.length
})

// 错误事件
this.$emit('error', {
  type: 'validation',
  message: '数据验证失败',
  field: 'email'
})
```

## 4. 插槽规范

### 4.1 命名规范
```vue
<template>
  <div class="component-wrapper">
    <!-- 默认插槽 -->
    <slot />
    
    <!-- 命名插槽 -->
    <slot name="header" :data="componentData" />
    <slot name="footer" :data="componentData" />
    <slot name="toolbar" :actions="toolbarActions" />
    <slot name="advanced" />
  </div>
</template>
```

### 4.2 作用域插槽
```vue
<template #default="{ row, index }">
  <!-- 自定义行内容 -->
  <span v-if="row.status === 'active'">
    {{ row.name }}
  </span>
  <span v-else class="inactive">
    {{ row.name }}
  </span>
</template>
```

## 5. 样式规范

### 5.1 样式组织
```scss
// 组件样式文件结构
.component-name {
  // 组件根样式
  display: flex;
  align-items: center;
  
  // 元素样式
  &__element {
    // BEM命名
  }
  
  // 修饰符样式
  &--modifier {
    // BEM命名
  }
  
  // 状态样式
  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
```

### 5.2 样式变量
```scss
// 使用设计令牌
.component-name {
  --primary-color: #1890ff;
  --border-radius: 4px;
  --padding-base: 16px;
  
  color: var(--primary-color);
  border-radius: var(--border-radius);
  padding: var(--padding-base);
}
```

## 6. 组件文档规范

### 6.1 组件头部注释
```vue
<!--
@fileoverview 表单表格组件
@description 集成表单验证、数据表格、搜索筛选等功能，支持大数据量渲染
@example
  <FormTable
    :columns="columns"
    :data-source="data"
    :form-config="formConfig"
    @search="handleSearch"
  />
-->
```

### 6.2 Prop文档
```javascript
export default {
  name: 'SearchFilter',
  props: {
    /** 搜索字段配置数组 */
    searchFields: {
      type: Array,
      required: true,
      description: '包含field、label、type等配置的对象数组',
      example: '[
        { field: "name", label: "姓名", type: "input" },
        { field: "status", label: "状态", type: "select", options: [...] }
      ]'
    },
    
    /** 默认搜索值 */
    defaultValues: {
      type: Object,
      default: () => ({}),
      description: '键值对形式，字段名为key，搜索值为value'
    }
  }
}
```

## 7. 错误处理规范

### 7.1 错误处理策略
```javascript
export default {
  methods: {
    async search(params) {
      try {
        this.loading = true
        const result = await this.$api.search(params)
        this.$emit('success', result)
      } catch (error) {
        this.$emit('error', {
          type: 'search',
          message: error.message,
          originalError: error
        })
      } finally {
        this.loading = false
      }
    }
  }
}
```

### 7.2 用户反馈
```javascript
// 成功反馈
this.$message.success('操作成功')

// 错误反馈
this.$message.error('操作失败，请重试')

// 警告反馈
this.$message.warning('请检查输入信息')

// 信息反馈
this.$message.info('正在处理中...')
```

## 8. 性能优化规范

### 8.1 计算属性和监听器
```javascript
export default {
  computed: {
    // 使用计算属性缓存复杂计算
    filteredData() {
      return this.data.filter(item => {
        return item.name.includes(this.searchTerm)
      })
    }
  },
  
  watch: {
    // 使用immediate进行初始化搜索
    searchTerm: {
      handler(newVal) {
        this.performSearch(newVal)
      },
      immediate: true
    }
  }
}
```

### 8.2 虚拟化长列表
```javascript
export default {
  props: {
    dataSource: {
      type: Array,
      required: true
    },
    
    // 虚拟滚动配置
    virtual: {
      type: Boolean,
      default: true
    },
    
    rowHeight: {
      type: Number,
      default: 50
    }
  }
}
```

## 9. 测试规范

### 9.1 单元测试结构
```javascript
import { mount } from '@vue/test-utils'
import SearchFilter from '@/components/SearchFilter.vue'

describe('SearchFilter', () => {
  let wrapper
  
  beforeEach(() => {
    wrapper = mount(SearchFilter, {
      propsData: {
        searchFields: [
          { field: 'name', label: '姓名', type: 'input' }
        ]
      }
    })
  })
  
  it('should render search fields', () => {
    expect(wrapper.find('.search-field').exists()).toBe(true)
  })
  
  it('should emit search event', async () => {
    await wrapper.vm.$nextTick()
    wrapper.find('.search-btn').trigger('click')
    expect(wrapper.emitted('search')).toBeTruthy()
  })
})
```

## 10. 最佳实践

### 10.1 可复用性
- 组件应该专注于单一职责
- 通过props进行配置化
- 提供合理的默认值
- 支持插槽扩展功能

### 10.2 可维护性
- 遵循一致的命名规范
- 提供完整的文档
- 使用TypeScript增强类型安全
- 添加适当的测试用例

### 10.3 性能考虑
- 使用计算属性缓存
- 合理使用v-show和v-if
- 实现虚拟滚动
- 懒加载非关键组件