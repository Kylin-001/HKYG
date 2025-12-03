/**
 * 常量路由配置 - 不需要权限就可以访问的路由
 */

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
]
