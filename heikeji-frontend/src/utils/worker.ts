/**
 * 性能优化Web Worker
 * 用于在后台执行计算密集型任务，避免阻塞主线程
 */

// Worker消息类型
interface WorkerMessage {
  id: string
  type: 'calculate' | 'process' | 'analyze'
  data: any
}

interface WorkerResponse {
  id: string
  type: 'result' | 'error' | 'progress'
  data: any
}

// 大数据集处理
export const processLargeDataset = (data: any[], processor: (item: any) => any): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/workers/performance-worker.js', { type: 'module' })
    
    const messageId = Date.now().toString()
    
    worker.postMessage({
      id: messageId,
      type: 'process',
      data: {
        dataset: data,
        processor: processor.toString(),
      }
    } as WorkerMessage)
    
    worker.onmessage = (event) => {
      const response = event.data as WorkerResponse
      
      if (response.id === messageId) {
        if (response.type === 'result') {
          resolve(response.data)
        } else if (response.type === 'error') {
          reject(new Error(response.data))
        }
        
        worker.terminate()
      }
    }
    
    worker.onerror = (error) => {
      reject(error)
      worker.terminate()
    }
  })
}

// 复杂计算
export const performComplexCalculation = (data: any[], calculation: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/workers/performance-worker.js', { type: 'module' })
    
    const messageId = Date.now().toString()
    
    worker.postMessage({
      id: messageId,
      type: 'calculate',
      data: {
        dataset: data,
        calculation,
      }
    } as WorkerMessage)
    
    worker.onmessage = (event) => {
      const response = event.data as WorkerResponse
      
      if (response.id === messageId) {
        if (response.type === 'result') {
          resolve(response.data)
        } else if (response.type === 'error') {
          reject(new Error(response.data))
        }
        
        worker.terminate()
      }
    }
    
    worker.onerror = (error) => {
      reject(error)
      worker.terminate()
    }
  })
}

// 性能分析
export const analyzePerformanceData = (metrics: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/workers/performance-worker.js', { type: 'module' })
    
    const messageId = Date.now().toString()
    
    worker.postMessage({
      id: messageId,
      type: 'analyze',
      data: metrics,
    } as WorkerMessage)
    
    worker.onmessage = (event) => {
      const response = event.data as WorkerResponse
      
      if (response.id === messageId) {
        if (response.type === 'result') {
          resolve(response.data)
        } else if (response.type === 'error') {
          reject(new Error(response.data))
        }
        
        worker.terminate()
      }
    }
    
    worker.onerror = (error) => {
      reject(error)
      worker.terminate()
    }
  })
}

// 图片处理
export const processImage = (imageData: ImageData, operation: string): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/workers/image-worker.js', { type: 'module' })
    
    const messageId = Date.now().toString()
    
    worker.postMessage({
      id: messageId,
      type: 'process',
      data: {
        imageData,
        operation,
      }
    } as WorkerMessage)
    
    worker.onmessage = (event) => {
      const response = event.data as WorkerResponse
      
      if (response.id === messageId) {
        if (response.type === 'result') {
          resolve(response.data)
        } else if (response.type === 'error') {
          reject(new Error(response.data))
        }
        
        worker.terminate()
      }
    }
    
    worker.onerror = (error) => {
      reject(error)
      worker.terminate()
    }
  })
}

// Worker池管理
class WorkerPool {
  private workers: Worker[] = []
  private availableWorkers: Worker[] = []
  private taskQueue: Array<{
    id: string
    type: string
    data: any
    resolve: (result: any) => void
    reject: (error: any) => void
  }> = []
  private maxWorkers: number
  
