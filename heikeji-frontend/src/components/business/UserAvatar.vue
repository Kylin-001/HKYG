<!--
@fileoverview 用户头像组件
@description 展示用户头像、状态指示、权限标识和在线状态
@example
  <UserAvatar
    :user="user"
    :size="'large'"
    :show-status="true"
    :show-badge="true"
  />
-->
<template>
  <div
    class="user-avatar"
    :class="[
      `size-${size}`,
      { 'with-status': showStatus, 'with-badge': showBadge, clickable: clickable },
    ]"
    @click="handleClick"
  >
    <div class="avatar-container">
      <!-- 头像图片 -->
      <el-avatar
        :src="user.avatarUrl"
        :size="avatarSize"
        :fit="fit"
        :round="round"
        class="main-avatar"
      >
        <template #default>
          {{ getInitials() }}
        </template>
      </el-avatar>

      <!-- 在线状态指示 -->
      <div
        v-if="showStatus"
        class="status-indicator"
        :class="[`status-${user.status || 'offline'}`, { 'status-pulse': pulseEffect }]"
      >
        <el-tooltip :content="getStatusText()" :placement="tooltipPlacement" :disabled="!tooltip">
          <div class="status-dot"></div>
        </el-tooltip>
      </div>

      <!-- 权限徽章 -->
      <div
        v-if="showBadge && user.role"
        class="permission-badge"
        :class="`role-${user.role.toLowerCase()}`"
      >
        <el-tooltip :content="getRoleText()" :placement="tooltipPlacement" :disabled="!tooltip">
          <el-icon :size="12"><component :is="getRoleIcon()" /></el-icon>
        </el-tooltip>
      </div>
    </div>

    <!-- 用户名 -->
    <div v-if="showName" class="user-name" :title="user.name">
      {{ user.name }}
    </div>

    <!-- 职位/头衔 -->
    <div v-if="showTitle && user.title" class="user-title" :title="user.title">
      {{ user.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  User as UserIcon,
  Star,
  Check,
  CirclePlus,
  CircleClose,
  Shield,
  UserFilled,
} from '@element-plus/icons-vue'

// 定义接口
interface User {
  id: string
  name: string
  avatarUrl?: string
  status?: 'online' | 'away' | 'busy' | 'offline'
  role?: 'admin' | 'manager' | 'user' | 'guest' | 'vip'
  title?: string
  [key: string]: any
}

// 定义组件属性
const props = defineProps<{
  // 用户数据
  user: User
  // 头像大小
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  // 是否显示在线状态
  showStatus?: boolean
  // 是否显示权限徽章
  showBadge?: boolean
  // 是否显示用户名
  showName?: boolean
  // 是否显示职位/头衔
  showTitle?: boolean
  // 头像裁剪方式
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  // 是否为圆形
  round?: boolean
  // 是否显示提示
  tooltip?: boolean
  // 提示位置
  tooltipPlacement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'
  // 是否可点击
  clickable?: boolean
  // 是否显示脉冲效果
  pulseEffect?: boolean
}>()

// 定义默认值
const defaultProps = {
  size: 'medium',
  showStatus: true,
  showBadge: true,
  showName: false,
  showTitle: false,
  fit: 'cover',
  round: true,
  tooltip: true,
  tooltipPlacement: 'top',
  clickable: false,
  pulseEffect: true,
}

// 合并默认值
const mergedProps = { ...defaultProps, ...props }

// 定义事件
const emit = defineEmits<{
  (e: 'click', user: User): void
  (e: 'avatar-error'): void
}>()

// 根据size获取实际头像尺寸
const avatarSize = computed(() => {
  const sizeMap: Record<string, number> = {
    small: 32,
    medium: 40,
    large: 56,
    xlarge: 80,
  }
  return sizeMap[mergedProps.size] || 40
})

// 获取用户姓名首字母
const getInitials = (): string => {
  if (!props.user.name) return 'U'
  return props.user.name.charAt(0).toUpperCase()
}

// 获取状态文本
const getStatusText = (): string => {
  const statusMap: Record<string, string> = {
    online: '在线',
    away: '离开',
    busy: '忙碌',
    offline: '离线',
  }
  return statusMap[props.user.status || 'offline']
}

// 获取角色文本
const getRoleText = (): string => {
  const roleMap: Record<string, string> = {
    admin: '管理员',
    manager: '经理',
    user: '用户',
    guest: '访客',
    vip: 'VIP',
  }
  return roleMap[props.user.role || 'user']
}

// 获取角色图标
const getRoleIcon = () => {
  const roleIconMap: Record<string, any> = {
    admin: Shield,
    manager: Star,
    user: UserIcon,
    guest: CirclePlus,
    vip: Check,
  }
  return roleIconMap[props.user.role || 'user'] || UserIcon
}

// 处理点击事件
const handleClick = () => {
  if (mergedProps.clickable) {
    emit('click', props.user)
  }
}
</script>

<style lang="scss" scoped>
.user-avatar {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: default;
  transition: all 0.3s ease;
  padding: 4px;
  border-radius: 8px;

  &.clickable {
    cursor: pointer;

    &:hover {
      background-color: #f5f7fa;
      transform: translateY(-1px);
    }
  }

  // 尺寸变体
  &.size-small {
    gap: 2px;

    .user-name {
      font-size: 12px;
    }

    .user-title {
      font-size: 11px;
    }
  }

  &.size-medium {
    gap: 4px;

    .user-name {
      font-size: 14px;
    }

    .user-title {
      font-size: 12px;
    }
  }

  &.size-large {
    gap: 6px;

    .user-name {
      font-size: 16px;
    }

    .user-title {
      font-size: 14px;
    }
  }

  &.size-xlarge {
    gap: 8px;

    .user-name {
      font-size: 18px;
    }

    .user-title {
      font-size: 15px;
    }
  }

  // 头像容器
  .avatar-container {
    position: relative;
    display: inline-block;

    .main-avatar {
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
    }

    // 状态指示
    .status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 14px;
      height: 14px;
      background-color: #fff;
      border-radius: 50%;
      border: 2px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      &.status-online {
        .status-dot {
          background-color: #67c23a;
          box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.3);
        }
      }

      &.status-away {
        .status-dot {
          background-color: #e6a23c;
          box-shadow: 0 0 0 2px rgba(230, 162, 60, 0.3);
        }
      }

      &.status-busy {
        .status-dot {
          background-color: #f56c6c;
          box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.3);
        }
      }

      &.status-offline {
        .status-dot {
          background-color: #909399;
          box-shadow: 0 0 0 2px rgba(144, 147, 153, 0.3);
        }
      }

      &.status-pulse {
        .status-dot {
          animation: pulse 2s infinite;
        }
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        transition: all 0.3s ease;
      }
    }

    // 权限徽章
    .permission-badge {
      position: absolute;
      top: 0;
      right: 0;
      width: 16px;
      height: 16px;
      background-color: #fff;
      border-radius: 50%;
      border: 2px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &.role-admin {
        background-color: #409eff;
        color: #fff;
      }

      &.role-manager {
        background-color: #67c23a;
        color: #fff;
      }

      &.role-user {
        background-color: #e6a23c;
        color: #fff;
      }

      &.role-guest {
        background-color: #909399;
        color: #fff;
      }

      &.role-vip {
        background-color: #f56c6c;
        color: #fff;
      }

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      }
    }
  }

  // 用户名
  .user-name {
    font-weight: 500;
    color: #303133;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
  }

  // 职位/头衔
  .user-title {
    color: #909399;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
  }
}

// 脉冲动画
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.4);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(103, 194, 58, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .user-avatar {
    .user-name,
    .user-title {
      max-width: 100px;
    }
  }
}
</style>
