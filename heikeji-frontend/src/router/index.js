import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 路由懒加载优化 - 预加载常用组件
const preloadComponents = () => {
  // 预加载首页和登录页面组件
  Promise.all([import('@/views/dashboard/index'), import('@/views/login/index')])
}

// 应用启动时预加载核心组件
preloadComponents()

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
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },
  {
    path: '/',
    redirect: '/dashboard',
    hidden: true,
  },
  // 用户端商品相关路由（不需要权限的）
  {
    path: '/app/product',
    name: 'AppProductPublic',
    hidden: true,
    redirect: '/app/product/list',
  },
  {
    path: '/app/product/list',
    name: 'AppProductListPublic',
    component: () => import('@/views/app/product/list'),
    hidden: true,
  },
  {
    path: '/app/product/detail/:id',
    name: 'AppProductDetailPublic',
    component: () => import('@/views/app/product/detail'),
    hidden: true,
  },
  {
    path: '/app/product/category',
    name: 'AppProductCategoryPublic',
    component: () => import('@/views/app/product/category'),
    hidden: true,
  },
  {
    path: '/app/product/search',
    name: 'AppProductSearchPublic',
    component: () => import('@/views/app/product/search'),
    hidden: true,
  },
]

// 动态路由 - 需要根据用户权限动态加载的路由
export const asyncRoutes = [
  // 首页
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index'),
    meta: {
      title: '首页',
      icon: 'el-icon-s-home',
      affix: true,
    },
  },

  // 商品管理
  {
    path: '/product',
    name: 'Product',
    meta: {
      title: '商品管理',
      icon: 'el-icon-goods',
    },
    children: [
      {
        path: 'list',
        name: 'ProductList',
        component: () => import('@/views/product/list'),
        meta: {
          title: '商品列表',
          icon: 'el-icon-s-grid',
        },
      },
      {
        path: 'add',
        name: 'ProductAdd',
        component: () => import('@/views/product/add'),
        meta: {
          title: '添加商品',
          icon: 'el-icon-circle-plus-outline',
        },
      },
      {
        path: 'edit/:id',
        name: 'ProductEdit',
        component: () => import('@/views/product/edit'),
        meta: {
          title: '编辑商品',
          hidden: true,
        },
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/product/category'),
        meta: {
          title: '商品分类',
          icon: 'el-icon-folder',
        },
      },
      {
        path: 'brand',
        name: 'Brand',
        component: () => import('@/views/product/brand'),
        meta: {
          title: '品牌管理',
          icon: 'el-icon-shopping-bag-1',
        },
      },
    ],
  },

  // 订单管理
  {
    path: '/order',
    name: 'Order',
    meta: {
      title: '订单管理',
      icon: 'el-icon-document',
    },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/list'),
        meta: {
          title: '订单列表',
          icon: 'el-icon-document-checked',
        },
      },
      {
        path: 'detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail'),
        meta: {
          title: '订单详情',
          hidden: true,
        },
      },
      {
        path: 'refund',
        name: 'RefundList',
        component: () => import('@/views/order/refund'),
        meta: {
          title: '退款管理',
          icon: 'el-icon-s-goods',
        },
      },
    ],
  },

  // 用户管理
  {
    path: '/user',
    name: 'User',
    meta: {
      title: '用户管理',
      icon: 'el-icon-user',
    },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/list'),
        meta: {
          title: '用户列表',
          icon: 'el-icon-users',
        },
      },
      {
        path: 'level',
        name: 'UserLevel',
        component: () => import('@/views/user/level'),
        meta: {
          title: '会员等级',
          icon: 'el-icon-medal-1',
        },
      },
      {
        path: 'address',
        name: 'UserAddress',
        component: () => import('@/views/user/address'),
        meta: {
          title: '地址管理',
          icon: 'el-icon-location',
        },
      },
    ],
  },

  // 校园服务管理
  {
    path: '/campus',
    name: 'Campus',
    meta: {
      title: '校园服务',
      icon: 'el-icon-location',
    },
    children: [
      // 校区管理
      {
        path: 'list',
        name: 'CampusList',
        component: () => import('@/views/campus/list'),
        meta: {
          title: '校区管理',
          icon: 'el-icon-office-building',
        },
      },
      // 楼栋管理
      {
        path: 'building',
        name: 'BuildingList',
        component: () => import('@/views/campus/building'),
        meta: {
          title: '楼栋管理',
          icon: 'el-icon-home',
        },
      },
      // 外卖柜管理
      {
        path: 'locker',
        name: 'LockerList',
        component: () => import('@/views/campus/locker'),
        meta: {
          title: '外卖柜管理',
          icon: 'el-icon-box',
        },
      },
      // 校园站点
      {
        path: 'site',
        name: 'SiteList',
        component: () => import('@/views/campus/site'),
        meta: {
          title: '校园站点',
          icon: 'el-icon-map-marker',
        },
      },
    ],
  },

  // 用户端商品相关路由
  {
    path: '/app/product',
    name: 'AppProduct',
    meta: {
      title: '商品',
      hidden: true,
    },
    children: [
      {
        path: 'list',
        name: 'AppProductList',
        component: () => import('@/views/app/product/list'),
        meta: {
          title: '商品列表',
          hidden: true,
        },
      },
      {
        path: 'detail/:id',
        name: 'AppProductDetail',
        component: () => import('@/views/app/product/detail'),
        meta: {
          title: '商品详情',
          hidden: true,
        },
      },
      {
        path: 'category',
        name: 'AppProductCategory',
        component: () => import('@/views/app/product/category'),
        meta: {
          title: '商品分类',
          hidden: true,
        },
      },
      {
        path: 'search',
        name: 'AppProductSearch',
        component: () => import('@/views/app/product/search'),
        meta: {
          title: '商品搜索',
          hidden: true,
        },
      },
    ],
  },

  // 外卖服务管理
  {
    path: '/takeout',
    name: 'Takeout',
    meta: {
      title: '外卖服务',
      icon: 'el-icon-soup',
    },
    children: [
      // 用户端点餐流程
      {
        path: 'merchantList',
        name: 'MerchantList',
        component: () => import('@/views/takeout/merchantList'),
        meta: {
          title: '商家列表',
          icon: 'el-icon-s-shop',
        },
      },
      {
        path: 'menu/:merchantId',
        name: 'MerchantMenu',
        component: () => import('@/views/takeout/menu'),
        meta: {
          title: '商家菜单',
          hidden: true,
        },
      },
      {
        path: 'cart',
        name: 'ShoppingCart',
        component: () => import('@/views/takeout/cart'),
        meta: {
          title: '购物车',
          icon: 'el-icon-shopping-cart-2',
        },
      },
      {
        path: 'checkout',
        name: 'OrderCheckout',
        component: () => import('@/views/takeout/checkout'),
        meta: {
          title: '确认订单',
          hidden: true,
        },
      },
      {
        path: 'order-success',
        name: 'OrderSuccess',
        component: () => import('@/views/takeout/orderSuccess'),
        meta: {
          title: '订单成功',
          hidden: true,
        },
      },
      // 商家端管理功能
      {
        path: 'merchant/dashboard',
        name: 'MerchantDashboard',
        component: () => import('@/views/merchant/dashboard'),
        meta: {
          title: '商家仪表盘',
          icon: 'el-icon-s-marketing',
        },
      },
      {
        path: 'merchant/orders',
        name: 'MerchantOrders',
        component: () => import('@/views/merchant/orders'),
        meta: {
          title: '商家订单',
          icon: 'el-icon-document',
        },
      },
      {
        path: 'merchant/products',
        name: 'MerchantProducts',
        component: () => import('@/views/merchant/products'),
        meta: {
          title: '商品管理',
          icon: 'el-icon-goods',
        },
      },
      {
        path: 'merchant/promotions',
        name: 'MerchantPromotions',
        component: () => import('@/views/merchant/promotions'),
        meta: {
          title: '营销活动',
          icon: 'el-icon-s-promotion',
        },
      },
      {
        path: 'merchant/settings',
        name: 'MerchantSettings',
        component: () => import('@/views/merchant/settings'),
        meta: {
          title: '店铺设置',
          icon: 'el-icon-setting',
        },
      },
      // 商家端订单管理
      {
        path: 'order/list',
        name: 'TakeoutOrderList',
        component: () => import('@/views/takeout/orderList'),
        meta: {
          title: '外卖订单',
          icon: 'el-icon-document',
        },
      },
      {
        path: 'order/detail/:id',
        name: 'TakeoutOrderDetail',
        component: () => import('@/views/takeout/orderDetail'),
        meta: {
          title: '订单详情',
          hidden: true,
        },
      },
    ],
  },

  // 配送员管理
  {
    path: '/courier',
    name: 'Courier',
    meta: {
      title: '配送员管理',
      icon: 'el-icon-bicycle',
    },
    children: [
      {
        path: 'dashboard',
        name: 'CourierDashboard',
        component: () => import('@/views/courier/dashboard'),
        meta: {
          title: '配送员工作台',
          icon: 'el-icon-s-marketing',
        },
      },
      {
        path: 'orders',
        name: 'CourierOrders',
        component: () => import('@/views/courier/orders'),
        meta: {
          title: '配送订单',
          icon: 'el-icon-document',
        },
      },
      {
        path: 'order-detail/:id',
        name: 'CourierOrderDetail',
        component: () => import('@/views/courier/OrderDetail'),
        meta: {
          title: '订单详情',
          hidden: true,
        },
      },
      {
        path: 'statistics',
        name: 'CourierStatistics',
        component: () => import('@/views/courier/statistics'),
        meta: {
          title: '配送统计',
          icon: 'el-icon-data-analysis',
        },
      },
      {
        path: 'settings',
        name: 'CourierSettings',
        component: () => import('@/views/courier/settings'),
        meta: {
          title: '个人设置',
          icon: 'el-icon-setting',
        },
      },
    ],
  },

  // 财务管理
  {
    path: '/finance',
    name: 'Finance',
    meta: {
      title: '财务管理',
      icon: 'el-icon-money',
    },
    children: [
      {
        path: 'overview',
        name: 'FinanceOverview',
        component: () => import('@/views/finance/overview'),
        meta: {
          title: '财务概览',
          icon: 'el-icon-s-marketing',
        },
      },
      {
        path: 'revenue',
        name: 'FinanceRevenue',
        component: () => import('@/views/finance/revenue'),
        meta: {
          title: '收入分析',
          icon: 'el-icon-top',
        },
      },
      {
        path: 'expense',
        name: 'FinanceExpense',
        component: () => import('@/views/finance/expense'),
        meta: {
          title: '支出分析',
          icon: 'el-icon-bottom',
        },
      },
      {
        path: 'analytics',
        name: 'FinanceAnalytics',
        component: () => import('@/views/finance/analytics'),
        meta: {
          title: '数据分析',
          icon: 'el-icon-data-analysis',
        },
      },
      {
        path: 'payment-statistics',
        name: 'PaymentStatistics',
        component: () => import('@/views/finance/PaymentStatistics'),
        meta: {
          title: '支付统计',
          icon: 'el-icon-coin',
        },
      },
    ],
  },

  // 跑腿服务管理
  {
    path: '/delivery',
    name: 'Delivery',
    meta: {
      title: '跑腿服务',
      icon: 'el-icon-truck',
    },
    children: [
      {
        path: 'request/list',
        name: 'DeliveryRequestList',
        component: () => import('@/views/delivery/requestList'),
        meta: {
          title: '跑腿请求',
          icon: 'el-icon-document-checked',
        },
      },
      {
        path: 'request/detail/:id',
        name: 'DeliveryRequestDetail',
        component: () => import('@/views/delivery/requestDetail'),
        meta: {
          title: '请求详情',
          hidden: true,
        },
      },
    ],
  },

  // 营销管理
  {
    path: '/marketing',
    name: 'Marketing',
    meta: {
      title: '营销管理',
      icon: 'el-icon-trophy',
    },
    children: [
      {
        path: 'coupon',
        name: 'Coupon',
        component: () => import('@/views/marketing/coupon'),
        meta: {
          title: '优惠券管理',
          icon: 'el-icon-ticket',
        },
      },
      // 活动管理路由暂时注释，因为视图文件不存在
      /*
      {
        path: 'activity',
        name: 'Activity',
        component: () => import('@/views/marketing/activity'),
        meta: {
          title: '活动管理',
          icon: 'el-icon-s-promotion'
        }
      },
      */
      {
        path: 'banner',
        name: 'Banner',
        component: () => import('@/views/marketing/banner'),
        meta: {
          title: '轮播图管理',
          icon: 'el-icon-picture-outline',
        },
      },
    ],
  },

  // 系统管理
  {
    path: '/system',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'el-icon-setting',
    },
    children: [
      {
        path: 'admin',
        name: 'AdminList',
        component: () => import('@/views/system/admin'),
        meta: {
          title: '管理员列表',
          icon: 'el-icon-user-solid',
        },
      },
      {
        path: 'role',
        name: 'RoleList',
        component: () => import('@/views/system/role'),
        meta: {
          title: '角色管理',
          icon: 'el-icon-s-custom',
        },
      },
      {
        path: 'menu',
        name: 'MenuList',
        component: () => import('@/views/system/menu'),
        meta: {
          title: '菜单管理',
          icon: 'el-icon-menu',
        },
      },
      {
        path: 'log',
        name: 'LogList',
        component: () => import('@/views/system/log'),
        meta: {
          title: '操作日志',
          icon: 'el-icon-document-copy',
        },
      },
    ],
  },

  // 个人中心
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/index'),
    meta: {
      title: '个人中心',
      icon: 'el-icon-user-circle',
    },
    hidden: false,
  },

  // 组件演示页面
  {
    path: '/demo',
    name: 'Demo',
    meta: {
      title: '组件演示',
      icon: 'el-icon-s-cooperation',
    },
    children: [
      {
        path: 'virtual-table',
        name: 'VirtualTableDemo',
        component: () => import('@/views/demo/virtual-table'),
        meta: {
          title: 'VirtualTable演示',
          icon: 'el-icon-table-lamp',
        },
      },
      {
        path: 'search-filter',
        name: 'SearchFilterDemo',
        component: () => import('@/views/demo/search-filter'),
        meta: {
          title: '智能搜索筛选',
          icon: 'el-icon-search',
        },
      },
      {
        path: 'performance-monitor',
        name: 'PerformanceMonitorDemo',
        component: () => import('@/views/demo/performance-monitor'),
        meta: {
          title: '性能监控仪表板',
          icon: 'el-icon-data-analysis',
        },
      },
    ],
  },

  // 404路由必须放在最后
  { path: '*', redirect: '/404', hidden: true },
]

// 创建路由实例
const createRouter = () =>
  new Router({
    // 使用history模式
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: [...constantRoutes, ...asyncRoutes], // 临时合并所有路由，实际项目中应该根据权限动态加载
  })

const router = createRouter()

// 重置路由函数
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
