import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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
import logger from '@/utils/logger'

// 校区信息接口
export interface Campus {
  id: number
  name: string
  address: string
  contactPerson: string
  contactPhone: string
  description: string
  status: number
  createTime: string
  updateTime: string
}

// 楼栋信息接口
export interface Building {
  id: number
  campusId: number
  campusName: string
  name: string
  description: string
  status: number
  createTime: string
  updateTime: string
}

// 外卖柜信息接口
export interface DeliveryLocker {
  id: number
  campusId: number
  campusName: string
  buildingId: number
  buildingName: string
  location: string
  capacity: number
  usedCount: number
  status: number
  createTime: string
  updateTime: string
}

// 校园站点信息接口
export interface CampusSite {
  id: number
  campusId: number
  campusName: string
  name: string
  address: string
  contactPerson: string
  contactPhone: string
  openingHours: string
  status: number
  createTime: string
  updateTime: string
}

// 外卖订单信息接口
export interface TakeoutOrder {
  id: number
  orderNo: string
  userId: number
  userName: string
  userPhone: string
  campusId: number
  campusName: string
  buildingId: number
  buildingName: string
  lockerId: number
  lockerName: string
  merchantId: number
  merchantName: string
  totalAmount: number
  paymentStatus: number
  deliveryStatus: number
  orderTime: string
  paymentTime: string
  deliveryTime: string
  status: number
}

// 跑腿请求信息接口
export interface DeliveryRequest {
  id: number
  requestNo: string
  userId: number
  userName: string
  userPhone: string
  campusId: number
  campusName: string
  pickupLocation: string
  dropoffLocation: string
  itemDescription: string
  amount: number
  status: number
  createTime: string
  updateTime: string
}

