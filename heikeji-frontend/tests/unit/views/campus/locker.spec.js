import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import Locker from '@/views/campus/locker.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(ElementUI)

describe('Locker Management Component', () => {
  let store
  let mutations
  let actions
  let wrapper

  beforeEach(() => {
    // Mock Vuex store
    mutations = {
      SET_LOCKER_LIST: jest.fn(),
    }
    actions = {
      getLockers: jest.fn(),
      getCampuses: jest.fn(),
      getBuildings: jest.fn(),
      addNewLocker: jest.fn(),
      updateExistingLocker: jest.fn(),
      updateLockerEnabledStatus: jest.fn(),
    }

    store = new Vuex.Store({
      modules: {
        campus: {
          namespaced: true,
          state: {
            lockerList: [],
            lockerTotal: 0,
            campusList: [{ id: 1, name: '测试校区' }],
            buildingList: [{ id: 1, name: '测试楼栋', campusId: 1 }],
          },
          mutations,
          actions,
        },
      },
    })

    // Mock Element UI message
    ElementUI.Message = {
      success: jest.fn(),
      error: jest.fn(),
    }

    // Mock console.log
    console.log = jest.fn()

    wrapper = shallowMount(Locker, {
      localVue,
      store,
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
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should initialize correctly', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.vm.pagination.currentPage).toBe(1)
    expect(wrapper.vm.pagination.pageSize).toBe(10)
    expect(wrapper.vm.lockerStats).toEqual({
      onlineCount: 0,
      offlineCount: 0,
      avgUsageRate: '0%',
      maintenanceCount: 0,
    })
  })

  it('should load data on created', () => {
    expect(actions.getCampuses).toHaveBeenCalled()
    expect(actions.getLockers).toHaveBeenCalled()
  })

  it('should handle search correctly', () => {
    wrapper.vm.searchForm.lockerNumber = '1001'
    wrapper.vm.handleSearch()
    expect(wrapper.vm.pagination.currentPage).toBe(1)
    expect(actions.getLockers).toHaveBeenCalled()
  })

  it('should handle campus change correctly', () => {
    wrapper.vm.searchForm.campusId = 1
    wrapper.vm.onCampusChange()
    expect(wrapper.vm.searchForm.buildingId).toBe('')
    expect(actions.getBuildings).toHaveBeenCalledWith(expect.anything(), { campusId: 1 })
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
    const urgentRow = { status: 2 }
    const offlineRow = { onlineStatus: 0 }
    const normalRow = { status: 1, onlineStatus: 1 }

    expect(wrapper.vm.getRowClassName({ row: urgentRow })).toBe('locker-urgent-row')
    expect(wrapper.vm.getRowClassName({ row: offlineRow })).toBe('locker-offline-row')
    expect(wrapper.vm.getRowClassName({ row: normalRow })).toBe('')
  })

  it('should initialize statistics correctly', () => {
    const mockLockers = [
      { status: 1, onlineStatus: 1, totalCells: 50, availableCells: 25 },
      { status: 1, onlineStatus: 0, totalCells: 30, availableCells: 10 },
      { status: 2, onlineStatus: 1, totalCells: 40, availableCells: 5 },
    ]

    wrapper.vm.lockerList = mockLockers
    wrapper.vm.initializeStats()

    expect(wrapper.vm.lockerStats.onlineCount).toBe(2)
    expect(wrapper.vm.lockerStats.offlineCount).toBe(1)
    expect(wrapper.vm.lockerStats.maintenanceCount).toBe(1)
  })
})
