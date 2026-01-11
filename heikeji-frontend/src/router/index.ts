import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置NProgress
NProgress.configure({ showSpinner: false })

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    breadcrumb: false            if set false, will not show in the breadcrumb(default is true)
  }
 **/

// 常量路由 - 不需要权限就可以访问的路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/404',
    component: () => import('@/views/404.vue'),
    meta: { hidden: true },
  },
  {
    path: '/',
    redirect: '/dashboard',
    meta: { hidden: true },
  },
  // 用户端商品相关路由（不需要权限的）
  {
    path: '/app/product',
    name: 'AppProductPublic',
    redirect: '/app/product/list',
    meta: { hidden: true },
  },
  {
    path: '/app/product/list',
    name: 'AppProductListPublic',
    component: () => import('@/views/app/product/list.vue'),
    meta: { hidden: true },
  },
  {
    path: '/app/product/detail/:id',
    name: 'AppProductDetailPublic',
    component: () => import('@/views/app/product/detail.vue'),
    meta: { hidden: true },
    props: true,
  },
  {
    path: '/app/product/category',
    name: 'AppProductCategoryPublic',
    component: () => import('@/views/app/product/category.vue'),
    meta: { hidden: true },
  },
  {
    path: '/app/product/search',
    name: 'AppProductSearchPublic',
    component: () => import('@/views/app/product/search.vue'),
    meta: { hidden: true },
  },
  // 购物车路由
  {
    path: '/app/cart',
    name: 'AppCart',
    component: () => import('@/views/app/cart/index.vue'),
    meta: { hidden: true },
  },
  // 用户登录注册路由
  {
    path: '/app/user/login',
    name: 'AppUserLogin',
    component: () => import('@/views/app/user/login.vue'),
    meta: { hidden: true },
  },
  {
    path: '/app/user/register',
    name: 'AppUserRegister',
    component: () => import('@/views/app/user/register.vue'),
    meta: { hidden: true },
  },
  // 订单相关路由
  {
    path: '/app/order/confirm',
    name: 'AppOrderConfirm',
    component: () => import('@/views/app/order/confirm.vue'),
    meta: { hidden: true },
  },
  {
    path: '/app/order/list',
    name: 'AppOrderList',
    component: () => import('@/views/app/order/list.vue'),
    meta: { hidden: true },
  },
  {
    path: '/app/order/detail/:id',
    name: 'AppOrderDetail',
    component: () => import('@/views/app/order/detail.vue'),
    meta: { hidden: true },
    props: true,
  },
]

// 动态导入路由模块
const getUserRoutes = async () => {
  const { userRoutes } = await import('./modules/user.js')
  return userRoutes
}

const getPermissionRoutes = async () => {
  const { permissionRoutes } = await import('./modules/permission.ts')
  return permissionRoutes
}

const getStatsRoutes = async () => {
  const { statsRoutes } = await import('./modules/stats.ts')
  return statsRoutes
}

// 动态路由 - 需要根据用户权限动态加载的路由
export const asyncRoutes: RouteRecordRaw[] = [
  // 首页
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '首页',
      icon: 'House',
      affix: true,
    },
  },
  // 商品管理
  {
    path: '/product',
    name: 'Product',
    meta: {
      title: '商品管理',
      icon: 'Goods',
    },
    children: [
      {
        path: 'list',
        name: 'ProductList',
        component: () => import('@/views/product/list.vue'),
        meta: {
          title: '商品列表',
          icon: 'Grid',
        },
      },
      {
        path: 'add',
        name: 'ProductAdd',
        component: () => import('@/views/product/add.vue'),
        meta: {
          title: '添加商品',
          icon: 'CirclePlus',
        },
      },
      {
        path: 'edit/:id',
        name: 'ProductEdit',
        component: () => import('@/views/product/edit.vue'),
        meta: {
          title: '编辑商品',
          hidden: true,
        },
        props: true,
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/product/category.vue'),
        meta: {
          title: '商品分类',
          icon: 'Folder',
        },
      },
      {
        path: 'brand',
        name: 'Brand',
        component: () => import('@/views/product/brand.vue'),
        meta: {
          title: '品牌管理',
          icon: 'ShoppingBag',
        },
      },
    ],
  },
  // 用户管理
  ...userRoutes,
  // 权限管理
  ...permissionRoutes,
  // 数据统计
  ...statsRoutes,
  // 404路由必须放在最后
  { path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true } },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes, // 只加载常量路由，动态路由由守卫处理
})

// 设置路由守卫
import { setupRouterGuards, resetRouter } from './guards'
setupRouterGuards(router)

// 导出重置路由函数
export { resetRouter }

export default router
