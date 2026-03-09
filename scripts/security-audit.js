#!/usr/bin/env node

/**
 * 代码安全审计和漏洞扫描工具
 * 用于扫描代码中的安全漏洞和敏感信息泄露
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 配置
const config = {
  projectDir: path.join(__dirname, '..'),
  reportDir: path.join(__dirname, '../security-reports'),
  srcDir: path.join(__dirname, '../src'),
  srcVue3Dir: path.join(__dirname, '../src-vue3'),
  excludePatterns: [
    'node_modules',
    '.git',
    'dist',
    'coverage',
    'test-results',
    '*.min.js',
    '*.map'
  ]
}

/**
 * 确保目录存在
 */
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/**
 * 获取所有源代码文件
 */
function getAllSourceFiles(dir, excludePatterns) {
  const files = []
  
  function traverse(currentDir) {
    try {
      const items = fs.readdirSync(currentDir)
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item)
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
          // 检查是否应该排除此目录
          if (excludePatterns.some(pattern => item.includes(pattern))) {
            continue
          }
          traverse(fullPath)
        } else if (stat.isFile()) {
          // 检查文件扩展名
          const ext = path.extname(fullPath)
          if (['.js', '.ts', '.vue', '.jsx', '.tsx'].includes(ext)) {
            // 检查是否应该排除此文件
            if (!excludePatterns.some(pattern => fullPath.includes(pattern))) {
              files.push(fullPath)
            }
          }
        }
      }
    } catch (error) {
      console.warn(`警告: 无法读取目录 ${currentDir}: ${error.message}`)
    }
  }
  
  traverse(dir)
  return files
}

/**
 * 扫描文件中的敏感信息
 */
