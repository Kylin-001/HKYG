import { defineStore } from 'pinia'
import { http } from '@/utils/http'

// 定义配送员信息类型
export interface CourierInfo {
  id: string
  name: string
  avatar: string
  onlineStatus: 'online' | 'offline'
  joinDate: string
  rating: number
}

// 定义订单类型
export interface Order {
  id: string
  orderNo: string
  type: 'takeout' | 'pickup' | 'buy'
  pickupAddress: string
  deliveryAddress: string
  fee: number
  distance: number
  estimatedTime: string
  status: 'pending' | 'accepted' | 'picking' | 'delivering' | 'completed' | 'cancelled'
  deliveryTime?: string
}

// 定义仪表板数据类型
export interface DashboardData {
  todayDeliveries: number
  pendingOrders: number
  todayIncome: number
  serviceRating: number
  weekIncome: number
  monthIncome: number
  totalDeliveries: number
}

// 定义订单响应结果
interface OrdersResponse {
  list: Order[]
  total: number
}

// 定义配送员状态
interface CourierState {
  courierInfo: CourierInfo
  dashboardData: DashboardData | null
  loading: boolean
}

// 创建配送员store
export const useCourierStore = defineStore('courier', {
  state: (): CourierState => ({
    courierInfo: {
      id: '',
      name: '',
      avatar: '',
      onlineStatus: 'offline',
      joinDate: '',
      rating: 0
    },
    dashboardData: null,
    loading: false
  }),

  getters: {
    // 获取配送员信息
    getCourierInfo: (state) => state.courierInfo,
    
    // 获取仪表板数据
    getDashboardData: (state) => state.dashboardData
  },

  actions: {
    // 获取仪表板数据
    async getDashboardData() {
      this.loading = true
      try {
        const response = await http.get<DashboardData>('/courier/dashboard')
        this.dashboardData = response
        return response
      } finally {
        this.loading = false
      }
    },

    // 更新在线状态
    async updateStatus(status: 'online' | 'offline') {
      this.loading = true
      try {
        const response = await http.put<CourierInfo>('/courier/status', { status })
        this.courierInfo.onlineStatus = status
        return response
      } finally {
        this.loading = false
      }
    },

    // 获取订单列表
    async getOrders() {
      this.loading = true
      try {
        const response = await http.get<OrdersResponse>('/courier/orders')
        return response
      } finally {
        this.loading = false
      }
    },

    // 接单
    async acceptOrder(orderId: string) {
      this.loading = true
      try {
        const response = await http.post<Order>(`/courier/orders/${orderId}/accept`)
        return response
      } finally {
        this.loading = false
      }
    }
  },
})
