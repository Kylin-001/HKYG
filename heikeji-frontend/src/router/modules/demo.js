/**
 * 演示功能路由模块
 */

export const demoRoutes = [
  {
    path: '/demo',
    name: 'Demo',
    meta: {
      title: '组件演示',
      icon: 'Cooperation',
    },
    children: [
      {
        path: 'virtual-table',
        name: 'VirtualTableDemo',
        component: () => import('@/views/demo/virtual-table'),
        meta: {
          title: 'VirtualTable演示',
          icon: 'Table',
        },
      },
      {
        path: 'search-filter',
        name: 'SearchFilterDemo',
        component: () => import('@/views/demo/search-filter'),
        meta: {
          title: '智能搜索筛选',
          icon: 'Search',
        },
      },
      {
        path: 'performance-monitor',
        name: 'PerformanceMonitorDemo',
        component: () => import('@/views/demo/performance-monitor'),
        meta: {
          title: '性能监控仪表板',
          icon: 'DataLine',
        },
      },
    ],
  },
]
