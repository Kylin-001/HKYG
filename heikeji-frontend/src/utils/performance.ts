/**
 * 性能监控和分析工具
 * 用于监控和分析前端性能指标
 */

// 性能指标类型
interface PerformanceMetrics {
  // 导航指标
  navigationStart: number
  navigationEnd: number
  domContentLoaded: number
  loadComplete: number

  // 首屏指标
  firstPaint: number
  firstContentfulPaint: number
  firstMeaningfulPaint: number
  largestContentfulPaint: number

  // 交互指标
  firstInputDelay: number
  cumulativeLayoutShift: number
  timeToInteractive: number

  // 资源指标
  totalResources: number
  totalSize: number
  compressedSize: number

  // 自定义指标
  routeChangeTime: number
  componentLoadTime: number
}

// 性能数据收集器
class PerformanceCollector {
  private metrics: Partial<PerformanceMetrics> = {}
  private observers: PerformanceObserver[] = []

  constructor() {
    this.init()
  }

  // 初始化性能监控
  private init() {
    // 监听页面加载
    if (document.readyState === 'complete') {
      this.collectNavigationMetrics()
    } else {
      window.addEventListener('load', () => this.collectNavigationMetrics())
    }

    // 监听首屏绘制
    this.observePaintMetrics()

    // 监听交互指标
    this.observeInteractionMetrics()

    // 监听资源加载
    this.observeResourceMetrics()
  }

  // 收集导航指标
  private collectNavigationMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as any

    if (navigation) {
      this.metrics.navigationStart = navigation.navigationStart
      this.metrics.domContentLoaded =
        navigation.domContentLoadedEventEnd - navigation.navigationStart
      this.metrics.loadComplete = navigation.loadEventEnd - navigation.navigationStart
    }
  }

  // 观察绘制指标
  private observePaintMetrics() {
    if (!('PerformanceObserver' in window)) return

    const paintObserver = new PerformanceObserver(list => {
      const entries = list.getEntries()

      entries.forEach(entry => {
        if (entry.name === 'first-paint') {
          this.metrics.firstPaint = entry.startTime
        } else if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime
        } else if (entry.name === 'largest-contentful-paint') {
          this.metrics.largestContentfulPaint = entry.startTime
        }
      })
    })

    paintObserver.observe({ entryTypes: ['paint'] })
    this.observers.push(paintObserver)
  }

  // 观察交互指标
  private observeInteractionMetrics() {
    if (!('PerformanceObserver' in window)) return

    // 监听首次输入延迟
    const fidObserver = new PerformanceObserver(list => {
      const entries = list.getEntries()
      const firstInput = entries[0] as any

      if (firstInput && firstInput.processingStart) {
        this.metrics.firstInputDelay = firstInput.processingStart - firstInput.startTime
      }
    })

    fidObserver.observe({ entryTypes: ['first-input'] })
    this.observers.push(fidObserver)

    // 监听累积布局偏移
    const clsObserver = new PerformanceObserver(list => {
      const entries = list.getEntries()
      let clsValue = 0

      entries.forEach(entry => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      })

      this.metrics.cumulativeLayoutShift = clsValue
    })

    clsObserver.observe({ entryTypes: ['layout-shift'] })
    this.observers.push(clsObserver)
  }

  // 观察资源指标
  private observeResourceMetrics() {
    if (!('PerformanceObserver' in window)) return

    const resourceObserver = new PerformanceObserver(list => {
      const entries = list.getEntries()
      let totalSize = 0
      let compressedSize = 0

      entries.forEach(entry => {
        const resourceEntry = entry as PerformanceResourceTiming
        if (resourceEntry.transferSize) {
          totalSize += resourceEntry.transferSize
          compressedSize += resourceEntry.encodedBodySize || resourceEntry.transferSize
        }
      })

      this.metrics.totalResources = entries.length
      this.metrics.totalSize = totalSize
      this.metrics.compressedSize = compressedSize
    })

    resourceObserver.observe({ entryTypes: ['resource'] })
    this.observers.push(resourceObserver)
  }

  // 记录路由切换时间
  recordRouteChange(from: string, to: string, startTime: number) {
    this.metrics.routeChangeTime = performance.now() - startTime

    // 发送分析数据
    this.sendAnalytics('route_change', {
      from,
      to,
      loadTime: this.metrics.routeChangeTime,
    })
  }

  // 记录组件加载时间
  recordComponentLoad(componentName: string, startTime: number) {
    this.metrics.componentLoadTime = performance.now() - startTime

    // 发送分析数据
    this.sendAnalytics('component_load', {
      component: componentName,
      loadTime: this.metrics.componentLoadTime,
    })
  }

  // 发送分析数据
  private sendAnalytics(event: string, data: any) {
    // 只在生产环境发送
    if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      // 这里可以集成第三方分析服务
      // analytics.track(event, data)
      console.log('Analytics:', event, data)
    }
  }

  // 获取性能指标
  getMetrics(): PerformanceMetrics {
    return {
      navigationStart: this.metrics.navigationStart || 0,
      navigationEnd: this.metrics.navigationEnd || 0,
      domContentLoaded: this.metrics.domContentLoaded || 0,
      loadComplete: this.metrics.loadComplete || 0,
      firstPaint: this.metrics.firstPaint || 0,
      firstContentfulPaint: this.metrics.firstContentfulPaint || 0,
      firstMeaningfulPaint: this.metrics.firstMeaningfulPaint || 0,
      largestContentfulPaint: this.metrics.largestContentfulPaint || 0,
      firstInputDelay: this.metrics.firstInputDelay || 0,
      cumulativeLayoutShift: this.metrics.cumulativeLayoutShift || 0,
      timeToInteractive: this.metrics.timeToInteractive || 0,
      totalResources: this.metrics.totalResources || 0,
      totalSize: this.metrics.totalSize || 0,
      compressedSize: this.metrics.compressedSize || 0,
      routeChangeTime: this.metrics.routeChangeTime || 0,
      componentLoadTime: this.metrics.componentLoadTime || 0,
    }
  }

  // 计算性能评分
  getPerformanceScore(): number {
    const metrics = this.getMetrics()

    // 首屏绘制时间评分 (0-30分)
    const fcpScore = Math.max(0, Math.min(30, 30 - metrics.firstContentfulPaint / 100))

    // 最大内容绘制评分 (0-20分)
    const lcpScore = Math.max(0, Math.min(20, 20 - metrics.largestContentfulPaint / 200))

    // 首次输入延迟评分 (0-20分)
    const fidScore = Math.max(0, Math.min(20, 20 - metrics.firstInputDelay / 10))

    // 累积布局偏移评分 (0-20分)
    const clsScore = Math.max(0, Math.min(20, 20 - metrics.cumulativeLayoutShift * 100))

    // 资源大小评分 (0-10分)
    const sizeScore = Math.max(0, Math.min(10, 10 - metrics.totalSize / 1024 / 100))

    return fcpScore + lcpScore + fidScore + clsScore + sizeScore
  }

  // 清理观察者
  destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// 性能优化建议
