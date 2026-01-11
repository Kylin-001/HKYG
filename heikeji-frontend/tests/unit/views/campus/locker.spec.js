import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ElementPlus from 'element-plus'
import { useCampusStore } from '@/store/modules/campus'
import Locker from '@/views/campus/locker.vue'

describe('Locker Management Component', () => {
  let wrapper
  let pinia

  beforeEach(() => {
    // Create testing Pinia
    pinia = createTestingPinia({
      stubActions: true,
      initialState: {
        campus: {
          lockerList: [],
          lockerTotal: 0,
          campusList: [{ id: 1, name: '测试校区' }],
          buildingList: [{ id: 1, name: '测试楼栋', campusId: 1 }],
        },
      },
    })

    // Mock Element Plus message
    ElementPlus.ElMessage = {
      success: vi.fn(),
      error: vi.fn(),
    }

    // Mock console.log
    console.log = vi.fn()

    wrapper = shallowMount(Locker, {
      global: {
        plugins: [pinia, ElementPlus],
        stubs: [
          'el-table',
          'el-table-column',
          'el-pagination',
          'el-dialog',
          'el-form',
          'el-form-item',
          'el-input',
          'el-select',
          'el-option',
          'el-button',
          'el-tag',
          'el-card',
        ],
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should initialize correctly', () => {
    expect(wrapper.vm.pagination.currentPage).toBe(1)
    expect(wrapper.vm.pagination.pageSize).toBe(10)
    expect(wrapper.vm.lockerStats).toHaveProperty('onlineCount')
    expect(wrapper.vm.lockerStats).toHaveProperty('offlineCount')
    expect(wrapper.vm.lockerStats).toHaveProperty('usageRate')
    expect(wrapper.vm.lockerStats).toHaveProperty('warningCount')
  })

  it('should load data on created', () => {
    const campusStore = useCampusStore(pinia)
    expect(campusStore.getCampuses).toHaveBeenCalled()
    expect(campusStore.getLockers).toHaveBeenCalled()
  })

  it('should handle search correctly', () => {
    wrapper.vm.searchForm.lockerNumber = '1001'
    wrapper.vm.handleSearch()
    expect(wrapper.vm.pagination.currentPage).toBe(1)
    const campusStore = useCampusStore(pinia)
    expect(campusStore.getLockers).toHaveBeenCalled()
  })

  it('should handle campus change correctly', () => {
    wrapper.vm.searchForm.campusId = 1
    wrapper.vm.searchForm.buildingId = '1'
    wrapper.vm.onCampusChange()
    expect(wrapper.vm.searchForm.buildingId).toBe('')
  })

  it('should handle add locker click', () => {
    wrapper.vm.handleAddLocker()
    expect(wrapper.vm.dialogTitle).toBe('添加外卖柜')
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.editingLocker).toBe(null)
  })

  it('should handle edit locker click', () => {
    const locker = { id: 1, lockerNumber: '1001', campusId: 1, buildingId: 1 }
    wrapper.vm.handleEditLocker(locker)
    expect(wrapper.vm.dialogTitle).toBe('编辑外卖柜')
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.editingLocker).toEqual(locker)
  })

  it('should get correct row class name', () => {
    const urgentRow = { availableCompartments: 2, status: 1, onlineStatus: 'online' }
    const offlineRow = { availableCompartments: 10, status: 1, onlineStatus: 'offline' }
    const normalRow = { availableCompartments: 5, status: 1, onlineStatus: 'online' }

    expect(wrapper.vm.getRowClassName({ row: urgentRow })).toBe('urgent-row')
    expect(wrapper.vm.getRowClassName({ row: offlineRow })).toBe('offline-row')
    expect(wrapper.vm.getRowClassName({ row: normalRow })).toBe('')
  })

  it('should initialize statistics correctly', () => {
    // 调用初始化方法
    wrapper.vm.initializeStats()

    // 验证统计数据被正确生成
    expect(typeof wrapper.vm.lockerStats.onlineCount).toBe('number')
    expect(typeof wrapper.vm.lockerStats.offlineCount).toBe('number')
    expect(typeof wrapper.vm.lockerStats.usageRate).toBe('number')
    expect(typeof wrapper.vm.lockerStats.warningCount).toBe('number')
    // 验证统计数据在合理范围内
    expect(wrapper.vm.lockerStats.onlineCount).toBeGreaterThanOrEqual(0)
    expect(wrapper.vm.lockerStats.offlineCount).toBeGreaterThanOrEqual(0)
    expect(wrapper.vm.lockerStats.usageRate).toBeGreaterThanOrEqual(0)
    expect(wrapper.vm.lockerStats.usageRate).toBeLessThanOrEqual(100)
    expect(wrapper.vm.lockerStats.warningCount).toBeGreaterThanOrEqual(0)
  })
})
