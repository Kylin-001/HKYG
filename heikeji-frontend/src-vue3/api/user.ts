import request from '@/utils/request'
import {
  UserListParams,
  UserListResponse,
  UserListItem,
  Address,
  AddressListParams,
  AddressListResponse,
  Level,
  LevelListParams,
  EditForm,
  AddressEditForm,
  LevelEditForm,
} from '@/types/user'

/**
 * 用户管理API
 */
export const userApi = {
  // 用户列表相关
  /**
   * 获取用户列表
   * @param params 查询参数
   */
  getUserList: (params: UserListParams): Promise<UserListResponse> =>
    request.get('/api/system/user/list', params),

  /**
   * 获取用户详情
   * @param userId 用户ID
   */
  getUserDetail: (userId: string): Promise<UserListItem> =>
    request.get(`/api/system/user/${userId}`),

  /**
   * 创建用户
   * @param data 用户数据
   */
  createUser: (data: EditForm): Promise<boolean> => request.post('/api/system/user', data),

  /**
   * 更新用户
   * @param data 用户数据
   */
  updateUser: (data: EditForm): Promise<boolean> => request.put('/api/system/user', data),

  /**
   * 删除用户
   * @param userId 用户ID
   */
  deleteUser: (userId: string): Promise<boolean> => request.delete(`/api/system/user/${userId}`),

  /**
   * 批量删除用户
   * @param userIds 用户ID数组
   */
  batchDeleteUser: (userIds: number[]): Promise<boolean> =>
    request.delete('/api/system/user/batch', { data: userIds }),

  /**
   * 修改用户状态
   * @param userId 用户ID
   * @param status 状态
   */
  changeUserStatus: (userId: string, status: string): Promise<boolean> =>
    request.put('/api/system/user/changeStatus', { userId, status }),

  /**
   * 批量启用用户
   * @param userIds 用户ID数组
   */
  batchEnableUser: (userIds: number[]): Promise<boolean> =>
    request.put('/api/system/user/batchEnable', { userIds }),

  /**
   * 批量禁用用户
   * @param userIds 用户ID数组
   */
  batchDisableUser: (userIds: number[]): Promise<boolean> =>
    request.put('/api/system/user/batchDisable', { userIds }),

  // 地址相关
  /**
   * 获取地址列表
   * @param params 查询参数
   */
  getAddressList: (params: AddressListParams): Promise<AddressListResponse> =>
    request.get('/api/user/address/list', params),

  /**
   * 获取地址详情
   * @param addressId 地址ID
   */
  getAddressDetail: (addressId: string): Promise<Address> =>
    request.get(`/api/user/address/${addressId}`),

  /**
   * 创建地址
   * @param data 地址数据
   */
  createAddress: (data: AddressEditForm): Promise<boolean> =>
    request.post('/api/user/address', data),

  /**
   * 更新地址
   * @param data 地址数据
   */
  updateAddress: (data: AddressEditForm): Promise<boolean> =>
    request.put('/api/user/address', data),

  /**
   * 删除地址
   * @param addressId 地址ID
   */
  deleteAddress: (addressId: string): Promise<boolean> =>
    request.delete(`/api/user/address/${addressId}`),

  /**
   * 批量删除地址
   * @param addressIds 地址ID数组
   */
  batchDeleteAddress: (addressIds: number[]): Promise<boolean> =>
    request.delete('/api/user/address/batch', { data: addressIds }),

  /**
   * 设置默认地址
   * @param addressId 地址ID
   */
  setDefaultAddress: (addressId: string): Promise<boolean> =>
    request.put(`/api/user/address/default/${addressId}`),

  // 等级相关
  /**
   * 获取等级列表
   * @param params 查询参数
   */
  getLevelList: (params: LevelListParams): Promise<any> =>
    request.get('/api/user/level/list', params),

  /**
   * 获取等级详情
   * @param levelId 等级ID
   */
  getLevelDetail: (levelId: string): Promise<Level> => request.get(`/api/user/level/${levelId}`),

  /**
   * 创建等级
   * @param data 等级数据
   */
  createLevel: (data: LevelEditForm): Promise<boolean> => request.post('/api/user/level', data),

  /**
   * 更新等级
   * @param data 等级数据
   */
  updateLevel: (data: LevelEditForm): Promise<boolean> => request.put('/api/user/level', data),

  /**
   * 删除等级
   * @param levelId 等级ID
   */
  deleteLevel: (levelId: string): Promise<boolean> => request.delete(`/api/user/level/${levelId}`),

  /**
   * 批量删除等级
   * @param levelIds 等级ID数组
   */
  batchDeleteLevel: (levelIds: number[]): Promise<boolean> =>
    request.delete('/api/user/level/batch', { data: levelIds }),

  /**
   * 导出用户列表
   * @param params 查询参数
   */
  exportUserList: (params: UserListParams): Promise<Blob> =>
    request.get('/api/system/user/export', { params, responseType: 'blob' }),

  /**
   * 导出地址列表
   * @param params 查询参数
   */
  exportAddressList: (params: AddressListParams): Promise<Blob> =>
    request.get('/api/user/address/export', { params, responseType: 'blob' }),

  /**
   * 导出等级列表
   */
  exportLevelList: (): Promise<Blob> =>
    request.get('/api/user/level/export', { responseType: 'blob' }),
}
