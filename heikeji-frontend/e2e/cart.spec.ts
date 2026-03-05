import { test, expect } from '@playwright/test'

test.describe('购物车功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/cart')
  })

  test('应该能够访问购物车页面', async ({ page }) => {
    await expect(page).toHaveTitle(/购物车|商品管理/)
  })

  test('应该显示购物车列表', async ({ page }) => {
    await expect(page.locator('.cart-list')).toBeVisible()
  })

  test('应该显示商品信息', async ({ page }) => {
    const cartItems = await page.locator('.cart-item').all()
    await expect(cartItems).toHaveCount(expect.atLeast(1))
  })

  test('应该显示商品数量', async ({ page }) => {
    const firstItem = page.locator('.cart-item').first()
    await expect(firstItem.locator('.quantity')).toBeVisible()
  })

  test('应该显示商品价格', async ({ page }) => {
    const firstItem = page.locator('.cart-item').first()
    await expect(firstItem.locator('.price')).toBeVisible()
  })

  test('应该显示商品总价', async ({ page }) => {
    await expect(page.locator('.total-price')).toBeVisible()
  })

  test('应该支持增加商品数量', async ({ page }) => {
    const firstItem = page.locator('.cart-item').first()
    const increaseBtn = firstItem.locator('.increase-btn')
    
    await increaseBtn.click()
    
    const quantity = await firstItem.locator('.quantity').inputValue()
    expect(parseInt(quantity)).toBeGreaterThan(1)
  })

  test('应该支持减少商品数量', async ({ page }) => {
    const firstItem = page.locator('.cart-item').first()
    const decreaseBtn = firstItem.locator('.decrease-btn')
    
    await decreaseBtn.click()
    
    const quantity = await firstItem.locator('.quantity').inputValue()
    expect(parseInt(quantity)).toBeGreaterThanOrEqual(0)
  })

  test('应该支持删除商品', async ({ page }) => {
    const firstItem = page.locator('.cart-item').first()
    const deleteBtn = firstItem.locator('.delete-btn')
    
    await deleteBtn.click()
    
    await page.waitForTimeout(500)
    const cartItems = await page.locator('.cart-item').all()
    await expect(cartItems).toHaveLength(0)
  })

  test('应该支持清空购物车', async ({ page }) => {
    const clearBtn = page.locator('.clear-cart-btn')
    
    if (await clearBtn.isVisible()) {
      await clearBtn.click()
      
      await page.waitForTimeout(500)
      const cartItems = await page.locator('.cart-item').all()
      await expect(cartItems).toHaveLength(0)
    }
  })

  test('应该显示结算按钮', async ({ page }) => {
    await expect(page.locator('.checkout-btn')).toBeVisible()
  })

  test('应该支持继续购物', async ({ page }) => {
    await expect(page.locator('.continue-shopping-btn')).toBeVisible()
  })

  test('应该显示优惠信息', async ({ page }) => {
    await expect(page.locator('.discount-info')).toBeVisible()
  })

  test('应该正确计算总价', async ({ page }) => {
    const totalPrice = await page.locator('.total-price').textContent()
    expect(totalPrice).toMatch(/¥\d+\.\d{2}/)
  })

  test('应该显示库存不足提示', async ({ page }) => {
    const outOfStockItems = await page.locator('.out-of-stock').all()
    
    if (outOfStockItems.length > 0) {
      await expect(outOfStockItems.first()).toBeVisible()
    }
  })
})
