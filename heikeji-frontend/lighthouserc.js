/**
 * Lighthouse CI 配置文件
 */

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'Local: http://localhost:5173',
      url: ['http://localhost:5173'],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--headless --no-sandbox',
      },
    },
    assert: {
      assertions: {
        // 性能指标
        'performance-budget': ['error', { maxNumericValue: 5000, resourceType: 'script' }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'interactive': ['error', { maxNumericValue: 5000 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        // 可访问性指标
        'accessibility': ['warn', { minScore: 0.9 }],
        // 最佳实践指标
        'best-practices': ['warn', { minScore: 0.9 }],
        // SEO指标
        'seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
