/**
 * 路由模块集合配置
 * 统一管理所有业务路由模块
 */

// 导入各个业务路由模块
import { productRoutes } from './product'
import { orderRoutes } from './order'
import { userRoutes } from './user'
import { systemRoutes } from './system'
import { demoRoutes } from './demo'

// 路由模块集合
const routeModules = {
  productRoutes,
  orderRoutes,
  userRoutes,
  systemRoutes,
  demoRoutes,
}

// 根据环境配置过滤路由模块
export function getRouteModules(environment = 'development') {
  if (environment === 'production') {
    // 生产环境：移除演示页面路由
    return routeModules
  }

  return routeModules
}

// 合并所有动态路由
export function mergeAsyncRoutes(modules = routeModules) {
  const allRoutes = []

  Object.values(modules).forEach(routes => {
    if (Array.isArray(routes)) {
      allRoutes.push(...routes)
    } else {
      allRoutes.push(routes)
    }
  })

  return allRoutes
}

// 获取所有路由模块名称
export function getModuleNames() {
  return Object.keys(routeModules)
}

// 检查路由模块是否存在
export function hasModule(moduleName) {
  return routeModules.hasOwnProperty(moduleName)
}

// 获取指定模块
export function getModule(moduleName) {
  return routeModules[moduleName]
}

export { productRoutes, orderRoutes, userRoutes, systemRoutes, demoRoutes }
