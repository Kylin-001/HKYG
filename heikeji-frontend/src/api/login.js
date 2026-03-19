import request from '@/utils/request'
import config from '@/config/environment'

// 用户登录 - 使用LoginController和AuthController
export function login(data) {
  return request({
    url: `/api/user/login`,
    method: 'post',
    data,
  })
}

// 获取验证码 - 使用LoginController
export function getCodeImg(phone) {
  return request({
    url: '/api/user/sendCode',
    method: 'post',
    params: { phone }
  })
}

export const getCaptcha = getCodeImg

// 退出登录 - 使用LoginController
export function logout() {
  return request({
    url: `/api/user/logout`,
    method: 'post',
  })
}

// 获取当前用户信息 - 使用AuthController
export function getCurrentUser() {
  return request({
    url: `/api/user/me`,
    method: 'get',
  })
}

// 刷新令牌 - 使用AuthController
export function refreshToken() {
  return request({
    url: `/api/user/refresh`,
    method: 'post',
  })
}
