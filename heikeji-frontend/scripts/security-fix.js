#!/usr/bin/env node

/**
 * 安全修复脚本
 * 用于批量修复测试文件中的硬编码密码和令牌
 */

const fs = require('fs')
const path = require('path')

// 配置
const config = {
  srcDir: path.join(__dirname, '../src'),
  excludeDirs: ['node_modules', '.git', 'dist', 'coverage', 'test-results'],
  replacements: [
    // 密码替换
    {
      pattern: /password:\s*['"`]password123['"`]/g,
      replacement: 'password: testUserData.password',
      description: "替换硬编码密码 'password123' 为测试配置变量",
    },
    {
      pattern: /password:\s*['"`]password['"`]/g,
      replacement: 'password: testUserData.password',
      description: "替换硬编码密码 'password' 为测试配置变量",
    },
    {
      pattern: /password:\s*['"`]Password['"`]/g,
      replacement: 'password: testUserData.password',
      description: "替换硬编码密码 'Password' 为测试配置变量",
    },
    {
      pattern: /Password:\s*['"`]New Password['"`]/g,
      replacement: 'Password: testUserData.password',
      description: "替换硬编码密码 'New Password' 为测试配置变量",
    },
    {
      pattern: /password:\s*['"`]wrongpassword['"`]/g,
      replacement: "password: 'wrong_test_password'",
      description: '替换硬编码错误密码为测试用错误密码',
    },
    {
      pattern: /password:\s*['"`]wrong_test_password['"`]/g,
      replacement: "password: testConfig.user.wrongPassword || 'wrong_test_password'",
      description: '替换测试错误密码为配置变量',
    },

    // 令牌替换
    {
      pattern: /token:\s*['"`]test-token-123['"`]/g,
      replacement: 'token: testUserData.token',
      description: "替换硬编码令牌 'test-token-123' 为测试配置变量",
    },
    {
      pattern: /token:\s*['"`]new-token-456['"`]/g,
      replacement: "token: testConfig.user.newToken || 'new_test_token_456'",
      description: "替换硬编码令牌 'new-token-456' 为测试配置变量",
    },
    {
      pattern: /Token\s*=\s*['"`]test-token-123['"`]/g,
      replacement: 'Token = testUserData.token',
      description: "替换硬编码令牌赋值 'test-token-123' 为测试配置变量",
    },
    {
      pattern: /token:\s*['"`]test-token['"`]/g,
      replacement: "token: testConfig.user.incompleteToken || 'incomplete_test_token'",
      description: '替换硬编码不完整令牌为测试配置变量',
    },
    {
      pattern: /token:\s*['"`]new_test_token_456['"`]/g,
      replacement: "token: testConfig.user.newToken || 'new_test_token_456'",
      description: "替换硬编码令牌 'new_test_token_456' 为测试配置变量",
    },
    {
      pattern: /token:\s*['"`]incomplete_test_token['"`]/g,
      replacement: "token: testConfig.user.incompleteToken || 'incomplete_test_token'",
      description: "替换硬编码令牌 'incomplete_test_token' 为测试配置变量",
    },

    // 用户名替换
    {
      pattern: /phone:\s*['"`]13800138001['"`]/g,
      replacement: 'phone: testUserData.phone',
      description: "替换硬编码手机号 '13800138001' 为测试配置变量",
    },

    // 添加导入语句
    {
      pattern: /(import\s+{[^}]*}\s+from\s+['"`]@\/api\/user['"`];?)/g,
      replacement: "$1\nimport { testUserData } from '@/config/test';",
      description: '在user API导入后添加测试配置导入',
      onlyIfNotExists: true,
    },
    {
      pattern: /(import\s+{[^}]*}\s+from\s+['"`]vitest['"`];?)/g,
      replacement: "$1\nimport { testUserData } from '@/config/test';",
      description: '在vitest导入后添加测试配置导入',
      onlyIfNotExists: true,
    },
  ],
}

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// 递归获取所有文件
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // 跳过排除的目录
      if (!config.excludeDirs.includes(file)) {
        getAllFiles(filePath, fileList)
      }
    } else {
      // 只处理测试文件
      if (
        file.includes('.test.') ||
        file.includes('.spec.') ||
        file.includes('.integration.test.')
      ) {
        fileList.push(filePath)
      }
    }
  })

  return fileList
}

// 修复文件中的安全问题
function fixFileSecurity(filePath) {
  const results = {
    filePath: path.relative(__dirname, '../', filePath),
    fixed: [],
    errors: [],
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8')
    let modified = false

    // 应用所有替换规则
    config.replacements.forEach(rule => {
      // 检查是否需要添加导入语句
      if (rule.onlyIfNotExists && content.includes('testUserData')) {
        return // 如果已存在，跳过
      }

      const originalContent = content
      content = content.replace(rule.pattern, rule.replacement)

      if (content !== originalContent) {
        modified = true
        results.fixed.push({
          rule: rule.description,
        })
      }
    })

    // 如果文件被修改，写回文件
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8')
    }
  } catch (error) {
    results.errors.push(error.message)
  }

  return results
}

// 生成修复报告
function generateFixReport() {
  console.log('开始安全修复...')

  // 获取所有测试文件
  const files = getAllFiles(config.srcDir)
  console.log(`检查 ${files.length} 个测试文件...`)

  // 修复每个文件
  const fileResults = []
  let totalFixed = 0
  let totalErrors = 0

  files.forEach(filePath => {
    const result = fixFileSecurity(filePath)
    if (result.fixed.length > 0 || result.errors.length > 0) {
      fileResults.push(result)
      totalFixed += result.fixed.length
      totalErrors += result.errors.length
    }
  })

  // 生成报告
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: files.length,
      filesModified: fileResults.length,
      totalFixed,
      totalErrors,
    },
    fileResults,
  }

  // 保存报告
  const reportsDir = path.join(__dirname, '../security-reports')
  ensureDir(reportsDir)

  const reportPath = path.join(reportsDir, `security-fix-report-${new Date().getTime()}.json`)
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

  console.log(`安全修复完成！`)
  console.log(`修复了 ${totalFixed} 个问题，修改了 ${fileResults.length} 个文件`)
  console.log(`报告: ${reportPath}`)

  if (totalErrors > 0) {
    console.error(`遇到 ${totalErrors} 个错误`)
  }

  return report
}

// 主函数
function main() {
  const report = generateFixReport()

  // 如果有错误，退出码为1
  if (report.summary.totalErrors > 0) {
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main()
}

module.exports = {
  generateFixReport,
  fixFileSecurity,
}
