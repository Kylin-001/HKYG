import { RouteRecordRaw } from 'vue-router'

// 权限管理路由
export const permissionRoutes: RouteRecordRaw[] = [
  {
    path: '/permission',
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'Lock',
      roles: ['admin'], // 只有admin角色可以访问
    },
    children: [
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/permission/role.vue'),
        meta: {
          title: '角色管理',
          icon: 'User',
          roles: ['admin'],
        },
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/permission/menu.vue'),
        meta: {
          title: '菜单管理',
          icon: 'Menu',
          roles: ['admin'],
        },
      },
      {
        path: 'user-role',
        name: 'UserRole',
        component: () => import('@/views/permission/user-role.vue'),
        meta: {
          title: '用户角色分配',
          icon: 'SwitchButton',
          roles: ['admin'],
        },
      },
    ],
  },
]
