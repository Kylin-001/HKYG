/**
 * API 适配器测试
 */
import { describe, it, expect } from 'vitest'
import {
  adaptRequestParams,
  buildPaginationParams,
  adaptFormData,
  adaptQueryParams,
  dataTransformers
} from './adapter'

describe('api adapter', () => {
  describe('buildPaginationParams', () => {
    it('应该使用默认值', () => {
      const result = buildPaginationParams()
      expect(result).toEqual({
        pageNum: 1,
        pageSize: 10,
        orderBy: undefined,
        orderType: undefined
      })
    })

    it('应该正确映射分页参数', () => {
      const result = buildPaginationParams({ page: 2, size: 20, sort: 'id', order: 'desc' })
      expect(result).toEqual({
        pageNum: 2,
        pageSize: 20,
        orderBy: 'id',
        orderType: 'DESC'
      })
    })
  })

  describe('adaptRequestParams', () => {
    it('应该跳过 undefined 和 null', () => {
      const result = adaptRequestParams({ a: 1, b: undefined, c: null, d: 'test' })
      expect(result).toEqual({ a: 1, d: 'test' })
    })

    it('应该处理分页参数映射', () => {
      const result = adaptRequestParams({ page: 2, size: 20 })
      expect(result).toEqual({ pageNum: 2, pageSize: 20 })
    })

    it('应该处理日期范围', () => {
      const result = adaptRequestParams({ dateRange: ['2024-01-01', '2024-12-31'] })
      expect(result).toEqual({ dateStart: '2024-01-01', dateEnd: '2024-12-31' })
    })
  })

  describe('adaptFormData', () => {
    it('应该创建 FormData 对象', () => {
      const result = adaptFormData({ name: 'test', value: 123 })
      expect(result).toBeInstanceOf(FormData)
      expect(result.get('name')).toBe('test')
      expect(result.get('value')).toBe('123')
    })

    it('应该处理对象类型的值', () => {
      const result = adaptFormData({ data: { key: 'value' } })
      expect(result.get('data')).toBe('{"key":"value"}')
    })
  })

  describe('adaptQueryParams', () => {
    it('应该创建 URLSearchParams', () => {
      const result = adaptQueryParams({ a: 1, b: 'test' })
      expect(result).toBeInstanceOf(URLSearchParams)
      expect(result.get('a')).toBe('1')
      expect(result.get('b')).toBe('test')
    })

    it('应该处理数组', () => {
      const result = adaptQueryParams({ ids: [1, 2, 3] })
      expect(result.getAll('ids')).toEqual(['1', '2', '3'])
    })
  })

  describe('dataTransformers', () => {
    describe('date', () => {
      it('应该格式化日期', () => {
        const date = new Date('2024-01-15')
        expect(dataTransformers.date(date)).toBe('2024-01-15')
      })

      it('应该处理字符串日期', () => {
        expect(dataTransformers.date('2024-01-15')).toBe('2024-01-15')
      })

      it('应该处理 null', () => {
        expect(dataTransformers.date(null)).toBeNull()
      })
    })

    describe('moneyFromCent', () => {
      it('应该将分转换为元', () => {
        expect(dataTransformers.moneyFromCent(100)).toBe(1)
        expect(dataTransformers.moneyFromCent(199)).toBe(1.99)
      })

      it('应该处理 null', () => {
        expect(dataTransformers.moneyFromCent(null)).toBeNull()
      })
    })

    describe('moneyToCent', () => {
      it('应该将元转换为分', () => {
        expect(dataTransformers.moneyToCent(1)).toBe(100)
        expect(dataTransformers.moneyToCent(1.99)).toBe(199)
      })

      it('应该四舍五入', () => {
        expect(dataTransformers.moneyToCent(1.999)).toBe(200)
      })
    })

    describe('boolToNumber', () => {
      it('应该转换布尔值', () => {
        expect(dataTransformers.boolToNumber(true)).toBe(1)
        expect(dataTransformers.boolToNumber(false)).toBe(0)
      })
    })

    describe('numberToBool', () => {
      it('应该转换数字为布尔值', () => {
        expect(dataTransformers.numberToBool(1)).toBe(true)
        expect(dataTransformers.numberToBool(0)).toBe(false)
      })
    })
  })
})
