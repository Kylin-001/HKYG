import { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/store/modules/user'

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const userStore = useUserStore()
    const { value } = binding

    if (!value || !Array.isArray(value) || value.length === 0) {
      return
    }

    const userPermissions = userStore.permissions || []
    const hasPermission = value.some(permission => userPermissions.includes(permission))

    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const userStore = useUserStore()
    const { value, oldValue } = binding

    if (JSON.stringify(value) === JSON.stringify(oldValue)) {
      return
    }

    if (!value || !Array.isArray(value) || value.length === 0) {
      return
    }

    const userPermissions = userStore.permissions || []
    const hasPermission = value.some(permission => userPermissions.includes(permission))

    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  },
}

export function registerPermissionDirective(app: any) {
  app.directive('permission', permission)
}
