import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { testUserData } from '@/config/test';
import { setActivePinia, createPinia } from 'pinia'
import { usePermissionStore } from './permission'

// Mock constantRoutes and asyncRoutes
vi.mock('@/router', () => ({
  constantRoutes: [
    { path: '/', name: 'Home', component: 'Home' },
    { path: '/login', name: 'Login', component: 'Login' },
    { path: '/dashboard', name: 'Dashboard', component: 'Dashboard' },
  ],
  asyncRoutes: [
    { path: '/admin', name: 'Admin', component: 'Admin', meta: { roles: ['admin'] } },
    { path: '/user', name: 'User', component: 'User', meta: { roles: ['user', 'admin'] } },
    { path: '/profile', name: 'Profile', component: 'Profile', meta: { roles: ['user', 'admin'] } },
  ],
}))

describe('Permission Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default state', () => {
    const store = usePermissionStore()
    
    expect(store.routes).toEqual([])
    expect(store.addRoutes).toEqual([])
    expect(store.accessedRoutes).toEqual([])
    expect(store.currentRoute).toBe('')
    expect(store.loading).toBe(false)
  })

  it('should generate routes for admin user', async () => {
    const store = usePermissionStore()
    
    // Mock user store with admin role
    const mockUserStore = {
      roles: ['admin'],
    }
    vi.doMock('@/store/modules/user', () => ({
      useUserStore: () => mockUserStore,
    }))
    
    await store.generateRoutes()
    
    expect(store.routes).toHaveLength(8) // 4 constant + 4 async
    expect(store.addRoutes).toHaveLength(4)
    expect(store.accessedRoutes).toHaveLength(4)
    expect(store.loading).toBe(false)
  })

  it('should generate routes for regular user', async () => {
    const store = usePermissionStore()
    
    // Mock user store with user role
    const mockUserStore = {
      roles: ['user'],
    }
    vi.doMock('@/store/modules/user', () => ({
      useUserStore: () => mockUserStore,
    }))
    
    await store.generateRoutes()
    
    expect(store.routes).toHaveLength(6) // 4 constant + 2 async (user can access admin and user routes)
    expect(store.addRoutes).toHaveLength(2)
    expect(store.accessedRoutes).toHaveLength(2)
    expect(store.loading).toBe(false)
  })

  it('should check route permission correctly', () => {
    const store = usePermissionStore()
    
    // Set up some accessed routes
    store.addRoutes = [
      { path: '/admin', name: 'Admin', meta: { roles: ['admin'] } },
      { path: '/user', name: 'User', meta: { roles: ['user', 'admin'] } },
    ] as any
    
    expect(store.checkRoutePermission('Admin')).toBe(true)
    expect(store.checkRoutePermission('User')).toBe(true)
    expect(store.checkRoutePermission('Profile')).toBe(true)
    expect(store.checkRoutePermission('NonExistent')).toBe(false)
  })

  it('should get breadcrumb path correctly', () => {
    const store = usePermissionStore()
    
    // Set up some accessed routes
    store.addRoutes = [
      { path: '/admin', name: 'Admin', meta: { title: '管理后台' } },
      { path: '/admin/users', name: 'AdminUsers', meta: { title: '用户管理' } },
      { path: '/user', name: 'User', meta: { title: '用户中心' } },
    ] as any
    
    const breadcrumb = store.getBreadcrumbPath('AdminUsers')
    
    expect(breadcrumb).toHaveLength(2)
    expect(breadcrumb[0]).toMatchObject({
      name: 'Admin',
      path: '/admin',
      meta: { title: '管理后台' },
    })
    expect(breadcrumb[1]).toMatchObject({
      name: 'AdminUsers',
      path: '/admin/users',
      meta: { title: '用户管理' },
    })
  })

  it('should reset permission state correctly', () => {
    const store = usePermissionStore()
    
    // Set some initial state
    store.routes = [{ path: '/test' }] as any
    store.addRoutes = [{ path: '/admin' }] as any
    store.currentRoute = 'test'
    
    store.resetPermissionState()
    
    expect(store.routes).toEqual([])
    expect(store.addRoutes).toEqual([])
    expect(store.currentRoute).toBe('')
    expect(store.loading).toBe(false)
  })

  it('should handle route loading state', () => {
    const store = usePermissionStore()
    
    expect(store.isLoading()).toBe(false)
    
    store.setLoading(true)
    expect(store.isLoading()).toBe(true)
    
    store.setLoading(false)
    expect(store.isLoading()).toBe(false)
  })

  it('should handle route filtering', () => {
    const store = usePermissionStore()
    
    const testRoutes = [
      { path: '/public', name: 'Public', meta: { hidden: false } },
      { path: '/hidden', name: 'Hidden', meta: { hidden: true } },
      { path: '/admin', name: 'Admin', meta: { roles: ['admin'] } },
    ] as any
    
    // Mock user with user role
    const mockUserStore = {
      roles: ['user'],
    }
    vi.doMock('@/store/modules/user', () => ({
      useUserStore: () => mockUserStore,
    }))
    
    const filteredRoutes = store.filterRoutesByRole(testRoutes, ['user'])
    
    expect(filteredRoutes).toHaveLength(2) // Public and Admin (user can access)
    expect(filteredRoutes[0].name).toBe('Public')
    expect(filteredRoutes[1].name).toBe('Admin')
  })

  it('should handle route flattening', () => {
    const store = usePermissionStore()
    
    const nestedRoutes = [
      {
        path: '/admin',
        name: 'Admin',
        children: [
          {
            path: '/users',
            name: 'AdminUsers',
            children: [
              { path: '/list', name: 'AdminUsersList' },
              { path: '/detail', name: 'AdminUsersDetail' },
            ],
          },
          {
            path: '/settings',
            name: 'AdminSettings',
          },
        ],
      },
      {
        path: '/user',
        name: 'User',
        children: [
          { path: '/profile', name: 'UserProfile' },
          { path: '/orders', name: 'UserOrders' },
        ],
      },
    ] as any
    
    const flattenedRoutes = store.flattenRoutes(nestedRoutes)
    
    expect(flattenedRoutes).toHaveLength(7)
    expect(flattenedRoutes.map(r => r.name)).toEqual([
      'Admin',
      'AdminUsers',
      'AdminUsersList',
      'AdminUsersDetail',
      'AdminSettings',
      'User',
      'UserProfile',
      'UserOrders',
    ])
  })

  it('should get route by name', () => {
    const store = usePermissionStore()
    
    const testRoutes = [
      { path: '/admin', name: 'Admin' },
      { path: '/user', name: 'User' },
      { path: '/profile', name: 'Profile' },
    ] as any
    
    store.routes = testRoutes
    
    expect(store.getRouteByName('Admin')).toMatchObject({ path: '/admin', name: 'Admin' })
    expect(store.getRouteByName('User')).toMatchObject({ path: '/user', name: 'User' })
    expect(store.getRouteByName('NonExistent')).toBeNull()
  })

  it('should check if route has required roles', () => {
    const store = usePermissionStore()
    
    const testRoutes = [
      { path: '/admin', meta: { roles: ['admin'] } },
      { path: '/user', meta: { roles: ['user', 'admin'] } },
      { path: '/public', meta: {} },
    ] as any
    
    expect(store.hasRequiredRoles(testRoutes[0], ['admin'])).toBe(true)
    expect(store.hasRequiredRoles(testRoutes[1], ['admin'])).toBe(true)
    expect(store.hasRequiredRoles(testRoutes[1], ['user'])).toBe(true)
    expect(store.hasRequiredRoles(testRoutes[2], ['user'])).toBe(false)
    expect(store.hasRequiredRoles(testRoutes[2], ['admin'])).toBe(false)
    expect(store.hasRequiredRoles(testRoutes[2], ['user'])).toBe(true)
  })
})