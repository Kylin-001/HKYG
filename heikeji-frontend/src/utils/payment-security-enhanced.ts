import CryptoJS from 'crypto-js'
import logger from './logger'

interface SignParams {
  [key: string]: any
}

interface SignResult {
  sign: string
  timestamp: number
  nonce: string
}

export class EnhancedSignature {
  private static NONCE_LENGTH = 16

  static generateNonce(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < this.NONCE_LENGTH; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  static generateEnhancedSign(
    params: SignParams,
    appSecret: string
  ): SignResult {
    const timestamp = Date.now()
    const nonce = this.generateNonce()

    const sortedKeys = Object.keys(params).sort()
    let signStr = sortedKeys
      .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
      .map(key => `${key}=${params[key]}`)
      .join('&')

    signStr += `&timestamp=${timestamp}&nonce=${nonce}`

    const hmac = CryptoJS.HmacSHA256(signStr, appSecret)
    const sign = hmac.toString(CryptoJS.enc.Hex).toUpperCase()

    return { sign, timestamp, nonce }
  }

  static verifyEnhancedSign(
    params: SignParams,
    appSecret: string,
    receivedSign: string,
    timestamp: number,
    nonce: string
  ): boolean {
    const now = Date.now()
    const maxTimeDiff = 5 * 60 * 1000

    if (Math.abs(now - timestamp) > maxTimeDiff) {
      logger.warn(`签名时间戳过期: ${timestamp}, 当前: ${now}`)
      return false
    }

    const generatedSign = this.generateEnhancedSign(
      params,
      appSecret
    )

    return generatedSign.sign === receivedSign
  }

  static generateSign(params: SignParams, appKey: string): string {
    const sortedKeys = Object.keys(params).sort()
    const signStr = sortedKeys
      .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
      .map(key => `${key}=${params[key]}`)
      .join('&')

    const sign = CryptoJS.MD5(signStr + appKey).toString().toUpperCase()
    return sign
  }

  static verifySign(
    params: SignParams,
    appKey: string,
    sign: string
  ): boolean {
    const generatedSign = this.generateSign(params, appKey)
    return generatedSign === sign
  }
}

export default EnhancedSignature
