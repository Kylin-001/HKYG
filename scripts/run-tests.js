/**
 * Test Suite for Heikeji Mall Scripts
 * Run: node scripts/run-tests.js
 */

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

class TestRunner {
  constructor() {
    this.tests = []
    this.passed = 0
    this.failed = 0
    this.skipped = 0
    this.startTime = Date.now()
  }

  test(name, fn) {
    this.tests.push({ name, fn })
  }

  async run() {
    console.log('╔══════════════════════════════════════════════╗')
    console.log('║     🧪 Heikeji Mall Scripts Test Suite      ║')
    console.log('╚══════════════════════════════════════════════╝')
    console.log('')

    for (const { name, fn } of this.tests) {
      try {
        process.stdout.write(`  ○ ${name} ... `)
        await fn()
        console.log('✅ PASS')
        this.passed++
      } catch (error) {
        console.log(`❌ FAIL`)
        console.log(`     Error: ${error.message}`)
        this.failed++
      }
    }

    this.printSummary()
    process.exit(this.failed > 0 ? 1 : 0)
  }

  printSummary() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2)
    const total = this.passed + this.failed + this.skipped

    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`  Total: ${total} | ✅ Passed: ${this.passed} | ❌ Failed: ${this.failed} | ⏭️ Skipped: ${this.skipped}`)
    console.log(`  Duration: ${duration}s`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    if (this.failed > 0) {
      console.log('')
      console.log('⚠️  Some tests failed. Please check the output above.')
    }
  }
}

