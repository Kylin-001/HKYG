import logger from './logger'

interface SecurityRisk {
  type: string
  severity: 'info' | 'warning' | 'high' | 'critical'
  message: string
}

interface SecurityCheckResult {
  isSecure: boolean
  risks: SecurityRisk[]
  recommendations: string[]
}

export class EnhancedSecurityCheck {
  private static canvas: HTMLCanvasElement | null = null

  static generateDeviceFingerprint(): string {
    try {
      this.canvas = document.createElement('canvas')
      const ctx = this.canvas.getContext('2d')
      if (!ctx) return ''

      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillStyle = '#f60'
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = '#069'
      ctx.fillText('Hello, world!', 2, 15)
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
      ctx.fillText('Hello, world!', 4, 17)

      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        this.canvas.toDataURL()
      ].join('|')

      return this.sha256(fingerprint)
    } catch (error) {
      logger.error('生成设备指纹失败:', error)
      return ''
    }
  }

  static performComprehensiveSecurityCheck(): SecurityCheckResult {
    const risks: SecurityRisk[] = []
    const recommendations: string[]

    if (typeof window === 'undefined') {
      risks.push({
        type: 'invalid_environment',
        severity: 'critical',
        message: '无效的运行环境'
      })
    }

    if (window.location.protocol !== 'https:') {
      risks.push({
        type: 'insecure_protocol',
        severity: 'critical',
        message: '当前环境使用非安全连接'
      })
      recommendations.push('请使用HTTPS协议访问')
    }

    const currentFingerprint = this.generateDeviceFingerprint()
    if (currentFingerprint) {
      const storedFingerprint = localStorage.getItem('device_fingerprint')
      if (storedFingerprint && storedFingerprint !== currentFingerprint) {
        risks.push({
          type: 'device_changed',
          severity: 'high',
          message: '检测到设备环境变化'
        })
        recommendations.push('请验证您的身份')
      }
      localStorage.setItem('device_fingerprint', currentFingerprint)
    }

    if (typeof window.crypto === 'undefined' || !window.crypto.subtle) {
      risks.push({
        type: 'crypto_unavailable',
        severity: 'warning',
        message: '浏览器不支持现代加密功能'
      })
      recommendations.push('请使用现代浏览器')
    }

    if (navigator.webdriver || (navigator as any).plugins?.length === 0) {
      risks.push({
        type: 'automation_detected',
        severity: 'high',
        message: '检测到自动化工具'
      })
      recommendations.push('请使用真实浏览器访问')
    }

    if (!window.WebSocket) {
      risks.push({
        type: 'websocket_unavailable',
        severity: 'warning',
        message: '浏览器不支持WebSocket'
      })
      recommendations.push('建议使用支持WebSocket的浏览器')
    }

    return {
      isSecure: risks.length === 0,
      risks,
      recommendations
    }
  }

  static checkIframeEnvironment(): boolean {
    try {
      return window.self !== window.top
    } catch (error) {
      return true
    }
  }

  static checkLocalStorageAvailability(): boolean {
    try {
      const testKey = '__storage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch (error) {
      logger.warn('localStorage不可用:', error)
      return false
    }
  }

  static getSessionStorageAvailability(): boolean {
    try {
      const testKey = '__session_test__'
      sessionStorage.setItem(testKey, 'test')
      sessionStorage.removeItem(testKey)
      return true
    } catch (error) {
      logger.warn('sessionStorage不可用:', error)
      return false
    }
  }

  static checkCookieAvailability(): boolean {
    try {
      document.cookie = 'test=1'
      const enabled = document.cookie.indexOf('test=') !== -1
      return enabled
    } catch (error) {
      logger.warn('Cookie不可用:', error)
      return false
    }
  }

  static getBrowserInfo(): {
    name: string
    version: string
    os: string
    isMobile: boolean
  } {
    const ua = navigator.userAgent
    let browserName = 'Unknown'
    let browserVersion = 'Unknown'
    let os = 'Unknown'

    if (ua.indexOf('Firefox') > -1) {
      browserName = 'Firefox'
      browserVersion = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'Unknown'
    } else if (ua.indexOf('Chrome') > -1) {
      browserName = 'Chrome'
      browserVersion = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'Unknown'
    } else if (ua.indexOf('Safari') > -1) {
      browserName = 'Safari'
      browserVersion = ua.match(/Version\/(\d+\.\d+)/)?.[1] || 'Unknown'
    } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) {
      browserName = 'Internet Explorer'
      browserVersion = ua.match(/MSIE (\d+\.\d+)/)?.[1] || 'Unknown'
    }

    if (ua.indexOf('Windows') > -1) {
      os = 'Windows'
    } else if (ua.indexOf('Mac') > -1) {
      os = 'MacOS'
    } else if (ua.indexOf('Linux') > -1) {
      os = 'Linux'
    } else if (ua.indexOf('Android') > -1) {
      os = 'Android'
    } else if (ua.indexOf('iOS') > -1) {
      os = 'iOS'
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)

    return {
      name: browserName,
      version: browserVersion,
      os,
      isMobile
    }
  }

  private static sha256(str: string): string {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(str)
      return window.crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        return hashHex
      })
    } catch (error) {
      logger.error('SHA256哈希失败:', error)
      return ''
    }
  }
}

export default EnhancedSecurityCheck
