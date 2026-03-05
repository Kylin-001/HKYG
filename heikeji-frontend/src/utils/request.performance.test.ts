import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from '@/utils/request'

vi.mock('axios')

describe('Request Utils Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle multiple concurrent requests efficiently', async () => {
    const startTime = performance.now()
    
    const promises = Array.from({ length: 100 }, (_, i) => 
      request.get(`/api/test/${i}`)
    )
    
    await Promise.all(promises)
    
    const endTime = performance.now()
    const totalTime = endTime - startTime
    
    expect(totalTime).toBeLessThan(1000)
  })

  it('should handle request caching efficiently', async () => {
    const startTime = performance.now()
    
    for (let i = 0; i < 100; i++) {
      await request.get('/api/test')
    }
    
    const endTime = performance.now()
    const totalTime = endTime - startTime
    
    expect(totalTime).toBeLessThan(5000)
  })

  it('should handle request cancellation efficiently', async () => {
    const startTime = performance.now()
    
    const promises = Array.from({ length: 100 }, (_, i) => {
      const controller = new AbortController()
      const promise = request.get(`/api/test/${i}`, {
        signal: controller.signal
      })
      
      setTimeout(() => controller.abort(), 10)
      return promise.catch(() => {})
    })
    
    await Promise.all(promises)
    
    const endTime = performance.now()
    const totalTime = endTime - startTime
    
    expect(totalTime).toBeLessThan(1000)
  })

  it('should handle request retry efficiently', async () => {
    const startTime = performance.now()
    
    const promises = Array.from({ length: 10 }, (_, i) => 
      request.get(`/api/test/${i}`)
    )
    
    await Promise.all(promises)
    
    const endTime = performance.now()
    const totalTime = endTime - startTime
    
    expect(totalTime).toBeLessThan(5000)
  })

  it('should handle large payloads efficiently', async () => {
    const largeData = {
      data: Array.from({ length: 10000 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        description: 'A'.repeat(100)
      }))
    }
    
    const startTime = performance.now()
    
    await request.post('/api/test', largeData)
    
    const endTime = performance.now()
    const totalTime = endTime - startTime
    
    expect(totalTime).toBeLessThan(1000)
  })
})