function scanSensitiveInfo(filePath) {
  const issues = []
  
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    
    lines.forEach((line, index) => {
      // 检查硬编码的密码
      const passwordPatterns = [
        /password\s*=\s*['"]([^'"]+)['"]/gi,
        /pwd\s*=\s*['"]([^'"]+)['"]/gi,
        /secret\s*=\s*['"]([^'"]+)['"]/gi,
        /token\s*=\s*['"]([^'"]+)['"]/gi,
        /key\s*=\s*['"]([^'"]+)['"]/gi
      ]
      
      passwordPatterns.forEach(pattern => {
        const matches = [...line.matchAll(pattern)]
        matches.forEach(match => {
          issues.push({
            type: 'hardcoded_password',
            line: index + 1,
            description: `发现硬编码的敏感信息: ${match[0]}`,
            severity: 'high'
          })
        })
      })
      
      // 检查API密钥
      const apiKeyPatterns = [
        /api[_-]?key\s*=\s*['"]([^'"]+)['"]/gi,
        /access[_-]?token\s*=\s*['"]([^'"]+)['"]/gi,
        /private[_-]?key\s*=\s*['"]([^'"]+)['"]/gi
      ]
      
      apiKeyPatterns.forEach(pattern => {
        const matches = [...line.matchAll(pattern)]
        matches.forEach(match => {
          issues.push({
            type: 'api_key_exposure',
            line: index + 1,
            description: `发现暴露的API密钥: ${match[0]}`,
            severity: 'high'
          })
        })
      })
      
      // 检查数据库连接字符串
      const dbConnectionPatterns = [
        /mongodb:\/\/[^'"]+/gi,
        /mysql:\/\/[^'"]+/gi,
        /postgresql:\/\/[^'"]+/gi,
        /jdbc:[^'"]+/gi
      ]
      
      dbConnectionPatterns.forEach(pattern => {
        const matches = [...line.matchAll(pattern)]
        matches.forEach(match => {
          issues.push({
            type: 'database_connection_exposure',
            line: index + 1,
            description: `发现暴露的数据库连接字符串: ${match[0]}`,
            severity: 'high'
          })
        })
      })
      
      // 检查调试信息
      const debugPatterns = [
        /console\.log/gi,
        /console\.debug/gi,
        /console\.warn/gi,
        /alert\(/gi,
        /debugger/gi
      ]
      
      debugPatterns.forEach(pattern => {
        const matches = [...line.matchAll(pattern)]
        matches.forEach(match => {
          issues.push({
            type: 'debug_info',
            line: index + 1,
            description: `发现调试信息: ${match[0]}`,
            severity: 'medium'
          })
        })
      })
    })
  } catch (error) {
    console.warn(`警告: 无法读取文件 ${filePath}: ${error.message}`)
  }
  
  return issues
}

/**
 * 扫描XSS漏洞
 */
function scanXSSVulnerabilities(filePath) {
  const issues = []
  
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    
    lines.forEach((line, index) => {
      // 检查innerHTML使用
      if (line.includes('.innerHTML') || line.includes('.outerHTML')) {
        issues.push({
          type: 'xss_vulnerability',
          line: index + 1,
          description: '发现可能的XSS漏洞: 使用innerHTML/outerHTML',
          severity: 'high',
          recommendation: '使用textContent或DOMPurify进行HTML清理'
        })
      }
      
      // 检查eval使用
      if (line.includes('eval(')) {
        issues.push({
          type: 'code_injection',
          line: index + 1,
          description: '发现代码注入漏洞: 使用eval()',
          severity: 'high',
          recommendation: '避免使用eval()，使用更安全的替代方案'
        })
      }
      
      // 检查v-html使用（Vue）
      if (line.includes('v-html')) {
        issues.push({
          type: 'xss_vulnerability',
          line: index + 1,
          description: '发现可能的XSS漏洞: 使用v-html',
          severity: 'medium',
          recommendation: '确保内容经过清理或使用可信来源'
        })
      }
    })
  } catch (error) {
    console.warn(`警告: 无法读取文件 ${filePath}: ${error.message}`)
  }
  
  return issues
}

/**
 * 扫描CSRF漏洞
 */
function scanCSRFVulnerabilities(filePath) {
  const issues = []
  
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    
    // 检查是否有CSRF保护
    if (content.includes('axios.post') || content.includes('fetch(')) {
      if (!content.includes('X-CSRF-TOKEN') && !content.includes('csrf-token')) {
        issues.push({
          type: 'csrf_vulnerability',
          description: '发现可能的CSRF漏洞: 缺少CSRF令牌',
          severity: 'medium',
          recommendation: '在所有状态改变请求中添加CSRF令牌'
        })
      }
    }
  } catch (error) {
    console.warn(`警告: 无法读取文件 ${filePath}: ${error.message}`)
  }
  
  return issues
}

/**
 * 扫描依赖漏洞
 */
function scanDependencyVulnerabilities() {
  console.log('🔍 扫描第三方组件依赖漏洞...')
  
  const issues = []
  
  try {
    // 使用npm audit检查依赖漏洞
    const auditResult = execSync('npm audit --json', { 
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: config.projectDir
    })
    
    const auditData = JSON.parse(auditResult)
    
    if (auditData.vulnerabilities) {
      for (const [packageName, vulnerability] of Object.entries(auditData.vulnerabilities)) {
        issues.push({
          type: 'dependency_vulnerability',
          package: packageName,
          severity: vulnerability.severity,
          title: vulnerability.title,
          url: vulnerability.url,
          recommendation: `更新到安全版本: ${vulnerability.fixAvailable ? vulnerability.fixAvailable.version : '请联系维护者'}`
        })
      }
    }
  } catch (error) {
    console.warn('警告: 无法执行npm audit:', error.message)
  }
  
  return issues
}

/**
 * 生成安全报告
 */
function generateSecurityReport(scanResults) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: scanResults.length,
      totalIssues: scanResults.reduce((sum, result) => sum + result.issues.length, 0),
      highSeverityIssues: scanResults.reduce((sum, result) => 
        sum + result.issues.filter(issue => issue.severity === 'high').length, 0),
      mediumSeverityIssues: scanResults.reduce((sum, result) => 
        sum + result.issues.filter(issue => issue.severity === 'medium').length, 0),
      lowSeverityIssues: scanResults.reduce((sum, result) => 
        sum + result.issues.filter(issue => issue.severity === 'low').length, 0)
    },
    files: scanResults,
    dependencyIssues: scanResults.dependencyIssues || []
  }
  
  return report
}

