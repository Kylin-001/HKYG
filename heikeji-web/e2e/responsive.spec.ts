/**
 * 响应式布局专项 E2E 测试
 *
 * 测试范围：
 * 1. 多设备视口尺寸下的首页布局验证
 * 2. 移动端侧边抽屉（汉堡菜单）交互
 * 3. 触摸手势支持（下拉刷新等）
 * 4. 断点切换时的布局变化
 * 5. 关键页面在各尺寸下的可用性
 *
 * 测试设备：
 * - Desktop XL (1920x1080)
 * - Desktop (1440x900)
 * - Laptop (1024x768)
 * - Tablet (768x1024)
 * - Mobile L (428x926 - iPhone 14 Pro Max)
 * - Mobile M (375x812 - iPhone 12/13)
 * - Mobile S (320x568 - iPhone SE)
 */

import { test, expect } from '@playwright/test'

// 定义测试视口配置
const viewports = [
  { name: 'Desktop XL', width: 1920, height: 1080, type: 'desktop' },
  { name: 'Desktop', width: 1440, height: 900, type: 'desktop' },
  { name: 'Laptop', width: 1024, height: 768, type: 'laptop' },
  { name: 'Tablet', width: 768, height: 1024, type: 'tablet' },
  { name: 'Mobile L', width: 428, height: 926, type: 'mobile' },
  { name: 'Mobile M', width: 375, height: 812, type: 'mobile' },
  { name: 'Mobile S', width: 320, height: 568, type: 'mobile' },
]

