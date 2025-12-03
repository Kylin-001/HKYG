import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { constantRoutes, asyncRoutes } from '@/router'
import { useUserStore } from './user'

// 定义路由类型
type RouteName = string

// 定义permission store的状态类型
interface PermissionState {
  routes: any[]
  addRoutes: any[]
  accessedRoutes: any[]
  currentRoute: string
  loading: boolean
}

// 检查权限匹配函数
function hasPermission(roles: string[], route: any): boolean {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  }
  return true
}

// 根据角色过滤路由
function filterAsyncRoutes(routes: any[], roles: string[]): any[] {
  const res: any[] = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

// 创建并导出permission store
export const usePermissionStore = defineStore('permission', () => {
  // 状态定义
  const routes = ref<any[]>([])
  const addRoutes = ref<any[]>([])
  const accessedRoutes = ref<any[]>([])
  const currentRoute = ref('')
  const loading = ref(false)

  // 计算属性
  const allRoutes = computed(() => routes.value)
  const dynamicRoutes = computed(() => addRoutes.value)
  const hasAccessRoutes = computed(() => accessedRoutes.value.length > 0)

  // 方法 - 生成路由
  async function generateRoutes() {
    try {
      loading.value = true
      const userStore = useUserStore()
      const { roles } = userStore

      let accessedRts: any[] = []

      // 根据角色过滤异步路由
      if (roles.includes('admin')) {
        // 管理员可以访问所有路由
        accessedRts = asyncRoutes
      } else {
        // 普通用户根据权限过滤路由
        accessedRts = filterAsyncRoutes(asyncRoutes, roles)
      }

      // 添加404路由
      accessedRts.push({ path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true } })

      addRoutes.value = accessedRts
      routes.value = [...constantRoutes, ...accessedRts]
      accessedRoutes.value = [...accessedRts]

      return accessedRts
    } catch (error) {
      console.error('生成路由失败:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  // 方法 - 设置当前路由
  function setCurrentRoute(routeName: string) {
    currentRoute.value = routeName
  }

  // 方法 - 检查路由权限
  function checkRoutePermission(routeName: RouteName): boolean {
    if (!addRoutes.value || addRoutes.value.length === 0) {
      return false
    }

    // 递归检查路由名称是否在有权限的路由中
    function checkPermissionRecursive(routesList: any[]): boolean {
      for (const route of routesList) {
        if (route.name === routeName) {
          return true
        }
        if (route.children && route.children.length > 0) {
          const hasPermission = checkPermissionRecursive(route.children)
          if (hasPermission) {
            return true
          }
        }
      }
      return false
    }

    return checkPermissionRecursive(addRoutes.value)
  }

  // 方法 - 重置权限状态
  function resetState() {
    routes.value = []
    addRoutes.value = []
    accessedRoutes.value = []
    currentRoute.value = ''
  }

  // 方法 - 获取面包屑路径
  function getBreadcrumbPath(routeName: RouteName): any[] {
    const breadcrumbs: any[] = []

    function findRouteRecursive(routesList: any[], targetName: RouteName): boolean {
      for (const route of routesList) {
        if (route.name === targetName) {
          breadcrumbs.unshift({
            name: route.name,
            path: route.path,
            meta: route.meta,
          })
          return true
        }
        if (route.children && route.children.length > 0) {
          const found = findRouteRecursive(route.children, targetName)
          if (found) {
            // 如果找到了子路由，将当前路由添加到面包屑中
            if (route.meta && !route.meta.hidden) {
              breadcrumbs.unshift({
                name: route.name,
                path: route.path,
                meta: route.meta,
              })
            }
            return true
          }
        }
      }
      return false
    }

    findRouteRecursive(routes.value, routeName)
    return breadcrumbs
  }

  // 导出状态、计算属性和方法
  return {
    // 状态
    routes,
    addRoutes,
    accessedRoutes,
    currentRoute,
    loading,
    // 计算属性
    allRoutes,
    dynamicRoutes,
    hasAccessRoutes,
    // 方法
    generateRoutes,
    setCurrentRoute,
    checkRoutePermission,
    resetState,
    getBreadcrumbPath,
  }
})
