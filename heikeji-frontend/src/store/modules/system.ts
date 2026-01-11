import { defineStore } from 'pinia'
import { http } from '@/utils/http'

// 定义菜单数据类型
export interface Menu {
  id: string | number
  parentId: string | number
  name: string
  icon: string
  path: string
  component: string
  hidden: boolean
  affix: boolean
  children?: Menu[]
}

// 定义分页查询参数
interface MenuQuery {
  page: number
  pageSize: number
  [key: string]: any
}

// 定义菜单响应结果
interface MenuResponse {
  data: Menu[]
  total: number
  page: number
  pageSize: number
}

// 定义日志数据类型
export interface Log {
  id: string
  username: string
  actionType: string
  module: string
  description: string
  params: string
  ip: string
  userAgent: string
  os: string
  createTime: string
}

// 定义日志查询参数
interface LogQuery {
  page: number
  pageSize: number
  username?: string
  actionType?: string
  startDate?: string
  endDate?: string
  [key: string]: any
}

// 定义日志响应结果
interface LogResponse {
  data: Log[]
  total: number
  page: number
  pageSize: number
}

// 定义系统状态
interface SystemState {
  menuList: Menu[]
  logList: Log[]
  loading: boolean
}

// 创建系统store
export const useSystemStore = defineStore('system', {
  state: (): SystemState => ({
    menuList: [],
    logList: [],
    loading: false,
  }),

  getters: {
    // 获取菜单树
    menuTree: state => {
      const buildTree = (list: Menu[]): Menu[] => {
        const tree: Menu[] = []
        const map: Record<string | number, Menu> = {}

        // 创建映射
        list.forEach(item => {
          map[item.id] = { ...item, children: [] }
        })

        // 构建父子关系
        list.forEach(item => {
          if (item.parentId === 0) {
            tree.push(map[item.id])
          } else if (map[item.parentId]) {
            map[item.parentId].children?.push(map[item.id])
          }
        })

        return tree
      }

      return buildTree(state.menuList)
    },
  },

  actions: {
    // 获取菜单列表
    async getMenuList(params: MenuQuery) {
      this.loading = true
      try {
        const response = await http.get<MenuResponse>('/system/menu/list', { params })
        this.menuList = response.data
        return response
      } finally {
        this.loading = false
      }
    },

    // 添加菜单
    async addMenu(menuData: Partial<Menu>) {
      this.loading = true
      try {
        const response = await http.post<Menu>('/system/menu/add', menuData)
        // 重新获取菜单列表
        await this.getMenuList({ page: 1, pageSize: 100 })
        return response
      } finally {
        this.loading = false
      }
    },

    // 更新菜单
    async updateMenu(menuData: Partial<Menu>) {
      this.loading = true
      try {
        const response = await http.put<Menu>(`/system/menu/update/${menuData.id}`, menuData)
        // 重新获取菜单列表
        await this.getMenuList({ page: 1, pageSize: 100 })
        return response
      } finally {
        this.loading = false
      }
    },

    // 删除菜单
    async deleteMenu(id: string | number) {
      this.loading = true
      try {
        const response = await http.delete<Menu>(`/system/menu/delete/${id}`)
        // 重新获取菜单列表
        await this.getMenuList({ page: 1, pageSize: 100 })
        return response
      } finally {
        this.loading = false
      }
    },

    // 获取菜单详情
    async getMenuDetail(id: string | number) {
      this.loading = true
      try {
        const response = await http.get<Menu>(`/system/menu/detail/${id}`)
        return response
      } finally {
        this.loading = false
      }
    },

    // 获取日志列表
    async getLogList(params: LogQuery) {
      this.loading = true
      try {
        const response = await http.get<LogResponse>('/system/log/list', { params })
        this.logList = response.data
        return response
      } finally {
        this.loading = false
      }
    },
  },
})
