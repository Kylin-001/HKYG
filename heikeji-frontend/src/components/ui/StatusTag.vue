<!--
@fileoverview 状态标签组件
@description 支持多种预设样式、动画效果、颜色主题、可交互状态
@example
  <StatusTag type="success" effect="dark" size="large">
    成功
  </StatusTag>
-->
<template>
  <div
    class="status-tag"
    :class="[
      `status-tag--${type}`,
      `status-tag--${size}`,
      `status-tag--${effect}`,
      { 'status-tag--interactive': interactive, 'status-tag--round': round },
    ]"
    :style="customStyle"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 自定义图标 -->
    <ElIcon v-if="icon" class="status-tag__icon" :class="`status-tag__icon--${type}`">
      {{ icon }}
    </ElIcon>

    <!-- 标签内容 -->
    <span class="status-tag__content">
      <slot>{{ content }}</slot>
    </span>

    <!-- 关闭按钮 -->
    <ElIcon v-if="closable" class="status-tag__close" @click.stop="handleClose">
      <Close />
    </ElIcon>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { ElIcon } from 'element-plus'
import { Close } from '@element-plus/icons-vue'

// 定义接口
interface StatusTagProps {
  // 基础配置
  type?: 'success' | 'warning' | 'info' | 'danger' | 'primary' | 'secondary' | 'dark' | 'light'
  size?: 'large' | 'medium' | 'small' | 'mini'
  effect?: 'light' | 'dark' | 'plain' | 'filled'
  content?: string
  icon?: any
  // 交互配置
  closable?: boolean
  interactive?: boolean
  // 样式配置
  round?: boolean
  color?: string
  backgroundColor?: string
  borderColor?: string
}

// 定义组件属性
const props = withDefaults(defineProps<StatusTagProps>(), {
  type: 'info',
  size: 'medium',
  effect: 'light',
  content: '',
  closable: false,
  interactive: false,
  round: false,
  color: '',
  backgroundColor: '',
  borderColor: '',
})

// 定义事件
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
  (e: 'close', event: MouseEvent): void
  (e: 'mouseenter', event: MouseEvent): void
  (e: 'mouseleave', event: MouseEvent): void
}>()

// 计算自定义样式
const customStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.color) {
    style.color = props.color
  }

  if (props.backgroundColor) {
    style.backgroundColor = props.backgroundColor
  }

  if (props.borderColor) {
    style.borderColor = props.borderColor
  }

  return style
})

// 处理点击事件
const handleClick = (event: MouseEvent) => {
  emit('click', event)
}

// 处理关闭事件
const handleClose = (event: MouseEvent) => {
  emit('close', event)
}

// 处理鼠标进入事件
const handleMouseEnter = (event: MouseEvent) => {
  emit('mouseenter', event)
}

// 处理鼠标离开事件
const handleMouseLeave = (event: MouseEvent) => {
  emit('mouseleave', event)
}
</script>

