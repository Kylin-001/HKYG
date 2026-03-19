import { describe, it, expect, vi, beforeEach } from 'vitest'
import { testUserData } from '@/config/test'
import axios from 'axios'
import request from '@/utils/request'

vi.mock('axios')

describe('Request Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should make GET request successfully', async () => {
    const mockResponse = { data: { id: 1, name: 'test' } }
    ;(axios as any).mockResolvedValue(mockResponse)

    const result = await request.get('/api/test')
    expect(result).toEqual(mockResponse.data)
  })

  it('should make POST request successfully', async () => {
    const mockData = { name: 'test' }
    const mockResponse = { data: { success: true } }
    ;(axios as any).mockResolvedValue(mockResponse)

    const result = await request.post('/api/test', mockData)
    expect(result).toEqual(mockResponse.data)
  })

  it('should handle request error', async () => {
    const mockError = new Error('Network Error')
    ;(axios as any).mockRejectedValue(mockError)

    await expect(request.get('/api/test')).rejects.toThrow()
  })

  it('should add authorization header when token exists', async () => {
    const mockResponse = { data: {} }
    ;(axios as any).mockResolvedValue(mockResponse)

    localStorage.setItem('token', 'test-token')
    await request.get('/api/test')

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    )
  })

  it('should handle 401 unauthorized error', async () => {
    const mockError = {
      response: {
        status: 401,
        data: { message: 'Unauthorized' },
      },
    }
    ;(axios as any).mockRejectedValue(mockError)

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    await expect(request.get('/api/test')).rejects.toThrow()
    consoleSpy.mockRestore()
  })
})
