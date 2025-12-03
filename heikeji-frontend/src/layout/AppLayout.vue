/** * 应用布局组件 - 主入口布局 * 包含头部导航、侧边栏、主内容区域等 */

<template>
  <div class="app-layout">
    <!-- 顶部导航栏 -->
    <HeaderBar
      :collapsed="collapsed"
      :username="username"
      @toggle-sidebar="toggleSidebar"
      @toggle-mobile-menu="toggleMobileMenu"
      @handle-command="handleCommand"
    />

    <!-- 移动端侧边栏遮罩层 -->
    <div v-if="showMobileMenu" class="sidebar-mask" @click="closeMobileMenu"></div>

    <div class="main-layout">
      <!-- 侧边栏 -->
      <SideBar
        :collapsed="collapsed"
        :show-mobile="showMobileMenu"
        :routes="visibleRoutes"
        :submenu-open-status="subMenuOpenStatus"
        @toggle-submenu="toggleSubMenu"
      />

      <!-- 主内容区域 -->
      <MainContent
        :collapsed="collapsed"
        :breadcrumb-list="breadcrumbList"
        :cached-components="cachedComponents"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'pinia'
import HeaderBar from './components/HeaderBar.vue'
import SideBar from './components/SideBar.vue'
import MainContent from './components/MainContent.vue'
import logger from '@/utils/logger'
import { logout } from '@/api/login'
import { ElMessage } from 'element-plus'

// 组件名称
const name = 'AppLayout'

// 响应式状态
const collapsed = ref(false)
const subMenuOpenStatus = reactive<Record<string, boolean>>({})
const showMobileMenu = ref(false)
const componentCache = new Set<string>()
const performanceData = reactive({
  pageLoadTime: 0,
  renderTime: 0,
  requestCount: 0,
  responseTime: 0,
})

// 路由和状态管理
const router = useRouter()
const route = useRoute()
const store = useStore()

// 计算属性
const username = computed(() => {
  const userStore = store as any
  return userStore.state?.user?.username || ''
})

const permissionRoutes = computed(() => {
  const userStore = store as any
  return userStore.getters?.permission_routes || []
})

const breadcrumbList = computed(() => {
  // 生成面包屑导航列表
  const { matched } = route
  return matched.slice(1).map(item => ({
    title: item.meta.title,
    path: item.path,
  }))
})

// 性能优化：计算可见路由（过滤掉隐藏的路由）
const visibleRoutes = computed(() => {
  return permissionRoutes.value.filter((route: any) => !route.hidden)
})

// 可缓存的组件列表
const cachedComponents = computed(() => {
  return Array.from(componentCache)
})

// 防抖函数
const debounce = (func: Function, delay: number) => {
  let timeoutId: number | undefined
  return function (this: any, ...args: any[]) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay) as unknown as number
  }
}

// 节流函数
const throttle = (func: Function, delay: number) => {
  let lastCall = 0
  return function (this: any, ...args: any[]) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      return func.apply(this, args)
    }
  }
}

// 更新组件缓存
const updateComponentCache = (route: any) => {
  const routeName = route.name
  if (routeName && route.meta.keepAlive) {
    componentCache.add(routeName)

    // 限制缓存数量，防止内存泄漏
    if (componentCache.size > 20) {
      const firstItem = componentCache.values().next().value
      componentCache.delete(firstItem)
    }
  }
}

// 初始化用户信息
const initUserInfo = async () => {
  try {
    const userStore = store as any
    if (!userStore.getters?.username) {
      await userStore.dispatch('getCurrentUser')
    }
  } catch (error) {
    logger.error('获取用户信息失败:', error)
  }
}

// 初始化性能监控
const initPerformanceMonitor = () => {
  // 监控页面加载性能
  if (window.performance) {
    window.addEventListener('load', () => {
      const perfData = window.performance.getEntriesByType('navigation')[0]
      if (perfData) {
        performanceData.pageLoadTime = perfData.loadEventEnd - perfData.fetchStart
      }
    })
  }

  // 监控路由切换性能
  router.beforeEach((to, from, next) => {
    const startTime = performance.now()
    next()

    const unwatch = router.afterEach(() => {
      const endTime = performance.now()
      performanceData.renderTime = endTime - startTime
      unwatch() // 清理监听器
    })
  })
}

// 动画元素
const animateElements = () => {
  // 为页面元素添加进入动画
  const elements = document.querySelectorAll('.content-wrapper > *')
  elements.forEach((element, index) => {
    element.style.opacity = '0'
    element.style.transform = 'translateY(20px)'

    setTimeout(() => {
      element.style.transition = 'all 0.3s ease'
      element.style.opacity = '1'
      element.style.transform = 'translateY(0)'
    }, index * 100)
  })
}

// 处理动画
const handleAnimations = () => {
  // 使用requestAnimationFrame优化动画
  requestAnimationFrame(() => {
    // 这里可以添加初始动画逻辑
    animateElements()
  })
}

// 事件处理方法

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  collapsed.value = !collapsed.value
  if (import.meta.env.MODE === 'development') {
    logger.debug('侧边栏状态:', collapsed.value ? '折叠' : '展开')
  }
}

// 切换移动端菜单显示
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

// 关闭移动端菜单
const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// 切换子菜单展开状态
const toggleSubMenu = (path: string) => {
  subMenuOpenStatus[path] = !subMenuOpenStatus[path]
}

// 检查子菜单是否展开
const isSubMenuOpen = (path: string) => {
  return subMenuOpenStatus[path] || false
}

// 处理用户操作命令
const handleCommand = async (command: string) => {
  if (import.meta.env.MODE === 'development') {
    logger.debug('执行命令:', command)
  }

  switch (command) {
    case 'logout':
      await handleLogout()
      break
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
  }
}

// 处理退出登录
const handleLogout = async () => {
  try {
    ElMessage.success('正在退出登录...')
    await logout()
    const userStore = store as any
    await userStore.dispatch('logout')
    router.push('/login')
  } catch (error) {
    logger.error('退出登录失败:', error)
    ElMessage.error('退出登录失败')
  }
}

// 处理窗口大小变化
const handleResize = () => {
  const width = window.innerWidth
  if (width > 768) {
    showMobileMenu.value = false
  }

  // 根据屏幕宽度自动折叠侧边栏
  if (width <= 1024) {
    collapsed.value = true
  } else if (width > 1200) {
    collapsed.value = false
  }
}

// 监听路由变化
watch(
  () => route,
  newRoute => {
    closeMobileMenu()
    updateComponentCache(newRoute)
  },
  { immediate: true }
)

// 生命周期钩子
onMounted(() => {
  // 初始化用户信息
  initUserInfo()

  // 初始化性能监控
  initPerformanceMonitor()

  // 监听窗口大小变化（使用节流优化）
  const throttledResize = throttle(handleResize, 200)
  window.addEventListener('resize', throttledResize)

  // 初始化处理动画
  handleAnimations()

  // 组件卸载时清理
  onUnmounted(() => {
    window.removeEventListener('resize', throttledResize)
  })
})

// 暴露方法给父组件
defineExpose({
  toggleSidebar,
  handleCommand,
})
</script>

<style scoped lang="scss">
.app-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
  background-color: #f5f7fa;
}

// 移动端侧边栏遮罩层样式
.sidebar-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: none;
  animation: fadeIn 0.3s ease;

  @media (max-width: 768px) {
    display: block;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
