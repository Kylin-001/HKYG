#!/usr/bin/env node

/**
 * 测试覆盖率提升脚本
 * 自动分析代码覆盖率并生成测试模板
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 配置
const config = {
  srcDir: path.join(__dirname, '../src-vue3'),
  testDir: path.join(__dirname, '../src-vue3'),
  coverageThreshold: 70,
  excludePatterns: [
    '**/node_modules/**',
    '**/*.d.ts',
    '**/*.test.ts',
    '**/*.spec.ts',
    '**/index.ts', // 通常只是导出文件
    '**/types/**', // 类型定义文件
  ],
  includePatterns: ['**/*.vue', '**/*.ts'],
}

// 分析结果
let analysisResult = {
  totalFiles: 0,
  testedFiles: 0,
  untestedFiles: [],
  lowCoverageFiles: [],
  coverageReport: null,
}

/**
 * 获取所有需要测试的文件
 */
function getAllFiles(dir, patterns, excludePatterns) {
  const files = []

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir)

    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        traverse(fullPath)
      } else if (stat.isFile()) {
        const relativePath = path.relative(config.srcDir, fullPath)

        // 检查是否匹配包含模式
        const isIncluded = patterns.some(pattern => {
          const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'))
          return regex.test(relativePath)
        })

        // 检查是否匹配排除模式
        const isExcluded = excludePatterns.some(pattern => {
          const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'))
          return regex.test(relativePath)
        })

        if (isIncluded && !isExcluded) {
          files.push(fullPath)
        }
      }
    }
  }

  traverse(dir)
  return files
}

/**
 * 运行测试并获取覆盖率报告
 */
function runCoverageTest() {
  try {
    console.log('🔍 运行测试覆盖率分析...')

    const testCommand = 'npm run test:coverage'
    const output = execSync(testCommand, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: path.join(__dirname, '..'),
    })

    console.log('✅ 测试覆盖率分析完成')
    return true
  } catch (error) {
    console.error('❌ 测试覆盖率分析失败:', error.message)
    return false
  }
}

/**
 * 解析覆盖率报告
 */
function parseCoverageReport() {
  const coverageFile = path.join(__dirname, '../coverage/coverage-summary.json')

  if (!fs.existsSync(coverageFile)) {
    console.error('❌ 覆盖率报告文件不存在:', coverageFile)
    return null
  }

  try {
    const coverageData = JSON.parse(fs.readFileSync(coverageFile, 'utf8'))
    return coverageData
  } catch (error) {
    console.error('❌ 解析覆盖率报告失败:', error.message)
    return null
  }
}

/**
 * 分析文件覆盖率
 */
function analyzeFileCoverage(coverageData, files) {
  const result = {
    totalFiles: files.length,
    testedFiles: 0,
    untestedFiles: [],
    lowCoverageFiles: [],
  }

  for (const file of files) {
    const relativePath = path.relative(config.srcDir, file)
    const coverageKey = path.join(config.srcDir, relativePath)

    let coverage = null
    if (coverageData && coverageData[coverageKey]) {
      coverage = coverageData[coverageKey]
    }

    if (coverage && coverage.lines && coverage.lines.pct > 0) {
      result.testedFiles++

      if (coverage.lines.pct < config.coverageThreshold) {
        result.lowCoverageFiles.push({
          file: relativePath,
          coverage: coverage.lines.pct,
        })
      }
    } else {
      result.untestedFiles.push({
        file: relativePath,
        coverage: 0,
      })
    }
  }

  return result
}

/**
 * 生成测试模板
 */
function generateTestTemplate(filePath) {
  const relativePath = path.relative(config.srcDir, filePath)
  const testFilePath = filePath.replace(/\.(vue|ts)$/, '.test.ts')
  const componentName = path.basename(filePath, path.extname(filePath))

  // 确定文件类型
  const isVueFile = filePath.endsWith('.vue')
  const isTsFile = filePath.endsWith('.ts')

  let template = ''

  if (isVueFile) {
    template = generateVueTestTemplate(relativePath, componentName)
  } else if (isTsFile) {
    template = generateTsTestTemplate(relativePath, componentName)
  }

  return {
    testFilePath,
    template,
  }
}

/**
 * 生成Vue组件测试模板
 */
function generateVueTestTemplate(relativePath, componentName) {
  return `import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ${componentName} from '../${relativePath}'

// Mock any dependencies here
vi.mock('@/api/your-module', () => ({
  // Mock your API functions
}))

describe('${componentName} Component', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    wrapper = mount(${componentName}, {
      global: {
        stubs: {
          // Stub any child components here
        },
      },
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct content', () => {
    // Add your specific tests here
    expect(wrapper.text()).toContain('')
  })

  // Add more tests as needed
})
`
}

/**
 * 生成TypeScript文件测试模板
 */
