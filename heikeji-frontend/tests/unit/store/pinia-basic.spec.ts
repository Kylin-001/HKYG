import { describe, it, expect } from 'vitest'
import { createPinia, defineStore } from 'pinia'

// 创建一个简单的测试store
export const useTestStore = defineStore('test', () => {
  const count = 0
  return {
    count,
  }
})

describe('Pinia Basic Test', () => {
  it('should create a pinia instance', () => {
    const pinia = createPinia()
    expect(pinia).toBeDefined()
  })

  it('should create a store instance', () => {
    const pinia = createPinia()
    const testStore = useTestStore(pinia)
    expect(testStore).toBeDefined()
    expect(testStore.count).toBe(0)
  })
})
