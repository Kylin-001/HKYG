import request from '@/utils/request'
import { LoginParams, LoginResult, UserInfo, Role } from '@/types/api'

/**
 * 用户相关API
 */
export const userApi = {
  /**
   * 用户登录
   * @param data 登录参数
   */
  login: (data: LoginParams) => request.post<LoginResult>('/api/login', data),

  /**
   * 退出登录
   */
  logout: () => request.post('/api/logout'),

  /**
   * 获取用户信息
   */
  getUserInfo: () => request.get<UserInfo>('/api/user/info'),

  /**
   * 刷新Token
   */
  refreshToken: () => request.post<{ token: string }>('/api/auth/refresh'),

  /**
   * 获取用户列表
   * @param params 分页查询参数
   */
  getUserList: (params: any) => request.get('/api/system/user/list', params),

  /**
   * 创建用户
   * @param data 用户数据
   */
  createUser: (data: any) => request.post('/api/system/user', data),

  /**
   * 更新用户
   * @param data 用户数据
   */
  updateUser: (data: any) => request.put('/api/system/user', data),

  /**
   * 删除用户
   * @param userId 用户ID
   */
  deleteUser: (userId: number) => request.delete(`/api/system/user/${userId}`),

  /**
   * 修改用户状态
   * @param userId 用户ID
   * @param status 状态
   */
  changeStatus: (userId: number, status: number) =>
    request.put('/api/system/user/changeStatus', { userId, status }),

  /**
   * 修改密码
   * @param data 密码数据
   */
  updatePassword: (data: { oldPassword: string; newPassword: string; confirmPassword: string }) =>
    request.put('/api/user/profile/updatePwd', data),

  /**
   * 更新用户信息
   * @param data 用户信息
   */
  updateProfile: (data: Partial<UserInfo>) => request.put('/api/user/profile', data),

  /**
   * 上传头像
   * @param formData 头像文件
   */
  uploadAvatar: (formData: FormData) => request.upload('/api/user/profile/avatar', formData),

  /**
   * 获取用户角色列表
   * @param userId 用户ID
   */
  getUserRoles: (userId: number) => request.get<Role[]>(`/api/system/user/${userId}/roles`),

  /**
   * 分配用户角色
   * @param data 角色分配数据
   */
  assignRoles: (data: { userId: number; roleIds: number[] }) =>
    request.put('/api/system/user/authRole', data),
}
