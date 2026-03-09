import { test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@playwright/test'
import { setupE2ETest, createPageObject } from './setup'

describe('用户注册到下单完整流程', () => {
  let pageObject: any
  let browser: any
  let context: any

  beforeAll(async () => {
    const setup = setupE2ETest()
    browser = setup.browser
    context = setup.context
    pageObject = createPageObject(setup.page)
  })

  afterAll(async () => {
    await context.close()
    await browser.close()
  })

  beforeEach(async () => {
    pageObject = createPageObject(setup.page)
  })

  afterEach(async () => {
    await pageObject.page.close()
  })

  test('用户注册流程', async () => {
    // 1. 访问注册页面
    await pageObject.goto('/app/register')
    await expect(pageObject.page).toHaveTitle(/用户注册|注册/)

    // 2. 填写注册信息
    await pageObject.fill('input[name="username"]', setup.testUserData.username)
    await pageObject.fill('input[name="password"]', setup.testUserData.password)
    await pageObject.fill('input[name="confirmPassword"]', setup.testUserData.password)
    await pageObject.fill('input[name="phone"]', setup.testUserData.phone)
    await pageObject.fill('input[name="email"]', setup.testUserData.email)
    await pageObject.click('button[type="submit"]')

    // 3. 验证注册成功
    await expect(pageObject.locator('.success-message')).toBeVisible()
    await expect(pageObject.locator('.success-message')).toContainText('注册成功')

    // 4. 用户登录
    await pageObject.goto('/app/login')
    await expect(pageObject.page).toHaveTitle(/用户登录|登录/)

    await pageObject.fill('input[name="username"]', setup.testUserData.username)
    await pageObject.fill('input[name="password"]', setup.testUserData.password)
    await pageObject.click('button[type="submit"]')

    // 5. 验证登录成功
    await expect(pageObject.page).toHaveURL(/dashboard|首页/)
  })

  test('商品浏览流程', async () => {
    // 1. 访问商品列表
    await pageObject.goto('/app/product/list')
    await expect(pageObject.page).toHaveTitle(/商品列表|商品/)

    // 2. 搜索商品
    await pageObject.fill('input[placeholder="搜索商品"]', '测试商品')
    await pageObject.press('Enter')
    await pageObject.waitForTimeout(1000)

    // 3. 查看商品详情
    const firstProduct = pageObject.locator('.product-card').first()
    await firstProduct.click()

    // 4. 验证商品详情页面
    await expect(pageObject.page).toHaveURL(/product\/detail\//)
    await expect(pageObject.locator('.product-detail')).toBeVisible()
    await expect(pageObject.locator('.product-name')).toContainText('测试商品')
  })

  test('添加到购物车流程', async () => {
    // 1. 访问商品详情
    await pageObject.goto('/app/product/detail/1')
    await expect(pageObject.page).toHaveURL(/product\/detail\//)

    // 2. 添加到购物车
    await pageObject.click('.add-to-cart-btn')
    await pageObject.waitForTimeout(1000)

    // 3. 验证添加成功
    await expect(pageObject.locator('.toast-success')).toBeVisible()
    await expect(pageObject.locator('.toast-success')).toContainText('已添加到购物车')
  })

  test('购物车结算流程', async () => {
    // 1. 访问购物车
    await pageObject.goto('/app/cart')
    await expect(pageObject.page).toHaveTitle(/购物车|我的购物车/)

    // 2. 选择商品
    const firstItem = pageObject.locator('.cart-item').first()
    await firstItem.click()
    await pageObject.waitForTimeout(500)

    // 3. 点击结算按钮
    await pageObject.click('.checkout-btn')
    await pageObject.waitForTimeout(1000)

    // 4. 验证结算页面
    await expect(pageObject.page).toHaveURL(/order\/confirm|订单确认/)
    await expect(pageObject.locator('.order-confirm')).toBeVisible()
  })

  test('订单确认流程', async () => {
    // 1. 访问订单确认页面
    await pageObject.goto('/app/order/confirm')
    await expect(pageObject.page).toHaveTitle(/订单确认|订单支付/)

    // 2. 选择收货地址
    await pageObject.selectOption('select[name="address"]', '1')
    await pageObject.fill('input[name="remark"]', '请尽快发货')

    // 3. 提交订单
    await pageObject.click('.submit-order-btn')
    await pageObject.waitForTimeout(1000)

    // 4. 验证订单提交成功
    await expect(pageObject.page).toHaveURL(/order\/payment|订单支付/)
    await expect(pageObject.locator('.order-payment')).toBeVisible()
  })

  test('订单支付流程', async () => {
    // 1. 访问订单支付页面
    await pageObject.goto('/app/order/payment')
    await expect(pageObject.page).toHaveTitle(/订单支付|订单支付/)

    // 2. 选择支付方式
    await pageObject.click('.wechat-pay-btn')
    await pageObject.waitForTimeout(1000)

    // 3. 验证支付二维码显示
    await expect(pageObject.locator('.payment-qrcode')).toBeVisible()

    // 4. 模拟支付成功
    await pageObject.waitForTimeout(3000)
    await expect(pageObject.page).toHaveURL(/order\/list|订单列表/)
    await expect(pageObject.locator('.order-list')).toBeVisible()
  })

  test('订单列表查看流程', async () => {
    // 1. 访问订单列表
    await pageObject.goto('/app/order/list')
    await expect(pageObject.page).toHaveTitle(/订单列表|我的订单/)

    // 2. 搜索订单
    await pageObject.fill('input[placeholder="搜索订单"]', 'ORD001')
    await pageObject.press('Enter')
    await pageObject.waitForTimeout(1000)

    // 3. 验证搜索结果
    const orders = pageObject.locator('.order-item')
    await expect(orders).toHaveCount(expect.atLeast(1))
    await expect(orders.first()).toBeVisible()

    // 4. 查看订单详情
    const firstOrder = orders.first()
    await firstOrder.click()
    await pageObject.waitForTimeout(1000)

    // 5. 验证订单详情页面
    await expect(pageObject.page).toHaveURL(/order\/detail\//)
    await expect(pageObject.locator('.order-detail')).toBeVisible()
    await expect(pageObject.locator('.order-no')).toContainText('ORD001')
  })
})