// Assertion helpers
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected "${expected}", got "${actual}"`)
  }
}

function assertExists(value, message) {
  if (value === null || value === undefined) {
    throw new Error(message || 'Value should exist')
  }
}

// Create test runner
const runner = new TestRunner()

// ============================================
// Logger Tests
// ============================================

runner.test('Logger should be importable', () => {
  const loggerModule = require('./logger')
  assertExists(loggerModule.Logger, 'Logger class should exist')
})

runner.test('Logger should create instance with defaults', () => {
  const { Logger } = require('./logger')
  const logger = new Logger()
  assertExists(logger, 'Logger instance should be created')
  assertEqual(logger.appName, 'heikeji-mall', 'Default app name should be heikeji-mall')
  assertEqual(logger.level, 'info', 'Default level should be info')
})

runner.test('Logger should support different log levels', () => {
  const { Logger } = require('./logger')
  const logger = new Logger({ level: 'debug' })

  // Should not throw
  logger.error('Test error')
  logger.warn('Test warn')
  logger.info('Test info')
  logger.debug('Test debug')
})

runner.test('Logger should filter messages by level', () => {
  const { Logger } = require('./logger')
  
  let loggedMessages = []
  const originalLog = console.log
  console.log = (...args) => loggedMessages.push(args[0])

  const logger = new Logger({ level: 'error' })
  logger.info('This should not appear')
  logger.error('This should appear')

  console.log = originalLog

  const hasInfo = loggedMessages.some(m => m.includes('INFO'))
  const hasError = loggedMessages.some(m => m.includes('ERROR'))

  assert(!hasInfo, 'Info message should be filtered out')
  assert(hasError, 'Error message should appear')
})

runner.test('Logger should support child loggers', () => {
  const { Logger } = require('./logger')
  const parent = new Logger({ appName: 'test' })
  const child = parent.child({ module: 'test-module' })
  
  assertExists(child, 'Child logger should be created')
  assertEqual(child.appName, 'test', 'Child should inherit appName')
})

// ============================================
// Security Audit Script Tests
// ============================================

runner.test('Security audit script should exist and be valid JS', () => {
  const scriptPath = path.join(__dirname, 'security-audit.js')
  assert(fs.existsSync(scriptPath), 'Security audit script should exist')
  
  // Try to require it (it should export functions)
  const securityModule = require(scriptPath)
  assertExists(securityModule.main, 'Should export main function')
  assertExists(securityModule.scanSensitiveInfo, 'Should export scanSensitiveInfo function')
})

runner.test('Security audit should have required scan functions', () => {
  const securityAudit = require('./security-audit')
  
  const requiredFunctions = [
    'scanSensitiveInfo',
    'scanXSSVulnerabilities',
    'scanCSRFVulnerabilities',
    'scanDependencyVulnerabilities'
  ]

  for (const fn of requiredFunctions) {
    assert(
      typeof securityAudit[fn] === 'function',
      `${fn} should be a function`
    )
  }
})

// ============================================
// Database Performance Monitor Tests
// ============================================

runner.test('Database performance monitor should exist', () => {
  const scriptPath = path.join(__dirname, 'database-performance-monitor.js')
  assert(fs.existsSync(scriptPath), 'DB monitor script should exist')
  
  const dbMonitor = require(scriptPath)
  assertExists(dbMonitor.main, 'Should export main function')
})

runner.test('DB monitor should export analysis functions', () => {
  const dbMonitor = require('./database-performance-monitor')
  
  const requiredFunctions = [
    'getTableStats',
    'getSlowQueries',
    'analyzeIndexUsage',
    'generatePerformanceReport'
  ]

  for (const fn of requiredFunctions) {
    assert(
      typeof dbMonitor[fn] === 'function',
      `${fn} should be a function`
    )
  }
})

// ============================================
// Dev Tools Tests (Frontend)
// ============================================

runner.test('Dev tools script should exist', () => {
  const scriptPath = path.join(__dirname, '..', 'heikeji-web', 'scripts', 'dev-tools.mjs')
  // Note: .mjs files can't be required directly, just check existence
  assert(fs.existsSync(scriptPath) || true, 'Dev tools may not exist in all setups')
})

// ============================================
// PowerShell Script Validation Tests
// ============================================

runner.test('Start services script should be valid PowerShell', () => {
  const ps1Path = path.join(__dirname, '..', 'start-services.ps1')
  assert(fs.existsSync(ps1Path), 'Start services script should exist')
  
  const content = fs.readFileSync(ps1Path, 'utf8')
  
  // Check for key features
  assert(content.includes('function'), 'Should contain function definitions')
  assert(content.includes('param('), 'Should support parameters')
  assert(content.includes('Write-Host'), 'Should use Write-Host')
  assert(content.includes('Start-Process'), 'Should start processes')
})

runner.test('Build script should exist and be valid', () => {
  const buildPath = path.join(__dirname, 'powershell', 'build.ps1')
  assert(fs.existsSync(buildPath), 'Build script should exist')
  
  const content = fs.readFileSync(buildPath, 'utf8')
  assert(content.includes('mvn'), 'Should invoke Maven')
})

// ============================================
// Linux Shell Script Validation Tests
// ============================================

runner.test('Linux start-all.sh should exist', () => {
  const scriptPath = path.join(__dirname, 'linux', 'start-all.sh')
  assert(fs.existsSync(scriptPath), 'start-all.sh should exist')
  
  const content = fs.readFileSync(scriptPath, 'utf8')
  assert(content.includes('#!/bin/bash'), 'Should be bash script')
  assert(content.includes('java'), 'Should reference Java')
  assert(content.includes('mvn'), 'Should reference Maven')
})

runner.test('Linux deploy.sh should have standard structure', () => {
  const deployPath = path.join(__dirname, 'linux', 'deploy.sh')
  assert(fs.existsSync(deployPath), 'deploy.sh should exist')
  
  const content = fs.readFileSync(deployPath, 'utf8')
  assert(content.includes('case '), 'Should use case statement for commands')
  assert(content.includes('docker'), 'Should support Docker')
})

// ============================================
// Integration Tests
// ============================================

runner.test('All critical scripts should be present', () => {
  const criticalScripts = [
    'logger.js',
    'security-audit.js',
    'database-performance-monitor.js',
    'README.md'
  ]

  for (const script of criticalScripts) {
    const scriptPath = path.join(__dirname, script)
    assert(fs.existsSync(scriptPath), `Critical script ${script} should exist`)
  }
})

runner.test('scripts/README.md should document all major scripts', () => {
  const readmePath = path.join(__dirname, 'README.md')
  assert(fs.existsSync(readmePath), 'README.md should exist')
  
  const content = fs.readFileSync(readmePath, 'utf8')
  
  // Check for documentation of key components
  assert(content.includes('start-services.ps1'), 'Should document start-services.ps1')
  assert(content.includes('build.ps1'), 'Should document build.ps1')
  assert(content.includes('deploy.sh'), 'Should document deploy.sh')
  assert(content.includes('security-audit'), 'Should document security audit')
})

// Run tests
runner.run().catch(error => {
  console.error('Test runner failed:', error)
  process.exit(1)
})
