import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SecondhandItem, SecondhandListParams, PublishSecondhandRequest } from '@/types/secondhand'
import * as secondhandApi from '@/api/secondhand'

export const useSecondhandStore = defineStore('secondhand', () => {
  const list = ref<SecondhandItem[]>([])
  const currentItem = ref<SecondhandItem | null>(null)
  const myItems = ref<SecondhandItem[]>([])
  const categories = ref<{ id: string; name: string; count: number }[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchList(params?: SecondhandListParams) {
    try {
      loading.value = true
      error.value = null
      const res = await secondhandApi.getSecondhandList(params)
      list.value = res.list || []
      total.value = res.total || 0
      return list.value
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取二手列表失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDetail(itemId: string) {
    try {
      loading.value = true
      const res = await secondhandApi.getSecondhandDetail(itemId)
      currentItem.value = res
      return currentItem.value
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取详情失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function publishItem(data: PublishSecondhandRequest) {
    const res = await secondhandApi.publishItem(data)
    return res
  }

  async function likeItem(itemId: string) {
    await secondhandApi.likeItem(itemId)
    if (currentItem.value?.id === itemId) {
      currentItem.value.likes++
    }
  }

  async function unlikeItem(itemId: string) {
    await secondhandApi.unlikeItem(itemId)
    if (currentItem.value?.id === itemId && currentItem.value.likes > 0) {
      currentItem.value.likes--
    }
  }

  async function deleteItem(id: string) {
    await secondhandApi.deleteItem(id)
    list.value = list.value.filter(item => item.id !== id)
  }

  async function fetchMyItems(status?: string) {
    try {
      const res = await secondhandApi.getMyItems({ status })
      myItems.value = res.list || []
      return myItems.value
    } catch (err) {
      console.error('获取我的发布失败:', err)
      return []
    }
  }

  async function fetchCategories() {
    try {
      const res = await secondhandApi.getCategories()
      categories.value = res || []
    } catch (err) {
      console.error('获取分类失败:', err)
    }
  }

  return {
    list,
    currentItem,
    myItems,
    categories,
    total,
    loading,
    error,
    fetchList,
    fetchDetail,
    publishItem,
    likeItem,
    unlikeItem,
    deleteItem,
    fetchMyItems,
    fetchCategories,
  }
})
