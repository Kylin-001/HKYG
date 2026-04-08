#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface GenerateOptions {
  name: string
  type: 'component' | 'page' | 'composable' | 'store' | 'api' | 'util'
  dir?: string
  lang?: 'ts' | 'tsx'
  withStyle?: boolean
  withTest?: boolean
  withTypes?: boolean
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

const TEMPLATES = {
  component: (name: string, options: GenerateOptions) => `<template>
  <div class="${toKebabCase(name)}">
    <!-- ${name} component -->
  </div>
</template>

<script setup lang="${options.lang || 'ts'}">
${options.withTypes ? `interface Props {\n  // Define props here\n}\n\nconst props = defineProps<Props>()\n` : `defineProps<{\n  // Define props here\n}>()`}
${options.withTypes ? `const emit = defineEmits<{\n  (e: 'event-name', payload: unknown): void\n}>()\n` : ''}
</script>

${options.withStyle ? `<style scoped>\n.${toKebabCase(name)} {\n  /* Component styles */\n}\n</style>` : ''}`,

  page: (name: string, options: GenerateOptions) => `<template>
  <div class="page-${toKebabCase(name)}">
    <h1>${capitalize(name)}</h1>
    <!-- Page content -->
  </div>
</template>

<script setup lang="${options.lang || 'ts'}">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  console.log('Page mounted:', route.path)
})

defineOptions({
  name: '${name}Page'
})
</script>

${options.withStyle ? `<style scoped>\n.page-${toKebabCase(name)} {\n  min-height: 100vh;\n  padding: 2rem;\n}\n</style>` : ''}`,

  composable: (name: string, _options: GenerateOptions) => `import { ref, computed, onMounted, onUnmounted } from 'vue'

export function use${name}() {
  const state = ref(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const computedValue = computed(() => {
    return state.value
  })

  async function fetchData() {
    loading.value = true
    error.value = null

    try {
      // Fetch data logic here
      state.value = await Promise.resolve({})
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchData()
  })

  return {
    state,
    loading,
    error,
    computedValue,
    fetchData
  }
}`,

  store: (name: string, _options: GenerateOptions) => `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const use${name}Store = defineStore('${toKebabCase(name)}', () => {
  const items = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const itemCount = computed(() => items.value.length)
  const hasItems = computed(() => items.value.length > 0)

  async function fetchItems() {
    loading.value = true
    error.value = null

    try {
      // Fetch items logic
      items.value = []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch items'
    } finally {
      loading.value = false
    }
  }

  function addItem(item: any) {
    items.value.push(item)
  }

  function removeItem(id: number | string) {
    items.value = items.value.filter((item: any) => item.id !== id)
  }

  function clearItems() {
    items.value = []
  }

  return {
    items,
    loading,
    error,
    itemCount,
    hasItems,
    fetchItems,
    addItem,
    removeItem,
    clearItems
  }
})`,

  api: (name: string, _options: GenerateOptions) => `import request from '@/utils/request'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

export interface ${name}Params {
  // Define API parameters
  page?: number
  pageSize?: number
}

export interface ${name}Item {
  id: number | string
  // Define item structure
}

export const ${toKebabCase(name)}Api = {
  getList(params?: ${name}Params): Promise<ApiResponse<PaginatedResponse<${name}Item>>> {
    return request.get('/${toKebabCase(name)}', { params })
  },

  getById(id: number | string): Promise<ApiResponse<${name}Item>> {
    return request.get(\`/${toKebabCase(name)}/\${id}\`)
  },

  create(data: Partial<${name}Item>): Promise<ApiResponse<${name}Item>> {
    return request.post('/${toKebabCase(name)}', data)
  },

  update(id: number | string, data: Partial<${name}Item>): Promise<ApiResponse<${name}Item>> {
    return request.put(\`/${toKebabCase(name)}/\${id}\`, data)
  },

  delete(id: number | string): Promise<ApiResponse<void>> {
    return request.delete(\`/${toKebabCase(name)}/\${id}\`)
  }
}`,

  util: (name: string, _options: GenerateOptions) => `/**
 * ${name} utility functions
 * @description Utility helpers for ${name.toLowerCase()} operations
 */

export function ${toKebabCase(name)}Helper(input: unknown): unknown {
  // Implementation here
  return input
}

export async function ${toKebabCase(name)}Async(input: unknown): Promise<unknown> {
  // Async implementation here
  return input
}

export const ${toKebabCase(name)}Constants = {
  // Constants here
  DEFAULT_VALUE: 'default',
  MAX_ITEMS: 100
} as const`
}

const TEST_TEMPLATES = {
  component: (name: string) => `import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ${name} from './index.vue'

describe('${name}', () => {
  it('renders properly', () => {
    const wrapper = mount(${name})
    expect(wrapper.exists()).toBe(true)
  })

  it('matches snapshot', () => {
    const wrapper = mount(${name})
    expect(wrapper.html()).toMatchSnapshot()
  })
})`,

  composable: (name: string) => `import { describe, it, expect } from 'vitest'
import { use${name} } from './index'

describe('use${name}', () => {
  it('should initialize with default values', () => {
    const { state, loading, error } = use${name}()

    expect(state.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })
})`,

  api: (name: string) => `import { describe, it, expect, vi } from 'vitest'
import { ${toKebabCase(name)}Api } from './index'

vi.mock('@/utils/request', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('${toKebabCase(name)}Api', () => {
  it('should have all CRUD methods defined', () => {
    expect(${toKebabCase(name)}Api.getList).toBeDefined()
    expect(${toKebabCase(name)}Api.getById).toBeDefined()
    expect(${toKebabCase(name)}Api.create).toBeDefined()
    expect(${toKebabCase(name)}Api.update).toBeDefined()
    expect(${toKebabCase(name)}Api.delete).toBeDefined()
  })
})`
}

function generate(options: GenerateOptions): void {
  const { name, type, dir, lang = 'ts', withStyle = true, withTest = false, withTypes = true } = options

  const baseDir = dir || getDefaultDir(type)
  const targetPath = path.join(process.cwd(), baseDir, type === 'page' ? `${toKebabCase(name)}` : '')

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true })
  }

  const template = TEMPLATES[type](name, { ...options, lang, withStyle, withTypes })
  const ext = lang === 'tsx' ? 'vue' : lang === 'ts' ? (type === 'component' || type === 'page' ? 'vue' : 'ts') : 'js'
  const fileName = type === 'composable' ? `use${name}.${ext}` : `index.${ext}`

  fs.writeFileSync(path.join(targetPath, fileName), template)
  console.log(`✅ Created: ${path.join(baseDir, type === 'page' ? `${toKebabCase(name)}/${fileName}` : `${type}/${fileName}`)}`)

  if (withTest && TEST_TEMPLATES[type]) {
    const testDir = path.join(process.cwd(), '__tests__', baseDir, type === 'page' ? `${toKebabCase(name)}` : '')
    
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true })
    }

    const testTemplate = TEST_TEMPLATES[type](name)
    fs.writeFileSync(path.join(testDir, `${name}.test.ts`), testTemplate)
    console.log(`✅ Created test: ${path.join('__tests__', baseDir, type === 'page' ? `${toKebabCase(name)}/${name}.test.ts` : `${type}/${name}.test.ts`)}`)
  }
}

