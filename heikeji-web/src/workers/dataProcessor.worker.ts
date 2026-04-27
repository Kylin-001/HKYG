/**
 * Data Processor Web Worker
 * 用于在后台线程处理复杂数据计算
 */

// 消息类型定义
interface WorkerMessage {
  type: 'FILTER' | 'SORT' | 'AGGREGATE' | 'SEARCH' | 'TRANSFORM'
  data: any[]
  payload?: any
  id: string
}

interface WorkerResponse {
  id: string
  result: any
  error?: string
  duration: number
}

// 处理消息
self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  const { type, data, payload, id } = event.data
  const startTime = performance.now()

  try {
    let result: any

    switch (type) {
      case 'FILTER':
        result = handleFilter(data, payload)
        break
      case 'SORT':
        result = handleSort(data, payload)
        break
      case 'AGGREGATE':
        result = handleAggregate(data, payload)
        break
      case 'SEARCH':
        result = handleSearch(data, payload)
        break
      case 'TRANSFORM':
        result = handleTransform(data, payload)
        break
      default:
        throw new Error(`Unknown message type: ${type}`)
    }

    const response: WorkerResponse = {
      id,
      result,
      duration: performance.now() - startTime
    }

    self.postMessage(response)
  } catch (error) {
    const response: WorkerResponse = {
      id,
      result: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: performance.now() - startTime
    }

    self.postMessage(response)
  }
})

// 过滤数据
function handleFilter(data: any[], payload: { field: string; value: any; operator?: string }) {
  const { field, value, operator = 'eq' } = payload

  return data.filter(item => {
    const itemValue = getNestedValue(item, field)

    switch (operator) {
      case 'eq':
        return itemValue === value
      case 'neq':
        return itemValue !== value
      case 'gt':
        return itemValue > value
      case 'gte':
        return itemValue >= value
      case 'lt':
        return itemValue < value
      case 'lte':
        return itemValue <= value
      case 'contains':
        return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
      case 'startsWith':
        return String(itemValue).toLowerCase().startsWith(String(value).toLowerCase())
      case 'endsWith':
        return String(itemValue).toLowerCase().endsWith(String(value).toLowerCase())
      case 'in':
        return Array.isArray(value) && value.includes(itemValue)
      default:
        return true
    }
  })
}

// 排序数据
function handleSort(data: any[], payload: { field: string; order?: 'asc' | 'desc' }[]) {
  const sorts = Array.isArray(payload) ? payload : [payload]

  return [...data].sort((a, b) => {
    for (const sort of sorts) {
      const { field, order = 'asc' } = sort
      const aVal = getNestedValue(a, field)
      const bVal = getNestedValue(b, field)

      let comparison = 0
      if (aVal < bVal) comparison = -1
      if (aVal > bVal) comparison = 1

      if (comparison !== 0) {
        return order === 'asc' ? comparison : -comparison
      }
    }
    return 0
  })
}

// 聚合数据
function handleAggregate(data: any[], payload: { groupBy: string; aggregations: { field: string; operation: 'sum' | 'avg' | 'min' | 'max' | 'count'; alias?: string }[] }) {
  const { groupBy, aggregations } = payload

  // 分组
  const groups = new Map<string, any[]>()
  data.forEach(item => {
    const key = String(getNestedValue(item, groupBy))
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(item)
  })

  // 计算聚合
  const result: any[] = []
  groups.forEach((items, key) => {
    const row: any = { [groupBy]: key }

    aggregations.forEach(({ field, operation, alias }) => {
      const values = items.map(item => getNestedValue(item, field))
      const outputKey = alias || `${field}_${operation}`

      switch (operation) {
        case 'sum':
          row[outputKey] = values.reduce((a, b) => Number(a) + Number(b), 0)
          break
        case 'avg':
          row[outputKey] = values.reduce((a, b) => Number(a) + Number(b), 0) / values.length
          break
        case 'min':
          row[outputKey] = Math.min(...values.map(v => Number(v)))
          break
        case 'max':
          row[outputKey] = Math.max(...values.map(v => Number(v)))
          break
        case 'count':
          row[outputKey] = values.length
          break
      }
    })

    result.push(row)
  })

  return result
}

// 搜索数据
function handleSearch(data: any[], payload: { query: string; fields: string[]; fuzzy?: boolean }) {
  const { query, fields, fuzzy = true } = payload
  const searchTerm = query.toLowerCase()

  if (!searchTerm) return data

  return data.filter(item => {
    return fields.some(field => {
      const value = String(getNestedValue(item, field) || '').toLowerCase()
      if (fuzzy) {
        return value.includes(searchTerm)
      }
      return value === searchTerm
    })
  })
}

// 数据转换
function handleTransform(data: any[], payload: { mappings: { from: string; to: string; transform?: string }[] }) {
  const { mappings } = payload

  return data.map(item => {
    const result: any = { ...item }

    mappings.forEach(({ from, to, transform }) => {
      let value = getNestedValue(item, from)

      if (transform) {
        switch (transform) {
          case 'uppercase':
            value = String(value).toUpperCase()
            break
          case 'lowercase':
            value = String(value).toLowerCase()
            break
          case 'number':
            value = Number(value)
            break
          case 'boolean':
            value = Boolean(value)
            break
          case 'date':
            value = new Date(value).toISOString()
            break
        }
      }

      setNestedValue(result, to, value)
    })

    return result
  })
}

// 获取嵌套对象值
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current?.[key]
  }, obj)
}

// 设置嵌套对象值
function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {}
    return current[key]
  }, obj)
  target[lastKey] = value
}

export {}
