import request from '@/utils/request'
import config from '@/config/environment'

/**
 * 用户登录
 * @param {Object} params - 登录参数
 * @param {string} params.phone - 手机号
 * @param {string} params.password - 密码
 * @returns {Promise}
 */
export function login(params) {
  return request({
    url: `${config.API_BASE_URL}/app/auth/login`,
    method: 'post',
    data: {
      phone: params.phone,
      password: params.password,
    },
  })
}

/**
 * 验证码登录
 * @param {Object} params - 登录参数
 * @param {string} params.phone - 手机号
 * @param {string} params.code - 验证码
 * @returns {Promise}
 */
export function loginByCode(params) {
  return request({
    url: `${config.API_BASE_URL}/app/auth/login-by-code`,
    method: 'post',
    data: {
      phone: params.phone,
      code: params.code,
    },
  })
}

/**
 * 用户注册
 * @param {Object} params - 注册参数
 * @param {string} params.phone - 手机号
 * @param {string} params.code - 验证码
 * @param {string} params.password - 密码
 * @returns {Promise}
 */
export function register(params) {
  return request({
    url: `${config.API_BASE_URL}/app/auth/register`,
    method: 'post',
    data: {
      phone: params.phone,
      code: params.code,
      password: params.password,
    },
  })
}

/**
 * 获取验证码
 * @param {Object} params - 获取验证码参数
 * @param {string} params.phone - 手机号
 * @param {string} params.type - 验证码类型：login, register, reset
 * @returns {Promise}
 */
export function getVerificationCode(params) {
  return request({
    url: `${config.API_BASE_URL}/app/auth/send-code`,
    method: 'post',
    data: {
      phone: params.phone,
      type: params.type || 'login',
    },
  })
}

/**
 * 重置密码
 * @param {Object} params - 重置密码参数
 * @param {string} params.phone - 手机号
 * @param {string} params.code - 验证码
 * @param {string} params.newPassword - 新密码
 * @returns {Promise}
 */
export function resetPassword(params) {
  return request({
    url: `${config.API_BASE_URL}/app/auth/reset-password`,
    method: 'post',
    data: {
      phone: params.phone,
      code: params.code,
      newPassword: params.newPassword,
    },
  })
}

/**
 * 用户退出登录
 * @returns {Promise}
 */
export function logout() {
  return request({
    url: `${config.API_BASE_URL}/app/auth/logout`,
    method: 'post',
  })
}

/**
 * 获取当前用户信息
 * @returns {Promise}
 */
export function getUserInfo() {
  return request({
    url: `${config.API_BASE_URL}/app/user/info`,
    method: 'get',
  })
}

/**
 * 更新用户信息
 * @param {Object} params - 用户信息
 * @returns {Promise}
 */
export function updateUserInfo(params) {
  return request({
    url: `${config.API_BASE_URL}/app/user/update`,
    method: 'put',
    data: params,
  })
}

/**
 * 更新用户头像
 * @param {FormData} formData - 头像文件
 * @returns {Promise}
 */
export function updateAvatar(formData) {
  return request({
    url: `${config.API_BASE_URL}/app/user/avatar`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
