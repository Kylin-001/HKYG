import request from '@/utils/request'
import config from '@/config/environment'

/**
 * 获取购物车列表
 * @returns {Promise}
 */
export function getCartList() {
  return request({
    url: `${config.API_BASE_URL}/app/cart/list`,
    method: 'get',
  })
}

/**
 * 添加商品到购物车
 * @param {Object} params - 添加参数
 * @param {number} params.productId - 商品ID
 * @param {number} [params.skuId] - SKU ID
 * @param {number} params.quantity - 数量
 * @returns {Promise}
 */
export function addToCart(params) {
  return request({
    url: `${config.API_BASE_URL}/app/cart/add`,
    method: 'post',
    data: {
      productId: params.productId,
      skuId: params.skuId,
      quantity: params.quantity,
    },
  })
}

/**
 * 更新购物车商品数量
 * @param {Object} params - 更新参数
 * @param {number} params.cartItemId - 购物车商品ID
 * @param {number} params.quantity - 新数量
 * @returns {Promise}
 */
export function updateCartQuantity(params) {
  return request({
    url: `${config.API_BASE_URL}/app/cart/update-quantity`,
    method: 'put',
    data: {
      cartItemId: params.cartItemId,
      quantity: params.quantity,
    },
  })
}

/**
 * 删除购物车商品
 * @param {Object} params - 删除参数
 * @param {Array<number>} params.cartItemIds - 购物车商品ID列表
 * @returns {Promise}
 */
export function deleteCartItem(params) {
  return request({
    url: `${config.API_BASE_URL}/app/cart/delete`,
    method: 'delete',
    data: {
      cartItemIds: params.cartItemIds,
    },
  })
}

/**
 * 清空购物车
 * @returns {Promise}
 */
export function clearCart() {
  return request({
    url: `${config.API_BASE_URL}/app/cart/clear`,
    method: 'delete',
  })
}

/**
 * 切换购物车商品选中状态
 * @param {Object} params - 切换参数
 * @param {number} params.cartItemId - 购物车商品ID
 * @param {boolean} params.isChecked - 是否选中
 * @returns {Promise}
 */
export function toggleCartItemCheck(params) {
  return request({
    url: `${config.API_BASE_URL}/app/cart/check`,
    method: 'put',
    data: {
      cartItemId: params.cartItemId,
      isChecked: params.isChecked,
    },
  })
}

/**
 * 全选/取消全选购物车商品
 * @param {Object} params - 全选参数
 * @param {boolean} params.isChecked - 是否选中
 * @returns {Promise}
 */
export function toggleCartItemCheckAll(params) {
  return request({
    url: `${config.API_BASE_URL}/app/cart/check-all`,
    method: 'put',
    data: {
      isChecked: params.isChecked,
    },
  })
}

/**
 * 获取购物车商品数量
 * @returns {Promise}
 */
export function getCartCount() {
  return request({
    url: `${config.API_BASE_URL}/app/cart/count`,
    method: 'get',
  })
}
