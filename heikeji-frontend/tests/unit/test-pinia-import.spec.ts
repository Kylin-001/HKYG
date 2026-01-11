import { describe, it, expect, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useUserStore } from '@/store/modules/user.ts'
import { setActivePinia } from 'pinia'

describe('Pinia Import Test', () => {
  let userStore

  beforeEach(() => {
    // 创建并激活测试用的Pinia实例
    const pinia = createTestingPinia()
    setActivePinia(pinia)

    // 初始化store实例
    userStore = useUserStore()
  })

  it('should be able to import and create userStore', () => {
    // 测试store是否能正确创建
    expect(userStore).toBeDefined()
    expect(typeof userStore).toBe('object')

    // 测试初始状态
    expect(userStore.token).toBe('')
    expect(userStore.userInfo).toBeNull()
    expect(userStore.roles).toEqual([])
    expect(userStore.permissions).toEqual([])
  })
})
