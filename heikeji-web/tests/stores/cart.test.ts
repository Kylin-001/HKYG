import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '@/stores/cart'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('State', () => {
    it('应该有正确的初始状态', () => {
      const store = useCartStore()

      expect(store.items).toEqual([])
      expect(store.totalCount).toBe(0)
      expect(store.total).toBe(0)
    })
  })

  describe('Actions - addItem', () => {
    it('应该添加商品到购物车', () => {
      const store = useCartStore()
      const item = {
        id: '1',
        name: '测试商品',
        price: 15,
        quantity: 1,
      }

      store.addItem(item)

      expect(store.items).toHaveLength(1)
      expect(store.items[0]).toEqual(item)
    })

    it('应该增加已有商品的数量', () => {
      const store = useCartStore()
      const item = {
        id: '1',
        name: '测试商品',
        price: 15,
        quantity: 1,
      }

      store.addItem(item)
      store.addItem(item)

      expect(store.items).toHaveLength(1)
      expect(store.items[0].quantity).toBe(2)
    })

    it('应该添加不同商品', () => {
      const store = useCartStore()
      const item1 = { id: '1', name: '商品1', price: 15, quantity: 1 }
      const item2 = { id: '2', name: '商品2', price: 25, quantity: 1 }

      store.addItem(item1)
      store.addItem(item2)

      expect(store.items).toHaveLength(2)
    })
  })

  describe('Actions - decreaseItem', () => {
    it('应该减少商品数量', () => {
      const store = useCartStore()
      const item = { id: '1', name: '测试商品', price: 15, quantity: 2 }

      store.addItem(item)
      store.decreaseItem('1')

      expect(store.items[0].quantity).toBe(1)
    })

    it('数量减到0时应该移除商品', () => {
      const store = useCartStore()
      const item = { id: '1', name: '测试商品', price: 15, quantity: 1 }

      store.addItem(item)
      store.decreaseItem('1')

      expect(store.items).toHaveLength(0)
    })

    it('不存在的商品不应该报错', () => {
      const store = useCartStore()

      expect(() => store.decreaseItem('999')).not.toThrow()
    })
  })

  describe('Actions - removeItem', () => {
    it('应该移除指定商品', () => {
      const store = useCartStore()
      const item = { id: '1', name: '测试商品', price: 15, quantity: 1 }

      store.addItem(item)
      store.removeItem('1')

      expect(store.items).toHaveLength(0)
    })

    it('不存在的商品不应该报错', () => {
      const store = useCartStore()

      expect(() => store.removeItem('999')).not.toThrow()
    })
  })

  describe('Actions - clearCart', () => {
    it('应该清空购物车', () => {
      const store = useCartStore()
      store.addItem({ id: '1', name: '商品1', price: 15, quantity: 1 })
      store.addItem({ id: '2', name: '商品2', price: 25, quantity: 1 })

      store.clearCart()

      expect(store.items).toHaveLength(0)
      expect(store.totalCount).toBe(0)
      expect(store.total).toBe(0)
    })
  })

  describe('Actions - clearMerchantCart', () => {
    it('应该清空指定商家的商品', () => {
      const store = useCartStore()
      store.addItem({ id: '1', name: '商品1', price: 15, quantity: 1, merchantId: 'm1' })
      store.addItem({ id: '2', name: '商品2', price: 25, quantity: 1, merchantId: 'm2' })

      store.clearMerchantCart('m1')

      expect(store.items).toHaveLength(1)
      expect(store.items[0].merchantId).toBe('m2')
    })
  })

  describe('Getters', () => {
    it('应该正确计算商品总数', () => {
      const store = useCartStore()
      store.addItem({ id: '1', name: '商品1', price: 15, quantity: 2 })
      store.addItem({ id: '2', name: '商品2', price: 25, quantity: 3 })

      expect(store.totalCount).toBe(5)
    })

    it('应该正确计算总价', () => {
      const store = useCartStore()
      store.addItem({ id: '1', name: '商品1', price: 15, quantity: 2 })
      store.addItem({ id: '2', name: '商品2', price: 25, quantity: 1 })

      expect(store.total).toBe(55) // 15*2 + 25*1
    })

    it('应该按商家分组商品', () => {
      const store = useCartStore()
      store.addItem({ id: '1', name: '商品1', price: 15, quantity: 1, merchantId: 'm1' })
      store.addItem({ id: '2', name: '商品2', price: 25, quantity: 1, merchantId: 'm1' })
      store.addItem({ id: '3', name: '商品3', price: 35, quantity: 1, merchantId: 'm2' })

      const grouped = store.itemsByMerchant

      expect(grouped).toHaveProperty('m1')
      expect(grouped).toHaveProperty('m2')
      expect(grouped.m1).toHaveLength(2)
      expect(grouped.m2).toHaveLength(1)
    })

    it('应该判断购物车是否为空', () => {
      const store = useCartStore()

      expect(store.isEmpty).toBe(true)

      store.addItem({ id: '1', name: '商品1', price: 15, quantity: 1 })

      expect(store.isEmpty).toBe(false)
    })

    it('应该获取指定商家的商品', () => {
      const store = useCartStore()
      store.addItem({ id: '1', name: '商品1', price: 15, quantity: 1, merchantId: 'm1' })
      store.addItem({ id: '2', name: '商品2', price: 25, quantity: 1, merchantId: 'm2' })

      const m1Items = store.getItemsByMerchant('m1')

      expect(m1Items).toHaveLength(1)
      expect(m1Items[0].id).toBe('1')
    })
  })
})