// 创建并导出campus store
export const useCampusStore = defineStore('campus', () => {
  // 校区相关状态
  const campusList = ref<Campus[]>([])
  const campusDetail = ref<Campus | null>(null)
  const campusTotal = ref(0)
  const campusLoading = ref(false)

  // 楼栋相关状态
  const buildingList = ref<Building[]>([])
  const buildingDetail = ref<Building | null>(null)
  const buildingTotal = ref(0)
  const buildingLoading = ref(false)

  // 外卖柜相关状态
  const lockerList = ref<DeliveryLocker[]>([])
  const lockerDetail = ref<DeliveryLocker | null>(null)
  const lockerTotal = ref(0)
  const lockerLoading = ref(false)

  // 校园站点相关状态
  const siteList = ref<CampusSite[]>([])
  const siteDetail = ref<CampusSite | null>(null)
  const siteTotal = ref(0)
  const siteLoading = ref(false)

  // 外卖订单相关状态
  const takeoutOrderList = ref<TakeoutOrder[]>([])
  const takeoutOrderDetail = ref<TakeoutOrder | null>(null)
  const takeoutOrderTotal = ref(0)
  const takeoutOrderLoading = ref(false)

  // 跑腿请求相关状态
  const deliveryRequestList = ref<DeliveryRequest[]>([])
  const deliveryRequestDetail = ref<DeliveryRequest | null>(null)
  const deliveryRequestTotal = ref(0)
  const deliveryRequestLoading = ref(false)

  // 校区相关操作方法
  async function getCampuses() {
    campusLoading.value = true
    try {
      const response = await getCampusList()
      campusList.value = response.data || []
      campusTotal.value = response.data ? response.data.length : 0
      return response
    } catch (error) {
      logger.error('获取校区列表失败:', error)
      throw error
    } finally {
      campusLoading.value = false
    }
  }

  async function getCampusDetail(id: number) {
    campusLoading.value = true
    try {
      const response = await getCampusById(id)
      campusDetail.value = response.data
      return response
    } catch (error) {
      logger.error('获取校区详情失败:', error)
      throw error
    } finally {
      campusLoading.value = false
    }
  }

  async function addNewCampus(data: Partial<Campus>) {
    try {
      const response = await addCampus(data)
      await getCampuses() // 添加成功后刷新列表
      return response
    } catch (error) {
      logger.error('添加校区失败:', error)
      throw error
    }
  }

  async function updateExistingCampus(data: Campus) {
    try {
      const response = await updateCampus(data)
      await getCampuses() // 更新成功后刷新列表
      return response
    } catch (error) {
      logger.error('更新校区失败:', error)
      throw error
    }
  }

  async function updateCampusEnabledStatus(id: number, status: number) {
    try {
      const response = await updateCampusStatus(id, status)
      await getCampuses() // 更新成功后刷新列表
      return response
    } catch (error) {
      logger.error('更新校区状态失败:', error)
      throw error
    }
  }

  // 楼栋相关操作方法
  async function getBuildings(params = {}) {
    buildingLoading.value = true
    try {
      const response = await getBuildingList(params)
      buildingList.value = response.data || []
      buildingTotal.value = response.total || 0
      return response
    } catch (error) {
      logger.error('获取楼栋列表失败:', error)
      throw error
    } finally {
      buildingLoading.value = false
    }
  }

  async function getBuildingDetail(id: number) {
    buildingLoading.value = true
    try {
      const response = await getBuildingById(id)
      buildingDetail.value = response.data
      return response
    } catch (error) {
      logger.error('获取楼栋详情失败:', error)
      throw error
    } finally {
      buildingLoading.value = false
    }
  }

  async function addNewBuilding(data: Partial<Building>) {
    try {
      const response = await addBuilding(data)
      await getBuildings() // 添加成功后刷新列表
      return response
    } catch (error) {
      logger.error('添加楼栋失败:', error)
      throw error
    }
  }

  async function updateExistingBuilding(data: Building) {
    try {
      const response = await updateBuilding(data)
      await getBuildings() // 更新成功后刷新列表
      return response
    } catch (error) {
      logger.error('更新楼栋失败:', error)
      throw error
    }
  }

  async function updateBuildingEnabledStatus(id: number, status: number) {
    try {
      const response = await updateBuildingStatus(id, status)
      await getBuildings() // 更新成功后刷新列表
      return response
    } catch (error) {
      logger.error('更新楼栋状态失败:', error)
      throw error
    }
  }

  // 外卖柜相关操作方法
  async function getLockers(params = {}) {
    lockerLoading.value = true
    try {
      const response = await getDeliveryLockerList(params)
      lockerList.value = response.data || []
      lockerTotal.value = response.total || 0
      return response
    } catch (error) {
      logger.error('获取外卖柜列表失败:', error)
      throw error
    } finally {
      lockerLoading.value = false
    }
  }

  async function getLockerDetail(id: number) {
    lockerLoading.value = true
    try {
      const response = await getDeliveryLockerById(id)
      lockerDetail.value = response.data
      return response
    } catch (error) {
      logger.error('获取外卖柜详情失败:', error)
      throw error
    } finally {
      lockerLoading.value = false
    }
  }

  async function addNewLocker(data: Partial<DeliveryLocker>) {
    try {
      const response = await addDeliveryLocker(data)
      await getLockers() // 添加成功后刷新列表
      return response
    } catch (error) {
      logger.error('添加外卖柜失败:', error)
      throw error
    }
  }

  async function updateExistingLocker(data: DeliveryLocker) {
    try {
      const response = await updateDeliveryLocker(data)
      await getLockers() // 更新成功后刷新列表
      return response
    } catch (error) {
      logger.error('更新外卖柜失败:', error)
      throw error
    }
  }

  async function updateLockerEnabledStatus(id: number, status: number) {
    try {
      const response = await updateLockerStatus(id, status)
      await getLockers() // 更新成功后刷新列表
      return response
    } catch (error) {
      logger.error('更新外卖柜状态失败:', error)
      throw error
    }
  }

  // 校园站点相关操作方法
  async function getSites(params = {}) {
    siteLoading.value = true
    try {
      const response = await getCampusSiteList(params)
      siteList.value = response.data || []
      siteTotal.value = response.total || 0
      return response
    } catch (error) {
      logger.error('获取校园站点列表失败:', error)
      throw error
    } finally {
      siteLoading.value = false
    }
  }

  async function getSiteDetail(id: number) {
    siteLoading.value = true
    try {
      const response = await getCampusSiteById(id)
      siteDetail.value = response.data
      return response
    } catch (error) {
      logger.error('获取校园站点详情失败:', error)
      throw error
    } finally {
      siteLoading.value = false
    }
  }

  async function addNewSite(data: Partial<CampusSite>) {
    try {
      const response = await addCampusSite(data)
      await getSites() // 添加成功后刷新列表
      return response
    } catch (error) {
      logger.error('添加校园站点失败:', error)
      throw error
    }
  }

  async function updateExistingSite(data: CampusSite) {
    try {
      const response = await updateCampusSite(data)
      await getSites() // 更新成功后刷新列表
      return response
    } catch (error) {
      logger.error('更新校园站点失败:', error)
      throw error
    }
  }

  // 外卖订单相关操作方法
  async function getTakeoutOrders(params = {}) {
    takeoutOrderLoading.value = true
    try {
      const response = await getTakeoutOrderList(params)
      takeoutOrderList.value = response.data || []
      takeoutOrderTotal.value = response.total || 0
      return response
    } catch (error) {
      logger.error('获取外卖订单列表失败:', error)
      throw error
    } finally {
      takeoutOrderLoading.value = false
    }
  }

  async function getTakeoutOrderDetailById(id: number) {
    takeoutOrderLoading.value = true
    try {
      const response = await getTakeoutOrderDetail(id)
      takeoutOrderDetail.value = response.data
      return response
    } catch (error) {
      logger.error('获取外卖订单详情失败:', error)
      throw error
    } finally {
      takeoutOrderLoading.value = false
    }
  }

  async function updateTakeoutOrderState(id: number, status: number) {
    try {
      const response = await updateTakeoutOrderStatus(id, status)
      await getTakeoutOrders() // 更新成功后刷新列表
      return response
    } catch (error) {
      logger.error('更新外卖订单状态失败:', error)
      throw error
    }
  }

  // 跑腿请求相关操作方法
  async function getDeliveryRequests(params = {}) {
    deliveryRequestLoading.value = true
    try {
      const response = await getDeliveryRequestList(params)
      deliveryRequestList.value = response.data || []
      deliveryRequestTotal.value = response.total || 0
      return response
    } catch (error) {
      logger.error('获取跑腿请求列表失败:', error)
      throw error
    } finally {
      deliveryRequestLoading.value = false
    }
  }

  async function getDeliveryRequestInfo(id: number) {
    deliveryRequestLoading.value = true
    try {
      const response = await getDeliveryRequestDetail(id)
      deliveryRequestDetail.value = response.data
      return response
    } catch (error) {
      logger.error('获取跑腿请求详情失败:', error)
      throw error
    } finally {
      deliveryRequestLoading.value = false
    }
  }

  async function updateDeliveryRequestState(id: number, status: number) {
    try {
      const response = await updateDeliveryRequestStatus(id, status)
      await getDeliveryRequests() // 更新成功后刷新列表
      return response
    } catch (error) {
      logger.error('更新跑腿请求状态失败:', error)
      throw error
    }
  }

  // 返回状态和方法
  return {
    // 校区相关状态和方法
    campusList,
    campusDetail,
    campusTotal,
    campusLoading,
    getCampuses,
    getCampusDetail,
    addNewCampus,
    updateExistingCampus,
    updateCampusEnabledStatus,

    // 楼栋相关状态和方法
    buildingList,
    buildingDetail,
    buildingTotal,
    buildingLoading,
    getBuildings,
    getBuildingDetail,
    addNewBuilding,
    updateExistingBuilding,
    updateBuildingEnabledStatus,

    // 外卖柜相关状态和方法
    lockerList,
    lockerDetail,
    lockerTotal,
    lockerLoading,
    getLockers,
    getLockerDetail,
    addNewLocker,
    updateExistingLocker,
    updateLockerEnabledStatus,

    // 校园站点相关状态和方法
    siteList,
    siteDetail,
    siteTotal,
    siteLoading,
    getSites,
    getSiteDetail,
    addNewSite,
    updateExistingSite,

    // 外卖订单相关状态和方法
    takeoutOrderList,
    takeoutOrderDetail,
    takeoutOrderTotal,
    takeoutOrderLoading,
    getTakeoutOrders,
    getTakeoutOrderDetailById,
    updateTakeoutOrderState,

    // 跑腿请求相关状态和方法
    deliveryRequestList,
    deliveryRequestDetail,
    deliveryRequestTotal,
    deliveryRequestLoading,
    getDeliveryRequests,
    getDeliveryRequestInfo,
    updateDeliveryRequestState,
  }
})
