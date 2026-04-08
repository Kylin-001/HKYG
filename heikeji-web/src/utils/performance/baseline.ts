/**
 * Lighthouse 性能基线配置
 * 
 * 用于CI/CD性能回归检测和开发环境性能监控
 * 
 * 使用方式:
 * - CI: npx lighthouse http://localhost:4173 --config-path=lighthouse.config.js
 * - 开发: npm run perf:audit
 */

export interface PerformanceBaseline {
  /** 分类 */
  category: string
  /** 指标名称 */
  name: string
  /** 目标值 (分数或毫秒) */
  target: number
  /** 警告阈值 (低于此值发出警告) */
  warning: number
  /** 单位: 'score' (0-100) | 'ms' | 'bytes' | 'ratio' (0-1) */
  unit: 'score' | 'ms' | 'bytes' | 'ratio'
  /** 权重 (用于综合评分计算) */
  weight: number
  /** 是否必须通过 (false则只警告不阻断) */
  required: boolean
}

/**
 * 性能基线标准定义
 * 基于Google Core Web Vitals + 业务指标
 */
export const PERFORMANCE_BASELINES: PerformanceBaseline[] = [
  // ====== Core Web Vitals (核心Web指标) ======
  {
    category: 'Core Web Vitals',
    name: 'First Contentful Paint (FCP)',
    target: 1.8,
    warning: 2.5,
    unit: 'ms',
    weight: 15,
    required: true,
    description: '首次内容绘制时间',
  },
  {
    category: 'Core Web Vitals',
    name: 'Largest Contentful Paint (LCP)',
    target: 2.5,
    warning: 4.0,
    unit: 'ms',
    weight: 25,
    required: true,
    description: '最大内容绘制时间',
  },
  {
    category: 'Core Web Vitals',
    name: 'First Input Delay (FID)',
    target: 100,
    warning: 300,
    unit: 'ms',
    weight: 10,
    required: true,
    description: '首次输入延迟',
  },
  {
    category: 'Core Web Vitals',
    name: 'Cumulative Layout Shift (CLS)',
    target: 0.1,
    warning: 0.25,
    unit: 'ratio',
    weight: 20,
    required: true,
    description: '累积布局偏移',
  },
  {
    category: 'Core Web Vitals',
    name: 'Interaction to Next Paint (INP)',
    target: 200,
    warning: 500,
    unit: 'ms',
    weight: 10,
    required: false,
    description: '交互到下一次绘制的延迟',
  },

  // ====== Lighthouse 分类得分 ======
  {
    category: 'Lighthouse Scores',
    name: 'Performance',
    target: 90,
    warning: 80,
    unit: 'score',
    weight: 30,
    required: true,
    description: '整体性能得分',
  },
  {
    category: 'Lighthouse Scores',
    name: 'Accessibility',
    target: 95,
    warning: 85,
    unit: 'score',
    weight: 10,
    required: false,
    description: '无障碍访问性得分',
  },
  {
    category: 'Lighthouse Scores',
    name: 'Best Practices',
    target: 95,
    warning: 85,
    unit: 'score',
    weight: 5,
    required: false,
    description: '最佳实践得分',
  },
  {
    category: 'Lighthouse Scores',
    name: 'SEO',
    target: 90,
    warning: 80,
    unit: 'score',
    weight: 5,
    required: false,
    description: '搜索引擎优化得分',
  },

  // ====== 资源加载指标 ======
  {
    category: 'Resources',
    name: 'Total Bundle Size (gzipped)',
    target: 500,
    warning: 700,
    unit: 'bytes',
    weight: 10,
    required: true,
    description: '总资源大小 (KB, gzip后)',
  },
  {
    category: 'Resources',
    name: 'JavaScript Size',
    target: 200,
    warning: 300,
    unit: 'bytes',
    weight: 5,
    required: false,
    description: 'JS资源大小 (KB)',
  },
  {
    category: 'Resources',
    name: 'CSS Size',
    target: 50,
    warning: 75,
    unit: 'bytes',
    weight: 3,
    required: false,
    description: 'CSS资源大小 (KB)',
  },
  {
    category: 'Resources',
    name: 'Image Total Size',
    target: 1000,
    warning: 1500,
    unit: 'bytes',
    weight: 5,
    required: false,
    description: '图片总大小 (KB)',
  },

  // ====== 网络性能 ======
  {
    category: 'Network',
    name: 'Time to Interactive (TTI)',
    target: 3.8,
    warning: 7.3,
    unit: 'ms',
    weight: 10,
    required: true,
    description: '可交互时间',
  },
  {
    category: 'Network',
    name: 'Total Blocking Time (TBT)',
    target: 200,
    warning: 600,
    unit: 'ms',
    weight: 8,
    required: false,
    description: '总阻塞时间',
  },
  {
    category: 'Network',
    name: 'Speed Index (SI)',
    target: 3.4,
    warning: 5.8,
    unit: 'ms',
    weight: 10,
    required: true,
    description: '速度指数',
  },

  // ====== 缓存效率 ======
  {
    category: 'Caching',
    name: 'Cache Hit Rate',
    target: 90,
    warning: 70,
    unit: 'ratio',
    weight: 5,
    required: false,
    description: '缓存命中率 (%)',
  },
  {
    category: 'Caching',
    name: 'Service Worker Coverage',
    target: 95,
    warning: 80,
    unit: 'ratio',
    weight: 3,
    required: false,
    description: 'SW覆盖率 (%)',
  },
]

