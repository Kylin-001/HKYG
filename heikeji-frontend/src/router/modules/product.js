/**
 * 商品管理路由模块
 */

export const productRoutes = [
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
]
