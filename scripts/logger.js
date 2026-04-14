#!/usr/bin/env node

/**
 * Unified Logging Utility for Heikeji Mall Project
 * Features:
 * - Structured logging with levels
 * - Console and file output
 * - Log rotation
 * - Colorized output
 * - JSON format support
 */

const fs = require('fs')
const path = require('path')

class Logger {
  constructor(options = {}) {
    this.appName = options.appName || 'heikeji-mall'
    this.logDir = options.logDir || path.join(process.cwd(), 'logs')
    this.level = options.level || 'info'
    this.consoleEnabled = options.console !== false
    this.fileEnabled = options.file || false
    this.jsonFormat = options.json || false
    this.maxFileSize = options.maxFileSize || 10 * 1024 * 1024 // 10MB
    this.maxFiles = options.maxFiles || 5

    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4
    }

    this.colors = {
      error: '\x1b[31m', // red
      warn: '\x1b[33m',  // yellow
      info: '\x1b[36m',  // cyan
      debug: '\x1b[35m', // magenta
      trace: '\x1b[90m', // gray
      reset: '\x1b[0m'
    }

    this.ensureLogDirectory()
  }

  ensureLogDirectory() {
    if (this.fileEnabled && !fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true })
    }
  }

  getLogFilePath() {
    const date = new Date().toISOString().split('T')[0]
    return path.join(this.logDir, `${this.appName}-${date}.log`)
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.level]
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString()
    
    if (this.jsonFormat) {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...meta,
        app: this.appName
      })
    }

    const color = this.colors[level] || ''
    const reset = this.colors.reset
    
    let formattedMessage = `[${timestamp}][${level.toUpperCase()}] ${message}`
    
    if (Object.keys(meta).length > 0) {
      formattedMessage += ` | ${JSON.stringify(meta)}`
    }

    return `${color}${formattedMessage}${reset}`
  }

  writeToFile(formattedMessage) {
    if (!this.fileEnabled) return

    try {
      const logFile = this.getLogFilePath()

      // Check file size and rotate if needed
      if (fs.existsSync(logFile)) {
        const stats = fs.statSync(logFile)
        if (stats.size >= this.maxFileSize) {
          this.rotateLogFile(logFile)
        }
      }

      fs.appendFileSync(logFile, formattedMessage + '\n', 'utf8')
    } catch (error) {
      console.error('Failed to write to log file:', error.message)
    }
  }

  rotateLogFile(currentFile) {
    try {
      for (let i = this.maxFiles - 1; i > 0; i--) {
        const oldFile = `${currentFile}.${i}`
        const newFile = `${currentFile}.${i + 1}`

        if (fs.existsSync(oldFile)) {
          if (i === this.maxFiles - 1) {
            fs.unlinkSync(oldFile)
          } else {
            fs.renameSync(oldFile, newFile)
          }
        }
      }

      if (fs.existsSync(currentFile)) {
        fs.renameSync(currentFile, `${currentFile}.1`)
      }
    } catch (error) {
      console.error('Log rotation failed:', error.message)
    }
  }

  log(level, message, ...args) {
    if (!this.shouldLog(level)) return

    const meta = args.length > 0 ? { data: args } : {}
    const formattedMessage = this.formatMessage(level, message, meta)

    if (this.consoleEnabled) {
      console.log(formattedMessage)
    }

    this.writeToFile(formattedMessage)
  }

  error(message, ...args) {
    this.log('error', message, ...args)
  }

  warn(message, ...args) {
    this.log('warn', message, ...args)
  }

  info(message, ...args) {
    this.log('info', message, ...args)
  }

  debug(message, ...args) {
    this.log('debug', message, ...args)
  }

  trace(message, ...args) {
    this.log('trace', message, ...args)
  }

  /**
   * Create child logger with additional context
   */
  child(context) {
    const ChildLogger = class extends Logger {
      constructor(parent, ctx) {
        super({
          appName: parent.appName,
          logDir: parent.logDir,
          level: parent.level,
          consoleEnabled: parent.consoleEnabled,
          fileEnabled: parent.fileEnabled,
          jsonFormat: parent.jsonFormat,
          maxFileSize: parent.maxFileSize,
          maxFiles: parent.maxFiles
        })
        this.context = ctx
      }

      formatMessage(level, message, meta = {}) {
        const contextPrefix = `[${Object.entries(this.context).map(([k, v]) => `${k}=${v}`).join(', ')}]`
        return super.formatMessage(level, `${contextPrefix} ${message}`, meta)
      }
    }

    return new ChildLogger(this, context)
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📋 Unified Logging Utility

Usage:
  node logger.js [options] "message"

Options:
  --level, -l     Log level (error|warn|info|debug|trace)
  --file, -f      Enable file logging
  --json, -j      JSON output format
  --app, -a       Application name
  --dir, -d       Log directory
  --help, -h      Show help

Examples:
  node logger.js "Hello World"
  node logger.js -l debug "Debug message"
  node logger.js -f -j "Structured log"
  node logger.js -l error --file "Error occurred"
`)
    process.exit(0)
  }

  const options = {}
  
  const levelIndex = args.indexOf('-l') !== -1 ? args.indexOf('-l') : args.indexOf('--level')
  if (levelIndex !== -1 && args[levelIndex + 1]) {
    options.level = args[levelIndex + 1]
  }

  if (args.includes('-f') || args.includes('--file')) {
    options.file = true
  }

  if (args.includes('-j') || args.includes('--json')) {
    options.json = true
  }

  const appIndex = args.indexOf('-a') !== -1 ? args.indexOf('-a') : args.indexOf('--app')
  if (appIndex !== -1 && args[appIndex + 1]) {
    options.appName = args[appIndex + 1]
  }

  const dirIndex = args.indexOf('-d') !== -1 ? args.indexOf('-d') : args.indexOf('--dir')
  if (dirIndex !== -1 && args[dirIndex + 1]) {
    options.logDir = args[dirIndex + 1]
  }

  // Get message (last argument or from stdin)
  let message = args[args.length - 1]
  if (!message || message.startsWith('-')) {
    message = 'No message provided'
  }

  const logger = new Logger(options)
  logger.info(message)
}

module.exports = { Logger }
