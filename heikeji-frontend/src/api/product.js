import request from '@/utils/request'
import config from '@/config/environment'

// 产品管理相关API
export function getProductList(params) {
  return request({
    url: '/api/product/list',
    method: 'get',
    params,
  })
}

export function getProductById(id) {
  return request({
    url: `/api/product/${id}`,
    method: 'get',
  })
}

export function productApi() {
  return request({
    url: '/api/product',
    method: 'get',
  })
}

export function getProductDetail(id) {
  return request({
    url: `/api/product/detail/${id}`,
    method: 'get',
  })
}

export function addProduct(data) {
  return request({
    url: `/api/product/add`,
    method: 'post',
    data,
  })
}

export function updateProduct(data) {
  return request({
    url: `/api/product/update`,
    method: 'put',
    data,
  })
}

export function deleteProduct(id) {
  return request({
    url: `/api/product/delete/${id}`,
    method: 'delete',
  })
}

export function updateProductStatus(id, status) {
  return request({
    url: `/api/product/status/${id}`,
    method: 'put',
    params: { status },
  })
}

// 分类相关API
export function getCategoryList() {
  return request({
    url: `/api/product/category/list`,
    method: 'get',
  })
}

export function addCategory(data) {
  return request({
    url: `/api/product/category/add`,
    method: 'post',
    data,
  })
}

export function updateCategory(data) {
  return request({
    url: `/api/product/category/update`,
    method: 'put',
    data,
  })
}

export function deleteCategory(id) {
  return request({
    url: `/api/product/category/delete/${id}`,
    method: 'delete',
  })
}

// 品牌相关API
export function getBrandList(params) {
  return request({
    url: `/api/product/brand/list`,
    method: 'get',
    params,
  })
}

export function addBrand(data) {
  return request({
    url: `/api/product/brand/add`,
    method: 'post',
    data,
  })
}

export function updateBrand(data) {
  return request({
    url: `/api/product/brand/update`,
    method: 'put',
    data,
  })
}

export function deleteBrand(id) {
  return request({
    url: `/api/product/brand/delete/${id}`,
    method: 'delete',
  })
}

export function uploadProductImage(data) {
  return request({
    url: `/api/product/upload/image`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 获取商品操作日志
export function getProductOperationLogs(productId) {
  return request({
    url: `/api/product/logs/${productId}`,
    method: 'get',
  })
}

// 获取商品销售统计
export function getProductSales(startDate, endDate, categoryId) {
  return request({
    url: '/api/product/sales',
    method: 'get',
    params: { startDate, endDate, categoryId },
  })
}

// 导出商品数据
export function exportProducts(params) {
  return request({
    url: '/api/product/export',
    method: 'get',
    params,
    responseType: 'blob',
  })
}

// 获取销售趋势数据
export function getSalesTrend(startDate, endDate, timeGranularity) {
  return request({
    url: '/api/product/sales/trend',
    method: 'get',
    params: { startDate, endDate, timeGranularity },
  })
}

// 获取销售排行数据
export function getSalesRanking(limit, startDate, endDate) {
  return request({
    url: '/api/product/sales/ranking',
    method: 'get',
    params: { limit, startDate, endDate },
  })
}
