import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { App } from '@/types/global'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 添加token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  (error: AxiosError) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<App.ApiResponse>) => {
    const res = response.data

    // 状态码不是20000则判断为错误
    if (res.code !== 20000) {
      ElMessage.error(res.message || '请求失败')

      // 处理特定错误码
      if (res.code === 401) {
        // 未登录或token过期
        const userStore = useUserStore()
        userStore.logoutAction()
        window.location.href = '/login'
      }

      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  (error: AxiosError) => {
    console.error('响应错误:', error)

    let errorMessage = '网络错误'
    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 400:
          errorMessage = '请求参数错误'
          break
        case 401:
          errorMessage = '未授权，请重新登录'
          const userStore = useUserStore()
          userStore.logoutAction()
          window.location.href = '/login'
          break
        case 403:
          errorMessage = '拒绝访问'
          break
        case 404:
          errorMessage = '请求资源不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        default:
          errorMessage = `请求失败: ${status}`
      }
    }

    ElMessage.error(errorMessage)
    return Promise.reject(error)
  }
)

// 导出封装的请求方法
export default {
  /**
   * GET请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 额外配置
   */
  get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<App.ApiResponse<T>> {
    return service.get(url, { params, ...config })
  },

  /**
   * POST请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 额外配置
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<App.ApiResponse<T>> {
    return service.post(url, data, config)
  },

  /**
   * PUT请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 额外配置
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<App.ApiResponse<T>> {
    return service.put(url, data, config)
  },

  /**
   * DELETE请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 额外配置
   */
  delete<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<App.ApiResponse<T>> {
    return service.delete(url, { params, ...config })
  },

  /**
   * 上传文件
   * @param url 请求地址
   * @param formData FormData对象
   * @param onUploadProgress 上传进度回调
   */
  upload<T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: ProgressEvent) => void
  ): Promise<App.ApiResponse<T>> {
    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
  },

  /**
   * 下载文件
   * @param url 请求地址
   * @param params 请求参数
   * @param fileName 文件名
   */
  download(url: string, params?: any, fileName?: string): Promise<void> {
    return service
      .get(url, {
        params,
        responseType: 'blob',
      })
      .then(response => {
        const blob = new Blob([response.data], { type: 'application/octet-stream' })
        const link = document.createElement('a')
        const url = window.URL.createObjectURL(blob)
        link.href = url
        link.download = fileName || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      })
  },
}

// 导出axios实例
export { service }
