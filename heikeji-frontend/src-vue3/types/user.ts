// src-vue3/types/user.ts
export interface UserInfo {
  id: number
  nickname: string
  studentId: string
  email: string
  phone: string
  avatar: string
  createdAt: Date
  lastLoginAt: Date
}

// 用户列表类型
export interface UserListItem extends UserInfo {
  username: string
  sex: number
  level: number
  totalSpent: number
  orderCount: number
  status: string
  remark?: string
}

// 用户统计类型
export interface UserStats {
  totalUserCount: number
  todayNewCount: number
  activeUserCount: number
  disabledUserCount: number
}

// 用户列表请求参数
export interface UserListParams {
  currentPage: number
  pageSize: number
  userId?: string
  userName?: string
  phone?: string
  status?: string
  registerTimeRange?: [Date, Date]
}

// 用户列表响应
export interface UserListResponse {
  data: {
    records: UserListItem[]
    total: number
    currentPage: number
    pageSize: number
  }
  code: number
  message: string
}

// 角色类型
export interface Role {
  id: number
  roleName: string
  description?: string
}

// 用户编辑表单类型
export interface EditForm {
  id: string
  username: string
  nickname: string
  password: string
  phone: string
  email: string
  sex: number
  level: number
  status: string
  remark: string
  loading?: boolean
}

// 角色分配表单类型
export interface RoleForm {
  userId: string
  username: string
  roleIds: number[]
}

// 地址类型
export interface Address {
  id: number
  userId: string
  userName: string
  consignee: string
  phone: string
  province: string
  city: string
  district: string
  detailAddress: string
  isDefault: string
  createTime?: string
  updateTime?: string
}

// 地址统计类型
export interface AddressStats {
  totalAddressCount: number
  todayNewCount: number
  defaultAddressCount: number
  activeUserCount: number
}

// 地址列表请求参数
export interface AddressListParams {
  currentPage: number
  pageSize: number
  userId?: string
  userName?: string
  consignee?: string
  phone?: string
  isDefault?: string
}

// 地址列表响应
export interface AddressListResponse {
  data: {
    records: Address[]
    total: number
    currentPage: number
    pageSize: number
  }
  code: number
  message: string
}

// 地址编辑表单类型
export interface AddressEditForm {
  id: string
  userId: string
  userName: string
  consignee: string
  phone: string
  province: string
  city: string
  district: string
  detailAddress: string
  isDefault: string
  loading?: boolean
}

// 等级类型
export interface Level {
  id: number
  levelName: string
  levelValue: number
  minPoints: number
  maxPoints: number
  discountRate: number
  privileges: string[]
  status: string
  createTime?: string
  updateTime?: string
  remark?: string
}

// 等级列表请求参数
export interface LevelListParams {
  currentPage: number
  pageSize: number
  levelId?: string
  levelName?: string
  status?: string
}

// 等级列表响应
export interface LevelListResponse {
  data: {
    records: Level[]
    total: number
    currentPage: number
    pageSize: number
  }
  code: number
  message: string
}

// 等级编辑表单类型
export interface LevelEditForm {
  id: string
  levelName: string
  levelValue: number
  minPoints: number
  maxPoints: number
  discountRate: number
  privileges: string[]
  privilegesText: string
  status: string
  remark: string
  loading?: boolean
}

export interface LoginForm {
  username: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  token: string
  user: UserInfo
  expiresIn: number
}
