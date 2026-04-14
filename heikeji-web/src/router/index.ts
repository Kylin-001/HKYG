import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackPrefetch: true */ '@/views/home/Index.vue'),
    meta: { title: '首页 - 黑科易购', transition: 'page-fade' },
  },

  // ====== 认证模块 ======
  {
    path: '/auth',
    component: () => import('@/views/auth/Layout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue'),
        meta: { title: '登录', requiresAuth: false },
      },

      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/views/auth/ForgotPassword.vue'),
        meta: { title: '找回密码', requiresAuth: false },
      },
    ],
  },

  // ====== 商品模块 ======
  {
    path: '/products',
    component: () => import(/* webpackPrefetch: true */ '@/views/products/Layout.vue'),
    children: [
      {
        path: '',
        name: 'ProductList',
        component: () => import(/* webpackPrefetch: true */ '@/views/products/List.vue'),
        meta: { title: '商品列表', transition: 'page-fade' },
      },
      {
        path: ':id',
        name: 'ProductDetail',
        component: () => import('@/views/products/Detail.vue'),
        meta: { title: '商品详情', transition: 'page-slide' },
      },
      {
        path: 'category/:categoryId',
        name: 'CategoryProducts',
        component: () => import('@/views/products/List.vue'),
        meta: { title: '分类商品', transition: 'page-fade' },
      },
    ],
  },

  // ====== 购物车模块 ======
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/cart/Index.vue'),
    meta: { title: '购物车', requiresAuth: true },
  },

  // ====== 订单模块 ======
  {
    path: '/orders',
    component: () => import('@/views/orders/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'OrderList',
        component: () => import('@/views/orders/List.vue'),
        meta: { title: '我的订单', transition: 'page-fade' },
      },
      {
        path: ':id',
        name: 'OrderDetail',
        component: () => import('@/views/orders/Detail.vue'),
        meta: { title: '订单详情', transition: 'page-slide' },
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('@/views/orders/Checkout.vue'),
        meta: { title: '结算' },
      },
      {
        path: 'payment/:orderId',
        name: 'Payment',
        component: () => import('@/views/orders/Payment.vue'),
        meta: { title: '支付' },
      },
      {
        path: 'success',
        name: 'OrderSuccess',
        component: () => import('@/views/orders/OrderSuccess.vue'),
        meta: { title: '支付成功' },
      },
    ],
  },

  // ====== 外卖模块 ======
  {
    path: '/takeout',
    component: () => import('@/views/takeout/Layout.vue'),
    children: [
      {
        path: '',
        name: 'TakeoutHome',
        component: () => import('@/views/takeout/Home.vue'),
        meta: { title: '外卖首页', transition: 'page-fade' },
      },
      {
        path: 'merchant/:merchantId',
        name: 'MerchantDetail',
        component: () => import('@/views/takeout/MerchantDetail.vue'),
        meta: { title: '商家详情', transition: 'page-slide' },
      },
      {
        path: 'track/:orderId',
        name: 'DeliveryTrack',
        component: () => import('@/views/takeout/DeliveryTrack.vue'),
        meta: { title: '配送追踪' },
      },
    ],
  },

  // ====== 二手市场模块 ======
  {
    path: '/secondhand',
    component: () => import('@/views/secondhand/Layout.vue'),
    children: [
      {
        path: '',
        name: 'SecondhandList',
        component: () => import('@/views/secondhand/List.vue'),
        meta: { title: '二手市场', transition: 'page-fade' },
      },
      {
        path: ':id',
        name: 'SecondhandDetail',
        component: () => import('@/views/secondhand/Detail.vue'),
        meta: { title: '商品详情', transition: 'page-slide' },
      },
      {
        path: 'publish',
        name: 'PublishSecondhand',
        component: () => import('@/views/secondhand/Publish.vue'),
        meta: { title: '发布闲置', requiresAuth: true },
      },
    ],
  },

  // ====== 学工办理模块 ======
  {
    path: '/student-affairs',
    component: () => import(/* webpackPrefetch: true */ '@/views/studentAffairs/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'StudentAffairsHome',
        component: () => import('@/views/studentAffairs/Overview.vue'),
        meta: { title: '学工办理' },
      },
      {
        path: 'leave',
        name: 'LeaveApplication',
        component: () => import('@/views/studentAffairs/Leave.vue'),
        meta: { title: '请假申请', requiresAuth: true },
      },
      {
        path: 'aid',
        name: 'AidApplication',
        component: () => import('@/views/studentAffairs/Aid.vue'),
        meta: { title: '助学金申请', requiresAuth: true },
      },
      {
        path: 'military',
        name: 'MilitaryUniform',
        component: () => import('@/views/studentAffairs/Military.vue'),
        meta: { title: '军训服装预定' },
      },
      {
        path: 'campus-card',
        name: 'CampusCardService',
        component: () => import('@/views/studentAffairs/CampusCard.vue'),
        meta: { title: '校园卡服务', requiresAuth: true },
      },
      {
        path: 'policy',
        name: 'AidPolicy',
        component: () => import('@/views/studentAffairs/Policy.vue'),
        meta: { title: '资助政策' },
      },
    ],
  },

  // ====== 缴费中心模块 ======
  {
    path: '/payment',
    component: () => import(/* webpackPrefetch: true */ '@/views/payment/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'PaymentHome',
        component: () => import('@/views/payment/Overview.vue'),
        meta: { title: '缴费中心' },
      },
      {
        path: 'tuition',
        name: 'TuitionPayment',
        component: () => import('@/views/payment/Tuition.vue'),
        meta: { title: '学费缴纳', requiresAuth: true },
      },
      {
        path: 'dormitory-fee',
        name: 'DormitoryFee',
        component: () => import('@/views/payment/DormitoryFee.vue'),
        meta: { title: '住宿费缴纳', requiresAuth: true },
      },
      {
        path: 'records',
        name: 'PaymentRecords',
        component: () => import('@/views/payment/Records.vue'),
        meta: { title: '缴费记录' },
      },
      {
        path: 'green-channel',
        name: 'GreenChannel',
        component: () => import('@/views/payment/GreenChannel.vue'),
        meta: { title: '绿色通道' },
      },
    ],
  },

  // ====== 信息公告模块 ======
  {
    path: '/announcements',
    component: () => import('@/views/announcements/Layout.vue'),
    children: [
      {
        path: '',
        name: 'AnnouncementList',
        component: () => import('@/views/announcements/List.vue'),
        meta: { title: '信息公告' },
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('@/views/announcements/Notifications.vue'),
        meta: { title: '通知中心' },
      },
    ],
  },

  // ====== 校园服务模块 ======
  {
    path: '/campus',
    component: () => import('@/views/campus/Layout.vue'),
    children: [
      {
        path: '',
        name: 'CampusHome',
        component: () => import('@/views/campus/Home.vue'),
        meta: { title: '校园服务' },
      },
      {
        path: 'schedule',
        name: 'Schedule',
        component: () => import('@/views/campus/Schedule.vue'),
        meta: { title: '我的课表', requiresAuth: true },
      },
      {
        path: 'grades',
        name: 'Grades',
        component: () => import('@/views/campus/Grades.vue'),
        meta: { title: '成绩查询', requiresAuth: true },
      },
      {
        path: 'library',
        name: 'Library',
        component: () => import('@/views/campus/Library.vue'),
        meta: { title: '图书馆' },
      },
      {
        path: 'classroom',
        name: 'Classroom',
        component: () => import('@/views/campus/Classroom.vue'),
        meta: { title: '教室预约' },
      },
      {
        path: 'map',
        name: 'CampusMap',
        component: () => import('@/views/campus/CampusMap.vue'),
        meta: { title: '校园地图' },
      },
      {
        path: 'dormitory',
        name: 'Dormitory',
        component: () => import('@/views/campus/Dormitory.vue'),
        meta: { title: '宿舍服务', requiresAuth: true },
      },
      {
        path: 'ai-courses',
        name: 'AiCourses',
        component: () => import('@/views/campus/AiCourses.vue'),
        meta: { title: 'AI智慧慕课' },
      },
      {
        path: 'ai-teaching',
        name: 'AiTeaching',
        component: () => import('@/views/campus/AiTeaching.vue'),
        meta: { title: 'AI教学中心' },
      },
      {
        path: 'canteen',
        name: 'Canteen',
        component: () => import('@/views/campus/Canteen.vue'),
        meta: { title: '校园食堂' },
      },
    ],
  },

  // ====== 社交互动模块 ======
  {
    path: '/community',
    component: () => import(/* webpackPrefetch: true */ '@/views/community/Layout.vue'),
    children: [
      {
        path: '',
        alias: ['forum'],
        name: 'ForumHome',
        component: () => import('@/views/community/Forum.vue'),
        meta: { title: '校园论坛', transition: 'page-fade' },
      },
      {
        path: 'publish',
        name: 'PublishPost',
        component: () => import('@/views/community/PublishPost.vue'),
        meta: { title: '发帖子', requiresAuth: true },
      },
      {
        path: 'post/:postId',
        name: 'PostDetail',
        component: () => import('@/views/community/PostDetail.vue'),
        meta: { title: '帖子详情', transition: 'page-slide' },
      },
      {
        path: 'lost-found',
        name: 'LostFound',
        component: () => import('@/views/community/LostFound.vue'),
        meta: { title: '失物招领' },
      },
      {
        path: 'activities',
        name: 'Activities',
        component: () => import('@/views/community/Activities.vue'),
        meta: { title: '社团活动' },
      },
    ],
  },

  // ====== 个人中心模块 ======
  {
    path: '/user',
    component: () => import('@/views/user/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/user/Profile.vue'),
        meta: { title: '个人资料' },
      },
      {
        path: 'orders',
        name: 'UserOrders',
        component: () => import('@/views/user/Orders.vue'),
        meta: { title: '我的订单' },
      },
      {
        path: 'favorites',
        name: 'Favorites',
        component: () => import('@/views/user/Favorites.vue'),
        meta: { title: '我的收藏' },
      },
      {
        path: 'addresses',
        name: 'Addresses',
        component: () => import('@/views/user/Addresses.vue'),
        meta: { title: '地址管理' },
      },
      {
        path: 'coupons',
        name: 'Coupons',
        component: () => import('@/views/user/coupons.vue'),
        meta: { title: '优惠券' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/user/Settings.vue'),
        meta: { title: '设置' },
      },
      {
        path: 'settings/security',
        name: 'Security',
        component: () => import('@/views/user/Security.vue'),
        meta: { title: '账号安全' },
      },
      {
        path: 'settings/notifications',
        name: 'NotificationSettings',
        component: () => import('@/views/user/NotificationSettings.vue'),
        meta: { title: '通知设置', requiresAuth: true },
      },
      {
        path: 'notifications',
        name: 'UserNotifications',
        component: () => import('@/views/user/Notifications.vue'),
        meta: { title: '消息中心', requiresAuth: true },
      },
      {
        path: 'browse-history',
        name: 'BrowseHistory',
        component: () => import('@/views/user/BrowseHistory.vue'),
        meta: { title: '浏览历史', requiresAuth: true },
      },
      {
        path: 'points-mall',
        name: 'PointsMall',
        component: () => import('@/views/user/PointsMall.vue'),
        meta: { title: '积分商城', requiresAuth: true },
      },
    ],
  },

  // ====== 搜索页面 ======
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/search/Index.vue'),
    meta: { title: '搜索' },
  },

  // ====== 管理后台模块 ======
  {
    path: '/admin',
    component: () => import(/* webpackPrefetch: true */ '@/views/admin/Layout.vue'),
    meta: { requiresAuth: true, title: '管理后台' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import(/* webpackPrefetch: true */ '@/views/admin/Dashboard.vue'),
        meta: { title: '数据看板' },
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/Placeholder.vue'),
        meta: { title: '商品管理' },
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Placeholder.vue'),
        meta: { title: '用户管理' },
      },
      {
        path: 'student-batch',
        name: 'StudentBatchInsert',
        component: () => import('@/views/admin/StudentBatchInsert.vue'),
        meta: { title: '批量添加学生' },
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/Placeholder.vue'),
        meta: { title: '订单管理' },
      },
      {
        path: 'system',
        name: 'AdminSystem',
        component: () => import('@/views/admin/Placeholder.vue'),
        meta: { title: '系统设置' },
      },
    ],
  },

  // ====== 帮助中心 ======
  {
    path: '/help',
    name: 'Help',
    component: () => import('@/views/Help.vue'),
    meta: { title: '帮助中心' },
  },

  // ====== 关于我们 ======
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: { title: '关于我们' },
  },

  // ====== 隐私政策 ======
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/Privacy.vue'),
    meta: { title: '隐私政策' },
  },

  // ====== 404 页面 ======
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '页面未找到' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()

  if (to.meta.title) {
    document.title = `${to.meta.title} | 黑科易购`
  }

  const userStore = useUserStore()
  let isAuthenticated = userStore.isAuthenticated

  console.log('[Router] Navigating from', from.path, 'to', to.path)
  console.log('[Router] Initial auth state:', { isAuthenticated, hasToken: !!userStore.token, hasUser: !!userStore.user, requiresAuth: to.meta.requiresAuth })

  // 如果有token但未认证（有token但没有user对象），尝试获取用户信息
  if (!isAuthenticated && userStore.token) {
    console.log('[Router] Token exists but not fully authenticated, fetching user info...')
    try {
      const userData = await userStore.fetchUserInfo()
      // 重新获取认证状态
      isAuthenticated = userStore.isAuthenticated
      console.log('[Router] After fetchUserInfo:', { userData: !!userData, isAuthenticated })
    } catch (err) {
      console.error('[Router] Failed to fetch user info:', err)
      // 获取失败，继续检查认证状态（可能token仍然有效）
    }
  }

  console.log('[Router] Final auth state:', { isAuthenticated, hasToken: !!userStore.token, requiresAuth: to.meta.requiresAuth })

  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('[Router] Auth required but not authenticated, redirecting to login')
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && isAuthenticated) {
    console.log('[Router] Already authenticated, redirecting to home')
    next({ path: '/' })
  } else {
    console.log('[Router] Navigation allowed')
    next()
  }
})

router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})

export default router
