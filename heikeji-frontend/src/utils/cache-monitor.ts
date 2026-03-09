/**
 * 缓存监控和分析工具
 * 用于监控缓存性能和分析缓存使用情况
 */

import { defaultCacheService } from './cache-service'

// 缓存监控指标
interface CacheMetrics {
  timestamp: number
  hitRate: number
  missRate: number
  totalKeys: number
  memoryUsage: number
  expiredKeys: number
  evictedKeys: number
  averageTTL: number
  oldestKey: number
  newestKey: number
}

// 缓存分析结果
interface CacheAnalysis {
  timestamp: number
  period: string // 分析周期
  metrics: CacheMetrics
  trends: {
    hitRate: Array<{ timestamp: number; value: number }>
    memoryUsage: Array<{ timestamp: number; value: number }>
    keyCount: Array<{ timestamp: number; value: number }>
  }
  recommendations: Array<{
    type: 'performance' | 'capacity' | 'configuration'
    priority: 'high' | 'medium' | 'low'
    title: string
    description: string
    action: string
  }>
  score: number // 缓存性能评分（0-100）
}

// 缓存监控器
class CacheMonitor {
  private metrics: CacheMetrics[] = []
  private maxMetricsCount = 100 // 最多保留100个历史记录
  private monitoringInterval: any = null
  private isMonitoring = false
  
  // 开始监控
  startMonitoring(intervalMs: number = 60000): void {
    if (this.isMonitoring) {
      console.log('缓存监控已在运行中')
      return
    }
    
    this.isMonitoring = true
    console.log(`开始缓存监控，间隔: ${intervalMs}ms`)
    
    // 立即收集一次指标
    this.collectMetrics()
    
    // 定期收集指标
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics()
    }, intervalMs)
  }
  
  // 停止监控
  stopMonitoring(): void {
    if (!this.isMonitoring) {
      return
    }
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
    }
    
    this.isMonitoring = false
    console.log('缓存监控已停止')
  }
  
  // 收集指标
  private async collectMetrics(): Promise<void> {
    try {
      const stats = await defaultCacheService.getStats()
      
      const metrics: CacheMetrics = {
        timestamp: Date.now(),
        hitRate: stats.hitRate || 0,
        missRate: 1 - (stats.hitRate || 0),
        totalKeys: stats.totalKeys || 0,
        memoryUsage: stats.memoryUsage || 0,
        expiredKeys: stats.expiredKeys || 0,
        evictedKeys: stats.evictedKeys || 0,
        averageTTL: 0, // 需要额外计算
        oldestKey: 0, // 需要额外计算
        newestKey: 0, // 需要额外计算
      }
      
      // 添加到历史记录
      this.metrics.push(metrics)
      
      // 限制历史记录数量
      if (this.metrics.length > this.maxMetricsCount) {
        this.metrics.shift()
      }
      
      console.log('缓存指标:', metrics)
      
      // 检查是否需要告警
      this.checkAlerts(metrics)
    } catch (error) {
      console.error('收集缓存指标失败:', error)
    }
  }
  
  // 检查告警
  private checkAlerts(metrics: CacheMetrics): void {
    const hitRateTarget = parseFloat(import.meta.env.VITE_CACHE_ALERT_HIT_RATE_BELOW || '0.7')
    const memoryUsageThreshold = parseFloat(import.meta.env.VITE_CACHE_ALERT_MEMORY_USAGE_ABOVE || '0.9')
    
    // 命中率告警
    if (metrics.hitRate < hitRateTarget) {
      console.warn(`缓存命中率告警: ${metrics.hitRate.toFixed(2)} < ${hitRateTarget}`)
      this.sendAlert('low_hit_rate', {
        current: metrics.hitRate,
        target: hitRateTarget,
      })
    }
    
    // 内存使用告警
    if (metrics.memoryUsage > 0) {
      const maxMemory = parseFloat(import.meta.env.VITE_CACHE_MAX_MEMORY || '10485760')
      const usageRate = metrics.memoryUsage / maxMemory
      
      if (usageRate > memoryUsageThreshold) {
        console.warn(`内存使用告警: ${(usageRate * 100).toFixed(2)}% > ${(memoryUsageThreshold * 100).toFixed(2)}%`)
        this.sendAlert('high_memory_usage', {
          current: metrics.memoryUsage,
          max: maxMemory,
          usageRate: usageRate,
        })
      }
    }
  }
  
  // 发送告警
  private sendAlert(type: string, data: any): void {
    // 这里可以集成告警系统
    console.log(`发送告警: ${type}`, data)
    
    // 示例：发送到监控系统
    // alertSystem.send({
    //   type,
    //   data,
    //   timestamp: Date.now(),
    // })
  }
  
  // 获取当前指标
  getCurrentMetrics(): CacheMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null
  }
  
  // 获取历史指标
  getMetricsHistory(count?: number): CacheMetrics[] {
    if (count) {
      return this.metrics.slice(-count)
    }
    return this.metrics
  }
  
  // 清除历史指标
  clearMetrics(): void {
    this.metrics = []
  }
}

