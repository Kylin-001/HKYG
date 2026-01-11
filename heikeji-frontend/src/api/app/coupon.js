import request from '@/utils/request'
import config from '@/config/environment'

/**
 * 获取可用优惠券列表
 * @param {Object} params - 查询参数
 * @param {number} [params.page] - 页码
 * @param {number} [params.pageSize] - 每页条数
 * @returns {Promise}
 */
export function getAvailableCoupons(params) {
  return request({
    url: `${config.API_BASE_URL}/app/coupon/available`,
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
    },
  })
}

/**
 * 获取已领取优惠券列表
 * @param {Object} params - 查询参数
 * @param {number} [params.page] - 页码
 * @param {number} [params.pageSize] - 每页条数
 * @param {string} [params.status] - 优惠券状态：active（可用）、used（已使用）、expired（已过期）
 * @returns {Promise}
 */
export function getMyCoupons(params) {
  return request({
    url: `${config.API_BASE_URL}/app/coupon/my`,
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      status: params.status,
    },
  })
}

/**
 * 领取优惠券
 * @param {Object} params - 领取参数
 * @param {number} params.couponId - 优惠券ID
 * @returns {Promise}
 */
export function receiveCoupon(params) {
  return request({
    url: `${config.API_BASE_URL}/app/coupon/receive`,
    method: 'post',
    data: {
      couponId: params.couponId,
    },
  })
}

/**
 * 检查优惠券是否可用
 * @param {Object} params - 检查参数
 * @param {number} params.couponId - 优惠券ID
 * @param {number} params.productId - 商品ID
 * @param {number} params.totalAmount - 订单总金额
 * @returns {Promise}
 */
export function checkCouponAvailable(params) {
  return request({
    url: `${config.API_BASE_URL}/app/coupon/check`,
    method: 'post',
    data: {
      couponId: params.couponId,
      productId: params.productId,
      totalAmount: params.totalAmount,
    },
  })
}

/**
 * 获取优惠券详情
 * @param {number} couponId - 优惠券ID
 * @returns {Promise}
 */
export function getCouponDetail(couponId) {
  return request({
    url: `${config.API_BASE_URL}/app/coupon/detail/${couponId}`,
    method: 'get',
  })
}

/**
 * 获取订单可用优惠券
 * @param {Object} params - 查询参数
 * @param {Array} params.productIds - 商品ID列表
 * @param {number} params.totalAmount - 订单总金额
 * @returns {Promise}
 */
export function getOrderAvailableCoupons(params) {
  return request({
    url: `${config.API_BASE_URL}/app/coupon/order-available`,
    method: 'post',
    data: {
      productIds: params.productIds,
      totalAmount: params.totalAmount,
    },
  })
}