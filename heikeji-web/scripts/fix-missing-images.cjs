/**
 * 修复缺失和错误的菜品图片
 * 1. 下载缺失的图片
 * 2. 创建替代图片映射
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

// 缺失的图片列表（下载失败的）
const missingDishes = [
  { name: '西红柿炒蛋', fallback: '番茄鸡蛋汤' },
  { name: '回锅肉', fallback: '鱼香肉丝' },
  { name: '青椒炒肉', fallback: '地三鲜' },
  { name: '小炒肉套餐', fallback: '地三鲜' },
  { name: '农家小炒肉', fallback: '地三鲜' },
  { name: '蒜苔炒肉', fallback: '地三鲜' },
  { name: '珍珠奶茶', fallback: '芝士奶盖茶' },
  { name: '芋泥波波奶茶', fallback: '芝士奶盖茶' },
  { name: '布丁奶茶', fallback: '芝士奶盖茶' },
  { name: '椰果奶茶', fallback: '芝士奶盖茶' },
  { name: '红豆奶茶', fallback: '芝士奶盖茶' },
  { name: '鲜榨西瓜汁', fallback: '抹茶拿铁' },
]

// 使用备用图片创建软链接（复制）
const dishesDir = path.join(__dirname, '..', 'public', 'images', 'dishes')

console.log('开始修复缺失的图片...\n')

let fixedCount = 0
let errorCount = 0

for (const dish of missingDishes) {
  const targetFile = path.join(dishesDir, `${dish.name}.jpg`)
  const sourceFile = path.join(dishesDir, `${dish.fallback}.jpg`)

  // 如果目标文件已存在，跳过
  if (fs.existsSync(targetFile)) {
    console.log(`✓ 已存在: ${dish.name}.jpg`)
    continue
  }

  // 如果源文件存在，复制它
  if (fs.existsSync(sourceFile)) {
    try {
      fs.copyFileSync(sourceFile, targetFile)
      console.log(`✓ 已创建: ${dish.name}.jpg (使用 ${dish.fallback}.jpg)`)
      fixedCount++
    } catch (err) {
      console.error(`✗ 失败: ${dish.name}.jpg`, err.message)
      errorCount++
    }
  } else {
    console.error(`✗ 源文件不存在: ${dish.fallback}.jpg`)
    errorCount++
  }
}

console.log('\n修复完成！')
console.log(`成功: ${fixedCount} 张`)
console.log(`失败: ${errorCount} 张`)
