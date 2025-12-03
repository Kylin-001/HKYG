import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import {
  getUserList,
  getUserDetail,
  updateUserStatus,
  getUserLevelList,
  getUserAddressList,
  getUserStatistics,
  updateUserInfo,
  addUser,
  deleteUser,
  batchDeleteUser,
} from '@/api/user'
import { getUserRoles, assignUserRoles, getEnabledRoles, getUserRoleIds } from '@/api/system'

const user = {
  state: {
    // 身份验证相关状态
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],

    // 用户管理相关状态
    userList: [],
    userTotal: 0,
    userDetail: {},
    userLevelList: [],
    userAddressList: [],
    userStatistics: {},
    userRoles: [],
    enabledRoles: [],
    userRoleIds: [],
  },

  mutations: {
    // 身份验证相关mutations
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },

    // 用户管理相关mutations
    SET_USER_LIST: (state, list) => {
      state.userList = list || []
    },
    SET_USER_TOTAL: (state, total) => {
      state.userTotal = total || 0
    },
    SET_USER_DETAIL: (state, detail) => {
      state.userDetail = detail || {}
    },
    SET_USER_LEVEL_LIST: (state, list) => {
      state.userLevelList = list || []
    },
    SET_USER_ADDRESS_LIST: (state, list) => {
      state.userAddressList = list || []
    },
    SET_USER_STATISTICS: (state, statistics) => {
      state.userStatistics = statistics || {}
    },
    SET_USER_ROLES: (state, roles) => {
      state.userRoles = roles || []
    },
    SET_ENABLED_ROLES: (state, roles) => {
      state.enabledRoles = roles || []
    },
    SET_USER_ROLE_IDS: (state, roleIds) => {
      state.userRoleIds = roleIds || []
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const { password } = userInfo
      const { code } = userInfo
      const { uuid } = userInfo
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid)
          .then(res => {
            setToken(res.token)
            commit('SET_TOKEN', res.token)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then(res => {
            const { user } = res
            const avatar =
              user.avatar == null
                ? 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
                : user.avatar
            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', res.roles)
              commit('SET_PERMISSIONS', res.permissions)
            } else {
              commit('SET_ROLES', ['ROLE_DEFAULT'])
            }
            commit('SET_NAME', user.nickName)
            commit('SET_AVATAR', avatar)
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_PERMISSIONS', [])
            removeToken()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    // 用户管理相关actions
    getUserList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getUserList(params)
          .then(response => {
            const { list, total } = response
            commit('SET_USER_LIST', list)
            commit('SET_USER_TOTAL', total)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    getUserDetail({ commit }, id) {
      return new Promise((resolve, reject) => {
        getUserDetail(id)
          .then(response => {
            commit('SET_USER_DETAIL', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    updateUserStatus(_, { id, status }) {
      return new Promise((resolve, reject) => {
        updateUserStatus(id, status)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    getUserLevelList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getUserLevelList(params)
          .then(response => {
            commit('SET_USER_LEVEL_LIST', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    getUserAddressList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getUserAddressList(params)
          .then(response => {
            commit('SET_USER_ADDRESS_LIST', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    getUserStatistics({ commit }) {
      return new Promise((resolve, reject) => {
        getUserStatistics()
          .then(response => {
            commit('SET_USER_STATISTICS', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户角色列表
    getUserRoles({ commit }, userId) {
      return new Promise((resolve, reject) => {
        getUserRoles(userId)
          .then(response => {
            const roles = response.data || response
            commit('SET_USER_ROLES', roles)
            resolve(roles)
          })
          .catch(error => {
            console.error('获取用户角色失败:', error)
            reject(error)
          })
      })
    },

    // 分配角色给用户
    assignUserRoles({ commit }, { userId, roleIds }) {
      return new Promise((resolve, reject) => {
        assignUserRoles(userId, roleIds)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            console.error('分配角色失败:', error)
            reject(error)
          })
      })
    },

    // 获取所有启用的角色
    getEnabledRoles({ commit }) {
      return new Promise((resolve, reject) => {
        getEnabledRoles()
          .then(response => {
            const roles = response.data || response
            commit('SET_ENABLED_ROLES', roles)
            resolve(roles)
          })
          .catch(error => {
            console.error('获取启用角色失败:', error)
            // 如果API调用失败，返回模拟数据
            const mockRoles = [
              { id: 1, roleName: '超级管理员', roleCode: 'ADMIN', description: '拥有所有权限' },
              {
                id: 2,
                roleName: '普通管理员',
                roleCode: 'NORMAL_ADMIN',
                description: '拥有基础管理权限',
              },
              {
                id: 3,
                roleName: '商品管理员',
                roleCode: 'PRODUCT_ADMIN',
                description: '仅管理商品相关内容',
              },
              {
                id: 4,
                roleName: '订单管理员',
                roleCode: 'ORDER_ADMIN',
                description: '仅管理订单相关内容',
              },
              {
                id: 5,
                roleName: '运营管理员',
                roleCode: 'OPERATION_ADMIN',
                description: '运营相关权限',
              },
            ]
            commit('SET_ENABLED_ROLES', mockRoles)
            resolve(mockRoles)
          })
      })
    },

    // 获取用户的角色ID列表
    getUserRoleIds({ commit }, userId) {
      return new Promise((resolve, reject) => {
        getUserRoleIds(userId)
          .then(response => {
            const roleIds = response.data || response
            commit('SET_USER_ROLE_IDS', roleIds)
            resolve(roleIds)
          })
          .catch(error => {
            console.error('获取用户角色ID失败:', error)
            // 如果API调用失败，返回空数组
            commit('SET_USER_ROLE_IDS', [])
            resolve([])
          })
      })
    },

    // 更新用户信息
    updateUser(_, { userId, ...data }) {
      return new Promise((resolve, reject) => {
        updateUserInfo(userId, data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            console.error('更新用户失败:', error)
            reject(error)
          })
      })
    },

    // 添加用户
    addUser(_, userData) {
      return new Promise((resolve, reject) => {
        addUser(userData)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            console.error('添加用户失败:', error)
            reject(error)
          })
      })
    },

    // 删除用户
    deleteUser(_, { userId }) {
      return new Promise((resolve, reject) => {
        deleteUser(userId)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            console.error('删除用户失败:', error)
            reject(error)
          })
      })
    },

    // 批量删除用户
    batchDeleteUsers(_, { userIds }) {
      return new Promise((resolve, reject) => {
        batchDeleteUser(userIds)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            console.error('批量删除用户失败:', error)
            reject(error)
          })
      })
    },
  },
}

export default user
