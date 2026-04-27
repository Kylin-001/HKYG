/**
 * Web Worker Hook - 用于在 Vue 组件中使用 Web Worker
 * 
 * 特性：
 * - 自动创建和销毁 Worker
 * - 支持 Promise 风格的调用
 * - 请求队列管理
 * - 错误处理
 */
import { ref, onUnmounted } from 'vue'

interface WorkerRequest {
  id: string
  resolve: (value: any) => void
  reject: (reason: any) => void
  timeout: number
}

interface WorkerOptions {
  timeout?: number
  onError?: (error: Error) => void
}

export function useWorker(workerScript: string, options: WorkerOptions = {}) {
  const { timeout = 30000, onError } = options

  const worker = ref<Worker | null>(null)
  const pendingRequests = ref<Map<string, WorkerRequest>>(new Map())
  const isReady = ref(false)
  const error = ref<Error | null>(null)

  // 生成唯一 ID
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // 初始化 Worker
  const initWorker = () => {
    try {
      worker.value = new Worker(workerScript, { type: 'module' })

      worker.value.onmessage = (event) => {
        const { id, result, error: workerError } = event.data
        const request = pendingRequests.value.get(id)

        if (request) {
          clearTimeout(request.timeout)
          pendingRequests.value.delete(id)

          if (workerError) {
            request.reject(new Error(workerError))
          } else {
            request.resolve(result)
          }
        }
      }

      worker.value.onerror = (err) => {
        error.value = err
        onError?.(err)
        console.error('[Worker] Error:', err)
      }

      isReady.value = true
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to create worker')
      onError?.(error.value)
    }
  }

  // 发送消息到 Worker
  const postMessage = <T = any>(type: string, data: any[], payload?: any): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!worker.value) {
        reject(new Error('Worker not initialized'))
        return
      }

      const id = generateId()
      const timeoutId = window.setTimeout(() => {
        pendingRequests.value.delete(id)
        reject(new Error(`Worker request timeout after ${timeout}ms`))
      }, timeout)

      pendingRequests.value.set(id, {
        id,
        resolve,
        reject,
        timeout: timeoutId
      })

      worker.value.postMessage({
        type,
        data,
        payload,
        id
      })
    })
  }

  // 终止 Worker
  const terminate = () => {
    // 清理所有待处理的请求
    pendingRequests.value.forEach((request) => {
      clearTimeout(request.timeout)
      request.reject(new Error('Worker terminated'))
    })
    pendingRequests.value.clear()

    if (worker.value) {
      worker.value.terminate()
      worker.value = null
    }

    isReady.value = false
  }

  // 立即初始化
  initWorker()

  // 组件卸载时清理
  onUnmounted(() => {
    terminate()
  })

  return {
    worker,
    isReady,
    error,
    postMessage,
    terminate
  }
}

// 专门用于数据处理的 Worker Hook
export function useDataProcessor() {
  const worker = useWorker(new URL('@/workers/dataProcessor.worker.ts', import.meta.url).href, {
    timeout: 60000 // 数据处理可能需要更长时间
  })

  // 过滤数据
  const filterData = <T = any>(
    data: T[],
    field: string,
    value: any,
    operator: string = 'eq'
  ) => {
    return worker.postMessage<T[]>('FILTER', data, { field, value, operator })
  }

  // 排序数据
  const sortData = <T = any>(
    data: T[],
    sorts: { field: string; order?: 'asc' | 'desc' }[]
  ) => {
    return worker.postMessage<T[]>('SORT', data, sorts)
  }

  // 聚合数据
  const aggregateData = <T = any>(
    data: T[],
    groupBy: string,
    aggregations: { field: string; operation: 'sum' | 'avg' | 'min' | 'max' | 'count'; alias?: string }[]
  ) => {
    return worker.postMessage<any[]>('AGGREGATE', data, { groupBy, aggregations })
  }

  // 搜索数据
  const searchData = <T = any>(
    data: T[],
    query: string,
    fields: string[],
    fuzzy: boolean = true
  ) => {
    return worker.postMessage<T[]>('SEARCH', data, { query, fields, fuzzy })
  }

  // 转换数据
  const transformData = <T = any>(
    data: T[],
    mappings: { from: string; to: string; transform?: string }[]
  ) => {
    return worker.postMessage<T[]>('TRANSFORM', data, { mappings })
  }

  return {
    ...worker,
    filterData,
    sortData,
    aggregateData,
    searchData,
    transformData
  }
}
