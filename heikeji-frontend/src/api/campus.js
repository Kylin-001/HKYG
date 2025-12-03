import request from '@/utils/request'

// 校区管理相关API
export const getCampusList = () => {
  return request({
    url: '/api/campus/list',
    method: 'get',
  })
}

export const getCampusById = id => {
  return request({
    url: `/api/campus/${id}`,
    method: 'get',
  })
}

export const addCampus = data => {
  return request({
    url: '/api/campus/add',
    method: 'post',
    data,
  })
}

export const updateCampus = data => {
  return request({
    url: '/api/campus/update',
    method: 'put',
    data,
  })
}

export const updateCampusStatus = (id, status) => {
  return request({
    url: `/api/campus/status/${id}`,
    method: 'put',
    params: { status },
  })
}

// 楼栋管理相关API
export const getBuildingList = params => {
  return request({
    url: '/api/building/list',
    method: 'get',
    params,
  })
}

export const getBuildingById = id => {
  return request({
    url: `/api/building/${id}`,
    method: 'get',
  })
}

export const addBuilding = data => {
  return request({
    url: '/api/building/add',
    method: 'post',
    data,
  })
}

export const updateBuilding = data => {
  return request({
    url: '/api/building/update',
    method: 'put',
    data,
  })
}

export const updateBuildingStatus = (id, status) => {
  return request({
    url: `/api/building/status/${id}`,
    method: 'put',
    params: { status },
  })
}

// 外卖柜管理相关API
export const getDeliveryLockerList = params => {
  return request({
    url: '/api/locker/list',
    method: 'get',
    params,
  })
}

export const getDeliveryLockerById = id => {
  return request({
    url: `/api/locker/${id}`,
    method: 'get',
  })
}

export const addDeliveryLocker = data => {
  return request({
    url: '/api/locker/add',
    method: 'post',
    data,
  })
}

export const updateDeliveryLocker = data => {
  return request({
    url: '/api/locker/update',
    method: 'put',
    data,
  })
}

export const updateLockerStatus = (id, status) => {
  return request({
    url: `/api/locker/status/${id}`,
    method: 'put',
    params: { status },
  })
}

// 校园站点相关API
export const getCampusSiteList = params => {
  return request({
    url: '/api/site/list',
    method: 'get',
    params,
  })
}

export const getCampusSiteById = id => {
  return request({
    url: `/api/site/${id}`,
    method: 'get',
  })
}

export const addCampusSite = data => {
  return request({
    url: '/api/site/add',
    method: 'post',
    data,
  })
}

export const updateCampusSite = data => {
  return request({
    url: '/api/site/update',
    method: 'put',
    data,
  })
}

// 外卖订单相关API
export const getTakeoutOrderList = params => {
  return request({
    url: '/api/takeout/order/list',
    method: 'get',
    params,
  })
}

export const getTakeoutOrderDetail = id => {
  return request({
    url: `/api/takeout/order/${id}`,
    method: 'get',
  })
}

export const updateTakeoutOrderStatus = (id, status) => {
  return request({
    url: `/api/takeout/order/status/${id}`,
    method: 'put',
    params: { status },
  })
}

// 跑腿服务相关API
export const getDeliveryRequestList = params => {
  return request({
    url: '/api/delivery/request/list',
    method: 'get',
    params,
  })
}

export const getDeliveryRequestDetail = id => {
  return request({
    url: `/api/delivery/request/${id}`,
    method: 'get',
  })
}

export const updateDeliveryRequestStatus = (id, status) => {
  return request({
    url: `/api/delivery/request/status/${id}`,
    method: 'put',
    params: { status },
  })
}
