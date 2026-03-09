# 测试覆盖率提升指南

## 概述

本指南提供了提升HKYG项目前端测试覆盖率的方法和最佳实践，目标是将测试覆盖率提升至70%以上。

## 当前测试工具栈

- **测试框架**: Vitest
- **测试环境**: jsdom
- **覆盖率工具**: v8
- **断言库**: 内置断言
- **模拟库**: vi.fn()

## 测试覆盖率目标

| 指标 | 目标值 | 当前值 |
|------|--------|--------|
| 行覆盖率 | 70% | 待测量 |
| 函数覆盖率 | 70% | 待测量 |
| 分支覆盖率 | 70% | 待测量 |
| 语句覆盖率 | 70% | 待测量 |

## 测试结构

### 单元测试

单元测试针对单个函数、组件或模块进行测试，确保其行为符合预期。

**位置**: `src/**/*.test.ts` 或 `src-vue3/**/*.test.ts`

**示例**:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.exists()).toBe(true)
  })
})
```

### 集成测试

集成测试测试多个组件或模块之间的交互。

**位置**: `src/**/*.integration.test.ts` 或 `src-vue3/**/*.integration.test.ts`

**示例**:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ParentComponent from './ParentComponent.vue'
import ChildComponent from './ChildComponent.vue'

describe('ParentComponent and ChildComponent Integration', () => {
  it('passes data correctly', async () => {
    const wrapper = mount(ParentComponent)
    await wrapper.setData({ message: 'Hello' })
    
    expect(wrapper.findComponent(ChildComponent).props('message')).toBe('Hello')
  })
})
```

## 测试覆盖率提升工具

### 1. 测试覆盖率提升脚本

运行以下命令自动分析测试覆盖率并生成缺失的测试模板：

```bash
npm run test:coverage:boost
```

此脚本会：
- 分析当前测试覆盖率
- 识别未测试的文件
- 为未测试的文件生成测试模板
- 生成覆盖率报告

### 2. 测试覆盖率监控脚本

运行以下命令监控测试覆盖率变化趋势：

```bash
npm run test:coverage:monitor
```

此脚本会：
- 运行测试并生成覆盖率报告
- 记录覆盖率历史
- 生成HTML趋势报告
- 检查覆盖率是否达标

### 3. 测试覆盖率历史查看

查看历史覆盖率趋势：

```bash
npm run test:coverage:history
```

## 测试最佳实践

### 1. 组件测试

#### Vue组件测试结构

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

// Mock外部依赖
vi.mock('@/api/my-api', () => ({
  fetchData: vi.fn(),
}))

describe('MyComponent', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    wrapper = mount(MyComponent, {
      props: {
        // 设置props
      },
      global: {
        stubs: {
          // 存根子组件
        },
      },
    })
  })

  it('renders correctly', () => {
    expect(wrapper.find('.my-component').exists()).toBe(true)
  })

  it('handles user interaction correctly', async () => {
    const button = wrapper.find('.my-button')
    await button.trigger('click')
    
    expect(wrapper.emitted('button-clicked')).toBeTruthy()
  })

  it('displays data correctly', async () => {
    // 设置数据
    await wrapper.setData({ items: [1, 2, 3] })
    
    // 检查渲染
    expect(wrapper.findAll('.item')).toHaveLength(3)
  })
})
```

#### 测试组件Props

```typescript
it('accepts props correctly', () => {
  const wrapper = mount(MyComponent, {
    props: {
      title: 'Test Title',
      count: 5,
    },
  })
  
  expect(wrapper.props('title')).toBe('Test Title')
  expect(wrapper.props('count')).toBe(5)
})
```

#### 测试组件事件

```typescript
it('emits events correctly', async () => {
  const wrapper = mount(MyComponent)
  
  await wrapper.find('.submit-button').trigger('click')
  
  expect(wrapper.emitted('submit')).toBeTruthy()
  expect(wrapper.emitted('submit')[0]).toEqual([{ id: 1, name: 'Test' }])
})
```

#### 测试组件插槽

```typescript
it('renders slots correctly', () => {
  const wrapper = mount(MyComponent, {
    slots: {
      default: '<div class="slot-content">Slot Content</div>',
    },
  })
  
  expect(wrapper.find('.slot-content').exists()).toBe(true)
})
```

### 2. API测试

#### API函数测试

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchData, postData } from '@/api/my-api'
import request from '@/utils/request'

// Mock request模块
vi.mock('@/utils/request', () => ({
  default: vi.fn(),
}))

describe('API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches data correctly', async () => {
    const mockData = { id: 1, name: 'Test' }
    vi.mocked(request).mockResolvedValue({ data: mockData })
    
    const result = await fetchData(1)
    
    expect(request).toHaveBeenCalledWith({
      url: '/api/data/1',
      method: 'get',
    })
    expect(result).toEqual(mockData)
  })

  it('handles errors correctly', async () => {
    const error = new Error('Network Error')
    vi.mocked(request).mockRejectedValue(error)
    
    await expect(fetchData(1)).rejects.toThrow('Network Error')
  })
})
```

