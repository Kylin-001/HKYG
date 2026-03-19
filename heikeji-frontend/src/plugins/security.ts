/**
 * 安全中间件
 * 用于增强应用的安全性
 */

import type { App } from 'vue'

// 内容安全策略
export const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.heikeji.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, ' ')
  .trim()

// 安全头部
export const securityHeaders = {
  'Content-Security-Policy': contentSecurityPolicy,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
}

// XSS防护
export const xssProtection = {
  // 清理HTML内容
  sanitizeHtml: (html: string): string => {
    // 简单的HTML清理，生产环境建议使用DOMPurify等库
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
  },

  // 清理URL
  sanitizeUrl: (url: string): string => {
    try {
      const parsedUrl = new URL(url, window.location.origin)
      // 只允许http和https协议
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return '#'
      }
      return parsedUrl.toString()
    } catch (error) {
      return '#'
    }
  },

  // 清理用户输入
  sanitizeInput: (input: string): string => {
    return input
      .replace(/[<>]/g, '') // 移除潜在的HTML标签
      .replace(/javascript:/gi, '') // 移除javascript协议
      .replace(/on\w+\s*=/gi, '') // 移除事件处理器
  },
}

// CSRF防护
export const csrfProtection = {
  // 生成CSRF令牌
  generateToken: (): string => {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  },

  // 验证CSRF令牌
  validateToken: (token: string, sessionToken: string): boolean => {
    return token === sessionToken
  },
}

// 安全存储
export const secureStorage = {
  // 安全的本地存储
  setItem: (key: string, value: string): void => {
    try {
      // 简单的加密，生产环境建议使用更强的加密方式
      const encrypted = btoa(value)
      localStorage.setItem(key, encrypted)
    } catch (error) {
      console.error('存储数据失败:', error)
    }
  },

  // 安全的本地存储获取
  getItem: (key: string): string | null => {
    try {
      const encrypted = localStorage.getItem(key)
      if (!encrypted) return null

      // 简单的解密
      return atob(encrypted)
    } catch (error) {
      console.error('获取数据失败:', error)
      return null
    }
  },

  // 安全的会话存储
  setSessionItem: (key: string, value: string): void => {
    try {
      const encrypted = btoa(value)
      sessionStorage.setItem(key, encrypted)
    } catch (error) {
      console.error('存储会话数据失败:', error)
    }
  },

  // 安全的会话存储获取
  getSessionItem: (key: string): string | null => {
    try {
      const encrypted = sessionStorage.getItem(key)
      if (!encrypted) return null

      return atob(encrypted)
    } catch (error) {
      console.error('获取会话数据失败:', error)
      return null
    }
  },
}

// 安全检查
export const securityChecks = {
  // 检查是否为安全环境
  isSecureEnvironment: (): boolean => {
    return process.env.NODE_ENV === 'production' && location.protocol === 'https:'
  },

  // 检查浏览器支持
  checkBrowserSupport: (): boolean => {
    return (
      typeof crypto !== 'undefined' && typeof btoa !== 'undefined' && typeof atob !== 'undefined'
    )
  },

  // 检查控制台访问
  checkConsoleAccess: (): boolean => {
    try {
      const { console } = window
      return !!console
    } catch (error) {
      return false
    }
  },
}

// 安全工具函数
export const securityUtils = {
  // 生成随机ID
  generateRandomId: (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  },

  // 生成时间戳
  generateTimestamp: (): number => {
    return Date.now()
  },

  // 检查是否为有效URL
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch (error) {
      return false
    }
  },

  // 检查是否为有效邮箱
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // 检查是否为强密码
  isStrongPassword: (password: string): boolean => {
    // 至少8个字符，包含大小写字母、数字和特殊字符
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return strongPasswordRegex.test(password)
  },
}

// 安全插件
export const securityPlugin = {
  install(app: App) {
    // 提供安全工具
    app.config.globalProperties.$security = {
      xss: xssProtection,
      csrf: csrfProtection,
      storage: secureStorage,
      utils: securityUtils,
      checks: securityChecks,
    }

    // 设置安全头部（如果在浏览器环境中）
    if (typeof window !== 'undefined') {
      Object.entries(securityHeaders).forEach(([key, value]) => {
        // 注意：前端无法直接设置HTTP头部，这里仅作示例
        // 实际应用中应在服务器端设置这些头部
        console.log(`安全头部 ${key}: ${value}`)
      })
    }
  },
}

export default securityPlugin
