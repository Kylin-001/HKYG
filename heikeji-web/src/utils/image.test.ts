/**
 * 图片工具函数测试
 */
import { describe, it, expect } from 'vitest'
import {
  formatFileSize,
  validateImageFile,
  base64ToBlob,
  dataTransformers
} from './image'

describe('image utils', () => {
  describe('formatFileSize', () => {
    it('应该正确格式化字节', () => {
      expect(formatFileSize(0)).toBe('0 B')
      expect(formatFileSize(512)).toBe('512 B')
    })

    it('应该正确格式化 KB', () => {
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
    })

    it('应该正确格式化 MB', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB')
    })

    it('应该正确格式化 GB', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })
  })

  describe('validateImageFile', () => {
    it('应该验证通过有效的图片文件', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 })
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('应该拒绝不支持的文件类型', () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      Object.defineProperty(file, 'size', { value: 1024 })
      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.message).toContain('不支持的文件格式')
    })

    it('应该拒绝过大的文件', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 20 * 1024 * 1024 })
      const result = validateImageFile(file, { maxSize: 10 * 1024 * 1024 })
      expect(result.valid).toBe(false)
      expect(result.message).toContain('文件大小不能超过')
    })
  })

  describe('base64ToBlob', () => {
    it('应该正确转换 base64 为 Blob', () => {
      const base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
      const blob = base64ToBlob(base64)
      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('image/jpeg')
    })
  })
})
