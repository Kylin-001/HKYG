import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePermissionStore } from '@/store/modules/permission'

describe('Permission Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = usePermissionStore()
    expect(store.routes).toEqual([])
    expect(store.addRoutes).toEqual([])
    expect(store.defaultRoute).toBeNull()
  })

  it('should set routes correctly', () => {
    const store = usePermissionStore()
    const testRoutes = [
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/user', name: 'User' }
    ]
    
    store.setRoutes(testRoutes)
    expect(store.routes).toEqual(testRoutes)
  })

  it('should add routes correctly', () => {
    const store = usePermissionStore()
    const initialRoutes = [{ path: '/dashboard', name: 'Dashboard' }]
    const newRoutes = [{ path: '/user', name: 'User' }]
    
    store.setRoutes(initialRoutes)
    store.addRoutes(newRoutes)
    
    expect(store.routes.length).toBe(2)
    expect(store.routes).toContainEqual(expect.objectContaining({ path: '/user' }))
  })

  it('should set default route correctly', () => {
    const store = usePermissionStore()
    const testRoute = { path: '/dashboard', name: 'Dashboard' }
    
    store.setDefaultRoute(testRoute)
    expect(store.defaultRoute).toEqual(testRoute)
  })

  it('should clear routes correctly', () => {
    const store = usePermissionStore()
    store.setRoutes([{ path: '/dashboard', name: 'Dashboard' }])
    store.setDefaultRoute({ path: '/dashboard', name: 'Dashboard' })
    
    store.clearRoutes()
    
    expect(store.routes).toEqual([])
    expect(store.addRoutes).toEqual([])
    expect(store.defaultRoute).toBeNull()
  })

  it('should check if route exists', () => {
    const store = usePermissionStore()
    const testRoutes = [
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/user', name: 'User' }
    ]
    store.setRoutes(testRoutes)
    
    expect(store.hasRoute('/dashboard')).toBe(true)
    expect(store.hasRoute('/admin')).toBe(false)
  })

  it('should get route by name', () => {
    const store = usePermissionStore()
    const testRoutes = [
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/user', name: 'User' }
    ]
    store.setRoutes(testRoutes)
    
    const dashboardRoute = store.getRouteByName('Dashboard')
    expect(dashboardRoute).toEqual(testRoutes[0])
    
    const unknownRoute = store.getRouteByName('Unknown')
    expect(unknownRoute).toBeUndefined()
  })
})
