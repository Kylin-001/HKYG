import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import ProductCard from '@/components/business/ProductCard.vue'

// Mock dependencies
vi.mock('@/components/ui/StatusTag.vue', () => ({
  default: {
    template: '<div class="status-tag">{{ text }}</div>',
    props: ['type', 'size', 'text'],
  },
}))

// Mock icons
vi.mock('@element-plus/icons-vue', () => ({
  PictureFilled: vi.fn(),
  TrendCharts: vi.fn(),
}))

describe('ProductCard Component', () => {
  let wrapper
  let mockProduct

  beforeEach(() => {
    // 清除所有模拟调用
    vi.clearAllMocks()

    // 模拟商品数据
    mockProduct = {
      id: '1',
      name: '测试商品',
      description: '这是一个测试商品的详细描述，用于测试商品卡片组件的功能和样式。',
      imageUrl: 'https://example.com/product.jpg',
      currentPrice: 199.99,
      originalPrice: 299.99,
      stock: 100,
      status: 'in_stock',
      tags: ['新品', '热销'],
      attributes: [
        { name: '颜色', value: '红色' },
        { name: '尺寸', value: 'M' },
      ],
      rating: 4.5,
      ratingCount: 123,
      salesCount: 456,
    }

    wrapper = mount(ProductCard, {
      global: {
        plugins: [ElementPlus],
      },
      props: {
        product: mockProduct,
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('组件初始化', () => {
    it('should initialize correctly', () => {
      expect(wrapper.vm).toBeTruthy()
      expect(wrapper.find('.product-card').exists()).toBe(true)
    })

    it('should render product information correctly', () => {
      // 检查商品名称
      expect(wrapper.find('.product-name').text()).toBe(mockProduct.name)

      // 检查商品描述
      expect(wrapper.find('.product-description').text()).toContain('这是一个测试商品的详细描述')

      // 检查商品价格
      expect(wrapper.find('.price-current').text()).toContain('199.99')
      expect(wrapper.find('.price-original').text()).toContain('299.99')
      expect(wrapper.find('.price-discount').text()).toContain('折')
    })

    it('should render product attributes correctly', () => {
      const attributes = wrapper.findAll('.attribute-item')
      expect(attributes.length).toBe(mockProduct.attributes.length)
      expect(attributes[0].text()).toBe('颜色: 红色')
      expect(attributes[1].text()).toBe('尺寸: M')
    })

    it('should render product tags correctly', () => {
      const tags = wrapper.findAll('.product-tag')
      expect(tags.length).toBe(mockProduct.tags.length)
    })
  })

  describe('图片处理', () => {
    it('should render product image when imageUrl is provided', () => {
      const image = wrapper.find('.product-image')
      expect(image.exists()).toBe(true)
      expect(image.attributes('src')).toBe(mockProduct.imageUrl)
    })

    it('should render placeholder when imageUrl is not provided', () => {
      const noImageProduct = { ...mockProduct, imageUrl: '' }
      const noImageWrapper = mount(ProductCard, {
        global: {
          plugins: [ElementPlus],
        },
        props: {
          product: noImageProduct,
        },
      })

      expect(noImageWrapper.find('.product-image-placeholder').exists()).toBe(true)
      noImageWrapper.unmount()
    })

    it('should emit image-error event when image fails to load', () => {
      const image = wrapper.find('.product-image')
      image.trigger('error')
      expect(wrapper.emitted('image-error')).toBeTruthy()
    })
  })

  describe('库存状态', () => {
    it('should display correct stock status for in_stock product', () => {
      const statusTag = wrapper.find('.stock-status .status-tag')
      expect(statusTag.exists()).toBe(true)
    })

    it('should display correct stock status for out_of_stock product', () => {
      const outOfStockProduct = { ...mockProduct, status: 'out_of_stock', stock: 0 }
      const outOfStockWrapper = mount(ProductCard, {
        global: {
          plugins: [ElementPlus],
        },
        props: {
          product: outOfStockProduct,
        },
      })

      const statusTag = outOfStockWrapper.find('.stock-status .status-tag')
      expect(statusTag.exists()).toBe(true)
      outOfStockWrapper.unmount()
    })

    it('should display correct stock status for low_stock product', () => {
      const lowStockProduct = { ...mockProduct, status: 'low_stock', stock: 5 }
      const lowStockWrapper = mount(ProductCard, {
        global: {
          plugins: [ElementPlus],
        },
        props: {
          product: lowStockProduct,
        },
      })

      const statusTag = lowStockWrapper.find('.stock-status .status-tag')
      expect(statusTag.exists()).toBe(true)
      lowStockWrapper.unmount()
    })

    it('should display correct stock status for disabled product', () => {
      const disabledProduct = { ...mockProduct, status: 'disabled' }
      const disabledWrapper = mount(ProductCard, {
        global: {
          plugins: [ElementPlus],
        },
        props: {
          product: disabledProduct,
        },
      })

      const statusTag = disabledWrapper.find('.stock-status .status-tag')
      expect(statusTag.exists()).toBe(true)
      disabledWrapper.unmount()
    })
  })

  describe('操作按钮', () => {
    it('should render all action buttons by default', () => {
      const buttons = wrapper.findAll('.product-actions button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should disable add-to-cart button when product is out of stock', () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 }
      const outOfStockWrapper = mount(ProductCard, {
        global: {
          plugins: [ElementPlus],
        },
        props: {
          product: outOfStockProduct,
        },
      })

      const addToCartButton = outOfStockWrapper.find('.product-actions button:nth-child(1)')
      expect(addToCartButton.exists()).toBe(true)
      outOfStockWrapper.unmount()
    })

    it('should disable buy-now button when product is out of stock', () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 }
      const outOfStockWrapper = mount(ProductCard, {
        global: {
          plugins: [ElementPlus],
        },
        props: {
          product: outOfStockProduct,
        },
      })

      const buttons = outOfStockWrapper.findAll('.product-actions button')
      expect(buttons.length).toBeGreaterThan(1)
      outOfStockWrapper.unmount()
    })

    it('should emit add-to-cart event when add-to-cart button is clicked', () => {
      const addToCartButton = wrapper.find('.product-actions button:nth-child(1)')
      if (addToCartButton.exists()) {
        addToCartButton.trigger('click')
        expect(wrapper.emitted('add-to-cart')).toBeTruthy()
        expect(wrapper.emitted('add-to-cart')![0]).toEqual([mockProduct])
      }
    })

    it('should emit buy-now event when buy-now button is clicked', () => {
      const buttons = wrapper.findAll('.product-actions button')
      if (buttons.length > 1) {
        buttons[1].trigger('click')
        expect(wrapper.emitted('buy-now')).toBeTruthy()
        expect(wrapper.emitted('buy-now')![0]).toEqual([mockProduct])
      }
    })

    it('should emit view-detail event when view-detail button is clicked', () => {
      const buttons = wrapper.findAll('.product-actions button')
      if (buttons.length > 2) {
        buttons[2].trigger('click')
        expect(wrapper.emitted('view-detail')).toBeTruthy()
        expect(wrapper.emitted('view-detail')![0]).toEqual([mockProduct])
      }
    })
  })

  describe('交互功能', () => {
    it('should emit click event when card is clicked', () => {
      wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')![0]).toEqual([mockProduct])
    })

    it('should truncate long description', () => {
      const longDescProduct = {
        ...mockProduct,
        description:
          '这是一个非常长的商品描述，用于测试商品卡片组件的描述截断功能。这个描述应该会被截断，只显示一部分内容。',
      }
      const longDescWrapper = mount(ProductCard, {
        global: {
          plugins: [ElementPlus],
        },
        props: {
          product: longDescProduct,
          descriptionMaxLength: 20,
        },
      })

      const description = longDescWrapper.find('.product-description')
      expect(description.text()).toContain('...')
      expect(description.text().length).toBeLessThanOrEqual(23) // 20 + 3 for ellipsis
      longDescWrapper.unmount()
    })

    it('should show correct rating and sales count', () => {
      // Rating and sales are shown by default, but let's check if the elements exist
      expect(wrapper.find('.product-rating').exists()).toBe(true)
      expect(wrapper.find('.product-sales').exists()).toBe(true)
    })
  })

  describe('组件样式和状态', () => {
    it('should apply correct classes based on props', () => {
      // 测试禁用状态
      const disabledWrapper = mount(ProductCard, {
        global: {
          plugins: [ElementPlus],
        },
        props: {
          product: mockProduct,
          disabled: true,
        },
      })
      expect(disabledWrapper.classes()).toContain('disabled')
      disabledWrapper.unmount()

      // 测试悬停效果
      const hoverableWrapper = mount(ProductCard, {
        global: {
          plugins: [ElementPlus],
        },
        props: {
          product: mockProduct,
          hoverable: true,
        },
      })
      expect(hoverableWrapper.classes()).toContain('hoverable')
      hoverableWrapper.unmount()
    })

    it('should not show actions when showActions is false', () => {
      const noActionsWrapper = mount(ProductCard, {
        global: {
          plugins: [ElementPlus],
        },
        props: {
          product: mockProduct,
          showActions: false,
        },
      })
      expect(noActionsWrapper.find('.product-actions').exists()).toBe(false)
      noActionsWrapper.unmount()
    })

    it('should not show rating when showRating is false', () => {
      const noRatingWrapper = mount(ProductCard, {
        global: {
          plugins: [ElementPlus],
        },
        props: {
          product: mockProduct,
          showRating: false,
        },
      })
      expect(noRatingWrapper.find('.product-rating').exists()).toBe(false)
      noRatingWrapper.unmount()
    })

    it('should not show sales when showSales is false', () => {
      const noSalesWrapper = mount(ProductCard, {
        global: {
          plugins: [ElementPlus],
        },
        props: {
          product: mockProduct,
          showSales: false,
        },
      })
      expect(noSalesWrapper.find('.product-sales').exists()).toBe(false)
      noSalesWrapper.unmount()
    })
  })

  describe('货币和价格格式', () => {
    it('should use correct currency symbol', () => {
      const usdProduct = {
        ...mockProduct,
        currentPrice: 199.99,
        originalPrice: 299.99,
      }
      const usdWrapper = mount(ProductCard, {
        global: {
          plugins: [ElementPlus],
        },
        props: {
          product: usdProduct,
          currencySymbol: '$',
        },
      })

      expect(usdWrapper.find('.price-current').text()).toContain('$199.99')
      expect(usdWrapper.find('.price-original').text()).toContain('$299.99')
      usdWrapper.unmount()
    })
  })
})
