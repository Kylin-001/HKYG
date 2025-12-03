import {
  getCourierDashboard,
  getCourierProfile,
  updateCourierStatus,
  updateCourierLocation,
  getCourierStatistics,
  getCourierOrders,
  getCourierOrderDetail,
  acceptCourierOrder,
  cancelCourierOrder,
  startDelivery,
  completeDelivery,
  getDeliveryRoute,
  getDeliveryTrend,
  getOrderTypeDistribution,
  getRevenueAnalysis,
  getTimeSlotDistribution,
  getDetailedData,
  exportReport,
} from '@/api/courier'

const state = {
  // 骑手基本信息
  courierInfo: {
    id: '',
    name: '',
    avatar: '',
    phone: '',
    onlineStatus: 'offline',
    rating: 0,
    joinDate: '',
    totalOrders: 0,
    totalIncome: 0,
  },

  // 仪表板数据
  dashboard: {
    todayDeliveries: 0,
    pendingOrders: 0,
    todayIncome: 0,
    serviceRating: 0,
  },

  // 订单相关
  orders: {
    list: [],
    total: 0,
    currentPage: 1,
    pageSize: 10,
    filters: {
      status: '',
      type: '',
      dateRange: [],
    },
  },

  // 统计数据
  statistics: {
    overview: {},
    trend: [],
    orderTypeDistribution: [],
    revenueAnalysis: [],
    timeSlotDistribution: [],
    detailedData: [],
    loading: false,
  },
}

const mutations = {
  // 设置骑手信息
  SET_COURIER_INFO(state, info) {
    state.courierInfo = { ...state.courierInfo, ...info }
  },

  // 设置仪表板数据
  SET_DASHBOARD_DATA(state, data) {
    state.dashboard = { ...state.dashboard, ...data }
  },

  // 设置订单列表
  SET_ORDERS_LIST(state, { list, total, currentPage }) {
    state.orders.list = list
    state.orders.total = total
    if (currentPage) {
      state.orders.currentPage = currentPage
    }
  },

  // 设置订单筛选条件
  SET_ORDER_FILTERS(state, filters) {
    state.orders.filters = { ...state.orders.filters, ...filters }
  },

  // 更新订单状态
  UPDATE_ORDER_STATUS(state, { orderId, status }) {
    const order = state.orders.list.find(item => item.id === orderId)
    if (order) {
      order.status = status
    }
  },

  // 设置统计数据
  SET_STATISTICS_DATA(state, { type, data }) {
    state.statistics[type] = data
  },

  // 设置统计加载状态
  SET_STATISTICS_LOADING(state, loading) {
    state.statistics.loading = loading
  },

  // 重置统计数据
  RESET_STATISTICS(state) {
    state.statistics = {
      overview: {},
      trend: [],
      orderTypeDistribution: [],
      revenueAnalysis: [],
      timeSlotDistribution: [],
      detailedData: [],
      loading: false,
    }
  },
}

