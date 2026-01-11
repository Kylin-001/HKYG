/**
 * 图片预加载工具
 * 用于预加载页面中可能用到的图片资源，提升用户体验
 */

/**
 * 图片预加载选项
 */
export interface ImagePreloadOptions {
  // 预加载优先级（低：idle，高：high）
  priority?: 'idle' | 'high'
  // 图片加载失败的回调
  onError?: (src: string, error: string | Event) => void
  // 图片加载完成的回调
  onComplete?: (src: string, img: HTMLImageElement) => void
  // 所有图片加载完成的回调
  onAllComplete?: () => void
}

/**
 * 图片预加载类
 */
export class ImagePreloader {
  private images: string[] = []
  private loadedCount = 0
  private options: ImagePreloadOptions = {
    priority: 'idle'
  }

  /**
   * 构造函数
   * @param options 预加载选项
   */
  constructor(options?: ImagePreloadOptions) {
    this.options = { ...this.options, ...options }
  }

  /**
   * 添加需要预加载的图片
   * @param images 图片URL数组
   */
  addImages(images: string[]): ImagePreloader {
    this.images = [...this.images, ...images]
    return this
  }

  /**
   * 开始预加载
   */
  start(): void {
    if (this.images.length === 0) {
      this.options.onAllComplete?.()
      return
    }

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        
        img.onload = () => {
          this.loadedCount++
          this.options.onComplete?.(src, img)
          resolve(img)
        }

        img.onerror = (error) => {
          this.loadedCount++
          this.options.onError?.(src, error)
          resolve(img) // 即使失败也继续加载其他图片
        }

        img.src = src
      })
    }

    // 根据优先级选择加载策略
    if (this.options.priority === 'high') {
      // 高优先级：立即加载所有图片
      this.images.forEach(src => loadImage(src).then(() => {
        if (this.loadedCount === this.images.length) {
          this.options.onAllComplete?.()
        }
      }))
    } else {
      // 低优先级：使用requestIdleCallback在浏览器空闲时加载
      if ('requestIdleCallback' in window) {
        const loadNextImage = () => {
          if (this.loadedCount < this.images.length) {
            loadImage(this.images[this.loadedCount]).then(() => {
              if (this.loadedCount < this.images.length) {
                ;(window as any).requestIdleCallback(loadNextImage, { timeout: 1000 })
              } else {
                this.options.onAllComplete?.()
              }
            })
          } else {
            this.options.onAllComplete?.()
          }
        }
        ;(window as any).requestIdleCallback(loadNextImage, { timeout: 1000 })
      } else {
        // 不支持requestIdleCallback时，使用setTimeout分批加载
        let index = 0
        const batchSize = 3 // 每次加载3张图片
        
        const loadBatch = () => {
          const batch = this.images.slice(index, index + batchSize)
          if (batch.length === 0) {
            this.options.onAllComplete?.()
            return
          }

          Promise.all(batch.map(src => loadImage(src))).then(() => {
            index += batchSize
            setTimeout(loadBatch, 100)
          })
        }
        
        setTimeout(loadBatch, 500)
      }
    }
  }

  /**
   * 重置预加载器
   */
  reset(): void {
    this.images = []
    this.loadedCount = 0
  }

  /**
   * 获取当前加载进度
   * @returns 加载进度百分比（0-100）
   */
  getProgress(): number {
    if (this.images.length === 0) return 100
    return Math.round((this.loadedCount / this.images.length) * 100)
  }

  /**
   * 检查图片是否已经加载完成
   * @returns 是否全部加载完成
   */
  isComplete(): boolean {
    return this.loadedCount === this.images.length
  }
}

/**
 * 静态方法：直接预加载图片
 * @param images 需要预加载的图片URL数组
 * @param options 预加载选项
 */
export const preloadImages = (images: string[], options?: ImagePreloadOptions): ImagePreloader => {
  const preloader = new ImagePreloader(options)
  preloader.addImages(images).start()
  return preloader
}

/**
 * 从DOM中提取图片URL
 * @param element 根元素
 * @returns 图片URL数组
 */
export const extractImagesFromDOM = (element: HTMLElement): string[] => {
  const images: string[] = []
  
  // 提取img标签的src
  const imgElements = element.querySelectorAll('img')
  imgElements.forEach(img => {
    if (img.src && !images.includes(img.src)) {
      images.push(img.src)
    }
  })

  // 提取CSS背景图片
  const computedStyle = getComputedStyle(element)
  const backgroundImage = computedStyle.backgroundImage
  if (backgroundImage && backgroundImage !== 'none') {
    const matches = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/g)
    if (matches) {
      matches.forEach(match => {
        const url = match.replace(/url\(['"]?([^'"]+)['"]?\)/, '$1')
        if (url && !images.includes(url)) {
          images.push(url)
        }
      })
    }
  }

  return images
}

/**
 * 预加载当前页面可见区域的图片
 * @param options 预加载选项
 */
export const preloadVisibleImages = (options?: ImagePreloadOptions): ImagePreloader => {
  const images: string[] = []
  const visibleImages = document.querySelectorAll('img')

  visibleImages.forEach(img => {
    // 检查图片是否在视口中
    const rect = img.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      images.push(img.src)
    }
  })

  return preloadImages(images, options)
}
