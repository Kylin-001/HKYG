/** * 头部导航栏组件 * 包含logo、用户信息、菜单按钮等 */

<template>
  <header class="main-header">
    <div class="header-left">
      <!-- 桌面端侧边栏折叠按钮 -->
      <el-button
        type="text"
        @click="$emit('toggle-sidebar')"
        class="sidebar-toggle mobile-friendly"
      >
        <i class="el-icon-s-fold"></i>
      </el-button>

      <!-- 移动端菜单按钮 -->
      <el-button
        type="text"
        @click="$emit('toggle-mobile-menu')"
        class="mobile-menu-btn mobile-friendly"
      >
        <i class="el-icon-menu"></i>
      </el-button>

      <div class="logo">
        <h1>黑科易购校园服务平台管理系统</h1>
      </div>
    </div>

    <div class="header-right">
      <!-- 用户信息下拉菜单 -->
      <el-dropdown trigger="click" @command="debouncedHandleCommand">
        <span class="user-info">
          <i class="el-icon-user" style="font-size: 24px; margin-right: 8px"></i>
          <span>{{ username || '管理员' }}</span>
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="profile">
            <i class="el-icon-user"></i>
            个人中心
          </el-dropdown-item>
          <el-dropdown-item command="settings">
            <i class="el-icon-setting"></i>
            系统设置
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
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
import { debounce } from '@/utils/helper'
const debouncedHandleCommand = debounce(handleCommand, 200)
</script>

<style scoped lang="scss">
.main-header {
  height: $header-height;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .header-left {
    display: flex;
    align-items: center;

    .sidebar-toggle {
      font-size: 20px;
      margin-right: 20px;
      color: #606266;
      padding: 8px;
      border-radius: 4px;
      transition: all 0.2s;

      &:hover {
        color: $primary-color;
        background-color: #f5f7fa;
      }

      // 在移动端隐藏桌面端的折叠按钮
      @media (max-width: 768px) {
        display: none;
      }
    }

    // 移动端菜单按钮
    .mobile-menu-btn {
      font-size: 20px;
      margin-right: 10px;
      color: #606266;
      padding: 8px;
      border-radius: 4px;
      transition: all 0.2s;
      display: none;

      &:hover {
        color: $primary-color;
        background-color: #f5f7fa;
      }

      // 在移动端显示
      @media (max-width: 768px) {
        display: block;
      }
    }

    .logo {
      h1 {
        font-size: 20px;
        font-weight: 500;
        color: $primary-color;
        margin: 0;

        @media (max-width: 768px) {
          font-size: 16px;
        }

        @media (max-width: 480px) {
          font-size: 14px;
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

      &:hover {
        background-color: #f5f7fa;
      }

      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        margin-right: 8px;
        border: 1px solid #e0e0e0;
      }

      span {
        margin-right: 4px;
        font-weight: 500;
      }

      i {
        font-size: 12px;
        color: #909399;
        transition: transform 0.2s;
      }

      &:hover i {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
