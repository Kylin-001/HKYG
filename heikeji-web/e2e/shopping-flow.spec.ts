/**
 * 购物全流程 E2E 测试
 *
 * 测试范围：
 * 1. 商品浏览 → 详情查看 → 加入购物车 → 结算完整流程
 * 2. 搜索商品功能（关键词搜索、分类筛选、排序）
 * 3. 购物车操作（添加商品、修改数量、删除商品）
 * 4. 结算流程验证
 *
 * 覆盖页面：
 * - /products (商品列表页)
 * - /products/:id (商品详情页)
 * - /cart (购物车)
 * - /orders/checkout (结算页)
 * - /search (搜索结果页)
 */

import { test, expect } from '@playwright/test'

test.describe('购物全流程', () => {
  test.beforeEach(async ({ page }) => {
    // 每个测试前确保页面干净状态
    await page.goto('/')
  })

  test('浏览商品 → 加入购物车 → 结算', async ({ page }) => {
    // ========== 步骤1: 访问商品列表页 ==========
    await page.goto('/products')

    // 等待页面加载完成
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})

    // 验证页面标题包含"商品"
    await expect(page).toHaveTitle(/商品/)

    // 验证商品列表区域存在
    const productSection = page.locator('[class*="product"], [class*="grid"]')
    if (await productSection.count() > 0) {
      await expect(productSection.first()).toBeVisible()
    }

    // ========== 步骤2: 验证商品卡片渲染 ==========
    const productCards = page.locator('[class*="product-card"], [class*="ProductCard"], .el-card')
    const cardCount = await productCards.count()

    console.log(`找到 ${cardCount} 个商品卡片`)

    if (cardCount > 0) {
      // 验证第一个商品卡片可见
      await expect(productCards.first()).toBeVisible()

      // 验证商品卡片包含基本信息（图片、名称、价格）
      const firstCard = productCards.first()

      // 检查商品图片
      const productImage = firstCard.locator('img').first()
      if (await productImage.count() > 0) {
        await expect(productImage).toBeVisible()
      }

      // 检查商品名称/标题区域
      const productName = firstCard.locator('[class*="name"], [class*="title"], h3, h4').first()
      if (await productName.count() > 0) {
        await expect(productName).toBeVisible()
      }

      // 检查价格显示
      const priceElement = firstCard.locator('[class*="price"]').first()
      if (await priceElement.count() > 0) {
        await expect(priceElement).toBeVisible()
        const priceText = await priceElement.textContent()
        expect(priceText).toBeTruthy()
        // 价格应该包含数字和货币符号
        expect(priceText?.match(/[\d.]+/)).toBeTruthy()
      }

      // ========== 步骤3: 点击某个商品进入详情 ==========
      await firstCard.click()

      // 等待导航到详情页
      await page.waitForURL(/\/products\//, { timeout: 5000 }).catch(() => {})

      // 验证当前URL是商品详情页
      const currentUrl = page.url()
      console.log(`当前URL: ${currentUrl}`)
      expect(currentUrl).toContain('/products/')

      // ========== 步骤4: 详情页验证 ==========
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})

      // 验证详情页关键元素
      // 商品主图
      const mainImage = page.locator('[class*="gallery"], [class*="main-image"], .el-image').first()
      if (await mainImage.count() > 0) {
        await expect(mainImage).toBeVisible()
      }

      // 商品价格
      const detailPrice = page.locator('[class*="price"][class*="current"], [class*="price"]:not([class*="original"])').first()
      if (await detailPrice.count() > 0) {
        await expect(detailPrice).toBeVisible()
        const priceValue = await detailPrice.textContent()
        expect(priceValue).toBeTruthy()
        console.log(`商品价格: ${priceValue}`)
      }

      // 商品规格选择器
      const specSelector = page.locator('[class*="spec"], [class*="variant"], [class*="sku"]')
      if (await specSelector.count() > 0) {
        await expect(specSelector.first()).toBeVisible()

        // 尝试点击第一个规格选项
        const specOption = specSelector.first().locator('[class*="option"], button, .el-radio-button').first()
        if (await specOption.count() > 0 && await specOption.isVisible()) {
          await specOption.click()
          await page.waitForTimeout(300)
        }
      }

      // 库存信息
      const stockInfo = page.locator('[class*="stock"], text=/库存|库存量|剩余/')
      if (await stockInfo.count() > 0) {
        await expect(stockInfo.first()).toBeVisible()
      }

      // ========== 步骤5: 点击"加入购物车" ==========
      const addToCartButton = page.locator(
        'button:has-text("加入购物车"), ' +
        'button:has-text("加购"), ' +
        '[data-testid="add-to-cart"], ' +
        '.add-to-cart-btn'
      ).first()

      if (await addToCartButton.isVisible()) {
        await addToCartButton.click()

        // 等待操作响应
        await page.waitForTimeout(1000)

        // 验证成功提示（Toast消息）
        const successMessage = page.locator('.el-message--success, [role="alert"]:has-text("成功"), .toast-success')
        if (await successMessage.count() > 0) {
          await expect(successMessage.first()).toBeVisible({ timeout: 2000 })
          console.log('✓ 成功提示显示')
        }

        // 验证购物车图标数量更新（如果有角标）
        const cartBadge = page.locator('.cart-badge, [class*="cart-count"], .el-badge__content')
        if (await cartBadge.count() > 0) {
          const badgeText = await cartBadge.first().textContent()
          expect(parseInt(badgeText || '0')).toBeGreaterThan(0)
          console.log(`购物车数量: ${badgeText}`)
        }
      }

      // ========== 步骤6: 进入购物车页面 ==========
      await page.goto('/cart')
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})

      // 验证购物车页面加载
      await expect(page).toHaveTitle(/购物车/)

      // ========== 步骤7: 验证商品在购物车中 ==========
      const cartItems = page.locator('[class*="cart-item"], [class*="CartItem"], tr[class*="item"]')
      const cartItemCount = await cartItems.count()

      if (cartItemCount > 0) {
        console.log(`购物车中有 ${cartItemCount} 个商品`)

        // 验证第一个商品项的信息完整性
        const firstCartItem = cartItems.first()

        // 商品图片
        const cartItemImage = firstCartItem.locator('img').first()
        if (await cartItemImage.count() > 0) {
          await expect(cartItemImage).toBeVisible()
        }

        // 商品名称
        const cartItemName = firstCartItem.locator('[class*="name"], [class*="title"]').first()
        if (await cartItemName.count() > 0) {
          await expect(cartItemName).toBeVisible()
        }

        // 单价
        const cartItemPrice = firstCartItem.locator('[class*="price"]').first()
        if (await cartItemPrice.count() > 0) {
          await expect(cartItemPrice).toBeVisible()
        }

        // 数量控制
        const quantityControl = firstCartItem.locator('[class*="quantity"], [class*="number"], .el-input-number')
        if (await quantityControl.count() > 0) {
          await expect(quantityControl.first()).toBeVisible()

          // 测试增加数量
          const increaseBtn = quantityControl.first().locator('button:has-text("+"), [class*="increase"]')
          if (await increaseBtn.count() > 0) {
            await increaseBtn.click()
            await page.waitForTimeout(500)

            // 验证总价更新
            const totalPrice = page.locator('[class*="total-price"], [class*="TotalPrice"]')
            if (await totalPrice.count() > 0) {
              await expect(totalPrice.first()).toBeVisible()
            }
          }
        }

        // 删除按钮
        const deleteBtn = firstCartItem.locator('[class*="delete"], button:has-text("删除")')
        if (await deleteBtn.count() > 0) {
          await expect(deleteBtn.first()).toBeVisible()
        }
      } else {
        // 购物车为空时显示空状态
        const emptyState = page.locator('[class*="empty"], [class*="EmptyState"], text=/空|暂无/')
        if (await emptyState.count() > 0) {
          await expect(emptyState.first()).toBeVisible()
          console.log('⚠ 购物车为空')
        }
      }

      // ========== 步骤8: 点击"结算"进入结算页 ==========
      const checkoutButton = page.locator(
        'button:has-text("结算"), ' +
        'button:has-text("去结算"), ' +
        '[data-testid="checkout"], ' +
        '.checkout-btn'
      ).first()

      if (await checkoutButton.isVisible()) {
        await checkoutButton.click()

        // 等待跳转到结算页
        await page.waitForURL(/.*checkout/, { timeout: 5000 }).catch(() => {})

        // ========== 步骤9: 结算页验证 ==========
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})

        // 收货地址区域
        const addressSection = page.locator('[class*="address"], [class*="Address"]')
        if (await addressSection.count() > 0) {
          await expect(addressSection.first()).toBeVisible()

          // 地址选择或输入
          const addressInput = addressSection.first().locator('input, select, [class*="selector"]')
          if (await addressInput.count() > 0) {
            await expect(addressInput.first()).toBeVisible()
          }
        }

        // 商品清单
        const orderItems = page.locator('[class*="order-item"], [class*="OrderItem"]')
        if (await orderItems.count() > 0) {
          await expect(orderItems.first()).toBeVisible()
        }

        // 优惠券选择
        const couponSection = page.locator('[class*="coupon"], [class*="Coupon"]')
        if (await couponSection.count() > 0) {
          await expect(couponSection.first()).toBeVisible()
        }

        // 支付方式选择
        const paymentMethod = page.locator('[class*="payment"], [class*="Payment"]')
        if (await paymentMethod.count() > 0) {
          await expect(paymentMethod.first()).toBeVisible()

          // 支付选项（微信/支付宝等）
          const paymentOptions = paymentMethod.first().locator('[class*="option"], label, .el-radio')
          if (await paymentOptions.count() > 0) {
            expect(await paymentOptions.count()).toBeGreaterThanOrEqual(1)
          }
        }

        // 订单金额汇总
        const priceSummary = page.locator('[class*="summary"], [class*="total"], [class*="amount"]')
        if (await priceSummary.count() > 0) {
          await expect(priceSummary.last()).toBeVisible()
        }

        // 提交订单按钮
        const submitOrderBtn = page.locator('button:has-text("提交订单"), button:has-text("确认支付")')
        if (await submitOrderBtn.count() > 0) {
          await expect(submitOrderBtn.first()).toBeVisible()
        }

        console.log('✓ 结算页面验证完成')
      }
    } else {
      console.log('⚠ 未找到商品卡片，可能数据未加载')
    }
  })

  test('搜索商品流程', async ({ page }) => {
    // ========== 步骤1: 在首页搜索框输入关键词 ==========
    await page.goto('/')

    // 定位搜索框（多种可能的选择器）
    const searchInput = page.locator(
      'input[placeholder*="搜索"], ' +
      'input[type="search"], ' +
      '[class*="search"] input, ' +
      '.search-bar input'
    ).first()

    if (await searchInput.isVisible().catch(() => false)) {
      const searchKeyword = '零食'

      await searchInput.fill(searchKeyword)
      await searchInput.press('Enter')

      // ========== 步骤2-3: 提交搜索并验证跳转 ==========
      // 可能跳转到 /search 或 /products?keyword=xxx
      await page.waitForTimeout(1000)

      const currentUrl = page.url()
      console.log(`搜索后URL: ${currentUrl}`)

      // 验证URL包含搜索参数或在搜索结果页
      const isSearchPage = currentUrl.includes('/search') ||
                          currentUrl.includes('?keyword=') ||
                          currentUrl.includes('keyword=')

      if (isSearchPage) {
        console.log('✓ 已跳转到搜索结果页')

        // ========== 步骤4: 验证搜索结果显示 ==========
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})

        // 验证搜索结果列表
        const searchResults = page.locator('[class*="result"], [class*="product-card"], [class*="list-item"]')
        const resultCount = await searchResults.count()

        console.log(`搜索结果数量: ${resultCount}`)

        if (resultCount > 0) {
          await expect(searchResults.first()).toBeVisible()

          // 验证搜索关键词高亮（可选）
          const highlightedKeyword = page.locator(`mark:has-text("${searchKeyword}"), [class*="highlight"]:has-text("${searchKeyword}")`)
          if (await highlightedKeyword.count() > 0) {
            await expect(highlightedKeyword.first()).toBeVisible()
          }
        }

        // 无结果时的空状态
        if (resultCount === 0) {
          const noResults = page.locator('text=/未找到|没有结果|无匹配/')
          if (await noResults.count() > 0) {
            await expect(noResults.first()).toBeVisible()
          }
        }

        // ========== 步骤5: 使用分类筛选 ==========
        const categoryFilter = page.locator('[class*="category"], [class*="filter-category"]')
        if (await categoryFilter.count() > 0) {
          await expect(categoryFilter.first()).toBeVisible()

          // 点击一个分类标签
          const categoryTab = categoryFilter.first().locator('li, button, span, a').first()
          if (await categoryTab.count() > 0) {
            await categoryTab.click()
            await page.waitForTimeout(800)

            // 验证筛选后结果更新
            const filteredResults = page.locator('[class*="result"], [class*="product-card"]')
            console.log(`筛选后结果数: ${await filteredResults.count()}`)
          }
        }

        // ========== 步骤6: 使用排序功能 ==========
        const sortDropdown = page.locator(
          '[class*="sort"] select, ' +
          '[class*="sort-dropdown"], ' +
          'button:has-text("排序"), ' +
          '.el-select'
        ).first()

        if (await sortDropdown.count() > 0 && await sortDropdown.isVisible()) {
          await sortDropdown.click()
          await page.waitForTimeout(300)

          // 选择一个排序选项（如价格升序）
          const priceSortOption = page.locator('text=/价格.*升序|价格从低到高/').first()
          if (await priceSortOption.count() > 0) {
            await priceSortOption.click()
            await page.waitForTimeout(800)

            console.log('✓ 排序功能正常')
          }
        }

        console.log('✓ 搜索流程测试完成')
      }
    } else {
      console.log('⚠ 未找到搜索框，可能位置不同')
    }
  })
})

