import request from '@/utils/request'

export function chat(data) {
  return request({
    url: '/api/customer-service/chat',
    method: 'post',
    data,
  })
}

export function getHistory(sessionId) {
  return request({
    url: `/api/customer-service/history/${sessionId}`,
    method: 'get',
  })
}

export function clearChatHistory(sessionId) {
  return request({
    url: `/api/customer-service/history/${sessionId}`,
    method: 'delete',
  })
}

export function getQuickReplies() {
  return request({
    url: '/api/customer-service/quick-replies',
    method: 'get',
  })
}

export function getEvaluationOptions() {
  return request({
    url: '/api/customer-service/evaluaion/options',
    method: 'get',
  })
}

export function submitFeedback(data) {
  return request({
    url: '/api/customer-service/feedback',
    method: 'post',
    data,
  })
}
