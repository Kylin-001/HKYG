import { test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@playwright/test'
import { setupE2ETest, createPageObject } from './setup'

describe('API接口E2E测试', () => {
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

  test('商品API E2E测试', async () => {
    // 1. 访问商品列表页面
    await pageObject.goto('/app/product/list')
    await expect(pageObject.page).toHaveTitle(/商品列表|商品/)

    // 2. 测试商品列表加载
    await pageObject.waitForSelector('.product-list')
    const products = pageObject.locator('.product-card')
    await expect(products).toHaveCount(expect.atLeast(1))

    // 3. 测试商品搜索
    await pageObject.fill('input[placeholder="搜索商品"]', '测试商品')
    await pageObject.press('Enter')
    await pageObject.waitForTimeout(1000)

    // 4. 验证搜索结果
    const searchResults = pageObject.locator('.product-card')
    await expect(searchResults).toHaveCount(expect.atLeast(1))
    await expect(searchResults.first()).toBeVisible()
  })

  test('商品详情API E2E测试', async () => {
    // 1. 访问商品详情页面
    await pageObject.goto('/app/product/detail/1')
    await expect(pageObject.page).toHaveURL(/product\/detail\//)

    // 2. 测试商品详情加载
    await pageObject.waitForSelector('.product-detail')
    await expect(pageObject.locator('.product-detail')).toBeVisible()

    // 3. 测试商品信息显示
    await expect(pageObject.locator('.product-name')).toContainText('测试商品')
    await expect(pageObject.locator('.product-price')).toContainText('100')
    await expect(pageObject.locator('.product-stock')).toContainText('库存：100')
  })

  test('用户API E2E测试', async () => {
    // 1. 访问用户信息页面
    await pageObject.goto('/app/user/profile')
    await expect(pageObject.page).toHaveTitle(/个人中心|用户中心/)

    // 2. 测试用户信息加载
    await pageObject.waitForSelector('.user-info')
    await expect(pageObject.locator('.user-info')).toBeVisible()

    // 3. 测试用户信息显示
    await expect(pageObject.locator('.username')).toBeVisible()
    await expect(pageObject.locator('.phone')).toBeVisible()
    await expect(pageObject.locator('.email')).toBeVisible()
  })

  test('订单API E2E测试', async () => {
    // 1. 访问订单列表页面
    await pageObject.goto('/app/order/list')
    await expect(pageObject.page).toHaveTitle(/订单列表|我的订单/)

    // 2. 测试订单列表加载
    await pageObject.waitForSelector('.order-list')
    const orders = pageObject.locator('.order-item')
    await expect(orders).toHaveCount(expect.atLeast(1))

    // 3. 测试订单状态筛选
    await pageObject.click('.status-filter')
    await pageObject.waitForTimeout(500)

    // 4. 验证筛选结果
    const filteredOrders = pageObject.locator('.order-item')
    await expect(filteredOrders).toHaveCount(expect.atLeast(1))
  })

  test('购物车API E2E测试', async () => {
    // 1. 访问购物车页面
    await pageObject.goto('/app/cart')
    await expect(pageObject.page).toHaveTitle(/购物车|我的购物车/)

    // 2. 测试购物车加载
    await pageObject.waitForSelector('.cart-list')
    const cartItems = pageObject.locator('.cart-item')
    await expect(cartItems).toHaveCount(expect.atLeast(1))

    // 3. 测试添加商品到购物车
    await pageObject.goto('/app/product/detail/1')
    await pageObject.click('.add-to-cart-btn')
    await pageObject.waitForTimeout(1000)

    // 4. 验证添加成功提示
    await expect(pageObject.locator('.toast-success')).toBeVisible()
    await expect(pageObject.locator('.toast-success')).toContainText('已添加到购物车')
  })

  test('支付API E2E测试', async () => {
    // 1. 访问订单支付页面
    await pageObject.goto('/app/order/payment')
    await expect(pageObject.page).toHaveTitle(/订单支付|订单支付/)

    // 2. 测试支付方式选择
    await pageObject.click('.wechat-pay-btn')
    await pageObject.waitForTimeout(1000)

    // 3. 验证支付流程
    await expect(pageObject.locator('.payment-qrcode')).toBeVisible()
    await pageObject.waitForTimeout(3000)
    await expect(pageObject.page).toHaveURL(/order\/list|订单列表/)
  })

  test('错误处理E2E测试', async () => {
    // 1. 测试404页面
    await pageObject.goto('/app/not-found')
    await expect(pageObject.page).toHaveTitle(/404|页面不存在/)
    await expect(pageObject.locator('.error-code')).toContainText('404')
    await expect(pageObject.locator('.error-message')).toContainText('页面不存在')

    // 2. 测试500页面
    await pageObject.goto('/app/server-error')
    await expect(pageObject.page).toHaveTitle(/500|服务器错误/)
    await expect(pageObject.locator('.error-code')).toContainText('500')
    await expect(pageObject.locator('.error-message')).toContainText('服务器内部错误')

    // 3. 测试网络错误
    await pageObject.goto('/app/network-error')
    await expect(pageObject.page).toHaveTitle(/网络错误|连接失败/)
    await expect(pageObject.locator('.error-icon')).toBeVisible()
  })
})
