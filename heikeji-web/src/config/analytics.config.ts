/**
 * 分析配置中心
 * 定义用户行为追踪系统的所有配置项
 */

export interface AnalyticsSamplingConfig {
  rate: number // 总采样率(0-1)，1.0=100%
  sessionSampleRate: number // 会话采样率
  errorSampleRate: number // 错误事件采样率
  performanceSampleRate: number // 性能事件采样率
}

export interface AnalyticsBatchConfig {
  enabled: boolean // 是否启用批量上报
  maxSize: number // 最大批量大小
  flushInterval: number // 刷新间隔(ms)
  sendOnPageHide: boolean // 页面隐藏时发送
  sendOnUnload: boolean // 页面卸载时发送
}

export interface AnalyticsAutoTrackConfig {
  pageView: boolean // 自动PV追踪
  click: boolean // 自动点击追踪
  scroll: boolean // 自动滚动深度追踪
  formInteraction: boolean // 表单交互追踪
  error: boolean // 错误自动上报
  performance: boolean // 性能自动上报
  routeChange: boolean // 路由变化追踪
  apiCall: boolean // API调用追踪
}

export interface AnalyticsPrivacyConfig {
  respectDNT: boolean // 尊重Do Not Track设置
  anonymizeIP: boolean // IP匿名化
  hashUserId: boolean // 用户ID哈希处理
  maskSensitiveData: boolean // 脱敏敏感数据
  cookieConsentRequired: boolean // 是否需要Cookie同意
}

export interface AnalyticsEcommerceConfig {
  enabled: boolean
  currency: string // 默认货币
  trackCheckoutSteps: boolean // 追踪结账步骤
  trackProductViews: boolean // 追踪商品浏览
  trackCartActions: boolean // 追踪购物车操作
}

export interface AnalyticsConfig {
  enabled: boolean // 全局开关
  endpoint: string // 数据上报接口
  debug: boolean // 调试模式（开发环境详细日志）
  sampling: AnalyticsSamplingConfig // 采样率配置
  batch: AnalyticsBatchConfig // 批量上报配置
  autoTrack: AnalyticsAutoTrackConfig // 自动追踪配置
  privacy: AnalyticsPrivacyConfig // 隐私合规配置
  ecommerce: AnalyticsEcommerceConfig // 电商专用配置
  sessionTimeout: number // 会话超时时间(ms)
  maxEventQueueSize: number // 最大事件队列大小
  retryAttempts: number // 上报失败重试次数
  retryDelay: number // 重试延迟(ms)
}

/** 默认分析配置 */
export const analyticsConfig: AnalyticsConfig = {
  enabled: import.meta.env.VITE_ANALYTICS_ENABLED !== 'false',

  endpoint: '/api/analytics/collect',

  debug: import.meta.env.DEV,

  sampling: {
    rate: import.meta.env.DEV ? 1.0 : (parseFloat(import.meta.env.VITE_ANALYTICS_SAMPLE_RATE) || 1.0),
    sessionSampleRate: 1.0,
    errorSampleRate: 1.0,
    performanceSampleRate: import.meta.env.DEV ? 1.0 : 0.2
  },

  batch: {
    enabled: true,
    maxSize: 20,
    flushInterval: 30000, // 30秒
    sendOnPageHide: true,
    sendOnUnload: true
  },

  autoTrack: {
    pageView: true,
    click: false, // 默认关闭，通过v-track指令开启
    scroll: true,
    formInteraction: true,
    error: true,
    performance: true,
    routeChange: true,
    apiCall: true
  },

  privacy: {
    respectDNT: true,
    anonymizeIP: true,
    hashUserId: true,
    maskSensitiveData: true,
    cookieConsentRequired: !import.meta.env.DEV
  },

  ecommerce: {
    enabled: true,
    currency: 'CNY',
    trackCheckoutSteps: true,
    trackProductViews: true,
    trackCartActions: true
  },

  sessionTimeout: 30 * 60 * 1000, // 30分钟

  maxEventQueueSize: 200,

  retryAttempts: 3,

  retryDelay: 1000
}
