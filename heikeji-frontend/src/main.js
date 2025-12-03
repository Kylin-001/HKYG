/**
 * Vue应用入口文件
 * 负责初始化和启动Vue应用
 * 通过模块化重构，将复杂的初始化逻辑分离到专门的模块中
 */

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// 样式导入
import 'normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css'
import './styles/index.scss'

// 工具库导入
import axios from 'axios'

// 核心模块导入
import initializeApp from './core/app-init'
import { getCurrentConfig } from './config/environment'

// 导入日志工具
import logger from './utils/logger'

// 获取环境配置
const envConfig = getCurrentConfig()
logger.info('🚀 黑科易购前端项目启动中...')
logger.info(`🔧 环境: ${envConfig.NODE_ENV}`)

// Axios配置
if (envConfig.API_BASE_URL) {
  axios.defaults.baseURL = envConfig.API_BASE_URL
}

// 设置Axios拦截器
axios.interceptors.request.use(
  config => {
    // 添加请求拦截逻辑
    if (envConfig.DEBUG) {
      logger.debug('📡 API请求:', (config.method || '').toUpperCase(), config.url)
    }
    return config
  },
  error => {
    logger.error('📡 API请求错误:', error)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    // 添加响应拦截逻辑
    if (envConfig.DEBUG) {
      logger.debug('📡 API响应:', response.status, response.config.url)
    }
    return response
  },
  error => {
    logger.error('📡 API响应错误:', error)
    return Promise.reject(error)
  }
)

// 应用配置
const appConfig = {
  Vue,
  router,
  store,
  App,
}

// 初始化应用
initializeApp(appConfig)
  .then(result => {
    if (result.success) {
      logger.info('✅ 黑科易购前端项目启动成功!')
      logger.info('🌟 项目地址:', window.location.origin)
      logger.info('📦 Vue版本:', Vue.version)
      logger.info('🔧 调试模式:', envConfig.DEBUG ? '开启' : '关闭')
    } else {
      logger.error('❌ 应用启动失败:', result.message)
    }
  })
  .catch(error => {
    logger.error('❌ 应用初始化失败:', error.message || error)
  })
