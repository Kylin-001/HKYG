import request from '@/utils/request'

// 用户管理相关API - 使用AdminUserController
export function getUserList(params) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params,
  })
}

export function getUserDetail(userId) {
  return request({
    url: `/api/user/${userId}`,
    method: 'get',
  })
}

export function updateUserStatus(userId, status) {
  return request({
    url: `/api/user/${userId}/status`,
    method: 'put',
    params: { status },
  })
}

export function resetUserPassword(userId, newPassword) {
  return request({
    url: `/api/user/${userId}/reset`,
    method: 'put',
  })
}

export function updateUserInfo(userId, data) {
  return request({
    url: `/api/user/${userId}`,
    method: 'put',
    data,
  })
}

export function deleteUser(userId) {
  return request({
    url: `/api/user/${userId}`,
    method: 'delete',
  })
}

export function addUser(data) {
  return request({
    url: '/api/user/',
    method: 'post',
    data,
  })
}

export function batchDeleteUser(ids) {
  return request({
    url: '/api/user/batch',
    method: 'delete',
    data: ids,
  })
}

export function changePassword(params) {
  return request({
    url: '/api/user/password',
    method: 'put',
    data: params,
  })
}

// 会员等级相关API
export function getUserLevelList() {
  return request({
    url: '/user/level/list',
    method: 'get',
  })
}

export function addUserLevel(data) {
  return request({
    url: '/user/level/add',
    method: 'post',
    data,
  })
}

export function updateUserLevel(id, data) {
  return request({
    url: `/user/level/update/${id}`,
    method: 'put',
    data,
  })
}

export function deleteUserLevel(id) {
  return request({
    url: `/user/level/delete/${id}`,
    method: 'delete',
  })
}

// 用户地址相关API
export function getUserAddressList(userId, params) {
  return request({
    url: `/user/address/list/${userId}`,
    method: 'get',
    params,
  })
}

export function getUserAddressDetail(addressId) {
  return request({
    url: `/user/address/detail/${addressId}`,
    method: 'get',
  })
}

export function updateUserAddressStatus(addressId, isDefault) {
  return request({
    url: `/user/address/status/${addressId}`,
    method: 'put',
    params: { isDefault },
  })
}

export function deleteUserAddress(addressId) {
  return request({
    url: `/user/address/delete/${addressId}`,
    method: 'delete',
  })
}

// 用户统计相关API - 暂时保留，实际项目中需要根据后端实现调整
export function getUserStatistics() {
  return request({
    url: '/api/user/statistics',
    method: 'get',
  })
}

export function getNewUserTrend(timeRange) {
  return request({
    url: '/api/user/new/trend',
    method: 'get',
    params: { timeRange },
  })
}

export function exportUserList(params) {
  return request({
    url: '/api/user/export',
    method: 'get',
    params,
    responseType: 'blob',
  })
}
