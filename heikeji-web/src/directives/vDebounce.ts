import type { ObjectDirective } from 'vue'

const debounceMap = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>()

const vDebounce: ObjectDirective<HTMLElement, { delay?: number }> = {
  mounted(el, binding) {
    const delay = binding.value ?? 300
    el.addEventListener('click', () => {
      if (debounceMap.has(el)) return
      debounceMap.set(el, setTimeout(() => { debounceMap.delete(el) }, delay))
    })
  },
  unmounted(el) {
    const timer = debounceMap.get(el)
    if (timer) clearTimeout(timer)
    debounceMap.delete(el)
  }
}

export default vDebounce
