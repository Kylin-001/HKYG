import request from '@/utils/request'

export function getCouponList(userId) {
  return request({
    url: '/api/member/coupon/list',
    method: 'get',
    params: { userId },
  })
}

export function getCouponDetail(couponId, userId) {
  return request({
    url: `/api/member/coupon/detail/${couponId}`,
    method: 'get',
    params: { userId },
  })
}

export function receiveCoupon(couponId, userId) {
  return request({
    url: `/api/member/coupon/receive/${couponId}`,
    method: 'post',
    params: { userId },
  })
}

export function getUserCoupons(userId, status) {
  return request({
    url: '/api/member/coupon/user/list',
    method: 'get',
    params: { userId, status },
  })
}

export function useCoupon(userCouponId, orderNo) {
  return request({
    url: `/api/member/coupon/use/${userCouponId}`,
    method: 'post',
    params: { orderNo },
  })
}

export function cancelCoupon(userCouponId, orderNo) {
  return request({
    url: `/api/member/coupon/cancel/${userCouponId}`,
    method: 'post',
    params: { orderNo },
  })
}

export function getUserPoints(userId) {
  return request({
    url: '/api/member/points/balance',
    method: 'get',
    params: { userId },
  })
}

export function getUserPointRecords(userId, type) {
  return request({
    url: '/api/member/points/records',
    method: 'get',
    params: { userId, type },
  })
}

export function addPoints(userId, points, type, source, orderNo, remark) {
  return request({
    url: '/api/member/points/add',
    method: 'post',
    data: { userId, points, type, source, orderNo, remark },
  })
}

export function deductPoints(userId, points, source, orderNo, remark) {
  return request({
    url: '/api/member/points/deduct',
    method: 'post',
    data: { userId, points, source, orderNo, remark },
  })
}

export function getPointProducts() {
  return request({
    url: '/api/member/points/products',
    method: 'get',
  })
}

export function getPointProductDetail(productId) {
  return request({
    url: `/api/member/points/products/${productId}`,
    method: 'get',
  })
}

export function exchangeProduct(userId, productId) {
  return request({
    url: `/api/member/points/exchange/${productId}`,
    method: 'post',
    params: { userId },
  })
}

export function getAllLevels() {
  return request({
    url: '/api/member/level/list',
    method: 'get',
  })
}

export function getCurrentLevel(userId) {
  return request({
    url: '/api/member/level/current',
    method: 'get',
    params: { userId },
  })
}

export function checkAndUpgrade(userId, currentPoints) {
  return request({
    url: '/api/member/level/check',
    method: 'get',
    params: { userId, currentPoints },
  })
}

export function getAvailableActivities(userId) {
  return request({
    url: '/api/member/activity/list',
    method: 'get',
    params: { userId },
  })
}

export function getActivityDetail(activityId, userId) {
  return request({
    url: `/api/member/activity/detail/${activityId}`,
    method: 'get',
    params: { userId },
  })
}

export function participateActivity(activityId, userId) {
  return request({
    url: `/api/member/activity/participate/${activityId}`,
    method: 'post',
    params: { userId },
  })
}

export function completeActivity(activityId, userId) {
  return request({
    url: `/api/member/activity/complete/${activityId}`,
    method: 'post',
    params: { userId },
  })
}
