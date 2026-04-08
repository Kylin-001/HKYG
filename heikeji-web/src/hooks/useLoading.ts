import { ref } from 'vue'

export function useLoading(initialState = false) {
  const loading = ref(initialState)

  function start() { loading.value = true }

  function done() { loading.value = false }

  async function run<T>(fn: () => Promise<T>): Promise<T> {
    start()
    try {
      return await fn()
    } finally {
      done()
    }
  }

  return { loading, start, done, run }
}
