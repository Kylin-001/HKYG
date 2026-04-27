/**
 * 下载菜品图片脚本
 * 从 Unsplash 下载免费中餐图片
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

// 菜品图片配置
const dishes = [
  {
    name: '红烧肉',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
  },
  {
    name: '宫保鸡丁',
    url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800',
  },
  {
    name: '糖醋里脊',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
  },
  {
    name: '麻婆豆腐',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
  },
  {
    name: '西红柿炒蛋',
    url: 'https://images.unsplash.com/photo-1482049016-e71a9f7e4b32?w=800',
  },
  {
    name: '土豆烧牛肉',
    url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800',
  },
  {
    name: '清炒时蔬',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  },
  {
    name: '紫菜蛋花汤',
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
  },
  {
    name: '回锅肉',
    url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6f54262?w=800',
  },
  {
    name: '鱼香肉丝',
    url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800',
  },
  {
    name: '青椒炒肉',
    url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6f54262?w=800',
  },
  {
    name: '蒜蓉西兰花',
    url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800',
  },
  {
    name: '小炒肉套餐',
    url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6f54262?w=800',
  },
  {
    name: '干锅花菜',
    url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800',
  },
  {
    name: '农家小炒肉',
    url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6f54262?w=800',
  },
  {
    name: '干煸豆角',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  },
  {
    name: '酸辣土豆丝',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  },
  {
    name: '蒜苔炒肉',
    url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6f54262?w=800',
  },
  {
    name: '地三鲜',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  },
  {
    name: '手撕包菜',
    url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800',
  },
  {
    name: '口水鸡',
    url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800',
  },
  {
    name: '拍黄瓜',
    url: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=800',
  },
  {
    name: '番茄鸡蛋汤',
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
  },
  {
    name: '玉米排骨汤',
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
  },
  {
    name: '牛肉拉面',
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  },
  {
    name: '炸酱面',
    url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800',
  },
  {
    name: '西红柿鸡蛋面',
    url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800',
  },
  {
    name: '酸菜肉丝面',
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  },
  {
    name: '韭菜猪肉饺子',
    url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
  },
  {
    name: '白菜猪肉饺子',
    url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
  },
  {
    name: '素三鲜饺子',
    url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
  },
  {
    name: '鲜肉包子',
    url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
  },
  {
    name: '香菇青菜包',
    url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
  },
  {
    name: '豆沙包',
    url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
  },
  {
    name: '葱油饼',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
  },
  {
    name: '鸡蛋灌饼',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
  },
  {
    name: '珍珠奶茶',
    url: 'https://images.unsplash.com/photo-1558855410-3112e253d704?w=800',
  },
  {
    name: '芋泥波波奶茶',
    url: 'https://images.unsplash.com/photo-1558855410-3112e253d704?w=800',
  },
  {
    name: '芝士奶盖茶',
    url: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=800',
  },
  {
    name: '水果茶',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800',
  },
  {
    name: '柠檬茶',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800',
  },
  {
    name: '百香果茶',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800',
  },
  {
    name: '抹茶拿铁',
    url: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800',
  },
  {
    name: '焦糖玛奇朵',
    url: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800',
  },
  {
    name: '布丁奶茶',
    url: 'https://images.unsplash.com/photo-1558855410-3112e253d704?w=800',
  },
  {
    name: '椰果奶茶',
    url: 'https://images.unsplash.com/photo-1558855410-3112e253d704?w=800',
  },
  {
    name: '红豆奶茶',
    url: 'https://images.unsplash.com/photo-1558855410-3112e253d704?w=800',
  },
  {
    name: '鲜榨西瓜汁',
    url: 'https://images.unsplash.com/photo-1589734580748-ac071e661f91?w=800',
  },
  {
    name: '香辣鸡腿堡',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
  },
  {
    name: '奥尔良烤翅',
    url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
  },
  {
    name: '薯条',
    url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800',
  },
  {
    name: '鸡米花',
    url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800',
  },
  {
    name: '香辣鸡翅',
    url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
  },
  {
    name: '可乐',
    url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800',
  },
  {
    name: '雪碧',
    url: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800',
  },
  {
    name: '全家桶套餐',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
  },
  {
    name: '双人套餐',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
  },
  {
    name: '鸡块',
    url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800',
  },
  {
    name: '蛋挞',
    url: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800',
  },
  {
    name: '玉米杯',
    url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800',
  },
]

// 下载目录
const downloadDir = path.join(__dirname, '..', 'public', 'images', 'dishes')

// 确保目录存在
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true })
}

// 下载单个图片
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(downloadDir, filename)

    // 如果文件已存在，跳过
    if (fs.existsSync(filepath)) {
      console.log(`✓ 已存在: ${filename}`)
      resolve()
      return
    }

    const file = fs.createWriteStream(filepath)

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`✓ 下载成功: ${filename}`)
          resolve()
        })
      } else {
        console.error(`✗ 下载失败: ${filename} (状态码: ${response.statusCode})`)
        reject(new Error(`HTTP ${response.statusCode}`))
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {})
      console.error(`✗ 下载错误: ${filename}`, err.message)
      reject(err)
    })
  })
}

// 主函数
async function main() {
  console.log('开始下载菜品图片...\n')

  let successCount = 0
  let failCount = 0

  for (const dish of dishes) {
    const filename = `${dish.name}.jpg`
    try {
      await downloadImage(dish.url, filename)
      successCount++
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      failCount++
    }
  }

  console.log('\n下载完成！')
  console.log(`成功: ${successCount} 张`)
  console.log(`失败: ${failCount} 张`)
  console.log(`\n图片保存位置: ${downloadDir}`)
}

main().catch(console.error)
