// 在浏览器控制台运行此脚本以彻底清理 Service Worker
// 打开浏览器开发者工具 (F12) -> Console (控制台) -> 粘贴以下代码并回车

(async function clearServiceWorker() {
  console.log('[Clear SW] 开始清理 Service Worker...')

  // 1. 注销所有 Service Worker
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    console.log(`[Clear SW] 发现 ${registrations.length} 个 Service Worker`)

    for (const registration of registrations) {
      await registration.unregister()
      console.log('[Clear SW] 已注销:', registration.scope)
    }
  }

  // 2. 清除所有缓存
  if ('caches' in window) {
    const cacheNames = await caches.keys()
    console.log(`[Clear SW] 发现 ${cacheNames.length} 个缓存`)

    for (const cacheName of cacheNames) {
      await caches.delete(cacheName)
      console.log('[Clear SW] 已清除缓存:', cacheName)
    }
  }

  // 3. 清除 localStorage 中与 SW 相关的数据
  const swKeys = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (key.includes('sw') || key.includes('cache') || key.includes('heikeji'))) {
      swKeys.push(key)
    }
  }
  swKeys.forEach(key => {
    localStorage.removeItem(key)
    console.log('[Clear SW] 已清除 localStorage:', key)
  })

  console.log('[Clear SW] ✅ 清理完成！请刷新页面 (Ctrl+F5)')

  // 4. 强制刷新页面
  setTimeout(() => {
    window.location.reload(true)
  }, 1000)
})()
