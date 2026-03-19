// 全局类型声明文件

// 声明Vue模块
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, Record<string, unknown>>
  export default component
}

// 声明图片资源模块
declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.jpeg' {
  const value: string
  export default value
}

declare module '*.gif' {
  const value: string
  export default value
}

declare module '*.svg' {
  const value: string
  export default value
}

// 声明样式文件模块
declare module '*.css' {}
declare module '*.scss' {}
declare module '*.less' {}

// 声明环境变量类型
declare interface ImportMetaEnv {
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_ENV: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DEBUG: boolean
  readonly MODE: string
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 全局工具函数类型声明
declare namespace App {
  // API响应数据结构
  interface ApiResponse<T = unknown> {
    code: number
    message: string
    data: T
    timestamp?: number
  }

  // 分页响应数据结构
  interface PageResponse<T = unknown> {
    records: T[]
    total: number
    size: number
    current: number
    pages: number
  }

  // 分页参数
  interface PageParams {
    page?: number
    limit?: number
  }

  // 用户信息
  interface UserInfo {
    id: number
    username: string
    nickname: string
    avatar?: string
    email?: string
    phone?: string
    roles: string[]
    permissions: string[]
    deptId?: number
    deptName?: string
    createTime: string
    lastLoginTime?: string
    status: number
  }

  // 分页结果
  interface PageResult<T = unknown> {
    list: T[]
    total: number
    pageNum: number
    pageSize: number
    totalPages: number
  }

  // 树节点
  interface TreeNode<T = unknown> {
    id: string | number
    label?: string
    title?: string
    children?: TreeNode<T>[]
    isLeaf?: boolean
    disabled?: boolean
    [key: string]: unknown
  }

  // 表单验证规则
  interface FormRules {
    [key: string]: Array<{
      required?: boolean
      message?: string
      trigger?: 'blur' | 'change'
      min?: number
      max?: number
      validator?: (rule: unknown, value: unknown, callback: (error?: Error) => void) => void
    }>
  }
}

// 全局方法扩展
declare interface Window {
  $message?: {
    success: (message: string) => void
    error: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
  }
  $notify?: {
    success: (options: { title: string; message: string }) => void
    error: (options: { title: string; message: string }) => void
    warning: (options: { title: string; message: string }) => void
    info: (options: { title: string; message: string }) => void
  }
  $confirm?: (
    message: string,
    title?: string,
    options?: {
      confirmButtonText?: string
      cancelButtonText?: string
      type?: 'success' | 'warning' | 'info' | 'error'
    }
  ) => Promise<void>
}
