import { CspManager } from './csp'
import { csrfManager } from './csrf'

export * from './xss'
export * from './csrf'
export * from './csp'

const cspManager = new CspManager()

function initSecurity(): void {
  if (typeof document !== 'undefined') {
    cspManager.applyMeta()
  }

  console.log('[Security] Security module initialized')
}

export { cspManager, csrfManager, initSecurity }
