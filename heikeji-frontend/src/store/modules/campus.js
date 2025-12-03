// 导入日志工具
import logger from '@/utils/logger'

import {
  getCampusList,
  getCampusById,
  addCampus,
  updateCampus,
  updateCampusStatus,
  getBuildingList,
  getBuildingById,
  addBuilding,
  updateBuilding,
  updateBuildingStatus,
  getDeliveryLockerList,
  getDeliveryLockerById,
  addDeliveryLocker,
  updateDeliveryLocker,
  updateLockerStatus,
  getCampusSiteList,
  getCampusSiteById,
  addCampusSite,
  updateCampusSite,
  getTakeoutOrderList,
  getTakeoutOrderDetail,
  updateTakeoutOrderStatus,
  getDeliveryRequestList,
  getDeliveryRequestDetail,
  updateDeliveryRequestStatus,
} from '@/api/campus'

const state = {
  // 校区数据
  campusList: [],
  campusDetail: null,
  campusTotal: 0,

  // 楼栋数据
  buildingList: [],
  buildingDetail: null,
  buildingTotal: 0,

  // 外卖柜数据
  lockerList: [],
  lockerDetail: null,
  lockerTotal: 0,

  // 校园站点数据
  siteList: [],
  siteDetail: null,
  siteTotal: 0,

  // 外卖订单数据
  takeoutOrderList: [],
  takeoutOrderDetail: null,
  takeoutOrderTotal: 0,

  // 跑腿请求数据
  deliveryRequestList: [],
  deliveryRequestDetail: null,
  deliveryRequestTotal: 0,
}

const mutations = {
  // 校区相关mutations
  SET_CAMPUS_LIST: (state, { list, total }) => {
    state.campusList = list
    state.campusTotal = total
  },
  SET_CAMPUS_DETAIL: (state, campus) => {
    state.campusDetail = campus
  },

  // 楼栋相关mutations
  SET_BUILDING_LIST: (state, { list, total }) => {
    state.buildingList = list
    state.buildingTotal = total
  },
  SET_BUILDING_DETAIL: (state, building) => {
    state.buildingDetail = building
  },

  // 外卖柜相关mutations
  SET_LOCKER_LIST: (state, { list, total }) => {
    state.lockerList = list
    state.lockerTotal = total
  },
  SET_LOCKER_DETAIL: (state, locker) => {
    state.lockerDetail = locker
  },

  // 校园站点相关mutations
  SET_SITE_LIST: (state, { list, total }) => {
    state.siteList = list
    state.siteTotal = total
  },
  SET_SITE_DETAIL: (state, site) => {
    state.siteDetail = site
  },

  // 外卖订单相关mutations
  SET_TAKEOUT_ORDER_LIST: (state, { list, total }) => {
    state.takeoutOrderList = list
    state.takeoutOrderTotal = total
  },
  SET_TAKEOUT_ORDER_DETAIL: (state, order) => {
    state.takeoutOrderDetail = order
  },

  // 跑腿请求相关mutations
  SET_DELIVERY_REQUEST_LIST: (state, { list, total }) => {
    state.deliveryRequestList = list
    state.deliveryRequestTotal = total
  },
  SET_DELIVERY_REQUEST_DETAIL: (state, request) => {
    state.deliveryRequestDetail = request
  },
}

