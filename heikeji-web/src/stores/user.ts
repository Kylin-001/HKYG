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
  // 只要有token就认为已认证，user对象可以在需要时获取
  const isAuthenticated = computed(() => !!token.value)

  const userName = computed(() =>
    user.value?.nickname || user.value?.username || '未登录用户'
  )

  const userAvatar = computed(() =>
    user.value?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.value?.id || 'default'}&size=80`
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

      const data = await userApi.login(loginData)

      token.value = data.token
      user.value = data.user

      // 根据 rememberMe 决定是否持久化存储
      if (loginData.rememberMe) {
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
      } else {
        // 使用 sessionStorage，浏览器关闭后自动清除
        sessionStorage.setItem('token', token.value)
        sessionStorage.setItem('user', JSON.stringify(user.value))
      }

      return data
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

      const data = await userApi.register(registerData)

      return data
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
    // 立即清除本地状态
    token.value = ''
    user.value = null
    error.value = null
    
    // 清除两种存储
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    
    // 注意：后端logout API暂时不调用，因为：
    // 1. 后端可能存在token验证问题导致500错误
    // 2. 前端清除状态已经足够实现登出功能
    // 3. 后端token会在一段时间后自动过期
    console.log('User logged out (frontend only)')
  }

  /**
   * 获取当前用户信息
   */
  async function fetchUserInfo(): Promise<User | null> {
    if (!token.value) {
      console.warn('[UserStore] No token available')
      return null
    }

    try {
      isLoading.value = true
      console.log('[UserStore] Fetching user info...')
      const data = await userApi.getUserInfo()
      user.value = data
      localStorage.setItem('user', JSON.stringify(user.value))
      console.log('[UserStore] User info fetched successfully:', data)
      return data
    } catch (err: any) {
      console.error('[UserStore] Failed to fetch user info:', err)
      // 只有401错误才清除登录状态，其他错误保留token让用户重试
      if (err?.response?.status === 401) {
        console.log('[UserStore] Token expired (401), logging out...')
        await logout()
      } else {
        // 网络错误或其他错误，不清除登录状态
        console.log('[UserStore] Non-401 error, keeping session for retry')
      }
      return null
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

      const data = await userApi.updateProfile(profileData)
      user.value = { ...user.value!, ...data }
      localStorage.setItem('user', JSON.stringify(user.value))

      return data
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
      const data = await userApi.uploadAvatar(file)
      console.log('[UserStore] Avatar upload response:', data)

      if (user.value) {
        // 创建新对象以触发响应式更新
        user.value = { ...user.value, avatar: data.url }
        localStorage.setItem('user', JSON.stringify(user.value))
        console.log('[UserStore] Avatar updated:', user.value.avatar)
      } else {
        console.warn('[UserStore] Cannot update avatar: user is null')
      }

      return data
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
      const data = await userApi.refreshToken()
      const newToken = data.token
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
    // 优先从 localStorage 读取（记住我）
    let savedToken = localStorage.getItem('token')
    let savedUser = localStorage.getItem('user')

    // 如果没有，尝试从 sessionStorage 读取（当前会话）
    if (!savedToken) {
      savedToken = sessionStorage.getItem('token')
      savedUser = sessionStorage.getItem('user')
    }

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
