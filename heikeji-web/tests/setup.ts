import { beforeAll, afterEach, vi } from 'vitest'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  Object.defineProperty(window, 'getComputedStyle', {
    writable: true,
    value: () => ({
      getPropertyValue: (prop: string) => '',
    }),
  })

  window.ResizeObserver = vi.fn().mockImplementation(function (this: any, callback: ResizeObserverCallback) {
    this.observe = vi.fn()
    this.unobserve = vi.fn()
    this.disconnect = vi.fn()
    return this
  }) as unknown as typeof ResizeObserver

  window.IntersectionObserver = vi.fn().mockImplementation(function (this: any, callback: IntersectionObserverCallback) {
    this.observe = vi.fn()
    this.unobserve = vi.fn()
    this.disconnect = vi.fn()
    return this
  }) as unknown as typeof IntersectionObserver
})

afterEach(() => {
  vi.clearAllMocks()
  vi.restoreAllMocks()
})
