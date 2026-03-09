#!/usr/bin/env node

/**
 * 安全审计脚本
 * 用于检查项目中的安全漏洞和问题
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const config = {
  srcDir: path.join(__dirname, '../src'),
  reportsDir: path.join(__dirname, '../security-reports'),
  excludeDirs: ['node_modules', '.git', 'dist', 'coverage', 'test-results'],
  excludeFiles: ['.DS_Store', '*.min.js'],
  securityRules: {
    // 敏感信息检查
    sensitivePatterns: [
      /password\s*[:=]\s*['"`][^'"`]{6,}['"`]/gi,
      /api[_-]?key\s*[:=]\s*['"`][^'"`]{10,}['"`]/gi,
      /secret[_-]?key\s*[:=]\s*['"`][^'"`]{10,}['"`]/gi,
      /token\s*[:=]\s*['"`][^'"`]{10,}['"`]/gi,
      /private[_-]?key\s*[:=]\s*['"`][^'"`]{10,}['"`]/gi,
      /access[_-]?token\s*[:=]\s*['"`][^'"`]{10,}['"`]/gi,
      /refresh[_-]?token\s*[:=]\s*['"`][^'"`]{10,}['"`]/gi,
      /client[_-]?secret\s*[:=]\s*['"`][^'"`]{10,}['"`]/gi,
      /auth[_-]?token\s*[:=]\s*['"`][^'"`]{10,}['"`]/gi,
      /bearer\s+['"`][^'"`]{10,}['"`]/gi,
    ],
    
    // 不安全的代码模式
    unsafePatterns: [
      /eval\s*\(/gi,
      /Function\s*\(/gi,
      /setTimeout\s*\(\s*['"`][^'"`]*['"`]/gi,
      /setInterval\s*\(\s*['"`][^'"`]*['"`]/gi,
      /innerHTML\s*=/gi,
      /outerHTML\s*=/gi,
      /document\.write\s*\(/gi,
      /document\.writeln\s*\(/gi,
      /crypto\.getRandomValues\s*\(\s*new\s+Uint8Array\s*\(\s*1\s*\)\s*\)/gi, // 弱随机数
    ],
    
    // 不安全的HTTP请求
    insecureHttpPatterns: [
      /http:\/\/[^'"\s]+/gi,
      /xmlhttprequest/gi,
      /fetch\s*\(\s*['"`]http:\/\//gi,
    ],
    
    // 硬编码的URL
    hardcodedUrls: [
      /https?:\/\/[^\s'"`]+\.(jpg|jpeg|png|gif|svg|webp)/gi,
      /https?:\/\/[^\s'"`]+\.(js|css|woff|woff2|ttf|eot)/gi,
    ],
  },
};

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 递归获取所有文件
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // 跳过排除的目录
      if (!config.excludeDirs.includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else {
      // 跳过排除的文件
      const shouldExclude = config.excludeFiles.some(pattern => {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(file);
      });
      
      // 跳过本地化文件
      const isLocalizationFile = filePath.includes('/locales/') || filePath.includes('\\locales\\');
      
      if (!shouldExclude && !isLocalizationFile) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// 检查文件中的安全漏洞
function checkFileSecurity(filePath) {
  const results = {
    filePath: path.relative(__dirname, '../', filePath),
    issues: [],
  };
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查敏感信息
    config.securityRules.sensitivePatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        results.issues.push({
          type: 'sensitive-data',
          severity: 'high',
          rule: `sensitive-pattern-${index}`,
          message: `发现可能的敏感信息: ${pattern}`,
          matches: matches.map(match => match.substring(0, 50) + (match.length > 50 ? '...' : '')),
        });
      }
    });
    
    // 检查不安全的代码模式
    config.securityRules.unsafePatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        results.issues.push({
          type: 'unsafe-code',
          severity: 'medium',
          rule: `unsafe-pattern-${index}`,
          message: `发现不安全的代码模式: ${pattern}`,
          matches: matches.map(match => match.substring(0, 50) + (match.length > 50 ? '...' : '')),
        });
      }
    });
    
    // 检查不安全的HTTP请求
    config.securityRules.insecureHttpPatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        results.issues.push({
          type: 'insecure-http',
          severity: 'medium',
          rule: `insecure-http-${index}`,
          message: `发现不安全的HTTP请求: ${pattern}`,
          matches: matches.map(match => match.substring(0, 50) + (match.length > 50 ? '...' : '')),
        });
      }
    });
    
    // 检查硬编码的URL
    config.securityRules.hardcodedUrls.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        results.issues.push({
          type: 'hardcoded-url',
          severity: 'low',
          rule: `hardcoded-url-${index}`,
          message: `发现硬编码的URL: ${pattern}`,
          matches: matches.slice(0, 5), // 只显示前5个匹配
        });
      }
    });
    
  } catch (error) {
    // 忽略读取错误
  }
  
  return results;
}

// 运行npm audit
function runNpmAudit() {
  try {
    const output = execSync('npm audit --json', { encoding: 'utf8', cwd: path.join(__dirname, '../') });
    return JSON.parse(output);
  } catch (error) {
    // npm audit在发现漏洞时会返回非零退出码
    try {
      return JSON.parse(error.stdout);
    } catch (parseError) {
      return { error: '无法解析npm audit输出' };
    }
  }
}

// 生成安全报告
function generateSecurityReport() {
  console.log('开始安全审计...');
  
  // 确保报告目录存在
  ensureDir(config.reportsDir);
  
  // 获取所有文件
  const files = getAllFiles(config.srcDir);
  console.log(`检查 ${files.length} 个文件...`);
  
  // 检查每个文件
  const fileResults = [];
  let totalIssues = 0;
  let highSeverityIssues = 0;
  let mediumSeverityIssues = 0;
  let lowSeverityIssues = 0;
  
  files.forEach(filePath => {
    const result = checkFileSecurity(filePath);
    if (result.issues.length > 0) {
      fileResults.push(result);
      totalIssues += result.issues.length;
      
      result.issues.forEach(issue => {
        switch (issue.severity) {
          case 'high':
            highSeverityIssues++;
            break;
          case 'medium':
            mediumSeverityIssues++;
            break;
          case 'low':
            lowSeverityIssues++;
            break;
        }
      });
    }
  });
  
  // 运行npm audit
  console.log('运行npm audit...');
  const npmAuditResult = runNpmAudit();
  
  // 生成报告
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: files.length,
      filesWithIssues: fileResults.length,
      totalIssues,
      highSeverityIssues,
      mediumSeverityIssues,
      lowSeverityIssues,
      npmAuditVulnerabilities: npmAuditResult.metadata ? npmAuditResult.metadata.vulnerabilities : {},
    },
    fileResults,
    npmAuditResult,
  };
  
  // 保存JSON报告
  const jsonReportPath = path.join(config.reportsDir, `security-report-${new Date().getTime()}.json`);
  fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));
  
  // 生成HTML报告
  const htmlReportPath = generateHtmlReport(report);
  
  console.log(`安全审计完成！`);
  console.log(`发现 ${totalIssues} 个问题 (${highSeverityIssues} 高危, ${mediumSeverityIssues} 中危, ${lowSeverityIssues} 低危)`);
  console.log(`JSON报告: ${jsonReportPath}`);
  console.log(`HTML报告: ${htmlReportPath}`);
  
  return report;
}

// 生成HTML报告
function generateHtmlReport(report) {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>安全审计报告</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }
    .header {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .section {
      margin-bottom: 30px;
      border: 1px solid #e1e5e9;
      border-radius: 8px;
      overflow: hidden;
    }
    .section-header {
      background-color: #f8f9fa;
      padding: 15px;
      border-bottom: 1px solid #e1e5e9;
      font-weight: bold;
    }
    .section-content {
      padding: 15px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    .summary-card {
      background-color: #fff;
      border: 1px solid #e1e5e9;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    .summary-card.high {
      border-left: 4px solid #dc3545;
    }
    .summary-card.medium {
      border-left: 4px solid #ffc107;
    }
    .summary-card.low {
      border-left: 4px solid #28a745;
    }
    .summary-number {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .summary-label {
      color: #6c757d;
    }
    .file-item {
      margin-bottom: 20px;
      border: 1px solid #e1e5e9;
      border-radius: 8px;
      overflow: hidden;
    }
    .file-header {
      background-color: #f8f9fa;
      padding: 10px 15px;
      border-bottom: 1px solid #e1e5e9;
      font-weight: bold;
    }
    .file-content {
      padding: 15px;
    }
    .issue-item {
      margin-bottom: 15px;
      padding: 10px;
      border-radius: 4px;
    }
    .issue-item.high {
      background-color: #f8d7da;
      border-left: 4px solid #dc3545;
    }
    .issue-item.medium {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
    }
    .issue-item.low {
      background-color: #d4edda;
      border-left: 4px solid #28a745;
    }
    .issue-type {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .issue-message {
      margin-bottom: 5px;
    }
    .issue-matches {
      font-family: monospace;
      font-size: 0.9em;
      color: #6c757d;
    }
    .vulnerability-item {
      margin-bottom: 15px;
      padding: 10px;
      border-radius: 4px;
      background-color: #f8d7da;
      border-left: 4px solid #dc3545;
    }
    .vulnerability-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .vulnerability-severity {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.8em;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .vulnerability-severity.high {
      background-color: #dc3545;
      color: white;
    }
    .vulnerability-severity.moderate {
      background-color: #ffc107;
      color: black;
    }
    .vulnerability-severity.low {
      background-color: #28a745;
      color: white;
    }
    .vulnerability-severity.info {
      background-color: #17a2b8;
      color: white;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>安全审计报告</h1>
    <p>生成时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}</p>
  </div>
  
  <div class="section">
    <div class="section-header">审计摘要</div>
    <div class="section-content">
      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-number">${report.summary.totalFiles}</div>
          <div class="summary-label">总文件数</div>
        </div>
        <div class="summary-card">
          <div class="summary-number">${report.summary.filesWithIssues}</div>
          <div class="summary-label">有问题的文件</div>
        </div>
        <div class="summary-card high">
          <div class="summary-number">${report.summary.highSeverityIssues}</div>
          <div class="summary-label">高危问题</div>
        </div>
        <div class="summary-card medium">
          <div class="summary-number">${report.summary.mediumSeverityIssues}</div>
          <div class="summary-label">中危问题</div>
        </div>
        <div class="summary-card low">
          <div class="summary-number">${report.summary.lowSeverityIssues}</div>
          <div class="summary-label">低危问题</div>
        </div>
      </div>
    </div>
  </div>
  
  ${report.fileResults.length > 0 ? `
  <div class="section">
    <div class="section-header">代码安全问题</div>
    <div class="section-content">
      ${report.fileResults.map(file => `
        <div class="file-item">
          <div class="file-header">${file.filePath}</div>
          <div class="file-content">
            ${file.issues.map(issue => `
              <div class="issue-item ${issue.severity}">
                <div class="issue-type">${issue.type}</div>
                <div class="issue-message">${issue.message}</div>
                <div class="issue-matches">
                  匹配: ${issue.matches.join(', ')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}
  
  ${report.npmAuditResult.vulnerabilities ? `
  <div class="section">
    <div class="section-header">依赖漏洞</div>
    <div class="section-content">
      ${Object.entries(report.npmAuditResult.vulnerabilities).map(([name, vulnerability]) => `
        <div class="vulnerability-item">
          <div class="vulnerability-title">${name}</div>
          <div class="vulnerability-severity ${vulnerability.severity}">${vulnerability.severity}</div>
          <div>${vulnerability.title}</div>
          <div>影响范围: ${vulnerability.range}</div>
          <div>修复版本: ${vulnerability.fixAvailable ? vulnerability.fixAvailable.version : '无'}</div>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}
</body>
</html>
  `;
  
  const htmlReportPath = path.join(config.reportsDir, `security-report-${new Date().getTime()}.html`);
  fs.writeFileSync(htmlReportPath, html);
  
  return htmlReportPath;
}

// 主函数
function main() {
  const report = generateSecurityReport();
  
  // 如果有高危问题，退出码为1
  if (report.summary.highSeverityIssues > 0) {
    console.error(`发现 ${report.summary.highSeverityIssues} 个高危安全问题，请及时修复！`);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  generateSecurityReport,
  checkFileSecurity,
  runNpmAudit,
};