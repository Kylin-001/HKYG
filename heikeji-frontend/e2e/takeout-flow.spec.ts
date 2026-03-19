import { test, expect } from '@playwright/test'

test.describe('外卖服务完整流程', () => {
  test('应该能够浏览外卖商家', async ({ page }) => {
    await page.goto('/app/takeout/merchant')

    await expect(page).toHaveTitle(/外卖商家|商家列表/)
    await expect(page.locator('.merchant-list')).toBeVisible()

    const firstMerchant = page.locator('.merchant-card').first()
    await firstMerchant.click()

    await expect(page).toHaveURL(/takeout\/merchant\/detail\//)
    await expect(page.locator('.merchant-detail')).toBeVisible()
  })

  test('应该能够浏览商家菜单', async ({ page }) => {
    await page.goto('/app/takeout/merchant/detail/1')

    await expect(page.locator('.merchant-detail')).toBeVisible()
    await expect(page.locator('.menu-list')).toBeVisible()

    const firstMenu = page.locator('.menu-item').first()
    await firstMenu.click()

    await expect(page.locator('.menu-detail')).toBeVisible()
  })

  test('应该能够添加外卖商品到购物车', async ({ page }) => {
    await page.goto('/app/takeout/merchant/detail/1')

    await expect(page.locator('.menu-list')).toBeVisible()

    const firstMenu = page.locator('.menu-item').first()
    const addToCartBtn = firstMenu.locator('.add-to-cart-btn')
    await addToCartBtn.click()

    await expect(page.locator('.toast-success')).toBeVisible()
    await expect(page.locator('.toast-success')).toContainText('已添加到购物车')
  })

  test('应该能够选择外卖配送方式', async ({ page }) => {
    await page.goto('/app/takeout/cart')

    await expect(page.locator('.takeout-cart')).toBeVisible()

    const lockerOption = page.locator('.delivery-locker')
    await lockerOption.click()

    await expect(page.locator('.locker-list')).toBeVisible()

    const firstLocker = page.locator('.locker-item').first()
    await firstLocker.click()

    await expect(page.locator('.selected-locker')).toBeVisible()
  })

  test('应该能够选择特殊地点配送', async ({ page }) => {
    await page.goto('/app/takeout/cart')

    await expect(page.locator('.takeout-cart')).toBeVisible()

    const specialOption = page.locator('.delivery-special')
    await specialOption.click()

    await expect(page.locator('.special-location-form')).toBeVisible()

    await page.fill('input[name="location"]', '图书馆门口')
    await page.fill('input[name="contactPhone"]', '13800138000')

    const submitBtn = page.locator('.submit-location-btn')
    await submitBtn.click()

    await expect(page.locator('.toast-success')).toBeVisible()
  })

  test('应该能够选择送到寝室配送', async ({ page }) => {
    await page.goto('/app/takeout/cart')

    await expect(page.locator('.takeout-cart')).toBeVisible()

    const dormitoryOption = page.locator('.delivery-dormitory')
    await dormitoryOption.click()

    await expect(page.locator('.dormitory-list')).toBeVisible()

    const firstDormitory = page.locator('.dormitory-item').first()
    await firstDormitory.click()

    await expect(page.locator('.selected-dormitory')).toBeVisible()
  })

  test('应该能够完成外卖订单支付', async ({ page }) => {
    await page.goto('/app/takeout/payment')

    await expect(page.locator('.takeout-payment')).toBeVisible()

    const wechatPayBtn = page.locator('.wechat-pay-btn')
    await wechatPayBtn.click()

    await expect(page.locator('.payment-qrcode')).toBeVisible()

    await page.waitForTimeout(3000)

    await page.goto('/app/takeout/order/list')

    await expect(page.locator('.order-list')).toBeVisible()
    const lastOrder = page.locator('.order-item').first()
    await expect(lastOrder.locator('.order-status')).toContainText('待配送')
  })

  test('应该能够查看外卖订单状态', async ({ page }) => {
    await page.goto('/app/takeout/order/list')

    await expect(page.locator('.order-list')).toBeVisible()

    const firstOrder = page.locator('.order-item').first()
    await firstOrder.click()

    await expect(page.locator('.order-detail')).toBeVisible()
    await expect(page.locator('.order-status')).toBeVisible()
    await expect(page.locator('.delivery-info')).toBeVisible()
  })

  test('应该能够评价外卖订单', async ({ page }) => {
    await page.goto('/app/takeout/order/list')

    const firstOrder = page.locator('.order-item').first()
    const reviewBtn = firstOrder.locator('.review-btn')

    if (await reviewBtn.isVisible()) {
      await reviewBtn.click()

      await expect(page.locator('.review-form')).toBeVisible()

      await page.fill('textarea[name="content"]', '外卖很好吃，配送很快')
      await page.click('.rating-star[data-rating="5"]')

      const submitBtn = page.locator('.submit-review-btn')
      await submitBtn.click()

      await expect(page.locator('.toast-success')).toBeVisible()
      await expect(page.locator('.toast-success')).toContainText('评价成功')
    }
  })

  test('应该能够查看外卖柜取餐状态', async ({ page }) => {
    await page.goto('/app/takeout/locker')

    await expect(page.locator('.locker-status')).toBeVisible()

    const firstLocker = page.locator('.locker-item').first()
    await firstLocker.click()

    await expect(page.locator('.locker-detail')).toBeVisible()
    await expect(page.locator('.pickup-code')).toBeVisible()
  })

  test('应该能够完成外卖柜取餐', async ({ page }) => {
    await page.goto('/app/takeout/locker/detail/1')

    await expect(page.locator('.locker-detail')).toBeVisible()

    const pickupBtn = page.locator('.pickup-btn')
    await pickupBtn.click()

    await expect(page.locator('.pickup-code-input')).toBeVisible()

    await page.fill('input[name="pickupCode"]', '123456')

    const confirmBtn = page.locator('.confirm-pickup-btn')
    await confirmBtn.click()

    await expect(page.locator('.toast-success')).toBeVisible()
    await expect(page.locator('.toast-success')).toContainText('取餐成功')
  })
})
