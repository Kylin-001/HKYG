import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LazyImage from './LazyImage.vue'

const meta = {
  title: 'UI/LazyImage',
  component: LazyImage,
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: '图片地址',
    },
    alt: {
      control: 'text',
      description: '图片替代文本',
    },
    width: {
      control: 'number',
      description: '图片宽度',
    },
    height: {
      control: 'number',
      description: '图片高度',
    },
    placeholderType: {
      control: 'select',
      options: ['default', 'blur', 'color'],
      description: '占位符类型',
    },
    placeholderColor: {
      control: 'color',
      description: '自定义占位符颜色',
    },
    showLoading: {
      control: 'boolean',
      description: '是否显示加载动画',
    },
    showRetry: {
      control: 'boolean',
      description: '加载失败时是否显示重试按钮',
    },
    lazy: {
      control: 'boolean',
      description: '是否启用懒加载',
    },
  },
  args: {
    src: 'https://picsum.photos/800/400',
    alt: '示例图片',
    width: 800,
    height: 400,
    placeholderType: 'default',
    showLoading: true,
    showRetry: true,
    lazy: true,
  },
} satisfies Meta<typeof LazyImage>

export default meta
type Story = StoryObj<typeof meta>

// 基础用法
export const Default: Story = {
  args: {
    src: 'https://picsum.photos/800/400?random=1',
  },
}

// 小尺寸图片
export const Small: Story = {
  args: {
    src: 'https://picsum.photos/400/200?random=2',
    width: 400,
    height: 200,
  },
}

// 不同占位符类型
export const BlurPlaceholder: Story = {
  args: {
    src: 'https://picsum.photos/800/400?random=3',
    placeholderType: 'blur',
  },
}

export const ColorPlaceholder: Story = {
  args: {
    src: 'https://picsum.photos/800/400?random=4',
    placeholderType: 'color',
    placeholderColor: '#e9ecef',
  },
}

// 自定义占位符颜色
export const CustomPlaceholderColor: Story = {
  args: {
    src: 'https://picsum.photos/800/400?random=5',
    placeholderType: 'color',
    placeholderColor: '#6c757d',
  },
}

// 不显示加载动画
export const NoLoading: Story = {
  args: {
    src: 'https://picsum.photos/800/400?random=6',
    showLoading: false,
  },
}

// 不显示重试按钮
export const NoRetry: Story = {
  args: {
    src: 'https://picsum.photos/800/400?random=7',
    showRetry: false,
  },
}

// 禁用懒加载
export const NoLazy: Story = {
  args: {
    src: 'https://picsum.photos/800/400?random=8',
    lazy: false,
  },
}

// 错误图片处理
export const ErrorImage: Story = {
  args: {
    src: 'https://picsum.photos/invalid-url-that-will-fail',
    alt: '错误图片示例',
  },
}

// 正方形图片
export const Square: Story = {
  args: {
    src: 'https://picsum.photos/400/400?random=9',
    width: 400,
    height: 400,
  },
}
