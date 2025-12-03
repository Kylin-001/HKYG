import request from '@/utils/request'

// 获取菜单列表
export function getMenuList() {
  return request({
    url: '/admin/menus',
    method: 'get',
  })
}

// 保存菜单
export function saveMenu(data) {
  return request({
    url: '/admin/menus',
    method: 'post',
    data,
  })
}

// 修改菜单
export function updateMenu(id, data) {
  return request({
    url: `/admin/menus/${id}`,
    method: 'put',
    data,
  })
}

// 删除菜单
export function deleteMenu(id) {
  return request({
    url: `/admin/menus/${id}`,
    method: 'delete',
  })
}

// 获取菜单详情
export function getMenuDetail(id) {
  return request({
    url: `/admin/menus/${id}`,
    method: 'get',
  })
}
