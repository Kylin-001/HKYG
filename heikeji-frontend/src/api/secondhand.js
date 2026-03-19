import request from '@/utils/request'

export function getSecondhandList(params) {
  return request({
    url: '/api/secondhand/search',
    method: 'get',
    params,
  })
}

export function getSecondhandDetail(id) {
  return request({
    url: `/api/secondhand/detail/${id}`,
    method: 'get',
  })
}

export function publishSecondhand(data) {
  return request({
    url: '/api/secondhand/publish',
    method: 'post',
    data,
  })
}

export function updateSecondhand(data) {
  return request({
    url: `/api/secondhand/status/${data.id}`,
    method: 'put',
    data,
  })
}

export function updateSecondhandStatus(id, status) {
  return request({
    url: `/api/secondhand/status/${id}`,
    method: 'put',
    params: { status },
  })
}

export function deleteSecondhand(id) {
  return request({
    url: `/api/secondhand/status/${id}`,
    method: 'put',
    params: { status: 4 },
  })
}

export function auditSecondhand(id, status, auditRemark) {
  return request({
    url: `/api/secondhand/audit/${id}`,
    method: 'put',
    params: { status, auditRemark },
  })
}

export function getSecondhandHot(limit) {
  return request({
    url: '/api/secondhand/hot',
    method: 'get',
    params: { limit },
  })
}

export function getSecondhandRecommend(userId, limit) {
  return request({
    url: '/api/secondhand/recommend',
    method: 'get',
    params: { userId, limit },
  })
}
