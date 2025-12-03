const fs = require('fs')
const path = require('path')

// 要检查的目录
const targetDir = path.join(__dirname, 'src')

// 存储所有Vue 2组件的路径
const vue2Components = []

// 检查文件是否是Vue 2组件
function isVue2Component(fileContent) {
  // 检查是否使用了Vue 2的选项式API
  const hasOptionsAPI =
    /export\s+default\s+\{[\s\S]*?\}/.test(fileContent) &&
    (/data\s*\(\)\s*\{[\s\S]*?\}/.test(fileContent) ||
      /methods\s*:\s*\{[\s\S]*?\}/.test(fileContent) ||
      /computed\s*:\s*\{[\s\S]*?\}/.test(fileContent) ||
      /watch\s*:\s*\{[\s\S]*?\}/.test(fileContent) ||
      /mounted\s*\(\)\s*\{[\s\S]*?\}/.test(fileContent))

  // 检查是否使用了Vue 3的组合式API
  const hasCompositionAPI =
    /<script\s+setup/.test(fileContent) ||
    /import\s+\{[\s\S]*?ref|reactive|computed|onMounted[\s\S]*?\}\s+from\s+'vue'/.test(fileContent)

  return hasOptionsAPI && !hasCompositionAPI
}

// 递归遍历目录
function traverseDir(dir) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      // 递归遍历子目录
      traverseDir(filePath)
    } else if (file.endsWith('.vue')) {
      // 读取Vue文件内容
      const content = fs.readFileSync(filePath, 'utf8')

      // 检查是否是Vue 2组件
      if (isVue2Component(content)) {
        // 将路径转换为相对路径
        const relativePath = path.relative(__dirname, filePath)
        vue2Components.push(relativePath)
      }
    }
  })
}

// 开始遍历
console.log('正在检查Vue 2组件...')
traverseDir(targetDir)

// 输出结果
console.log(`\n总计需要迁移 ${vue2Components.length} 个Vue 2组件：`)
vue2Components.forEach(component => {
  console.log(`- ${component}`)
})

if (vue2Components.length > 0) {
  console.log(`\n下一个待迁移的组件：${vue2Components[0]}`)
}
