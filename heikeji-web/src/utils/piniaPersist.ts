import { defineStore } from 'pinia'
import type { PiniaPluginContext } from 'pinia'

interface PersistOptions {
  key?: string
  storage?: Storage
  paths?: string[]
  beforeRestore?: (context: PiniaPluginContext) => void
  afterRestore?: (context: PiniaPluginContext) => void
  serializer?: {
    serialize: (state: object) => string
    deserialize: (str: string) => object
  }
}

interface StorePersistConfig {
  enable?: boolean
  options?: PersistOptions
}

declare module 'pinia' {
  interface DefineStoreOptionsBase<S, Store> {
    persist?: boolean | StorePersistConfig
  }
}

const DEFAULT_PERSIST_OPTIONS: Required<PersistOptions> = {
  key: '',
  storage: typeof localStorage !== 'undefined' ? localStorage : sessionStorage,
  paths: [],
  beforeRestore: () => {},
  afterRestore: () => {},
  serializer: {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  },
}

export function createPersistedState(options?: Partial<PersistOptions>) {
  const globalOptions = { ...DEFAULT_PERSIST_OPTIONS, ...options }

  return (context: PiniaPluginContext) => {
    const { pinia, store } = context
    const storePersistOptions = store.$persist as StorePersistConfig | undefined

    if (!storePersistOptions?.enable && !store.$persist) {
      return
    }

    const persistOptions = {
      ...globalOptions,
      ...(typeof storePersistOptions === 'object' ? storePersistOptions.options : {}),
    }

    const key = persistOptions.key || `pinia-${store.$id}`

    const deserialize = () => {
      try {
        const raw = persistOptions.storage.getItem(key)
        if (raw) {
          return persistOptions.serializer.deserialize(raw as string)
        }
      } catch (error) {
        console.warn(`[persistedState] Error deserializing store "${store.$id}":`, error)
      }
      return null
    }

    const serialize = (state: object) => {
      try {
        let dataToSerialize: object

        if (persistOptions.paths && persistOptions.paths.length > 0) {
          dataToSerialize = {}
          persistOptions.paths.forEach((path) => {
            const keys = path.split('.')
            let value: unknown = state

            for (const k of keys) {
              value = value?.[k]
            }

            if (value !== undefined) {
              Object.assign(dataToSerialize, { [path]: value })
            }
          })
        } else {
          dataToSerialize = state
        }

        return persistOptions.serializer.serialize(dataToSerialize)
      } catch (error) {
        console.warn(`[persistedState] Error serializing store "${store.$id}":`, error)
        return ''
      }
    }

    const restore = async () => {
      persistOptions.beforeRestore(context)

      const deserializedData = deserialize()

      if (deserializedData) {
        store.$patch(deserializedData)
      }

      persistOptions.afterRestore(context)
    }

    const save = () => {
      const serializedData = serialize(store.$state)

      if (serializedData !== '') {
        persistOptions.storage.setItem(key, serializedData as string)
      }
    }

    restore()

    store.$subscribe(
      (_mutation, state) => {
        save()
      },
      { detached: true }
    )

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === key && event.newValue) {
          const newData = persistOptions.serializer.deserialize(event.newValue)

          if (newData) {
            store.$patch(newData)
          }
        }
      })

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          save()
        }
      })
    }
  }
}

export default createPersistedState
