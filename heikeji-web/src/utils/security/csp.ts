/**
 * Content Security Policy (CSP) 配置
 *
 * 用于防止XSS攻击、数据注入等安全威胁
 * 支持开发/生产环境不同严格程度
 */

export interface CSPConfig {
  /** 默认资源加载来源 */
  'default-src'?: string[]
  /** 脚本来源 */
  'script-src'?: string[]
  /** 样式来源 */
  'style-src'?: string[]
  /** 图片来源 */
  'img-src'?: string[]
  /** 字体来源 */
  'font-src'?: string[]
  /** 连接目标 (AJAX/WebSocket) */
  'connect-src'?: string[]
  /** 媒体来源 */
  'media-src'?: string[]
  /** 对象/嵌入来源 */
  'object-src'?: string[]
  /** 子框架来源 */
  'frame-src'?: string[]
  /** Worker来源 */
  'worker-src'?: string[]
  /** Base URI */
  'base-uri'?: string[]
  /** 表单提交目标 */
  'form-action'?: string[]
  /** 是否启用报告模式 */
  reportOnly?: boolean
  /** 违规报告上报URL */
  reportUri?: string
}

const CSP_NONCE_KEY = 'csp-nonce'

/**
 * 生成随机nonce值 (用于内联脚本白名单)
 */
export function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * 获取当前请求的nonce (SSR场景)
 */
export function getCurrentNonce(): string | null {
  if (typeof window === 'undefined') return null

  const meta = document.querySelector('meta[name="csp-nonce"]')
  return meta?.getAttribute('content') || null
}

/**
 * 设置meta标签中的nonce (供内联脚本使用)
 */
export function setNonceMeta(nonce: string): void {
  if (typeof document === 'undefined') return

  let meta = document.querySelector('meta[name="csp-nonce"]')

  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'csp-nonce')
    document.head.appendChild(meta)
  }

  meta.setAttribute('content', nonce)
}

// ====== 预设CSP配置 ======

/** 开发环境 - 宽松模式 */
export const DEVELOPMENT_CSP: CSPConfig = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://cdn.jsdelivr.net',
    'https://unpkg.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com',
    'https://cdn.jsdelivr.net',
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://images.unsplash.com',
    'https://via.placeholder.com',
    '*.githubusercontent.com',
  ],
  'connect-src': [
    "'self'",
    'http://localhost:*',
    'https://api.*',
    'wss://*',
  ],
  'font-src': [
    "'self'",
    'data:',
    'https://fonts.gstatic.com',
    'https://fonts.googleapis.com',
  ],
  'media-src': ["'self'", 'blob:'],
  'object-src': ["'none'"],
  'frame-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  reportOnly: false,
}

/** 生产环境 - 严格模式 */
export const PRODUCTION_CSP: CSPConfig = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    // 使用nonce替代unsafe-inline
    // 实际部署时需要替换为: `'nonce-${NONCE}'`
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline", // CSS允许inline (框架限制)
    'https://fonts.googleapis.com',
  ],
  'img-src': [
    "'self'",
    'data:', // base64图片
    'blob:', // blob URL
    'https://cdn.yourdomain.com',
    '*.cloudfront.net',
  ],
  'connect-src': [
    "'self'",
    'https://api.yourdomain.com',
    'wss://ws.yourdomain.com',
  ],
  'font-src': [
    "'self",
    'data:',
    'https://fonts.gstatic.com',
  ],
  'media-src': ["'self", 'blob:'],
  'object-src': ["'none'"],
  'frame-src': [
    "'self'",
    'https://www.youtube.com', // 视频嵌入
  ],
  'worker-src': ["'self'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  reportUri: '/api/security/csp-report',
  reportOnly: process.env.NODE_ENV === 'development',
}

/**
 * 将CSP配置转换为HTTP头字符串
 */
export function buildCSPHeader(config: CSPConfig, nonce?: string): string {
  const directives: string[] = []

  for (const [directive, sources] of Object.entries(config)) {
    if (directive === 'reportOnly' || directive === 'reportUri') continue

    if (Array.isArray(sources) && sources.length > 0) {
      let sourceStr = sources.join(' ')

      // 替换nonce占位符
      if (nonce && sourceStr.includes('${NONCE}')) {
        sourceStr = sourceStr.replace(/\${NONCE}/g, nonce)
      }

      directives.push(`${directive} ${sourceStr}`)
    }
  }

  // 添加报告URI
  if (config.reportUri) {
    directives.push(`report-uri ${config.reportUri}`)
    directives.push('report-to csp-endpoint')
  }

  return directives.join('; ')
}

/**
 * 创建<meta> CSP标签 (用于静态站点或无法设置HTTP头的场景)
 */
export function createCSPMetaTag(config: CSPConfig, nonce?: string): HTMLMetaElement {
  const meta = document.createElement('meta')
  meta.httpEquiv = 'Content-Security-Policy'
  meta.content = buildCSPHeader(config, nonce)

  return meta
}

/**
 * 注入CSP到页面 (客户端方式)
 */
export function injectCSP(config: CSPConfig = PRODUCTION_CSP): void {
  if (typeof document === 'undefined') return

  // 移除已有的CSP meta标签
  const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]')
  if (existingMeta) {
    existingMeta.remove()
  }

  // 生成nonce并注入
  const nonce = generateNonce()
  setNonceMeta(nonce)

  const meta = createCSPMetaTag(config, nonce)
  document.head.prepend(meta)

  console.log('[CSP] Security policy injected with nonce:', nonce.slice(0, 8) + '...')
}

/**
 * CSP违规监控
 */
interface CSPViolation {
  blockedURI: string
  documentURI: string
  referrer: string
  violatedDirective: string
  effectiveDirective: string
  originalPolicy: string
  statusCode: number | null
  sourceFile: string | null
  lineNumber: number | null
  columnNumber: number | null
}

const violations: CSPViolation[] = []

export function getViolations(): CSPViolation[] {
  return [...violations]
}

export function clearViolations(): void {
  violations.length = 0
}

if (typeof window !== 'undefined') {
  document.addEventListener('securitypolicyviolation', (e: Event) => {
    const violation = e as SecurityPolicyViolationEvent
    violations.push({
      blockedURI: violation.blockedURI,
      documentURI: violation.documentURI,
      referrer: violation.referrer,
      violatedDirective: violation.violatedDirective as any,
      effectiveDirective: violation.effectiveDirective as any,
      originalPolicy: violation.originalPolicy,
      statusCode: violation.statusCode,
      sourceFile: violation.sourceFile,
      lineNumber: violation.lineNumber,
      columnNumber: violation.columnNumber,
    })

    console.warn(
      '[CSP Violation]',
      violation.violatedDirective,
      violation.blockedURI
    )

    // 上报到监控系统 (可选)
    if (PRODUCTION_CSP.reportUri) {
      fetch(PRODUCTION_CSP.reportUri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(violation),
      }).catch(() => {})
    }
  })
}

export default {
  generateNonce,
  getCurrentNonce,
  setNonceMeta,
  DEVELOPMENT_CSP,
  PRODUCTION_CSP,
  buildCSPHeader,
  createCSPMetaTag,
  injectCSP,
  getViolations,
}
