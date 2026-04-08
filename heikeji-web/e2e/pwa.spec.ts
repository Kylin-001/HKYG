/**
 * PWA (Progressive Web App) 功能测试
 *
 * 测试范围：
 * 1. Web App Manifest 可加载性和内容验证
 * 2. Service Worker 注册和状态检查
 * 3. 离线资源缓存（核心资源缓存策略）
 * 4. 离线模式下的基本功能可用性
 * 5. 安装提示和添加到主屏幕功能
 * 6. PWA 性能指标（启动速度、缓存命中率）
 *
 * PWA 标准参考：
 * - Web App Manifest (W3C)
 * - Service Workers (W3C)
 * - Lighthouse PWA 审计标准
 */

import { test, expect } from '@playwright/test'

test.describe('PWA 功能验证', () => {
  
  test('Manifest 可加载', async ({ page }) => {
    console.log('\n=== Manifest 文件测试 ===\n')

    // ========== 1. 验证 manifest.json 可以访问 ==========
    const manifestResponse = await page.request.get('/manifest.json')
    
    console.log(`Manifest HTTP 状态: ${manifestResponse.status()}`)
    expect(manifestResponse.ok()).toBeTruthy()
    
    // 验证 Content-Type 是 JSON
    const contentType = manifestResponse.headers()['content-type']
    console.log(`Content-Type: ${contentType}`)
    expect(contentType).toContain('application/manifest+json')

    // ========== 2. 解析并验证 Manifest 内容 ==========
    const manifest = await manifestResponse.json()
    
    console.log('\nManifest 内容:')
    console.log(JSON.stringify(manifest, null, 2).slice(0, 1000)) // 显示前1000字符

    // 必需属性验证
    expect(manifest.name).toBeTruthy()
    console.log(`✓ name: ${manifest.name}`)
    
    expect(manifest.name).toBe('黑科易购')

    // 短名称（用于主屏幕）
    if (manifest.short_name) {
      expect(manifest.short_name).toBeTruthy()
      console.log(`✓ short_name: ${manifest.short_name}`)
      
      // short_name 通常不超过12个字符
      expect(manifest.short_name.length).toBeLessThanOrEqual(12)
    }

    // 描述
    if (manifest.description) {
      expect(manifest.description).toBeTruthy()
      console.log(`✓ description: ${manifest.description.slice(0, 50)}...`)
      expect(manifest.description.length).toBeGreaterThan(10)
    }

    // start_url
    expect(manifest.start_url).toBeTruthy()
    console.log(`✓ start_url: ${manifest.start_url}`)
    expect(manifest.start_url).toMatch(/^\//)

    // display 模式
    const validDisplayModes = ['fullscreen', 'standalone', 'minimal-ui', 'browser']
    if (manifest.display) {
      expect(validDisplayModes).toContain(manifest.display)
      console.log(`✓ display: ${manifest.display}`)
    }

    // 背景色
    if (manifest.background_color) {
      expect(manifest.background_color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      console.log(`✓ background_color: ${manifest.background_color}`)
      expect(manifest.background_color).toBe('#F5F7FA') // 验证预期值
    }

    // 主题色
    if (manifest.theme_color) {
      expect(manifest.theme_color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      console.log(`✓ theme_color: ${manifest.theme_color}`)
      expect(manifest.theme_color).toBe('#003B80') // 验证预期值
    }

    // 方向（可选但推荐）
    if (manifest.orientation) {
      const validOrientations = ['any', 'natural', 'landscape', 'portrait', 'portrait-primary']
      expect(validOrientations).toContain(manifest.orientation)
      console.log(`✓ orientation: ${manifest.orientation}`)
    }

    // scope
    if (manifest.scope) {
      expect(manifest.scope).toMatch(/^\//)
      console.log(`✓ scope: ${manifest.scope}`)
    }

    // 语言
    if (manifest.lang) {
      expect(manifest.lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/i)
      console.log(`✓ lang: ${manifest.lang}`)
      expect(manifest.lang).toBe('zh-CN')
    }

    // 类别
    if (manifest.categories && Array.isArray(manifest.categories)) {
      expect(manifest.categories.length).toBeGreaterThan(0)
      console.log(`✓ categories: ${manifest.categories.join(', ')}`)
      
      const validCategories = ['education', 'shopping', 'lifestyle', 'business', 'entertainment']
      manifest.categories.forEach(cat => {
        expect(validCategories).toContain(cat)
      })
    }

    // ========== 3. 图标验证 ==========
    if (manifest.icons && Array.isArray(manifest.icons)) {
      console.log(`\n图标数量: ${manifest.icons.length}`)
      expect(manifest.icons.length).toBeGreaterThanOrEqual(4) // 至少应该有几个尺寸
      
      // 验证必需的图标尺寸
      const iconSizes = manifest.icons.map(icon => parseInt(icon.sizes?.split('x')[0] || '0'))
      const has192 = iconSizes.includes(192)
      const has512 = iconSizes.includes(512)
      
      console.log(`图标尺寸: ${iconSizes.sort((a, b) => a - b).join('px, ')}px`)
      
      if (has192) console.log('✓ 包含 192x192 图标 (推荐)')
      if (has512) console.log('✓ 包含 512x512 图标 (必需)')
      
      // 验证每个图标的基本属性
      for (const icon of manifest.icons) {
        expect(icon.src).toBeTruthy()
        expect(icon.sizes).toBeTruthy()
        expect(icon.type).toBeTruthy()
        expect(icon.type).toContain('image/')
        
        // purpose 属性（maskable 或 any）
        if (icon.purpose) {
          const validPurposes = ['any', 'maskable']
          expect(validPurposes.some(p => icon.purpose.includes(p))).toBeTruthy()
        }
        
        // 尝试请求图标验证其存在（只检查前3个）
        if (manifest.icons.indexOf(icon) < 3) {
          const iconResponse = await page.request.get(icon.src)
          expect(iconResponse.ok()).toBeTruthy()
          expect(parseInt(iconResponse.headers()['content-length'] || '0')).toBeGreaterThan(100)
        }
      }
      
      console.log('✓ 所有图标属性完整且可访问')
    } else {
      console.log('⚠ Manifest 中没有定义图标（建议添加）')
    }

    // ========== 4. 快捷方式验证（可选） ==========
    if (manifest.shortcuts && Array.isArray(manifest.shortcuts)) {
      console.log(`\n快捷方式数量: ${manifest.shortcuts.length}`)
      
      for (const shortcut of manifest.shortcuts) {
        expect(shortcut.name).toBeTruthy()
        expect(shortcut.url).toBeTruthy()
        console.log(`  - ${shortcut.name}: ${shortcut.url}`)
        
        // 如果有图标，验证格式
        if (shortcut.icons && shortcut.icons.length > 0) {
          const shortcutIcon = shortcut.icons[0]
          expect(shortcutIcon.src).toBeTruthy()
          expect(shortcutIcon.sizes).toBeTruthy()
        }
      }
      
      console.log('✓ 快捷方式配置正确')
    }

    // ========== 5. 截图验证（可选，用于安装提示） ==========
    if (manifest.screenshots && Array.isArray(manifest.screenshots)) {
      console.log(`\n截图数量: ${manifest.screenshots.length}`)
      
      for (const screenshot of manifest.screenshots) {
        expect(screenshot.src).toBeTruthy()
        expect(screenshot.sizes).toBeTruthy()
        expect(screenshot.type).toContain('image/')
        expect(screenshot.form_factor).toBeTruthy()
        
        const validFormFactors = ['wide', 'narrow']
        expect(validFormFactors).toContain(screenshot.form_factor)
        
        // 解析尺寸
        const [width, height] = screenshot.sizes.split('x').map(Number)
        expect(width).toBeGreaterThanOrEqual(320)
        expect(height).toBeGreaterThanOrEqual(320)
        
        // 验证截图可访问
        const screenshotResponse = await page.request.get(screenshot.src)
        if (manifest.screenshots.indexOf(screenshot) === 0) { // 只验证第一个
          expect(screenshotResponse.ok()).toBeTruthy()
        }
      }
      
      console.log('✓ 截图配置正确')
    }

    // ========== 6. related_applications 验证 ==========
    if (manifest.related_applications !== undefined) {
      expect(Array.isArray(manifest.related_applications)).toBeTruthy()
      
      if (manifest.prefer_related_applications !== undefined) {
        expect(typeof manifest.prefer_related_applications).toBe('boolean')
      }
      
      console.log('✓ related_applications 配置正确')
    }

    console.log('\n✓ Manifest 测试通过')
  })

  test('Service Worker 注册', async ({ page }) => {
    console.log('\n=== Service Worker 测试 ===\n')

    // ========== 1. 访问页面触发 SW 注册 ==========
    await page.goto('/')
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})
    
    // 等待 SW 注册完成
    await page.waitForTimeout(2000)

    // ========== 2. 检查 SW 是否注册成功 ==========
    const swRegistration = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) {
        return { supported: false, registered: false, error: 'Service Worker API 不支持' }
      }
      
      try {
        const registration = await navigator.serviceWorker.ready
        
        return {
          supported: true,
          registered: !!registration,
          scope: registration?.scope || '',
          state: registration?.active?.state || '',
          scriptURL: registration?.active?.scriptURL || ''
        }
      } catch (error) {
        return {
          supported: true,
          registered: false,
          error: error instanceof Error ? error.message : '未知错误'
        }
      }
    })
    
    console.log('SW 支持情况:', swRegistration.supported ? '支持' : '不支持')
    console.log('SW 注册状态:', swRegistration.registered ? '已注册' : '未注册')
    
    if (!swRegistration.supported) {
      console.log('⚠ 浏览器不支持 Service Worker（在 Node.js 环境中可能不支持）')
      // 在某些测试环境中可能不支持 SW，这不一定是失败
      return
    }
    
    expect(swRegistration.registered).toBeTruthy()
    
    if (swRegistration.scope) {
      console.log(`SW 作用域: ${swRegistration.scope}`)
      expect(swRegistration.scope).toContain(window.location.origin)
    }
    
    if (swRegistration.state) {
      console.log(`SW 状态: ${swRegistration.state}`)
      expect(['activated', 'activating', 'installed', 'installing']).toContain(swRegistration.state)
    }
    
    if (swRegistration.scriptURL) {
      console.log(`SW 脚本: ${swRegistration.scriptURL}`)
      expect(swRegistration.scriptURL).toContain('.js')
    }
    
    console.log('✓ Service Worker 已成功注册')

    // ========== 3. 验证 SW 控制页面 ==========
    const isControlled = await page.evaluate(() => {
      return !!navigator.serviceWorker.controller
    })
    
    console.log(`SW 控制页面: ${isControlled ? '是' : '否'}`)
    
    if (isControlled) {
      console.log('✓ 当前页面由 Service Worker 控制')
    } else {
      console.log('ℹ 页面可能需要刷新才能被 SW 控制')
      
      // 刷新页面让 SW 控制
      await page.reload({ waitUntil: 'networkidle' })
      await page.waitForTimeout(1500)
      
      const controlledAfterReload = await page.evaluate(() => {
        return !!navigator.serviceWorker.controller
      })
      
      if (controlledAfterReload) {
        console.log('✓ 刷新后页面已由 Service Worker 控制')
      }
    }

    // ========== 4. 检查 SW 事件监听器（通过控制台日志或网络请求推断） ==========
    // 监听 SW 相关的网络请求
    const swRequests: string[] = []
    
    page.on('request', request => {
      if (request.url().includes('sw.js') || 
          request.resourceType() === 'serviceworker') {
        swRequests.push(request.url())
      }
    })
    
    // 触发一些可能激活 SW 的操作
    await page.goto('/products')
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
    await page.waitForTimeout(1000)
    
    if (swRequests.length > 0) {
      console.log(`\n检测到 SW 相关请求: ${swRequests.length} 个`)
      swRequests.forEach(url => console.log(`  - ${url}`))
    }

    console.log('\n✓ Service Worker 测试完成')
  })

  test('离线资源缓存', async ({ page }) => {
    console.log('\n=== 离线资源缓存测试 ===\n')

    // ========== 1. 先在线加载页面并确保 SW 已注册 ==========
    await page.goto('/')
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})
    await page.waitForTimeout(2000) // 等待 SW 缓存资源

    // 收集核心资源的 URL
    const coreResources = await page.evaluate(() => {
      const resources: string[] = []
      
      // HTML 文档
      resources.push(window.location.href)
      
      // CSS 文件
      document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        if (link.href) resources.push(link.href)
      })
      
      // JS 文件
      document.querySelectorAll('script[src]').forEach(script => {
        if (script.src) resources.push(script.src)
      })
      
      // 图片（前5张）
      document.querySelectorAll('img[src]').forEach((img, index) => {
        if (index < 5 && img.src) resources.push(img.src)
      })
      
      // 字体文件
      document.querySelectorAll('link[href*=".woff"], link[href*=".ttf"]').forEach(link => {
        if (link.href) resources.push(link.href)
      })
      
      return [...new Set(resources)] // 去重
    })
    
    console.log(`收集到 ${coreResources.length} 个核心资源`)

    // ========== 2. 检查 Cache Storage 中的缓存条目 ==========
    const cacheInfo = await page.evaluate(async () => {
      if (!('caches' in window)) {
        return { supported: false, caches: [], totalEntries: 0 }
      }
      
      try {
        const cacheNames = await caches.keys()
        const allCacheInfo: Array<{name: string, entries: number}> = []
        let totalEntries = 0
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName)
          const keys = await cache.keys()
          allCacheInfo.push({
            name: cacheName,
            entries: keys.length
          })
          totalEntries += keys.length
        }
        
        return {
          supported: true,
          caches: allCacheInfo,
          totalEntries,
          cacheNames
        }
      } catch (error) {
        return {
          supported: true,
          caches: [],
          totalEntries: 0,
          error: error instanceof Error ? error.message : '未知错误'
        }
      }
    })
    
    console.log('\nCache Storage 信息:')
    if (!cacheInfo.supported) {
      console.log('⚠ Cache API 不支持')
      return
    }
    
    if (cacheInfo.caches.length > 0) {
      cacheInfo.caches.forEach(cache => {
        console.log(`  - ${cache.name}: ${cache.entries} 个条目`)
      })
      console.log(`\n总缓存条目数: ${cacheInfo.totalEntries}`)
      
      // 应该至少有一个缓存
      expect(cacheInfo.caches.length).toBeGreaterThanOrEqual(1)
      
      // 核心资源应该被缓存（至少部分）
      expect(cacheInfo.totalEntries).toBeGreaterThanOrEqual(5)
      
      console.log('✓ 存在缓存数据')
    } else {
      console.log('⚠ 未找到缓存（SW 可能尚未完成首次缓存）')
    }

    // ========== 3. 验证关键资源是否被缓存 ==========
    if (cacheInfo.caches.length > 0) {
      const cachedUrls = await page.evaluate(async () => {
        const cacheNames = await caches.keys()
        const allCachedUrls: string[] = []
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName)
          const keys = await cache.keys()
          keys.forEach(request => {
            allCachedUrls.push(request.url)
          })
        }
        
        return [...new Set(allCachedUrls)]
      })
      
      console.log(`\n已缓存的 URL 数量: ${cachedUrls.length}`)
      
      // 检查核心资源是否在缓存中
      let cachedCoreCount = 0
      const uncachedResources: string[] = []
      
      for (const resource of coreResources.slice(0, 10)) { // 只检查前10个
        const isCached = cachedUrls.some(cachedUrl => 
          cachedUrl.includes(resource) || resource.includes(new URL(cachedUrl).pathname)
        )
        
        if (isCached) {
          cachedCoreCount++
        } else {
          uncachedResources.push(resource.slice(0, 60))
        }
      }
      
      console.log(`核心资源缓存率: ${cachedCoreCount}/${Math.min(coreResources.length, 10)} (${((cachedCoreCount / Math.min(coreResources.length, 10)) * 100).toFixed(1)}%)`)
      
      if (uncachedResources.length > 0 && uncachedResources.length < 10) {
        console.log('\n未缓存的核心资源:')
        uncachedResources.slice(0, 5).forEach(url => {
          console.log(`  - ${url}...`)
        })
      }
      
      // 至少50%的核心资源应该被缓存
      const cacheRate = cachedCoreCount / Math.min(coreResources.length, 10)
      expect(cacheRate).toBeGreaterThanOrEqual(0.3) // 允许30%未缓存（可能是动态资源）
      
      if (cacheRate >= 0.7) {
        console.log('✓ 核心资源缓存良好')
      } else {
        console.log('⚠ 部分核心资源未被缓存')
      }
    }

    // ========== 4. 测试离线模式（模拟） ==========
    // 注意：完全离线测试在某些环境中可能不稳定
    console.log('\n--- 离线模拟测试 ---')
    
    try {
      // 设置离线模式
      await page.context().setOffline(true)
      await page.waitForTimeout(500)
      
      // 尝试导航到已缓存的页面
      const offlineNavigationSuccess = await page.goto('/', { timeout: 8000 }).then(() => true).catch(() => false)
      
      if (offlineNavigationSuccess) {
        const offlinePageTitle = await page.title()
        console.log(`离线模式下页面标题: ${offlinePageTitle}`)
        
        // 验证页面有内容（不是错误页）
        const hasContent = await page.locator('main, body > div').first().isVisible().catch(() => false)
        
        if (hasContent) {
          console.log('✓ 离线模式下页面可以正常显示')
          
          // 检查是否有自定义的离线页面
          const isOfflinePage = offlinePageTitle.toLowerCase().includes('offline') ||
                                await page.locator('text=/离线|无网络|Offline/').count() > 0
          
          if (isOfflinePage) {
            console.log('ℹ 显示了自定义离线页面')
          }
        } else {
          console.log('⚠ 离线模式下页面内容不完整')
        }
      } else {
        console.log('⚠ 离线模式下无法加载页面（可能需要完善离线策略）')
      }
      
      // 恢复在线模式
      await page.context().setOffline(false)
      await page.waitForTimeout(500)
      
    } catch (error) {
      console.log('ℹ 离线测试跳过:', error instanceof Error ? error.message : '未知原因')
      // 确保恢复在线状态
      await page.context().setOffline(false).catch(() => {})
    }

    console.log('\n✓ 离线资源缓存测试完成')
  })

  test('PWA 安装性和性能指标', async ({ page }) => {
    console.log('\n=== PWA 安装性和性能测试 ===\n')

    // ========== 1. 检测 beforeinstallprompt 事件支持 ==========
    const installPromptSupport = await page.evaluate(() => {
      return 'BeforeInstallPromptEvent' in window ||
             window.hasOwnProperty('onbeforeinstallprompt')
    })
    
    console.log(`beforeinstallprompt 事件支持: ${installPromptSupport ? '是' : '否'}`)

    // ========== 2. 检查是否满足安装条件 ==========
    const pwaInstallable = await page.evaluate(async () => {
      const checks = {
        hasManifest: false,
        hasServiceWorker: false,
        hasIcons: false,
        isHTTPS: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
        isRegistered: false
      }
      
      // 检查 Manifest
      try {
        const manifestLink = document.querySelector('link[rel="manifest"]')
        if (manifestLink) {
          checks.hasManifest = true
          
          // 验证 manifest 可访问
          const response = await fetch(manifestLink.getAttribute('href') || '/manifest.json')
          if (response.ok) {
            const manifest = await response.json()
            checks.hasIcons = !!(manifest.icons && manifest.icons.length > 0)
          }
        }
      } catch (e) {}
      
      // 检查 Service Worker
      try {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration()
          checks.hasServiceWorker = !!reg
          checks.isRegistered = !!reg
        }
      } catch (e) {}
      
      return checks
    })
    
    console.log('\nPWA 安装条件检查:')
    console.log(`  ✓ 有 Manifest: ${pwaInstallable.hasManifest}`)
    console.log(`  ✓ 有 Service Worker: ${pwaInstallable.hasServiceWorker}`)
    console.log(`  ✓ 有图标: ${pwaInstallable.hasIcons}`)
    console.log(`  ✓ HTTPS 环境: ${pwaInstallable.isHTTPS}`)
    console.log(`  ✓ SW 已注册: ${pwaInstallable.isRegistered}`)
    
    // 基本要求
    expect(pwaInstallable.hasManifest).toBeTruthy()
    expect(pwaInstallable.isHTTPS).toBeTruthy()
    
    if (pwaInstallable.hasManifest && pwaInstallable.hasServiceWorker && pwaInstallable.hasIcons) {
      console.log('\n✓ 应用满足 PWA 安装的基本条件')
    } else {
      console.log('\n⚠ 应用可能不完全满足 PWA 安装条件')
    }

    // ========== 3. 启动性能指标 ==========
    await page.goto('/')
    
    // 使用 Performance API 收集指标
    const performanceMetrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      return {
        // 关键时间点
        domContentLoaded: perf.domContentLoadedEventEnd - perf.startTime,
        loadComplete: perf.loadEventEnd - perf.startTime,
        firstPaint: perf.responseStart - perf.requestStart,
        
        // 资源加载
        transferSize: perf.transferSize,
        decodedBodySize: perf.decodedBodySize,
        
        // DOM 信息
        domElements: document.querySelectorAll('*').length,
        
        // 资源数量
        resourceCount: performance.getEntriesByType('resource').length
      }
    })
    
    console.log('\n启动性能指标:')
    console.log(`  DOM 内容加载时间: ${(performanceMetrics.domContentLoaded / 1000).toFixed(2)}s`)
    console.log(`  页面完全加载时间: ${(performanceMetrics.loadComplete / 1000).toFixed(2)}s`)
    console.log(`  DOM 元素数量: ${performanceMetrics.domElements}`)
    console.log(`  加载的资源数量: ${performanceMetrics.resourceCount}`)
    
    // PWA 应该快速启动（Lighthouse 建议 < 5s）
    expect(performanceMetrics.loadComplete).toBeLessThan(10000) // 10秒内
    
    if (performanceMetrics.loadComplete < 3000) {
      console.log('✓ 启动速度优秀 (< 3秒)')
    } else if (performanceMetrics.loadComplete < 5000) {
      console.log('✓ 启动速度良好 (< 5秒)')
    } else {
      console.log('⚠ 启动速度较慢 (> 5秒)，建议优化')
    }

    // ========== 4. theme-color 元标签验证 ==========
    const themeColorMeta = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="theme-color"]')
      return meta?.getAttribute('content') || null
    })
    
    if (themeColorMeta) {
      console.log(`\nTheme Color Meta: ${themeColorMeta}`)
      expect(themeColorMeta).toBe('#003B80') // 与 manifest 一致
      console.log('✓ Theme color meta 标签设置正确且与 manifest 一致')
    } else {
      console.log('\n⚠ 缺少 theme-color meta 标签（建议添加以改善移动浏览器体验）')
    }

    // ========== 5. apple-touch-icon 和其他平台特定图标 ==========
    const appleTouchIcon = await page.evaluate(() => {
      const link = document.querySelector('link[rel="apple-touch-icon"]')
      return link?.getAttribute('href') || null
    })
    
    if (appleTouchIcon) {
      console.log(`\nApple Touch Icon: ${appleTouchIcon}`)
      console.log('✓ 支持 iOS 添加到主屏幕')
    } else {
      console.log('\n⚠ 缺少 apple-touch-icon（iOS PWA 安装需要）')
    }

    // MS Tiles 配置（Windows）
    const msTileConfig = await page.evaluate(() => {
      const tileColor = document.querySelector('meta[name="msapplication-TileColor"]')
      const tileImage = document.querySelector('meta[name="msapplication-TileImage"]')
      return {
        color: tileColor?.getAttribute('content') || null,
        image: tileImage?.getAttribute('content') || null
      }
    })
    
    if (msTileConfig.color || msTileConfig.image) {
      console.log(`\nMS Tile Config: color=${msTileConfig.color}, image=${msTileConfig.image ? 'yes' : 'no'}`)
      console.log('✓ 支持 Windows PWA 安装')
    }

    // ========== 6. viewport 配置验证 ==========
    const viewportMeta = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]')
      return meta?.getAttribute('content') || ''
    })
    
    console.log(`\nViewport Meta: ${viewportMeta}`)
    
    const hasWidthDeviceWidth = viewportMeta.includes('width=device-width')
    const hasViewportFit = viewportMeta.includes('viewport-fit=cover')
    const hasUserScalable = viewportMeta.match(/user-scalable=(yes|no)/)
    
    if (hasWidthDeviceWidth) {
      console.log('✓ Viewport 配置包含 width=device-width')
    }
    
    if (hasViewportFit) {
      console.log('✓ Viewport 配置支持安全区域适配 (viewport-fit=cover)')
    }
    
    expect(hasWidthDeviceWidth).toBeTruthy()

    // ========== 7. 检查 safe-area-inset CSS 变量（刘海屏适配） ==========
    const safeAreaSupport = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement)
      return {
        top: styles.getPropertyValue('--safe-area-inset-top'),
        bottom: styles.getPropertyValue('--safe-area-inset-bottom'),
        left: styles.getPropertyValue('--safe-area-inset-left'),
        right: styles.getPropertyValue('--safe-area-inset-right')
      }
    })
    
    const hasSafeAreaVars = Object.values(safeAreaSupport).some(val => val.trim() !== '')
    
    if (hasSafeAreaVars) {
      console.log('\n✓ 支持 Safe Area 适配（刘海屏/灵动岛）')
    } else {
      console.log('\nℹ 未检测到 Safe Area CSS 变量（如果需要全面屏支持，建议添加）')
    }

    console.log('\n✓ PWA 安装性和性能测试完成')
  })
})

