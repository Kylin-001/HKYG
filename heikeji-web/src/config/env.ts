// ============================================
// 环境变量类型定义
// 确保所有环境变量都有正确的类型检查
// ============================================

interface EnvConfig {
  // 应用配置
  appTitle: string
  appDescription: string
  appVersion: string

  // API配置
  apiBaseUrl: string
  apiTimeout: number
  apiRetryCount: number

  // WebSocket配置
  wsUrl: string
  wsReconnectInterval: number
  wsHeartbeatInterval: number

  // 功能开关
  enableMock: boolean
  enablePWA: boolean
  enableAnalytics: boolean
  enableErrorReporting: boolean

  // 第三方服务
  sentryDsn: string
  gaTrackingId: string

  // 高德地图
  amapMapsApiKey: string
}

function getEnvValue(key: string, defaultValue: string): string {
  return import.meta.env?.[key] || process.env?.[key] || defaultValue
}

function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = getEnvValue(key, String(defaultValue))
  return value === 'true' || value === '1'
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = getEnvValue(key, String(defaultValue))
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

export const envConfig: EnvConfig = {
  // 应用配置
  appTitle: getEnvValue('VITE_APP_TITLE', '黑科易购'),
  appDescription: getEnvValue('VITE_APP_DESCRIPTION', '黑龙江科技大学校园服务平台'),
  appVersion: getEnvValue('VITE_APP_VERSION', '1.0.0'),

  // API配置
  apiBaseUrl: getEnvValue('VITE_API_BASE_URL', '/api'),
  apiTimeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
  apiRetryCount: getEnvNumber('VITE_API_RETRY_COUNT', 3),

  // WebSocket配置
  wsUrl: getEnvValue('VITE_WS_URL', 'ws://localhost:3000/ws'),
  wsReconnectInterval: getEnvNumber('VITE_WS_RECONNECT_INTERVAL', 5000),
  wsHeartbeatInterval: getEnvNumber('VITE_WS_HEARTBEAT_INTERVAL', 30000),

  // 功能开关
  enableMock: getEnvBoolean('VITE_ENABLE_MOCK', true),
  enablePWA: getEnvBoolean('VITE_ENABLE_PWA', true),
  enableAnalytics: getEnvBoolean('VITE_ENABLE_ANALYTICS', true),
  enableErrorReporting: getEnvBoolean('VITE_ENABLE_ERROR_REPORTING', true),

  // 第三方服务
  sentryDsn: getEnvValue('VITE_SENTRY_DSN', ''),
  gaTrackingId: getEnvValue('VITE_GA_TRACKING_ID', ''),

  // 高德地图
  amapMapsApiKey: getEnvValue('VITE_AMAP_MAPS_API_KEY', ''),
}

export default envConfig
