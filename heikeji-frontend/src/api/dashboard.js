import request from '@/utils/request'

// 获取仪表盘统计数据 - 使用DashboardController
export function getDashboardData() {
  return request({
    url: '/api/dashboard/stats',
    method: 'get',
  })
}

// 系统健康检查 - 使用DashboardController
export function getSystemHealth() {
  return request({
    url: '/api/dashboard/health',
    method: 'get',
  })
}

// 以下API暂时保留，实际项目中需要根据后端实现调整
// 获取销售趋势数据
export function getSalesTrend(data) {
  return request({
    url: '/api/dashboard/sales/trend',
    method: 'get',
    params: data,
  })
}

// 获取订单分类统计
export function getOrderCategory() {
  return request({
    url: '/api/dashboard/order/category',
    method: 'get',
  })
}

// 获取最新订单
export function getLatestOrders(params) {
  return request({
    url: '/api/dashboard/orders/latest',
    method: 'get',
    params,
  })
}

// 获取热门商品
export function getHotProducts(params) {
  return request({
    url: '/api/dashboard/products/hot',
    method: 'get',
    params,
  })
}
