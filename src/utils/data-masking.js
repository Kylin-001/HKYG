/**
 * 数据脱敏工具
 * 用于在开发和测试环境中对敏感数据进行脱敏处理
 */

const crypto = require('crypto')

/**
 * 数据脱敏类
 */
class DataMasking {
  constructor() {
    this.maskingRules = {
      // 手机号脱敏规则
      phone: (value) => {
        if (!value || value.length < 7) return value
        return value.substring(0, 3) + '****' + value.substring(value.length - 4)
      },
      
      // 邮箱脱敏规则
      email: (value) => {
        if (!value || !value.includes('@')) return value
        const [username, domain] = value.split('@')
        const maskedUsername = username.substring(0, 2) + '***' + username.substring(username.length - 1)
        return maskedUsername + '@' + domain
      },
      
      // 身份证号脱敏规则
      idCard: (value) => {
        if (!value || value.length < 8) return value
        return value.substring(0, 6) + '********' + value.substring(value.length - 4)
      },
      
      // 银行卡号脱敏规则
      bankCard: (value) => {
        if (!value || value.length < 8) return value
        return '**** **** **** ' + value.substring(value.length - 4)
      },
      
      // 姓名脱敏规则
      name: (value) => {
        if (!value || value.length < 2) return value
        if (value.length === 2) return value.substring(0, 1) + '*'
        return value.substring(0, 1) + '*'.repeat(value.length - 2) + value.substring(value.length - 1)
      },
      
      // 地址脱敏规则
      address: (value) => {
        if (!value || value.length < 10) return value
        return value.substring(0, 6) + '***' + value.substring(value.length - 6)
      },
      
      // 密码脱敏规则（完全隐藏）
      password: () => {
        return '******'
      },
      
      // 默认脱敏规则
      default: (value) => {
        if (!value || value.length < 4) return value
        return value.substring(0, 2) + '***' + value.substring(value.length - 2)
      }
    }
  }
  
  /**
   * 根据字段名获取脱敏规则
   */
  getMaskingRule(fieldName) {
    const lowerFieldName = fieldName.toLowerCase()
    
    if (lowerFieldName.includes('phone') || lowerFieldName.includes('mobile')) {
      return this.maskingRules.phone
    } else if (lowerFieldName.includes('email')) {
      return this.maskingRules.email
    } else if (lowerFieldName.includes('idcard') || lowerFieldName.includes('id_card')) {
      return this.maskingRules.idCard
    } else if (lowerFieldName.includes('bank') || lowerFieldName.includes('card')) {
      return this.maskingRules.bankCard
    } else if (lowerFieldName.includes('name') && !lowerFieldName.includes('username')) {
      return this.maskingRules.name
    } else if (lowerFieldName.includes('address')) {
      return this.maskingRules.address
    } else if (lowerFieldName.includes('password') || lowerFieldName.includes('pwd') || lowerFieldName.includes('secret')) {
      return this.maskingRules.password
    } else {
      return this.maskingRules.default
    }
  }
  
  /**
   * 脱敏字符串值
   */
  maskString(value, fieldName) {
    if (typeof value !== 'string') {
      return value
    }
    
    const rule = this.getMaskingRule(fieldName)
    return rule(value)
  }
  
