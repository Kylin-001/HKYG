import request from '@/utils/request'

// 优惠券管理相关API
export function getCouponList(params) {
  return request({
    url: '/marketing/coupon/list',
    method: 'get',
    params,
  })
}

export function getCouponDetail(id) {
  return request({
    url: `/marketing/coupon/detail/${id}`,
    method: 'get',
  })
}

export function addCoupon(data) {
  return request({
    url: '/marketing/coupon/add',
    method: 'post',
    data,
  })
}

export function updateCoupon(data) {
  return request({
    url: '/marketing/coupon/update',
    method: 'put',
    data,
  })
}

export function deleteCoupon(id) {
  return request({
    url: `/marketing/coupon/delete/${id}`,
    method: 'delete',
  })
}

export function updateCouponStatus(id, status) {
  return request({
    url: `/marketing/coupon/status/${id}`,
    method: 'put',
    params: { status },
  })
}

export function getCouponUsageStats() {
  return request({
    url: '/marketing/coupon/stats',
    method: 'get',
  })
}

// 轮播图管理相关API
export function getBannerList(params) {
  return request({
    url: '/marketing/banner/list',
    method: 'get',
    params,
  })
}

export function getBannerDetail(id) {
  return request({
    url: `/marketing/banner/detail/${id}`,
    method: 'get',
  })
}

export function addBanner(data) {
  return request({
    url: '/marketing/banner/add',
    method: 'post',
    data,
  })
}

export function updateBanner(data) {
  return request({
    url: '/marketing/banner/update',
    method: 'put',
    data,
  })
}

export function deleteBanner(id) {
  return request({
    url: `/marketing/banner/delete/${id}`,
    method: 'delete',
  })
}

export function updateBannerStatus(id, status) {
  return request({
    url: `/marketing/banner/status/${id}`,
    method: 'put',
    params: { status },
  })
}

export function updateBannerSort(data) {
  return request({
    url: '/marketing/banner/sort',
    method: 'put',
    data,
  })
}

// 上传图片API
export function uploadBannerImage(data) {
  return request({
    url: '/marketing/upload/banner',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 活动管理相关API
export function getActivityList(params) {
  return request({
    url: '/marketing/activity/list',
    method: 'get',
    params,
  })
}

export function addActivity(data) {
  return request({
    url: '/marketing/activity/add',
    method: 'post',
    data,
  })
}

export function updateActivity(data) {
  return request({
    url: '/marketing/activity/update',
    method: 'put',
    data,
  })
}

export function deleteActivity(id) {
  return request({
    url: `/marketing/activity/delete/${id}`,
    method: 'delete',
  })
}
