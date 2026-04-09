/**
 * 黑科大商城 - Mock 数据管理器
 *
 * 本文件提供完整的开发环境模拟数据，包含所有业务模块
 * 使用场景：前端开发、测试、演示
 *
 * 注意：生产环境请移除此文件或禁用 mock 拦截器
 */

// import { MockMethod } from 'vite-plugin-mock' // 已禁用：模块未安装

// ==================== 本地类型定义 ====================

/** Mock 方法配置（简化版，兼容 vite-plugin-mock） */
interface MockMethod {
  url: string
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch'
  response: ((...args: any[]) => any)
}

// ==================== 类型定义 ====================

/** 商品分类 */
interface Category {
  id: string
  name: string
  icon: string
  description?: string
}

/** 商品信息 */
interface Product {
  id: string
  name: string
  categoryId: string
  price: number
  originalPrice: number
  image: string
  images: string[]
  description: string
  detail: string
  stock: number
  sales: number
  rating: number
  reviewCount: number
  status: 'on_sale' | 'off_sale' | 'out_of_stock'
  tags: string[]
  createdAt: string
  updatedAt: string
}

/** 订单状态 */
type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunding'

/** 订单项 */
interface OrderItem {
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  subtotal: number
}

/** 订单信息 */
interface Order {
  id: string
  orderNo: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  discountAmount: number
  freightAmount: number
  payAmount: number
  status: OrderStatus
  paymentMethod?: string
  paymentTime?: string
  shipTime?: string
  deliverTime?: string
  completeTime?: string
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  remark?: string
  createdAt: string
  updatedAt: string
}

/** 购物车项 */
interface CartItem {
  id: string
  userId: string
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  selected: boolean
  stock: number
  addedAt: string
  updatedAt: string
}

/** 用户信息 */
interface User {
  id: string
  username: string
  nickname: string
  avatar: string
  email: string
  phone: string
  gender: 'male' | 'female'
  birthday?: string
  studentId: string
  college: string
  major: string
  grade: string
  role: 'user' | 'admin' | 'merchant'
  status: 'active' | 'inactive' | 'banned'
  balance: number
  points: number
  level: number
  createdAt: string
  updatedAt: string
}

/** 收货地址 */
interface Address {
  id: string
  userId: string
  receiverName: string
  receiverPhone: string
  province: string
  city: string
  district: string
  detail: string
  fullAddress: string
  isDefault: boolean
  tag?: string
  createdAt: string
}

/** 外卖商家 */
interface Merchant {
  id: string
  name: string
  logo: string
  coverImage: string
  category: string
  rating: number
  reviewCount: number
  monthlySales: number
  deliveryTime: string
  deliveryFee: number
  minOrderAmount: number
  address: string
  phone: string
  openTime: string
  closeTime: string
  status: 'open' | 'closed' | 'busy'
  tags: string[]
  announcement?: string
  latitude: number
  longitude: number
  distance: number
}

/** 菜品 */
interface Dish {
  id: string
  merchantId: string
  name: string
  image: string
  price: number
  originalPrice?: number
  description: string
  category: string
  sales: number
  rating: number
  status: 'available' | 'sold_out' | 'unavailable'
  tags: string[]
}

/** 二手物品分类 */
interface SecondHandCategory {
  id: string
  name: string
  icon: string
  count: number
}

/** 二手物品 */
interface SecondHandItem {
  id: string
  sellerId: string
  sellerName: string
  sellerAvatar: string
  title: string
  description: string
  images: string[]
  categoryId: string
  categoryName: string
  originalPrice: number
  currentPrice: number
  condition: 'brand_new' | 'almost_new' | 'lightly_used' | 'moderately_used' | 'heavily_used'
  conditionText: string
  negotiable: boolean
  location: string
  viewCount: number
  likeCount: number
  chatCount: number
  status: 'on_sale' | 'reserved' | 'sold' | 'removed'
  createdAt: string
  updatedAt: string
}

/** 论坛板块 */
interface ForumBoard {
  id: string
  name: string
  description: string
  icon: string
  postCount: number
  todayPostCount: number
  sortOrder: number
}

/** 帖子 */
interface ForumPost {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  boardId: string
  boardName: string
  title: string
  content: string
  images: string[]
  viewCount: number
  likeCount: number
  commentCount: number
  isTop: boolean
  isEssence: boolean
  status: 'published' | 'draft' | 'deleted' | 'hidden'
  createdAt: string
  updatedAt: string
  lastReplyAt?: string
}

/** 社区活动 */
interface Activity {
  id: string
  title: string
  coverImage: string
  description: string
  category: 'sports' | 'culture' | 'academic' | 'volunteer' | 'entertainment' | 'career'
  organizer: string
  location: string
  startTime: string
  endTime: string
  maxParticipants: number
  currentParticipants: number
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  fee: number
  tags: string[]
  registrants?: Array<{
    userId: string
    userName: string
    userAvatar: string
    registeredAt: string
  }>
  createdAt: string
  updatedAt: string
}

/** 分页请求参数 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface _PageParams {
  page: number
  pageSize: number
}

/** 通用分页响应 */
interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/** API 统一响应格式 */
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

// ==================== 工具函数 ====================

/**
 * 生成延迟，模拟网络请求耗时
 * @param ms 延迟毫秒数，默认 200-500ms 随机
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _delay(ms?: number): Promise<void> {
  const time = ms ?? Math.floor(Math.random() * 300) + 200
  return new Promise(resolve => setTimeout(resolve, time))
}

/**
 * 生成分页结果
 * @param data 完整数据数组
 * @param page 当前页码
 * @param pageSize 每页数量
 */
function paginate<T>(data: T[], page: number, pageSize: number): PageResult<T> {
  const total = data.length
  const totalPages = Math.ceil(total / pageSize)
  const startIndex = (page - 1) * pageSize
  const list = data.slice(startIndex, startIndex + pageSize)

  return {
    list,
    total,
    page,
    pageSize,
    totalPages
  }
}

/**
 * 生成统一成功响应
 */
function successResponse<T>(data: T): ApiResponse<T> {
  return {
    code: 200,
    message: 'success',
    data,
    timestamp: Date.now()
  }
}

/**
 * 生成订单编号
 */
function generateOrderNo(): string {
  const now = new Date()
  const dateStr = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
  return `HK${dateStr}${random}`
}

// ==================== 商品模块数据 ====================

/** 商品分类数据 */
const categories: Category[] = [
  { id: 'cat1', name: '数码电子', icon: 'laptop', description: '手机、电脑、平板等电子设备' },
  { id: 'cat2', name: '图书文具', icon: 'book', description: '教材、参考书、文具用品' },
  { id: 'cat3', name: '生活日用', icon: 'home', description: '日用品、收纳、清洁用品' },
  { id: 'cat4', name: '运动户外', icon: 'basketball', description: '运动装备、户外用品' },
  { id: 'cat5', name: '食品饮料', icon: 'coffee', description: '零食、饮料、特产' }
]

/** 商品数据 - 符合黑科大校园场景 */
const products: Product[] = [
  // 数码电子类 (5个)
  {
    id: 'prod001',
    name: '华为 MateBook D14 笔记本电脑',
    categoryId: 'cat1',
    price: 4299,
    originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop'
    ],
    description: '2024款 华为MateBook D14 14英寸轻薄本，适合学习和办公使用',
    detail: '<p><strong>产品特点：</strong></p><ul><li>处理器：AMD R5-7530U</li><li>内存：16GB DDR4</li><li>硬盘：512GB SSD</li><li>屏幕：14英寸 1080P IPS</li><li>续航：约8小时</li></ul>',
    stock: 15,
    sales: 128,
    rating: 4.8,
    reviewCount: 56,
    status: 'on_sale',
    tags: ['笔记本', '华为', '学生优惠'],
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-20T08:30:00Z'
  },
  {
    id: 'prod002',
    name: '小米 Redmi Note 13 Pro 手机',
    categoryId: 'cat1',
    price: 1599,
    originalPrice: 1899,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop'
    ],
    description: 'Redmi Note 13 Pro 5G手机，1亿像素主摄，性价比之选',
    detail: '<p>搭载骁龙7s Gen2处理器，6.67英寸OLED屏幕，5100mAh大电池，67W快充</p>',
    stock: 32,
    sales: 256,
    rating: 4.6,
    reviewCount: 128,
    status: 'on_sale',
    tags: ['手机', '小米', '5G'],
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-04-01T12:00:00Z'
  },
  {
    id: 'prod003',
    name: 'iPad 第10代 64GB WiFi版',
    categoryId: 'cat1',
    price: 2799,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop'
    ],
    description: 'Apple iPad 第10代，10.9英寸 Liquid Retina显示屏',
    detail: '<p>A14仿生芯片，支持Apple Pencil（第一代），全天候电池续航</p>',
    stock: 8,
    sales: 89,
    rating: 4.9,
    reviewCount: 45,
    status: 'on_sale',
    tags: ['平板', '苹果', '学习神器'],
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-03-25T14:20:00Z'
  },
  {
    id: 'prod004',
    name: '罗技 MX Master 3S 无线鼠标',
    categoryId: 'cat1',
    price: 599,
    originalPrice: 749,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop'
    ],
    description: '专业级无线鼠标，MagSpeed电磁滚轮，7000 DPI传感器',
    detail: '<p>静音点击，多设备连接，USB-C快充，70天超长续航</p>',
    stock: 45,
    sales: 167,
    rating: 4.7,
    reviewCount: 92,
    status: 'on_sale',
    tags: ['鼠标', '罗技', '办公外设'],
    createdAt: '2026-02-10T15:00:00Z',
    updatedAt: '2026-04-02T09:15:00Z'
  },
  {
    id: 'prod005',
    name: '漫步者 W820NB 头戴式降噪耳机',
    categoryId: 'cat1',
    price: 269,
    originalPrice: 349,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'
    ],
    description: '主动降噪蓝牙耳机，Hi-Res认证音质，50小时长续航',
    detail: '<p>支持LDAC高清音频传输，舒适佩戴设计，适合长时间学习使用</p>',
    stock: 28,
    sales: 203,
    rating: 4.5,
    reviewCount: 78,
    status: 'on_sale',
    tags: ['耳机', '降噪', '蓝牙'],
    createdAt: '2026-02-05T13:30:00Z',
    updatedAt: '2026-03-28T16:45:00Z'
  },

  // 图书文具类 (3个)
  {
    id: 'prod006',
    name: '高等数学（第七版）同济大学',
    categoryId: 'cat2',
    price: 42,
    originalPrice: 49.8,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop'
    ],
    description: '经典高数教材，理工科学生必备',
    detail: '<p>高等教育出版社权威出版，内容全面系统，例题丰富详尽</p>',
    stock: 120,
    sales: 567,
    rating: 4.9,
    reviewCount: 234,
    status: 'on_sale',
    tags: ['教材', '数学', '考研必备'],
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-04-05T10:00:00Z'
  },
  {
    id: 'prod007',
    name: '三菱 Uni-ball One 中性笔套装（10支装）',
    categoryId: 'cat2',
    price: 35,
    originalPrice: 45,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&h=800&fit=crop'
    ],
    description: '日本进口中性笔，墨水不洇纸，书写顺滑',
    detail: '<p>0.5mm子弹头，黑色墨水，适合考试和日常笔记使用</p>',
    stock: 200,
    sales: 890,
    rating: 4.8,
    reviewCount: 356,
    status: 'on_sale',
    tags: ['笔', '文具', '考试用笔'],
    createdAt: '2026-01-10T09:30:00Z',
    updatedAt: '2026-04-03T11:20:00Z'
  },
  {
    id: 'prod008',
    name: '国誉 Kokuyo 活页本 B5（5本装）',
    categoryId: 'cat2',
    price: 58,
    originalPrice: 72,
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&h=800&fit=crop'
    ],
    description: '日本国誉活页本，可换芯设计，耐用实用',
    detail: '<p>B5尺寸，26孔活页夹，含80张横线内页，可自由增减纸张</p>',
    stock: 85,
    sales: 423,
    rating: 4.7,
    reviewCount: 178,
    status: 'on_sale',
    tags: ['笔记本', '活页本', '国誉'],
    createdAt: '2026-01-18T10:15:00Z',
    updatedAt: '2026-03-30T14:00:00Z'
  },

  // 生活日用工 (2个)
  {
    id: 'prod009',
    name: '南极人 四件套床上用品（被套+床单+枕套x2）',
    categoryId: 'cat3',
    price: 168,
    originalPrice: 258,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=800&fit=crop'
    ],
    description: '宿舍必备四件套，纯棉材质，亲肤透气',
    detail: '<p>适用1.2m/1.5m床，全棉斜纹面料，活性印染不易褪色</p>',
    stock: 36,
    sales: 289,
    rating: 4.6,
    reviewCount: 145,
    status: 'on_sale',
    tags: ['床品', '宿舍', '纯棉'],
    createdAt: '2026-01-25T11:00:00Z',
    updatedAt: '2026-03-22T09:30:00Z'
  },
  {
    id: 'prod010',
    name: '公牛 插排 GN-B304U 4位USB插座',
    categoryId: 'cat3',
    price: 39,
    originalPrice: 59,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=800&fit=crop'
    ],
    description: '安全插座，带USB充电口，宿舍神器',
    detail: '<p>4位插孔+3USB接口，1.8米线长，过载保护，阻燃材料</p>',
    stock: 150,
    sales: 678,
    rating: 4.8,
    reviewCount: 289,
    status: 'on_sale',
    tags: ['插排', 'USB充电', '宿舍必备'],
    createdAt: '2026-01-08T08:30:00Z',
    updatedAt: '2026-04-04T15:00:00Z'
  },

  // 运动户外类 (2个)
  {
    id: 'prod011',
    name: '李宁 羽毛球拍 单拍（已穿线）',
    categoryId: 'cat4',
    price: 129,
    originalPrice: 199,
    image: 'https://images.unsplash.com/photo-1622290291468-28e9ecdcade1?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1622290291468-28e9ecdcade1?w=800&h=800&fit=crop'
    ],
    description: '全碳素羽毛球拍，轻量化设计，攻守兼备',
    detail: '<p>重量约85g，已穿24磅线，送拍套和手胶，适合初学者到进阶玩家</p>',
    stock: 42,
    sales: 156,
    rating: 4.5,
    reviewCount: 67,
    status: 'on_sale',
    tags: ['羽毛球', '运动器材', '健身'],
    createdAt: '2026-02-08T14:00:00Z',
    updatedAt: '2026-03-27T10:30:00Z'
  },
  {
    id: 'prod012',
    name: '迪卡侬 双肩背包 20L 运动休闲',
    categoryId: 'cat4',
    price: 79,
    originalPrice: 99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop'
    ],
    description: '轻便双肩包，多功能隔层，防水面料',
    detail: '<p>20L容量，电脑仓可放14寸笔记本，反光条设计，夜跑安全</p>',
    stock: 68,
    sales: 234,
    rating: 4.4,
    reviewCount: 98,
    status: 'on_sale',
    tags: ['背包', '运动', '通勤'],
    createdAt: '2026-02-12T09:45:00Z',
    updatedAt: '2026-03-29T16:00:00Z'
  },

  // 食品饮料类 (3个)
  {
    id: 'prod013',
    name: '三只松鼠 坚果礼盒 1kg装',
    categoryId: 'cat5',
    price: 69,
    originalPrice: 99,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&h=800&fit=crop'
    ],
    description: '混合坚果礼盒，每日坚果营养均衡',
    detail: '<p>含腰果、巴旦木、核桃、榛子等8种坚果，独立小包装，方便携带</p>',
    stock: 95,
    sales: 445,
    rating: 4.7,
    reviewCount: 198,
    status: 'on_sale',
    tags: ['零食', '坚果', '健康食品'],
    createdAt: '2026-01-22T10:00:00Z',
    updatedAt: '2026-04-01T08:45:00Z'
  },
  {
    id: 'prod014',
    name: '元气森林 白桃气泡水 480ml*15瓶整箱',
    categoryId: 'cat5',
    price: 52,
    originalPrice: 65,
    image: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=800&h=800&fit=crop'
    ],
    description: '0糖0脂0卡气泡水，白桃味清爽解腻',
    detail: '<p>赤藓糖醇代糖，真实果汁添加，气泡口感，夏日必备饮品</p>',
    stock: 180,
    sales: 789,
    rating: 4.6,
    reviewCount: 345,
    status: 'on_sale',
    tags: ['饮料', '气泡水', '0糖'],
    createdAt: '2026-01-05T09:00:00Z',
    updatedAt: '2026-04-05T12:30:00Z'
  },
  {
    id: 'prod015',
    name: '哈尔滨红肠 正宗哈肉联 500g*2袋',
    categoryId: 'cat5',
    price: 58,
    originalPrice: 78,
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=800&fit=crop'
    ],
    description: '黑龙江特产哈尔滨红肠，正宗俄式风味',
    detail: '<p>百年老字号哈肉联出品，果木熏烤工艺，肥瘦相间，蒜香浓郁</p>',
    stock: 60,
    sales: 334,
    rating: 4.8,
    reviewCount: 167,
    status: 'on_sale',
    tags: ['特产', '红肠', '东北美食'],
    createdAt: '2026-01-28T11:30:00Z',
    updatedAt: '2026-03-31T14:15:00Z'
  }
]

