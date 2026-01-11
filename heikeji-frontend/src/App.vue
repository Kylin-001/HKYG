/** * 应用根组件 * 负责全局布局、路由监听、权限初始化等功能 */

<template>
  <div id="app">
    <!-- 无障碍支持：跳过导航链接 -->
    <a href="#main-content" class="skip-link">跳过导航，直接进入内容</a>
    
    <!-- 登录页面路由视图 -->
    <router-view v-if="!isLoggedIn" key="login"></router-view>

    <!-- App端布局 -->
    <AppLayoutApp v-else-if="isAppRoute" />

    <!-- PC端主应用布局 -->
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
        <div id="main-content" tabindex="-1">
          <!-- 页面过渡动画 -->
          <PageTransition type="slide" :duration="300" direction="left" :route="route">
            <router-view :key="routeKey" v-slot="{ Component }">
              <keep-alive :include="cachedComponentList">
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </PageTransition>
        </div>
      </template>
    </AppLayout>

    <!-- 移动端侧边栏遮罩层 -->
    <div
      v-if="showMobile && collapsed && !isAppRoute"
      class="sidebar-mask"
      @click="toggleMobileMenu"
    ></div>

    <!-- 性能监控组件 -->
    <PerformanceMonitor
      :enabled="true"
      :sample-rate="1.0"
      :show-panel="isLoggedIn"
      :auto-expand="false"
      :monitor-resources="true"
      :monitor-requests="true"
      :monitor-user-actions="true"
      :monitor-errors="true"
      :report-interval="30000"
      @performance-data="handlePerformanceData"
      @error="handlePerformanceError"
      @request-finished="handleRequestFinished"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { useThemeStore } from '@/store/modules/theme'
import AppLayout from '@/layout/AppLayout.vue'
import AppLayoutApp from '@/layout/AppLayoutApp.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import PerformanceMonitor from '@/components/business/PerformanceMonitor.vue'
import PageTransition from '@/components/ui/PageTransition.vue'
import { debounce } from '@/utils/common'
import logger from '@/utils/logger'

// 定义TypeScript接口
interface BreadcrumbItem {
  path: string
  name: string
  icon: string
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

// 路由和状态管理
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const permissionStore = usePermissionStore()
const themeStore = useThemeStore()

// 布局状态
const collapsed = ref(false)
const showMobile = ref(false)

// 子菜单状态
const submenuOpenStatus = reactive<Record<string, boolean>>({})

// 组件缓存 - 基于路由元信息的动态缓存配置
const cachedComponentSet = ref(new Set(['UserProfile', 'ProductList', 'Dashboard', 'ProductList', 'OrderList', 'UserList']))
const cachedComponentList = ref(['UserProfile', 'ProductList', 'Dashboard', 'ProductList', 'OrderList', 'UserList'])

// 响应式断点
const breakpoints = {
  mobile: 768,
}

// 从Pinia获取状态
const token = computed(() => userStore.token)
const permissionRoutes = computed(() => permissionStore.routes)

// 登录状态
const isLoggedIn = computed(() => !!token.value)

// 是否为App端路由
const isAppRoute = computed(() => route.path.startsWith('/app'))

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
  to => {
    // 关闭移动端菜单
    showMobile.value = false

    // 路由懒加载预加载
    preloadNextRoute(to)

    // 更新页面标题
    updatePageTitle()

    // 根据路由元信息更新组件缓存
    updateComponentCache(to)
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
    await userStore.getUserInfoAction()

    // 获取权限路由
    await permissionStore.generateRoutes()

    logger.info('用户信息和权限初始化完成')
  } catch (error: any) {
    logger.error('初始化用户信息失败:', error)

    // 如果token无效，清除登录状态
    if (error.code === 401 || error.status === 401) {
      userStore.logoutAction()
      router.push('/login')
    }
  }
}

/**
 * 更新组件缓存列表
 * @param route 当前路由对象
 */
const updateComponentCache = (route: any) => {
  // 如果路由配置了keepAlive，则自动添加到缓存列表
  if (route.meta?.keepAlive && route.name) {
    if (!cachedComponentSet.value.has(route.name as string)) {
      cachedComponentSet.value.add(route.name as string)
      cachedComponentList.value = Array.from(cachedComponentSet.value)
      localStorage.setItem('cachedComponents', JSON.stringify(cachedComponentList.value))
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
      cachedComponentSet.value.clear()
      cachedList.forEach((item: string) => cachedComponentSet.value.add(item))
      cachedComponentList.value = cachedList
    } catch (error) {
      logger.error('恢复缓存状态失败:', error)
    }
  } else {
    // 默认缓存常用组件
    const defaultCache = ['UserProfile', 'ProductList', 'Dashboard', 'ProductList', 'OrderList', 'UserList']
    cachedComponentSet.value = new Set(defaultCache)
    cachedComponentList.value = defaultCache
    localStorage.setItem('cachedComponents', JSON.stringify(defaultCache))
  }
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
 * 处理性能监控数据
 */
const handlePerformanceData = (data: any) => {
  if (process.env.NODE_ENV === 'development') {
    logger.info('性能监控数据:', data)
    // 可以在这里添加性能数据上报逻辑
  }
}

/**
 * 处理性能监控错误
 */
const handlePerformanceError = (error: any) => {
  if (process.env.NODE_ENV === 'development') {
    logger.error('性能监控错误:', error)
  }
}

/**
 * 处理请求完成事件
 */
const handleRequestFinished = (request: any) => {
  if (process.env.NODE_ENV === 'development' && request.status >= 400) {
    logger.warn('请求失败:', request)
  }
}

// 导入图片预加载工具
import { preloadVisibleImages } from '@/utils/image-preloader'

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

  // 初始化主题
  themeStore.loadTheme()

  // 预加载可见区域的图片
  preloadVisibleImages({
    priority: 'high',
    onAllComplete: () => {
      if (import.meta.env.MODE === 'development') {
        logger.log('可见区域图片预加载完成')
      }
    }
  })
})

// 组件卸载前清理
onBeforeUnmount(() => {
  // 清理事件监听
  if (debouncedResizeHandler) {
    window.removeEventListener('resize', debouncedResizeHandler)
  }
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
