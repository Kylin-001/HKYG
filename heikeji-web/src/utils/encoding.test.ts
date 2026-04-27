/**
 * 编码工具函数测试
 */
import { describe, it, expect } from 'vitest'
import {
  safeBase64Encode,
  safeBase64Decode,
  urlSafeBase64Encode,
  urlSafeBase64Decode,
  containsNonAscii,
  stringToBytes,
  bytesToString,
  encodeObjectToBase64,
  decodeObjectFromBase64
} from './encoding'

describe('encoding', () => {
  describe('safeBase64Encode/safeBase64Decode', () => {
    it('应该正确编码和解码 ASCII 字符串', () => {
      const original = 'Hello World'
      const encoded = safeBase64Encode(original)
      const decoded = safeBase64Decode(encoded)
      expect(decoded).toBe(original)
    })

    it('应该正确编码和解码中文字符串', () => {
      const original = '你好世界'
      const encoded = safeBase64Encode(original)
      const decoded = safeBase64Decode(encoded)
      expect(decoded).toBe(original)
    })

    it('应该正确编码和解码包含表情符号的字符串', () => {
      const original = 'Hello 🌍 World 🎉'
      const encoded = safeBase64Encode(original)
      const decoded = safeBase64Decode(encoded)
      expect(decoded).toBe(original)
    })

    it('应该正确编码和解码混合内容', () => {
      const original = '中文 English 123 !@#$%'
      const encoded = safeBase64Encode(original)
      const decoded = safeBase64Decode(encoded)
      expect(decoded).toBe(original)
    })

    it('应该正确编码和解码长文本', () => {
      const original = '这是一段很长的中文文本，包含各种字符：ABCabc123!@#，用于测试编码解码功能是否正常。'
      const encoded = safeBase64Encode(original)
      const decoded = safeBase64Decode(encoded)
      expect(decoded).toBe(original)
    })
  })

  describe('urlSafeBase64Encode/urlSafeBase64Decode', () => {
    it('应该生成 URL 安全的字符串', () => {
      const original = 'Hello World!@#$%^&*()'
      const encoded = urlSafeBase64Encode(original)
      expect(encoded).not.toContain('+')
      expect(encoded).not.toContain('/')
      expect(encoded).not.toContain('=')
    })

    it('应该正确解码 URL 安全的字符串', () => {
      const original = '你好世界'
      const encoded = urlSafeBase64Encode(original)
      const decoded = urlSafeBase64Decode(encoded)
      expect(decoded).toBe(original)
    })
  })

  describe('containsNonAscii', () => {
    it('应该正确检测 ASCII 字符串', () => {
      expect(containsNonAscii('Hello World')).toBe(false)
      expect(containsNonAscii('ABC123')).toBe(false)
    })

    it('应该正确检测非 ASCII 字符串', () => {
      expect(containsNonAscii('你好')).toBe(true)
      expect(containsNonAscii('Hello 世界')).toBe(true)
      expect(containsNonAscii('🌍')).toBe(true)
    })
  })

  describe('stringToBytes/bytesToString', () => {
    it('应该正确转换字符串和字节数组', () => {
      const original = 'Hello World'
      const bytes = stringToBytes(original)
      const decoded = bytesToString(bytes)
      expect(decoded).toBe(original)
    })

    it('应该正确处理中文字符', () => {
      const original = '你好世界'
      const bytes = stringToBytes(original)
      const decoded = bytesToString(bytes)
      expect(decoded).toBe(original)
    })
  })

  describe('encodeObjectToBase64/decodeObjectFromBase64', () => {
    it('应该正确编码和解码对象', () => {
      const original = { name: '张三', age: 25, items: ['a', 'b', 'c'] }
      const encoded = encodeObjectToBase64(original)
      const decoded = decodeObjectFromBase64<typeof original>(encoded)
      expect(decoded).toEqual(original)
    })

    it('应该正确处理嵌套对象', () => {
      const original = {
        user: { name: '李四', email: 'lisi@example.com' },
        settings: { theme: 'dark', lang: 'zh-CN' }
      }
      const encoded = encodeObjectToBase64(original)
      const decoded = decodeObjectFromBase64<typeof original>(encoded)
      expect(decoded).toEqual(original)
    })
  })
})
