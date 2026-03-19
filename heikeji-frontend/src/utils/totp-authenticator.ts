/**
 * TOTP 身份验证器工具
 * 用于生成和验证基于时间的一次性密码（TOTP）
 */

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function base32ToBytes(base32: string): number[] {
  const cleaned = base32.replace(/[\s=]/g, '').toUpperCase()
  const bits = cleaned.split('').map(char => {
    const index = BASE32_ALPHABET.indexOf(char)
    if (index === -1) throw new Error(`Invalid base32 character: ${char}`)
    return index
  })

  const bytes: number[] = []
  let buffer = 0
  let bitsInBuffer = 0

  for (const value of bits) {
    buffer = (buffer << 5) | value
    bitsInBuffer += 5

    while (bitsInBuffer >= 8) {
      bytes.push((buffer >> (bitsInBuffer - 8)) & 0xff)
      bitsInBuffer -= 8
    }
  }

  return bytes
}

function hmacSha1(key: number[], message: number[]): number[] {
  const blockSize = 64

  let keyBlock = key.slice()
  if (keyBlock.length > blockSize) {
    keyBlock = sha1(keyBlock)
  }

  while (keyBlock.length < blockSize) {
    keyBlock.push(0)
  }

  const oKeyPad = keyBlock.map(b => b ^ 0x5c)
  const iKeyPad = keyBlock.map(b => b ^ 0x36)

  const innerHash = sha1([...iKeyPad, ...message])
  const result = sha1([...oKeyPad, ...innerHash])

  return result
}

function sha1(data: number[]): number[] {
  const rotatedLeft = (value: number, shift: number): number => {
    return (value << shift) | (value >>> (32 - shift))
  }

  const f = (t: number, b: number, c: number, d: number): number => {
    if (t < 20) return ((b & c) | (~b & d)) >>> 0
    if (t < 40) return (b ^ c ^ d) >>> 0
    if (t < 60) return ((b & c) | (b & d) | (c & d)) >>> 0
    return (b ^ c ^ d) >>> 0
  }

  const k = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6]

  const padded = [...data]
  const originalLength = data.length * 8

  padded.push(0x80)
  while (padded.length % 64 !== 56) {
    padded.push(0)
  }

  for (let i = 7; i >= 0; i--) {
    padded.push((originalLength >>> (i * 8)) & 0xff)
  }

  let h0 = 0x67452301
  let h1 = 0xefcdab89
  let h2 = 0x98badcfe
  let h3 = 0x10325476
  let h4 = 0xc3d2e1f0

  for (let chunk = 0; chunk < padded.length / 64; chunk++) {
    const w = new Array(80)

    for (let i = 0; i < 16; i++) {
      w[i] =
        (padded[chunk * 64 + i * 4] << 24) |
        (padded[chunk * 64 + i * 4 + 1] << 16) |
        (padded[chunk * 64 + i * 4 + 2] << 8) |
        padded[chunk * 64 + i * 4 + 3]
    }

    for (let i = 16; i < 80; i++) {
      const val = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]
      w[i] = rotatedLeft(val, 1)
    }

    let a = h0
    let b = h1
    let c = h2
    let d = h3
    let e = h4

    for (let t = 0; t < 80; t++) {
      const temp = (rotatedLeft(a, 5) + f(t, b, c, d) + e + k[Math.floor(t / 20)] + w[t]) >>> 0
      e = d
      d = c
      c = rotatedLeft(b, 30) >>> 0
      b = a
      a = temp
    }

    h0 = (h0 + a) >>> 0
    h1 = (h1 + b) >>> 0
    h2 = (h2 + c) >>> 0
    h3 = (h3 + d) >>> 0
    h4 = (h4 + e) >>> 0
  }

  return [
    (h0 >>> 24) & 0xff,
    (h0 >>> 16) & 0xff,
    (h0 >>> 8) & 0xff,
    h0 & 0xff,
    (h1 >>> 24) & 0xff,
    (h1 >>> 16) & 0xff,
    (h1 >>> 8) & 0xff,
    h1 & 0xff,
    (h2 >>> 24) & 0xff,
    (h2 >>> 16) & 0xff,
    (h2 >>> 8) & 0xff,
    h2 & 0xff,
    (h3 >>> 24) & 0xff,
    (h3 >>> 16) & 0xff,
    (h3 >>> 8) & 0xff,
    h3 & 0xff,
    (h4 >>> 24) & 0xff,
    (h4 >>> 16) & 0xff,
    (h4 >>> 8) & 0xff,
    h4 & 0xff,
  ]
}

export interface TOTPConfig {
  secret: string
  issuer?: string
  account?: string
  digits?: number
  period?: number
  algorithm?: 'SHA1' | 'SHA256' | 'SHA512'
}

