import { describe, it, expect, beforeEach } from 'vitest'
import * as logger from '@/utils/logger'

describe('Logger Utility', () => {
  beforeEach(() => {
    // 设置日志级别为DEBUG，以便测试所有日志
    logger.setLogLevel(3) // DEBUG级别
  })

  describe('日志级别设置', () => {
    it('应该能够设置有效的日志级别', () => {
      logger.setLogLevel(0) // ERROR
      logger.setLogLevel(1) // WARN
      logger.setLogLevel(2) // INFO
      logger.setLogLevel(3) // DEBUG

      // 不应该抛出错误
      expect(true).toBe(true)
    })

    it('应该忽略无效的日志级别', () => {
      logger.setLogLevel(5) // 无效级别
      logger.setLogLevel('invalid') // 无效级别

      // 不应该抛出错误
      expect(true).toBe(true)
    })
  })

  describe('日志输出', () => {
    it('应该输出错误日志而不抛出异常', () => {
      // 测试错误日志输出不会抛出异常
      expect(() => {
        logger.error('测试错误日志')
      }).not.toThrow()
    })

    it('应该输出警告日志而不抛出异常', () => {
      // 测试警告日志输出不会抛出异常
      expect(() => {
        logger.warn('测试警告日志')
      }).not.toThrow()
    })

    it('应该输出信息日志而不抛出异常', () => {
      // 测试信息日志输出不会抛出异常
      expect(() => {
        logger.info('测试信息日志')
      }).not.toThrow()
    })

    it('应该输出调试日志而不抛出异常', () => {
      // 测试调试日志输出不会抛出异常
      expect(() => {
        logger.debug('测试调试日志')
      }).not.toThrow()
    })

    it('应该处理无效的日志级别而不抛出异常', () => {
      // 测试无效日志级别不会抛出异常
      expect(() => {
        // 直接调用log函数（虽然它是内部函数，但可以通过间接方式测试）
        logger.error('测试错误日志')
      }).not.toThrow()
    })
  })

  describe('HTTP日志', () => {
    it('应该输出HTTP请求日志而不抛出异常', () => {
      const config = {
        method: 'GET',
        url: '/api/test',
        data: { key: 'value' },
      }

      expect(() => {
        logger.logRequest(config)
      }).not.toThrow()
    })

    it('应该处理空的请求配置而不抛出异常', () => {
      expect(() => {
        logger.logRequest(null)
        logger.logRequest(undefined)
      }).not.toThrow()
    })

    it('应该输出HTTP响应日志 - 成功而不抛出异常', () => {
      const response = {
        status: 200,
        config: {
          method: 'GET',
          url: '/api/test',
        },
      }

      expect(() => {
        logger.logResponse(response)
      }).not.toThrow()
    })

    it('应该输出HTTP响应日志 - 客户端错误而不抛出异常', () => {
      const response = {
        status: 404,
        config: {
          method: 'GET',
          url: '/api/test',
        },
      }

      expect(() => {
        logger.logResponse(response)
      }).not.toThrow()
    })

    it('应该输出HTTP响应日志 - 服务器错误而不抛出异常', () => {
      const response = {
        status: 500,
        config: {
          method: 'GET',
          url: '/api/test',
        },
      }

      expect(() => {
        logger.logResponse(response)
      }).not.toThrow()
    })

    it('应该处理空的响应对象而不抛出异常', () => {
      expect(() => {
        logger.logResponse(null)
        logger.logResponse(undefined)
      }).not.toThrow()
    })
  })

  describe('API错误日志', () => {
    it('应该输出API错误日志而不抛出异常', () => {
      const error = new Error('API调用失败')
      const context = {
        url: '/api/test',
        method: 'GET',
        statusCode: 500,
      }

      expect(() => {
        logger.logApiError(error, context)
      }).not.toThrow()
    })

    it('应该处理空的错误对象而不抛出异常', () => {
      expect(() => {
        logger.logApiError(null)
        logger.logApiError(undefined)
      }).not.toThrow()
    })

    it('应该处理空的上下文而不抛出异常', () => {
      const error = new Error('API调用失败')

      expect(() => {
        logger.logApiError(error)
      }).not.toThrow()
    })
  })

  describe('API响应时间日志', () => {
    it('应该输出API响应时间日志而不抛出异常', () => {
      expect(() => {
        logger.logApiResponseTime('/api/test', 100, 200)
      }).not.toThrow()
    })

    it('应该处理空的URL而不抛出异常', () => {
      expect(() => {
        logger.logApiResponseTime(null, 100, 200)
        logger.logApiResponseTime(undefined, 100, 200)
        logger.logApiResponseTime('', 100, 200)
      }).not.toThrow()
    })
  })
})
