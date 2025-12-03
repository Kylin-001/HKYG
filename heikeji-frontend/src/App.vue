/** * 应用根组件 * 负责全局布局、路由监听、权限初始化等功能 */

<template>
  <div id="app">
    <!-- 登录页面路由视图 -->
    <router-view v-if="!isLoggedIn" key="login"></router-view>

    <!-- 主应用布局 -->
    <AppLayout
      v-else
      :collapsed="collapsed"
      :show-mobile="showMobile"
      :routes="permissionRoutes"
      :submenu-open-status="submenuOpenStatus"
      @toggle-submenu="handleToggleSubmenu"
    >
      <!-- 面包屑导航 -->
      <template #breadcrumb>
        <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
      </template>

      <!-- 主内容区域 -->
      <template #main-content>
        <!-- 页面过渡动画 -->
        <transition name="fade-transform" mode="out-in">
          <router-view :key="routeKey" v-slot="{ Component }">
            <keep-alive :include="cachedComponentList">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </transition>
      </template>
    </AppLayout>

    <!-- 移动端侧边栏遮罩层 -->
    <div v-if="showMobile && collapsed" class="sidebar-mask" @click="toggleMobileMenu"></div>

    <!-- 性能监控仪表板 (仅在开发环境显示) -->
    <div v-if="showPerformanceMonitor" class="performance-monitor">
      <h3>性能监控</h3>
      <div class="metric">
        <span>内存使用:</span>
        <span>{{ (performanceData.usedJSHeapSize / 1024 / 1024).toFixed(2) }} MB</span>
      </div>
      <div class="metric">
        <span>DOM节点:</span>
        <span>{{ performanceData.domNodes }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import AppLayout from '@/layout/AppLayout.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { debounce } from '@/utils/common'
import logger from '@/utils/logger'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义TypeScript接口
interface BreadcrumbItem {
  path: string
  name: string
  icon: string
}

interface PerformanceData {
  usedJSHeapSize: number
  domNodes: number
}

interface PerformanceHelper {
  showPerformanceMonitor: () => void
  clearCache: () => void
  toggleCollapsed: () => void
}

// 扩展window对象
declare global {
  interface Window {
    performanceHelper?: PerformanceHelper
  }
}

// 定义组件名称
const name = 'App'

// 路由和状态管理
const router = useRouter()
const route = useRoute()
const store = useStore()

// 布局状态
const collapsed = ref(false)
const showMobile = ref(false)

// 子菜单状态
const submenuOpenStatus = reactive<Record<string, boolean>>({})

// 组件缓存
const cachedComponentSet = new Set(['UserProfile', 'ProductList'])
const cachedComponentList = ref(['UserProfile', 'ProductList'])

// 性能监控数据
const performanceData = reactive<PerformanceData>({
  usedJSHeapSize: 0,
  domNodes: 0,
})
const showPerformanceMonitor = ref(false)
let performanceTimer: number | null = null

// 响应式断点
const breakpoints = {
  mobile: 768,
}

// 从Vuex获取状态
const userInfo = computed(() => store.getters['user/userInfo'])
const token = computed(() => store.getters['user/token'])
const routes = computed(() => store.getters['permission/routes'])
const permissionRoutes = computed(() => store.getters['permission/permissionRoutes'])

// 登录状态
const isLoggedIn = computed(() => !!token.value)

// 用户名
const username = computed(() => userInfo.value?.username || '')

// 路由唯一标识，用于页面切换
const routeKey = computed(() => route.fullPath)

// 面包屑导航
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const matched = route.matched.filter(item => item.name)
  const breadcrumbs: BreadcrumbItem[] = []

  matched.forEach(route => {
    const breadcrumb: BreadcrumbItem = {
      path: route.path,
      name: route.meta?.title || (route.name as string),
      icon: route.meta?.icon || '',
    }
    breadcrumbs.push(breadcrumb)
  })

  return breadcrumbs.length > 1 ? breadcrumbs : []
})

// 当前可见的路由
const visibleRoutes = computed(() => {
  return permissionRoutes.value.filter(route => !route.hidden)
})

// 防抖函数
let debouncedResizeHandler: ((this: Window, ev: UIEvent) => void) | null = null

// 路由变化监听
watch(
  route,
  (to, from) => {
    // 关闭移动端菜单
    showMobile.value = false

    // 路由懒加载预加载
    preloadNextRoute(to)

    // 更新页面标题
    updatePageTitle()
  },
  { deep: true }
)

// 监听侧边栏折叠状态变化
watch(collapsed, newVal => {
  if (newVal) {
    // 折叠时关闭所有子菜单
    Object.keys(submenuOpenStatus).forEach(key => {
      submenuOpenStatus[key] = false
    })
  }
})

/**
 * 初始化用户信息和权限
 */
