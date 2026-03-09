import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/store/modules/user'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useUserStore()
    expect(store.token).toBe('')
    expect(store.userInfo).toBeNull()
    expect(store.permissions).toEqual([])
  })

  it('should set token correctly', () => {
    const store = useUserStore()
    const testToken = testUserData.token
    
    store.setToken(testToken)
    expect(store.token).toBe(testToken)
  })

  it('should set user info correctly', () => {
    const store = useUserStore()
    const testUserInfo = {
      userId: 1,
      username: 'testuser',
      nickname: '测试用户',
      avatar: 'http://example.com/avatar.jpg',
      email: 'test@example.com',
      phone: '13800138000'
    }
    
    store.setUserInfo(testUserInfo)
    expect(store.userInfo).toEqual(testUserInfo)
  })

  it('should set permissions correctly', () => {
    const store = useUserStore()
    const testPermissions = ['user:view', 'user:add', 'user:edit']
    
    store.setPermissions(testPermissions)
    expect(store.permissions).toEqual(testPermissions)
  })

  it('should clear user state correctly', () => {
    const store = useUserStore()
    
    store.setToken('test-token')
    store.setUserInfo({ userId: 1, username: 'test' })
    store.setPermissions(['user:view'])
    
    store.clearUser()
    
    expect(store.token).toBe('')
    expect(store.userInfo).toBeNull()
    expect(store.permissions).toEqual([])
  })

  it('should check if user has permission', () => {
    const store = useUserStore()
    store.setPermissions(['user:view', 'user:add', 'user:edit'])
    
    expect(store.hasPermission('user:view')).toBe(true)
    expect(store.hasPermission('user:delete')).toBe(false)
  })

  it('should check if user has any of the permissions', () => {
    const store = useUserStore()
    store.setPermissions(['user:view', 'user:add'])
    
    expect(store.hasAnyPermission(['user:delete', 'user:view'])).toBe(true)
    expect(store.hasAnyPermission(['user:delete', 'user:edit'])).toBe(false)
  })
})