### 3. 工具函数测试

```typescript
import { describe, it, expect } from 'vitest'
import { formatDate, calculateTotal } from '@/utils/my-utils'

describe('Utility Functions', () => {
  it('formats date correctly', () => {
    const date = new Date('2023-01-01')
    const formatted = formatDate(date)
    
    expect(formatted).toBe('2023-01-01')
  })

  it('calculates total correctly', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 },
    ]
    
    const total = calculateTotal(items)
    
    expect(total).toBe(35)
  })
})
```

## 测试覆盖率分析

### 1. 查看覆盖率报告

运行测试后，覆盖率报告会生成在以下位置：

- HTML报告: `coverage/index.html`
- JSON报告: `coverage/coverage-summary.json`
- LCOV报告: `coverage/lcov.info`

### 2. 覆盖率类型

- **行覆盖率**: 测试执行的代码行比例
- **函数覆盖率**: 测试调用的函数比例
- **分支覆盖率**: 测试覆盖的分支比例
- **语句覆盖率**: 测试执行的语句比例

### 3. 覆盖率提升策略

#### 识别未覆盖的代码

1. 查看HTML覆盖率报告，找到红色标记的未覆盖代码
2. 分析未覆盖代码的执行条件
3. 编写测试用例覆盖这些条件

#### 常见未覆盖场景

1. **错误处理分支**
   ```typescript
   // 未覆盖
   try {
     // 正常逻辑
   } catch (error) {
     // 错误处理 - 通常未覆盖
     console.error(error)
   }
   
   // 测试方法
   it('handles errors correctly', async () => {
     vi.mocked(apiFunction).mockRejectedValue(new Error('Test Error'))
     
     // 触发错误处理
     await expect(component.method()).rejects.toThrow()
   })
   ```

2. **条件分支**
   ```typescript
   // 未覆盖
   if (user.role === 'admin') {
     // 管理员逻辑 - 通常未覆盖
   }
   
   // 测试方法
   it('handles admin users correctly', async () => {
     await wrapper.setProps({ user: { role: 'admin' } })
     // 验证管理员逻辑
   })
   ```

3. **边界条件**
   ```typescript
   // 未覆盖
   if (items.length === 0) {
     // 空数组处理 - 通常未覆盖
   }
   
   // 测试方法
   it('handles empty arrays correctly', () => {
     const result = processItems([])
     expect(result).toEqual([])
   })
   ```

## 测试自动化

### 1. CI/CD集成

在CI/CD流水线中添加测试覆盖率检查：

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run test:coverage
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v1
```

### 2. 预提交钩子

使用husky和lint-staged在提交前运行测试：

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,ts,vue}": [
      "npm run test:related --",
      "git add"
    ]
  }
}
```

## 测试维护

### 1. 定期审查

- 每月审查测试覆盖率报告
- 识别覆盖率下降的模块
- 更新测试用例以适应代码变更

### 2. 测试重构

- 定期重构重复的测试代码
- 提取公共测试工具函数
- 优化测试执行速度

### 3. 测试文档

- 为复杂组件编写测试文档
- 记录测试用例的目的和预期行为
- 维护测试最佳实践指南

## 常见问题与解决方案

### 1. 测试执行缓慢

**问题**: 测试执行时间过长

**解决方案**:
- 使用`vi.hoisted()`模拟常用模块
- 减少不必要的DOM操作
- 并行执行独立的测试

### 2. 模拟复杂依赖

**问题**: 难以模拟复杂的依赖关系

**解决方案**:
- 使用工厂函数创建模拟对象
- 分离关注点，减少依赖
- 使用依赖注入模式

### 3. 异步测试

**问题**: 异步代码测试不稳定

**解决方案**:
- 使用`async/await`处理Promise
- 使用`vi.useFakeTimers()`控制时间
- 确保所有异步操作完成后再断言

## 总结

提升测试覆盖率是一个持续的过程，需要团队的共同努力。通过使用提供的工具和遵循最佳实践，我们可以将测试覆盖率提升到70%以上，从而提高代码质量和可靠性。

记住，测试覆盖率只是质量指标之一，更重要的是编写有意义、可维护的测试用例。