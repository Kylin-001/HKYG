import request from '@/utils/request'

export function getLostFoundList(params) {
  return request({
    url: '/api/lostfound/search',
    method: 'get',
    params
  })
}

export function getLostFoundDetail(id) {
  return request({
    url: `/api/lostfound/detail/${id}`,
    method: 'get'
  })
}

export function publishLostFound(data) {
  return request({
    url: '/api/lostfound/publish',
    method: 'post',
    data
  })
}

export function updateLostFound(data) {
  return request({
    url: `/api/lostfound/status/${data.id}`,
    method: 'put',
    data
  })
}

export function updateLostFoundStatus(id, status) {
  return request({
    url: `/api/lostfound/status/${id}`,
    method: 'put',
    params: { status }
  })
}

export function deleteLostFound(id) {
  return request({
    url: `/api/lostfound/status/${id}`,
    method: 'put',
    params: { status: 4 }
  })
}

export function auditLostFound(id, status, auditRemark) {
  return request({
    url: `/api/lostfound/audit/${id}`,
    method: 'put',
    params: { status, auditRemark }
  })
}

export function getLostFoundHot(limit) {
  return request({
    url: '/api/lostfound/hot',
    method: 'get',
    params: { limit }
  })
}
