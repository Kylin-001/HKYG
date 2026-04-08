import type { App, Directive, DirectiveBinding } from 'vue'

// 权限指令绑定值类型
interface PermissionValue {
  value: string | string[]
  modifiers?: {
    role?: boolean
    permission?: boolean
  }
}

// 权限状态
const state = {
  permissions: [] as string[],
  roles: [] as string[],
}

// 设置权限列表
export function setPermissions(permissions: string[]) {
  state.permissions = permissions
}

// 设置角色列表
export function setRoles(roles: string[]) {
  state.roles = roles
}

// 检查是否有指定权限
export function hasPermission(permission: string): boolean {
  if (state.permissions.includes('*')) return true
  return state.permissions.includes(permission)
}

// 检查是否有指定角色
export function hasRole(role: string): boolean {
  if (state.roles.includes('*')) return true
  return state.roles.includes(role)
}

// 检查是否有任一权限
export function hasAnyPermission(permissions: string[]): boolean {
  if (state.permissions.includes('*')) return true
  return permissions.some((p) => state.permissions.includes(p))
}

// 扩展 HTMLElement 以支持自定义属性
declare global {
  interface HTMLElement {
    _permissionCheck?: () => void
  }
}

// 权限指令定义
const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const value = binding.value as string | string[]

    if (!value) {
      console.warn('[v-permission] No permission value provided')
      return
    }

    const perms = Array.isArray(value) ? value : [value]

    const checkPermission = () => {
      const hasAccess = hasAnyPermission(perms)

      if (!hasAccess) {
        el.style.display = 'none'
        el.setAttribute('data-permission-denied', 'true')
        el.setAttribute('aria-hidden', 'true')
      } else {
        el.style.display = ''
        el.removeAttribute('data-permission-denied')
        el.removeAttribute('aria-hidden')
      }
    }

    checkPermission()
    el._permissionCheck = checkPermission

    if (typeof window !== 'undefined') {
      window.addEventListener('permissions-changed', checkPermission)
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (binding.value !== binding.oldValue && el._permissionCheck) {
      el._permissionCheck()
    }
  },

  unmounted(el: HTMLElement) {
    if (el._permissionCheck && typeof window !== 'undefined') {
      window.removeEventListener('permissions-changed', el._permissionCheck)
    }
    delete el._permissionCheck
  },
}

// 安装权限指令
export function setupPermissionDirective(app: App) {
  app.directive('permission', permissionDirective)

  app.config.globalProperties.$hasPermission = hasPermission
  app.config.globalProperties.$hasRole = hasRole
  app.config.globalProperties.$hasAnyPermission = hasAnyPermission
  app.config.globalProperties.$setPermissions = setPermissions
  app.config.globalProperties.$setRoles = setRoles
}

export default permissionDirective
