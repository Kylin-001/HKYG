/**
 * 应用初始化模块
 * 负责整个应用的初始化配置和启动
 */

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入核心模块
import { getPerformanceMonitor, performanceMixin } from './performance'
import registerAllElementUI from './element-ui'
import registerAllCharts from './charts'

// 导入配置文件
import { getCurrentConfig } from '../config/environment'

// 导入日志工具
import logger from '../utils/logger'

/**
 * 全局错误处理函数
 * @param {Error} err - 错误对象
 * @param {Vue} vm - Vue实例
 * @param {string} info - 错误信息（组件生命周期钩子名称等）
 */
function setupGlobalErrorHandlers(Vue) {
  Vue.config.errorHandler = (err, vm, info) => {
    logger.error('Vue全局错误:', err)
    logger.error('错误信息:', info)
    // 可以在这里上报错误到监控系统
  }

  Vue.config.warnHandler = (msg, vm, trace) => {
    if (process.env.NODE_ENV !== 'production') {
      logger.warn('Vue警告:', msg)
      logger.warn('警告追踪:', trace)
    }
  }
}

/**
 * 配置NProgress进度条
 */
function setupNProgress() {
  NProgress.configure({ showSpinner: false })
}

/**
 * 配置路由拦截器
 * @param {VueRouter} router - Vue Router实例
 */
function setupRouterInterceptors(router) {
  // 路由拦截器 - 性能优化：添加路由加载指示器
  router.beforeEach((to, from, next) => {
    // 开始进度条
    NProgress.start()

    // 性能优化：减少不必要的重定向
    if (to.path === from.path && !to.query.refresh) {
      return next()
    }

    // 继续路由导航
    next()
  })

  router.afterEach(() => {
    // 结束进度条
    NProgress.done()
  })
}

/**
 * 预加载关键资源
 */
function preloadCriticalResources() {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'style'
  link.href = 'element-ui/lib/theme-chalk/index.css'
  document.head.appendChild(link)
}

/**
 * 检查DOM元素是否存在
 * @param {string} elementId - 元素ID
 * @returns {HTMLElement|null} DOM元素或null
 */
function checkDOMElement(elementId) {
  const element = document.getElementById(elementId)
  if (!element) {
    logger.error(`❌ 错误: 找不到#${elementId}元素！DOM可能尚未完全加载`)
    logger.info('📄 当前文档状态:', document.readyState)
    return null
  }
  return element
}

/**
 * 创建并挂载Vue实例
 * @param {Object} options - Vue实例配置选项
 * @returns {Vue} Vue实例
 */
function createVueApp(options) {
  const { router, store, AppComponent, rootElementId = 'app' } = options

  // 检查DOM元素
  const appElement = checkDOMElement(rootElementId)
  if (!appElement) {
    throw new Error(`无法找到#${rootElementId}元素，应用启动失败`)
  }

  logger.info('✅ 成功找到#app元素，开始创建Vue实例')

  // 创建并挂载Vue实例
  const app = new Vue({
    el: `#${rootElementId}`,
    router,
    store,
    // 性能优化：使用渲染函数代替模板
    render: h => h(AppComponent),
  })

  return app
}

/**
 * 安全创建应用（带重试机制）
 * @param {Object} options - 应用配置选项
 * @param {number} maxRetries - 最大重试次数
 */
function createAppSafely(options, maxRetries = 5) {
  const {
    router,
    store,
    AppComponent,
    rootElementId = 'app',
    maxRetries: customMaxRetries,
  } = options

  let retries = 0
  const maxAttempts = customMaxRetries || maxRetries

  function attemptCreate() {
    try {
      // 检查DOM元素
      const appElement = checkDOMElement(rootElementId)
      if (appElement) {
        logger.info('✅ 成功找到DOM元素，开始创建Vue应用')

        // 创建Vue实例
        const app = createVueApp({
          router,
          store,
          AppComponent,
          rootElementId,
        })

        // 初始化性能监控系统
        const performanceMonitor = getPerformanceMonitor()
        performanceMonitor.init(router)

        logger.info('✅ Vue应用已成功创建和挂载')
        return app
      }
    } catch (error) {
      logger.error('创建Vue应用时出错:', error)
    }

    // 如果重试次数未达到上限，继续重试
    if (retries < maxAttempts) {
      retries++
      logger.info(`⏳ 重试创建应用 (${retries}/${maxAttempts})...`)
      setTimeout(attemptCreate, 100 * retries) // 递增延迟
    } else {
      logger.error('❌ 无法创建Vue应用，已达到最大重试次数')
      throw new Error('应用启动失败：DOM元素不可用')
    }
  }

  return attemptCreate()
}

/**
 * 应用初始化主函数
 * @param {Object} config - 应用配置
 * @returns {Object} 初始化结果
 */
export function initializeApp(config) {
  const { Vue, router, store, App } = config

  // 获取当前环境配置
  const envConfig = getCurrentConfig()
  logger.info('🔧 当前环境配置:', envConfig)

  // 设置全局错误处理
  setupGlobalErrorHandlers(Vue)

  // 配置NProgress
  setupNProgress()

  // 注册ElementUI组件
  registerAllElementUI(Vue)

  // 注册VCharts组件
  registerAllCharts(Vue)

  // 禁用生产提示
  Vue.config.productionTip = false

  // 应用性能监控混入
  Vue.mixin(performanceMixin)

  // 在生产环境中禁用console
  if (process.env.NODE_ENV === 'production') {
    // 禁用生产环境中的console输出，但保留必要的方法
    console.log = () => {}
    console.warn = () => {}
    console.error = () => {}
  }

  // 配置路由拦截器
  setupRouterInterceptors(router)

  // 预加载关键资源
  preloadCriticalResources()

  // 在DOMContentLoaded事件中创建Vue应用
  return new Promise((resolve, reject) => {
    const initApp = () => {
      try {
        const app = createAppSafely({
          router,
          store,
          AppComponent: App,
        })

        resolve({
          success: true,
          app,
          message: '应用初始化成功',
        })
      } catch (error) {
        reject({
          success: false,
          error,
          message: '应用初始化失败',
        })
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initApp)
    } else {
      initApp()
    }

    // 额外的安全措施：如果DOMContentLoaded事件延迟，在脚本执行1秒后检查一次
    setTimeout(() => {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        const appInstance = document.querySelector('#app > .el-container')
        if (!appInstance) {
          logger.warn('⚠️ 安全检查: 1秒后未检测到Vue实例，尝试手动创建')
          try {
            const app = createAppSafely({
              router,
              store,
              AppComponent: App,
            })
            resolve({
              success: true,
              app,
              message: '应用初始化成功（延迟启动）',
            })
          } catch (error) {
            reject({
              success: false,
              error,
              message: '应用初始化失败（延迟启动）',
            })
          }
        }
      }
    }, 1000)
  })
}

// 导出默认初始化函数
export default initializeApp
