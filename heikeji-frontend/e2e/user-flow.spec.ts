import { test, expect } from '@playwright/test'

test.describe('用户注册到下单完整流程', () => {
  test('应该能够完成用户注册流程', async ({ page }) => {
    await page.goto('/app/register')
    
    await expect(page).toHaveTitle(/用户注册|注册/)
    
    await page.fill('input[name="username"]', 'testuser123')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')
    await page.fill('input[name="phone"]', '13800138000')
    await page.fill('input[name="email"]', 'test@example.com')
    
    await page.click('button[type="submit"]')
    
    await expect(page.locator('.success-message')).toBeVisible()
    await expect(page.locator('.success-message')).toContainText('注册成功')
  })

  test('应该能够完成登录流程', async ({ page }) => {
    await page.goto('/app/login')
    
    await expect(page).toHaveTitle(/用户登录|登录/)
    
    await page.fill('input[name="username"]', 'testuser123')
    await page.fill('input[name="password"]', 'password123')
    
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL(/dashboard|首页/)
  })

  test('应该能够完成商品浏览流程', async ({ page }) => {
    await page.goto('/app/product/list')
    
    await expect(page).toHaveTitle(/商品列表|商品/)
    
    await expect(page.locator('.product-list')).toBeVisible()
    
    const firstProduct = page.locator('.product-card').first()
    await firstProduct.click()
    
    await expect(page).toHaveURL(/product\/detail\//)
    await expect(page.locator('.product-detail')).toBeVisible()
  })

  test('应该能够完成添加到购物车流程', async ({ page }) => {
    await page.goto('/app/product/detail/1')
    
    await expect(page.locator('.product-detail')).toBeVisible()
    
    const addToCartBtn = page.locator('.add-to-cart-btn')
    await addToCartBtn.click()
    
    await expect(page.locator('.toast-success')).toBeVisible()
    await expect(page.locator('.toast-success')).toContainText('已添加到购物车')
  })

  test('应该能够完成购物车结算流程', async ({ page }) => {
    await page.goto('/app/cart')
    
    await expect(page.locator('.cart-list')).toBeVisible()
    
    const checkoutBtn = page.locator('.checkout-btn')
    await checkoutBtn.click()
    
    await expect(page).toHaveURL(/order\/confirm|订单确认/)
    await expect(page.locator('.order-confirm')).toBeVisible()
  })

  test('应该能够完成订单确认流程', async ({ page }) => {
    await page.goto('/app/order/confirm')
    
    await expect(page.locator('.order-confirm')).toBeVisible()
    
    await page.selectOption('select[name="address"]', '1')
    await page.fill('input[name="remark"]', '请尽快发货')
    
    const submitBtn = page.locator('.submit-order-btn')
    await submitBtn.click()
    
    await expect(page).toHaveURL(/order\/payment|订单支付/)
    await expect(page.locator('.order-payment')).toBeVisible()
  })

  test('应该能够完成订单支付流程', async ({ page }) => {
    await page.goto('/app/order/payment')
    
    await expect(page.locator('.order-payment')).toBeVisible()
    
    const wechatPayBtn = page.locator('.wechat-pay-btn')
    await wechatPayBtn.click()
    
    await expect(page.locator('.payment-qrcode')).toBeVisible()
    
    await page.waitForTimeout(3000)
    
    await page.goto('/app/order/list')
    
    await expect(page.locator('.order-list')).toBeVisible()
    const lastOrder = page.locator('.order-item').first()
    await expect(lastOrder.locator('.order-status')).toContainText('待发货')
  })

  test('应该能够完成订单查询流程', async ({ page }) => {
    await page.goto('/app/order/list')
    
    await expect(page.locator('.order-list')).toBeVisible()
    
    const searchInput = page.locator('.order-search input')
    await searchInput.fill('ORD001')
    await page.keyboard.press('Enter')
    
    await page.waitForTimeout(500)
    
    const orders = page.locator('.order-item')
    await expect(orders).toHaveCount(expect.atLeast(1))
  })

  test('应该能够完成订单详情查看流程', async ({ page }) => {
    await page.goto('/app/order/list')
    
    const firstOrder = page.locator('.order-item').first()
    await firstOrder.click()
    
    await expect(page.locator('.order-detail')).toBeVisible()
    await expect(page.locator('.order-no')).toBeVisible()
    await expect(page.locator('.order-products')).toBeVisible()
  })

  test('应该能够完成订单取消流程', async ({ page }) => {
    await page.goto('/app/order/list')
    
    const firstOrder = page.locator('.order-item').first()
    const cancelBtn = firstOrder.locator('.cancel-btn')
    
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click()
      
      await expect(page.locator('.confirm-dialog')).toBeVisible()
      
      const confirmBtn = page.locator('.confirm-cancel-btn')
      await confirmBtn.click()
      
      await expect(page.locator('.toast-success')).toBeVisible()
      await expect(page.locator('.toast-success')).toContainText('订单已取消')
    }
  })

  test('应该能够完成用户信息修改流程', async ({ page }) => {
    await page.goto('/app/user/profile')
    
    await expect(page.locator('.user-info')).toBeVisible()
    
    const editBtn = page.locator('.edit-profile-btn')
    await editBtn.click()
    
    await expect(page.locator('.edit-form')).toBeVisible()
    
    await page.fill('input[name="nickname"]', '新昵称')
    await page.fill('input[name="phone"]', '13900139000')
    
    const saveBtn = page.locator('.save-btn')
    await saveBtn.click()
    
    await expect(page.locator('.toast-success')).toBeVisible()
    await expect(page.locator('.toast-success')).toContainText('保存成功')
  })

  test('应该能够完成收货地址管理流程', async ({ page }) => {
    await page.goto('/app/user/address')
    
    await expect(page.locator('.address-list')).toBeVisible()
    
    const addBtn = page.locator('.add-address-btn')
    await addBtn.click()
    
    await expect(page.locator('.address-form')).toBeVisible()
    
    await page.fill('input[name="receiverName"]', '张三')
    await page.fill('input[name="receiverPhone"]', '13800138000')
    await page.fill('input[name="province"]', '黑龙江省')
    await page.fill('input[name="city"]', '哈尔滨市')
    await page.fill('input[name="district"]', '松北区')
    await page.fill('input[name="detailAddress"]', '学海街1号')
    
    const saveBtn = page.locator('.save-address-btn')
    await saveBtn.click()
    
    await expect(page.locator('.toast-success')).toBeVisible()
    await expect(page.locator('.toast-success')).toContainText('地址添加成功')
  })

  test('应该能够完成钱包充值流程', async ({ page }) => {
    await page.goto('/app/user/wallet')
    
    await expect(page.locator('.wallet-balance')).toBeVisible()
    
    const rechargeBtn = page.locator('.recharge-btn')
    await rechargeBtn.click()
    
    await expect(page.locator('.recharge-dialog')).toBeVisible()
    
    await page.fill('input[name="amount"]', '100')
    
    const submitBtn = page.locator('.submit-recharge-btn')
    await submitBtn.click()
    
    await expect(page.locator('.payment-qrcode')).toBeVisible()
  })
})
