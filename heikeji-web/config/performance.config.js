# ============================================
# 黑科易购 (heikeji-web) - 性能基准配置
# 定义Core Web Vitals目标值和告警阈值
# ============================================

module.exports = {
  // Core Web Vitals 目标（毫秒）
  coreWebVitals: {
    // 首次内容绘制 (FCP)
    fcp: {
      good: 1800,
      needsImprovement: 3000,
      target: 1500
    },
    
    // 最大内容绘制 (LCP)
    lcp: {
      good: 2500,
      needsImprovement: 4000,
      target: 2000
    },
    
    // 首次输入延迟 (FID)
    fid: {
      good: 100,
      needsImprovement: 300,
      target: 50
    },
    
    // 累积布局偏移 (CLS)
    cls: {
      good: 0.1,
      needsImprovement: 0.25,
      target: 0.05
    },
    
    // 首字节时间 (TTFB)
    ttfb: {
      good: 800,
      needsImprovement: 1800,
      target: 600
    },

    // 交互到下一次绘制 (INP) - 新指标
    inp: {
      good: 200,
      needsImprovement: 500,
      target: 150
    }
  },

  // 资源加载目标
  resources: {
    // HTML文档大小
    htmlSize: {
      max: 50 * 1024, // 50KB
      target: 30 * 1024
    },
    
    // 首屏JS大小
    firstPartyJS: {
      max: 350 * 1024, // 350KB
      target: 200 * 1024
    },
    
    // CSS大小
    cssSize: {
      max: 100 * 1024, // 100KB
      target: 50 * 1024
    },
    
    // 图片数量
    images: {
      max: 20,
      target: 10
    },
    
    // 请求数量
    requests: {
      max: 80,
      target: 40
    }
  },

  // 构建产物目标
  build: {
    // 总包大小（gzip后）
    totalSize: {
      max: 500 * 1024, // 500KB
      target: 300 * 1024
    },
    
    // 单个chunk最大大小
    chunkSize: {
      max: 200 * 1024,
      target: 100 * 1024
    },
    
    // chunk数量
    chunks: {
      max: 15,
      target: 8
    }
  },

  // 告警配置
  alerts: {
    // 性能降级告警
    performanceDegradation: {
      enabled: true,
      threshold: 20, // 比基线差20%触发
      channels: ['email', 'slack', 'webhook']
    },
    
    // 错误率告警
    errorRate: {
      enabled: true,
      threshold: 1, // 1%错误率
      window: 5 // 5分钟窗口
    },
    
    // 可用性告警
    availability: {
      enabled: true,
      threshold: 99.9, // 99.9%可用性
      window: 60 // 60分钟窗口
    }
  },

  // 监控端点
  monitoring: {
    // 健康检查
    healthCheck: '/api/health',
    
    // 就绪检查
    readinessCheck: '/api/ready',
    
    // 指标端点
    metricsEndpoint: '/api/metrics',
    
    // 性能数据上报
    perfDataEndpoint: '/api/performance'
  },

  // A/B测试和灰度发布
  deployment: {
    // 灰度发布百分比
    canaryPercent: 5,
    
    // 自动回滚条件
    rollbackConditions: {
      errorRateIncrease: 10, // 错误率增长10%
      p95LatencyIncrease: 50, // P95延迟增长50%
      crashRate: 5 // 崩溃率5%
    },
    
    // 发布窗口
    releaseWindows: [
      { start: '09:00', end: '22:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
      { start: '10:00', end: '18:00', days: ['saturday'] }
      // 周日不发布
    ]
  },

  // 缓存策略
  caching: {
    // 静态资源缓存时间（秒）
    staticAssets: 31536000, // 1年
    
    // API响应缓存时间
    apiResponses: {
      public: 60, // 1分钟
      private: 300, // 5分钟
      realtime: 0 // 不缓存
    },
    
    // CDN缓存配置
    cdn: {
      edgeCacheTime: 86400, // 边缘节点24小时
      browserCacheTime: 3600 // 浏览器1小时
    }
  },

  // 安全基线
  security: {
    // 安全头检查
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
      'Content-Security-Policy': true,
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    },
    
    // HTTPS强制跳转
    forceHTTPS: true,
    
    // HSTS预加载
    hstsPreload: true
  }
}