// 缓存分析器
class CacheAnalyzer {
  // 分析缓存性能
  analyzePerformance(period: 'hour' | 'day' | 'week' = 'day'): CacheAnalysis {
    const now = Date.now()
    let startTime: number
    
    switch (period) {
      case 'hour':
        startTime = now - 60 * 60 * 1000
        break
      case 'day':
        startTime = now - 24 * 60 * 60 * 1000
        break
      case 'week':
        startTime = now - 7 * 24 * 60 * 60 * 1000
        break
    }
    
    // 获取指定时间段的指标
    const relevantMetrics = cacheMonitor.getMetricsHistory().filter(m => m.timestamp >= startTime)
    
    if (relevantMetrics.length === 0) {
      return this.createEmptyAnalysis(period)
    }
    
    // 计算平均值
    const avgHitRate = relevantMetrics.reduce((sum, m) => sum + m.hitRate, 0) / relevantMetrics.length
    const avgMemoryUsage = relevantMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / relevantMetrics.length
    const avgKeyCount = relevantMetrics.reduce((sum, m) => sum + m.totalKeys, 0) / relevantMetrics.length
    
    // 生成趋势数据
    const trends = {
      hitRate: relevantMetrics.map(m => ({ timestamp: m.timestamp, value: m.hitRate })),
      memoryUsage: relevantMetrics.map(m => ({ timestamp: m.timestamp, value: m.memoryUsage })),
      keyCount: relevantMetrics.map(m => ({ timestamp: m.timestamp, value: m.totalKeys })),
    }
    
    // 生成建议
    const recommendations = this.generateRecommendations(avgHitRate, avgMemoryUsage, avgKeyCount)
    
    // 计算评分
    const score = this.calculateScore(avgHitRate, avgMemoryUsage, avgKeyCount)
    
    return {
      timestamp: now,
      period,
      metrics: {
        timestamp: now,
        hitRate: avgHitRate,
        missRate: 1 - avgHitRate,
        totalKeys: Math.round(avgKeyCount),
        memoryUsage: Math.round(avgMemoryUsage),
        expiredKeys: 0, // 需要从统计中获取
        evictedKeys: 0, // 需要从统计中获取
        averageTTL: 0, // 需要额外计算
        oldestKey: 0, // 需要额外计算
        newestKey: 0, // 需要额外计算
      },
      trends,
      recommendations,
      score,
    }
  }
  
  // 创建空分析
  private createEmptyAnalysis(period: string): CacheAnalysis {
    return {
      timestamp: Date.now(),
      period,
      metrics: {
        timestamp: Date.now(),
        hitRate: 0,
        missRate: 1,
        totalKeys: 0,
        memoryUsage: 0,
        expiredKeys: 0,
        evictedKeys: 0,
        averageTTL: 0,
        oldestKey: 0,
        newestKey: 0,
      },
      trends: {
        hitRate: [],
        memoryUsage: [],
        keyCount: [],
      },
      recommendations: [{
        type: 'configuration',
        priority: 'medium',
        title: '没有缓存数据',
        description: '在指定时间段内没有收集到缓存数据',
        action: '请检查缓存服务是否正常运行',
      }],
      score: 0,
    }
  }
  
  // 生成建议
  private generateRecommendations(
    hitRate: number,
    memoryUsage: number,
    keyCount: number
  ): Array<{
    type: 'performance' | 'capacity' | 'configuration'
    priority: 'high' | 'medium' | 'low'
    title: string
    description: string
    action: string
  }> {
    const recommendations = []
    const hitRateTarget = parseFloat(import.meta.env.VITE_CACHE_HIT_RATE_TARGET || '0.8')
    const maxMemory = parseFloat(import.meta.env.VITE_CACHE_MAX_MEMORY || '10485760')
    const memoryUsageThreshold = parseFloat(import.meta.env.VITE_CACHE_MEMORY_USAGE_THRESHOLD || '0.8')
    
    // 性能建议
    if (hitRate < hitRateTarget) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        title: '缓存命中率过低',
        description: `当前命中率${(hitRate * 100).toFixed(2)}%，低于目标${(hitRateTarget * 100).toFixed(2)}%`,
        action: '建议优化缓存策略，增加缓存时间或预热热点数据',
      })
    }
    
    // 容量建议
    if (memoryUsage > maxMemory * memoryUsageThreshold) {
      recommendations.push({
        type: 'capacity',
        priority: 'medium',
        title: '内存使用过高',
        description: `当前内存使用${(memoryUsage / 1024 / 1024).toFixed(2)}MB，超过阈值的${(memoryUsageThreshold * 100).toFixed(2)}%`,
        action: '建议增加缓存清理频率或调整缓存大小限制',
      })
    }
    
    // 配置建议
    if (keyCount === 0) {
      recommendations.push({
        type: 'configuration',
        priority: 'high',
        title: '缓存为空',
        description: '缓存中没有数据，可能配置有误或服务异常',
        action: '请检查缓存配置和服务状态',
      })
    }
    
    // 优化建议
    if (hitRate >= hitRateTarget && memoryUsage < maxMemory * 0.5) {
      recommendations.push({
        type: 'performance',
        priority: 'low',
        title: '缓存性能良好',
        description: '缓存命中率和内存使用都在合理范围内',
        action: '继续保持当前配置，定期监控性能指标',
      })
    }
    
    return recommendations
  }
  
  // 计算评分
  private calculateScore(hitRate: number, memoryUsage: number, keyCount: number): number {
    let score = 0
    
    // 命中率评分（0-40分）
    const hitRateTarget = parseFloat(import.meta.env.VITE_CACHE_HIT_RATE_TARGET || '0.8')
    score += Math.min(40, hitRate / hitRateTarget * 40)
    
    // 内存使用评分（0-30分）
    const maxMemory = parseFloat(import.meta.env.VITE_CACHE_MAX_MEMORY || '10485760')
    const memoryEfficiency = Math.max(0, 1 - memoryUsage / maxMemory)
    score += memoryEfficiency * 30
    
    // 键数量评分（0-30分）
    const maxKeys = parseFloat(import.meta.env.VITE_CACHE_MAX_SIZE || '1000')
    const keyEfficiency = Math.min(1, keyCount / maxKeys)
    score += keyEfficiency * 30
    
    return Math.round(score)
  }
}

