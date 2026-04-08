/**
 * Mock 数据系统工具函数
 *
 * 功能：
 * 1. Mock 开关控制（通过环境变量或 URL 参数启用/禁用）
 * 2. 延迟模拟（模拟网络延迟）
 * 3. 数据随机化（生成不同的测试数据）
 * 4. Mock API 拦截器配置
 */

// ============================================
// 类型定义
// ============================================

export interface MockConfig {
  /** 是否启用 Mock */
  enabled: boolean
  /** 模拟延迟时间（毫秒） */
  delay: number
  /** 是否启用数据随机化 */
  randomize: boolean
  /** 是否在控制台输出日志 */
  logRequests: boolean
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  total?: number
}

export interface ApiResponse<T = any> {
  code: number
  success: boolean
  message?: string
  data: T
}

// ============================================
// 配置管理
// ============================================

const DEFAULT_CONFIG: MockConfig = {
  enabled: true,
  delay: 200,
  randomize: true,
  logRequests: true,
}

let currentConfig: MockConfig = { ...DEFAULT_CONFIG }

/**
 * 检查是否应该启用 Mock
 * 优先级：环境变量 > URL 参数 > 默认值
 */
export function isMockEnabled(): boolean {
  // 1. 检查环境变量
  if (import.meta.env?.VITE_MOCK_ENABLED === 'false') {
    return false
  }

  // 2. 检查 URL 参数
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const mockParam = urlParams.get('mock')
    if (mockParam === '0' || mockParam === 'false') {
      return false
    }
    if (mockParam === '1' || mockParam === 'true') {
      return true
    }
  }

  // 3. 根据环境判断：开发环境默认启用，生产环境默认禁用
  const isDev = import.meta.env?.DEV ?? true
  return isDev ? true : false
}

/**
 * 获取当前 Mock 配置
 */
export function getMockConfig(): MockConfig {
  return { ...currentConfig }
}

/**
 * 更新 Mock 配置
 */
export function updateMockConfig(config: Partial<MockConfig>): void {
  currentConfig = { ...currentConfig, ...config }

  if (currentConfig.logRequests) {
    console.log('[Mock] Config updated:', currentConfig)
  }
}

// ============================================
// 延迟模拟
// ============================================

/**
 * 模拟网络延迟
 * @param ms 延迟毫秒数，默认使用配置中的延迟时间
 */
export async function simulateDelay(ms?: number): Promise<void> {
  const delay = ms ?? currentConfig.delay

  // 随机波动 +/- 30%，让延迟更真实
  const actualDelay = currentConfig.randomize
    ? delay + Math.floor(Math.random() * delay * 0.6 - delay * 0.3)
    : delay

  await new Promise((resolve) => setTimeout(resolve, Math.max(50, actualDelay)))
}

/**
 * 创建带延迟的响应
 */
export async function createDelayedResponse<T>(data: T, delayMs?: number): Promise<T> {
  await simulateDelay(delayMs)
  return data
}

// ============================================
// 数据随机化工具
// ============================================

/** 随机整数 [min, max] */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** 随机浮点数 [min, max]，保留指定小数位 */
export function randomFloat(min: number, max: number, decimals = 2): number {
  const value = Math.random() * (max - min) + min
  return Number(value.toFixed(decimals))
}

/** 从数组中随机选取一个元素 */
export function randomPick<T>(arr: T[]): T | undefined {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** 从数组中随机选取 n 个元素 */
export function randomPickMultiple<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, arr.length))
}

/** 随机布尔值 */
export function randomBoolean(probability = 0.5): boolean {
  return Math.random() < probability
}

/** 随机日期（最近 N 天内） */
export function randomRecentDate(days = 30): string {
  const now = new Date()
  const past = new Date(now.getTime() - randomInt(0, days * 24 * 60 * 60 * 1000))
  return past.toISOString()
}

/** 随机未来日期（未来 N 天内） */
export function randomFutureDate(days = 30): string {
  const now = new Date()
  const future = new Date(now.getTime() + randomInt(1, days * 24 * 60 * 60 * 1000))
  return future.toISOString().split('T')[0]
}

/** 生成随机 ID */
export function generateId(prefix = '', length = 8): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 2 + length)
  return prefix + timestamp + randomStr
}

/** 随机手机号 */
export function randomPhone(): string {
  const prefixes = ['138', '139', '137', '136', '135', '158', '159', '188', '189']
  return randomPick(prefixes)! + String(randomInt(10000000, 99999999))
}

/** 随机姓名 */
export function randomName(): string {
  const surnames = ['张', '王', '李', '刘', '陈', '杨', '赵', '黄', '周', '吴']
  const names = ['伟', '芳', '娜', '敏', '静', '强', '磊', '洋', '艳', '勇', '军', '杰', '涛', '明', '超']
  return randomPick(surnames)! + randomPick(names)!
}