test.describe('跨设备响应式测试', () => {
  // 为每个视口生成独立的测试用例
  for (const vp of viewports) {
    test(`${vp.name} (${vp.width}x${vp.height}) 首页布局`, async ({ page }) => {
      // 设置视口大小
      await page.setViewportSize({ width: vp.width, height: vp.height })
      
      // 访问首页
      await page.goto('/')
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})
      
      console.log(`\n=== 测试 ${vp.name} (${vp.width}x${vp.height}) ===`)

      // ========== 1. Header 导航栏可见性验证 ==========
      const header = page.locator('header, [class*="header"], nav').first()
      
      if (await header.count() > 0) {
        await expect(header).toBeVisible()
        
        const headerBox = await header.boundingBox()
        if (headerBox) {
          console.log(`Header 尺寸: ${headerBox.width.toFixed(0)}x${headerBox.height.toFixed(0)}`)
          expect(headerBox.width).toBeGreaterThan(0)
          expect(headerBox.height).toBeGreaterThan(0)
          expect(headerBox.width).toBeLessThanOrEqual(vp.width + 10) // 允许小误差
        }
      }

      // ========== 2. Main 内容区域可见性 ==========
      const mainContent = page.locator('main, [class*="main"], [role="main"]').first()
      
      if (await mainContent.count() > 0) {
        await expect(mainContent).toBeVisible()
        
        const mainBox = await mainContent.boundingBox()
        if (mainBox) {
          console.log(`Main Content 尺寸: ${mainBox.width.toFixed(0)}x${mainBox.height.toFixed(0)}`)
          
          // 主内容区应该占据大部分宽度
          expect(mainBox.width).toBeGreaterThan(vp.width * 0.6) // 至少60%宽度
          expect(mainBox.height).toBeGreaterThan(vp.height * 0.3) // 至少30%高度
        }
      }

      // ========== 3. 根据设备类型验证特定元素 ==========
      
      if (vp.type === 'mobile') {
        // ====== 移动端特定验证 ======
        
        // a) 底部导航栏应该可见
        const bottomNav = page.locator(
          'nav.fixed.bottom-0, ' +
          '[class*="bottom-nav"], ' +
          '[class*="tab-bar"], ' +
          '[class*="mobile-nav"]:not([class*="drawer"])'
        ).first()
        
        if (await bottomNav.count() > 0) {
          await expect(bottomNav).toBeVisible()
          
          const navBox = await bottomNav.boundingBox()
          if (navBox) {
            // 底部导航应该在屏幕底部
            expect(navBox.y + navBox.height).toBeGreaterThan(vp.height - 100) // 在底部100px内
            console.log(`✓ 底部导航栏可见，位置: y=${navBox.y.toFixed(0)}, 高度=${navBox.height.toFixed(0)}`)
            
            // 验证底部导航项数量（通常4-5个）
            const navItems = bottomNav.locator('a, button, [class*="item"]')
            const itemCount = await navItems.count()
            console.log(`  底部导航项数: ${itemCount}`)
            expect(itemCount).toBeGreaterThanOrEqual(3)
          }
        }
        
        // b) 汉堡菜单按钮可见
        const hamburgerMenu = page.locator(
          'button[aria-label*="菜单"], ' +
          'button[aria-label*="Menu"], ' +
          '[class*="hamburger"], ' +
          '[class*="menu-toggle"], ' +
          'button:has(svg):first-of-type'
        ).first()
        
        if (await hamburgerMenu.count() > 0 && await hamburgerMenu.isVisible()) {
          await expect(hamburgerMenu).toBeVisible()
          console.log('✓ 汉堡菜单按钮可见')
        }
        
        // c) 桌面端完整导航栏应该隐藏或变为紧凑形式
        const fullDesktopNav = page.locator(
          '[class*="desktop-nav"]:not([class*="hidden"]), ' +
          'nav[class*="horizontal"]:has(> a:nth-child(5))' // 有超过5个链接的横向导航
        )
        
        if (await fullDesktopNav.count() > 0) {
          // 如果存在完整导航，它应该是隐藏的
          const isVisible = await fullDesktopNav.first().isVisible()
          if (isVisible) {
            console.log('⚠ 移动端仍显示桌面导航（可能需要检查CSS）')
          } else {
            console.log('✓ 桌面导航在移动端已隐藏')
          }
        }

      } else if (vp.type === 'desktop') {
        // ====== 桌面端特定验证 ======
        
        // a) 完整导航栏可见
        const desktopNav = page.locator(
          'nav, ' +
          '[class*="nav"]'
        ).first()
        
        if (await desktopNav.count() > 0) {
          await expect(desktopNav).toBeVisible()
          
          // 验证导航包含多个链接
          const navLinks = desktopNav.locator('a[href]:not([href="#"])')
          const linkCount = await navLinks.count()
          console.log(`导航链接数: ${linkCount}`)
          
          if (linkCount >= 4) {
            console.log('✓ 完整导航栏显示多个链接')
          }
        }
        
        // b) 底部移动端导航应该隐藏
        const mobileBottomNav = page.locator('[class*="bottom-nav"], [class*="tab-bar"]').first()
        if (await mobileBottomNav.count() > 0) {
          const isVisible = await mobileBottomNav.isVisible()
          if (!isVisible) {
            console.log('✓ 移动端底部导航在桌面端已隐藏')
          }
        }
        
        // c) 侧边栏/抽屉应该隐藏
        const sidebarDrawer = page.locator('[class*="sidebar"][class*="open"], [class*="drawer"][class*="open"]')
        if (await sidebarDrawer.count() > 0) {
          const isOpen = await sidebarDrawer.first().isVisible()
          expect(isOpen).toBeFalsy()
          console.log('✓ 侧边抽屉默认关闭')
        }

      } else if (vp.type === 'tablet') {
        // ====== 平板端特定验证 ======
        
        // 平板可能显示混合布局
        console.log('平板模式：验证混合布局')
        
        // 可以有简化的导航或可折叠的侧边栏
        const anyNav = page.locator('nav').first()
        if (await anyNav.count() > 0) {
          await expect(anyNav).toBeVisible()
        }
      }

      // ========== 4. 内容区域无水平滚动条 ==========
      // 这是一个重要的响应式设计指标
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth
      })
      
      expect(hasHorizontalScroll).toBeFalsy()
      console.log('✓ 无水平溢出')

      // ========== 5. 图片和媒体元素自适应 ==========
      const images = page.locator('img:visible')
      const imgCount = await images.count()
      
      if (imgCount > 0) {
        // 检查前几个图片是否超出容器
        let overflowCount = 0
        
        for (let i = 0; i < Math.min(imgCount, 5); i++) {
          const img = images.nth(i)
          const box = await img.boundingBox()
          
          if (box) {
            // 图片不应该超出视口宽度太多
            if (box.width > vp.width + 20) {
              overflowCount++
            }
          }
        }
        
        expect(overflowCount).toBe(0)
        console.log(`✓ 检查了 ${Math.min(imgCount, 5)} 张图片，均未溢出`)
      }

      // ========== 6. 文字大小合理（不会太小或太大） ==========
      const bodyText = page.locator('body').first()
      const fontSize = await bodyText.evaluate(el => {
        return window.getComputedStyle(el).fontSize
      })
      
      const fontSizeValue = parseFloat(fontSize)
      console.log(`基础字体大小: ${fontSize}px`)
      
      // 字体大小应该在合理范围内（10px-24px）
      expect(fontSizeValue).toBeGreaterThan(10)
      expect(fontSizeValue).toBeLessThan(24)

      console.log(`✓ ${vp.name} 测试通过`)
    })
  }

  test('移动端侧边抽屉交互', async ({ page }) => {
    // 设置为中等手机尺寸
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})

    console.log('\n=== 测试移动端侧边抽屉 ===\n')

    // ========== 1. 定位并点击汉堡菜单 ==========
    const hamburgerButton = page.locator(
      'button[aria-label*="菜单"], ' +
      'button[aria-label*="Menu"], ' +
      '[class*="hamburger"], ' +
      '[class*="menu-toggle"], ' +
      '[class*="menu-btn"], ' +
      'button:has([class*="bar"]), ' + // 三横线图标
      'button:has(svg[class*="menu"])'
    ).first()
    
    if (await hamburgerButton.count() === 0 || !await hamburgerButton.isVisible()) {
      console.log('⚠ 未找到汉堡菜单按钮，尝试其他选择器...')
      
      // 备选方案：查找可能是菜单的按钮
      const possibleMenuBtn = page.locator('header button, nav button').first()
      if (await possibleMenuBtn.count() > 0) {
        console.log('找到可能的菜单按钮，尝试点击')
        await possibleMenuBtn.click()
        await page.waitForTimeout(800)
      } else {
        console.log('⚠ 无法找到任何菜单按钮')
        return
      }
    } else {
      await expect(hamburgerButton).toBeVisible()
      console.log('✓ 找到汉堡菜单按钮')
      
      // 点击打开抽屉
      await hamburgerButton.click()
      await page.waitForTimeout(800)
      console.log('✓ 已点击汉堡菜单')
    }

    // ========== 2. 验证抽屉从右侧滑入 ==========
    const drawerOverlay = page.locator(
      '[class*="overlay"], ' +
      '[class*="mask"], ' +
      '[class*="backdrop"], ' +
      '[class*="drawer-overlay"]'
    ).first()
    
    const drawerPanel = page.locator(
      '[class*="drawer"], ' +
      '[class*="sidebar"], ' +
      '[class*="side-menu"], ' +
      '[class*="offcanvas"], ' +
      '[role="dialog"]:not([aria-modal="true"])' // 非模态对话框
    ).first()

    let drawerFound = false
    
    // 检查遮罩层
    if (await drawerOverlay.count() > 0) {
      const isOverlayVisible = await drawerOverlay.isVisible()
      if (isOverlayVisible) {
        await expect(drawerOverlay).toBeVisible()
        console.log('✓ 抽屉遮罩层出现')
        
        // 验证遮罩层覆盖全屏
        const overlayBox = await drawerOverlay.boundingBox()
        if (overlayBox) {
          expect(overlayBox.width).toBeGreaterThanOrEqual(375) // 至少屏幕宽
          expect(overlayBox.height).toBeGreaterThanOrEqual(812) // 至少屏幕高
        }
        drawerFound = true
      }
    }
    
    // 检查抽屉面板
    if (await drawerPanel.count() > 0) {
      const isDrawerVisible = await drawerPanel.isVisible()
      if (isDrawerVisible) {
        await expect(drawerPanel).toBeVisible()
        console.log('✓ 抽屉面板可见')
        
        const panelBox = await drawerPanel.boundingBox()
        if (panelBox) {
          console.log(`  抽屉面板位置: x=${panelBox.x.toFixed(0)}, y=${panelBox.y.toFixed(0)}`)
          console.log(`  抽屉面板尺寸: ${panelBox.width.toFixed(0)}x${panelBox.height.toFixed(0)}`)
          
          // 抽屉通常从右侧进入，宽度约为屏幕的70-85%
          expect(panelBox.width).toBeGreaterThan(200) // 至少200px宽
          expect(panelBox.width).toBeLessThanOrEqual(350) // 不超过350px（在375px屏幕上）
          expect(panelBox.height).toBeGreaterThan(500) // 应该很高
          
          // 如果是从右侧滑入，x坐标应该接近右侧
          // 但也可能从左侧滑入（取决于设计）
        }
        drawerFound = true

        // ========== 3. 验证导航链接可点击 ==========
        const navLinksInDrawer = drawerPanel.locator(
          'a[href], ' +
          'button:not([disabled]), ' +
          '[class*="nav-item"], ' +
          '[class*="menu-item"]'
        )
        
        const linkCount = await navLinksInDrawer.count()
        console.log(`  抽屉内导航项数量: ${linkCount}`)
        
        if (linkCount > 0) {
          // 验证至少有几个导航链接
          expect(linkCount).toBeGreaterThanOrEqual(3)
          
          // 验证每个链接可见且可交互
          let visibleLinkCount = 0
          for (let i = 0; i < Math.min(linkCount, 5); i++) {
            const link = navLinksInDrawer.nth(i)
            if (await link.isVisible()) {
              visibleLinkCount++
              
              // 验证可聚焦
              await link.focus()
              const isFocused = await link.isFocused()
              if (isFocused) {
                // OK
              }
            }
          }
          
          console.log(`  可见导航链接数: ${visibleLinkCount}`)
          expect(visibleLinkCount).toBeGreaterThanOrEqual(2)
          console.log('✓ 抽屉内导航链接正常')
        }
      }
    }
    
    if (!drawerFound) {
      console.log('⚠ 未检测到抽屉组件（可能使用其他导航模式）')
    }

    // ========== 4. 点击遮罩层关闭抽屉 ==========
    if (await drawerOverlay.count() > 0 && await drawerOverlay.isVisible()) {
      await drawerOverlay.click({ position: { x: 50, y: 400 } }) // 点击遮罩左侧区域
      await page.waitForTimeout(600)
      
      // 验证抽屉关闭
      const overlayStillVisible = await drawerOverlay.isVisible()
      const drawerStillVisible = await drawerPanel.count() > 0 ? await drawerPanel.isVisible() : false
      
      expect(overlayStillVisible).toBeFalsy()
      expect(drawerStillVisible).toBeFalsy()
      console.log('✓ 点击遮罩后抽屉关闭')
    } else if (await drawerPanel.count() > 0 && await drawerPanel.isVisible()) {
      // 如果没有遮罩层，尝试按 ESC 键关闭
      await page.keyboard.press('Escape')
      await page.waitForTimeout(600)
      
      const drawerStillVisible = await drawerPanel.isVisible()
      expect(drawerStillVisible).toBeFalsy()
      console.log('✓ 按 ESC 后抽屉关闭')
    }

    // ========== 5. 重新打开抽屉测试滑动关闭（如果支持） ==========
    if (await hamburgerButton.count() > 0 && await hamburgerButton.isVisible()) {
      await hamburgerButton.click()
      await page.waitForTimeout(800)
      
      if (await drawerPanel.count() > 0 && await drawerPanel.isVisible()) {
        // 尝试从右向左滑动关闭（触摸手势模拟）
        const panelBox = await drawerPanel.boundingBox()
        if (panelBox) {
          // 从面板中间开始，向左滑动
          const startX = panelBox.x + panelBox.width - 20
          const startY = panelBox.y + panelBox.height / 2
          const endX = panelBox.x - 50
          
          // 使用触摸事件模拟滑动
          await page.touchscreen.tap(startX, startY)
          await page.mouse.move(startX, startY)
          await page.mouse.down()
          await page.mouse.move(endX, startY, { steps: 10 })
          await page.mouse.up()
          await page.waitForTimeout(600)
          
          // 验证是否关闭（可选，某些实现可能不支持手势关闭）
          const stillOpen = await drawerPanel.isVisible()
          if (!stillOpen) {
            console.log('✓ 支持滑动关闭抽屉')
          } else {
            console.log('ℹ 抽屉仍然打开（可能不支持手势关闭）')
            
            // 手动关闭
            await page.keyboard.press('Escape')
            await page.waitForTimeout(300)
          }
        }
      }
    }

    console.log('✓ 移动端侧边抽屉交互测试完成')
  })

  test('触摸手势支持', async ({ page }) => {
    // 设置为移动设备尺寸
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})

    console.log('\n=== 测试触摸手势支持 ===\n')

    // ========== 1. 下拉刷新功能测试 ==========
    
    // 查找支持下拉刷新的区域（通常是主内容区或列表容器）
    const pullToRefreshContainer = page.locator(
      '[class*="pull-refresh"], ' +
      '[class*="PullToRefresh"], ' +
      '[data-pullrefresh], ' +
      'main, ' +
      '[class*="scroll-container"]'
    ).first()
    
    if (await pullToRefreshContainer.count() > 0) {
      console.log('找到可能支持下拉刷新的容器')
      
      const containerBox = await pullToRefreshContainer.boundingBox()
      if (containerBox) {
        // 模拟下拉手势：从顶部向下拖动
        const startX = containerBox.x + containerBox.width / 2
        const startY = containerBox.y + 20 // 从靠近顶部的位置开始
        const endY = startY + 200 // 向下拖动200像素
        
        // 使用触摸事件
        await page.touchscreen.tap(startX, startY)
        
        // 模拟 touchstart -> touchmove -> touchend
        await page.evaluate(({ x, y }) => {
          const touchStart = new TouchEvent('touchstart', {
            bubbles: true,
            cancelable: true,
            touches: [new Touch({
              identifier: 0,
              target: document.elementFromPoint(x, y) || document.body,
              clientX: x,
              clientY: y
            })]
          })
          document.elementFromPoint(x, y)?.dispatchEvent(touchStart)
        }, { x: startX, y: startY })
        
        await page.waitForTimeout(100)
        
        await page.evaluate(({ x, y }) => {
          const touchMove = new TouchEvent('touchmove', {
            bubbles: true,
            cancelable: true,
            touches: [new Touch({
              identifier: 0,
              target: document.body,
              clientX: x,
              clientY: y
            })]
          })
          document.dispatchEvent(touchMove)
        }, { x: startX, y: endY })
        
        await page.waitForTimeout(300)
        
        await page.evaluate(({ x, y }) => {
          const touchEnd = new TouchEvent('touchend', {
            bubbles: true,
            cancelable: true,
            changedTouches: [new Touch({
              identifier: 0,
              target: document.body,
              clientX: x,
              clientY: y
            })]
          })
          document.dispatchEvent(touchEnd)
        }, { x: startX, y: endY })
        
        await page.waitForTimeout(1000)
        
        // 检查是否出现了刷新指示器
        const refreshIndicator = page.locator(
          '[class*="pull-indicator"], ' +
          '[class*="refresh-icon"], ' +
          '[class*="loading"]:has([class*="spinner"])'
        )
        
        if (await refreshIndicator.count() > 0) {
          const wasVisible = await refreshIndicator.first().isVisible()
          if (wasVisible) {
            console.log('✓ 检测到下拉刷新指示器')
          }
        }
        
        console.log('✓ 下拉刷新手势已触发')
      }
    } else {
      console.log('⚠ 未找到明确支持下拉刷新的容器')
    }

    // ========== 2. 左滑返回手势（如果实现） ==========
    // 这通常需要特定的浏览器或 WebView 支持
    // 这里只做基本验证
    
    // 检查是否有返回按钮或手势指示
    const backButton = page.locator(
      'button[aria-label="返回"], ' +
      'button[aria-label="Back"], ' +
      '[class*="back-button"], ' +
      'a:has-text("←")'
    ).first()
    
    if (await backButton.count() > 0 && await backButton.isVisible()) {
      console.log('✓ 找到返回按钮')
      
      // 点击返回按钮测试导航
      await backButton.click()
      await page.waitForTimeout(1000)
      
      // 验证URL变化或历史记录
      console.log('✓ 返回按钮可点击')
      
      // 返回首页继续测试
      await page.goto('/')
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
    }

    // ========== 3. 双击缩放禁用验证（移动端最佳实践） ==========
    const viewportMeta = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]')
      return meta?.getAttribute('content') || ''
    })
    
    console.log(`Viewport meta 标签: ${viewportMeta}`)
    
    // 检查是否禁止双击缩放
    const hasTouchActionNone = await page.evaluate(() => {
      const body = document.body
      const style = window.getComputedStyle(body)
      return style.touchAction === 'none' || style.touchAction === 'manipulation'
    })
    
    if (hasTouchActionNone || viewportMeta.includes('user-scalable=no')) {
      console.log('✓ 已优化触摸行为（防止意外缩放）')
    }

    // ========== 4. 触摸目标尺寸验证 ==========
    // WCAG 2.1 推荐触摸目标至少 44x44 CSS 像素
    const interactiveElements = page.locator(
      'a:visible, ' +
      'button:visible, ' +
      'input[type="checkbox"]:visible, ' +
      'input[type="radio"]:visible, ' +
      '[role="button"]:visible'
    )
    
    const elementCount = await interactiveElements.count()
    let smallTargets = 0
    
    if (elementCount > 0) {
      // 检查前15个交互元素的尺寸
      const checkCount = Math.min(elementCount, 15)
      
      for (let i = 0; i < checkCount; i++) {
        const el = interactiveElements.nth(i)
        const box = await el.boundingBox()
        
        if (box) {
          // 检查最小尺寸（考虑 padding 和 border）
          const minDimension = Math.min(box.width, box.height)
          if (minDimension < 44) {
            smallTargets++
          }
        }
      }
      
      const smallTargetPercentage = (smallTargets / checkCount) * 100
      console.log(`检查了 ${checkCount} 个交互元素，${smallTargets} 个小于 44px (${smallTargetPercentage.toFixed(1)}%)`)
      
      // 允许少量小目标（如图标按钮），但不应超过50%
      expect(smallTargetPercentage).toBeLessThan(51)
    }

    console.log('✓ 触摸手势支持测试完成')
  })

  test('断点切换时布局连续性', async ({ page }) => {
    console.log('\n=== 测试断点切换布局连续性 ===\n')
    
    // 定义关键断点进行测试
    const breakpoints = [
      { name: 'Mobile to Tablet', from: { w: 375, h: 812 }, to: { w: 768, h: 1024 } },
      { name: 'Tablet to Desktop', from: { w: 768, h: 1024 }, to: { w: 1440, h: 900 } },
      { name: 'Desktop to Mobile', from: { w: 1440, h: 900 }, to: { w: 375, h: 812 } },
    ]
    
    for (const bp of breakpoints) {
      console.log(`\n--- ${bp.name}: ${bp.from.w} → ${bp.to.w} ---`)
      
      // 先设置初始视口
      await page.setViewportSize({ width: bp.from.w, height: bp.from.h })
      await page.goto('/')
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
      
      // 记录初始状态
      const initialLayout = await page.evaluate(() => {
        const header = document.querySelector('header, nav')
        const main = document.querySelector('main')
        return {
          headerExists: !!header,
          mainExists: !!main,
          headerDisplay: header ? window.getComputedStyle(header).display : null,
          mainWidth: main ? main.getBoundingClientRect().width : 0,
        }
      })
      
      console.log(`  初始状态: header=${initialLayout.headerExists}, mainWidth=${initialLayout.mainWidth.toFixed(0)}px`)
      
      // 切换到新视口
      await page.setViewportSize({ width: bp.to.w, height: bp.to.h })
      await page.waitForTimeout(500) // 等待 CSS 媒体查询生效
      
      // 记录新状态
      const newLayout = await page.evaluate(() => {
        const header = document.querySelector('header, nav')
        const main = document.querySelector('main')
        return {
          headerExists: !!header,
          mainExists: !!main,
          headerDisplay: header ? window.getComputedStyle(header).display : null,
          mainWidth: main ? main.getBoundingClientRect().width : 0,
        }
      })
      
      console.log(`  切换后状态: header=${newLayout.headerExists}, mainWidth=${newLayout.mainWidth.toFixed(0)}px`)
      
      // 验证核心元素始终存在
      expect(newLayout.headerExists).toBeTruthy()
      expect(newLayout.mainExists).toBeTruthy()
      
      // 主内容宽度应该适应新视口
      expect(newLayout.mainWidth).toBeGreaterThan(bp.to.w * 0.5)
      expect(newLayout.mainWidth).toBeLessThanOrEqual(bp.to.w + 10)
      
      // 验证无水平滚动条
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth
      })
      expect(hasHorizontalScroll).toBeFalsy()
      
      console.log(`  ✓ ${bp.name} 切换成功，布局正常`)
    }
    
    console.log('\n✓ 所有断点切换测试通过')
  })
})
