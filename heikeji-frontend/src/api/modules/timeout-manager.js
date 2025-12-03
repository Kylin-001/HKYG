/**
 * 超时管理器模块
 * 负责根据请求类型动态设置超时时间
 */

export function createTimeoutManager() {
  const defaultTimeout = 15000 // 15秒

  const timeoutRules = [
    {
      match: config => config.url.includes('/upload'),
      timeout: 60000, // 60秒 - 上传文件
    },
    {
      match: config => config.url.includes('/download'),
      timeout: 30000, // 30秒 - 下载文件
    },
    {
      match: config => config.method === 'post' && config.data instanceof FormData,
      timeout: 60000, // 60秒 - 表单提交
    },
    {
      match: config => config.url.includes('/export'),
      timeout: 45000, // 45秒 - 导出操作
    },
    {
      match: config => config.url.includes('/import'),
      timeout: 60000, // 60秒 - 导入操作
    },
  ]

  function setTimeout(config) {
    // 如果用户已经明确设置了超时时间，使用用户设置的值
    if (config.timeout !== undefined) {
      return config
    }

    // 根据请求类型动态设置超时时间
    for (const rule of timeoutRules) {
      if (rule.match(config)) {
        config.timeout = rule.timeout
        break
      }
    }

    // 如果没有匹配的规则，使用默认超时时间
    if (config.timeout === undefined) {
      config.timeout = defaultTimeout
    }

    return config
  }

  function getTimeoutDescription(config) {
    const timeout = config.timeout || defaultTimeout

    if (timeout === 60000) {
      return '60秒 (文件上传/表单提交)'
    } else if (timeout === 30000) {
      return '30秒 (文件下载)'
    } else if (timeout === 45000) {
      return '45秒 (数据导出)'
    } else if (timeout === defaultTimeout) {
      return '15秒 (普通请求)'
    } else {
      return `${timeout / 1000}秒 (自定义)`
    }
  }

  function addTimeoutRule(matchFn, timeout) {
    timeoutRules.push({
      match: matchFn,
      timeout,
    })
  }

  function getAllRules() {
    return timeoutRules.map(rule => ({
      match: rule.match.toString(),
      timeout: rule.timeout,
    }))
  }

  return {
    setTimeout,
    getTimeoutDescription,
    addTimeoutRule,
    getAllRules,
    defaultTimeout,
  }
}
