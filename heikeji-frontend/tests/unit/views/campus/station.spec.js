import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import Station from '@/views/campus/station.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(ElementUI)

describe('Station Management Component', () => {
  let store
  let mutations
  let actions
  let wrapper

  beforeEach(() => {
    // Mock Vuex store
    mutations = {
      SET_STATION_LIST: jest.fn(),
    }
    actions = {
      getStations: jest.fn(),
      getCampuses: jest.fn(),
      addNewStation: jest.fn(),
      updateExistingStation: jest.fn(),
      updateStationEnabledStatus: jest.fn(),
    }

    store = new Vuex.Store({
      modules: {
        campus: {
          namespaced: true,
          state: {
            stationList: [],
            stationTotal: 0,
            campusList: [{ id: 1, name: '测试校区' }],
          },
          mutations,
          actions,
        },
      },
    })

    // Mock Element UI message and confirm
    ElementUI.Message = {
      success: jest.fn(),
      error: jest.fn(),
    }
    ElementUI.MessageBox = {
      confirm: jest.fn(),
    }

    wrapper = shallowMount(Station, {
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
        'el-radio-group',
        'el-radio',
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
  })

  it('should load data on created', () => {
    expect(actions.getCampuses).toHaveBeenCalled()
    expect(actions.getStations).toHaveBeenCalled()
  })

  it('should get correct station type text', () => {
    expect(wrapper.vm.getStationTypeText(1)).toBe('外卖站点')
    expect(wrapper.vm.getStationTypeText(2)).toBe('跑腿站点')
    expect(wrapper.vm.getStationTypeText(3)).toBe('综合站点')
    expect(wrapper.vm.getStationTypeText(99)).toBe('未知类型')
  })

  it('should get correct station type tag color', () => {
    expect(wrapper.vm.getStationTypeTagType(1)).toBe('primary')
    expect(wrapper.vm.getStationTypeTagType(2)).toBe('success')
    expect(wrapper.vm.getStationTypeTagType(3)).toBe('warning')
    expect(wrapper.vm.getStationTypeTagType(99)).toBe('info')
  })

  it('should handle search correctly', () => {
    wrapper.vm.searchForm.name = '测试站点'
    wrapper.vm.handleSearch()
    expect(wrapper.vm.pagination.currentPage).toBe(1)
    expect(actions.getStations).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        name: '测试站点',
        page: 1,
        pageSize: 10,
      })
    )
  })

  it('should reset search form correctly', () => {
    wrapper.vm.searchForm.name = '测试站点'
    wrapper.vm.resetSearch()
    expect(wrapper.vm.searchForm.name).toBe('')
    expect(wrapper.vm.searchForm.campusId).toBe('')
    expect(wrapper.vm.searchForm.stationType).toBe('')
    expect(wrapper.vm.searchForm.status).toBe('')
  })

  it('should handle add station click', () => {
    wrapper.vm.handleAddStation()
    expect(wrapper.vm.dialogTitle).toBe('添加站点')
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.editingStation).toBe(null)
  })

  it('should handle edit station click', () => {
    const station = { id: 1, name: '测试站点', campusId: 1, stationType: 3 }
    wrapper.vm.handleEditStation(station)
    expect(wrapper.vm.dialogTitle).toBe('编辑站点')
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.editingStation).toEqual(station)
    expect(wrapper.vm.stationForm.stationType).toBe('3')
  })

  it('should handle pagination correctly', () => {
    wrapper.vm.handleSizeChange(20)
    expect(wrapper.vm.pagination.pageSize).toBe(20)

    wrapper.vm.handleCurrentChange(3)
    expect(wrapper.vm.pagination.currentPage).toBe(3)
  })
})
