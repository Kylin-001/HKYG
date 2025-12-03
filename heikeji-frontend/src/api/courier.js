import request from '@/utils/request'

// 获取骑手仪表板数据
export function getCourierDashboard() {
  return request({
    url: '/courier/dashboard',
    method: 'get',
  })
}

// 获取骑手个人信息
export function getCourierProfile() {
  return request({
    url: '/courier/profile',
    method: 'get',
  })
}

// 更新骑手在线状态
export function updateCourierStatus(status) {
  return request({
    url: '/courier/status',
    method: 'put',
    data: { status },
  })
}

// 更新骑手位置信息
export function updateCourierLocation(location) {
  return request({
    url: '/courier/location',
    method: 'put',
    data: { location },
  })
}

// 获取骑手工作统计
export function getCourierStatistics() {
  return request({
    url: '/courier/statistics',
    method: 'get',
  })
}

// 获取订单列表
export function getCourierOrders(params) {
  return request({
    url: '/courier/orders',
    method: 'get',
    params,
  })
}

// 获取订单详情
export function getCourierOrderDetail(orderId) {
  return request({
    url: `/courier/orders/${orderId}`,
    method: 'get',
  })
}

// 接单
export function acceptCourierOrder(orderId) {
  return request({
    url: `/courier/orders/${orderId}/accept`,
    method: 'post',
  })
}

// 取消订单
export function cancelCourierOrder(orderId, reason) {
  return request({
    url: `/courier/orders/${orderId}/cancel`,
    method: 'post',
    data: { reason },
  })
}

// 开始配送
export function startDelivery(orderId) {
  return request({
    url: `/courier/orders/${orderId}/start`,
    method: 'post',
  })
}

// 完成配送
export function completeDelivery(orderId, data) {
  return request({
    url: `/courier/orders/${orderId}/complete`,
    method: 'post',
    data,
  })
}

// 获取配送路径
export function getDeliveryRoute(orderId) {
  return request({
    url: `/courier/orders/${orderId}/route`,
    method: 'get',
  })
}

// 获取配送趋势数据
export function getDeliveryTrend(params) {
  return request({
    url: '/courier/statistics/trend',
    method: 'get',
    params,
  })
}

// 获取订单类型分布数据
export function getOrderTypeDistribution(params) {
  return request({
    url: '/courier/statistics/order-types',
    method: 'get',
    params,
  })
}

// 获取收入分析数据
export function getRevenueAnalysis(params) {
  return request({
    url: '/courier/statistics/revenue',
    method: 'get',
    params,
  })
}

// 获取时段配送分布数据
export function getTimeSlotDistribution(params) {
  return request({
    url: '/courier/statistics/time-slots',
    method: 'get',
    params,
  })
}

// 获取详细数据表格
export function getDetailedData(params) {
  return request({
    url: '/courier/statistics/detail',
    method: 'get',
    params,
  })
}

// 导出报表
export function exportReport(params) {
  return request({
    url: '/courier/statistics/export',
    method: 'get',
    params,
    responseType: 'blob',
  })
}
