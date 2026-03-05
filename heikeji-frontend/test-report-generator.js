#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const config = {
  reportDir: './test-reports',
  coverageDir: './coverage',
  performanceDir: './performance-results',
  historyDir: './coverage-history',
  templateDir: './test-report-templates',
  colors: {
    success: '\x1b[32m', // 绿色
    error: '\x1b[31m',   // 红色
    info: '\x1b[34m',    // 蓝色
    reset: '\x1b[0m',     // 重置
  }
};

function createDirIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function generateTestReport() {
  console.log(`${config.colors.info}📊 开始生成综合测试报告...${config.colors.reset}`);
  
  // 确保目录存在
  createDirIfNotExists(config.reportDir);
  createDirIfNotExists(config.templateDir);
  
  // 生成当前日期
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS
  const timestamp = `${dateStr}_${timeStr.replace(/:/g, '-')}`;
  
  // 收集测试数据
  const testData = {
    timestamp: now.toISOString(),
    date: dateStr,
    time: timeStr,
    unitTests: collectUnitTestData(),
    coverage: collectCoverageData(),
    performance: collectPerformanceData(),
    e2e: collectE2ETestData(),
  };
  
  // 生成HTML报告
  const htmlReport = generateHTMLReport(testData);
  const htmlFile = path.join(config.reportDir, `test-report-${timestamp}.html`);
  fs.writeFileSync(htmlFile, htmlReport);
  console.log(`${config.colors.success}✅ HTML测试报告已生成: ${htmlFile}${config.colors.reset}`);
  
  // 生成JSON报告
  const jsonFile = path.join(config.reportDir, `test-report-${timestamp}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(testData, null, 2));
  console.log(`${config.colors.success}✅ JSON测试报告已生成: ${jsonFile}${config.colors.reset}`);
  
  // 生成摘要报告
  generateSummaryReport(testData);
  
  console.log(`${config.colors.info}====================================${config.colors.reset}`);
  console.log(`${config.colors.success}🎉 测试报告生成完成！${config.colors.reset}`);
  console.log(`${config.colors.success}📁 报告目录: ${config.reportDir}${config.colors.reset}`);
  console.log(`${config.colors.info}====================================${config.colors.reset}`);
}

function collectUnitTestData() {
  try {
    // 运行单元测试并获取结果
    const result = execSync('npm run test:unit -- --reporter=json', { 
      stdio: 'pipe',
      cwd: process.cwd()
    });
    return JSON.parse(result.toString());
  } catch (error) {
    console.log(`${config.colors.error}❌ 收集单元测试数据时出错: ${error.message}${config.colors.reset}`);
    return { error: error.message };
  }
}

function collectCoverageData() {
  try {
    if (fs.existsSync(`${config.coverageDir}/coverage-summary.json`)) {
      return JSON.parse(fs.readFileSync(`${config.coverageDir}/coverage-summary.json`, 'utf8'));
    } else {
      return { error: '未找到覆盖率报告' };
    }
  } catch (error) {
    console.log(`${config.colors.error}❌ 收集覆盖率数据时出错: ${error.message}${config.colors.reset}`);
    return { error: error.message };
  }
}

function collectPerformanceData() {
  try {
    if (fs.existsSync(`${config.performanceDir}`)) {
      const files = fs.readdirSync(config.performanceDir).filter(file => file.startsWith('performance-'));
      if (files.length > 0) {
        files.sort();
        const latestFile = files[files.length - 1];
        return JSON.parse(fs.readFileSync(path.join(config.performanceDir, latestFile), 'utf8'));
      }
    }
    return { error: '未找到性能测试数据' };
  } catch (error) {
    console.log(`${config.colors.error}❌ 收集性能数据时出错: ${error.message}${config.colors.reset}`);
    return { error: error.message };
  }
}

function collectE2ETestData() {
  try {
    // 运行端到端测试并获取结果
    const result = execSync('npx playwright test --reporter=json', { 
      stdio: 'pipe',
      cwd: process.cwd()
    });
    return JSON.parse(result.toString());
  } catch (error) {
    console.log(`${config.colors.error}❌ 收集端到端测试数据时出错: ${error.message}${config.colors.reset}`);
    return { error: error.message };
  }
}

function generateHTMLReport(testData) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试报告 - ${testData.date} ${testData.time}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
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
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
      text-align: center;
    }
    h2 {
      color: #555;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .summary {
      display: flex;
      justify-content: space-around;
      margin: 20px 0;
    }
    .summary-item {
      text-align: center;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      flex: 1;
      margin: 0 10px;
    }
    .summary-item h3 {
      margin: 0 0 10px 0;
      color: #666;
    }
    .summary-item .value {
      font-size: 24px;
      font-weight: bold;
    }
    .success {
      color: #28a745;
    }
    .error {
      color: #dc3545;
    }
    .info {
      color: #17a2b8;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .coverage-bar {
      height: 20px;
      background-color: #e9ecef;
      border-radius: 10px;
      overflow: hidden;
    }
    .coverage-fill {
      height: 100%;
      border-radius: 10px;
    }
    .coverage-high {
      background-color: #28a745;
    }
    .coverage-medium {
      background-color: #ffc107;
    }
    .coverage-low {
      background-color: #dc3545;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>黑科易购前端测试报告</h1>
    <p style="text-align: center; color: #666;">生成时间: ${testData.timestamp}</p>
    
    <h2>测试摘要</h2>
    <div class="summary">
      <div class="summary-item">
        <h3>单元测试</h3>
        <div class="value ${testData.unitTests.error ? 'error' : 'success'}">
          ${testData.unitTests.error ? '失败' : '通过'}
        </div>
      </div>
      <div class="summary-item">
        <h3>测试覆盖率</h3>
        <div class="value ${testData.coverage.error ? 'error' : 'info'}">
          ${testData.coverage.error ? '无数据' : `${testData.coverage.total.lines.pct}%`}
        </div>
      </div>
      <div class="summary-item">
        <h3>性能测试</h3>
        <div class="value ${testData.performance.error ? 'error' : 'info'}">
          ${testData.performance.error ? '无数据' : '完成'}
        </div>
      </div>
      <div class="summary-item">
        <h3>端到端测试</h3>
        <div class="value ${testData.e2e.error ? 'error' : 'success'}">
          ${testData.e2e.error ? '失败' : '通过'}
        </div>
      </div>
    </div>
    
    <h2>测试覆盖率详情</h2>
    ${testData.coverage.error ? 
      `<p class="error">${testData.coverage.error}</p>` : 
      `<table>
        <tr>
          <th>指标</th>
          <th>覆盖率</th>
          <th>详情</th>
        </tr>
        <tr>
          <td>语句覆盖率</td>
          <td>${testData.coverage.total.lines.pct}%</td>
          <td>
            <div class="coverage-bar">
              <div class="coverage-fill ${getCoverageClass(testData.coverage.total.lines.pct)}" style="width: ${testData.coverage.total.lines.pct}%"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td>分支覆盖率</td>
          <td>${testData.coverage.total.branches.pct}%</td>
          <td>
            <div class="coverage-bar">
              <div class="coverage-fill ${getCoverageClass(testData.coverage.total.branches.pct)}" style="width: ${testData.coverage.total.branches.pct}%"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td>函数覆盖率</td>
          <td>${testData.coverage.total.functions.pct}%</td>
          <td>
            <div class="coverage-bar">
              <div class="coverage-fill ${getCoverageClass(testData.coverage.total.functions.pct)}" style="width: ${testData.coverage.total.functions.pct}%"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td>行覆盖率</td>
          <td>${testData.coverage.total.lines.pct}%</td>
          <td>
            <div class="coverage-bar">
              <div class="coverage-fill ${getCoverageClass(testData.coverage.total.lines.pct)}" style="width: ${testData.coverage.total.lines.pct}%"></div>
            </div>
          </td>
        </tr>
      </table>`
    }
    
    <h2>性能测试详情</h2>
    ${testData.performance.error ? 
      `<p class="error">${testData.performance.error}</p>` : 
      `<table>
        <tr>
          <th>指标</th>
          <th>平均值</th>
          <th>最小值</th>
          <th>最大值</th>
        </tr>
        <tr>
          <td>渲染时间</td>
          <td>${testData.performance.metrics.renderTime.average.toFixed(2)}ms</td>
          <td>${testData.performance.metrics.renderTime.min.toFixed(2)}ms</td>
          <td>${testData.performance.metrics.renderTime.max.toFixed(2)}ms</td>
        </tr>
        <tr>
          <td>API响应时间</td>
          <td>${testData.performance.metrics.apiResponseTime.average.toFixed(2)}ms</td>
          <td>${testData.performance.metrics.apiResponseTime.min.toFixed(2)}ms</td>
          <td>${testData.performance.metrics.apiResponseTime.max.toFixed(2)}ms</td>
        </tr>
        <tr>
          <td>内存使用</td>
          <td>${testData.performance.metrics.memoryUsage.average.toFixed(2)}MB</td>
          <td>-</td>
          <td>${testData.performance.metrics.memoryUsage.peak.toFixed(2)}MB</td>
        </tr>
        <tr>
          <td>CPU使用率</td>
          <td>${testData.performance.metrics.cpuUsage.average.toFixed(2)}%</td>
          <td>-</td>
          <td>${testData.performance.metrics.cpuUsage.peak.toFixed(2)}%</td>
        </tr>
      </table>`
    }
    
    <h2>测试环境信息</h2>
    <table>
      <tr>
        <th>项目</th>
        <th>版本</th>
      </tr>
      <tr>
        <td>Node.js</td>
        <td>${process.version}</td>
      </tr>
      <tr>
        <td>操作系统</td>
        <td>${process.platform} ${process.arch}</td>
      </tr>
      <tr>
        <td>测试时间</td>
        <td>${testData.timestamp}</td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

function getCoverageClass(coverage) {
  const cov = parseFloat(coverage);
  if (cov >= 80) return 'coverage-high';
  if (cov >= 60) return 'coverage-medium';
  return 'coverage-low';
}

function generateSummaryReport(testData) {
  const summary = {
    generatedAt: testData.timestamp,
    summary: {
      unitTests: testData.unitTests.error ? '失败' : '通过',
      coverage: testData.coverage.error ? '无数据' : `${testData.coverage.total.lines.pct}%`,
      performance: testData.performance.error ? '无数据' : '完成',
      e2e: testData.e2e.error ? '失败' : '通过',
    },
    details: {
      coverage: testData.coverage.error ? null : testData.coverage.total,
      performance: testData.performance.error ? null : testData.performance.metrics,
    }
  };
  
  const summaryFile = path.join(config.reportDir, `test-summary-${testData.date}.json`);
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
  console.log(`${config.colors.success}✅ 测试摘要报告已生成: ${summaryFile}${config.colors.reset}`);
}

// 执行主函数
generateTestReport();
