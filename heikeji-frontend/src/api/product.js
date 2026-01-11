import request from '@/utils/request'
import config from '@/config/environment'

// 产品管理相关API
export function getProductList(params) {
  return request({
    url: `${config.API_BASE_URL}/product/list`,
    method: 'get',
    params,
  })
}

export function getProductDetail(id) {
  return request({
    url: `${config.API_BASE_URL}/product/detail/${id}`,
    method: 'get',
  })
}

export function addProduct(data) {
  return request({
    url: `${config.API_BASE_URL}/product/add`,
    method: 'post',
    data,
  })
}

export function updateProduct(data) {
  return request({
    url: `${config.API_BASE_URL}/product/update`,
    method: 'put',
    data,
  })
}

export function deleteProduct(id) {
  return request({
    url: `${config.API_BASE_URL}/product/delete/${id}`,
    method: 'delete',
  })
}

export function updateProductStatus(id, status) {
  return request({
    url: `${config.API_BASE_URL}/product/status/${id}`,
    method: 'put',
    params: { status },
  })
}

// 分类相关API
export function getCategoryList() {
  return request({
    url: `${config.API_BASE_URL}/product/category/list`,
    method: 'get',
  })
}

export function addCategory(data) {
  return request({
    url: `${config.API_BASE_URL}/product/category/add`,
    method: 'post',
    data,
  })
}

export function updateCategory(data) {
  return request({
    url: `${config.API_BASE_URL}/product/category/update`,
    method: 'put',
    data,
  })
}

export function deleteCategory(id) {
  return request({
    url: `${config.API_BASE_URL}/product/category/delete/${id}`,
    method: 'delete',
  })
}

// 品牌相关API
export function getBrandList(params) {
  return request({
    url: `${config.API_BASE_URL}/product/brand/list`,
    method: 'get',
    params,
  })
}

export function addBrand(data) {
  return request({
    url: `${config.API_BASE_URL}/product/brand/add`,
    method: 'post',
    data,
  })
}

export function updateBrand(data) {
  return request({
    url: `${config.API_BASE_URL}/product/brand/update`,
    method: 'put',
    data,
  })
}

export function deleteBrand(id) {
  return request({
    url: `${config.API_BASE_URL}/product/brand/delete/${id}`,
    method: 'delete',
  })
}

export function uploadProductImage(data) {
  return request({
    url: `${config.API_BASE_URL}/product/upload/image`,
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
    url: `${config.API_BASE_URL}/product/logs/${productId}`,
    method: 'get',
  })
}
