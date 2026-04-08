export * from './resourceHints'
export * from './monitor'
export * from './bundleOptimizer'

import { resourceHints } from './resourceHints'
import { perfMonitor } from './monitor'

function initPerformance(): void {
  if (typeof window === 'undefined') return

  resourceHints.preloadCriticalResources()

  console.log('[Performance] Performance optimization initialized')
}

export { resourceHints, perfMonitor, initPerformance }
