import { describe, it, expect } from 'vitest'
import {
  classifyError,
  createUserFriendlyError,
  ErrorCategory,
  ErrorSeverity,
  errorTypeToCategory,
  categoryToErrorType,
} from '@/utils/errorHandler'

describe('errorHandler 工具函数', () => {
  // ============================================
  // ErrorCategory 枚举值验证
  // ============================================
  describe('ErrorCategory 枚举值', () => {
    it('应该包含所有预定义的错误类别', () => {
      expect(ErrorCategory.NETWORK).toBe('network')
      expect(ErrorCategory.HTTP).toBe('http')
      expect(ErrorCategory.BUSINESS).toBe('business')
      expect(ErrorCategory.AUTHENTICATION).toBe('authentication')
      expect(ErrorCategory.AUTHORIZATION).toBe('authorization')
      expect(ErrorCategory.VALIDATION).toBe('validation')
      expect(ErrorCategory.NOT_FOUND).toBe('not_found')
      expect(ErrorCategory.SERVER).toBe('server')
      expect(ErrorCategory.TIMEOUT).toBe('timeout')
      expect(ErrorCategory.UNKNOWN).toBe('unknown')
    })

    it('枚举值数量应该正确', () => {
      const categories = Object.values(ErrorCategory)
      expect(categories.length).toBe(10)
    })
  })

  // ============================================
  // ErrorSeverity 枚举值验证
  // ============================================
  describe('ErrorSeverity 枚举值', () => {
    it('应该包含所有预定义的严重级别', () => {
      expect(ErrorSeverity.INFO).toBe('info')
      expect(ErrorSeverity.WARNING).toBe('warning')
      expect(ErrorSeverity.ERROR).toBe('error')
      expect(ErrorSeverity.FATAL).toBe('fatal')
    })

    it('枚举值数量应该为4', () => {
      const severities = Object.values(ErrorSeverity)
      expect(severities.length).toBe(4)
    })
  })

  // ============================================
  // classifyError - 网络错误分类测试
  // ============================================
  describe('classifyError - 网络错误分类', () => {
    it('应该识别Network Error', () => {
      const error = new Error('Network Error')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.NETWORK)
      expect(result.severity).toBe(ErrorSeverity.ERROR)
      expect(result.retryable).toBe(true)
      expect(result.suggestedAction).toBe('retry')
    })

    it('应该识别Failed to fetch错误', () => {
      const error = new Error('Failed to fetch')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.NETWORK)
    })

    it('应该识别中文网络错误消息', () => {
      const error = new Error('网络请求失败')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.NETWORK)
    })
  })

  // ============================================
  // classifyError - 超时错误分类测试
  // ============================================
  describe('classifyError - 超时错误分类', () => {
    it('应该识别timeout错误消息', () => {
      const error = new Error('Request timeout')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.TIMEOUT)
      expect(result.severity).toBe(ErrorSeverity.ERROR)
      expect(result.retryable).toBe(true)
    })

    it('应该识别中文超时错误', () => {
      const error = new Error('请求超时')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.TIMEOUT)
    })

    it('应该识别aborted错误', () => {
      const error = new Error('Request aborted')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.TIMEOUT)
    })

    it('应该识别ECONNABORTED代码', () => {
      const error: any = new Error('Aborted')
      error.code = 'ECONNABORTED'
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.TIMEOUT)
    })
  })

  // ============================================
  // classifyError - HTTP状态码分类测试
  // ============================================
  describe('classifyError - HTTP状态码分类', () => {
    it('应该分类400 Bad Request', () => {
      const error = createHttpError(400, 'Bad Request')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.VALIDATION)
      expect(result.severity).toBe(ErrorSeverity.WARNING)
      expect(result.statusCode).toBe(400)
      expect(result.retryable).toBe(false)
    })

    it('应该分类401 Unauthorized', () => {
      const error = createHttpError(401, 'Unauthorized')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.AUTHENTICATION)
      expect(result.severity).toBe(ErrorSeverity.ERROR)
      expect(result.suggestedAction).toBe('login')
    })

    it('应该分类403 Forbidden', () => {
      const error = createHttpError(403, 'Forbidden')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.AUTHORIZATION)
      expect(result.suggestedAction).toBe('goHome')
    })

    it('应该分类404 Not Found', () => {
      const error = createHttpError(404, 'Not Found')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.NOT_FOUND)
      expect(result.severity).toBe(ErrorSeverity.WARNING)
    })

    it('应该分类500 Internal Server Error', () => {
      const error = createHttpError(500, 'Internal Server Error')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.SERVER)
      expect(result.severity).toBe(ErrorSeverity.ERROR)
      expect(result.retryable).toBe(true)
    })

    it('应该分类502 Bad Gateway', () => {
      const error = createHttpError(502, 'Bad Gateway')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.SERVER)
      expect(result.retryable).toBe(true)
    })

    it('应该分类503 Service Unavailable', () => {
      const error = createHttpError(503, 'Service Unavailable')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.SERVER)
      expect(result.severity).toBe(ErrorSeverity.FATAL)
      expect(result.suggestedAction).toBe('refresh')
    })

    it('应该分类504 Gateway Timeout', () => {
      const error = createHttpError(504, 'Gateway Timeout')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.TIMEOUT)
      expect(result.retryable).toBe(true)
    })

    it('应该分类429 Too Many Requests', () => {
      const error = createHttpError(429, 'Too Many Requests')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.HTTP)
      expect(result.retryable).toBe(true)
    })

    it('未映射的5xx状态码应标记为可重试', () => {
      const error = createHttpError(501, 'Not Implemented')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.HTTP)
      expect(result.retryable).toBe(true) // 5xx默认可重试
    })

    it('未映射的4xx状态码应标记为不可重试', () => {
      const error = createHttpError(418, "I'm a teapot")
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.HTTP)
      expect(result.retryable).toBe(false) // 非5xx默认不可重试
    })
  })

  // ============================================
  // classifyError - 业务错误分类测试
  // ============================================
  describe('classifyError - 业务错误分类', () => {
    it('应该识别带有code字段业务错误', () => {
      const error = createHttpError(200, 'Business Error', {
        code: 'ERR_001',
        message: '库存不足',
      })
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.BUSINESS)
      expect(result.errorCode).toBe('ERR_001')
      expect(result.userMessage).toBe('库存不足')
      expect(result.retryable).toBe(false)
    })

    it('应该识别带有errorCode字段业务错误', () => {
      const error = createHttpError(200, 'Business Error', {
        errorCode: 'BUSINESS_ERROR',
        message: '参数错误',
      })
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.BUSINESS)
      expect(result.errorCode).toBe('BUSINESS_ERROR')
    })

    it('应该识别带有errCode字段业务错误', () => {
      const error = createHttpError(200, 'Business Error', {
        errCode: 'CUSTOM_ERR',
        message: '自定义错误',
      })
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.BUSINESS)
      expect(result.errorCode).toBe('CUSTOM_ERR')
    })
  })

  // ============================================
  // classifyError - 普通Error对象测试
  // ============================================
  describe('classifyError - 普通Error对象', () => {
    it('应该将普通Error分类为UNKNOWN', () => {
      const error = new Error('Something went wrong')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.UNKNOWN)
      expect(result.severity).toBe(ErrorSeverity.ERROR)
      expect(result.technicalDetail).toContain('Error:')
      expect(result.technicalDetail).toContain('Something went wrong')
      expect(result.retryable).toBe(true)
    })

    it('应该保留Error的stack信息', () => {
      const error = new Error('Test error with stack')
      const result = classifyError(error)

      expect(result.technicalDetail).toBeDefined()
    })
  })

  // ============================================
  // classifyError - 其他类型错误测试
  // ============================================
  describe('classifyError - 其他类型错误', () => {
    it('应该处理字符串类型的错误', () => {
      const result = classifyError('String error')

      expect(result.category).toBe(ErrorCategory.UNKNOWN)
      expect(result.technicalDetail).toBe('Unknown Error: String error')
    })

    it('应该处理null/undefined错误', () => {
      const result = classifyError(null)

      expect(result.category).toBe(ErrorCategory.UNKNOWN)
      expect(result.technicalDetail).toBe('Unknown Error: null')
    })

    it('应该处理数字类型的错误', () => {
      const result = classifyError(500)

      expect(result.category).toBe(ErrorCategory.UNKNOWN)
      expect(result.originalError).toBe(500)
    })

    it('应该处理对象类型但非Error的错误', () => {
      const result = classifyError({ customError: true })

      expect(result.category).toBe(ErrorCategory.UNKNOWN)
    })
  })

  // ============================================
  // classifyError - context参数测试
  // ============================================
  describe('classifyError - context参数', () => {
    it('应该将context信息附加到结果中', () => {
      const error = new Error('Test')
      const context = { component: 'UserForm', action: 'submit' }
      const result = classifyError(error, context)

      expect(result.context).toEqual(context)
    })

    it('不传context时context应为undefined', () => {
      const error = new Error('Test')
      const result = classifyError(error)

      expect(result.context).toBeUndefined()
    })
  })

  // ============================================
  // classifyError - timestamp测试
  // ============================================
  describe('classifyError - timestamp', () => {
    it('应该设置当前时间戳', () => {
      const before = Date.now()
      const error = new Error('Test')
      const result = classifyError(error)
      const after = Date.now()

      expect(result.timestamp).toBeGreaterThanOrEqual(before)
      expect(result.timestamp).toBeLessThanOrEqual(after)
    })
  })

  // ============================================
  // createUserFriendlyError 测试
  // ============================================
  describe('createUserFriendlyError', () => {
    it('应该创建用户友好的错误对象', () => {
      const error = createHttpError(404, 'Not Found')
      const result = createUserFriendlyError(error)

      expect(result.type).toBeDefined()
      expect(result.title).toBeDefined()
      expect(result.message).toBeDefined()
      expect(result.detail).toBeDefined()
      expect(result.retryable).toBeDefined()
      expect(result.suggestedAction).toBeDefined()
    })

    it('支持自定义title和message', () => {
      const error = new Error('Test')
      const result = createUserFriendlyError(error, {
        customTitle: '自定义标题',
        customMessage: '自定义消息',
      })

      expect(result.title).toBe('自定义标题')
      expect(result.message).toBe('自定义消息')
    })

    it('不传自定义选项时使用默认值', () => {
      const error = new Error('Test')
      const result = createUserFriendlyError(error)

      expect(result.title).toBe('')
      expect(result.message).toBe('')
    })

    it('支持传递context', () => {
      const error = new Error('Test')
      const context = { page: 'home' }
      const result = createUserFriendlyError(error, { context })

      expect(result.detail).toBeDefined() // detail来自classified.technicalDetail
    })
  })

  // ============================================
  // errorTypeToCategory 测试
  // ============================================
  describe('errorTypeToCategory', () => {
    it('network应该映射到NETWORK', () => {
      expect(errorTypeToCategory('network')).toBe(ErrorCategory.NETWORK)
    })

    it('server应该映射到SERVER', () => {
      expect(errorTypeToCategory('server')).toBe(ErrorCategory.SERVER)
    })

    it('permission应该映射到AUTHORIZATION', () => {
      expect(errorTypeToCategory('permission')).toBe(ErrorCategory.AUTHORIZATION)
    })

    it('unauthorized应该映射到AUTHENTICATION', () => {
      expect(errorTypeToCategory('unauthorized')).toBe(ErrorCategory.AUTHENTICATION)
    })

    it('not_found应该映射到NOT_FOUND', () => {
      expect(errorTypeToCategory('not_found')).toBe(ErrorCategory.NOT_FOUND)
    })

    it('business应该映射到BUSINESS', () => {
      expect(errorTypeToCategory('business')).toBe(ErrorCategory.BUSINESS)
    })

    it('未知类型应该映射到UNKNOWN', () => {
      expect(errorTypeToCategory('unknown_type')).toBe(ErrorCategory.UNKNOWN)
    })
  })

  // ============================================
  // categoryToErrorType 测试
  // ============================================
  describe('categoryToErrorType', () => {
    it('NETWORK应该映射到network', () => {
      expect(categoryToErrorType(ErrorCategory.NETWORK)).toBe('network')
    })

    it('HTTP应该映射到server', () => {
      expect(categoryToErrorType(ErrorCategory.HTTP)).toBe('server')
    })

    it('AUTHENTICATION应该映射到unauthorized', () => {
      expect(categoryToErrorType(ErrorCategory.AUTHENTICATION)).toBe('unauthorized')
    })

    it('AUTHORIZATION应该映射到permission', () => {
      expect(categoryToErrorType(ErrorCategory.AUTHORIZATION)).toBe('permission')
    })

    it('NOT_FOUND应该映射到not_found', () => {
      expect(categoryToErrorType(ErrorCategory.NOT_FOUND)).toBe('not_found')
    })

    it('TIMEOUT应该映射到network', () => {
      expect(categoryToErrorType(ErrorCategory.TIMEOUT)).toBe('network')
    })

    it('UNKNOWN应该映射到unknown', () => {
      expect(categoryToErrorType(ErrorCategory.UNKNOWN)).toBe('unknown')
    })
  })

  // ============================================
  // 边界情况测试
  // ============================================
  describe('边界情况', () => {
    it('空字符串HTTP响应体', () => {
      const error = createHttpError(500, '')
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.SERVER)
    })

    it('HTTP响应无data字段', () => {
      const error: any = {
        response: {
          status: 404,
          data: undefined,
        },
        message: 'Not found',
      }
      const result = classifyError(error)

      expect(result.category).toBe(ErrorCategory.NOT_FOUND)
    })

    it('大量并发错误分类不应崩溃', () => {
      const errors = Array.from({ length: 100 }, (_, i) =>
        createHttpError(i % 600, `Error ${i}`)
      )

      const results = errors.map(e => classifyError(e))

      expect(results.length).toBe(100)
      expect(results.every(r => r.category && r.severity)).toBe(true)
    })
  })
})

// Helper function to create HTTP-like errors
function createHttpError(
  status: number,
  message: string,
  data?: Record<string, unknown>
): any {
  return {
    response: {
      status,
      data: data || { message },
    },
    message,
  }
}
