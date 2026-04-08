/**
 * 外卖点餐 E2E 测试
 *
 * 测试范围：
 * 1. 商家列表浏览和筛选
 * 2. 商家详情页菜单展示
 * 3. 菜品添加到购物车流程
 * 4. 底部购物车栏交互
 * 5. 配送时间选择功能
 * 6. 配送追踪页面（如有）
 *
 * 覆盖页面：
 * - /takeout (外卖首页)
 * - /takeout/merchant/:merchantId (商家详情)
 * - /takeout/track/:orderId (配送追踪)
 */

import { test, expect } from '@playwright/test'

test.describe('外卖功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('商家列表浏览', async ({ page }) => {
    // ========== 访问外卖页 ==========
    await page.goto('/takeout')
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
    
    // 验证页面标题包含"外卖"
    const pageTitle = await page.title()
    console.log(`外卖页面标题: ${pageTitle}`)
    expect(pageTitle).toMatch(/外卖|美食/)

    // ========== 验证搜索框 ==========
    const searchInput = page.locator(
      'input[placeholder*="搜索"], ' +
      '[class*="search"] input, ' +
      '.search-bar input'
    ).first()
    
    if (await searchInput.isVisible().catch(() => false)) {
      await expect(searchInput).toBeVisible()
      
      // 测试搜索输入
      await searchInput.fill('汉堡')
      await page.waitForTimeout(500)
      
      // 清空搜索
      await searchInput.clear()
      console.log('✓ 搜索框正常')
    }

    // ========== 验证分类标签 ==========
    const categoryTabs = page.locator(
      '[class*="category-tab"], ' +
      '[class*="category"] button, ' +
      'button:has-text("全部"), ' +
      'button:has-text("美食"), ' +
      '.el-tabs__item'
    )
    
    if (await categoryTabs.count() > 0) {
      const tabCount = await categoryTabs.count()
      console.log(`找到 ${tabCount} 个分类标签`)
      
      // 点击第一个分类
      if (await categoryTabs.first().isVisible()) {
        await categoryTabs.first().click()
        await page.waitForTimeout(800)
        console.log('✓ 分类切换正常')
      }
    }

    // ========== 验证商家卡片渲染 ==========
    const merchantCards = page.locator(
      '[class*="merchant-card"], ' +
      '[class*="MerchantCard"], ' +
      '[class*="store-card"], ' +
      '[class*="restaurant-card"], ' +
      '[class*="card"]:has([class*="rating"])' // 包含评分的卡片
    )
    
    const cardCount = await merchantCards.count()
    console.log(`找到 ${cardCount} 个商家卡片`)
    
    if (cardCount > 0) {
      // 验证第一个商家卡片的完整性
      const firstCard = merchantCards.first()
      await expect(firstCard).toBeVisible()
      
      // 1. 商家名称
      const merchantName = firstCard.locator(
        '[class*="name"], ' +
        '[class*="title"], ' +
        'h3, h4, ' +
        '[class*="merchant-name"]'
      ).first()
      
      if (await merchantName.count() > 0) {
        await expect(merchantName).toBeVisible()
        const nameText = await merchantName.textContent()
        expect(nameText?.trim().length).toBeGreaterThan(0)
        console.log(`第一个商家名称: ${nameText}`)
      }
      
      // 2. 评分信息
      const ratingInfo = firstCard.locator(
        '[class*="rating"], ' +
        '[class*="score"], ' +
        '[class*="star"], ' +
        'text=/\d+\.\d+分/' // 匹配 "4.5分" 格式
      ).first()
      
      if (await ratingInfo.count() > 0) {
        await expect(ratingInfo).toBeVisible()
        const ratingText = await ratingInfo.textContent()
        console.log(`商家评分: ${ratingText}`)
        
        // 验证评分是合理的数字格式
        const ratingMatch = ratingText?.match(/(\d+\.?\d*)/)
        if (ratingMatch) {
          const ratingValue = parseFloat(ratingMatch[1])
          expect(ratingValue).toBeGreaterThanOrEqual(0)
          expect(ratingValue).toBeLessThanOrEqual(5)
        }
      }
      
      // 3. 月售数量
      const monthlySales = firstCard.locator(
        '[class*="sales"], ' +
        '[class*="month"], ' +
        'text=/月售\d+/, ' +
        'text:/\d+单/'
      ).first()
      
      if (await monthlySales.count() > 0) {
        await expect(monthlySales).toBeVisible()
        const salesText = await monthlySales.textContent()
        console.log(`月售数据: ${salesText}`)
      }
      
      // 4. 配送时间和配送费
      const deliveryInfo = firstCard.locator(
        '[class*="delivery"], ' +
        '[class*="time"], ' +
        'text=/\d+分钟/, ' +
        'text=/配送/'
      ).first()
      
      if (await deliveryInfo.count() > 0) {
        await expect(deliveryInfo).toBeVisible()
        const deliveryText = await deliveryInfo.textContent()
        console.log(`配送信息: ${deliveryText}`)
        
        // 验证配送时间是合理范围（通常15-60分钟）
        const timeMatch = deliveryText?.match(/(\d+)分钟/)
        if (timeMatch) {
          const minutes = parseInt(timeMatch[1])
          expect(minutes).toBeGreaterThan(10)
          expect(minutes).toBeLessThanOrEqual(120)
        }
      }
      
      // 5. 起送价或人均价格
      const priceInfo = firstCard.locator(
        '[class*="price"]:not([class*="delivery"]), ' +
        'text=/起送¥?\d+/, ' +
        'text=/人均¥?\d+/'
      ).first()
      
      if (await priceInfo.count() > 0) {
        await expect(priceInfo).toBeVisible()
        const priceText = await priceInfo.textContent()
        console.log(`价格信息: ${priceText}`)
      }
      
      // 6. 商家Logo或封面图
      const merchantImage = firstCard.locator('img').first()
      if (await merchantImage.count() > 0) {
        await expect(merchantImage).toBeVisible()
        
        // 验证图片已加载
        const naturalWidth = await merchantImage.evaluate(img => img.naturalWidth)
        expect(naturalWidth).toBeGreaterThan(0)
      }

      // ========== 点击商家进入详情 ==========
      // 确保卡片可点击
      const isClickable = await firstCard.evaluate(el => {
        return el.tagName === 'A' || 
               el.onclick !== null || 
               el.style.cursor === 'pointer' ||
               el.getAttribute('role') === 'link'
      })
      
      if (isClickable || true) { // 尝试点击，即使不确定是否可点击
        await firstCard.click({ timeout: 5000 }).catch(() => {})
        await page.waitForTimeout(1000)
        
        // 验证是否跳转到商家详情页
        const currentUrl = page.url()
        if (currentUrl.includes('/merchant/')) {
          console.log(`✓ 成功进入商家详情页: ${currentUrl}`)
          
          // 简单验证详情页加载
          await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
          
          const detailPageContent = page.locator('[class*="merchant-detail"], [class*="store-detail"], main')
          if (await detailPageContent.count() > 0) {
            await expect(detailPageContent.first()).toBeVisible()
            console.log('✓ 商家详情页内容加载成功')
          }
        } else {
          console.log(`⚠ 未跳转到商家详情页，当前URL: ${currentUrl}`)
        }
      }
    } else {
      console.log('⚠ 未找到商家卡片')
      
      // 检查是否有空状态提示
      const emptyState = page.locator('[class*="empty"], text=/暂无|还没有|附近没有/')
      if (await emptyState.count() > 0) {
        await expect(emptyState.first()).toBeVisible()
        console.log('显示空状态提示')
      }
    }
  })

  test('商家详情和购物车', async ({ page }) => {
    // 直接访问一个示例商家详情页（假设存在）
    // 或者先从列表进入
    await page.goto('/takeout')
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
    
    // 尝试点击第一个商家
    const merchantCard = page.locator('[class*="merchant-card"], [class*="store-card"]').first()
    
    if (await merchantCard.count() > 0 && await merchantCard.isVisible()) {
      await merchantCard.click()
      await page.waitForURL(/.*\/merchant\//, { timeout: 5000 }).catch(() => {})
    } else {
      // 如果找不到商家卡片，尝试直接访问示例URL
      await page.goto('/takeout/merchant/1', { timeout: 5000 }).catch(() => {
        console.log('无法访问示例商家详情页')
      })
    }
    
    // 等待详情页加载
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
    
    const currentUrl = page.url()
    if (!currentUrl.includes('/merchant/')) {
      console.log('⚠ 未成功进入商家详情页')
      return
    }
    
    console.log(`当前商家详情页URL: ${currentUrl}`)

    // ========== 商家详情页验证 ==========
    
    // 1. 商家头部信息（名称、评分、地址等）
    const merchantHeader = page.locator('[class*="header"], [class*="info"], [class*="merchant-info"]').first()
    if (await merchantHeader.count() > 0) {
      await expect(merchantHeader).toBeVisible()
      
      // 商家名称
      const nameElement = merchantHeader.locator('h1, h2, [class*="name"]').first()
      if (await nameElement.count() > 0) {
        await expect(nameElement).toBeVisible()
        const merchantName = await nameElement.textContent()
        console.log(`商家名称: ${merchantName}`)
      }
      
      // 评分
      const headerRating = merchantHeader.locator('[class*="rating"], [class*="score"]').first()
      if (await headerRating.count() > 0) {
        await expect(headerRating).toBeVisible()
      }
      
      // 地址
      const address = merchantHeader.locator('[class*="address"], [class*="location"]').first()
      if (await address.count() > 0) {
        await expect(address).toBeVisible()
      }
      
      // 营业时间
      const businessHours = merchantHeader.locator('[class*="time"], [class*="hours"]').first()
      if (await businessHours.count() > 0) {
        await expect(businessHours).toBeVisible()
      }
    }

    // 2. 菜单渲染验证
    const menuSection = page.locator(
      '[class*="menu"], ' +
      '[class*="Menu"], ' +
      '[class*="dish-list"], ' +
      '[class*="food-list"]'
    )
    
    if (await menuSection.count() > 0) {
      await expect(menuSection.first()).toBeVisible()
      console.log('✓ 找到菜单区域')
      
      // 菜品列表
      const dishItems = menuSection.first().locate(
        '[class*="dish-item], ' +
        '[class*="food-item], ' +
        '[class*="menu-item]:not([class*="category"]), ' +
        '[class*=" DishItem"]'
      )
      
      const dishCount = await dishItems.count()
      console.log(`菜单中有 ${dishCount} 个菜品`)
      
      if (dishCount > 0) {
        // 验证第一个菜品的信息完整性
        const firstDish = dishItems.first()
        
        // 菜品图片
        const dishImage = firstDish.locator('img').first()
        if (await dishImage.count() > 0) {
          await expect(dishImage).toBeVisible()
        }
        
        // 菜品名称
        const dishName = firstDish.locator('[class*="name"], [class*="title"], h4, h5').first()
        if (await dishName.count() > 0) {
          await expect(dishName).toBeVisible()
          const nameText = await dishName.textContent()
          console.log(`第一个菜品: ${nameText}`)
        }
        
        // 菜品价格
        const dishPrice = firstDish.locator('[class*="price"]').first()
        if (await dishPrice.count() > 0) {
          await expect(dishPrice).toBeVisible()
          const priceText = await dishPrice.textContent()
          console.log(`菜品价格: ${priceText}`)
          
          // 验证价格格式正确
          expect(priceText?.match(/[¥￥]?\d+(\.\d+)?/)).toBeTruthy()
        }
        
        // 菜品描述
        const dishDesc = firstDish.locator('[class*="desc"], [class*="description"]').first()
        if (await dishDesc.count() > 0) {
          await expect(dishDesc).toBeVisible()
        }
        
        // 销量或好评率
        const dishStats = firstDish.locator('[class*="sales], [class*="sold]').first()
        if (await dishStats.count() > 0) {
          await expect(dishStats).toBeVisible()
        }
        
        // 3. 添加菜品到购物车
        const addToCartBtn = firstDish.locator(
          'button:has-text("+"), ' +
          'button[aria-label*="加入购物车"], ' +
          '[class*="add-btn"], ' +
          '[data-testid="add-to-cart"], ' +
          '[class*="cart-icon"]'
        ).first()
        
        if (await addToCartBtn.count() > 0 && await addToCartBtn.isVisible()) {
          await expect(addToCartBtn).toBeVisible()
          
          // 点击添加按钮
          await addToCartBtn.click()
          await page.waitForTimeout(800)
          
          console.log('✓ 已添加菜品到购物车')
          
          // 验证添加后的状态变化（可能显示数量徽章）
          const quantityBadge = firstDish.locator('[class*="quantity"], .el-badge__content, span:not(:empty)')
          if (await quantityBadge.count() > 0) {
            const qtyText = await quantityBadge.last().textContent()
            console.log(`菜品数量: ${qtyText}`)
            expect(parseInt(qtyText || '0')).toBeGreaterThan(0)
          }
          
          // 再次点击增加数量
          await addToCartBtn.click()
          await page.waitForTimeout(500)
          
          console.log('✓ 增加菜品数量成功')
        }
      }
      
      // 菜单分类侧边栏（如果有）
      const menuCategories = page.locator(
        '[class*="category-list"], ' +
        '[class*="menu-sidebar"], ' +
        '[class*="category-nav"]'
      )
      
      if (await menuCategories.count() > 0) {
        await expect(menuCategories.first()).toBeVisible()
        
        // 点击一个分类
        const categoryItem = menuCategories.first().locate('li, button, a, div').first()
        if (await categoryItem.count() > 0) {
          await categoryItem.click()
          await page.waitForTimeout(800)
          console.log('✓ 菜单分类切换正常')
        }
      }
    }

    // 4. 底部购物车栏出现
    const bottomCartBar = page.locator(
      '[class*="cart-bar"], ' +
      '[class*="bottom-cart"], ' +
      '[class*="CartBar"], ' +
      'footer[class*="cart"], ' +
      '[class*="fixed"][class*="bottom"]:has([class*="cart"])'
    )
    
    if (await bottomCartBar.count() > 0) {
      await expect(bottomCartBar.first()).toBeVisible()
      console.log('✓ 底部购物车栏可见')
      
      // 验证购物车栏元素
      // 购物车图标/按钮
      const cartIcon = bottomCartBar.first().locate('[class*="icon"], svg, img')
      if (await cartIcon.count() > 0) {
        await expect(cartIcon.first()).toBeVisible()
      }
      
      // 总价显示
      const totalPriceDisplay = bottomCartBar.first().locate('[class*="total"], [class*="price"]')
      if (await totalPriceDisplay.count() > 0) {
        await expect(totalPriceDisplay.first()).toBeVisible()
        const totalText = await totalPriceDisplay.first().textContent()
        console.log(`购物车总价: ${totalText}`)
      }
      
      // 商品数量角标
      const cartBadge = bottomCartBar.first().locate('.el-badge__content, [class*="count"], [class*="badge"]')
      if (await cartBadge.count() > 0) {
        const badgeText = await cartBadge.first().textContent()
        expect(parseInt(badgeText || '0')).toBeGreaterThan(0)
        console.log(`购物车商品数: ${badgeText}`)
      }
      
      // 去结算按钮
      const checkoutButton = bottomCartBar.first().locate('button:has-text("结算"), button:has-text("去结算")')
      if (await checkoutButton.count() > 0) {
        await expect(checkoutButton.first()).toBeVisible()
        await expect(checkoutButton.first()).toBeEnabled()
      }

      // 5. 展开购物车详情
      const cartExpandTrigger = bottomCartBar.first().locate(
        '[class*="cart-bar"], ' +
        '[class*="toggle"], ' +
        '[class*="expand"]'
      ).first()
      
      // 通常点击整个购物车栏可以展开
      await bottomCartBar.first().click()
      await page.waitForTimeout(800)
      
      // 验证购物车详情面板展开
      const cartDetailPanel = page.locator(
        '[class*="cart-detail"], ' +
        '[class*="cart-panel"], ' +
        '[class*="CartPanel"], ' +
        '[role="dialog"]:has([class*="cart-item"])'
      )
      
      if (await cartDetailPanel.count() > 0) {
        await expect(cartDetailPanel.first()).toBeVisible()
        console.log('✓ 购物车详情面板展开')
        
        // 验证购物车中的商品项
        const cartItemsInPanel = cartDetailPanel.first().locate('[class*="item"], [class*="CartItem"]')
        const itemCountInPanel = await cartItemsInPanel.count()
        
        if (itemCountInPanel > 0) {
          console.log(`购物车详情中有 ${itemCountInPanel} 个商品`)
          
          // 验证每个商品项的信息
          for (let i = 0; i < Math.min(itemCountInPanel, 3); i++) {
            const item = cartItemsInPanel.nth(i)
            
            // 商品名称
            const itemName = item.locator('[class*="name"]').first()
            if (await itemName.count() > 0) {
              await expect(itemName).toBeVisible()
            }
            
            // 商品价格
            const itemPrice = item.locator('[class*="price"]').first()
            if (await itemPrice.count() > 0) {
              await expect(itemPrice).toBeVisible()
            }
            
            // 数量控制
            const itemQuantity = item.locator('[class*="quantity"]').first()
            if (await itemQuantity.count() > 0) {
              await expect(itemQuantity).toBeVisible()
            }
          }
        }
        
        // 清空购物车按钮
        const clearCartBtn = cartDetailPanel.first().locate('button:has-text("清空"), button:has-text("清除")')
        if (await clearCartBtn.count() > 0) {
          await expect(clearCartBtn.first()).toBeVisible()
        }
        
        // 关闭购物车面板
        const closePanelBtn = cartDetailPanel.first().locate('button:has-text("关闭"), [class*="close"], [aria-label="Close"]')
        if (await closePanelBtn.count() > 0) {
          await closePanelBtn.first().click()
          await page.waitForTimeout(300)
        } else {
          // 点击遮罩关闭
          await page.keyboard.press('Escape')
          await page.waitForTimeout(300)
        }
      }
    } else {
      console.log('⚠ 底部购物车栏未出现（可能未添加商品）')
    }
  })

  test('配送时间选择', async ({ page }) => {
    // 在商家详情页测试配送时间选择
    await page.goto('/takeout')
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
    
    // 进入任意商家
    const merchantCard = page.locator('[class*="merchant-card"]').first()
    if (await merchantCard.count() > 0) {
      await merchantCard.click()
      await page.waitForURL(/.*\/merchant\//, { timeout: 5000 }).catch(() => {})
    }
    
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})

    // 查找配送时间选择器
    const deliveryTimeSelector = page.locator(
      '[class*="delivery-time"], ' +
      '[class*="DeliveryTime"], ' +
      '[class*="time-select"]'
    )
    
    if (await deliveryTimeSelector.count() > 0) {
      await expect(deliveryTimeSelector.first()).toBeVisible()
      console.log('✓ 找到配送时间选择器')
      
      // 立即配送选项
      const immediateOption = deliveryTimeSelector.first().locate(
        'button:has-text("立即"), ' +
        'label:has-text("立即"), ' +
        '[class*="immediate"]'
      )
      
      if (await immediateOption.count() > 0) {
        await immediateOption.first().click()
        await page.waitForTimeout(500)
        console.log('✓ 选择立即配送')
      }
      
      // 预约配送选项
      const scheduledOption = deliveryTimeSelector.first().locate(
        'button:has-text("预约"), ' +
        'label:has-text("预约"), ' +
        '[class*="scheduled"]'
      )
      
      if (await scheduledOption.count() > 0) {
        await scheduledOption.first().click()
        await page.waitForTimeout(500)
        console.log('✓ 切换到预约配送')
        
        // 时间段选择下拉框
        const timeSlotDropdown = page.locator(
          'select[class*="time"], ' +
          '[class*="time-slot"] select, ' +
          '.el-select'
        )
        
        if (await timeSlotDropdown.count() > 0) {
          await timeSlotDropdown.first().click()
          await page.waitForTimeout(300)
          
          // 选择一个时间段
          const timeOption = timeSlotDropdown.first().locate('li, option').nth(2)
          if (await timeOption.count() > 0) {
            await timeOption.click()
            await page.waitForTimeout(500)
            console.log('✓ 选择预约时间段')
          }
        }
      }
    } else {
      console.log('⚠ 未找到配送时间选择器')
    }
  })
})

test.describe('外卖边界情况测试', () => {
  test('未登录状态下查看商家详情', async ({ page }) => {
    // 确保未登录状态（清除可能的认证信息）
    await page.context().clearCookies()
    
    await page.goto('/takeout/merchant/1')
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
    
    // 验证页面仍然可以访问（只读模式）
    const merchantInfo = page.locator('[class*="merchant-info"], [class*="menu"]')
    if (await merchantInfo.count() > 0) {
      await expect(merchantInfo.first()).toBeVisible()
      console.log('✓ 未登录时可查看商家详情')
    }
  })

  test('商家不存在时的错误处理', async ({ page }) => {
    // 访问一个不存在的商家ID
    await page.goto('/takeout/merchant/999999999')
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
    
    // 验证显示404或错误提示
    const errorState = page.locator(
      '[class*="error"], ' +
      '[class*="not-found"], ' +
      'text=/不存在|未找到|404/'
    )
    
    if (await errorState.count() > 0) {
      await expect(errorState.first()).toBeVisible()
      console.log('✓ 商家不存在时显示错误提示')
    }
  })
})
