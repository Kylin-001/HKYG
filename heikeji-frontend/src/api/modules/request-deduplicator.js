/**
 * 请求去重管理器模块
 * 负责取消重复的API请求，避免资源浪费
 */

import axios from 'axios'
import logger from '../../utils/logger'

export function createRequestDeduplicator() {
  const pendingRequests = new Map()

  function generateKey(config) {
    const { method, url, params, data } = config
    return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
  }

  function addPending(config) {
    const key = generateKey(config)

    // 创建取消令牌
    const cancelToken = new axios.CancelToken(cancel => {
      pendingRequests.set(key, { cancel })
    })

    // 将取消令牌添加到配置中
    config.cancelToken = cancelToken
  }

  function cancelDuplicate(config) {
    const key = generateKey(config)

    if (pendingRequests.has(key)) {
      const pending = pendingRequests.get(key)
      pending.cancel(`取消重复请求: ${key}`)
      pendingRequests.delete(key)
      logger.info('🚫 取消重复请求:', key)
    }
  }

  function removePending(config) {
    const key = generateKey(config)
    pendingRequests.delete(key)
  }

  function cancelAll() {
    pendingRequests.forEach(pending => {
      pending.cancel('取消所有待处理请求')
    })
    pendingRequests.clear()
  }

  function getPendingCount() {
    return pendingRequests.size
  }

  function getPendingList() {
    return Array.from(pendingRequests.keys())
  }

  return {
    addPending,
    cancelDuplicate,
    removePending,
    cancelAll,
    getPendingCount,
    getPendingList,
  }
}
