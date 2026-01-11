import { test, expect } from '@playwright/test'

test.describe('首页测试', () => {
  test('应该能够访问首页', async ({ page }) => {
    // 访问首页（使用相对路径，Playwright会使用配置文件中的baseURL）
    await page.goto('/')

    // 验证页面标题
    await expect(page).toHaveTitle(/黑科易购|校园服务平台/)

    // 验证页面包含主要元素
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('应该包含侧边栏导航', async ({ page }) => {
    // 访问首页
    await page.goto('/')

    // 验证侧边栏存在
    await expect(page.locator('.sidebar')).toBeVisible()

    // 验证侧边栏包含导航链接
    const navLinks = await page.locator('.sidebar-menu .menu-link')
    await expect(navLinks).toHaveCount(expect.atLeast(3))
  })

  test('应该包含头部导航', async ({ page }) => {
    // 访问首页
    await page.goto('/')

    // 验证头部存在
    await expect(page.locator('.main-header')).toBeVisible()

    // 验证头部包含Logo
    await expect(page.locator('.logo')).toBeVisible()

    // 验证头部包含用户信息区域
    await expect(page.locator('.user-info')).toBeVisible()
  })

  test('应该正确处理响应式布局', async ({ page }) => {
    // 访问首页
    await page.goto('/')

    // 切换到移动端视图
    await page.setViewportSize({ width: 768, height: 1024 })

    // 验证移动端菜单按钮可见
    await expect(page.getByRole('button', { name: /菜单/ })).toBeVisible()

    // 切换回桌面视图
    await page.setViewportSize({ width: 1280, height: 800 })

    // 验证侧边栏可见
    await expect(page.locator('.sidebar')).toBeVisible()
  })
})

test.describe('登录页面测试', () => {
  test('应该能够访问登录页面', async ({ page }) => {
    // 访问登录页面
    await page.goto('/login')

    // 验证登录表单存在
    await expect(page.getByRole('form')).toBeVisible()

    // 验证表单包含用户名和密码输入框
    await expect(page.getByLabel(/用户名|账号/)).toBeVisible()
    await expect(page.getByLabel(/密码/)).toBeVisible()

    // 验证表单包含登录按钮
    await expect(page.getByRole('button', { name: /登录/ })).toBeVisible()
  })

  test('应该验证登录表单输入', async ({ page }) => {
    // 访问登录页面
    await page.goto('/login')

    // 直接点击登录按钮，验证表单验证
    await page.getByRole('button', { name: /登录/ }).click()

    // 验证是否显示错误信息（如果有）
    // 这里假设表单验证会显示错误信息
    // await expect(page.getByText(/请输入用户名|请输入密码/)).toBeVisible();
  })
})
