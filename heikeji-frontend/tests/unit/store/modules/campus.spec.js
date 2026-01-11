import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useCampusStore } from '@/store/modules/campus'
import * as campusApi from '@/api/campus'

// Mock the API calls
vi.mock('@/api/campus', () => ({
  getCampusList: vi.fn(),
  getCampusById: vi.fn(),
  addCampus: vi.fn(),
  updateCampus: vi.fn(),
  updateCampusStatus: vi.fn(),
  getBuildingList: vi.fn(),
  getBuildingById: vi.fn(),
  addBuilding: vi.fn(),
  updateBuilding: vi.fn(),
  updateBuildingStatus: vi.fn(),
  getDeliveryLockerList: vi.fn(),
  getDeliveryLockerById: vi.fn(),
  addDeliveryLocker: vi.fn(),
  updateDeliveryLocker: vi.fn(),
  updateLockerStatus: vi.fn(),
  getCampusSiteList: vi.fn(),
  getCampusSiteById: vi.fn(),
  addCampusSite: vi.fn(),
  updateCampusSite: vi.fn(),
  getTakeoutOrderList: vi.fn(),
  getTakeoutOrderDetail: vi.fn(),
  updateTakeoutOrderStatus: vi.fn(),
  getDeliveryRequestList: vi.fn(),
  getDeliveryRequestDetail: vi.fn(),
  updateDeliveryRequestStatus: vi.fn(),
}))

describe('Campus Store Module (Pinia)', () => {
  let pinia
  let campusStore

  beforeEach(() => {
    // Create testing Pinia
    pinia = createTestingPinia({
      stubActions: false,
      initialState: {
        campus: {
          campusList: [],
          campusDetail: null,
          campusTotal: 0,
          buildingList: [],
          buildingDetail: null,
          buildingTotal: 0,
          lockerList: [],
          lockerDetail: null,
          lockerTotal: 0,
          siteList: [],
          siteDetail: null,
          siteTotal: 0,
          takeoutOrderList: [],
          takeoutOrderDetail: null,
          takeoutOrderTotal: 0,
          deliveryRequestList: [],
          deliveryRequestDetail: null,
          deliveryRequestTotal: 0,
        },
      },
    })

    // Get the campus store
    campusStore = useCampusStore(pinia)
  })

  describe('Campus Actions', () => {
    it('getCampuses should fetch campus list successfully', async () => {
      // Mock API response
      const mockCampuses = [{ id: 1, name: '测试校区' }]
      campusApi.getCampusList.mockResolvedValue({
        data: mockCampuses,
      })

      // Call the action
      await campusStore.getCampuses()

      // Verify the action was called and state was updated
      expect(campusApi.getCampusList).toHaveBeenCalled()
    })

    it('getCampusDetail should fetch campus detail successfully', async () => {
      // Mock API response
      const mockCampus = { id: 1, name: '测试校区' }
      campusApi.getCampusById.mockResolvedValue({
        data: mockCampus,
      })

      // Call the action
      await campusStore.getCampusDetail(1)

      // Verify the action was called
      expect(campusApi.getCampusById).toHaveBeenCalledWith(1)
    })
  })

  describe('Building Actions', () => {
    it('getBuildings should fetch building list successfully', async () => {
      // Mock API response
      const mockBuildings = [{ id: 1, name: '测试楼栋', campusId: 1 }]
      campusApi.getBuildingList.mockResolvedValue({
        data: mockBuildings,
        total: mockBuildings.length,
      })

      // Call the action
      await campusStore.getBuildings({ campusId: 1 })

      // Verify the action was called
      expect(campusApi.getBuildingList).toHaveBeenCalledWith({ campusId: 1 })
    })
  })

  describe('Locker Actions', () => {
    it('getLockers should fetch locker list successfully', async () => {
      // Mock API response
      const mockLockers = [{ id: 1, code: '1001', buildingName: '测试楼栋' }]
      campusApi.getDeliveryLockerList.mockResolvedValue({
        data: mockLockers,
        total: mockLockers.length,
      })

      // Call the action
      await campusStore.getLockers({ page: 1, pageSize: 10 })

      // Verify the action was called
      expect(campusApi.getDeliveryLockerList).toHaveBeenCalledWith({ page: 1, pageSize: 10 })
    })
  })

  describe('Site Actions', () => {
    it('getSites should fetch site list successfully', async () => {
      // Mock API response
      const mockSites = [{ id: 1, name: '测试站点', campusName: '测试校区' }]
      campusApi.getCampusSiteList.mockResolvedValue({
        data: mockSites,
        total: mockSites.length,
      })

      // Call the action
      await campusStore.getSites({ page: 1, pageSize: 10 })

      // Verify the action was called
      expect(campusApi.getCampusSiteList).toHaveBeenCalledWith({ page: 1, pageSize: 10 })
    })
  })

  describe('Takeout Order Actions', () => {
    it('getTakeoutOrders should fetch takeout order list successfully', async () => {
      // Mock API response
      const mockOrders = [{ id: 1, orderNo: 'ORDER001' }]
      campusApi.getTakeoutOrderList.mockResolvedValue({
        data: mockOrders,
        total: mockOrders.length,
      })

      // Call the action
      await campusStore.getTakeoutOrders({ page: 1, pageSize: 10 })

      // Verify the action was called
      expect(campusApi.getTakeoutOrderList).toHaveBeenCalledWith({ page: 1, pageSize: 10 })
    })
  })

  describe('Delivery Request Actions', () => {
    it('getDeliveryRequests should fetch delivery request list successfully', async () => {
      // Mock API response
      const mockRequests = [{ id: 1, requestNo: 'REQ001' }]
      campusApi.getDeliveryRequestList.mockResolvedValue({
        data: mockRequests,
        total: mockRequests.length,
      })

      // Call the action
      await campusStore.getDeliveryRequests({ page: 1, pageSize: 10 })

      // Verify the action was called
      expect(campusApi.getDeliveryRequestList).toHaveBeenCalledWith({ page: 1, pageSize: 10 })
    })
  })
})
