/**
 * 订单管理路由模块
 */

export const orderRoutes = [
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
        path: 'payment/:id',
        name: 'OrderPayment',
        component: () => import('@/views/order/payment'),
        meta: {
          title: '订单支付',
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
]