const actions = {
  // 获取骑手仪表板数据
  async getDashboardData({ commit }) {
    try {
      const response = await getCourierDashboard()
      if (response.code === 200) {
        commit('SET_COURIER_INFO', response.data.courierInfo)
        commit('SET_DASHBOARD_DATA', response.data.dashboard)
        return response.data
      }
    } catch (error) {
      console.error('获取骑手仪表板数据失败:', error)
      throw error
    }
  },

  // 获取骑手个人信息
  async getProfile({ commit }) {
    try {
      const response = await getCourierProfile()
      if (response.code === 200) {
        commit('SET_COURIER_INFO', response.data)
        return response.data
      }
    } catch (error) {
      console.error('获取骑手个人信息失败:', error)
      throw error
    }
  },

  // 更新在线状态
  async updateStatus({ commit }, status) {
    try {
      const response = await updateCourierStatus(status)
      if (response.code === 200) {
        commit('SET_COURIER_INFO', { onlineStatus: status })
        return response.data
      }
    } catch (error) {
      console.error('更新骑手状态失败:', error)
      throw error
    }
  },

  // 更新位置信息
  async updateLocation({ commit }, location) {
    try {
      const response = await updateCourierLocation(location)
      if (response.code === 200) {
        return response.data
      }
    } catch (error) {
      console.error('更新位置信息失败:', error)
      throw error
    }
  },

  // 获取订单列表
  async getOrders({ commit, state }) {
    try {
      const params = {
        page: state.orders.currentPage,
        size: state.orders.pageSize,
        ...state.orders.filters,
      }

      const response = await getCourierOrders(params)
      if (response.code === 200) {
        commit('SET_ORDERS_LIST', {
          list: response.data.list,
          total: response.data.total,
          currentPage: params.page,
        })
        return response.data
      }
    } catch (error) {
      console.error('获取订单列表失败:', error)
      throw error
    }
  },

  // 获取订单详情
  async getOrderDetail({ commit }, orderId) {
    try {
      const response = await getCourierOrderDetail(orderId)
      if (response.code === 200) {
        return response.data
      }
    } catch (error) {
      console.error('获取订单详情失败:', error)
      throw error
    }
  },

  // 接单
  async acceptOrder({ commit }, orderId) {
    try {
      const response = await acceptCourierOrder(orderId)
      if (response.code === 200) {
        commit('UPDATE_ORDER_STATUS', { orderId, status: 'accepted' })
        return response.data
      }
    } catch (error) {
      console.error('接单失败:', error)
      throw error
    }
  },

  // 取消订单
  async cancelOrder({ commit }, { orderId, reason }) {
    try {
      const response = await cancelCourierOrder(orderId, reason)
      if (response.code === 200) {
        commit('UPDATE_ORDER_STATUS', { orderId, status: 'cancelled' })
        return response.data
      }
    } catch (error) {
      console.error('取消订单失败:', error)
      throw error
    }
  },

  // 开始配送
  async startDelivery({ commit }, orderId) {
    try {
      const response = await startDelivery(orderId)
      if (response.code === 200) {
        commit('UPDATE_ORDER_STATUS', { orderId, status: 'delivering' })
        return response.data
      }
    } catch (error) {
      console.error('开始配送失败:', error)
      throw error
    }
  },

  // 完成配送
  async completeDelivery({ commit }, { orderId, data }) {
    try {
      const response = await completeDelivery(orderId, data)
      if (response.code === 200) {
        commit('UPDATE_ORDER_STATUS', { orderId, status: 'completed' })
        return response.data
      }
    } catch (error) {
      console.error('完成配送失败:', error)
      throw error
    }
  },

  // 获取配送趋势数据
  async getTrendData({ commit }, params) {
    try {
      commit('SET_STATISTICS_LOADING', true)
      const response = await getDeliveryTrend(params)
      if (response.code === 200) {
        commit('SET_STATISTICS_DATA', { type: 'trend', data: response.data })
        return response.data
      }
    } catch (error) {
      console.error('获取配送趋势数据失败:', error)
      throw error
    } finally {
      commit('SET_STATISTICS_LOADING', false)
    }
  },

  // 获取订单类型分布数据
  async getOrderTypeData({ commit }, params) {
    try {
      const response = await getOrderTypeDistribution(params)
      if (response.code === 200) {
        commit('SET_STATISTICS_DATA', { type: 'orderTypeDistribution', data: response.data })
        return response.data
      }
    } catch (error) {
      console.error('获取订单类型分布数据失败:', error)
      throw error
    }
  },

  // 获取收入分析数据
  async getRevenueData({ commit }, params) {
    try {
      const response = await getRevenueAnalysis(params)
      if (response.code === 200) {
        commit('SET_STATISTICS_DATA', { type: 'revenueAnalysis', data: response.data })
        return response.data
      }
    } catch (error) {
      console.error('获取收入分析数据失败:', error)
      throw error
    }
  },

  // 获取时段配送分布数据
  async getTimeSlotData({ commit }, params) {
    try {
      const response = await getTimeSlotDistribution(params)
      if (response.code === 200) {
        commit('SET_STATISTICS_DATA', { type: 'timeSlotDistribution', data: response.data })
        return response.data
      }
    } catch (error) {
      console.error('获取时段配送分布数据失败:', error)
      throw error
    }
  },

  // 获取详细数据表格
  async getDetailedData({ commit }, params) {
    try {
      commit('SET_STATISTICS_LOADING', true)
      const response = await getDetailedData(params)
      if (response.code === 200) {
        commit('SET_STATISTICS_DATA', { type: 'detailedData', data: response.data })
        return response.data
      }
    } catch (error) {
      console.error('获取详细数据表格失败:', error)
      throw error
    } finally {
      commit('SET_STATISTICS_LOADING', false)
    }
  },
}

const getters = {
  // 获取骑手信息
  courierInfo: state => state.courierInfo,

  // 获取仪表板数据
  dashboardData: state => state.dashboard,

  // 获取订单列表
  ordersList: state => state.orders.list,

  // 获取订单总数
  ordersTotal: state => state.orders.total,

  // 获取当前页码
  currentPage: state => state.orders.currentPage,

  // 获取页大小
  pageSize: state => state.orders.pageSize,

  // 获取筛选条件
  orderFilters: state => state.orders.filters,

  // 获取统计数据
  statistics: state => state.statistics,

  // 获取统计加载状态
  statisticsLoading: state => state.statistics.loading,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
