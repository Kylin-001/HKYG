import request from '@/utils/request'
import config from '@/config/environment'

/**
 * 获取收货地址列表
 * @returns {Promise}
 */
export function getAddressList() {
  return request({
    url: `${config.API_BASE_URL}/app/address/list`,
    method: 'get',
  })
}

/**
 * 获取收货地址详情
 * @param {number} addressId - 地址ID
 * @returns {Promise}
 */
export function getAddressDetail(addressId) {
  return request({
    url: `${config.API_BASE_URL}/app/address/detail/${addressId}`,
    method: 'get',
  })
}

/**
 * 添加收货地址
 * @param {Object} params - 地址参数
 * @param {string} params.receiverName - 收货人姓名
 * @param {string} params.receiverPhone - 收货人电话
 * @param {number} params.provinceId - 省份ID
 * @param {number} params.cityId - 城市ID
 * @param {number} params.districtId - 区县ID
 * @param {string} params.detailAddress - 详细地址
 * @param {number} params.isDefault - 是否默认地址：0-否，1-是
 * @returns {Promise}
 */
export function addAddress(params) {
  return request({
    url: `${config.API_BASE_URL}/app/address/add`,
    method: 'post',
    data: {
      receiverName: params.receiverName,
      receiverPhone: params.receiverPhone,
      provinceId: params.provinceId,
      cityId: params.cityId,
      districtId: params.districtId,
      detailAddress: params.detailAddress,
      isDefault: params.isDefault,
    },
  })
}

/**
 * 更新收货地址
 * @param {Object} params - 地址参数
 * @param {number} params.addressId - 地址ID
 * @param {string} params.receiverName - 收货人姓名
 * @param {string} params.receiverPhone - 收货人电话
 * @param {number} params.provinceId - 省份ID
 * @param {number} params.cityId - 城市ID
 * @param {number} params.districtId - 区县ID
 * @param {string} params.detailAddress - 详细地址
 * @param {number} params.isDefault - 是否默认地址：0-否，1-是
 * @returns {Promise}
 */
export function updateAddress(params) {
  return request({
    url: `${config.API_BASE_URL}/app/address/update`,
    method: 'put',
    data: {
      addressId: params.addressId,
      receiverName: params.receiverName,
      receiverPhone: params.receiverPhone,
      provinceId: params.provinceId,
      cityId: params.cityId,
      districtId: params.districtId,
      detailAddress: params.detailAddress,
      isDefault: params.isDefault,
    },
  })
}

/**
 * 删除收货地址
 * @param {number} addressId - 地址ID
 * @returns {Promise}
 */
export function deleteAddress(addressId) {
  return request({
    url: `${config.API_BASE_URL}/app/address/delete/${addressId}`,
    method: 'delete',
  })
}

/**
 * 设置默认收货地址
 * @param {number} addressId - 地址ID
 * @returns {Promise}
 */
export function setDefaultAddress(addressId) {
  return request({
    url: `${config.API_BASE_URL}/app/address/default/${addressId}`,
    method: 'put',
  })
}

/**
 * 获取默认收货地址
 * @returns {Promise}
 */
export function getDefaultAddress() {
  return request({
    url: `${config.API_BASE_URL}/app/address/default`,
    method: 'get',
  })
}
