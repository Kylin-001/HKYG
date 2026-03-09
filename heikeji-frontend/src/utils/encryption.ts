/**
 * 数据加密模块
 * 用于敏感数据的加密和解密
 */

import { CryptoJS } from 'crypto-js'

// 加密配置
interface EncryptionConfig {
  key: string // 加密密钥
  iv?: string // 初始化向量（可选）
  mode?: CryptoJS.mode.CBC | CryptoJS.mode.ECB | CryptoJS.mode.GCM // 加密模式
  padding?: CryptoJS.pad.Pkcs7 | CryptoJS.pad.Iso10126 | CryptoJS.pad.NoPadding // 填充方式
}

// 默认加密配置
const DEFAULT_CONFIG: EncryptionConfig = {
  key: import.meta.env.VITE_APP_ENCRYPTION_KEY || 'default-encryption-key-32', // 从环境变量获取
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7,
}

/**
 * 数据加密类
 */
class DataEncryption {
  private config: EncryptionConfig

  constructor(config?: Partial<EncryptionConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    
    // 从环境变量获取密钥
    if (!this.config.key) {
      this.config.key = import.meta.env.VITE_APP_ENCRYPTION_KEY || 'default-encryption-key-32'
    }
    
    // 确保密钥长度足够
    if (this.config.key.length < 32) {
      console.warn('加密密钥长度不足32位，建议使用更长的密钥')
    }
  }

  /**
   * 加密字符串
   * @param data 要加密的数据
   * @returns 加密后的字符串
   */
  encrypt(data: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(data, this.config.key, {
        mode: this.config.mode,
        padding: this.config.padding,
        iv: this.config.iv ? CryptoJS.enc.Utf8.parse(this.config.iv) : undefined,
      })
      
      return encrypted.toString()
    } catch (error) {
      console.error('加密失败:', error)
      throw new Error('数据加密失败')
    }
  }

  /**
   * 解密字符串
   * @param encryptedData 加密的数据
   * @returns 解密后的字符串
   */
  decrypt(encryptedData: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.config.key, {
        mode: this.config.mode,
        padding: this.config.padding,
        iv: this.config.iv ? CryptoJS.enc.Utf8.parse(this.config.iv) : undefined,
      })
      
      return decrypted.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error('解密失败:', error)
      throw new Error('数据解密失败')
    }
  }

  /**
   * 加密对象
   * @param obj 要加密的对象
   * @returns 加密后的字符串
   */
  encryptObject(obj: Record<string, unknown>): string {
    try {
      const jsonString = JSON.stringify(obj)
      return this.encrypt(jsonString)
    } catch (error) {
      console.error('对象加密失败:', error)
      throw new Error('对象加密失败')
    }
  }

  /**
   * 解密对象
   * @param encryptedData 加密的数据
   * @returns 解密后的对象
   */
  decryptObject<T = Record<string, unknown>>(encryptedData: string): T {
    try {
      const jsonString = this.decrypt(encryptedData)
      return JSON.parse(jsonString) as T
    } catch (error) {
      console.error('对象解密失败:', error)
      throw new Error('对象解密失败')
    }
  }

  /**
   * 加密数字
   * @param number 要加密的数字
   * @returns 加密后的字符串
   */
  encryptNumber(number: number): string {
    return this.encrypt(number.toString())
  }

  /**
   * 解密数字
   * @param encryptedData 加密的数据
   * @returns 解密后的数字
   */
  decryptNumber(encryptedData: string): number {
    const decryptedString = this.decrypt(encryptedData)
    const number = parseFloat(decryptedString)
    
    if (isNaN(number)) {
      throw new Error('解密后的数据不是有效的数字')
    }
    
    return number
  }

  /**
   * 加密布尔值
   * @param boolean 要加密的布尔值
   * @returns 加密后的字符串
   */
  encryptBoolean(boolean: boolean): string {
    return this.encrypt(boolean.toString())
  }

  /**
   * 解密布尔值
   * @param encryptedData 加密的数据
   * @returns 解密后的布尔值
   */
  decryptBoolean(encryptedData: string): boolean {
    const decryptedString = this.decrypt(encryptedData)
    return decryptedString === 'true'
  }

  /**
   * 生成哈希值
   * @param data 要哈希的数据
   * @returns 哈希值
   */
  hash(data: string): string {
    try {
      return CryptoJS.SHA256(data).toString()
    } catch (error) {
      console.error('哈希生成失败:', error)
      throw new Error('哈希生成失败')
    }
  }

  /**
   * 生成随机密钥
   * @param length 密钥长度（默认32位）
   * @returns 随机密钥
   */
  generateKey(length = 32): string {
    try {
      return CryptoJS.lib.WordArray.random(length / 2).toString()
    } catch (error) {
      console.error('密钥生成失败:', error)
      throw new Error('密钥生成失败')
    }
  }

  /**
   * 比较哈希值
   * @param data 原始数据
   * @param hash 哈希值
   * @returns 是否匹配
   */
  compareHash(data: string, hash: string): boolean {
    try {
      const dataHash = this.hash(data)
      return dataHash === hash
    } catch (error) {
      console.error('哈希比较失败:', error)
      return false
    }
  }
}

