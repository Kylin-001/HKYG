/** * 头部导航栏组件 * 包含logo、用户信息、菜单按钮等 */

<template>
  <header class="main-header">
    <div class="header-left">
      <!-- 桌面端侧边栏折叠按钮 -->
      <el-button
        type="text"
        @click="$emit('toggle-sidebar')"
        class="sidebar-toggle mobile-friendly hover-glow click-scale"
      >
        <i class="el-icon-s-fold"></i>
      </el-button>

      <!-- 移动端菜单按钮 -->
      <el-button
        type="text"
        @click="$emit('toggle-mobile-menu')"
        class="mobile-menu-btn mobile-friendly hover-glow click-scale"
      >
        <i class="el-icon-menu"></i>
      </el-button>

      <div class="logo">
        <h1>黑科易购校园服务平台管理系统</h1>
      </div>
    </div>

    <div class="header-right">
      <!-- 主题切换 -->
      <ThemeManager class="theme-switcher hover-glow click-scale"></ThemeManager>

      <!-- 用户信息下拉菜单 -->
      <el-dropdown trigger="click" @command="debouncedHandleCommand">
        <span class="user-info hover-glow click-scale">
          <i class="el-icon-user" style="font-size: 24px; margin-right: 8px"></i>
          <span>{{ username || '管理员' }}</span>
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="list-item-enter-active">
          <el-dropdown-item command="profile" class="hover-scale">
            <i class="el-icon-user"></i>
            个人中心
          </el-dropdown-item>
          <el-dropdown-item command="settings" class="hover-scale">
            <i class="el-icon-setting"></i>
            系统设置
          </el-dropdown-item>
          <el-dropdown-item divided command="logout" class="hover-scale">
            <i class="el-icon-switch-button"></i>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
// 组件名称
const name = 'HeaderBar'

// Props定义
interface Props {
  collapsed: boolean
  username: string
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  username: '',
})

// Emits定义
const emit = defineEmits<{
  'toggle-sidebar': []
  'toggle-mobile-menu': []
  'handle-command': [command: string]
}>()

// 方法
const handleCommand = (command: string) => {
  emit('handle-command', command)
}

// 引入防抖函数
import { debounce } from '@/utils/index'
const debouncedHandleCommand = debounce(handleCommand, 200)

// 引入主题管理器组件
import ThemeManager from '@/components/ui/ThemeManager.vue'
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.main-header {
  height: $header-height;
  background-color: $primary;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: sticky;

  .theme-switcher {
    margin-right: 20px;
  }
}
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  .header-left {
    display: flex;
    align-items: center;

    .sidebar-toggle,
    .mobile-menu-btn {
      font-size: 20px;
      margin-right: 15px;
      color: #ffffff;
      padding: 8px;
      border-radius: 4px;
      transition: all 0.2s;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    // 桌面端侧边栏折叠按钮
    .sidebar-toggle {
      // 在移动端隐藏桌面端的折叠按钮
      @media (max-width: 768px) {
        display: none;
      }
    }

    // 移动端菜单按钮
    .mobile-menu-btn {
      display: none;

      // 在移动端显示
      @media (max-width: 768px) {
        display: block;
      }
    }

    .logo {
      h1 {
        font-size: 20px;
        font-weight: 600;
        color: #ffffff;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        @media (max-width: 768px) {
          font-size: 16px;
        }

        @media (max-width: 480px) {
          font-size: 14px;
          max-width: 180px;
        }
      }
    }
  }

  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 4px;
      transition: all 0.2s;
      font-size: 14px;
      color: #ffffff;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        margin-right: 8px;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      span {
        margin-right: 4px;
        font-weight: 500;
        color: #ffffff;
      }

      i {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        transition: transform 0.2s;
      }

      &:hover i {
        transform: rotate(180deg);
      }
    }
  }
}

// 下拉菜单样式调整
:deep(.el-dropdown-menu) {
  background-color: rgba(0, 51, 102, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  .el-dropdown-item {
    color: #ffffff;
    transition: all 0.2s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &.is-divided::before {
      background-color: rgba(255, 255, 255, 0.2);
    }

    i {
      color: #ffffff;
      margin-right: 8px;
    }
  }
}
</style>
