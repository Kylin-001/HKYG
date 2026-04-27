/**
 * 外卖模块数据生成器
 * 生成商家、菜品、订单等数据
 */

import { faker } from '@faker-js/faker/locale/zh_CN'
import type {
  Merchant,
  MerchantDetail,
  Product,
  TakeoutOrder,
  DeliveryTrack,
} from '@/types/takeout'
import {
  generateMerchants,
  generateMerchantDetail,
  generateRecommendedMerchants,
  generateNearbyMerchants,
  filterMerchants,
  paginateMerchants,
  getMerchantCategories,
} from './merchant'

// ============================================
// 菜品数据生成
// ============================================

const dishNames: Record<string, string[]> = {
  food: ['红烧肉', '宫保鸡丁', '麻婆豆腐', '糖醋里脊', '回锅肉', '鱼香肉丝', '青椒炒肉', '土豆烧牛肉'],
  noodles: ['牛肉拉面', '炸酱面', '西红柿鸡蛋面', '酸菜肉丝面', '刀削面', '拌面', '炒面'],
  rice: ['红烧肉盖饭', '宫保鸡丁盖饭', '鱼香肉丝盖饭', '咖喱饭', '卤肉饭', '鸡腿饭', '排骨饭'],
  drink: ['珍珠奶茶', '芋泥波波', '芝士奶盖', '水果茶', '柠檬茶', '抹茶拿铁', '焦糖玛奇朵'],
  snack: ['香辣鸡腿堡', '奥尔良烤翅', '薯条', '鸡米花', '香辣鸡翅', '鸡块', '蛋挞'],
  fruit: ['水果捞', '鲜切西瓜', '水果拼盘', '酸奶水果', '果汁', '西瓜汁', '橙汁'],
  dessert: ['蛋挞', '蛋糕', '面包', '布丁', '双皮奶', '芋圆', '红豆沙'],
  supermarket: ['方便面', '火腿肠', '薯片', '可乐', '雪碧', '矿泉水', '饼干'],
}

const dishDescriptions = [
  '新鲜食材，现做现卖',
  '招牌菜品，销量领先',
  '学生推荐，口碑爆款',
  '营养搭配，健康美味',
  '经典口味，回味无穷',
  '量大实惠，性价比高',
]

/**
 * 生成单个菜品
 */
export function generateDish(merchantId: number, index: number, category: string): Product {
  const names = dishNames[category] || dishNames.food
  const name = names[index % names.length]

  // 根据类别生成价格
  const priceRanges: Record<string, [number, number]> = {
    food: [8, 25],
    noodles: [10, 18],
    rice: [12, 22],
    drink: [8, 15],
    snack: [5, 20],
    fruit: [10, 25],
    dessert: [5, 15],
    supermarket: [3, 15],
  }

  const [minPrice, maxPrice] = priceRanges[category] || [10, 20]
  const price = faker.number.int({ min: minPrice, max: maxPrice })
  const originalPrice = Math.floor(price * (1 + Math.random() * 0.3))

  return {
    id: merchantId * 100 + index + 1,
    merchantId,
    name,
    price,
    originalPrice,
    image: `https://picsum.photos/seed/dish_${merchantId}_${index}/300/300`,
    description: faker.helpers.arrayElement(dishDescriptions),
    category: faker.helpers.arrayElement(['主食', '配菜', '汤品', '饮品', '小吃']),
    isRecommended: Math.random() > 0.7,
    tags: Math.random() > 0.5 ? ['招牌', '热销'].slice(0, Math.floor(Math.random() * 2) + 1) : [],
    monthSales: faker.number.int({ min: 50, max: 1000 }),
    specs: [
      {
        name: '辣度',
        options: ['不辣', '微辣', '中辣', '特辣'],
      },
      {
        name: '份量',
        options: ['标准', '大份'],
      },
    ],
  }
}

/**
 * 生成商家菜品列表
 */
export function generateMerchantDishes(merchantId: number, category: string, count: number = 12): Product[] {
  return Array.from({ length: count }, (_, i) => generateDish(merchantId, i, category))
}

/**
 * 获取推荐菜品
 */
export function getRecommendedDishes(merchantId: number, category: string, count: number = 4): Product[] {
  const allDishes = generateMerchantDishes(merchantId, category, 20)
  return allDishes.filter(d => d.isRecommended).slice(0, count)
}

// ============================================
// 订单数据生成
// ============================================

