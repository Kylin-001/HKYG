import { test, expect } from '@playwright/test'

test.describe('用户中心功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/user/profile')
  })

  test('应该能够访问用户中心页面', async ({ page }) => {
    await expect(page).toHaveTitle(/个人中心|用户中心/)
  })

  test('应该显示用户信息', async ({ page }) => {
    await expect(page.locator('.user-info')).toBeVisible()
  })

  test('应该显示用户头像', async ({ page }) => {
    await expect(page.locator('.user-avatar')).toBeVisible()
  })

  test('应该显示用户名', async ({ page }) => {
    await expect(page.locator('.username')).toBeVisible()
  })

  test('应该显示用户昵称', async ({ page }) => {
    await expect(page.locator('.nickname')).toBeVisible()
  })

  test('应该显示用户手机号', async ({ page }) => {
    await expect(page.locator('.phone')).toBeVisible()
  })

  test('应该显示用户邮箱', async ({ page }) => {
    await expect(page.locator('.email')).toBeVisible()
  })

  test('应该支持编辑用户信息', async ({ page }) => {
    const editBtn = page.locator('.edit-profile-btn')

    if (await editBtn.isVisible()) {
      await editBtn.click()

      await expect(page.locator('.edit-form')).toBeVisible()
    }
  })

  test('应该支持修改头像', async ({ page }) => {
    const avatarUpload = page.locator('.avatar-upload')

    if (await avatarUpload.isVisible()) {
      await avatarUpload.click()

      await expect(page.locator('.upload-dialog')).toBeVisible()
    }
  })

  test('应该支持修改昵称', async ({ page }) => {
    const editBtn = page.locator('.edit-profile-btn')

    if (await editBtn.isVisible()) {
      await editBtn.click()

      const nicknameInput = page.locator('input[name="nickname"]')
      await nicknameInput.clear()
      await nicknameInput.fill('新昵称')

      const saveBtn = page.locator('.save-btn')
      await saveBtn.click()

      await expect(page.locator('.success-message')).toBeVisible()
    }
  })

  test('应该支持修改手机号', async ({ page }) => {
    const editBtn = page.locator('.edit-profile-btn')

    if (await editBtn.isVisible()) {
      await editBtn.click()

      const phoneInput = page.locator('input[name="phone"]')
      await phoneInput.clear()
      await phoneInput.fill('13800138000')

      const saveBtn = page.locator('.save-btn')
      await saveBtn.click()

      await expect(page.locator('.success-message')).toBeVisible()
    }
  })

  test('应该支持修改密码', async ({ page }) => {
    const passwordTab = page.locator('.password-tab')

    if (await passwordTab.isVisible()) {
      await passwordTab.click()

      const oldPasswordInput = page.locator('input[name="oldPassword"]')
      const newPasswordInput = page.locator('input[name="newPassword"]')
      const confirmPasswordInput = page.locator('input[name="confirmPassword"]')

      await oldPasswordInput.fill('oldpassword123')
      await newPasswordInput.fill('newpassword456')
      await confirmPasswordInput.fill('newpassword456')

      const submitBtn = page.locator('.password-submit-btn')
      await submitBtn.click()

      await expect(page.locator('.success-message')).toBeVisible()
    }
  })

  test('应该显示收货地址管理', async ({ page }) => {
    await page.goto('/app/user/address')

    await expect(page.locator('.address-list')).toBeVisible()
  })

  test('应该支持添加收货地址', async ({ page }) => {
    await page.goto('/app/user/address')

    const addBtn = page.locator('.add-address-btn')
    await addBtn.click()

    await expect(page.locator('.address-form')).toBeVisible()
  })

  test('应该支持编辑收货地址', async ({ page }) => {
    await page.goto('/app/user/address')

    const firstAddress = page.locator('.address-item').first()
    const editBtn = firstAddress.locator('.edit-btn')

    if (await editBtn.isVisible()) {
      await editBtn.click()

      await expect(page.locator('.address-form')).toBeVisible()
    }
  })

  test('应该支持删除收货地址', async ({ page }) => {
    await page.goto('/app/user/address')

    const firstAddress = page.locator('.address-item').first()
    const deleteBtn = firstAddress.locator('.delete-btn')

    if (await deleteBtn.isVisible()) {
      await deleteBtn.click()

      await expect(page.locator('.confirm-dialog')).toBeVisible()
    }
  })

  test('应该支持设置默认地址', async ({ page }) => {
    await page.goto('/app/user/address')

    const firstAddress = page.locator('.address-item').first()
    const defaultBtn = firstAddress.locator('.set-default-btn')

    if (await defaultBtn.isVisible()) {
      await defaultBtn.click()

      await expect(firstAddress.locator('.default-badge')).toBeVisible()
    }
  })

  test('应该显示钱包余额', async ({ page }) => {
    await page.goto('/app/user/wallet')

    await expect(page.locator('.wallet-balance')).toBeVisible()
  })

  test('应该支持钱包充值', async ({ page }) => {
    await page.goto('/app/user/wallet')

    const rechargeBtn = page.locator('.recharge-btn')

    if (await rechargeBtn.isVisible()) {
      await rechargeBtn.click()

      await expect(page.locator('.recharge-dialog')).toBeVisible()
    }
  })

  test('应该显示消费记录', async ({ page }) => {
    await page.goto('/app/user/wallet')

    await expect(page.locator('.transaction-list')).toBeVisible()
  })

  test('应该支持查看消费详情', async ({ page }) => {
    await page.goto('/app/user/wallet')

    const firstTransaction = page.locator('.transaction-item').first()

    if (await firstTransaction.isVisible()) {
      await firstTransaction.click()

      await expect(page.locator('.transaction-detail')).toBeVisible()
    }
  })
})
