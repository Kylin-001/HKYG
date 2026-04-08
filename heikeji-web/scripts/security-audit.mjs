#!/usr/bin/env node

/**
 * ============================================
 * 黑科易购 (heikeji-web) - 安全审计工具
 * 检查常见安全问题并提供修复建议
 * ============================================
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  category: string
  file: string
  line?: number
  message: string
  recommendation: string
}

class SecurityAuditor {
  private issues: SecurityIssue[] = []
  private projectRoot: string

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot
  }

  async audit(): Promise<SecurityIssue[]> {
    console.log('🔒 开始安全审计...\n')

    await this.checkDependencies()
    await this.checkEnvironmentVariables()
    await this.checkCodePatterns()
    await this.checkConfigurationFiles()
    await this.checkGitHistory()

    return this.issues
  }

  private async checkDependencies(): Promise<void> {
    console.log('📦 检查依赖包安全...')

    try {
      const pkgPath = path.join(this.projectRoot, 'package.json')
      if (!fs.existsSync(pkgPath)) return

      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      const deps = { ...pkg.dependencies, ...pkg.devDependencies }

      // 已知漏洞的包
      const vulnerablePackages = [
        { name: 'lodash', minVersion: '4.17.21', issue: '原型污染漏洞' },
        { name: 'axios', minVersion: '0.27.2', issue: 'SSRF漏洞' },
        { name: 'express', minVersion: '4.18.0', issue: '多个安全漏洞' },
        { name: 'debug', minVersion: '4.3.4', issue: '信息泄露风险' }
      ]

      for (const vuln of vulnerablePackages) {
        if (deps[vuln.name]) {
          this.addIssue({
            severity: 'high',
            category: '依赖安全',
            file: 'package.json',
            message: `依赖 ${vuln.name} 可能存在${vuln.issue}`,
            recommendation: `升级到 ${vuln.minVersion} 或更高版本`
          })
        }
      }

      // 检查是否有未使用的依赖
      if (deps['jquery']) {
        this.addIssue({
          severity: 'medium',
          category: '依赖优化',
          file: 'package.json',
          message: '检测到jQuery依赖，Vue项目通常不需要',
          recommendation: '移除jQuery，使用Vue原生方法或现代替代库'
        })
      }
    } catch (error) {
      console.warn('依赖检查跳过:', error)
    }
  }

  private async checkEnvironmentVariables(): Promise<void> {
    console.log('🔐 检查环境变量安全...')

    const envFiles = ['.env', '.env.local', '.env.production']
    
    for (const envFile of envFiles) {
      const filePath = path.join(this.projectRoot, envFile)
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8')
        
        // 检查敏感信息
        const sensitivePatterns = [
          { pattern: /PASSWORD\s*=\s*\w+/i, type: '密码' },
          { pattern: /SECRET\s*=\s*\w+/i, type: '密钥' },
          { pattern: /API_KEY\s*=\s*\w+/i, type: 'API密钥' },
          { pattern: /TOKEN\s*=\s*\w+/i, type: 'Token' },
          { pattern: /PRIVATE\s*=\s*\w+/i, type: '私钥' }
        ]

        for (const { pattern, type } of sensitivePatterns) {
          const lines = content.split('\n')
          lines.forEach((line, index) => {
            if (pattern.test(line) && !line.includes('change-in-production')) {
              this.addIssue({
                severity: 'critical',
                category: '敏感信息泄露',
                file: envFile,
                line: index + 1,
                message: `${type}可能硬编码在环境变量文件中`,
                recommendation: '使用强随机值，并确保.env已添加到.gitignore'
              })
            }
          })
        }

        // 检查是否在版本控制中
        if (fs.existsSync(path.join(this.projectRoot, '.git'))) {
          const gitignorePath = path.join(this.projectRoot, '.gitignore')
          if (fs.existsSync(gitignorePath)) {
            const gitignore = fs.readFileSync(gitignorePath, 'utf-8')
            if (!gitignore.includes(envFile)) {
              this.addIssue({
                severity: 'high',
                category: '版本控制',
                file: '.gitignore',
                message: `${envFile} 未添加到 .gitignore`,
                recommendation: `将 ${envFile} 添加到 .gitignore`
              })
            }
          }
        }
      }
    }
  }

  private async checkCodePatterns(): Promise<void> {
    console.log('🔍 检查代码安全模式...')

    const dangerousPatterns = [
      {
        pattern: /eval\(/g,
        severity: 'critical' as const,
        category: '代码注入',
        message: '使用eval()可能导致代码注入攻击',
        recommendation: '避免使用eval，改用更安全的替代方案'
      },
      {
        pattern: /innerHTML\s*=/g,
        severity: 'high' as const,
        category: 'XSS风险',
        message: 'innerHTML使用可能导致XSS攻击',
        recommendation: '使用textContent或Vue的模板语法代替'
      },
      {
        pattern: /document\.write\(/g,
        severity: 'critical' as const,
        category: '代码注入',
        message: 'document.write()不安全',
        recommendation: '使用DOM API或框架提供的方法'
      },
      {
        pattern: /localStorage\.setItem.*password/gi,
        severity: 'high' as const,
        category: '敏感数据存储',
        message: '密码存储在localStorage中',
        recommendation: '永远不要在客户端存储密码等敏感信息'
      },
      {
        pattern: /console\.log\(/g,
        severity: 'low' as const,
        category: '信息泄露',
        message: '生产环境不应有console.log',
        recommendation: '移除或替换为日志系统'
      },
      {
        pattern: /@ts-ignore/g,
        severity: 'medium' as const,
        category: '类型安全',
        message: '@ts-ignore会绕过TypeScript检查',
        recommendation: '使用正确的类型声明替代'
      }
    ]

    const scanDir = path.join(this.projectRoot, 'src')
    this.scanDirectory(scanDir, dangerousPatterns)
  }

  private async checkConfigurationFiles(): Promise<void> {
    console.log('⚙️  检查配置文件安全...')

    // 检查Vite配置
    const viteConfigPath = path.join(this.projectRoot, 'vite.config.ts')
    if (fs.existsSync(viteConfigPath)) {
      const config = fs.readFileSync(viteConfigPath, 'utf-8')
      
      if (config.includes('host: "0.0.0.0"') || config.includes("host: '0.0.0.0'")) {
        this.addIssue({
          severity: 'medium',
          category: '网络安全',
          file: 'vite.config.ts',
          message: '开发服务器绑定到0.0.0.0（仅开发模式可接受）',
          recommendation: '生产环境应绑定到127.0.0.1或特定接口'
        })
      }
    }

    // 检查ESLint配置
    const eslintPath = path.join(this.projectRoot, '.eslintrc.js')
    if (!fs.existsSync(eslintPath) && !fs.existsSync(path.join(this.projectRoot, '.eslintrc.cjs'))) {
      this.addIssue({
        severity: 'medium',
        category: '代码质量',
        file: '',
        message: '未找到ESLint配置文件',
        recommendation: '创建ESLint配置以强制代码规范和安全规则'
      })
    }
  }

  private async checkGitHistory(): Promise<void> {
    console.log('📜 检查Git历史...')

    try {
      const { execSync } = await import('child_process')
      
      // 检查是否有敏感信息提交历史
      const result = execSync(
        'git log --all --full-history -p --diff-filter=ACDM -S "password" -S "secret" -S "api_key" -- . 2>/dev/null | head -20',
        { encoding: 'utf-8', cwd: this.projectRoot }
      )

      if (result && result.trim()) {
        this.addIssue({
          severity: 'critical',
          category: 'Git安全',
          file: '.git/history',
          message: 'Git历史中发现可能的敏感信息提交',
          recommendation: '使用 git filter-branch 或 BFG Repo Cleaner 清理历史，然后轮换所有密钥'
        })
      }
    } catch {
      // Git检查失败时跳过
    }
  }

  private scanDirectory(dir: string, patterns: Array<{
    pattern: RegExp
    severity: SecurityIssue['severity']
    category: string
    message: string
    recommendation: string
  }>): void {
    if (!fs.existsSync(dir)) return

    const files = this.getAllFiles(dir)

    for (const file of files) {
      // 跳过node_modules和dist
      if (file.includes('node_modules') || file.includes('dist')) continue

      try {
        const content = fs.readFileSync(file, 'utf-8')
        const lines = content.split('\n')

        lines.forEach((line, index) => {
          for (const { pattern, severity, category, message, recommendation } of patterns) {
            if (pattern.test(line)) {
              this.addIssue({
                severity,
                category,
                file: path.relative(this.projectRoot, file),
                line: index + 1,
                message,
                recommendation
              })
            }
          }
        })
      } catch {
        // 无法读取文件时跳过
      }
    }
  }

  private getAllFiles(dir: string): string[] {
    let results: string[] = []

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
          results = results.concat(this.getAllFiles(fullPath))
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.vue') || entry.name.endsWith('.js'))) {
          results.push(fullPath)
        }
      }
    } catch {
      // 目录无法访问时跳过
    }

    return results
  }

  private addIssue(issue: SecurityIssue): void {
    this.issues.push(issue)
  }

  generateReport(): void {
    console.log('\n' + '='.repeat(60))
    console.log('📋 安全审计报告')
    console.log('='.repeat(60) + '\n')

    if (this.issues.length === 0) {
      console.log('✅ 未发现安全问题！项目安全性良好。\n')
      return
    }

    // 按严重程度分组
    const grouped = {
      critical: this.issues.filter(i => i.severity === 'critical'),
      high: this.issues.filter(i => i.severity === 'high'),
      medium: this.issues.filter(i => i.severity === 'medium'),
      low: this.issues.filter(i => i.severity === 'low'),
      info: this.issues.filter(i => i.severity === 'info')
    }

    const severityOrder = ['critical', 'high', 'medium', 'low', 'info']
    const severityIcons = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢',
      info: '🔵'
    }

    let totalScore = 100

    for (const severity of severityOrder) {
      const issues = grouped[severity]
      if (issues.length > 0) {
        console.log(`${severityIcons[severity]} ${severity.toUpperCase()} (${issues.length}个问题)`)
        console.log('-'.repeat(50))

        issues.forEach((issue, index) => {
          console.log(`  ${index + 1}. [${issue.category}] ${issue.message}`)
          if (issue.file) {
            console.log(`     📄 文件: ${issue.file}${issue.line ? `:${issue.line}` : ''}`)
          }
          console.log(`     💡 建议: ${issue.recommendation}`)
          console.log('')
        })

        // 扣分
        const deductions = { critical: 25, high: 15, medium: 8, low: 3, info: 1 }
        totalScore -= deductions[severity] * issues.length
      }
    }

    // 总结
    console.log('='.repeat(60))
    console.log('📊 审计总结')
    console.log('='.repeat(60))
    console.log(`   总问题数: ${this.issues.length}`)
    console.log(`   安全评分: ${Math.max(0, totalScore)}/100`)
    console.log('')
    
    if (totalScore < 70) {
      console.log('⚠️  项目存在严重安全问题，建议立即修复！')
    } else if (totalScore < 90) {
      console.log('⚡ 项目安全性一般，建议尽快修复发现的问题。')
    } else {
      console.log('✅ 项目安全性良好，继续保持！')
    }
    console.log('')
  }
}

// 主程序
async function main(): Promise<void> {
  const auditor = new SecurityAuditor()
  
  await auditor.audit()
  auditor.generateReport()

  // 输出退出码（有问题时非零退出）
  const hasCriticalIssues = auditor['issues'].some((i: SecurityIssue) => i.severity === 'critical')
  process.exit(hasCriticalIssues ? 1 : 0)
}

main().catch(console.error)
