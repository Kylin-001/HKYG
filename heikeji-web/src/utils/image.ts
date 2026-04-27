/**
 * 图片处理工具函数
 */

export interface CompressOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  type?: string
}

export interface ImageInfo {
  width: number
  height: number
  size: number
  type: string
}

/**
 * 压缩图片
 * @param file 图片文件
 * @param options 压缩选项
 * @returns 压缩后的 Blob 和相关信息
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<{ blob: Blob; width: number; height: number; compressedSize: number }> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    type = 'image/jpeg'
  } = options

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('无法创建 canvas 上下文'))
          return
        }

        let { width, height } = img

        // 等比缩放
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        canvas.width = width
        canvas.height = height

        // 绘制并导出
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                blob,
                width,
                height,
                compressedSize: blob.size
              })
            } else {
              reject(new Error('图片压缩失败'))
            }
          },
          type,
          quality
        )
      }
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

/**
 * 获取图片信息
 * @param file 图片文件
 * @returns 图片信息
 */
export function getImageInfo(file: File): Promise<ImageInfo> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type
      })
    }
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * 将文件转换为 Base64
 * @param file 文件
 * @returns Base64 字符串
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

/**
 * 将 Base64 转换为 Blob
 * @param base64 Base64 字符串
 * @returns Blob 对象
 */
export function base64ToBlob(base64: string): Blob {
  const parts = base64.split(';base64,')
  const contentType = parts[0].split(':')[1]
  const raw = window.atob(parts[1])
  const rawLength = raw.length
  const uInt8Array = new Uint8Array(rawLength)

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }

  return new Blob([uInt8Array], { type: contentType })
}

/**
 * 创建图片缩略图
 * @param file 图片文件
 * @param maxSize 最大尺寸
 * @returns 缩略图 Blob
 */
export async function createThumbnail(
  file: File,
  maxSize: number = 200
): Promise<Blob> {
  const { blob } = await compressImage(file, {
    maxWidth: maxSize,
    maxHeight: maxSize,
    quality: 0.7
  })
  return blob
}

/**
 * 处理图片加载错误
 * @param event 错误事件
 * @param fallbackUrl 备用图片 URL
 */
export function handleImageError(event: Event, fallbackUrl?: string): void {
  const img = event.target as HTMLImageElement
  if (fallbackUrl && img.src !== fallbackUrl) {
    img.src = fallbackUrl
  } else {
    // 使用默认占位图
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" font-family="Arial" font-size="14" fill="%239ca3af" text-anchor="middle" dy=".3em"%3E图片加载失败%3C/text%3E%3C/svg%3E'
  }
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 验证图片文件
 * @param file 文件
 * @param options 验证选项
 * @returns 验证结果
 */
export function validateImageFile(
  file: File,
  options: {
    maxSize?: number
    allowedTypes?: string[]
  } = {}
): { valid: boolean; message?: string } {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] } = options

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: `不支持的文件格式，请上传 ${allowedTypes.join('、')} 格式的图片`
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      message: `文件大小不能超过 ${formatFileSize(maxSize)}`
    }
  }

  return { valid: true }
}

/**
 * 预加载图片
 * @param src 图片地址
 * @returns Promise
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * 批量预加载图片
 * @param srcs 图片地址数组
 * @returns Promise
 */
export function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(srcs.map(src => preloadImage(src)))
}

// 默认导出对象
const imageUtils = {
  compressImage,
  getImageInfo,
  fileToBase64,
  base64ToBlob,
  createThumbnail,
  handleImageError,
  formatFileSize,
  validateImageFile,
  preloadImage,
  preloadImages
}

export default imageUtils
