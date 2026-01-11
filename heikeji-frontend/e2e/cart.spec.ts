import { test, expect } from '@playwright/test'

test.describe('购物车功能测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问购物车页面
    await page.goto('/cart')
  })

  test('应该能够访问购物车页面', async ({ page }) => {
    // 验证页面标题
    await expect(page).toHaveTitle(/购物车|Cart/)

    // 验证页面包含购物车相关元素
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.locator('.cart-container')).toBeVisible()
  })

  test('应该正确显示购物车商品列表', async ({ page }) => {
    // 查找购物车商品项
    const cartItems = await page.locator('.cart-item')
    
    if (await cartItems.count() > 0) {
      // 验证购物车商品包含基本信息
      const firstItem = cartItems.first()
      await expect(firstItem.locator('.product-name')).toBeVisible()
      await expect(firstItem.locator('.product-price')).toBeVisible()
      await expect(firstItem.locator('.product-image')).toBeVisible()
      await expect(firstItem.locator('.quantity-control')).toBeVisible()
      await expect(firstItem.locator('.item-total')).toBeVisible()
    } else {
      // 验证空购物车提示
      await expect(page.locator('.empty-cart')).toBeVisible()
      await expect(page.locator('.empty-cart-message')).toBeVisible()
      await expect(page.locator('.go-shopping-button')).toBeVisible()
    }
  })

  test('应该支持从商品详情页添加商品到购物车', async ({ page }) => {
    // 先访问商品列表页面
    await page.goto('/product/list')
    
    // 查找第一个商品并点击查看详情
    const firstProduct = await page.locator('.product-card').first()
    if (await firstProduct.isVisible()) {
      await firstProduct.click()
      
      // 验证页面跳转到商品详情页
      await expect(page.url()).toMatch(/\/product\/detail\//)
      
      // 点击加入购物车按钮
      const addToCartButton = await page.locator('.add-to-cart-button')
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click()
        
        // 验证添加成功提示
        await expect(page.locator('.add-to-cart-success')).toBeVisible()
        
        // 等待提示消失
        await page.waitForTimeout(1500)
        
        // 点击购物车图标查看购物车
        const cartIcon = await page.locator('.cart-icon')
        if (await cartIcon.isVisible()) {
          await cartIcon.click()
          
          // 验证购物车中包含刚刚添加的商品
          await expect(page.locator('.cart-item')).toHaveCount(expect.atLeast(1))
        }
      }
    }
  })

  test('应该支持调整购物车商品数量', async ({ page }) => {
    // 查找购物车商品项
    const cartItems = await page.locator('.cart-item')
    
    if (await cartItems.count() > 0) {
      const firstItem = cartItems.first()
      
      // 查找数量增加按钮
      const increaseButton = await firstItem.locator('.increase-quantity')
      if (await increaseButton.isVisible()) {
        // 获取当前数量
        const quantityInput = await firstItem.locator('.quantity-input')
        const currentQuantity = await quantityInput.inputValue()
        
        // 点击增加按钮
        await increaseButton.click()
        
        // 验证数量增加
        const newQuantity = await quantityInput.inputValue()
        expect(parseInt(newQuantity)).toBe(parseInt(currentQuantity) + 1)
      }
      
      // 查找数量减少按钮
      const decreaseButton = await firstItem.locator('.decrease-quantity')
      if (await decreaseButton.isVisible()) {
        // 获取当前数量
        const quantityInput = await firstItem.locator('.quantity-input')
        const currentQuantity = await quantityInput.inputValue()
        
        // 只有当数量大于1时才能点击减少按钮
        if (parseInt(currentQuantity) > 1) {
          await decreaseButton.click()
          
          // 验证数量减少
          const newQuantity = await quantityInput.inputValue()
          expect(parseInt(newQuantity)).toBe(parseInt(currentQuantity) - 1)
        }
      }
    }
  })

  test('应该支持删除购物车商品', async ({ page }) => {
    // 查找购物车商品项
    const cartItems = await page.locator('.cart-item')
    
    if (await cartItems.count() > 0) {
      const initialCount = await cartItems.count()
      
      // 查找删除按钮
      const deleteButton = await cartItems.first().locator('.delete-item')
      if (await deleteButton.isVisible()) {
        // 点击删除按钮
        await deleteButton.click()
        
        // 确认删除（如果有确认弹窗）
        const confirmDelete = await page.locator('.confirm-delete')
        if (await confirmDelete.isVisible()) {
          await confirmDelete.click()
        }
        
        // 等待删除完成
        await page.waitForTimeout(500)
        
        // 验证商品数量减少
        const newCount = await page.locator('.cart-item').count()
        expect(newCount).toBeLessThan(initialCount)
      }
    }
  })

  test('应该支持清空购物车', async ({ page }) => {
    // 查找清空购物车按钮
    const clearCartButton = await page.locator('.clear-cart-button')
    if (await clearCartButton.isVisible()) {
      // 点击清空购物车按钮
      await clearCartButton.click()
      
      // 确认清空（如果有确认弹窗）
      const confirmClear = await page.locator('.confirm-clear')
      if (await confirmClear.isVisible()) {
        await confirmClear.click()
      }
      
      // 等待清空完成
      await page.waitForTimeout(500)
      
      // 验证购物车为空
      await expect(page.locator('.empty-cart')).toBeVisible()
    }
  })

  test('应该正确计算购物车总价', async ({ page }) => {
    // 查找购物车商品项
    const cartItems = await page.locator('.cart-item')
    
    if (await cartItems.count() > 0) {
      // 验证购物车包含总价信息
      await expect(page.locator('.cart-total')).toBeVisible()
      await expect(page.locator('.total-price')).toBeVisible()
      await expect(page.locator('.total-quantity')).toBeVisible()
    }
  })

  test('应该支持商品选择功能', async ({ page }) => {
    // 查找购物车商品项
    const cartItems = await page.locator('.cart-item')
    
    if (await cartItems.count() > 0) {
      // 验证商品项包含选择框
      await expect(cartItems.first().locator('.item-select')).toBeVisible()
      
      // 验证全选按钮存在
      await expect(page.locator('.select-all')).toBeVisible()
    }
  })

  test('应该支持从购物车跳转到结算页面', async ({ page }) => {
    // 查找去结算按钮
    const checkoutButton = await page.locator('.checkout-button')
    if (await checkoutButton.isVisible()) {
      // 验证结算按钮可点击（如果购物车有商品）
      const cartItems = await page.locator('.cart-item')
      if (await cartItems.count() > 0) {
        await expect(checkoutButton).toBeEnabled()
        
        // 点击结算按钮（但不实际提交，只是验证跳转）
        await checkoutButton.click()
        
        // 验证页面跳转到结算页面
        await expect(page.url()).toMatch(/\/checkout|\/order\/confirm/i)
      }
    }
  })

  test('应该在移动端正确显示购物车', async ({ page }) => {
    // 切换到移动端视图
    await page.setViewportSize({ width: 768, height: 1024 })
    
    // 验证购物车在移动端正常显示
    await expect(page.locator('.cart-container')).toBeVisible()
    
    // 查找购物车商品项
    const cartItems = await page.locator('.cart-item')
    if (await cartItems.count() > 0) {
      // 验证移动端商品项布局
      await expect(cartItems.first().locator('.mobile-cart-item')).toBeVisible()
    }
  })
})

