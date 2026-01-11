/**
 * 测试环境设置文件
 */

import { vi } from 'vitest'

// 模拟 Element Plus 的 CSS 导入，避免测试时处理 CSS 文件
vi.mock('element-plus/dist/index.css', () => ({}))
vi.mock('element-plus/theme-chalk/base.css', () => ({}))

// 模拟其他可能导致问题的 CSS 导入
vi.mock('element-plus/theme-chalk/icon.css', () => ({}))

// 设置全局变量
globalThis.__DEV__ = true
globalThis.__VUE_OPTIONS_API__ = false
globalThis.__VUE_PROD_DEVTOOLS__ = false
