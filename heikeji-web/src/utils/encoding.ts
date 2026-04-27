/**
 * 编码工具函数
 * 提供安全的 Base64 编码/解码功能，支持 UTF-8（包括中文）
 * 
 * 问题背景：
 * - btoa/atob 只支持 Latin-1 字符集，对中文等 UTF-8 字符会抛出异常或产生乱码
 * - 这些函数提供兼容 UTF-8 的 Base64 编解码
 */

/**
 * 将 UTF-8 字符串编码为 Base64
 * 支持中文、表情符号等所有 Unicode 字符
 * 
 * @param str 要编码的字符串
 * @returns Base64 编码的字符串
 * @example
 * safeBase64Encode('你好世界') // '5L2g5aW95LiW55WM'
 * safeBase64Encode('Hello 🌍') // 'SGVsbG8g8J+MjQ=='
 */
export function safeBase64Encode(str: string): string {
  try {
    // 使用 TextEncoder 将字符串转换为 UTF-8 字节数组
    const bytes = new TextEncoder().encode(str)
    // 将字节数组转换为二进制字符串
    const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
    // 使用 btoa 进行 Base64 编码
    return btoa(binString)
  } catch (error) {
    console.error('[encoding] Base64 encode failed:', error)
    throw new Error(`Failed to encode string to Base64: ${error}`)
  }
}

/**
 * 将 Base64 字符串解码为 UTF-8 字符串
 * 支持中文、表情符号等所有 Unicode 字符
 * 
 * @param base64 Base64 编码的字符串
 * @returns 解码后的字符串
 * @example
 * safeBase64Decode('5L2g5aW95LiW55WM') // '你好世界'
 * safeBase64Decode('SGVsbG8g8J+MjQ==') // 'Hello 🌍'
 */
export function safeBase64Decode(base64: string): string {
  try {
    // 使用 atob 解码 Base64 为二进制字符串
    const binString = atob(base64)
    // 将二进制字符串转换为字节数组
    const bytes = Uint8Array.from(binString, (char) => char.charCodeAt(0))
    // 使用 TextDecoder 解码为 UTF-8 字符串
    return new TextDecoder().decode(bytes)
  } catch (error) {
    console.error('[encoding] Base64 decode failed:', error)
    throw new Error(`Failed to decode Base64 string: ${error}`)
  }
}

/**
 * URL 安全的 Base64 编码（替换 +/= 为 URL 安全字符）
 * 
 * @param str 要编码的字符串
 * @returns URL 安全的 Base64 字符串
 */
export function urlSafeBase64Encode(str: string): string {
  return safeBase64Encode(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * URL 安全的 Base64 解码
 * 
 * @param base64 URL 安全的 Base64 字符串
 * @returns 解码后的字符串
 */
export function urlSafeBase64Decode(base64: string): string {
  // 还原 URL 安全字符为标准 Base64
  const padding = 4 - (base64.length % 4)
  if (padding !== 4) {
    base64 += '='.repeat(padding)
  }
  const standardBase64 = base64
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  
  return safeBase64Decode(standardBase64)
}

/**
 * 检查字符串是否包含非 ASCII 字符（如中文）
 * 
 * @param str 要检查的字符串
 * @returns 是否包含非 ASCII 字符
 */
export function containsNonAscii(str: string): boolean {
  return /[^\x00-\x7F]/.test(str)
}

/**
 * 将字符串转换为字节数组（Uint8Array）
 * 
 * @param str 输入字符串
 * @returns UTF-8 字节数组
 */
export function stringToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

/**
 * 将字节数组转换为字符串
 * 
 * @param bytes 字节数组
 * @returns UTF-8 字符串
 */
export function bytesToString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes)
}

/**
 * 将对象编码为 Base64 JSON 字符串
 * 适用于 URL 参数传递
 * 
 * @param obj 要编码的对象
 * @returns Base64 编码的 JSON 字符串
 */
export function encodeObjectToBase64(obj: unknown): string {
  return safeBase64Encode(JSON.stringify(obj))
}

/**
 * 将 Base64 JSON 字符串解码为对象
 * 
 * @param base64 Base64 编码的 JSON 字符串
 * @returns 解码后的对象
 */
export function decodeObjectFromBase64<T = unknown>(base64: string): T {
  return JSON.parse(safeBase64Decode(base64)) as T
}
