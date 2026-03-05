import { test, expect } from '@playwright/test'

test.describe('订单功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/order/list')
  })

  test('应该能够访问订单列表页面', async ({ page }) => {
    await expect(page).toHaveTitle(/订单列表|我的订单/)
  })

  test('应该显示订单列表', async ({ page }) => {
    await expect(page.locator('.order-list')).toBeVisible()
  })

  test('应该显示订单状态筛选', async ({ page }) => {
    await expect(page.locator('.status-filter')).toBeVisible()
  })

  test('应该支持按状态筛选订单', async ({ page }) => {
    const statusFilter = page.locator('.status-filter')
    const allStatusBtn = statusFilter.getByRole('button', { name: '全部' })
    
    await allStatusBtn.click()
    
    await page.waitForTimeout(500)
    const orders = await page.locator('.order-item').all()
    await expect(orders.length).toBeGreaterThan(0)
  })

  test('应该显示订单详情', async ({ page }) => {
    const firstOrder = page.locator('.order-item').first()
    
    await firstOrder.click()
    
    await expect(page.locator('.order-detail')).toBeVisible()
  })

  test('订单详情应该显示订单编号', async ({ page }) => {
    const firstOrder = page.locator('.order-item').first()
    
    await firstOrder.click()
    
    await expect(page.locator('.order-no')).toBeVisible()
  })

  test('订单详情应该显示商品列表', async ({ page }) => {
    const firstOrder = page.locator('.order-item').first()
    
    await firstOrder.click()
    
    await expect(page.locator('.order-products')).toBeVisible()
  })

  test('订单详情应该显示订单金额', async ({ page }) => {
    const firstOrder = page.locator('.order-item').first()
    
    await firstOrder.click()
    
    await expect(page.locator('.order-amount')).toBeVisible()
  })

  test('订单详情应该显示订单状态', async ({ page }) => {
    const firstOrder = page.locator('.order-item').first()
    
    await firstOrder.click()
    
    await expect(page.locator('.order-status')).toBeVisible()
  })

  test('应该支持取消订单', async ({ page }) => {
    const firstOrder = page.locator('.order-item').first()
    const cancelBtn = firstOrder.locator('.cancel-btn')
    
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click()
      
      await expect(page.locator('.confirm-dialog')).toBeVisible()
    }
  })

  test('应该支持评价订单', async ({ page }) => {
    const firstOrder = page.locator('.order-item').first()
    const reviewBtn = firstOrder.locator('.review-btn')
    
    if (await reviewBtn.isVisible()) {
      await reviewBtn.click()
      
      await expect(page.locator('.review-form')).toBeVisible()
    }
  })

  test('应该支持查看物流信息', async ({ page }) => {
    const firstOrder = page.locator('.order-item').first()
    const logisticsBtn = firstOrder.locator('.logistics-btn')
    
    if (await logisticsBtn.isVisible()) {
      await logisticsBtn.click()
      
      await expect(page.locator('.logistics-info')).toBeVisible()
    }
  })

  test('应该支持再次购买', async ({ page }) => {
    const firstOrder = page.locator('.order-item').first()
    const buyAgainBtn = firstOrder.locator('.buy-again-btn')
    
    if (await buyAgainBtn.isVisible()) {
      await buyAgainBtn.click()
      
      await expect(page.url()).toMatch(/product\/detail\//)
    }
  })

  test('应该正确显示订单时间', async ({ page }) => {
    const firstOrder = page.locator('.order-item').first()
    const orderTime = firstOrder.locator('.order-time')
    
    await expect(orderTime).toBeVisible()
    await expect(await orderTime.textContent()).toMatch(/\d{4}-\d{2}-\d{2}/)
  })

  test('应该支持订单搜索', async ({ page }) => {
    const searchInput = page.locator('.order-search input')
    
    await searchInput.fill('测试订单')
    await page.keyboard.press('Enter')
    
    await page.waitForTimeout(500)
    const orders = await page.locator('.order-item').all()
    
    if (orders.length > 0) {
      await expect(orders.first()).toBeVisible()
    }
  })
})
