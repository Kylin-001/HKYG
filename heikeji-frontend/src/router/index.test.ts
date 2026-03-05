import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import router from '@/router'
import { setActivePinia, createPinia } from 'pinia'

describe('Router', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should create router with correct configuration', () => {
    expect(router).toBeDefined()
    expect(router.options.history).toBeDefined()
    expect(router.options.routes).toBeDefined()
  })

  it('should have constant routes defined', () => {
    const routes = router.getRoutes()
    expect(routes.length).toBeGreaterThan(0)
    
    const loginRoute = routes.find(r => r.path === '/login')
    expect(loginRoute).toBeDefined()
  })

  it('should have 404 route', () => {
    const routes = router.getRoutes()
    const notFoundRoute = routes.find(r => r.path === '/404')
    expect(notFoundRoute).toBeDefined()
  })

  it('should redirect root to dashboard', () => {
    const routes = router.getRoutes()
    const rootRoute = routes.find(r => r.path === '/')
    expect(rootRoute).toBeDefined()
    expect(rootRoute.redirect).toBe('/dashboard')
  })

  it('should have meta properties on routes', () => {
    const routes = router.getRoutes()
    routes.forEach(route => {
      if (route.meta) {
        expect(route.meta).toHaveProperty('title')
        expect(route.meta).toHaveProperty('hidden')
      }
    })
  })

  it('should navigate to login route', async () => {
    await router.push('/login')
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('should navigate to 404 route', async () => {
    await router.push('/404')
    expect(router.currentRoute.value.path).toBe('/404')
  })

  it('should redirect root to dashboard', async () => {
    await router.push('/')
    expect(router.currentRoute.value.path).toBe('/dashboard')
  })

  it('should handle unknown routes', async () => {
    await router.push('/unknown-route')
    expect(router.currentRoute.value.path).toBe('/404')
  })

  it('should preserve query parameters', async () => {
    await router.push({ path: '/login', query: { redirect: '/dashboard' } })
    expect(router.currentRoute.value.query.redirect).toBe('/dashboard')
  })

  it('should handle route params', async () => {
    await router.push({ path: '/product/:id', params: { id: '123' } })
    expect(router.currentRoute.value.params.id).toBe('123')
  })
})