// ==================== 订单模块数据 ====================

const orders: Order[] = [
  {
    id: 'order001',
    orderNo: generateOrderNo(),
    userId: 'user001',
    items: [
      { productId: 'prod002', productName: '小米 Redmi Note 13 Pro 手机', productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200', price: 1599, quantity: 1, subtotal: 1599 }
    ],
    totalAmount: 1648,
    discountAmount: 0,
    freightAmount: 49,
    payAmount: 1648,
    status: 'completed',
    paymentMethod: 'wechat',
    paymentTime: '2026-03-15T10:30:00Z',
    shipTime: '2026-03-15T14:00:00Z',
    deliverTime: '2026-03-17T10:00:00Z',
    completeTime: '2026-03-18T09:00:00Z',
    receiverName: '张三',
    receiverPhone: '138****8888',
    receiverAddress: '黑龙江省哈尔滨市松北区糖厂街1号 黑龙江科技大学 A区6号楼301室',
    remark: '请在工作时间配送',
    createdAt: '2026-03-15T10:25:00Z',
    updatedAt: '2026-03-18T09:00:00Z'
  },
  {
    id: 'order002',
    orderNo: generateOrderNo(),
    userId: 'user001',
    items: [
      { productId: 'prod007', productName: '三菱 Uni-ball One 中性笔套装', productImage: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=200', price: 35, quantity: 2, subtotal: 70 },
      { productId: 'prod008', productName: '国誉 Kokuyo 活页本 B5', productImage: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200', price: 58, quantity: 3, subtotal: 174 }
    ],
    totalAmount: 244,
    discountAmount: 10,
    freightAmount: 0,
    payAmount: 234,
    status: 'shipped',
    paymentMethod: 'alipay',
    paymentTime: '2026-04-02T14:20:00Z',
    shipTime: '2026-04-03T09:00:00Z',
    receiverName: '张三',
    receiverPhone: '138****8888',
    receiverAddress: '黑龙江省哈尔滨市松北区糖厂街1号 黑龙江科技大学 A区6号楼301室',
    createdAt: '2026-04-02T14:15:00Z',
    updatedAt: '2026-04-03T09:00:00Z'
  },
  {
    id: 'order003',
    orderNo: generateOrderNo(),
    userId: 'user001',
    items: [
      { productId: 'prod006', productName: '高等数学（第七版）同济大学', productImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200', price: 42, quantity: 1, subtotal: 42 }
    ],
    totalAmount: 42,
    discountAmount: 0,
    freightAmount: 0,
    payAmount: 42,
    status: 'paid',
    paymentMethod: 'balance',
    paymentTime: '2026-04-05T16:45:00Z',
    receiverName: '张三',
    receiverPhone: '138****8888',
    receiverAddress: '黑龙江省哈尔滨市松北区糖厂街1号 黑龙江科技大学 图书馆自提点',
    remark: '图书馆自提',
    createdAt: '2026-04-05T16:40:00Z',
    updatedAt: '2026-04-05T16:45:00Z'
  },
  {
    id: 'order004',
    orderNo: generateOrderNo(),
    userId: 'user001',
    items: [
      { productId: 'prod013', productName: '三只松鼠 坚果礼盒 1kg装', productImage: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200', price: 69, quantity: 2, subtotal: 138 },
      { productId: 'prod014', productName: '元气森林 白桃气泡水 整箱', productImage: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=200', price: 52, quantity: 1, subtotal: 52 }
    ],
    totalAmount: 190,
    discountAmount: 15,
    freightAmount: 0,
    payAmount: 175,
    status: 'pending',
    receiverName: '张三',
    receiverPhone: '138****8888',
    receiverAddress: '黑龙江省哈尔滨市松北区糖厂街1号 黑龙江科技大学 A区6号楼301室',
    createdAt: '2026-04-06T20:30:00Z',
    updatedAt: '2026-04-06T20:30:00Z'
  },
  {
    id: 'order005',
    orderNo: generateOrderNo(),
    userId: 'user001',
    items: [
      { productId: 'prod001', productName: '华为 MateBook D14 笔记本电脑', productImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200', price: 4299, quantity: 1, subtotal: 4299 }
    ],
    totalAmount: 4348,
    discountAmount: 200,
    freightAmount: 49,
    payAmount: 4197,
    status: 'delivered',
    paymentMethod: 'wechat',
    paymentTime: '2026-03-20T11:00:00Z',
    shipTime: '2026-03-20T15:00:00Z',
    deliverTime: '2026-03-22T11:30:00Z',
    receiverName: '张三',
    receiverPhone: '138****8888',
    receiverAddress: '黑龙江省哈尔滨市松北区糖厂街1号 黑龙江科技大学 A区6号楼301室',
    createdAt: '2026-03-20T10:50:00Z',
    updatedAt: '2026-03-22T11:30:00Z'
  },
  {
    id: 'order006',
    orderNo: generateOrderNo(),
    userId: 'user001',
    items: [
      { productId: 'prod009', productName: '南极人 四件套床上用品', productImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200', price: 168, quantity: 1, subtotal: 168 }
    ],
    totalAmount: 217,
    discountAmount: 0,
    freightAmount: 49,
    payAmount: 217,
    status: 'cancelled',
    receiverName: '张三',
    receiverPhone: '138****8888',
    receiverAddress: '黑龙江省哈尔滨市松北区糖厂街1号 黑龙江科技大学 A区6号楼301室',
    remark: '不需要了',
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-03-10T18:00:00Z'
  },
  {
    id: 'order007',
    orderNo: generateOrderNo(),
    userId: 'user001',
    items: [
      { productId: 'prod004', productName: '罗技 MX Master 3S 无线鼠标', productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200', price: 599, quantity: 1, subtotal: 599 }
    ],
    totalAmount: 648,
    discountAmount: 50,
    freightAmount: 49,
    payAmount: 598,
    status: 'refunding',
    paymentMethod: 'alipay',
    paymentTime: '2026-04-01T15:00:00Z',
    shipTime: '2026-04-02T10:00:00Z',
    receiverName: '张三',
    receiverPhone: '138****8888',
    receiverAddress: '黑龙江省哈尔滨市松北区糖厂街1号 黑龙江科技大学 A区6号楼301室',
    remark: '鼠标滚轮有问题，申请退货',
    createdAt: '2026-04-01T14:50:00Z',
    updatedAt: '2026-04-04T10:00:00Z'
  },
  {
    id: 'order008',
    orderNo: generateOrderNo(),
    userId: 'user001',
    items: [
      { productId: 'prod011', productName: '李宁 羽毛球拍 单拍', productImage: 'https://images.unsplash.com/photo-1622290291468-28e9ecdcade1?w=200', price: 129, quantity: 2, subtotal: 258 },
      { productId: 'prod012', productName: '迪卡侬 双肩背包 20L', productImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200', price: 79, quantity: 1, subtotal: 79 }
    ],
    totalAmount: 337,
    discountAmount: 20,
    freightAmount: 0,
    payAmount: 317,
    status: 'completed',
    paymentMethod: 'wechat',
    paymentTime: '2026-03-25T13:00:00Z',
    shipTime: '2026-03-25T16:00:00Z',
    deliverTime: '2026-03-27T14:00:00Z',
    completeTime: '2026-03-28T10:00:00Z',
    receiverName: '张三',
    receiverPhone: '138****8888',
    receiverAddress: '黑龙江省哈尔滨市松北区糖厂街1号 黑龙江科技大学 A区6号楼301室',
    createdAt: '2026-03-25T12:50:00Z',
    updatedAt: '2026-03-28T10:00:00Z'
  },
  {
    id: 'order009',
    orderNo: generateOrderNo(),
    userId: 'user001',
    items: [
      { productId: 'prod003', productName: 'iPad 第10代 64GB WiFi版', productImage: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200', price: 2799, quantity: 1, subtotal: 2799 }
    ],
    totalAmount: 2848,
    discountAmount: 100,
    freightAmount: 49,
    payAmount: 2798,
    status: 'shipped',
    paymentMethod: 'alipay',
    paymentTime: '2026-04-04T09:30:00Z',
    shipTime: '2026-04-04T14:00:00Z',
    receiverName: '张三',
    receiverPhone: '138****8888',
    receiverAddress: '黑龙江省哈尔滨市松北区糖厂街1号 黑龙江科技大学 A区6号楼301室',
    createdAt: '2026-04-04T09:20:00Z',
    updatedAt: '2026-04-04T14:00:00Z'
  },
  {
    id: 'order010',
    orderNo: generateOrderNo(),
    userId: 'user001',
    items: [
      { productId: 'prod005', productName: '漫步者 W820NB 头戴式降噪耳机', productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', price: 269, quantity: 1, subtotal: 269 },
      { productId: 'prod015', productName: '哈尔滨红肠 哈肉联 500g*2袋', productImage: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200', price: 58, quantity: 2, subtotal: 116 }
    ],
    totalAmount: 385,
    discountAmount: 0,
    freightAmount: 0,
    payAmount: 385,
    status: 'paid',
    paymentMethod: 'wechat',
    paymentTime: '2026-04-06T11:00:00Z',
    receiverName: '张三',
    receiverPhone: '138****8888',
    receiverAddress: '黑龙江省哈尔滨市松北区糖厂街1号 黑龙江科技大学 A区6号楼301室',
    createdAt: '2026-04-06T10:55:00Z',
    updatedAt: '2026-04-06T11:00:00Z'
  }
]

// ==================== 购物车模块数据 ====================

const cartItems: CartItem[] = [
  {
    id: 'cart001',
    userId: 'user001',
    productId: 'prod014',
    productName: '元气森林 白桃气泡水 480ml*15瓶整箱',
    productImage: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=200',
    price: 52,
    quantity: 2,
    selected: true,
    stock: 180,
    addedAt: '2026-04-05T15:00:00Z',
    updatedAt: '2026-04-05T15:00:00Z'
  },
  {
    id: 'cart002',
    userId: 'user001',
    productId: 'prod013',
    productName: '三只松鼠 坚果礼盒 1kg装',
    productImage: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200',
    price: 69,
    quantity: 1,
    selected: true,
    stock: 95,
    addedAt: '2026-04-05T15:05:00Z',
    updatedAt: '2026-04-05T15:05:00Z'
  },
  {
    id: 'cart003',
    userId: 'user001',
    productId: 'prod007',
    productName: '三菱 Uni-ball One 中性笔套装（10支装）',
    productImage: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=200',
    price: 35,
    quantity: 3,
    selected: false,
    stock: 200,
    addedAt: '2026-04-04T20:00:00Z',
    updatedAt: '2026-04-04T20:00:00Z'
  },
  {
    id: 'cart004',
    userId: 'user001',
    productId: 'prod010',
    productName: '公牛 插排 GN-B304U 4位USB插座',
    productImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200',
    price: 39,
    quantity: 1,
    selected: true,
    stock: 150,
    addedAt: '2026-04-03T10:30:00Z',
    updatedAt: '2026-04-03T10:30:00Z'
  },
  {
    id: 'cart005',
    userId: 'user001',
    productId: 'prod015',
    productName: '哈尔滨红肠 正宗哈肉联 500g*2袋',
    productImage: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200',
    price: 58,
    quantity: 1,
    selected: false,
    stock: 60,
    addedAt: '2026-04-02T16:00:00Z',
    updatedAt: '2026-04-02T16:00:00Z'
  }
]

// ==================== 用户模块数据 ====================

const currentUser: User = {
  id: 'user001',
  username: 'zhangsan2024',
  nickname: '张同学',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  email: 'zhangsan@usth.edu.cn',
  phone: '138****8888',
  gender: 'male',
  birthday: '2003-05-15',
  studentId: '2022010001',
  college: '计算机与信息工程学院',
  major: '软件工程',
  grade: '2022级',
  role: 'user',
  status: 'active',
  balance: 256.80,
  points: 3280,
  level: 3,
  createdAt: '2022-09-01T08:00:00Z',
  updatedAt: '2026-04-06T18:00:00Z'
}

const addresses: Address[] = [
  {
    id: 'addr001',
    userId: 'user001',
    receiverName: '张三',
    receiverPhone: '13812348888',
    province: '黑龙江省',
    city: '哈尔滨市',
    district: '松北区',
    detail: '糖厂街1号 黑龙江科技大学 A区6号楼301室',
    fullAddress: '黑龙江省哈尔滨市松北区糖厂街1号 黑龙江科技大学 A区6号楼301室',
    isDefault: true,
    tag: '学校',
    createdAt: '2022-09-05T10:00:00Z'
  },
  {
    id: 'addr002',
    userId: 'user001',
    receiverName: '张三',
    receiverPhone: '13812348888',
    province: '黑龙江省',
    city: '齐齐哈尔市',
    district: '龙沙区',
    detail: '文化大街8号 家属院3单元502',
    fullAddress: '黑龙江省齐齐哈尔市龙沙区文化大街8号 家属院3单元502',
    isDefault: false,
    tag: '家',
    createdAt: '2022-09-05T10:05:00Z'
  },
  {
    id: 'addr003',
    userId: 'user001',
    receiverName: '张三',
    receiverPhone: '13812348888',
    province: '黑龙江省',
    city: '哈尔滨市',
    district: '南岗区',
    detail: '西大直街92号 哈工大附近',
    fullAddress: '黑龙江省哈尔滨市南岗区西大直街92号 哈工大附近',
    isDefault: false,
    tag: '公司',
    createdAt: '2025-06-15T14:30:00Z'
  }
]

// ==================== 外卖模块数据 ====================

/** 外卖商家数据 - 黑科大周边商家 */
const merchants: Merchant[] = [
  {
    id: 'mer001',
    name: '科大食堂一楼',
    logo: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=300&fit=crop',
    category: '食堂',
    rating: 4.7,
    reviewCount: 2345,
    monthlySales: 8900,
    deliveryTime: '15-25分钟',
    deliveryFee: 0,
    minOrderAmount: 1,
    address: '黑龙江科技大学A区食堂一楼',
    phone: '0451-88036001',
    openTime: '06:30',
    closeTime: '21:00',
    status: 'open',
    tags: ['经济实惠', '量大管饱', '校园首选'],
    announcement: '今日新增红烧排骨套餐！',
    latitude: 45.7965,
    longitude: 126.6508,
    distance: 0.2
  },
  {
    id: 'mer002',
    name: '蜜雪冰城（科大店）',
    logo: 'https://images.unsplash.com/photo-1558857563-b371033ba7c2?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1558857563-b371033ba7c2?w=600&h=300&fit=crop',
    category: '奶茶饮品',
    rating: 4.5,
    reviewCount: 1876,
    monthlySales: 12500,
    deliveryTime: '10-20分钟',
    deliveryFee: 2,
    minOrderAmount: 10,
    address: '黑龙江科技大学B区商业街12号',
    phone: '0451-88036123',
    openTime: '09:00',
    closeTime: '22:30',
    status: 'open',
    tags: ['平价奶茶', '冰淇淋', '学生最爱'],
    announcement: '柠檬水第二杯半价！',
    latitude: 45.7972,
    longitude: 126.6515,
    distance: 0.5
  },
  {
    id: 'mer003',
    name: '瑞幸咖啡（科技大厦店）',
    logo: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=300&fit=crop',
    category: '咖啡',
    rating: 4.6,
    reviewCount: 987,
    monthlySales: 5600,
    deliveryTime: '15-25分钟',
    deliveryFee: 3,
    minOrderAmount: 20,
    address: '科技大厦一层大厅',
    phone: '0451-88036567',
    openTime: '07:30',
    closeTime: '21:00',
    status: 'open',
    tags: ['精品咖啡', '生椰拿铁', '提神醒脑'],
    announcement: '新品上市：樱花莓莓胶原酸奶冻',
    latitude: 45.7958,
    longitude: 126.6495,
    distance: 0.8
  },
  {
    id: 'mer004',
    name: '杨国福麻辣烫（科大店）',
    logo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=300&fit=crop',
    category: '麻辣烫',
    rating: 4.4,
    reviewCount: 1567,
    monthlySales: 7200,
    deliveryTime: '20-30分钟',
    deliveryFee: 2,
    minOrderAmount: 15,
    address: '黑龙江科技大学C区美食广场3号',
    phone: '0451-88036234',
    openTime: '10:00',
    closeTime: '22:00',
    status: 'open',
    tags: ['麻辣烫', '自选菜品', '口味正宗'],
    announcement: '新用户首单立减5元',
    latitude: 45.7980,
    longitude: 126.6520,
    distance: 0.6
  },
  {
    id: 'mer005',
    name: '黄焖鸡米饭（学府店）',
    logo: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=300&fit=crop',
    category: '快餐简餐',
    rating: 4.3,
    reviewCount: 1123,
    monthlySales: 4500,
    deliveryTime: '20-30分钟',
    deliveryFee: 2,
    minOrderAmount: 12,
    address: '学府路辅街88号',
    phone: '0451-88036456',
    openTime: '10:00',
    closeTime: '21:30',
    status: 'open',
    tags: ['黄焖鸡', '下饭神器', '分量足'],
    announcement: '',
    latitude: 45.7990,
    longitude: 126.6530,
    distance: 1.2
  },
  {
    id: 'mer006',
    name: '正新鸡排（科大小吃街）',
    logo: 'https://images.unsplash.com/photo-1626082927389-8cd23f0cfd85?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1626082927389-8cd23f0cfd85?w=600&h=300&fit=crop',
    category: '炸鸡小吃',
    rating: 4.2,
    reviewCount: 890,
    monthlySales: 3800,
    deliveryTime: '15-25分钟',
    deliveryFee: 2,
    minOrderAmount: 10,
    address: '黑龙江科技大学东门小吃街15号',
    phone: '0451-88036789',
    openTime: '09:30',
    closeTime: '22:00',
    status: 'open',
    tags: ['鸡排', '小吃', '追剧必备'],
    announcement: '新品：芝士爆浆鸡排上市',
    latitude: 45.7975,
    longitude: 126.6525,
    distance: 0.7
  },
  {
    id: 'mer007',
    name: '张亮麻辣拌（松北店）',
    logo: 'https://images.unsplash.com/photo-1582169296194-e4d5444eab9d?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1582169296194-e4d5444eab9d?w=600&h=300&fit=crop',
    category: '麻辣拌',
    rating: 4.4,
    reviewCount: 756,
    monthlySales: 3100,
    deliveryTime: '20-30分钟',
    deliveryFee: 2,
    minOrderAmount: 15,
    address: '松北大道188号',
    phone: '0451-88036890',
    openTime: '10:30',
    closeTime: '21:00',
    status: 'open',
    tags: ['麻辣拌', '东北特色', '酸甜辣'],
    announcement: '',
    latitude: 45.8000,
    longitude: 126.6540,
    distance: 1.5
  },
  {
    id: 'mer008',
    name: '沙县小吃（科技路店）',
    logo: 'https://images.unsplash.com/photo-1569058242-647d39ae98b7?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1569058242-647d39ae98b7?w=600&h=300&fit=crop',
    category: '中式快餐',
    rating: 4.1,
    reviewCount: 654,
    monthlySales: 2800,
    deliveryTime: '15-25分钟',
    deliveryFee: 1,
    minOrderAmount: 8,
    address: '科技路56号',
    phone: '0451-88036123',
    openTime: '07:00',
    closeTime: '22:00',
    status: 'open',
    tags: ['蒸饺', '拌面', '炖罐', '实惠'],
    announcement: '早餐时段供应包子豆浆',
    latitude: 45.7960,
    longitude: 126.6500,
    distance: 0.4
  }
]

/** 菜品模板数据 */
const dishesTemplate: Record<string, Dish[]> = {
  mer001: [ // 科大食堂
    { id: 'dish001', merchantId: 'mer001', name: '红烧排骨饭', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', price: 15, originalPrice: 18, description: '精选猪肋排，秘制酱料慢炖，配米饭和小菜', category: '盖浇饭', sales: 890, rating: 4.8, status: 'available' as const, tags: ['招牌', '荤菜'] },
    { id: 'dish002', merchantId: 'mer001', name: '宫保鸡丁饭', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', price: 12, description: '鲜嫩鸡肉丁配花生米，微辣爽口', category: '盖浇饭', sales: 756, rating: 4.6, status: 'available' as const, tags: ['经典', '微辣'] },
    { id: 'dish003', merchantId: 'mer001', name: '麻婆豆腐饭', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400', price: 10, description: '嫩滑豆腐配猪肉末，麻辣鲜香', category: '盖浇饭', sales: 623, rating: 4.5, status: 'available' as const, tags: ['素食可选', '下饭'] },
    { id: 'dish004', merchantId: 'mer001', name: '西红柿鸡蛋面', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', price: 8, description: '手工拉面配新鲜番茄炒蛋，汤鲜味美', category: '面食', sales: 534, rating: 4.4, status: 'available' as const, tags: ['面食', '清淡'] },
    { id: 'dish005', merchantId: 'mer001', name: '鸡腿套餐', image: 'https://images.unsplash.com/photo-1626082927389-8cd23f0cfd85?w=400', price: 16, originalPrice: 20, description: '大鸡腿配时蔬、米饭、紫菜蛋花汤', category: '套餐', sales: 445, rating: 4.7, status: 'available' as const, tags: ['肉食者', '超值'] },
    { id: 'dish006', merchantId: 'mer001', name: '酸辣土豆丝', image: 'https://images.unsplash.com/photo-1569058242-647d39ae98b7?w=400', price: 6, description: '脆嫩土豆丝，酸辣开胃', category: '小炒', sales: 345, rating: 4.3, status: 'available' as const, tags: ['素菜', '开胃'] }
  ],
  mer002: [ // 蜜雪冰城
    { id: 'dish007', merchantId: 'mer002', name: '冰鲜柠檬水', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400', price: 4, description: '新鲜柠檬+绿茶，清爽解腻', category: '饮品', sales: 5678, rating: 4.7, status: 'available' as const, tags: ['爆款', '必点'] },
    { id: 'dish008', merchantId: 'mer002', name: '珍珠奶茶', image: 'https://images.unsplash.com/photo-1558857563-b371033ba7c2?w=400', price: 7, description: '醇香红茶+Q弹珍珠，甜蜜顺滑', category: '奶茶', sales: 3456, rating: 4.6, status: 'available' as const, tags: ['经典', '甜'] },
    { id: 'dish009', merchantId: 'mer002', name: '草莓圣代', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', price: 6, description: '香草冰淇淋配草莓果酱+脆皮', category: '冰淇淋', sales: 2345, rating: 4.5, status: 'available' as const, tags: ['甜品', '冰凉'] },
    { id: 'dish010', merchantId: 'mer002', name: '满杯百香果', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', price: 10, description: '百香果原汁+绿茶，维C满满', category: '饮品', sales: 1890, rating: 4.4, status: 'available' as const, tags: ['水果茶', '酸爽'] }
  ],
  mer003: [ // 瑞幸咖啡
    { id: 'dish011', merchantId: 'mer003', name: '生椰拿铁', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400', price: 18, description: '厚椰乳+浓缩咖啡，丝滑香醇', category: '咖啡', sales: 2345, rating: 4.8, status: 'available' as const, tags: ['招牌', '爆款'] },
    { id: 'dish012', merchantId: 'mer003', name: '美式咖啡', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', price: 15, description: '经典美式，浓郁醇苦，提神醒脑', category: '咖啡', sales: 1567, rating: 4.5, status: 'available' as const, tags: ['经典', '无奶'] },
    { id: 'dish013', merchantId: 'mer003', name: '樱花莓莓胶原酸奶冻', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', price: 22, description: '季节限定，樱花风味+草莓+胶原蛋白', category: '特调', sales: 890, rating: 4.6, status: 'available' as const, tags: ['新品', '限定'] }
  ]
}

// ==================== 二手市场模块数据 ====================

/** 二手物品分类 */
const secondHandCategories: SecondHandCategory[] = [
  { id: 'shcat1', name: '手机数码', icon: 'smartphone', count: 45 },
  { id: 'shcat2', name: '电脑办公', icon: 'laptop', count: 32 },
  { id: 'shcat3', name: '图书教材', icon: 'book', count: 128 },
  { id: 'shcat4', name: '生活家电', icon: 'home', count: 28 },
  { id: 'shcat5', name: '运动器材', icon: 'basketball', count: 19 },
  { id: 'shcat6', name: '服饰鞋包', icon: 'tshirt', count: 56 },
  { id: 'shcat7', name: '美妆护肤', icon: 'cosmetics', count: 23 },
  { id: 'shcat8', name: '其他闲置', icon: 'box', count: 41 }
]

/** 二手物品数据 */
const secondHandItems: SecondHandItem[] = [
  {
    id: 'item001',
    sellerId: 'seller001',
    sellerName: '李学长',
    sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    title: '出iPhone 14 Pro Max 256G 深空黑',
    description: '去年购入，一直戴壳贴膜使用，成色99新。电池健康度95%，无任何维修记录。配件齐全：原装充电器+数据线+耳机+盒子。因换新机所以出，价格可小刀。',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&h=600&fit=crop'
    ],
    categoryId: 'shcat1',
    categoryName: '手机数码',
    originalPrice: 9999,
    currentPrice: 5500,
    condition: 'almost_new' as const,
    conditionText: '几乎全新',
    negotiable: true,
    location: '黑龙江科技大学 A区',
    viewCount: 234,
    likeCount: 45,
    chatCount: 28,
    status: 'on_sale' as const,
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-05T14:30:00Z'
  },
  {
    id: 'item002',
    sellerId: 'seller002',
    sellerName: '王学姐',
    sellerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    title: '出高数同济七版+习题集 全套',
    description: '考研上岸出书，高数上下册+线性代数+概率论，全部是正版，有少量笔记但不影响阅读。还送历年真题卷子。',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop'
    ],
    categoryId: 'shcat3',
    categoryName: '图书教材',
    originalPrice: 120,
    currentPrice: 45,
    condition: 'lightly_used' as const,
    conditionText: '轻微使用痕迹',
    negotiable: false,
    location: '黑龙江科技大学 图书馆',
    viewCount: 189,
    likeCount: 67,
    chatCount: 34,
    status: 'on_sale' as const,
    createdAt: '2026-03-28T15:00:00Z',
    updatedAt: '2026-04-04T09:00:00Z'
  },
  {
    id: 'item003',
    sellerId: 'seller003',
    sellerName: '赵同学',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    title: '出自行车 山地车 26寸 九成新',
    description: '大二买的山地车，骑了不到一年，因为要实习了没地方放所以出了。变速正常，刹车灵敏，轮胎还有八成新。送车锁和打气筒。',
    images: [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=600&fit=crop'
    ],
    categoryId: 'shcat5',
    categoryName: '运动器材',
    originalPrice: 800,
    currentPrice: 350,
    condition: 'lightly_used' as const,
    conditionText: '轻微使用痕迹',
    negotiable: true,
    location: '黑龙江科技大学 车棚',
    viewCount: 156,
    likeCount: 23,
    chatCount: 15,
    status: 'on_sale' as const,
    createdAt: '2026-03-25T09:00:00Z',
    updatedAt: '2026-04-02T16:00:00Z'
  },
  {
    id: 'item004',
    sellerId: 'seller004',
    sellerName: '陈学长',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    title: '出联想拯救者Y7000P 游戏本',
    description: '2023款 i7-13620H RTX4060 16G内存 512G固态。玩3A大作无压力，吃鸡稳定144帧。外观有轻微使用痕迹，性能完美运行。送原装电源+鼠标垫。',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop'
    ],
    categoryId: 'shcat2',
    categoryName: '电脑办公',
    originalPrice: 8500,
    currentPrice: 5200,
    condition: 'lightly_used' as const,
    conditionText: '轻微使用痕迹',
    negotiable: true,
    location: '黑龙江科技大学 A区',
    viewCount: 345,
    likeCount: 78,
    chatCount: 56,
    status: 'on_sale' as const,
    createdAt: '2026-03-20T11:00:00Z',
    updatedAt: '2026-04-06T10:00:00Z'
  },
  {
    id: 'item005',
    sellerId: 'seller005',
    sellerName: '刘学姐',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    title: '出小冰箱 93L 宿舍可用',
    description: '搬家带不走，低价出。制冷效果好，噪音小，宿舍用刚好。买来才用了半年，九五成新。',
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&h=600&fit=crop'
    ],
    categoryId: 'shcat4',
    categoryName: '生活家电',
    originalPrice: 599,
    currentPrice: 280,
    condition: 'almost_new' as const,
    conditionText: '几乎全新',
    negotiable: true,
    location: '黑龙江科技大学 C区女生宿舍',
    viewCount: 98,
    likeCount: 34,
    chatCount: 19,
    status: 'on_sale' as const,
    createdAt: '2026-03-18T14:00:00Z',
    updatedAt: '2026-04-01T11:30:00Z'
  },
  {
    id: 'item006',
    sellerId: 'seller006',
    sellerName: '孙同学',
    sellerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    title: '出AirPods Pro 2代 国行正品',
    description: '今年年初购入，发票齐全。降噪效果很好，空间音频体验很棒。因换了索尼头戴式所以出，配件全。',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop'
    ],
    categoryId: 'shcat1',
    categoryName: '手机数码',
    originalPrice: 1899,
    currentPrice: 1200,
    condition: 'almost_new' as const,
    conditionText: '几乎全新',
    negotiable: false,
    location: '黑龙江科技大学 B区',
    viewCount: 267,
    likeCount: 56,
    chatCount: 42,
    status: 'on_sale' as const,
    createdAt: '2026-03-15T16:00:00Z',
    updatedAt: '2026-04-03T15:00:00Z'
  },
  {
    id: 'item007',
    sellerId: 'seller007',
    sellerName: '周学长',
    sellerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
    title: '出考研全套资料 计算机408',
    description: '已拟录取，出全套408资料：王道四本书+配套视频+真题+笔记。全是精华整理，省去自己整理的时间。',
    images: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop'
    ],
    categoryId: 'shcat3',
    categoryName: '图书教材',
    originalPrice: 300,
    currentPrice: 120,
    condition: 'moderately_used' as const,
    conditionText: '中等使用程度',
    negotiable: false,
    location: '黑龙江科技大学 图书馆自习室',
    viewCount: 423,
    likeCount: 134,
    chatCount: 89,
    status: 'on_sale' as const,
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-04-05T18:00:00Z'
  },
  {
    id: 'item008',
    sellerId: 'seller008',
    sellerName: '吴同学',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    title: '出瑜伽垫 加厚防滑 送收纳袋',
    description: '买了没练几次，基本全新。加厚10mm，防滑效果好，颜色粉紫色很好看。送瑜伽砖和弹力带。',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop'
    ],
    categoryId: 'shcat5',
    categoryName: '运动器材',
    originalPrice: 89,
    currentPrice: 35,
    condition: 'brand_new' as const,
    conditionText: '全新',
    negotiable: true,
    location: '黑龙江科技大学 体育馆',
    viewCount: 87,
    likeCount: 23,
    chatCount: 12,
    status: 'on_sale' as const,
    createdAt: '2026-03-08T13:00:00Z',
    updatedAt: '2026-03-30T10:00:00Z'
  },
  {
    id: 'item009',
    sellerId: 'seller009',
    sellerName: '郑学姐',
    sellerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    title: '出化妆品套装 兰蔻雅诗兰黛等',
    description: '收拾东西发现好多只用了一点的护肤品和化妆品，都是正品专柜购入。兰蔻粉底液用了1/3，雅诗兰黛小样全新，还有几个口红试色一两次。',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop'
    ],
    categoryId: 'shcat7',
    categoryName: '美妆护肤',
    originalPrice: 2500,
    currentPrice: 680,
    condition: 'lightly_used' as const,
    conditionText: '轻微使用痕迹',
    negotiable: true,
    location: '黑龙江科技大学 C区女生宿舍',
    viewCount: 234,
    likeCount: 89,
    chatCount: 67,
    status: 'on_sale' as const,
    createdAt: '2026-03-05T10:00:00Z',
    updatedAt: '2026-04-04T14:00:00Z'
  },
  {
    id: 'item010',
    sellerId: 'seller010',
    sellerName: '黄学长',
    sellerAvatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop',
    title: '出投影仪 极米Z6X 家庭影院',
    description: '在宿舍看剧太爽了，但是要毕业了带不走。1080P分辨率，自动对焦梯形校正，内置音响效果不错。配件全。',
    images: [
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&h=600&fit=crop'
    ],
    categoryId: 'shcat4',
    categoryName: '生活家电',
    originalPrice: 3599,
    currentPrice: 1800,
    condition: 'lightly_used' as const,
    conditionText: '轻微使用痕迹',
    negotiable: true,
    location: '黑龙江科技大学 A区男生宿舍',
    viewCount: 178,
    likeCount: 45,
    chatCount: 32,
    status: 'on_sale' as const,
    createdAt: '2026-03-02T15:00:00Z',
    updatedAt: '2026-04-02T09:30:00Z'
  },
  {
    id: 'item011',
    sellerId: 'seller011',
    sellerName: '林同学',
    sellerAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop',
    title: '出羽绒服 波司登中长款 S码',
    description: '买大了穿不了，吊牌还在。波司登官方旗舰店购入，充绒量很高，零下二十度完全没问题。黑色中长款，显瘦又保暖。',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=600&fit=crop'
    ],
    categoryId: 'shcat6',
    categoryName: '服饰鞋包',
    originalPrice: 1299,
    currentPrice: 600,
    condition: 'brand_new' as const,
    conditionText: '全新',
    negotiable: true,
    location: '黑龙江科技大学 B区',
    viewCount: 145,
    likeCount: 38,
    chatCount: 25,
    status: 'on_sale' as const,
    createdAt: '2026-02-28T11:00:00Z',
    updatedAt: '2026-04-01T16:00:00Z'
  },
  {
    id: 'item012',
    sellerId: 'seller012',
    sellerName: '马学长',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    title: '出Switch游戏机 日版 OLED 续航增强',
    description: '带塞尔达传说旷野之息+马里奥赛车8+动物森友会三个游戏卡带，还有Pro手柄。机器成色很好，无任何问题。',
    images: [
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&h=600&fit=crop'
    ],
    categoryId: 'shcat1',
    categoryName: '手机数码',
    originalPrice: 3200,
    currentPrice: 2100,
    condition: 'lightly_used' as const,
    conditionText: '轻微使用痕迹',
    negotiable: false,
    location: '黑龙江科技大学 A区',
    viewCount: 312,
    likeCount: 98,
    chatCount: 73,
    status: 'on_sale' as const,
    createdAt: '2026-02-25T14:00:00Z',
    updatedAt: '2026-04-06T08:00:00Z'
  }
]

// ==================== 社区论坛模块数据 ====================

/** 论坛板块数据 */
const forumBoards: ForumBoard[] = [
  { id: 'board1', name: '校园生活', description: '分享校园日常、生活经验', icon: 'school', postCount: 3456, todayPostCount: 23, sortOrder: 1 },
  { id: 'board2', name: '学术交流', description: '课程讨论、学习资源分享', icon: 'book-open', postCount: 2134, todayPostCount: 15, sortOrder: 2 },
  { id: 'board3', name: '求职招聘', description: '实习校招、职场经验交流', icon: 'briefcase', postCount: 1567, todayPostCount: 8, sortOrder: 3 },
  { id: 'board4', name: '失物招领', description: '丢失物品发布、捡到物品登记', icon: 'search', postCount: 890, todayPostCount: 5, sortOrder: 4 },
  { id: 'board5', name: '二手交易', description: '闲置物品转让、求购信息', icon: 'repeat', postCount: 1234, todayPostCount: 12, sortOrder: 5 },
  { id: 'board6', name: '情感树洞', description: '匿名倾诉、情感交流', icon: 'heart', postCount: 2678, todayPostCount: 18, sortOrder: 6 }
]

/** 帖子数据 */
const forumPosts: ForumPost[] = [
  {
    id: 'post001',
    authorId: 'author001',
    authorName: '计算机小王',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    boardId: 'board1',
    boardName: '校园生活',
    title: '【经验分享】大一到大四的生存指南，建议收藏！',
    content: '作为一个即将毕业的大四学长，想给学弟学妹们一些真诚的建议：\n\n1. 大一：多参加社团活动，但不要贪多，1-2个足够\n2. 大二：开始关注专业课，GPA很重要\n3. 大三：准备考研或找实习，越早越好\n4. 大四：论文要提前写，别拖到最后\n\n希望对大家有帮助！有问题可以评论区问我~',
    images: [],
    viewCount: 2345,
    likeCount: 456,
    commentCount: 89,
    isTop: true,
    isEssence: true,
    status: 'published' as const,
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-20T10:00:00Z',
    lastReplyAt: '2026-04-06T15:30:00Z'
  },
  {
    id: 'post002',
    authorId: 'author002',
    authorName: '考研党小李',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    boardId: 'board2',
    boardName: '学术交流',
    title: '【求助】数据结构链表反转，递归和非递归哪个更好？',
    content: '最近在复习数据结构，看到链表反转有两种写法：递归和非递归。\n\n递归版本代码简洁但可能栈溢出，非递归版本需要额外指针操作。\n\n请问实际面试中哪种更受青睐？有没有大佬能从时间和空间复杂度上分析一下？\n\n附上我的代码实现，欢迎指正...',
    images: [
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=400&fit=crop'
    ],
    viewCount: 876,
    likeCount: 123,
    commentCount: 45,
    isTop: false,
    isEssence: false,
    status: 'published' as const,
    createdAt: '2026-04-05T14:00:00Z',
    updatedAt: '2026-04-05T14:00:00Z',
    lastReplyAt: '2026-04-06T09:20:00Z'
  },
  {
    id: 'post003',
    authorId: 'author003',
    authorName: 'HR小姐姐',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    boardId: 'board3',
    boardName: '求职招聘',
    title: '【校招】字节跳动2026春季校园招聘正式启动！',
    content: '各位同学好！字节跳动2026春招已经启动啦！\n\n招聘岗位：\n- 后端开发工程师（Go/Java/Python）\n- 前端开发工程师（React/Vue）\n- 算法工程师（NLP/CV/推荐）\n- 产品经理\n- 运营专员\n\n要求：本科及以上学历，2026届毕业生\n\n投递方式：登录官网 career.bytedance.com\n\n截止时间：2026年4月30日\n\n欢迎大家投递！',
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop'
    ],
    viewCount: 3456,
    likeCount: 567,
    commentCount: 134,
    isTop: true,
    isEssence: true,
    status: 'published' as const,
    createdAt: '2026-04-01T09:00:00Z',
    updatedAt: '2026-04-01T09:00:00Z',
    lastReplyAt: '2026-04-06T16:00:00Z'
  },
  {
    id: 'post004',
    authorId: 'author004',
    authorName: '迷糊的小张',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    boardId: 'board4',
    boardName: '失物招领',
    title: '【寻物】昨天在图书馆丢失了一个黑色钱包，内有学生证和现金',
    content: '昨天下午（4月5日）大概3点左右在图书馆三楼自习室学习，走的时候忘记拿钱包了。\n\n钱包特征：\n- 黑色长款钱包\n- 内有学生证（姓名：张某，学号：2022xxx）\n- 身份证一张\n- 现金约200元\n- 银行卡2张\n\n如有拾到请联系我：138****8888，必有重谢！🙏',
    images: [],
    viewCount: 567,
    likeCount: 34,
    commentCount: 23,
    isTop: false,
    isEssence: false,
    status: 'published' as const,
    createdAt: '2026-04-06T08:00:00Z',
    updatedAt: '2026-04-06T08:00:00Z',
    lastReplyAt: '2026-04-06T12:00:00Z'
  },
  {
    id: 'post005',
    authorId: 'author005',
    authorName: '数码达人',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    boardId: 'board5',
    boardName: '二手交易',
    title: '【出售】iPad Air 5 256G WiFi版 星光色 95新',
    description: '', // 兼容字段
    content: '因换MacBook所以出iPad，去年双十一购入，一直带壳使用，屏幕完美无划痕。\n\n配置：M1芯片 8G内存 256G存储\n\n配件：原装充电器+Apple Pencil二代（另算200元）\n\n价格：4200元 可小刀\n\n有意私聊，支持当面验货交易',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop'
    ].slice(0, 1), // 取第一张作为主图
    viewCount: 456,
    likeCount: 67,
    commentCount: 28,
    isTop: false,
    isEssence: false,
    status: 'published' as const,
    createdAt: '2026-04-04T15:00:00Z',
    updatedAt: '2026-04-04T15:00:00Z',
    lastReplyAt: '2026-04-05T20:00:00Z'
  } as ForumPost,
  {
    id: 'post006',
    authorId: 'author006',
    authorName: '匿名用户',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    boardId: 'board6',
    boardName: '情感树洞',
    title: '【树洞】大三了还是单身，是不是我不够好？',
    content: '马上就要大三下了，看着身边的同学都脱单了，心里挺难受的。\n\n我不是不想谈恋爱，只是好像一直没有遇到合适的人。也尝试过主动，但总是以失败告终。\n\n有时候会怀疑是不是自己哪里不够好，或者是不是缘分还没到...\n\n有没有同样感受的朋友？大家是怎么调整心态的？',
    images: [],
    viewCount: 1890,
    likeCount: 345,
    commentCount: 167,
    isTop: false,
    isEssence: false,
    status: 'published' as const,
    createdAt: '2026-04-03T21:00:00Z',
    updatedAt: '2026-04-03T21:00:00Z',
    lastReplyAt: '2026-04-06T14:30:00Z'
  },
  {
    id: 'post007',
    authorId: 'author007',
    authorName: '社团负责人',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
    boardId: 'board1',
    boardName: '校园生活',
    title: '【活动】摄影社春季外拍活动报名开始！',
    content: '各位摄影爱好者注意啦！\n\n本周六（4月12日）下午2点，我们将组织前往太阳岛风景区进行春季外拍活动。\n\n活动安排：\n- 13:30 学校东门集合出发\n- 14:00-17:00 自由拍摄时间\n- 17:00-18:00 作品点评交流\n\n注意事项：\n1. 自备相机或手机均可\n2. 建议穿着便于活动的服装\n3. 注意防晒和补水\n\n名额有限，先报先得！扫码进群报名~',
    images: [
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop'
    ],
    viewCount: 678,
    likeCount: 123,
    commentCount: 56,
    isTop: false,
    isEssence: true,
    status: 'published' as const,
    createdAt: '2026-04-06T10:00:00Z',
    updatedAt: '2026-04-06T10:00:00Z',
    lastReplyAt: '2026-04-06T15:00:00Z'
  },
  {
    id: 'post008',
    authorId: 'author008',
    authorName: '学霸笔记',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    boardId: 'board2',
    boardName: '学术交流',
    title: '【资源分享】操作系统重点知识点整理（无偿分享）',
    content: '刚复习完操作系统，把重点整理成了思维导图和笔记，分享给需要的同学。\n\n内容包括：\n1. 进程管理（进程状态转换、调度算法、同步互斥）\n2. 内存管理（分页分段、虚拟内存、页面置换算法）\n3. 文件系统（文件存储、目录结构、磁盘调度）\n4. I/O管理（缓冲技术、设备分配）\n\n笔记格式：PDF + XMind源文件\n\n获取方式：评论区留言邮箱，我会逐一发送\n\n祝大家期末顺利！',
    images: [
      'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=400&fit=crop'
    ],
    viewCount: 1234,
    likeCount: 289,
    commentCount: 98,
    isTop: false,
    isEssence: true,
    status: 'published' as const,
    createdAt: '2026-04-02T16:00:00Z',
    updatedAt: '2026-04-02T16:00:00Z',
    lastReplyAt: '2026-04-06T11:00:00Z'
  }
]

// ==================== 社区活动模块数据 =================---

const activities: Activity[] = [
  {
    id: 'act1',
    title: '春季运动会',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-bd45ba8ba9ef?w=600&h=300&fit=crop',
    description: '一年一度的春季运动会即将开幕！包括田径比赛、趣味运动项目、团体操表演等精彩环节。欢迎全校师生积极参与，展现青春活力！',
    category: 'sports' as const,
    organizer: '体育部',
    location: '体育场',
    startTime: '2026-04-20T08:00:00Z',
    endTime: '2026-04-20T17:00:00Z',
    maxParticipants: 500,
    currentParticipants: 367,
    status: 'upcoming' as const,
    fee: 0,
    tags: ['运动', '竞技', '团体'],
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-04-05T14:00:00Z'
  },
  {
    id: 'act2',
    title: '校园歌手大赛决赛',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=300&fit=crop',
    description: '第十届校园歌手大赛总决赛，10位实力唱将同台竞技，更有神秘嘉宾助阵。现场投票选出你心中的最佳歌手！',
    category: 'entertainment' as const,
    organizer: '学生会文艺部',
    location: '大学生活动中心大礼堂',
    startTime: '2026-04-25T19:00:00Z',
    endTime: '2026-04-25T22:00:00Z',
    maxParticipants: 800,
    currentParticipants: 723,
    status: 'upcoming' as const,
    fee: 0,
    tags: ['音乐', '才艺', '晚会'],
    createdAt: '2026-03-20T09:00:00Z',
    updatedAt: '2026-04-04T16:00:00Z'
  },
  {
    id: 'act3',
    title: 'AI与未来科技讲座',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop',
    description: '特邀清华大学人工智能研究院教授主讲，探讨ChatGPT等大语言模型的发展趋势及其对社会各行业的影响。现场互动问答环节。',
    category: 'academic' as const,
    organizer: '计算机学院',
    location: '图书馆报告厅',
    startTime: '2026-04-18T14:00:00Z',
    endTime: '2026-04-18T16:30:00Z',
    maxParticipants: 300,
    currentParticipants: 278,
    status: 'upcoming' as const,
    fee: 0,
    tags: ['AI', '讲座', '科技'],
    createdAt: '2026-03-25T11:00:00Z',
    updatedAt: '2026-04-03T10:00:00Z'
  },
  {
    id: 'act4',
    title: '志愿服务：敬老院慰问演出',
    coverImage: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=300&fit=crop',
    description: '前往松北区敬老院进行慰问演出，为老人们带去歌舞表演、相声小品等节目。传递温暖，弘扬尊老爱幼的传统美德。',
    category: 'volunteer' as const,
    organizer: '青年志愿者协会',
    location: '松北区中心敬老院',
    startTime: '2026-04-14T09:00:00Z',
    endTime: '2026-04-14T12:00:00Z',
    maxParticipants: 40,
    currentParticipants: 35,
    status: 'upcoming' as const,
    fee: 0,
    tags: ['公益', '志愿', '敬老'],
    createdAt: '2026-03-28T14:00:00Z',
    updatedAt: '2026-04-02T09:00:00Z'
  },
  {
    id: 'act5',
    title: '传统文化节：汉服游园会',
    coverImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=300&fit=crop',
    description: '穿上汉服，穿越时空！活动现场设有古风拍照区、传统手工艺体验（剪纸、捏面人、画扇面）、茶艺表演、古典乐器演奏等。',
    category: 'culture' as const,
    organizer: '国学社',
    location: '校园人工湖畔',
    startTime: '2026-04-27T13:00:00Z',
    endTime: '2026-04-27T17:00:00Z',
    maxParticipants: 200,
    currentParticipants: 156,
    status: 'upcoming' as const,
    fee: 10,
    tags: ['汉服', '传统文化', '游园会'],
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-05T11:00:00Z'
  },
  {
    id: 'act6',
    title: '春季招聘宣讲会——互联网大厂专场',
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop',
    description: '邀请字节跳动、腾讯、阿里巴巴、美团、百度等知名互联网企业HR和技术负责人进行宣讲和面试指导。现场接收简历，优秀者可获得直通面试机会！',
    category: 'career' as const,
    organizer: '就业指导中心',
    location: '大学生活动中心报告厅',
    startTime: '2026-04-12T14:00:00Z',
    endTime: '2026-04-12T18:00:00Z',
    maxParticipants: 300,
    currentParticipants: 234,
    status: 'upcoming' as const,
    fee: 0,
    tags: ['招聘', '实习', '校招'],
    createdAt: '2026-03-22T09:00:00Z',
    updatedAt: '2026-04-04T15:00:00Z'
  }
]

// ==================== Mock API 定义 ====================

export default [
  // ==================== 商品相关接口 ====================

  /**
   * 获取商品分类列表
   * GET /api/categories
   */
  {
    url: '/api/categories',
    method: 'get',
    response: () => {
      return successResponse(categories)
    }
  },

  /**
   * 获取商品列表（分页）
   * GET /api/products?page=1&pageSize=10&categoryId=&keyword=&sort=
   */
  {
    url: '/api/products',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const page = parseInt(query.page || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const categoryId = query.categoryId
      const keyword = query.keyword?.toLowerCase()
      const sort = query.sort

      let filteredProducts = [...products]

      // 分类筛选
      if (categoryId && categoryId !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId)
      }

      // 关键词搜索
      if (keyword) {
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(keyword) ||
          p.description.toLowerCase().includes(keyword) ||
          p.tags.some(t => t.toLowerCase().includes(keyword))
        )
      }

      // 排序
      if (sort === 'price_asc') {
        filteredProducts.sort((a, b) => a.price - b.price)
      } else if (sort === 'price_desc') {
        filteredProducts.sort((a, b) => b.price - a.price)
      } else if (sort === 'sales') {
        filteredProducts.sort((a, b) => b.sales - a.sales)
      } else if (sort === 'rating') {
        filteredProducts.sort((a, b) => b.rating - a.rating)
      }

      return successResponse(paginate(filteredProducts, page, pageSize))
    }
  },

  /**
   * 获取推荐商品
   * GET /api/products/recommend?limit=10
   */
  {
    url: '/api/products/recommend',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const limit = parseInt(query.limit || '10')
      const recommended = [...products]
        .sort(() => Math.random() - 0.5)
        .slice(0, limit)
      return successResponse(recommended)
    }
  },

  /**
   * 获取热门商品
   * GET /api/products/hot?limit=10
   */
  {
    url: '/api/products/hot',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const limit = parseInt(query.limit || '10')
      const hotProducts = [...products]
        .sort((a, b) => b.sales - a.sales)
        .slice(0, limit)
      return successResponse(hotProducts)
    }
  },

  /**
   * 获取商品搜索
   * GET /api/products/search?keyword=xxx
   */
  {
    url: '/api/products/search',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const keyword = query.keyword?.toLowerCase()
      const page = parseInt(query.page || '1')
      const pageSize = parseInt(query.pageSize || '10')
      let filteredProducts = [...products]
      if (keyword) {
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(keyword) ||
          p.description.toLowerCase().includes(keyword) ||
          p.tags.some(t => t.toLowerCase().includes(keyword))
        )
      }
      return successResponse(paginate(filteredProducts, page, pageSize))
    }
  },

  /**
   * 获取商品详情
   * GET /api/products/:id
   */
  {
    url: /\/api\/products\/(\w+)/,
    method: 'get',
    response: (config: any) => {
      const url = config.url as string
      const match = url.match(/\/api\/products\/(\w+)/)
      const id = match ? match[1] : ''
      const product = products.find(p => p.id === id)
      if (!product) {
        return { code: 404, message: '商品不存在', data: null, timestamp: Date.now() }
      }
      return successResponse(product)
    }
  },

  // ==================== 订单相关接口 ====================

  /**
   * 获取订单列表（分页）
   * GET /api/orders?page=1&pageSize=10&status=
   */
  {
    url: '/api/orders',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const page = parseInt(query.page || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const status = query.status

      let filteredOrders = [...orders].reverse()

      // 状态筛选
      if (status && status !== 'all') {
        filteredOrders = filteredOrders.filter(o => o.status === status)
      }

      return successResponse(paginate(filteredOrders, page, pageSize))
    }
  },

  /**
   * 获取订单详情
   * GET /api/orders/:id
   */
  {
    url: /\/api\/orders\/(\w+)$/,
    method: 'get',
    response: (config: any) => {
      const url = config.url as string
      const match = url.match(/\/api\/orders\/(\w+)$/)
      const id = match ? match[1] : ''
      const order = orders.find(o => o.id === id)
      if (!order) {
        return { code: 404, message: '订单不存在', data: null, timestamp: Date.now() }
      }
      return successResponse(order)
    }
  },

  /**
   * 创建订单
   * POST /api/orders
   */
  {
    url: '/api/orders',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const newOrder: Order = {
        id: `order${String(orders.length + 1).padStart(3, '0')}`,
        orderNo: generateOrderNo(),
        userId: 'user001',
        items: body.items,
        totalAmount: body.totalAmount,
        discountAmount: body.discountAmount || 0,
        freightAmount: body.freightAmount || 0,
        payAmount: body.payAmount,
        status: 'pending',
        receiverName: body.receiverName,
        receiverPhone: body.receiverPhone,
        receiverAddress: body.receiverAddress,
        remark: body.remark,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      orders.unshift(newOrder)
      return successResponse(newOrder)
    }
  },

  /**
   * 取消订单
   * PUT /api/orders/:id/cancel
   */
  {
    url: /\/api\/orders\/(\w+)\/cancel$/,
    method: 'put',
    response: (config: any) => {
      const url = config.url as string
      const match = url.match(/\/api\/orders\/(\w+)\/cancel$/)
      const id = match ? match[1] : ''
      const order = orders.find(o => o.id === id)
      if (!order) {
        return { code: 404, message: '订单不存在', data: null, timestamp: Date.now() }
      }
      if (!['pending', 'paid'].includes(order.status)) {
        return { code: 400, message: '当前状态无法取消', data: null, timestamp: Date.now() }
      }
      order.status = 'cancelled'
      order.updatedAt = new Date().toISOString()
      return successResponse(order)
    }
  },

  /**
   * 确认收货
   * PUT /api/orders/:id/confirm
   */
  {
    url: /\/api\/orders\/(\w+)\/confirm$/,
    method: 'put',
    response: (config: any) => {
      const url = config.url as string
      const match = url.match(/\/api\/orders\/(\w+)\/confirm$/)
      const id = match ? match[1] : ''
      const order = orders.find(o => o.id === id)
      if (!order) {
        return { code: 404, message: '订单不存在', data: null, timestamp: Date.now() }
      }
      if (order.status !== 'delivered') {
        return { code: 400, message: '当前状态无法确认收货', data: null, timestamp: Date.now() }
      }
      order.status = 'completed'
      order.completeTime = new Date().toISOString()
      order.updatedAt = new Date().toISOString()
      return successResponse(order)
    }
  },

  /**
   * 获取订单统计
   * GET /api/orders/stats
   */
  {
    url: '/api/orders/stats',
    method: 'get',
    response: () => {
      const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        paid: orders.filter(o => o.status === 'paid').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        refunding: orders.filter(o => o.status === 'refunding').length
      }
      return successResponse(stats)
    }
  },

  // ==================== 购物车相关接口 ====================

  /**
   * 获取购物车列表
   * GET /api/cart
   */
  {
    url: '/api/cart',
    method: 'get',
    response: () => {
      return successResponse(cartItems)
    }
  },

  /**
   * 添加商品到购物车
   * POST /api/cart
   */
  {
    url: '/api/cart',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const product = products.find(p => p.id === body.productId)
      if (!product) {
        return { code: 404, message: '商品不存在', data: null, timestamp: Date.now() }
      }

      // 检查是否已在购物车中
      const existingItem = cartItems.find(item => item.productId === body.productId)
      if (existingItem) {
        existingItem.quantity += body.quantity || 1
        existingItem.updatedAt = new Date().toISOString()
        return successResponse(existingItem)
      }

      const newItem: CartItem = {
        id: `cart${String(cartItems.length + 1).padStart(3, '0')}`,
        userId: 'user001',
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        price: product.price,
        quantity: body.quantity || 1,
        selected: true,
        stock: product.stock,
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      cartItems.push(newItem)
      return successResponse(newItem)
    }
  },

  /**
   * 更新购物车商品数量
   * PUT /api/cart/:id
   */
  {
    url: /\/api\/cart\/(\w+)$/,
    method: 'put',
    response: (config: any) => {
      const url = config.url as string; const match = url.match(/\/api\/cart\/(\w+)$/); const id = match ? match[1] : ''
      const { body } = config
      const item = cartItems.find(i => i.id === id)
      if (!item) {
        return { code: 404, message: '购物车项不存在', data: null, timestamp: Date.now() }
      }
      item.quantity = body.quantity
      if (body.selected !== undefined) {
        item.selected = body.selected
      }
      return successResponse(item)
    }
  },

  /**
   * 删除购物车商品
   * DELETE /api/cart/:id
   */
  {
    url: /\/api\/cart\/(\w+)$/,
    method: 'delete',
    response: (config: any) => {
      const url = config.url as string; const match = url.match(/\/api\/cart\/(\w+)$/); const id = match ? match[1] : ''
      const index = cartItems.findIndex(i => i.id === id)
      if (index === -1) {
        return { code: 404, message: '购物车项不存在', data: null, timestamp: Date.now() }
      }
      cartItems.splice(index, 1)
      return successResponse({ message: '删除成功' })
    }
  },

  /**
   * 清空购物车
   * DELETE /api/cart/clear
   */
  {
    url: '/api/cart/clear',
    method: 'delete',
    response: () => {
      cartItems.length = 0
      return successResponse({ message: '购物车已清空' })
    }
  },

  // ==================== 用户相关接口 ====================

  /**
   * 获取当前用户信息
   * GET /api/user/info
   */
  {
    url: '/api/user/info',
    method: 'get',
    response: () => {
      return successResponse(currentUser)
    }
  },

  /**
   * 更新用户信息
   * PUT /api/user/info
   */
  {
    url: '/api/user/info',
    method: 'put',
    response: ({ body }: { body: any }) => {
      Object.assign(currentUser, body)
      currentUser.updatedAt = new Date().toISOString()
      return successResponse(currentUser)
    }
  },

  /**
   * 获取收货地址列表
   * GET /api/user/addresses
   */
  {
    url: '/api/user/addresses',
    method: 'get',
    response: () => {
      return successResponse(addresses)
    }
  },

  /**
   * 添加收货地址
   * POST /api/user/addresses
   */
  {
    url: '/api/user/addresses',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const newAddress: Address = {
        id: `addr${String(addresses.length + 1).padStart(3, '0')}`,
        userId: 'user001',
        ...body,
        fullAddress: `${body.province}${body.city}${body.district}${body.detail}`,
        isDefault: body.isDefault || false,
        createdAt: new Date().toISOString()
      }

      // 如果设为默认地址，取消其他默认
      if (newAddress.isDefault) {
        addresses.forEach(addr => addr.isDefault = false)
      }

      addresses.push(newAddress)
      return successResponse(newAddress)
    }
  },

  /**
   * 更新收货地址
   * PUT /api/user/addresses/:id
   */
  {
    url: /\/api\/user\/addresses\/(\w+)$/,
    method: 'put',
    response: (config: any) => {
      const url = config.url as string; const match = url.match(/\/api\/user\/addresses\/(\w+)$/); const id = match ? match[1] : ''
      const { body } = config
      const address = addresses.find(a => a.id === id)
      if (!address) {
        return { code: 404, message: '地址不存在', data: null, timestamp: Date.now() }
      }
      Object.assign(address, body, {
        fullAddress: `${body.province || address.province}${body.city || address.city}${body.district || address.district}${body.detail || address.detail}`
      })

      if (body.isDefault) {
        addresses.forEach(addr => {
          if (addr.id !== id) addr.isDefault = false
        })
      }

      return successResponse(address)
    }
  },

  /**
   * 删除收货地址
   * DELETE /api/user/addresses/:id
   */
  {
    url: /\/api\/user\/addresses\/(\w+)$/,
    method: 'delete',
    response: (config: any) => {
      const url = config.url as string; const match = url.match(/\/api\/user\/addresses\/(\w+)$/); const id = match ? match[1] : ''
      const index = addresses.findIndex(a => a.id === id)
      if (index === -1) {
        return { code: 404, message: '地址不存在', data: null, timestamp: Date.now() }
      }
      addresses.splice(index, 1)
      return successResponse({ message: '删除成功' })
    }
  },

  /**
   * 设置默认地址
   * PUT /api/user/addresses/:id/default
   */
  {
    url: /\/api\/user\/addresses\/(\w+)\/default$/,
    method: 'put',
    response: (config: any) => {
      const url = config.url as string; const match = url.match(/\/api\/user\/addresses\/(\w+)\/default$/); const id = match ? match[1] : ''
      const address = addresses.find(a => a.id === id)
      if (!address) {
        return { code: 404, message: '地址不存在', data: null, timestamp: Date.now() }
      }
      addresses.forEach(addr => addr.isDefault = false)
      address.isDefault = true
      return successResponse(address)
    }
  },

  // ==================== 外卖相关接口 ====================

  /**
   * 获取外卖商家列表
   * GET /api/delivery/merchants?category=&keyword=&sort=
   */
  {
    url: '/api/delivery/merchants',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const category = query.category
      const keyword = query.keyword?.toLowerCase()
      const sort = query.sort

      let filteredMerchants = [...merchants]

      // 分类筛选
      if (category && category !== 'all') {
        filteredMerchants = filteredMerchants.filter(m => m.category === category)
      }

      // 关键词搜索
      if (keyword) {
        filteredMerchants = filteredMerchants.filter(m =>
          m.name.toLowerCase().includes(keyword) ||
          m.tags.some(t => t.toLowerCase().includes(keyword))
        )
      }

      // 排序
      if (sort === 'rating') {
        filteredMerchants.sort((a, b) => b.rating - a.rating)
      } else if (sort === 'sales') {
        filteredMerchants.sort((a, b) => b.monthlySales - a.monthlySales)
      } else if (sort === 'distance') {
        filteredMerchants.sort((a, b) => a.distance - b.distance)
      }

      return successResponse(filteredMerchants)
    }
  },

  /**
   * 获取商家详情及菜品
   * GET /api/delivery/merchants/:id
   */
  {
    url: /\/api\/delivery\/merchants\/(\w+)$/,
    method: 'get',
    response: (config: any) => {
      const url = config.url as string; const match = url.match(/\/api\/delivery\/merchants\/(\w+)$/); const id = match ? match[1] : ''
      const merchant = merchants.find(m => m.id === id)
      if (!merchant) {
        return { code: 404, message: '商家不存在', data: null, timestamp: Date.now() }
      }
      const dishes = dishesTemplate[id] || []
      return successResponse({ merchant, dishes })
    }
  },

  /**
   * 获取商家分类列表
   * GET /api/delivery/categories
   */
  {
    url: '/api/delivery/categories',
    method: 'get',
    response: () => {
      const categories = [...new Set(merchants.map(m => m.category))]
      return successResponse(categories)
    }
  },

  /**
   * 获取推荐商家
   * GET /api/delivery/merchants/recommend?limit=5
   */
  {
    url: '/api/delivery/merchants/recommend',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const limit = parseInt(query.limit || '5')
      const recommended = [...merchants]
        .filter(m => m.status === 'open')
        .sort((a, b) => b.rating - a.rating || b.monthlySales - a.monthlySales)
        .slice(0, limit)
      return successResponse(recommended)
    }
  },

  // ==================== 二手市场相关接口 ====================

  /**
   * 获取二手分类列表
   * GET /api/secondhand/categories
   */
  {
    url: '/api/secondhand/categories',
    method: 'get',
    response: () => {
      return successResponse(secondHandCategories)
    }
  },

  /**
   * 获取二手物品列表（分页）
   * GET /api/secondhand/items?page=1&pageSize=10&categoryId=&keyword=&condition=&sort=
   */
  {
    url: '/api/secondhand/items',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const page = parseInt(query.page || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const categoryId = query.categoryId
      const keyword = query.keyword?.toLowerCase()
      const condition = query.condition
      const sort = query.sort

      let filteredItems = [...secondHandItems]

      // 分类筛选
      if (categoryId && categoryId !== 'all') {
        filteredItems = filteredItems.filter(item => item.categoryId === categoryId)
      }

      // 关键词搜索
      if (keyword) {
        filteredItems = filteredItems.filter(item =>
          item.title.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword)
        )
      }

      // 成色筛选
      if (condition && condition !== 'all') {
        filteredItems = filteredItems.filter(item => item.condition === condition)
      }

      // 排序
      if (sort === 'price_asc') {
        filteredItems.sort((a, b) => a.currentPrice - b.currentPrice)
      } else if (sort === 'price_desc') {
        filteredItems.sort((a, b) => b.currentPrice - a.currentPrice)
      } else if (sort === 'time') {
        filteredItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      return successResponse(paginate(filteredItems, page, pageSize))
    }
  },

  /**
   * 获取二手物品详情
   * GET /api/secondhand/items/:id
   */
  {
    url: /\/api\/secondhand\/items\/(\w+)$/,
    method: 'get',
    response: (config: any) => {
      const url = config.url as string; const match = url.match(/\/api\/secondhand\/items\/(\w+)$/); const id = match ? match[1] : ''
      const item = secondHandItems.find(i => i.id === id)
      if (!item) {
        return { code: 404, message: '物品不存在', data: null, timestamp: Date.now() }
      }
      // 模拟浏览量增加
      item.viewCount++
      return successResponse(item)
    }
  },

  /**
   * 发布二手物品
   * POST /api/secondhand/items
   */
  {
    url: '/api/secondhand/items',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const category = secondHandCategories.find(c => c.id === body.categoryId)
      const newItem: SecondHandItem = {
        id: `item${String(secondHandItems.length + 1).padStart(3, '0')}`,
        sellerId: 'user001',
        sellerName: currentUser.nickname,
        sellerAvatar: currentUser.avatar,
        ...body,
        categoryName: category?.name || '',
        viewCount: 0,
        likeCount: 0,
        chatCount: 0,
        status: 'on_sale',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      secondHandItems.unshift(newItem)
      return successResponse(newItem)
    }
  },

  // ==================== 社区论坛相关接口 ====================

  /**
   * 获取论坛板块列表
   * GET /api/forum/boards
   */
  {
    url: '/api/forum/boards',
    method: 'get',
    response: () => {
      return successResponse(forumBoards)
    }
  },

  /**
   * 获取帖子列表（分页）
   * GET /api/forum/posts?page=1&pageSize=10&boardId=&keyword=&sort=
   */
  {
    url: '/api/forum/posts',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const page = parseInt(query.page || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const boardId = query.boardId
      const keyword = query.keyword?.toLowerCase()
      const sort = query.sort

      let filteredPosts = [...forumPosts]

      // 板块筛选
      if (boardId && boardId !== 'all') {
        filteredPosts = filteredPosts.filter(p => p.boardId === boardId)
      }

      // 关键词搜索
      if (keyword) {
        filteredPosts = filteredPosts.filter(p =>
          p.title.toLowerCase().includes(keyword) ||
          p.content.toLowerCase().includes(keyword)
        )
      }

      // 排序（置顶优先）
      if (sort === 'time') {
        filteredPosts.sort((a, b) => {
          if (a.isTop !== b.isTop) return b.isTop ? 1 : -1
          return new Date(b.lastReplyAt || b.createdAt).getTime() - new Date(a.lastReplyAt || a.createdAt).getTime()
        })
      } else {
        // 默认排序：置顶 > 精华 > 最新回复
        filteredPosts.sort((a, b) => {
          if (a.isTop !== b.isTop) return b.isTop ? 1 : -1
          if (a.isEssence !== b.isEssence) return b.isEssence ? 1 : -1
          return new Date(b.lastReplyAt || b.createdAt).getTime() - new Date(a.lastReplyAt || a.createdAt).getTime()
        })
      }

      return successResponse(paginate(filteredPosts, page, pageSize))
    }
  },

  /**
   * 获取帖子详情
   * GET /api/forum/posts/:id
   */
  {
    url: /\/api\/forum\/posts\/(\w+)$/,
    method: 'get',
    response: (config: any) => {
      const url = config.url as string; const match = url.match(/\/api\/forum\/posts\/(\w+)$/); const id = match ? match[1] : ''
      const post = forumPosts.find(p => p.id === id)
      if (!post) {
        return { code: 404, message: '帖子不存在', data: null, timestamp: Date.now() }
      }
      // 模拟浏览量增加
      post.viewCount++
      return successResponse(post)
    }
  },

  /**
   * 发布帖子
   * POST /api/forum/posts
   */
  {
    url: '/api/forum/posts',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const board = forumBoards.find(b => b.id === body.boardId)
      const newPost: ForumPost = {
        id: `post${String(forumPosts.length + 1).padStart(3, '0')}`,
        authorId: 'user001',
        authorName: currentUser.nickname,
        authorAvatar: currentUser.avatar,
        boardId: body.boardId,
        boardName: board?.name || '',
        title: body.title,
        content: body.content,
        images: body.images || [],
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        isTop: false,
        isEssence: false,
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      forumPosts.unshift(newPost)

      // 更新板块帖子数
      if (board) {
        board.postCount++
        board.todayPostCount++
      }

      return successResponse(newPost)
    }
  },

  /**
   * 点赞帖子
   * POST /api/forum/posts/:id/like
   */
  {
    url: /\/api\/forum\/posts\/(\w+)\/like$/,
    method: 'post',
    response: (config: any) => {
      const url = config.url as string; const match = url.match(/\/api\/forum\/posts\/(\w+)\/like$/); const id = match ? match[1] : ''
      const post = forumPosts.find(p => p.id === id)
      if (!post) {
        return { code: 404, message: '帖子不存在', data: null, timestamp: Date.now() }
      }
      post.likeCount++
      return successResponse({ liked: true, likeCount: post.likeCount })
    }
  },

  // ==================== 社区活动相关接口 ====================

  /**
   * 获取活动列表
   * GET /api/activities?page=1&pageSize=10&category=&status=
   */
  {
    url: '/api/activities',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const page = parseInt(query.page || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const category = query.category
      const status = query.status

      let filteredActivities = [...activities]

      // 分类筛选
      if (category && category !== 'all') {
        filteredActivities = filteredActivities.filter(a => a.category === category)
      }

      // 状态筛选
      if (status && status !== 'all') {
        filteredActivities = filteredActivities.filter(a => a.status === status)
      }

      // 按开始时间排序（最近的在前）
      filteredActivities.sort((a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )

      return successResponse(paginate(filteredActivities, page, pageSize))
    }
  },

  /**
   * 获取活动详情
   * GET /api/activities/:id
   */
  {
    url: /\/api\/activities\/(\w+)$/,
    method: 'get',
    response: (config: any) => {
      const url = config.url as string; const match = url.match(/\/api\/activities\/(\w+)$/); const id = match ? match[1] : ''
      const activity = activities.find(a => a.id === id)
      if (!activity) {
        return { code: 404, message: '活动不存在', data: null, timestamp: Date.now() }
      }
      return successResponse(activity)
    }
  },

  /**
   * 报名参加活动
   * POST /api/activities/:id/register
   */
  {
    url: /\/api\/activities\/(\w+)\/register$/,
    method: 'post',
    response: (config: any) => {
      const url = config.url as string; const match = url.match(/\/api\/activities\/(\w+)\/register$/); const id = match ? match[1] : ''
      const activity = activities.find(a => a.id === id)
      if (!activity) {
        return { code: 404, message: '活动不存在', data: null, timestamp: Date.now() }
      }
      if (activity.currentParticipants >= activity.maxParticipants) {
        return { code: 400, message: '名额已满', data: null, timestamp: Date.now() }
      }
      activity.currentParticipants++

      // 模拟添加报名者
      if (!activity.registrants) {
        activity.registrants = []
      }
      activity.registrants.push({
        userId: 'user001',
        userName: currentUser.nickname,
        userAvatar: currentUser.avatar,
        registeredAt: new Date().toISOString()
      })

      return successResponse({ message: '报名成功', remaining: activity.maxParticipants - activity.currentParticipants })
    }
  },

  /**
   * 获取活动分类统计
   * GET /api/activities/categories
   */
  {
    url: '/api/activities/categories',
    method: 'get',
    response: () => {
      const categories = [
        { key: 'sports', label: '体育运动', count: activities.filter(a => a.category === 'sports').length },
        { key: 'entertainment', label: '文娱活动', count: activities.filter(a => a.category === 'entertainment').length },
        { key: 'academic', label: '学术讲座', count: activities.filter(a => a.category === 'academic').length },
        { key: 'volunteer', label: '志愿服务', count: activities.filter(a => a.category === 'volunteer').length },
        { key: 'culture', label: '文化活动', count: activities.filter(a => a.category === 'culture').length },
        { key: 'career', label: '职业发展', count: activities.filter(a => a.category === 'career').length }
      ]
      return successResponse(categories)
    }
  },

  // ==================== 首页数据聚合接口 ====================

  /**
   * 获取首页所需的所有数据（减少请求次数）
   * GET /api/home/data
   */
  {
    url: '/api/home/data',
    method: 'get',
    response: () => {
      const homeData = {
        // 轮播图/Banner
        banners: [
          { id: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=400&fit=crop', title: '开学季特惠 满100减20', link: '/products?promotion=spring' },
          { id: 2, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop', title: '春季运动会报名中', link: '/activities/act1' },
          { id: 3, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=400&fit=crop', title: '数码产品限时折扣', link: '/products?category=cat1' }
        ],

        // 热门商品
        hotProducts: products.slice(0, 8),

        // 推荐商家
        recommendMerchants: merchants.slice(0, 4),

        // 最新帖子
        latestPosts: forumPosts.slice(0, 5),

        // 即将开始的活动
        upcomingActivities: activities
          .filter(a => a.status === 'upcoming')
          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
          .slice(0, 3),

        // 最新二手
        latestSecondHand: secondHandItems.slice(0, 6)
      }
      return successResponse(homeData)
    }
  },

  /**
   * 搜索接口（全局搜索）
   * GET /api/search?keyword=&type=&page=1&pageSize=10
   */
  {
    url: '/api/search',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const keyword = query.keyword?.toLowerCase()
      const type = query.type
      const page = parseInt(query.page || '1')
      const pageSize = parseInt(query.pageSize || '10')

      if (!keyword) {
        return successResponse({ results: [], total: 0 })
      }

      const results: any[] = []

      // 搜索商品
      if (!type || type === 'product') {
        const matchedProducts = products.filter(p =>
          p.name.toLowerCase().includes(keyword) ||
          p.description.toLowerCase().includes(keyword) ||
          p.tags.some(t => t.toLowerCase().includes(keyword))
        ).map(p => ({ type: 'product', ...p }))
        results.push(...matchedProducts)
      }

      // 搜索二手
      if (!type || type === 'secondhand') {
        const matchedSecondHand = secondHandItems.filter(item =>
          item.title.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword)
        ).map(item => ({ type: 'secondhand', ...item }))
        results.push(...matchedSecondHand)
      }

      // 搜索帖子
      if (!type || type === 'post') {
        const matchedPosts = forumPosts.filter(p =>
          p.title.toLowerCase().includes(keyword) ||
          p.content.toLowerCase().includes(keyword)
        ).map(p => ({ type: 'post', ...p }))
        results.push(...matchedPosts)
      }

      // 搜索商家
      if (!type || type === 'merchant') {
        const matchedMerchants = merchants.filter(m =>
          m.name.toLowerCase().includes(keyword) ||
          m.tags.some(t => t.toLowerCase().includes(keyword))
        ).map(m => ({ type: 'merchant', ...m }))
        results.push(...matchedMerchants)
      }

      const total = results.length
      const paginatedResults = results.slice((page - 1) * pageSize, page * pageSize)

      return successResponse({
        list: paginatedResults,
        total,
        page,
        pageSize
      })
    }
  },

  /**
   * 用户登录
   * POST /api/auth/login
   */
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: { body: any }) => {
      // 模拟登录验证
      if (body.username === 'admin' && body.password === 'admin123') {
        return successResponse({
          token: 'mock-admin-token-' + Date.now(),
          user: { ...currentUser, role: 'admin', nickname: '管理员' }
        })
      }

      // 默认返回普通用户
      return successResponse({
        token: 'mock-user-token-' + Date.now(),
        user: currentUser
      })
    }
  },

  /**
   * 用户注册
   * POST /api/auth/register
   */
  {
    url: '/api/auth/register',
    method: 'post',
    response: ({ body }: { body: any }) => {
      return successResponse({
        message: '注册成功',
        user: {
          id: 'user' + Date.now(),
          username: body.username,
          nickname: body.nickname || body.username,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
          role: 'user',
          status: 'active',
          balance: 0,
          points: 0,
          level: 1,
          createdAt: new Date().toISOString()
        }
      })
    }
  },

  /**
   * 获取通知消息列表
   * GET /api/notifications?page=1&pageSize=10&type=
   */
  {
    url: '/api/notifications',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const page = parseInt(query.page || '1')
      const pageSize = parseInt(query.pageSize || '10')

      const notifications = [
        { id: 'noti1', type: 'order', title: '订单发货提醒', content: '您的订单 HK202604030001 已发货，预计4月5日送达', isRead: false, createdAt: '2026-04-03T14:00:00Z' },
        { id: 'noti2', type: 'system', title: '系统公告', content: '春季运动会报名通道已开启，快来参与吧！', isRead: false, createdAt: '2026-04-02T09:00:00Z' },
        { id: 'noti3', type: 'activity', title: '活动提醒', content: '您报名的"AI与未来科技讲座"将于明天下午2点开始', isRead: true, createdAt: '2026-04-01T16:00:00Z' },
        { id: 'noti4', type: 'secondhand', title: '二手交易', content: '您发布的"iPad Air 5"有人咨询，快去看看吧', isRead: true, createdAt: '2026-03-30T11:00:00Z' },
        { id: 'noti5', type: 'order', title: '订单完成', content: '您的订单 HK202603150001 已完成，感谢您的购买', isRead: true, createdAt: '2026-03-18T09:00:00Z' }
      ]

      const result = paginate(notifications, page, pageSize)
      return successResponse(result)
    }
  },

  /**
   * 标记消息已读
   * PUT /api/notifications/:id/read
   */
  {
    url: /\/api\/notifications\/(\w+)\/read$/,
    method: 'put',
    response: (config: any) => {
      return successResponse({ message: '已标记为已读' })
    }
  },

  /**
   * 获取未读消息数量
   * GET /api/notifications/unread-count
   */
  {
    url: '/api/notifications/unread-count',
    method: 'get',
    response: () => {
      return successResponse({ count: 2 })
    }
  }
] as MockMethod[]

/**
 * mockServerPlugin - Vite 插件
 * 用于在开发环境中启用 Mock 数据拦截
 * 注意：此功能已禁用，保留接口以避免 vite.config.ts 报错
 */
export function mockServerPlugin(): any {
  // 已禁用：vite-plugin-mock 未安装
  // 返回空插件以避免构建错误
  return {
    name: 'mock-server-disabled',
    configResolved() {
      console.warn('[Mock] Mock server is disabled. Install vite-plugin-mock to enable.')
    }
  }
}