  /**
   * 脱敏对象
   */
  maskObject(obj, options = {}) {
    const { 
      excludeFields = [], 
      includeFields = [], 
      deep = true 
    } = options
    
    if (typeof obj !== 'object' || obj === null) {
      return obj
    }
    
    const result = Array.isArray(obj) ? [] : {}
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 检查是否应该排除此字段
        if (excludeFields.includes(key)) {
          result[key] = obj[key]
          continue
        }
        
        // 检查是否应该包含此字段
        if (includeFields.length > 0 && !includeFields.includes(key)) {
          result[key] = obj[key]
          continue
        }
        
        const value = obj[key]
        
        if (typeof value === 'string') {
          result[key] = this.maskString(value, key)
        } else if (typeof value === 'object' && value !== null && deep) {
          result[key] = this.maskObject(value, options)
        } else {
          result[key] = value
        }
      }
    }
    
    return result
  }
  
  /**
   * 脱敏JSON字符串
   */
  maskJsonString(jsonString, options = {}) {
    try {
      const obj = JSON.parse(jsonString)
      const maskedObj = this.maskObject(obj, options)
      return JSON.stringify(maskedObj)
    } catch (error) {
      console.error('JSON解析失败:', error.message)
      return jsonString
    }
  }
  
  /**
   * 生成随机替换值
   */
  generateRandomValue(originalValue, type) {
    switch (type) {
      case 'phone':
        return '1' + Math.random().toString().substring(2, 11)
      case 'email':
        return 'user' + Math.floor(Math.random() * 10000) + '@example.com'
      case 'name':
        const surnames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴']
        const names = ['三', '四', '五', '六', '七', '八', '九', '十']
        return surnames[Math.floor(Math.random() * surnames.length)] + names[Math.floor(Math.random() * names.length)]
      case 'idcard':
        return Math.floor(Math.random() * 9000000000000000) + 1000000000000000
      default:
        return '***'
    }
  }
  
  /**
   * 替换敏感数据为随机值
   */
  replaceWithRandom(obj, options = {}) {
    const { 
      excludeFields = [], 
      includeFields = [], 
      deep = true 
    } = options
    
    if (typeof obj !== 'object' || obj === null) {
      return obj
    }
    
    const result = Array.isArray(obj) ? [] : {}
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 检查是否应该排除此字段
        if (excludeFields.includes(key)) {
          result[key] = obj[key]
          continue
        }
        
        // 检查是否应该包含此字段
        if (includeFields.length > 0 && !includeFields.includes(key)) {
          result[key] = obj[key]
          continue
        }
        
        const value = obj[key]
        
        if (typeof value === 'string') {
          const lowerKey = key.toLowerCase()
          let type = 'default'
          
          if (lowerKey.includes('phone') || lowerKey.includes('mobile')) {
            type = 'phone'
          } else if (lowerKey.includes('email')) {
            type = 'email'
          } else if (lowerKey.includes('name') && !lowerKey.includes('username')) {
            type = 'name'
          } else if (lowerKey.includes('idcard') || lowerKey.includes('id_card')) {
            type = 'idcard'
          }
          
          result[key] = this.generateRandomValue(value, type)
        } else if (typeof value === 'object' && value !== null && deep) {
          result[key] = this.replaceWithRandom(value, options)
        } else {
          result[key] = value
        }
      }
    }
    
    return result
  }
}

/**
 * 数据库查询结果脱敏
 */
class DatabaseQueryMasking {
  constructor() {
    this.dataMasking = new DataMasking()
  }
  
  /**
   * 脱敏查询结果
   */
  maskQueryResult(result, options = {}) {
    if (Array.isArray(result)) {
      return result.map(row => this.dataMasking.maskObject(row, options))
    } else if (typeof result === 'object' && result !== null) {
      return this.dataMasking.maskObject(result, options)
    }
    
    return result
  }
  
  /**
   * 脱敏SQL查询结果（模拟）
   */
  maskSqlQuery(sql, params, options = {}) {
    // 这里应该根据实际的数据库查询方式进行调整
    // 示例：假设有一个执行SQL查询的方法
    // const result = executeSql(sql, params)
    // return this.maskQueryResult(result, options)
    
    console.log('模拟SQL查询脱敏:', sql)
    console.log('参数:', params)
    console.log('脱敏选项:', options)
    
    return { message: 'SQL查询已脱敏处理' }
  }
}

/**
 * API响应脱敏
 */
class ApiResponseMasking {
  constructor() {
    this.dataMasking = new DataMasking()
  }
  
  /**
   * 脱敏API响应数据
   */
  maskApiResponse(response, options = {}) {
    if (!response || typeof response !== 'object') {
      return response
    }
    
    // 如果响应有data字段，只脱敏data部分
    if (response.data) {
      return {
        ...response,
        data: this.dataMasking.maskObject(response.data, options)
      }
    }
    
    // 否则脱敏整个响应
    return this.dataMasking.maskObject(response, options)
  }
  
