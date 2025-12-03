import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, logout, getUserInfo } from '@/api/user'
import { ElMessage } from 'element-plus'

// 用户信息接口定义
interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  email?: string
  phone?: string
  roles: string[]
  permissions: string[]
  deptId?: number
  deptName?: string
  createTime: string
  lastLoginTime?: string
  status: number
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

  // 方法 - 登录
  async function loginAction(username: string, password: string) {
    try {
      isLoading.value = true
      const res = await login({ username, password })

      // 存储token
      token.value = res.data.token
      localStorage.setItem('token', res.data.token)

      ElMessage.success('登录成功')
      return res
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '登录失败')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 方法 - 获取用户信息
  async function getUserInfoAction() {
    try {
      isLoading.value = true
      const res = await getUserInfo()

      // 存储用户信息
      userInfo.value = res.data
      roles.value = res.data.roles || []
      permissions.value = res.data.permissions || []

      return res
    } catch (error) {
      ElMessage.error('获取用户信息失败')
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
      await logout()
    } catch (error) {
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
    getUserInfoAction,
    logoutAction,
    refreshTokenAction,
    resetState,
  }
})