/** 黑龙江科技大学特色随机数据 */
export const HLJUST_MOCK_DATA = {
  /** 学院列表 */
  departments: [
    '计算机学院',
    '机械工程学院',
    '电气与信息工程学院',
    '矿业工程学院',
    '安全工程学院',
    '经济学院',
    '管理学院',
    '外国语学院',
    '理学院',
    '人文社会科学学院',
    '马克思主义学院',
    '建筑工程学院',
  ],

  /** 专业列表 */
  majors: [
    '软件工程',
    '计算机科学与技术',
    '人工智能',
    '数据科学',
    '网络工程',
    '物联网工程',
    '电子信息工程',
    '自动化',
    '机械设计制造及其自动化',
    '采矿工程',
    '安全工程',
    '会计学',
    '工商管理',
    '英语',
    '数学与应用数学',
  ],

  /** 宿舍楼栋 */
  dormitories: [
    '学生公寓A栋',
    '学生公寓B栋',
    '学生公寓C栋',
    '学生公寓D栋',
    '研究生公寓1号楼',
  ],

  /** 教学楼 */
  buildings: [
    '主楼',
    '实验楼',
    '外语楼',
    '图书馆',
    '体育馆',
    '大学生活动中心',
    '行政楼',
  ],

  /** 校园地点 */
  locations: [
    '图书馆三楼自习室',
    '主楼A301教室',
    '实验楼B205机房',
    '体育馆篮球场',
    '食堂一楼',
    '校园商业街',
    '镜湖畔',
    '操场跑道',
    '学生公寓A区宿舍',
    '校门口',
  ],

  /** 商家名称（黑科大周边） */
  merchantNames: [
    '科大食堂一楼',
    '蜜雪冰城(科大店)',
    '杨国福麻辣烫',
    '沙县小吃',
    '瑞幸咖啡(科大店)',
    '黄焖鸡米饭',
    '兰州拉面',
    '张亮麻辣烫',
    '正新鸡排',
    '一点点奶茶',
  ],
}

// ============================================
// 分页处理
// ============================================

/**
 * 处理分页逻辑
 */
export function paginate<T>(
  list: T[],
  page = 1,
  pageSize = 10
): { list: T[]; total: number; page: number; pageSize: number; totalPages: number } {
  const total = list.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    list: list.slice(start, end),
    total,
    page,
    pageSize,
    totalPages,
  }
}

// ============================================
// API 响应构建器
// ============================================

/**
 * 构建成功响应
 */
export function successResponse<T>(data: T, message = '操作成功'): ApiResponse<T> {
  return {
    code: 200,
    success: true,
    message,
    data,
  }
}

/**
 * 构建错误响应
 */
export function errorResponse(message = '操作失败', code = 400, data?: any): ApiResponse {
  return {
    code,
    success: false,
    message,
    data: data ?? null,
  }
}

/**
 * 构建分页响应
 */
export function paginatedResponse<T>(
  list: T[],
  page = 1,
  pageSize = 10,
  message = '查询成功'
): ApiResponse<{
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}> {
  const result = paginate(list, page, pageSize)
  return successResponse(result, message)
}

// ============================================
// 日志工具
// ============================================

/**
 * 输出 Mock 请求日志
 */
export function logRequest(method: string, url: string, data?: any): void {
  if (!currentConfig.logRequests) return

  const style = 'color: #0066cc; font-weight: bold'
  console.groupCollapsed(`%c[Mock] ${method} ${url}`, style)
  if (data) {
    console.log('Request Data:', data)
  }
  console.groupEnd()
}

/**
 * 输出 Mock 响应日志
 */
export function logResponse(url: string, response: any): void {
  if (!currentConfig.logRequests) return

  const style = 'color: #009966; font-weight: bold'
  console.log(`%c[Mock Response] ${url}`, style, response)
}

// ============================================
// 初始化
// ============================================

/**
 * 初始化 Mock 系统
 */
export function initMockSystem(): void {
  const enabled = isMockEnabled()
  currentConfig.enabled = enabled

  if (enabled && currentConfig.logRequests) {
    console.log(
      '%c[Mock System] Initialized',
      'color: green; font-size: 14px; font-weight: bold;',
      '\n- Enabled:',
      enabled,
      '\n- Delay:',
      currentConfig.delay,
      'ms\n- Randomize:',
      currentConfig.randomize,
      '\n\nTips:\n- Add ?mock=0 to URL to disable mock\n- Set VITE_MOCK_ENABLED=false in .env to disable'
    )
  }
}

// 自动初始化（仅在浏览器环境中）
if (typeof window !== 'undefined') {
  initMockSystem()
}

// 导出默认配置
export { DEFAULT_CONFIG }