/**
 * Lighthouse 配置文件生成器
 */
export function generateLighthouseConfig(): object {
  return {
    extends: 'lighthouse:default',
    settings: {
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'mobile',  // 移动端测试 (更严格)
      screenEmulation: {
        mobile: true,
        width: 375,
        height: 667,
        deviceScaleFactor: 2,
        disabled: false,
      },
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4,
      },
      maxWaitForLoad: 45000,
    },
    passes: [
      {
        passName: 'defaultPass',
        gatherers: [],
      },
    ],
  }
}

/**
 * 性能审计结果接口
 */
export interface AuditResult {
  baseline: PerformanceBaseline
  actual: number
  passed: boolean
  score: number
  status: 'pass' | 'warning' | 'fail'
  message: string
}

/**
 * 审计单个指标
 */
export function auditMetric(
  baseline: PerformanceBaseline,
  actualValue: number
): AuditResult {
  let status: 'pass' | 'warning' | 'fail'
  let message: string

  if (baseline.unit === 'score') {
    if (actualValue >= baseline.target) {
      status = 'pass'
      message = `✅ ${baseline.name}: ${actualValue}分 (目标≥${baseline.target})`
    } else if (actualValue >= baseline.warning) {
      status = 'warning'
      message = `⚠️ ${baseline.name}: ${actualValue}分 (低于目标${baseline.target}, 接近警告线${baseline.warning})`
    } else {
      status = 'fail'
      message = `❌ ${baseline.name}: ${actualValue}分 (未达标! 目标${baseline.target}, 警告线${baseline.warning})`
    }
  } else {
    const isLowerBetter = ['ms', 'bytes'].includes(baseline.unit)
    
    if (isLowerBetter ? actualValue <= baseline.target : actualValue >= baseline.target) {
      status = 'pass'
      message = `✅ ${baseline.name}: ${formatValue(actualValue, baseline.unit)} (目标≤${formatValue(baseline.target, baseline.unit)})`
    } else if (isLowerBetter ? actualValue <= baseline.warning : actualValue >= baseline.warning) {
      status = 'warning'
      message = `⚠️ ${baseline.name}: ${formatValue(actualValue, baseline.unit)} (超出目标, 接近警告线)`
    } else {
      status = 'fail'
      message = `❌ ${baseline.name}: ${formatValue(actualValue, baseline.unit)} (严重超标!)`
    }
  }

  return {
    baseline,
    actual: actualValue,
    passed: status === 'pass' || (!baseline.required && status !== 'fail'),
    score: calculateScore(baseline, actualValue),
    status,
    message,
  }
}

