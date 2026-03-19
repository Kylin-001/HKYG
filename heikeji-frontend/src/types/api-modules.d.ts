// API模块类型声明

import { ApiResponse, LoginParams, LoginResult } from './api'

// 登录API类型
declare module '@/api/login' {
  export interface LoginApi {
    login: (params: LoginParams) => Promise<ApiResponse<LoginResult>>
    logout: () => Promise<ApiResponse<void>>
    getCaptcha: () => Promise<ApiResponse<{ uuid: string; img: string }>>
    refreshToken: (refreshToken: string) => Promise<ApiResponse<{ token: string }>>
  }

  const loginApi: LoginApi
  export default loginApi
  export const login: (params: LoginParams) => Promise<ApiResponse<LoginResult>>
  export const logout: () => Promise<ApiResponse<void>>
  export const getCaptcha: () => Promise<ApiResponse<{ uuid: string; img: string }>>
  export const refreshToken: (refreshToken: string) => Promise<ApiResponse<{ token: string }>>
}

// 商品API类型
declare module '@/api/product' {
  export interface ProductApi {
    getProductById: (id: number | string) => Promise<ApiResponse<any>>
    getProductList: (params?: any) => Promise<ApiResponse<any>>
    getProductCategories: () => Promise<ApiResponse<any>>
    getProductBrands: () => Promise<ApiResponse<any>>
    searchProducts: (keyword: string, params?: any) => Promise<ApiResponse<any>>
    getRecommendedProducts: (params?: any) => Promise<ApiResponse<any>>
  }

  const productApi: ProductApi
  export default productApi
  export const getProductById: (id: number | string) => Promise<ApiResponse<any>>
  export const getProductList: (params?: any) => Promise<ApiResponse<any>>
  export const getProductCategories: () => Promise<ApiResponse<any>>
  export const getProductBrands: () => Promise<ApiResponse<any>>
  export const searchProducts: (keyword: string, params?: any) => Promise<ApiResponse<any>>
  export const getRecommendedProducts: (params?: any) => Promise<ApiResponse<any>>
}

// 用户API类型
declare module '@/api/user' {
  export interface UserApi {
    getUserInfo: () => Promise<ApiResponse<any>>
    updateUserInfo: (data: any) => Promise<ApiResponse<any>>
    changePassword: (data: {
      oldPassword: string
      newPassword: string
    }) => Promise<ApiResponse<void>>
    getUserAddressList: () => Promise<ApiResponse<any>>
    addUserAddress: (data: any) => Promise<ApiResponse<any>>
    updateUserAddress: (id: number, data: any) => Promise<ApiResponse<any>>
    deleteUserAddress: (id: number) => Promise<ApiResponse<void>>
  }

  const userApi: UserApi
  export default userApi
  export const getUserInfo: () => Promise<ApiResponse<any>>
  export const updateUserInfo: (data: any) => Promise<ApiResponse<any>>
  export const changePassword: (data: {
    oldPassword: string
    newPassword: string
  }) => Promise<ApiResponse<void>>
  export const getUserAddressList: () => Promise<ApiResponse<any>>
  export const addUserAddress: (data: any) => Promise<ApiResponse<any>>
  export const updateUserAddress: (id: number, data: any) => Promise<ApiResponse<any>>
  export const deleteUserAddress: (id: number) => Promise<ApiResponse<void>>
}

// 订单API类型
declare module '@/api/order' {
  export interface OrderApi {
    createOrder: (data: any) => Promise<ApiResponse<any>>
    getOrderList: (params?: any) => Promise<ApiResponse<any>>
    getOrderDetail: (orderId: string) => Promise<ApiResponse<any>>
    cancelOrder: (orderId: string) => Promise<ApiResponse<void>>
    payOrder: (orderId: string, paymentMethod: string) => Promise<ApiResponse<any>>
    confirmReceipt: (orderId: string) => Promise<ApiResponse<void>>
  }

  const orderApi: OrderApi
  export default orderApi
  export const createOrder: (data: any) => Promise<ApiResponse<any>>
  export const getOrderList: (params?: any) => Promise<ApiResponse<any>>
  export const getOrderDetail: (orderId: string) => Promise<ApiResponse<any>>
  export const cancelOrder: (orderId: string) => Promise<ApiResponse<void>>
  export const payOrder: (orderId: string, paymentMethod: string) => Promise<ApiResponse<any>>
  export const confirmReceipt: (orderId: string) => Promise<ApiResponse<void>>
}

// 购物车API类型
declare module '@/api/cart' {
  export interface CartApi {
    getCartList: () => Promise<ApiResponse<any>>
    addToCart: (data: {
      productId: number
      quantity: number
      specification?: string
    }) => Promise<ApiResponse<any>>
    updateCartItem: (id: number, data: { quantity: number }) => Promise<ApiResponse<any>>
    deleteCartItem: (id: number) => Promise<ApiResponse<void>>
    clearCart: () => Promise<ApiResponse<void>>
  }

  const cartApi: CartApi
  export default cartApi
  export const getCartList: () => Promise<ApiResponse<any>>
  export const addToCart: (data: {
    productId: number
    quantity: number
    specification?: string
  }) => Promise<ApiResponse<any>>
  export const updateCartItem: (id: number, data: { quantity: number }) => Promise<ApiResponse<any>>
  export const deleteCartItem: (id: number) => Promise<ApiResponse<void>>
  export const clearCart: () => Promise<ApiResponse<void>>
}
