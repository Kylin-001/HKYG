import request from '@/utils/request'

// 管理员管理相关API - 使用SysUserController
// 注意：这里直接使用系统用户管理API，因为后端没有单独的管理员控制器
export function getAdminList(params) {
  return request({
    url: '/api/system/user/list',
    method: 'get',
    params,
  })
}

export function getAdminDetail(id) {
  return request({
    url: `/api/system/user/${id}`,
    method: 'get',
  })
}

export function addAdmin(data) {
  return request({
    url: '/api/system/user',
    method: 'post',
    data,
  })
}

export function updateAdmin(data) {
  return request({
    url: '/api/system/user',
    method: 'put',
    data,
  })
}

export function deleteAdmin(id) {
  return request({
    url: `/api/system/user/${id}`,
    method: 'delete',
  })
}

export function updateAdminStatus(id, status) {
  return request({
    url: '/api/system/user/status',
    method: 'put',
    params: { id, status },
  })
}

export function resetAdminPassword(id, password) {
  return request({
    url: '/api/system/user/resetPassword',
    method: 'put',
    params: { id, password },
  })
}

// 角色管理相关API - 使用SysRoleController
export function getRoleList(params) {
  return request({
    url: '/api/system/role/list',
    method: 'get',
    params,
  })
}

export function getRoleDetail(id) {
  return request({
    url: `/api/system/role/${id}`,
    method: 'get',
  })
}

export function addRole(data) {
  return request({
    url: '/api/system/role',
    method: 'post',
    data,
  })
}

export function updateRole(data) {
  return request({
    url: '/api/system/role',
    method: 'put',
    data,
  })
}

export function deleteRole(id) {
  return request({
    url: `/api/system/role/${id}`,
    method: 'delete',
  })
}

export function updateRoleStatus(id, status) {
  return request({
    url: '/api/system/role/status',
    method: 'put',
    params: { id, status },
  })
}

export function getRolePerms(id) {
  return request({
    url: `/api/system/role/getPermissionIds/${id}`,
    method: 'get',
  })
}

export function updateRolePerms(id, permissionIds) {
  return request({
    url: '/api/system/role/assignPermissions',
    method: 'put',
    params: { roleId: id },
    data: permissionIds,
  })
}

// 用户角色分配相关API
export function getUserRoles(userId) {
  return request({
    url: '/api/system/role/listByUserId',
    method: 'get',
    params: { userId },
  })
}

export function assignUserRoles(userId, roleIds) {
  return request({
    url: '/api/system/role/assignRoles',
    method: 'put',
    params: { userId },
    data: roleIds,
  })
}

export function getUserRoleIds(userId) {
  return request({
    url: `/api/system/role/getRoleIds/${userId}`,
    method: 'get',
  })
}

export function getEnabledRoles() {
  return request({
    url: '/api/system/role/listAllEnabled',
    method: 'get',
  })
}

// 菜单管理相关API - 使用SysPermissionController
export function getMenuList() {
  return request({
    url: '/api/system/permission/listAllMenus',
    method: 'get',
  })
}

export function getMenuTree() {
  return request({
    url: '/api/system/permission/menuTree',
    method: 'get',
  })
}

export function getMenuDetail(id) {
  return request({
    url: `/api/system/permission/${id}`,
    method: 'get',
  })
}

export function addMenu(data) {
  return request({
    url: '/api/system/permission',
    method: 'post',
    data,
  })
}

export function updateMenu(data) {
  return request({
    url: '/api/system/permission',
    method: 'put',
    data,
  })
}

export function deleteMenu(id) {
  return request({
    url: `/api/system/permission/${id}`,
    method: 'delete',
  })
}

// 操作日志相关API
export function getLogList(params) {
  return request({
    url: '/system/log/list',
    method: 'get',
    params,
  })
}

export function deleteLog(id) {
  return request({
    url: `/system/log/delete/${id}`,
    method: 'delete',
  })
}

export function batchDeleteLog(ids) {
  return request({
    url: '/system/log/batch-delete',
    method: 'delete',
    data: { ids },
  })
}

export function clearLog() {
  return request({
    url: '/system/log/clear',
    method: 'delete',
  })
}

export function exportLog(params) {
  return request({
    url: '/system/log/export',
    method: 'get',
    params,
    responseType: 'blob',
  })
}

// 系统配置相关API - 暂时保留原有接口，实际项目中需要根据后端实现调整
export function getSystemConfig() {
  return request({
    url: '/api/system/config',
    method: 'get',
  })
}

export function updateSystemConfig(data) {
  return request({
    url: '/api/system/config',
    method: 'put',
    data,
  })
}

export function getSystemInfo() {
  return request({
    url: '/api/system/info',
    method: 'get',
  })
}
