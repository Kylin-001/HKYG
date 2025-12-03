// src-vue3/router/index.ts
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/Index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
        },
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        meta: {
          title: '个人中心',
          icon: 'User',
        },
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import('@/views/Orders.vue'),
        meta: {
          title: '我的订单',
          icon: 'List',
        },
      },
      {
        path: '/wallet',
        name: 'Wallet',
        component: () => import('@/views/Wallet.vue'),
        meta: {
          title: '我的钱包',
          icon: 'Wallet',
        },
      },
      // 用户管理模块路由
      {
        path: '/user/list',
        name: 'UserList',
        component: () => import('@/views/user/List.vue'),
        meta: {
          title: '用户列表',
          icon: 'User',
        },
      },
      {
        path: '/user/view/:id',
        name: 'UserView',
        component: () => import('@/views/user/View.vue'),
        meta: {
          title: '查看用户',
          hideInMenu: true,
        },
      },
      {
        path: '/user/edit/:id',
        name: 'UserEdit',
        component: () => import('@/views/user/Edit.vue'),
        meta: {
          title: '编辑用户',
          hideInMenu: true,
        },
      },
      {
        path: '/user/address',
        name: 'UserAddress',
        component: () => import('@/views/user/Address.vue'),
        meta: {
          title: '地址管理',
          icon: 'Location',
        },
      },
      {
        path: '/user/level',
        name: 'UserLevel',
        component: () => import('@/views/user/Level.vue'),
        meta: {
          title: '用户等级',
          icon: 'Rank',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      title: '登录',
      hideInMenu: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFound.vue'),
    meta: {
      title: '页面未找到',
      hideInMenu: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 黑科易购`
  }

  // 检查是否需要登录
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
