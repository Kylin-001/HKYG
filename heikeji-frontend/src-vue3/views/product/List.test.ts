import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import List from '../List.vue'
import * as productApi from '@/api/product'
import type { Product, ProductListResponse, ProductStats } from '@/types/product'

// Mock API
vi.mock('@/api/product', () => ({
  getProductList: vi.fn(),
  getProductStats: vi.fn(),
  deleteProduct: vi.fn(),
  exportProducts: vi.fn(),
}))

// Mock Element Plus components
vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElMessage: {
      success: vi.fn(),
      error: vi.fn(),
    },
    ElMessageBox: {
      confirm: vi.fn(),
    },
  }
})

// Mock VirtualTable component
vi.mock('@/components/VirtualTable/index.vue', () => ({
  default: {
    name: 'VirtualTable',
    template: '<div class="virtual-table-mock"></div>',
    props: ['data', 'columns', 'loading'],
  },
}))

// Mock ProductDetailDialog and ProductEditDialog
vi.mock('../components/ProductDetailDialog.vue', () => ({
  default: {
    name: 'ProductDetailDialog',
    template: '<div class="product-detail-dialog-mock"></div>',
    props: ['visible', 'productId'],
  },
}))

vi.mock('../components/ProductEditDialog.vue', () => ({
  default: {
    name: 'ProductEditDialog',
    template: '<div class="product-edit-dialog-mock"></div>',
    props: ['visible', 'productId', 'mode'],
  },
}))

