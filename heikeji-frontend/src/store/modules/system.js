import {
  getAdminUserList,
  getAdminUserDetail,
  addAdminUser,
  updateAdminUser,
  deleteAdminUser,
  updateAdminUserStatus,
  resetAdminUserPassword,
  getRoleList,
  getRoleDetail,
  addRole,
  updateRole,
  deleteRole,
  updateRoleStatus,
  getPermissionList,
  getPermissionDetail,
  addPermission,
  updatePermission,
  deletePermission,
  getLogList,
  getSystemConfig,
  updateSystemConfig,
} from '@/api/system'

const system = {
  state: {
    // 管理员相关状态
    adminList: [],
    adminTotal: 0,
    adminDetail: {},

    // 角色相关状态
    roleList: [],
    roleDetail: {},

    // 菜单相关状态
    menuList: [],

    // 操作日志相关状态
    operationLogList: [],
    operationLogTotal: 0,

    // 系统配置相关状态
    systemConfig: {},
  },

  mutations: {
    // 管理员相关mutations
    SET_ADMIN_LIST: (state, list) => {
      state.adminList = list || []
    },
    SET_ADMIN_TOTAL: (state, total) => {
      state.adminTotal = total || 0
    },
    SET_ADMIN_DETAIL: (state, detail) => {
      state.adminDetail = detail || {}
    },

    // 角色相关mutations
    SET_ROLE_LIST: (state, list) => {
      state.roleList = list || []
    },
    SET_ROLE_DETAIL: (state, detail) => {
      state.roleDetail = detail || {}
    },

    // 菜单相关mutations
    SET_MENU_LIST: (state, list) => {
      state.menuList = list || []
    },

    // 操作日志相关mutations
    SET_OPERATION_LOG_LIST: (state, list) => {
      state.operationLogList = list || []
    },
    SET_OPERATION_LOG_TOTAL: (state, total) => {
      state.operationLogTotal = total || 0
    },

    // 系统配置相关mutations
    SET_SYSTEM_CONFIG: (state, config) => {
      state.systemConfig = config || {}
    },
  },

  actions: {
    // 管理员相关actions
    getAdminList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAdminUserList(params)
          .then(response => {
            const { list, total } = response
            commit('SET_ADMIN_LIST', list)
            commit('SET_ADMIN_TOTAL', total)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    getAdminDetail({ commit }, id) {
      return new Promise((resolve, reject) => {
        getAdminUserDetail(id)
          .then(response => {
            commit('SET_ADMIN_DETAIL', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    addAdmin(_, data) {
      return new Promise((resolve, reject) => {
        addAdminUser(data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    updateAdmin(_, data) {
      return new Promise((resolve, reject) => {
        updateAdminUser(data.id, data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    deleteAdmin(_, id) {
      return new Promise((resolve, reject) => {
        deleteAdminUser(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    updateAdminStatus(_, { id, status }) {
      return new Promise((resolve, reject) => {
        updateAdminUserStatus(id, status)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    resetAdminPassword(_, id) {
      return new Promise((resolve, reject) => {
        resetAdminUserPassword(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 角色相关actions
    getRoleList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getRoleList(params)
          .then(response => {
            commit('SET_ROLE_LIST', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    getRoleDetail({ commit }, id) {
      return new Promise((resolve, reject) => {
        getRoleDetail(id)
          .then(response => {
            commit('SET_ROLE_DETAIL', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    addRole(_, data) {
      return new Promise((resolve, reject) => {
        addRole(data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    updateRole(_, data) {
      return new Promise((resolve, reject) => {
        updateRole(data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    deleteRole(_, id) {
      return new Promise((resolve, reject) => {
        deleteRole(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    updateRoleStatus(_, { id, status }) {
      return new Promise((resolve, reject) => {
        updateRoleStatus(id, status)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 菜单相关actions
    getMenuList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPermissionList(params)
          .then(response => {
            commit('SET_MENU_LIST', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    getMenuDetail({ commit }, id) {
      return new Promise((resolve, reject) => {
        getPermissionDetail(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    addMenu({ commit }, data) {
      return new Promise((resolve, reject) => {
        addPermission(data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    updateMenu(_, data) {
      return new Promise((resolve, reject) => {
        updatePermission(data.id, data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    deleteMenu(_, id) {
      return new Promise((resolve, reject) => {
        deletePermission(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 操作日志相关actions
    getOperationLogList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getLogList(params)
          .then(response => {
            const { list, total } = response
            commit('SET_OPERATION_LOG_LIST', list)
            commit('SET_OPERATION_LOG_TOTAL', total)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 系统配置相关actions
    getSystemConfig({ commit }) {
      return new Promise((resolve, reject) => {
        getSystemConfig()
          .then(response => {
            commit('SET_SYSTEM_CONFIG', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    updateSystemConfig({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateSystemConfig(data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  },
}

export default system
