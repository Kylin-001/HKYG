import { RouteRecordRaw } from 'vue-router'

// 数据统计路由
export const statsRoutes: RouteRecordRaw[] = [
  {
    path: '/stats',
    name: 'Stats',
    meta: {
      title: '数据统计',
      icon: 'DataAnalysis',
    },
    children: [
      {
        path: 'product-sales',
        name: 'ProductSales',
        component: () => import('@/views/stats/product-sales.vue'),
        meta: {
          title: '商品销售统计',
          icon: 'TrendCharts',
        },
      },
      {
        path: 'order-stats',
        name: 'OrderStats',
        component: () => import('@/views/stats/order-stats.vue'),
        meta: {
          title: '订单统计',
          icon: 'Order',
        },
      },
      {
        path: 'user-stats',
        name: 'UserStats',
        component: () => import('@/views/stats/user-stats.vue'),
        meta: {
          title: '用户统计',
          icon: 'User',
        },
      },
      {
        path: 'sales-trend',
        name: 'SalesTrend',
        component: () => import('@/views/stats/sales-trend.vue'),
        meta: {
          title: '销售趋势分析',
          icon: 'LineChart',
        },
      },
    ],
  },
]
