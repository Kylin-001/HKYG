const getters = {
  // 应用相关getters
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  permission_routes: state => state.permission.routes,

  // 用户认证相关getters
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,

  // 用户管理相关getters
  userList: state => state.user.userList,
  userTotal: state => state.user.userTotal,
  userDetail: state => state.user.userDetail,
  userLevelList: state => state.user.userLevelList,
  userAddressList: state => state.user.userAddressList,
  userStatistics: state => state.user.userStatistics,

  // 产品相关getters
  productList: state => state.product.list,
  productTotal: state => state.product.total,
  productDetail: state => state.product.detail,

  // 订单相关getters
  orderList: state => state.order.list,
  orderTotal: state => state.order.total,
  orderDetail: state => state.order.detail,
  orderStatusOptions: state => state.order.statusOptions,

  // 营销相关getters
  couponList: state => state.marketing.couponList,
  couponTotal: state => state.marketing.couponTotal,
  couponDetail: state => state.marketing.couponDetail,
  bannerList: state => state.marketing.bannerList,
  bannerDetail: state => state.marketing.bannerDetail,

  // 系统相关getters
  adminList: state => state.system.adminList,
  adminTotal: state => state.system.adminTotal,
  adminDetail: state => state.system.adminDetail,
  roleList: state => state.system.roleList,
  roleDetail: state => state.system.roleDetail,
  menuList: state => state.system.menuList,
  operationLogList: state => state.system.operationLogList,
  operationLogTotal: state => state.system.operationLogTotal,
  systemConfig: state => state.system.systemConfig,

  // 支付相关getters
  paymentMethods: state => state.payment.paymentMethods,
  selectedPaymentMethod: state => state.payment.selectedMethod,
  userBalance: state => state.payment.userBalance,
  paymentStatus: state => state.payment.paymentStatus,
  paymentHistory: state => state.payment.paymentHistory,
}
export default getters
