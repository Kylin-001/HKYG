import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ProductCard from './ProductCard.vue'

// 模拟商品数据
const mockProduct = {
  id: 1,
  name: '黑科智能耳机',
  description: '高性能降噪耳机，支持蓝牙5.3，续航30小时',
  price: 299.99,
  originalPrice: 399.99,
  stock: 100,
  sales: 1234,
  rating: 4.8,
  tags: ['热销', '新品', '限时折扣'],
  images: ['https://picsum.photos/400/300?random=1'],
  status: 'onSale',
  category: '电子产品',
}

const meta = {
  title: 'Business/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  argTypes: {
    product: {
      control: 'object',
      description: '商品数据',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '卡片大小',
    },
    showActions: {
      control: 'boolean',
      description: '是否显示操作按钮',
    },
    showRating: {
      control: 'boolean',
      description: '是否显示评分',
    },
    showSales: {
      control: 'boolean',
      description: '是否显示销量',
    },
    showTags: {
      control: 'boolean',
      description: '是否显示标签',
    },
  },
  args: {
    product: mockProduct,
    size: 'medium',
    showActions: true,
    showRating: true,
    showSales: true,
    showTags: true,
  },
} satisfies Meta<typeof ProductCard>

export default meta
type Story = StoryObj<typeof meta>

// 基础用法
export const Default: Story = {
  args: {
    product: mockProduct,
  },
}

// 小尺寸卡片
export const Small: Story = {
  args: {
    product: mockProduct,
    size: 'small',
  },
}

// 大尺寸卡片
export const Large: Story = {
  args: {
    product: mockProduct,
    size: 'large',
  },
}

// 不显示操作按钮
export const NoActions: Story = {
  args: {
    product: mockProduct,
    showActions: false,
  },
}

// 不显示评分
export const NoRating: Story = {
  args: {
    product: mockProduct,
    showRating: false,
  },
}

// 不显示销量
export const NoSales: Story = {
  args: {
    product: mockProduct,
    showSales: false,
  },
}

// 不显示标签
export const NoTags: Story = {
  args: {
    product: mockProduct,
    showTags: false,
  },
}

// 售罄商品
export const SoldOut: Story = {
  args: {
    product: {
      ...mockProduct,
      stock: 0,
      status: 'soldOut',
      name: '黑科智能手表',
      description: '多功能智能手表，支持心率监测、GPS定位',
      price: 199.99,
      originalPrice: 249.99,
      images: ['https://picsum.photos/400/300?random=2'],
    },
  },
}

// 下架商品
export const OffSale: Story = {
  args: {
    product: {
      ...mockProduct,
      status: 'offSale',
      name: '黑科无线充电器',
      description: '快速无线充电器，支持15W快充',
      price: 49.99,
      originalPrice: 69.99,
      images: ['https://picsum.photos/400/300?random=3'],
    },
  },
}

// 无折扣商品
export const NoDiscount: Story = {
  args: {
    product: {
      ...mockProduct,
      originalPrice: 0,
      tags: ['热销', '新品'],
      name: '黑科USB-C数据线',
      description: '耐用USB-C数据线，支持快充',
      price: 19.99,
      images: ['https://picsum.photos/400/300?random=4'],
    },
  },
}

// 低评分商品
export const LowRating: Story = {
  args: {
    product: {
      ...mockProduct,
      rating: 3.5,
      name: '黑科入门级耳机',
      description: '入门级蓝牙耳机，适合日常使用',
      price: 99.99,
      originalPrice: 129.99,
      images: ['https://picsum.photos/400/300?random=5'],
    },
  },
}
