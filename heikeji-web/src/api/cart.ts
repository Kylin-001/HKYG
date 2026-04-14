import { get, post, put, del } from '@/utils/request'
import type { CartItem, CartResponse, AddToCartRequest, UpdateCartRequest } from '@/types/cart'

export function getCart(): Promise<CartResponse> {
  return get('/cart')
}

export function addToCart(data: AddToCartRequest): Promise<CartItem> {
  return post('/cart', data)
}

export function updateCartItem(data: UpdateCartRequest): Promise<CartItem> {
  return put(`/cart/${data.itemId}`, { quantity: data.quantity, selected: data.selected })
}

export function removeCartItem(itemId: string): Promise<void> {
  return del(`/cart/${itemId}`)
}

export function batchRemoveCart(itemIds: string[]): Promise<void> {
  return post('/cart/batch-remove', { itemIds })
}

export function selectAllItems(selected: boolean): Promise<void> {
  return post('/cart/select-all', { selected })
}

export function moveToFavorite(itemId: string): Promise<void> {
  return post(`/cart/${itemId}/move-favorite`)
}

export function clearCart(): Promise<void> {
  return del('/cart/clear')
}
