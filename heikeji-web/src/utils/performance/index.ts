import { resourceHints } from './resourceHints'
import { perfMonitor } from './monitor'

export * from './resourceHints'
export * from './monitor'
export * from './bundleOptimizer'

function initPerformance(): void {
  if (typeof window === 'undefined') return

  resourceHints.preloadCriticalResources()

  console.log('[Performance] Performance optimization initialized')
}

export { resourceHints, perfMonitor, initPerformance }
