/**
 * 重构后的路由主配置文件
 * 职责：路由配置、懒加载优化、路由拦截器设置
 */

import Vue from 'vue'
import Router from 'vue-router'
import { constantRoutes } from './config/constant-routes'
import { getRouteModules } from './config/modules'

// 导入日志工具
import logger from '@/utils/logger'

Vue.use(Router)

/**
 * 路由懒加载优化
 */
const LazyLoader = {
  // 预加载常用组件
  preloadComponents() {
    const commonComponents = ['@/views/dashboard/index', '@/views/login/index']

    commonComponents.forEach(path => {
      import(path)
    })
  },

  // 路由懒加载包装
  lazyLoad(componentPath) {
    return () => import(componentPath)
  },

  // 预加载下一个路由组件
  preloadNextRoute(to) {
    const nextRoute = to.matched[0]?.children?.[0]
    if (nextRoute && nextRoute.component) {
      import(nextRoute.component())
    }
  },
}

/**
 * 路由拦截器配置
 */
const RouterInterceptor = {
  // 路由守卫
  async beforeEach(to, from, next) {
    // 显示加载进度条
    if (typeof window !== 'undefined' && window.NProgress) {
      window.NProgress.start()
    }

    // 这里可以添加权限验证逻辑
    // const token = await getToken()
    // if (!token && to.path !== '/login') {
    //   next('/login')
    //   return
    // }

    next()
  },

  // 路由后置守卫
  afterEach(to, from) {
    // 隐藏加载进度条
    if (typeof window !== 'undefined' && window.NProgress) {
      window.NProgress.done()
    }

    // 预加载下一个路由组件
    LazyLoader.preloadNextRoute(to)
  },
}

/**
 * 创建路由实例
 */
function createRouter() {
  const router = new Router({
    // 使用history模式
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: [],
  })

  // 添加路由拦截器
  router.beforeEach(RouterInterceptor.beforeEach)
  router.afterEach(RouterInterceptor.afterEach)

  return router
}

/**
 * 动态加载路由
 */
async function loadRoutes() {
  try {
    // 获取环境配置
    const environment = process.env.NODE_ENV || 'development'

    // 获取路由模块
    const routeModules = getRouteModules(environment)

    // 合并动态路由
    const asyncRoutes = []
    Object.values(routeModules).forEach(moduleRoutes => {
      asyncRoutes.push(...moduleRoutes)
    })

    // 添加仪表盘和404路由
    asyncRoutes.unshift({
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '首页',
        icon: 'el-icon-s-home',
        affix: true,
      },
    })

    asyncRoutes.push({
      path: '*',
      redirect: '/404',
      hidden: true,
    })

    return {
      constantRoutes,
      asyncRoutes,
    }
  } catch (error) {
    logger.error('加载路由失败:', error)
    // 返回基础路由
    return {
      constantRoutes,
      asyncRoutes: [],
    }
  }
}

// 初始化路由
const router = createRouter()

/**
 * 初始化路由配置
 */
export async function initRouter() {
  try {
    const { constantRoutes: constants, asyncRoutes } = await loadRoutes()

    // 添加静态路由
    constants.forEach(route => {
      router.addRoute(route)
    })

    // 添加动态路由
    asyncRoutes.forEach(route => {
      router.addRoute(route)
    })

    logger.info('🚀 路由配置初始化完成')
    return router
  } catch (error) {
    logger.error('路由配置初始化失败:', error)
    return router
  }
}

/**
 * 重置路由函数
 */
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由匹配器
}

/**
 * 预加载关键组件
 */
LazyLoader.preloadComponents()

export default router
export { LazyLoader, RouterInterceptor }