const actions = {
  // 校区相关actions
  async getCampuses({ commit }) {
    try {
      const response = await getCampusList()
      commit('SET_CAMPUS_LIST', {
        list: response.data || [],
        total: response.data ? response.data.length : 0,
      })
      return response
    } catch (error) {
      logger.error('获取校区列表失败:', error)
      throw error
    }
  },

  async getCampusDetail({ commit }, id) {
    try {
      const response = await getCampusById(id)
      commit('SET_CAMPUS_DETAIL', response.data)
      return response
    } catch (error) {
      logger.error('获取校区详情失败:', error)
      throw error
    }
  },

  async addNewCampus({ dispatch }, data) {
    try {
      const response = await addCampus(data)
      // 添加成功后刷新列表
      dispatch('getCampuses')
      return response
    } catch (error) {
      logger.error('添加校区失败:', error)
      throw error
    }
  },

  async updateExistingCampus({ dispatch }, data) {
    try {
      const response = await updateCampus(data)
      // 更新成功后刷新列表
      dispatch('getCampuses')
      return response
    } catch (error) {
      logger.error('更新校区失败:', error)
      throw error
    }
  },

  async updateCampusEnabledStatus({ dispatch }, { id, status }) {
    try {
      const response = await updateCampusStatus(id, status)
      // 更新成功后刷新列表
      dispatch('getCampuses')
      return response
    } catch (error) {
      logger.error('更新校区状态失败:', error)
      throw error
    }
  },

  // 楼栋相关actions
  async getBuildings({ commit }, params = {}) {
    try {
      const response = await getBuildingList(params)
      commit('SET_BUILDING_LIST', { list: response.data || [], total: response.total || 0 })
      return response
    } catch (error) {
      logger.error('获取楼栋列表失败:', error)
      throw error
    }
  },

  async getBuildingDetail({ commit }, id) {
    try {
      const response = await getBuildingById(id)
      commit('SET_BUILDING_DETAIL', response.data)
      return response
    } catch (error) {
      logger.error('获取楼栋详情失败:', error)
      throw error
    }
  },

  async addNewBuilding({ dispatch }, data) {
    try {
      const response = await addBuilding(data)
      // 添加成功后刷新列表
      dispatch('getBuildings')
      return response
    } catch (error) {
      logger.error('添加楼栋失败:', error)
      throw error
    }
  },

  async updateExistingBuilding({ dispatch }, data) {
    try {
      const response = await updateBuilding(data)
      // 更新成功后刷新列表
      dispatch('getBuildings')
      return response
    } catch (error) {
      logger.error('更新楼栋失败:', error)
      throw error
    }
  },

  async updateBuildingEnabledStatus({ dispatch }, { id, status }) {
    try {
      const response = await updateBuildingStatus(id, status)
      // 更新成功后刷新列表
      dispatch('getBuildings')
      return response
    } catch (error) {
      logger.error('更新楼栋状态失败:', error)
      throw error
    }
  },

  // 外卖柜相关actions
  async getLockers({ commit }, params = {}) {
    try {
      const response = await getDeliveryLockerList(params)
      commit('SET_LOCKER_LIST', { list: response.data || [], total: response.total || 0 })
      return response
    } catch (error) {
      logger.error('获取外卖柜列表失败:', error)
      throw error
    }
  },

  async getLockerDetail({ commit }, id) {
    try {
      const response = await getDeliveryLockerById(id)
      commit('SET_LOCKER_DETAIL', response.data)
      return response
    } catch (error) {
      logger.error('获取外卖柜详情失败:', error)
      throw error
    }
  },

  async addNewLocker({ dispatch }, data) {
    try {
      const response = await addDeliveryLocker(data)
      // 添加成功后刷新列表
      dispatch('getLockers')
      return response
    } catch (error) {
      logger.error('添加外卖柜失败:', error)
      throw error
    }
  },

  async updateExistingLocker({ dispatch }, data) {
    try {
      const response = await updateDeliveryLocker(data)
      // 更新成功后刷新列表
      dispatch('getLockers')
      return response
    } catch (error) {
      logger.error('更新外卖柜失败:', error)
      throw error
    }
  },

  async updateLockerEnabledStatus({ dispatch }, { id, status }) {
    try {
      const response = await updateLockerStatus(id, status)
      // 更新成功后刷新列表
      dispatch('getLockers')
      return response
    } catch (error) {
      logger.error('更新外卖柜状态失败:', error)
      throw error
    }
  },

  // 校园站点相关actions
  async getSites({ commit }, params = {}) {
    try {
      const response = await getCampusSiteList(params)
      commit('SET_SITE_LIST', { list: response.data || [], total: response.total || 0 })
      return response
    } catch (error) {
      logger.error('获取校园站点列表失败:', error)
      throw error
    }
  },

  // 外卖订单相关actions
  async getTakeoutOrders({ commit }, params = {}) {
    try {
      const response = await getTakeoutOrderList(params)
      commit('SET_TAKEOUT_ORDER_LIST', { list: response.data || [], total: response.total || 0 })
      return response
    } catch (error) {
      logger.error('获取外卖订单列表失败:', error)
      throw error
    }
  },

  async getTakeoutOrderInfo({ commit }, id) {
    try {
      const response = await getTakeoutOrderDetail(id)
      commit('SET_TAKEOUT_ORDER_DETAIL', response.data)
      return response
    } catch (error) {
      logger.error('获取外卖订单详情失败:', error)
      throw error
    }
  },

  async updateTakeoutOrderState({ dispatch }, { id, status }) {
    try {
      const response = await updateTakeoutOrderStatus(id, status)
      // 更新成功后刷新列表
      dispatch('getTakeoutOrders')
      return response
    } catch (error) {
      logger.error('更新外卖订单状态失败:', error)
      throw error
    }
  },

  // 跑腿请求相关actions
  async getDeliveryRequests({ commit }, params = {}) {
    try {
      const response = await getDeliveryRequestList(params)
      commit('SET_DELIVERY_REQUEST_LIST', { list: response.data || [], total: response.total || 0 })
      return response
    } catch (error) {
      logger.error('获取跑腿请求列表失败:', error)
      throw error
    }
  },

  async getDeliveryRequestInfo({ commit }, id) {
    try {
      const response = await getDeliveryRequestDetail(id)
      commit('SET_DELIVERY_REQUEST_DETAIL', response.data)
      return response
    } catch (error) {
      logger.error('获取跑腿请求详情失败:', error)
      throw error
    }
  },

  async updateDeliveryRequestState({ dispatch }, { id, status }) {
    try {
      const response = await updateDeliveryRequestStatus(id, status)
      // 更新成功后刷新列表
      dispatch('getDeliveryRequests')
      return response
    } catch (error) {
      logger.error('更新跑腿请求状态失败:', error)
      throw error
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
