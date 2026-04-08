const CSRF_HEADER_NAME = 'X-CSRF-Token'
const CSRF_COOKIE_NAME = 'csrf_token'
const CSRF_STORAGE_KEY = 'csrf_token'

interface CsrfToken {
  value: string
  expiresAt: number
}

class CsrfManager {
  private token: CsrfToken | null = null
  private refreshPromise: Promise<string> | null = null

  async getToken(): Promise<string> {
    if (this.token && this.token.expiresAt > Date.now()) {
      return this.token.value
    }

    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.fetchToken()

    try {
      return await this.refreshPromise
    } finally {
      this.refreshPromise = null
    }
  }

  private async fetchToken(): Promise<string> {
    try {
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch CSRF token: ${response.status}`)
      }

      const data = await response.json()
      const { token, expiresIn = 3600 } = data

      this.token = {
        value: token,
        expiresAt: Date.now() + expiresIn * 1000
      }

      this.persistToken(token)

      return token
    } catch (error) {
      console.error('[CsrfManager] Failed to fetch token:', error)

      const storedToken = this.getStoredToken()
      if (storedToken) return storedToken

      throw error
    }
  }

  getHeaderName(): string {
    return CSRF_HEADER_NAME
  }

  async getHeaders(): Promise<Record<string, string>> {
    const token = await this.getToken()
    return {
      [CSRF_HEADER_NAME]: token
    }
  }

  private persistToken(token: string): void {
    try {
      localStorage.setItem(CSRF_STORAGE_KEY, JSON.stringify({
        value: token,
        expiresAt: Date.now() + 3600 * 1000
      }))
    } catch {
      console.warn('[CsrfManager] Failed to persist token')
    }
  }

  private getStoredToken(): string | null {
    try {
      const stored = localStorage.getItem(CSRF_STORAGE_KEY)
      if (!stored) return null

      const parsed: CsrfToken = JSON.parse(stored)
      if (parsed.expiresAt > Date.now()) {
        this.token = parsed
        return parsed.value
      }

      localStorage.removeItem(CSRF_STORAGE_KEY)
      return null
    } catch {
      return null
    }
  }

  clearToken(): void {
    this.token = null
    localStorage.removeItem(CSRF_STORAGE_KEY)
  }

  validateToken(token: string): boolean {
    if (!this.token) return false
    return this.token.value === token && this.token.expiresAt > Date.now()
  }
}

export const csrfManager = new CsrfManager()
export { CSRF_HEADER_NAME, CSRF_COOKIE_NAME }
export type { CsrfToken }
