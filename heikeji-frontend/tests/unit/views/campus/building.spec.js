import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import Building from '@/views/campus/building.vue'
import { getBuildings } from '@/store/modules/campus'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(ElementUI)

describe('Building Management Component', () => {
  let store
  let mutations
  let actions
  let wrapper

  beforeEach(() => {
    // Mock Vuex store
    mutations = {
      SET_BUILDING_LIST: jest.fn(),
    }
    actions = {
      getBuildings: jest.fn(),
      getCampuses: jest.fn(),
      addNewBuilding: jest.fn(),
      updateExistingBuilding: jest.fn(),
      updateBuildingEnabledStatus: jest.fn(),
    }

    store = new Vuex.Store({
      modules: {
        campus: {
          namespaced: true,
          state: {
            buildingList: [],
            buildingTotal: 0,
            campusList: [{ id: 1, name: '测试校区' }],
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

    wrapper = shallowMount(Building, {
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
        'el-checkbox-group',
        'el-checkbox',
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
    expect(actions.getBuildings).toHaveBeenCalled()
  })

  it('should handle search correctly', () => {
    wrapper.vm.searchForm.name = '测试楼栋'
    wrapper.vm.handleSearch()
    expect(wrapper.vm.pagination.currentPage).toBe(1)
    expect(actions.getBuildings).toHaveBeenCalledWith(expect.anything(), {
      campusId: '',
      name: '测试楼栋',
      page: 1,
      pageSize: 10,
    })
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
    expect(actions.getBuildings).toHaveBeenCalled()
  })

  it('should handle pagination current page change', () => {
    wrapper.vm.handleCurrentChange(2)
    expect(wrapper.vm.pagination.currentPage).toBe(2)
    expect(actions.getBuildings).toHaveBeenCalled()
  })
})
