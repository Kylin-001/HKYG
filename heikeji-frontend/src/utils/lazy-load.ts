/**
 * 代码分割和懒加载配置
 * 用于优化前端性能和减少首屏加载时间
 */

import type { RouteRecordRaw } from 'vue-router'

// 组件懒加载包装器
export const lazyLoad = (importFunc: () => Promise<any>, componentName?: string) => {
  return async () => {
    try {
      const component = await importFunc()
      return component
    } catch (error) {
      console.error(`组件加载失败: ${componentName || '未知组件'}`, error)
      // 返回错误组件
      return import('@/components/ErrorComponent.vue')
    }
  }
}

// 预加载组件
export const preloadComponent = (importFunc: () => Promise<any>) => {
  // 在空闲时间预加载组件
  if ('requestIdleCallback' in window) {
    ;(window as any).requestIdleCallback(() => {
      importFunc()
    })
  } else {
    // 降级方案：延迟预加载
    setTimeout(() => {
      importFunc()
    }, 2000)
  }
}

// 路由分组配置
export const routeGroups = {
  // 核心页面 - 首屏必需
  core: ['dashboard', 'login'],

  // 用户相关
  user: ['profile', 'settings', 'password'],

  // 商品管理
  product: ['list', 'add', 'edit', 'category', 'brand'],

  // 订单管理
  order: ['list', 'detail', 'confirm'],

  // 数据统计
  stats: ['overview', 'sales', 'user', 'product'],

  // 系统管理
  system: ['user', 'role', 'menu', 'dept'],

  // 工具页面
  tools: ['generator', 'monitor', 'logs'],
}

// 根据路由分组创建懒加载组件
export const createLazyComponent = (path: string, group?: keyof typeof routeGroups) => {
  const componentName = path.split('/').pop()?.replace('.vue', '') || 'Unknown'

  // 根据分组创建不同的chunk名称
  let chunkName = componentName
  if (group && routeGroups[group]) {
    chunkName = `${group}-${componentName}`
  }

  return lazyLoad(() => import(/* @vite-ignore */ `@/views/${path}`), componentName)
}

// 预加载策略
export const preloadStrategies = {
  // 立即预加载
  immediate: (importFunc: () => Promise<any>) => importFunc(),

  // 在空闲时间预加载
  idle: (importFunc: () => Promise<any>) => preloadComponent(importFunc),

  // 延迟预加载
  delayed: (importFunc: () => Promise<any>, delay = 2000) => {
    setTimeout(() => importFunc(), delay)
  },

  // 鼠标悬停预加载
  hover: (importFunc: () => Promise<any>) => {
    let isPreloaded = false

    return {
      onHover: () => {
        if (!isPreloaded) {
          preloadComponent(importFunc)
          isPreloaded = true
        }
      },
    }
  },

  // 可见区域预加载
  visible: (importFunc: () => Promise<any>, element?: HTMLElement) => {
    if (!element) return preloadComponent(importFunc)

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            preloadComponent(importFunc)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return observer
  },
}

// 路由预加载配置
export const routePreloadConfig: Record<string, string[]> = {
  // 首屏路由不预加载
  core: [],

  // 用户相关路由在登录后预加载
  user: ['profile', 'settings'],

  // 商品管理路由在访问商品页面后预加载
  product: ['category', 'brand'],

  // 订单管理路由在访问订单页面后预加载
  order: ['detail'],

  // 数据统计路由在访问概览后预加载
  stats: ['sales', 'user', 'product'],
}

// 创建带预加载的路由
export const createPreloadRoute = (
  path: string,
  name: string,
  componentPath: string,
  meta: any = {},
  group?: keyof typeof routeGroups
): RouteRecordRaw => {
  const component = createLazyComponent(componentPath, group)

  // 根据路由名称获取预加载配置
  const preloadRoutes = routePreloadConfig[group as keyof typeof routePreloadConfig] || []
  const shouldPreload = preloadRoutes.includes(name)

  const route: RouteRecordRaw = {
    path,
    name,
    component,
    meta: {
      ...meta,
      preload: shouldPreload,
      group,
    },
  }

  // 如果需要预加载，添加预加载逻辑
  if (shouldPreload) {
    ;(route.meta as any).preloadComponent = () => {
      preloadStrategies.idle(() => import(/* @vite-ignore */ `@/views/${componentPath}`))
    }
  }

  return route
}

