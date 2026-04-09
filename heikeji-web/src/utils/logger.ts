enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: string
  stackTrace?: string
  url: string
  userId?: string
}

class Logger {
  private static instance: Logger
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private level: LogLevel = LogLevel.INFO
  private enabled = true
  private remoteLogging = false
  private endpoint = '/api/logs'
  private flushInterval: number | null = null

  private constructor() {
    this.startAutoFlush()
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  setLevel(level: LogLevel): void {
    this.level = level
  }

  enable(): void {
    this.enabled = true
  }

  disable(): void {
    this.enabled = false
  }

  enableRemote(endpoint?: string): void {
    this.remoteLogging = true
    if (endpoint) {
      this.endpoint = endpoint
    }
  }

  disableRemote(): void {
    this.remoteLogging = false
  }

  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data)
  }

  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data)
  }

  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data)
  }

  error(message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, message, data)
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.enabled || level < this.level) return

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    }

    if (level === LogLevel.ERROR && data instanceof Error) {
      entry.stackTrace = data.stack
      entry.data = { ...data, name: data.name, message: data.message }
    }

    this.logs.push(entry)

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    this.outputToConsole(entry)

    if (this.remoteLogging && level >= LogLevel.WARN) {
      this.sendToServer([entry])
    }
  }

  private outputToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${LogLevel[entry.level]}]`

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.data)
        break
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.data)
        break
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.data)
        break
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.stackTrace || entry.data)
        break
    }
  }

  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filteredLogs = this.logs

    if (level !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.level >= level)
    }

    if (limit !== undefined) {
      filteredLogs = filteredLogs.slice(-limit)
    }

    return [...filteredLogs]
  }

  clearLogs(): void {
    this.logs = []
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  downloadLogs(): void {
    const blob = new Blob([this.exportLogs()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `logs_${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  startAutoFlush(intervalMs: number = 30000): void {
    if (this.flushInterval !== null) {
      clearInterval(this.flushInterval)
    }

    this.flushInterval = window.setInterval(() => {
      this.flush()
    }, intervalMs)
  }

  stopAutoFlush(): void {
    if (this.flushInterval !== null) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }
  }

  flush(): void {
    const errorAndWarnLogs = this.logs.filter(
      log => log.level >= LogLevel.WARN
    )

    if (errorAndWarnLogs.length > 0 && this.remoteLogging) {
      this.sendToServer(errorAndWarnLogs)
    }
  }

  private async sendToServer(entries: LogEntry[]): Promise<void> {
    try {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify({
          entries,
          sentAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
        })], { type: 'application/json' })

        navigator.sendBeacon(this.endpoint, blob)
      } else {
        await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entries,
            sentAt: new Date().toISOString(),
          }),
          keepalive: true,
        })
      }

      this.logs = this.logs.filter(log => !entries.includes(log))
    } catch (error) {
      console.warn('[Logger] Failed to send logs:', error)
    }
  }

  createScopedLogger(scope: string) {
    return {
      debug: (message: string, data?: unknown) => this.debug(`[${scope}] ${message}`, data),
      info: (message: string, data?: unknown) => this.info(`[${scope}] ${message}`, data),
      warn: (message: string, data?: unknown) => this.warn(`[${scope}] ${message}`, data),
      error: (message: string, data?: unknown) => this.error(`[${scope}] ${message}`, data),
    }
  }

  destroy(): void {
    this.stopAutoFlush()
    this.flush()
    this.clearLogs()
  }
}

export const logger = Logger.getInstance()

export function useLogger(scope?: string) {
  const scopedLogger = scope ? logger.createScopedLogger(scope) : logger

  return {
    debug: scopedLogger.debug.bind(scopedLogger),
    info: scopedLogger.info.bind(scopedLogger),
    warn: scopedLogger.warn.bind(scopedLogger),
    error: scopedLogger.error.bind(scopedLogger),
    getLogs: (...args: Parameters<typeof logger.getLogs>) => logger.getLogs(...args),
    exportLogs: () => logger.exportLogs(),
    downloadLogs: () => logger.downloadLogs(),
    clearLogs: () => logger.clearLogs(),
  }
}

export { Logger, LogLevel }
export type { LogEntry }
