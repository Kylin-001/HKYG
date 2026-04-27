import { readFile, writeFile, readdir, stat } from 'fs/promises'
import { join, extname } from 'path'

const srcDir = './src'
const targetExtensions = ['.vue', '.ts', '.tsx', '.js', '.jsx']

async function replaceInFile(filePath) {
  try {
    let content = await readFile(filePath, 'utf-8')
    const originalContent = content
    
    // 替换各种导入模式
    content = content.replace(
      /import\s*\{\s*useI18n\s*\}\s*from\s*['"]vue-i18n['"]/g,
      "import { useI18n } from '@/locales'"
    )
    content = content.replace(
      /import\s*\{\s*t\s*\}\s*from\s*['"]vue-i18n['"]/g,
      "import { t } from '@/locales'"
    )
    content = content.replace(
      /import\s*\{\s*createI18n\s*\}\s*from\s*['"]vue-i18n['"]/g,
      "import { createI18n } from '@/locales'"
    )
    content = content.replace(
      /import\s*\{\s*useI18n,\s*t\s*\}\s*from\s*['"]vue-i18n['"]/g,
      "import { useI18n, t } from '@/locales'"
    )
    content = content.replace(
      /import\s*\{\s*t,\s*useI18n\s*\}\s*from\s*['"]vue-i18n['"]/g,
      "import { t, useI18n } from '@/locales'"
    )
    
    if (content !== originalContent) {
      await writeFile(filePath, content, 'utf-8')
      console.log(`✓ 已更新: ${filePath}`)
      return true
    }
    return false
  } catch (error) {
    console.error(`✗ 错误: ${filePath} - ${error.message}`)
    return false
  }
}

async function walkDir(dir) {
  const files = await readdir(dir)
  let updatedCount = 0
  
  for (const file of files) {
    const filePath = join(dir, file)
    const stats = await stat(filePath)
    
    if (stats.isDirectory()) {
      updatedCount += await walkDir(filePath)
    } else if (targetExtensions.includes(extname(file))) {
      const updated = await replaceInFile(filePath)
      if (updated) updatedCount++
    }
  }
  
  return updatedCount
}

console.log('开始替换 vue-i18n 导入...')
const count = await walkDir(srcDir)
console.log(`\n完成! 共更新了 ${count} 个文件`)
