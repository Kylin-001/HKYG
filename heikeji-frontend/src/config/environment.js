/**
 * 环境配置文件
 * 负责管理不同环境的配置参数
 */

export const config = {
  // 开发环境配置
  development: {
    NODE_ENV: 'development',
    API_BASE_URL: 'http://localhost:8080/api',
    DEBUG: true,
    PERFORMANCE_MONITORING: true,
    LOG_LEVEL: 'debug',
  },

  // 生产环境配置
  production: {
    NODE_ENV: 'production',
    API_BASE_URL: 'https://api.heikeji.com',
    DEBUG: false,
    PERFORMANCE_MONITORING: false,
    LOG_LEVEL: 'error',
  },

  // 测试环境配置
  test: {
    NODE_ENV: 'test',
    API_BASE_URL: 'http://test-api.heikeji.com/api',
    DEBUG: true,
    PERFORMANCE_MONITORING: true,
    LOG_LEVEL: 'warn',
  },
}

// 获取当前环境配置
export function getCurrentConfig() {
  const env = process.env.NODE_ENV || 'development'
  return config[env] || config.development
}

// 导出当前配置
export default getCurrentConfig()
