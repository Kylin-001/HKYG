interface ResourceHint {
  type: 'prefetch' | 'preload' | 'preconnect' | 'dns-prefetch' | 'prerender' | 'modulepreload'
  href: string
  as?: string
  crossorigin?: string
  media?: string
  importance?: 'high' | 'low' | 'auto'
}

class ResourceHintsManager {
  private addedHints = new Set<string>()

  add(hint: ResourceHint): HTMLLinkElement | null {
    const key = `${hint.type}:${hint.href}`

    if (this.addedHints.has(key)) {
      return null
    }

    const link = document.createElement('link')
    link.rel = hint.type
    link.href = hint.href

    if (hint.as) link.setAttribute('as', hint.as)
    if (hint.crossorigin) link.crossOrigin = hint.crossorigin
    if (hint.media) link.media = hint.media
    if (hint.importance) link.setAttribute('importance', hint.importance)

    document.head.appendChild(link)
    this.addedHints.add(key)

    return link
  }

  prefetch(url: string, options?: Omit<ResourceHint, 'type' | 'href'>): void {
    this.add({ type: 'prefetch', href: url, ...options })
  }

  preload(url: string, as: string, options?: Omit<ResourceHint, 'type' | 'href' | 'as'>): void {
    this.add({ type: 'preload', href: url, as, ...options })
  }

  preconnect(url: string, options?: Omit<ResourceHint, 'type' | 'href'>): void {
    this.add({ type: 'preconnect', href: url, ...options })
  }

  dnsPrefetch(url: string): void {
    this.add({ type: 'dns-prefetch', href: url })
  }

  prerender(url: string): void {
    this.add({ type: 'prerender', href: url })
  }

  modulePreload(url: string): void {
    this.add({ type: 'modulepreload', href: url })
  }

  preloadCriticalResources(): void {
    const criticalFonts = [
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' }
    ]

    const criticalImages: string[] = []

    criticalFonts.forEach((font) => {
      this.preload(font.href, font.as, { crossorigin: 'anonymous', importance: 'high' })
    })

    criticalImages.forEach((img) => {
      this.preload(img, 'image', { importance: 'low' })
    })
  }

  clear(): void {
    this.addedHints.clear()
  }
}

export const resourceHints = new ResourceHintsManager()
export type { ResourceHint }
