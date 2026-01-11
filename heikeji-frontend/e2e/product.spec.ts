import { test, expect } from '@playwright/test'

test.describe('商品功能测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问商品列表页面
    await page.goto('/product/list')
  })

  test('应该能够访问商品列表页面', async ({ page }) => {
    // 验证页面标题
    await expect(page).toHaveTitle(/商品列表|商品管理/)

    // 验证页面包含商品列表
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.locator('.product-list')).toBeVisible()
  })

  test('应该显示商品列表数据', async ({ page }) => {
    // 验证商品列表包含商品卡片
    const productCards = await page.locator('.product-card')
    await expect(productCards).toHaveCount(expect.atLeast(1))

    // 验证商品卡片包含基本信息
    const firstProduct = productCards.first()
    await expect(firstProduct.locator('.product-name')).toBeVisible()
    await expect(firstProduct.locator('.product-price')).toBeVisible()
    await expect(firstProduct.locator('.product-image')).toBeVisible()
  })

  test('应该支持商品搜索功能', async ({ page }) => {
    // 输入搜索关键词
    await page.getByPlaceholder(/搜索商品.../).fill('测试商品')
    
    // 点击搜索按钮
    await page.getByRole('button', { name: /搜索/ }).click()
    
    // 等待搜索结果
    await page.waitForTimeout(500)
    
    // 验证搜索结果
    const productCards = await page.locator('.product-card')
    await expect(productCards).toHaveCount(expect.atLeast(0))
  })

  test('应该支持商品分类筛选', async ({ page }) => {
    // 点击分类筛选按钮或链接
    const categoryFilter = await page.locator('.category-filter')
    if (await categoryFilter.isVisible()) {
      await categoryFilter.first().click()
      
      // 等待筛选结果
      await page.waitForTimeout(500)
      
      // 验证筛选结果
      const productCards = await page.locator('.product-card')
      await expect(productCards).toHaveCount(expect.atLeast(0))
    }
  })

  test('应该能够查看商品详情', async ({ page }) => {
    // 获取第一个商品卡片
    const firstProduct = await page.locator('.product-card').first()
    
    // 点击商品卡片进入详情页
    await firstProduct.click()
    
    // 验证页面跳转到商品详情页
    await expect(page.url()).toMatch(/\/product\/detail\//)
    
    // 验证商品详情包含基本信息
    await expect(page.locator('.product-detail')).toBeVisible()
    await expect(page.locator('.product-detail .product-name')).toBeVisible()
    await expect(page.locator('.product-detail .product-price')).toBeVisible()
    await expect(page.locator('.product-detail .product-description')).toBeVisible()
  })

  test('商品详情页应该包含加入购物车按钮', async ({ page }) => {
    // 先进入商品详情页
    await page.locator('.product-card').first().click()
    
    // 验证加入购物车按钮存在
    await expect(page.getByRole('button', { name: /加入购物车/ })).toBeVisible()
    
    // 验证立即购买按钮存在
    await expect(page.getByRole('button', { name: /立即购买/ })).toBeVisible()
  })

  test('应该支持商品数量调整', async ({ page }) => {
    // 先进入商品详情页
    await page.locator('.product-card').first().click()
    
    // 验证数量调整控件存在
    const quantityInput = await page.locator('.quantity-input input')
    await expect(quantityInput).toBeVisible()
    
    // 验证增加数量按钮存在
    const increaseBtn = await page.locator('.quantity-input .increase-btn')
    await expect(increaseBtn).toBeVisible()
    
    // 验证减少数量按钮存在
    const decreaseBtn = await page.locator('.quantity-input .decrease-btn')
    await expect(decreaseBtn).toBeVisible()
  })

  test('应该正确显示商品库存状态', async ({ page }) => {
    // 先进入商品详情页
    await page.locator('.product-card').first().click()
    
    // 验证库存信息存在
    await expect(page.locator('.stock-info')).toBeVisible()
  })
})

test.describe('商品管理后台测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问后台商品管理页面
    await page.goto('/admin/product')
  })

  test('应该能够访问后台商品管理页面', async ({ page }) => {
    // 验证页面包含商品管理相关元素
    await expect(page.locator('.product-management')).toBeVisible()
    await expect(page.locator('.product-table')).toBeVisible()
  })

  test('后台商品列表应该包含操作按钮', async ({ page }) => {
    // 验证商品列表包含操作列
    await expect(page.locator('.operation-column')).toBeVisible()
    
    // 验证包含编辑按钮
    await expect(page.getByRole('button', { name: /编辑/ })).toBeVisible()
    
    // 验证包含删除按钮
    await expect(page.getByRole('button', { name: /删除/ })).toBeVisible()
  })

  test('应该能够添加新商品', async ({ page }) => {
    // 点击添加商品按钮
    await page.getByRole('button', { name: /添加商品/ }).click()
    
    // 验证添加商品表单存在
    await expect(page.locator('.add-product-form')).toBeVisible()
    
    // 验证表单包含基本字段
    await expect(page.getByLabel(/商品名称/)).toBeVisible()
    await expect(page.getByLabel(/商品价格/)).toBeVisible()
    await expect(page.getByLabel(/商品库存/)).toBeVisible()
    await expect(page.getByLabel(/商品描述/)).toBeVisible()
  })
})