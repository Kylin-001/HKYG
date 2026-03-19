/**
 * 性能优化Web Worker实现
 * 用于在后台执行计算密集型任务
 */

// Worker消息类型
interface WorkerMessage {
  id: string
  type: 'calculate' | 'process' | 'analyze'
  data: any
}

// 处理大数据集
const processLargeDataset = (data: any[], processor: string): any[] => {
  try {
    // 使用Function构造器创建处理函数
    const processFunction = new Function('item', processor)
    return data.map(processFunction)
  } catch (error) {
    throw new Error(`数据处理失败: ${error.message}`)
  }
}

// 执行复杂计算
const performComplexCalculation = (data: any[], calculation: string): any => {
  try {
    // 根据计算类型执行不同的计算
    switch (calculation) {
      case 'sum':
        return data.reduce((sum, item) => sum + (typeof item === 'number' ? item : 0), 0)

      case 'average':
        const sum = data.reduce((sum, item) => sum + (typeof item === 'number' ? item : 0), 0)
        return sum / data.length

      case 'max':
        return Math.max(...data.filter(item => typeof item === 'number'))

      case 'min':
        return Math.min(...data.filter(item => typeof item === 'number'))

      case 'median':
        const sorted = [...data.filter(item => typeof item === 'number')].sort((a, b) => a - b)
        const mid = Math.floor(sorted.length / 2)
        return sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid]

      default:
        // 自定义计算
        const calcFunction = new Function('data', calculation)
        return calcFunction(data)
    }
  } catch (error) {
    throw new Error(`计算失败: ${error.message}`)
  }
}

// 分析性能数据
const analyzePerformanceData = (metrics: any): any => {
  try {
    const analysis = {
      timestamp: Date.now(),
      metrics: {},
      suggestions: [],
      score: 0,
    }

    // 分析首屏指标
    if (metrics.firstContentfulPaint) {
      analysis.metrics.fcp = {
        value: metrics.firstContentfulPaint,
        status: metrics.firstContentfulPaint < 2000 ? 'good' : 'poor',
        recommendation: metrics.firstContentfulPaint < 2000
          ? '首屏绘制时间良好'
          : '建议优化关键渲染路径，减少首屏加载资源'
      }
    }

    // 分析最大内容绘制
    if (metrics.largestContentfulPaint) {
      analysis.metrics.lcp = {
        value: metrics.largestContentfulPaint,
        status: metrics.largestContentfulPaint < 2500 ? 'good' : 'poor',
        recommendation: metrics.largestContentfulPaint < 2500
          ? '最大内容绘制时间良好'
          : '建议优化图片和关键资源加载'
      }
    }

    // 分析首次输入延迟
    if (metrics.firstInputDelay) {
      analysis.metrics.fid = {
        value: metrics.firstInputDelay,
        status: metrics.firstInputDelay < 100 ? 'good' : 'poor',
        recommendation: metrics.firstInputDelay < 100
          ? '首次输入延迟良好'
          : '建议减少主线程阻塞，优化JavaScript执行'
      }
    }

    // 分析累积布局偏移
    if (metrics.cumulativeLayoutShift) {
      analysis.metrics.cls = {
        value: metrics.cumulativeLayoutShift,
        status: metrics.cumulativeLayoutShift < 0.1 ? 'good' : 'poor',
        recommendation: metrics.cumulativeLayoutShift < 0.1
          ? '累积布局偏移良好'
          : '建议为动态内容预留空间，避免布局偏移'
      }
    }

    // 计算性能评分
    let score = 0
    if (analysis.metrics.fcp) score += analysis.metrics.fcp.status === 'good' ? 25 : 0
    if (analysis.metrics.lcp) score += analysis.metrics.lcp.status === 'good' ? 25 : 0
    if (analysis.metrics.fid) score += analysis.metrics.fid.status === 'good' ? 25 : 0
    if (analysis.metrics.cls) score += analysis.metrics.cls.status === 'good' ? 25 : 0

    analysis.score = score

    // 生成建议
    if (score < 50) {
      analysis.suggestions.push('性能较差，需要全面优化')
    } else if (score < 75) {
      analysis.suggestions.push('性能一般，需要针对性优化')
    } else {
      analysis.suggestions.push('性能良好，继续保持')
    }

    return analysis
  } catch (error) {
    throw new Error(`性能分析失败: ${error.message}`)
  }
}

