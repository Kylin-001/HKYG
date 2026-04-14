import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { CartItem, CartResponse } from '@/types/cart'
import * as cartApi from '@/api/cart'

// ====== 常量 ======

const CART_STORAGE_KEY = 'heikeji-cart-local'
const SYNC_DEBOUNCE_TIME = 1000 // 同步防抖时间(ms)
const MAX_LOCAL_ITEMS = 50 // 最大本地缓存商品数

interface LocalCartItem extends CartItem {
  /** 是否为本地新增（尚未同步到服务端） */
  isLocal?: boolean
  /** 最后同步时间 */
  lastSyncTime?: number
}

// ====== 购物车 Store ======

export const useCartStore = defineStore('cart', () => {
  // 状态
  const items = ref<LocalCartItem[]>([])
  const totalItems = ref(0)
  const totalAmount = ref(0)
  const savedAmount = ref(0)
  const selectedCount = ref(0)
  const selectedAmount = ref(0)
  const loading = ref(false)
  const syncing = ref(false)
  const isOffline = ref(!navigator.onLine)

  // 失效商品
  const invalidItems = ref<CartItem[]>([])

  // 撤销栈（用于操作撤销）
  const undoStack: Array<{
    action: string
    items: CartItem[]
    timestamp: number
  }> = []

  let syncTimer: ReturnType<typeof setTimeout> | null = null

  // 计算属性
  const hasItems = computed(() => items.value.length > 0)
  const badgeCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  /**
   * 有效商品列表（排除失效商品）
   */
  const validItems = computed(() =>
    items.value.filter(item =>
      item.product?.status !== 'invalid' &&
      item.product?.status !== 'offline' &&
      item.product?.status !== 'deleted' &&
      (item.product?.stock ?? 0) > 0
    )
  )

  /**
   * 失效商品列表
   */
  const expiredItems = computed(() =>
    items.value.filter(item =>
      item.product?.status === 'invalid' ||
      item.product?.status === 'offline' ||
      item.product?.status === 'deleted' ||
      (item.product?.stock ?? 0) <= 0 ||
      item.quantity > (item.product?.stock ?? 0)
    )
  )

  /**
   * 已选中的商品
   */
  const selectedItems = computed(() => items.value.filter(item => item.selected))

  /**
   * 是否全选
   */
  const isAllSelected = computed(() =>
    validItems.value.length > 0 && validItems.value.every(item => item.selected)
  )

  // ====== 本地持久化 ======

  /**
   * 从localStorage加载购物车
   */
  function loadFromLocal(): void {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)

        if (Array.isArray(data.items)) {
          items.value = data.items.map((item: any) => ({
            ...item,
            isLocal: true,
          }))
        }

        // 标记为需要同步
        markForSync()
      }
    } catch (e) {
      console.error('[Cart] Failed to load from localStorage:', e)
    }
  }

  /**
   * 保存到localStorage
   */
  function saveToLocal(): void {
    try {
      const dataToSave = {
        items: items.value.map(({ isLocal, lastSyncTime, ...item }) => item),
        savedAt: Date.now(),
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (e) {
      console.error('[Cart] Failed to save to localStorage:', e)
    }
  }

  /**
   * 清除本地存储
   */
  function clearLocalStorage(): void {
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch (e) {}
  }

  // ====== 数据同步 ======

  /**
   * 标记所有本地数据需要同步
   */
  function markForSync(): void {
    items.value.forEach(item => {
      if (item.isLocal) {
        item.lastSyncTime = 0
      }
    })
  }

  /**
   * 防抖同步到服务端
   */
  function debounceSync(): void {
    if (syncTimer) {
      clearTimeout(syncTimer)
    }

    syncTimer = setTimeout(() => {
      syncToServer()
    }, SYNC_DEBOUNCE_TIME)
  }

  /**
   * 同步到服务端
   */
  async function syncToServer(): Promise<void> {
    if (!navigator.onLine || syncing.value) return

    const localItems = items.value.filter(item => item.isLocal || !item.lastSyncTime)

    if (localItems.length === 0) return

    syncing.value = true

    try {
      // 批量同步本地新增的商品
      for (const localItem of localItems) {
        if (localItem.isLocal) {
          await cartApi.addToCart({
            productId: localItem.productId,
            quantity: localItem.quantity,
            specifications: localItem.specifications,
          })

          // 标记已同步
          const index = items.value.findIndex(i => i.id === localItem.id)
          if (index > -1) {
            items.value[index].isLocal = false
            items.value[index].lastSyncTime = Date.now()
          }
        }
      }

      saveToLocal()
    } catch (error) {
      console.error('[Cart] Sync failed:', error)
    } finally {
      syncing.value = false
    }
  }

  // ====== 失效检测 ======

  /**
   * 检测失效商品
   */
  function detectInvalidItems(): CartItem[] {
    const invalid: CartItem[] = []

    items.value.forEach(item => {
      // 商品下架或库存不足
      if (
        item.product?.status === 'offline' ||
        item.product?.status === 'deleted' ||
        (item.product?.stock ?? 0) <= 0 ||
        item.quantity > (item.product?.stock ?? 0)
      ) {
        invalid.push(item as CartItem)
      }
    })

    invalidItems.value = invalid
    return invalid
  }

  /**
   * 移除失效商品
   */
  async function removeInvalidItems(): Promise<number> {
    const invalid = detectInvalidItems()

    if (invalid.length === 0) return 0

    const invalidIds = invalid.map(item => item.id)

    try {
      await cartApi.batchRemoveCart(invalidIds)

      // 从本地状态移除
      items.value = items.value.filter(item => !invalidIds.includes(item.id))
      saveToLocal()

      await recalculateTotals()
      return invalid.length
    } catch (error) {
      console.error('[Cart] Failed to remove invalid items:', error)
      return 0
    }
  }

  // ====== CRUD 操作 ======

  /**
   * 获取购物车（从服务端）
   */
  async function fetchCart(forceRefresh = false): Promise<void> {
    try {
      loading.value = true

      // 如果离线且本地有数据，使用本地数据
      if (!navigator.onLine && items.value.length > 0 && !forceRefresh) {
        recalculateTotals()
        return
      }

      const res = await cartApi.getCart()
      const data: CartResponse = res

      items.value = (data.items || []).map(item => ({
        ...item,
        isLocal: false,
        lastSyncTime: Date.now(),
      }))
      totalItems.value = data.totalItems || 0
      totalAmount.value = data.totalAmount || 0
      savedAmount.value = data.savedAmount || 0
      selectedCount.value = data.selectedCount || 0
      selectedAmount.value = data.selectedAmount || 0

      // 合并本地未同步的数据
      mergeLocalData()

      // 保存到本地
      saveToLocal()

      // 检测失效商品
      detectInvalidItems()
    } catch (err) {
      console.error('获取购物车失败:', err)

      // 如果请求失败，尝试使用本地数据
      if (items.value.length === 0) {
        loadFromLocal()
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * 合并本地未同步数据到服务端数据
   */
  function mergeLocalData(): void {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    if (!saved) return

    try {
      const localData = JSON.parse(saved)
      const localItems = localData.items || []

      localItems.forEach((localItem: CartItem) => {
        // 如果服务端没有这个商品，添加到列表中
        const exists = items.value.some(
          item =>
            item.productId === localItem.productId &&
            JSON.stringify(item.specifications) === JSON.stringify(localItem.specifications)
        )

        if (!exists) {
          items.value.push({
            ...localItem,
            isLocal: true,
          })
        }
      })
    } catch (e) {}
  }

  /**
   * 添加商品到购物车
   */
  async function addItem(productId: string | number, quantity: number = 1): Promise<any> {
    // 先添加到本地（乐观更新）
    const newItem: LocalCartItem = {
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: String(productId),
      product: {} as any, // 产品详情会在同步后填充
      quantity,
      selected: true,
      addedAt: new Date().toISOString(),
      isLocal: true,
    }

    items.value.push(newItem)
    saveToLocal()
    recalculateTotals()

    // 记录撤销信息
    pushUndoStack('add', [newItem])

    let res: any

    try {
      // 尝试立即同步
      if (navigator.onLine) {
        res = await cartApi.addToCart({ productId, quantity })
        // 更新为服务端返回的真实ID
        if (res?.id) {
          const index = items.value.findIndex(i => i.id === newItem.id)
          if (index > -1) {
            items.value[index].id = res.id
            items.value[index].isLocal = false
            items.value[index].lastSyncTime = Date.now()
            if (res.product) {
              items.value[index].product = res.product
            }
          }
        }
        saveToLocal()
      } else {
        // 离线时标记待同步
        debounceSync()
      }

      return res
    } catch (error) {
      console.error('添加购物车失败:', error)
      throw error
    }
  }

  /**
   * 更新购物车项
   */
  async function updateItem(itemId: string, quantity?: number, selected?: boolean): Promise<void> {
    // 保存原始数据用于撤销和回滚
    const originalItem = items.value.find(i => i.id === itemId)
    const originalQuantity = originalItem?.quantity
    const originalSelected = originalItem?.selected

    try {
      // 乐观更新
      const index = items.value.findIndex(i => i.id === itemId)
      if (index > -1) {
        if (quantity !== undefined) {
          items.value[index].quantity = Math.max(1, quantity)
        }
        if (selected !== undefined) {
          items.value[index].selected = selected
        }
      }

      saveToLocal()
      recalculateTotals()

      // 记录撤销
      if (originalItem) {
        pushUndoStack('update', [originalItem])
      }

      // 同步到服务端
      if (navigator.onLine && !items.value[index]?.isLocal) {
        await cartApi.updateCartItem({ itemId, quantity, selected })
      } else {
        debounceSync()
      }
    } catch (error) {
      // 回滚：恢复原始值
      if (originalItem) {
        const index = items.value.findIndex(i => i.id === itemId)
        if (index > -1) {
          if (originalQuantity !== undefined) {
            items.value[index].quantity = originalQuantity
          }
          if (originalSelected !== undefined) {
            items.value[index].selected = originalSelected
          }
        }
      }
      throw error
    }
  }

  /**
   * 移除单个商品
   */
  async function removeItem(itemId: string): Promise<void> {
    const itemToRemove = items.value.find(i => i.id === itemId)

    try {
      items.value = items.value.filter(i => i.id !== itemId)
      saveToLocal()
      recalculateTotals()

      // 记录撤销
      if (itemToRemove) {
        pushUndoStack('remove', [itemToRemove])
      }

      if (navigator.onLine && itemToRemove && !itemToRemove.isLocal) {
        await cartApi.removeCartItem(itemId)
      } else {
        debounceSync()
      }
    } catch (error) {
      // 回滚
      if (itemToRemove) {
        items.value.push(itemToRemove)
      }
      throw error
    }
  }

  // ====== 批量操作 ======

  /**
   * 批量删除
   */
  async function batchRemove(itemIds: string[]): Promise<void> {
    const itemsToRemove = items.value.filter(i => itemIds.includes(i.id))

    try {
      items.value = items.value.filter(i => !itemIds.includes(i.id))
      saveToLocal()
      recalculateTotals()

      // 记录撤销
      pushUndoStack('batchRemove', itemsToRemove)

      if (navigator.onLine) {
        await cartApi.batchRemoveCart(itemIds)
      } else {
        debounceSync()
      }
    } catch (error) {
      // 回滚
      items.value.push(...itemsToRemove)
      throw error
    }
  }

  /**
   * 全选/取消全选
   */
  async function selectAll(selected: boolean): Promise<void> {
    const previousState = [...items.value]

    try {
      // 选择有效商品，取消选择失效商品
      items.value.forEach(item => {
        const isValid = item.product?.status !== 'invalid' &&
          item.product?.status !== 'offline' &&
          item.product?.status !== 'deleted' &&
          (item.product?.stock ?? 0) > 0

        if (isValid) {
          item.selected = selected
        } else {
          // 失效商品始终不选中
          item.selected = false
        }
      })

      saveToLocal()
      recalculateTotals()

      if (navigator.onLine) {
        await cartApi.selectAllItems(selected)
      } else {
        debounceSync()
      }
    } catch (error) {
      // 回滚
      items.value = previousState
      throw error
    }
  }

  /**
   * 批量移入收藏夹
   */
  async function batchMoveToFavorites(itemIds: string[]): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0
    const movedItems: CartItem[] = []

    for (const itemId of itemIds) {
      const item = items.value.find(i => i.id === itemId)
      if (item) {
        try {
          if (navigator.onLine) {
            await cartApi.moveToFavorite(itemId)
          }
          items.value = items.value.filter(i => i.id !== itemId)
          movedItems.push(item)
          success++
        } catch (error) {
          console.error(`Failed to move item ${itemId} to favorites:`, error)
          failed++
        }
      }
    }

    if (movedItems.length > 0) {
      pushUndoStack('moveToFavorites', movedItems)
      saveToLocal()
      recalculateTotals()
    }

    return { success, failed }
  }

  /**
   * 清空购物车
   */
  async function clearAll(): Promise<void> {
    const previousItems = [...items.value]

    try {
      if (navigator.onLine) {
        await cartApi.clearCart()
      }

      items.value = []
      totalItems.value = 0
      totalAmount.value = 0
      savedAmount.value = 0
      selectedCount.value = 0
      selectedAmount.value = 0

      clearLocalStorage()

      pushUndoStack('clearAll', previousItems)
    } catch (error) {
      items.value = previousItems
      throw error
    }
  }

  // ====== 撤销功能 ======

  /**
   * 推入撤销栈
   */
  function pushUndoStack(action: string, items: CartItem[]): void {
    undoStack.push({
      action,
      items: [...items],
      timestamp: Date.now(),
    })

    // 只保留最近10次操作
    if (undoStack.length > 10) {
      undoStack.shift()
    }
  }

  /**
   * 撤销上一次操作
   */
  async function undoLastAction(): Promise<boolean> {
    const lastAction = undoStack.pop()
    if (!lastAction) return false

    switch (lastAction.action) {
      case 'add':
        // 删除刚才添加的商品
        items.value = items.value.filter(
          item => !lastAction.items.some(removed => removed.id === item.id)
        )
        break

      case 'remove':
      case 'batchRemove':
        // 恢复删除的商品
        items.value.push(...lastAction.items)
        break

      case 'update':
        // 恢复原始值
        lastAction.items.forEach(original => {
          const index = items.value.findIndex(i => i.id === original.id)
          if (index > -1) {
            items.value[index] = original
          }
        })
        break

      case 'clearAll':
        // 恢复所有商品
        items.value = [...lastAction.items]
        break

      case 'moveToFavorites':
        // 从收藏夹移回购物车（这里简化处理，直接恢复到购物车）
        items.value.push(...lastAction.items)
        break

      default:
        return false
    }

    saveToLocal()
    recalculateTotals()
    return true
  }

  /**
   * 是否可以撤销
   */
  const canUndo = computed(() => undoStack.length > 0)

  // ====== 辅助方法 ======

  /**
   * 重新计算总计
   */
  function recalculateTotals(): void {
    totalItems.value = items.value.reduce((sum, item) => sum + item.quantity, 0)
    totalAmount.value = items.value
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0)
    selectedCount.value = items.value.filter(item => item.selected).length
    selectedAmount.value = totalAmount.value
  }

  // ====== 事件监听 ======

  // 监听网络状态变化
  window.addEventListener('online', () => {
    isOffline.value = false
    // 网络恢复后自动同步
    syncToServer()
  })

  window.addEventListener('offline', () => {
    isOffline.value = true
  })

  // 监听items变化，自动保存
  watch(items, () => {
    saveToLocal()
  }, { deep: true })

  // 初始化时加载本地数据
  loadFromLocal()

  return {
    // 状态
    items,
    totalItems,
    totalAmount,
    savedAmount,
    selectedCount,
    selectedAmount,
    loading,
    syncing,
    isOffline,
    invalidItems,

    // 计算属性
    hasItems,
    badgeCount,
    validItems,
    expiredItems,
    selectedItems,
    isAllSelected,
    canUndo,

    // 核心方法
    fetchCart,
    addItem,
    updateItem,
    removeItem,

    // 批量操作
    batchRemove,
    selectAll,
    batchMoveToFavorites,
    clearAll,

    // 失效检测
    detectInvalidItems,
    removeInvalidItems,

    // 撤销
    undoLastAction,

    // 同步
    syncToServer,
  }
})