const initializeUser = async () => {
  try {
    // 获取用户信息
    await store.dispatch('user/getUserInfo')

    // 获取权限路由
    await store.dispatch('permission/getPermissionRoutes')

    logger.info('用户信息和权限初始化完成')
  } catch (error: any) {
    logger.error('初始化用户信息失败:', error)

    // 如果token无效，清除登录状态
    if (error.code === 401 || error.status === 401) {
      store.dispatch('user/logout')
      router.push('/login')
    }
  }
}

/**
 * 初始化性能辅助函数
 */
const initializePerformanceHelpers = () => {
  // 在全局对象上挂载性能监控函数
  if (process.env.NODE_ENV === 'development') {
    window.performanceHelper = {
      showPerformanceMonitor: () => {
        showPerformanceMonitor.value = !showPerformanceMonitor.value
      },
      clearCache: () => {
        cachedComponentSet.clear()
        cachedComponentList.value = []
        logger.info('组件缓存已清空')
      },
      toggleCollapsed: () => {
        collapsed.value = !collapsed.value
      },
    }
  }
}

/**
 * 初始化组件缓存
 */
const initializeCache = () => {
  // 从localStorage恢复缓存状态
  const cached = localStorage.getItem('cachedComponents')
  if (cached) {
    try {
      const cachedList = JSON.parse(cached)
      cachedComponentSet.clear()
      cachedList.forEach((item: string) => cachedComponentSet.add(item))
      cachedComponentList.value = cachedList
    } catch (error) {
      logger.error('恢复缓存状态失败:', error)
    }
  }
}

/**
 * 启动性能监控
 */
const startPerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'development') {
    performanceTimer = window.setInterval(() => {
      updatePerformanceData()
    }, 5000)
  }
}

/**
 * 停止性能监控
 */
const stopPerformanceMonitoring = () => {
  if (performanceTimer) {
    clearInterval(performanceTimer)
    performanceTimer = null
  }
}

/**
 * 更新性能数据
 */
const updatePerformanceData = () => {
  if (performance.memory) {
    performanceData.usedJSHeapSize = performance.memory.usedJSHeapSize
  }
  performanceData.domNodes = document.querySelectorAll('*').length
}

/**
 * 预加载下一个路由组件
 */
const preloadNextRoute = (route: any) => {
  // 获取当前路由的下一个兄弟路由
  const currentIndex = visibleRoutes.value.findIndex(r => r.path === route.path)
  if (currentIndex >= 0 && currentIndex < visibleRoutes.value.length - 1) {
    const nextRoute = visibleRoutes.value[currentIndex + 1]
    // 预加载组件 (仅在开发环境)
    if (process.env.NODE_ENV === 'development' && nextRoute.component) {
      import(`@/views/${nextRoute.component}`)
    }
  }
}

/**
 * 更新页面标题
 */
const updatePageTitle = () => {
  const title = route.meta?.title || '黑科易购'
  document.title = title ? `${title} - 黑科易购` : '黑科易购'
}

/**
 * 处理窗口大小变化
 */
const handleResize = () => {
  const width = window.innerWidth
  showMobile.value = width < breakpoints.mobile

  // 在移动端自动折叠侧边栏
  if (showMobile.value) {
    collapsed.value = true
  }
}

/**
 * 切换子菜单展开状态
 */
const handleToggleSubmenu = (path: string) => {
  submenuOpenStatus[path] = !submenuOpenStatus[path]
}

/**
 * 切换移动端菜单显示状态
 */
const toggleMobileMenu = () => {
  showMobile.value = !showMobile.value
}

/**
 * 切换侧边栏折叠状态
 */
const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

/**
 * 退出登录
 */
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      store.dispatch('user/logout')
      ElMessage.success('退出成功')
      router.push('/login')
    })
    .catch(() => {
      // 用户取消退出
    })
}

// 组件挂载
onMounted(async () => {
  // 初始化防抖函数
  debouncedResizeHandler = debounce(handleResize, 300)

  // 监听窗口大小变化
  window.addEventListener('resize', debouncedResizeHandler)

  // 初始化用户信息和权限
  await initializeUser()

  // 初始化响应式布局
  handleResize()

  // 初始化组件缓存
  initializeCache()

  // 初始化性能辅助函数
  initializePerformanceHelpers()

  // 监听性能指标变化
  startPerformanceMonitoring()
})

// 组件卸载前清理
onBeforeUnmount(() => {
  // 清理事件监听
  if (debouncedResizeHandler) {
    window.removeEventListener('resize', debouncedResizeHandler)
  }
  stopPerformanceMonitoring()
})
</script>

<style lang="scss">
// 全局样式
#app {
  font-family:
    'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
    Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  overflow: hidden;
}

// 移动端侧边栏遮罩层
.sidebar-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  transition: opacity 0.3s;
}

// 性能监控仪表板
.performance-monitor {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;

  h3 {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #333;
  }

  .metric {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 12px;
    color: #666;

    span:last-child {
      font-weight: 500;
      color: #333;
    }
  }
}

// 页面过渡动画
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

// 响应式设计
@media (max-width: 768px) {
  #app {
    font-size: 14px;
  }
}
</style>
