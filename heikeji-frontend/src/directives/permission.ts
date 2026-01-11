import { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/store/modules/user'

/**
 * 按钮权限指令
 * 使用方式：<el-button v-permission="['permission:add']">新增</el-button>
 */
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const userStore = useUserStore()
    const { value } = binding

    // 如果没有设置权限，显示元素
    if (!value || !Array.isArray(value) || value.length === 0) {
      return
    }

    // 获取用户权限
    const userPermissions = userStore.permissions || []

    // 检查用户是否有匹配的权限
    const hasPermission = value.some(permission => userPermissions.includes(permission))

    // 如果没有权限，隐藏元素
    if (!hasPermission) {
      el.style.display = 'none'
      // 或者使用 remove() 彻底移除元素
      // el.remove()
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const userStore = useUserStore()
    const { value } = binding

    // 如果没有设置权限，显示元素
    if (!value || !Array.isArray(value) || value.length === 0) {
      el.style.display = ''
      return
    }

    // 获取用户权限
    const userPermissions = userStore.permissions || []

    // 检查用户是否有匹配的权限
    const hasPermission = value.some(permission => userPermissions.includes(permission))

    // 根据权限状态显示或隐藏元素
    if (!hasPermission) {
      el.style.display = 'none'
      // 或者使用 remove() 彻底移除元素
      // el.remove()
    } else {
      el.style.display = ''
    }
  },
}

/**
 * 注册权限指令
 * @param app Vue应用实例
 */
export function registerPermissionDirective(app: any) {
  app.directive('permission', permission)
}
