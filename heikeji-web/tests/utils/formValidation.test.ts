import { describe, it, expect } from 'vitest'
import { useFormValidation, commonValidators } from '@/utils/formValidation'

describe('formValidation 工具函数', () => {
  // ============================================
  // commonValidators - 手机号验证
  // ============================================
  describe('commonValidators.phone (手机号验证)', () => {
    it('应该接受有效的中国手机号', () => {
      const rule = commonValidators.phone()
      expect(rule.pattern).toBeDefined()
      
      const validPhones = ['13800138000', '15912345678', '18600001111']
      validPhones.forEach(phone => {
        expect(rule.pattern!.test(phone)).toBe(true)
      })
    })

    it('应该拒绝无效的手机号格式', () => {
      const rule = commonValidators.phone()
      const invalidPhones = [
        '12345678901',  // 首位不是1
        '12800138000',  // 第二位不在3-9
        '1380013800',   // 少一位
        '138001380001', // 多一位
        'abc12345678',  // 含字母
        '',              // 空
      ]
      invalidPhones.forEach(phone => {
        expect(rule.pattern!.test(phone)).toBe(false)
      })
    })

    it('支持自定义错误消息', () => {
      const rule = commonValidators.phone('请输入正确的手机号')
      expect(rule.patternMessage).toBe('请输入正确的手机号')
    })

    it('默认错误消息应合理', () => {
      const rule = commonValidators.phone()
      expect(rule.patternMessage).toContain('phone')
    })
  })

  // ============================================
  // commonValidators - 邮箱验证
  // ============================================
  describe('commonValidators.email (邮箱验证)', () => {
    it('应该接受有效的邮箱地址', () => {
      const rule = commonValidators.email()
      const validEmails = [
        'test@example.com',
        'user.name@domain.org',
        'user123@test.co.uk',
        'a@b.c',
      ]
      validEmails.forEach(email => {
        expect(rule.pattern!.test(email)).toBe(true)
      })
    })

    it('应该拒绝无效的邮箱地址', () => {
      const rule = commonValidators.email()
      const invalidEmails = [
        'plaintext',
        '@example.com',
        'user@',
        'user@.com',
        'user@domain.',
        '',
      ]
      invalidEmails.forEach(email => {
        expect(rule.pattern!.test(email)).toBe(false)
      })
    })

    it('支持自定义错误消息', () => {
      const rule = commonValidators.email('邮箱格式不正确')
      expect(rule.patternMessage).toBe('邮箱格式不正确')
    })
  })

  // ============================================
  // commonValidators - 密码强度验证
  // ============================================
  describe('commonValidators.password (密码强度验证)', () => {
    it('应该接受符合长度要求的密码', () => {
      const rule = commonValidators.password(6, 20)
      const result = rule.custom!('validPass')
      expect(result).toBe(true)
    })

    it('应该拒绝过短的密码', () => {
      const rule = commonValidators.password(6, 20)
      const result = rule.custom!('short')
      expect(result).toBe(false)
    })

    it('应该拒绝过长的密码', () => {
      const rule = commonValidators.password(6, 20)
      const longPassword = 'a'.repeat(21)
      const result = rule.custom!(longPassword)
      expect(result).toBe(false)
    })

    it('应该拒绝非字符串类型的值', () => {
      const rule = commonValidators.password(6, 20)
      expect(rule.custom!(123)).toBe(false)
      expect(rule.custom!(null)).toBe(false)
      expect(rule.custom!(undefined)).toBe(false)
    })

    it('支持自定义长度范围', () => {
      const rule = commonValidators.password(8, 32)
      expect(rule.min).toBe(8)
      expect(rule.max).toBe(32)
      expect(rule.message).toContain('8')
      expect(rule.message).toContain('32')
    })

    it('默认长度应为6-20', () => {
      const rule = commonValidators.password()
      expect(rule.min).toBe(6)
      expect(rule.max).toBe(20)
    })
  })

  // ============================================
  // commonValidators - 身份证号验证
  // ============================================
  describe('commonValidators.idCard (身份证号验证)', () => {
    it('应该接受有效的身份证号（18位）', () => {
      const rule = commonValidators.idCard()
      const validIds = [
        '110105199003071234',  // 标准格式
        '11010519900307123X',  // 以X结尾
        '11010519900307123x',  // 小写x
      ]
      validIds.forEach(id => {
        expect(rule.pattern!.test(id)).toBe(true)
      })
    })

    it('应该拒绝无效的身份证号', () => {
      const rule = commonValidators.idCard()
      const invalidIds = [
        '11010519900307123',   // 17位
        '1101051990030712345', // 19位
        'abcdefghijklnmopqr',   // 全字母
        '',                     // 空
      ]
      invalidIds.forEach(id => {
        expect(rule.pattern!.test(id)).toBe(false)
      })
    })
  })

  // ============================================
  // commonValidators - 必填字段验证
  // ============================================
  describe('commonValidators.required (必填字段验证)', () => {
    it('应该设置required为true', () => {
      const rule = commonValidators.required()
      expect(rule.required).toBe(true)
    })

    it('支持自定义消息', () => {
      const rule = commonValidators.required('此字段必填')
      expect(rule.message).toBe('此字段必填')
    })

    it('默认消息应合理', () => {
      const rule = commonValidators.required()
      expect(rule.message).toContain('required')
    })
  })

  // ============================================
  // commonValidators - URL验证
  // ============================================
  describe('commonValidators.url (URL验证)', () => {
    it('应该接受有效的URL', () => {
      const rule = commonValidators.url()
      const validUrls = [
        'http://example.com',
        'https://www.test.org/path',
        'http://localhost:3000',
      ]
      validUrls.forEach(url => {
        expect(rule.pattern!.test(url)).toBe(true)
      })
    })

    it('应该拒绝无效的URL', () => {
      const rule = commonValidators.url()
      const invalidUrls = [
        'example.com',     // 无协议
        'ftp://test.com',  // 非http/https
        '',               // 空
        'not a url',
      ]
      invalidUrls.forEach(url => {
        expect(rule.pattern!.test(url)).toBe(false)
      })
    })
  })

  // ============================================
  // commonValidators - 数字验证
  // ============================================
  describe('commonValidators.number (数字验证)', () => {
    it('空值或null应返回true（允许为空）', () => {
      const rule = commonValidators.number()
      expect(rule.custom!('')).toBe(true)
      expect(rule.custom!(null)).toBe(true)
      expect(rule.custom!(undefined)).toBe(true)
    })

    it('有效数字应返回true', () => {
      const rule = commonValidators.number()
      expect(rule.custom!('100')).toBe(true)
      expect(rule.custom!('0')).toBe(true)
      expect(rule.custom!('-50')).toBe(true)
      expect(rule.custom!('3.14')).toBe(true)
    })

    it('非数字字符串应返回错误消息', () => {
      const rule = commonValidators.number()
      const result = rule.custom!('abc')
      expect(typeof result).toBe('string') // 返回错误消息
    })

    it('低于最小值应返回错误消息', () => {
      const rule = commonValidators.number(0, 100)
      const result = rule.custom!('-10')
      expect(typeof result).toBe('string')
      expect(result).toContain('0')
    })

    it('超过最大值应返回错误消息', () => {
      const rule = commonValidators.number(0, 100)
      const result = rule.custom!('200')
      expect(typeof result).toBe('string')
      expect(result).toContain('100')
    })

    it('支持仅设置最小值', () => {
      const rule = commonValidators.number(18)
      expect(rule.custom!('17')).toBeTruthy() // 错误消息是truthy
    })

    it('支持仅设置最大值', () => {
      const rule = commonValidators.number(undefined, 150)
      expect(rule.custom!('151')).toBeTruthy()
    })
  })

  // ============================================
  // commonValidators - 中文名字验证
  // ============================================
  describe('commonValidators.chineseName (中文名字验证)', () => {
    it('应该接受有效的中文姓名', () => {
      const rule = commonValidators.chineseName()
      const validNames = ['张三', '李四', '欧阳修', '司马光一二三']
      validNames.forEach(name => {
        expect(rule.pattern!.test(name)).toBe(true)
      })
    })

    it('应该拒绝无效的中文名字', () => {
      const rule = commonValidators.chineseName()
      const invalidNames = ['张', '一二三四五六七八九', 'John', '张3', '']
      invalidNames.forEach(name => {
        expect(rule.pattern!.test(name)).toBe(false)
      })
    })
  })

  // ============================================
  // commonValidators - 学号验证
  // ============================================
  describe('commonValidators.studentId (学号验证)', () => {
    it('应该接受有效学号', () => {
      const rule = commonValidators.studentId()
      const validIds = ['20210101001', '202012345678', '2019000001']
      validIds.forEach(id => {
        expect(rule.pattern!.test(id)).toBe(true)
      })
    })

    it('应该拒绝无效学号', () => {
      const rule = commonValidators.studentId()
      const invalidIds = ['abc', '123', '2021010100123', '']
      invalidIds.forEach(id => {
        expect(rule.pattern!.test(id)).toBe(false)
      })
    })
  })

  // ============================================
  // commonValidators - 确认密码验证
  // ============================================
  describe('commonValidators.confirmPassword (确认密码验证)', () => {
    it('应该有validator函数', () => {
      const rule = commonValidators.confirmPassword('password')
      expect(rule.validator).toBeDefined()
    })

    it('空值时应报错', async () => {
      const rule = commonValidators.confirmPassword('password')
      let capturedError: Error | undefined
      
      await new Promise<void>(resolve => {
        rule.validator!({}, null, (error?: Error) => {
          capturedError = error
          resolve()
        })
      })
      
      expect(capturedError).toBeDefined()
    })

    it('密码不匹配时应报错', async () => {
      const rule = commonValidators.confirmPassword('password')
      // rule 对象需要有 form 属性来访问原始密码
      const formMock: any = { form: { password: 'original' } }

      let capturedError: Error | undefined
      await new Promise<void>(resolve => {
        rule.validator!(formMock, 'different', (error?: Error) => {
          capturedError = error
          resolve()
        })
      })

      expect(capturedError).toBeDefined()
      expect(capturedError?.message).toContain('match')
    })

    it('密码匹配时不报错', async () => {
      const rule = commonValidators.confirmPassword('password')
      // rule 对象需要有 form 属性来访问原始密码
      const formMock: any = { form: { password: 'same' } }

      let capturedError: Error | undefined
      await new Promise<void>(resolve => {
        rule.validator!(formMock, 'same', (error?: Error) => {
          capturedError = error
          resolve()
        })
      })

      expect(capturedError).toBeUndefined()
    })
  })

  // ============================================
  // commonValidators - minLength/maxLength验证
  // ============================================
  describe('minLength/maxLength验证', () => {
    it('minLength应设置最小长度', () => {
      const rule = commonValidators.minLength(5)
      expect(rule.min).toBe(5)
      expect(rule.message).toContain('5')
    })

    it('maxLength应设置最大长度', () => {
      const rule = commonValidators.maxLength(100)
      expect(rule.max).toBe(100)
      expect(rule.message).toContain('100')
    })
  })

  // ============================================
  // useFormValidation 组合函数测试
  // ============================================
  describe('useFormValidation 组合函数', () => {
    it('应该创建表单验证实例', () => {
      const initialValues = { name: '', email: '' }
      const rules = {
        name: [commonValidators.required(), commonValidators.chineseName()],
        email: [commonValidators.required(), commonValidators.email()],
      }

      const { formData, errors, isValid, isSubmitting, elementPlusRules } =
        useFormValidation(initialValues, rules)

      expect(formData.name).toBe('')
      expect(formData.email).toBe('')
      expect(Object.keys(errors).length).toBe(0)
      expect(isValid.value).toBe(true)
      expect(isSubmitting.value).toBe(false)
      expect(elementPlusRules.value).toBeDefined()
    })

    it('setFieldValue和getFieldValue应正确工作', () => {
      const { setFieldValue, getFieldValue } = useFormValidation(
        { name: '' },
        {}
      )

      setFieldValue('name', '测试')
      expect(getFieldValue('name')).toBe('测试')
    })

    it('hasError和getFieldError应正确工作', () => {
      const { hasError, getFieldError } = useFormValidation(
        { name: '' },
        {}
      )

      expect(hasError('name')).toBe(false)
      expect(getFieldError('name')).toBeUndefined()
    })

    it('clearErrors应清除所有错误', () => {
      const { clearErrors } = useFormValidation({ name: '' }, {})

      expect(() => clearErrors()).not.toThrow()
    })
  })

  // ============================================
  // 边界情况测试
  // ============================================
  describe('边界情况', () => {
    it('空规则配置不应报错', () => {
      const { isValid, elementPlusRules } = useFormValidation({}, {})
      expect(isValid.value).toBe(true)
      expect(elementPlusRules.value).toEqual({})
    })

    it('复杂嵌套规则应正常工作', () => {
      const rules = {
        username: [
          commonValidators.required(),
          { min: 3, max: 20, message: '用户名长度应在3-20之间' },
        ],
        email: [
          commonValidators.required(),
          commonValidators.email(),
        ],
        phone: [
          commonValidators.phone(),
        ],
        age: [
          commonValidators.number(0, 150),
        ],
      }

      const { elementPlusRules } = useFormValidation(
        { username: '', email: '', phone: '', age: '' },
        rules
      )

      expect(Object.keys(elementPlusRules.value).length).toBe(4)
    })

    it('特殊字符输入处理', () => {
      const rule = commonValidators.chineseName()
      const specialChars = ['<script>', "'; DROP TABLE", '\\n\\t']
      specialChars.forEach(char => {
        expect(rule.pattern!.test(char)).toBe(false)
      })
    })
  })
})
