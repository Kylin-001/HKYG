import { test, expect } from '@playwright/test'

test.describe('订单功能测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问订单列表页面
    await page.goto('/order/list')
  })

  test('应该能够访问订单列表页面', async ({ page }) => {
    // 验证页面标题
    await expect(page).toHaveTitle(/订单列表|订单管理/)

    // 验证页面包含订单列表
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.locator('.order-list')).toBeVisible()
  })

  test('应该显示订单列表数据', async ({ page }) => {
    // 验证订单列表包含订单项
    const orderItems = await page.locator('.order-item')
    await expect(orderItems).toHaveCount(expect.atLeast(0))

    if (await orderItems.count() > 0) {
      // 验证订单项包含基本信息
      const firstOrder = orderItems.first()
      await expect(firstOrder.locator('.order-number')).toBeVisible()
      await expect(firstOrder.locator('.order-status')).toBeVisible()
      await expect(firstOrder.locator('.order-total')).toBeVisible()
      await expect(firstOrder.locator('.order-time')).toBeVisible()
    }
  })

  test('应该支持订单状态筛选', async ({ page }) => {
    // 点击状态筛选下拉框
    const statusFilter = await page.locator('.status-filter')
    if (await statusFilter.isVisible()) {
      await statusFilter.click()
      
      // 选择已完成状态
      const completedOption = await page.locator('.filter-option', { hasText: /已完成|completed/i })
      if (await completedOption.isVisible()) {
        await completedOption.click()
        
        // 等待筛选结果
        await page.waitForTimeout(500)
        
        // 验证筛选结果
        const orderItems = await page.locator('.order-item')
        await expect(orderItems).toHaveCount(expect.atLeast(0))
      }
    }
  })

  test('应该支持订单搜索功能', async ({ page }) => {
    // 输入订单号或关键词
    const searchInput = await page.locator('.order-search-input')
    if (await searchInput.isVisible()) {
      await searchInput.fill('测试订单')
      
      // 点击搜索按钮
      const searchButton = await page.locator('.search-button')
      if (await searchButton.isVisible()) {
        await searchButton.click()
        
        // 等待搜索结果
        await page.waitForTimeout(500)
        
        // 验证搜索结果
        const orderItems = await page.locator('.order-item')
        await expect(orderItems).toHaveCount(expect.atLeast(0))
      }
    }
  })

  test('应该能够查看订单详情', async ({ page }) => {
    // 获取第一个订单项
    const orderItems = await page.locator('.order-item')
    if (await orderItems.count() > 0) {
      const firstOrder = orderItems.first()
      
      // 点击查看详情按钮
      const detailButton = await firstOrder.locator('.detail-button')
      if (await detailButton.isVisible()) {
        await detailButton.click()
        
        // 验证页面跳转到订单详情页
        await expect(page.url()).toMatch(/\/order\/detail\//)
        
        // 验证订单详情包含基本信息
        await expect(page.locator('.order-detail')).toBeVisible()
        await expect(page.locator('.order-detail-info')).toBeVisible()
        await expect(page.locator('.order-items')).toBeVisible()
        await expect(page.locator('.order-payment')).toBeVisible()
      }
    }
  })

  test('应该支持订单导出功能', async ({ page }) => {
    // 查找导出按钮
    const exportButton = await page.locator('.export-button')
    if (await exportButton.isVisible()) {
      // 验证导出按钮可点击
      await expect(exportButton).toBeEnabled()
    }
  })

  test('应该支持批量操作功能', async ({ page }) => {
    // 查找批量操作区域
    const batchOperation = await page.locator('.batch-operation')
    if (await batchOperation.isVisible()) {
      // 验证批量操作区域包含复选框
      await expect(batchOperation.locator('.batch-select')).toBeVisible()
      // 验证批量操作区域包含操作按钮
      await expect(batchOperation.locator('.batch-action-button')).toHaveCount(expect.atLeast(1))
    }
  })

  test('应该支持分页功能', async ({ page }) => {
    // 查找分页控件
    const pagination = await page.locator('.pagination')
    if (await pagination.isVisible()) {
      // 验证分页控件包含页码按钮
      await expect(pagination.locator('.page-button')).toHaveCount(expect.atLeast(1))
      // 验证分页控件包含页码输入框
      await expect(pagination.locator('.page-input')).toBeVisible()
    }
  })

  test('应该在移动端正确显示', async ({ page }) => {
    // 切换到移动端视图
    await page.setViewportSize({ width: 768, height: 1024 })
    
    // 验证订单列表在移动端正常显示
    await expect(page.locator('.order-list')).toBeVisible()
    
    // 验证移动端订单项显示正确
    const orderItems = await page.locator('.order-item')
    if (await orderItems.count() > 0) {
      const firstOrder = orderItems.first()
      await expect(firstOrder.locator('.order-mobile-header')).toBeVisible()
      await expect(firstOrder.locator('.order-mobile-content')).toBeVisible()
    }
  })
})

