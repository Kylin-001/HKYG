import { describe, it, expect } from 'vitest'
import { useUserStore } from '@/store/modules/user'
import { createPinia } from 'pinia'

describe('Test User Store Import', () => {
  it('should import useUserStore correctly', () => {
    console.log('useUserStore:', typeof useUserStore)
    console.log('useUserStore:', useUserStore)
    expect(typeof useUserStore).toBe('function')
  })

  it('should create user store instance', () => {
    const pinia = createPinia()
    const userStore = useUserStore(pinia)
    expect(userStore).toBeDefined()
  })
})
