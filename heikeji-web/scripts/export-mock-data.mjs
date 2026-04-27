#!/usr/bin/env node
/**
 * Mock 数据导出脚本
 * 将生成的 mock 数据导出为 JSON 文件，供后端使用
 *
 * 使用方法:
 * node scripts/export-mock-data.mjs
 * node scripts/export-mock-data.mjs --count 500 --output ./data
 */

import { faker } from '@faker-js/faker/locale/zh_CN'
import fs from 'fs'
import path from 'path'

// 解析命令行参数
const args = process.argv.slice(2)
const getArg = (flag, defaultValue) => {
  const index = args.indexOf(flag)
  return index !== -1 ? args[index + 1] : defaultValue
}

const config = {
  productCount: parseInt(getArg('--products', '200')),
  merchantCount: parseInt(getArg('--merchants', '30')),
  userCount: parseInt(getArg('--users', '100')),
  orderCount: parseInt(getArg('--orders', '50')),
  outputDir: getArg('--output', './exported-data'),
}

console.log('📦 Mock 数据导出工具')
console.log('====================')
console.log(`商品数量: ${config.productCount}`)
console.log(`商家数量: ${config.merchantCount}`)
console.log(`用户数量: ${config.userCount}`)
console.log(`订单数量: ${config.orderCount}`)
console.log(`输出目录: ${config.outputDir}`)
console.log('')

// 确保输出目录存在
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true })
}

// ============================================
// 数据生成函数
// ============================================

function generateProducts(count) {
  const categories = ['electronics', 'books', 'sports', 'daily', 'clothing', 'furniture', 'food', 'other']
  const conditions = ['brand_new', 'like_new', 'good', 'fair']

  return Array.from({ length: count }, (_, i) => {
    const category = categories[i % categories.length]
    const condition = conditions[i % conditions.length]
    const price = Math.floor(Math.random() * 5000) + 10

    return {
      id: i + 1,
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price,
      originalPrice: Math.floor(price * 1.5),
      category,
      condition,
      sellerId: `user_${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
      sellerName: faker.person.fullName(),
      location: faker.location.streetAddress(),
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
      status: 'on_sale',
      isNegotiable: Math.random() > 0.5,
      publishedAt: faker.date.recent({ days: 60 }).toISOString(),
      images: [`https://picsum.photos/seed/product_${i}/400/300`],
    }
  })
}

function generateMerchants(count) {
  const categories = [
    { id: 'food', name: '美食', tags: ['中餐', '快餐', '学生餐'] },
    { id: 'drink', name: '饮品', tags: ['奶茶', '果茶', '咖啡'] },
    { id: 'snack', name: '小吃', tags: ['炸鸡', '汉堡', '烧烤'] },
    { id: 'fruit', name: '水果', tags: ['水果捞', '鲜切', '果汁'] },
    { id: 'dessert', name: '甜点', tags: ['蛋糕', '面包', '甜品'] },
    { id: 'supermarket', name: '超市', tags: ['日用品', '零食', '饮料'] },
  ]

  return Array.from({ length: count }, (_, i) => {
    const category = categories[i % categories.length]

    return {
      id: i + 1,
      name: faker.company.name() + category.name,
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      sales: Math.floor(Math.random() * 8000) + 100,
      minOrder: Math.floor(Math.random() * 20) + 8,
      deliveryFee: Math.floor(Math.random() * 3),
      deliveryTime: `${Math.floor(Math.random() * 25) + 10}分钟`,
      tags: category.tags,
      category: category.id,
      isOpen: Math.random() > 0.1,
      location: faker.location.streetAddress(),
      phone: faker.phone.number('138########'),
      businessHours: '06:30-22:00',
      description: faker.company.catchPhrase(),
    }
  })
}

function generateUsers(count) {
  const schools = ['计算机学院', '理学院', '管理学院', '机械学院', '电气学院']
  const majors = ['软件工程', '计算机科学', '工商管理', '机械设计', '电气工程']

  return Array.from({ length: count }, (_, i) => {
    const schoolIndex = i % schools.length

    return {
      id: i + 1,
      username: `user_${2021001000 + i}`,
      nickname: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number('138########'),
      studentId: `${2021}${String(schoolIndex + 1).padStart(2, '0')}${String(i + 1).padStart(4, '0')}`,
      school: schools[schoolIndex],
      major: majors[schoolIndex],
      grade: '2021级',
      gender: Math.random() > 0.5 ? 'male' : 'female',
      createdAt: faker.date.past({ years: 3 }).toISOString(),
      status: 'active',
    }
  })
}

function generateOrders(count, merchants, users) {
  const statuses = ['pending', 'paid', 'accepted', 'making', 'delivering', 'completed']

  return Array.from({ length: count }, (_, i) => {
    const merchant = merchants[Math.floor(Math.random() * merchants.length)]
    const user = users[Math.floor(Math.random() * users.length)]
    const totalAmount = Math.floor(Math.random() * 100) + 20

    return {
      id: `ORDER${Date.now()}${i}`,
      merchantId: merchant.id,
      merchantName: merchant.name,
      userId: user.id,
      userName: user.nickname,
      totalAmount,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: faker.date.recent({ days: 30 }).toISOString(),
      deliveryAddress: {
        name: user.nickname,
        phone: user.phone,
        address: faker.location.streetAddress(),
      },
      items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
        name: faker.commerce.productName(),
        price: Math.floor(Math.random() * 30) + 10,
        quantity: Math.floor(Math.random() * 2) + 1,
      })),
    }
  })
}

// ============================================
// 导出数据
// ============================================

console.log('🚀 开始生成数据...\n')

// 生成数据
const users = generateUsers(config.userCount)
console.log(`✅ 生成 ${users.length} 个用户`)

const products = generateProducts(config.productCount)
console.log(`✅ 生成 ${products.length} 个商品`)

const merchants = generateMerchants(config.merchantCount)
console.log(`✅ 生成 ${merchants.length} 个商家`)

const orders = generateOrders(config.orderCount, merchants, users)
console.log(`✅ 生成 ${orders.length} 个订单`)

// 保存为 JSON 文件
const files = [
  { name: 'users.json', data: users },
  { name: 'products.json', data: products },
  { name: 'merchants.json', data: merchants },
  { name: 'orders.json', data: orders },
]

console.log('\n💾 保存数据文件...\n')

files.forEach(({ name, data }) => {
  const filePath = path.join(config.outputDir, name)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`  ✓ ${name} (${data.length} 条记录)`)
})

// 生成汇总报告
const summary = {
  generatedAt: new Date().toISOString(),
  counts: {
    users: users.length,
    products: products.length,
    merchants: merchants.length,
    orders: orders.length,
  },
  filePaths: files.map(f => path.join(config.outputDir, f.name)),
}

const summaryPath = path.join(config.outputDir, 'summary.json')
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8')

console.log('\n📊 数据统计')
console.log('==========')
console.log(`总用户数: ${users.length}`)
console.log(`总商品数: ${products.length}`)
console.log(`总商家数: ${merchants.length}`)
console.log(`总订单数: ${orders.length}`)

console.log('\n✨ 导出完成！')
console.log(`📁 数据保存在: ${path.resolve(config.outputDir)}`)
console.log('\n使用方式:')
console.log('  1. 直接导入 JSON 文件到数据库')
console.log('  2. 使用 summary.json 查看数据概览')
console.log('  3. 根据需要调整数据格式后使用')
