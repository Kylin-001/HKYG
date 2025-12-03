import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import NProgress from 'nprogress'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { ElMessage } from 'element-plus'

/**
 * 路由前置守卫
 * @param router Vue Router实例
 */
export function setupRouterGuards(router: Router) {
  // 全局前置守卫
  router.beforeEach(
    async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      // 开始进度条
      NProgress.start()

      const userStore = useUserStore()
      const permissionStore = usePermissionStore()

      // 设置当前路由
      permissionStore.setCurrentRoute(to.name as string)

      // 判断是否登录（有token）
      const hasToken = userStore.token

      if (hasToken) {
        // 已登录状态
        if (to.path === '/login') {
          // 如果已登录还访问登录页，则重定向到首页
          next({ path: '/' })
          NProgress.done()
        } else {
          // 已登录且不是访问登录页
          const hasRoles = userStore.roles && userStore.roles.length > 0

          if (hasRoles) {
            // 已获取用户角色，直接放行
            next()
          } else {
            try {
              // 获取用户信息
              await userStore.getUserInfoAction()

              // 生成路由
              const accessRoutes = await permissionStore.generateRoutes()

              // 动态添加路由
              accessRoutes.forEach(route => {
                router.addRoute(route)
              })

              // 重新导航到目标路由
              next({ ...to, replace: true })
            } catch (error) {
              // 处理错误：清除token，重定向到登录页
              await userStore.logoutAction()
              ElMessage.error('获取用户信息失败，请重新登录')
              next({ path: '/login', query: { redirect: to.path } })
              NProgress.done()
            }
          }
        }
      } else {
        // 未登录状态
        // 检查是否为白名单路由
        const whiteList = [
          '/login',
          '/404',
          '/app/product/list',
          '/app/product/detail/:id',
          '/app/product/category',
          '/app/product/search',
        ]

        if (
          whiteList.includes(to.path) ||
          to.matched.some(record => whiteList.includes(record.path))
        ) {
          // 在白名单内，直接放行
          next()
        } else {
          // 不在白名单内，重定向到登录页
          next({ path: '/login', query: { redirect: to.path } })
          NProgress.done()
        }
      }
    }
  )

  // 全局后置守卫
  router.afterEach((to: RouteLocationNormalized) => {
    // 设置页面标题
    if (to.meta && to.meta.title) {
      document.title = `${to.meta.title} - 黑科易购管理系统`
    } else {
      document.title = '黑科易购管理系统'
    }

    // 结束进度条
    NProgress.done()
  })

  // 全局错误处理
  router.onError((error: Error) => {
    console.error('路由错误:', error)
    NProgress.done()
    ElMessage.error(`路由加载失败: ${error.message}`)
  })
}

/**
 * 重置路由
 * @param router Vue Router实例
 */
export function resetRouter(router: Router) {
  const permissionStore = usePermissionStore()
  // 移除所有动态添加的路由
  permissionStore.addRoutes.forEach(route => {
    const { name } = route
    if (name) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })

  // 重置权限状态
  permissionStore.resetState()
}
