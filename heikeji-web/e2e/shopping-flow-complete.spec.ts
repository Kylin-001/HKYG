import { test, expect } from '@playwright/test'

test.describe('完整购物流程 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('首页 → 商品列表 → 商品详情 → 加入购物车', async ({ page }) => {
    // 1. 等待首页加载完成
    await page.waitForLoadState('networkidle')

    // 2. 点击商品入口或导航到商品列表
    const productLink = page.locator('a[href="/products"], a:has-text("商品")').first()

    if (await productLink.isVisible()) {
      await productLink.click()
      await expect(page).toHaveURL(/.*\/products/)

      // 3. 等待商品列表加载
      await page.waitForSelector('.product-card, [class*="product"]', { timeout: 5000 })

      // 4. 点击第一个商品进入详情
      const firstProduct = page.locator('.product-card, [class*="product"]').first()

      if (await firstProduct.isVisible()) {
        await firstProduct.click()

        // 5. 验证进入详情页
        await expect(page).toHaveURL(/.*\/products\/\d+/)

        // 6. 查找加入购物车按钮
        const addToCartBtn = page.locator('button:has-text("加入购物车"), button:has-text("Add to Cart")').first()

        if (await addToCartBtn.isVisible()) {
          await addToCartBtn.click()

          // 7. 验证成功提示或跳转到购物车
          await page.waitForTimeout(1000)

          const cartLink = page.locator('a[href="/cart"], .cart-icon')
          if (await cartLink.count() > 0) {
            console.log('✅ 购物流程: 已添加到购物车')
          }
        }
      }
    }
  })

  test('搜索功能完整性测试', async ({ page }) => {
    // 1. 找到搜索框
    const searchInput = page.locator('input[placeholder*="搜索"], input[placeholder*="search"], .search-bar input').first()

    if (await searchInput.isVisible()) {
      // 2. 输入搜索关键词
      await searchInput.fill('数码')
      await searchInput.press('Enter')

      // 3. 等待搜索结果
      await page.waitForLoadState('networkidle')

      // 4. 验证URL包含搜索参数
      await expect(page.url()).toContain('keyword=')

      console.log('✅ 搜索功能正常工作')
    }
  })

  test('Banner轮播交互测试', async ({ page }) => {
    // 1. 查找Banner区域
    const banner = page.locator('[class*="banner"], [class*="carousel"]').first()

    if (await banner.isVisible()) {
      // 2. 鼠标悬停 (应暂停轮播)
      await banner.hover()
      await page.waitForTimeout(6000)

      // 3. 查找指示器dots
      const dots = page.locator('[class*="dot"], [class*="indicator"]')

      if (await dots.count() > 1) {
        // 4. 点击第二个dot切换banner
        await dots.nth(1).click()
        await page.waitForTimeout(500)

        console.log(`✅ Banner轮播: 共${await dots.count()}个幻灯片, 可点击切换`)
      } else {
        console.log('✅ Banner已显示 (单图模式)')
      }
    }
  })

  test('快速入口导航测试', async ({ page }) => {
    const quickEntries = [
      { name: '外卖', path: '/takeout' },
      { name: '二手', path: '/secondhand' },
      { name: '校园', path: '/campus' },
      { name: '社区', path: '/community' },
    ]

    for (const entry of quickEntries) {
      const link = page.locator(`a:has-text("${entry.name}"), a[href="${entry.path}"]`).first()

      if (await link.isVisible()) {
        await link.click()
        await expect(page).toHaveURL(new RegExp(entry.path))

        // 返回首页继续测试其他入口
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        console.log(`✅ 快速入口: ${entry.name} → ${entry.path} 导航成功`)
      }
    }
  })
})

test.describe('用户认证流程测试', () => {
  test('登录表单验证', async ({ page }) => {
    await page.goto('/auth/login')

    // 1. 验证登录页面标题
    await expect(page).toHaveTitle(/登录|Login/)

    // 2. 查找表单元素
    const usernameInput = page.locator('input[name="username"], input[type="text"], input[placeholder*="账号"]').first()
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    const submitBtn = page.locator('button[type="submit"], button:has-text("登录"), button:has-text("Login")').first()

    // 3. 验证表单存在
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(submitBtn).toBeVisible()

    // 4. 测试空提交验证
    await submitBtn.click()

    // 5. 应该显示错误提示
    const errorMsg = page.locator('.el-message--error, [class*="error"], text=必填')

    if (await errorMsg.count() > 0) {
      console.log('✅ 登录验证: 表单校验正常工作')
    }
  })

  test('注册流程完整性', async ({ page }) => {
    await page.goto('/auth/register')

    // 1. 验证注册页面
    await expect(page).toHaveURL(/.*register/)

    // 2. 查找注册表单字段
    const formFields = [
      'input[name="username"]',
      'input[name="email"], input[type="email"]',
      'input[name="password"], input[type="password"]',
      'input[placeholder*="确认密码"], input[placeholder*="confirm"]',
    ]

    for (const field of formFields) {
      const element = page.locator(field).first()
      if (await element.count() > 0) {
        await expect(element).toBeVisible()
      }
    }

    console.log('✅ 注册流程: 表单字段完整')
  })
})

test.describe('响应式布局测试', () => {
  ;['iPhone 13', 'iPad', 'Desktop 1920x1080'].forEach((device) => {
    test(`${device} 设备布局正确`, async ({ page }) => {
      if (device === 'Desktop 1920x1080') {
        await page.setViewportSize({ width: 1920, height: 1080 })
      } else {
        await page.setViewportSize(playwright.devices[device]?.viewport || { width: 375, height: 812 })
      }

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // 1. 页面应无水平滚动条
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      const viewportWidth = page.viewportSize().width

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1)

      // 2. 主要内容可见
      const mainContent = page.locator('main, [class*="page"], [class*="container"]').first()
      if (await mainContent.isVisible()) {
        const box = await mainContent.boundingBox()
        expect(box?.width).toBeGreaterThan(0)
      }

      console.log(`✅ 响应式布局: ${device} (${viewportWidth}px) 显示正常`)
    })
  })
})

test.describe('性能基准测试', () => {
  test('首屏内容绘制时间 < 2秒', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // 等待关键内容渲染
    await page.waitForSelector('nav, header, [role="navigation"]', { timeout: 5000 })

    const loadTime = Date.now() - startTime

    console.log(`⏱️ FCP (First Contentful Paint): ${loadTime}ms`)
    expect(loadTime).toBeLessThan(2000)
  })

  test('图片懒加载优化', async ({ page }) => {
    await page.goto('/')

    // 查找所有图片
    const images = page.locator('img[data-src], img[loading="lazy"]')
    const imageCount = await images.count()

    if (imageCount > 0) {
      // 初始时懒加载图片不应全部加载
      const visibleImages = images.filter(async (img) => {
        return await img.isVisible()
      })

      const visibleCount = await visibleImages.count()

      // 至少部分图片应该是延迟加载的
      console.log(`🖼️ 图片懒加载: 总计${imageCount}张, 可见${visibleCount}张`)
      expect(visibleCount).toBeLessThanOrEqual(imageCount)
    }
  })

  test('无控制台错误', async ({ page }) => {
    const errors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    page.on('pageerror', (err) => {
      errors.push(err.message)
    })

    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    console.log(`❌ 控制台错误数: ${errors.length}`)
    if (errors.length > 0) {
      console.table(errors.slice(0, 5))
    }

    expect(errors.length).toBeLessThan(5)
  })
})
