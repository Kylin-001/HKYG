#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const config = {
  schedules: [
    {
      name: 'daily-unit-tests',
      description: '每日单元测试',
      command: 'npm run test:unit',
      schedule: '0 1 * * *', // 每天凌晨1点
      enabled: true
    },
    {
      name: 'weekly-e2e-tests',
      description: '每周端到端测试',
      command: 'npm run test:e2e',
      schedule: '0 2 * * 0', // 每周日凌晨2点
      enabled: true
    },
    {
      name: 'weekly-performance-tests',
      description: '每周性能测试',
      command: 'npm run test:performance',
      schedule: '0 3 * * 0', // 每周日凌晨3点
      enabled: true
    },
    {
      name: 'daily-coverage',
      description: '每日覆盖率报告',
      command: 'npm run test:coverage && npm run test:coverage-history',
      schedule: '0 4 * * *', // 每天凌晨4点
      enabled: true
    }
  ],
  logDir: './test-logs',
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

function runScheduledTest(schedule) {
  console.log(`${config.colors.info}⏰ 开始执行定时测试: ${schedule.name}${config.colors.reset}`);
  console.log(`${config.colors.info}📝 描述: ${schedule.description}${config.colors.reset}`);
  console.log(`${config.colors.info}🔧 命令: ${schedule.command}${config.colors.reset}`);
  
  // 确保日志目录存在
  createDirIfNotExists(config.logDir);
  
  // 生成日志文件路径
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS
  const logFile = path.join(config.logDir, `${schedule.name}-${dateStr}_${timeStr.replace(/:/g, '-')}.log`);
  
  try {
    console.log(`${config.colors.info}📄 日志文件: ${logFile}${config.colors.reset}`);
    
    // 执行测试命令
    const result = execSync(schedule.command, { 
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    const output = result.toString();
    
    // 写入日志
    fs.writeFileSync(logFile, `执行时间: ${now.toISOString()}\n`);
    fs.appendFileSync(logFile, `命令: ${schedule.command}\n`);
    fs.appendFileSync(logFile, `执行结果: 成功\n`);
    fs.appendFileSync(logFile, `输出:\n${output}`);
    
    console.log(`${config.colors.success}✅ 定时测试执行成功！${config.colors.reset}`);
    console.log(`${config.colors.success}📄 测试日志已保存到: ${logFile}${config.colors.reset}`);
    
    // 发送通知（实际项目中可以集成邮件、Slack等通知）
    sendNotification(schedule, 'success', output);
    
  } catch (error) {
    const errorOutput = error.stdout ? error.stdout.toString() : '';
    const errorMessage = error.stderr ? error.stderr.toString() : error.message;
    
    // 写入错误日志
    fs.writeFileSync(logFile, `执行时间: ${now.toISOString()}\n`);
    fs.appendFileSync(logFile, `命令: ${schedule.command}\n`);
    fs.appendFileSync(logFile, `执行结果: 失败\n`);
    fs.appendFileSync(logFile, `错误信息: ${errorMessage}\n`);
    fs.appendFileSync(logFile, `输出:\n${errorOutput}`);
    
    console.log(`${config.colors.error}❌ 定时测试执行失败！${config.colors.reset}`);
    console.log(`${config.colors.error}📄 错误日志已保存到: ${logFile}${config.colors.reset}`);
    
    // 发送错误通知
    sendNotification(schedule, 'error', errorMessage);
  }
  
  console.log(`${config.colors.info}====================================${config.colors.reset}`);
}

function sendNotification(schedule, status, message) {
  // 这里可以集成邮件、Slack、钉钉等通知
  console.log(`${config.colors.info}📢 发送测试通知:${config.colors.reset}`);
  console.log(`${config.colors.info}  测试: ${schedule.name}${config.colors.reset}`);
  console.log(`${config.colors.info}  状态: ${status === 'success' ? '成功' : '失败'}${config.colors.reset}`);
  console.log(`${config.colors.info}  消息: ${message.substring(0, 100)}...${config.colors.reset}`);
  
  // 实际项目中可以使用 nodemailer 发送邮件
  // 或使用 slack-webhook 发送 Slack 通知
  // 或使用 dingtalk-robot-sender 发送钉钉通知
}

function checkSchedules() {
  console.log(`${config.colors.info}🔍 检查定时测试任务...${config.colors.reset}`);
  
  config.schedules.forEach(schedule => {
    if (schedule.enabled) {
      console.log(`${config.colors.info}  ✅ ${schedule.name} - ${schedule.description}${config.colors.reset}`);
      console.log(`${config.colors.info}    计划: ${schedule.schedule}${config.colors.reset}`);
    } else {
      console.log(`${config.colors.info}  ❌ ${schedule.name} - ${schedule.description} (已禁用)${config.colors.reset}`);
    }
  });
  
  console.log(`${config.colors.info}====================================${config.colors.reset}`);
}

function executeAllSchedules() {
  console.log(`${config.colors.info}🚀 执行所有定时测试任务...${config.colors.reset}`);
  
  config.schedules.forEach(schedule => {
    if (schedule.enabled) {
      runScheduledTest(schedule);
    }
  });
  
  console.log(`${config.colors.success}✅ 所有定时测试任务执行完成！${config.colors.reset}`);
}

function showHelp() {
  console.log(`${config.colors.info}📘 定时测试执行工具${config.colors.reset}`);
  console.log(`${config.colors.info}用法: node scheduled-tests.js [命令]${config.colors.reset}`);
  console.log(`${config.colors.info}命令:${config.colors.reset}`);
  console.log(`${config.colors.info}  check     - 检查所有定时测试任务${config.colors.reset}`);
  console.log(`${config.colors.info}  run       - 执行所有定时测试任务${config.colors.reset}`);
  console.log(`${config.colors.info}  run [name] - 执行指定的定时测试任务${config.colors.reset}`);
  console.log(`${config.colors.info}  help      - 显示帮助信息${config.colors.reset}`);
}

// 处理命令行参数
const args = process.argv.slice(2);
const command = args[0];
const scheduleName = args[1];

switch (command) {
  case 'check':
    checkSchedules();
    break;
  case 'run':
    if (scheduleName) {
      const schedule = config.schedules.find(s => s.name === scheduleName);
      if (schedule) {
        runScheduledTest(schedule);
      } else {
        console.log(`${config.colors.error}❌ 未找到名为 ${scheduleName} 的定时测试任务${config.colors.reset}`);
      }
    } else {
      executeAllSchedules();
    }
    break;
  case 'help':
  default:
    showHelp();
    break;
}
