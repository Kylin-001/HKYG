import { test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@playwright/test'
import { chromium, firefox, webkit, devices } from 'playwright'
import { testUserData as testUserConfig } from '../config/test'

export const setupE2ETest = () => {
  // 测试环境配置
  const testOptions = {
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.SLOW_MO === 'true',
    timeout: 30000,
    retries: process.env.CI ? 1 : 2,
    workers: process.env.CI ? 1 : undefined,
  }

  // 测试数据
  const testUserData = {
    username: 'testuser',
    password: testUserConfig.password,
    phone: testUserConfig.phone,
    email: 'test@example.com',
    nickname: '测试用户',
  }

  const testProductData = {
    name: '测试商品',
    price: 100,
    description: '这是一个测试商品',
    images: ['http://example.com/image1.jpg'],
    stock: 100,
    categoryId: 1,
    attributes: { color: '红色', size: 'L' },
  }

  const testOrderData = {
    orderNo: 'ORD001',
    customerName: '张三',
    customerPhone: '13800138001',
    items: [
      {
        name: '商品A',
        spec: '规格A',
        price: 100,
        quantity: 2,
        total: 200,
      },
    ],
    amount: 200,
    status: '待支付',
    paymentMethod: 'alipay',
    deliveryAddress: '北京市朝阳区',
    estimatedDelivery: '2024-03-05',
    remark: '测试订单',
  }

  // 浏览器实例
  let browser: any
  let context: any
  let page: any

  beforeAll(async () => {
    // 根据环境选择浏览器
    if (process.env.BROWSER === 'firefox') {
      browser = await firefox.launch(testOptions)
    } else if (process.env.BROWSER === 'webkit') {
      browser = await webkit.launch(testOptions)
    } else {
      browser = await chromium.launch(testOptions)
    }

    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
    })
  })

  afterAll(async () => {
    await context.close()
    await browser.close()
  })

  beforeEach(async () => {
    page = await context.newPage()
    await page.goto('http://localhost:3000')
  })

  afterEach(async () => {
    await page.close()
  })

  return {
    browser,
    context,
    page,
    testUserData,
    testProductData,
    testOrderData,
    testOptions,
  }
}

// 测试工具函数
export const waitForElement = async (page: any, selector: string, timeout = 5000) => {
  try {
    return await page.waitForSelector(selector, { timeout })
  } catch (error) {
    console.error(`等待元素 ${selector} 超时:`, error)
    throw error
  }
}

export const takeScreenshot = async (page: any, name: string) => {
  try {
    await page.screenshot({ path: `./e2e/screenshots/${name}.png`, fullPage: true })
    console.log(`截图已保存: ${name}`)
  } catch (error) {
    console.error(`截图失败 ${name}:`, error)
    throw error
  }
}

export const generateTestReport = async (testResults: any) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const reportData = {
    timestamp,
    summary: {
      total: testResults.length,
      passed: testResults.filter((result: any) => result.status === 'passed').length,
      failed: testResults.filter((result: any) => result.status === 'failed').length,
      skipped: testResults.filter((result: any) => result.status === 'skipped').length,
    },
    results: testResults.map((result: any) => ({
      title: result.title,
      status: result.status,
      duration: result.duration,
      error: result.error,
      browser: result.browser,
      viewport: result.viewport,
    })),
  }

  try {
    await require('fs').promises.writeFile(
      `./e2e/reports/test-report-${timestamp}.json`,
      JSON.stringify(reportData, null, 2)
    )
    console.log(`测试报告已生成: test-report-${timestamp}.json`)
  } catch (error) {
    console.error('生成测试报告失败:', error)
  }
}

// 页面对象工厂
export const createPageObject = (page: any) => ({
  goto: (url: string) => page.goto(url),
  click: (selector: string) => page.click(selector),
  fill: (selector: string, value: string) => page.fill(selector, value),
  type: (selector: string, value: string) => page.type(selector, value),
  press: (key: string) => page.keyboard.press(key),
  waitForSelector: (selector: string, timeout = 5000) => waitForElement(page, selector, timeout),
  waitForTimeout: (timeout = 5000) => page.waitForTimeout(timeout),
  locator: (selector: string) => page.locator(selector),
  textContent: (selector: string) => page.locator(selector).textContent(),
  isVisible: (selector: string) => page.locator(selector).isVisible(),
  screenshot: (name: string) => takeScreenshot(page, name),
})
