/**
 * API模块统一管理
 * 负责导入和管理所有API模块
 */

import logger from '../utils/logger'

// 基础API模块
import loginApi from './login'
import userApi from './user'
import systemApi from './system'
import menuApi from './menu'
import uploadApi from './upload'

// 业务API模块
import productApi from './product'
import orderApi from './order'
import campusApi from './campus'
import marketingApi from './marketing'
import dashboardApi from './dashboard'
import courierApi from './courier'

// API模块集合
const apiModules = {
  // 基础功能
  login: loginApi,
  user: userApi,
  system: systemApi,
  menu: menuApi,
  upload: uploadApi,

  // 业务功能
  product: productApi,
  order: orderApi,
  campus: campusApi,
  marketing: marketingApi,
  dashboard: dashboardApi,
  courier: courierApi,
}

/**
 * 获取指定模块的API
 * @param {string} moduleName - 模块名称
 * @returns {Object} API对象
 */
export function getApiModule(moduleName) {
  if (!apiModules[moduleName]) {
    logger.warn(`API模块 "${moduleName}" 不存在`)
    return {}
  }
  return apiModules[moduleName]
}

/**
 * 获取所有API模块
 * @returns {Object} 所有API模块对象
 */
export function getAllApiModules() {
  return { ...apiModules }
}

/**
 * 检查API模块是否存在
 * @param {string} moduleName - 模块名称
 * @returns {boolean} 是否存在
 */
export function hasApiModule(moduleName) {
  return moduleName in apiModules
}

// 默认导出所有API模块
export default apiModules