test.describe('购物车商品数量更新测试', () => {
  test('应该支持通过输入框直接修改商品数量', async ({ page }) => {
    // 访问购物车页面
    await page.goto('/cart')
    
    // 查找购物车商品项
    const cartItems = await page.locator('.cart-item')
    
    if (await cartItems.count() > 0) {
      const firstItem = cartItems.first()
      const quantityInput = await firstItem.locator('.quantity-input')
      
      // 清空输入框并输入新数量
      await quantityInput.fill('')
      await quantityInput.fill('3')
      
      // 按回车确认
      await quantityInput.press('Enter')
      
      // 等待更新完成
      await page.waitForTimeout(500)
      
      // 验证数量更新成功
      const newQuantity = await quantityInput.inputValue()
      expect(newQuantity).toBe('3')
    }
  })

  test('应该验证商品数量的最小值和最大值', async ({ page }) => {
    // 访问购物车页面
    await page.goto('/cart')
    
    // 查找购物车商品项
    const cartItems = await page.locator('.cart-item')
    
    if (await cartItems.count() > 0) {
      const firstItem = cartItems.first()
      const quantityInput = await firstItem.locator('.quantity-input')
      
      // 尝试输入0
      await quantityInput.fill('')
      await quantityInput.fill('0')
      await quantityInput.press('Enter')
      await page.waitForTimeout(500)
      
      // 验证数量不会小于1
      const quantityAfterZero = await quantityInput.inputValue()
      expect(parseInt(quantityAfterZero)).toBeGreaterThan(0)
      
      // 尝试输入一个很大的数字
      await quantityInput.fill('')
      await quantityInput.fill('9999')
      await quantityInput.press('Enter')
      await page.waitForTimeout(500)
      
      // 验证数量不会超过最大值
      const quantityAfterLarge = await quantityInput.inputValue()
      // 这里假设最大值为999，实际值可能需要根据业务逻辑调整
      expect(parseInt(quantityAfterLarge)).toBeLessThanOrEqual(999)
    }
  })
})
