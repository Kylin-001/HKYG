/**
 * PWA Icon Generator Script
 * 用于生成黑科易购 PWA 所需的各种尺寸图标
 *
 * 运行方式: node scripts/generate-pwa-icons.js
 */

const fs = require('fs')
const path = require('path')
const { createCanvas } = require('canvas')

const ICONS_DIR = path.join(__dirname, '../public/icons')

// 确保目录存在
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true })
}

// 生成图标函数
function generateIcon(size, filename, text = '易', bgColor = '#003B80') {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // 背景填充（科大蓝）
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)

  // 圆角矩形效果（可选）
  const radius = size * 0.15
  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.lineTo(size - radius, 0)
  ctx.quadraticCurveTo(size, 0, size, radius)
  ctx.lineTo(size, size - radius)
  ctx.quadraticCurveTo(size, size, size - radius, 0)
  ctx.lineTo(radius, size)
  ctx.quadraticCurveTo(0, size, 0, size - radius)
  ctx.lineTo(0, radius)
  ctx.quadraticCurveTo(0, 0, radius, 0)
  ctx.closePath()
  ctx.fillStyle = bgColor
  ctx.fill()

  // 绘制文字 "易"
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `bold ${size * 0.5}px "Microsoft YaHei", "PingFang SC", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, size / 2, size / 2)

  // 保存为 PNG
  const buffer = canvas.toBuffer('image/png')
  const filePath = path.join(ICONS_DIR, filename)
  fs.writeFileSync(filePath, buffer)
  console.log(`✅ Generated: ${filename} (${size}x${size})`)
}

// 主应用图标尺寸列表
const iconSizes = [
  { size: 72, file: 'icon-72x72.png' },
  { size: 96, file: 'icon-96x96.png' },
  { size: 128, file: 'icon-128x128.png' },
  { size: 144, file: 'icon-144x144.png' },
  { size: 152, file: 'icon-152x152.png' },
  { size: 192, file: 'icon-192x192.png' },
  { size: 384, file: 'icon-384x384.png' },
  { size: 512, file: 'icon-512x512.png' },
]

// 快捷方式图标
const shortcutIcons = [
  { size: 96, file: 'shortcut-products.png', text: '商', bgColor: '#003B80' },
  { size: 96, file: 'shortcut-takeout.png', text: '外', bgColor: '#FF6B35' },
  { size: 96, file: 'shortcut-community.png', text: '社', bgColor: '#10B981' },
]

console.log('\n🎨 开始生成 PWA 图标...\n')

// 生成主图标
iconSizes.forEach(({ size, file }) => {
  generateIcon(size, file)
})

// 生成快捷方式图标
shortcutIcons.forEach(({ size, file, text, bgColor }) => {
  generateIcon(size, file, text, bgColor)
})

console.log('\n✨ 所有图标生成完成！')
console.log(`📁 图标保存位置: ${ICONS_DIR}`)
