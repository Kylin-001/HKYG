import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as appAuthApi from '@/api/app/auth'
import { ElMessage } from 'element-plus'

// 用户信息接口定义
interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  email?: string
  phone: string
  roles: string[]
  permissions: string[]
  createTime: string
  lastLoginTime?: string
  status: number
  balance?: number
  points?: number
  level?: number
}

// 定义user store的状态类型
interface UserState {
  token: string
  userInfo: UserInfo | null
  roles: string[]
  permissions: string[]
  isLoading: boolean
}

// 创建并导出user store
export const useUserStore = defineStore('user', () => {
  // 状态定义
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const isLoading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => userInfo.value)
  const hasRole = computed(() => (role: string) => roles.value.includes(role))
  const hasPermission = computed(() => (perm: string) => permissions.value.includes(perm))

  // 方法 - 手机号密码登录
  async function loginAction(phone: string, password: string) {
    try {
      isLoading.value = true
      const res = await appAuthApi.login({ phone, password })

      // 存储token
      token.value = res.data.token
      localStorage.setItem('token', res.data.token)

      // 获取用户信息
      await getUserInfoAction()

      ElMessage.success('登录成功')
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '登录失败')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 方法 - 验证码登录
  async function loginByCodeAction(phone: string, code: string) {
    try {
      isLoading.value = true
      const res = await appAuthApi.loginByCode({ phone, code })

      // 存储token
      token.value = res.data.token
      localStorage.setItem('token', res.data.token)

      // 获取用户信息
      await getUserInfoAction()

      ElMessage.success('登录成功')
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '登录失败')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 方法 - 用户注册
  async function registerAction(phone: string, code: string, password: string) {
    try {
      isLoading.value = true
      const res = await appAuthApi.register({ phone, code, password })

      ElMessage.success('注册成功')
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '注册失败')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 方法 - 获取验证码
  async function getVerificationCodeAction(phone: string, type: string = 'login') {
    try {
      const res = await appAuthApi.getVerificationCode({ phone, type })
      ElMessage.success('验证码发送成功')
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '验证码发送失败')
      throw error
    }
  }

  // 方法 - 获取用户信息
  async function getUserInfoAction() {
    try {
      isLoading.value = true
      const res = await appAuthApi.getUserInfo()

      // 存储用户信息
      userInfo.value = res.data
      roles.value = res.data.roles || []
      permissions.value = res.data.permissions || []

      return res
    } catch (error: any) {
      ElMessage.error(error.message || '获取用户信息失败')
      // 清除token并跳转到登录页
      logoutAction()
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 方法 - 登出
  async function logoutAction() {
    try {
      await appAuthApi.logout()
    } catch (error: any) {
      console.error('登出失败:', error)
    } finally {
      // 清除状态
      token.value = ''
      userInfo.value = null
      roles.value = []
      permissions.value = []

      // 清除本地存储
      localStorage.removeItem('token')

      ElMessage.success('已退出登录')
    }
  }

  // 方法 - 更新用户信息
  async function updateUserInfoAction(userData: Partial<UserInfo>) {
    try {
      isLoading.value = true
      const res = await appAuthApi.updateUserInfo(userData)

      // 更新本地用户信息
      if (userInfo.value) {
        userInfo.value = { ...userInfo.value, ...res.data }
      }

      ElMessage.success('用户信息更新成功')
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '用户信息更新失败')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 方法 - 更新用户头像
  async function updateAvatarAction(formData: FormData) {
    try {
      isLoading.value = true
      const res = await appAuthApi.updateAvatar(formData)

      // 更新本地用户头像
      if (userInfo.value) {
        userInfo.value.avatar = res.data.avatar
      }

      ElMessage.success('头像更新成功')
      return res
    } catch (error: any) {
      ElMessage.error(error.message || '头像更新失败')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 方法 - 刷新token
  async function refreshTokenAction() {
    // 实现token刷新逻辑
    try {
      // 调用刷新token接口
      // const res = await refreshToken()
      // token.value = res.data.token
      // localStorage.setItem('token', res.data.token)

      return true
    } catch (error) {
      console.error('刷新token失败:', error)
      // 清除token并跳转到登录页
      logoutAction()
      return false
    }
  }

  // 方法 - 重置用户状态
  function resetState() {
    token.value = ''
    userInfo.value = null
    roles.value = []
    permissions.value = []
    localStorage.removeItem('token')
  }

  // 导出状态、计算属性和方法
  return {
    // 状态
    token,
    userInfo,
    roles,
    permissions,
    isLoading,
    // 计算属性
    isAuthenticated,
    currentUser,
    hasRole,
    hasPermission,
    // 方法
    loginAction,
    loginByCodeAction,
    registerAction,
    getVerificationCodeAction,
    getUserInfoAction,
    logoutAction,
    updateUserInfoAction,
    updateAvatarAction,
    refreshTokenAction,
    resetState,
  }
})
