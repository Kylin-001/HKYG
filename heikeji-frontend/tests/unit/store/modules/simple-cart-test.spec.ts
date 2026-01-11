import { describe, it, expect } from 'vitest'

// 简单测试导入是否正常
import { defineStore } from 'pinia'
import { ref } from 'vue'

describe('Simple Cart Store Test', () => {
  it('should be able to define a store', () => {
    // 直接在测试文件中定义一个简单的store
    const useSimpleCartStore = defineStore('simple-cart', () => {
      const products = ref([])

      function addProduct(product: any) {
        products.value.push(product)
      }

      return {
        products,
        addProduct,
      }
    })

    // 验证定义的store是一个函数
    expect(typeof useSimpleCartStore).toBe('function')
  })
})
