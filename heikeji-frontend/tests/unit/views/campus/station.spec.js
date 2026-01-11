import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ElementPlus from 'element-plus'
import { useCampusStore } from '@/store/modules/campus'
import Station from '@/views/campus/station.vue'

describe('Station Management Component', () => {
  let wrapper
  let pinia

  beforeEach(() => {
    // Create testing Pinia
    pinia = createTestingPinia({
      stubActions: true,
      initialState: {
        campus: {
          stationList: [],
          stationTotal: 0,
          campusList: [{ id: 1, name: '测试校区' }],
        },
      },
    })

    // Mock Element Plus message and confirm
    ElementPlus.ElMessage = {
      success: vi.fn(),
      error: vi.fn(),
    }
    ElementPlus.ElMessageBox = {
      confirm: vi.fn(),
    }

    wrapper = shallowMount(Station, {
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
          'el-radio-group',
          'el-radio',
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
  })

  it('should load data on created', () => {
    // 获取campus store的actions
    const campusStore = useCampusStore(pinia)
    expect(campusStore.getCampuses).toHaveBeenCalled()
    expect(campusStore.getSites).toHaveBeenCalled()
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
    const campusStore = useCampusStore(pinia)
    expect(campusStore.getSites).toHaveBeenCalledWith(
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