/**
 * 生成HTML报告
 */
function generateHtmlReport(report) {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>代码安全审计报告</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        h2 {
            color: #e74c3c;
            border-bottom: 2px solid #e74c3c;
            padding-bottom: 10px;
            margin-top: 30px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .summary-value {
            font-size: 2em;
            font-weight: bold;
        }
        .high { color: #e74c3c; }
        .medium { color: #f39c12; }
        .low { color: #27ae60; }
        .summary-label {
            margin-top: 5px;
            color: #666;
        }
        .chart-container {
            position: relative;
            height: 400px;
            margin-bottom: 30px;
        }
        .issue {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .issue.high {
            background-color: #f8d7da;
            border-color: #f5c6cb;
        }
        .issue.medium {
            background-color: #fff3cd;
            border-color: #ffeaa7;
        }
        .issue.low {
            background-color: #d4edda;
            border-color: #c3e6cb;
        }
        .issue-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .issue-description {
            margin-bottom: 5px;
        }
        .issue-recommendation {
            font-style: italic;
            color: #555;
        }
        .timestamp {
            text-align: center;
            color: #666;
            margin-bottom: 20px;
        }
        .file-path {
            font-family: monospace;
            background-color: #f0f0f0;
            padding: 2px 4px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>代码安全审计报告</h1>
        <div class="timestamp">生成时间: ${new Date(report.timestamp).toLocaleString()}</div>
        
        <h2>安全概览</h2>
        <div class="summary-grid">
            <div class="summary-card">
                <div class="summary-value">${report.summary.totalFiles}</div>
                <div class="summary-label">扫描文件数</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">${report.summary.totalIssues}</div>
                <div class="summary-label">发现问题总数</div>
            </div>
            <div class="summary-card">
                <div class="summary-value high">${report.summary.highSeverityIssues}</div>
                <div class="summary-label">高危问题</div>
            </div>
            <div class="summary-card">
                <div class="summary-value medium">${report.summary.mediumSeverityIssues}</div>
                <div class="summary-label">中危问题</div>
            </div>
        </div>
        
        <h2>问题严重程度分布</h2>
        <div class="chart-container">
            <canvas id="severityChart"></canvas>
        </div>
        
        <h2>问题类型分布</h2>
        <div class="chart-container">
            <canvas id="typeChart"></canvas>
        </div>
        
        <h2>依赖漏洞</h2>
        ${report.dependencyIssues.map(issue => `
        <div class="issue ${issue.severity}">
            <div class="issue-title">${issue.package}: ${issue.title}</div>
            <div class="issue-description">严重程度: ${issue.severity}</div>
            <div class="issue-recommendation">建议: ${issue.recommendation}</div>
            ${issue.url ? `<div><a href="${issue.url}" target="_blank">更多信息</a></div>` : ''}
        </div>
        `).join('')}
        
        <h2>代码安全问题</h2>
        ${report.files.map(file => file.issues.map(issue => `
        <div class="issue ${issue.severity}">
            <div class="issue-title">${issue.type}</div>
            <div class="issue-description">文件: <span class="file-path">${file.filePath}</span></div>
            <div class="issue-description">行号: ${issue.line}</div>
            <div class="issue-description">${issue.description}</div>
            ${issue.recommendation ? `<div class="issue-recommendation">建议: ${issue.recommendation}</div>` : ''}
        </div>
        `).join('')).join('')}
    </div>
    
    <script>
        // 严重程度分布图表
        const severityCtx = document.getElementById('severityChart').getContext('2d');
        const severityChart = new Chart(severityCtx, {
            type: 'doughnut',
            data: {
                labels: ['高危', '中危', '低危'],
                datasets: [{
                    data: [${report.summary.highSeverityIssues}, ${report.summary.mediumSeverityIssues}, ${report.summary.lowSeverityIssues}],
                    backgroundColor: ['#e74c3c', '#f39c12', '#27ae60']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
        
        // 问题类型分布图表
        const typeCtx = document.getElementById('typeChart').getContext('2d');
        const typeData = {};
        ${report.files.map(file => file.issues.map(issue => `
        typeData['${issue.type}'] = (typeData['${issue.type}'] || 0) + 1;
        `).join('')).join('')}
        
        const typeChart = new Chart(typeCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(typeData),
                datasets: [{
                    label: '问题数量',
                    data: Object.values(typeData),
                    backgroundColor: '#3498db'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    </script>
</body>
</html>
`
  
  return html
}

/**
 * 主函数
 */
function main() {
  console.log('🔒 开始代码安全审计...')
  
  // 确保目录存在
  ensureDirectoryExists(config.reportDir)
  
  // 获取所有源代码文件
  const sourceFiles = [
    ...getAllSourceFiles(config.srcDir, config.excludePatterns),
    ...getAllSourceFiles(config.srcVue3Dir, config.excludePatterns)
  ]
  
  console.log(`📁 找到 ${sourceFiles.length} 个源代码文件`)
  
  // 扫描每个文件
  const scanResults = []
  sourceFiles.forEach(filePath => {
    const fileResult = {
      filePath: path.relative(config.projectDir, filePath),
      issues: []
    }
    
    // 扫描敏感信息
    fileResult.issues.push(...scanSensitiveInfo(filePath))
    
    // 扫描XSS漏洞
    fileResult.issues.push(...scanXSSVulnerabilities(filePath))
    
    // 扫描CSRF漏洞
    fileResult.issues.push(...scanCSRFVulnerabilities(filePath))
    
    if (fileResult.issues.length > 0) {
      scanResults.push(fileResult)
    }
  })
  
  // 扫描依赖漏洞
  const dependencyIssues = scanDependencyVulnerabilities()
  
  // 生成报告
  const report = generateSecurityReport({
    ...scanResults,
    dependencyIssues
  })
  
  // 保存JSON报告
  const jsonReportPath = path.join(config.reportDir, `security-report-${Date.now()}.json`)
  try {
    fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2), 'utf8')
    console.log(`✅ 生成JSON报告: ${jsonReportPath}`)
  } catch (error) {
    console.error(`❌ 生成JSON报告失败:`, error.message)
  }
  
  // 生成HTML报告
  const htmlReport = generateHtmlReport(report)
  const htmlReportPath = path.join(config.reportDir, `security-report-${Date.now()}.html`)
  try {
    fs.writeFileSync(htmlReportPath, htmlReport, 'utf8')
    console.log(`✅ 生成HTML报告: ${htmlReportPath}`)
  } catch (error) {
    console.error(`❌ 生成HTML报告失败:`, error.message)
  }
  
  console.log('\n🔍 代码安全审计结果:')
  console.log(`   扫描文件数: ${report.summary.totalFiles}`)
  console.log(`   发现问题总数: ${report.summary.totalIssues}`)
  console.log(`   高危问题: ${report.summary.highSeverityIssues}`)
  console.log(`   中危问题: ${report.summary.mediumSeverityIssues}`)
  console.log(`   低危问题: ${report.summary.lowSeverityIssues}`)
  console.log(`   依赖漏洞: ${report.dependencyIssues.length}`)
  
  console.log('\n📄 查看详细报告:')
  console.log(`   HTML报告: ${htmlReportPath}`)
  console.log(`   JSON报告: ${jsonReportPath}`)
  
  // 如果有高危问题，返回非零退出码
  if (report.summary.highSeverityIssues > 0) {
    console.log('\n⚠️  发现高危安全问题，请及时修复！')
    process.exit(1)
  } else {
    console.log('\n✅ 代码安全审计完成！')
  }
}

// 运行主函数
if (require.main === module) {
  main()
}

module.exports = {
  main,
  scanSensitiveInfo,
  scanXSSVulnerabilities,
  scanCSRFVulnerabilities,
  scanDependencyVulnerabilities,
  generateSecurityReport,
}