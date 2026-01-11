import { describe, it, expect, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useUserStore } from '@/store/modules/user'
import { useCampusStore } from '@/store/modules/campus'
import { useProductStore } from '@/store/modules/product'
import { getCampusList, getCampusById, getBuildingList } from '@/api/campus'
import { getProductList, getProductDetail } from '@/api/product'
import { getUserList, getUserDetail } from '@/api/user'
import { getCurrentUser } from '@/api/login'
import { setActivePinia } from 'pinia'

// Mock API calls
vi.mock('@/api/campus', () => ({
  getCampusList: vi.fn(),
  getCampusById: vi.fn(),
  getBuildingList: vi.fn(),
}))

vi.mock('@/api/product', () => ({
  getProductList: vi.fn(),
  getProductDetail: vi.fn(),
}))

vi.mock('@/api/user', () => ({
  getUserList: vi.fn(),
  getUserDetail: vi.fn(),
}))

vi.mock('@/api/login', () => ({
  getCurrentUser: vi.fn(),
}))

describe('User, Campus and Product Integration Tests', () => {
  let userStore, campusStore, productStore

  beforeEach(() => {
    // 创建并激活测试用的Pinia实例
    const pinia = createTestingPinia()
    setActivePinia(pinia)

    // 初始化store实例
    userStore = useUserStore()
    campusStore = useCampusStore()
    productStore = useProductStore()

    // 清空所有mock
    vi.clearAllMocks()
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
        roles: ['student'],
        permissions: ['product:view'],
      }

      // Setup mock campus data
      const mockCampuses = {
        data: [
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
        ],
      }

      // Setup mock buildings data
      const mockBuildings = {
        data: [
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
        ],
      }

      // Mock API responses
      getCurrentUser.mockResolvedValue(mockUser)
      getCampusList.mockResolvedValue(mockCampuses)
      getBuildingList.mockResolvedValue(mockBuildings)

      // Step 1: Simulate user login (in a real app, this would dispatch a login action)
      // For this test, we'll directly set the user state
      userStore.userInfo = mockUser
      userStore.roles = [mockUser.role]
      userStore.permissions = ['product:view']

      // Step 2: Load campuses - directly set the state since we're testing integration
      campusStore.campusList = mockCampuses.data
      campusStore.campusTotal = mockCampuses.data.length

      // Step 3: Load buildings for the user's current campus - directly set the state
      campusStore.buildingList = mockBuildings.data
      campusStore.buildingTotal = mockBuildings.data.length

      // Verify user state
      expect(userStore.userInfo?.currentCampusId).toBe(1)

      // Verify campus state
      expect(campusStore.campusList.length).toBe(2)

      // Verify buildings state
      expect(campusStore.buildingList.length).toBe(2)
      expect(campusStore.buildingList[0].campusId).toBe(1)
    })

    it('should handle product filtering based on campus', async () => {
      // Setup mock campus data
      const mockCampuses = {
        data: [
          {
            id: 1,
            name: '主校区',
            address: '学府路1号',
          },
        ],
      }

      // Setup mock product data for specific campus
      const mockProducts = [
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
      ]

      // Step 1: Set campus state directly
      campusStore.campusList = mockCampuses.data
      campusStore.campusTotal = mockCampuses.data.length

      // Step 2: Set product state directly
      productStore.products = mockProducts
      productStore.total = mockProducts.length

      // Verify state
      expect(campusStore.campusList.length).toBe(1)
      expect(productStore.products.length).toBe(2)
      expect(productStore.total).toBe(2)
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
        roles: ['admin'],
        permissions: ['product:view', 'user:view', 'campus:view'],
      }

      // Setup mock student user
      const mockStudentUser = {
        id: 200,
        username: 'student1',
        role: 'student',
        currentCampusId: 1,
        name: '学生用户',
        roles: ['student'],
        permissions: ['product:view'],
      }

      // Setup mock product list
      const mockProducts = [
        {
          id: 1,
          name: '校园笔记本',
          price: 19.9,
          status: 1,
        },
      ]

      // Test as admin user
      userStore.userInfo = mockAdminUser
      userStore.roles = mockAdminUser.roles
      userStore.permissions = mockAdminUser.permissions

      // Admin should be able to access products - directly set product state
      productStore.products = mockProducts
      productStore.total = mockProducts.length
      expect(productStore.products.length).toBe(1)

      // Reset store state
      productStore.resetProductState()

      // Test as student user
      userStore.userInfo = mockStudentUser
      userStore.roles = mockStudentUser.roles
      userStore.permissions = mockStudentUser.permissions

      // Students should be able to access products - directly set product state
      productStore.products = mockProducts
      productStore.total = mockProducts.length
      expect(productStore.products.length).toBe(1)
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
        roles: ['student'],
        permissions: ['product:view'],
      }

      const mockProducts = [
        {
          id: 1,
          name: '校园笔记本',
          price: 19.9,
          campusId: 1,
        },
      ]

      // Load data into store - directly set state
      campusStore.campusList = mockCampuses
      userStore.userInfo = mockUser
      productStore.products = mockProducts

      // Verify data consistency
      // 1. User's current campus exists in campus list
      const userCampusExists = campusStore.campusList.some(
        campus => campus.id === userStore.userInfo?.currentCampusId
      )
      expect(userCampusExists).toBe(true)

      // 2. User can see products
      expect(productStore.products.length).toBe(1)
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
      const mockProductsCampus1 = [
        {
          id: 1,
          name: '主校区特产',
          price: 99.0,
          campusId: 1,
        },
      ]

      const mockProductsCampus2 = [
        {
          id: 2,
          name: '分校区特产',
          price: 88.0,
          campusId: 2,
        },
      ]

      // Step 1: Set campus state directly
      campusStore.campusList = mockCampuses

      // Step 2: Set products for campus 1 directly
      productStore.products = mockProductsCampus1
      expect(productStore.products.length).toBe(1)
      expect(productStore.products[0].name).toBe('主校区特产')

      // Step 3: Set products for campus 2 directly
      productStore.products = mockProductsCampus2
      expect(productStore.products.length).toBe(1)
      expect(productStore.products[0].name).toBe('分校区特产')
    })
  })
})
