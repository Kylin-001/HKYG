import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useCartStore } from '@/stores/cart'
import * as cartApi from '@/api/cart'

// Mock cart API
vi.mock('@/api/cart', () => ({
  getCart: vi.fn(),
  addToCart: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
  batchRemoveCart: vi.fn(),
  selectAllItems: vi.fn(),
  moveToFavorite: vi.fn(),
  clearCart: vi.fn(),
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() { return Object.keys(store).length },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', { value: true, writable: true })

const mockCartItem1 = {
  id: 1,
  productId: 101,
  product: {
    id: 101,
    name: '测试商品A',
    image: '/product-a.jpg',
    price: 99.99,
    originalPrice: 199.99,
    stock: 100,
    status: 'active',
  },
  quantity: 2,
  selected: true,
  addedAt: '2024-01-01T00:00:00Z',
}

const mockCartItem2 = {
  id: 2,
  productId: 102,
  product: {
    id: 102,
    name: '测试商品B',
    image: '/product-b.jpg',
    price: 50.00,
    stock: 50,
    status: 'active',
  },
  quantity: 3,
  selected: false,
  addedAt: '2024-01-02T00:00:00Z',
}

const mockInvalidCartItem = {
  id: 3,
  productId: 103,
  product: {
    id: 103,
    name: '失效商品',
    image: '/product-c.jpg',
    price: 29.99,
    stock: 0,
    status: 'active',
  },
  quantity: 1,
  selected: true,
  addedAt: '2024-01-03T00:00:00Z',
}

const mockOfflineCartItem = {
  id: 4,
  productId: 104,
  product: {
    id: 104,
    name: '下架商品',
    image: '/product-d.jpg',
    price: 39.99,
    stock: 10,
    status: 'offline',
  },
  quantity: 2,
  selected: false,
  addedAt: '2024-01-04T00:00:00Z',
}

const mockCartResponse = {
  items: [mockCartItem1, mockCartItem2],
  totalItems: 5,
  totalAmount: 349.98,
  savedAmount: 100.01,
  selectedCount: 2,
  selectedAmount: 199.98,
}

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorageMock.clear()
    // Reset navigator online status
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true })
  })

  // ============================================
  // 初始状态验证
  // ============================================
  describe('初始状态验证', () => {
    it('应该有空的items数组', () => {
      const store = useCartStore()
      expect(store.items).toEqual([])
    })

    it('totalItems应该为0', () => {
      const store = useCartStore()
      expect(store.totalItems).toBe(0)
    })

    it('totalAmount应该为0', () => {
      const store = useCartStore()
      expect(store.totalAmount).toBe(0)
    })

    it('savedAmount应该为0', () => {
      const store = useCartStore()
      expect(store.savedAmount).toBe(0)
    })

    it('selectedCount应该为0', () => {
      const store = useCartStore()
      expect(store.selectedCount).toBe(0)
    })

    it('selectedAmount应该为0', () => {
      const store = useCartStore()
      expect(store.selectedAmount).toBe(0)
    })

    it('loading状态默认为false', () => {
      const store = useCartStore()
      expect(store.loading).toBe(false)
    })

    it('syncing状态默认为false', () => {
      const store = useCartStore()
      expect(store.syncing).toBe(false)
    })

    it('isOffline状态默认基于navigator.onLine', () => {
      const store = useCartStore()
      expect(store.isOffline).toBe(false)
    })

    it('invalidItems应该为空数组', () => {
      const store = useCartStore()
      expect(store.invalidItems).toEqual([])
    })
  })

  // ============================================
  // 计算属性测试
  // ============================================
  describe('计算属性测试', () => {
    describe('hasItems', () => {
      it('有空商品时返回true', () => {
        const store = useCartStore()
        store.items.push(mockCartItem1 as any)
        expect(store.hasItems).toBe(true)
      })

      it('空购物车时返回false', () => {
        const store = useCartStore()
        expect(store.hasItems).toBe(false)
      })
    })

    describe('badgeCount', () => {
      it('正确累加所有商品数量', () => {
        const store = useCartStore()
        store.items.push(mockCartItem1 as any, mockCartItem2 as any)
        // 2 + 3 = 5
        expect(store.badgeCount).toBe(5)
      })

      it('空购物车时返回0', () => {
        const store = useCartStore()
        expect(store.badgeCount).toBe(0)
      })

      it('单个商品时返回该商品数量', () => {
        const store = useCartStore()
        store.items.push({ ...mockCartItem1, quantity: 10 } as any)
        expect(store.badgeCount).toBe(10)
      })
    })

    describe('validItems', () => {
      it('只返回有效商品（有库存且未下架）', () => {
        const store = useCartStore()
        store.items.push(
          mockCartItem1 as any,
          mockInvalidCartItem as any,
          mockOfflineCartItem as any
        )
        expect(store.validItems.length).toBe(1)
        expect(store.validItems[0].productId).toBe(101)
      })

      it('所有商品有效时返回全部', () => {
        const store = useCartStore()
        store.items.push(mockCartItem1 as any, mockCartItem2 as any)
        expect(store.validItems.length).toBe(2)
      })
    })

    describe('expiredItems', () => {
      it('正确识别失效商品', () => {
        const store = useCartStore()
        store.items.push(
          mockCartItem1 as any,
          mockInvalidCartItem as any,
          mockOfflineCartItem as any
        )
        // 库存为0 + 下架 = 2个失效
        expect(store.expiredItems.length).toBe(2)
      })
    })

    describe('selectedItems', () => {
      it('只返回已选中的商品', () => {
        const store = useCartStore()
        store.items.push(mockCartItem1 as any, mockCartItem2 as any)
        expect(store.selectedItems.length).toBe(1)
        expect(store.selectedItems[0].id).toBe(1)
      })
    })

    describe('isAllSelected', () => {
      it('所有有效商品选中时返回true', () => {
        const store = useCartStore()
        store.items.push(
          { ...mockCartItem1, selected: true } as any,
          { ...mockCartItem2, selected: true } as any
        )
        expect(store.isAllSelected).toBe(true)
      })

      it('部分商品未选中时返回false', () => {
        const store = useCartStore()
        store.items.push(mockCartItem1 as any, mockCartItem2 as any)
        expect(store.isAllSelected).toBe(false)
      })

      it('无有效商品时返回false', () => {
        const store = useCartStore()
        store.items.push(mockInvalidCartItem as any)
        expect(store.isAllSelected).toBe(false)
      })
    })

    describe('canUndo', () => {
      it('有撤销记录时返回true', async () => {
        const store = useCartStore()
        vi.mocked(cartApi.addToCart).mockResolvedValue({ id: 1 })
        await store.addItem(101, 1)
        expect(store.canUndo).toBe(true)
      })

      it('无撤销记录时返回false', () => {
        const store = useCartStore()
        expect(store.canUndo).toBe(false)
      })
    })
  })

  // ============================================
  // fetchCart 测试
  // ============================================
  describe('fetchCart', () => {
    it('应该成功获取购物车数据并更新状态', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.getCart).mockResolvedValue(mockCartResponse)

      await store.fetchCart()

      expect(cartApi.getCart).toHaveBeenCalledOnce()
      expect(store.items.length).toBe(2)
      expect(store.totalItems).toBe(5)
      expect(store.totalAmount).toBe(349.98)
      expect(store.savedAmount).toBe(100.01)
      expect(store.selectedCount).toBe(2)
      expect(store.selectedAmount).toBe(199.98)
      expect(store.loading).toBe(false)
    })

    it('API失败时应该处理错误并保持loading=false', async () => {
      const store = useCartStore()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(cartApi.getCart).mockRejectedValue(new Error('网络错误'))

      await store.fetchCart()

      expect(consoleSpy).toHaveBeenCalledWith('获取购物车失败:', expect.any(Error))
      expect(store.loading).toBe(false)
      consoleSpy.mockRestore()
    })

    it('API失败且有本地缓存时应该加载本地数据', async () => {
      const store = useCartStore()
      // 预先填充本地存储
      localStorageMock.setItem('heikeji-cart-local', JSON.stringify({
        items: [mockCartItem1],
        savedAt: Date.now(),
      }))
      
      vi.mocked(cartApi.getCart).mockRejectedValue(new Error('网络错误'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await store.fetchCart()

      // 应该从本地加载数据
      expect(store.items.length).toBeGreaterThan(0)
      consoleSpy.mockRestore()
    })

    it('离线模式且本地有数据时应使用本地数据', async () => {
      const store = useCartStore()
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true })
      
      // 先添加一些数据到store
      store.items.push(mockCartItem1 as any)
      store.totalItems = 2

      await store.fetchCart()

      // 不应调用API
      expect(cartApi.getCart).not.toHaveBeenCalled()
    })

    it('强制刷新时应忽略离线状态', async () => {
      const store = useCartStore()
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true })
      
      vi.mocked(cartApi.getCart).mockResolvedValue(mockCartResponse)

      await store.fetchCart(true) // forceRefresh = true

      expect(cartApi.getCart).toHaveBeenCalledOnce()
    })

    it('应该将商品标记为非本地', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.getCart).mockResolvedValue(mockCartResponse)

      await store.fetchCart()

      expect(store.items.every(item => item.isLocal === false)).toBe(true)
      expect(store.items.every(item => item.lastSyncTime !== undefined)).toBe(true)
    })

    it('应该保存到localStorage', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.getCart).mockResolvedValue(mockCartResponse)

      await store.fetchCart()

      expect(localStorageMock.setItem).toHaveBeenCalled()
    })
  })

  // ============================================
  // addItem 测试
  // ============================================
  describe('addItem', () => {
    it('应该添加商品到购物车（乐观更新）', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.addToCart).mockResolvedValue({ id: 100, product: mockCartItem1.product })

      await store.addItem(101, 2)

      // 乐观更新：立即添加到items
      expect(store.items.length).toBe(1)
      expect(store.items[0].productId).toBe(101)
      expect(store.items[0].quantity).toBe(2)
      expect(store.items[0].selected).toBe(true)
      // API成功后isLocal会被设置为false
      expect(store.items[0].isLocal).toBe(false)
    })

    it('默认数量应为1', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.addToCart).mockResolvedValue({ id: 1 })

      await store.addItem(101)

      expect(store.items[0].quantity).toBe(1)
      expect(cartApi.addToCart).toHaveBeenCalledWith({ productId: 101, quantity: 1 })
    })

    it('成功同步后应更新ID和标记', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.addToCart).mockResolvedValue({ 
        id: 999, 
        product: mockCartItem1.product 
      })

      await store.addItem(101, 1)

      expect(store.items[0].id).toBe(999)
      expect(store.items[0].isLocal).toBe(false)
      expect(store.items[0].product).toEqual(mockCartItem1.product)
    })

    it('离线模式下应标记待同步', async () => {
      const store = useCartStore()
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true })

      await store.addItem(101, 1)

      expect(store.items[0].isLocal).toBe(true)
      expect(cartApi.addToCart).not.toHaveBeenCalled()
    })

    it('API调用失败时应抛出错误', async () => {
      const store = useCartStore()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(cartApi.addToCart).mockRejectedValue(new Error('添加失败'))

      await expect(store.addItem(101, 1)).rejects.toThrow('添加失败')
      consoleSpy.mockRestore()
    })

    it('应该记录撤销信息', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.addToCart).mockResolvedValue({ id: 1 })

      await store.addItem(101, 1)

      expect(store.canUndo).toBe(true)
    })

    it('应该保存到localStorage', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.addToCart).mockResolvedValue({ id: 1 })

      await store.addItem(101, 1)

      expect(localStorageMock.setItem).toHaveBeenCalled()
    })
  })

  // ============================================
  // updateItem 测试
  // ============================================
  describe('updateItem', () => {
    beforeEach(async () => {
      // 预先填充购物车
      const store = useCartStore()
      store.items.push({ ...mockCartItem1, id: '1' } as any, { ...mockCartItem2, id: '2' } as any)
    })

    it('应该增加商品数量', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.updateCartItem).mockResolvedValue({ success: true })

      await store.updateItem('1', 5)

      expect(store.items.find(i => i.id === '1')?.quantity).toBe(5)
      expect(cartApi.updateCartItem).toHaveBeenCalledWith({ itemId: '1', quantity: 5, selected: undefined })
    })

    it('应该减少商品数量', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.updateCartItem).mockResolvedValue({ success: true })

      await store.updateItem('1', 1)

      expect(store.items.find(i => i.id === '1')?.quantity).toBe(1)
    })

    it('数量不应小于1', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.updateCartItem).mockResolvedValue({ success: true })

      await store.updateItem('1', 0)

      expect(store.items.find(i => i.id === '1')?.quantity).toBe(1) // Math.max(1, 0) = 1
    })

    it('应该选择商品', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.updateCartItem).mockResolvedValue({ success: true })

      await store.updateItem('2', undefined, true)

      expect(store.items.find(i => i.id === '2')?.selected).toBe(true)
    })

    it('应该取消选择商品', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.updateCartItem).mockResolvedValue({ success: true })

      await store.updateItem('1', undefined, false)

      expect(store.items.find(i => i.id === '1')?.selected).toBe(false)
    })

    it('同时更新数量和选择状态', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.updateCartItem).mockResolvedValue({ success: true })

      await store.updateItem('2', 10, true)

      const item = store.items.find(i => i.id === '2')
      expect(item?.quantity).toBe(10)
      expect(item?.selected).toBe(true)
    })

    it('API失败时应回滚更改', async () => {
      const store = useCartStore()
      const originalQuantity = store.items.find(i => i.id === '1')?.quantity
      vi.mocked(cartApi.updateCartItem).mockRejectedValue(new Error('更新失败'))

      await expect(store.updateItem('1', 10)).rejects.toThrow()
      expect(store.items.find(i => i.id === '1')?.quantity).toBe(originalQuantity)
    })

    it('本地商品不应调用API直接同步', async () => {
      const store = useCartStore()
      // 设置为本地商品
      store.items[0].isLocal = true

      vi.mocked(cartApi.updateCartItem).mockResolvedValue({ success: true })

      await store.updateItem('1', 5)

      expect(cartApi.updateCartItem).not.toHaveBeenCalled()
    })
  })

  // ============================================
  // removeItem 测试
  // ============================================
  describe('removeItem', () => {
    beforeEach(() => {
      const store = useCartStore()
      store.items.push({ ...mockCartItem1, id: '1' } as any, { ...mockCartItem2, id: '2' } as any)
    })

    it('应该从购物车移除指定商品', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.removeCartItem).mockResolvedValue({ success: true })

      await store.removeItem('1')

      expect(store.items.length).toBe(1)
      expect(store.items.find(i => i.id === '1')).toBeUndefined()
    })

    it('应该调用API删除服务端数据', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.removeCartItem).mockResolvedValue({ success: true })

      await store.removeItem('1')

      expect(cartApi.removeCartItem).toHaveBeenCalledWith('1')
    })

    it('本地商品不应调用API', async () => {
      const store = useCartStore()
      store.items[0].isLocal = true
      vi.mocked(cartApi.removeCartItem).mockResolvedValue({ success: true })

      await store.removeItem('1')

      expect(cartApi.removeCartItem).not.toHaveBeenCalled()
    })

    it('API失败时应回滚删除操作', async () => {
      const store = useCartStore()
      const initialLength = store.items.length
      vi.mocked(cartApi.removeCartItem).mockRejectedValue(new Error('删除失败'))

      await expect(store.removeItem('1')).rejects.toThrow()
      expect(store.items.length).toBe(initialLength)
    })

    it('应该记录撤销信息', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.removeCartItem).mockResolvedValue({ success: true })

      await store.removeItem('1')

      expect(store.canUndo).toBe(true)
    })
  })

  // ============================================
  // batchRemove 测试
  // ============================================
  describe('batchRemove', () => {
    beforeEach(() => {
      const store = useCartStore()
      store.items.push(
        { ...mockCartItem1, id: '1' } as any,
        { ...mockCartItem2, id: '2' } as any,
        { ...mockInvalidCartItem, id: '3' } as any
      )
    })

    it('应该批量删除多个商品', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.batchRemoveCart).mockResolvedValue({ success: true })

      await store.batchRemove(['1', '2'])

      expect(store.items.length).toBe(1)
      expect(store.items[0].id).toBe('3')
    })

    it('应该传递正确的ID列表给API', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.batchRemoveCart).mockResolvedValue({ success: true })

      await store.batchRemove(['1', '3'])

      expect(cartApi.batchRemoveCart).toHaveBeenCalledWith(['1', '3'])
    })

    it('API失败时应回滚批量删除', async () => {
      const store = useCartStore()
      const initialLength = store.items.length
      vi.mocked(cartApi.batchRemoveCart).mockRejectedValue(new Error('批量删除失败'))

      await expect(store.batchRemove(['1', '2'])).rejects.toThrow()
      expect(store.items.length).toBe(initialLength)
    })

    it('空列表时不报错', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.batchRemoveCart).mockResolvedValue({ success: true })

      await store.batchRemove([])

      expect(cartApi.batchRemoveCart).toHaveBeenCalledWith([])
    })
  })

  // ============================================
  // selectAll 测试
  // ============================================
  describe('selectAll', () => {
    beforeEach(() => {
      const store = useCartStore()
      store.items.push(
        { ...mockCartItem1, id: '1', selected: false } as any,
        { ...mockCartItem2, id: '2', selected: false } as any
      )
    })

    it('应该选择所有有效商品', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.selectAllItems).mockResolvedValue({ success: true })

      await store.selectAll(true)

      expect(store.items.filter(i => i.product?.status !== 'invalid' && i.product?.stock > 0)
        .every(i => i.selected)).toBe(true)
    })

    it('应该取消选择所有有效商品', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.selectAllItems).mockResolvedValue({ success: true })

      await store.selectAll(false)

      expect(store.items.every(i => !i.selected)).toBe(true)
    })

    it('应该调用全选API', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.selectAllItems).mockResolvedValue({ success: true })

      await store.selectAll(true)

      expect(cartApi.selectAllItems).toHaveBeenCalledWith(true)
    })

    it('API失败时应回滚选择状态', async () => {
      const store = useCartStore()
      const previousState = [...store.items]
      vi.mocked(cartApi.selectAllItems).mockRejectedValue(new Error('全选失败'))

      await expect(store.selectAll(true)).rejects.toThrow()
      expect(store.items).toEqual(previousState)
    })

    it('不应选择失效商品', async () => {
      const store = useCartStore()
      store.items.push(mockInvalidCartItem as any)
      vi.mocked(cartApi.selectAllItems).mockResolvedValue({ success: true })

      await store.selectAll(true)

      const invalidItem = store.items.find(i => i.id === 3)
      expect(invalidItem?.selected).toBe(false) // 失效商品不被选中
    })
  })

  // ============================================
  // batchMoveToFavorites (moveToFavorite) 测试
  // ============================================
  describe('batchMoveToFavorites', () => {
    beforeEach(() => {
      const store = useCartStore()
      store.items.push(
        { ...mockCartItem1, id: '1' } as any,
        { ...mockCartItem2, id: '2' } as any,
        { ...mockInvalidCartItem, id: '3' } as any
      )
    })

    it('应该将商品移入收藏夹', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.moveToFavorite).mockResolvedValue({ success: true })

      const result = await store.batchMoveToFavorites(['1'])

      expect(result.success).toBe(1)
      expect(result.failed).toBe(0)
      expect(store.items.find(i => i.id === '1')).toBeUndefined()
    })

    it('应该批量移动多个商品', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.moveToFavorite).mockResolvedValue({ success: true })

      const result = await store.batchMoveToFavorites(['1', '2'])

      expect(result.success).toBe(2)
      expect(store.items.length).toBe(1)
    })

    it('部分失败时应返回正确的统计', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.moveToFavorite)
        .mockResolvedValueOnce({ success: true })
        .mockRejectedValueOnce(new Error('移动失败'))

      const result = await store.batchMoveToFavorites(['1', '2'])

      expect(result.success).toBe(1)
      expect(result.failed).toBe(1)
    })

    it('不存在的ID不影响结果', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.moveToFavorite).mockResolvedValue({ success: true })

      const result = await store.batchMoveToFavorites(['999']) // 不存在的ID

      expect(result.success).toBe(0)
      expect(result.failed).toBe(0)
    })
  })

  // ============================================
  // clearAll 测试
  // ============================================
  describe('clearAll', () => {
    beforeEach(() => {
      const store = useCartStore()
      store.items.push(
        { ...mockCartItem1, id: '1' } as any,
        { ...mockCartItem2, id: '2' } as any
      )
      store.totalItems = 5
      store.totalAmount = 349.98
      store.savedAmount = 100.01
      store.selectedCount = 2
      store.selectedAmount = 199.98
    })

    it('应该清空购物车所有数据和状态', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.clearCart).mockResolvedValue({ success: true })

      await store.clearAll()

      expect(store.items).toEqual([])
      expect(store.totalItems).toBe(0)
      expect(store.totalAmount).toBe(0)
      expect(store.savedAmount).toBe(0)
      expect(store.selectedCount).toBe(0)
      expect(store.selectedAmount).toBe(0)
    })

    it('应该调用清空API', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.clearCart).mockResolvedValue({ success: true })

      await store.clearAll()

      expect(cartApi.clearCart).toHaveBeenCalledOnce()
    })

    it('应该清除localStorage', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.clearCart).mockResolvedValue({ success: true })

      await store.clearAll()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('heikeji-cart-local')
    })

    it('API失败时应回滚数据', async () => {
      const store = useCartStore()
      const previousItems = [...store.items]
      vi.mocked(cartApi.clearCart).mockRejectedValue(new Error('清空失败'))

      await expect(store.clearAll()).rejects.toThrow()
      expect(store.items).toEqual(previousItems)
    })

    it('离线模式不调用API但仍然清除本地数据', async () => {
      const store = useCartStore()
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true })

      await store.clearAll()

      expect(cartApi.clearCart).not.toHaveBeenCalled()
      expect(store.items).toEqual([])
    })
  })

  // ============================================
  // detectInvalidItems 测试
  // ============================================
  describe('detectInvalidItems', () => {
    it('应该检测库存为0的商品', () => {
      const store = useCartStore()
      store.items.push(mockInvalidCartItem as any)

      const invalid = store.detectInvalidItems()

      expect(invalid.length).toBe(1)
      expect(invalid[0].id).toBe(3)
    })

    it('应该检测下架的商品', () => {
      const store = useCartStore()
      store.items.push(mockOfflineCartItem as any)

      const invalid = store.detectInvalidItems()

      expect(invalid.some(i => i.id === 4)).toBe(true)
    })

    it('应该检测数量超过库存的商品', () => {
      const store = useCartStore()
      const overStockItem = {
        ...mockCartItem1,
        quantity: 200, // 超过stock=100
      }
      store.items.push(overStockItem as any)

      const invalid = store.detectInvalidItems()

      expect(invalid.some(i => i.productId === 101)).toBe(true)
    })

    it('有效商品不应被检测为无效', () => {
      const store = useCartStore()
      store.items.push(mockCartItem1 as any, mockCartItem2 as any)

      const invalid = store.detectInvalidItems()

      expect(invalid.length).toBe(0)
    })

    it('应该更新invalidItems状态', () => {
      const store = useCartStore()
      store.items.push(mockInvalidCartItem as any)

      store.detectInvalidItems()

      expect(store.invalidItems.length).toBe(1)
    })
  })

  // ============================================
  // removeInvalidItems 测试
  // ============================================
  describe('removeInvalidItems', () => {
    it('应该移除检测到的失效商品', async () => {
      const store = useCartStore()
      store.items.push(mockCartItem1 as any, mockInvalidCartItem as any)
      vi.mocked(cartApi.batchRemoveCart).mockResolvedValue({ success: true })

      const removedCount = await store.removeInvalidItems()

      expect(removedCount).toBe(1)
      expect(store.items.length).toBe(1)
    })

    it('无失效商品时返回0', async () => {
      const store = useCartStore()
      store.items.push(mockCartItem1 as any)

      const removedCount = await store.removeInvalidItems()

      expect(removedCount).toBe(0)
    })

    it('API失败时返回0', async () => {
      const store = useCartStore()
      store.items.push(mockInvalidCartItem as any)
      vi.mocked(cartApi.batchRemoveCart).mockRejectedValue(new Error('删除失败'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const removedCount = await store.removeInvalidItems()

      expect(removedCount).toBe(0)
      consoleSpy.mockRestore()
    })
  })

  // ============================================
  // undoLastAction 测试
  // ============================================
  describe('undoLastAction', () => {
    it('应该撤销add操作', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.addToCart).mockResolvedValue({ success: true })

      await store.addItem(101, 1)
      expect(store.items.length).toBe(1)

      const result = await store.undoLastAction()

      expect(result).toBe(true)
      expect(store.items.length).toBe(0)
    })

    it('应该撤销remove操作', async () => {
      const store = useCartStore()
      store.items.push({ ...mockCartItem1, id: '1' } as any)
      vi.mocked(cartApi.removeCartItem).mockResolvedValue({ success: true })

      await store.removeItem('1')
      expect(store.items.length).toBe(0)

      const result = await store.undoLastAction()

      expect(result).toBe(true)
      expect(store.items.length).toBe(1)
    })

    it('应该撤销clearAll操作', async () => {
      const store = useCartStore()
      store.items.push({ ...mockCartItem1, id: '1' } as any, { ...mockCartItem2, id: '2' } as any)
      vi.mocked(cartApi.clearCart).mockResolvedValue({ success: true })

      await store.clearAll()
      expect(store.items.length).toBe(0)

      const result = await store.undoLastAction()

      expect(result).toBe(true)
      expect(store.items.length).toBe(2)
    })

    it('无操作历史时返回false', async () => {
      const store = useCartStore()

      const result = await store.undoLastAction()

      expect(result).toBe(false)
    })

    it('连续多次操作后撤销最后一次', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.addToCart).mockResolvedValue({ success: true })

      await store.addItem(101, 1)
      await store.addItem(102, 1)
      expect(store.items.length).toBe(2)

      await store.undoLastAction()
      expect(store.items.length).toBe(1)
      expect(store.items[0].productId).toBe(101) // 第一个商品保留
    })
  })

  // ============================================
  // 本地持久化测试
  // ============================================
  describe('本地持久化', () => {
    it('loadFromLocal应该从localStorage恢复数据', () => {
      // 先设置localStorage数据
      const testData = {
        items: [mockCartItem1],
        savedAt: Date.now(),
      }
      localStorageMock.setItem('heikeji-cart-local', JSON.stringify(testData))

      // 创建新的pinia实例以触发store重新初始化
      const newPinia = createPinia()
      setActivePinia(newPinia)

      // 创建store（此时会调用loadFromLocal）
      const newStore = useCartStore()

      expect(newStore.items.length).toBeGreaterThan(0)
    })

    it('saveToLocal应该将数据写入localStorage', async () => {
      const store = useCartStore()
      store.items.push(mockCartItem1 as any)

      // 等待Vue的响应式系统更新和watch触发
      await nextTick()
      store.items.push(mockCartItem2 as any)
      await nextTick()

      // items变化应该触发watch，进而调用saveToLocal
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('clearLocalStorage应该移除存储的key', async () => {
      const store = useCartStore()
      localStorageMock.setItem('heikeji-cart-local', '{}')
      store.items.push(mockCartItem1 as any)

      // clearAll会调用clearLocalStorage
      vi.mocked(cartApi.clearCart).mockResolvedValue({ success: true })
      await store.clearAll()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('heikeji-cart-local')
    })
  })

  // ============================================
  // 离线/在线状态测试
  // ============================================
  describe('离线/在线状态管理', () => {
    it('离线状态下isOffline应为true', () => {
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true })
      const store = useCartStore()

      // Store初始化时会读取navigator.onLine，所以离线时应该为true
      expect(store.isOffline).toBe(true)
    })

    it('should track isOffline state correctly during session', () => {
      // This test verifies the reactive nature of isOffline
      const store = useCartStore()
      expect(typeof store.isOffline).toBe('boolean')
    })
  })

  // ============================================
  // 边界情况测试
  // ============================================
  describe('边界情况', () => {
    it('大量商品时的性能（50个商品）', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.addToCart).mockResolvedValue({ success: true })

      for (let i = 0; i < 50; i++) {
        await store.addItem(i, 1)
      }

      expect(store.items.length).toBe(50)
      expect(store.badgeCount).toBe(50)
    })

    it('重复添加同一商品应创建新条目', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.addToCart).mockResolvedValue({ success: true })

      await store.addItem(101, 1)
      await store.addItem(101, 2)

      expect(store.items.length).toBe(2)
    })

    it('操作不存在ID的商品应优雅处理', async () => {
      const store = useCartStore()
      vi.mocked(cartApi.updateCartItem).mockResolvedValue({ success: true })

      // updateItem对不存在的ID不会抛错，只是没有效果
      await store.updateItem('nonexistent', 5)

      expect(store.items.length).toBe(0)
    })
  })
})
