const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;'
}

const UNESCAPE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ESCAPE_MAP).map(([key, value]) => [value, key])
)

export function escapeHtml(str: string): string {
  return String(str).replace(/[&<>"'`/]/g, (char) => ESCAPE_MAP[char] || char)
}

export function unescapeHtml(str: string): string {
  return String(str).replace(/&(?:amp|lt|gt|quot|#x27|#x2F|#96);/g, (entity) =>
    UNESCAPE_MAP[entity] || entity
  )
}

export function sanitizeInput(input: unknown): string {
  if (input === null || input === undefined) return ''
  const str = String(input)

  return str
    .replace(/[^\w\s\u4e00-\u9fa5.,!?@#$%^&*()_+\-=[\]{}|;:'"<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function stripTags(html: string): string {
  const tmp = document.createElement('div')
  tmp.textContent = html
  return tmp.textContent || ''
}

export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    const parsed = JSON.parse(json)
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as T
    }
    return fallback
  } catch {
    return fallback
  }
}

export function isSafeUrl(url: string): boolean {
  if (!url) return false

  try {
    const parsedUrl = new URL(url, window.location.origin)
    const allowedProtocols = ['http:', 'https:']
    const dangerousPatterns = [
      /javascript:/i,
      /data:\s*text\/html/i,
      /vbscript:/i
    ]

    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return false
    }

    return !dangerousPatterns.some((pattern) => pattern.test(url))
  } catch {
    return false
  }
}

export function validateRedirectUrl(url: string, allowedDomains: string[] = []): boolean {
  if (!url) return false

  try {
    const parsedUrl = new URL(url, window.location.origin)
    const currentOrigin = window.location.origin

    if (parsedUrl.origin === currentOrigin) return true

    return allowedDomains.some(
      (domain) => parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
    )
  } catch {
    return false
  }
}
