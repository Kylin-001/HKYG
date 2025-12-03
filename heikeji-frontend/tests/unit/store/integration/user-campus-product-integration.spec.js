import { createStore } from 'vuex'
import userModule from '@/store/modules/user'
import campusModule from '@/store/modules/campus'
import productModule from '@/store/modules/product'
import { getCampuses, getCampusBuildings, getCampusSites } from '@/api/campus'
import { getProductList, getProductDetail } from '@/api/product'
import { getUserList, getUserDetail } from '@/api/user'
import { getCurrentUser } from '@/api/login'

// Mock API calls
jest.mock('@/api/campus', () => ({
  getCampuses: jest.fn(),
  getCampusBuildings: jest.fn(),
  getCampusSites: jest.fn(),
}))

jest.mock('@/api/product', () => ({
  getProductList: jest.fn(),
  getProductDetail: jest.fn(),
}))

jest.mock('@/api/user', () => ({
  getUserList: jest.fn(),
  getUserDetail: jest.fn(),
}))

jest.mock('@/api/login', () => ({
  getCurrentUser: jest.fn(),
}))

describe('User, Campus and Product Integration Tests', () => {
  let store

  beforeEach(() => {
    // Create a new store with all relevant modules
    store = createStore({
      modules: {
        user: userModule,
        campus: campusModule,
        product: productModule,
      },
    })

    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  describe('User Authentication and Campus Selection Flow', () => {
    it('should handle user login and campus selection correctly', async () => {
      // Setup mock user data
      const mockUser = {
        id: 1,
        username: 'student1',
        role: 'student',
        currentCampusId: 1,
        name: '张三',
      }

      // Setup mock campus data
      const mockCampuses = [
        {
          id: 1,
          name: '主校区',
          address: '学府路1号',
        },
        {
          id: 2,
          name: '分校区',
          address: '科技路88号',
        },
      ]

      // Setup mock buildings data
      const mockBuildings = [
        {
          id: 1,
          name: '教学楼A',
          campusId: 1,
        },
        {
          id: 2,
          name: '宿舍楼B',
          campusId: 1,
        },
      ]

      // Setup mock campus sites data
      const mockCampusSites = [
        {
          id: 1,
          name: '教学区站点',
          campusId: 1,
        },
        {
          id: 2,
          name: '宿舍区站点',
          campusId: 1,
        },
      ]

      // Mock API responses
      getCurrentUser.mockResolvedValue(mockUser)
      getCampuses.mockResolvedValue(mockCampuses)
      getCampusBuildings.mockResolvedValue(mockBuildings)
      getCampusSites.mockResolvedValue(mockCampusSites)

      // Step 1: Simulate user login (in a real app, this would dispatch a login action)
      // For this test, we'll directly set the user state
      store.commit('SET_USER_INFO', mockUser)

      // Step 2: Load campuses
      await store.dispatch('getCampuses')

      // Step 3: Load buildings for the user's current campus
      await store.dispatch('getCampusBuildings', { campusId: mockUser.currentCampusId })

      // Step 4: Load campus sites for the user's current campus
      await store.dispatch('getCampusSites', { campusId: mockUser.currentCampusId })

      // Verify user state
      expect(store.state.user.currentCampusId).toBe(1)

      // Verify campus state
      expect(store.state.campus.list.length).toBe(2)
      expect(store.state.campus.currentId).toBe(1)

      // Verify buildings state
      expect(store.state.campus.buildings.length).toBe(2)
      expect(store.state.campus.buildings[0].campusId).toBe(1)

      // Verify campus sites state
      expect(store.state.campus.campusSites.length).toBe(2)
      expect(store.state.campus.campusSites[0].campusId).toBe(1)

      // Verify API calls were made correctly
      expect(getCampuses).toHaveBeenCalledTimes(1)
      expect(getCampusBuildings).toHaveBeenCalledWith({ campusId: 1 })
      expect(getCampusSites).toHaveBeenCalledWith({ campusId: 1 })
    })

    it('should handle product filtering based on campus', async () => {
      // Setup mock campus data
      const mockCampuses = [
        {
          id: 1,
          name: '主校区',
          address: '学府路1号',
        },
      ]

      // Setup mock product data for specific campus
      const mockProducts = {
        list: [
          {
            id: 1,
            name: '校园笔记本',
            price: 19.9,
            campusId: 1,
            merchantId: 1,
          },
          {
            id: 2,
            name: '学生文具套装',
            price: 29.9,
            campusId: 1,
            merchantId: 1,
          },
        ],
        total: 2,
      }

      // Mock API responses
      getCampuses.mockResolvedValue(mockCampuses)
      getProductList.mockResolvedValue(mockProducts)

      // Step 1: Load campuses and select one
      await store.dispatch('getCampuses')
      store.commit('SET_CURRENT_CAMPUS', 1)

      // Step 2: Get products filtered by campus
      await store.dispatch('getProductList', { campusId: 1 })

      // Verify state
      expect(store.state.campus.currentId).toBe(1)
      expect(store.state.product.list.length).toBe(2)
      expect(store.state.product.total).toBe(2)

      // Verify all products belong to the selected campus
      const allCampus1Products = store.state.product.list.every(product => product.campusId === 1)
      expect(allCampus1Products).toBe(true)

      // Verify API calls
      expect(getProductList).toHaveBeenCalledWith({ campusId: 1 })
    })
  })

  describe('User Role and Access Control Integration', () => {
    it('should handle different user roles with appropriate access', async () => {
      // Setup mock admin user
      const mockAdminUser = {
        id: 100,
        username: 'admin',
        role: 'admin',
        name: '管理员',
      }

      // Setup mock student user
      const mockStudentUser = {
        id: 200,
        username: 'student1',
        role: 'student',
        currentCampusId: 1,
        name: '学生用户',
      }

      // Setup mock user list (admin only)
      const mockUserList = {
        list: [mockAdminUser, mockStudentUser],
        total: 2,
      }

      // Setup mock product list
      const mockProductList = {
        list: [
          {
            id: 1,
            name: '校园笔记本',
            price: 19.9,
            status: 1,
          },
        ],
        total: 1,
      }

      // Mock API responses
      getUserList.mockResolvedValue(mockUserList)
      getProductList.mockResolvedValue(mockProductList)

      // Test as admin user
      store.commit('SET_USER_INFO', mockAdminUser)

      // Admin should be able to access user management
      await store.dispatch('getUserList', {})
      expect(store.state.user.list.length).toBe(2)

      // Admin should be able to access products
      await store.dispatch('getProductList', {})
      expect(store.state.product.list.length).toBe(1)

      // Reset store
      store = createStore({
        modules: {
          user: userModule,
          campus: campusModule,
          product: productModule,
        },
      })

      // Test as student user
      store.commit('SET_USER_INFO', mockStudentUser)

      // In a real app, students might not have access to user management
      // But for this test, we'll just verify they can access products
      await store.dispatch('getProductList', { campusId: 1 })
      expect(store.state.product.list.length).toBe(1)
    })
  })

  describe('Cross-module Data Consistency', () => {
    it('should maintain data consistency across user, campus and product modules', async () => {
      // Setup mock data
      const mockCampuses = [
        {
          id: 1,
          name: '主校区',
          address: '学府路1号',
        },
      ]

      const mockUser = {
        id: 1,
        username: 'student1',
        role: 'student',
        currentCampusId: 1,
        name: '张三',
      }

      const mockProducts = {
        list: [
          {
            id: 1,
            name: '校园笔记本',
            price: 19.9,
            campusId: 1,
          },
        ],
        total: 1,
      }

      // Mock API responses
      getCampuses.mockResolvedValue(mockCampuses)
      getProductList.mockResolvedValue(mockProducts)

      // Load data into store
      await store.dispatch('getCampuses')
      store.commit('SET_USER_INFO', mockUser)
      await store.dispatch('getProductList', { campusId: 1 })

      // Verify data consistency
      // 1. User's current campus exists in campus list
      const userCampusExists = store.state.campus.list.some(
        campus => campus.id === mockUser.currentCampusId
      )
      expect(userCampusExists).toBe(true)

      // 2. All products belong to valid campuses
      const allProductsHaveValidCampus = store.state.product.list.every(product =>
        store.state.campus.list.some(campus => campus.id === product.campusId)
      )
      expect(allProductsHaveValidCampus).toBe(true)

      // 3. User can see products from their current campus
      const userCanSeeTheirCampusProducts = store.state.product.list.some(
        product => product.campusId === mockUser.currentCampusId
      )
      expect(userCanSeeTheirCampusProducts).toBe(true)
    })

    it('should handle campus change correctly across modules', async () => {
      // Setup mock data for multiple campuses
      const mockCampuses = [
        {
          id: 1,
          name: '主校区',
          address: '学府路1号',
        },
        {
          id: 2,
          name: '分校区',
          address: '科技路88号',
        },
      ]

      // Setup mock products for different campuses
      const mockProductsCampus1 = {
        list: [
          {
            id: 1,
            name: '主校区特产',
            price: 99.0,
            campusId: 1,
          },
        ],
        total: 1,
      }

      const mockProductsCampus2 = {
        list: [
          {
            id: 2,
            name: '分校区特产',
            price: 88.0,
            campusId: 2,
          },
        ],
        total: 1,
      }

      // Mock API responses
      getCampuses.mockResolvedValue(mockCampuses)
      getProductList
        .mockResolvedValueOnce(mockProductsCampus1)
        .mockResolvedValueOnce(mockProductsCampus2)

      // Step 1: Load campuses and select campus 1
      await store.dispatch('getCampuses')
      store.commit('SET_CURRENT_CAMPUS', 1)

      // Step 2: Get products for campus 1
      await store.dispatch('getProductList', { campusId: 1 })
      expect(store.state.product.list[0].campusId).toBe(1)
      expect(store.state.product.list[0].name).toBe('主校区特产')

      // Step 3: Change to campus 2
      store.commit('SET_CURRENT_CAMPUS', 2)

      // Step 4: Get products for campus 2
      await store.dispatch('getProductList', { campusId: 2 })
      expect(store.state.product.list[0].campusId).toBe(2)
      expect(store.state.product.list[0].name).toBe('分校区特产')

      // Verify campus change is reflected across the system
      expect(store.state.campus.currentId).toBe(2)
    })
  })
})
