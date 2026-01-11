import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ElementPlus from 'element-plus'
import { useCampusStore } from '@/store/modules/campus'
import Building from '@/views/campus/building.vue'

describe('Building Management Component', () => {
  let wrapper
  let campusStore

  beforeEach(() => {
    // Mock Element Plus message
    ElementPlus.Message = {
      success: vi.fn(),
      error: vi.fn(),
    }

    // Create testing Pinia
    const pinia = createTestingPinia({
      stubActions: true,
      initialState: {
        campus: {
          buildingList: [],
          buildingTotal: 0,
          campusList: [{ id: 1, name: '测试校区' }],
        },
      },
    })

    wrapper = shallowMount(Building, {
      global: {
        plugins: [ElementPlus, pinia],
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
          'el-checkbox-group',
          'el-checkbox',
        ],
      },
    })

    // Get campus store
    campusStore = useCampusStore(pinia)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should initialize correctly', () => {
    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.vm.pagination.currentPage).toBe(1)
    expect(wrapper.vm.pagination.pageSize).toBe(10)
  })

  it('should load data on created', () => {
    expect(campusStore.getCampuses).toHaveBeenCalled()
    expect(campusStore.getBuildings).toHaveBeenCalled()
  })

  it('should handle search correctly', () => {
    wrapper.vm.searchForm.name = '测试楼栋'
    wrapper.vm.handleSearch()
    expect(wrapper.vm.pagination.currentPage).toBe(1)
    expect(campusStore.getBuildings).toHaveBeenCalled()
  })

  it('should reset search form correctly', () => {
    wrapper.vm.searchForm.name = '测试楼栋'
    wrapper.vm.resetSearch()
    expect(wrapper.vm.searchForm.name).toBe('')
    expect(wrapper.vm.searchForm.campusId).toBe('')
  })

  it('should handle add building click', () => {
    wrapper.vm.handleAddBuilding()
    expect(wrapper.vm.dialogTitle).toBe('添加楼栋')
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.editingBuilding).toBe(null)
  })

  it('should handle edit building click', () => {
    const building = { id: 1, name: '测试楼栋', campusId: 1 }
    wrapper.vm.handleEditBuilding(building)
    expect(wrapper.vm.dialogTitle).toBe('编辑楼栋')
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.editingBuilding).toEqual(building)
  })

  it('should handle pagination size change', () => {
    wrapper.vm.handleSizeChange(20)
    expect(wrapper.vm.pagination.pageSize).toBe(20)
    expect(campusStore.getBuildings).toHaveBeenCalled()
  })

  it('should handle pagination current page change', () => {
    wrapper.vm.handleCurrentChange(2)
    expect(wrapper.vm.pagination.currentPage).toBe(2)
    expect(campusStore.getBuildings).toHaveBeenCalled()
  })
})
