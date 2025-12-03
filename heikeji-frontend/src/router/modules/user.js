/**
 * 用户管理路由模块
 */

export const userRoutes = [
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
      {
        path: 'behavior-analysis',
        name: 'UserBehaviorAnalysis',
        component: () => import('@/views/user/behavior-analysis'),
        meta: {
          title: '用户行为分析',
          icon: 'el-icon-data-analysis',
        },
      },
    ],
  },
]
