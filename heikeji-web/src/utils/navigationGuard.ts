import { router } from '@/router'
import { useUserStore } from '@/stores/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ElMessage } from 'element-plus'
import type { RouteLocationNormalized } from 'vue-router'

interface NavigationGuardOptions {
  enablePermissionCheck?: boolean
  enableLogging?: boolean
  whitelist?: string[]
}

class NavigationGuard {
  private options: Required<NavigationGuardOptions>
  private navigationHistory: Array<{
    from: string
    to: string
    timestamp: number
  }> = []

  constructor(options?: NavigationGuardOptions) {
    this.options = {
      enablePermissionCheck: options?.enablePermissionCheck ?? true,
      enableLogging: options?.enableLogging ?? import.meta.env.DEV,
      whitelist: options?.whitelist ?? ['/auth/login', '/auth/forgot-password', '/', '/products', '/search']
    }
    this.init()
  }

  private init(): void {
    router.beforeEach(this.handleBeforeEach.bind(this))
    router.afterEach(this.handleAfterEach.bind(this))
  }

  private async handleBeforeEach(to: RouteLocationNormalized, _from: RouteLocationNormalized): Promise<boolean | undefined | Record<string, any> | void> {
    if (this.options.enableLogging) {
      console.log(`[Router] ${_from.path} → ${to.path}`)
    }

    NProgress.start()

    this.setPageTitle(to)

    const userStore = useUserStore()
    const isAuthenticated = this.checkAuth(userStore)

    const authResult = await this.checkAuthentication(to, userStore, isAuthenticated)
    if (authResult !== true) return authResult

    const permissionResult = this.checkPermissions(to, userStore)
    if (permissionResult !== true) return permissionResult

    return true
  }

  private handleAfterEach(to: RouteLocationNormalized, from: RouteLocationNormalized): void {
    NProgress.done()

    this.recordNavigation(from, to)
  }

  private setPageTitle(to: RouteLocationNormalized): void {
    const title = to.meta.title as string | undefined
    if (title) {
      document.title = `${title} - 黑科易购`
    }
  }

  private checkAuth(userStore: useUserStore): boolean {
    return !!userStore.token && userStore.isAuthenticated
  }

  private async checkAuthentication(
    to: RouteLocationNormalized,
    userStore: ReturnType<typeof useUserStore>,
    isAuthenticated: boolean
  ): Promise<boolean | Record<string, any>> {
    const requiresAuth = to.meta.requiresAuth as boolean | undefined

    if (requiresAuth && !isAuthenticated) {
      if (userStore.token) {
        try {
          await userStore.fetchUserInfo()
          return true
        } catch {
          ElMessage.warning('登录已过期，请重新登录')
          return { name: 'Login', query: { redirect: to.fullPath } }
        }
      } else {
        ElMessage.info('请先登录')
        return { name: 'Login', query: { redirect: to.fullPath } }
      }
    }

    if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
      ElMessage.success('您已登录')
      return { path: '/' }
    }

    return true
  }

  private checkPermissions(
    to: RouteLocationNormalized,
    userStore: ReturnType<typeof useUserStore>
  ): boolean | void {
    if (!this.options.enablePermissionCheck) return true

    const requiredPermission = to.meta.permission as string | undefined

    if (requiredPermission) {
      const hasPermission = userStore.hasPermission?.(requiredPermission)

      if (hasPermission === false) {
        ElMessage.error('您没有访问此页面的权限')

        if (this.options.enableLogging) {
          console.warn(`[Router] Permission denied: ${requiredPermission}`)
        }

        return { path: '/403' } || { name: 'Home' }
      }
    }

    const requiredRole = to.meta.role as string | undefined

    if (requiredRole) {
      const userRole = userStore.user?.role || 'guest'

      const roleHierarchy: Record<string, number> = {
        admin: 100,
        moderator: 50,
        user: 10,
        guest: 0
      }

      if ((roleHierarchy[userRole] || 0) < (roleHierarchy[requiredRole] || 0)) {
        ElMessage.error('您的角色无权访问此页面')
        return { name: 'Home' }
      }
    }

    return true
  }

  private recordNavigation(from: RouteLocationNormalized, to: RouteLocationNormalized): void {
    this.navigationHistory.push({
      from: from.path,
      to: to.path,
      timestamp: Date.now()
    })

    if (this.navigationHistory.length > 50) {
      this.navigationHistory.shift()
    }
  }

  getNavigationHistory(): typeof this.navigationHistory {
    return [...this.navigationHistory]
  }

  getPreviousRoute(): string | null {
    if (this.navigationHistory.length < 2) return null
    return this.navigationHistory[this.navigationHistory.length - 2]?.to || null
  }
}

export const navigationGuard = new NavigationGuard()
export type { NavigationGuardOptions }
