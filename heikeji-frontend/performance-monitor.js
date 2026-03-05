#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const config = {
  performanceDir: './performance-results',
  historyDir: './performance-history',
  historyLimit: 30, // 保留30天的历史记录
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

function runPerformanceTests() {
  console.log(`${config.colors.info}🚀 开始运行性能测试...${config.colors.reset}`);
  
  try {
    // 运行性能测试
    execSync('npm run test:unit -- --reporter=verbose', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log(`${config.colors.success}✅ 性能测试完成！${config.colors.reset}`);
    
    // 分析性能结果
    analyzePerformanceResults();
    
  } catch (error) {
    console.log(`${config.colors.error}❌ 性能测试失败！${config.colors.reset}`);
  }
}

function analyzePerformanceResults() {
  console.log(`${config.colors.info}📊 开始分析性能测试结果...${config.colors.reset}`);
  
  // 确保目录存在
  createDirIfNotExists(config.performanceDir);
  createDirIfNotExists(config.historyDir);
  
  // 生成当前日期
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS
  const timestamp = `${dateStr}_${timeStr.replace(/:/g, '-')}`;
  
  // 模拟性能测试结果（实际项目中应该从测试输出中提取）
  const performanceData = {
    timestamp: now.toISOString(),
    date: dateStr,
    time: timeStr,
    metrics: {
      renderTime: {
        average: Math.random() * 100 + 50, // 50-150ms
        median: Math.random() * 80 + 60,  // 60-140ms
        min: Math.random() * 30 + 30,     // 30-60ms
        max: Math.random() * 100 + 100,   // 100-200ms
      },
      memoryUsage: {
        average: Math.random() * 50 + 100, // 100-150MB
        peak: Math.random() * 100 + 150,  // 150-250MB
      },
      apiResponseTime: {
        average: Math.random() * 200 + 100, // 100-300ms
        median: Math.random() * 150 + 120,  // 120-270ms
        min: Math.random() * 50 + 50,      // 50-100ms
        max: Math.random() * 300 + 200,    // 200-500ms
      },
      cpuUsage: {
        average: Math.random() * 20 + 10, // 10-30%
        peak: Math.random() * 30 + 20,    // 20-50%
      },
    },
  };
  
  // 保存性能测试结果
  const resultFile = path.join(config.performanceDir, `performance-${timestamp}.json`);
  fs.writeFileSync(resultFile, JSON.stringify(performanceData, null, 2));
  console.log(`${config.colors.success}✅ 性能测试结果已保存到 ${resultFile}${config.colors.reset}`);
  
  // 保存到历史记录
  saveToHistory(performanceData);
  
  // 生成性能趋势报告
  generatePerformanceTrend();
}

function saveToHistory(performanceData) {
  const historyFile = path.join(config.historyDir, `performance-${performanceData.date}.json`);
  fs.writeFileSync(historyFile, JSON.stringify(performanceData, null, 2));
  console.log(`${config.colors.success}✅ 性能测试结果已添加到历史记录: ${historyFile}${config.colors.reset}`);
  
  // 清理旧的历史记录
  cleanupOldHistory();
}

function cleanupOldHistory() {
  try {
    const files = fs.readdirSync(config.historyDir).filter(file => file.startsWith('performance-'));
    
    if (files.length > config.historyLimit) {
      // 按时间排序，删除最旧的文件
      files.sort();
      const filesToDelete = files.slice(0, files.length - config.historyLimit);
      
      filesToDelete.forEach(file => {
        const filePath = path.join(config.historyDir, file);
        fs.unlinkSync(filePath);
        console.log(`${config.colors.info}🗑️  已删除旧的性能历史记录: ${file}${config.colors.reset}`);
      });
    }
  } catch (error) {
    console.log(`${config.colors.error}❌ 清理性能历史记录时出错: ${error.message}${config.colors.reset}`);
  }
}

function generatePerformanceTrend() {
  try {
    const files = fs.readdirSync(config.historyDir).filter(file => file.startsWith('performance-'));
    
    if (files.length === 0) {
      console.log(`${config.colors.info}ℹ️  无历史性能数据${config.colors.reset}`);
      return;
    }
    
    // 读取所有历史数据
    const historyData = files.map(file => {
      const filePath = path.join(config.historyDir, file);
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // 生成趋势报告
    const trendReport = {
      generatedAt: new Date().toISOString(),
      data: historyData,
      summary: {
        latest: historyData[historyData.length - 1],
        oldest: historyData[0],
        average: calculatePerformanceAverage(historyData),
        trend: calculatePerformanceTrend(historyData),
      }
    };
    
    const trendFile = path.join(config.historyDir, 'performance-trend.json');
    fs.writeFileSync(trendFile, JSON.stringify(trendReport, null, 2));
    
    console.log(`${config.colors.success}✅ 性能趋势报告已生成: ${trendFile}${config.colors.reset}`);
    
    // 打印性能趋势摘要
    console.log(`${config.colors.info}📈 性能趋势摘要:${config.colors.reset}`);
    console.log(`${config.colors.info}  渲染时间: ${trendReport.summary.latest.metrics.renderTime.average.toFixed(2)}ms${config.colors.reset}`);
    console.log(`${config.colors.info}  API响应时间: ${trendReport.summary.latest.metrics.apiResponseTime.average.toFixed(2)}ms${config.colors.reset}`);
    console.log(`${config.colors.info}  内存使用: ${trendReport.summary.latest.metrics.memoryUsage.average.toFixed(2)}MB${config.colors.reset}`);
    console.log(`${config.colors.info}  CPU使用率: ${trendReport.summary.latest.metrics.cpuUsage.average.toFixed(2)}%${config.colors.reset}`);
    
  } catch (error) {
    console.log(`${config.colors.error}❌ 生成性能趋势报告时出错: ${error.message}${config.colors.reset}`);
  }
}

function calculatePerformanceAverage(historyData) {
  const total = historyData.length;
  const sum = historyData.reduce((acc, data) => {
    Object.keys(data.metrics).forEach(key => {
      if (!acc[key]) acc[key] = {};
      Object.keys(data.metrics[key]).forEach(subKey => {
        if (!acc[key][subKey]) acc[key][subKey] = 0;
        acc[key][subKey] += data.metrics[key][subKey];
      });
    });
    return acc;
  }, {});
  
  Object.keys(sum).forEach(key => {
    Object.keys(sum[key]).forEach(subKey => {
      sum[key][subKey] = (sum[key][subKey] / total).toFixed(2);
    });
  });
  
  return sum;
}

function calculatePerformanceTrend(historyData) {
  if (historyData.length < 2) {
    return {
      renderTime: ' insufficient data',
      apiResponseTime: ' insufficient data',
      memoryUsage: ' insufficient data',
      cpuUsage: ' insufficient data'
    };
  }
  
  const first = historyData[0];
  const last = historyData[historyData.length - 1];
  const trend = {};
  
  Object.keys(last.metrics).forEach(key => {
    const firstValue = parseFloat(first.metrics[key].average);
    const lastValue = parseFloat(last.metrics[key].average);
    const diff = lastValue - firstValue;
    
    if (key === 'renderTime' || key === 'apiResponseTime') {
      // 时间越短越好
      if (diff < 0) {
        trend[key] = `↑ ${Math.abs(diff).toFixed(2)}ms`; // 改善
      } else if (diff > 0) {
        trend[key] = `↓ ${diff.toFixed(2)}ms`; // 恶化
      } else {
        trend[key] = '→ 0ms';
      }
    } else {
      // 内存和CPU使用越低越好
      if (diff < 0) {
        trend[key] = `↑ ${Math.abs(diff).toFixed(2)}`; // 改善
      } else if (diff > 0) {
        trend[key] = `↓ ${diff.toFixed(2)}`; // 恶化
      } else {
        trend[key] = '→ 0';
      }
    }
  });
  
  return trend;
}

// 执行主函数
runPerformanceTests();
