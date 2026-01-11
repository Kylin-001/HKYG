/**
 * API拦截器配置增强
 * 提供更强大的请求和响应处理机制
 */

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import logger from '@/utils/logger'

// 定义拦截器配置类型
export interface InterceptorConfig {
  // 是否启用缓存
  cache?: boolean
  // 缓存时间（毫秒）
  cacheTime?: number
  // 是否取消重复请求
  cancelDuplicate?: boolean
  // 是否启用请求重试
  retry?: boolean
  // 重试次数
  retryCount?: number
  // 重试延迟（毫秒）
  retryDelay?: number
  // 是否启用性能监控
  monitorPerformance?: boolean
  // 自定义请求头
  headers?: Record<string, string>
}

// 定义默认拦截器配置
export const defaultInterceptorConfig: InterceptorConfig = {
  cache: true,
  cacheTime: 5 * 60 * 1000, // 5分钟
  cancelDuplicate: true,
  retry: true,
  retryCount: 3,
  retryDelay: 1000, // 1秒
  monitorPerformance: true,
  headers: {},
}

// 性能监控数据类型
interface PerformanceData {
  startTime: number
  endTime: number
  duration: number
  url: string
  method: string
  status: number
}

// 性能监控器
class PerformanceMonitor {
  private performanceData: PerformanceData[] = []
  private maxDataPoints = 100

  recordRequest(config: AxiosRequestConfig): void {
    if (!config.monitorPerformance) return // 记录请求开始时间
    ;(config as any)._startTime = performance.now()
  }

  recordResponse(config: AxiosRequestConfig, response: AxiosResponse): void {
    if (!config.monitorPerformance) return

    const startTime = (config as any)._startTime
    if (!startTime) return

    const endTime = performance.now()
    const duration = endTime - startTime

    const performanceData: PerformanceData = {
      startTime,
      endTime,
      duration,
      url: config.url || '',
      method: config.method || 'GET',
      status: response.status,
    }

    // 添加到性能数据数组
    this.performanceData.unshift(performanceData)
    // 限制数据点数量
    this.performanceData = this.performanceData.slice(0, this.maxDataPoints)

    // 记录API响应时间
    logger.logApiResponseTime(config.url || '', duration, response.status)

    // 如果响应时间过长，记录警告
    if (duration > 2000) {
      logger.warn(`API响应时间过长: ${config.url || ''} - ${duration.toFixed(2)}ms`, {
        method: config.method,
        status: response.status,
        duration: duration.toFixed(2),
      })
    }
  }

  recordError(config: AxiosRequestConfig, error: AxiosError): void {
    if (!config.monitorPerformance) return

    const startTime = (config as any)._startTime
    if (!startTime) return

    const endTime = performance.now()
    const duration = endTime - startTime

    logger.error(`API请求失败: ${config.url || ''} - ${duration.toFixed(2)}ms`, {
      method: config.method,
      status: error.response?.status,
      error: error.message,
      duration: duration.toFixed(2),
    })
  }

  getPerformanceSummary() {
    if (this.performanceData.length === 0) {
      return {
        average: 0,
        max: 0,
        min: 0,
        count: 0,
      }
    }

    const durations = this.performanceData.map(data => data.duration)
    return {
      average: durations.reduce((sum, dur) => sum + dur, 0) / durations.length,
      max: Math.max(...durations),
      min: Math.min(...durations),
      count: durations.length,
    }
  }
}

// 创建性能监控实例
export const performanceMonitor = new PerformanceMonitor()

/**
 * 增强的请求拦截器
 * @param config 请求配置
 * @returns 处理后的请求配置
 */
export function enhancedRequestInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
  // 合并默认配置
  const mergedConfig = {
    ...defaultInterceptorConfig,
    ...(config as any).interceptorConfig,
  }

  // 保存合并后的配置
  ;(config as any).interceptorConfig = mergedConfig

  // 记录请求开始时间
  performanceMonitor.recordRequest(config)

  // 可以在这里添加更多请求处理逻辑
  // 例如：请求加密、签名生成等

  return config
}

/**
 * 增强的响应拦截器
 * @param response 响应对象
 * @returns 处理后的响应对象
 */
export function enhancedResponseInterceptor(response: AxiosResponse): AxiosResponse {
  // 记录请求结束时间，计算性能数据
  performanceMonitor.recordResponse(response.config, response)

  // 可以在这里添加更多响应处理逻辑
  // 例如：响应解密、数据转换等

  return response
}

/**
 * 增强的错误拦截器
 * @param error 错误对象
 * @returns 处理后的错误对象
 */
export function enhancedErrorInterceptor(error: AxiosError): Promise<AxiosError> {
  // 记录错误性能数据
  if (error.config) {
    performanceMonitor.recordError(error.config, error)
  }

  // 可以在这里添加更多错误处理逻辑
  // 例如：错误分类、自动恢复等

  return Promise.reject(error)
}

/**
 * 安装增强拦截器到axios实例
 * @param axiosInstance axios实例
 */
export function installEnhancedInterceptors(axiosInstance: AxiosInstance): void {
  // 添加请求拦截器
  axiosInstance.interceptors.request.use(enhancedRequestInterceptor)

  // 添加响应拦截器
  axiosInstance.interceptors.response.use(enhancedResponseInterceptor, enhancedErrorInterceptor)
}

/**
 * 获取性能统计信息
 * @returns 性能统计摘要
 */
export function getPerformanceSummary() {
  return performanceMonitor.getPerformanceSummary()
}

/**
 * 清除性能数据
 */
export function clearPerformanceData() {
  performanceMonitor.performanceData = []
}

/**
 * API请求增强工具函数
 * @param axiosInstance axios实例
 * @param config 请求配置
 * @param interceptorConfig 拦截器配置
 * @returns 增强后的请求
 */
export async function enhancedApiRequest(
  axiosInstance: AxiosInstance,
  config: AxiosRequestConfig,
  interceptorConfig?: InterceptorConfig
): Promise<AxiosResponse> {
  // 合并拦截器配置
  const mergedInterceptorConfig = {
    ...defaultInterceptorConfig,
    ...interceptorConfig,
  }

  // 创建增强的请求配置
  const enhancedConfig: AxiosRequestConfig = {
    ...config,
    interceptorConfig: mergedInterceptorConfig,
  }

  // 执行请求
  return axiosInstance(enhancedConfig)
}