export interface TOTPCode {
  code: string
  expiresAt: number
  period: number
}

export interface TOTPUrl {
  url: string
  secret: string
  issuer: string
  account: string
}

class TOTPAuthenticator {
  private defaultDigits = 6
  private defaultPeriod = 30
  private defaultAlgorithm = 'SHA1'

  /**
   * 生成TOTP密钥
   */
  generateSecret(length: number = 20): string {
    const randomBytes: number[] = []
    for (let i = 0; i < length; i++) {
      randomBytes.push(Math.floor(Math.random() * 256))
    }

    let result = ''
    let bits = 0
    let bitsCount = 0

    for (const byte of randomBytes) {
      bits = (bits << 8) | byte
      bitsCount += 8

      while (bitsCount >= 5) {
        result += BASE32_ALPHABET[(bits >> (bitsCount - 5)) & 0x1f]
        bitsCount -= 5
      }
    }

    if (bitsCount > 0) {
      result += BASE32_ALPHABET[(bits << (5 - bitsCount)) & 0x1f]
    }

    return result
  }

  /**
   * 生成TOTP URI (用于扫描二维码)
   */
  generateTOTPUri(config: TOTPConfig): string {
    const issuer = config.issuer || 'Heikeji'
    const account = config.account || 'user'
    const digits = config.digits || this.defaultDigits
    const period = config.period || this.defaultPeriod
    const algorithm = config.algorithm || this.defaultAlgorithm

    const label = encodeURIComponent(`${issuer}:${account}`)
    const issuerEncoded = encodeURIComponent(issuer)

    return `otpauth://totp/${label}?secret=${config.secret}&issuer=${issuerEncoded}&digits=${digits}&period=${period}&algorithm=${algorithm}`
  }

  /**
   * 解析TOTP URI
   */
  parseTOTPUri(uri: string): TOTPUrl | null {
    try {
      const url = new URL(uri)

      if (url.protocol !== 'otpauth:') {
        return null
      }

      const path = url.pathname.replace(/^\/+/, '')
      if (path !== 'totp') {
        return null
      }

      const params = url.searchParams
      const secret = params.get('secret')
      const issuer = params.get('issuer') || ''
      const pathParts = url.pathname.replace(/^\/+/, '').split(':')
      const account =
        pathParts.length > 1
          ? decodeURIComponent(pathParts.pop() || '')
          : decodeURIComponent(pathParts[0].replace(/^totp\//, ''))

      if (!secret) {
        return null
      }

      return {
        url: uri,
        secret,
        issuer,
        account,
      }
    } catch {
      return null
    }
  }

  /**
   * 生成当前TOTP验证码
   */
  generateCode(secret: string, timestamp?: number): TOTPCode {
    const time = timestamp || Math.floor(Date.now() / 1000)
    const counter = Math.floor(time / this.defaultPeriod)

    const key = base32ToBytes(secret)
    const counterBytes: number[] = []

    let counterCopy = counter
    for (let i = 7; i >= 0; i--) {
      counterBytes.push(counterCopy & 0xff)
      counterCopy >>>= 8
    }

    const hmac = hmacSha1(key, counterBytes)
    const offset = hmac[hmac.length - 1] & 0xf

    const binary =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)

    const otp = binary % Math.pow(10, this.defaultDigits)
    const code = otp.toString().padStart(this.defaultDigits, '0')

    const nextPeriod = (Math.floor(time / this.defaultPeriod) + 1) * this.defaultPeriod

    return {
      code,
      expiresAt: nextPeriod * 1000,
      period: this.defaultPeriod,
    }
  }

  /**
   * 验证TOTP验证码
   */
  verifyCode(secret: string, code: string, window: number = 1): boolean {
    const now = Math.floor(Date.now() / 1000)

    for (let i = -window; i <= window; i++) {
      const timestamp = now + i * this.defaultPeriod
      const generated = this.generateCode(secret, timestamp)

      if (generated.code === code) {
        return true
      }
    }

    return false
  }

  /**
   * 获取剩余有效时间
   */
  getRemainingTime(): number {
    const now = Math.floor(Date.now() / 1000)
    return this.defaultPeriod - (now % this.defaultPeriod)
  }

  /**
   * 验证密钥格式
   */
  isValidSecret(secret: string): boolean {
    try {
      const cleaned = secret.replace(/[\s-]/g, '').toUpperCase()
      return cleaned.length >= 16 && /^[A-Z2-7]+$/.test(cleaned)
    } catch {
      return false
    }
  }
}

export const totpAuthenticator = new TOTPAuthenticator()

export default totpAuthenticator