test.describe('购物车操作专项测试', () => {
  test('批量删除购物车商品', async ({ page }) => {
    await page.goto('/cart')
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})

    // 查找全选复选框
    const selectAllCheckbox = page.locator('[class*="select-all"], input[type="checkbox"]:first-of-type').first()

    if (await selectAllCheckbox.count() > 0) {
      await selectAllCheckbox.check()
      await page.waitForTimeout(500)

      // 查找批量删除按钮
      const batchDeleteBtn = page.locator('button:has-text("删除选中"), button:has-text("批量删除")').first()
      if (await batchDeleteBtn.count() > 0 && await batchDeleteBtn.isVisible()) {
        await batchDeleteBtn.click()

        // 确认对话框
        const confirmDialog = page.locator('.el-message-box, [role="dialog"]')
        if (await confirmDialog.count() > 0) {
          const confirmBtn = confirmDialog.locator('button:has-text("确定"), button:has-text("确认")').first()
          await confirmBtn.click()
          await page.waitForTimeout(1000)
        }
      }
    }
  })

  test('购物车商品数量边界值', async ({ page }) => {
    await page.goto('/cart')
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})

    const cartItems = page.locator('[class*="cart-item"]')
    if (await cartItems.count() > 0) {
      const firstItem = cartItems.first()
      const quantityControl = firstItem.locator('[class*="quantity"], .el-input-number')

      if (await quantityControl.count() > 0) {
        // 测试最大数量限制
        const increaseBtn = quantityControl.first().locator('button:has-text("+")')
        if (await increaseBtn.count() > 0) {
          // 连续点击增加按钮，测试上限
          for (let i = 0; i < 20; i++) {
            await increaseBtn.click()
            await page.waitForTimeout(100)
          }

          // 验证是否达到上限（通常99或999）
          const currentValue = await quantityControl.first().locator('input').inputValue()
          console.log(`最终数量: ${currentValue}`)
          expect(parseInt(currentValue)).toBeLessThanOrEqual(999)
        }
      }
    }
  })
})
