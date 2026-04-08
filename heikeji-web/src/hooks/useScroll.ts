import { ref, onMounted, onUnmounted } from 'vue'

export function useScroll(threshold = 300) {
  const scrollY = ref(0)
  const isAtTop = ref(true)
  const isAtBottom = ref(false)
  const showBackToTop = ref(false)

  let rafId: number | null = null

  function handleScroll() {
    if (rafId !== null) return
    rafId = requestAnimationFrame(() => {
      scrollY.value = window.scrollY
      isAtTop.value = window.scrollY < 10
      isAtBottom.value = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 20
      showBackToTop.value = window.scrollY > threshold
      rafId = null
    })
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function scrollToBottom() {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
  }

  onMounted(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (rafId !== null) cancelAnimationFrame(rafId)
  })

  return { scrollY, isAtTop, isAtBottom, showBackToTop, scrollToTop, scrollToBottom }
}
