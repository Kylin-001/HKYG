<template>
  <nav class="navbar-container">
    <div class="hamburger-container">
      <i class="el-icon-menu" @click="toggleSideBar"></i>
    </div>

    <!-- 校徽和校名区域 -->
    <div class="school-info">
      <div class="school-logo">
        <img
          src="@/assets/images/school-logo.svg"
          alt="黑龙江科技大学校徽"
          class="school-logo-img"
        />
      </div>
      <div class="school-name">
        <div class="name-main">黑龙江科技大学</div>
        <div class="name-sub">黑科易购校园电商平台</div>
      </div>
    </div>

    <div class="nav-wrapper">
      <div class="nav-left">
        <Breadcrumb />
      </div>
      <div class="nav-right">
        <div class="right-menu">
          <component v-if="item" :key="item" :is="item" v-for="item in rightMenuItems" />
        </div>
        <u-dropdown trigger="click">
          <template #default>
            <ul class="el-dropdown-menu">
              <li class="el-dropdown-menu__item" @click="logout">
                <i class="el-icon-switch-button" /> 退出登录
              </li>
            </ul>
          </template>
          <div class="user-info">
            <img :src="avatar" class="user-avatar" />
            <span class="user-name">{{ name }}</span>
            <i class="el-icon-arrow-down el-icon--right" />
          </div>
        </u-dropdown>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'

// 获取Pinia store实例
const appStore = useAppStore()
const userStore = useUserStore()

// 定义响应式变量
const rightMenuItems = ref([])

// 从Pinia获取状态
const sidebar = computed(() => appStore.sidebar)
const name = computed(() => userStore.userInfo?.nickname || userStore.userInfo?.username || '')
const avatar = computed(() => userStore.userInfo?.avatar || '')

// 切换侧边栏
const toggleSideBar = () => {
  appStore.toggleSidebar()
}

// 退出登录
const logout = () => {
  ElMessageBox.confirm('确定退出登录？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await userStore.logoutAction()
      location.reload()
    })
    .catch(() => {})
}

// 组件挂载
onMounted(() => {
  // 这里可以添加其他菜单项组件
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.navbar-container {
  height: $header-height;
  background: $primary;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 999;
  display: flex;
  align-items: center;
  color: #ffffff;
}

.hamburger-container {
  height: $header-height;
  width: 60px;
  line-height: $header-height;
  text-align: center;
  cursor: pointer;
  color: #ffffff;
  font-size: 20px;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* 校徽和校名样式 */
.school-info {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 100%;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.school-logo {
  margin-right: 15px;
}

.school-logo-img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  object-fit: contain;
}

.school-name {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.name-main {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  font-family: 'Microsoft YaHei', sans-serif;
  margin-bottom: 2px;
}

.name-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Microsoft YaHei', sans-serif;
}

.nav-wrapper {
  position: relative;
  height: 100%;
  flex: 1;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left {
  flex: 1;
  min-width: 0;
}

.nav-right {
  display: flex;
  align-items: center;
}

.right-menu {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 0 15px;
  cursor: pointer;
  height: $header-height;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  .user-name {
    margin: 0 8px;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #ffffff;
    font-size: 14px;
  }
  .el-icon-arrow-down {
    color: #ffffff;
  }
}

/* 面包屑样式调整 */
:deep(.breadcrumb-container) {
  color: #ffffff;
  .breadcrumb-item {
    color: rgba(255, 255, 255, 0.9);
    &:hover {
      color: #ffffff;
    }
  }
  .breadcrumb-separator {
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
