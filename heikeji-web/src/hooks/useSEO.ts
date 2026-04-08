import { watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

interface MetaInfo {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
}

const defaultMeta: MetaInfo = {
  title: import.meta.env.VITE_APP_TITLE || '黑科易购',
  description: import.meta.env.VITE_APP_DESCRIPTION || '黑龙江科技大学校园服务平台',
  keywords: import.meta.env.VITE_APP_KEYWORDS || '',
}

export function useSEO(meta?: MetaInfo) {
  const route = useRoute()
  
  function updateMeta(info: MetaInfo) {
    const title = info.title || defaultMeta.title || ''
    const description = info.description || defaultMeta.description || ''
    const keywords = info.keywords || defaultMeta.keywords || ''
    
    document.title = title
    
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    
    if (info.ogImage) {
      updateOGTag('og:image', info.ogImage)
    }
    updateOGTag('og:title', title)
    updateOGTag('og:description', description)
    updateOGTag('og:url', window.location.href)
  }
  
  function updateMetaTag(name: string, content: string) {
    let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute('name', name)
      document.head.appendChild(element)
    }
    element.setAttribute('content', content)
  }
  
  function updateOGTag(property: string, content: string) {
    let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute('property', property)
      document.head.appendChild(element)
    }
    element.setAttribute('content', content)
  }
  
  if (meta) {
    updateMeta(meta)
  }
  
  const stopWatch = watch(
    () => route.path,
    () => {
      if (meta) {
        updateMeta(meta)
      }
    }
  )
  
  onUnmounted(() => {
    stopWatch()
  })
  
  return { updateMeta }
}