class PerformanceOptimizer {
  // 检测性能问题并提供建议
  analyze(
    metrics: PerformanceMetrics
  ): Array<{ type: string; message: string; priority: 'high' | 'medium' | 'low' }> {
    const suggestions: Array<{
      type: string
      message: string
      priority: 'high' | 'medium' | 'low'
    }> = []

    // 检查首屏绘制时间
    if (metrics.firstContentfulPaint > 2000) {
      suggestions.push({
        type: 'fcp',
        message: '首屏绘制时间过长，建议优化关键渲染路径',
        priority: 'high',
      })
    }

    // 检查最大内容绘制时间
    if (metrics.largestContentfulPaint > 2500) {
      suggestions.push({
        type: 'lcp',
        message: '最大内容绘制时间过长，建议优化图片和关键资源',
        priority: 'high',
      })
    }

    // 检查首次输入延迟
    if (metrics.firstInputDelay > 100) {
      suggestions.push({
        type: 'fid',
        message: '首次输入延迟过高，建议减少主线程阻塞',
        priority: 'medium',
      })
    }

    // 检查累积布局偏移
    if (metrics.cumulativeLayoutShift > 0.1) {
      suggestions.push({
        type: 'cls',
        message: '累积布局偏移过高，建议为动态内容预留空间',
        priority: 'medium',
      })
    }

    // 检查资源大小
    if (metrics.totalSize > 1024 * 1024 * 2) {
      // 2MB
      suggestions.push({
        type: 'size',
        message: '资源总大小过大，建议启用压缩和代码分割',
        priority: 'low',
      })
    }

    // 检查资源数量
    if (metrics.totalResources > 100) {
      suggestions.push({
        type: 'resources',
        message: '资源数量过多，建议合并和优化请求',
        priority: 'medium',
      })
    }

    return suggestions
  }

  // 自动应用优化
  applyOptimizations(): void {
    // 预加载关键资源
    this.preloadCriticalResources()

    // 优化图片加载
    this.optimizeImageLoading()

    // 优化字体加载
    this.optimizeFontLoading()

    // 启用资源提示
    this.enableResourceHints()
  }

