/**
 * 系统管理路由模块
 */

export const systemRoutes = [
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
]
