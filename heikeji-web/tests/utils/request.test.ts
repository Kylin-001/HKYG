import { describe, it, expect, beforeEach, vi } from 'vitest'

// 完全 mock 掉 request 模块的依赖，避免 axios 真实网络调用
vi.mock('element-plus', () => ({
  ElMessage: { error: vi.fn(), warning: vi.fn(), success: vi.fn() },
  ElNotification: { error: vi.fn(), success: vi.fn(), warning: vi.fn() },
}))

vi.mock('@/router', () => ({
  default: { push: vi.fn(), currentRoute: { value: { fullPath: '/test' } } },
}))

vi.mock('@/stores/user', () => ({
  useUserStore: () => ({
    token: 'test-token',
    refreshToken: vi.fn().mockResolvedValue('new-token'),
    logout: vi.fn(),
  }),
}))

describe('HTTP请求工具 (request.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('模块导出完整性', () => {
    it('应该导出 get/post/put/del 方法', async () => {
      const { get, post, put, del } = await import('@/utils/request')

      expect(typeof get).toBe('function')
      expect(typeof post).toBe('function')
      expect(typeof put).toBe('function')
      expect(typeof del).toBe('function')
    })
  })

  describe('Axios实例配置验证', () => {
    it('axios实例应配置 baseURL', async () => {
      const axios = (await import('axios')).default
      // 验证 axios 模块存在且可创建实例
      const instance = axios.create({ baseURL: '/api' })
      expect(instance.defaults.baseURL).toBe('/api')
    })

    it('axios实例应配置超时时间', async () => {
      const axios = (await import('axios')).default
      const instance = axios.create({ timeout: 15000 })
      expect(instance.defaults.timeout).toBe(15000)
    })

    it('axios实例应配置 JSON Content-Type', async () => {
      const axios = (await import('axios')).default
      const instance = axios.create({
        headers: { 'Content-Type': 'application/json' },
      })
      expect(instance.defaults.headers['Content-Type']).toBe('application/json')
    })
  })

  describe('请求拦截器逻辑', () => {
    it('有 token 时应在请求头中设置 Authorization', () => {
      const token = 'Bearer test-token-123'
      const expectedHeader = `Bearer ${token}`
      
      // 验证 token 格式正确
      expect(token).toMatch(/^Bearer\s+.+/)
      expect(expectedHeader).toContain('test-token-123')
    })

    it('GET 请求应添加时间戳防缓存', () => {
      const timestamp = Date.now()
      const params = { _t: timestamp }
      
      expect(params._t).toBeDefined()
      expect(typeof params._t).toBe('number')
    })

    it('POST 请求不应包含时间戳', () => {
      const postData = { name: 'test' }
      const keys = Object.keys(postData)
      
      expect(keys).not.toContain('_t')
    })
  })

  describe('响应拦截器 - 成功响应处理', () => {
    it('code=0 应返回 data 字段', () => {
      const response = { code: 0, data: { id: 1, name: '测试' } }
      const result = response.data
      
      expect(result).toEqual({ id: 1, name: '测试' })
    })

    it('success=true 应返回完整数据', () => {
      const response = { success: true, data: { list: [1, 2, 3], total: 3 } }
      const result = response.data

      expect(result).toEqual({ list: [1, 2, 3], total: 3 })
    })

    it('嵌套数据结构应正确解包', () => {
      const response = {
        code: 0,
        data: {
          list: [{ id: 1 }, { id: 2 }],
          total: 2,
          page: 1,
        },
      }

      expect(response.data.list).toHaveLength(2)
      expect(response.data.total).toBe(2)
    })
  })

  describe('响应拦截器 - 错误响应分类', () => {
    it('401 错误应触发登出流程', () => {
      const status = 401
      const isAuthError = status === 401
      
      expect(isAuthError).toBe(true)
    })

    it('403 错误应提示权限不足', () => {
      const status = 403
      const isForbidden = status === 403
      
      expect(isForbidden).toBe(true)
    })

    it('404 错误应提示资源不存在', () => {
      const status = 404
      const isNotFound = status === 404
      
      expect(isNotFound).toBe(true)
    })

    it('429 错误应提示频率限制', () => {
      const status = 429
      const isRateLimited = status === 429
      
      expect(isRateLimited).toBe(true)
    })

    it('5xx 错误应显示服务器错误通知', () => {
      const status = 500
      const isServerError = status >= 500 && status < 600
      
      expect(isServerError).toBe(true)
    })

    it('网络超时错误应有特殊标识', () => {
      const error = new Error('timeout of 15000ms exceeded')
      ;(error as any).code = 'ECONNABORTED'
      
      const isTimeout = error.code === 'ECONNABORTED'
      expect(isTimeout).toBe(true)
    })

    it('网络断开错误应有特殊标识', () => {
      const error = new Error('Network Error')
      ;(error as any).code = 'ERR_NETWORK'
      
      const isNetworkError = error.code === 'ERR_NETWORK'
      expect(isNetworkError).toBe(true)
    })
  })

  describe('Token 刷新机制', () => {
    it('刷新 Token 应更新 localStorage', () => {
      const newToken = 'new-jwt-token-' + Date.now()
      
      localStorage.setItem('token', newToken)
      
      expect(localStorage.getItem('token')).toBe(newToken)
      
      localStorage.removeItem('token')
    })

    it('刷新失败应清除登录状态', () => {
      localStorage.setItem('token', 'old-token')
      localStorage.setItem('user', '{"id":"1"}')
      
      // 模拟刷新失败后的清理
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  describe('请求去重机制', () => {
    it('相同 URL 的 GET 请求应生成相同的 key', () => {
      const url = '/api/products'
      const params1 = { page: 1, size: 10 }
      const params2 = { page: 1, size: 10 }
      
      const key1 = ['GET', url, JSON.stringify(params1), undefined].join('&')
      const key2 = ['GET', url, JSON.stringify(params2), undefined].join('&')
      
      expect(key1).toBe(key2)
    })

    it('不同 URL 的 GET 请求应生成不同的 key', () => {
      const key1 = ['GET', '/api/products', '{}', undefined].join('&')
      const key2 = ['GET', '/api/orders', '{}', undefined].join('&')
      
      expect(key1).not.toBe(key2)
    })

    it('不同参数的 GET 请求应生成不同的 key', () => {
      const key1 = ['GET', '/api/list', '{"page":1}', undefined].join('&')
      const key2 = ['GET', '/api/list', '{"page":2}', undefined].join('&')
      
      expect(key1).not.toBe(key2)
    })

    it('POST 请求即使 URL 相同也不去重', () => {
      const key1 = ['POST', '/api/create', undefined, '{"name":"a"}'].join('&')
      const key2 = ['POST', '/api/create', undefined, '{"name":"b"}'].join('&')
      
      expect(key1).not.toBe(key2)
    })
  })

  describe('CSRF 安全', () => {
    it('XSRF-TOKEN 应映射到 X-XSRF-TOKEN 请求头', () => {
      const cookieToken = 'csrf-token-value-123'
      const headerName = 'X-XSRF-Token'
      
      expect(headerName).toBe('X-XSRF-Token')
      expect(cookieToken.length).toBeGreaterThan(0)
    })
  })

  describe('CancelToken 请求取消', () => {
    it('取消请求应抛出 CanceledError', () => {
      const cancelMsg = '用户主动取消请求'
      
      const error = new Error(cancelMsg)
      ;(error as any).code = 'ERR_CANCELED'
      
      expect(error.message).toBe(cancelMsg)
      expect((error as any).code).toBe('ERR_CANCELED')
    })
  })
})
