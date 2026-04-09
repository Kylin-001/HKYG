import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, RegisterRequest } from '@/types/user'
import * as userApi from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // ====== State ======
  const user = ref<User | null>(null)
  const token = ref<string>('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ====== Getters ======
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const userName = computed(() =>
    user.value?.nickname || user.value?.username || '未登录用户'
  )

  const userAvatar = computed(() =>
    user.value?.avatar || '/default-avatar.png'
  )

  const userId = computed(() => user.value?.id)

  // ====== Actions ======

  /**
   * 登录
   */
  async function login(loginData: LoginRequest) {
    try {
      isLoading.value = true
      error.value = null

      const response = await userApi.login(loginData)

      token.value = response.data.token
      user.value = response.data.user

      // 持久化存储
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))

      return response.data
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string }
      error.value = errorObj.response?.data?.message || '登录失败，请重试'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 注册
   */
  async function register(registerData: RegisterRequest) {
    try {
      isLoading.value = true
      error.value = null

      const response = await userApi.register(registerData)

      return response.data
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string }
      error.value = errorObj.response?.data?.message || '注册失败，请重试'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 退出登录
   */
  async function logout() {
    try {
      if (token.value) {
        await userApi.logout()
      }
    } catch (err) {
      // API调用失败不影响登出流程，仅记录日志
      console.error('Logout API call failed:', err)
    } finally {
      // 无论API调用是否成功，都清除本地状态
      token.value = ''
      user.value = null
      error.value = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  /**
   * 获取当前用户信息
   */
  async function fetchUserInfo() {
    if (!token.value) return

    try {
      isLoading.value = true
      const response = await userApi.getUserInfo()
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch (err) {
      console.error('获取用户信息失败:', err)
      // Token可能已过期，清除登录状态
      await logout()
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 更新用户信息
   */
  async function updateProfile(profileData: Partial<User>) {
    try {
      isLoading.value = true
      error.value = null

      const response = await userApi.updateProfile(profileData)
      user.value = { ...user.value!, ...response.data }
      localStorage.setItem('user', JSON.stringify(user.value))

      return response.data
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string }
      error.value = errorObj.response?.data?.message || '更新失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 上传头像
   */
  async function uploadAvatar(file: File) {
    try {
      isLoading.value = true
      const response = await userApi.uploadAvatar(file)

      if (user.value) {
        user.value.avatar = response.data.url
        localStorage.setItem('user', JSON.stringify(user.value))
      }

      return response.data
    } catch (err: unknown) {
      error.value = '上传头像失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 刷新 Token
   */
  async function refreshToken(): Promise<string> {
    try {
      const response = await userApi.refreshToken()
      const newToken = response.data.token
      token.value = newToken
      localStorage.setItem('token', newToken)
      return newToken
    } catch (err) {
      throw err
    }
  }

  /**
   * 从本地存储恢复登录状态（应用启动时调用）
   */
  function restoreSession() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken) {
      token.value = savedToken
      if (savedUser) {
        try {
          user.value = JSON.parse(savedUser)
        } catch {
          console.error('解析用户信息失败')
        }
      }
    }
  }

  /**
   * 清除错误信息
   */
  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    userName,
    userAvatar,
    userId,

    // Actions
    login,
    register,
    logout,
    fetchUserInfo,
    updateProfile,
    uploadAvatar,
    refreshToken,
    restoreSession,
    clearError,
  }
})