function getDefaultDir(type: string): string {
  const dirs: Record<string, string> = {
    component: 'src/components',
    page: 'src/views',
    composable: 'src/composables',
    store: 'src/stores',
    api: 'src/api',
    util: 'src/utils'
  }
  return dirs[type] || 'src'
}

function parseArgs(): GenerateOptions | null {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp()
    return null
  }

  const nameIndex = args.findIndex((arg) => !arg.startsWith('--'))
  if (nameIndex === -1) {
    console.error('❌ Error: Please provide a component/page name')
    return null
  }

  const name = args[nameIndex]
  const type = (args.find((arg) => arg.startsWith('--type='))?.split('=')[1] || 'component') as GenerateOptions['type']
  const dir = args.find((arg) => arg.startsWith('--dir='))?.split('=')[1]
  const lang = (args.find((arg) => arg.startsWith('--lang='))?.split('=')[1] || 'ts') as 'ts' | 'tsx'
  const withStyle = !args.includes('--no-style')
  const withTest = args.includes('--test')
  const withTypes = !args.includes('--no-types')

  return { name: capitalize(name), type, dir, lang, withStyle, withTest, withTypes }
}

function printHelp(): void {
  console.log(`
🚀 Code Generator - Vue/TypeScript Project Scaffolding Tool

Usage:
  node scripts/generate.js <Name> [options]

Options:
  --type=<type>       Type to generate (component|page|composable|store|api|util) [default: component]
  --dir=<directory>   Output directory [default: auto-detected based on type]
  --lang=<lang>       Language (ts|tsx) [default: ts]
  --no-style          Don't generate style section
  --test              Generate test file
  --no-types          Don't generate TypeScript interfaces
  --help, -h          Show this help message

Examples:
  # Generate a component
  node scripts/generate.js MyButton --type=component

  # Generate a page with tests
  node scripts/generate.js Dashboard --type=page --test

  # Generate an API module
  node scripts/generate.js Product --type=api

  # Generate a composable
  node scripts/generate.js Auth --type=composable --test
`)
}

const options = parseArgs()

if (options) {
  try {
    generate(options)
  } catch (error) {
    console.error('❌ Generation failed:', error)
    process.exit(1)
  }
}
