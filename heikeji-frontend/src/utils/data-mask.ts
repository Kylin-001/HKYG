/**
 * 数据脱敏工具
 * 用于对敏感数据进行脱敏处理
 */

export interface MaskOptions {
  showStart?: number
  showEnd?: number
  maskChar?: string
  maskAll?: boolean
}

export interface MaskRule {
  type: 'phone' | 'idCard' | 'bankCard' | 'email' | 'name' | 'address' | 'password' | 'custom'
  pattern?: RegExp
  showStart?: number
  showEnd?: number
  maskChar?: string
}

const DEFAULT_MASK_CHAR = '*'

export const maskUtils = {
  /**
   * 手机号脱敏
   * 示例: 13812345678 -> 138****5678
   */
  maskPhone(phone: string, options: MaskOptions = {}): string {
    const { showStart = 3, showEnd = 4, maskChar = DEFAULT_MASK_CHAR } = options
    if (!phone || phone.length < 7) return phone

    const start = phone.substring(0, showStart)
    const end = phone.substring(phone.length - showEnd)
    const maskLength = phone.length - showStart - showEnd

    return start + maskChar.repeat(maskLength) + end
  },

  /**
   * 身份证号脱敏
   * 示例: 110101199001011234 -> 110***********1234
   */
  maskIdCard(idCard: string, options: MaskOptions = {}): string {
    const { showStart = 3, showEnd = 4, maskChar = DEFAULT_MASK_CHAR } = options
    if (!idCard || idCard.length < 10) return idCard

    const start = idCard.substring(0, showStart)
    const end = idCard.substring(idCard.length - showEnd)
    const maskLength = idCard.length - showStart - showEnd

    return start + maskChar.repeat(maskLength) + end
  },

  /**
   * 银行卡号脱敏
   * 示例: 6222021234567890123 -> 6222 **** **** 0123
   */
  maskBankCard(bankCard: string, options: MaskOptions = {}): string {
    const { showStart = 4, showEnd = 4, maskChar = DEFAULT_MASK_CHAR } = options
    if (!bankCard || bankCard.length < 12) return bankCard

    const cleanCard = bankCard.replace(/\s/g, '')
    const start = cleanCard.substring(0, showStart)
    const end = cleanCard.substring(cleanCard.length - showEnd)
    const maskLength = cleanCard.length - showStart - showEnd

    const masked = start + maskChar.repeat(maskLength) + end
    return masked.replace(/(.{4})/g, '$1 ').trim()
  },

  /**
   * 邮箱脱敏
   * 示例: example@domain.com -> exa***@domain.com
   */
  maskEmail(email: string, options: MaskOptions = {}): string {
    const { showStart = 3, maskChar = DEFAULT_MASK_CHAR } = options
    if (!email || !email.includes('@')) return email

    const [username, domain] = email.split('@')
    if (!username || !domain) return email

    const maskedUsername =
      username.length > showStart
        ? username.substring(0, showStart) + maskChar.repeat(username.length - showStart)
        : username

    return `${maskedUsername}@${domain}`
  },

  /**
   * 姓名脱敏
   * 示例: 张三 -> 张*  张三丰 -> 张*丰
   */
  maskName(name: string, options: MaskOptions = {}): string {
    const { maskChar = DEFAULT_MASK_CHAR } = options
    if (!name || name.length < 2) return name

    if (name.length === 2) {
      return name[0] + maskChar
    }

    return name[0] + maskChar.repeat(name.length - 2) + name[name.length - 1]
  },

  /**
   * 地址脱敏
   * 示例: 北京市朝阳区xxx街道xxx号 -> 北京市朝阳区***
   */
  maskAddress(address: string, options: MaskOptions = {}): string {
    const { maskChar = DEFAULT_MASK_CHAR } = options
    if (!address || address.length < 8) return address

    return address.substring(0, 8) + maskChar.repeat(3)
  },

  /**
   * 密码脱敏
   * 始终返回固定长度的掩码
   */
  maskPassword(password: string, options: MaskOptions = {}): string {
    const { maskChar = DEFAULT_MASK_CHAR } = options
    if (!password) return ''
    return maskChar.repeat(Math.min(password.length, 12))
  },

  /**
   * 自定义脱敏
   * @param value 原始值
   * @param showStart 显示开头字符数
   * @param showEnd 显示结尾字符数
   * @param maskChar 掩码字符
   */
  maskCustom(
    value: string,
    showStart: number = 0,
    showEnd: number = 0,
    maskChar: string = DEFAULT_MASK_CHAR
  ): string {
    if (!value) return value
    if (value.length <= showStart + showEnd) return value

    const start = value.substring(0, showStart)
    const end = value.substring(value.length - showEnd)
    const maskLength = value.length - showStart - showEnd

    return start + maskChar.repeat(maskLength) + end
  },

  /**
   * 通用脱敏
   * 根据数据类型自动选择脱敏方式
   */
  mask(value: string, type: MaskRule['type'], options: MaskOptions = {}): string {
    switch (type) {
      case 'phone':
        return this.maskPhone(value, options)
      case 'idCard':
        return this.maskIdCard(value, options)
      case 'bankCard':
        return this.maskBankCard(value, options)
      case 'email':
        return this.maskEmail(value, options)
      case 'name':
        return this.maskName(value, options)
      case 'address':
        return this.maskAddress(value, options)
      case 'password':
        return this.maskPassword(value, options)
      case 'custom':
        return this.maskCustom(
          value,
          options.showStart || 0,
          options.showEnd || 0,
          options.maskChar
        )
      default:
        return value
    }
  },

  /**
   * 检测字符串是否为敏感类型
   */
  detectType(value: string): MaskRule['type'] | null {
    if (!value) return null

    const phonePattern = /^1[3-9]\d{9}$/
    const idCardPattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    const bankCardPattern = /^([1-9]\d{9,20}|\d{16,19})$/
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (phonePattern.test(value)) return 'phone'
    if (idCardPattern.test(value)) return 'idCard'
    if (bankCardPattern.test(value)) return 'bankCard'
    if (emailPattern.test(value)) return 'email'

    return null
  },

  /**
   * 批量脱敏对象中的敏感字段
   * @param data 原始数据对象
   * @param fields 需要脱敏的字段配置
   * @returns 脱敏后的数据
   */
  maskObject<T extends Record<string, any>>(
    data: T,
    fields: Array<{ key: keyof T; type: MaskRule['type']; options?: MaskOptions }>
  ): T {
    const result = { ...data }

    for (const field of fields) {
      const value = result[field.key]
      if (typeof value === 'string') {
        result[field.key] = this.mask(value, field.type, field.options) as T[keyof T]
      }
    }

    return result
  },

  /**
   * 脱敏数组中的所有对象
   */
  maskArray<T extends Record<string, any>>(
    data: T[],
    fields: Array<{ key: keyof T; type: MaskRule['type']; options?: MaskOptions }>
  ): T[] {
    return data.map(item => this.maskObject(item, fields))
  },
}

export default maskUtils
