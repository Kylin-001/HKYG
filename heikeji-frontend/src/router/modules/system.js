/**
 * 系统管理路由模块
 */

export const systemRoutes = [
  {
    path: '/system',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'Setting',
    },
    children: [
      {
        path: 'admin',
        name: 'AdminList',
        component: () => import('@/views/system/admin'),
        meta: {
          title: '管理员列表',
          icon: 'User',
        },
      },
      {
        path: 'role',
        name: 'RoleList',
        component: () => import('@/views/system/role'),
        meta: {
          title: '角色管理',
          icon: 'UserFilled',
        },
      },
      {
        path: 'menu',
        name: 'MenuList',
        component: () => import('@/views/system/menu'),
        meta: {
          title: '菜单管理',
          icon: 'Menu',
        },
      },
      {
        path: 'log',
        name: 'LogList',
        component: () => import('@/views/system/log'),
        meta: {
          title: '操作日志',
          icon: 'DocumentCopy',
        },
      },
    ],
  },
]
