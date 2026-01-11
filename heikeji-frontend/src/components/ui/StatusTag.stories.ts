import type { Meta, StoryObj } from '@storybook/vue3-vite'
import StatusTag from './StatusTag.vue'

const meta = {
  title: 'UI/StatusTag',
  component: StatusTag,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['success', 'warning', 'danger', 'info', 'default'],
      description: '状态类型',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '标签大小',
    },
    shape: {
      control: 'select',
      options: ['default', 'round'],
      description: '标签形状',
    },
    showIcon: {
      control: 'boolean',
      description: '是否显示图标',
    },
  },
  args: {
    label: '状态标签',
    status: 'default',
    size: 'medium',
    shape: 'default',
    showIcon: false,
  },
} satisfies Meta<typeof StatusTag>

export default meta
type Story = StoryObj<typeof meta>

// 基础用法
export const Default: Story = {
  args: {
    label: '默认状态',
  },
}

// 成功状态
export const Success: Story = {
  args: {
    label: '成功状态',
    status: 'success',
    showIcon: true,
  },
}

// 警告状态
export const Warning: Story = {
  args: {
    label: '警告状态',
    status: 'warning',
    showIcon: true,
  },
}

// 危险状态
export const Danger: Story = {
  args: {
    label: '危险状态',
    status: 'danger',
    showIcon: true,
  },
}

// 信息状态
export const Info: Story = {
  args: {
    label: '信息状态',
    status: 'info',
    showIcon: true,
  },
}

// 不同大小
export const Small: Story = {
  args: {
    label: '小尺寸',
    size: 'small',
    status: 'success',
  },
}

export const Large: Story = {
  args: {
    label: '大尺寸',
    size: 'large',
    status: 'success',
  },
}

// 圆形样式
export const Round: Story = {
  args: {
    label: '圆形样式',
    shape: 'round',
    status: 'success',
    showIcon: true,
  },
}

// 自定义颜色
export const CustomColor: Story = {
  args: {
    label: '自定义颜色',
    status: 'default',
    style: { backgroundColor: '#6c757d', color: '#fff' },
  },
}