  // 预加载关键资源
  private preloadCriticalResources(): void {
    const criticalResources = ['/fonts/main.woff2', '/images/logo.png', '/css/critical.css']

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'

      if (resource.endsWith('.woff2')) {
        link.as = 'font'
        link.type = 'font/woff2'
        link.crossOrigin = 'anonymous'
      } else if (resource.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
        link.as = 'image'
      } else if (resource.endsWith('.css')) {
        link.as = 'style'
      }

      link.href = resource
      document.head.appendChild(link)
    })
  }

  // 优化图片加载
  private optimizeImageLoading(): void {
    // 延迟加载非关键图片
    const images = document.querySelectorAll('img[data-src]')
    images.forEach(img => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLImageElement
            target.src = target.dataset.src!
            observer.unobserve(target)
          }
        })
      })

      observer.observe(img)
    })

    // 响应式图片
    const pictureElements = document.querySelectorAll('picture')
    pictureElements.forEach(picture => {
      const sources = picture.querySelectorAll('source')
      sources.forEach(source => {
        // 根据屏幕尺寸和设备像素比选择合适的图片
        const mediaQuery = window.matchMedia(source.media)
        if (mediaQuery.matches) {
          source.setAttribute('srcset', source.getAttribute('data-srcset') || '')
        }
      })
    })
  }

  // 优化字体加载
  private optimizeFontLoading(): void {
    // 使用font-display: swap优化字体加载
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'CustomFont';
        src: url('/fonts/custom.woff2') format('woff2');
        font-display: swap;
      }
    `
    document.head.appendChild(style)
  }

  // 启用资源提示
  private enableResourceHints(): void {
    // DNS预解析
    const dnsHints = ['//fonts.googleapis.com', '//cdn.jsdelivr.net', '//api.example.com']

    dnsHints.forEach(hint => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = hint
      document.head.appendChild(link)
    })

    // 预连接
    const preconnectHints = ['//fonts.gstatic.com', '//cdn.jsdelivr.net']

    preconnectHints.forEach(hint => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = hint
      document.head.appendChild(link)
    })
  }
}

// 性能报告生成器
class PerformanceReporter {
  // 生成性能报告
  static generateReport(metrics: PerformanceMetrics): string {
    const score = new PerformanceCollector().getPerformanceScore()
    const optimizer = new PerformanceOptimizer()
    const suggestions = optimizer.analyze(metrics)

    return `
# 性能报告

## 基础指标
- 首屏绘制时间 (FCP): ${metrics.firstContentfulPaint.toFixed(2)}ms
- 最大内容绘制时间 (LCP): ${metrics.largestContentfulPaint.toFixed(2)}ms
- 首次输入延迟 (FID): ${metrics.firstInputDelay.toFixed(2)}ms
- 累积布局偏移 (CLS): ${metrics.cumulativeLayoutShift.toFixed(4)}
- 交互时间 (TTI): ${metrics.timeToInteractive.toFixed(2)}ms

## 资源指标
- 总资源数: ${metrics.totalResources}
- 总资源大小: ${(metrics.totalSize / 1024).toFixed(2)}KB
- 压缩后大小: ${(metrics.compressedSize / 1024).toFixed(2)}KB
- 压缩率: ${((1 - metrics.compressedSize / metrics.totalSize) * 100).toFixed(2)}%

## 性能评分
- 总分: ${score.toFixed(2)}/100
- 等级: ${this.getPerformanceGrade(score)}

## 优化建议
${suggestions.map(s => `- [${s.priority.toUpperCase()}] ${s.message}`).join('\n')}

## 详细数据
\`\`\`
JSON.stringify(metrics, null, 2)
\`\`\`
    `
  }

  // 获取性能等级
  private static getPerformanceGrade(score: number): string {
    if (score >= 90) return 'A (优秀)'
    if (score >= 80) return 'B (良好)'
    if (score >= 70) return 'C (一般)'
    if (score >= 60) return 'D (较差)'
    return 'F (很差)'
  }

  // 下载性能报告
  static downloadReport(metrics: PerformanceMetrics): void {
    const report = this.generateReport(metrics)
    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `performance-report-${new Date().toISOString().split('T')[0]}.md`
    link.click()

    URL.revokeObjectURL(url)
  }
}

// 创建全局性能监控实例
const performanceCollector = new PerformanceCollector()
const performanceOptimizer = new PerformanceOptimizer()
const performanceReporter = PerformanceReporter

// 页面加载完成后应用优化
window.addEventListener('load', () => {
  setTimeout(() => {
    performanceOptimizer.applyOptimizations()
  }, 1000)
})

// 导出工具
export {
  performanceCollector,
  performanceOptimizer,
  performanceReporter,
  PerformanceCollector,
  PerformanceOptimizer,
  PerformanceReporter,
}

export default performanceCollector
