import {
  getDashboardData,
  getSystemHealth,
  getSalesTrend,
  getOrderCategory,
  getLatestOrders,
  getHotProducts,
} from '@/api/dashboard'

// 导入日志工具
import logger from '@/utils/logger'

const state = {
  dashboardData: {},
  systemHealth: {},
  salesTrend: [],
  orderCategory: [],
  latestOrders: [],
  hotProducts: [],
  loading: false,
}

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_DASHBOARD_DATA(state, data) {
    state.dashboardData = data
  },
  SET_SYSTEM_HEALTH(state, health) {
    state.systemHealth = health
  },
  SET_SALES_TREND(state, data) {
    state.salesTrend = data
  },
  SET_ORDER_CATEGORY(state, data) {
    state.orderCategory = data
  },
  SET_LATEST_ORDERS(state, data) {
    state.latestOrders = data
  },
  SET_HOT_PRODUCTS(state, data) {
    state.hotProducts = data
  },
}

const actions = {
  // 获取仪表盘统计数据
  async getDashboardData({ commit }) {
    try {
      commit('SET_LOADING', true)
      const response = await getDashboardData()
      commit('SET_DASHBOARD_DATA', response.data)
      return response.data
    } catch (error) {
      logger.error('获取仪表盘数据失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 获取系统健康检查
  async getSystemHealth({ commit }) {
    try {
      const response = await getSystemHealth()
      commit('SET_SYSTEM_HEALTH', response.data)
      return response.data
    } catch (error) {
      logger.error('获取系统健康信息失败:', error)
      throw error
    }
  },

  // 获取销售趋势数据
  async getSalesTrend({ commit }, params) {
    try {
      const response = await getSalesTrend(params)
      commit('SET_SALES_TREND', response.data)
      return response.data
    } catch (error) {
      logger.error('获取销售趋势数据失败:', error)
      throw error
    }
  },

  // 获取订单分类统计
  async getOrderCategory({ commit }) {
    try {
      const response = await getOrderCategory()
      commit('SET_ORDER_CATEGORY', response.data)
      return response.data
    } catch (error) {
      logger.error('获取订单分类统计失败:', error)
      throw error
    }
  },

  // 获取最新订单
  async getLatestOrders({ commit }, params) {
    try {
      const response = await getLatestOrders(params)
      commit('SET_LATEST_ORDERS', response.data.records || response.data)
      return response.data
    } catch (error) {
      logger.error('获取最新订单失败:', error)
      throw error
    }
  },

  // 获取热门商品
  async getHotProducts({ commit }, params) {
    try {
      const response = await getHotProducts(params)
      commit('SET_HOT_PRODUCTS', response.data.records || response.data)
      return response.data
    } catch (error) {
      logger.error('获取热门商品失败:', error)
      throw error
    }
  },
}

const getters = {
  dashboardData: state => state.dashboardData,
  systemHealth: state => state.systemHealth,
  salesTrend: state => state.salesTrend,
  orderCategory: state => state.orderCategory,
  latestOrders: state => state.latestOrders,
  hotProducts: state => state.hotProducts,
  loading: state => state.loading,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
