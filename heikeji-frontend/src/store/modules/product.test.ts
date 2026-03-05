import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '@/store/modules/product'

describe('Product Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = useProductStore()
    expect(store.products).toEqual([])
    expect(store.categories).toEqual([])
    expect(store.currentProduct).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('should set products correctly', () => {
    const store = useProductStore()
    const testProducts = [
      { id: 1, productName: '商品1', price: 99 },
      { id: 2, productName: '商品2', price: 199 }
    ]
    
    store.setProducts(testProducts)
    expect(store.products).toEqual(testProducts)
  })

  it('should set categories correctly', () => {
    const store = useProductStore()
    const testCategories = [
      { id: 1, categoryName: '食品' },
      { id: 2, categoryName: '饮料' }
    ]
    
    store.setCategories(testCategories)
    expect(store.categories).toEqual(testCategories)
  })

  it('should set current product correctly', () => {
    const store = useProductStore()
    const testProduct = { id: 1, productName: '商品1', price: 99 }
    
    store.setCurrentProduct(testProduct)
    expect(store.currentProduct).toEqual(testProduct)
  })

  it('should set loading state correctly', () => {
    const store = useProductStore()
    
    store.setLoading(true)
    expect(store.loading).toBe(true)
    
    store.setLoading(false)
    expect(store.loading).toBe(false)
  })

  it('should add product to list', () => {
    const store = useProductStore()
    const newProduct = { id: 3, productName: '商品3', price: 299 }
    
    store.addProduct(newProduct)
    expect(store.products).toContainEqual(newProduct)
  })

  it('should update product in list', () => {
    const store = useProductStore()
    const products = [
      { id: 1, productName: '商品1', price: 99 },
      { id: 2, productName: '商品2', price: 199 }
    ]
    store.setProducts(products)
    
    const updatedProduct = { id: 1, productName: '商品1更新', price: 109 }
    store.updateProduct(updatedProduct)
    
    const found = store.products.find(p => p.id === 1)
    expect(found).toEqual(updatedProduct)
  })

  it('should remove product from list', () => {
    const store = useProductStore()
    const products = [
      { id: 1, productName: '商品1', price: 99 },
      { id: 2, productName: '商品2', price: 199 }
    ]
    store.setProducts(products)
    
    store.removeProduct(1)
    expect(store.products).not.toContainEqual(
      expect.objectContaining({ id: 1 })
    )
    expect(store.products.length).toBe(1)
  })
})
