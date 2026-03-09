import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { createRoutes, createPreloadRoute } from '@/utils/lazy-load'

// 配置NProgress
NProgress.configure({ showSpinner: false })

/**
 * hidden: true                   if `hidden:true` will not show in sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will not redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
 *    title: 'title'               the name show in submenu and breadcrumb (recommend set)
 *    icon: 'svg-name'             the icon show in the sidebar,
 *    breadcrumb: false            if set false, the item will not show in breadcrumb(default is true)
 *  }
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
  createPreloadRoute(
    '/app/product',
    'AppProductPublic',
    'app/product/list.vue',
    { hidden: true }
  ),
  createPreloadRoute(
    '/app/product/list',
    'AppProductListPublic',
    'app/product/list.vue',
    { hidden: true }
  ),
  createPreloadRoute(
    '/app/product/detail/:id',
    'AppProductDetailPublic',
    'app/product/detail.vue',
    { hidden: true, props: true }
  ),
  createPreloadRoute(
    '/app/product/category',
    'AppProductCategoryPublic',
    'app/product/category.vue',
    { hidden: true }
  ),
  createPreloadRoute(
    '/app/product/search',
    'AppProductSearchPublic',
    'app/product/search.vue',
    { hidden: true }
  ),
  // 购物车路由
  createPreloadRoute(
    '/app/cart',
    'AppCart',
    'app/cart/index.vue',
    { hidden: true }
  ),
  // 用户登录注册路由
  createPreloadRoute(
    '/app/user/login',
    'AppUserLogin',
    'app/user/login.vue',
    { hidden: true }
  ),
  createPreloadRoute(
    '/app/user/register',
    'AppUserRegister',
    'app/user/register.vue',
    { hidden: true }
  ),
  // 订单相关路由
  createPreloadRoute(
    '/app/order/confirm',
    'AppOrderConfirm',
    'app/order/confirm.vue',
    { hidden: true }
  ),
  createPreloadRoute(
    '/app/order/list',
    'AppOrderList',
    'app/order/list.vue',
    { hidden: true }
  ),
  createPreloadRoute(
    '/app/order/detail/:id',
    'AppOrderDetail',
    'app/order/detail.vue',
    { hidden: true, props: true }
  ),
]

// 动态导入路由模块
const getUserRoutes = async () => {
  const { userRoutes } = await import('./modules/user')
  return userRoutes
}

const getPermissionRoutes = async () => {
  const { permissionRoutes } = await import('./modules/permission')
  return permissionRoutes
}

const getStatsRoutes = async () => {
  const { statsRoutes } = await import('./modules/stats')
  return statsRoutes
}

// 动态路由 - 需要根据用户权限动态加载的路由
export const asyncRoutes: RouteRecordRaw[] = [
  // 首页
  createPreloadRoute(
    '/dashboard',
    'Dashboard',
    'dashboard/index.vue',
    {
      title: '首页',
      icon: 'House',
      affix: true,
    },
    'core'
  ),
  // 商品管理
  {
    path: '/product',
    name: 'Product',
    meta: {
      title: '商品管理',
      icon: 'Goods',
    },
    children: createRoutes([
      {
        path: 'list',
        name: 'ProductList',
        componentPath: 'product/list.vue',
        meta: {
          title: '商品列表',
          icon: 'Grid',
        },
        group: 'product',
      },
      {
        path: 'add',
        name: 'ProductAdd',
        componentPath: 'product/add.vue',
        meta: {
          title: '添加商品',
          icon: 'CirclePlus',
        },
        group: 'product',
      },
      {
        path: 'edit/:id',
        name: 'ProductEdit',
        componentPath: 'product/edit.vue',
        meta: {
          title: '编辑商品',
          hidden: true,
        },
        group: 'product',
      },
      {
        path: 'category',
        name: 'Category',
        componentPath: 'product/category.vue',
        meta: {
          title: '商品分类',
          icon: 'Folder',
        },
        group: 'product',
      },
      {
        path: 'brand',
        name: 'Brand',
        componentPath: 'product/brand.vue',
        meta: {
          title: '品牌管理',
          icon: 'ShoppingBag',
        },
        group: 'product',
      },
    ]),
  },
  // 用户管理
  ...await getUserRoutes(),
  // 权限管理
  ...await getPermissionRoutes(),
  // 数据统计
  ...await getStatsRoutes(),
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