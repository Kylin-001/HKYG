interface BundleInfo {
  name: string
  size: number
  gzipSize: number
  brotliSize: number
  modules: number
}

interface OptimizationSuggestion {
  type: 'code-splitting' | 'tree-shaking' | 'lazy-loading' | 'dynamic-import' | 'asset-optimization'
  priority: 'high' | 'medium' | 'low'
  message: string
  estimatedSaving?: string
}

class BundleOptimizer {
  private suggestions: OptimizationSuggestion[] = []

  analyzeBundle(bundleData: BundleInfo[]): OptimizationSuggestion[] {
    this.suggestions = []

    bundleData.forEach((bundle) => {
      if (bundle.size > 500 * 1024) {
        this.suggestions.push({
          type: 'code-splitting',
          priority: 'high',
          message: `Bundle "${bundle.name}" is ${(bundle.size / 1024).toFixed(1)}KB, consider code splitting`,
          estimatedSaving: '~40%'
        })
      }

      if (bundle.modules > 100) {
        this.suggestions.push({
          type: 'lazy-loading',
          priority: 'medium',
          message: `Bundle "${bundle.name}" has ${bundle.modules} modules, consider lazy loading`
        })
      }
    })

    return [...this.suggestions]
  }

  generatePreloadHints(): string[] {
    const hints: string[] = []

    hints.push('<!-- Critical CSS inline -->')
    hints.push('<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>')
    hints.push('<link rel="preload" href="/images/hero.webp" as="image">')
    hints.push('<link rel="modulepreload" href="/src/main.ts">')

    return hints
  }

  generateCriticalCSS(): string {
    return `
/* Critical CSS - Above the fold styles */
:root {
  --color-primary: #3b82f6;
  --color-text: #1f2937;
  --color-bg: #ffffff;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5;
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
}

#app { min-height: 100vh; display: flex; flex-direction: column; }

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
    `.trim()
  }

  getImageOptimizationHints(): OptimizationSuggestion[] {
    return [
      {
        type: 'asset-optimization',
        priority: 'high',
        message: 'Use WebP format for images (30% smaller than JPEG)',
        estimatedSaving: '~30%'
      },
      {
        type: 'asset-optimization',
        priority: 'medium',
        message: 'Implement responsive images with srcset and sizes attributes'
      },
      {
        type: 'lazy-loading',
        priority: 'high',
        message: 'Add loading="lazy" to below-the-fold images'
      },
      {
        type: 'asset-optimization',
        priority: 'low',
        message: 'Consider using AVIF format for modern browsers (50% smaller than WebP)'
      }
    ]
  }

  getCodeSplittingStrategy(): Record<string, string> {
    return {
      vendor: 'node_modules/',
      common: 'src/components/common/',
      router: 'src/router/',
      pages: 'src/views/'
    }
  }
}

export const bundleOptimizer = new BundleOptimizer()
export type { BundleInfo, OptimizationSuggestion }
