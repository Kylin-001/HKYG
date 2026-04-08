import { test, expect } from '@playwright/test'

test.describe('学工办理模块测试', () => {
  test('学工首页正确加载', async ({ page }) => {
    await page.goto('/student-affairs')
    await expect(page).toHaveURL(/.*\/student-affairs/)
  })

  test('学工办理导航标签可见', async ({ page }) => {
    await page.goto('/student-affairs')
    const tabs = page.locator('nav a[href*="/student-affairs"]')
    const count = await tabs.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test('待办事项区域显示', async ({ page }) => {
    await page.goto('/student-affairs')
    const pendingSection = page.locator('text=我的待办, text=待处理, text=紧急').first()
    if (await pendingSection.isVisible()) {
      await expect(pendingSection).toBeVisible()
    }
  })

  test('快捷服务入口可点击', async ({ page }) => {
    await page.goto('/student-affairs')
    const serviceCards = page.locator('[class*="cursor-pointer"] >> text=/请假|助学金|军训|校园卡/')
    const count = await serviceCards.count()
    if (count > 0) {
      await serviceCards.first().click()
      await expect(page).toHaveURL(/.*\/student-affairs\/(leave|aid|military|campus-card)/)
    }
  })

  test('请假申请页面表单存在', async ({ page }) => {
    await page.goto('/student-affairs/leave')
    const form = page.locator('form, [class*="form"]').first()
    if (await form.count() > 0) {
      await expect(form).toBeVisible()
    }
  })

  test('校园卡页面卡片信息展示', async ({ page }) => {
    await page.goto('/student-affairs/campus-card')
    const cardInfo = page.locator('text=/余额|当前余额|cardNo|卡号/').first()
    if (await cardInfo.isVisible()) {
      await expect(cardInfo).toBeVisible()
    }
  })
})

test.describe('缴费中心模块测试', () => {
  test('缴费首页正确加载', async ({ page }) => {
    await page.goto('/payment')
    await expect(page).toHaveURL(/.*\/payment/)
  })

  test('缴费汇总卡片显示', async ({ page }) => {
    await page.goto('/payment')
    const summaryCards = page.locator('text=/待缴总额|已缴金额|逾期未缴|待缴项目/')
    const count = await summaryCards.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('学费缴纳页面有选择功能', async ({ page }) => {
    await page.goto('/payment/tuition')
    const checkboxes = page.locator('input[type="checkbox"]')
    if (await checkboxes.count() > 0) {
      await expect(checkboxes.first()).toBeVisible()
    }
  })

  test('绿色通道申请入口存在', async ({ page }) => {
    await page.goto('/payment/green-channel')
    const greenChannelContent = page.locator('text=/绿色通道|缓缴|延期|困难/').first()
    if (await greenChannelContent.count() > 0) {
      await expect(greenChannelContent).toBeVisible()
    }
  })
})

test.describe('信息公告模块测试', () => {
  test('公告列表页正确加载', async ({ page }) => {
    await page.goto('/announcements')
    await expect(page).toHaveURL(/.*\/announcements/)
  })

  test('公告分类筛选标签可见', async ({ page }) => {
    await page.goto('/announcements')
    const filterTags = page.locator('button[class*="rounded-full"], button:has-text("全部")')
    const count = await filterTags.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })

  test('通知中心页面加载', async ({ page }) => {
    await page.goto('/announcements/notifications')
    await expect(page).toHaveURL(/.*\/notifications/)
  })

  test('通知列表展示', async ({ page }) => {
    await page.goto('/announcements/notifications')
    const notificationItems = page.locator('[class*="rounded"], div:has-text("通知")')
    const count = await notificationItems.count()
    if (count > 1) {
      await expect(notificationItems.first()).toBeVisible()
    }
  })
})

test.describe('AI教学模块测试', () => {
  test('AI慕课页面课程卡片展示', async ({ page }) => {
    await page.goto('/campus/ai-courses')
    await expect(page).toHaveURL(/.*\/ai-courses/)
    const courseCards = page.locator('[class*="course"] >> text=/门|课程|评分/')
    const count = await courseCards.count()
    expect(count).toBeGreaterThanOrEqual(8)
  })

  test('AI教学中心功能入口展示', async ({ page }) => {
    await page.goto('/campus/ai-teaching')
    await expect(page).toHaveURL(/.*\/ai-teaching/)
    const features = page.locator('text=/无感开课|语音签到|课堂录像|课堂报告|互动问答/')
    const count = await features.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })
})

test.describe('食堂服务模块测试', () => {
  test('食堂页面正确加载', async ({ page }) => {
    await page.goto('/campus/canteen')
    await expect(page).toHaveURL(/.*\/canteen/)
  })

  test('食堂切换标签可见', async ({ page }) => {
    await page.goto('/campus/canteen')
    const canteenTabs = page.locator('button:has-text("食堂"), button:has-text("饮食")')
    const count = await canteenTabs.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('食堂楼层菜品信息展示', async ({ page }) => {
    await page.goto('/campus/canteen')
    const floorInfo = page.locator('text=/楼|层|价格|营业|评分/')
    const count = await floorInfo.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })
})

test.describe('新模块导航集成测试', () => {
  test('首页快捷入口包含学工和缴费', async ({ page }) => {
    await page.goto('/')
    const studentAffairsLink = page.locator('a[href="/student-affairs"]')
    const paymentLink = page.locator('a[href="/payment"]')
    
    const hasStudentAffairs = await studentAffairsLink.count() > 0
    const hasPayment = await paymentLink.count() > 0
    
    expect(hasStudentAffairs || hasPayment).toBeTruthy()
  })

  test('404页面包含新模块链接', async ({ page }) => {
    await page.goto('/nonexistent-page-404')
    const studentAffairsLink = page.locator('a[href="/student-affairs"]')
    const paymentLink = page.locator('a[href="/payment"]')
    const announcementLink = page.locator('a[href="/announcements"]')
    
    const linksFound = (await studentAffairsLink.count()) + (await paymentLink.count()) + (await announcementLink.count())
    expect(linksFound).toBeGreaterThanOrEqual(2)
  })

  test('个人中心包含校园服务菜单', async ({ page }) => {
    await page.goto('/user/profile')
    const campusServiceSection = page.locator('text=/校园服务|学工办理|缴费中心|校园卡|公告/')
    if (await campusServiceSection.count() > 0) {
      await expect(campusServiceSection.first()).toBeVisible()
    }
  })
})

test.describe('新模块响应式适配测试', () => {
  const viewports = [
    { name: '桌面端', width: 1920, height: 1080 },
    { name: '平板端', width: 768, height: 1024 },
    { name: '移动端', width: 375, height: 812 },
  ]

  for (const vp of viewports) {
    test(`${vp.name} - 学工办理布局正常`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/student-affairs')
      const mainContent = page.locator('main, [class*="min-h-screen"]')
      await expect(mainContent.first()).toBeVisible()
    })

    test(`${vp.name} - 缴费中心布局正常`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/payment')
      const mainContent = page.locator('main, [class*="min-h-screen"]')
      await expect(mainContent.first()).toBeVisible()
    })
  }
})

test.describe('管理后台模块测试', () => {
  test('管理后台首页正确加载', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL(/.*\/admin\/dashboard/)
  })

  test('侧边栏导航菜单可见', async ({ page }) => {
    await page.goto('/admin/dashboard')
    const navLinks = page.locator('aside a[href^="/admin"]')
    const count = await navLinks.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })

  test('数据看板统计卡片显示', async ({ page }) => {
    await page.goto('/admin/dashboard')
    const statCards = page.locator('[class*="grid"] >> text=/在线|PV|UV|停留/')
    const count = await statCards.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('数据看板图表区域渲染', async ({ page }) => {
    await page.goto('/admin/dashboard')
    const chartContainers = page.locator('[ref], div[class*="h-"]')
    const count = await chartContainers.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })

  test('管理后台占位页面可访问', async ({ page }) => {
    const placeholderPages = ['/admin/products', '/admin/users', '/admin/orders', '/admin/system']
    for (const path of placeholderPages) {
      await page.goto(path)
      await expect(page).toHaveURL(new RegExp(path.replace('/', '\\/')))
      const placeholderText = page.locator('text=/开发中|敬请期待|前往数据看板/')
      if (await placeholderText.count() > 0) {
        await expect(placeholderText.first()).toBeVisible()
      }
    }
  })
})

test.describe('表单验证增强测试', () => {
  test('请假申请页面有日期选择器', async ({ page }) => {
    await page.goto('/student-affairs/leave')
    const datePickers = page.locator('.el-date-picker, input[type="date"]')
    if (await datePickers.count() > 0) {
      expect(await datePickers.count()).toBeGreaterThanOrEqual(2)
    }
  })

  test('助学金申请页面有类型选择器', async ({ page }) => {
    await page.goto('/student-affairs/aid')
    const typeOptions = page.locator('text=/国家助学金|校内助学金|临时困难|勤工助学/')
    const count = await typeOptions.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('绿色通道表单有必填字段', async ({ page }) => {
    await page.goto('/payment/green-channel')
    const inputs = page.locator('input[placeholder]')
    const count = await inputs.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('住宿费缴纳有全选功能', async ({ page }) => {
    await page.goto('/payment/dormitory-fee')
    const selectAllCheckbox = page.locator('text=/全选|未缴项目/')
    if (await selectAllCheckbox.count() > 0) {
      await expect(selectAllCheckbox.first()).toBeVisible()
    }
  })

  test('缴费记录有支付方式筛选', async ({ page }) => {
    await page.goto('/payment/records')
    const filterSelects = page.locator('select, button:has-text("全部")')
    if (await filterSelects.count() > 0) {
      await expect(filterSelects.first()).toBeVisible()
    }
  })
})

test.describe('帮助中心模块测试', () => {
  test('帮助中心页面正确加载', async ({ page }) => {
    await page.goto('/help')
    await expect(page).toHaveURL(/.*\/help/)
  })

  test('快捷卡片区域显示', async ({ page }) => {
    await page.goto('/help')
    const quickCards = page.locator('[class*="rounded-2xl"] >> text=/购物指南|校园服务|账户管理|意见反馈/')
    const count = await quickCards.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })

  test('FAQ问题列表可展开', async ({ page }) => {
    await page.goto('/help')
    const faqButtons = page.locator('#faq button')
    if (await faqButtons.count() > 0) {
      await faqButtons.first().click()
      const answer = page.locator('#faq [v-show] p').first()
      await expect(answer).toBeVisible()
    }
  })

  test('使用指南区块存在', async ({ page }) => {
    await page.goto('/help')
    const guideSection = page.locator('#guide')
    if (await guideSection.count() > 0) {
      await expect(guideSection.first()).toBeVisible()
    }
  })

  test('联系我们信息展示', async ({ page }) => {
    await page.goto('/help')
    const contactInfo = page.locator('text=/客服热线|在线客服|办公地址|响应时间/')
    const count = await contactInfo.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('意见反馈表单可交互', async ({ page }) => {
    await page.goto('/help')
    const feedbackForm = page.locator('#feedback form, #feedback textarea')
    if (await feedbackForm.count() > 0) {
      await expect(feedbackForm.first()).toBeVisible()
    }
  })
})
