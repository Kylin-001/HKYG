<template>
  <el-drawer
    v-model="visible"
    :direction="direction"
    :size="size"
    :show-close="showClose"
    :with-header="withHeader"
    :title="title"
    :modal-class="modalClass"
    @close="handleClose"
  >
    <div class="mobile-menu-container">
      <div class="user-info" v-if="showUserInfo">
        <el-avatar :size="60" :src="userInfo?.avatar">
          {{ userInfo?.nickname?.charAt(0) || userInfo?.username?.charAt(0) || 'U' }}
        </el-avatar>
        <div class="user-details">
          <div class="username">{{ userInfo?.nickname || userInfo?.username || '未登录' }}</div>
          <div class="roles">{{ userInfo?.roles?.join(' / ') || '游客' }}</div>
        </div>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="false"
        :unique-opened="true"
        @select="handleMenuSelect"
      >
        <template v-for="route in menuRoutes" :key="route.path">
          <el-menu-item v-if="!route.children || route.children.length === 0" :index="route.path">
            <el-icon v-if="route.meta?.icon">
              <component :is="route.meta.icon" />
            </el-icon>
            <span>{{ route.meta?.title || route.name }}</span>
          </el-menu-item>

          <el-sub-menu v-else :index="route.path">
            <template #title>
              <el-icon v-if="route.meta?.icon">
                <component :is="route.meta.icon" />
              </el-icon>
              <span>{{ route.meta?.title || route.name }}</span>
            </template>
            <el-menu-item v-for="child in route.children" :key="child.path" :index="child.path">
              <el-icon v-if="child.meta?.icon">
                <component :is="child.meta.icon" />
              </el-icon>
              <span>{{ child.meta?.title || child.name }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>

      <div class="menu-footer" v-if="showFooter">
        <el-button type="danger" size="small" @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { SwitchButton } from '@element-plus/icons-vue'

interface MenuRoute {
  path: string
  name?: string
  meta?: {
    title?: string
    icon?: string
    hidden?: boolean
    [key: string]: unknown
  }
  children?: MenuRoute[]
}

interface Props {
  modelValue?: boolean
  routes?: MenuRoute[]
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt'
  size?: string | number
  showClose?: boolean
  withHeader?: boolean
  title?: string
  showUserInfo?: boolean
  showFooter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  routes: () => [],
  direction: 'ltr',
  size: '280px',
  showClose: true,
  withHeader: false,
  title: '',
  showUserInfo: true,
  showFooter: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  logout: []
}>()

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

const userInfo = computed(() => userStore.userInfo)

const activeMenu = computed(() => route.path)

const menuRoutes = computed(() => {
  return props.routes.filter(r => !r.meta?.hidden)
})

const handleClose = () => {
  emit('close')
}

const handleMenuSelect = (index: string) => {
  visible.value = false
  router.push(index)
}

const handleLogout = () => {
  visible.value = false
  emit('logout')
  userStore.logoutAction()
  router.push('/login')
}

watch(visible, val => {
  if (!val) {
    handleClose()
  }
})
</script>

<style scoped lang="scss">
.mobile-menu-container {
  display: flex;
  flex-direction: column;
  height: 100%;

  .user-info {
    display: flex;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;

    .user-details {
      margin-left: 15px;

      .username {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 5px;
      }

      .roles {
        font-size: 12px;
        opacity: 0.8;
      }
    }
  }

  .el-menu {
    flex: 1;
    border-right: none;
  }

  .menu-footer {
    padding: 20px;
    border-top: 1px solid #eee;

    .el-button {
      width: 100%;
    }
  }
}
</style>
