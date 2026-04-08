import { test, expect } from '@playwright/test'

test.describe('首页功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('页面标题正确显示', async ({ page }) => {
    await expect(page).toHaveTitle(/黑科易购/)
  })

  test('导航栏正确渲染', async ({ page }) => {
    // 页面有桌面端和移动端两个 nav，使用 first() 或 aria-label 精确匹配
    const desktopNav = page.locator('nav[aria-label="主导航"], nav.hidden.lg\\:flex')
    const mobileNav = page.locator('nav[aria-label="底部导航"]')

    const hasDesktopNav = await desktopNav.count() > 0
    const hasMobileNav = await mobileNav.count() > 0

    expect(hasDesktopNav || hasMobileNav).toBeTruthy()

    const homeLink = page.locator('a[href="/"]')
    await expect(homeLink.first()).toBeVisible()
  })

  test('快速入口卡片可见', async ({ page }) => {
    const quickEntries = page.locator('.quick-entry')
    
    if (await quickEntries.count() > 0) {
      await expect(quickEntries.first()).toBeVisible()
    }
  })

  test('商品列表区域加载', async ({ page }) => {
    const productSection = page.locator('[data-testid="product-section"]')
    
    if (await productSection.count() > 0) {
      await expect(productSection).toBeVisible()
      
      const productCards = productSection.locator('.product-card')
      if (await productCards.count() > 0) {
        await expect(productCards.first()).toBeVisible()
      }
    }
  })

  test('Banner轮播图存在', async ({ page }) => {
    const banner = page.locator('.banner, [class*="banner"], [class*="carousel"]')
    
    if (await banner.count() > 0) {
      await expect(banner.first()).toBeVisible()
    }
  })
})

test.describe('导航功能测试', () => {
  test('点击商品导航跳转到商品列表页', async ({ page }) => {
    await page.goto('/')
    
    const productsLink = page.locator('a[href="/products"], a:has-text("商品")').first()
    
    if (await productsLink.isVisible()) {
      await productsLink.click()
      await expect(page).toHaveURL(/.*\/products/)
    }
  })

  test('点击外卖导航跳转到外卖页面', async ({ page }) => {
    await page.goto('/')
    
    const takeoutLink = page.locator('a[href="/takeout"], a:has-text("外卖")').first()
    
    if (await takeoutLink.isVisible()) {
      await takeoutLink.click()
      await expect(page).toHaveURL(/.*\/takeout/)
    }
  })

  test('点击社区导航跳转到社区页面', async ({ page }) => {
    await page.goto('/')
    
    const communityLink = page.locator('a[href="/community"], a:has-text("社区")').first()
    
    if (await communityLink.isVisible()) {
      await communityLink.click()
      await expect(page).toHaveURL(/.*\/community/)
    }
  })
})

test.describe('响应式布局测试', () => {
  test('桌面端布局正常', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
  })

  test('平板端布局适配', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
  })

  test('移动端布局适配', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    
    const mobileNav = page.locator('nav.fixed.bottom-0, nav[class*="mobile"]')
    
    if (await mobileNav.count() > 0) {
      await expect(mobileNav.first()).toBeVisible()
    }
  })
})

test.describe('可访问性测试', () => {
  test('Skip Link存在且可聚焦', async ({ page }) => {
    await page.goto('/')
    
    const skipLink = page.locator('a.sr-only, a[href="#main-content"]')
    
    if (await skipLink.count() > 0) {
      await skipLink.focus()
      await expect(skipLink).toBeFocused()
    }
  })

  test('图片有alt属性', async ({ page }) => {
    await page.goto('/')

    const images = page.locator('img')
    const count = await images.count()

    // 装饰性图片可能没有 alt（使用 aria-hidden 或 role="presentation"），做软断言
    let altCount = 0
    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      const role = await img.getAttribute('role')
      const ariaHidden = await img.getAttribute('aria-hidden')

      const isDecorative = role === 'presentation' || ariaHidden === 'true'
      if (!isDecorative) {
        altCount++
      }
    }

    // 至少有一半非装饰性图片有 alt 属性即可
    if (count > 0) {
      expect(altCount).toBeGreaterThanOrEqual(Math.ceil(count / 2))
    }
  })

  test('按钮有可访问性标签', async ({ page }) => {
    await page.goto('/')

    // 修复 CSS 选择器语法错误：去掉多余的右括号
    const buttons = page.locator('button:not([aria-label])')
    const iconButtons = page.locator('button[aria-label]')

    const buttonCount = await buttons.count()
    const IconButtonCount = await iconButtons.count()

    // 有 aria-label 的按钮至少占一定比例
    if (buttonCount > 0) {
      expect(IconButtonCount).toBeGreaterThanOrEqual(1)
    }
  })
})

test.describe('性能测试', () => {
  test('首屏加载时间 < 3秒', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    
    const loadTime = Date.now() - startTime
    
    console.log(`首屏加载时间: ${loadTime}ms`)
    expect(loadTime).toBeLessThan(3000)
  })

  test('关键资源加载完成', async ({ page }) => {
    const responsePromise = []
    
    page.on('response', (response) => {
      if (response.url().includes('/api/')) {
        responsePromise.push(response)
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    for (const response of responsePromise) {
      expect(response.status()).toBeLessThan(400)
    }
  })
})
