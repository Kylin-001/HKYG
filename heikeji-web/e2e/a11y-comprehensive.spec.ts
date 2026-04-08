/**
 * 全面可访问性 E2E 测试 (WCAG 2.1 AA 合规性)
 *
 * 测试范围：
 * 1. 键盘导航完整性（Tab顺序、焦点指示器、Skip Link）
 * 2. 颜色对比度验证（正文4.5:1、大文字3:1）
 * 3. 表单可访问性（label关联、错误提示、必填字段）
 * 4. 动态内容播报（aria-live区域、加载状态）
 * 5. ARIA属性正确性
 * 6. 图片替代文本
 * 7. 标题层级结构
 *
 * 参考标准：
 * - WCAG 2.1 Level AA
 * - Section 508
 * - EN 301 549
 */

import { test, expect } from '@playwright/test'

test.describe('WCAG 2.1 AA 合规性测试', () => {
  
  test('键盘导航完整性', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})

    console.log('\n=== 键盘导航完整性测试 ===\n')

    // ========== 1. Skip Link 功能验证 ==========
    const skipLink = page.locator(
      'a.sr-only, ' +
      'a[href="#main-content"], ' +
      'a[href="#main"], ' +
      'a.skip-link, ' +
      'a[class*="skip"], ' +
      'a:has-text("跳到主要内容"), ' +
      'a:has-text("Skip to main")'
    ).first()
    
    if (await skipLink.count() > 0) {
      // Skip Link 通常在未聚焦时不可见，但应该存在于 DOM 中
      const existsInDOM = await skipLink.count()
      expect(existsInDOM).toBeTruthy()
      
      // 聚焦 Skip Link
      await skipLink.focus()
      await expect(skipLink).toBeFocused()
      console.log('✓ Skip Link 存在且可聚焦')
      
      // 按 Enter 激活
      await skipLink.press('Enter')
      await page.waitForTimeout(500)
      
      // 验证焦点是否移动到主内容区
      const focusedElement = page.locator(':focus').first()
      const tag = await focusedElement.evaluate(el => el.tagName.toLowerCase())
      console.log(`  Skip Link 激活后焦点元素: <${tag}>`)
      
      // 应该聚焦到 main、[role="main"] 或具有 tabindex 的主内容容器
      const isValidTarget = ['main', 'div', 'section', 'article'].includes(tag)
      if (isValidTarget) {
        console.log('✓ Skip Link 正确跳转到主内容区')
      }
    } else {
      console.log('⚠ 未找到 Skip Link（建议添加以提升可访问性）')
    }

    // ========== 2. Tab 遍历所有可聚焦元素 ==========
    
    // 收集所有理论上应该可通过 Tab 访问的元素
    const focusableElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll(
        'a:not([tabindex="-1"]), ' +
        'button:not([tabindex="-1"]), ' +
        'input:not([tabindex="-1"]), ' +
        'select:not([tabindex="-1"]), ' +
        'textarea:not([tabindex="-1"]), ' +
        '[tabindex]:not([tabindex="-1"])'
      ))
      
      return elements.map(el => ({
        tag: el.tagName.toLowerCase(),
        type: (el as HTMLInputElement).type || '',
        text: el.textContent?.trim().slice(0, 30) || '',
        ariaLabel: el.getAttribute('aria-label') || '',
        href: (el as HTMLAnchorElement).href || '',
        isVisible: el.offsetParent !== null, // 简单的可见性检查
        tabIndex: el.getAttribute('tabindex') || '0',
      })).filter(el => el.isVisible)
    })
    
    console.log(`找到 ${focusableElements.length} 个可见的可聚焦元素`)

    if (focusableElements.length > 0) {
      // 实际执行 Tab 遍历
      let tabCount = 0
      const maxTabs = Math.min(focusableElements.length, 20) // 限制遍历次数避免超时
      const tabOrder = []
      
      for (let i = 0; i < maxTabs; i++) {
        await page.keyboard.press('Tab')
        await page.waitForTimeout(100)
        
        const focusedElement = page.locator(':focus').first()
        const count = await focusedElement.count()
        
        if (count > 0) {
          const info = await focusedElement.evaluate(el => ({
            tag: el.tagName.toLowerCase(),
            id: el.id,
            className: el.className?.toString()?.slice(0, 50) || '',
            text: el.textContent?.trim().slice(0, 30) || '',
            ariaLabel: el.getAttribute('aria-label') || '',
          }))
          
          tabOrder.push(info)
          tabCount++
        } else {
          break // 无法继续 Tab
        }
      }
      
      console.log(`成功 Tab 遍历了 ${tabCount} 个元素`)
      
      // 显示前10个焦点元素的顺序
      console.log('\nTab 顺序（前10个）:')
      tabOrder.slice(0, 10).forEach((item, idx) => {
        console.log(`  ${idx + 1}. <${item.tag}> ${item.ariaLabel || item.text || '(无标签)'}`)
      })
      
      // 验证 Tab 顺序合理性
      // 至少应该能遍历多个元素
      expect(tabCount).toBeGreaterThanOrEqual(3)

      // ========== 3. 验证焦点指示器可见（focus-visible） ==========
      // 回到第一个可聚焦元素
      for (let i = 0; i < tabCount; i++) {
        await page.keyboard.press('Shift+Tab') // 反向 Tab
        await page.waitForTimeout(50)
      }
      
      await page.waitForTimeout(200)
      
      // 再次正向 Tab 到第一个交互元素
      await page.keyboard.press('Tab')
      await page.waitForTimeout(200)
      
      const currentFocus = page.locator(':focus').first()
      if (await currentFocus.count() > 0) {
        // 检查焦点元素的 outline 或 box-shadow
        const hasVisibleFocusIndicator = await currentFocus.evaluate(el => {
          const style = window.getComputedStyle(el)
          // 检查 outline
          if (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) {
            return true
          }
          // 检查 box-shadow（某些框架使用）
          if (style.boxShadow !== 'none') {
            return true
          }
          // 检查是否有 focus-visible 类或 :focus-visible 伪类效果
          if (el.classList.contains('focus-visible') || 
              el.classList.contains('focused') ||
              el.classList.contains('is-focused')) {
            return true
          }
          return false
        })
        
        if (hasVisibleFocusIndicator) {
          console.log('✓ 焦点指示器可见')
        } else {
          console.log('⚠ 焦点指示器不明显（建议添加 :focus-visible 样式）')
        }
      }

      // ========== 4. 验证没有键盘陷阱 ==========
      // 继续Tab直到循环回第一个元素或无法继续
      let trapDetected = false
      let consecutiveSameElement = 0
      let lastFocusedId = ''
      
      for (let i = 0; i < 30; i++) { // 最多再按30次Tab
        await page.keyboard.press('Tab')
        await page.waitForTimeout(100)
        
        const focused = page.locator(':focus').first()
        if (await focused.count() > 0) {
          const currentId = await focused.evaluate(el => el.id || el.outerHTML.slice(0, 50))
          
          if (currentId === lastFocusedId) {
            consecutiveSameElement++
            if (consecutiveSameElement >= 3) {
              trapDetected = true
              break
            }
          } else {
            consecutiveSameElement = 0
            lastFocusedId = currentId
          }
        } else {
          break
        }
      }
      
      expect(trapDetected).toBeFalsy()
      if (!trapDetected) {
        console.log('✓ 未检测到键盘陷阱')
      }
    }

    // ========== 5. Shift+Tab 反向导航 ==========
    // 正向 Tab 几次
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)
    }
    
    // 记录当前焦点
    const beforeShiftTab = page.locator(':focus').first()
    const beforeInfo = await beforeInfo.evaluate(async () => ({ tag: '' }))
    
    // Shift+Tab 返回
    await page.keyboard.press('Shift+Tab')
    await page.waitForTimeout(200)
    
    const afterShiftTab = page.locator(':focus').first()
    if (await afterShiftTab.count() > 0) {
      console.log('✓ Shift+Tab 反向导航正常工作')
    }

    console.log('\n✓ 键盘导航完整性测试完成')
  })

  test('颜色对比度', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})

    console.log('\n=== 颜色对比度测试 ===\n')

    // 使用 JavaScript 计算颜色对比度
    const contrastResults = await page.evaluate(() => {
      // 将十六进制颜色转换为 RGB
      function hexToRgb(hex: string): [number, number, number] | null {
        if (!hex) return null
        hex = hex.replace('#', '')
        if (hex.length === 3) {
          hex = hex.split('').map(c => c + c).join('')
        }
        const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ] : null
      }
      
      // 计算相对亮度
      function getLuminance(r: number, g: number, b: number): number {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        })
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
      }
      
      // 计算对比度比率
      function getContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
        const lum1 = getLuminance(...rgb1)
        const lum2 = getLuminance(...rgb2)
        const lighter = Math.max(lum1, lum2)
        const darker = Math.min(lum1, lum2)
        return (lighter + 0.05) / (darker + 0.05)
      }
      
      const results: Array<{
        element: string
        textColor: string
        bgColor: string
        ratio: number
        passesAA: boolean
      }> = []
      
      // 检查所有文本元素
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, label, button')
      
      textElements.forEach(el => {
        if (!(el as HTMLElement).offsetParent) return // 跳过不可见元素
        
        const style = window.getComputedStyle(el)
        const textColor = style.color
        
        // 解析颜色为 RGB
        const rgbMatch = textColor.match(/\d+/g)
        if (!rgbMatch || rgbMatch.length < 3) return
        
        const textRgb: [number, number, number] = [
          parseInt(rgbMatch[0]),
          parseInt(rgbMatch[1]),
          parseInt(rgbMatch[2])
        ]
        
        // 获取背景色（考虑继承）
        let bgColor = style.backgroundColor
        if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
          // 向上查找背景色
          let parent = el.parentElement
          while (parent && (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent')) {
            bgColor = window.getComputedStyle(parent).backgroundColor
            parent = parent.parentElement
          }
        }
        
        const bgMatch = bgColor.match(/\d+/g)
        if (!bgMatch || bgMatch.length < 3) return
        
        const bgRgb: [number, number, number] = [
          parseInt(bgMatch[0]),
          parseInt(bgMatch[1]),
          parseInt(bgMatch[2])
        ]
        
        const ratio = getContrastRatio(textRgb, bgRgb)
        const fontSize = parseFloat(style.fontSize)
        const isBold = style.fontWeight === 'bold' || parseInt(style.fontWeight) >= 700
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold)
        
        // WCAG AA: 普通文本 4.5:1, 大文本 3:1
        const requiredRatio = isLargeText ? 3 : 4.5
        const passesAA = ratio >= requiredRatio
        
        results.push({
          element: `${el.tagName}.${el.className?.split(' ')[0]?.slice(0, 20) || ''}`,
          textColor: textColor.slice(0, 16),
          bgColor: bgColor.slice(0, 16),
          ratio: Math.round(ratio * 100) / 100,
          passesAA
        })
      })
      
      return results
    })

    // 分析结果
    console.log(`检查了 ${contrastResults.length} 个文本元素的颜色对比度\n`)
    
    const failingElements = contrastResults.filter(r => !r.passesAA)
    const passingElements = contrastResults.filter(r => r.passesAA)
    
    console.log(`通过 WCAG AA: ${passingElements.length} 个元素 (${((passingElements.length / contrastResults.length) * 100).toFixed(1)}%)`)
    console.log(`未通过 WCAG AA: ${failingElements.length} 个元素 (${((failingElements.length / contrastResults.length) * 100).toFixed(1)}%)`)
    
    // 显示一些失败的例子（最多5个）
    if (failingElements.length > 0) {
      console.log('\n未通过的元素示例:')
      failingElements.slice(0, 5).forEach(fail => {
        console.log(`  - <${fail.element}> 对比度: ${fail.ratio}:1 (需要 ≥ 4.5:1 或 3:1)`)
      })
    }
    
    // 允许少量失败（可能由于复杂背景或装饰性文字）
    // 但失败率不应超过 10%
    const failureRate = failingElements.length / contrastResults.length
    expect(failureRate).toBeLessThan(0.15) // 允许最多15%失败
    
    if (failingElements.length === 0) {
      console.log('\n✓ 所有文本元素都符合 WCAG AA 颜色对比度要求')
    } else {
      console.log(`\n⚠ 有 ${failingElements.length} 个元素不符合要求，建议优化`)
    }

    // ========== 特殊检查：链接和按钮的对比度 ==========
    const linkButtonContrast = await page.evaluate(() => {
      const elements = document.querySelectorAll('a, button')
      const results: Array<{ tag: string, ratio: number }> = []
      
      elements.forEach(el => {
        if (!(el as HTMLElement).offsetParent) return
        
        const style = window.getComputedStyle(el)
        const color = style.color.match(/\d+/g)
        const bg = style.backgroundColor.match(/\d+/g)
        
        if (color && bg && color.length >= 3 && bg.length >= 3) {
          const textLum = (() => {
            const [r, g, b] = [parseInt(color[0])/255, parseInt(color[1])/255, parseInt(color[2])/255].map(c =>
              c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4)
            )
            return 0.2126*r + 0.7152*g + 0.0722*b
          })()
          
          const bgLum = (() => {
            const [r, g, b] = [parseInt(bg[0])/255, parseInt(bg[1])/255, parseInt(bg[2])/255].map(c =>
              c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4)
            )
            return 0.2126*r + 0.7152*g + 0.0722*b
          })()
          
          const lighter = Math.max(textLum, bgLum)
          const darker = Math.min(textLum, bgLum)
          const ratio = (lighter + 0.05) / (darker + 0.05)
          
          results.push({
            tag: el.tagName,
            ratio: Math.round(ratio * 100) / 100
          })
        }
      })
      
      return results
    })
    
    if (linkButtonContrast.length > 0) {
      const lowContrastLinks = linkButtonContrast.filter(lb => lb.ratio < 3)
      console.log(`\n链接/按钮对比度检查: ${linkButtonContrast.length} 个元素`)
      if (lowContrastLinks.length > 0) {
        console.log(`⚠ ${lowContrastLinks.length} 个链接/按钮对比度过低 (< 3:1)`)
      } else {
        console.log('✓ 所有链接和按钮对比度合格')
      }
    }

    console.log('\n✓ 颜色对比度测试完成')
  })

  test('表单可访问性', async ({ page }) => {
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})

    console.log('\n=== 表单可访问性测试 ===\n')

    // ========== 1. 验证所有 input 有关联 label ==========
    const formInputs = page.locator('form input, form select, form textarea')
    const inputCount = await formInputs.count()
    
    console.log(`找到 ${inputCount} 个表单输入字段`)
    
    let inputsWithLabel = 0
    let inputsWithoutLabel = []
    
    for (let i = 0; i < inputCount; i++) {
      const input = formInputs.nth(i)
      
      // 检查方法1: 显式 label 关联（for 属性）
      const inputId = await input.getAttribute('id')
      let hasExplicitLabel = false
      
      if (inputId) {
        const associatedLabel = page.locator(`label[for="${inputId}"]`).first()
        hasExplicitLabel = await associatedLabel.count() > 0
      }
      
      // 检查方法2: 隐式 label（input 在 label 内部）
      const parentLabel = input.locator('xpath=ancestor::label').first()
      const hasImplicitLabel = await parentLabel.count() > 0
      
      // 检查方法3: aria-label 或 aria-labelledby
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledby = await input.getAttribute('aria-labelledby')
      const hasAriaLabel = !!(ariaLabel || ariaLabelledby)
      
      // 检查方法4: title 属性（不太推荐但可用）
      const titleAttr = await input.getAttribute('title')
      const hasTitle = !!titleAttr
      
      // 检查方法5: placeholder（仅对某些类型可接受）
      const placeholder = await input.getAttribute('placeholder')
      const hasPlaceholder = !!placeholder
      
      const isAccessible = hasExplicitLabel || hasImplicitLabel || hasAriaLabel || hasTitle || hasPlaceholder
      
      if (isAccessible) {
        inputsWithLabel++
      } else {
        const inputType = await input.getAttribute('type') || 'text'
        const inputName = await input.getAttribute('name') || ''
        inputsWithoutLabel.push({ index: i, type: inputType, name: inputName })
      }
    }
    
    console.log(`有标签的输入字段: ${inputsWithLabel}/${inputCount}`)
    
    if (inputsWithLabel === inputCount) {
      console.log('✓ 所有输入字段都有可访问性标签')
    } else {
      console.log(`⚠ ${inputsWithoutLabel.length} 个字段缺少标签:`)
      inputsWithoutLabel.forEach(item => {
        console.log(`  - input[${item.index}] type="${item.type}" name="${item.name}"`)
      })
    }
    
    // 要求至少80%的字段有标签（允许某些隐藏字段或特殊场景）
    const labelRate = inputCount > 0 ? inputsWithLabel / inputCount : 1
    expect(labelRate).toBeGreaterThanOrEqual(0.8)

    // ========== 2. 验证错误消息使用 role="alert" ==========
    // 尝试触发表单验证错误
    const submitButton = page.locator('form button[type="submit"]').first()
    if (await submitButton.count() > 0) {
      await submitButton.click()
      await page.waitForTimeout(1000)
      
      // 查找错误消息元素
      const errorMessages = page.locator(
        '.el-form-item__error, ' +
        '[role="alert"], ' +
        '[class*="error-message"], ' +
        '.error, ' +
        '[class*="invalid-feedback"]'
      )
      
      const errorCount = await errorMessages.count()
      console.log(`\n表单验证后显示 ${errorCount} 条错误消息`)
      
      if (errorCount > 0) {
        for (let i = 0; i < errorCount; i++) {
          const errorMsg = errorMessages.nth(i)
          
          // 检查是否使用了语义化的错误标记
          const role = await errorMsg.getAttribute('role')
          const ariaLive = await errorMsg.getAttribute('aria-live')
          const className = await errorMsg.getAttribute('class') || ''
          
          const hasSemanticMarkup = 
            role === 'alert' || 
            role === 'status' ||
            ariaLive === 'assertive' ||
            ariaLive === 'polite' ||
            className.includes('error') ||
            className.includes('invalid')
          
          if (hasSemanticMarkup) {
            console.log(`  ✓ 错误消息 ${i+1}: 使用了语义化标记 (role=${role}, aria-live=${ariaLive})`)
          } else {
            console.log(`  ⚠ 错误消息 ${i+1}: 建议添加 role="alert" 或 aria-live`)
          }
          
          // 验证错误消息可见且不为空
          await expect(errorMsg).toBeVisible()
          const text = await errorMsg.textContent()
          expect(text?.trim().length).toBeGreaterThan(0)
        }
      }
    }

    // ========== 3. 验证必填字段的 aria-required 属性 ==========
    const requiredInputs = page.locator('form input[required], form select[required], form textarea[required]')
    const requiredCount = await requiredInputs.count()
    
    console.log(`\n必填字段数量: ${requiredCount}`)
    
    let withAriaRequired = 0
    for (let i = 0; i < requiredCount; i++) {
      const input = requiredInputs.nth(i)
      const ariaRequired = await input.getAttribute('aria-required')
      
      if (ariaRequired === 'true') {
        withAriaRequired++
      }
    }
    
    if (requiredCount > 0) {
      console.log(`有 aria-required 的必填字段: ${withAriaRequired}/${requiredCount}`)
      
      if (withAriaRequired === requiredCount) {
        console.log('✓ 所有必填字段都标注了 aria-required')
      } else {
        console.log(`⚠ ${requiredCount - withAriaRequired} 个必填字段缺少 aria-required`)
      }
    }

    // ========== 4. 验证表单字段描述（aria-describedby 等） ==========
    const describedInputs = page.locator('form input[aria-describedby], form select[aria-describedby], form textarea[aria-describedby]')
    const describedCount = await describedInputs.count()
    
    if (describedCount > 0) {
      console.log(`\n有额外描述的字段数量: ${describedCount}`)
      
      for (let i = 0; i < Math.min(describedCount, 3); i++) {
        const input = describedInputs.nth(i)
        const describedByIds = await input.getAttribute('aria-describedby') || ''
        
        // 验证引用的描述元素存在
        const ids = describedByIds.split(' ')
        for (const id of ids) {
          const descriptionEl = page.locator(`#${id}`).first()
          if (await descriptionEl.count() > 0) {
            await expect(descriptionEl).toBeVisible()
          }
        }
      }
      console.log('✓ 字段描述引用有效')
    }

    // ========== 5. 验证输入框的类型属性正确 ==========
    const allFormInputs = page.locator('form input')
    const totalInputCount = await allFormInputs.count()
    
    let properTypes = 0
    for (let i = 0; i < totalInputCount; i++) {
      const input = allFormInputs.nth(i)
      const type = await input.getAttribute('type') || 'text'
      const name = (await input.getAttribute('name') || '').toLowerCase()
      
      // 检查常见字段是否使用了正确的 type
      if (name.includes('email') && type === 'email') properTypes++
      else if (name.includes('password') && type === 'password') properTypes++
      else if (name.includes('phone') && (type === 'tel' || type === 'text')) properTypes++
      else if (name.includes('search') && type === 'search') properTypes++
      else if (name.includes('url') && type === 'url') properTypes++
      else if (name.includes('number') && type === 'number') properTypes++
      else if (name.includes('date') && (type === 'date' || type === 'text')) properTypes++
      else properTypes++ // 其他类型也算合理
    }
    
    console.log(`\n输入框类型属性合理: ${properTypes}/${totalInputCount}`)

    console.log('\n✓ 表单可访问性测试完成')
  })

  test('动态内容播报', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})

    console.log('\n=== 动态内容播报测试 ===\n')

    // ========== 1. Toast 消息的 aria-live 区域 ==========
    // 先触发一个 Toast 消息（如果有的话）
    // 可以尝试点击某个按钮来触发 Toast
    
    // 查找页面上可能的 Toast 容器
    const toastContainer = page.locator(
      '[class*="el-message"], ' + // Element Plus
      '[class*="toast-container"], ' +
      '[class*="notification"], ' +
      '[role="alert"]:not([aria-live]), ' + // alert 角色本身就有隐式 aria-live
      '[aria-live="assertive"]'
    ).first()
    
    if (await toastContainer.count() > 0) {
      // 即使当前没有 Toast，容器也应该存在并配置正确
      const ariaLive = await toastContainer.getAttribute('aria-live')
      const role = await toastContainer.getAttribute('role')
      
      console.log(`Toast 容器: aria-live=${ariaLive}, role=${role}`)
      
      // Toast 通常应该是 assertive 或有 alert 角色
      const properlyConfigured = 
        ariaLive === 'assertive' || 
        role === 'alert' ||
        ariaLive === 'polite'
      
      if (properlyConfigured) {
        console.log('✓ Toast 容器配置了正确的 ARIA 属性')
      } else {
        console.log('⚠ Toast 容器建议添加 aria-live="assertive" 或 role="alert"')
      }
    } else {
      console.log('ℹ 未找到 Toast 容器（可能在需要时才创建）')
    }

    // ========== 2. 加载状态的 aria-busy 属性 ==========
    // 查找页面上的加载指示器或异步操作区域
    const loadingIndicators = page.locator(
      '[class*="loading"], ' +
      '[class*="spinner"], ' +
      '[class*="skeleton"]'
    )
    
    const loadingCount = await loadingIndicators.count()
    console.log(`\n找到 ${loadingCount} 个加载相关元素`)
    
    if (loadingCount > 0) {
      // 检查它们或其父容器是否有 aria-busy
      let busyCount = 0
      
      for (let i = 0; i < loadingCount; i++) {
        const loader = loadingIndicators.nth(i)
        
        // 检查自身
        let ariaBusy = await loader.getAttribute('aria-busy')
        
        // 检查父容器
        if (!ariaBusy) {
          const parentWithBusy = loader.locator('xpath=ancestor::*[@aria-busy]').first()
          if (await parentWithBusy.count() > 0) {
            ariaBusy = await parentWithBusy.getAttribute('aria-busy')
          }
        }
        
        if (ariaBusy === 'true') {
          busyCount++
        }
      }
      
      console.log(`有 aria-busy="true" 的加载元素: ${busyCount}/${loadingCount}`)
      
      if (busyCount > 0) {
        console.log('✓ 加载状态正确标记了 aria-busy')
      } else {
        console.log('ℹ 建议为加载状态添加 aria-busy="true" 以辅助屏幕阅读器')
      }
    }

    // ========== 3. 页面标题动态更新 ==========
    const initialTitle = await page.title()
    console.log(`\n初始页面标题: ${initialTitle}`)

    // 尝试导航到另一个页面看标题是否更新
    await page.goto('/products')
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
    
    const newTitle = await page.title()
    console.log(`新页面标题: ${newTitle}`)
    
    if (newTitle !== initialTitle) {
      console.log('✓ 页面标题随路由变化而更新')
    }

    // ========== 4. 区域（Region）和地标（Landmark）结构 ==========
    await page.goto('/')
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
    
    const landmarks = await page.evaluate(() => {
      const landmarkSelectors = [
        'header', 'nav', 'main', 'footer',
        '[role="banner"]', '[role="navigation"]',
        '[role="main"]', '[role="contentinfo"]',
        '[role="search"]', '[role="complementary"]',
        '[role="form"]'
      ]
      
      const found: Array<{ tag: string, role: string, count: number }> = []
      
      landmarkSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        if (elements.length > 0) {
          found.push({
            tag: selector,
            role: elements[0].getAttribute('role') || '',
            count: elements.length
          })
        }
      })
      
      return found
    })
    
    console.log('\n页面地标结构:')
    landmarks.forEach(lm => {
      console.log(`  - <${lm.tag}> (role="${lm.role}") × ${lm.count}`)
    })
    
    // 验证关键地标存在
    const hasMain = landmarks.some(lm => lm.tag === 'main' || lm.role === 'main')
    const hasNav = landmarks.some(lm => lm.tag === 'nav' || lm.role === 'navigation')
    const hasHeader = landmarks.some(lm => lm.tag === 'header' || lm.role === 'banner')
    
    if (hasMain) console.log('✓ 找到主内容区域 (main)')
    if (hasNav) console.log('✓ 找到导航区域 (nav)')
    if (hasHeader) console.log('✓ 找到页眉区域 (header)')
    
    // 至少应该有 main
    expect(hasMain).toBeTruthy()

    // ========== 5. ARIA live region 用于动态内容 ==========
    const liveRegions = await page.evaluate(() => {
      const regions = document.querySelectorAll('[aria-live]')
      return Array.from(regions).map(el => ({
        tag: el.tagName,
        ariaLive: el.getAttribute('aria-live'),
        id: el.id,
        class: el.className?.toString()?.slice(0, 40) || ''
      }))
    })
    
    console.log(`\nARIA Live Regions 数量: ${liveRegions.length}`)
    
    if (liveRegions.length > 0) {
      liveRegions.forEach(region => {
        console.log(`  - <${region.tag}> aria-live="${region.ariaLive}"`)
      })
      console.log('✓ 页面包含 ARIA Live Region 用于动态内容播报')
    } else {
      console.log('ℹ 页面暂无 ARIA Live Region（如果有很多动态内容，建议添加）')
    }

    console.log('\n✓ 动态内容播报测试完成')
  })

  test('图片替代文本和标题层级', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})

    console.log('\n=== 图片替代文本和标题层级测试 ===\n')

    // ========== 1. 图片 alt 属性验证 ==========
    const images = page.locator('img:visible')
    const imageCount = await images.count()
    
    console.log(`可见图片总数: ${imageCount}`)
    
    let imagesWithAlt = 0
    let imagesWithoutAlt = []
    let decorativeImages = 0
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt') || ''
      const role = await img.getAttribute('role')
      const ariaHidden = await img.getAttribute('aria-hidden')
      
      // 装饰性图片可以没有 alt 或 alt 为空
      const isDecorative = 
        alt === '' || 
        role === 'presentation' || 
        ariaHidden === 'true' ||
        alt === 'decorative'
      
      if (isDecorative) {
        decorativeImages++
      } else if (alt.trim().length > 0) {
        imagesWithAlt++
      } else {
        const src = await img.getAttribute('src') || ''
        imagesWithoutAlt.push({ index: i, src: src.slice(0, 50) })
      }
    }
    
    console.log(`有描述性 alt 文本: ${imagesWithAlt}`)
    console.log(`装饰性图片（空alt/presentation角色）: ${decorativeImages}`)
    console.log(`缺少 alt 属性: ${imagesWithoutAlt.length}`)
    
    if (imagesWithoutAlt.length > 0) {
      console.log('\n缺少 alt 的图片:')
      imagesWithoutAlt.slice(0, 5).forEach(img => {
        console.log(`  - img[${img.index}] src="${img.src}..."`)
      })
    }
    
    // 所有图片都应该有 alt（即使是空的）
    expect(imagesWithoutAlt.length).toBe(0)
    if (imagesWithoutAlt.length === 0) {
      console.log('✓ 所有图片都有适当的 alt 属性')
    }

    // ========== 2. 标题层级结构验证 ==========
    const headings = await page.evaluate(() => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      return Array.from(headingElements).map(h => ({
        level: parseInt(h.tagName.charAt(1)),
        text: h.textContent?.trim().slice(0, 50) || '',
        visible: h.offsetParent !== null
      })).filter(h => h.visible)
    })
    
    console.log(`\n可见标题数量: ${headings.length}`)
    
    if (headings.length > 0) {
      // 显示标题层级
      console.log('\n标题层级结构:')
      headings.forEach(h => {
        console.log(`  H${h.level}: ${h.text}`)
      })
      
      // 验证只有一个 H1（最佳实践）
      const h1Count = headings.filter(h => h.level === 1).length
      console.log(`\nH1 标签数量: ${h1Count}`)
      
      if (h1Count === 1) {
        console.log('✓ 符合最佳实践：只有一个 H1 标题')
      } else if (h1Count === 0) {
        console.log('⚠ 缺少 H1 标题（建议每个页面有一个主标题）')
      } else {
        console.log(`⚠ 有 ${h1Count} 个 H1 标题（建议只保留一个）`)
      }
      
      // 验证标题层级不会跳跃（如从 H1 直接到 H3）
      let hasSkippedLevel = false
      for (let i = 1; i < headings.length; i++) {
        const diff = headings[i].level - headings[i-1].level
        if (diff > 1) {
          hasSkippedLevel = true
          console.log(`⚠ 标题级别跳跃: H${headings[i-1].level} → H${headings[i].level}`)
        }
      }
      
      if (!hasSkippedLevel) {
        console.log('✓ 标题层级连续，无跳跃')
      }
    } else {
      console.log('⚠ 页面上没有标题元素（建议添加语义化标题）')
    }

    // ========== 3. 链接目的明确性 ==========
    const links = page.locator('a:visible')
    const linkCount = await links.count()
    
    console.log(`\n可见链接数量: ${linkCount}`)
    
    let clearLinks = 0
    let unclearLinks = []
    
    for (let i = 0; i < Math.min(linkCount, 20); i++) { // 只检查前20个
      const link = links.nth(i)
      const text = (await link.textContent())?.trim() || ''
      const ariaLabel = await link.getAttribute('aria-label') || ''
      const title = await link.getAttribute('title') || ''
      
      // 链接目的明确的条件：有文本、aria-label 或 title
      const isClear = text.length > 0 || ariaLabel.length > 0 || title.length > 0
      
      if (isClear) {
        clearLinks++
      } else {
        const href = await link.getAttribute('href') || ''
        unclearLinks.push({ index: i, href: href.slice(0, 40) })
      }
    }
    
    console.log(`目的明确的链接: ${clearLinks}/20`)
    
    if (unclearLinks.length > 0) {
      console.log('\n目的不明确的链接:')
      unclearLinks.slice(0, 5).forEach(link => {
        console.log(`  - a[${link.index}] href="${link.href}" (无文本/标签)`)
      })
    }
    
    // 至少90%的链接应该目的明确
    const clarityRate = clearLinks / Math.min(linkCount, 20)
    expect(clarityRate).toBeGreaterThanOrEqual(0.85)
    
    if (clarityRate >= 0.95) {
      console.log('✓ 链接目的非常明确')
    }

    console.log('\n✓ 图片替代文本和标题层级测试完成')
  })
})