/**
 * 格式化数值显示
 */
function formatValue(value: number, unit: string): string {
  switch (unit) {
    case 'ms':
      return value < 1000 ? `${value.toFixed(0)}ms` : `${(value / 1000).toFixed(1)}s`
    case 'bytes':
      return value < 1024 ? `${value.toFixed(0)}KB` : `${(value / 1024).toFixed(1)}MB`
    case 'ratio':
      return `${(value * 100).toFixed(1)}%`
    default:
      return String(value)
  }
}

/**
 * 计算单项得分 (0-100)
 */
function calculateScore(baseline: PerformanceBaseline, actual: number): number {
  if (baseline.unit === 'score') {
    return Math.min(100, Math.max(0, actual))
  }

  const isLowerBetter = ['ms', 'bytes'].includes(baseline.unit)
  
  if (isLowerBetter) {
    if (actual <= baseline.target) return 100
    if (actual >= baseline.warning) return 0
    
    const range = baseline.warning - baseline.target
    const offset = actual - baseline.target
    return Math.round(100 - (offset / range) * 100)
  } else {
    if (actual >= baseline.target) return 100
    if (actual <= baseline.warning) return 0
    
    const range = baseline.target - baseline.warning
    const offset = actual - baseline.warning
    return Math.round((offset / range) * 100)
  }
}

/**
 * 计算综合性能得分
 */
export function calculateOverallScore(results: AuditResult[]): {
  score: number
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
  summary: string
} {
  let weightedSum = 0
  let totalWeight = 0

  for (const result of results) {
    weightedSum += result.score * result.baseline.weight
    totalWeight += result.baseline.weight
  }

  const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
  
  if (overallScore >= 97) grade = 'A+'
  else if (overallScore >= 93) grade = 'A'
  else if (overallScore >= 83) grade = 'B'
  else if (overallScore >= 70) grade = 'C'
  else if (overallScore >= 55) grade = 'D'
  else grade = 'F'

  const summary = `综合性能评分: ${overallScore}/100 (${grade})`

  return { score: overallScore, grade, summary }
}

/**
 * 生成性能报告Markdown
 */
export function generatePerformanceReport(results: AuditResult[]): string {
  const overall = calculateOverallScore(results)

  let report = `# 📊 性能审计报告\n\n`
  report += `**审计时间**: ${new Date().toLocaleString('zh-CN')}\n\n`
  report += `## 🎯 综合评分\n\n`
  report += `### ${overall.summary}\n\n`

  report += `| 指标 | 实际值 | 目标值 | 状态 | 得分 |\n`
  report += `|------|--------|--------|------|------|\n`

  for (const result of results) {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'
    report += `| ${result.baseline.name} | ${formatValue(result.actual, result.baseline.unit)} | ${formatValue(result.baseline.target, result.baseline.unit)} | ${icon} ${result.status} | ${result.score}/100 |\n`
  }

  report += `\n## 📈 详细分析\n\n`

  for (const result of results) {
    if (result.status !== 'pass') {
      report += `### ⚠️ ${result.baseline.name}\n\n`
      report += `- **状态**: ${result.status}\n`
      report += `- **实际值**: ${formatValue(result.actual, result.baseline.unit)}\n`
      report += `- **目标值**: ${formatValue(result.baseline.target, result.baseline.unit)}\n`
      report += `- **建议**: \n\n`
    }
  }

  return report
}

export default {
  PERFORMANCE_BASELINES,
  generateLighthouseConfig,
  auditMetric,
  calculateOverallScore,
  generatePerformanceReport,
}
