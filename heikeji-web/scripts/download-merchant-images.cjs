/**
 * 下载商家图片和 Banner
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

// 商家图片配置
const merchants = [
  { id: 1, name: '一食堂快餐', type: '中式快餐' },
  { id: 2, name: '二食堂小炒', type: '现炒小炒' },
  { id: 3, name: '学子餐厅面食', type: '面食' },
  { id: 4, name: '校园奶茶店', type: '奶茶饮品' },
  { id: 5, name: '黑科炸鸡汉堡', type: '快餐' },
]

// Banner 图片
const banners = [
  { name: 'home-banner-1', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200' },
  { name: 'home-banner-2', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200' },
  { name: 'home-banner-3', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200' },
]

// 商家封面图
const merchantImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800' },
  { id: 2, url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' },
  { id: 3, url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800' },
  { id: 4, url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800' },
  { id: 5, url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800' },
]

// 下载目录
const merchantsDir = path.join(__dirname, '..', 'public', 'images', 'merchants')
const bannersDir = path.join(__dirname, '..', 'public', 'images', 'banners')

// 确保目录存在
if (!fs.existsSync(merchantsDir)) {
  fs.mkdirSync(merchantsDir, { recursive: true })
}
if (!fs.existsSync(bannersDir)) {
  fs.mkdirSync(bannersDir, { recursive: true })
}

// 下载单个图片
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    // 如果文件已存在，跳过
    if (fs.existsSync(filepath)) {
      console.log(`✓ 已存在: ${path.basename(filepath)}`)
      resolve()
      return
    }

    const file = fs.createWriteStream(filepath)

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`✓ 下载成功: ${path.basename(filepath)}`)
          resolve()
        })
      } else {
        console.error(`✗ 下载失败: ${path.basename(filepath)} (状态码: ${response.statusCode})`)
        reject(new Error(`HTTP ${response.statusCode}`))
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {})
      console.error(`✗ 下载错误: ${path.basename(filepath)}`, err.message)
      reject(err)
    })
  })
}

// 主函数
async function main() {
  console.log('开始下载商家图片和 Banner...\n')

  let successCount = 0
  let failCount = 0

  // 下载商家图片
  console.log('--- 下载商家图片 ---')
  for (const merchant of merchantImages) {
    const filepath = path.join(merchantsDir, `merchant-${merchant.id}.jpg`)
    try {
      await downloadImage(merchant.url, filepath)
      successCount++
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      failCount++
    }
  }

  // 下载 Banner
  console.log('\n--- 下载 Banner ---')
  for (const banner of banners) {
    const filepath = path.join(bannersDir, `${banner.name}.jpg`)
    try {
      await downloadImage(banner.url, filepath)
      successCount++
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      failCount++
    }
  }

  console.log('\n下载完成！')
  console.log(`成功: ${successCount} 张`)
  console.log(`失败: ${failCount} 张`)
  console.log(`\n商家图片: ${merchantsDir}`)
  console.log(`Banner: ${bannersDir}`)
}

main().catch(console.error)