// 创建默认的加密实例
export const defaultEncryption = new DataEncryption()

// 创建敏感数据加密实例（使用更严格的配置）
export const sensitiveDataEncryption = new DataEncryption({
  key: import.meta.env.VITE_APP_SENSITIVE_DATA_KEY || 'sensitive-data-encryption-key-64',
  mode: CryptoJS.mode.GCM,
})

// 创建本地存储加密实例
export const localStorageEncryption = new DataEncryption({
  key: import.meta.env.VITE_APP_LOCAL_STORAGE_KEY || 'local-storage-encryption-key-48',
})

// 敏感字段加密装饰器
export function encryptField(encryption: DataEncryption = defaultEncryption) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalSetter = descriptor.set
    
    descriptor.set = function (value: any) {
      // 如果是字符串，进行加密
      if (typeof value === 'string') {
        value = encryption.encrypt(value)
      }
      
      if (originalSetter) {
        originalSetter.call(this, value)
      }
    }
    
    const originalGetter = descriptor.get
    
    descriptor.get = function () {
      let value = originalGetter?.call(this)
      
      // 如果是字符串且看起来像加密数据，进行解密
      if (typeof value === 'string' && value.length > 20) {
        try {
          value = encryption.decrypt(value)
        } catch (error) {
          // 如果解密失败，返回原始值
          console.warn('字段解密失败:', error)
        }
      }
      
      return value
    }
    
    return descriptor
  }
}

// 安全存储工具
export const secureStorage = {
  /**
   * 设置加密的本地存储
   * @param key 键
   * @param value 值
   * @param encryption 加密实例
   */
  setItem(key: string, value: string, encryption: DataEncryption = defaultEncryption): void {
    try {
      const encryptedValue = encryption.encrypt(value)
      localStorage.setItem(key, encryptedValue)
    } catch (error) {
      console.error('安全存储设置失败:', error)
      throw new Error('安全存储设置失败')
    }
  },

  /**
   * 获取加密的本地存储
   * @param key 键
   * @param encryption 加密实例
   * @returns 解密后的值
   */
  getItem(key: string, encryption: DataEncryption = defaultEncryption): string | null {
    try {
      const encryptedValue = localStorage.getItem(key)
      if (!encryptedValue) return null
      
      return encryption.decrypt(encryptedValue)
    } catch (error) {
      console.error('安全存储获取失败:', error)
      return null
    }
  },

  /**
   * 设置加密的会话存储
   * @param key 键
   * @param value 值
   * @param encryption 加密实例
   */
  setSessionItem(key: string, value: string, encryption: DataEncryption = defaultEncryption): void {
    try {
      const encryptedValue = encryption.encrypt(value)
      sessionStorage.setItem(key, encryptedValue)
    } catch (error) {
      console.error('安全会话存储设置失败:', error)
      throw new Error('安全会话存储设置失败')
    }
  },

  /**
   * 获取加密的会话存储
   * @param key 键
   * @param encryption 加密实例
   * @returns 解密后的值
   */
  getSessionItem(key: string, encryption: DataEncryption = defaultEncryption): string | null {
    try {
      const encryptedValue = sessionStorage.getItem(key)
      if (!encryptedValue) return null
      
      return encryption.decrypt(encryptedValue)
    } catch (error) {
      console.error('安全会话存储获取失败:', error)
      return null
    }
  },

  /**
   * 移除本地存储
   * @param key 键
   */
  removeItem(key: string): void {
    localStorage.removeItem(key)
  },

  /**
   * 移除会话存储
   * @param key 键
   */
  removeSessionItem(key: string): void {
    sessionStorage.removeItem(key)
  },
}

export default DataEncryption