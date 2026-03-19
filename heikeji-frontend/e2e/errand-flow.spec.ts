import { test, expect } from '@playwright/test'

test.describe('校园跑腿完整流程', () => {
  test('应该能够浏览跑腿任务', async ({ page }) => {
    await page.goto('/app/errand/task')

    await expect(page).toHaveTitle(/校园跑腿|跑腿任务/)
    await expect(page.locator('.task-list')).toBeVisible()

    const firstTask = page.locator('.task-card').first()
    await expect(firstTask.locator('.task-title')).toBeVisible()
    await expect(firstTask.locator('.task-reward')).toBeVisible()
  })

  test('应该能够发布跑腿任务', async ({ page }) => {
    await page.goto('/app/errand/publish')

    await expect(page.locator('.publish-form')).toBeVisible()

    await page.fill('input[name="taskTitle"]', '帮我取快递')
    await page.fill('textarea[name="taskDesc"]', '快递在菜鸟驿站，需要帮忙取到寝室')
    await page.fill('input[name="taskLocation"]', '菜鸟驿站')
    await page.fill('input[name="taskDestination"]', '3号楼')
    await page.fill('input[name="rewardAmount"]', '5')

    const submitBtn = page.locator('.publish-btn')
    await submitBtn.click()

    await expect(page.locator('.toast-success')).toBeVisible()
    await expect(page.locator('.toast-success')).toContainText('任务发布成功')
  })

  test('应该能够查看跑腿任务详情', async ({ page }) => {
    await page.goto('/app/errand/task/detail/1')

    await expect(page.locator('.task-detail')).toBeVisible()
    await expect(page.locator('.task-title')).toBeVisible()
    await expect(page.locator('.task-desc')).toBeVisible()
    await expect(page.locator('.task-reward')).toBeVisible()
    await expect(page.locator('.task-publisher')).toBeVisible()
  })

  test('应该能够接跑腿任务', async ({ page }) => {
    await page.goto('/app/errand/task/detail/1')

    await expect(page.locator('.task-detail')).toBeVisible()

    const acceptBtn = page.locator('.accept-task-btn')
    await acceptBtn.click()

    await expect(page.locator('.confirm-dialog')).toBeVisible()

    const confirmBtn = page.locator('.confirm-accept-btn')
    await confirmBtn.click()

    await expect(page.locator('.toast-success')).toBeVisible()
    await expect(page.locator('.toast-success')).toContainText('任务接取成功')
  })

  test('应该能够查看我的接单列表', async ({ page }) => {
    await page.goto('/app/errand/my-tasks')

    await expect(page).toHaveTitle(/我的接单|接单列表/)
    await expect(page.locator('.my-task-list')).toBeVisible()

    const tasks = page.locator('.task-card')
    await expect(tasks).toHaveCount(expect.atLeast(1))
  })

  test('应该能够完成跑腿任务', async ({ page }) => {
    await page.goto('/app/errand/my-tasks/detail/1')

    await expect(page.locator('.task-detail')).toBeVisible()

    const completeBtn = page.locator('.complete-task-btn')
    await completeBtn.click()

    await expect(page.locator('.complete-form')).toBeVisible()

    await page.fill('textarea[name="completeDesc"]', '任务已完成，快递已送达')
    await page.fill('input[name="actualReward"]', '5')

    const submitBtn = page.locator('.submit-complete-btn')
    await submitBtn.click()

    await expect(page.locator('.toast-success')).toBeVisible()
    await expect(page.locator('.toast-success')).toContainText('任务完成')
  })

  test('应该能够取消跑腿任务', async ({ page }) => {
    await page.goto('/app/errand/my-tasks/detail/1')

    await expect(page.locator('.task-detail')).toBeVisible()

    const cancelBtn = page.locator('.cancel-task-btn')

    if (await cancelBtn.isVisible()) {
      await cancelBtn.click()

      await expect(page.locator('.confirm-dialog')).toBeVisible()

      const confirmBtn = page.locator('.confirm-cancel-btn')
      await confirmBtn.click()

      await expect(page.locator('.toast-success')).toBeVisible()
      await expect(page.locator('.toast-success')).toContainText('任务已取消')
    }
  })

  test('应该能够评价跑腿任务', async ({ page }) => {
    await page.goto('/app/errand/my-tasks/detail/1')

    const reviewBtn = page.locator('.review-task-btn')

    if (await reviewBtn.isVisible()) {
      await reviewBtn.click()

      await expect(page.locator('.review-form')).toBeVisible()

      await page.fill('textarea[name="reviewContent"]', '跑腿员很给力，服务很好')
      await page.click('.rating-star[data-rating="5"]')

      const submitBtn = page.locator('.submit-review-btn')
      await submitBtn.click()

      await expect(page.locator('.toast-success')).toBeVisible()
      await expect(page.locator('.toast-success')).toContainText('评价成功')
    }
  })

  test('应该能够查看跑腿任务状态', async ({ page }) => {
    await page.goto('/app/errand/task/detail/1')

    await expect(page.locator('.task-detail')).toBeVisible()
    await expect(page.locator('.task-status')).toBeVisible()

    const statusText = await page.locator('.task-status').textContent()
    expect(['待接单', '进行中', '已完成', '已取消']).toContain(statusText)
  })

  test('应该能够搜索跑腿任务', async ({ page }) => {
    await page.goto('/app/errand/task')

    await expect(page.locator('.task-list')).toBeVisible()

    const searchInput = page.locator('.task-search input')
    await searchInput.fill('取快递')
    await page.keyboard.press('Enter')

    await page.waitForTimeout(500)

    const tasks = page.locator('.task-card')
    await expect(tasks).toHaveCount(expect.atLeast(1))
  })

  test('应该能够筛选跑腿任务', async ({ page }) => {
    await page.goto('/app/errand/task')

    await expect(page.locator('.task-list')).toBeVisible()

    const filterBtn = page.locator('.filter-btn')
    await filterBtn.click()

    await expect(page.locator('.filter-dialog')).toBeVisible()

    const categoryFilter = page.locator('.category-filter')
    await categoryFilter.selectOption('取快递')

    const applyBtn = page.locator('.apply-filter-btn')
    await applyBtn.click()

    await page.waitForTimeout(500)

    const tasks = page.locator('.task-card')
    await expect(tasks).toHaveCount(expect.atLeast(1))
  })

  test('应该能够查看跑腿任务历史', async ({ page }) => {
    await page.goto('/app/errand/history')

    await expect(page).toHaveTitle(/跑腿历史|任务历史/)
    await expect(page.locator('.history-list')).toBeVisible()

    const tasks = page.locator('.task-card')
    await expect(tasks).toHaveCount(expect.atLeast(1))
  })
})
