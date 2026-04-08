export type Role = 'admin' | 'moderator' | 'user' | 'guest'

export type Permission =
  | 'product:read'
  | 'product:create'
  | 'product:edit'
  | 'product:delete'
  | 'order:read'
  | 'order:create'
  | 'order:cancel'
  | 'order:refund'
  | 'cart:read'
  | 'cart:write'
  | 'user:read'
  | 'user:edit'
  | 'user:delete'
  | 'community:read'
  | 'community:create'
  | 'community:edit'
  | 'community:delete'
  | 'community:moderate'
  | 'takeout:read'
  | 'takeout:order'
  | 'secondhand:read'
  | 'secondhand:create'
  | 'secondhand:edit'
  | 'secondhand:delete'
  | 'campus:read'
  | 'campus:schedule'
  | 'campus:grades'
  | 'campus:library'
  | 'campus:repair'
  | 'settings:read'
  | 'settings:write'
  | 'system:admin'
  | 'system:manage_users'
  | 'system:view_logs'

interface RolePermissions {
  [role: string]: Permission[]
}

const ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    'product:read', 'product:create', 'product:edit', 'product:delete',
    'order:read', 'order:create', 'order:cancel', 'order:refund',
    'cart:read', 'cart:write',
    'user:read', 'user:edit', 'user:delete',
    'community:read', 'community:create', 'community:edit', 'community:delete', 'community:moderate',
    'takeout:read', 'takeout:order',
    'secondhand:read', 'secondhand:create', 'secondhand:edit', 'secondhand:delete',
    'campus:read', 'campus:schedule', 'campus:grades', 'campus:library', 'campus:repair',
    'settings:read', 'settings:write',
    'system:admin', 'system:manage_users', 'system:view_logs',
  ],
  moderator: [
    'product:read', 'product:edit',
    'order:read', 'order:cancel',
    'cart:read', 'cart:write',
    'user:read',
    'community:read', 'community:create', 'community:edit', 'community:delete', 'community:moderate',
    'takeout:read', 'takeout:order',
    'secondhand:read', 'secondhand:create', 'secondhand:edit', 'secondhand:delete',
    'campus:read', 'campus:schedule', 'campus:grades', 'campus:library', 'campus:repair',
    'settings:read',
    'system:view_logs',
  ],
  user: [
    'product:read',
    'order:read', 'order:create', 'order:cancel', 'order:refund',
    'cart:read', 'cart:write',
    'user:read', 'user:edit',
    'community:read', 'community:create', 'community:edit', 'community:delete',
    'takeout:read', 'takeout:order',
    'secondhand:read', 'secondhand:create', 'secondhand:edit', 'secondhand:delete',
    'campus:read', 'campus:schedule', 'campus:grades', 'campus:library', 'campus:repair',
    'settings:read', 'settings:write',
  ],
  guest: [
    'product:read',
    'community:read',
    'takeout:read',
    'secondhand:read',
    'campus:read',
  ],
}

const HIERARCHY: Record<Role, number> = {
  admin: 100,
  moderator: 50,
  user: 10,
  guest: 0,
}

export class RBACManager {
  private currentRole: Role = 'guest'
  private customPermissions: Set<Permission> = new Set()
  private listeners: Array<(role: Role) => void> = []

  constructor(initialRole?: Role) {
    if (initialRole) {
      this.currentRole = initialRole
    }
  }

  get role(): Role {
    return this.currentRole
  }

  set role(newRole: Role) {
    const oldRole = this.currentRole
    this.currentRole = newRole
    this.listeners.forEach((listener) => listener(newRole))
    
    console.log(`[RBAC] Role changed from ${oldRole} to ${newRole}`)
  }

  hasRole(role: Role): boolean {
    return HIERARCHY[this.currentRole] >= HIERARCHY[role]
  }

  hasPermission(permission: Permission): boolean {
    return (
      this.customPermissions.has(permission) ||
      (ROLE_PERMISSIONS[this.currentRole] || []).includes(permission)
    )
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((p) => this.hasPermission(p))
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((p) => this.hasPermission(p))
  }

  grantCustomPermission(permission: Permission): void {
    this.customPermissions.add(permission)
  }

  revokeCustomPermission(permission: Permission): void {
    this.customPermissions.delete(permission)
  }

  clearCustomPermissions(): void {
    this.customPermissions.clear()
  }

  getPermissions(): Permission[] {
    const basePermissions = ROLE_PERMISSIONS[this.currentRole] || []
    return [...new Set([...basePermissions, ...this.customPermissions])]
  }

  onRoleChange(callback: (role: Role) => void): () => void {
    this.listeners.push(callback)
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  static fromUserRoles(roles: Role[]): RBACManager {
    const manager = new RBACManager()
    let highestRole: Role = 'guest'
    let highestLevel = -1

    for (const role of roles) {
      const level = HIERARCHY[role]
      if (level > highestLevel) {
        highestLevel = level
        highestRole = role
      }
    }

    manager.role = highestRole
    return manager
  }
}

let globalRbacInstance: RBACManager | null = null

export function usePermission() {
  function initRbac(role?: Role): RBACManager {
    if (!globalRbacInstance) {
      globalRbacInstance = new RBACManager(role)
    } else if (role && globalRbacInstance.role !== role) {
      globalRbacInstance.role = role
    }
    
    return globalRbacInstance
  }

  function can(permission: Permission): boolean {
    return globalRbacInstance?.hasPermission(permission) ?? false
  }

  function canAny(permissions: Permission[]): boolean {
    return globalRbacInstance?.hasAnyPermission(permissions) ?? false
  }

  function canAll(permissions: Permission[]): boolean {
    return globalRbacInstance?.hasAllPermissions(permissions) ?? false
  }

  function is(role: Role): boolean {
    return globalRbacInstance?.hasRole(role) ?? false
  }

  function isAdmin(): boolean {
    return globalRbacInstance?.hasRole('admin') ?? false
  }

  function isModerator(): boolean {
    return globalRbacInstance?.hasRole('moderator') ?? false
  }

  function isLoggedIn(): boolean {
    return (globalRbacInstance?.hasRole('user') ?? false) || 
           (globalRbacInstance?.hasRole('moderator') ?? false) || 
           (globalRbacInstance?.hasRole('admin') ?? false)
  }

  return {
    initRbac,
    can,
    canAny,
    canAll,
    is,
    isAdmin,
    isModerator,
    isLoggedIn,
    rbac: () => globalRbacInstance,
  }
}

export { RBACManager, ROLE_PERMISSIONS, HIERARCHY }