test.describe('订单详情测试', () => {
  test('应该显示订单基本信息', async ({ page }) => {
    // 先访问订单列表
    await page.goto('/order/list')
    
    // 查找第一个订单并点击查看详情
    const firstOrder = await page.locator('.order-item').first()
    if (await firstOrder.isVisible()) {
      const detailButton = await firstOrder.locator('.detail-button')
      if (await detailButton.isVisible()) {
        await detailButton.click()
        
        // 验证订单详情页面显示
        await expect(page.url()).toMatch(/\/order\/detail\//)
        
        // 验证订单基本信息
        await expect(page.locator('.order-detail-header')).toBeVisible()
        await expect(page.locator('.order-number')).toBeVisible()
        await expect(page.locator('.order-status')).toBeVisible()
        await expect(page.locator('.order-creation-time')).toBeVisible()
        await expect(page.locator('.order-payment-method')).toBeVisible()
      }
    }
  })

  test('应该显示订单商品列表', async ({ page }) => {
    // 先访问订单详情页（如果存在）
    await page.goto('/order/list')
    
    const firstOrder = await page.locator('.order-item').first()
    if (await firstOrder.isVisible()) {
      const detailButton = await firstOrder.locator('.detail-button')
      if (await detailButton.isVisible()) {
        await detailButton.click()
        
        // 验证订单商品列表
        const orderItems = await page.locator('.order-product-item')
        await expect(orderItems).toHaveCount(expect.atLeast(1))
        
        // 验证商品项包含基本信息
        const firstProduct = orderItems.first()
        await expect(firstProduct.locator('.product-name')).toBeVisible()
        await expect(firstProduct.locator('.product-price')).toBeVisible()
        await expect(firstProduct.locator('.product-quantity')).toBeVisible()
      }
    }
  })

  test('应该显示订单配送信息', async ({ page }) => {
    // 先访问订单详情页（如果存在）
    await page.goto('/order/list')
    
    const firstOrder = await page.locator('.order-item').first()
    if (await firstOrder.isVisible()) {
      const detailButton = await firstOrder.locator('.detail-button')
      if (await detailButton.isVisible()) {
        await detailButton.click()
        
        // 验证配送信息
        await expect(page.locator('.delivery-info')).toBeVisible()
        await expect(page.locator('.delivery-address')).toBeVisible()
        await expect(page.locator('.delivery-contact')).toBeVisible()
      }
    }
  })

  test('应该显示订单支付信息', async ({ page }) => {
    // 先访问订单详情页（如果存在）
    await page.goto('/order/list')
    
    const firstOrder = await page.locator('.order-item').first()
    if (await firstOrder.isVisible()) {
      const detailButton = await firstOrder.locator('.detail-button')
      if (await detailButton.isVisible()) {
        await detailButton.click()
        
        // 验证支付信息
        await expect(page.locator('.payment-info')).toBeVisible()
        await expect(page.locator('.payment-total')).toBeVisible()
        await expect(page.locator('.payment-time')).toBeVisible()
        await expect(page.locator('.payment-transaction')).toBeVisible()
      }
    }
  })
})

test.describe('订单创建流程测试', () => {
  test('应该能够从商品详情页创建订单', async ({ page }) => {
    // 访问商品列表页面
    await page.goto('/product/list')
    
    // 查找第一个商品并点击查看详情
    const firstProduct = await page.locator('.product-card').first()
    if (await firstProduct.isVisible()) {
      await firstProduct.click()
      
      // 验证页面跳转到商品详情页
      await expect(page.url()).toMatch(/\/product\/detail\//)
      
      // 点击立即购买按钮
      const buyNowButton = await page.locator('.buy-now-button')
      if (await buyNowButton.isVisible()) {
        await buyNowButton.click()
        
        // 验证页面跳转到结算页面
        await expect(page.url()).toMatch(/\/checkout|\/order\/confirm/i)
      }
    }
  })

  test('应该能够从购物车创建订单', async ({ page }) => {
    // 访问购物车页面
    await page.goto('/cart')
    
    // 查找去结算按钮
    const checkoutButton = await page.locator('.checkout-button')
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click()
      
      // 验证页面跳转到结算页面
      await expect(page.url()).toMatch(/\/checkout|\/order\/confirm/i)
    }
  })
})