// 批量创建路由
export const createRoutes = (
  routesConfig: Array<{
    path: string
    name: string
    componentPath: string
    meta?: any
    group?: keyof typeof routeGroups
  }>
): RouteRecordRaw[] => {
  return routesConfig.map(config =>
    createPreloadRoute(config.path, config.name, config.componentPath, config.meta, config.group)
  )
}

// 动态导入模块
export const dynamicImport = {
  // 工具库
  utils: (moduleName: string) => import(/* @vibe-ignore */ `@/utils/${moduleName}`),

  // 组件
  components: (componentName: string) => import(/* @vibe-ignore */ `@/components/${componentName}`),

  // 视图
  views: (viewName: string) => import(/* @vibe-ignore */ `@/views/${viewName}`),

  // API
  api: (moduleName: string) => import(/* @vibe-ignore */ `@/api/${moduleName}`),

  // 商店模块
  store: (moduleName: string) => import(/* @vibe-ignore */ `@/store/modules/${moduleName}`),
}

// 资源预加载
export const preloadResources = {
  // 预加载图片
  images: (imageUrls: string[]) => {
    imageUrls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = url
      document.head.appendChild(link)
    })
  },

  // 预加载字体
  fonts: (fontUrls: string[]) => {
    fontUrls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      link.href = url
      document.head.appendChild(link)
    })
  },

  // 预加载CSS
  css: (cssUrls: string[]) => {
    cssUrls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = url
      document.head.appendChild(link)
    })
  },

  // 预加载JS
  js: (jsUrls: string[]) => {
    jsUrls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'script'
      link.href = url
      document.head.appendChild(link)
    })
  },
}

// 性能监控
export const performanceMonitor = {
  // 记录组件加载时间
  recordComponentLoad: (componentName: string, startTime: number) => {
    const loadTime = performance.now() - startTime
    console.log(`组件 ${componentName} 加载时间: ${loadTime.toFixed(2)}ms`)

    // 发送到分析服务
    if (import.meta.env.PROD) {
      // analytics.track('component_load_time', {
      //   component: componentName,
      //   load_time: loadTime
      // })
    }
  },

  // 记录路由切换时间
  recordRouteChange: (from: string, to: string, startTime: number) => {
    const loadTime = performance.now() - startTime
    console.log(`路由切换 ${from} -> ${to} 耗时: ${loadTime.toFixed(2)}ms`)

    // 发送到分析服务
    if (import.meta.env.PROD) {
      // analytics.track('route_change_time', {
      //   from,
      //   to,
      //   load_time: loadTime
      // })
    }
  },

  // 记录首屏加载时间
  recordFirstPaint: () => {
    if ('performanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries()
        const firstPaint = entries.find(entry => entry.name === 'first-paint')

        if (firstPaint) {
          console.log(`首屏绘制时间: ${firstPaint.startTime.toFixed(2)}ms`)

          // 发送到分析服务
          if (import.meta.env.PROD) {
            // analytics.track('first_paint_time', {
            //   time: firstPaint.startTime
            // })
          }
        }
      })

      observer.observe({ entryTypes: ['paint'] })
    }
  },
}

// 缓存策略
export const cacheStrategies = {
  // 内存缓存组件
  memo: (component: any) => {
    let cached: any = null

    return () => {
      if (cached) return cached

      cached = component()
      return cached
    }
  },

  // 本地存储缓存
  localStorage: (key: string, data: any, ttl = 3600000) => {
    const item = {
      data,
      timestamp: Date.now(),
      ttl,
    }

    localStorage.setItem(key, JSON.stringify(item))
  },

  // 获取本地存储缓存
  getLocalStorage: (key: string) => {
    const item = localStorage.getItem(key)
    if (!item) return null

    try {
      const parsed = JSON.parse(item)
      const now = Date.now()

      if (now - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(key)
        return null
      }

      return parsed.data
    } catch (error) {
      console.error('获取缓存失败:', error)
      return null
    }
  },
}

export default {
  lazyLoad,
  preloadComponent,
  routeGroups,
  createLazyComponent,
  preloadStrategies,
  createPreloadRoute,
  createRoutes,
  dynamicImport,
  preloadResources,
  performanceMonitor,
  cacheStrategies,
}