// 处理图片数据
const processImageData = (imageData: any, operation: string): any => {
  try {
    // 这里可以实现各种图片处理算法
    switch (operation) {
      case 'grayscale':
        return convertToGrayscale(imageData)

      case 'blur':
        return applyBlur(imageData, 5)

      case 'sharpen':
        return applySharpen(imageData)

      case 'resize':
        return resizeImage(imageData, 0.5)

      default:
        throw new Error(`不支持的图片处理操作: ${operation}`)
    }
  } catch (error) {
    throw new Error(`图片处理失败: ${error.message}`)
  }
}

// 转换为灰度图
const convertToGrayscale = (imageData: any): any => {
  const { data, width, height } = imageData
  const output = new Uint8ClampedArray(data.length)

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]

    // 使用加权平均法计算灰度值
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b)

    output[i] = gray
    output[i + 1] = gray
    output[i + 2] = gray
    output[i + 3] = a
  }

  return {
    data: output,
    width,
    height,
  }
}

// 应用模糊效果
const applyBlur = (imageData: any, radius: number): any => {
  const { data, width, height } = imageData
  const output = new Uint8ClampedArray(data.length)

  // 简单的均值模糊实现
  const size = radius * 2 + 1

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ny = y + dy
          const nx = x + dx

          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            const idx = (ny * width + nx) * 4
            r += data[idx]
            g += data[idx + 1]
            b += data[idx + 2]
            count++
          }
        }
      }

      const idx = (y * width + x) * 4
      output[idx] = r / count
      output[idx + 1] = g / count
      output[idx + 2] = b / count
      output[idx + 3] = data[idx + 3]
    }
  }

  return {
    data: output,
    width,
    height,
  }
}

// 应用锐化效果
const applySharpen = (imageData: any): any => {
  const { data, width, height } = imageData
  const output = new Uint8ClampedArray(data.length)

  // 简单的锐化核
  const kernel = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ]

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c
            sum += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)]
          }
        }

        const idx = (y * width + x) * 4 + c
        output[idx] = Math.min(255, Math.max(0, sum))
      }
    }
  }

  // 复制边缘像素
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        const idx = (y * width + x) * 4
        output[idx] = data[idx]
        output[idx + 1] = data[idx + 1]
        output[idx + 2] = data[idx + 2]
        output[idx + 3] = data[idx + 3]
      }
    }
  }

  return {
    data: output,
    width,
    height,
  }
}

// 调整图片大小
const resizeImage = (imageData: any, scale: number): any => {
  const { data, width, height } = imageData
  const newWidth = Math.floor(width * scale)
  const newHeight = Math.floor(height * scale)
  const output = new Uint8ClampedArray(newWidth * newHeight * 4)

  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const srcX = Math.floor(x / scale)
      const srcY = Math.floor(y / scale)
      const srcIdx = (srcY * width + srcX) * 4
      const dstIdx = (y * newWidth + x) * 4

      output[dstIdx] = data[srcIdx]
      output[dstIdx + 1] = data[srcIdx + 1]
      output[dstIdx + 2] = data[srcIdx + 2]
      output[dstIdx + 3] = data[srcIdx + 3]
    }
  }

  return {
    data: output,
    width: newWidth,
    height: newHeight,
  }
}

// Worker消息处理
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { id, type, data } = event.data

  try {
    let result

    switch (type) {
      case 'process':
        result = processLargeDataset(data.dataset, data.processor)
        break

      case 'calculate':
        result = performComplexCalculation(data.dataset, data.calculation)
        break

      case 'analyze':
        result = analyzePerformanceData(data)
        break

      default:
        if (data.imageData && data.operation) {
          result = processImageData(data.imageData, data.operation)
        } else {
          throw new Error(`未知任务类型: ${type}`)
        }
    }

    // 发送结果
    self.postMessage({
      id,
      type: 'result',
      data: result,
    } as WorkerMessage)

  } catch (error) {
    // 发送错误
    self.postMessage({
      id,
      type: 'error',
      data: error.message,
    } as WorkerMessage)
  }
}

// 导出Worker函数供测试使用
export {
  processLargeDataset,
  performComplexCalculation,
  analyzePerformanceData,
  processImageData,
  convertToGrayscale,
  applyBlur,
  applySharpen,
  resizeImage,
}