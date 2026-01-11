const { describe, it, expect, beforeEach } = require('vitest')
const { createPinia } = require('pinia')

// 尝试使用require导入useUserStore
describe('Test User Store Import with require', () => {
  it('should import useUserStore correctly with require', () => {
    try {
      const { useUserStore } = require('../../../src/store/modules/user.ts')
      console.log('useUserStore with require:', typeof useUserStore)
      console.log('useUserStore with require:', useUserStore)
      expect(typeof useUserStore).toBe('function')
    } catch (error) {
      console.error('Error importing useUserStore with require:', error)
      throw error
    }
  })

  it('should create user store instance with require', () => {
    try {
      const { useUserStore } = require('../../../src/store/modules/user.ts')
      const pinia = createPinia()
      const userStore = useUserStore(pinia)
      expect(userStore).toBeDefined()
    } catch (error) {
      console.error('Error creating user store instance with require:', error)
      throw error
    }
  })
})