// 缓存报告生成器
class CacheReportGenerator {
  // 生成性能报告
  static generatePerformanceReport(analysis: CacheAnalysis): string {
    const { metrics, trends, recommendations, score } = analysis
    
    return `
# 缓存性能报告

## 基本信息
- 生成时间: ${new Date(analysis.timestamp).toLocaleString()}
- 分析周期: ${analysis.period}
- 性能评分: ${score}/100 (${this.getGrade(score)})

## 性能指标
- 命中率: ${(metrics.hitRate * 100).toFixed(2)}%
- 未命中率: ${(metrics.missRate * 100).toFixed(2)}%
- 总键数: ${metrics.totalKeys}
- 内存使用: ${(metrics.memoryUsage / 1024).toFixed(2)}KB
- 过期键数: ${metrics.expiredKeys}
- 驱逐键数: ${metrics.evictedKeys}

## 性能趋势
### 命中率趋势
${this.generateTrendTable(trends.hitRate, '命中率', '%')}

### 内存使用趋势
${this.generateTrendTable(trends.memoryUsage, '内存使用', 'KB')}

### 键数量趋势
${this.generateTrendTable(trends.keyCount, '键数量', '')}

## 优化建议
${recommendations.map(rec => 
  `- [${rec.priority.toUpperCase()}] ${rec.title}\n  ${rec.description}\n  建议: ${rec.action}\n`
).join('\n')}

## 详细数据
\`\`\`
${JSON.stringify(analysis, null, 2)}
\`\`\`
    `
  }
  
  // 生成趋势表格
  private static generateTrendTable(data: Array<{ timestamp: number; value: number }>, label: string, unit: string): string {
    if (data.length === 0) return '暂无数据'
    
    const header = `| 时间 | ${label} |\n|------|--------|`
    const rows = data.map(item => {
      const time = new Date(item.timestamp).toLocaleString()
      return `| ${time} | ${item.value}${unit} |`
    })
    
    return [header, ...rows].join('\n')
  }
  
  // 获取等级
  private static getGrade(score: number): string {
    if (score >= 90) return 'A (优秀)'
    if (score >= 80) return 'B (良好)'
    if (score >= 70) return 'C (一般)'
    if (score >= 60) return 'D (较差)'
    return 'F (很差)'
  }
  
  // 下载报告
  static downloadReport(analysis: CacheAnalysis): void {
    const report = this.generatePerformanceReport(analysis)
    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `cache-report-${new Date(analysis.timestamp).toISOString().split('T')[0]}.md`
    link.click()
    
    URL.revokeObjectURL(url)
  }
}

// 创建全局实例
export const cacheMonitor = new CacheMonitor()
export const cacheAnalyzer = new CacheAnalyzer()
export const cacheReportGenerator = CacheReportGenerator

// 导出工具函数
export const cacheUtils = {
  // 格式化命中率
  formatHitRate: (hitRate: number): string => {
    return `${(hitRate * 100).toFixed(2)}%`
  },
  
  // 格式化内存大小
  formatMemorySize: (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`
  },
  
  // 计算缓存效率
  calculateEfficiency: (hitRate: number, memoryUsage: number, maxMemory: number): number => {
    const hitRateScore = hitRate
    const memoryScore = Math.max(0, 1 - memoryUsage / maxMemory)
    return (hitRateScore + memoryScore) / 2
  },
  
  // 生成缓存键
  generateKey: (namespace: string, ...parts: string[]): string => {
    return `${namespace}:${parts.join(':')}`
  },
  
  // 解析缓存键
  parseKey: (key: string): { namespace: string; parts: string[] } => {
    const [namespace, ...parts] = key.split(':')
    return { namespace, parts }
  },
}

export {
  CacheMonitor,
  CacheAnalyzer,
  CacheReportGenerator,
}

export default cacheMonitor