  constructor(workerUrl: string, maxWorkers = 4) {
    this.maxWorkers = maxWorkers
    
    // 创建Worker池
    for (let i = 0; i < maxWorkers; i++) {
      const worker = new Worker(workerUrl, { type: 'module' })
      this.workers.push(worker)
      this.availableWorkers.push(worker)
      
      // 设置消息处理
      worker.onmessage = (event) => {
        const response = event.data as WorkerResponse
        this.handleWorkerResponse(worker, response)
      }
      
      worker.onerror = (error) => {
        console.error('Worker错误:', error)
        this.handleWorkerError(worker, error)
      }
    }
  }
  
  // 处理Worker响应
  private handleWorkerResponse(worker: Worker, response: WorkerResponse) {
    // 查找对应的任务
    const taskIndex = this.taskQueue.findIndex(task => task.id === response.id)
    
    if (taskIndex !== -1) {
      const task = this.taskQueue[taskIndex]
      this.taskQueue.splice(taskIndex, 1)
      
      if (response.type === 'result') {
        task.resolve(response.data)
      } else if (response.type === 'error') {
        task.reject(new Error(response.data))
      }
      
      // 将Worker标记为可用
      this.availableWorkers.push(worker)
      
      // 处理下一个任务
      this.processNextTask()
    }
  }
  
  // 处理Worker错误
  private handleWorkerError(worker: Worker, error: any) {
    // 查找对应的任务
    const taskIndex = this.taskQueue.findIndex(task => this.workers.includes(worker))
    
    if (taskIndex !== -1) {
      const task = this.taskQueue[taskIndex]
      this.taskQueue.splice(taskIndex, 1)
      task.reject(error)
    }
    
    // 移除有问题的Worker
    const workerIndex = this.workers.indexOf(worker)
    if (workerIndex !== -1) {
      this.workers.splice(workerIndex, 1)
      const availableIndex = this.availableWorkers.indexOf(worker)
      if (availableIndex !== -1) {
        this.availableWorkers.splice(availableIndex, 1)
      }
    }
    
    // 创建新的Worker替换
    try {
      const newWorker = new Worker(worker.scriptURL!, { type: 'module' })
      this.workers.push(newWorker)
      this.availableWorkers.push(newWorker)
      
      newWorker.onmessage = (event) => {
        this.handleWorkerResponse(newWorker, event.data as WorkerResponse)
      }
      
      newWorker.onerror = (error) => {
        this.handleWorkerError(newWorker, error)
      }
    } catch (error) {
      console.error('创建新Worker失败:', error)
    }
  }
  
  // 处理下一个任务
  private processNextTask() {
    if (this.taskQueue.length === 0 || this.availableWorkers.length === 0) {
      return
    }
    
    const task = this.taskQueue[0]
    const worker = this.availableWorkers.shift()!
    
    worker.postMessage({
      id: task.id,
      type: task.type,
      data: task.data,
    } as WorkerMessage)
  }
  
  // 执行任务
  execute(type: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const task = {
        id: Date.now().toString() + Math.random().toString(),
        type,
        data,
        resolve,
        reject,
      }
      
      this.taskQueue.push(task)
      this.processNextTask()
    })
  }
  
  // 销毁Worker池
  destroy() {
    this.workers.forEach(worker => worker.terminate())
    this.workers = []
    this.availableWorkers = []
    this.taskQueue = []
  }
}

// 创建Worker池实例
export const workerPool = new WorkerPool('/workers/performance-worker.js')

// 导出Worker池方法
export const executeInBackground = (type: string, data: any): Promise<any> => {
  return workerPool.execute(type, data)
}

// 批量处理
export const batchProcess = async <T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize = 10,
  maxConcurrency = 4
): Promise<R[]> => {
  const results: R[] = []
  
  // 分批处理
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    
    // 并发处理批次中的项目
    const batchPromises = batch.map(item => 
      executeInBackground('process', {
        item,
        processor: processor.toString(),
      })
    )
    
    // 等待当前批次完成
    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)
  }
  
  return results
}

export default {
  processLargeDataset,
  performComplexCalculation,
  analyzePerformanceData,
  processImage,
  WorkerPool,
  workerPool,
  executeInBackground,
  batchProcess,
}