  /**
   * 脱敏错误响应（避免泄露敏感信息）
   */
  maskErrorResponse(error) {
    if (!error || typeof error !== 'object') {
      return error
    }
    
    // 创建安全的错误响应
    const safeError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || '未知错误',
      timestamp: new Date().toISOString()
    }
    
    // 移除可能包含敏感信息的字段
    delete safeError.stack
    delete safeError.details
    delete safeError.sql
    delete safeError.config
    
    return safeError
  }
}

/**
 * 日志脱敏
 */
class LogMasking {
  constructor() {
    this.dataMasking = new DataMasking()
    this.sensitivePatterns = [
      /password["\s]*[=:]["\s]*[^""]+/gi,
      /pwd["\s]*[=:]["\s]*[^""]+/gi,
      /secret["\s]*[=:]["\s]*[^""]+/gi,
      /token["\s]*[=:]["\s]*[^""]+/gi,
      /key["\s]*[=:]["\s]*[^""]+/gi,
      /api[_-]?key["\s]*[=:]["\s]*[^""]+/gi,
      /access[_-]?token["\s]*[=:]["\s]*[^""]+/gi,
      /private[_-]?key["\s]*[=:]["\s]*[^""]+/gi
    ]
  }
  
  /**
   * 脱敏日志消息
   */
  maskLogMessage(message) {
    if (typeof message !== 'string') {
      return message
    }
    
    let maskedMessage = message
    
    // 替换敏感信息模式
    this.sensitivePatterns.forEach(pattern => {
      maskedMessage = maskedMessage.replace(pattern, (match) => {
        return match.substring(0, match.indexOf('=') + 2) + '***'
      })
    })
    
    return maskedMessage
  }
  
  /**
   * 脱敏日志对象
   */
  maskLogObject(logObject) {
    if (!logObject || typeof logObject !== 'object') {
      return logObject
    }
    
    // 脱敏常见敏感字段
    const sensitiveFields = ['password', 'pwd', 'secret', 'token', 'key', 'apiKey', 'accessToken']
    const options = {
      includeFields: sensitiveFields,
      deep: true
    }
    
    return this.dataMasking.maskObject(logObject, options)
  }
}

// 导出类
module.exports = {
  DataMasking,
  DatabaseQueryMasking,
  ApiResponseMasking,
  LogMasking
}

// 如果直接运行此文件，执行示例
if (require.main === module) {
  const { DataMasking, DatabaseQueryMasking, ApiResponseMasking, LogMasking } = require('./data-masking')
  
  console.log('=== 数据脱敏工具示例 ===')
  
  // 示例1: 字符串脱敏
  const masking = new DataMasking()
  console.log('手机号脱敏:', masking.maskString('13800138000', 'phone'))
  console.log('邮箱脱敏:', masking.maskString('zhangsan@example.com', 'email'))
  console.log('身份证脱敏:', masking.maskString('110101199001011234', 'idCard'))
  
  // 示例2: 对象脱敏
  const userData = {
    id: 1,
    name: '张三',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    idCard: '110101199001011234',
    address: '北京市朝阳区某某街道123号'
  }
  
  console.log('\n原始数据:', userData)
  console.log('脱敏数据:', masking.maskObject(userData))
  
  // 示例3: 指定字段脱敏
  console.log('\n只脱敏敏感字段:', masking.maskObject(userData, { includeFields: ['phone', 'email', 'idCard'] }))
  
  // 示例4: 排除字段脱敏
  console.log('\n排除name字段脱敏:', masking.maskObject(userData, { excludeFields: ['name'] }))
  
  // 示例5: 随机替换
  console.log('\n随机替换数据:', masking.replaceWithRandom(userData))
  
  // 示例6: 日志脱敏
  const logMasking = new LogMasking()
  const logMessage = '用户登录: username=admin, password=123456, token=abcdef123456'
  console.log('\n原始日志:', logMessage)
  console.log('脱敏日志:', logMasking.maskLogMessage(logMessage))
  
  const logObject = {
    level: 'info',
    message: '用户登录成功',
    user: {
      username: 'admin',
      password: '123456',
      email: 'admin@example.com'
    }
  }
  
  console.log('\n原始日志对象:', logObject)
  console.log('脱敏日志对象:', logMasking.maskLogObject(logObject))
}