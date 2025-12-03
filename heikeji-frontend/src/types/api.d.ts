// API相关类型定义
import { App } from './global'

// 登录请求参数
export interface LoginParams {
  username: string
  password: string
  code?: string
  uuid?: string
}

// 登录响应数据
export interface LoginResult {
  token: string
  refreshToken: string
  expireTime?: number
}

// 用户信息
export interface UserInfo extends App.UserInfo {
  token?: string
  dept?: {
    id: number
    name: string
    parentName?: string
    leader?: string
    createTime?: string
  }
  post?: {
    id: number
    postName: string
  }
  roleIds?: number[]
  postIds?: number[]
}

// 商品相关类型
export interface Product {
  id: number
  productName: string
  productCode: string
  categoryId: number
  categoryName: string
  price: number
  originalPrice: number
  stock: number
  sales: number
  weight?: number
  unit?: string
  status: number
  publishStatus: number
  description?: string
  detail?: string
  coverImage?: string
  images?: string[]
  attributes?: ProductAttribute[]
  skus?: ProductSku[]
  createTime: string
  updateTime?: string
  createBy?: string
}

export interface ProductAttribute {
  id?: number
  productId?: number
  attributeName: string
  attributeValue: string
  sort?: number
}

export interface ProductSku {
  id?: number
  productId?: number
  skuName: string
  price: number
  originalPrice: number
  stock: number
  sales: number
  properties: { [key: string]: string }
  images?: string[]
  status?: number
}

// 分类相关类型
export interface Category extends App.TreeNode {
  id: number
  categoryName: string
  parentId: number
  parentName?: string
  level: number
  sort: number
  icon?: string
  status: number
  createTime: string
  updateTime?: string
  children?: Category[]
}

// 角色相关类型
export interface Role {
  roleId: number
  roleName: string
  roleKey: string
  roleSort: number
  dataScope: string
  menuCheckStrictly?: boolean
  deptCheckStrictly?: boolean
  status: string
  remark?: string
  createTime: string
  menuIds?: number[]
  deptIds?: number[]
  flag?: boolean
  permissions?: string[]
}

// 菜单相关类型
export interface Menu extends App.TreeNode {
  menuId: number
  menuName: string
  parentId: number
  parentName?: string
  orderNum: number
  path: string
  component?: string
  query?: string
  isFrame: string
  isCache: string
  menuType: string
  visible: string
  status: string
  perms?: string
  icon: string
  createTime: string
  updateTime?: string
  children?: Menu[]
}

// 部门相关类型
export interface Dept extends App.TreeNode {
  deptId: number
  deptName: string
  parentId: number
  parentName?: string
  orderNum: number
  leader?: string
  phone?: string
  email?: string
  status: string
  createTime: string
  updateTime?: string
  children?: Dept[]
}

// 分页查询参数
export interface PageQuery extends App.PageParams {
  keyword?: string
  startTime?: string
  endTime?: string
}

// 商品分页查询参数
export interface ProductQuery extends PageQuery {
  categoryId?: number
  status?: number
  publishStatus?: number
}

// 订单相关类型
export interface Order {
  orderId: string
  orderNo: string
  userId: number
  userName: string
  totalAmount: number
  actualAmount: number
  paymentMethod: string
  orderStatus: number
  paymentStatus: number
  deliveryStatus: number
  shippingAddress: string
  receiverName: string
  receiverPhone: string
  remark?: string
  createTime: string
  paymentTime?: string
  deliveryTime?: string
  completeTime?: string
  orderItems?: OrderItem[]
}

export interface OrderItem {
  id?: number
  orderId?: string
  productId: number
  productName: string
  productCode: string
  productImage?: string
  skuId?: number
  skuName?: string
  quantity: number
  price: number
  totalPrice: number
}

// 日志相关类型
export interface OperLog {
  operId: number
  title: string
  businessType: number
  method: string
  requestMethod: string
  operatorType: number
  operName: string
  deptName: string
  operUrl: string
  operIp: string
  operLocation: string
  operParam: string
  jsonResult: string
  status: number
  errorMsg?: string
  operTime: string
  costTime?: number
}

// 通知相关类型
export interface Notice {
  noticeId: number
  noticeTitle: string
  noticeType: string
  noticeContent: string
  status: string
  createBy: string
  createTime: string
  updateBy?: string
  updateTime?: string
  userIds?: string[]
}
