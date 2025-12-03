import request from '@/utils/request'

// 用户登录 - 使用LoginController和AuthController
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data,
  })
}

// 获取验证码 - 使用LoginController
export function getCodeImg() {
  return request({
    url: '/api/auth/captcha',
    method: 'get',
  })
}

// 退出登录 - 使用LoginController
export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post',
  })
}

// 获取当前用户信息 - 使用AuthController
export function getCurrentUser() {
  return request({
    url: '/api/auth/currentUser',
    method: 'get',
  })
}

// 刷新令牌 - 使用AuthController
export function refreshToken() {
  return request({
    url: '/api/auth/refresh',
    method: 'post',
  })
}