describe('Product List Component', () => {
  let wrapper: any

  const mockProducts: Product[] = [
    {
      id: '1',
      name: '测试商品1',
      code: 'P001',
      description: '这是一个测试商品',
      image: 'https://example.com/image1.jpg',
      categoryId: '1',
      categoryName: '数码电器',
      price: 99.99,
      stock: 100,
      sales: 10,
      status: 1,
      isHot: true,
      isNew: false,
      isRecommended: false,
      createTime: '2023-01-01T00:00:00Z',
      updateTime: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: '测试商品2',
      code: 'P002',
      description: '这是另一个测试商品',
      image: 'https://example.com/image2.jpg',
      categoryId: '2',
      categoryName: '服装鞋帽',
      price: 199.99,
      stock: 50,
      sales: 5,
      status: 2,
      isHot: false,
      isNew: true,
      isRecommended: true,
      createTime: '2023-01-02T00:00:00Z',
      updateTime: '2023-01-02T00:00:00Z',
    },
  ]

  const mockProductListResponse: ProductListResponse = {
    list: mockProducts,
    total: 2,
    pageNum: 1,
    pageSize: 20,
  }

  const mockProductStats: ProductStats = {
    total: 100,
    online: 80,
    offline: 20,
    hot: 10,
    new: 15,
    lowStock: 5,
    outOfStock: 2,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default API responses
    vi.mocked(productApi.getProductList).mockResolvedValue({
      data: mockProductListResponse,
    })
    
    vi.mocked(productApi.getProductStats).mockResolvedValue({
      data: mockProductStats,
    })
    
    vi.mocked(productApi.deleteProduct).mockResolvedValue({
      data: true,
    })
    
    vi.mocked(productApi.exportProducts).mockResolvedValue({
      data: new Blob(),
    })
    
    vi.mocked(ElMessageBox.confirm).mockResolvedValue('confirm')
    
    wrapper = mount(List, {
      global: {
        stubs: {
          'el-button': true,
          'el-input': true,
          'el-select': true,
          'el-option': true,
          'el-card': true,
          'el-pagination': true,
          'el-icon': true,
          'el-tag': true,
        },
      },
    })
  })

  it('renders correctly', () => {
    expect(wrapper.find('.product-list-container').exists()).toBe(true)
    expect(wrapper.find('.page-header').exists()).toBe(true)
    expect(wrapper.find('.stats-container').exists()).toBe(true)
    expect(wrapper.find('.search-container').exists()).toBe(true)
    expect(wrapper.find('.product-table-card').exists()).toBe(true)
  })

  it('loads products on mount', async () => {
    await wrapper.vm.$nextTick()
    
    expect(productApi.getProductList).toHaveBeenCalledTimes(1)
    expect(productApi.getProductStats).toHaveBeenCalledTimes(1)
  })

  it('displays product stats correctly', async () => {
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('100')
    expect(wrapper.text()).toContain('80')
    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('15')
  })

  it('displays products in table', async () => {
    await wrapper.vm.$nextTick()
    
    // Wait for API call to complete
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('测试商品1')
    expect(wrapper.text()).toContain('测试商品2')
    expect(wrapper.text()).toContain('P001')
    expect(wrapper.text()).toContain('P002')
  })

  it('handles search correctly', async () => {
    const searchInput = wrapper.find('.search-container input')
    await searchInput.setValue('测试商品')
    await searchInput.trigger('keyup.enter')
    
    expect(productApi.getProductList).toHaveBeenCalledWith(
      expect.objectContaining({
        keyword: '测试商品',
        pageNum: 1,
      })
    )
  })

  it('handles refresh correctly', async () => {
    const refreshButton = wrapper.find('.header-right button:nth-child(2)')
    await refreshButton.trigger('click')
    
    expect(productApi.getProductList).toHaveBeenCalledTimes(2)
    expect(productApi.getProductStats).toHaveBeenCalledTimes(2)
  })

  it('handles product deletion correctly', async () => {
    // First load products
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Mock the table action
    wrapper.vm.handleTableAction('delete', mockProducts[0])
    
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      expect.stringContaining('确定要删除商品"测试商品1"吗？'),
      '警告',
      expect.any(Object)
    )
    
    await wrapper.vm.$nextTick()
    
    expect(productApi.deleteProduct).toHaveBeenCalledWith('1')
  })

  it('handles pagination correctly', async () => {
    const pagination = wrapper.vm.pagination
    pagination.currentPage = 2
    
    await wrapper.vm.$nextTick()
    
    expect(productApi.getProductList).toHaveBeenCalledWith(
      expect.objectContaining({
        pageNum: 2,
      })
    )
  })

  it('handles export correctly', async () => {
    const exportButton = wrapper.find('.header-right button:nth-child(3)')
    await exportButton.trigger('click')
    
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      '确定要导出商品数据吗？',
      '提示',
      expect.any(Object)
    )
    
    expect(productApi.exportProducts).toHaveBeenCalled()
  })

  it('handles add product correctly', async () => {
    const addButton = wrapper.find('.header-right button:nth-child(1)')
    await addButton.trigger('click')
    
    expect(wrapper.vm.editDialogVisible).toBe(true)
    expect(wrapper.vm.editMode).toBe('add')
    expect(wrapper.vm.selectedProductId).toBe(null)
  })

  it('handles view product correctly', async () => {
    // First load products
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Mock the table action
    wrapper.vm.handleTableAction('view', mockProducts[0])
    
    expect(wrapper.vm.detailDialogVisible).toBe(true)
    expect(wrapper.vm.selectedProductId).toBe('1')
  })

  it('handles edit product correctly', async () => {
    // First load products
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Mock the table action
    wrapper.vm.handleTableAction('edit', mockProducts[0])
    
    expect(wrapper.vm.editDialogVisible).toBe(true)
    expect(wrapper.vm.editMode).toBe('edit')
    expect(wrapper.vm.selectedProductId).toBe('1')
  })

  it('handles reset search correctly', async () => {
    // Set search values
    wrapper.vm.searchParams.keyword = 'test'
    wrapper.vm.searchParams.categoryId = '1'
    wrapper.vm.searchParams.status = '1'
    
    const resetButton = wrapper.find('.search-container button:last-child')
    await resetButton.trigger('click')
    
    expect(wrapper.vm.searchParams.keyword).toBe('')
    expect(wrapper.vm.searchParams.categoryId).toBe('')
    expect(wrapper.vm.searchParams.status).toBe('0')
    expect(wrapper.vm.pagination.currentPage).toBe(1)
  })

  it('displays loading state correctly', async () => {
    wrapper.vm.loading = true
    await wrapper.vm.$nextTick()
    
    // Check if loading state is displayed
    expect(wrapper.find('.el-loading-mask').exists()).toBe(true)
  })

  it('formats price correctly', () => {
    const price = 99.99
    const formattedPrice = `¥${price.toFixed(2)}`
    expect(formattedPrice).toBe('¥99.99')
  })

  it('formats date correctly', () => {
    const dateString = '2023-01-01T00:00:00Z'
    const formattedDate = wrapper.vm.formatDate(dateString)
    expect(formattedDate).toBe(new Date(dateString).toLocaleString())
  })
})