const orderStatuses = [
  { status: 'pending', text: '待支付', step: 1 },
  { status: 'paid', text: '已支付', step: 2 },
  { status: 'accepted', text: '商家已接单', step: 3 },
  { status: 'making', text: '制作中', step: 3 },
  { status: 'ready', text: '待配送', step: 4 },
  { status: 'delivering', text: '配送中', step: 4 },
  { status: 'completed', text: '已完成', step: 5 },
  { status: 'cancelled', text: '已取消', step: 0 },
]

/**
 * 生成订单
 */
export function generateOrder(index: number = 0): TakeoutOrder {
  const merchant = generateMerchants(1)[0]
  const dishes = generateMerchantDishes(merchant.id, merchant.category, 3)

  const items = dishes.map(dish => ({
    productId: dish.id,
    name: dish.name,
    price: dish.price,
    quantity: faker.number.int({ min: 1, max: 3 }),
    image: dish.image,
    specs: ['微辣', '标准'],
  }))

  const goodsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = merchant.deliveryFee
  const discount = Math.floor(goodsTotal * 0.1)
  const totalAmount = goodsTotal + deliveryFee - discount

  const statusInfo = faker.helpers.arrayElement(orderStatuses)

  return {
    id: `ORDER${Date.now()}${index}`,
    merchantId: merchant.id,
    merchantName: merchant.name,
    merchantLogo: merchant.logo,
    items,
    goodsTotal,
    deliveryFee,
    discount,
    totalAmount,
    status: statusInfo.status as any,
    statusText: statusInfo.text,
    createdAt: faker.date.recent({ days: 7 }).toISOString(),
    payTime: statusInfo.step >= 2 ? faker.date.recent({ days: 7 }).toISOString() : undefined,
    acceptTime: statusInfo.step >= 3 ? faker.date.recent({ days: 7 }).toISOString() : undefined,
    deliveryTime: statusInfo.step >= 4 ? faker.date.recent({ days: 7 }).toISOString() : undefined,
    completeTime: statusInfo.step >= 5 ? faker.date.recent({ days: 7 }).toISOString() : undefined,
    deliveryAddress: {
      name: faker.person.fullName(),
      phone: faker.phone.number('138########'),
      address: `黑龙江科技大学${faker.helpers.arrayElement(['学生公寓A栋', '学生公寓B栋', '学生公寓C栋'])}`,
      detail: `${faker.number.int({ min: 1, max: 6 })}楼${faker.number.int({ min: 100, max: 600 })}室`,
    },
    remark: Math.random() > 0.7 ? '请尽快送达，谢谢！' : '',
    deliveryInfo: statusInfo.step >= 4
      ? {
          riderName: faker.person.fullName(),
          riderPhone: faker.phone.number('138########'),
          riderAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=rider${index}`,
        }
      : undefined,
  }
}

/**
 * 生成订单列表
 */
export function generateOrders(count: number = 10): TakeoutOrder[] {
  return Array.from({ length: count }, (_, i) => generateOrder(i))
}

// ============================================
// 配送追踪数据
// ============================================

/**
 * 生成配送追踪信息
 */
export function generateDeliveryTrack(orderId: string): DeliveryTrack {
  const steps = [
    { status: 'ordered', text: '订单已提交', time: faker.date.recent({ days: 1 }).toISOString(), completed: true },
    { status: 'paid', text: '支付成功', time: faker.date.recent({ days: 1 }).toISOString(), completed: true },
    { status: 'accepted', text: '商家已接单', time: faker.date.recent({ days: 1 }).toISOString(), completed: true },
    { status: 'making', text: '商品制作中', time: faker.date.recent({ days: 1 }).toISOString(), completed: true },
    { status: 'ready', text: '等待配送', time: faker.date.recent({ days: 1 }).toISOString(), completed: true },
    { status: 'delivering', text: '骑手配送中', time: faker.date.recent({ days: 1 }).toISOString(), completed: false },
    { status: 'completed', text: '订单已完成', time: '', completed: false },
  ]

  return {
    orderId,
    status: 'delivering',
    statusText: '配送中',
    riderName: faker.person.fullName(),
    riderPhone: faker.phone.number('138########'),
    riderAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=rider_${orderId}`,
    estimatedTime: '15分钟',
    steps,
    currentLocation: {
      lat: 45.75 + Math.random() * 0.01,
      lng: 126.63 + Math.random() * 0.01,
    },
  }
}

// ============================================
// 导出商家相关函数
// ============================================

export {
  generateMerchants,
  generateMerchantDetail,
  generateRecommendedMerchants,
  generateNearbyMerchants,
  filterMerchants,
  paginateMerchants,
  getMerchantCategories,
}
