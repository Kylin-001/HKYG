import { get, post, put, del } from '@/utils/request'
import type { SecondhandItem, PublishSecondhandRequest, SecondhandListParams } from '@/types/secondhand'

export function getSecondhandList(params?: SecondhandListParams): Promise<{ list: SecondhandItem[]; total: number }> {
  return get('/secondhand/items', { params })
}

export function getSecondhandDetail(itemId: string): Promise<SecondhandItem> {
  return get(`/secondhand/items/${itemId}`)
}

export function publishItem(data: PublishSecondhandRequest): Promise<SecondhandItem> {
  return post('/secondhand/items', data)
}

export function updateItem(id: string, data: Partial<PublishSecondhandRequest>): Promise<SecondhandItem> {
  return put(`/secondhand/items/${id}`, data)
}

export function deleteItem(id: string): Promise<void> {
  return del(`/secondhand/items/${id}`)
}

export function likeItem(itemId: string): Promise<void> {
  return post(`/secondhand/items/${itemId}/like`)
}

export function unlikeItem(itemId: string): Promise<void> {
  return del(`/secondhand/items/${itemId}/like`)
}

export function getMyItems(params?: { status?: string }): Promise<{ list: SecondhandItem[] }> {
  return get('/secondhand/my-items', { params })
}

export function getCategories(): Promise<{ id: string; name: string; count: number }[]> {
  return get('/secondhand/categories')
}
