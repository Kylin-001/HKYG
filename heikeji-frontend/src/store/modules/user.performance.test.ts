import { describe, it, expect, vi, beforeEach } from 'vitest'
import { testUserData } from '@/config/test';
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/store/modules/user'

describe('User Store Performance Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize quickly', () => {
    const startTime = performance.now()
    
    const store = useUserStore()
    
    const endTime = performance.now()
    const initTime = endTime - startTime
    
    expect(initTime).toBeLessThan(10)
    expect(store).toBeDefined()
  })

  it('should handle rapid state updates efficiently', () => {
    const store = useUserStore()
    
    const startTime = performance.now()
    
    for (let i = 0; i < 1000; i++) {
      store.setToken(`token-${i}`)
    }
    
    const endTime = performance.now()
    const updateTime = endTime - startTime
    
    expect(updateTime).toBeLessThan(100)
  })

  it('should handle large user info updates efficiently', () => {
    const store = useUserStore()
    
    const largeUserInfo = {
      userId: 1,
      username: 'testuser',
      nickname: '测试用户',
      avatar: 'http://example.com/avatar.jpg',
      email: 'test@example.com',
      phone: '13800138000',
      address: '黑龙江省哈尔滨市松北区',
      orders: Array.from({ length: 100 }, (_, i) => ({
        orderId: i + 1,
        orderNo: `ORD${i + 1}`,
        totalAmount: 100 + i
      })),
      favorites: Array.from({ length: 100 }, (_, i) => ({
        productId: i + 1,
        productName: `商品${i + 1}`
      }))
    }
    
    const startTime = performance.now()
    
    store.setUserInfo(largeUserInfo)
    
    const endTime = performance.now()
    const updateTime = endTime - startTime
    
    expect(updateTime).toBeLessThan(50)
  })

  it('should handle permission checks efficiently', () => {
    const store = useUserStore()
    const permissions = Array.from({ length: 100 }, (_, i) => `permission:${i}`)
    store.setPermissions(permissions)
    
    const startTime = performance.now()
    
    for (let i = 0; i < 1000; i++) {
      store.hasPermission(`permission:${i % 100}`)
    }
    
    const endTime = performance.now()
    const checkTime = endTime - startTime
    
    expect(checkTime).toBeLessThan(100)
  })

  it('should not leak memory on multiple store instances', () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0
    
    for (let i = 0; i < 10; i++) {
      const pinia = createPinia()
      setActivePinia(pinia)
      const store = useUserStore()
      store.setToken(`token-${i}`)
      store.setUserInfo({ userId: i, username: `user${i}` })
    }
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0
    const memoryIncrease = finalMemory - initialMemory
    
    if (performance.memory) {
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024)
    }
  })
})
