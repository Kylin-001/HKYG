import { describe, it, expect, vi, beforeEach } from 'vitest'
import { testUserData } from '@/config/test';
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '@/store/modules/cart'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockProduct = {
    id: 1,
    productName: '测试商品',
    price: 99.99,
    stock: 100
  }

  it('should initialize with default state', () => {
    const store = useCartStore()
    expect(store.cartItems).toEqual([])
    expect(store.totalQuantity).toBe(0)
    expect(store.totalAmount).toBe(0)
  })

  it('should add item to cart', () => {
    const store = useCartStore()
    store.addToCart(mockProduct, 2)
    
    expect(store.cartItems.length).toBe(1)
    expect(store.cartItems[0]).toEqual(
      expect.objectContaining({
        productId: 1,
        quantity: 2
      })
    )
  })

  it('should update quantity if item already exists', () => {
    const store = useCartStore()
    store.addToCart(mockProduct, 2)
    store.addToCart(mockProduct, 3)
    
    expect(store.cartItems.length).toBe(1)
    expect(store.cartItems[0].quantity).toBe(5)
  })

  it('should remove item from cart', () => {
    const store = useCartStore()
    store.addToCart(mockProduct, 2)
    store.removeFromCart(1)
    
    expect(store.cartItems.length).toBe(0)
  })

  it('should update item quantity', () => {
    const store = useCartStore()
    store.addToCart(mockProduct, 2)
    store.updateQuantity(1, 5)
    
    expect(store.cartItems[0].quantity).toBe(5)
  })

  it('should clear cart', () => {
    const store = useCartStore()
    store.addToCart(mockProduct, 2)
    store.addToCart({ ...mockProduct, id: 2 }, 1)
    store.clearCart()
    
    expect(store.cartItems).toEqual([])
    expect(store.totalQuantity).toBe(0)
    expect(store.totalAmount).toBe(0)
  })

  it('should calculate total quantity correctly', () => {
    const store = useCartStore()
    store.addToCart(mockProduct, 2)
    store.addToCart({ ...mockProduct, id: 2 }, 3)
    
    expect(store.totalQuantity).toBe(5)
  })

  it('should calculate total amount correctly', () => {
    const store = useCartStore()
    store.addToCart(mockProduct, 2)
    store.addToCart({ ...mockProduct, id: 2, price: 49.99 }, 3)
    
    const expectedTotal = 99.99 * 2 + 49.99 * 3
    expect(store.totalAmount).toBeCloseTo(expectedTotal, 2)
  })

  it('should not add item if stock is insufficient', () => {
    const store = useCartStore()
    const outOfStockProduct = { ...mockProduct, stock: 1 }
    
    store.addToCart(outOfStockProduct, 5)
    expect(store.cartItems.length).toBe(0)
  })
})
