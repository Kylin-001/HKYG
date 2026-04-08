import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export function usePageMeta() {
  const route = useRoute()

  const title = computed(() => (route.meta.title as string) || '黑科易购')
  const requiresAuth = computed(() => !!route.meta.requiresAuth)
  const icon = computed(() => (route.meta.icon as string) || '')
  const color = computed(() => (route.meta.color as string) || '')

  return { title, requiresAuth, icon, color }
}
