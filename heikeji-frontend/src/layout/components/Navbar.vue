<template>
  <nav class="navbar-container">
    <div class="hamburger-container">
      <i class="el-icon-menu" @click="toggleSideBar"></i>
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
import { useStore } from 'vuex'
import { ElMessageBox } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb'

const store = useStore()

// 定义响应式变量
const rightMenuItems = ref([])

// 从Vuex获取状态
const sidebar = computed(() => store.getters['sidebar'])
const name = computed(() => store.getters['name'])
const avatar = computed(() => store.getters['avatar'])

// 切换侧边栏
const toggleSideBar = () => {
  store.dispatch('app/toggleSideBar')
}

// 退出登录
const logout = () => {
  ElMessageBox.confirm('确定退出登录？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      store.dispatch('user/logout').then(() => {
        location.reload()
      })
    })
    .catch(() => {})
}

// 组件挂载
onMounted(() => {
  // 这里可以添加其他菜单项组件
})
</script>

<style lang="scss" scoped>
.navbar-container {
  height: 50px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: relative;
  z-index: 999;
}

.hamburger-container {
  position: absolute;
  left: 0;
  top: 0;
  height: 50px;
  width: 50px;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background: #f5f7fa;
  }
}

.nav-wrapper {
  position: relative;
  height: 100%;
  margin-left: 50px;
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
}

.user-info {
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  height: 50px;
  &:hover {
    background: #f5f7fa;
  }
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  .user-name {
    margin: 0 8px;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