<style lang="scss" scoped>
.status-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  box-sizing: border-box;
  transition: all 0.3s ease;
  cursor: default;
  user-select: none;

  // 标签图标
  &__icon {
    font-size: 12px;
    transition: all 0.3s ease;

    &--success {
      color: #67c23a;
    }

    &--warning {
      color: #e6a23c;
    }

    &--info {
      color: #909399;
    }

    &--danger {
      color: #f56c6c;
    }

    &--primary {
      color: #409eff;
    }

    &--secondary {
      color: #909399;
    }

    &--dark {
      color: #606266;
    }

    &--light {
      color: #909399;
    }
  }

  // 标签内容
  &__content {
    display: inline-block;
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  // 关闭按钮
  &__close {
    font-size: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0.7;

    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  // 尺寸变体
  &--large {
    padding: 6px 16px;
    font-size: 16px;

    .status-tag__icon {
      font-size: 16px;
    }

    .status-tag__close {
      font-size: 12px;
    }
  }

  &--medium {
    padding: 4px 12px;
    font-size: 14px;

    .status-tag__icon {
      font-size: 14px;
    }

    .status-tag__close {
      font-size: 12px;
    }
  }

  &--small {
    padding: 2px 8px;
    font-size: 12px;

    .status-tag__icon {
      font-size: 12px;
    }

    .status-tag__close {
      font-size: 10px;
    }
  }

  &--mini {
    padding: 1px 6px;
    font-size: 10px;

    .status-tag__icon {
      font-size: 10px;
    }

    .status-tag__close {
      font-size: 8px;
    }
  }

  // 效果变体
  &--light {
    &.status-tag--success {
      background-color: #f0f9eb;
      color: #67c23a;
      border: 1px solid #e1f3d8;
    }

    &.status-tag--warning {
      background-color: #fdf6ec;
      color: #e6a23c;
      border: 1px solid #faecd8;
    }

    &.status-tag--info {
      background-color: #ecf5ff;
      color: #909399;
      border: 1px solid #d9ecff;
    }

    &.status-tag--danger {
      background-color: #fef0f0;
      color: #f56c6c;
      border: 1px solid #fbc4c4;
    }

    &.status-tag--primary {
      background-color: #ecf5ff;
      color: #409eff;
      border: 1px solid #d9ecff;
    }

    &.status-tag--secondary {
      background-color: #f4f4f5;
      color: #909399;
      border: 1px solid #e9e9eb;
    }

    &.status-tag--dark {
      background-color: #f4f4f5;
      color: #606266;
      border: 1px solid #e9e9eb;
    }

    &.status-tag--light {
      background-color: #fafafa;
      color: #909399;
      border: 1px solid #e9e9eb;
    }
  }

  &--dark {
    &.status-tag--success {
      background-color: #67c23a;
      color: #fff;
      border: 1px solid #67c23a;
    }

    &.status-tag--warning {
      background-color: #e6a23c;
      color: #fff;
      border: 1px solid #e6a23c;
    }

    &.status-tag--info {
      background-color: #909399;
      color: #fff;
      border: 1px solid #909399;
    }

    &.status-tag--danger {
      background-color: #f56c6c;
      color: #fff;
      border: 1px solid #f56c6c;
    }

    &.status-tag--primary {
      background-color: #409eff;
      color: #fff;
      border: 1px solid #409eff;
    }

    &.status-tag--secondary {
      background-color: #909399;
      color: #fff;
      border: 1px solid #909399;
    }

    &.status-tag--dark {
      background-color: #606266;
      color: #fff;
      border: 1px solid #606266;
    }

    &.status-tag--light {
      background-color: #fafafa;
      color: #909399;
      border: 1px solid #e9e9eb;
    }
  }

  &--plain {
    background-color: transparent;

    &.status-tag--success {
      color: #67c23a;
      border: 1px solid #67c23a;
    }

    &.status-tag--warning {
      color: #e6a23c;
      border: 1px solid #e6a23c;
    }

    &.status-tag--info {
      color: #909399;
      border: 1px solid #909399;
    }

    &.status-tag--danger {
      color: #f56c6c;
      border: 1px solid #f56c6c;
    }

    &.status-tag--primary {
      color: #409eff;
      border: 1px solid #409eff;
    }

    &.status-tag--secondary {
      color: #909399;
      border: 1px solid #909399;
    }

    &.status-tag--dark {
      color: #606266;
      border: 1px solid #606266;
    }

    &.status-tag--light {
      color: #909399;
      border: 1px solid #e9e9eb;
    }
  }

  &--filled {
    &.status-tag--success {
      background-color: #67c23a;
      color: #fff;
      border: 1px solid transparent;
    }

    &.status-tag--warning {
      background-color: #e6a23c;
      color: #fff;
      border: 1px solid transparent;
    }

    &.status-tag--info {
      background-color: #909399;
      color: #fff;
      border: 1px solid transparent;
    }

    &.status-tag--danger {
      background-color: #f56c6c;
      color: #fff;
      border: 1px solid transparent;
    }

    &.status-tag--primary {
      background-color: #409eff;
      color: #fff;
      border: 1px solid transparent;
    }

    &.status-tag--secondary {
      background-color: #909399;
      color: #fff;
      border: 1px solid transparent;
    }

    &.status-tag--dark {
      background-color: #606266;
      color: #fff;
      border: 1px solid transparent;
    }

    &.status-tag--light {
      background-color: #fafafa;
      color: #909399;
      border: 1px solid transparent;
    }
  }

  // 可交互状态
  &--interactive {
    cursor: pointer;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }

  // 圆角样式
  &--round {
    border-radius: 20px;
  }

  // 禁用状态
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
