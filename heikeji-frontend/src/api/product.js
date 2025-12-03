import request from '@/utils/request'

// 产品管理相关API
export function getProductList(params) {
  return request({
    url: '/product/list',
    method: 'get',
    params,
  })
}

export function getProductDetail(id) {
  return request({
    url: `/product/detail/${id}`,
    method: 'get',
  })
}

export function addProduct(data) {
  return request({
    url: '/product/add',
    method: 'post',
    data,
  })
}

export function updateProduct(data) {
  return request({
    url: '/product/update',
    method: 'put',
    data,
  })
}

export function deleteProduct(id) {
  return request({
    url: `/product/delete/${id}`,
    method: 'delete',
  })
}

export function updateProductStatus(id, status) {
  return request({
    url: `/product/status/${id}`,
    method: 'put',
    params: { status },
  })
}

// 分类相关API
export function getCategoryList() {
  return request({
    url: '/product/category/list',
    method: 'get',
  })
}

export function addCategory(data) {
  return request({
    url: '/product/category/add',
    method: 'post',
    data,
  })
}

export function updateCategory(data) {
  return request({
    url: '/product/category/update',
    method: 'put',
    data,
  })
}

export function deleteCategory(id) {
  return request({
    url: `/product/category/delete/${id}`,
    method: 'delete',
  })
}

// 品牌相关API
export function getBrandList(params) {
  return request({
    url: '/product/brand/list',
    method: 'get',
    params,
  })
}

export function addBrand(data) {
  return request({
    url: '/product/brand/add',
    method: 'post',
    data,
  })
}

export function updateBrand(data) {
  return request({
    url: '/product/brand/update',
    method: 'put',
    data,
  })
}

export function deleteBrand(id) {
  return request({
    url: `/product/brand/delete/${id}`,
    method: 'delete',
  })
}

export function uploadProductImage(data) {
  return request({
    url: '/product/upload/image',
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
    url: `/product/logs/${productId}`,
    method: 'get',
  })
}