function generateTsTestTemplate(relativePath, moduleName) {
  return `import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ${moduleName} } from '../${relativePath}'

// Mock any dependencies here
vi.mock('@/utils/your-helper', () => ({
  // Mock your helper functions
}))

describe('${moduleName}', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(${moduleName}).toBeDefined()
  })

  // Add more tests as needed
})
`
}

/**
 * 创建测试文件
 */
function createTestFile(testFilePath, template) {
  try {
    // 确保目录存在
    const dir = path.dirname(testFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // 检查文件是否已存在
    if (fs.existsSync(testFilePath)) {
      console.log(`⚠️  测试文件已存在: ${testFilePath}`)
      return false
    }

    // 创建测试文件
    fs.writeFileSync(testFilePath, template, 'utf8')
    console.log(`✅ 创建测试文件: ${testFilePath}`)
    return true
  } catch (error) {
    console.error(`❌ 创建测试文件失败: ${testFilePath}`, error.message)
    return false
  }
}

/**
 * 生成测试报告
 */
function generateReport(analysisResult) {
  const reportPath = path.join(__dirname, '../test-coverage-report.md')

  let report = `# 测试覆盖率报告

## 总览

- 总文件数: ${analysisResult.totalFiles}
- 已测试文件数: ${analysisResult.testedFiles}
- 未测试文件数: ${analysisResult.untestedFiles.length}
- 低覆盖率文件数: ${analysisResult.lowCoverageFiles.length}
- 覆盖率: ${((analysisResult.testedFiles / analysisResult.totalFiles) * 100).toFixed(2)}%

## 未测试文件

`

  if (analysisResult.untestedFiles.length > 0) {
    for (const file of analysisResult.untestedFiles) {
      report += `- ${file.file}\n`
    }
  } else {
    report += '🎉 所有文件都有测试覆盖！\n'
  }

  report += `\n## 低覆盖率文件 (< ${config.coverageThreshold}%)\n\n`

  if (analysisResult.lowCoverageFiles.length > 0) {
    for (const file of analysisResult.lowCoverageFiles) {
      report += `- ${file.file} (${file.coverage.toFixed(2)}%)\n`
    }
  } else {
    report += '🎉 所有文件都达到覆盖率要求！\n'
  }

  report += `\n## 建议\n\n`

  if (analysisResult.untestedFiles.length > 0) {
    report += `1. 为未测试的文件创建测试用例\n`
  }

  if (analysisResult.lowCoverageFiles.length > 0) {
    report += `2. 提高低覆盖率文件的测试覆盖率\n`
  }

  report += `3. 定期运行此脚本检查覆盖率\n`
  report += `4. 设置CI/CD流水线确保覆盖率不低于${config.coverageThreshold}%\n`

  try {
    fs.writeFileSync(reportPath, report, 'utf8')
    console.log(`✅ 生成测试报告: ${reportPath}`)
  } catch (error) {
    console.error(`❌ 生成测试报告失败:`, error.message)
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始测试覆盖率分析...')

  // 获取所有需要测试的文件
  const files = getAllFiles(config.srcDir, config.includePatterns, config.excludePatterns)
  console.log(`📁 找到 ${files.length} 个需要测试的文件`)

  // 运行测试覆盖率
  const testSuccess = runCoverageTest()
  if (!testSuccess) {
    console.log('⚠️  测试运行失败，将基于现有文件生成测试模板')
  }

  // 解析覆盖率报告
  const coverageData = parseCoverageReport()

  // 分析文件覆盖率
  analysisResult = analyzeFileCoverage(coverageData, files)

  console.log(`📊 测试覆盖率分析结果:`)
  console.log(`   总文件数: ${analysisResult.totalFiles}`)
  console.log(`   已测试文件数: ${analysisResult.testedFiles}`)
  console.log(`   未测试文件数: ${analysisResult.untestedFiles.length}`)
  console.log(`   低覆盖率文件数: ${analysisResult.lowCoverageFiles.length}`)

  // 为未测试的文件生成测试模板
  let createdTests = 0
  for (const file of analysisResult.untestedFiles) {
    const filePath = path.join(config.srcDir, file.file)
    const { testFilePath, template } = generateTestTemplate(filePath)

    if (createTestFile(testFilePath, template)) {
      createdTests++
    }
  }

  console.log(`📝 为 ${createdTests} 个文件创建了测试模板`)

  // 生成报告
  generateReport(analysisResult)

  console.log('✅ 测试覆盖率分析完成！')
  console.log(`📄 查看详细报告: ${path.join(__dirname, '../test-coverage-report.md')}`)

  // 如果有未测试的文件，返回非零退出码
  if (analysisResult.untestedFiles.length > 0) {
    process.exit(1)
  }
}

// 运行主函数
if (require.main === module) {
  main()
}

module.exports = {
  main,
  analyzeFileCoverage,
  generateTestTemplate,
  createTestFile,
  generateReport,
}
