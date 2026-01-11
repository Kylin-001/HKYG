import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import FormTable from '@/components/ui/FormTable.vue'

// Mock dependencies
vi.mock('element-plus', async importOriginal => {
  const actual = await importOriginal<typeof import('element-plus')>()
  return {
    ...actual,
    default: actual,
    ElMessage: {
      success: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
      error: vi.fn(),
    },
    ElMessageBox: {
      confirm: vi.fn().mockResolvedValue(true),
    },
  }
})

// Mock icons
vi.mock('@element-plus/icons-vue', () => ({
  Plus: vi.fn(),
  Delete: vi.fn(),
  Refresh: vi.fn(),
  Download: vi.fn(),
  Check: vi.fn(),
  Edit: vi.fn(),
  Cancel: vi.fn(),
}))

describe('FormTable Component', () => {
  let wrapper
  let mockColumns
  let mockData
  let mockRules

  beforeEach(() => {
    // Mock columns
    mockColumns = [
      {
        prop: 'name',
        label: '商品名称',
        type: 'input',
        editable: true,
        width: 200,
      },
      {
        prop: 'price',
        label: '价格',
        type: 'input-number',
        editable: true,
        width: 120,
        min: 0,
        precision: 2,
      },
      {
        prop: 'category',
        label: '分类',
        type: 'select',
        editable: true,
        width: 150,
        options: [
          { label: '电子产品', value: 'electronics' },
          { label: '服装', value: 'clothing' },
          { label: '食品', value: 'food' },
        ],
      },
      {
        prop: 'status',
        label: '状态',
        type: 'switch',
        editable: true,
        width: 100,
      },
    ]

    // Mock data
    mockData = [
      {
        id: 1,
        name: '测试商品1',
        price: 199.99,
        category: 'electronics',
        status: true,
      },
      {
        id: 2,
        name: '测试商品2',
        price: 99.99,
        category: 'clothing',
        status: false,
      },
    ]

    // Mock rules
    mockRules = {
      name: [
        { required: true, message: '请输入商品名称', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
      ],
      price: [
        { required: true, message: '请输入价格', trigger: 'blur' },
        { type: 'number', min: 0, message: '价格必须大于0', trigger: 'blur' },
      ],
    }

    wrapper = shallowMount(FormTable, {
      global: {
        plugins: [ElementPlus],
      },
      props: {
        columns: mockColumns,
        data: mockData,
        rules: mockRules,
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should initialize correctly', () => {
    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.find('.form-table').exists()).toBe(true)
  })

  it('should render table with correct columns', () => {
    expect(wrapper.vm.columns).toEqual(mockColumns)
  })

  it('should render table with correct data', () => {
    expect(wrapper.vm.formData).toEqual(mockData)
  })

  it('should emit refresh event when refresh button is clicked', () => {
    wrapper.vm.handleRefresh()
    expect(wrapper.emitted('refresh')).toBeTruthy()
  })

  it('should emit export event when export button is clicked', () => {
    wrapper.vm.handleExport()
    expect(wrapper.emitted('export')).toBeTruthy()
  })

  it('should add new row when add button is clicked', () => {
    const initialLength = wrapper.vm.formData.length
    wrapper.vm.handleAddRow()
    expect(wrapper.vm.formData.length).toBe(initialLength + 1)
    expect(wrapper.emitted('add')).toBeTruthy()
  })

  it('should format cell value correctly for select type', () => {
    const value = 'electronics'
    const column = mockColumns.find(col => col.prop === 'category')!
    const formattedValue = wrapper.vm.formatCellValue(value, column, {
      row: mockData[0],
      $index: 0,
    })
    expect(formattedValue).toBe('电子产品')
  })

  it('should format cell value correctly for switch type', () => {
    const value = true
    const column = mockColumns.find(col => col.prop === 'status')!
    const formattedValue = wrapper.vm.formatCellValue(value, column, {
      row: mockData[0],
      $index: 0,
    })
    expect(formattedValue).toBe('是')
  })

  it('should handle selection change correctly', () => {
    const mockSelection = [mockData[0]]
    wrapper.vm.handleSelectionChange(mockSelection)
    expect(wrapper.vm.selectedRows).toEqual(mockSelection)
    expect(wrapper.emitted('selection-change')).toBeTruthy()
    expect(wrapper.emitted('selection-change')![0]).toEqual([mockSelection])
  })

  it('should handle current change correctly', () => {
    const mockCurrentRow = mockData[0]
    const mockOldCurrentRow = null
    wrapper.vm.handleCurrentChange(mockCurrentRow, mockOldCurrentRow)
    expect(wrapper.emitted('current-change')).toBeTruthy()
    expect(wrapper.emitted('current-change')![0]).toEqual([mockCurrentRow, mockOldCurrentRow])
  })

  it('should handle size change correctly', () => {
    const mockSize = 20
    wrapper.vm.handleSizeChange(mockSize)
    expect(wrapper.emitted('size-change')).toBeTruthy()
    expect(wrapper.emitted('size-change')![0]).toEqual([mockSize])
  })

  it('should handle row click correctly', () => {
    const mockRow = mockData[0]
    const mockColumn = {} as any
    const mockEvent = {} as Event
    wrapper.vm.handleRowClick(mockRow, mockColumn, mockEvent)
    expect(wrapper.emitted('row-click')).toBeTruthy()
    expect(wrapper.emitted('row-click')![0]).toEqual([mockRow, mockColumn, mockEvent])
  })

  it('should start editing cell when startEditCell is called', () => {
    const rowIndex = 0
    const prop = 'name'
    wrapper.vm.startEditCell(rowIndex, prop)
    expect(wrapper.vm.editingCells[rowIndex][prop]).toBe(true)
  })

  it('should handle save cell correctly', async () => {
    const rowIndex = 0
    const prop = 'name'
    const row = mockData[0]

    // Start editing
    wrapper.vm.startEditCell(rowIndex, prop)
    expect(wrapper.vm.editingCells[rowIndex][prop]).toBe(true)

    // Mock form validation
    const formRef = { validateField: vi.fn().mockResolvedValue(undefined) }
    wrapper.vm.formRef = formRef as any

    // Save cell
    await wrapper.vm.handleSaveCell(rowIndex, prop, row)
    expect(wrapper.vm.editingCells[rowIndex][prop]).toBe(false)
    expect(wrapper.emitted('save-cell')).toBeTruthy()
    expect(wrapper.emitted('save-cell')![0]).toEqual([row, prop, rowIndex])
  })

  it('should handle edit row correctly', () => {
    const row = mockData[0]
    const index = 0
    wrapper.vm.handleEditRow(row, index)
    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')![0]).toEqual([row, index])
  })

  it('should handle cancel row correctly', () => {
    const row = mockData[0]
    const index = 0
    // Save original data
    const originalData = [...wrapper.vm.formData]
    // Modify data
    wrapper.vm.formData[index].name = 'Modified Name'
    // Cancel edit
    wrapper.vm.handleCancelRow(row, index)
    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('cancel')![0]).toEqual([row, index])
  })

  it('should handle delete row correctly', async () => {
    const row = mockData[0]
    const index = 0
    const elementPlus = await import('element-plus')

    await wrapper.vm.handleDeleteRow(row, index)
    expect(elementPlus.ElMessageBox.confirm).toHaveBeenCalled()
    expect(elementPlus.ElMessage.success).toHaveBeenCalledWith('删除成功')
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')![0]).toEqual([row, index])
  })

  it('should handle batch save correctly', async () => {
    // Mock form validation
    const formRef = { validate: vi.fn().mockResolvedValue(undefined) }
    wrapper.vm.formRef = formRef as any

    await wrapper.vm.handleBatchSave()
    expect(formRef.validate).toHaveBeenCalled()
    expect(wrapper.emitted('save-all')).toBeTruthy()
    expect(wrapper.emitted('save-all')![0]).toEqual([wrapper.vm.formData])
  })

  it('should handle delete selected correctly', async () => {
    // Select some rows
    wrapper.vm.selectedRows = [mockData[0], mockData[1]]
    const elementPlus = await import('element-plus')

    await wrapper.vm.handleDeleteSelected()
    expect(elementPlus.ElMessageBox.confirm).toHaveBeenCalled()
    expect(elementPlus.ElMessage.success).toHaveBeenCalledWith('删除成功')
    expect(wrapper.emitted('delete-selected')).toBeTruthy()
    expect(wrapper.emitted('delete-selected')![0]).toEqual([wrapper.vm.selectedRows])
  })

  it('should expose public methods correctly', () => {
    expect(wrapper.vm.validate).toBeInstanceOf(Function)
    expect(wrapper.vm.validateField).toBeInstanceOf(Function)
    expect(wrapper.vm.clearValidate).toBeInstanceOf(Function)
    expect(wrapper.vm.startEditCell).toBeInstanceOf(Function)
    expect(wrapper.vm.handleSaveCell).toBeInstanceOf(Function)
    expect(wrapper.vm.handleSaveRow).toBeInstanceOf(Function)
  })
})
