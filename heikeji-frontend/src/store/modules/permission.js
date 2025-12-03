import { asyncRoutes, constantRoutes } from '@/router'
import { getMenuList } from '@/api/menu'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children && tmp.children.length) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  // 从后台获取菜单，动态生成路由
  generateRoutesFromBack({ commit }, roles) {
    return new Promise((resolve, reject) => {
      getMenuList()
        .then(res => {
          const { items } = res.data
          const menuItems = JSON.parse(JSON.stringify(items))
          // 构建路由
          const accessedRoutes = buildRoutesFromMenu(menuItems)
          accessedRoutes.push({
            path: '*',
            redirect: '/404',
            hidden: true,
          })
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
}

/**
 * 从菜单生成路由
 * @param menu 菜单列表
 * @param parent 父路由
 */
function buildRoutesFromMenu(menu, parent = null) {
  return menu.map(item => {
    const router = {
      name: item.name,
      path: item.path,
      meta: {
        title: item.title,
        icon: item.icon,
        roles: item.roles || [],
      },
    }

    // 有子菜单
    if (item.children && item.children.length > 0) {
      router.children = buildRoutesFromMenu(item.children, router)
      // 有children的节点必须是Layout
      router.component = Layout
    } else {
      // 没有子菜单，直接指定组件
      const { component } = item
      if (component) {
        router.component = loadView(component)
      }
    }

    // 设置重定向
    if (item.redirect) {
      router.redirect = item.redirect
    }

    return router
  })
}

// 路由懒加载
const loadView = view => {
  return resolve => require([`@/views/${view}`], resolve)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