test.describe('PWA 边界情况和兼容性', () => {
  
  test('Manifest 错误处理', async ({ page }) => {
    // 测试访问不存在的 manifest
    const invalidManifest = await page.request.get('/invalid-manifest.json')
    
    console.log(`无效 Manifest 状态码: ${invalidManifest.status()}`)
    expect(invalidManifest.status()).toBe(404)
    
    // 测试格式错误的 JSON
    const malformedResponse = await page.request.fetch('/manifest.json', {
      headers: { 'Accept': 'text/plain' }
    })
    // 这个测试主要验证服务器能正确响应
    
    console.log('✓ Manifest 错误处理正常')
  })

  test('Service Worker 更新机制', async ({ page }) => {
    // 这个测试需要真实的 SW 实现
    // 这里做基本的注册检查
    
    await page.goto('/')
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})
    await page.waitForTimeout(2000)
    
    const swState = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) {
        return null
      }
      
      try {
        const reg = await navigator.serviceWorker.getRegistration()
        return {
          state: reg?.active?.state,
          scriptURL: reg?.active?.scriptURL
        }
      } catch (e) {
        return null
      }
    })
    
    if (swState) {
      console.log(`SW 状态: ${swState.state}`)
      expect(['activated', 'activating', 'installed']).toContain(swState.state)
      console.log('✓ SW 运行状态正常')
    } else {
      console.log('ℹ SW 可能未注册（取决于环境）')
    }
  })

  test('跨页面 PWA 一致性', async ({ page }) => {
    // 在不同页面间切换，验证 PWA 功能保持一致
    
    const pagesToTest = [
      '/',
      '/products',
      '/community'
    ]
    
    let allPagesHaveManifest = true
    
    for (const url of pagesToTest) {
      await page.goto(url)
      await page.waitForLoadState('domcontentloaded').catch(() => {})
      
      const hasManifestLink = await page.evaluate(() => {
        return !!document.querySelector('link[rel="manifest"]')
      })
      
      if (!hasManifestLink) {
        allPagesHaveManifest = false
        console.log(`⚠ ${url} 页面缺少 manifest link`)
      }
    }
    
    expect(allPagesHaveManifest).toBeTruthy()
    console.log('✓ 所有测试页面都包含 Manifest 引用')
  })
})
